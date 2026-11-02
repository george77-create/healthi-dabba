import React, { useState, useEffect } from 'react';
import { 
  Bike, 
  MapPin, 
  Phone, 
  MessageSquare, 
  QrCode, 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  Send,
  Navigation,
  Package,
  ShieldCheck,
  ChevronRight,
  Bell,
  Sparkles,
  ArrowRight,
  XCircle
} from 'lucide-react';

export default function DeliveryPortal({ 
  deliveryBoy, 
  customers, 
  onUpdateDeliveryStatus, 
  onScanDabba, 
  onHandoverToGodown,
  onSendReturnAlert,
  onCheckInOut,
  urgentInstructions 
}) {
  const [activeTab, setActiveTab] = useState('route'); // 'route' | 'radar' | 'handover'
  const [orderList, setOrderList] = useState(() => customers.filter(c => deliveryBoy.assignedCustomerIds.includes(c.id)));
  const [toastMessage, setToastMessage] = useState(null);

  useEffect(() => {
    setOrderList(prevList => {
      const assigned = customers.filter(c => deliveryBoy.assignedCustomerIds.includes(c.id));
      if (prevList.length === 0) return assigned;
      const updated = prevList.map(old => assigned.find(c => c.id === old.id) || old);
      assigned.forEach(c => {
        if (!updated.some(u => u.id === c.id)) updated.push(c);
      });
      return updated;
    });
  }, [customers, deliveryBoy.assignedCustomerIds]);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const moveStop = (index, direction) => {
    const newList = [...orderList];
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= newList.length) return;
    const temp = newList[index];
    newList[index] = newList[targetIndex];
    newList[targetIndex] = temp;
    setOrderList(newList);
    showToast("Route sequence reordered for optimal traffic navigation.");
  };

  const totalStops = orderList.length;
  const completedStops = orderList.filter(c => 
    c.todayDeliveryStatus === 'Delivered' || 
    c.todayDeliveryStatus === 'On Leave' || 
    (c.todayDeliveryStatus === 'Cancelled' && (!c.dabbasHeld || c.dabbasHeld.length === 0))
  ).length;
  const completionPercentage = totalStops > 0 ? Math.round((completedStops / totalStops) * 100) : 0;

  const customersWithPendingBoxes = customers.filter(c => c.dabbasHeld && c.dabbasHeld.length > 0);

  return (
    <div className="space-y-6 w-full max-w-[1520px] mx-auto">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-charcoal text-cream-50 px-5 py-3.5 rounded-2xl shadow-apple-modal border border-edge text-xs font-semibold flex items-center gap-2.5 animate-bounce">
          <CheckCircle2 className="w-4 h-4 text-forest-100" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Urgent Broadcast Banner */}
      {urgentInstructions && urgentInstructions.length > 0 && (
        <div className="bg-warmamber-50/90 border border-warmamber-100 rounded-3xl p-5 sm:p-6 flex items-start gap-4 shadow-apple-sm">
          <div className="w-11 h-11 rounded-2xl bg-warmamber-100 flex items-center justify-center text-warmamber-600 flex-shrink-0">
            <Bell className="w-5 h-5" />
          </div>
          <div className="min-w-0 flex-1">
            <span className="text-xs font-bold text-warmamber-600 uppercase tracking-wider block">
              Urgent Dispatch Broadcast
            </span>
            <p className="text-sm text-charcoal mt-1 leading-relaxed font-semibold">
              {urgentInstructions[0].message}
            </p>
            <span className="text-xs text-charcoal-muted mt-1.5 block">
              Dispatched at {urgentInstructions[0].time} • Route A Priority Alert
            </span>
          </div>
        </div>
      )}

      {/* Driver Cockpit HUD Header */}
      <div className="bg-white rounded-3xl p-6 sm:p-7 border border-edge shadow-apple-card flex flex-col md:flex-row md:items-center justify-between gap-5">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-forest-700 flex items-center justify-center text-cream-50 shadow-apple-sm flex-shrink-0">
            <Bike className="w-7 h-7 text-cream-100" />
          </div>
          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="text-xl sm:text-2xl font-bold text-charcoal tracking-tight">{deliveryBoy.name}</h1>
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-forest-50 text-forest-700 border border-forest-100">
                {deliveryBoy.status}
              </span>
            </div>
            <p className="text-xs text-charcoal-muted mt-1 flex items-center gap-1.5">
              <Navigation className="w-4 h-4 text-forest-600" />
              <span className="font-medium">{deliveryBoy.routeZone}</span>
            </p>
          </div>
        </div>

        {/* Progress & Shift Actions */}
        <div className="flex items-center gap-5 flex-wrap">
          <div className="text-right">
            <span className="text-xs font-bold text-charcoal-muted uppercase tracking-wider block">Shift Route Progress</span>
            <div className="flex items-center gap-3 mt-1.5">
              <div className="w-36 bg-cream-200 h-3 rounded-full overflow-hidden">
                <div 
                  className="bg-forest-600 h-full rounded-full transition-all duration-700"
                  style={{ width: `${completionPercentage}%` }}
                ></div>
              </div>
              <span className="text-base font-extrabold text-charcoal">{completionPercentage}%</span>
            </div>
          </div>

          <button
            onClick={() => {
              onCheckInOut(deliveryBoy.id);
              showToast(`Shift status: ${deliveryBoy.status === 'Checked In' ? 'Checked Out' : 'Checked In'}`);
            }}
            className={`px-5 py-3 text-xs font-bold rounded-2xl apple-press shadow-apple-sm ${
              deliveryBoy.status === 'Checked In'
                ? 'bg-cream-100 text-charcoal border border-edge hover:bg-cream-200'
                : 'bg-forest-700 text-white hover:bg-forest-800'
            }`}
          >
            {deliveryBoy.status === 'Checked In' ? 'End Shift (Check-out)' : 'Start Route (Check-in)'}
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-edge/80 pb-3">
        <button
          onClick={() => setActiveTab('route')}
          className={`px-4 sm:px-5 py-2 text-xs font-bold rounded-xl transition-all apple-press ${
            activeTab === 'route'
              ? 'bg-forest-700 text-white shadow-apple-sm'
              : 'text-charcoal-muted hover:text-charcoal bg-white border border-edge'
          }`}
        >
          Active Stops ({orderList.length})
        </button>
        <button
          onClick={() => setActiveTab('radar')}
          className={`px-4 sm:px-5 py-2 text-xs font-bold rounded-xl transition-all apple-press ${
            activeTab === 'radar'
              ? 'bg-forest-700 text-white shadow-apple-sm'
              : 'text-charcoal-muted hover:text-charcoal bg-white border border-edge'
          }`}
        >
          Unreturned Box Radar ({customersWithPendingBoxes.length})
        </button>
        <button
          onClick={() => setActiveTab('handover')}
          className={`px-4 sm:px-5 py-2 text-xs font-bold rounded-xl transition-all apple-press ${
            activeTab === 'handover'
              ? 'bg-forest-700 text-white shadow-apple-sm'
              : 'text-charcoal-muted hover:text-charcoal bg-white border border-edge'
          }`}
        >
          Godown Handover ({deliveryBoy.collectedReturnDabbas.length} in bag)
        </button>
      </div>

      {/* ACTIVE STOPS: Widescreen 2-Column Cockpit */}
      {activeTab === 'route' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
          
          {/* Main Route Stop Sequence (Col-span 8) */}
          <div className="lg:col-span-8 space-y-4">
            <div className="flex items-center justify-between text-xs text-charcoal-muted px-2">
              <span className="font-bold uppercase tracking-wider">Optimized Sequence (Turn-by-Turn Delivery)</span>
              <span>Use &uarr; &darr; to re-route stops</span>
            </div>

            <div className="space-y-4">
              {orderList.map((customer, index) => {
                const isDelivered = customer.todayDeliveryStatus === 'Delivered';
                const isOnLeave = customer.todayDeliveryStatus === 'On Leave';
                const isCancelled = customer.todayDeliveryStatus === 'Cancelled' || customer.subscriptionStatus === 'Cancelled';

                return (
                  <div 
                    key={customer.id}
                    className={`bg-white rounded-3xl p-6 sm:p-7 border transition-all shadow-apple-card ${
                      isCancelled
                        ? 'border-rose-200 bg-rose-50/20'
                        : isDelivered 
                        ? 'border-forest-200 bg-forest-50/20' 
                        : isOnLeave 
                        ? 'border-edge opacity-60 bg-cream-50' 
                        : 'border-edge'
                    }`}
                  >
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-5">
                      
                      {/* Customer Details */}
                      <div className="space-y-2.5 flex-1 min-w-0">
                        <div className="flex items-center gap-2.5 flex-wrap">
                          <span className="w-8 h-8 rounded-full bg-forest-50 text-forest-800 text-xs font-bold flex items-center justify-center border border-forest-100">
                            {index + 1}
                          </span>
                          <h3 className="text-base sm:text-lg font-bold text-charcoal">{customer.name}</h3>
                          <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-cream-100 text-charcoal-muted border border-edge">
                            {customer.subscriptionType}
                          </span>
                          
                          <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                            isCancelled
                              ? 'bg-rose-50 text-rose-700 border border-rose-200'
                              : isDelivered
                              ? 'bg-forest-50 text-forest-700 border border-forest-100'
                              : isOnLeave
                              ? 'bg-warmamber-50 text-warmamber-600 border border-warmamber-100'
                              : 'bg-terracotta-50 text-terracotta-500 border border-terracotta-100'
                          }`}>
                            {isCancelled ? 'Subscription Cancelled' : customer.todayDeliveryStatus}
                          </span>
                        </div>

                        <div className="flex items-start gap-2 text-xs text-charcoal-muted">
                          <MapPin className="w-4 h-4 text-terracotta-500 flex-shrink-0 mt-0.5" />
                          <span className="leading-relaxed font-semibold">{customer.address}</span>
                        </div>

                        {/* Dedicated Delivery Driver Notes (Drop-off & Gate Instructions) */}
                        {customer.deliveryNotes && (
                          <div className="p-3.5 rounded-2xl bg-forest-50/90 border border-forest-200/80 text-xs text-charcoal space-y-1">
                            <span className="font-bold text-forest-800 flex items-center gap-1.5 text-[10px] uppercase tracking-wider">
                              <Bike className="w-3.5 h-3.5 text-forest-700" />
                              <span>Delivery Driver Instructions:</span>
                            </span>
                            <p className="font-semibold text-charcoal leading-relaxed">
                              {customer.deliveryNotes}
                            </p>
                          </div>
                        )}

                        {customer.autoPickupDue && customer.autoPickupDue.isDue ? (
                          <div className="p-3 rounded-2xl bg-warmamber-50 border border-warmamber-200 text-xs text-warmamber-900 space-y-1">
                            <span className="font-bold flex items-center gap-1.5 text-[11px] uppercase tracking-wider text-warmamber-800">
                              <AlertTriangle className="w-3.5 h-3.5 text-warmamber-600" />
                              <span>⚠️ Auto-Pickup Scheduled ({customer.autoPickupDue.pickupDay}):</span>
                            </span>
                            <p className="font-semibold text-charcoal leading-relaxed">
                              Collect Dabba <strong>{customer.autoPickupDue.dabbaId}</strong> ({customer.autoPickupDue.note})
                            </p>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2 text-xs text-charcoal-muted">
                            <Package className="w-4 h-4 text-forest-700" />
                            <span>Empty boxes to collect back: <strong>{customer.dabbasHeld.length > 0 ? customer.dabbasHeld.join(', ') : 'None'}</strong></span>
                          </div>
                        )}
                      </div>

                      {/* Driver Action Cluster */}
                      <div className="flex flex-col sm:flex-row md:flex-col items-end gap-3 flex-shrink-0">
                        
                        <div className="flex items-center gap-2">
                          <a
                            href={`tel:${customer.phone}`}
                            title="Call Customer"
                            className="w-10 h-10 rounded-2xl bg-cream-100 border border-edge flex items-center justify-center text-charcoal hover:bg-cream-200 apple-press"
                          >
                            <Phone className="w-4 h-4" />
                          </a>
                          <a
                            href={`https://wa.me/${customer.phone.replace(/[^0-9]/g, '')}`}
                            target="_blank"
                            rel="noreferrer"
                            title="WhatsApp Customer"
                            className="w-10 h-10 rounded-2xl bg-cream-100 border border-edge flex items-center justify-center text-forest-700 hover:bg-cream-200 apple-press"
                          >
                            <MessageSquare className="w-4 h-4" />
                          </a>
                          <a
                            href={customer.mapLink}
                            target="_blank"
                            rel="noreferrer"
                            title="Google Maps Navigation"
                            className="w-10 h-10 rounded-2xl bg-cream-100 border border-edge flex items-center justify-center text-terracotta-500 hover:bg-cream-200 apple-press"
                          >
                            <Navigation className="w-4 h-4" />
                          </a>

                          <button
                            onClick={() => moveStop(index, -1)}
                            disabled={index === 0}
                            title="Move stop earlier"
                            className="w-10 h-10 rounded-2xl bg-cream-100 border border-edge flex items-center justify-center text-charcoal disabled:opacity-30 apple-press font-bold text-xs"
                          >
                            &uarr;
                          </button>
                          <button
                            onClick={() => moveStop(index, 1)}
                            disabled={index === orderList.length - 1}
                            title="Move stop later"
                            className="w-10 h-10 rounded-2xl bg-cream-100 border border-edge flex items-center justify-center text-charcoal disabled:opacity-30 apple-press font-bold text-xs"
                          >
                            &darr;
                          </button>
                        </div>

                        <div className="flex items-center gap-2 mt-1">
                          {isCancelled ? (
                            <div className="flex items-center gap-2">
                              {customer.dabbasHeld.length > 0 ? (
                                <>
                                  <span className="text-xs font-bold text-rose-800 flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-50 border border-rose-200">
                                    <span>Final Dabba Pickup Only</span>
                                  </span>
                                  <button
                                    onClick={() => onScanDabba('return', customer.id)}
                                    className="px-4 py-2 text-xs font-bold rounded-xl bg-terracotta-500 text-white hover:bg-terracotta-600 flex items-center gap-2 apple-press shadow-apple-sm"
                                    title="Scan and collect circular tiffin box from cancelled customer"
                                  >
                                    <QrCode className="w-4 h-4" />
                                    <span>Collect Dabba ({customer.dabbasHeld.length})</span>
                                  </button>
                                </>
                              ) : (
                                <span className="text-xs font-bold text-charcoal-muted flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-cream-100 border border-edge">
                                  <CheckCircle2 className="w-4 h-4 text-forest-600" />
                                  <span>Subscription Cancelled • No Boxes Pending</span>
                                </span>
                              )}
                            </div>
                          ) : !isDelivered && !isOnLeave ? (
                            <>
                              <button
                                onClick={() => onScanDabba('deliver', customer.id)}
                                className="px-4 py-2.5 text-xs font-bold rounded-xl bg-forest-700 text-white hover:bg-forest-800 flex items-center gap-2 apple-press shadow-apple-sm"
                              >
                                <QrCode className="w-4 h-4" />
                                <span>Deliver Box</span>
                              </button>

                              {customer.dabbasHeld.length > 0 && (
                                <button
                                  onClick={() => onScanDabba('return', customer.id)}
                                  className="px-3.5 py-2.5 text-xs font-bold rounded-xl bg-warmamber-100 hover:bg-warmamber-200 text-warmamber-900 border border-warmamber-300 flex items-center gap-1.5 apple-press shadow-apple-sm"
                                  title="Collect empty return dabba"
                                >
                                  <QrCode className="w-4 h-4 text-warmamber-800" />
                                  <span>Collect ({customer.dabbasHeld.length})</span>
                                </button>
                              )}

                              <button
                                onClick={() => {
                                  onUpdateDeliveryStatus(customer.id, 'Missed');
                                  showToast(`Marked ${customer.name} as Missed.`);
                                }}
                                className="px-3.5 py-2.5 text-xs font-semibold rounded-xl border border-edge bg-white text-charcoal hover:bg-cream-100 apple-press"
                              >
                                Missed
                              </button>
                            </>
                          ) : isOnLeave ? (
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-bold text-warmamber-800 flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-warmamber-50 border border-warmamber-200">
                                <span>⏸️ Skip Stop (Customer On Leave)</span>
                              </span>
                              {customer.dabbasHeld.length > 0 && (
                                <button
                                  onClick={() => onScanDabba('return', customer.id)}
                                  className="px-3.5 py-1.5 text-xs font-bold rounded-xl bg-terracotta-50 hover:bg-terracotta-100 text-terracotta-700 border border-terracotta-200 flex items-center gap-1.5 apple-press shadow-apple-sm"
                                  title="Collect empty dabba if customer is home"
                                >
                                  <QrCode className="w-3.5 h-3.5" />
                                  <span>Collect Dabba ({customer.dabbasHeld.length})</span>
                                </button>
                              )}
                            </div>
                          ) : (
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-bold text-forest-700 flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-forest-50 border border-forest-100">
                                <CheckCircle2 className="w-4 h-4" />
                                <span>Delivered</span>
                              </span>
                              
                              {customer.dabbasHeld.length > 0 && (
                                <button
                                  onClick={() => onScanDabba('return', customer.id)}
                                  className="px-4 py-2 text-xs font-bold rounded-xl bg-terracotta-500 text-white hover:bg-terracotta-600 flex items-center gap-2 apple-press shadow-apple-sm"
                                >
                                  <QrCode className="w-4 h-4" />
                                  <span>Collect Return</span>
                                </button>
                              )}
                            </div>
                          )}
                        </div>

                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Driver Sidebar (Col-span 4) */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* Bag Inventory HUD */}
            <div className="bg-white rounded-3xl p-6 sm:p-7 border border-edge shadow-apple-card space-y-4">
              <span className="text-xs font-bold text-charcoal-muted uppercase tracking-wider block">Driver Backpack Status</span>
              
              <div className="grid grid-cols-2 gap-3 pt-1">
                <div className="p-4 rounded-2xl bg-cream-50 border border-edge">
                  <span className="text-[11px] font-bold text-charcoal-muted block">Meals Left</span>
                  <span className="text-3xl font-extrabold text-charcoal mt-1 block">
                    {orderList.filter(c => c.todayDeliveryStatus === 'Pending').length}
                  </span>
                  <span className="text-[10px] text-charcoal-muted mt-1 block">To be delivered</span>
                </div>

                <div className="p-4 rounded-2xl bg-forest-50 border border-forest-100">
                  <span className="text-[11px] font-bold text-forest-700 block">Returns in Bag</span>
                  <span className="text-3xl font-extrabold text-forest-800 mt-1 block">
                    {deliveryBoy.collectedReturnDabbas.length}
                  </span>
                  <span className="text-[10px] text-forest-700 mt-1 block">Ready for Godown</span>
                </div>
              </div>

              {deliveryBoy.collectedReturnDabbas.length > 0 && (
                <button
                  onClick={() => setActiveTab('handover')}
                  className="w-full py-3 text-xs font-bold rounded-2xl bg-forest-700 text-white hover:bg-forest-800 apple-press shadow-apple-sm flex items-center justify-center gap-2"
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>Handover {deliveryBoy.collectedReturnDabbas.length} Boxes to Godown</span>
                </button>
              )}
            </div>

            {/* Quick Unreturned Box Alert List */}
            <div className="bg-white rounded-3xl p-6 border border-edge shadow-apple-card space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-charcoal uppercase tracking-wider">Unreturned Boxes Warning</span>
                <span className="text-xs font-bold text-terracotta-500">{customersWithPendingBoxes.length} Pending</span>
              </div>
              <p className="text-xs text-charcoal-muted">
                Customers holding boxes from past days. Send a chime before reaching their building.
              </p>

              <div className="space-y-2 pt-1">
                {customersWithPendingBoxes.slice(0, 2).map((c) => (
                  <div key={c.id} className="p-3 bg-cream-50 rounded-2xl border border-edge flex items-center justify-between text-xs">
                    <div>
                      <span className="font-bold text-charcoal block">{c.name}</span>
                      <span className="text-charcoal-muted text-[11px]">Holding: {c.dabbasHeld.join(', ')}</span>
                    </div>
                    <button
                      onClick={() => {
                        onSendReturnAlert(c.id);
                        showToast(`Push reminder sent to ${c.name}`);
                      }}
                      className="px-2.5 py-1 text-[11px] font-bold rounded-lg bg-warmamber-500 text-white apple-press"
                    >
                      Remind
                    </button>
                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>
      )}

      {/* UNRETURNED BOX RADAR */}
      {activeTab === 'radar' && (
        <div className="bg-white rounded-3xl p-7 border border-edge shadow-apple-card space-y-5">
          <div className="border-b border-edge/80 pb-4">
            <h2 className="text-lg font-bold text-charcoal tracking-tight">Pending Dabba Recovery Radar</h2>
            <p className="text-xs text-charcoal-muted mt-1 leading-relaxed">
              Customers still holding empty boxes from previous days. Send a push notification chime before arriving to remind them to keep boxes ready.
            </p>
          </div>

          <div className="space-y-3.5">
            {customersWithPendingBoxes.map((customer) => (
              <div 
                key={customer.id} 
                className="p-5 rounded-2xl border border-edge bg-cream-50/70 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div>
                  <div className="flex items-center gap-2.5">
                    <span className="text-sm font-bold text-charcoal">{customer.name}</span>
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-terracotta-50 text-terracotta-500 border border-terracotta-100">
                      Holding {customer.dabbasHeld.length} Box(es)
                    </span>
                  </div>
                  <p className="text-xs text-charcoal-muted mt-1">
                    Unreturned Box Barcodes: <strong>{customer.dabbasHeld.join(', ')}</strong>
                  </p>
                  <p className="text-[11px] text-charcoal-muted mt-0.5">{customer.address}</p>
                </div>

                <div className="flex items-center gap-2.5 flex-shrink-0">
                  <button
                    onClick={() => {
                      onSendReturnAlert(customer.id);
                      showToast(`Push reminder dispatched to ${customer.name}`);
                    }}
                    className="px-4 py-2 text-xs font-bold rounded-xl bg-warmamber-500 text-white hover:bg-warmamber-600 apple-press flex items-center gap-1.5 shadow-apple-sm"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Send Reminder</span>
                  </button>

                  <button
                    onClick={() => onScanDabba('return', customer.id)}
                    className="px-4 py-2 text-xs font-bold rounded-xl bg-forest-700 text-white hover:bg-forest-800 apple-press flex items-center gap-1.5 shadow-apple-sm"
                  >
                    <QrCode className="w-3.5 h-3.5" />
                    <span>Scan & Collect</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* GODOWN HANDOVER VIEW */}
      {activeTab === 'handover' && (
        <div className="bg-white rounded-3xl p-7 border border-edge shadow-apple-card space-y-5">
          <div className="border-b border-edge/80 pb-4 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-charcoal tracking-tight">Warehouse Box Check-in</h2>
              <p className="text-xs text-charcoal-muted mt-1">
                Hand over collected empty dabbas to kitchen sanitization rack.
              </p>
            </div>
            <span className="text-xs font-bold px-3 py-1 rounded-full bg-forest-100 text-forest-800">
              {deliveryBoy.collectedReturnDabbas.length} Boxes in backpack
            </span>
          </div>

          {deliveryBoy.collectedReturnDabbas.length > 0 ? (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {deliveryBoy.collectedReturnDabbas.map((code) => (
                  <div key={code} className="p-4 bg-cream-50 rounded-2xl border border-edge flex items-center justify-between gap-3 text-xs font-bold text-charcoal shadow-sm">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-xl bg-forest-50 border border-forest-100 flex items-center justify-center text-forest-700">
                        <Package className="w-4 h-4" />
                      </div>
                      <span className="tracking-wide">{code}</span>
                    </div>
                    <button
                      onClick={() => onScanDabba('godown_intake', null)}
                      className="px-2.5 py-1 text-[11px] font-bold rounded-lg bg-white hover:bg-forest-50 text-forest-800 border border-forest-200 apple-press flex items-center gap-1 shadow-xs"
                      title="Scan QR to verify into godown"
                    >
                      <QrCode className="w-3 h-3 text-forest-700" />
                      <span>Scan In</span>
                    </button>
                  </div>
                ))}
              </div>

              <div className="pt-4 border-t border-edge flex flex-col sm:flex-row items-center justify-between gap-3">
                <button
                  onClick={() => onScanDabba('godown_intake', null)}
                  className="w-full sm:w-auto px-5 py-3 text-xs font-bold rounded-2xl bg-white border border-forest-600 text-forest-800 hover:bg-forest-50 apple-press shadow-apple-sm flex items-center justify-center gap-2"
                >
                  <QrCode className="w-4 h-4 text-forest-700" />
                  <span>Scan Box QR (Physical Verification)</span>
                </button>

                <button
                  onClick={() => {
                    onHandoverToGodown(deliveryBoy.id);
                    showToast("All boxes verified & transferred to Godown Sanitization Rack!");
                  }}
                  className="w-full sm:w-auto px-6 py-3 text-xs font-bold rounded-2xl bg-forest-700 text-white hover:bg-forest-800 apple-press shadow-apple-sm flex items-center justify-center gap-2"
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>Transfer Custody to Godown Sanitization</span>
                </button>
              </div>
            </div>
          ) : (
            <p className="text-xs text-charcoal-muted italic py-8 text-center">
              No un-checked boxes currently in your delivery bag.
            </p>
          )}
        </div>
      )}

    </div>
  );
}
