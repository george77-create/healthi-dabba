import React from 'react';
import { 
  Bike, 
  MapPin, 
  Clock, 
  CheckCircle2, 
  AlertTriangle, 
  ChevronDown, 
  ShieldCheck, 
  LogOut,
  Navigation,
  Sparkles
} from 'lucide-react';

export default function CopilotHeader({
  activeDriver,
  deliveryBoys = [],
  onSelectDriver,
  totalStops = 0,
  completedStops = 0,
  pendingStops = 0,
  issuesCount = 0,
  onExitToAdmin
}) {
  const completionRate = totalStops > 0 ? Math.round((completedStops / totalStops) * 100) : 0;

  return (
    <header className="sticky top-0 z-30 bg-[#FAF9F5]/95 backdrop-blur-xl border-b border-edge/90 transition-all">
      <div className="max-w-[1520px] mx-auto px-3 sm:px-6 lg:px-8 py-3">
        
        {/* Top Row: App Title, Driver Switcher & Exit */}
        <div className="flex items-center justify-between gap-3 mb-2.5">
          
          {/* Brand Identity */}
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-2xl bg-forest-700 flex items-center justify-center text-cream-50 shadow-sm flex-shrink-0">
              <Bike className="w-5 h-5 text-cream-100" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-base sm:text-lg text-charcoal tracking-tight font-apple">
                  Driver Copilot
                </span>
                <span className="px-1.5 sm:px-2 py-0.5 text-[9px] sm:text-[10px] font-bold bg-forest-50 text-forest-700 rounded-full border border-forest-200">
                  LIVE
                </span>
              </div>
              <p className="text-[10px] sm:text-[11px] text-charcoal-muted tracking-tight">
                {activeDriver?.routeZone || 'Tirupati Central Delivery Corridor'}
              </p>
            </div>
          </div>

          {/* Right Controls: Driver Selector & Exit Button */}
          <div className="flex items-center gap-2">
            {/* Active Driver Selector */}
            {deliveryBoys.length > 1 && (
              <div className="relative">
                <select
                  value={activeDriver?.id || ''}
                  onChange={(e) => {
                    const selected = deliveryBoys.find(b => b.id === e.target.value);
                    if (selected && onSelectDriver) onSelectDriver(selected);
                  }}
                  className="appearance-none pl-3 pr-8 py-1.5 bg-white border border-edge rounded-xl text-xs font-bold text-charcoal shadow-sm focus:outline-none focus:ring-2 focus:ring-forest-700/20 cursor-pointer"
                >
                  {deliveryBoys.map(boy => (
                    <option key={boy.id} value={boy.id}>
                      {boy.name} ({boy.id})
                    </option>
                  ))}
                </select>
                <ChevronDown className="w-3.5 h-3.5 text-charcoal-muted absolute right-2.5 top-2.5 pointer-events-none" />
              </div>
            )}

            {/* Admin Switch Back Button */}
            {onExitToAdmin && (
              <button
                type="button"
                onClick={onExitToAdmin}
                className="py-1.5 px-3 rounded-xl bg-white hover:bg-cream-100 border border-edge text-xs font-bold text-charcoal flex items-center gap-1.5 shadow-sm transition-all apple-press"
                title="Return to Admin OS"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-forest-700" />
                <span className="hidden sm:inline">Admin OS</span>
              </button>
            )}
          </div>
        </div>

        {/* Progress & Quick Metrics Bar */}
        <div className="bg-white rounded-2xl border border-edge p-2.5 sm:p-3 shadow-sm flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5 sm:gap-4">
          
          {/* Progress Bar & Percentage */}
          <div className="flex-1 min-w-[180px]">
            <div className="flex items-center justify-between text-xs mb-1">
              <span className="font-bold text-charcoal flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#2E7D32]" />
                <span>Today's Progress:</span>
              </span>
              <span className="font-bold text-forest-800">
                {completedStops} / {totalStops} Stops ({completionRate}%)
              </span>
            </div>
            <div className="w-full h-2 bg-cream-200 rounded-full overflow-hidden">
              <div 
                className="h-full bg-forest-700 rounded-full transition-all duration-500 ease-out"
                style={{ width: `${completionRate}%` }}
              />
            </div>
          </div>

          {/* Metric Badges */}
          <div className="flex items-center justify-between sm:justify-end gap-2 text-xs">
            <div className="px-2.5 py-1 rounded-xl bg-forest-50 border border-forest-100 flex items-center gap-1.5 font-bold text-forest-800">
              <span className="w-2 h-2 rounded-full bg-forest-700" />
              <span>Pending: {pendingStops}</span>
            </div>
            <div className="px-2.5 py-1 rounded-xl bg-[#2E7D32]/10 border border-[#2E7D32]/20 flex items-center gap-1.5 font-bold text-[#2E7D32]">
              <span className="w-2 h-2 rounded-full bg-[#2E7D32]" />
              <span>Delivered: {completedStops}</span>
            </div>
            {issuesCount > 0 && (
              <div className="px-2.5 py-1 rounded-xl bg-terracotta-50 border border-terracotta-100 flex items-center gap-1.5 font-bold text-terracotta-700 animate-pulse">
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>Issues: {issuesCount}</span>
              </div>
            )}
          </div>

        </div>

      </div>
    </header>
  );
}
