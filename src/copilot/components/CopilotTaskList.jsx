import React, { useState } from 'react';
import { 
  Navigation, 
  Phone, 
  QrCode, 
  CheckCircle2, 
  AlertTriangle, 
  Search, 
  MapPin, 
  Clock, 
  ArrowUp, 
  ArrowDown, 
  ShieldCheck, 
  Package, 
  RefreshCw,
  ExternalLink,
  Info
} from 'lucide-react';
import { getNavigationUrl } from '../services/copilotSync';

export default function CopilotTaskList({
  stops = [],
  focusedStopId = null,
  onSelectStop,
  onOpenScanner,
  onOpenNotAvailable,
  onReattemptDelivery,
  onReorderStop
}) {
  const [filter, setFilter] = useState('all'); // 'all' | 'pending' | 'delivered' | 'issues'
  const [searchQuery, setSearchQuery] = useState('');

  // Filtered stops
  const filteredStops = stops.filter(stop => {
    // Search query filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = stop.name?.toLowerCase().includes(q);
      const matchAddr = stop.address?.toLowerCase().includes(q);
      const matchPhone = stop.phone?.includes(q);
      const matchId = stop.id?.toLowerCase().includes(q);
      const matchBox = stop.dabbasHeld?.some(d => d.toLowerCase().includes(q));
      if (!matchName && !matchAddr && !matchPhone && !matchId && !matchBox) return false;
    }

    // Status filter
    if (filter === 'pending') {
      return stop.todayDeliveryStatus !== 'Delivered' && stop.todayDeliveryStatus !== 'Not Available' && stop.todayDeliveryStatus !== 'On Leave';
    }
    if (filter === 'delivered') {
      return stop.todayDeliveryStatus === 'Delivered';
    }
    if (filter === 'issues') {
      return stop.todayDeliveryStatus === 'Not Available' || stop.deliveryIssue;
    }
    return true;
  });

  const counts = {
    all: stops.length,
    pending: stops.filter(s => s.todayDeliveryStatus !== 'Delivered' && s.todayDeliveryStatus !== 'Not Available' && s.todayDeliveryStatus !== 'On Leave').length,
    delivered: stops.filter(s => s.todayDeliveryStatus === 'Delivered').length,
    issues: stops.filter(s => s.todayDeliveryStatus === 'Not Available' || s.deliveryIssue).length
  };

  return (
    <div className="flex flex-col h-full space-y-3">
      
      {/* Search & Filter Bar */}
      <div className="space-y-2.5 bg-white p-3 sm:p-4 rounded-3xl border border-edge shadow-sm">
        
        {/* Search Input */}
        <div className="relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search stop, flat no, customer, phone..."
            className="w-full pl-9 pr-4 py-2.5 bg-cream-100 rounded-2xl border border-edge text-xs font-medium text-charcoal placeholder:text-charcoal-subtle focus:outline-none focus:ring-2 focus:ring-forest-700/20 focus:border-forest-700"
          />
          <Search className="w-4 h-4 text-charcoal-muted absolute left-3 top-3" />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-2.5 text-xs text-charcoal-muted hover:text-charcoal"
            >
              ✕
            </button>
          )}
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
          <button
            type="button"
            onClick={() => setFilter('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap apple-press ${
              filter === 'all'
                ? 'bg-forest-700 text-cream-50 shadow-sm'
                : 'bg-cream-100 text-charcoal-muted hover:bg-cream-200'
            }`}
          >
            All Stops ({counts.all})
          </button>
          <button
            type="button"
            onClick={() => setFilter('pending')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap apple-press ${
              filter === 'pending'
                ? 'bg-forest-700 text-cream-50 shadow-sm'
                : 'bg-cream-100 text-charcoal-muted hover:bg-cream-200'
            }`}
          >
            Pending ({counts.pending})
          </button>
          <button
            type="button"
            onClick={() => setFilter('delivered')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap apple-press ${
              filter === 'delivered'
                ? 'bg-[#2E7D32] text-cream-50 shadow-sm'
                : 'bg-cream-100 text-charcoal-muted hover:bg-cream-200'
            }`}
          >
            Delivered ({counts.delivered})
          </button>
          <button
            type="button"
            onClick={() => setFilter('issues')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap apple-press ${
              filter === 'issues'
                ? 'bg-terracotta-700 text-cream-50 shadow-sm'
                : 'bg-cream-100 text-charcoal-muted hover:bg-cream-200'
            }`}
          >
            Issues ({counts.issues})
          </button>
        </div>

      </div>

      {/* Task Cards List */}
      <div className="space-y-3 overflow-y-auto pr-1 flex-1">
        {filteredStops.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-3xl border border-edge p-6 space-y-2">
            <Package className="w-10 h-10 text-charcoal-subtle mx-auto" />
            <h4 className="font-bold text-sm text-charcoal">No stops match your filter</h4>
            <p className="text-xs text-charcoal-muted">Try changing your search or filter pills.</p>
          </div>
        ) : (
          filteredStops.map((stop, index) => {
            const isDelivered = stop.todayDeliveryStatus === 'Delivered';
            const isNotAvailable = stop.todayDeliveryStatus === 'Not Available';
            const isFocused = focusedStopId === stop.id;
            const assignedDabba = stop.dabbasHeld && stop.dabbasHeld.length > 0 ? stop.dabbasHeld[0] : (stop.lastDelivery?.dabbaId || 'DB-101');

            return (
              <div
                key={stop.id}
                onClick={() => onSelectStop && onSelectStop(stop.id)}
                className={`bg-white rounded-3xl border transition-all duration-200 p-4 sm:p-5 shadow-sm relative overflow-hidden ${
                  isFocused 
                    ? 'border-forest-700 ring-2 ring-forest-700/20 shadow-md' 
                    : 'border-edge hover:border-forest-700/40'
                } ${isDelivered ? 'bg-white/90 opacity-95' : ''}`}
              >
                
                {/* Left Accent Status Border */}
                <div 
                  className={`absolute left-0 top-0 bottom-0 w-1.5 ${
                    isDelivered 
                      ? 'bg-[#2E7D32]' 
                      : isNotAvailable 
                      ? 'bg-terracotta-700' 
                      : 'bg-forest-700'
                  }`}
                />

                {/* Card Top: Stop Badge, Customer Name & Status */}
                <div className="flex items-start justify-between gap-3 mb-2.5">
                  <div className="flex items-center gap-2.5">
                    <span className="w-7 h-7 rounded-xl bg-forest-50 border border-forest-100 flex items-center justify-center text-xs font-black text-forest-800 flex-shrink-0">
                      #{index + 1}
                    </span>
                    <div>
                      <h4 className="font-bold text-sm sm:text-base text-charcoal font-apple leading-tight">
                        {stop.name}
                      </h4>
                      <p className="text-[11px] text-charcoal-muted">
                        {stop.id} • {stop.subscriptionType?.split('—')[0] || 'Lunch Thali'}
                      </p>
                    </div>
                  </div>

                  {/* Status Badge */}
                  <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border uppercase tracking-wider flex items-center gap-1 ${
                    isDelivered 
                      ? 'bg-forest-50 text-[#2E7D32] border-forest-200' 
                      : isNotAvailable 
                      ? 'bg-terracotta-50 text-terracotta-700 border-terracotta-200' 
                      : 'bg-amber-50 text-amber-800 border-amber-200'
                  }`}>
                    {isDelivered && <CheckCircle2 className="w-3 h-3" />}
                    {isNotAvailable && <AlertTriangle className="w-3 h-3" />}
                    <span>{stop.todayDeliveryStatus || 'Pending'}</span>
                  </span>
                </div>

                {/* Address & Landmark */}
                <div className="mb-3 pl-0.5 space-y-1">
                  <div className="flex items-start gap-1.5 text-xs text-charcoal">
                    <MapPin className="w-3.5 h-3.5 text-forest-700 mt-0.5 flex-shrink-0" />
                    <span className="font-medium leading-relaxed">{stop.address}</span>
                  </div>
                  {stop.deliveryNotes && (
                    <div className="flex items-center gap-1.5 text-[11px] text-charcoal-muted bg-cream-100/80 px-2.5 py-1 rounded-xl border border-edge/60">
                      <Info className="w-3 h-3 text-terracotta-700 flex-shrink-0" />
                      <span className="italic">{stop.deliveryNotes}</span>
                    </div>
                  )}
                </div>

                {/* Dabba & Meal Meta */}
                <div className="flex flex-wrap items-center gap-2 text-xs mb-3.5 pb-2.5 border-b border-edge/70">
                  <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-forest-50 text-forest-800 font-bold border border-forest-100">
                    <Package className="w-3 h-3 text-forest-700" />
                    <span>Box: #{assignedDabba}</span>
                  </div>
                  {stop.specialInstructions && (
                    <span className="text-[11px] font-semibold text-charcoal-muted px-2 py-0.5 rounded-lg bg-cream-100">
                      🥗 {stop.specialInstructions}
                    </span>
                  )}
                </div>

                {/* Action Buttons Row */}
                {isDelivered ? (
                  /* Completed State */
                  <div className="flex items-center justify-between bg-forest-50/70 p-2.5 rounded-2xl border border-forest-100">
                    <div className="flex items-center gap-2 text-xs font-bold text-[#2E7D32]">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Delivered & Verified (Dabba #{assignedDabba})</span>
                    </div>
                    <a
                      href={`tel:${stop.phone}`}
                      className="p-2 rounded-xl bg-white border border-edge text-charcoal hover:bg-cream-100 transition-colors"
                      title="Call customer"
                    >
                      <Phone className="w-3.5 h-3.5" />
                    </a>
                  </div>
                ) : isNotAvailable ? (
                  /* Not Available State (With Re-attempt option) */
                  <div className="space-y-2">
                    <div className="p-2.5 rounded-2xl bg-terracotta-50 border border-terracotta-100 text-xs text-terracotta-800 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <AlertTriangle className="w-4 h-4 text-terracotta-700 flex-shrink-0" />
                        <span className="font-semibold">
                          {stop.deliveryIssue?.reasonLabel || 'Door Locked / No response'}
                        </span>
                      </div>
                      <span className="text-[10px] text-terracotta-700 font-bold">
                        {stop.deliveryIssue?.timestamp || 'Reported'}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <a
                        href={`tel:${stop.phone}`}
                        className="py-2.5 px-3 rounded-2xl bg-cream-100 hover:bg-cream-200 border border-edge text-charcoal text-xs font-bold flex items-center justify-center gap-1.5 flex-1 apple-press"
                      >
                        <Phone className="w-3.5 h-3.5 text-forest-700" />
                        <span>Call Customer</span>
                      </a>
                      <button
                        type="button"
                        onClick={() => onReattemptDelivery && onReattemptDelivery(stop.id)}
                        className="py-2.5 px-3 rounded-2xl bg-forest-700 hover:bg-forest-800 text-cream-50 text-xs font-bold flex items-center justify-center gap-1.5 flex-1 shadow-sm apple-press"
                      >
                        <RefreshCw className="w-3.5 h-3.5" />
                        <span>Re-attempt Now</span>
                      </button>
                    </div>
                  </div>
                ) : (
                  /* Pending Actions (Call, Maps Navigate, Scan & Deliver, Not Available) */
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {/* Call Customer */}
                    <a
                      href={`tel:${stop.phone}`}
                      className="py-2.5 px-3 rounded-2xl bg-cream-100 hover:bg-cream-200 border border-edge text-charcoal text-xs font-bold flex items-center justify-center gap-1.5 transition-colors apple-press"
                    >
                      <Phone className="w-3.5 h-3.5 text-forest-700" />
                      <span>Call</span>
                    </a>

                    {/* Turn-by-Turn GPS Navigation */}
                    <a
                      href={getNavigationUrl(stop.coordinates, stop.address)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="py-2.5 px-3 rounded-2xl bg-cream-100 hover:bg-cream-200 border border-edge text-charcoal text-xs font-bold flex items-center justify-center gap-1.5 transition-colors apple-press"
                    >
                      <Navigation className="w-3.5 h-3.5 text-forest-700" />
                      <span>Map</span>
                    </a>

                    {/* Report Not Available */}
                    <button
                      type="button"
                      onClick={() => onOpenNotAvailable && onOpenNotAvailable(stop)}
                      className="py-2.5 px-2 rounded-2xl bg-terracotta-50 hover:bg-terracotta-100 text-terracotta-700 border border-terracotta-200 text-xs font-bold flex items-center justify-center gap-1 transition-colors apple-press"
                    >
                      <AlertTriangle className="w-3.5 h-3.5" />
                      <span>Not Home</span>
                    </button>

                    {/* Primary Scan & Deliver */}
                    <button
                      type="button"
                      onClick={() => onOpenScanner && onOpenScanner(stop)}
                      className="py-2.5 px-3 rounded-2xl bg-forest-700 hover:bg-forest-800 text-cream-50 text-xs font-bold flex items-center justify-center gap-1.5 shadow-sm transition-all apple-press"
                    >
                      <QrCode className="w-3.5 h-3.5" />
                      <span>Deliver</span>
                    </button>
                  </div>
                )}

              </div>
            );
          })
        )}
      </div>

    </div>
  );
}
