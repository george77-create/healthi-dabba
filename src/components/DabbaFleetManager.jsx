import React, { useState } from 'react';
import QRCode from 'qrcode';
import { 
  Package, 
  QrCode, 
  Plus, 
  Trash2, 
  AlertTriangle, 
  ShieldAlert, 
  Printer, 
  Search, 
  CheckCircle2, 
  ArrowRight, 
  Sparkles, 
  FileText, 
  RefreshCw,
  Building2,
  Bike,
  User,
  History,
  Info,
  X,
  Layers,
  SlidersHorizontal
} from 'lucide-react';
import DabbaStickerModal from './DabbaStickerModal';

export default function DabbaFleetManager({
  dabbas = [],
  damagedLedger = [],
  onAddDabba,
  onBulkAddDabbas,
  onDecommissionDabba,
  onDeleteDabba,
  showToast = (msg) => console.log(msg)
}) {
  const [subTab, setSubTab] = useState('active'); // 'active' | 'damaged'
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // Modals
  const [isStickerModalOpen, setIsStickerModalOpen] = useState(false);
  const [isAddUnitsModalOpen, setIsAddUnitsModalOpen] = useState(false);
  const [decommissionModal, setDecommissionModal] = useState({
    isOpen: false,
    dabba: null
  });

  // Flexible Add Units State
  const [inputMode, setInputMode] = useState('count'); // 'count' (add X units) | 'target' (set total fleet to X)
  const [unitsToAdd, setUnitsToAdd] = useState(150); // user can type ANY number
  const [targetFleetGoal, setTargetFleetGoal] = useState(200); // e.g. reach 200 or 300
  const [unitsPrefix, setUnitsPrefix] = useState('DB-');
  const [unitsStatus, setUnitsStatus] = useState('in_godown');
  const [unitsHolder, setUnitsHolder] = useState('Godown Sanitized Rack');

  // Decommission Form State
  const [damageReasonCategory, setDamageReasonCategory] = useState('Broken Lid / Clip Damaged');
  const [damageNotes, setDamageNotes] = useState('');
  const [damageReportedBy, setDamageReportedBy] = useState('Operations Admin');
  const [autoReplace, setAutoReplace] = useState(true);

  // Compute next available code that isn't in active or damaged
  const getNextAvailableCodeNum = () => {
    const allExistingCodes = new Set([
      ...dabbas.map(d => d.code),
      ...damagedLedger.map(d => d.retiredCode)
    ]);

    let maxNum = 100;
    allExistingCodes.forEach(c => {
      const num = parseInt(c.replace(/\D/g, '') || '0', 10);
      if (num > maxNum) maxNum = num;
    });

    let next = maxNum + 1;
    while (allExistingCodes.has(`${unitsPrefix}${next}`)) {
      next++;
    }
    return next;
  };

  const totalActive = dabbas.length;
  const inGodown = dabbas.filter(d => d.status === 'in_godown').length;
  const withDelivery = dabbas.filter(d => d.status === 'with_delivery').length;
  const withCustomer = dabbas.filter(d => d.status === 'with_customer').length;
  const missingAlert = dabbas.filter(d => d.status === 'missing_alert').length;
  const totalDamaged = damagedLedger.length;

  // Calculate actual quantity to add
  const effectiveCount = inputMode === 'count' 
    ? Math.max(1, parseInt(unitsToAdd || '1', 10))
    : Math.max(1, parseInt(targetFleetGoal || '1', 10) - totalActive);

  const startSerialNum = getNextAvailableCodeNum();
  const endSerialNum = startSerialNum + effectiveCount - 1;

  // Submit flexible add units
  const handleSaveUnits = (e) => {
    e.preventDefault();
    if (effectiveCount <= 0) return;

    if (effectiveCount === 1) {
      const singleCode = `${unitsPrefix}${startSerialNum}`;
      onAddDabba({
        code: singleCode,
        status: unitsStatus,
        holder: unitsHolder,
        lastUpdate: new Date().toISOString().slice(0, 16).replace('T', ' ')
      });
      showToast(`Box ${singleCode} successfully registered to ${unitsHolder}.`);
    } else {
      onBulkAddDabbas(effectiveCount, unitsPrefix);
      showToast(`Successfully added ${effectiveCount} units (${unitsPrefix}${startSerialNum} to ${unitsPrefix}${endSerialNum})! Total Fleet: ${totalActive + effectiveCount}`);
    }

    setIsAddUnitsModalOpen(false);
  };

  // Open decommission modal
  const handleOpenDecommission = (dabba) => {
    setDecommissionModal({
      isOpen: true,
      dabba
    });
    setDamageReasonCategory('Broken Lid / Clip Damaged');
    setDamageNotes('');
    setDamageReportedBy('Operations Admin');
    setAutoReplace(true);
  };

  // Submit decommission & damage report
  const handleConfirmDecommission = () => {
    const d = decommissionModal.dabba;
    if (!d) return;

    if (!damageNotes.trim()) {
      showToast("Please provide details of what happened to the box.");
      return;
    }

    onDecommissionDabba({
      code: d.code,
      reasonCategory: damageReasonCategory,
      notes: damageNotes.trim(),
      reportedBy: damageReportedBy,
      autoReplace
    });

    setDecommissionModal({ isOpen: false, dabba: null });
    showToast(`Box ${d.code} decommissioned. Unique QR permanently blacklisted.`);
  };

  // Filter Active Dabbas
  const filteredActiveDabbas = dabbas.filter(d => {
    const matchesSearch = d.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          d.holder.toLowerCase().includes(searchQuery.toLowerCase());
    if (!matchesSearch) return false;
    if (statusFilter === 'all') return true;
    return d.status === statusFilter;
  });

  // Filter Damaged Ledger
  const filteredDamagedDabbas = damagedLedger.filter(d => {
    return d.retiredCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
           d.reasonCategory.toLowerCase().includes(searchQuery.toLowerCase()) ||
           d.notes.toLowerCase().includes(searchQuery.toLowerCase()) ||
           (d.replacementCode && d.replacementCode.toLowerCase().includes(searchQuery.toLowerCase()));
  });

  return (
    <div className="space-y-6">
      
      {/* Top Fleet Header Banner */}
      <div className="bg-white rounded-3xl p-6 border border-edge shadow-apple-card flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-forest-700 text-cream-50 flex items-center justify-center shadow-apple-sm">
              <Package className="w-5 h-5 text-cream-100" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold text-charcoal tracking-tight">Dabba Inventory & Fleet OS</h2>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-forest-50 text-forest-700 border border-forest-100">
                  {totalActive} Active Units
                </span>
              </div>
              <p className="text-xs text-charcoal-muted">
                Add whatever units you have (200, 300, etc.), download QR stickers & audit damaged boxes
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons Toolbar */}
        <div className="flex flex-wrap items-center gap-2.5">
          
          <button
            onClick={() => setIsStickerModalOpen(true)}
            className="px-4 py-2.5 rounded-2xl bg-forest-50 hover:bg-forest-100 text-forest-800 font-bold text-xs border border-forest-200/80 flex items-center gap-2 apple-press shadow-xs transition-all"
            title="Download or Print QR Stickers for physical tiffins"
          >
            <Printer className="w-4 h-4 text-forest-700" />
            <span>Print QR Stickers</span>
          </button>

          {/* Unified Add Units Button */}
          <button
            onClick={() => {
              setUnitsToAdd(150);
              setInputMode('count');
              setIsAddUnitsModalOpen(true);
            }}
            className="px-5 py-2.5 rounded-2xl bg-forest-700 hover:bg-forest-800 text-white font-bold text-xs flex items-center gap-2 apple-press shadow-apple-sm transition-all"
          >
            <Plus className="w-4 h-4 text-cream-100" />
            <span>+ Add Units (Any Quantity)</span>
          </button>

        </div>
      </div>

      {/* KPI Cards Row */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3.5 sm:gap-4">
        
        <div className="bg-white rounded-3xl p-5 border border-edge shadow-apple-card flex flex-col justify-between">
          <span className="text-[11px] font-bold text-charcoal-muted uppercase tracking-wider block">Total Active Units</span>
          <span className="text-3xl font-extrabold text-charcoal mt-2 block tracking-tight">{totalActive}</span>
          <span className="text-[11px] text-forest-700 font-semibold mt-1 block">Full fleet inventory</span>
        </div>

        <div className="bg-white rounded-3xl p-5 border border-edge shadow-apple-card flex flex-col justify-between">
          <span className="text-[11px] font-bold text-charcoal-muted uppercase tracking-wider block">In Godown (Sanitized)</span>
          <span className="text-3xl font-extrabold text-forest-700 mt-2 block tracking-tight">{inGodown}</span>
          <span className="text-[11px] text-forest-700 font-semibold mt-1 block">Ready for packing</span>
        </div>

        <div className="bg-white rounded-3xl p-5 border border-edge shadow-apple-card flex flex-col justify-between">
          <span className="text-[11px] font-bold text-charcoal-muted uppercase tracking-wider block">With Delivery Boys</span>
          <span className="text-3xl font-extrabold text-warmamber-600 mt-2 block tracking-tight">{withDelivery}</span>
          <span className="text-[11px] text-charcoal-muted mt-1 block">En-route / Transit</span>
        </div>

        <div className="bg-white rounded-3xl p-5 border border-edge shadow-apple-card flex flex-col justify-between">
          <span className="text-[11px] font-bold text-charcoal-muted uppercase tracking-wider block">With Customers</span>
          <span className="text-3xl font-extrabold text-terracotta-500 mt-2 block tracking-tight">{withCustomer}</span>
          <span className="text-[11px] text-charcoal-muted mt-1 block">Pickup due tomorrow</span>
        </div>

        <div className="bg-white rounded-3xl p-5 border border-edge shadow-apple-card flex flex-col justify-between col-span-2 sm:col-span-1">
          <span className="text-[11px] font-bold text-rose-700 uppercase tracking-wider block flex items-center gap-1">
            <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
            <span>Damaged / Retired</span>
          </span>
          <span className="text-3xl font-extrabold text-rose-600 mt-2 block tracking-tight">{totalDamaged}</span>
          <span className="text-[11px] text-rose-600 font-bold mt-1 block">Blacklisted (No Reuse)</span>
        </div>

      </div>

      {/* Sub-Tabs: Active Fleet vs Damaged Ledger */}
      <div className="flex items-center justify-between flex-wrap gap-3 border-b border-edge/80 pb-3">
        
        <div className="flex items-center gap-2 p-1.5 bg-cream-100 rounded-2xl border border-edge">
          <button
            onClick={() => setSubTab('active')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              subTab === 'active'
                ? 'bg-white text-forest-800 shadow-apple-sm'
                : 'text-charcoal-muted hover:text-charcoal'
            }`}
          >
            <Package className="w-4 h-4" />
            <span>Active Circulation Fleet ({totalActive})</span>
          </button>

          <button
            onClick={() => setSubTab('damaged')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              subTab === 'damaged'
                ? 'bg-rose-50 text-rose-800 shadow-apple-sm border border-rose-200/60'
                : 'text-charcoal-muted hover:text-charcoal'
            }`}
          >
            <ShieldAlert className="w-4 h-4 text-rose-600" />
            <span>Damaged & Decommissioned Ledger ({totalDamaged})</span>
          </button>
        </div>

        {/* Search & Filter */}
        <div className="flex items-center gap-2 flex-1 max-w-md">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-charcoal-muted absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder={subTab === 'active' ? "Search box code (DB-101) or holder..." : "Search damaged box or reason..."}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-edge bg-white focus:outline-none focus:border-forest-600 font-semibold"
            />
          </div>

          {subTab === 'active' && (
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 text-xs rounded-xl border border-edge bg-white text-charcoal font-semibold focus:outline-none"
            >
              <option value="all">All Statuses</option>
              <option value="in_godown">In Godown</option>
              <option value="with_delivery">With Delivery</option>
              <option value="with_customer">With Customer</option>
            </select>
          )}
        </div>

      </div>

      {/* ========================================================================= */}
      {/* 1. ACTIVE CIRCULATION FLEET TABLE */}
      {/* ========================================================================= */}
      {subTab === 'active' && (
        <div className="bg-white rounded-3xl border border-edge shadow-apple-card overflow-hidden">
          
          <div className="p-5 border-b border-edge flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-charcoal">Active Dabba Custody Ledger</h3>
              <p className="text-xs text-charcoal-muted">Individual physical container history, custody & integrity verification</p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold px-3 py-1 rounded-full bg-forest-50 text-forest-700 border border-forest-100">
                Recovery Rate: 98.4%
              </span>
            </div>
          </div>

          {/* Mobile Touch Cards for Damaged Ledger (Visible on Mobile screens) */}
          <div className="md:hidden divide-y divide-edge">
            {filteredDamagedDabbas.length === 0 ? (
              <div className="p-8 text-center text-charcoal-muted font-semibold text-xs">
                No damaged boxes recorded yet. Clean fleet integrity!
              </div>
            ) : (
              filteredDamagedDabbas.map((entry) => (
                <div key={entry.id} className="p-3.5 space-y-2 bg-rose-50/20 hover:bg-rose-50/40 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-black text-sm text-rose-800 line-through">
                        {entry.retiredCode}
                      </span>
                      <span className="px-1.5 py-0.5 text-[9px] font-black uppercase rounded bg-rose-100 text-rose-700">
                        SCRAPPED
                      </span>
                    </div>

                    <span className="px-2 py-0.5 rounded-full text-[9px] font-black uppercase bg-charcoal text-white tracking-wider">
                      NEVER REUSE
                    </span>
                  </div>

                  {/* Reason & Date */}
                  <div className="flex items-center justify-between text-xs">
                    <span className="px-2 py-0.5 rounded-lg text-[10px] font-bold bg-rose-50 text-rose-700 border border-rose-200">
                      {entry.reasonCategory}
                    </span>
                    <span className="text-[10px] text-charcoal-muted">
                      {entry.decommissionDate} • {entry.decommissionTime}
                    </span>
                  </div>

                  {/* Incident Notes */}
                  <p className="text-xs text-charcoal-muted bg-white/80 p-2 rounded-xl border border-edge/60 leading-relaxed">
                    "{entry.notes}"
                  </p>

                  {/* Replacement Box & Reporter */}
                  <div className="flex items-center justify-between text-[11px] pt-0.5">
                    <span className="text-charcoal-muted">
                      By: <strong className="text-charcoal">{entry.reportedBy}</strong>
                    </span>
                    {entry.replacementCode ? (
                      <span className="text-forest-800 font-bold">
                        Replaced with: <strong className="font-mono">{entry.replacementCode}</strong>
                      </span>
                    ) : (
                      <span className="text-charcoal-muted">No replacement</span>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Desktop Table View (Hidden on Mobile screens) */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-cream-100/80 border-b border-edge text-charcoal-muted">
                <tr>
                  <th className="p-4 font-bold">Box Barcode/QR</th>
                  <th className="p-4 font-bold">Circulation Status</th>
                  <th className="p-4 font-bold">Current Custody Holder</th>
                  <th className="p-4 font-bold">Last Verified Timestamp</th>
                  <th className="p-4 font-bold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-edge">
                {filteredActiveDabbas.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="p-8 text-center text-charcoal-muted font-semibold">
                      No active dabbas match the search query.
                    </td>
                  </tr>
                ) : (
                  filteredActiveDabbas.map((d) => (
                    <tr key={d.code} className="hover:bg-cream-50/70 transition-colors">
                      <td className="p-4 font-bold text-charcoal">
                        <div className="flex items-center gap-2.5">
                          <button
                            onClick={() => setIsStickerModalOpen(true)}
                            className="w-7 h-7 rounded-lg bg-forest-50 border border-forest-100 text-forest-700 flex items-center justify-center hover:bg-forest-100 transition-colors"
                            title="View/Print QR sticker"
                          >
                            <QrCode className="w-4 h-4" />
                          </button>
                          <span className="font-mono font-black text-sm tracking-wide text-forest-900">
                            {d.code}
                          </span>
                        </div>
                      </td>

                      <td className="p-4">
                        <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                          d.status === 'in_godown'
                            ? 'bg-forest-50 text-forest-700 border border-forest-100'
                            : d.status === 'with_customer'
                            ? 'bg-cream-200 text-charcoal border border-edge'
                            : d.status === 'with_delivery'
                            ? 'bg-warmamber-50 text-warmamber-700 border border-warmamber-200'
                            : 'bg-red-50 text-red-600 border border-red-100'
                        }`}>
                          {d.status.replace('_', ' ').toUpperCase()}
                        </span>
                      </td>

                      <td className="p-4 font-semibold text-charcoal">
                        <div className="flex items-center gap-1.5">
                          {d.status === 'in_godown' && <Building2 className="w-3.5 h-3.5 text-forest-600" />}
                          {d.status === 'with_delivery' && <Bike className="w-3.5 h-3.5 text-warmamber-600" />}
                          {d.status === 'with_customer' && <User className="w-3.5 h-3.5 text-charcoal-muted" />}
                          <span>{d.holder}</span>
                        </div>
                      </td>

                      <td className="p-4 text-charcoal-muted font-medium">
                        {d.lastUpdate || "2026-11-04 06:00"}
                      </td>

                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          
                          <button
                            onClick={() => {
                              showToast(`Box ${d.code} integrity verified. Location: ${d.holder}`);
                            }}
                            className="px-2.5 py-1.5 text-xs font-bold rounded-xl bg-cream-100 border border-edge text-charcoal hover:bg-forest-50 hover:text-forest-700 apple-press"
                            title="Verify Custody"
                          >
                            Verify
                          </button>

                          <button
                            onClick={() => handleOpenDecommission(d)}
                            className="px-2.5 py-1.5 text-xs font-bold rounded-xl bg-rose-50 border border-rose-200 text-rose-700 hover:bg-rose-100 apple-press flex items-center gap-1"
                            title="Report damage and decommission this box with replacement"
                          >
                            <AlertTriangle className="w-3 h-3 text-rose-600" />
                            <span>Report Damaged</span>
                          </button>

                          <button
                            onClick={() => {
                              if (confirm(`Remove box ${d.code} from active inventory? (If damaged, use "Report Damaged" to log complete history)`)) {
                                onDeleteDabba(d.code);
                                showToast(`Box ${d.code} removed.`);
                              }
                            }}
                            className="w-7 h-7 rounded-xl bg-cream-100 hover:bg-rose-50 text-charcoal-subtle hover:text-rose-600 flex items-center justify-center border border-edge apple-press"
                            title="Delete Box"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>

                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

        </div>
      )}

      {/* ========================================================================= */}
      {/* 2. DAMAGED & DECOMMISSIONED LEDGER TABLE (NEVER REUSE QR) */}
      {/* ========================================================================= */}
      {subTab === 'damaged' && (
        <div className="bg-white rounded-3xl border border-edge shadow-apple-card overflow-hidden">
          
          <div className="p-5 border-b border-edge flex items-center justify-between bg-rose-50/50">
            <div>
              <div className="flex items-center gap-2">
                <ShieldAlert className="w-5 h-5 text-rose-600" />
                <h3 className="text-base font-bold text-charcoal">Permanently Scrapped & Damaged Dabba Ledger</h3>
              </div>
              <p className="text-xs text-charcoal-muted mt-0.5">
                Every damaged tiffin is permanently audited here. Its unique QR number is blacklisted and will <strong>never</strong> be re-used.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-bold px-3 py-1 rounded-full bg-rose-100 text-rose-800 border border-rose-200">
                Blacklisted QRs: {totalDamaged}
              </span>
            </div>
          </div>

          {/* Mobile Touch Cards for Damaged Ledger (Visible on Mobile screens) */}
          <div className="md:hidden divide-y divide-edge">
            {filteredDamagedDabbas.length === 0 ? (
              <div className="p-8 text-center text-charcoal-muted font-semibold text-xs">
                No damaged boxes recorded yet. Clean fleet integrity!
              </div>
            ) : (
              filteredDamagedDabbas.map((entry) => (
                <div key={entry.id} className="p-3.5 space-y-2 bg-rose-50/20 hover:bg-rose-50/40 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-black text-sm text-rose-800 line-through">
                        {entry.retiredCode}
                      </span>
                      <span className="px-1.5 py-0.5 text-[9px] font-black uppercase rounded bg-rose-100 text-rose-700">
                        SCRAPPED
                      </span>
                    </div>

                    <span className="px-2 py-0.5 rounded-full text-[9px] font-black uppercase bg-charcoal text-white tracking-wider">
                      NEVER REUSE
                    </span>
                  </div>

                  {/* Reason & Date */}
                  <div className="flex items-center justify-between text-xs">
                    <span className="px-2 py-0.5 rounded-lg text-[10px] font-bold bg-rose-50 text-rose-700 border border-rose-200">
                      {entry.reasonCategory}
                    </span>
                    <span className="text-[10px] text-charcoal-muted">
                      {entry.decommissionDate} • {entry.decommissionTime}
                    </span>
                  </div>

                  {/* Incident Notes */}
                  <p className="text-xs text-charcoal-muted bg-white/80 p-2 rounded-xl border border-edge/60 leading-relaxed">
                    "{entry.notes}"
                  </p>

                  {/* Replacement Box & Reporter */}
                  <div className="flex items-center justify-between text-[11px] pt-0.5">
                    <span className="text-charcoal-muted">
                      By: <strong className="text-charcoal">{entry.reportedBy}</strong>
                    </span>
                    {entry.replacementCode ? (
                      <span className="text-forest-800 font-bold">
                        Replaced with: <strong className="font-mono">{entry.replacementCode}</strong>
                      </span>
                    ) : (
                      <span className="text-charcoal-muted">No replacement</span>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Desktop Table View (Hidden on Mobile screens) */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-cream-100/80 border-b border-edge text-charcoal-muted">
                <tr>
                  <th className="p-4 font-bold">Scrapped Box ID</th>
                  <th className="p-4 font-bold">Incident Date & Time</th>
                  <th className="p-4 font-bold">Damage Reason Category</th>
                  <th className="p-4 font-bold">Full Damage Notes / Cause</th>
                  <th className="p-4 font-bold">Reported By</th>
                  <th className="p-4 font-bold">Replacement Box Issued</th>
                  <th className="p-4 font-bold text-right">QR Security Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-edge">
                {filteredDamagedDabbas.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="p-8 text-center text-charcoal-muted font-semibold">
                      No damaged boxes recorded yet. Clean fleet integrity!
                    </td>
                  </tr>
                ) : (
                  filteredDamagedDabbas.map((entry) => (
                    <tr key={entry.id} className="hover:bg-rose-50/30 transition-colors">
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-black text-sm text-rose-800 line-through">
                            {entry.retiredCode}
                          </span>
                          <span className="px-1.5 py-0.5 text-[9px] font-black uppercase rounded bg-rose-100 text-rose-700">
                            SCRAPPED
                          </span>
                        </div>
                      </td>

                      <td className="p-4 text-charcoal font-semibold">
                        <div>{entry.decommissionDate}</div>
                        <div className="text-[10px] text-charcoal-muted">{entry.decommissionTime}</div>
                      </td>

                      <td className="p-4">
                        <span className="px-2.5 py-1 rounded-xl text-[11px] font-bold bg-rose-50 text-rose-700 border border-rose-200">
                          {entry.reasonCategory}
                        </span>
                      </td>

                      <td className="p-4 text-charcoal font-medium max-w-xs">
                        <p className="line-clamp-2 text-xs text-charcoal-muted">
                          {entry.notes}
                        </p>
                      </td>

                      <td className="p-4 text-charcoal font-semibold">
                        {entry.reportedBy}
                      </td>

                      <td className="p-4">
                        {entry.replacementCode ? (
                          <div className="flex items-center gap-1.5">
                            <span className="text-[10px] text-charcoal-muted">Replaced by:</span>
                            <span className="px-2 py-0.5 rounded-lg text-xs font-mono font-bold bg-forest-50 text-forest-700 border border-forest-200">
                              {entry.replacementCode}
                            </span>
                          </div>
                        ) : (
                          <span className="text-charcoal-muted text-[11px]">None (Fleet downsizing)</span>
                        )}
                      </td>

                      <td className="p-4 text-right">
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-black uppercase bg-charcoal text-white tracking-wider">
                          NEVER REUSE
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

        </div>
      )}

      {/* ========================================================================= */}
      {/* UNIFIED MODAL: ADD WHATEVER UNITS YOU WANT */}
      {/* ========================================================================= */}
      {isAddUnitsModalOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-t-3xl sm:rounded-3xl w-full max-w-lg p-5 sm:p-7 shadow-apple-modal border border-edge space-y-4 max-h-[92vh] overflow-y-auto">
            
            {/* Mobile Sheet Handle */}
            <div className="w-12 h-1 bg-charcoal/20 rounded-full mx-auto -mt-1 mb-2 sm:hidden"></div>

            <div className="flex items-center justify-between border-b border-edge pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-2xl bg-forest-700 text-white flex items-center justify-center shadow-sm">
                  <Package className="w-5 h-5 text-cream-100" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-charcoal">Add Dabba Units to Inventory</h3>
                  <p className="text-[11px] text-charcoal-muted">Enter whatever number of units you have right now</p>
                </div>
              </div>
              <button 
                onClick={() => setIsAddUnitsModalOpen(false)}
                className="w-8 h-8 rounded-lg bg-cream-100 hover:bg-cream-200 text-charcoal flex items-center justify-center"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Mode Switcher Tabs */}
            <div className="grid grid-cols-2 gap-1.5 p-1.5 bg-cream-100 rounded-2xl border border-edge text-xs">
              <button
                type="button"
                onClick={() => setInputMode('count')}
                className={`py-2 px-3 rounded-xl font-bold transition-all ${
                  inputMode === 'count'
                    ? 'bg-white text-forest-800 shadow-apple-sm'
                    : 'text-charcoal-muted hover:text-charcoal'
                }`}
              >
                1. Add Specific Units (e.g. +10, +50, +150)
              </button>

              <button
                type="button"
                onClick={() => setInputMode('target')}
                className={`py-2 px-3 rounded-xl font-bold transition-all ${
                  inputMode === 'target'
                    ? 'bg-white text-forest-800 shadow-apple-sm'
                    : 'text-charcoal-muted hover:text-charcoal'
                }`}
              >
                2. Set Target Total Fleet (e.g. 200, 300)
              </button>
            </div>

            <form onSubmit={handleSaveUnits} className="space-y-4">
              
              {inputMode === 'count' ? (
                <div>
                  <label className="text-xs font-bold text-charcoal block mb-1">
                    How many units do you want to add? (Type any number):
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      min="1"
                      max="2000"
                      required
                      value={unitsToAdd}
                      onChange={(e) => setUnitsToAdd(e.target.value)}
                      placeholder="e.g. 1, 25, 75, 150, 200..."
                      className="w-full pl-4 pr-16 py-3 text-base font-mono font-black rounded-2xl border border-edge bg-cream-50 focus:bg-white focus:border-forest-600 text-charcoal shadow-inner"
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-charcoal-muted">
                      Units
                    </span>
                  </div>

                  {/* Fast Tap Shortcut Chips */}
                  <div className="flex items-center gap-1.5 mt-2 flex-wrap">
                    <span className="text-[10px] font-bold text-charcoal-muted">Quick fill:</span>
                    {[1, 10, 50, 100, 150, 200, 250].map((qty) => (
                      <button
                        key={qty}
                        type="button"
                        onClick={() => setUnitsToAdd(qty)}
                        className={`px-2 py-0.5 rounded-lg text-[10px] font-bold border transition-all ${
                          parseInt(unitsToAdd, 10) === qty
                            ? 'bg-forest-100 text-forest-800 border-forest-300'
                            : 'bg-white text-charcoal border-edge hover:bg-cream-100'
                        }`}
                      >
                        +{qty}
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <div>
                  <label className="text-xs font-bold text-charcoal block mb-1">
                    What should your Total Fleet Size be? (Current: {totalActive}):
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      min={totalActive + 1}
                      max="3000"
                      required
                      value={targetFleetGoal}
                      onChange={(e) => setTargetFleetGoal(e.target.value)}
                      placeholder="e.g. 200 or 300"
                      className="w-full pl-4 pr-16 py-3 text-base font-mono font-black rounded-2xl border border-edge bg-cream-50 focus:bg-white focus:border-forest-600 text-charcoal shadow-inner"
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-charcoal-muted">
                      Total Boxes
                    </span>
                  </div>

                  {/* Fast Shortcut Chips for 200 and 300 */}
                  <div className="flex items-center gap-1.5 mt-2">
                    <span className="text-[10px] font-bold text-charcoal-muted">Target goals:</span>
                    {[100, 150, 200, 250, 300].map((goal) => (
                      <button
                        key={goal}
                        type="button"
                        onClick={() => setTargetFleetGoal(goal)}
                        className={`px-2.5 py-0.5 rounded-lg text-[10px] font-bold border transition-all ${
                          parseInt(targetFleetGoal, 10) === goal
                            ? 'bg-forest-100 text-forest-800 border-forest-300'
                            : 'bg-white text-charcoal border-edge hover:bg-cream-100'
                        }`}
                      >
                        {goal} Total
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Advanced Prefix & Destination */}
              <div className="grid grid-cols-2 gap-3 pt-1">
                <div>
                  <label className="text-[11px] font-bold text-charcoal block mb-1">
                    Code Prefix
                  </label>
                  <input
                    type="text"
                    required
                    value={unitsPrefix}
                    onChange={(e) => setUnitsPrefix(e.target.value.toUpperCase())}
                    className="w-full px-3 py-2 text-xs font-mono font-bold rounded-xl border border-edge bg-cream-50 focus:bg-white focus:border-forest-600 text-charcoal"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-charcoal block mb-1">
                    Storage Destination
                  </label>
                  <input
                    type="text"
                    required
                    value={unitsHolder}
                    onChange={(e) => setUnitsHolder(e.target.value)}
                    className="w-full px-3 py-2 text-xs font-semibold rounded-xl border border-edge bg-cream-50 focus:bg-white focus:border-forest-600 text-charcoal"
                  />
                </div>
              </div>

              {/* Dynamic Live Calculation Card */}
              <div className="p-4 rounded-2xl bg-forest-50/80 border border-forest-200/90 space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-forest-900">Live Fleet Calculation:</span>
                  <span className="px-2 py-0.5 rounded-full bg-forest-100 text-forest-800 text-[10px] font-bold">
                    Automatic Unique QRs
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-2 text-center pt-1 border-t border-forest-200/60">
                  <div className="p-2 rounded-xl bg-white/70">
                    <span className="text-[10px] text-charcoal-muted block">Current Active</span>
                    <span className="font-bold text-sm text-charcoal">{totalActive}</span>
                  </div>
                  <div className="p-2 rounded-xl bg-white/70">
                    <span className="text-[10px] text-forest-700 block">Adding Now</span>
                    <span className="font-bold text-sm text-forest-700">+{effectiveCount}</span>
                  </div>
                  <div className="p-2 rounded-xl bg-white/70 border border-forest-200">
                    <span className="text-[10px] text-forest-800 block">New Total Fleet</span>
                    <span className="font-black text-sm text-forest-900">{totalActive + effectiveCount}</span>
                  </div>
                </div>

                <div className="text-[11px] text-forest-800 font-mono font-semibold pt-1 text-center">
                  Will generate serials: <strong className="text-forest-950 font-black">{unitsPrefix}{startSerialNum}</strong> ➔ <strong className="text-forest-950 font-black">{unitsPrefix}{endSerialNum}</strong>
                </div>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2 border-t border-edge">
                <button
                  type="button"
                  onClick={() => setIsAddUnitsModalOpen(false)}
                  className="px-4 py-2 text-xs font-bold rounded-xl bg-cream-100 hover:bg-cream-200 text-charcoal border border-edge apple-press"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 text-xs font-bold rounded-xl bg-forest-700 hover:bg-forest-800 text-white apple-press shadow-apple-sm flex items-center gap-1.5"
                >
                  <CheckCircle2 className="w-4 h-4 text-cream-100" />
                  <span>Confirm & Add {effectiveCount} Units</span>
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: DECOMMISSION & DAMAGE REPORT (UNIQUE QR BLACKLIST) */}
      {/* ========================================================================= */}
      {decommissionModal.isOpen && decommissionModal.dabba && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-t-3xl sm:rounded-3xl w-full max-w-lg p-5 sm:p-7 shadow-apple-modal border border-edge space-y-4 max-h-[92vh] overflow-y-auto">
            
            {/* Mobile Sheet Handle */}
            <div className="w-12 h-1 bg-charcoal/20 rounded-full mx-auto -mt-1 mb-2 sm:hidden"></div>

            <div className="flex items-center justify-between border-b border-edge pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-2xl bg-rose-600 text-white flex items-center justify-center shadow-sm">
                  <ShieldAlert className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-charcoal">Decommission Damaged Dabba</h3>
                  <p className="text-[11px] text-charcoal-muted">Permanent retirement & unique QR blacklisting</p>
                </div>
              </div>
              <button 
                onClick={() => setDecommissionModal({ isOpen: false, dabba: null })}
                className="w-8 h-8 rounded-lg bg-cream-100 hover:bg-cream-200 text-charcoal flex items-center justify-center"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Target Box Specs Banner */}
            <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 flex items-center justify-between text-xs">
              <div>
                <span className="text-[11px] text-rose-800 block">Decommissioning Target:</span>
                <span className="font-mono font-black text-sm text-rose-900">
                  {decommissionModal.dabba.code}
                </span>
                <span className="text-[11px] text-charcoal-muted block">
                  Last Custody: {decommissionModal.dabba.holder}
                </span>
              </div>
              <span className="px-2.5 py-1 rounded-xl bg-rose-100 text-rose-800 font-black text-[10px] uppercase">
                Will Be Blacklisted
              </span>
            </div>

            <div className="space-y-4">
              
              {/* Category */}
              <div>
                <label className="text-xs font-bold text-charcoal block mb-1">
                  Damage Reason Category
                </label>
                <select
                  value={damageReasonCategory}
                  onChange={(e) => setDamageReasonCategory(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs font-bold rounded-xl border border-edge bg-cream-50 focus:bg-white focus:border-rose-600 text-charcoal"
                >
                  <option value="Broken Lid / Clip Damaged">Broken Lid / Clip Damaged</option>
                  <option value="Leakage / Heavy Dent">Leakage / Heavy Dent</option>
                  <option value="Lost in Transit / Not Returned">Lost in Transit / Not Returned</option>
                  <option value="Heat Warping / Chemical Contamination">Heat Warping / Chemical Contamination</option>
                  <option value="General Wear & Scratches">General Wear & Scratches</option>
                  <option value="Other Physical Damage">Other Physical Damage</option>
                </select>
              </div>

              {/* Cause & Detailed Notes */}
              <div>
                <label className="text-xs font-bold text-charcoal block mb-1">
                  What happened? (Complete Incident Audit Notes)
                </label>
                <textarea
                  required
                  rows="3"
                  value={damageNotes}
                  onChange={(e) => setDamageNotes(e.target.value)}
                  placeholder="Explain exactly why this box is being removed (e.g. Slipped during delivery on KT Road, base lid cracked, leaked dal onto floor)..."
                  className="w-full px-3.5 py-2.5 text-xs font-medium rounded-xl border border-edge bg-cream-50 focus:bg-white focus:border-rose-600 text-charcoal"
                />
              </div>

              {/* Reporter */}
              <div>
                <label className="text-xs font-bold text-charcoal block mb-1">
                  Reported By & Logged By
                </label>
                <select
                  value={damageReportedBy}
                  onChange={(e) => setDamageReportedBy(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs font-bold rounded-xl border border-edge bg-cream-50 focus:bg-white focus:border-rose-600 text-charcoal"
                >
                  <option value="Operations Admin">Operations Admin</option>
                  <option value="Ramesh Sharma (Kitchen Head)">Ramesh Sharma (Kitchen Head)</option>
                  <option value="Raju Kumar (Delivery Hero - DBOY-01)">Raju Kumar (Delivery Hero - DBOY-01)</option>
                  <option value="Customer Return Inspection">Customer Return Inspection</option>
                </select>
              </div>

              {/* Auto Replace Checkbox */}
              <div className="p-3.5 rounded-2xl bg-cream-50 border border-edge flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-charcoal block">Auto-Issue Brand New Replacement Box</span>
                  <span className="text-[11px] text-charcoal-muted block">
                    Generates next unique code ({unitsPrefix}{getNextAvailableCodeNum()}) to maintain 100% tiffin circulation.
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={autoReplace}
                  onChange={(e) => setAutoReplace(e.target.checked)}
                  className="w-4 h-4 rounded text-forest-700 focus:ring-forest-600 border-edge cursor-pointer"
                />
              </div>

              {/* Strict Security Policy Notice */}
              <div className="p-3 rounded-xl bg-rose-50/60 border border-rose-200/60 text-[11px] text-rose-800 flex items-start gap-2">
                <Info className="w-4 h-4 text-rose-600 flex-shrink-0 mt-0.5" />
                <span>
                  <strong>Strict Policy:</strong> QR code <strong>{decommissionModal.dabba.code}</strong> will be permanently retired. The database will permanently block any attempt to re-use this serial number in the future.
                </span>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2 border-t border-edge">
                <button
                  type="button"
                  onClick={() => setDecommissionModal({ isOpen: false, dabba: null })}
                  className="px-4 py-2 text-xs font-bold rounded-xl bg-cream-100 hover:bg-cream-200 text-charcoal border border-edge apple-press"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleConfirmDecommission}
                  className="px-5 py-2 text-xs font-bold rounded-xl bg-rose-600 hover:bg-rose-700 text-white apple-press shadow-apple-sm flex items-center gap-1.5"
                >
                  <ShieldAlert className="w-4 h-4 text-white" />
                  <span>Decommission & Blacklist QR</span>
                </button>
              </div>

            </div>

          </div>
        </div>
      )}

      {/* QR Sticker Sheet Generator Modal */}
      <DabbaStickerModal
        isOpen={isStickerModalOpen}
        onClose={() => setIsStickerModalOpen(false)}
        dabbas={dabbas}
      />

    </div>
  );
}
