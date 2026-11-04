import React, { useState, useEffect } from 'react';
import CopilotHeader from './components/CopilotHeader';
import CopilotTaskList from './components/CopilotTaskList';
import CopilotMapView from './components/CopilotMapView';
import CopilotQRScanner from './components/CopilotQRScanner';
import CopilotNotAvailableModal from './components/CopilotNotAvailableModal';
import { 
  QrCode, 
  Map, 
  List, 
  CheckCircle2, 
  AlertTriangle, 
  Sparkles, 
  Columns, 
  Maximize2
} from 'lucide-react';
import { playCopilotSound, triggerHaptic } from './services/copilotSync';

export default function DriverCopilotApp({
  deliveryBoys = [],
  customers = [],
  dabbas = [],
  onUpdateDeliveryStatus,
  onScanDabba,
  onReportIssue,
  onExitToAdmin
}) {
  // 1. Active Driver State
  const [activeDriver, setActiveDriver] = useState(() => {
    return deliveryBoys && deliveryBoys.length > 0 ? deliveryBoys[0] : null;
  });

  // Keep activeDriver synced if deliveryBoys prop updates
  useEffect(() => {
    if (deliveryBoys && deliveryBoys.length > 0) {
      setActiveDriver(prev => {
        if (!prev) return deliveryBoys[0];
        const match = deliveryBoys.find(b => b.id === prev.id);
        return match || deliveryBoys[0];
      });
    }
  }, [deliveryBoys]);

  // 2. Derive Stops for Active Driver
  const assignedCustomerIds = activeDriver?.assignedCustomerIds || [];
  const assignedCustomers = customers.filter(c => assignedCustomerIds.includes(c.id));
  
  // Fallback to all customers if driver has none assigned (ensures rich display)
  const displayStops = assignedCustomers.length > 0 ? assignedCustomers : customers.slice(0, 8);

  // 3. UI View States
  const [mobileView, setMobileView] = useState('tasks'); // 'tasks' | 'map'
  const [desktopLayout, setDesktopLayout] = useState('split'); // 'split' | 'tasks' | 'map'
  const [focusedStopId, setFocusedStopId] = useState(displayStops[0]?.id || null);

  // 4. Modals State
  const [scannerModal, setScannerModal] = useState({
    isOpen: false,
    targetCustomer: null,
    expectedDabba: null
  });

  const [notAvailableModal, setNotAvailableModal] = useState({
    isOpen: false,
    targetCustomer: null
  });

  // 5. Toast Feedback
  const [toast, setToast] = useState(null);
  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  // Metrics
  const totalStops = displayStops.length;
  const completedStops = displayStops.filter(s => s.todayDeliveryStatus === 'Delivered').length;
  const pendingStops = displayStops.filter(s => 
    s.todayDeliveryStatus !== 'Delivered' && 
    s.todayDeliveryStatus !== 'Not Available' && 
    s.todayDeliveryStatus !== 'On Leave'
  ).length;
  const issuesCount = displayStops.filter(s => s.todayDeliveryStatus === 'Not Available' || s.deliveryIssue).length;

  // Handle Scan Open
  const handleOpenScanner = (customer = null) => {
    const expectedDabba = customer?.dabbasHeld && customer.dabbasHeld.length > 0 
      ? customer.dabbasHeld[0] 
      : (customer?.lastDelivery?.dabbaId || 'DB-101');

    setScannerModal({
      isOpen: true,
      targetCustomer: customer,
      expectedDabba
    });
  };

  // Handle Scan Success Confirmation
  const handleScanSuccess = (scannedCode, targetCustomer) => {
    playCopilotSound('success');
    triggerHaptic([100, 50, 150]);

    const customer = targetCustomer || (focusedStopId ? displayStops.find(s => s.id === focusedStopId) : displayStops[0]);
    if (customer && onUpdateDeliveryStatus) {
      onUpdateDeliveryStatus(customer.id, 'Delivered');
    }

    if (onScanDabba) {
      onScanDabba(scannedCode, 'deliver', customer?.id);
    }

    showToast(`Dabba #${scannedCode} verified! Delivered to ${customer?.name || 'Customer'}.`, 'success');
  };

  // Handle Not Available Report Submit
  const handleNotAvailableSubmit = (reportData) => {
    playCopilotSound('alert');
    triggerHaptic([100, 50, 100]);

    if (onUpdateDeliveryStatus) {
      onUpdateDeliveryStatus(reportData.customerId, 'Not Available');
    }

    if (onReportIssue) {
      onReportIssue(reportData);
    }

    showToast(`Alert sent to Admin: ${reportData.customerName} - ${reportData.reasonLabel}`, 'alert');
  };

  // Handle Re-attempt Delivery
  const handleReattemptDelivery = (customerId) => {
    if (onUpdateDeliveryStatus) {
      onUpdateDeliveryStatus(customerId, 'Pending');
    }
    showToast("Stop reset to Pending. Ready for re-attempt.", 'success');
  };

  return (
    <div className="min-h-screen bg-[#FAF9F5] text-charcoal font-apple flex flex-col antialiased selection:bg-forest-100 selection:text-forest-800">
      
      {/* 1. Header */}
      <CopilotHeader
        activeDriver={activeDriver}
        deliveryBoys={deliveryBoys}
        onSelectDriver={setActiveDriver}
        totalStops={totalStops}
        completedStops={completedStops}
        pendingStops={pendingStops}
        issuesCount={issuesCount}
        onExitToAdmin={onExitToAdmin}
      />

      {/* 2. Responsive Toolbar (Mobile Tabs & Desktop View Mode Switcher) */}
      <div className="max-w-[1520px] w-full mx-auto px-3 sm:px-6 lg:px-8 pt-3 pb-2 flex items-center justify-between gap-3">
        
        {/* Mobile View Toggle Pills (Visible only on mobile < lg) */}
        <div className="flex lg:hidden items-center p-1 bg-white rounded-2xl border border-edge shadow-sm w-full">
          <button
            type="button"
            onClick={() => setMobileView('tasks')}
            className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all apple-press ${
              mobileView === 'tasks'
                ? 'bg-forest-700 text-cream-50 shadow-sm'
                : 'text-charcoal-muted hover:text-charcoal'
            }`}
          >
            <List className="w-3.5 h-3.5" />
            <span>Tasks ({displayStops.length})</span>
          </button>
          <button
            type="button"
            onClick={() => setMobileView('map')}
            className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all apple-press ${
              mobileView === 'map'
                ? 'bg-forest-700 text-cream-50 shadow-sm'
                : 'text-charcoal-muted hover:text-charcoal'
            }`}
          >
            <Map className="w-3.5 h-3.5" />
            <span>Route Map</span>
          </button>
        </div>

        {/* Desktop View Switcher (Visible only on PC/Laptop >= lg) */}
        <div className="hidden lg:flex items-center justify-between w-full">
          <div className="flex items-center gap-2 text-xs font-bold text-charcoal">
            <span className="w-2.5 h-2.5 rounded-full bg-forest-700 inline-block" />
            <span>{activeDriver?.name || 'Driver'} Active Route:</span>
            <span className="text-charcoal-muted font-medium">
              {activeDriver?.routeZone || 'KT Road, Alipiri & Balaji Colony'}
            </span>
          </div>

          <div className="flex items-center gap-1.5 p-1 bg-white rounded-2xl border border-edge shadow-sm">
            <button
              type="button"
              onClick={() => setDesktopLayout('split')}
              className={`py-1.5 px-3 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all apple-press ${
                desktopLayout === 'split' 
                  ? 'bg-forest-700 text-cream-50 shadow-sm' 
                  : 'text-charcoal-muted hover:text-charcoal'
              }`}
            >
              <Columns className="w-3.5 h-3.5" />
              <span>Split View</span>
            </button>
            <button
              type="button"
              onClick={() => setDesktopLayout('tasks')}
              className={`py-1.5 px-3 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all apple-press ${
                desktopLayout === 'tasks' 
                  ? 'bg-forest-700 text-cream-50 shadow-sm' 
                  : 'text-charcoal-muted hover:text-charcoal'
              }`}
            >
              <List className="w-3.5 h-3.5" />
              <span>Tasks Only</span>
            </button>
            <button
              type="button"
              onClick={() => setDesktopLayout('map')}
              className={`py-1.5 px-3 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all apple-press ${
                desktopLayout === 'map' 
                  ? 'bg-forest-700 text-cream-50 shadow-sm' 
                  : 'text-charcoal-muted hover:text-charcoal'
              }`}
            >
              <Map className="w-3.5 h-3.5" />
              <span>Map Only</span>
            </button>
          </div>
        </div>

      </div>

      {/* 3. Main Dynamic Content Area (Mobile & PC Responsive) */}
      <main className="flex-1 max-w-[1520px] w-full mx-auto px-3 sm:px-6 lg:px-8 pb-24 lg:pb-8 flex flex-col">
        
        {/* PC Layout: Split View / Full View */}
        <div className="hidden lg:flex flex-1 gap-6 items-stretch min-h-[580px]">
          
          {/* Tasks Column */}
          {(desktopLayout === 'split' || desktopLayout === 'tasks') && (
            <div className={`${desktopLayout === 'split' ? 'w-[48%] xl:w-[45%]' : 'w-full'} flex flex-col`}>
              <CopilotTaskList
                stops={displayStops}
                focusedStopId={focusedStopId}
                onSelectStop={setFocusedStopId}
                onOpenScanner={handleOpenScanner}
                onOpenNotAvailable={(customer) => setNotAvailableModal({ isOpen: true, targetCustomer: customer })}
                onReattemptDelivery={handleReattemptDelivery}
              />
            </div>
          )}

          {/* Map Column */}
          {(desktopLayout === 'split' || desktopLayout === 'map') && (
            <div className={`${desktopLayout === 'split' ? 'flex-1' : 'w-full'} flex flex-col`}>
              <CopilotMapView
                stops={displayStops}
                focusedStopId={focusedStopId}
                onSelectStop={setFocusedStopId}
                onOpenScanner={handleOpenScanner}
                onOpenNotAvailable={(customer) => setNotAvailableModal({ isOpen: true, targetCustomer: customer })}
              />
            </div>
          )}

        </div>

        {/* Mobile Layout: Toggle between Tasks and Map */}
        <div className="flex lg:hidden flex-1 flex-col">
          {mobileView === 'tasks' ? (
            <CopilotTaskList
              stops={displayStops}
              focusedStopId={focusedStopId}
              onSelectStop={setFocusedStopId}
              onOpenScanner={handleOpenScanner}
              onOpenNotAvailable={(customer) => setNotAvailableModal({ isOpen: true, targetCustomer: customer })}
              onReattemptDelivery={handleReattemptDelivery}
            />
          ) : (
            <div className="h-[75vh] w-full">
              <CopilotMapView
                stops={displayStops}
                focusedStopId={focusedStopId}
                onSelectStop={setFocusedStopId}
                onOpenScanner={handleOpenScanner}
                onOpenNotAvailable={(customer) => setNotAvailableModal({ isOpen: true, targetCustomer: customer })}
              />
            </div>
          )}
        </div>

      </main>

      {/* 4. Mobile Floating Bottom Action Bar */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-30 p-3 bg-white/95 backdrop-blur-xl border-t border-edge flex items-center justify-between gap-3 shadow-apple-modal">
        <div className="flex items-center gap-2 pl-2">
          <span className="w-2.5 h-2.5 rounded-full bg-[#2E7D32]" />
          <span className="text-xs font-bold text-charcoal">
            {completedStops} / {totalStops} Done
          </span>
        </div>

        <button
          type="button"
          onClick={() => handleOpenScanner(null)}
          className="py-3 px-5 rounded-2xl bg-forest-700 hover:bg-forest-800 text-cream-50 text-xs font-bold flex items-center gap-2 shadow-md transition-all apple-press"
        >
          <QrCode className="w-4 h-4 text-cream-100" />
          <span>Scan Dabba QR</span>
        </button>
      </div>

      {/* 5. Modals */}
      <CopilotQRScanner
        isOpen={scannerModal.isOpen}
        onClose={() => setScannerModal(prev => ({ ...prev, isOpen: false }))}
        targetCustomer={scannerModal.targetCustomer}
        expectedDabba={scannerModal.expectedDabba}
        allAvailableDabbas={dabbas}
        onScanSuccess={handleScanSuccess}
      />

      <CopilotNotAvailableModal
        isOpen={notAvailableModal.isOpen}
        onClose={() => setNotAvailableModal({ isOpen: false, targetCustomer: null })}
        customer={notAvailableModal.targetCustomer}
        onSubmitReport={handleNotAvailableSubmit}
      />

      {/* 6. Toast Notification */}
      {toast && (
        <div className={`fixed bottom-16 sm:bottom-6 right-4 sm:right-6 z-[130] px-4 py-3 rounded-2xl shadow-2xl border text-xs font-bold flex items-center gap-2.5 animate-slide-up ${
          toast.type === 'alert'
            ? 'bg-terracotta-700 text-cream-50 border-terracotta-800'
            : 'bg-forest-800 text-cream-50 border-forest-900'
        }`}>
          {toast.type === 'alert' ? (
            <AlertTriangle className="w-4 h-4 text-cream-100 flex-shrink-0" />
          ) : (
            <CheckCircle2 className="w-4 h-4 text-forest-200 flex-shrink-0" />
          )}
          <span>{toast.message}</span>
        </div>
      )}

    </div>
  );
}
