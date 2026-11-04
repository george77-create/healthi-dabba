import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { 
  ChefHat, 
  Scale, 
  QrCode, 
  Boxes, 
  ClipboardCheck, 
  Clock, 
  AlertTriangle, 
  Plus, 
  CheckCircle2, 
  Package, 
  TrendingDown, 
  Bike,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Utensils,
  Search,
  Building2,
  User,
  RotateCcw,
  RefreshCw
} from 'lucide-react';

export default function KitchenPortal({ 
  customers = [], 
  inventory = [], 
  tasks = [], 
  checklist = [], 
  deliveryBoys = [],
  dailyMenu = {},
  dabbas = [],
  damagedLedger = [],
  onAddStock,
  onToggleChecklistItem,
  onAssignDabbaQR,
  onUpdateDabbaStatus
}) {
  const [activeTab, setActiveTab] = useState('prep'); // 'prep' | 'inventory' | 'workflow' | 'reports'
  const [showAddStockModal, setShowAddStockModal] = useState(false);
  const [newStockItem, setNewStockItem] = useState({ name: 'Organic Cucumbers', supplier: 'Farm Direct Agri', qty: '10', unit: 'kg' });
  const [toastMessage, setToastMessage] = useState(null);
  const [auditSearch, setAuditSearch] = useState('');
  const [auditFilter, setAuditFilter] = useState('all'); // 'all' | 'godown' | 'transit' | 'customer'

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const activeCount = customers.filter(c => c.todayDeliveryStatus !== 'On Leave' && c.todayDeliveryStatus !== 'Cancelled' && c.subscriptionStatus !== 'Cancelled').length;
  const unsunCount = customers.filter(c => c.subscriptionType.includes('UNSUN') && c.todayDeliveryStatus !== 'On Leave' && c.todayDeliveryStatus !== 'Cancelled' && c.subscriptionStatus !== 'Cancelled').length;
  const altCount = customers.filter(c => c.subscriptionType.includes('Alternative') && c.todayDeliveryStatus !== 'On Leave' && c.todayDeliveryStatus !== 'Cancelled' && c.subscriptionStatus !== 'Cancelled').length;

  // Live dynamic dabba audit counts
  const cleanInGodown = dabbas.filter(d => d.status === 'in_godown').length;
  const inTransit = dabbas.filter(d => d.status === 'with_delivery').length;
  const withCustomer = dabbas.filter(d => d.status === 'with_customer').length;
  const totalCirculation = dabbas.length;
  const totalDamaged = damagedLedger.length;

  const filteredAuditDabbas = dabbas.filter(d => {
    const matches = d.code.toLowerCase().includes(auditSearch.toLowerCase()) ||
                    d.holder.toLowerCase().includes(auditSearch.toLowerCase());
    if (!matches) return false;
    if (auditFilter === 'godown') return d.status === 'in_godown';
    if (auditFilter === 'transit') return d.status === 'with_delivery';
    if (auditFilter === 'customer') return d.status === 'with_customer';
    return true;
  });

  const handleStockSubmit = (e) => {
    e.preventDefault();
    onAddStock(newStockItem);
    setShowAddStockModal(false);
    showToast(`Added ${newStockItem.qty} ${newStockItem.unit} of ${newStockItem.name} to warehouse inventory.`);
  };

  return (
    <div className="space-y-6 w-full max-w-[1520px] mx-auto">
      
      {/* Toast */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-charcoal text-cream-50 px-4 py-3 rounded-2xl shadow-apple-modal border border-edge text-xs font-medium flex items-center gap-2.5 animate-bounce">
          <CheckCircle2 className="w-4 h-4 text-forest-100" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Kitchen Manager Header */}
      <div className="bg-white rounded-3xl p-6 sm:p-7 border border-edge shadow-apple-card flex flex-col md:flex-row md:items-center justify-between gap-5">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-forest-50 border border-forest-100 flex items-center justify-center text-forest-700 flex-shrink-0">
            <ChefHat className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="text-xl font-bold text-charcoal tracking-tight">Kitchen & Godown Command</h1>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-forest-50 text-forest-700 border border-forest-100">
                Morning Batch (06:00 - 11:30 AM)
              </span>
            </div>
            <p className="text-xs text-charcoal-muted mt-1">
              Active meal production requirement: <strong>{activeCount} Fresh Boxes</strong> ({unsunCount} UNSUN + {altCount} Alternative-2)
            </p>
          </div>
        </div>

        {/* Tab Pill Selector */}
        <div className="flex items-center gap-1 p-1 bg-cream-100 rounded-2xl border border-edge overflow-x-auto no-scrollbar">
          {[
            { id: 'prep', label: 'Prep Sheet' },
            { id: 'inventory', label: 'Stock & Inward' },
            { id: 'workflow', label: 'Line Workflow' },
            { id: 'reports', label: 'Box Audit' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 text-xs font-semibold rounded-xl whitespace-nowrap apple-press transition-all ${
                activeTab === tab.id
                  ? 'bg-white text-forest-800 shadow-apple-sm font-bold'
                  : 'text-charcoal-muted hover:text-charcoal'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* DAILY PREPARATION DASHBOARD */}
      {activeTab === 'prep' && (
        <div className="space-y-6">
          
          {/* Packing demand cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white rounded-3xl p-6 border border-edge shadow-apple-card flex flex-col justify-between">
              <span className="text-xs font-bold text-charcoal-muted uppercase tracking-wider">Total Packed Meals</span>
              <div className="flex items-baseline gap-2 mt-2">
                <span className="text-4xl font-extrabold text-charcoal tracking-tight">{activeCount}</span>
                <span className="text-xs text-forest-700 font-bold">Boxes Required</span>
              </div>
              <p className="text-[11px] text-charcoal-muted mt-2">Auto-adjusted for customers on leave</p>
            </div>

            <div className="bg-white rounded-3xl p-6 border border-edge shadow-apple-card flex flex-col justify-between">
              <span className="text-xs font-bold text-charcoal-muted uppercase tracking-wider">UNSUN Standard Meals</span>
              <div className="flex items-baseline gap-2 mt-2">
                <span className="text-4xl font-extrabold text-forest-700 tracking-tight">{unsunCount}</span>
                <span className="text-xs text-charcoal-muted font-medium">portion packs</span>
              </div>
              <p className="text-[11px] text-charcoal-muted mt-2">Balanced nutrition formula</p>
            </div>

            <div className="bg-white rounded-3xl p-6 border border-edge shadow-apple-card flex flex-col justify-between">
              <span className="text-xs font-bold text-charcoal-muted uppercase tracking-wider">Alternative-2 (Keto/Millet)</span>
              <div className="flex items-baseline gap-2 mt-2">
                <span className="text-4xl font-extrabold text-terracotta-500 tracking-tight">{altCount}</span>
                <span className="text-xs text-charcoal-muted font-medium">specialty packs</span>
              </div>
              <p className="text-[11px] text-charcoal-muted mt-2">Low carb & energy sprout mix</p>
            </div>
          </div>



          {/* Itemized Recipe & Ingredients Auto-Calculator */}
          <div className="bg-white rounded-3xl p-6 sm:p-7 border border-edge shadow-apple-card space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-edge/80 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-forest-50 border border-forest-100 flex items-center justify-center text-forest-700">
                  <Scale className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-charcoal">Itemized Raw Ingredient Requirements</h3>
                  <p className="text-xs text-charcoal-muted">Proportionally computed per subscription tier</p>
                </div>
              </div>
              <span className="text-xs font-bold px-3 py-1 rounded-full bg-forest-50 text-forest-700 border border-forest-100 self-start sm:self-auto">
                Auto-Scale Engine Active
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {inventory.map((item) => (
                <div key={item.id} className="p-4 rounded-2xl border border-edge bg-cream-50/70 flex flex-col justify-between space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-xs font-bold text-charcoal block">{item.name}</span>
                      <span className="text-xs text-charcoal-muted mt-0.5 block">
                        Prep Quantity: <strong className="text-charcoal font-bold">{item.requiredToday}</strong>
                      </span>
                    </div>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      item.status.includes('Low') 
                        ? 'bg-terracotta-50 text-terracotta-500 border border-terracotta-100'
                        : 'bg-forest-50 text-forest-700'
                    }`}>
                      {item.status}
                    </span>
                  </div>

                  <div className="pt-2 border-t border-edge/60 flex items-center justify-between text-xs text-charcoal-muted">
                    <span>Warehouse Storage:</span>
                    <strong className="text-charcoal font-bold">{item.inStock}</strong>
                  </div>
                </div>
              ))}
            </div>
          </div>



          {/* Allergy & Special Dietary Notes */}
          <div className="bg-white rounded-3xl p-6 sm:p-7 border border-edge shadow-apple-card space-y-4">
            <div className="flex items-center gap-2.5">
              <AlertTriangle className="w-5 h-5 text-warmamber-500" />
              <div>
                <h3 className="text-base font-bold text-charcoal">Allergy & Dietary Customization Board</h3>
                <p className="text-xs text-charcoal-muted">Mandatory compliance checks before meal box tagging</p>
              </div>
            </div>
            
            <div className="space-y-2.5">
              {customers.filter(c => (c.kitchenNotes || c.specialInstructions) && c.todayDeliveryStatus !== 'Cancelled' && c.subscriptionStatus !== 'Cancelled').map((cust) => (
                <div key={cust.id} className="p-4 rounded-2xl bg-warmamber-50/80 border border-warmamber-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-charcoal text-sm">{cust.name}</span>
                      <span className="text-charcoal-muted text-[11px]">({cust.subscriptionType})</span>
                    </div>
                    <p className="text-charcoal font-semibold mt-1">
                      🍳 <strong>Kitchen Prep:</strong> {cust.kitchenNotes || cust.specialInstructions}
                    </p>
                  </div>
                  <span className="px-3 py-1 rounded-full bg-white text-terracotta-700 font-bold text-[10px] border border-warmamber-200 self-start sm:self-auto shadow-apple-sm">
                    Kitchen Sticker Tagged on Box
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Individual Customer Dish Allotment & Dabba Packing Manifest */}
          <div className="bg-white rounded-3xl p-6 sm:p-7 border border-edge shadow-apple-card space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-edge/80 pb-3">
              <div className="flex items-center gap-2.5">
                <Utensils className="w-5 h-5 text-forest-700" />
                <div>
                  <h3 className="text-base font-bold text-charcoal">Customer Dabba Packing & Dish Allotment Manifest</h3>
                  <p className="text-xs text-charcoal-muted">Exact personalized dishes to pack into each customer's sealed tiffin</p>
                </div>
              </div>
              <span className="text-xs font-bold px-3 py-1 rounded-full bg-forest-50 text-forest-700 border border-forest-100 self-start sm:self-auto">
                {activeCount} Active Boxes
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              {customers
                .filter(c => c.todayDeliveryStatus !== 'Cancelled' && c.subscriptionStatus !== 'Cancelled' && c.todayDeliveryStatus !== 'On Leave')
                .map((cust) => {
                  const isUnsun = cust.subscriptionType?.includes('UNSUN');
                  const planDishes = (isUnsun ? dailyMenu?.unsun : dailyMenu?.alternative2) || [];
                  const otherDishes = (isUnsun ? dailyMenu?.alternative2 : dailyMenu?.unsun) || [];
                  const allDishes = [...(planDishes || []), ...(otherDishes || [])];
                  const customerAllottedIds = cust.allottedDishIds || planDishes.map(d => d.id);
                  const custDishes = allDishes.filter(d => customerAllottedIds.includes(d.id));

                  return (
                    <div key={cust.id} className="p-4 rounded-2xl border border-edge bg-cream-50/60 flex flex-col justify-between space-y-3">
                      <div>
                        <div className="flex items-center justify-between">
                          <div>
                            <span className="font-bold text-charcoal text-sm">{cust.name}</span>
                            <span className="text-charcoal-muted text-[11px] block">{cust.id} • {cust.subscriptionType.split('(')[0]}</span>
                          </div>
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-forest-100 text-forest-800 border border-forest-200">
                            {custDishes.length} Dishes Allotted
                          </span>
                        </div>

                        {(cust.kitchenNotes || cust.specialInstructions) && (
                          <div className="mt-2 p-2 rounded-xl bg-warmamber-50 text-[11px] font-semibold text-charcoal border border-warmamber-200/70">
                            🍳 <strong>Note:</strong> {cust.kitchenNotes || cust.specialInstructions}
                          </div>
                        )}

                        <div className="mt-2.5 space-y-1.5">
                          <span className="text-[10px] font-bold text-charcoal-muted uppercase tracking-wider block">Dishes to Pack:</span>
                          <div className="flex flex-wrap gap-1.5">
                            {custDishes.map(d => (
                              <span key={d.id} className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-white border border-edge text-[11px] font-semibold text-charcoal shadow-apple-sm">
                                <CheckCircle2 className="w-2.5 h-2.5 text-forest-600" />
                                <span>{d.name}</span>
                                <span className="text-charcoal-muted font-normal text-[10px]">({d.weight || d.quantity || '200g'})</span>
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>

                      <div className="pt-2 border-t border-edge/60 flex items-center justify-between text-[11px] text-charcoal-muted">
                        <span>Tag sticker on box lid</span>
                        <span className="font-bold text-forest-700">✓ Box Verified</span>
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>



        </div>
      )}

      {/* STOCK & INVENTORY TAB */}
      {activeTab === 'inventory' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-bold text-charcoal tracking-tight">Raw Materials & Wholesale Inward</h2>
              <p className="text-xs text-charcoal-muted">Monitor inventory thresholds, supplier lots & daily consumption</p>
            </div>
            <button
              onClick={() => setShowAddStockModal(true)}
              className="px-5 py-2.5 text-xs font-bold rounded-2xl bg-forest-700 text-white hover:bg-forest-800 apple-press shadow-apple-sm flex items-center gap-2 self-start sm:self-auto"
            >
              <Plus className="w-4 h-4" />
              <span>Record Purchase Entry</span>
            </button>
          </div>

          <div className="bg-white rounded-3xl border border-edge shadow-apple-card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-cream-100/80 border-b border-edge text-charcoal-muted">
                  <tr>
                    <th className="p-4 font-bold">Ingredient Name</th>
                    <th className="p-4 font-bold">Today's Consumption</th>
                    <th className="p-4 font-bold">Current Stock</th>
                    <th className="p-4 font-bold">Status</th>
                    <th className="p-4 font-bold text-right">Quick Restock</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-edge">
                  {inventory.map((item) => (
                    <tr key={item.id} className="hover:bg-cream-50/70">
                      <td className="p-4 font-bold text-charcoal">{item.name}</td>
                      <td className="p-4 text-charcoal-muted font-medium">{item.requiredToday}</td>
                      <td className="p-4 font-bold text-charcoal">{item.inStock}</td>
                      <td className="p-4">
                        <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                          item.status.includes('Low')
                            ? 'bg-terracotta-50 text-terracotta-500 border border-terracotta-100'
                            : 'bg-forest-50 text-forest-700'
                        }`}>
                          {item.status}
                        </span>
                      </td>
                      <td className="p-4 text-right">
                        <button
                          onClick={() => {
                            onAddStock({ name: item.name, supplier: 'Verified Agro', qty: '5', unit: item.unit });
                            showToast(`Restocked +5 ${item.unit} of ${item.name}`);
                          }}
                          className="px-3 py-1.5 text-xs font-bold rounded-xl bg-cream-100 border border-edge text-charcoal hover:bg-forest-50 hover:text-forest-700 apple-press"
                        >
                          +5 {item.unit}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>


        </div>
      )}

      {/* LINE WORKFLOW & PRE-DISPATCH AUDIT */}
      {activeTab === 'workflow' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          <div className="bg-white rounded-3xl p-7 border border-edge shadow-apple-card space-y-5">
            <div className="flex items-center justify-between border-b border-edge/80 pb-4">
              <div className="flex items-center gap-3">
                <Clock className="w-5 h-5 text-forest-700" />
                <h3 className="text-base font-bold text-charcoal">Line Cook Activity Log</h3>
              </div>
              <span className="text-xs font-semibold text-charcoal-muted">Shift Phase 1</span>
            </div>

            <div className="space-y-3">
              {tasks.map((task) => (
                <div key={task.id} className="p-4 rounded-2xl border border-edge bg-cream-50 flex items-center justify-between text-xs">
                  <div>
                    <span className="font-bold text-charcoal text-sm block">{task.task}</span>
                    <span className="text-charcoal-muted text-[11px]">Assigned to: {task.assignedTo}</span>
                  </div>
                  <div className="text-right">
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold block ${
                      task.status === 'Completed'
                        ? 'bg-forest-50 text-forest-700'
                        : task.status === 'In Progress'
                        ? 'bg-warmamber-50 text-warmamber-600'
                        : 'bg-cream-200 text-charcoal-muted'
                    }`}>
                      {task.status}
                    </span>
                    <span className="text-[10px] text-charcoal-muted mt-1 block">Time: {task.timeSpent}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>



          <div className="bg-white rounded-3xl p-7 border border-edge shadow-apple-card space-y-5">
            <div className="flex items-center justify-between border-b border-edge/80 pb-4">
              <div className="flex items-center gap-3">
                <ClipboardCheck className="w-5 h-5 text-forest-700" />
                <h3 className="text-base font-bold text-charcoal">Pre-Dispatch Audit Checklist</h3>
              </div>
              <span className="text-[11px] text-charcoal-muted">Mandatory sign-off</span>
            </div>

            <div className="space-y-3">
              {checklist.map((item) => (
                <label 
                  key={item.id}
                  className="flex items-start gap-3.5 p-3.5 rounded-2xl border border-edge bg-cream-50/70 cursor-pointer hover:bg-cream-100 transition-all text-xs"
                >
                  <input
                    type="checkbox"
                    checked={item.checked}
                    onChange={() => onToggleChecklistItem(item.id)}
                    className="mt-0.5 accent-forest-700 w-4 h-4 rounded"
                  />
                  <span className={`leading-relaxed ${item.checked ? 'text-charcoal line-through opacity-70' : 'text-charcoal font-semibold'}`}>
                    {item.label}
                  </span>
                </label>
              ))}
            </div>

            <div className="pt-2">
              <button
                onClick={() => showToast("Morning Meal Dispatch authorized & timestamped!")}
                className="w-full py-3 text-xs font-bold rounded-2xl bg-forest-700 text-white hover:bg-forest-800 apple-press shadow-apple-sm flex items-center justify-center gap-2"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Authorize Driver Route Departure</span>
              </button>
            </div>
          </div>



        </div>
      )}

      {/* BOX AUDIT & REPORTS */}
      {activeTab === 'reports' && (
        <div className="space-y-6">
          
          {/* Top Live Metric Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5 sm:gap-4">
            <div className="bg-white rounded-3xl p-5 sm:p-6 border border-edge shadow-apple-card flex flex-col justify-between">
              <span className="text-[11px] font-bold text-charcoal-muted uppercase tracking-wider block">Clean Boxes in Godown</span>
              <span className="text-3xl sm:text-4xl font-extrabold text-forest-700 mt-2 block tracking-tight">{cleanInGodown}</span>
              <span className="text-[11px] text-forest-700 font-semibold mt-1 block">Sanitized & ready for next pack</span>
            </div>

            <div className="bg-white rounded-3xl p-5 sm:p-6 border border-edge shadow-apple-card flex flex-col justify-between">
              <span className="text-[11px] font-bold text-charcoal-muted uppercase tracking-wider block">In Transit on Route</span>
              <span className="text-3xl sm:text-4xl font-extrabold text-warmamber-600 mt-2 block tracking-tight">{inTransit}</span>
              <span className="text-[11px] text-charcoal-muted mt-1 block">With delivery boys</span>
            </div>

            <div className="bg-white rounded-3xl p-5 sm:p-6 border border-edge shadow-apple-card flex flex-col justify-between">
              <span className="text-[11px] font-bold text-charcoal-muted uppercase tracking-wider block">Held by Customers</span>
              <span className="text-3xl sm:text-4xl font-extrabold text-terracotta-500 mt-2 block tracking-tight">{withCustomer}</span>
              <span className="text-[11px] text-charcoal-muted mt-1 block">Pickup due next morning</span>
            </div>

            <div className="bg-white rounded-3xl p-5 sm:p-6 border border-edge shadow-apple-card flex flex-col justify-between">
              <span className="text-[11px] font-bold text-rose-700 uppercase tracking-wider block flex items-center gap-1">
                <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
                <span>Damaged / Scrapped</span>
              </span>
              <span className="text-3xl sm:text-4xl font-extrabold text-rose-600 mt-2 block tracking-tight">{totalDamaged}</span>
              <span className="text-[11px] text-rose-600 font-semibold mt-1 block">Blacklisted (Decommissioned)</span>
            </div>
          </div>

          {/* Interactive Godown Audit Controls */}
          <div className="bg-white rounded-3xl border border-edge shadow-apple-card overflow-hidden">
            
            <div className="p-4 sm:p-5 border-b border-edge flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-cream-50/50">
              <div>
                <h3 className="text-base font-bold text-charcoal">Godown Box Audit & Sanitization Verification</h3>
                <p className="text-xs text-charcoal-muted mt-0.5">
                  Verify individual tiffin container hygiene, scan integrity & restock returned empty boxes
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => showToast(`All ${cleanInGodown} Godown boxes verified. Steam sterilization log valid.`)}
                  className="px-3.5 py-2 text-xs font-bold rounded-xl bg-forest-700 text-white hover:bg-forest-800 apple-press shadow-apple-sm flex items-center gap-1.5"
                >
                  <CheckCircle2 className="w-4 h-4 text-cream-100" />
                  <span>Verify Godown Rack</span>
                </button>
              </div>
            </div>

            {/* Filter & Search Bar */}
            <div className="p-4 border-b border-edge flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="relative w-full sm:max-w-xs">
                <Search className="w-4 h-4 text-charcoal-muted absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search box code (DB-101) or holder..."
                  value={auditSearch}
                  onChange={(e) => setAuditSearch(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-edge bg-cream-50 focus:bg-white focus:outline-none focus:border-forest-600 font-semibold"
                />
              </div>

              <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto no-scrollbar">
                {[
                  { id: 'all', label: `All (${totalCirculation})` },
                  { id: 'godown', label: `In Godown (${cleanInGodown})` },
                  { id: 'transit', label: `In Transit (${inTransit})` },
                  { id: 'customer', label: `With Customer (${withCustomer})` }
                ].map((chip) => (
                  <button
                    key={chip.id}
                    type="button"
                    onClick={() => setAuditFilter(chip.id)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap apple-press ${
                      auditFilter === chip.id
                        ? 'bg-forest-700 text-white shadow-xs'
                        : 'bg-cream-100 text-charcoal-muted hover:text-charcoal'
                    }`}
                  >
                    {chip.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Mobile Touch Cards for Box Audit */}
            <div className="md:hidden divide-y divide-edge">
              {filteredAuditDabbas.length === 0 ? (
                <div className="p-8 text-center text-xs text-charcoal-muted font-semibold">
                  No boxes match your search filter.
                </div>
              ) : (
                filteredAuditDabbas.map((d) => (
                  <div key={d.code} className="p-3.5 space-y-2.5 bg-white hover:bg-cream-50/50 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-xl bg-forest-50 border border-forest-100 text-forest-700 flex items-center justify-center font-bold">
                          <QrCode className="w-4 h-4" />
                        </div>
                        <div>
                          <span className="font-mono font-black text-sm tracking-wide text-forest-900 block">
                            {d.code}
                          </span>
                          <span className="text-[10px] text-charcoal-muted">
                            {d.lastUpdate || "2026-11-04 06:00"}
                          </span>
                        </div>
                      </div>

                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        d.status === 'in_godown'
                          ? 'bg-forest-50 text-forest-700 border border-forest-100'
                          : d.status === 'with_customer'
                          ? 'bg-cream-200 text-charcoal border border-edge'
                          : 'bg-warmamber-50 text-warmamber-700 border border-warmamber-200'
                      }`}>
                        {d.status.replace('_', ' ').toUpperCase()}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5 text-xs text-charcoal bg-cream-50/80 p-2 rounded-xl border border-edge/60">
                      {d.status === 'in_godown' && <Building2 className="w-3.5 h-3.5 text-forest-600 shrink-0" />}
                      {d.status === 'with_delivery' && <Bike className="w-3.5 h-3.5 text-warmamber-600 shrink-0" />}
                      {d.status === 'with_customer' && <User className="w-3.5 h-3.5 text-charcoal-muted shrink-0" />}
                      <span className="truncate font-semibold">{d.holder}</span>
                    </div>

                    <div className="flex items-center gap-2 pt-0.5">
                      <button
                        type="button"
                        onClick={() => showToast(`Box ${d.code} integrity verified. Seals & thermal chamber intact.`)}
                        className="flex-1 py-1.5 text-xs font-bold rounded-xl bg-cream-100 border border-edge text-charcoal hover:bg-forest-50 hover:text-forest-700 apple-press"
                      >
                        Verify Hygiene
                      </button>

                      {d.status !== 'in_godown' && onUpdateDabbaStatus && (
                        <button
                          type="button"
                          onClick={() => {
                            onUpdateDabbaStatus(d.code, 'in_godown', 'Godown Sanitized Rack');
                            showToast(`Box ${d.code} washed, sanitized & restocked to Godown Rack!`);
                          }}
                          className="flex-1 py-1.5 text-xs font-bold rounded-xl bg-forest-50 border border-forest-200 text-forest-800 hover:bg-forest-100 apple-press flex items-center justify-center gap-1"
                        >
                          <RotateCcw className="w-3 h-3 text-forest-700" />
                          <span>Restock to Godown</span>
                        </button>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Desktop Table View */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-cream-100/80 border-b border-edge text-charcoal-muted">
                  <tr>
                    <th className="p-4 font-bold">Box Barcode/QR</th>
                    <th className="p-4 font-bold">Current Circulation Status</th>
                    <th className="p-4 font-bold">Current Custody Holder</th>
                    <th className="p-4 font-bold">Last Hygiene / Audit Timestamp</th>
                    <th className="p-4 font-bold text-right">Audit Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-edge">
                  {filteredAuditDabbas.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="p-8 text-center text-charcoal-muted font-semibold">
                        No boxes match your search filter.
                      </td>
                    </tr>
                  ) : (
                    filteredAuditDabbas.map((d) => (
                      <tr key={d.code} className="hover:bg-cream-50/70 transition-colors">
                        <td className="p-4 font-bold text-charcoal">
                          <div className="flex items-center gap-2">
                            <QrCode className="w-4 h-4 text-forest-700" />
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
                              : 'bg-warmamber-50 text-warmamber-700 border border-warmamber-200'
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
                              type="button"
                              onClick={() => showToast(`Box ${d.code} integrity verified. Seals & thermal chamber intact.`)}
                              className="px-3 py-1.5 text-xs font-bold rounded-xl bg-cream-100 border border-edge text-charcoal hover:bg-forest-50 hover:text-forest-700 apple-press"
                            >
                              Verify Hygiene
                            </button>

                            {d.status !== 'in_godown' && onUpdateDabbaStatus && (
                              <button
                                type="button"
                                onClick={() => {
                                  onUpdateDabbaStatus(d.code, 'in_godown', 'Godown Sanitized Rack');
                                  showToast(`Box ${d.code} washed, sanitized & restocked to Godown Rack!`);
                                }}
                                className="px-3 py-1.5 text-xs font-bold rounded-xl bg-forest-50 border border-forest-200 text-forest-800 hover:bg-forest-100 apple-press flex items-center gap-1"
                              >
                                <RotateCcw className="w-3.5 h-3.5 text-forest-700" />
                                <span>Restock to Godown</span>
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

          </div>

          {/* Wastage and Yield summary */}
          <div className="bg-white rounded-3xl p-6 sm:p-7 border border-edge shadow-apple-card space-y-2">
            <h4 className="text-base font-bold text-charcoal">Daily Stock Wastage & Yield Analysis</h4>
            <p className="text-xs text-charcoal-muted leading-relaxed">
              Today's food prep yield: <strong className="text-forest-800 font-bold">98.4%</strong>. Wastage recorded: <strong className="text-charcoal font-bold">0.3 kg peel/trimmings</strong> (within standard 2% tolerance). All stainless steel tiffins sanitized via 85°C steam wash.
            </p>
          </div>

        </div>
      )}

      {/* Add Purchase Entry Modal */}
      {showAddStockModal && createPortal(
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-charcoal/60 backdrop-blur-md">
          <div className="w-full max-w-sm bg-white rounded-3xl p-7 shadow-apple-modal border border-edge space-y-4">
            <h4 className="text-base font-bold text-charcoal">Record Wholesale Stock Purchase</h4>
            <form onSubmit={handleStockSubmit} className="space-y-3.5">
              <div>
                <label className="text-xs font-bold text-charcoal block mb-1">Item Name</label>
                <input
                  type="text"
                  required
                  value={newStockItem.name}
                  onChange={(e) => setNewStockItem({ ...newStockItem, name: e.target.value })}
                  className="w-full px-3.5 py-2.5 text-xs rounded-2xl border border-edge bg-cream-50 focus:outline-none focus:border-forest-600 focus:bg-white text-charcoal font-medium"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-charcoal block mb-1">Quantity</label>
                  <input
                    type="number"
                    step="0.1"
                    required
                    value={newStockItem.qty}
                    onChange={(e) => setNewStockItem({ ...newStockItem, qty: e.target.value })}
                    className="w-full px-3.5 py-2.5 text-xs rounded-2xl border border-edge bg-cream-50 focus:outline-none focus:border-forest-600 focus:bg-white text-charcoal font-medium"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-charcoal block mb-1">Unit</label>
                  <select
                    value={newStockItem.unit}
                    onChange={(e) => setNewStockItem({ ...newStockItem, unit: e.target.value })}
                    className="w-full px-3.5 py-2.5 text-xs rounded-2xl border border-edge bg-cream-50 focus:outline-none focus:border-forest-600 focus:bg-white text-charcoal font-medium"
                  >
                    <option value="kg">kg</option>
                    <option value="grams">grams</option>
                    <option value="pcs">pcs</option>
                    <option value="liters">liters</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="text-xs font-bold text-charcoal block mb-1">Supplier Lot / Name</label>
                <input
                  type="text"
                  required
                  value={newStockItem.supplier}
                  onChange={(e) => setNewStockItem({ ...newStockItem, supplier: e.target.value })}
                  className="w-full px-3.5 py-2.5 text-xs rounded-2xl border border-edge bg-cream-50 focus:outline-none focus:border-forest-600 focus:bg-white text-charcoal font-medium"
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddStockModal(false)}
                  className="flex-1 py-2.5 text-xs font-bold rounded-xl border border-edge text-charcoal hover:bg-cream-100 apple-press"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 text-xs font-bold rounded-xl bg-forest-700 text-white hover:bg-forest-800 apple-press shadow-apple-sm"
                >
                  Save Inward Lot
                </button>
              </div>
            </form>
          </div>
        </div>,
        document.body
      )}

    </div>
  );
}
