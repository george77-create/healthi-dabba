import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { 
  Calendar, 
  CreditCard, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  Package, 
  QrCode, 
  Phone, 
  MessageSquare, 
  MapPin, 
  ArrowRight, 
  ShieldCheck, 
  Utensils, 
  History, 
  Info, 
  CalendarDays, 
  Send,
  Bike,
  Search,
  UserCheck,
  X,
  Edit2,
  ChefHat,
  Play,
  Pause,
  XCircle,
  RotateCw,
  AlertTriangle,
  Plus,
  Dumbbell,
  Scale,
  Flame
} from 'lucide-react';

function PortalModal({ children }) {
  if (typeof document === 'undefined') return null;
  return createPortal(children, document.body);
}

export default function CustomerPortal({ 
  customer, 
  customers = [],
  dailyMenu = {},
  onSelectCustomer,
  onApplyLeave, 
  onScheduleLeave,
  onToggleSkipToday,
  onCancelSubscription,
  onReactivateSubscription,
  onMakePayment, 
  onUpdateCustomerMeal,
  onAllotDishes,
  onReportIssue 
}) {
  const isUnsun = customer.subscriptionType && customer.subscriptionType.includes('UNSUN');
  const planDishes = (isUnsun ? dailyMenu.unsun : dailyMenu.alternative2) || [];
  
  // Allotted dishes stats
  const customerAllottedIds = customer.allottedDishIds || planDishes.map(d => d.id);
  const allottedDishesList = planDishes.filter(d => customerAllottedIds.includes(d.id));
  const totalAllottedProtein = allottedDishesList.reduce((acc, d) => acc + (parseInt(d.protein, 10) || 0), 0);
  const totalAllottedWeight = allottedDishesList.reduce((acc, d) => acc + (parseInt(d.weight || d.quantity, 10) || 0), 0);

  const [activeTab, setActiveTab] = useState('hub'); // 'hub' | 'leave' | 'billing' | 'support'
  const [customerSearchQuery, setCustomerSearchQuery] = useState('');
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);
  const searchContainerRef = useRef(null);

  const [leaveFrom, setLeaveFrom] = useState('');
  const [leaveTo, setLeaveTo] = useState('');
  const [leaveReason, setLeaveReason] = useState('Travel / Out of town');
  const [complaintText, setComplaintText] = useState('');
  const [complaintCategory, setComplaintCategory] = useState('Meal Taste / Freshness');
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedPayMethod, setSelectedPayMethod] = useState('upi');

  // Cancellation State
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelReason, setCancelReason] = useState('Relocating / Moving out of city');

  // Dish Allotment Modal State
  const [showAllotDishModal, setShowAllotDishModal] = useState(false);

  // Meal Customization State
  const [showEditDietModal, setShowEditDietModal] = useState(false);
  const [customDietNote, setCustomDietNote] = useState('');
  const [customDeliveryNote, setCustomDeliveryNote] = useState('');
  const [customPlan, setCustomPlan] = useState('');
  const [customChosenDay, setCustomChosenDay] = useState('Wednesday');
  const [toastMessage, setToastMessage] = useState(null);

  const handleToggleDishAllotment = (dishId) => {
    const currentAllotted = customer.allottedDishIds || planDishes.map(d => d.id);
    let updated;
    if (currentAllotted.includes(dishId)) {
      if (currentAllotted.length <= 1) {
        showToast("At least 1 dish must remain in your daily tiffin box.");
        return;
      }
      updated = currentAllotted.filter(id => id !== dishId);
      showToast("Dish removed from today's tiffin box.");
    } else {
      updated = [...currentAllotted, dishId];
      showToast("Dish allotted to today's tiffin box!");
    }
    if (onAllotDishes) {
      onAllotDishes(customer.id, updated);
    }
  };

  const handleAllotAllDishes = () => {
    const allIds = planDishes.map(d => d.id);
    if (onAllotDishes) {
      onAllotDishes(customer.id, allIds);
    }
    showToast("All plan dishes allotted to your tiffin box!");
  };

  // Close search dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target)) {
        setShowSearchDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Filtered customer search results
  const searchResults = customers.filter(c => 
    c.name.toLowerCase().includes(customerSearchQuery.toLowerCase()) ||
    c.id.toLowerCase().includes(customerSearchQuery.toLowerCase()) ||
    c.phone.includes(customerSearchQuery) ||
    c.address.toLowerCase().includes(customerSearchQuery.toLowerCase())
  );

  const handleExecuteSearch = (e) => {
    if (e) e.preventDefault();
    if (searchResults.length > 0 && onSelectCustomer) {
      onSelectCustomer(searchResults[0].id);
      showToast(`Loaded profile for ${searchResults[0].name}`);
      setShowSearchDropdown(false);
      setCustomerSearchQuery('');
    } else if (customerSearchQuery) {
      showToast(`No customer found matching "${customerSearchQuery}"`);
    }
  };

  const handlePickCustomer = (targetCust) => {
    if (onSelectCustomer) {
      onSelectCustomer(targetCust.id);
      showToast(`Switched to ${targetCust.name}'s Dashboard`);
      setShowSearchDropdown(false);
      setCustomerSearchQuery('');
    }
  };

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const calculateDays = () => {
    if (!leaveFrom || !leaveTo) return 0;
    const start = new Date(leaveFrom);
    const end = new Date(leaveTo);
    const diffTime = end - start;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
    return diffDays > 0 ? diffDays : 0;
  };
  const leaveDays = calculateDays();

  const handleLeaveSubmit = (e) => {
    e.preventDefault();
    if (leaveDays <= 0) {
      alert("Please select a valid date range.");
      return;
    }
    onApplyLeave(customer.id, {
      from: leaveFrom,
      to: leaveTo,
      days: leaveDays,
      reason: leaveReason
    });
    showToast(`Leave applied! Subscription auto-extended by ${leaveDays} day(s).`);
    setLeaveFrom('');
    setLeaveTo('');
    setActiveTab('hub');
  };

  const handlePaymentSubmit = () => {
    onMakePayment(customer.id, selectedPayMethod);
    setShowPaymentModal(false);
    showToast(`Payment of ₹2,400 received via ${selectedPayMethod.toUpperCase()}!`);
  };

  const handleIssueSubmit = (e) => {
    e.preventDefault();
    if (!complaintText.trim()) return;
    onReportIssue(customer.id, {
      category: complaintCategory,
      text: complaintText
    });
    setComplaintText('');
    showToast("Ticket registered. Kitchen & Customer Success team notified.");
  };

  return (
    <div className="space-y-6 w-full max-w-[1520px] mx-auto">
      
      {/* Toast notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-charcoal text-cream-50 px-5 py-3.5 rounded-2xl shadow-apple-modal border border-edge text-xs font-semibold flex items-center gap-2.5 animate-bounce">
          <CheckCircle2 className="w-4 h-4 text-forest-100" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* 1. SEPARATE TOP SEARCH BAR (Placed cleanly on top) */}
      <div className="bg-white rounded-3xl p-4 sm:p-5 border border-edge shadow-apple-card flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        
        {/* Search Label / Context */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-forest-50 border border-forest-100 flex items-center justify-center text-forest-700 flex-shrink-0">
            <Search className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs font-bold text-charcoal uppercase tracking-wider block">
              Search & Switch Customer Profile
            </span>
            <p className="text-xs text-charcoal-muted">
              Viewing: <strong className="text-forest-700">{customer.name}</strong> ({customer.id})
            </p>
          </div>
        </div>

        {/* Dedicated Search Input & Button */}
        <div ref={searchContainerRef} className="relative w-full sm:max-w-md">
          <form onSubmit={handleExecuteSearch} className="flex items-center gap-2">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-charcoal-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search specific customer by Name, Phone, or ID..."
                value={customerSearchQuery}
                onFocus={() => setShowSearchDropdown(true)}
                onChange={(e) => {
                  setCustomerSearchQuery(e.target.value);
                  setShowSearchDropdown(true);
                }}
                className="w-full pl-10 pr-8 py-2.5 text-xs rounded-2xl border border-edge bg-cream-50 focus:outline-none focus:border-forest-600 focus:bg-white text-charcoal font-semibold shadow-inner"
              />
              {customerSearchQuery && (
                <button
                  type="button"
                  onClick={() => setCustomerSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-charcoal-muted hover:text-charcoal"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Dedicated Search Button */}
            <button
              type="submit"
              className="px-5 py-2.5 text-xs font-bold rounded-2xl bg-forest-700 text-white hover:bg-forest-800 apple-press shadow-apple-sm flex items-center gap-1.5 flex-shrink-0"
            >
              <Search className="w-3.5 h-3.5" />
              <span>Search</span>
            </button>
          </form>

          {/* Autocomplete Dropdown */}
          {showSearchDropdown && searchResults.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-2 z-50 bg-white rounded-2xl shadow-apple-modal border border-edge p-2 space-y-1 max-h-64 overflow-y-auto no-scrollbar animate-fade-in">
              <span className="text-[10px] font-bold text-charcoal-muted uppercase tracking-wider px-3 py-1 block">
                Matching Profiles ({searchResults.length} Found)
              </span>
              {searchResults.map((cust) => (
                <button
                  key={cust.id}
                  type="button"
                  onClick={() => handlePickCustomer(cust)}
                  className={`w-full text-left p-3 rounded-xl flex items-center justify-between transition-all apple-press ${
                    cust.id === customer.id ? 'bg-forest-50 border border-forest-100 text-forest-800 font-bold' : 'hover:bg-cream-50 text-charcoal'
                  }`}
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold">{cust.name}</span>
                      <span className="text-[10px] text-charcoal-muted font-mono">({cust.id})</span>
                    </div>
                    <span className="text-[11px] text-charcoal-muted block truncate">{cust.phone} • {cust.address}</span>
                  </div>

                  <span className={`text-[10px] px-2.5 py-0.5 rounded-full font-bold whitespace-nowrap ml-2 ${
                    cust.id === customer.id 
                      ? 'bg-forest-700 text-white' 
                      : cust.dabbasHeld.length > 0 
                      ? 'bg-terracotta-50 text-terracotta-500' 
                      : 'bg-cream-100 text-charcoal-muted'
                  }`}>
                    {cust.id === customer.id ? 'Active Profile' : `${cust.dabbasHeld.length} box(es)`}
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>

      </div>

      {/* 2. DEDICATED CUSTOMER PROFILE BANNER */}
      <div className="bg-white rounded-3xl p-6 sm:p-7 border border-edge shadow-apple-card flex flex-col md:flex-row md:items-center justify-between gap-5">
        
        {/* Left: Customer Info */}
        <div className="flex items-start gap-4">
          <div className="w-14 h-14 rounded-2xl bg-forest-50 border border-forest-100 flex items-center justify-center text-forest-700 flex-shrink-0">
            <Utensils className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center gap-2.5 flex-wrap">
              <h1 className="text-xl sm:text-2xl font-bold text-charcoal tracking-tight">{customer.name}</h1>
              {customer.subscriptionStatus === 'Cancelled' || customer.todayDeliveryStatus === 'Cancelled' ? (
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-rose-50 text-rose-700 border border-rose-200 flex items-center gap-1.5">
                  <XCircle className="w-3.5 h-3.5 text-rose-600" />
                  <span>Subscription Cancelled</span>
                </span>
              ) : (
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-forest-50 text-forest-700 border border-forest-100">
                  {customer.subscriptionType}
                </span>
              )}
            </div>
            <p className="text-xs text-charcoal-muted mt-1 flex items-center gap-1.5 flex-wrap">
              <MapPin className="w-4 h-4 text-terracotta-500 flex-shrink-0" />
              <span className="font-medium">{customer.address}</span>
            </p>
          </div>
        </div>

        {/* Right: Sub-tab navigation */}
        <div className="flex items-center gap-1 p-1 bg-cream-100 rounded-2xl border border-edge overflow-x-auto no-scrollbar flex-shrink-0">
          {[
            { id: 'hub', label: 'Live Dashboard' },
            { id: 'leave', label: 'Leave Planner' },
            { id: 'billing', label: 'Payments & Billing' },
            { id: 'support', label: 'Help & Care' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 sm:px-5 py-2 text-xs font-bold rounded-xl whitespace-nowrap apple-press transition-all ${
                activeTab === tab.id
                  ? 'bg-white text-forest-800 shadow-apple-sm'
                  : 'text-charcoal-muted hover:text-charcoal'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

      </div>

      {/* MAIN OVERVIEW / HUB VIEW: Expansive 2-Column Widescreen Layout */}
      {activeTab === 'hub' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
          
          {/* LEFT EXPANSIVE COLUMN (Col-span 8 on widescreen): Core Tracking & Operations */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* Today's Meal & Real-Time Delivery Tracker */}
            <div className="bg-white rounded-3xl p-6 sm:p-7 border border-edge shadow-apple-card space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-edge/80 pb-4">
                <div>
                  <span className="text-xs font-bold text-forest-700 uppercase tracking-wider block">Live Delivery Timeline</span>
                  <h2 className="text-lg sm:text-xl font-bold text-charcoal mt-0.5">Today's Meal Dispatch Status</h2>
                </div>
                <span className={`px-3.5 py-1.5 rounded-full text-xs font-bold self-start sm:self-auto ${
                  customer.subscriptionStatus === 'Cancelled' || customer.todayDeliveryStatus === 'Cancelled'
                    ? 'bg-rose-50 text-rose-700 border border-rose-200'
                    : customer.todayDeliveryStatus === 'Delivered'
                    ? 'bg-forest-50 text-forest-700 border border-forest-100'
                    : customer.todayDeliveryStatus === 'On Leave'
                    ? 'bg-warmamber-50 text-warmamber-600 border border-warmamber-100'
                    : 'bg-cream-100 text-charcoal-muted border border-edge'
                }`}>
                  ● {customer.subscriptionStatus === 'Cancelled' || customer.todayDeliveryStatus === 'Cancelled' ? 'Subscription Cancelled' : customer.todayDeliveryStatus}
                </span>
              </div>

              {/* Step-by-Step Delivery Flow (Expansive 4-Grid) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
                {[
                  { title: '1. Kitchen Prep', time: '06:15 AM', desc: 'Freshly packed & temperature sealed', done: true },
                  { title: '2. Route Handover', time: '07:30 AM', desc: 'Assigned to Driver Raju Kumar', done: true },
                  { 
                    title: '3. Doorstep Drop', 
                    time: customer.todayDeliveryStatus === 'Delivered' ? '11:30 AM' : 'Expected 12:00 PM', 
                    desc: customer.todayDeliveryStatus === 'Delivered' ? 'QR Scanned & Verified' : 'Driver en route', 
                    done: customer.todayDeliveryStatus === 'Delivered',
                    current: customer.todayDeliveryStatus !== 'Delivered' && customer.todayDeliveryStatus !== 'On Leave'
                  },
                  { 
                    title: '4. Empty Dabba Return', 
                    time: 'Next Morning', 
                    desc: 'Handover to delivery boy', 
                    done: false 
                  }
                ].map((step, idx) => (
                  <div 
                    key={idx} 
                    className={`p-4 sm:p-5 rounded-2xl border transition-all flex flex-col justify-between ${
                      step.done 
                        ? 'bg-forest-50/40 border-forest-100/90' 
                        : step.current 
                        ? 'bg-cream-100/80 border-forest-500 shadow-apple-sm' 
                        : 'bg-cream-50/50 border-edge/60 opacity-60'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-bold text-charcoal">{step.title}</span>
                        {step.done ? (
                          <CheckCircle2 className="w-4 h-4 text-forest-700" />
                        ) : (
                          <Clock className="w-4 h-4 text-charcoal-muted" />
                        )}
                      </div>
                      <span className="text-xs font-bold text-charcoal-muted block">{step.time}</span>
                    </div>
                    <p className="text-xs text-charcoal mt-2 leading-relaxed">{step.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Today's Curated Dish Lineup */}
            {planDishes && planDishes.length > 0 && (
              <div className="bg-white rounded-3xl p-6 sm:p-7 border border-edge shadow-apple-card space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-edge/80 pb-3">
                  <div>
                    <span className="text-xs font-bold text-forest-700 uppercase tracking-wider block">Nutrition Lineup</span>
                    <h3 className="text-base sm:text-lg font-bold text-charcoal mt-0.5">Today's Curated Menu Dishes</h3>
                  </div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-forest-50 text-forest-700 border border-forest-100">
                      {customer.subscriptionType.split('(')[0]} • {allottedDishesList.length}/{planDishes.length} Dishes Allotted ({totalAllottedProtein}g Protein • {totalAllottedWeight}g)
                    </span>
                    <button 
                      type="button"
                      onClick={() => setShowAllotDishModal(true)}
                      className="px-3 py-1.5 rounded-xl text-xs font-bold bg-forest-700 text-white hover:bg-forest-800 transition-colors flex items-center gap-1.5 shadow-apple-sm apple-press"
                      title="Click to customize and allot specific dishes to your box"
                    >
                      <Utensils className="w-3.5 h-3.5" />
                      <span>Allot Dishes</span>
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
                  {planDishes.map((dish) => {
                    const isAllotted = customerAllottedIds.includes(dish.id);
                    return (
                      <div 
                        key={dish.id} 
                        className={`rounded-2xl border transition-all flex flex-col justify-between group overflow-hidden ${
                          isAllotted 
                            ? 'border-forest-500 bg-forest-50/20 shadow-apple-card ring-1 ring-forest-500/20' 
                            : 'border-edge bg-white/70 opacity-75 hover:opacity-100 hover:border-edge-dark'
                        }`}
                      >
                        <div>
                          <div className="relative h-28 w-full bg-cream-100 overflow-hidden">
                            {dish.image ? (
                              <img 
                                src={dish.image} 
                                alt={dish.name} 
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center bg-cream-200/60 text-charcoal-muted">
                                <Utensils className="w-6 h-6 opacity-40" />
                              </div>
                            )}
                            <div className="absolute top-2 left-2">
                              <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-white/95 backdrop-blur-md text-forest-800 shadow-apple-sm">
                                {dish.category}
                              </span>
                            </div>
                            <div className="absolute top-2 right-2">
                              {isAllotted ? (
                                <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-forest-700 text-white shadow-apple-sm flex items-center gap-1">
                                  <CheckCircle2 className="w-2.5 h-2.5" /> Allotted
                                </span>
                              ) : (
                                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-charcoal/70 backdrop-blur-md text-white shadow-apple-sm">
                                  Optional
                                </span>
                              )}
                            </div>
                          </div>

                          <div className="p-3 space-y-1.5">
                            <h4 className="text-xs font-bold text-charcoal leading-snug line-clamp-1">
                              {dish.name}
                            </h4>

                            <div className="flex items-center gap-1.5 flex-wrap text-[10px] font-bold">
                              <span className="px-2 py-0.5 rounded-md bg-forest-50 text-forest-800 border border-forest-100">
                                💪 {dish.protein || '16g'}
                              </span>
                              <span className="px-2 py-0.5 rounded-md bg-white text-charcoal border border-edge">
                                ⚖️ {dish.weight || dish.quantity || '200g'}
                              </span>
                            </div>

                            <p className="text-[11px] text-charcoal-muted line-clamp-2 leading-relaxed pt-1">
                              {dish.ingredients}
                            </p>
                          </div>
                        </div>

                        <div className="p-3 pt-0">
                          <button
                            type="button"
                            onClick={() => handleToggleDishAllotment(dish.id)}
                            className={`w-full py-1.5 px-2.5 rounded-xl text-[11px] font-bold flex items-center justify-center gap-1.5 transition-all apple-press ${
                              isAllotted
                                ? 'bg-forest-100/90 text-forest-800 hover:bg-forest-200 border border-forest-200'
                                : 'bg-cream-100 text-charcoal hover:bg-forest-50 hover:text-forest-800 border border-edge'
                            }`}
                          >
                            {isAllotted ? (
                              <>
                                <CheckCircle2 className="w-3.5 h-3.5 text-forest-700" />
                                <span>In Dabba (Tap to remove)</span>
                              </>
                            ) : (
                              <>
                                <Plus className="w-3.5 h-3.5 text-charcoal-muted" />
                                <span>Allot to My Box</span>
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Dabba Circulation & Digital Passport (Key Feature) */}
            <div className="bg-white rounded-3xl p-6 sm:p-7 border border-edge shadow-apple-card space-y-5">
              <div className="flex items-center justify-between border-b border-edge/80 pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-forest-50 border border-forest-100 flex items-center justify-center text-forest-700">
                    <Package className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base sm:text-lg font-bold text-charcoal">Dabba Circulation Passport</h3>
                    <p className="text-xs text-charcoal-muted">QR-verified box tracking & return accountability</p>
                  </div>
                </div>
                <span className="text-xs font-bold px-3 py-1 rounded-full bg-cream-100 text-charcoal-muted border border-edge">
                  Zero Loss System
                </span>
              </div>

              {/* Automatic Next-Day Dabba Pickup Banner */}
              {customer.autoPickupDue && customer.autoPickupDue.isDue && (
                <div className="p-4 rounded-2xl bg-warmamber-50 border border-warmamber-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-apple-sm animate-fade-in">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-warmamber-100 border border-warmamber-300 flex items-center justify-center text-warmamber-800 flex-shrink-0">
                      <Package className="w-5 h-5 text-warmamber-700" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-warmamber-900 uppercase tracking-wider">
                          Automatic Next-Day Dabba Pickup
                        </span>
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-warmamber-200 text-warmamber-900 font-bold">
                          Auto-Scheduled
                        </span>
                      </div>
                      <p className="text-xs font-semibold text-charcoal mt-0.5">
                        Empty Dabba <strong>{customer.autoPickupDue.dabbaId}</strong> will be collected on <strong>{customer.autoPickupDue.pickupDay}</strong> ({customer.autoPickupDue.note}).
                      </p>
                    </div>
                  </div>
                  <span className="text-[11px] font-bold text-warmamber-800 bg-white px-3 py-1.5 rounded-xl border border-warmamber-200 self-start sm:self-auto shadow-sm">
                    Rinse & Keep Ready
                  </span>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                
                {/* Current Boxes in Custody */}
                <div className="p-5 rounded-2xl bg-cream-50 border border-edge flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs font-bold text-charcoal uppercase tracking-wider">With You Right Now</span>
                      <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-forest-100 text-forest-800">
                        {customer.dabbasHeld.length} Box(es)
                      </span>
                    </div>

                    {customer.dabbasHeld.length > 0 ? (
                      <div className="space-y-3 mt-3">
                        {customer.dabbasHeld.map((boxCode) => (
                          <div key={boxCode} className="p-3.5 bg-white rounded-xl border border-edge flex items-center justify-between shadow-apple-sm">
                            <div className="flex items-center gap-3">
                              <div className="w-9 h-9 rounded-lg bg-forest-50 border border-forest-100 flex items-center justify-center text-forest-700 font-bold text-xs">
                                <QrCode className="w-5 h-5" />
                              </div>
                              <div>
                                <span className="text-sm font-bold text-charcoal tracking-wide">{boxCode}</span>
                                <span className="text-[11px] text-charcoal-muted block">Insulated Stainless Steel Tiffin</span>
                              </div>
                            </div>
                            <span className="text-[11px] font-bold px-2.5 py-1 rounded-md bg-cream-100 text-charcoal-muted">
                              Held at Home
                            </span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-xs text-charcoal-muted italic py-4">No empty boxes currently held at your location.</p>
                    )}
                  </div>

                  <p className="text-xs text-charcoal-muted mt-5 pt-3 border-t border-edge/60 flex items-center gap-2">
                    <Info className="w-4 h-4 text-forest-600 flex-shrink-0" />
                    <span>Please rinse and keep ready for tomorrow morning's delivery pickup.</span>
                  </p>
                </div>

                {/* Handover & Lifetime Returns */}
                <div className="p-5 rounded-2xl bg-cream-50 border border-edge flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs font-bold text-charcoal uppercase tracking-wider">Handovers Today</span>
                      <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-forest-50 text-forest-700">
                        {customer.handedOverToday.length} Returned
                      </span>
                    </div>

                    {customer.handedOverToday.length > 0 ? (
                      <div className="space-y-3 mt-3">
                        {customer.handedOverToday.map((code) => (
                          <div key={code} className="p-3.5 bg-white rounded-xl border border-edge flex items-center justify-between shadow-apple-sm">
                            <div className="flex items-center gap-3">
                              <CheckCircle2 className="w-5 h-5 text-forest-700" />
                              <div>
                                <span className="text-sm font-bold text-charcoal">{code}</span>
                                <span className="text-[11px] text-forest-700 font-medium block">Scanned by Driver Raju</span>
                              </div>
                            </div>
                            <span className="text-[11px] text-forest-700 font-bold px-2 py-0.5 rounded bg-forest-50">
                              En route to Godown
                            </span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-xs text-charcoal-muted italic py-4">No returns handed over today yet.</p>
                    )}
                  </div>

                  <div className="mt-5 pt-3 border-t border-edge/60 flex items-center justify-between text-xs">
                    <span className="text-charcoal-muted font-medium">Total Lifetime Boxes Returned:</span>
                    <strong className="text-lg text-forest-700 font-extrabold">{customer.dabbasReturnedTotal} Boxes</strong>
                  </div>
                </div>

              </div>
            </div>

            {/* Dietary Customizations & Recent Leaves */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              <div className="bg-white rounded-3xl p-6 border border-edge shadow-apple-card space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-charcoal uppercase tracking-wider flex items-center gap-2">
                    <Utensils className="w-4 h-4 text-terracotta-500" />
                    <span>Meal & Delivery Customizations</span>
                  </h4>
                  <button
                    type="button"
                    onClick={() => {
                      setCustomDietNote(customer.kitchenNotes || customer.specialInstructions || '');
                      setCustomDeliveryNote(customer.deliveryNotes || '');
                      setCustomPlan(customer.subscriptionType || 'UNSUN — Alternate Days (Mon, Wed, Fri)');
                      setCustomChosenDay(customer.chosenDeliveryDay || 'Wednesday');
                      setShowEditDietModal(true);
                    }}
                    className="text-xs text-forest-700 font-bold hover:underline flex items-center gap-1 apple-press"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                    <span>Edit Notes</span>
                  </button>
                </div>

                {/* 1. Kitchen Dietary Note */}
                <div className="space-y-1">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-terracotta-700">
                    <ChefHat className="w-3.5 h-3.5" />
                    <span>Kitchen Dietary Note:</span>
                  </div>
                  <p className="text-xs text-charcoal bg-terracotta-50/60 p-3 rounded-2xl border border-terracotta-100 font-semibold leading-relaxed">
                    "{customer.kitchenNotes || customer.specialInstructions || 'Standard balanced portion'}"
                  </p>
                  <span className="text-[10px] text-charcoal-muted block">
                    👨‍🍳 Auto-printed onto daily packaging labels for kitchen chef.
                  </span>
                </div>

                {/* 2. Delivery Drop-off Note */}
                <div className="space-y-1 pt-2 border-t border-edge/60">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-forest-700">
                    <Bike className="w-3.5 h-3.5" />
                    <span>Delivery Handover Note:</span>
                  </div>
                  <p className="text-xs text-charcoal bg-forest-50/60 p-3 rounded-2xl border border-forest-100 font-semibold leading-relaxed">
                    "{customer.deliveryNotes || 'Standard doorstep delivery'}"
                  </p>
                  <span className="text-[10px] text-charcoal-muted block">
                    🚴 Visible to delivery partner in Driver Cockpit during dispatch.
                  </span>
                </div>
              </div>

              <div className="bg-white rounded-3xl p-6 border border-edge shadow-apple-card space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-charcoal uppercase tracking-wider flex items-center gap-2">
                    <History className="w-4 h-4 text-forest-700" />
                    <span>Approved Leaves & Extensions</span>
                  </h4>
                  <button
                    onClick={() => setActiveTab('leave')}
                    className="text-xs text-forest-700 font-bold hover:underline"
                  >
                    New Leave +
                  </button>
                </div>

                {customer.leaveHistory.length > 0 ? (
                  <div className="space-y-2">
                    {customer.leaveHistory.map((leave) => (
                      <div key={leave.id} className="p-3 rounded-2xl bg-cream-50 border border-edge text-xs flex items-center justify-between">
                        <div>
                          <span className="font-bold text-charcoal">{leave.from} to {leave.to}</span>
                          <span className="text-[11px] text-forest-700 block mt-0.5">
                            Auto-extended till: {leave.autoExtendedUntil}
                          </span>
                        </div>
                        <span className="px-2.5 py-1 rounded-full bg-forest-100 text-forest-800 text-[10px] font-bold">
                          {leave.days} Days Extended
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-charcoal-muted italic py-3">No leaves recorded in current subscription cycle.</p>
                )}
              </div>

            </div>

          </div>

          {/* RIGHT SIDEBAR COLUMN (Col-span 4 on widescreen): Subscription & Actions */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* Subscription Health & Days Gauge */}
            <div className="bg-white rounded-3xl p-6 sm:p-7 border border-edge shadow-apple-card space-y-5">
              {customer.subscriptionStatus === 'Cancelled' || customer.todayDeliveryStatus === 'Cancelled' ? (
                /* CANCELLED SUBSCRIPTION VIEW */
                <div className="space-y-4">
                  <div>
                    <span className="text-xs font-bold text-rose-700 uppercase tracking-wider block">Subscription Status</span>
                    <div className="mt-2 flex items-center gap-2">
                      <span className="text-2xl font-extrabold text-charcoal tracking-tight">Cancelled</span>
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-50 text-rose-700 border border-rose-200">
                        Inactive
                      </span>
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl bg-rose-50/70 border border-rose-200/80 space-y-2.5 text-xs text-charcoal">
                    <div className="flex items-center gap-1.5 text-rose-800 font-bold">
                      <XCircle className="w-4 h-4 text-rose-600 flex-shrink-0" />
                      <span>Cancelled on {customer.cancellationInfo?.cancelledAt || 'Recent'}</span>
                    </div>
                    <p className="text-[11px] text-charcoal-muted font-medium">
                      Reason: <em>"{customer.cancellationInfo?.reason || 'Customer requested'}"</em>
                    </p>
                    <div className="p-3 bg-white/90 rounded-xl border border-rose-100 space-y-1.5">
                      <div className="flex justify-between items-center">
                        <span className="text-charcoal-muted">Pro-Rata Refund:</span>
                        <span className="font-extrabold text-forest-800 text-sm">
                          ₹{customer.cancellationInfo?.refundAmount ?? ((customer.remainingDays || 0) * 120)}
                        </span>
                      </div>
                      <div className="flex justify-between items-center text-[11px]">
                        <span className="text-charcoal-muted">Refund Settlement:</span>
                        <span className="font-bold text-rose-700">
                          {customer.cancellationInfo?.refundStatus || (customer.dabbasHeld?.length > 0 ? 'Pending Dabba Return' : 'Processed')}
                        </span>
                      </div>
                    </div>

                    {customer.dabbasHeld && customer.dabbasHeld.length > 0 ? (
                      <div className="p-2.5 rounded-xl bg-warmamber-50 border border-warmamber-200 text-[11px] text-warmamber-900 flex items-start gap-2">
                        <AlertTriangle className="w-3.5 h-3.5 text-warmamber-600 flex-shrink-0 mt-0.5" />
                        <div>
                          <strong className="block">Dabba Pickup Scheduled</strong>
                          <span>Driver Raju will collect tiffin box <strong>{customer.dabbasHeld.join(', ')}</strong> during final route run.</span>
                        </div>
                      </div>
                    ) : (
                      <div className="p-2 rounded-xl bg-forest-50 border border-forest-100 text-[11px] text-forest-800 flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-forest-600 flex-shrink-0" />
                        <span>All circular tiffin boxes cleared & returned.</span>
                      </div>
                    )}
                  </div>

                  <div className="pt-2 space-y-2">
                    <button
                      type="button"
                      onClick={() => {
                        onReactivateSubscription && onReactivateSubscription(customer.id);
                        showToast("Welcome back! Your subscription is active again.");
                      }}
                      className="w-full py-3 text-xs font-bold rounded-2xl bg-forest-700 text-white hover:bg-forest-800 apple-press shadow-apple-sm flex items-center justify-center gap-2"
                    >
                      <RotateCw className="w-4 h-4" />
                      <span>Reactivate Subscription</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setActiveTab('billing')}
                      className="w-full py-2 text-xs font-semibold text-charcoal-muted hover:text-charcoal block text-center"
                    >
                      View Refund & Invoices
                    </button>
                  </div>
                </div>
              ) : (
                /* ACTIVE SUBSCRIPTION VIEW */
                <>
                  <div>
                    <span className="text-xs font-bold text-charcoal-muted uppercase tracking-wider block">Subscription Health</span>
                    <div className="mt-3 flex items-baseline gap-2">
                      <span className="text-5xl font-extrabold text-charcoal tracking-tight">{customer.remainingDays}</span>
                      <span className="text-sm font-semibold text-charcoal-muted">Days Left</span>
                    </div>

                    {/* Progress bar */}
                    <div className="w-full bg-cream-200 h-3 rounded-full mt-3 overflow-hidden">
                      <div 
                        className="bg-forest-600 h-full rounded-full transition-all duration-700"
                        style={{ width: `${Math.min(100, (customer.remainingDays / 30) * 100)}%` }}
                      ></div>
                    </div>

                    <div className="mt-5 space-y-2.5 text-xs">
                      <div className="flex justify-between py-1.5 border-b border-edge/60">
                        <span className="text-charcoal-muted">Plan Cycle:</span>
                        <span className="font-bold text-charcoal">{customer.startDate} to {customer.endDate}</span>
                      </div>
                      <div className="flex justify-between py-1.5 border-b border-edge/60">
                        <span className="text-charcoal-muted">Payment Status:</span>
                        <span className="font-bold text-forest-700">{customer.paymentStatus} ({customer.paymentMode})</span>
                      </div>
                      <div className="flex justify-between py-1.5">
                        <span className="text-charcoal-muted">Protection:</span>
                        <span className="font-semibold text-charcoal">Auto-Extension Enabled</span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-2 space-y-2.5">
                    {/* 1-Click Skip Today / Resume Button */}
                    {customer.todayDeliveryStatus === 'On Leave' ? (
                      <div className="space-y-1.5">
                        <div className="p-2.5 rounded-xl bg-warmamber-50 border border-warmamber-200 text-center text-xs font-bold text-warmamber-800">
                          ⏸️ Today's Delivery is Paused (Auto-Extended)
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            onToggleSkipToday && onToggleSkipToday(customer.id);
                            showToast("Resumed today's meal delivery! Kitchen notified.");
                          }}
                          className="w-full py-3 text-xs font-bold rounded-2xl bg-forest-700 text-white hover:bg-forest-800 apple-press shadow-apple-sm flex items-center justify-center gap-2"
                        >
                          <Play className="w-4 h-4 fill-current" />
                          <span>Resume Today's Meal Delivery</span>
                        </button>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => {
                          onToggleSkipToday && onToggleSkipToday(customer.id);
                          showToast("Today's delivery paused! Subscription validity auto-extended +1 day.");
                        }}
                        className="w-full py-3 text-xs font-bold rounded-2xl bg-warmamber-50 hover:bg-warmamber-100 text-warmamber-800 border border-warmamber-200 apple-press shadow-apple-sm flex items-center justify-center gap-2"
                      >
                        <Pause className="w-4 h-4 fill-current" />
                        <span>Skip Today's Meal (Eroju Vadhu)</span>
                      </button>
                    )}

                    {/* Date Range Leave Planner Button */}
                    <button
                      type="button"
                      onClick={() => setActiveTab('leave')}
                      className="w-full py-2.5 text-xs font-bold rounded-2xl border border-edge bg-cream-50 hover:bg-cream-100 text-charcoal apple-press flex items-center justify-center gap-2"
                    >
                      <CalendarDays className="w-4 h-4 text-forest-700" />
                      <span>Schedule Date Range Leave</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setShowPaymentModal(true)}
                      className="w-full py-2 text-xs font-semibold text-charcoal-muted hover:text-charcoal block text-center"
                    >
                      View Invoices & Billing
                    </button>

                    {/* Cancel Subscription Graceful Link */}
                    <button
                      type="button"
                      onClick={() => setShowCancelModal(true)}
                      className="w-full py-2 text-xs font-semibold text-rose-600 hover:text-rose-700 hover:bg-rose-50/70 rounded-xl transition-all text-center flex items-center justify-center gap-1.5 pt-2 border-t border-edge/60"
                    >
                      <XCircle className="w-3.5 h-3.5" />
                      <span>Cancel Subscription</span>
                    </button>
                  </div>
                </>
              )}
            </div>

            {/* Assigned Delivery Driver Spotlight */}
            <div className="bg-white rounded-3xl p-6 border border-edge shadow-apple-card space-y-4">
              <span className="text-xs font-bold text-charcoal-muted uppercase tracking-wider block">Assigned Delivery Hero</span>
              
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-2xl bg-forest-50 border border-forest-100 flex items-center justify-center text-forest-700 flex-shrink-0">
                  <Bike className="w-6 h-6" />
                </div>
                <div className="min-w-0">
                  <h4 className="font-bold text-charcoal text-base">Raju Kumar</h4>
                  <span className="text-xs text-charcoal-muted block">Route A (Hitec City & Madhapur)</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-1">
                <a
                  href="tel:+919848012345"
                  className="py-2.5 px-3 rounded-xl bg-cream-50 border border-edge flex items-center justify-center gap-2 text-xs font-bold text-charcoal hover:bg-cream-100 apple-press"
                >
                  <Phone className="w-3.5 h-3.5 text-terracotta-500" />
                  <span>Call Raju</span>
                </a>
                <a
                  href="https://wa.me/919848012345"
                  target="_blank"
                  rel="noreferrer"
                  className="py-2.5 px-3 rounded-xl bg-forest-50 border border-forest-100 flex items-center justify-center gap-2 text-xs font-bold text-forest-800 hover:bg-forest-100 apple-press"
                >
                  <MessageSquare className="w-3.5 h-3.5 text-forest-600" />
                  <span>WhatsApp</span>
                </a>
              </div>
            </div>

            {/* Sunday Auto-Payment Policy Warning (if pending) */}
            {customer.paymentStatus === 'Pending' && (
              <div className="bg-warmamber-50/90 border border-warmamber-100 rounded-3xl p-5 space-y-3">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-warmamber-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="text-xs font-bold text-warmamber-600 uppercase tracking-wider block">
                      Sunday Payment Reminder
                    </span>
                    <p className="text-xs text-charcoal mt-1 leading-relaxed font-medium">
                      Your weekly meal renewal fee is due. Settle now to maintain seamless box delivery.
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setShowPaymentModal(true)}
                  className="w-full py-2.5 text-xs font-bold rounded-xl bg-warmamber-600 text-white hover:bg-warmamber-500 apple-press shadow-apple-sm"
                >
                  Pay ₹2,400 via UPI
                </button>
              </div>
            )}

            {/* 24/7 Helpline Shortcut */}
            <div className="bg-cream-50/80 rounded-3xl p-5 border border-edge flex items-center justify-between text-xs">
              <div>
                <span className="font-bold text-charcoal block">Need help with today's meal?</span>
                <span className="text-charcoal-muted text-[11px]">Direct Kitchen Success Desk</span>
              </div>
              <button
                onClick={() => setActiveTab('support')}
                className="px-3.5 py-1.5 rounded-xl bg-white border border-edge font-bold text-forest-700 hover:bg-cream-100 apple-press"
              >
                Help Desk
              </button>
            </div>

          </div>

        </div>
      )}

      {/* LEAVE PLANNER TAB */}
      {activeTab === 'leave' && (
        <div className="bg-white rounded-3xl p-7 border border-edge shadow-apple-card max-w-2xl mx-auto space-y-6">
          <div className="border-b border-edge/80 pb-4">
            <h2 className="text-lg font-bold text-charcoal tracking-tight">Pause Meals & Auto-Extend Plan</h2>
            <p className="text-xs text-charcoal-muted mt-1 leading-relaxed">
              Going out of town? Select your pause dates. Our smart algorithm automatically pushes your subscription end date forward so you don't lose a single paid meal.
            </p>
          </div>

          <form onSubmit={handleLeaveSubmit} className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-charcoal mb-1.5">Leave Start Date</label>
                <input
                  type="date"
                  required
                  value={leaveFrom}
                  onChange={(e) => setLeaveFrom(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs rounded-2xl border border-edge bg-cream-50 focus:outline-none focus:border-forest-600 focus:bg-white text-charcoal font-medium"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-charcoal mb-1.5">Leave End Date</label>
                <input
                  type="date"
                  required
                  value={leaveTo}
                  onChange={(e) => setLeaveTo(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs rounded-2xl border border-edge bg-cream-50 focus:outline-none focus:border-forest-600 focus:bg-white text-charcoal font-medium"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-charcoal mb-1.5">Reason for Pause</label>
              <select
                value={leaveReason}
                onChange={(e) => setLeaveReason(e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs rounded-2xl border border-edge bg-cream-50 focus:outline-none focus:border-forest-600 focus:bg-white text-charcoal font-medium"
              >
                <option value="Travel / Out of town">Travel / Out of town</option>
                <option value="Fasting / Special Diet">Fasting / Special Diet</option>
                <option value="Health / Medical Leave">Health / Medical Leave</option>
                <option value="Other">Other</option>
              </select>
            </div>

            {leaveDays > 0 && (
              <div className="p-5 rounded-2xl bg-forest-50 border border-forest-100 space-y-2">
                <div className="flex items-center gap-2 text-forest-800 text-xs font-bold">
                  <ShieldCheck className="w-5 h-5 text-forest-700" />
                  <span>Zero-Loss Subscription Guarantee</span>
                </div>
                <p className="text-xs text-charcoal leading-relaxed">
                  You are pausing meal delivery for <strong>{leaveDays} day(s)</strong>.
                </p>
                <p className="text-xs text-forest-800 font-semibold">
                  Your current subscription end date ({customer.endDate}) will automatically push forward to add {leaveDays} free delivery days.
                </p>
              </div>
            )}

            <div className="flex items-center justify-end gap-3 pt-3">
              <button
                type="button"
                onClick={() => setActiveTab('hub')}
                className="px-4 py-2.5 text-xs font-bold rounded-xl border border-edge text-charcoal hover:bg-cream-100 apple-press"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 text-xs font-bold rounded-xl bg-forest-700 text-white hover:bg-forest-800 apple-press shadow-apple-sm"
              >
                Confirm Leave & Extend Plan
              </button>
            </div>
          </form>
        </div>
      )}

      {/* PAYMENTS & BILLING TAB */}
      {activeTab === 'billing' && (
        <div className="space-y-6">
          <div className="bg-white rounded-3xl p-7 border border-edge shadow-apple-card flex flex-col sm:flex-row sm:items-center justify-between gap-5">
            <div>
              <span className="text-xs font-bold text-charcoal-muted uppercase tracking-wider">
                {customer.subscriptionStatus === 'Cancelled' ? 'Cancelled Subscription' : 'Active Subscription Tier'}
              </span>
              <h3 className="text-xl font-bold text-charcoal mt-0.5">{customer.subscriptionType}</h3>
              <p className="text-xs text-charcoal-muted mt-1">
                Standard Monthly Pre-paid • ₹2,400.00 / month (Includes box security deposit)
              </p>
            </div>
            <div className="flex items-center gap-2.5 flex-wrap">
              {customer.subscriptionStatus === 'Cancelled' ? (
                <>
                  <span className="px-3 py-1.5 rounded-full text-xs font-bold bg-rose-50 text-rose-700 border border-rose-200 flex items-center gap-1.5">
                    <XCircle className="w-3.5 h-3.5 text-rose-600" />
                    <span>Cancelled</span>
                  </span>
                  <button
                    onClick={() => {
                      onReactivateSubscription && onReactivateSubscription(customer.id);
                      showToast("Subscription reactivated successfully!");
                    }}
                    className="px-5 py-2.5 text-xs font-bold rounded-xl bg-forest-700 text-white hover:bg-forest-800 apple-press shadow-apple-sm flex items-center gap-1.5"
                  >
                    <RotateCw className="w-3.5 h-3.5" />
                    <span>Reactivate Subscription</span>
                  </button>
                </>
              ) : (
                <>
                  <span className={`px-3 py-1.5 rounded-full text-xs font-bold ${
                    customer.paymentStatus === 'Paid'
                      ? 'bg-forest-50 text-forest-700 border border-forest-100'
                      : 'bg-warmamber-50 text-warmamber-600 border border-warmamber-100'
                  }`}>
                    {customer.paymentStatus === 'Paid' ? 'Paid & Active' : 'Payment Due'}
                  </span>
                  <button
                    onClick={() => setShowPaymentModal(true)}
                    className="px-5 py-2.5 text-xs font-bold rounded-xl bg-forest-700 text-white hover:bg-forest-800 apple-press shadow-apple-sm"
                  >
                    Pay via UPI / Card
                  </button>
                  <button
                    onClick={() => setShowCancelModal(true)}
                    className="px-3.5 py-2.5 text-xs font-semibold text-rose-600 hover:text-rose-700 bg-rose-50/70 hover:bg-rose-100/80 rounded-xl transition-all border border-rose-200 apple-press"
                  >
                    Cancel Subscription
                  </button>
                </>
              )}
            </div>
          </div>

          <div className="bg-white rounded-3xl border border-edge shadow-apple-card overflow-hidden">
            <div className="p-5 border-b border-edge">
              <h4 className="text-sm font-bold text-charcoal">Official Payment & Refund Invoices</h4>
              <p className="text-xs text-charcoal-muted">Download tax invoices and pro-rata refund receipts</p>
            </div>
            <div className="divide-y divide-edge text-xs">
              {customer.subscriptionStatus === 'Cancelled' && (
                <div className="p-4 flex items-center justify-between bg-rose-50/40">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-charcoal block">Pro-Rata Cancellation Settlement</span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-100 text-rose-800">Refund</span>
                    </div>
                    <span className="text-charcoal-muted text-[11px] block mt-0.5">
                      Cancelled on {customer.cancellationInfo?.cancelledAt || 'Recent'} • Reason: {customer.cancellationInfo?.reason || 'Customer request'}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="font-extrabold text-forest-800 text-sm">
                      + ₹{customer.cancellationInfo?.refundAmount ?? ((customer.remainingDays || 0) * 120)}.00
                    </span>
                    <span className="text-[10px] text-rose-700 block font-semibold">
                      {customer.cancellationInfo?.refundStatus || (customer.dabbasHeld?.length > 0 ? 'Pending Dabba Return' : 'Processed')}
                    </span>
                  </div>
                </div>
              )}
              <div className="p-4 flex items-center justify-between hover:bg-cream-50/60">
                <div>
                  <span className="font-bold text-charcoal block">October 2026 Subscription (Cycle 2)</span>
                  <span className="text-charcoal-muted text-[11px]">Paid on 2026-10-15 via Google Pay UPI</span>
                </div>
                <div className="text-right">
                  <span className="font-bold text-charcoal">₹2,400.00</span>
                  <span className="text-[10px] text-forest-700 block font-semibold">Tax Invoice #INV-9281 (Paid)</span>
                </div>
              </div>
              <div className="p-4 flex items-center justify-between hover:bg-cream-50/60">
                <div>
                  <span className="font-bold text-charcoal block">September 2026 Subscription (Cycle 1)</span>
                  <span className="text-charcoal-muted text-[11px]">Paid on 2026-09-15 via UPI</span>
                </div>
                <div className="text-right">
                  <span className="font-bold text-charcoal">₹2,400.00</span>
                  <span className="text-[10px] text-forest-700 block font-semibold">Tax Invoice #INV-8120 (Paid)</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SUPPORT & TICKETS TAB */}
      {activeTab === 'support' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-3xl p-7 border border-edge shadow-apple-card space-y-5">
            <div>
              <h3 className="text-base font-bold text-charcoal">Immediate Support Channels</h3>
              <p className="text-xs text-charcoal-muted mt-1 leading-relaxed">
                Connect directly with your route coordinator or the kitchen team for urgent delivery assistance.
              </p>
            </div>

            <div className="space-y-3 pt-2">
              <a
                href="https://wa.me/919876543210?text=Hello%20Healthi%20Dabba%20Support,%20I%20have%20a%20query%20about%20my%20meal%20delivery"
                target="_blank"
                rel="noreferrer"
                className="w-full flex items-center justify-between p-4 rounded-2xl bg-forest-50 border border-forest-100 text-forest-800 hover:bg-forest-100 apple-press"
              >
                <div className="flex items-center gap-3.5">
                  <MessageSquare className="w-5 h-5 text-forest-600" />
                  <div className="text-left">
                    <span className="text-xs font-bold block">Chat with Route Coordinator</span>
                    <span className="text-[11px] text-forest-700">Instant WhatsApp helpline</span>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-forest-700" />
              </a>

              <a
                href="tel:+919876543210"
                className="w-full flex items-center justify-between p-4 rounded-2xl bg-cream-50 border border-edge text-charcoal hover:bg-cream-100 apple-press"
              >
                <div className="flex items-center gap-3.5">
                  <Phone className="w-5 h-5 text-terracotta-500" />
                  <div className="text-left">
                    <span className="text-xs font-bold block">Direct Kitchen Helpline</span>
                    <span className="text-[11px] text-charcoal-muted">Emergency food delivery line</span>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-charcoal-muted" />
              </a>
            </div>
          </div>

          <div className="bg-white rounded-3xl p-7 border border-edge shadow-apple-card">
            <h3 className="text-base font-bold text-charcoal">Report an Issue / Special Request</h3>
            <p className="text-xs text-charcoal-muted mt-1 mb-4">Tickets are directly notified to Kitchen Manager.</p>

            <form onSubmit={handleIssueSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-charcoal mb-1">Issue Category</label>
                <select
                  value={complaintCategory}
                  onChange={(e) => setComplaintCategory(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs rounded-2xl border border-edge bg-cream-50 focus:outline-none focus:border-forest-600 focus:bg-white text-charcoal font-medium"
                >
                  <option value="Meal Taste / Freshness">Meal Taste / Freshness</option>
                  <option value="Late Delivery">Late Delivery</option>
                  <option value="Packaging / Box Leakage">Packaging / Box Leakage</option>
                  <option value="Special Instruction Missed">Special Instruction Missed</option>
                  <option value="Billing / Invoice Query">Billing / Invoice Query</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-charcoal mb-1">Detailed Description</label>
                <textarea
                  rows={3}
                  required
                  placeholder="Describe your issue so our chef can resolve it immediately..."
                  value={complaintText}
                  onChange={(e) => setComplaintText(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs rounded-2xl border border-edge bg-cream-50 focus:outline-none focus:border-forest-600 focus:bg-white text-charcoal font-medium"
                ></textarea>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 text-xs font-bold rounded-xl bg-forest-700 text-white hover:bg-forest-800 apple-press shadow-apple-sm flex items-center justify-center gap-2"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Submit Ticket</span>
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Payment Gateway Modal (Simulated) */}
      {showPaymentModal && (
        <PortalModal>
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-charcoal/60 backdrop-blur-md">
            <div className="w-full max-w-sm bg-white rounded-3xl p-6 shadow-apple-modal border border-edge space-y-4">
              <div className="flex items-center justify-between border-b border-edge pb-3">
                <div>
                  <h4 className="text-sm font-bold text-charcoal">Settle Meal Subscription</h4>
                  <p className="text-xs text-charcoal-muted">Monthly Plan Renewal</p>
                </div>
                <span className="text-base font-bold text-forest-700">₹2,400</span>
              </div>

              <div className="space-y-2.5">
                <label className="text-xs font-bold text-charcoal block">Select Payment Mode</label>
                {[
                  { id: 'upi', label: 'Instant UPI (Google Pay / PhonePe / Paytm)' },
                  { id: 'card', label: 'Debit / Credit Card' },
                  { id: 'netbanking', label: 'Net Banking' },
                  { id: 'cash', label: 'Cash on Next Delivery Handover' }
                ].map((m) => (
                  <label 
                    key={m.id}
                    className={`flex items-center gap-3 p-3 rounded-2xl border text-xs cursor-pointer transition-all ${
                      selectedPayMethod === m.id ? 'border-forest-600 bg-forest-50/50 shadow-apple-sm' : 'border-edge bg-white'
                    }`}
                  >
                    <input
                      type="radio"
                      name="paymethod"
                      value={m.id}
                      checked={selectedPayMethod === m.id}
                      onChange={() => setSelectedPayMethod(m.id)}
                      className="accent-forest-700"
                    />
                    <span className="font-semibold text-charcoal">{m.label}</span>
                  </label>
                ))}
              </div>

              <div className="flex items-center gap-2 pt-2">
                <button
                  onClick={() => setShowPaymentModal(false)}
                  className="flex-1 py-2.5 text-xs font-bold rounded-xl border border-edge text-charcoal hover:bg-cream-100 apple-press"
                >
                  Cancel
                </button>
                <button
                  onClick={handlePaymentSubmit}
                  className="flex-1 py-2.5 text-xs font-bold rounded-xl bg-forest-700 text-white hover:bg-forest-800 apple-press shadow-apple-sm"
                >
                  Pay ₹2,400
                </button>
              </div>
            </div>
          </div>
        </PortalModal>
      )}

      {/* Customer Self-Service Dietary Preferences & Kitchen Notes Modal */}
      {showEditDietModal && (
        <PortalModal>
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-charcoal/60 backdrop-blur-md animate-fade-in">
          <div className="w-full max-w-lg bg-white rounded-3xl p-6 sm:p-7 shadow-apple-modal border border-edge space-y-5 max-h-[90vh] overflow-y-auto no-scrollbar">
            
            <div className="flex items-center justify-between pb-3 border-b border-edge">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-terracotta-50 border border-terracotta-100 flex items-center justify-center text-terracotta-600 flex-shrink-0">
                  <Utensils className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-base font-bold text-charcoal">Update Dietary Preferences</h4>
                  <p className="text-xs text-charcoal-muted">Direct kitchen instructions for your daily meal prep</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowEditDietModal(false)}
                className="w-8 h-8 rounded-full bg-cream-100 hover:bg-cream-200 text-charcoal-muted flex items-center justify-center text-xs font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={(e) => {
              e.preventDefault();
              if (onUpdateCustomerMeal) {
                onUpdateCustomerMeal(customer.id, {
                  subscriptionType: customPlan,
                  chosenDeliveryDay: customChosenDay,
                  kitchenNotes: customDietNote,
                  deliveryNotes: customDeliveryNote,
                  specialInstructions: customDietNote
                });
              }
              setShowEditDietModal(false);
            }} className="space-y-4">

              {/* Meal Plan Preference */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-charcoal block">Subscription Plan (3 Plans Available)</label>
                <select
                  value={customPlan}
                  onChange={(e) => setCustomPlan(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs rounded-2xl border border-edge bg-cream-50 focus:outline-none focus:border-forest-600 focus:bg-white text-charcoal font-semibold"
                >
                  <option value="UNSUN — Alternate Days (Mon, Wed, Fri)">UNSUN — Alternate Days (Mon, Wed, Fri)</option>
                  <option value="Alternative-2 — Alternate Days (Tue, Thu, Sat)">Alternative-2 — Alternate Days (Tue, Thu, Sat)</option>
                  <option value="One Day Meal (Custom Specific Day)">One Day Meal (Custom Specific Day)</option>
                </select>

                {/* Cadence & Auto-Pickup Schedule Info Card */}
                {customPlan.includes('Mon, Wed, Fri') && (
                  <div className="p-3 rounded-2xl bg-forest-50/70 border border-forest-200/80 text-xs text-forest-900 space-y-1">
                    <span className="font-bold block text-[11px] uppercase tracking-wider text-forest-800">
                      🥗 Delivery & Auto-Pickup Cadence:
                    </span>
                    <p className="text-[11px] leading-relaxed text-charcoal">
                      Deliveries on <strong>Mon, Wed, Fri</strong>. Empty dabba is <strong>automatically scheduled for pickup the next day</strong> (Mon ➔ Tue Pickup, Wed ➔ Thu Pickup, Fri ➔ Sat Pickup). Sunday is kitchen leave.
                    </p>
                  </div>
                )}

                {customPlan.includes('Tue, Thu, Sat') && (
                  <div className="p-3 rounded-2xl bg-terracotta-50/70 border border-terracotta-200/80 text-xs text-terracotta-900 space-y-1">
                    <span className="font-bold block text-[11px] uppercase tracking-wider text-terracotta-800">
                      🥑 Delivery & Auto-Pickup Cadence:
                    </span>
                    <p className="text-[11px] leading-relaxed text-charcoal">
                      Deliveries on <strong>Tue, Thu, Sat</strong>. Empty dabba is <strong>automatically scheduled for pickup the next day</strong> (Tue ➔ Wed Pickup, Thu ➔ Fri Pickup, Sat ➔ Mon Pickup because Sunday is leave).
                    </p>
                  </div>
                )}

                {/* Custom Single Day Selector for One Day Meal */}
                {customPlan.includes('One Day Meal') && (
                  <div className="p-3.5 rounded-2xl bg-amber-50/80 border border-amber-200 space-y-2.5">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-amber-900">Choose Your Specific Delivery Day</span>
                      <span className="text-[10px] font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded-full border border-rose-200">Sunday Closed</span>
                    </div>

                    <div className="grid grid-cols-3 sm:grid-cols-6 gap-1.5">
                      {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].map((d) => (
                        <button
                          key={d}
                          type="button"
                          onClick={() => setCustomChosenDay(d)}
                          className={`py-2 px-1 text-center text-xs font-bold rounded-xl transition-all ${
                            customChosenDay === d
                              ? 'bg-forest-700 text-white shadow-apple-sm'
                              : 'bg-white hover:bg-cream-100 text-charcoal border border-edge'
                          }`}
                        >
                          {d.slice(0, 3)}
                        </button>
                      ))}
                    </div>

                    <p className="text-[11px] text-charcoal leading-relaxed pt-1 border-t border-amber-200/60">
                      ✨ <strong>{customChosenDay} Delivery:</strong> Dabba is automatically added for pickup on <strong>{customChosenDay === 'Saturday' ? 'Monday' : (customChosenDay === 'Monday' ? 'Tuesday' : customChosenDay === 'Tuesday' ? 'Wednesday' : customChosenDay === 'Wednesday' ? 'Thursday' : customChosenDay === 'Thursday' ? 'Friday' : 'Saturday')}</strong> morning! (Sunday is kitchen leave).
                    </p>
                  </div>
                )}
              </div>

              {/* 1. SEPARATE KITCHEN NOTES */}
              <div className="p-4 rounded-2xl bg-terracotta-50/60 border border-terracotta-200/80 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <ChefHat className="w-4 h-4 text-terracotta-600" />
                    <span className="text-xs font-bold text-terracotta-900 uppercase tracking-wider">
                      Kitchen Staff Dietary Notes
                    </span>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-white text-terracotta-700 font-bold border border-terracotta-200">
                    Kitchen Only
                  </span>
                </div>

                {/* Quick Dietary Chips */}
                <div className="flex flex-wrap gap-1.5">
                  {[
                    'No onion & garlic',
                    'Low spice',
                    'Extra cucumber',
                    'Extra sprouts (double protein)',
                    'Low salt',
                    'No dairy (no curd/paneer)',
                    'Gluten-free',
                    'Less oil',
                    'Pack dressing separately'
                  ].map((tag) => {
                    const isSelected = customDietNote.toLowerCase().includes(tag.toLowerCase());
                    return (
                      <button
                        type="button"
                        key={tag}
                        onClick={() => {
                          let current = customDietNote.trim();
                          if (isSelected) {
                            const regex = new RegExp(`(^|,\\s*)${tag}`, 'i');
                            current = current.replace(regex, '').replace(/^,\s*/, '').replace(/,\s*,/g, ',');
                          } else {
                            current = current ? `${current}, ${tag}` : tag;
                          }
                          setCustomDietNote(current);
                        }}
                        className={`px-2 py-0.5 text-[10px] rounded-lg font-bold transition-all border ${
                          isSelected
                            ? 'bg-terracotta-500 text-white border-terracotta-600 shadow-apple-sm'
                            : 'bg-white hover:bg-cream-100 text-charcoal border-edge'
                        }`}
                      >
                        {isSelected ? '✓ ' : '+ '}{tag}
                      </button>
                    );
                  })}
                </div>

                <textarea
                  rows={2}
                  value={customDietNote}
                  onChange={(e) => setCustomDietNote(e.target.value)}
                  placeholder="e.g. No onion, extra cucumber, pack papaya separately..."
                  className="w-full px-3 py-2 text-xs rounded-xl border border-edge bg-white focus:outline-none focus:border-terracotta-500 text-charcoal font-medium leading-relaxed"
                />
                <p className="text-[10px] text-terracotta-700/80">
                  👨‍🍳 <em>Printed onto your dabba sticker so the kitchen cook packs your food accurately.</em>
                </p>
              </div>

              {/* 2. SEPARATE DELIVERY NOTES */}
              <div className="p-4 rounded-2xl bg-forest-50/70 border border-forest-200/80 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Bike className="w-4 h-4 text-forest-700" />
                    <span className="text-xs font-bold text-forest-900 uppercase tracking-wider">
                      Delivery Driver Notes (Drop-off & Gate)
                    </span>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-white text-forest-700 font-bold border border-forest-200">
                    Driver Only
                  </span>
                </div>

                {/* Quick Delivery Chips */}
                <div className="flex flex-wrap gap-1.5">
                  {[
                    'Leave at security if door locked',
                    'Ring doorbell twice',
                    'Call on arrival',
                    'Leave at doorstep (do not ring)',
                    'Deliver before 12:30 PM',
                    'Drop at reception / front desk'
                  ].map((tag) => {
                    const isSelected = customDeliveryNote.toLowerCase().includes(tag.toLowerCase());
                    return (
                      <button
                        type="button"
                        key={tag}
                        onClick={() => {
                          let current = customDeliveryNote.trim();
                          if (isSelected) {
                            const regex = new RegExp(`(^|,\\s*)${tag}`, 'i');
                            current = current.replace(regex, '').replace(/^,\s*/, '').replace(/,\s*,/g, ',');
                          } else {
                            current = current ? `${current}, ${tag}` : tag;
                          }
                          setCustomDeliveryNote(current);
                        }}
                        className={`px-2 py-0.5 text-[10px] rounded-lg font-bold transition-all border ${
                          isSelected
                            ? 'bg-forest-600 text-white border-forest-700 shadow-apple-sm'
                            : 'bg-white hover:bg-cream-100 text-charcoal border-edge'
                        }`}
                      >
                        {isSelected ? '✓ ' : '+ '}{tag}
                      </button>
                    );
                  })}
                </div>

                <textarea
                  rows={2}
                  value={customDeliveryNote}
                  onChange={(e) => setCustomDeliveryNote(e.target.value)}
                  placeholder="e.g. Leave at security gate, call flat 402 on intercom..."
                  className="w-full px-3 py-2 text-xs rounded-xl border border-edge bg-white focus:outline-none focus:border-forest-600 text-charcoal font-medium leading-relaxed"
                />
                <p className="text-[10px] text-forest-700/80">
                  🚴 <em>Visible exclusively to your delivery hero when arriving at your address.</em>
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-3 pt-2 border-t border-edge">
                <button
                  type="button"
                  onClick={() => setShowEditDietModal(false)}
                  className="px-4 py-2 text-xs font-bold text-charcoal-muted hover:text-charcoal rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 text-xs font-bold text-white bg-forest-700 hover:bg-forest-800 rounded-xl shadow-apple-sm apple-press flex items-center gap-1.5"
                >
                  <CheckCircle2 className="w-4 h-4 text-cream-100" />
                  <span>Update Notes</span>
                </button>
              </div>

            </form>
          </div>
        </div>
        </PortalModal>
      )}

      {/* Dish Allotment Modal */}
      {showAllotDishModal && (
        <PortalModal>
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-charcoal/40 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-7 shadow-apple-modal border border-edge space-y-5 animate-scale-up">
            <div className="flex items-start justify-between border-b border-edge/80 pb-4">
              <div>
                <span className="text-[11px] font-bold text-forest-700 uppercase tracking-wider block">Tiffin Box Customization</span>
                <h3 className="text-lg font-bold text-charcoal mt-0.5">Allot Daily Dishes to Box</h3>
                <p className="text-xs text-charcoal-muted mt-0.5">Select specific dishes to be prepared & packed in {customer.name}'s tiffin.</p>
              </div>
              <button
                type="button"
                onClick={() => setShowAllotDishModal(false)}
                className="w-8 h-8 rounded-full bg-cream-100 hover:bg-cream-200 flex items-center justify-center text-charcoal-muted transition-colors apple-press"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Live Nutrition Summary Bar */}
            <div className="grid grid-cols-3 gap-2 p-3 bg-cream-50/80 rounded-2xl border border-edge text-center">
              <div>
                <span className="text-[10px] font-bold text-charcoal-muted block">Selected Dishes</span>
                <span className="text-sm font-extrabold text-charcoal">{allottedDishesList.length} of {planDishes.length}</span>
              </div>
              <div>
                <span className="text-[10px] font-bold text-charcoal-muted block">Total Protein</span>
                <span className="text-sm font-extrabold text-forest-800">{totalAllottedProtein}g</span>
              </div>
              <div>
                <span className="text-[10px] font-bold text-charcoal-muted block">Box Weight</span>
                <span className="text-sm font-extrabold text-charcoal">{totalAllottedWeight}g</span>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-charcoal">Available Dishes</span>
              <button
                type="button"
                onClick={handleAllotAllDishes}
                className="text-xs font-bold text-forest-700 hover:text-forest-800 hover:underline"
              >
                Select All ({planDishes.length})
              </button>
            </div>

            {/* Dishes list */}
            <div className="max-h-72 overflow-y-auto space-y-2 pr-1 custom-scrollbar">
              {planDishes.map((dish) => {
                const isSelected = customerAllottedIds.includes(dish.id);
                return (
                  <div
                    key={dish.id}
                    onClick={() => handleToggleDishAllotment(dish.id)}
                    className={`p-3 rounded-2xl border cursor-pointer transition-all flex items-center justify-between gap-3 ${
                      isSelected
                        ? 'border-forest-500 bg-forest-50/40'
                        : 'border-edge bg-white hover:bg-cream-50/50'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className={`w-5 h-5 rounded-md flex items-center justify-center transition-colors ${
                        isSelected ? 'bg-forest-700 text-white' : 'border border-edge bg-white'
                      }`}>
                        {isSelected && <CheckCircle2 className="w-3.5 h-3.5" />}
                      </div>
                      {dish.image && (
                        <img src={dish.image} alt={dish.name} className="w-10 h-10 rounded-xl object-cover border border-edge shrink-0" />
                      )}
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                          <h4 className="text-xs font-bold text-charcoal truncate">{dish.name}</h4>
                          <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-cream-100 text-charcoal-muted">
                            {dish.category}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-[10px] text-charcoal-muted mt-0.5">
                          <span>💪 {dish.protein || '16g'}</span>
                          <span>•</span>
                          <span>⚖️ {dish.weight || dish.quantity || '200g'}</span>
                        </div>
                      </div>
                    </div>
                    <span className={`text-[11px] font-bold shrink-0 ${isSelected ? 'text-forest-700' : 'text-charcoal-muted'}`}>
                      {isSelected ? 'Allotted ✓' : '+ Add'}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-end gap-3 pt-3 border-t border-edge">
              <button
                type="button"
                onClick={() => setShowAllotDishModal(false)}
                className="w-full py-2.5 text-xs font-bold text-white bg-forest-700 hover:bg-forest-800 rounded-xl shadow-apple-sm apple-press"
              >
                Confirm Box Allotment ({allottedDishesList.length} Dishes)
              </button>
            </div>
          </div>
        </div>
        </PortalModal>
      )}

      {/* Customer Cancellation Modal */}
      {showCancelModal && (
        <PortalModal>
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-charcoal/60 backdrop-blur-md animate-fade-in">
          <div className="w-full max-w-md bg-white rounded-3xl p-6 sm:p-7 shadow-apple-modal border border-edge space-y-4 animate-scale-up">
            <div className="flex items-center justify-between border-b border-edge pb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-rose-50 text-rose-600 border border-rose-100 flex items-center justify-center">
                  <XCircle className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-base font-bold text-charcoal">Cancel Subscription</h4>
                  <p className="text-xs text-charcoal-muted">We're sorry to see you go</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowCancelModal(false)}
                className="w-8 h-8 rounded-full bg-cream-100 hover:bg-cream-200 flex items-center justify-center text-charcoal-muted text-xs font-bold"
              >
                ✕
              </button>
            </div>

            {/* Refund Estimate */}
            <div className="p-4 rounded-2xl bg-forest-50/80 border border-forest-200/80 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-forest-900">Your Remaining Balance</span>
                <span className="text-xs font-extrabold text-forest-800 bg-white px-2.5 py-0.5 rounded-md border border-forest-100">
                  {customer.remainingDays} Days Left
                </span>
              </div>
              <div className="flex items-baseline justify-between pt-1">
                <span className="text-xs text-charcoal-muted">Pro-Rata Refund Estimate:</span>
                <span className="text-xl font-extrabold text-forest-800">
                  ₹{customer.remainingDays * 120}
                </span>
              </div>
              <p className="text-[11px] text-forest-700/90 leading-tight">
                Calculated at ₹120 per remaining meal. Will be credited to your original payment method.
              </p>
            </div>

            {/* Circular Dabba Return Notification */}
            {customer.dabbasHeld && customer.dabbasHeld.length > 0 ? (
              <div className="p-3.5 rounded-2xl bg-warmamber-50 border border-warmamber-200 text-xs space-y-1">
                <div className="flex items-center gap-1.5 text-warmamber-900 font-bold">
                  <AlertTriangle className="w-4 h-4 text-warmamber-600 flex-shrink-0" />
                  <span>Circular Dabba Return ({customer.dabbasHeld.length} Box)</span>
                </div>
                <p className="text-warmamber-800/90 leading-relaxed text-[11px]">
                  You currently hold box <strong>{customer.dabbasHeld.join(', ')}</strong>. Our delivery hero will come by for a final pickup. Your refund will be processed upon handover.
                </p>
              </div>
            ) : (
              <div className="p-3 rounded-2xl bg-forest-50 border border-forest-200 text-xs flex items-center gap-2 text-forest-800 font-semibold">
                <CheckCircle2 className="w-4 h-4 text-forest-600 flex-shrink-0" />
                <span>All empty tiffin boxes are already returned! Refund ready.</span>
              </div>
            )}

            {/* Reason */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-charcoal block">Please share why you're leaving</label>
              <select
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                className="w-full px-3.5 py-2 text-xs rounded-xl border border-edge bg-cream-50 focus:outline-none focus:border-forest-600 font-medium text-charcoal"
              >
                <option value="Relocating / Moving out of city">Relocating / Moving out of city</option>
                <option value="Taking a break / Personal travel">Taking a break / Personal travel</option>
                <option value="Diet change / Doctor advice">Diet change / Doctor advice</option>
                <option value="Financial / Budget reasons">Financial / Budget reasons</option>
                <option value="Dissatisfied with food taste or menu">Dissatisfied with food taste or menu</option>
                <option value="Other reasons">Other reasons</option>
              </select>
            </div>

            {/* Alternatives or Confirm */}
            <div className="p-3 rounded-2xl bg-cream-50 border border-edge text-xs flex items-center justify-between">
              <div className="min-w-0 pr-2">
                <span className="font-bold text-charcoal block">Just traveling temporarily?</span>
                <span className="text-[11px] text-charcoal-muted">You can pause meals without cancelling.</span>
              </div>
              <button
                type="button"
                onClick={() => {
                  setShowCancelModal(false);
                  setActiveTab('leave');
                }}
                className="px-3 py-1.5 text-xs font-bold rounded-xl bg-forest-50 text-forest-700 hover:bg-forest-100 border border-forest-200 whitespace-nowrap"
              >
                Pause Instead
              </button>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-end gap-3 pt-2 border-t border-edge">
              <button
                type="button"
                onClick={() => setShowCancelModal(false)}
                className="px-4 py-2 text-xs font-bold text-charcoal-muted hover:text-charcoal rounded-xl apple-press"
              >
                Keep Subscription
              </button>
              <button
                type="button"
                onClick={() => {
                  onCancelSubscription && onCancelSubscription(customer.id, {
                    reason: cancelReason,
                    refundAmount: customer.remainingDays * 120
                  });
                  showToast("Your subscription cancellation request has been submitted.");
                  setShowCancelModal(false);
                }}
                className="px-5 py-2.5 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-xl shadow-apple-sm apple-press flex items-center gap-1.5"
              >
                <XCircle className="w-4 h-4" />
                <span>Confirm Cancellation</span>
              </button>
            </div>
          </div>
        </div>
        </PortalModal>
      )}

    </div>
  );
}
