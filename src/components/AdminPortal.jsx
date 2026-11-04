import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import DabbaFleetManager from './DabbaFleetManager';
import { 
  ShieldCheck, 
  Users, 
  CreditCard, 
  Package, 
  Bike, 
  ChefHat,
  MapPin,
  Utensils,
  Navigation,
  Download, 
  Search, 
  CheckCircle2, 
  AlertTriangle, 
  Send, 
  Plus, 
  Trash2,
  Edit2,
  Clock, 
  Layers,
  QrCode,
  ArrowRight,
  UserPlus,
  Route as RouteIcon,
  PauseCircle,
  Truck,
  RotateCcw,
  FileSpreadsheet,
  Eye,
  Play,
  Pause,
  Calendar,
  ChevronDown,
  X,
  XCircle,
  RotateCw,
  Upload,
  Image as ImageIcon,
  Flame,
  Dumbbell,
  Scale,
  Camera,
  Phone,
  PhoneCall,
  User,
  FileText,
  Check,
  ArrowUp,
  ArrowDown,
  Copy,
  MessageSquare,
  Share2,
  ExternalLink,
  Sparkles,
  Smartphone,
  CheckCheck
} from 'lucide-react';
import RouteMapVisualizer from './RouteMapVisualizer';

const STAFF_AVATAR_PRESETS = [
  { name: 'Driver Raju', url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80' },
  { name: 'Driver Kiran', url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&auto=format&fit=crop&q=80' },
  { name: 'Staff Ramesh', url: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=200&auto=format&fit=crop&q=80' },
  { name: 'Staff Lakshmi', url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&auto=format&fit=crop&q=80' },
  { name: 'Staff Sunil', url: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=200&auto=format&fit=crop&q=80' },
  { name: 'Staff Priya', url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80' }
];

function PortalModal({ children }) {
  if (typeof document === 'undefined') return null;
  return createPortal(children, document.body);
}

export default function AdminPortal({ 
  customers, 
  deliveryBoys, 
  kitchenStaff,
  routes,
  dabbas, 
  damagedLedger = [],
  dailyMenu,
  onAddCustomer,
  onDeleteCustomer,
  onAddDeliveryBoy,
  onUpdateDeliveryBoy,
  onDeleteDeliveryBoy,
  onAddKitchenStaff,
  onUpdateKitchenStaff,
  onDeleteKitchenStaff,
  onCreateRoute,
  onDeleteRoute,
  onAssignDriverToRoute,
  onAssignCustomerToRoute,
  onAddMenuItem,
  onDeleteMenuItem,
  onSelectCustomer,
  onUpdateCustomerMeal,
  onAllotDishes,
  onToggleSkipToday,
  onScheduleLeave,
  onCancelSubscription,
  onReactivateSubscription,
  onBroadcastUrgentInstruction,
  onAddDabba,
  onBulkAddDabbas,
  onDecommissionDabba,
  onDeleteDabba
}) {
  const [activeTab, setActiveTab] = useState('customers'); // 'customers' | 'staff' | 'routes' | 'menu' | 'dabbas' | 'finance' | 'broadcast'
  const [customerFilter, setCustomerFilter] = useState('all'); // 'all' | 'active' | 'paused' | 'delivery' | 'pickup'
  const [staffSubTab, setStaffSubTab] = useState('delivery'); // 'delivery' | 'kitchen'
  const [menuSubTab, setMenuSubTab] = useState('unsun'); // 'unsun' | 'alternative2'
  const [searchQuery, setSearchQuery] = useState('');
  const [broadcastMsg, setBroadcastMsg] = useState('');
  const [toastMessage, setToastMessage] = useState(null);

  // Route Planning & Sequence State
  const [selectedRouteId, setSelectedRouteId] = useState(routes[0]?.id || 'ROUTE-A');
  const [routeStopOrders, setRouteStopOrders] = useState({}); // { [routeId]: [customerId, ...] }
  const [highlightedStopId, setHighlightedStopId] = useState(null);
  const [focusedMapStop, setFocusedMapStop] = useState(null); // null = full route zone, or customer object
  const [mapViewMode, setMapViewMode] = useState('m'); // 'm' = roadmap, 'k' = satellite
  const [mapDisplayMode, setMapDisplayMode] = useState('pin'); // 'pin' = single pin focus, 'directions' = connected route path
  const [copiedTask, setCopiedTask] = useState(false);

  // Modals state
  const [showAddCustomerModal, setShowAddCustomerModal] = useState(false);
  const [showAddDriverModal, setShowAddDriverModal] = useState(false);
  const [showAddKitchenModal, setShowAddKitchenModal] = useState(false);
  const [showCreateRouteModal, setShowCreateRouteModal] = useState(false);
  const [showAddMenuModal, setShowAddMenuModal] = useState(false);
  
  // Meal & Delivery Customization Modal state
  const [editingMealCustomer, setEditingMealCustomer] = useState(null);
  const [mealForm, setMealForm] = useState({
    subscriptionType: '',
    chosenDeliveryDay: 'Wednesday',
    kitchenNotes: '',
    deliveryNotes: ''
  });

  const handleOpenMealModal = (cust) => {
    setEditingMealCustomer(cust);
    setMealForm({
      subscriptionType: cust.subscriptionType || 'UNSUN — Alternate Days (Mon, Wed, Fri)',
      chosenDeliveryDay: cust.chosenDeliveryDay || 'Wednesday',
      kitchenNotes: cust.kitchenNotes || cust.specialInstructions || '',
      deliveryNotes: cust.deliveryNotes || ''
    });
  };

  // Schedule Leave / Custom Date Range Modal state
  const [schedulingLeaveCustomer, setSchedulingLeaveCustomer] = useState(null);
  const [openStatusMenuId, setOpenStatusMenuId] = useState(null);
  const [openNotesMenuId, setOpenNotesMenuId] = useState(null);
  const [leaveRangeForm, setLeaveRangeForm] = useState({
    from: new Date().toISOString().slice(0, 10),
    to: new Date(Date.now() + 2 * 86400000).toISOString().slice(0, 10),
    reason: 'Personal Travel / Vacation',
    autoExtend: true
  });

  // Cancellation Modal state
  const [cancellingCustomer, setCancellingCustomer] = useState(null);
  const [cancelForm, setCancelForm] = useState({
    reason: 'Relocating / Moving out of city',
    perMealRate: 120,
    refundAmount: 0
  });

  // Form states
  const [newCustomer, setNewCustomer] = useState({
    name: '',
    phone: '',
    address: '',
    routeId: 'ROUTE-A',
    subscriptionType: 'UNSUN — Alternate Days (Mon, Wed, Fri)',
    chosenDeliveryDay: 'Wednesday',
    startDate: '2026-11-01',
    endDate: '2026-12-01',
    paymentStatus: 'Paid',
    paymentMode: 'UPI (Google Pay)',
    kitchenNotes: 'Standard balanced portion',
    deliveryNotes: 'Standard doorstep drop',
    specialInstructions: 'Standard balanced portion'
  });

  const [newDriver, setNewDriver] = useState({
    name: '',
    photo: '',
    phone: '',
    secondaryPhone: '',
    aadhaar: '',
    address: '',
    assignedRouteId: 'ROUTE-A'
  });

  const [newKitchenStaff, setNewKitchenStaff] = useState({
    name: '',
    photo: '',
    phone: '',
    secondaryPhone: '',
    aadhaar: '',
    address: '',
    role: 'Prep Cook',
    station: 'Sprouts & Salad Station',
    shift: 'Morning (06:00 AM - 12:00 PM)'
  });

  // Edit Staff Modal State (Driver or Kitchen)
  const [editingStaff, setEditingStaff] = useState(null); // { type: 'driver' | 'kitchen', data: { ... } }
  const [viewingStaffBadge, setViewingStaffBadge] = useState(null);

  const [newRoute, setNewRoute] = useState({
    name: '',
    zone: '',
    description: ''
  });

  // Quick HD Dish Photo Presets
  const dishPhotoPresets = [
    {
      title: "Sprouts Bowl",
      image: "https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=600&q=80",
      category: "High Protein",
      defaultProtein: "18g",
      defaultWeight: "250g",
      defaultPrice: 130
    },
    {
      title: "Papaya Salad",
      image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=600&q=80",
      category: "Hydration & Fiber",
      defaultProtein: "4g",
      defaultWeight: "180g",
      defaultPrice: 85
    },
    {
      title: "Ragi Laddu",
      image: "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=600&q=80",
      category: "Iron & Energy",
      defaultProtein: "6g",
      defaultWeight: "40g",
      defaultPrice: 45
    },
    {
      title: "Roasted Nuts",
      image: "https://images.unsplash.com/photo-1508737027454-e6454ef45afd?auto=format&fit=crop&w=600&q=80",
      category: "Healthy Fats",
      defaultProtein: "7g",
      defaultWeight: "30g",
      defaultPrice: 75
    },
    {
      title: "Paneer & Chana",
      image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80",
      category: "Keto Special",
      defaultProtein: "22g",
      defaultWeight: "240g",
      defaultPrice: 155
    },
    {
      title: "Chia Pudding",
      image: "https://images.unsplash.com/photo-1490474418585-ba9bad8fd0ea?auto=format&fit=crop&w=600&q=80",
      category: "Antioxidants",
      defaultProtein: "8g",
      defaultWeight: "100g",
      defaultPrice: 110
    }
  ];

  const [newMenuItem, setNewMenuItem] = useState({
    name: '',
    category: 'High Protein',
    weight: '250g',
    quantity: '250g',
    protein: '18g',
    price: 130,
    calories: '280 kcal',
    dietary: 'Vegan & High Fiber',
    image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=600&q=80',
    ingredients: ''
  });

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Customer Portal Live Metrics Calculation
  const totalCustomersCount = customers.length;
  const activeCustomersCount = customers.filter(c => c.todayDeliveryStatus !== 'On Leave' && c.todayDeliveryStatus !== 'Cancelled' && c.subscriptionStatus !== 'Cancelled').length;
  const pausedCustomersCount = customers.filter(c => c.todayDeliveryStatus === 'On Leave').length;
  const cancelledCustomersCount = customers.filter(c => c.todayDeliveryStatus === 'Cancelled' || c.subscriptionStatus === 'Cancelled').length;
  const todayDeliveriesCount = customers.filter(c => (c.todayDeliveryStatus === 'Pending' || c.todayDeliveryStatus === 'Delivered') && c.subscriptionStatus !== 'Cancelled').length;
  const todayPickupsCount = customers.filter(c => c.dabbasHeld && c.dabbasHeld.length > 0).length;

  // Dabba circulation statistics
  const totalDabbas = dabbas.length;
  const inGodown = dabbas.filter(d => d.status === 'in_godown').length;
  const withDelivery = dabbas.filter(d => d.status === 'with_delivery').length;
  const withCustomer = dabbas.filter(d => d.status === 'with_customer').length;
  const missingAlert = dabbas.filter(d => d.status === 'missing_alert').length;

  // Filtered customers with Search & Quick Status Filters
  const filteredCustomers = customers.filter(c => {
    const matchesSearch = 
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.phone.includes(searchQuery) ||
      c.address.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;

    if (customerFilter === 'active') return c.todayDeliveryStatus !== 'On Leave' && c.todayDeliveryStatus !== 'Cancelled' && c.subscriptionStatus !== 'Cancelled';
    if (customerFilter === 'paused') return c.todayDeliveryStatus === 'On Leave';
    if (customerFilter === 'cancelled') return c.todayDeliveryStatus === 'Cancelled' || c.subscriptionStatus === 'Cancelled';
    if (customerFilter === 'delivery') return (c.todayDeliveryStatus === 'Pending' || c.todayDeliveryStatus === 'Delivered') && c.subscriptionStatus !== 'Cancelled';
    if (customerFilter === 'pickup') return c.dabbasHeld && c.dabbasHeld.length > 0;
    return true;
  });

  // Financial summary
  const totalRevenue = 185400;
  const pendingDues = 24600;
  const renewalRate = "92.4%";
  const churnRate = "3.8%";

  // Handlers
  const handleCustomerSubmit = (e) => {
    e.preventDefault();
    if (!newCustomer.name || !newCustomer.phone) return;
    let deliveryDays = ['Monday', 'Wednesday', 'Friday'];
    let deliveryCadence = 'Alternate Days (Except Sunday)';
    if (newCustomer.subscriptionType.includes('Tue, Thu, Sat')) {
      deliveryDays = ['Tuesday', 'Thursday', 'Saturday'];
    } else if (newCustomer.subscriptionType.includes('One Day Meal')) {
      deliveryDays = [newCustomer.chosenDeliveryDay || 'Wednesday'];
      deliveryCadence = 'Specific Chosen Day';
    }

    onAddCustomer({
      ...newCustomer,
      id: `CUST-00${customers.length + 1}`,
      mapLink: `https://maps.google.com/?q=${encodeURIComponent(newCustomer.address || 'Hyderabad')}`,
      deliveryDays,
      deliveryCadence,
      remainingDays: 30,
      todayDeliveryStatus: 'Pending',
      dabbasHeld: [],
      dabbasReturnedTotal: 0,
      handedOverToday: [],
      leaveHistory: [],
      unreadNotifications: 0
    });
    setShowAddCustomerModal(false);
    setNewCustomer({
      name: '',
      phone: '',
      address: '',
      routeId: 'ROUTE-A',
      subscriptionType: 'UNSUN — Alternate Days (Mon, Wed, Fri)',
      chosenDeliveryDay: 'Wednesday',
      startDate: '2026-11-01',
      endDate: '2026-12-01',
      paymentStatus: 'Paid',
      paymentMode: 'UPI (Google Pay)',
      kitchenNotes: 'Standard balanced portion',
      deliveryNotes: 'Standard doorstep drop',
      specialInstructions: 'Standard balanced portion'
    });
    showToast(`Customer ${newCustomer.name} enrolled successfully!`);
  };

  const handleDriverSubmit = (e) => {
    e.preventDefault();
    if (!newDriver.name || !newDriver.phone) return;
    const assignedRoute = routes.find(r => r.id === newDriver.assignedRouteId);
    onAddDeliveryBoy({
      id: `DBOY-0${deliveryBoys.length + 1}`,
      name: newDriver.name,
      photo: newDriver.photo || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80',
      phone: newDriver.phone,
      secondaryPhone: newDriver.secondaryPhone || '',
      aadhaar: newDriver.aadhaar || '',
      address: newDriver.address || '',
      routeZone: assignedRoute ? `${assignedRoute.name} (${assignedRoute.zone})` : 'Unassigned',
      assignedRouteId: newDriver.assignedRouteId,
      assignedCustomerIds: [],
      status: 'Checked Out',
      checkedInTime: null,
      checkedOutTime: null,
      totalDeliveriesToday: 0,
      completedDeliveries: 0,
      carryingDabbas: [],
      collectedReturnDabbas: [],
      pendingCollectionCustomerIds: []
    });
    setShowAddDriverModal(false);
    setNewDriver({
      name: '',
      photo: '',
      phone: '',
      secondaryPhone: '',
      aadhaar: '',
      address: '',
      assignedRouteId: routes[0]?.id || 'ROUTE-A'
    });
    showToast(`Delivery Partner ${newDriver.name} onboarded successfully!`);
  };

  const handleKitchenStaffSubmit = (e) => {
    e.preventDefault();
    if (!newKitchenStaff.name || !newKitchenStaff.phone) return;
    onAddKitchenStaff({
      id: `KSTF-0${kitchenStaff.length + 1}`,
      name: newKitchenStaff.name,
      photo: newKitchenStaff.photo || 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=200&auto=format&fit=crop&q=80',
      phone: newKitchenStaff.phone,
      secondaryPhone: newKitchenStaff.secondaryPhone || '',
      aadhaar: newKitchenStaff.aadhaar || '',
      address: newKitchenStaff.address || '',
      role: newKitchenStaff.role,
      station: newKitchenStaff.station,
      shift: newKitchenStaff.shift,
      status: 'On Shift'
    });
    setShowAddKitchenModal(false);
    setNewKitchenStaff({
      name: '',
      photo: '',
      phone: '',
      secondaryPhone: '',
      aadhaar: '',
      address: '',
      role: 'Prep Cook',
      station: 'Sprouts & Salad Station',
      shift: 'Morning (06:00 AM - 12:00 PM)'
    });
    showToast(`Kitchen crew member ${newKitchenStaff.name} added!`);
  };

  const handleQuickRouteReassign = (driverId, newRouteId) => {
    if (onUpdateDeliveryBoy) {
      onUpdateDeliveryBoy(driverId, { assignedRouteId: newRouteId });
      const rName = routes.find(r => r.id === newRouteId)?.name || newRouteId;
      showToast(`Driver reassigned to ${rName}!`);
    }
  };

  const handleSaveStaffEdit = (e) => {
    e.preventDefault();
    if (!editingStaff) return;
    const { type, data } = editingStaff;
    if (type === 'driver') {
      if (onUpdateDeliveryBoy) {
        onUpdateDeliveryBoy(data.id, data);
        showToast(`Updated driver profile for ${data.name}!`);
      }
    } else {
      if (onUpdateKitchenStaff) {
        onUpdateKitchenStaff(data.id, data);
        showToast(`Updated crew member profile for ${data.name}!`);
      }
    }
    setEditingStaff(null);
  };

  const handleRouteSubmit = (e) => {
    e.preventDefault();
    if (!newRoute.name) return;
    onCreateRoute({
      id: `ROUTE-${String.fromCharCode(65 + routes.length)}`,
      name: newRoute.name,
      zone: newRoute.zone,
      description: newRoute.description,
      assignedDriverId: null,
      totalStops: 0
    });
    setShowCreateRouteModal(false);
    setNewRoute({ name: '', zone: '', description: '' });
    showToast(`New delivery route created.`);
  };

  // Route Ordering & WhatsApp Dispatch Helpers
  const getOrderedRouteStops = (routeId) => {
    const routeCustomers = customers.filter(c => c.routeId === routeId && c.subscriptionStatus !== 'Cancelled');
    const customOrder = routeStopOrders[routeId];
    if (!customOrder || customOrder.length === 0) return routeCustomers;
    
    // Sort according to customOrder, appending any customers not in customOrder
    const ordered = [];
    customOrder.forEach(id => {
      const found = routeCustomers.find(c => c.id === id);
      if (found) ordered.push(found);
    });
    routeCustomers.forEach(c => {
      if (!ordered.some(o => o.id === c.id)) ordered.push(c);
    });
    return ordered;
  };

  const handleMoveRouteStop = (routeId, index, direction) => {
    const currentStops = getOrderedRouteStops(routeId);
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= currentStops.length) return;

    const newStops = [...currentStops];
    const temp = newStops[index];
    newStops[index] = newStops[targetIndex];
    newStops[targetIndex] = temp;

    setRouteStopOrders(prev => ({
      ...prev,
      [routeId]: newStops.map(s => s.id)
    }));
    showToast(`Updated delivery stop order (${index + 1} ➔ ${targetIndex + 1})`);
  };

  const handleResetRouteOrder = (routeId) => {
    setRouteStopOrders(prev => {
      const updated = { ...prev };
      delete updated[routeId];
      return updated;
    });
    showToast(`Reset route stops to original address sequence.`);
  };

  const getCustomerCoordinates = (cust) => {
    if (cust?.coordinates?.lat && cust?.coordinates?.lng) {
      return cust.coordinates;
    }
    const addr = (cust?.address || '').toLowerCase();
    if (addr.includes('alipiri') || addr.includes('balaji colony') || addr.includes('kt road') || addr.includes('iskcon')) return { lat: 13.6420, lng: 79.4080 };
    if (addr.includes('bhavani') || addr.includes('korlagunta') || addr.includes('air bypass') || addr.includes('annamaiah')) return { lat: 13.6265, lng: 79.4250 };
    if (addr.includes('mr palli') || addr.includes('chandragiri') || addr.includes('sv university') || addr.includes('bairagi')) return { lat: 13.6180, lng: 79.4080 };
    if (addr.includes('mangalam') || addr.includes('karakambadi') || addr.includes('renigunta') || addr.includes('settipalli')) return { lat: 13.6450, lng: 79.4450 };
    return { lat: 13.6288, lng: 79.4192 };
  };

  const generateWhatsAppRouteMessage = (route, driver, stops) => {
    const dateStr = new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
    const totalPickups = stops.filter(s => s.dabbasHeld && s.dabbasHeld.length > 0).length;

    let msg = `🍱 *HEALTHI DABBA — TODAY'S ROUTE DISPATCH*\n`;
    msg += `📅 *Date:* ${dateStr} | *Zone:* ${route ? route.name : 'All Zones'}\n`;
    msg += `🚴 *Driver:* ${driver ? `${driver.name} (${driver.phone})` : 'Driver Unassigned'}\n`;
    msg += `📦 *Total Deliveries:* ${stops.length} Boxes | ⚠️ *Pickups Due:* ${totalPickups} Boxes\n\n`;
    msg += `━━━━━━━━━━━━━━━━━━━━\n`;
    msg += `📍 *DELIVERY STOPS SEQUENCE (Turn-by-Turn):*\n\n`;

    stops.forEach((c, idx) => {
      const cCoord = getCustomerCoordinates(c);
      msg += `*${idx + 1}️⃣ Stop #${idx + 1}: ${c.name}*\n`;
      msg += `🏠 Address: ${c.address}\n`;
      msg += `📞 Phone: ${c.phone}\n`;
      msg += `🍱 Plan: ${c.subscriptionType ? (c.subscriptionType.includes('One Day Meal') ? `One Day Meal (${c.chosenDeliveryDay || 'Custom Day'})` : c.subscriptionType.split('—')[0].trim()) : 'Daily Meal'}\n`;
      if (c.kitchenNotes || c.deliveryNotes) {
        msg += `📝 Note: ${[c.kitchenNotes, c.deliveryNotes].filter(Boolean).join(' • ')}\n`;
      }
      if (c.autoPickupDue && c.autoPickupDue.isDue) {
        msg += `⚠️ *Auto-Pickup Due:* ${c.autoPickupDue.dabbaId} (${c.autoPickupDue.note})\n`;
      } else if (c.dabbasHeld && c.dabbasHeld.length > 0) {
        msg += `⚠️ *Collect Empty Box:* ${c.dabbasHeld.join(', ')}\n`;
      }
      msg += `🗺️ Google Map Pin: ${c.mapLink || `https://maps.google.com/?q=${cCoord.lat},${cCoord.lng}`}\n\n`;
    });

    msg += `━━━━━━━━━━━━━━━━━━━━\n`;
    msg += `🛵 *Instructions:* Please confirm box handovers & return collected empty dabbas to Kitchen Godown. Safe driving!`;

    return msg;
  };

  const handleDispatchWhatsApp = (route, driver, stops) => {
    if (!driver || !driver.phone) {
      alert("Please assign a delivery driver with a valid phone number first!");
      return;
    }
    const msg = generateWhatsAppRouteMessage(route, driver, stops);
    let cleanPhone = driver.phone.replace(/[^0-9]/g, '');
    if (cleanPhone.length === 10) cleanPhone = '91' + cleanPhone;
    
    const url = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(msg)}`;
    window.open(url, '_blank');
    showToast(`Opening WhatsApp with today's route task for ${driver.name}!`);
  };

  const handleCopyRouteTask = (route, driver, stops) => {
    const msg = generateWhatsAppRouteMessage(route, driver, stops);
    if (navigator?.clipboard?.writeText) {
      navigator.clipboard.writeText(msg).then(() => {
        setCopiedTask(true);
        setTimeout(() => setCopiedTask(false), 2500);
        showToast("Copied formatted route task to clipboard!");
      });
    } else {
      showToast("Clipboard copy not supported in this browser.");
    }
  };

  const handleMenuSubmit = (e) => {
    e.preventDefault();
    if (!newMenuItem.name) return;
    onAddMenuItem(menuSubTab, {
      id: `MNU-${Date.now()}`,
      name: newMenuItem.name,
      category: newMenuItem.category,
      weight: newMenuItem.weight || newMenuItem.quantity || '200g',
      quantity: newMenuItem.weight || newMenuItem.quantity || '200g',
      protein: newMenuItem.protein ? (newMenuItem.protein.toString().endsWith('g') ? newMenuItem.protein : `${newMenuItem.protein}g`) : '16g',
      price: parseFloat(newMenuItem.price) || 120,
      calories: newMenuItem.calories || '250 kcal',
      dietary: newMenuItem.dietary || '100% Pure Veg',
      image: newMenuItem.image || 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=600&q=80',
      ingredients: newMenuItem.ingredients || 'Fresh organic ingredients'
    });
    setShowAddMenuModal(false);
    setNewMenuItem({
      name: '',
      category: 'High Protein',
      weight: '250g',
      quantity: '250g',
      protein: '18g',
      price: 130,
      calories: '280 kcal',
      dietary: 'Vegan & High Fiber',
      image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=600&q=80',
      ingredients: ''
    });
    showToast(`New dish "${newMenuItem.name}" added to ${menuSubTab.toUpperCase()} menu.`);
  };

  const handleBroadcast = (e) => {
    e.preventDefault();
    if (!broadcastMsg.trim()) return;
    onBroadcastUrgentInstruction(broadcastMsg);
    setBroadcastMsg('');
    showToast("Urgent broadcast dispatched to all driver handsets & kitchen.");
  };

  const exportReport = (format) => {
    const headers = ["Customer ID", "Name", "Phone", "Route", "Plan", "Payment Status", "Today Status", "Dabbas Held", "Dabbas Returned"];
    const rows = filteredCustomers.map(c => [
      c.id,
      `"${c.name}"`,
      `"${c.phone}"`,
      `"${c.routeId || 'N/A'}"`,
      `"${c.subscriptionType}"`,
      c.paymentStatus,
      c.todayDeliveryStatus,
      c.dabbasHeld.length,
      c.dabbasReturnedTotal
    ]);
    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map(e => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `healthi_dabba_customer_report_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast(`Customer audit report exported successfully.`);
  };

  return (
    <div className="space-y-6 w-full max-w-[1520px] mx-auto">
      
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-charcoal text-cream-50 px-5 py-3.5 rounded-2xl shadow-apple-modal border border-edge text-xs font-semibold flex items-center gap-2.5 animate-bounce">
          <CheckCircle2 className="w-4 h-4 text-forest-100" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Admin Master Header Banner */}
      <div className="bg-white rounded-3xl p-6 sm:p-7 border border-edge shadow-apple-card flex flex-col md:flex-row md:items-center justify-between gap-5">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-forest-700 flex items-center justify-center text-cream-50 shadow-apple-sm flex-shrink-0">
            <ShieldCheck className="w-7 h-7 text-cream-100" />
          </div>
          <div>
            <div className="flex items-center gap-2.5 flex-wrap">
              <h1 className="text-xl sm:text-2xl font-bold text-charcoal tracking-tight">Healthi Dabba Control Center</h1>
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-forest-50 text-forest-700 border border-forest-100">
                Admin OS Master
              </span>
            </div>
            <p className="text-xs text-charcoal-muted mt-1">
              Full control over Customer Subscriptions, Pickups, Deliveries, Staff & Menus
            </p>
          </div>
        </div>

        {/* Global Export Button */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => exportReport('excel')}
            className="px-4 py-2.5 text-xs font-bold rounded-2xl border border-edge bg-cream-50 hover:bg-cream-100 text-charcoal apple-press flex items-center gap-2"
          >
            <Download className="w-4 h-4 text-forest-700" />
            <span>Export Customer Report</span>
          </button>
        </div>
      </div>

      {/* Core Navigation Tabs (Sticky on Mobile) */}
      <div className="sticky top-14 sm:top-16 z-30 flex items-center gap-1.5 p-1.5 bg-white/95 sm:bg-cream-100 backdrop-blur-xl rounded-2xl border border-edge shadow-xs overflow-x-auto no-scrollbar scroll-smooth">
        {[
          { id: 'customers', label: 'Customer Portal', icon: Users, badge: customers.length },
          { id: 'staff', label: 'Staff Fleet & Kitchen', icon: Bike, badge: deliveryBoys.length + kitchenStaff.length },
          { id: 'routes', label: 'Routes & Assignments', icon: RouteIcon, badge: routes.length },
          { id: 'menu', label: 'Daily Menu & Dishes', icon: Utensils, badge: 'Active' },
          { id: 'dabbas', label: 'Dabba Fleet Tracking', icon: Package, badge: `${inGodown}/${totalDabbas}` },
          { id: 'finance', label: 'Finance & Revenue', icon: CreditCard },
          { id: 'broadcast', label: 'Staff Broadcast', icon: Send }
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold rounded-xl whitespace-nowrap apple-press transition-all ${
                isActive
                  ? 'bg-white text-forest-800 shadow-apple-sm'
                  : 'text-charcoal-muted hover:text-charcoal'
              }`}
            >
              <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-forest-600' : 'text-charcoal-subtle'}`} />
              <span>{tab.label}</span>
              {tab.badge !== undefined && (
                <span className={`text-[10px] px-1.5 py-0.2 rounded-md ${
                  isActive ? 'bg-forest-50 text-forest-700' : 'bg-cream-200 text-charcoal-muted'
                }`}>
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* ========================================================================= */}
      {/* 1. CUSTOMER PORTAL TAB (DEDICATED METRICS + SEARCH + DETAILED REPORT) */}
      {/* ========================================================================= */}
      {activeTab === 'customers' && (
        <div className="space-y-6">
          
          {/* Top 5 KPI Metric Cards for Customer Portal */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            
            {/* 1. Total Customers */}
            <div 
              onClick={() => setCustomerFilter('all')}
              className={`p-5 rounded-3xl border transition-all cursor-pointer apple-press shadow-apple-card flex flex-col justify-between ${
                customerFilter === 'all' ? 'bg-white border-forest-600 ring-2 ring-forest-600/10' : 'bg-white border-edge'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-charcoal-muted uppercase tracking-wider">Total Customers</span>
                <Users className="w-4 h-4 text-charcoal-muted" />
              </div>
              <div className="mt-3">
                <span className="text-3xl sm:text-4xl font-extrabold text-charcoal tracking-tight">{totalCustomersCount}</span>
                <span className="text-[11px] text-charcoal-muted block mt-1">All enrolled accounts</span>
              </div>
            </div>

            {/* 2. Active Customers */}
            <div 
              onClick={() => setCustomerFilter('active')}
              className={`p-5 rounded-3xl border transition-all cursor-pointer apple-press shadow-apple-card flex flex-col justify-between ${
                customerFilter === 'active' ? 'bg-forest-50/80 border-forest-600 ring-2 ring-forest-600/10' : 'bg-white border-edge'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-forest-700 uppercase tracking-wider">Active</span>
                <CheckCircle2 className="w-4 h-4 text-forest-600" />
              </div>
              <div className="mt-3">
                <span className="text-3xl sm:text-4xl font-extrabold text-forest-700 tracking-tight">{activeCustomersCount}</span>
                <span className="text-[11px] text-forest-700 font-semibold block mt-1">Receiving meals today</span>
              </div>
            </div>

            {/* 3. Paused / On Leave */}
            <div 
              onClick={() => setCustomerFilter('paused')}
              className={`p-5 rounded-3xl border transition-all cursor-pointer apple-press shadow-apple-card flex flex-col justify-between ${
                customerFilter === 'paused' ? 'bg-warmamber-50/80 border-warmamber-600 ring-2 ring-warmamber-600/10' : 'bg-white border-edge'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-warmamber-600 uppercase tracking-wider">Paused (Leaves)</span>
                <PauseCircle className="w-4 h-4 text-warmamber-600" />
              </div>
              <div className="mt-3">
                <span className="text-3xl sm:text-4xl font-extrabold text-warmamber-600 tracking-tight">{pausedCustomersCount}</span>
                <span className="text-[11px] text-warmamber-600 font-semibold block mt-1">Plan auto-extended</span>
              </div>
            </div>

            {/* 4. Today's Delivery Scheduled */}
            <div 
              onClick={() => setCustomerFilter('delivery')}
              className={`p-5 rounded-3xl border transition-all cursor-pointer apple-press shadow-apple-card flex flex-col justify-between ${
                customerFilter === 'delivery' ? 'bg-forest-50/80 border-forest-600 ring-2 ring-forest-600/10' : 'bg-white border-edge'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-forest-700 uppercase tracking-wider">Today's Delivery</span>
                <Truck className="w-4 h-4 text-forest-700" />
              </div>
              <div className="mt-3">
                <span className="text-3xl sm:text-4xl font-extrabold text-forest-700 tracking-tight">{todayDeliveriesCount}</span>
                <span className="text-[11px] text-charcoal-muted block mt-1">Active meal packs</span>
              </div>
            </div>

            {/* 5. Today's Box Pickups Due */}
            <div 
              onClick={() => setCustomerFilter('pickup')}
              className={`p-5 rounded-3xl border transition-all cursor-pointer apple-press shadow-apple-card flex flex-col justify-between ${
                customerFilter === 'pickup' ? 'bg-terracotta-50/80 border-terracotta-500 ring-2 ring-terracotta-500/10' : 'bg-white border-edge'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-terracotta-500 uppercase tracking-wider">Box Pickups Due</span>
                <RotateCcw className="w-4 h-4 text-terracotta-500" />
              </div>
              <div className="mt-3">
                <span className="text-3xl sm:text-4xl font-extrabold text-terracotta-500 tracking-tight">{todayPickupsCount}</span>
                <span className="text-[11px] text-terracotta-500 font-semibold block mt-1">Customers holding boxes</span>
              </div>
            </div>

          </div>

          {/* Search Bar & Quick Filter Chips & Add Customer Action */}
          <div className="bg-white rounded-3xl p-5 border border-edge shadow-apple-card flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            
            {/* Live Search Input */}
            <div className="relative flex-1 max-w-lg">
              <Search className="w-4 h-4 text-charcoal-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search specific customer by Name, Phone, ID, or Area..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 text-xs rounded-2xl border border-edge bg-cream-50 focus:outline-none focus:border-forest-600 focus:bg-white text-charcoal font-semibold"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-charcoal-muted hover:text-charcoal font-bold"
                >
                  Clear
                </button>
              )}
            </div>

            {/* Filter Chips & Add Button */}
            <div className="flex items-center gap-2 flex-wrap">
              {[
                { id: 'all', label: `All (${totalCustomersCount})` },
                { id: 'active', label: `Active (${activeCustomersCount})` },
                { id: 'paused', label: `Paused (${pausedCustomersCount})` },
                { id: 'cancelled', label: `Cancelled (${cancelledCustomersCount})` },
                { id: 'delivery', label: `Deliveries (${todayDeliveriesCount})` },
                { id: 'pickup', label: `Pickups (${todayPickupsCount})` }
              ].map((chip) => (
                <button
                  key={chip.id}
                  onClick={() => setCustomerFilter(chip.id)}
                  className={`px-3 py-1.5 text-xs font-bold rounded-xl transition-all apple-press ${
                    customerFilter === chip.id
                      ? 'bg-forest-700 text-white shadow-apple-sm'
                      : 'bg-cream-100 text-charcoal-muted hover:text-charcoal hover:bg-cream-200'
                  }`}
                >
                  {chip.label}
                </button>
              ))}

              <button
                onClick={() => setShowAddCustomerModal(true)}
                className="px-4 py-2 text-xs font-bold rounded-xl bg-forest-700 text-white hover:bg-forest-800 apple-press shadow-apple-sm flex items-center gap-1.5 ml-auto"
              >
                <Plus className="w-4 h-4" />
                <span>Add Customer</span>
              </button>
            </div>
          </div>

          {/* Detailed Customer Report Table */}
          <div className="bg-white rounded-3xl border border-edge shadow-apple-card overflow-hidden">
            <div className="p-5 border-b border-edge flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-base font-bold text-charcoal">Customer Detail Report</h3>
                <p className="text-xs text-charcoal-muted">
                  Showing {filteredCustomers.length} of {totalCustomersCount} customers matching selected filter
                </p>
              </div>
              <button
                onClick={() => exportReport('csv')}
                className="px-3.5 py-1.5 text-xs font-bold rounded-xl border border-edge bg-cream-50 hover:bg-cream-100 text-charcoal apple-press flex items-center gap-1.5 self-start sm:self-auto"
              >
                <FileSpreadsheet className="w-3.5 h-3.5 text-forest-700" />
                <span>Download Report CSV</span>
              </button>
            </div>

            {/* Mobile Touch Cards List (Visible on Mobile screens) */}
            <div className="md:hidden divide-y divide-edge">
              {filteredCustomers.map((cust) => {
                const custRoute = routes.find(r => r.id === cust.routeId);
                const isCancelled = cust.todayDeliveryStatus === 'Cancelled' || cust.subscriptionStatus === 'Cancelled';
                const isPaused = cust.todayDeliveryStatus === 'On Leave';
                const hasPickupDue = cust.dabbasHeld && cust.dabbasHeld.length > 0;

                return (
                  <div key={cust.id} className="p-3.5 space-y-2.5 bg-white hover:bg-cream-50/50 transition-colors">
                    {/* Header: ID, Name, Eye button, Delivery Status Badge */}
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2 min-w-0">
                        <button
                          type="button"
                          onClick={() => onSelectCustomer && onSelectCustomer(cust.id)}
                          className="w-8 h-8 rounded-xl bg-forest-50 text-forest-700 border border-forest-100 flex items-center justify-center flex-shrink-0 apple-press"
                          title="Open Customer App"
                        >
                          <Eye className="w-4 h-4 text-forest-700" />
                        </button>
                        <div className="min-w-0">
                          <h4 
                            onClick={() => onSelectCustomer && onSelectCustomer(cust.id)}
                            className="font-bold text-sm text-charcoal truncate cursor-pointer hover:text-forest-700 text-left"
                          >
                            {cust.name}
                          </h4>
                          <div className="flex items-center gap-1.5 text-[10px] text-charcoal-muted font-mono">
                            <span>{cust.id}</span>
                            <span>•</span>
                            <span className="font-sans font-bold text-forest-800">
                              {custRoute?.name ? custRoute.name.split('—')[0] : cust.routeId}
                            </span>
                          </div>
                        </div>
                      </div>

                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold flex-shrink-0 ${
                        isCancelled
                          ? 'bg-rose-50 text-rose-700 border border-rose-200'
                          : isPaused
                          ? 'bg-warmamber-50 text-warmamber-700 border border-warmamber-200'
                          : cust.todayDeliveryStatus === 'Delivered'
                          ? 'bg-forest-50 text-forest-700 border border-forest-100'
                          : 'bg-cream-200 text-charcoal'
                      }`}>
                        {cust.todayDeliveryStatus}
                      </span>
                    </div>

                    {/* Address & Direct Phone Dialer */}
                    <div className="flex items-center justify-between text-xs bg-cream-50/80 p-2.5 rounded-2xl border border-edge/60">
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-1 text-[11px] text-charcoal-muted">
                          <MapPin className="w-3.5 h-3.5 text-forest-700 flex-shrink-0" />
                          <span className="truncate">{cust.address}</span>
                        </div>
                      </div>
                      <a 
                        href={`tel:${cust.phone}`}
                        className="ml-2 px-2.5 py-1 rounded-xl bg-white border border-edge text-forest-800 font-bold text-[11px] flex items-center gap-1 shadow-xs flex-shrink-0 apple-press"
                      >
                        <Phone className="w-3 h-3 text-forest-700" />
                        <span>Call</span>
                      </a>
                    </div>

                    {/* Subscription & Dabba Info */}
                    <div className="flex items-center justify-between text-xs pt-0.5">
                      <div>
                        <span className="font-bold text-charcoal text-xs block">
                          {cust.subscriptionType.split('(')[0]}
                        </span>
                        <span className="text-[10px] text-charcoal-muted block">
                          {cust.remainingDays} days remaining ({cust.startDate} to {cust.endDate})
                        </span>
                      </div>

                      {hasPickupDue ? (
                        <span className="px-2 py-1 rounded-xl text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-200 flex items-center gap-1">
                          <Package className="w-3 h-3 text-amber-700" />
                          <span>Pickup: {cust.dabbasHeld.join(', ')}</span>
                        </span>
                      ) : (
                        <span className="text-[10px] text-forest-700 font-semibold">
                          ✓ Box Returned
                        </span>
                      )}
                    </div>

                    {/* Mobile 1-Tap Actions */}
                    <div className="flex items-center gap-1.5 pt-1">
                      <button
                        type="button"
                        onClick={() => onToggleSkipToday(cust.id)}
                        className={`flex-1 py-1.5 px-2 text-[11px] font-bold rounded-xl border transition-all flex items-center justify-center gap-1 apple-press ${
                          isPaused
                            ? 'bg-forest-50 text-forest-700 border-forest-200 hover:bg-forest-100'
                            : 'bg-cream-100 text-charcoal hover:bg-amber-50 hover:text-amber-800 border-edge'
                        }`}
                      >
                        {isPaused ? <Play className="w-3 h-3 text-forest-600" /> : <Pause className="w-3 h-3 text-amber-600" />}
                        <span>{isPaused ? 'Resume Today' : 'Pause Today'}</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleOpenLeaveModal(cust)}
                        className="flex-1 py-1.5 px-2 text-[11px] font-bold rounded-xl bg-cream-100 hover:bg-white text-charcoal border border-edge flex items-center justify-center gap-1 apple-press"
                      >
                        <Calendar className="w-3 h-3 text-forest-700" />
                        <span>Schedule Leave</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          if (confirm(`Cancel subscription for ${cust.name}?`)) {
                            handleOpenCancelModal(cust);
                          }
                        }}
                        className="p-1.5 rounded-xl bg-cream-100 hover:bg-rose-50 text-charcoal-subtle hover:text-rose-600 border border-edge apple-press"
                        title="Delete / Cancel"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}

              {filteredCustomers.length === 0 && (
                <div className="p-8 text-center text-xs text-charcoal-muted italic">
                  No customers found matching your search query or filter.
                </div>
              )}
            </div>

            {/* Desktop Table View (Hidden on Mobile screens) */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-cream-100/80 border-b border-edge text-charcoal-muted">
                  <tr>
                    <th className="p-4 font-bold">Customer ID & Name</th>
                    <th className="p-4 font-bold">Phone & Address</th>
                    <th className="p-4 font-bold">Plan & Duration</th>
                    <th className="p-4 font-bold">Today's Delivery Action</th>
                    <th className="p-4 font-bold">Box Return / Pickup Due</th>
                    <th className="p-4 font-bold">Assigned Route</th>
                    <th className="p-4 font-bold">Payment</th>
                    <th className="p-4 font-bold text-right">Delete</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-edge">
                  {filteredCustomers.map((cust) => {
                    const custRoute = routes.find(r => r.id === cust.routeId);
                    const isCancelled = cust.todayDeliveryStatus === 'Cancelled' || cust.subscriptionStatus === 'Cancelled';
                    const isPaused = cust.todayDeliveryStatus === 'On Leave';
                    const hasPickupDue = cust.dabbasHeld && cust.dabbasHeld.length > 0;

                    return (
                      <tr key={cust.id} className="hover:bg-cream-50/70">
                        
                        {/* ID & Name with Left Eye Icon */}
                        <td className="p-4">
                          <div className="flex items-center gap-2.5">
                            <button
                              type="button"
                              onClick={() => onSelectCustomer && onSelectCustomer(cust.id)}
                              title={`Open ${cust.name} in Customer App`}
                              className="w-8 h-8 rounded-xl bg-forest-50 hover:bg-forest-100 text-forest-700 border border-forest-100/80 flex items-center justify-center transition-all apple-press flex-shrink-0 group shadow-apple-sm"
                            >
                              <Eye className="w-4 h-4 text-forest-700 group-hover:scale-110 transition-transform" />
                            </button>
                            <div className="min-w-0">
                              <button
                                type="button"
                                onClick={() => onSelectCustomer && onSelectCustomer(cust.id)}
                                title={`Open ${cust.name} in Customer App`}
                                className="font-bold text-charcoal text-sm block truncate hover:text-forest-700 text-left transition-colors"
                              >
                                {cust.name}
                              </button>
                              <span className="text-charcoal-muted text-[11px] font-mono">{cust.id}</span>
                            </div>
                          </div>
                        </td>

                        {/* Phone & Address */}
                        <td className="p-4">
                          <span className="font-semibold text-charcoal block">{cust.phone}</span>
                          <span className="text-charcoal-muted text-[11px] block truncate max-w-[220px]">
                            {cust.address}
                          </span>
                        </td>

                        {/* Plan & Duration (Clean Single Interactive Pill) */}
                        <td className="p-4 relative">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <span className="font-bold text-charcoal text-sm block">
                              {cust.subscriptionType.split('(')[0]}
                            </span>
                            {isCancelled && (
                              <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-rose-50 text-rose-700 border border-rose-200">
                                Cancelled
                              </span>
                            )}
                          </div>
                          <span className="text-charcoal-muted text-[11px] block">
                            {isCancelled 
                              ? `Refund: ₹${cust.cancellationInfo?.refundAmount ?? (cust.remainingDays * 120)} (${cust.cancellationInfo?.refundStatus || 'Pending'})` 
                              : `${cust.remainingDays} days left (${cust.startDate} to ${cust.endDate})`}
                          </span>
                          
                          {/* Clean Interactive Notes Pill */}
                          <div className="mt-1.5 relative inline-block">
                            <button
                              type="button"
                              onClick={() => setOpenNotesMenuId(openNotesMenuId === cust.id ? null : cust.id)}
                              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold bg-terracotta-50 text-terracotta-700 border border-terracotta-200/80 hover:bg-terracotta-100 transition-all apple-press shadow-apple-sm"
                              title="Click to view & edit Kitchen and Delivery notes"
                            >
                              <Utensils className="w-2.5 h-2.5 text-terracotta-600 flex-shrink-0" />
                              <span>{cust.kitchenNotes || cust.deliveryNotes ? 'Kitchen & Delivery Notes' : 'Standard Notes'}</span>
                              <ChevronDown className="w-2.5 h-2.5 opacity-60 ml-0.5" />
                            </button>

                            {/* Floating Popover Card */}
                            {openNotesMenuId === cust.id && (
                              <>
                                <div 
                                  className="fixed inset-0 z-30" 
                                  onClick={() => setOpenNotesMenuId(null)} 
                                />
                                <div className="absolute left-0 top-full mt-1.5 z-40 w-72 bg-white rounded-2xl p-3 border border-edge shadow-apple-modal animate-fade-in text-xs space-y-2.5">
                                  
                                  <div className="flex items-center justify-between pb-1.5 border-b border-edge/60">
                                    <span className="text-[10px] font-bold text-charcoal-muted uppercase tracking-wider">
                                      Customer Notes & Diet
                                    </span>
                                    <button
                                      type="button"
                                      onClick={() => {
                                        setOpenNotesMenuId(null);
                                        handleOpenMealModal(cust);
                                      }}
                                      className="text-[11px] font-bold text-forest-700 hover:underline flex items-center gap-1"
                                    >
                                      <Edit2 className="w-3 h-3" />
                                      <span>Edit</span>
                                    </button>
                                  </div>

                                  {/* Kitchen Note Detail */}
                                  <div className="p-2.5 rounded-xl bg-terracotta-50/70 border border-terracotta-200/70 space-y-1">
                                    <div className="flex items-center gap-1 text-[10px] font-bold text-terracotta-900 uppercase">
                                      <ChefHat className="w-3 h-3 text-terracotta-600 flex-shrink-0" />
                                      <span>Kitchen Prep Note</span>
                                    </div>
                                    <p className="text-xs font-semibold text-charcoal leading-snug">
                                      "{cust.kitchenNotes || cust.specialInstructions || 'Standard balanced portion'}"
                                    </p>
                                  </div>

                                  {/* Delivery Note Detail */}
                                  <div className="p-2.5 rounded-xl bg-forest-50/70 border border-forest-200/70 space-y-1">
                                    <div className="flex items-center gap-1 text-[10px] font-bold text-forest-900 uppercase">
                                      <Bike className="w-3 h-3 text-forest-600 flex-shrink-0" />
                                      <span>Delivery Handover Note</span>
                                    </div>
                                    <p className="text-xs font-semibold text-charcoal leading-snug">
                                      "{cust.deliveryNotes || 'Standard doorstep delivery'}"
                                    </p>
                                  </div>

                                  <button
                                    type="button"
                                    onClick={() => {
                                      setOpenNotesMenuId(null);
                                      handleOpenMealModal(cust);
                                    }}
                                    className="w-full py-2 text-xs font-bold rounded-xl bg-cream-100 hover:bg-cream-200 text-charcoal apple-press flex items-center justify-center gap-1.5 transition-all border border-edge/60"
                                  >
                                    <Edit2 className="w-3 h-3 text-charcoal-muted" />
                                    <span>Modify Meal & Delivery Notes</span>
                                  </button>

                                </div>
                              </>
                            )}
                          </div>
                        </td>

                        {/* Today's Delivery Action (Clean Single Interactive Pill) */}
                        <td className="p-4 relative">
                          <div className="relative inline-block">
                            <button
                              type="button"
                              onClick={() => setOpenStatusMenuId(openStatusMenuId === cust.id ? null : cust.id)}
                              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-bold apple-press transition-all ${
                                isCancelled
                                  ? 'bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-100 shadow-apple-sm'
                                  : isPaused
                                  ? 'bg-warmamber-50 text-warmamber-700 border border-warmamber-200 hover:bg-warmamber-100 shadow-apple-sm'
                                  : cust.todayDeliveryStatus === 'Delivered'
                                  ? 'bg-forest-50 text-forest-700 border border-forest-200 hover:bg-forest-100'
                                  : 'bg-cream-100 text-charcoal border border-edge hover:bg-cream-200/70'
                              }`}
                              title="Click to manage status, pause or cancel subscription"
                            >
                              <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
                              <span>
                                {isCancelled 
                                  ? 'Subscription Cancelled' 
                                  : isPaused 
                                  ? 'Paused (On Leave)' 
                                  : cust.todayDeliveryStatus === 'Delivered' 
                                  ? 'Delivered' 
                                  : 'Delivery Scheduled'}
                              </span>
                              <ChevronDown className="w-3 h-3 opacity-60 ml-0.5" />
                            </button>

                            {/* Floating Actions Popover Menu */}
                            {openStatusMenuId === cust.id && (
                              <>
                                <div 
                                  className="fixed inset-0 z-30" 
                                  onClick={() => setOpenStatusMenuId(null)} 
                                />
                                <div className="absolute left-0 top-full mt-1.5 z-40 w-60 bg-white rounded-2xl p-1.5 border border-edge shadow-apple-modal animate-fade-in text-xs space-y-1">
                                  <div className="px-3 py-1.5 border-b border-edge/60 text-[10px] font-bold text-charcoal-muted uppercase tracking-wider">
                                    Delivery & Status Controls
                                  </div>

                                  {isCancelled ? (
                                    <div className="space-y-2 p-1">
                                      <div className="p-2.5 rounded-xl bg-rose-50 border border-rose-100 text-left space-y-1">
                                        <div className="flex items-center gap-1.5 text-rose-800 font-bold text-[11px]">
                                          <XCircle className="w-3.5 h-3.5 text-rose-600 flex-shrink-0" />
                                          <span>Cancelled: {cust.cancellationInfo?.cancelledAt || 'Active Cycle'}</span>
                                        </div>
                                        <p className="text-[10px] text-charcoal-muted font-medium">
                                          Reason: {cust.cancellationInfo?.reason || 'Customer requested'}
                                        </p>
                                        <p className="text-[10px] font-bold text-charcoal">
                                          Refund: ₹{cust.cancellationInfo?.refundAmount ?? (cust.remainingDays * 120)} ({cust.cancellationInfo?.refundStatus || 'Processing'})
                                        </p>
                                        {hasPickupDue && (
                                          <span className="inline-block text-[10px] font-bold text-terracotta-700 bg-terracotta-50 px-2 py-0.5 rounded-md mt-0.5 border border-terracotta-200">
                                            ⚠️ Pickup Box: {cust.dabbasHeld.join(', ')}
                                          </span>
                                        )}
                                      </div>

                                      <button
                                        type="button"
                                        onClick={() => {
                                          onReactivateSubscription && onReactivateSubscription(cust.id);
                                          showToast(`Reactivated subscription for ${cust.name}!`);
                                          setOpenStatusMenuId(null);
                                        }}
                                        className="w-full flex items-center gap-2 px-3 py-2 rounded-xl font-bold text-forest-700 bg-forest-50 hover:bg-forest-100 transition-all text-left border border-forest-200"
                                      >
                                        <RotateCw className="w-3.5 h-3.5 flex-shrink-0" />
                                        <div>
                                          <span className="block text-xs">Reactivate Subscription</span>
                                          <span className="block text-[10px] font-normal text-forest-800">Resume meal dispatches</span>
                                        </div>
                                      </button>
                                    </div>
                                  ) : (
                                    <>
                                      {isPaused ? (
                                        <button
                                          type="button"
                                          onClick={() => {
                                            onToggleSkipToday && onToggleSkipToday(cust.id);
                                            showToast(`Resumed today's meal delivery for ${cust.name}!`);
                                            setOpenStatusMenuId(null);
                                          }}
                                          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl font-bold text-forest-700 hover:bg-forest-50 transition-all text-left"
                                        >
                                          <Play className="w-3.5 h-3.5 fill-current flex-shrink-0" />
                                          <div>
                                            <span className="block text-xs">Resume Today</span>
                                            <span className="block text-[10px] font-normal text-charcoal-muted">Start today's dispatch</span>
                                          </div>
                                        </button>
                                      ) : (
                                        <button
                                          type="button"
                                          onClick={() => {
                                            onToggleSkipToday && onToggleSkipToday(cust.id);
                                            showToast(`Paused today for ${cust.name}. Subscription auto-extended +1 day!`);
                                            setOpenStatusMenuId(null);
                                          }}
                                          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl font-bold text-warmamber-700 hover:bg-warmamber-50 transition-all text-left"
                                        >
                                          <Pause className="w-3.5 h-3.5 fill-current flex-shrink-0" />
                                          <div>
                                            <span className="block text-xs">Skip Today (Eroju Vadhu)</span>
                                            <span className="block text-[10px] font-normal text-charcoal-muted">+1 day validity extension</span>
                                          </div>
                                        </button>
                                      )}

                                      <button
                                        type="button"
                                        onClick={() => {
                                          setSchedulingLeaveCustomer(cust);
                                          const fromD = new Date().toISOString().slice(0, 10);
                                          const toD = new Date(Date.now() + 2 * 86400000).toISOString().slice(0, 10);
                                          setLeaveRangeForm({
                                            from: fromD,
                                            to: toD,
                                            reason: 'Personal Travel / Vacation',
                                            autoExtend: true
                                          });
                                          setOpenStatusMenuId(null);
                                        }}
                                        className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl font-semibold text-charcoal hover:bg-cream-100 transition-all text-left border-t border-edge/40"
                                      >
                                        <Calendar className="w-3.5 h-3.5 text-forest-700 flex-shrink-0" />
                                        <div>
                                          <span className="block text-xs font-bold">Schedule Date Range...</span>
                                          <span className="block text-[10px] text-charcoal-muted">Custom vacation / dates</span>
                                        </div>
                                      </button>



                                      <button
                                        type="button"
                                        onClick={() => {
                                          setOpenStatusMenuId(null);
                                          const rate = 120;
                                          setCancelForm({
                                            reason: 'Relocating / Moving out of city',
                                            perMealRate: rate,
                                            refundAmount: (cust.remainingDays || 0) * rate
                                          });
                                          setCancellingCustomer(cust);
                                        }}
                                        className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl font-semibold text-rose-700 hover:bg-rose-50 transition-all text-left border-t border-edge/40"
                                      >
                                        <XCircle className="w-3.5 h-3.5 text-rose-600 flex-shrink-0" />
                                        <div>
                                          <span className="block text-xs font-bold">Cancel Subscription...</span>
                                          <span className="block text-[10px] text-charcoal-muted">Pro-rata refund & box recovery</span>
                                        </div>
                                      </button>
                                    </>
                                  )}
                                </div>
                              </>
                            )}
                          </div>
                        </td>

                        {/* Box Return / Pickup Due */}
                        <td className="p-4">
                          {hasPickupDue ? (
                            <div>
                              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-terracotta-50 text-terracotta-500 border border-terracotta-100">
                                <RotateCcw className="w-3 h-3" />
                                <span>Pickup Due: {cust.dabbasHeld.length} Box ({cust.dabbasHeld.join(', ')})</span>
                              </span>
                              <span className="text-[10px] text-charcoal-muted block mt-0.5">
                                Lifetime returned: {cust.dabbasReturnedTotal}
                              </span>
                            </div>
                          ) : (
                            <span className="text-forest-700 font-semibold text-[11px] flex items-center gap-1">
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              <span>No Pickups Pending</span>
                            </span>
                          )}
                        </td>

                        {/* Assigned Route */}
                        <td className="p-4">
                          <select
                            value={cust.routeId || 'ROUTE-A'}
                            onChange={(e) => {
                              onAssignCustomerToRoute(cust.id, e.target.value);
                              showToast(`Moved ${cust.name} to ${e.target.value}`);
                            }}
                            className="bg-cream-100 border border-edge rounded-xl px-2.5 py-1.5 text-xs font-semibold text-charcoal focus:outline-none"
                          >
                            {routes.map(r => (
                              <option key={r.id} value={r.id}>{r.name.split('—')[0]}</option>
                            ))}
                          </select>
                        </td>

                        {/* Payment */}
                        <td className="p-4">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            cust.paymentStatus === 'Paid' ? 'bg-forest-50 text-forest-700' : 'bg-warmamber-50 text-warmamber-600'
                          }`}>
                            {cust.paymentStatus}
                          </span>
                        </td>

                        {/* Action Delete */}
                        <td className="p-4 text-right">
                          <button
                            onClick={() => {
                              if (window.confirm(`Are you sure you want to delete customer ${cust.name}?`)) {
                                onDeleteCustomer(cust.id);
                                showToast(`Customer ${cust.name} deleted.`);
                              }
                            }}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-xl transition-all apple-press"
                            title="Delete Customer"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>

                      </tr>
                    );
                  })}
                  {filteredCustomers.length === 0 && (
                    <tr>
                      <td colSpan={8} className="p-8 text-center text-xs text-charcoal-muted italic">
                        No customers found matching your search query or filter.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      )}

      {/* ========================================================================= */}
      {/* 2. STAFF MANAGEMENT (DELIVERY BOYS & KITCHEN CREW) */}
      {/* ========================================================================= */}
      {activeTab === 'staff' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-charcoal tracking-tight">Staff & Workforce Fleet</h2>
              <p className="text-xs text-charcoal-muted mt-0.5">
                Manage logistics delivery drivers and commercial kitchen prep crew
              </p>
            </div>

            <div className="flex items-center gap-3">
              {staffSubTab === 'delivery' ? (
                <button
                  onClick={() => setShowAddDriverModal(true)}
                  className="px-5 py-2.5 text-xs font-bold rounded-2xl bg-forest-700 text-white hover:bg-forest-800 apple-press shadow-apple-sm flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Delivery Driver</span>
                </button>
              ) : (
                <button
                  onClick={() => setShowAddKitchenModal(true)}
                  className="px-5 py-2.5 text-xs font-bold rounded-2xl bg-forest-700 text-white hover:bg-forest-800 apple-press shadow-apple-sm flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Kitchen Staff</span>
                </button>
              )}
            </div>
          </div>

          {/* Sub-Tabs: Delivery Fleet vs Kitchen Crew */}
          <div className="flex items-center gap-2 border-b border-edge/80 pb-3">
            <button
              onClick={() => setStaffSubTab('delivery')}
              className={`px-4 sm:px-5 py-2 text-xs font-bold rounded-xl transition-all apple-press ${
                staffSubTab === 'delivery'
                  ? 'bg-forest-700 text-white shadow-apple-sm'
                  : 'text-charcoal-muted hover:text-charcoal bg-white border border-edge'
              }`}
            >
              Delivery Drivers ({deliveryBoys.length})
            </button>
            <button
              onClick={() => setStaffSubTab('kitchen')}
              className={`px-4 sm:px-5 py-2 text-xs font-bold rounded-xl transition-all apple-press ${
                staffSubTab === 'kitchen'
                  ? 'bg-forest-700 text-white shadow-apple-sm'
                  : 'text-charcoal-muted hover:text-charcoal bg-white border border-edge'
              }`}
            >
              Kitchen & Godown Crew ({kitchenStaff.length})
            </button>
          </div>

          {/* SUB-VIEW 1: DELIVERY DRIVERS TABLE */}
          {staffSubTab === 'delivery' && (
            <div className="bg-white rounded-3xl border border-edge shadow-apple-card overflow-hidden">
              
              {/* Mobile Touch Cards for Drivers */}
              <div className="md:hidden divide-y divide-edge">
                {deliveryBoys.map((boy) => (
                  <div key={boy.id} className="p-3.5 space-y-3 bg-white hover:bg-cream-50/50 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        {boy.photo ? (
                          <img
                            src={boy.photo}
                            alt={boy.name}
                            className="w-10 h-10 rounded-2xl object-cover border border-edge shrink-0 shadow-apple-sm"
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-2xl bg-forest-50 border border-forest-100 flex items-center justify-center text-forest-700 shrink-0">
                            <Bike className="w-5 h-5" />
                          </div>
                        )}
                        <div>
                          <span className="font-bold text-charcoal text-sm block">{boy.name}</span>
                          <span className="text-[10px] text-charcoal-muted font-mono">{boy.id}</span>
                        </div>
                      </div>

                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        boy.status === 'Checked In' ? 'bg-forest-50 text-forest-700 border border-forest-100' : 'bg-cream-200 text-charcoal-muted'
                      }`}>
                        {boy.status}
                      </span>
                    </div>

                    {/* Phone & Secondary Phone */}
                    <div className="flex items-center justify-between text-xs bg-cream-50/80 p-2.5 rounded-2xl border border-edge/60">
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-1.5 font-bold text-charcoal text-xs">
                          <Phone className="w-3.5 h-3.5 text-forest-700 shrink-0" />
                          <span>{boy.phone}</span>
                        </div>
                        {boy.secondaryPhone && (
                          <div className="text-[10px] text-charcoal-muted">
                            Alt: {boy.secondaryPhone}
                          </div>
                        )}
                      </div>
                      <a 
                        href={`tel:${boy.phone}`}
                        className="px-3 py-1 rounded-xl bg-white border border-edge text-forest-800 font-bold text-xs flex items-center gap-1 shadow-xs apple-press"
                      >
                        <Phone className="w-3 h-3 text-forest-700" />
                        <span>Call</span>
                      </a>
                    </div>

                    {/* Route & Customer Count */}
                    <div className="flex items-center justify-between gap-2 pt-0.5">
                      <div className="flex-1">
                        <select
                          value={boy.assignedRouteId || ''}
                          onChange={(e) => handleQuickRouteReassign(boy.id, e.target.value)}
                          className="w-full px-2.5 py-1.5 rounded-xl bg-forest-50 text-forest-800 border border-forest-200/80 font-bold text-xs focus:outline-none"
                        >
                          {routes.map(r => (
                            <option key={r.id} value={r.id}>
                              📍 {r.name.split('—')[0]}
                            </option>
                          ))}
                        </select>
                      </div>

                      <span className="px-2.5 py-1.5 rounded-xl bg-cream-100 border border-edge text-xs font-bold text-charcoal shrink-0">
                        {boy.assignedCustomerIds?.length || 0} Stops
                      </span>

                      <div className="flex items-center gap-1 shrink-0">
                        <button
                          type="button"
                          onClick={() => setEditingStaff({ type: 'driver', data: { ...boy } })}
                          className="p-1.5 text-forest-700 hover:bg-forest-50 rounded-xl transition-all border border-edge bg-white"
                          title="Edit Driver"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            if (window.confirm(`Delete delivery driver ${boy.name}?`)) {
                              onDeleteDeliveryBoy(boy.id);
                              showToast(`Driver ${boy.name} removed.`);
                            }
                          }}
                          className="p-1.5 text-red-600 hover:bg-red-50 rounded-xl transition-all border border-edge bg-white"
                          title="Delete Driver"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Desktop Table View */}
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-cream-100/80 border-b border-edge text-charcoal-muted">
                    <tr>
                      <th className="p-4 font-bold">Driver Profile</th>
                      <th className="p-4 font-bold">Contact Numbers</th>
                      <th className="p-4 font-bold">Aadhaar Card</th>
                      <th className="p-4 font-bold">Assigned Route (Changeable)</th>
                      <th className="p-4 font-bold">Deliveries</th>
                      <th className="p-4 font-bold">Shift Status</th>
                      <th className="p-4 font-bold text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-edge">
                    {deliveryBoys.map((boy) => (
                      <tr key={boy.id} className="hover:bg-cream-50/70 transition-colors">
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            {boy.photo ? (
                              <img
                                src={boy.photo}
                                alt={boy.name}
                                className="w-10 h-10 rounded-2xl object-cover border border-edge shrink-0 shadow-apple-sm"
                              />
                            ) : (
                              <div className="w-10 h-10 rounded-2xl bg-forest-50 border border-forest-100 flex items-center justify-center text-forest-700 shrink-0">
                                <Bike className="w-5 h-5" />
                              </div>
                            )}
                            <div>
                              <span className="font-bold text-charcoal text-sm block">{boy.name}</span>
                              <span className="text-[11px] text-charcoal-muted font-normal block">{boy.id}</span>
                              {boy.address && (
                                <span className="text-[10px] text-charcoal-muted flex items-center gap-1 mt-0.5 truncate max-w-[200px]" title={boy.address}>
                                  <MapPin className="w-2.5 h-2.5 text-terracotta-500 shrink-0" />
                                  <span className="truncate">{boy.address}</span>
                                </span>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="p-4 space-y-1">
                          <div className="flex items-center gap-1.5 font-semibold text-charcoal">
                            <Phone className="w-3 h-3 text-forest-700 shrink-0" />
                            <span>{boy.phone}</span>
                          </div>
                          {boy.secondaryPhone ? (
                            <div className="flex items-center gap-1.5 text-[11px] text-charcoal-muted font-medium">
                              <span className="px-1.5 py-0.2 rounded bg-cream-100 text-[9px] font-bold text-charcoal-muted">Alt</span>
                              <span>{boy.secondaryPhone}</span>
                            </div>
                          ) : (
                            <span className="text-[10px] text-charcoal-subtle italic">No alt phone</span>
                          )}
                        </td>
                        <td className="p-4">
                          {boy.aadhaar ? (
                            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-forest-50/80 text-forest-800 border border-forest-100 text-[11px] font-bold">
                              <ShieldCheck className="w-3.5 h-3.5 text-forest-700 shrink-0" />
                              <span>{boy.aadhaar}</span>
                            </div>
                          ) : (
                            <span className="text-[11px] text-charcoal-muted italic">Pending verification</span>
                          )}
                        </td>
                        <td className="p-4">
                          <div className="relative inline-block">
                            <select
                              value={boy.assignedRouteId || ''}
                              onChange={(e) => handleQuickRouteReassign(boy.id, e.target.value)}
                              className="px-3 py-1.5 rounded-xl bg-forest-50 hover:bg-forest-100 text-forest-800 border border-forest-200/80 font-bold text-xs focus:outline-none focus:ring-1 focus:ring-forest-600 transition-all cursor-pointer shadow-apple-sm"
                              title="Click to instantly change driver's assigned route"
                            >
                              {routes.map(r => (
                                <option key={r.id} value={r.id}>
                                  📍 {r.name}
                                </option>
                              ))}
                              {!routes.some(r => r.id === boy.assignedRouteId) && (
                                <option value="">-- Assign Route --</option>
                              )}
                            </select>
                          </div>
                        </td>
                        <td className="p-4 font-bold text-charcoal">
                          <span className="px-2.5 py-1 rounded-lg bg-cream-100 border border-edge text-[11px]">
                            {boy.assignedCustomerIds?.length || 0} Customers
                          </span>
                        </td>
                        <td className="p-4">
                          <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                            boy.status === 'Checked In' ? 'bg-forest-50 text-forest-700 border border-forest-100' : 'bg-cream-200 text-charcoal-muted'
                          }`}>
                            {boy.status}
                          </span>
                        </td>
                        <td className="p-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              type="button"
                              onClick={() => setEditingStaff({ type: 'driver', data: { ...boy } })}
                              className="p-2 text-forest-700 hover:bg-forest-50 rounded-xl transition-all apple-press"
                              title="Edit Driver Profile & Route"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                if (window.confirm(`Delete delivery driver ${boy.name}?`)) {
                                  onDeleteDeliveryBoy(boy.id);
                                  showToast(`Driver ${boy.name} removed from fleet.`);
                                }
                              }}
                              className="p-2 text-red-600 hover:bg-red-50 rounded-xl transition-all apple-press"
                              title="Delete Driver"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* SUB-VIEW 2: KITCHEN STAFF TABLE */}
          {staffSubTab === 'kitchen' && (
            <div className="bg-white rounded-3xl border border-edge shadow-apple-card overflow-hidden">
              
              {/* Mobile Touch Cards for Kitchen Staff */}
              <div className="md:hidden divide-y divide-edge">
                {kitchenStaff.map((staff) => (
                  <div key={staff.id} className="p-3.5 space-y-3 bg-white hover:bg-cream-50/50 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        {staff.photo ? (
                          <img
                            src={staff.photo}
                            alt={staff.name}
                            className="w-10 h-10 rounded-2xl object-cover border border-edge shrink-0 shadow-apple-sm"
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-2xl bg-forest-50 border border-forest-100 flex items-center justify-center text-forest-700 shrink-0">
                            <ChefHat className="w-5 h-5" />
                          </div>
                        )}
                        <div>
                          <span className="font-bold text-charcoal text-sm block">{staff.name}</span>
                          <span className="text-[10px] text-charcoal-muted font-mono">{staff.id} • {staff.role}</span>
                        </div>
                      </div>

                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-forest-50 text-forest-700 border border-forest-100">
                        {staff.status}
                      </span>
                    </div>

                    {/* Contact & Shift Station */}
                    <div className="flex items-center justify-between text-xs bg-cream-50/80 p-2.5 rounded-2xl border border-edge/60">
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-1.5 font-bold text-charcoal text-xs">
                          <Phone className="w-3.5 h-3.5 text-forest-700 shrink-0" />
                          <span>{staff.phone}</span>
                        </div>
                        <div className="text-[10px] text-charcoal-muted">
                          Station: <strong className="text-charcoal">{staff.station}</strong> ({staff.shift})
                        </div>
                      </div>
                      <a 
                        href={`tel:${staff.phone}`}
                        className="px-3 py-1 rounded-xl bg-white border border-edge text-forest-800 font-bold text-xs flex items-center gap-1 shadow-xs apple-press"
                      >
                        <Phone className="w-3 h-3 text-forest-700" />
                        <span>Call</span>
                      </a>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center justify-end gap-1.5 pt-0.5">
                      <button
                        type="button"
                        onClick={() => setEditingStaff({ type: 'kitchen', data: { ...staff } })}
                        className="px-3 py-1.5 text-xs font-bold rounded-xl border border-edge bg-white hover:bg-forest-50 text-forest-800 flex items-center gap-1"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                        <span>Edit Profile</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          if (window.confirm(`Delete kitchen staff member ${staff.name}?`)) {
                            onDeleteKitchenStaff(staff.id);
                            showToast(`Kitchen staff ${staff.name} removed.`);
                          }
                        }}
                        className="p-1.5 rounded-xl border border-edge bg-white hover:bg-rose-50 text-red-600"
                        title="Delete"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Desktop Table View */}
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-cream-100/80 border-b border-edge text-charcoal-muted">
                    <tr>
                      <th className="p-4 font-bold">Crew Member</th>
                      <th className="p-4 font-bold">Contact Numbers</th>
                      <th className="p-4 font-bold">Aadhaar Card</th>
                      <th className="p-4 font-bold">Role & Station</th>
                      <th className="p-4 font-bold">Shift Timings</th>
                      <th className="p-4 font-bold">Status</th>
                      <th className="p-4 font-bold text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-edge">
                    {kitchenStaff.map((staff) => (
                      <tr key={staff.id} className="hover:bg-cream-50/70 transition-colors">
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            {staff.photo ? (
                              <img
                                src={staff.photo}
                                alt={staff.name}
                                className="w-10 h-10 rounded-2xl object-cover border border-edge shrink-0 shadow-apple-sm"
                              />
                            ) : (
                              <div className="w-10 h-10 rounded-2xl bg-forest-50 border border-forest-100 flex items-center justify-center text-forest-700 shrink-0">
                                <ChefHat className="w-5 h-5" />
                              </div>
                            )}
                            <div>
                              <span className="font-bold text-charcoal text-sm block">{staff.name}</span>
                              <span className="text-[11px] text-charcoal-muted font-normal block">{staff.id}</span>
                              {staff.address && (
                                <span className="text-[10px] text-charcoal-muted flex items-center gap-1 mt-0.5 truncate max-w-[200px]" title={staff.address}>
                                  <MapPin className="w-2.5 h-2.5 text-terracotta-500 shrink-0" />
                                  <span className="truncate">{staff.address}</span>
                                </span>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="p-4 space-y-1">
                          <div className="flex items-center gap-1.5 font-semibold text-charcoal">
                            <Phone className="w-3 h-3 text-forest-700 shrink-0" />
                            <span>{staff.phone}</span>
                          </div>
                          {staff.secondaryPhone ? (
                            <div className="flex items-center gap-1.5 text-[11px] text-charcoal-muted font-medium">
                              <span className="px-1.5 py-0.2 rounded bg-cream-100 text-[9px] font-bold text-charcoal-muted">Alt</span>
                              <span>{staff.secondaryPhone}</span>
                            </div>
                          ) : (
                            <span className="text-[10px] text-charcoal-subtle italic">No alt phone</span>
                          )}
                        </td>
                        <td className="p-4">
                          {staff.aadhaar ? (
                            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-forest-50/80 text-forest-800 border border-forest-100 text-[11px] font-bold">
                              <ShieldCheck className="w-3.5 h-3.5 text-forest-700 shrink-0" />
                              <span>{staff.aadhaar}</span>
                            </div>
                          ) : (
                            <span className="text-[11px] text-charcoal-muted italic">Pending verification</span>
                          )}
                        </td>
                        <td className="p-4">
                          <span className="font-bold text-charcoal block">{staff.role}</span>
                          <span className="text-charcoal-muted text-[11px] block">{staff.station}</span>
                        </td>
                        <td className="p-4 text-charcoal-muted font-medium">{staff.shift}</td>
                        <td className="p-4">
                          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-forest-50 text-forest-700 border border-forest-100">
                            {staff.status}
                          </span>
                        </td>
                        <td className="p-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              type="button"
                              onClick={() => setEditingStaff({ type: 'kitchen', data: { ...staff } })}
                              className="p-2 text-forest-700 hover:bg-forest-50 rounded-xl transition-all apple-press"
                              title="Edit Staff Profile"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                if (window.confirm(`Delete kitchen staff member ${staff.name}?`)) {
                                  onDeleteKitchenStaff(staff.id);
                                  showToast(`Crew member ${staff.name} deleted.`);
                                }
                              }}
                              className="p-2 text-red-600 hover:bg-red-50 rounded-xl transition-all apple-press"
                              title="Delete Crew Member"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

        </div>
      )}

      {/* ========================================================================= */}
      {/* 3. ROUTES & ASSIGNMENTS ENGINE (AUTO-ROUTE + REORDER + WHATSAPP DISPATCH) */}
      {/* ========================================================================= */}
      {activeTab === 'routes' && (() => {
        const activeRoute = routes.find(r => r.id === selectedRouteId) || routes[0] || { id: 'ROUTE-A', name: 'Route A', zone: 'Central' };
        const activeDriver = deliveryBoys.find(b => b.id === activeRoute.assignedDriverId);
        const activeStops = getOrderedRouteStops(activeRoute.id);
        const pickupsDueCount = activeStops.filter(s => s.dabbasHeld && s.dabbasHeld.length > 0).length;
        const totalHeldBoxes = activeStops.reduce((acc, s) => acc + (s.dabbasHeld?.length || 0), 0);
        const estDistanceKm = (activeStops.length * 2.6 + 3.2).toFixed(1);
        const estDurationMins = Math.round(activeStops.length * 8 + 15);
        const isOrderModified = Boolean(routeStopOrders[activeRoute.id]);

        return (
          <div className="space-y-6">
            
            {/* Header with Title & Create Route Action */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2.5">
                  <h2 className="text-lg sm:text-xl font-bold text-charcoal tracking-tight">
                    Delivery Routes, Stop Sequencing & WhatsApp Dispatch
                  </h2>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-forest-50 text-forest-700 border border-forest-100">
                    Smart Route Planner
                  </span>
                </div>
                <p className="text-xs text-charcoal-muted mt-0.5">
                  Address-based turn-by-turn route generation. Reorder stops as needed, and dispatch today's task directly to delivery drivers via WhatsApp.
                </p>
              </div>

              <button
                onClick={() => setShowCreateRouteModal(true)}
                className="px-4 py-2.5 text-xs font-bold rounded-2xl bg-forest-700 text-white hover:bg-forest-800 apple-press shadow-apple-sm flex items-center gap-2 self-start sm:self-auto"
              >
                <Plus className="w-4 h-4" />
                <span>Create New Route</span>
              </button>
            </div>

            {/* Route Selector Tabs Bar */}
            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
              {routes.map((route) => {
                const isSelected = route.id === activeRoute.id;
                const rStops = getOrderedRouteStops(route.id);
                const rDriver = deliveryBoys.find(b => b.id === route.assignedDriverId);

                return (
                  <button
                    key={route.id}
                    type="button"
                    onClick={() => setSelectedRouteId(route.id)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-2xl border transition-all text-left apple-press whitespace-nowrap shrink-0 ${
                      isSelected
                        ? 'bg-forest-700 text-white border-forest-700 shadow-apple-card ring-2 ring-forest-600/20'
                        : 'bg-white text-charcoal border-edge hover:bg-cream-50'
                    }`}
                  >
                    <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                      isSelected ? 'bg-forest-800 text-cream-100' : 'bg-forest-50 text-forest-700'
                    }`}>
                      <Navigation className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-xs">{route.name.split('—')[0]}</span>
                        <span className={`text-[10px] px-1.5 py-0.2 rounded-md font-extrabold ${
                          isSelected ? 'bg-forest-800 text-cream-100' : 'bg-cream-100 text-charcoal-muted'
                        }`}>
                          {rStops.length} Stops
                        </span>
                      </div>
                      <span className={`text-[10px] block truncate max-w-[150px] ${
                        isSelected ? 'text-cream-200/90' : 'text-charcoal-muted'
                      }`}>
                        {rDriver ? `🚴 ${rDriver.name}` : '⚠️ Driver unassigned'}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Active Route Master Banner (Driver + Route Metrics + WhatsApp Dispatch) */}
            <div className="bg-white rounded-3xl p-6 sm:p-7 border border-edge shadow-apple-card space-y-5">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-5 border-b border-edge">
                
                {/* Route & Driver Info */}
                <div className="flex items-start sm:items-center gap-4">
                  <div className="relative">
                    {activeDriver?.photo ? (
                      <img
                        src={activeDriver.photo}
                        alt={activeDriver.name}
                        className="w-14 h-14 rounded-2xl object-cover border-2 border-forest-600/30 shadow-apple-sm shrink-0"
                      />
                    ) : (
                      <div className="w-14 h-14 rounded-2xl bg-forest-50 border border-forest-100 flex items-center justify-center text-forest-700 shrink-0">
                        <Bike className="w-7 h-7" />
                      </div>
                    )}
                    <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-forest-600 border-2 border-white flex items-center justify-center text-[8px] text-white font-bold">
                      ✓
                    </span>
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="text-base sm:text-lg font-bold text-charcoal">
                        {activeRoute.name}
                      </h3>
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-forest-50 text-forest-700 border border-forest-100">
                        Zone: {activeRoute.zone}
                      </span>
                    </div>

                    <div className="flex items-center gap-2.5 flex-wrap text-xs text-charcoal-muted">
                      <span>Assigned Driver: <strong className="text-charcoal font-bold">{activeDriver ? activeDriver.name : 'Unassigned'}</strong></span>
                      {activeDriver?.phone && (
                        <>
                          <span>•</span>
                          <a href={`tel:${activeDriver.phone}`} className="text-forest-700 font-semibold hover:underline flex items-center gap-1">
                            <Phone className="w-3 h-3" />
                            <span>{activeDriver.phone}</span>
                          </a>
                        </>
                      )}
                    </div>

                    {/* Quick Reassign Driver Dropdown */}
                    <div className="flex items-center gap-2 pt-1">
                      <span className="text-[11px] text-charcoal-muted font-medium">Reassign:</span>
                      <select
                        value={activeRoute.assignedDriverId || ''}
                        onChange={(e) => {
                          onAssignDriverToRoute(activeRoute.id, e.target.value);
                          showToast(`Assigned ${activeRoute.name} to new driver!`);
                        }}
                        className="px-2.5 py-1 text-xs font-bold rounded-xl border border-edge bg-cream-50 hover:bg-cream-100 text-charcoal focus:outline-none focus:border-forest-600 transition-all cursor-pointer"
                      >
                        <option value="">-- Select Driver --</option>
                        {deliveryBoys.map(b => (
                          <option key={b.id} value={b.id}>{b.name} ({b.phone})</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                {/* WhatsApp Dispatch Button Group (The Star Feature!) */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 shrink-0">
                  <button
                    type="button"
                    onClick={() => handleDispatchWhatsApp(activeRoute, activeDriver, activeStops)}
                    className="px-5 py-3 rounded-2xl bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold text-xs flex items-center justify-center gap-2 shadow-apple-card transition-all apple-press group"
                    title="Open WhatsApp with pre-filled turn-by-turn route stops, addresses & Google Map links"
                  >
                    <MessageSquare className="w-4 h-4 fill-white stroke-none group-hover:scale-110 transition-transform" />
                    <span>Send Route to {activeDriver ? activeDriver.name.split(' ')[0] : 'Driver'} (WhatsApp)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleCopyRouteTask(activeRoute, activeDriver, activeStops)}
                    className="px-4 py-3 rounded-2xl bg-cream-50 hover:bg-cream-100 border border-edge text-charcoal font-bold text-xs flex items-center justify-center gap-1.5 transition-all apple-press"
                    title="Copy formatted delivery stops task sheet to clipboard"
                  >
                    {copiedTask ? (
                      <>
                        <CheckCheck className="w-4 h-4 text-forest-700" />
                        <span className="text-forest-800">Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4 text-charcoal-muted" />
                        <span>Copy Task</span>
                      </>
                    )}
                  </button>

                  {isOrderModified && (
                    <button
                      type="button"
                      onClick={() => handleResetRouteOrder(activeRoute.id)}
                      className="px-3.5 py-3 rounded-2xl bg-cream-100 hover:bg-cream-200 text-charcoal-muted hover:text-charcoal text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
                      title="Reset stop sequence to original address order"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>Reset Order</span>
                    </button>
                  )}
                </div>

              </div>

              {/* 4 Route Metrics Badges */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1">
                <div className="p-3.5 rounded-2xl bg-cream-50 border border-edge">
                  <span className="text-[10px] font-bold text-charcoal-muted uppercase tracking-wider block">Today's Deliveries</span>
                  <span className="text-lg font-bold text-charcoal mt-0.5 block">{activeStops.length} Sealed Boxes</span>
                </div>

                <div className="p-3.5 rounded-2xl bg-terracotta-50/70 border border-terracotta-200/70">
                  <span className="text-[10px] font-bold text-terracotta-900 uppercase tracking-wider block">Pickups Due</span>
                  <span className="text-lg font-bold text-terracotta-700 mt-0.5 block">{pickupsDueCount} Customer ({totalHeldBoxes} Dabbas)</span>
                </div>

                <div className="p-3.5 rounded-2xl bg-cream-50 border border-edge">
                  <span className="text-[10px] font-bold text-charcoal-muted uppercase tracking-wider block">Est. Route Loop</span>
                  <span className="text-lg font-bold text-charcoal mt-0.5 block">~{estDistanceKm} km Total</span>
                </div>

                <div className="p-3.5 rounded-2xl bg-cream-50 border border-edge">
                  <span className="text-[10px] font-bold text-charcoal-muted uppercase tracking-wider block">Estimated Run Time</span>
                  <span className="text-lg font-bold text-charcoal mt-0.5 block">~{estDurationMins} mins</span>
                </div>
              </div>

            </div>

            {/* 2-Column Delivery Studio Grid: Stops Sequence (7 cols) + Map Visualizer & WhatsApp Preview (5 cols) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              
              {/* LEFT COLUMN (7 cols): Turn-by-Turn Delivery Stops Builder */}
              <div className="lg:col-span-7 space-y-4">
                
                <div className="flex items-center justify-between px-1">
                  <div>
                    <h3 className="text-sm font-bold text-charcoal flex items-center gap-2">
                      <span>Turn-by-Turn Stop Sequence</span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-forest-100 text-forest-800">
                        {activeStops.length} Stops
                      </span>
                    </h3>
                    <p className="text-[11px] text-charcoal-muted mt-0.5">
                      Use <strong>↑</strong> and <strong>↓</strong> to change stop priority or customize the rider's delivery route.
                    </p>
                  </div>
                  {isOrderModified && (
                    <span className="text-[10px] font-bold px-2 py-1 rounded-lg bg-warmamber-50 text-warmamber-700 border border-warmamber-200">
                      ✏️ Custom Sequence Active
                    </span>
                  )}
                </div>

                {/* Starting Node: Kitchen Godown Hub */}
                <div className="p-4 rounded-2xl bg-forest-50/80 border border-forest-100 flex items-center gap-3.5 shadow-apple-sm">
                  <div className="w-10 h-10 rounded-2xl bg-forest-700 text-white flex items-center justify-center shrink-0 shadow-apple-sm">
                    <ChefHat className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-extrabold uppercase tracking-wider text-forest-800">Starting Hub • Dispatch Station</span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-forest-100 text-forest-800">11:30 AM Out</span>
                    </div>
                    <h4 className="text-xs font-bold text-charcoal mt-0.5 truncate">Healthi Dabba Central Hub & Warehouse</h4>
                    <p className="text-[11px] text-charcoal-muted truncate">Annamaiah Circle Central Kitchen, AIR Bypass Road, Tirupati</p>
                  </div>
                </div>

                {/* Vertical Connector Line */}
                <div className="pl-9 -my-2 flex items-center">
                  <div className="w-0.5 h-6 bg-forest-300"></div>
                </div>

                {/* Customer Delivery Stops List */}
                <div className="space-y-3">
                  {activeStops.map((cust, idx) => {
                    const isFirst = idx === 0;
                    const isLast = idx === activeStops.length - 1;
                    const isDelivered = cust.todayDeliveryStatus === 'Delivered';
                    const hasPickup = cust.dabbasHeld && cust.dabbasHeld.length > 0;
                    const isHighlighted = highlightedStopId === cust.id;

                    return (
                      <div
                        key={cust.id}
                        id={`stop-card-${cust.id}`}
                        onClick={() => setFocusedMapStop(cust)}
                        onMouseEnter={() => setHighlightedStopId(cust.id)}
                        onMouseLeave={() => setHighlightedStopId(null)}
                        className={`p-4 rounded-3xl border transition-all space-y-3 cursor-pointer ${
                          focusedMapStop?.id === cust.id
                            ? 'bg-forest-50/40 border-forest-600 shadow-apple-modal ring-2 ring-forest-600/30'
                            : isHighlighted 
                            ? 'bg-white border-forest-600 shadow-apple-card ring-1 ring-forest-600/20' 
                            : 'bg-white border-edge shadow-apple-card hover:border-forest-300'
                        }`}
                      >
                        {/* Stop Header */}
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex items-start gap-3 min-w-0">
                            
                            {/* Numbered Milestone Pin */}
                            <div className="w-8 h-8 rounded-xl bg-forest-700 text-white font-extrabold text-xs flex items-center justify-center shrink-0 shadow-apple-sm">
                              {idx + 1}
                            </div>

                            <div className="min-w-0">
                              <div className="flex items-center gap-2 flex-wrap">
                                <h4 className="font-bold text-charcoal text-sm truncate">{cust.name}</h4>
                                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-cream-100 text-charcoal-muted">
                                  {cust.subscriptionType.split('(')[0]}
                                </span>
                                {isDelivered && (
                                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-forest-50 text-forest-700 border border-forest-100">
                                    ✓ Delivered
                                  </span>
                                )}
                              </div>

                              <p className="text-xs text-charcoal font-medium mt-1 flex items-start gap-1 leading-snug">
                                <MapPin className="w-3.5 h-3.5 text-terracotta-500 shrink-0 mt-0.5" />
                                <span>{cust.address}</span>
                              </p>
                            </div>
                          </div>

                          {/* Re-order Up / Down Controls */}
                          <div className="flex items-center gap-1 shrink-0 bg-cream-100 p-1 rounded-xl border border-edge">
                            <button
                              type="button"
                              onClick={() => handleMoveRouteStop(activeRoute.id, idx, -1)}
                              disabled={isFirst}
                              className={`p-1.5 rounded-lg text-xs font-bold transition-all ${
                                isFirst ? 'text-charcoal-subtle opacity-40 cursor-not-allowed' : 'text-charcoal hover:bg-white hover:text-forest-700 apple-press shadow-sm'
                              }`}
                              title="Move Stop Earlier (Up)"
                            >
                              <ArrowUp className="w-3.5 h-3.5" />
                            </button>
                            <span className="text-[10px] font-bold text-charcoal-muted px-1">#{idx + 1}</span>
                            <button
                              type="button"
                              onClick={() => handleMoveRouteStop(activeRoute.id, idx, 1)}
                              disabled={isLast}
                              className={`p-1.5 rounded-lg text-xs font-bold transition-all ${
                                isLast ? 'text-charcoal-subtle opacity-40 cursor-not-allowed' : 'text-charcoal hover:bg-white hover:text-forest-700 apple-press shadow-sm'
                              }`}
                              title="Move Stop Later (Down)"
                            >
                              <ArrowDown className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>

                        {/* Notes & Pickup Notice */}
                        {(cust.kitchenNotes || cust.deliveryNotes || hasPickup || (cust.autoPickupDue && cust.autoPickupDue.isDue)) && (
                          <div className="flex items-center gap-2 flex-wrap pt-1 text-[11px]">
                            {cust.kitchenNotes && (
                              <span className="px-2.5 py-1 rounded-xl bg-terracotta-50 text-terracotta-800 border border-terracotta-200 font-medium">
                                🍳 Prep: {cust.kitchenNotes}
                              </span>
                            )}
                            {cust.deliveryNotes && (
                              <span className="px-2.5 py-1 rounded-xl bg-forest-50 text-forest-800 border border-forest-100 font-medium">
                                🛵 Note: {cust.deliveryNotes}
                              </span>
                            )}
                            {cust.autoPickupDue && cust.autoPickupDue.isDue ? (
                              <span className="px-2.5 py-1 rounded-xl bg-warmamber-50 text-warmamber-900 border border-warmamber-200 font-bold flex items-center gap-1 shadow-sm">
                                ⚠️ Auto-Pickup Due: {cust.autoPickupDue.dabbaId} ({cust.autoPickupDue.note})
                              </span>
                            ) : hasPickup ? (
                              <span className="px-2.5 py-1 rounded-xl bg-warmamber-50 text-warmamber-800 border border-warmamber-200 font-bold">
                                ⚠️ Collect Empty Dabba: {cust.dabbasHeld.join(', ')}
                              </span>
                            ) : null}
                          </div>
                        )}

                        {/* Stop Quick Actions Footer */}
                        <div className="flex items-center justify-between pt-2 border-t border-edge/60 text-xs">
                          <div className="flex items-center gap-3">
                            <a
                              href={`tel:${cust.phone}`}
                              className="text-charcoal hover:text-forest-700 font-semibold flex items-center gap-1 transition-colors"
                            >
                              <Phone className="w-3 h-3 text-forest-700" />
                              <span>{cust.phone}</span>
                            </a>
                            <span className="text-charcoal-subtle">•</span>
                            <a
                              href={cust.mapLink || `https://maps.google.com/?q=${getCustomerCoordinates(cust).lat},${getCustomerCoordinates(cust).lng}`}
                              target="_blank"
                              rel="noreferrer"
                              className="text-terracotta-600 hover:text-terracotta-700 font-bold flex items-center gap-1"
                              title="Open in Google Maps with dropped pin"
                            >
                              <Navigation className="w-3 h-3" />
                              <span>Google Maps Pin</span>
                              <ExternalLink className="w-2.5 h-2.5 opacity-60" />
                            </a>
                          </div>

                          {/* Quick Route Switch */}
                          <div className="flex items-center gap-1.5 text-[11px] text-charcoal-muted">
                            <span>Move to:</span>
                            <select
                              value={cust.routeId}
                              onChange={(e) => {
                                onAssignCustomerToRoute(cust.id, e.target.value);
                                showToast(`Moved ${cust.name} to ${e.target.value}`);
                              }}
                              className="px-2 py-0.5 rounded-lg border border-edge bg-cream-50 text-xs font-semibold text-charcoal focus:outline-none"
                            >
                              {routes.map(r => (
                                <option key={r.id} value={r.id}>{r.name.split('—')[0]}</option>
                              ))}
                            </select>
                          </div>
                        </div>

                      </div>
                    );
                  })}

                  {activeStops.length === 0 && (
                    <div className="p-8 text-center bg-white rounded-3xl border border-edge text-charcoal-muted text-xs italic">
                      No active customer deliveries assigned to this route today.
                    </div>
                  )}
                </div>

                {/* Vertical Connector Line */}
                <div className="pl-9 -my-2 flex items-center">
                  <div className="w-0.5 h-6 bg-forest-300"></div>
                </div>

                {/* Ending Node: Return to Kitchen Godown */}
                <div className="p-4 rounded-2xl bg-cream-100 border border-edge flex items-center gap-3.5">
                  <div className="w-10 h-10 rounded-2xl bg-forest-800 text-white flex items-center justify-center shrink-0 shadow-apple-sm">
                    <RotateCcw className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-extrabold uppercase tracking-wider text-charcoal-muted">Trip Finish • Return Station</span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-cream-200 text-charcoal">~01:15 PM</span>
                    </div>
                    <h4 className="text-xs font-bold text-charcoal mt-0.5">Kitchen Godown Empty Box Return</h4>
                    <p className="text-[11px] text-charcoal-muted">Handover collected dabbas for washing, QR scan check & evening cycle replenishment</p>
                  </div>
                </div>

              </div>

              {/* RIGHT COLUMN (5 cols): Visual Route Map + Live WhatsApp Preview */}
              <div className="lg:col-span-5 space-y-5 sticky top-20">
                
                {/* 1. Fast Native Route Map Engine (Single Pin Focus & Directions Connection) */}
                <div className="bg-white rounded-3xl p-5 sm:p-6 border border-edge shadow-apple-card space-y-3.5">
                  
                  {/* Map Header & View Switchers */}
                  <div className="flex items-center justify-between gap-2 flex-wrap">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-xl bg-forest-50 text-forest-700 flex items-center justify-center">
                        <MapPin className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-charcoal flex items-center gap-1.5">
                          <span>Route Map Visualizer</span>
                          <span className="w-1.5 h-1.5 rounded-full bg-forest-600 animate-pulse"></span>
                        </h4>
                        <span className="text-[10px] text-charcoal-muted">
                          {mapDisplayMode === 'pin' 
                            ? '📍 Exact Single Pin Focus' 
                            : '🛣️ Connected Driving Route'} • {focusedMapStop ? `#${activeStops.findIndex(s => s.id === focusedMapStop.id) + 1} ${focusedMapStop.name}` : activeRoute.name}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 flex-wrap">
                      {/* Engine Switcher: Pin Focus vs Connected Directions */}
                      <div className="flex items-center gap-1 bg-cream-100 p-0.5 rounded-xl border border-edge text-[10px] font-bold">
                        <button
                          type="button"
                          onClick={() => setMapDisplayMode('pin')}
                          className={`px-2 py-1 rounded-lg transition-all flex items-center gap-1 ${
                            mapDisplayMode === 'pin' ? 'bg-forest-700 text-white shadow-sm' : 'text-charcoal-muted hover:text-charcoal'
                          }`}
                          title="Show exact single pin on customer's location"
                        >
                          <MapPin className="w-3 h-3" />
                          <span>Pin View</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => setMapDisplayMode('directions')}
                          className={`px-2 py-1 rounded-lg transition-all flex items-center gap-1 ${
                            mapDisplayMode === 'directions' ? 'bg-forest-700 text-white shadow-sm' : 'text-charcoal-muted hover:text-charcoal'
                          }`}
                          title="Show connected route line from Godown to customer"
                        >
                          <RouteIcon className="w-3 h-3" />
                          <span>Directions</span>
                        </button>
                      </div>

                      {/* Satellite vs Roadmap Toggle */}
                      <div className="flex items-center gap-1 bg-cream-100 p-0.5 rounded-xl border border-edge text-[10px] font-bold">
                        <button
                          type="button"
                          onClick={() => setMapViewMode('m')}
                          className={`px-2 py-1 rounded-lg transition-all ${
                            mapViewMode === 'm' ? 'bg-white text-forest-800 shadow-sm' : 'text-charcoal-muted hover:text-charcoal'
                          }`}
                        >
                          Map
                        </button>
                        <button
                          type="button"
                          onClick={() => setMapViewMode('k')}
                          className={`px-2 py-1 rounded-lg transition-all ${
                            mapViewMode === 'k' ? 'bg-white text-forest-800 shadow-sm' : 'text-charcoal-muted hover:text-charcoal'
                          }`}
                        >
                          Satellite
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Connected Waypoint Breadcrumb Path (Godown -> Stops -> Godown) */}
                  <div className="p-2.5 rounded-2xl bg-cream-50/80 border border-edge">
                    <div className="flex items-center justify-between text-[10px] font-bold text-charcoal-muted uppercase tracking-wider mb-1.5 px-0.5">
                      <span className="flex items-center gap-1 text-forest-800">
                        <RouteIcon className="w-3 h-3 text-forest-700" />
                        <span>Delivery Sequence Stops</span>
                      </span>
                      <span className="text-charcoal font-semibold">~{estDistanceKm} km Total</span>
                    </div>

                    <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5 text-xs">
                      {/* Node 0: Godown Hub */}
                      <button
                        type="button"
                        onClick={() => setFocusedMapStop(null)}
                        className={`flex items-center gap-1.5 shrink-0 px-2.5 py-1 rounded-xl text-[10px] font-bold transition-all border ${
                          !focusedMapStop 
                            ? 'bg-forest-700 text-white border-forest-700 shadow-apple-sm' 
                            : 'bg-white text-charcoal border-edge hover:border-forest-300'
                        }`}
                        title="View complete route loop starting at Godown Hub"
                      >
                        <ChefHat className="w-3 h-3" />
                        <span>Godown Hub</span>
                      </button>

                      {activeStops.map((s, idx) => {
                        const isSelected = focusedMapStop?.id === s.id;
                        return (
                          <React.Fragment key={s.id}>
                            <span className="text-forest-400 font-bold shrink-0 text-[10px]">➔</span>
                            <button
                              type="button"
                              onClick={() => {
                                setFocusedMapStop(s);
                                const el = document.getElementById(`stop-card-${s.id}`);
                                el?.scrollIntoView({ behavior: 'smooth', block: 'center' });
                              }}
                              className={`flex items-center gap-1 shrink-0 px-2.5 py-1 rounded-xl text-[10px] font-bold whitespace-nowrap transition-all border ${
                                isSelected
                                  ? 'bg-terracotta-600 text-white border-terracotta-600 shadow-apple-sm'
                                  : 'bg-white text-charcoal hover:bg-cream-50 border-edge'
                              }`}
                              title={`Focus on Stop #${idx + 1} (${s.name})`}
                            >
                              <span className={`w-3.5 h-3.5 rounded-full text-[9px] flex items-center justify-center font-extrabold ${
                                isSelected ? 'bg-white text-terracotta-700' : 'bg-forest-100 text-forest-800'
                              }`}>
                                {idx + 1}
                              </span>
                              <span>{s.name.split(' ')[0]}</span>
                            </button>
                          </React.Fragment>
                        );
                      })}

                      <span className="text-forest-400 font-bold shrink-0 text-[10px]">➔</span>
                      <div className="flex items-center gap-1 shrink-0 px-2 py-1 rounded-xl bg-cream-200/70 text-charcoal-muted text-[10px] font-bold border border-edge/80">
                        <RotateCcw className="w-2.5 h-2.5" />
                        <span>Return</span>
                      </div>
                    </div>
                  </div>

                  {/* Main Native Leaflet Map Viewport (Both Pin & Directions modes powered by Fast Leaflet Engine) */}
                  {(() => {
                    const KITCHEN_GODOWN = { lat: 13.6288, lng: 79.4192, label: 'Tirupati Central Godown' };
                    const focusedCoords = focusedMapStop ? getCustomerCoordinates(focusedMapStop) : null;

                    const multiStopDirectionsUrl = activeStops.length > 0 
                      ? `https://www.google.com/maps/dir/?api=1&origin=${KITCHEN_GODOWN.lat},${KITCHEN_GODOWN.lng}&destination=${getCustomerCoordinates(activeStops[activeStops.length - 1]).lat},${getCustomerCoordinates(activeStops[activeStops.length - 1]).lng}&waypoints=${activeStops.slice(0, -1).map(s => { const c = getCustomerCoordinates(s); return `${c.lat},${c.lng}`; }).join('|')}`
                      : `https://maps.google.com/?q=${encodeURIComponent(activeRoute.name + ', Tirupati')}`;

                    const singleStopDirectionsUrl = focusedCoords
                      ? `https://www.google.com/maps/dir/?api=1&origin=${KITCHEN_GODOWN.lat},${KITCHEN_GODOWN.lng}&destination=${focusedCoords.lat},${focusedCoords.lng}`
                      : multiStopDirectionsUrl;

                    return (
                      <div className="space-y-3">
                        {/* Native Map Viewport */}
                        <RouteMapVisualizer
                          key={selectedRouteId}
                          route={activeRoute}
                          stops={activeStops}
                          focusedStop={focusedMapStop}
                          onSelectStop={(stop) => {
                            setFocusedMapStop(stop);
                            const el = document.getElementById(`stop-card-${stop.id}`);
                            el?.scrollIntoView({ behavior: 'smooth', block: 'center' });
                          }}
                          viewMode={mapViewMode}
                          displayMode={mapDisplayMode}
                          getCustomerCoordinates={getCustomerCoordinates}
                        />

                        {/* Current Address & Google Maps Direction Inspector (Apple SF Pro Card) */}
                        {focusedMapStop && focusedCoords ? (
                          <div className="p-4 rounded-2xl bg-forest-50/70 border border-forest-100 space-y-2.5 shadow-apple-sm">
                            <div className="flex items-start justify-between gap-3">
                              <div className="flex items-center gap-2.5 min-w-0">
                                <div className="w-8 h-8 rounded-xl bg-terracotta-600 text-white font-extrabold text-xs flex items-center justify-center shadow-apple-sm shrink-0">
                                  #{activeStops.findIndex(s => s.id === focusedMapStop.id) + 1}
                                </div>
                                <div className="min-w-0">
                                  <div className="flex items-center gap-2 flex-wrap">
                                    <h4 className="text-xs font-bold text-charcoal truncate">{focusedMapStop.name}</h4>
                                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-forest-100 text-forest-800">
                                      {focusedMapStop.subscriptionType ? focusedMapStop.subscriptionType.split('(')[0].trim() : 'Meal Box'}
                                    </span>
                                  </div>
                                  <p className="text-[10px] text-forest-700 font-semibold mt-0.5 flex items-center gap-1.5">
                                    <span className="w-2 h-2 rounded-full bg-terracotta-600 animate-pulse"></span>
                                    <span>
                                      {mapDisplayMode === 'pin' 
                                        ? `Exact Customer Pin • ${focusedCoords.lat.toFixed(4)}°N, ${focusedCoords.lng.toFixed(4)}°E`
                                        : `Connected Route • Godown Hub ➔ ${focusedMapStop.name}`}
                                    </span>
                                  </p>
                                </div>
                              </div>

                              <a
                                href={singleStopDirectionsUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="px-3 py-1.5 rounded-xl bg-forest-700 text-white font-bold text-[11px] hover:bg-forest-800 transition-colors flex items-center gap-1.5 shrink-0 shadow-apple-sm"
                                title="Open driving navigation in official Google Maps app"
                              >
                                <Navigation className="w-3 h-3" />
                                <span>Drive in Maps</span>
                                <ExternalLink className="w-2.5 h-2.5 opacity-70" />
                              </a>
                            </div>

                            <div className="pt-2 border-t border-forest-200/60 flex items-center justify-between text-xs text-charcoal-muted gap-2">
                              <p className="truncate text-[11px] font-medium text-charcoal flex items-center gap-1.5 min-w-0">
                                <MapPin className="w-3.5 h-3.5 text-terracotta-600 shrink-0" />
                                <span className="truncate">{focusedMapStop.address}</span>
                              </p>
                              <a
                                href={`tel:${focusedMapStop.phone}`}
                                className="text-[11px] font-bold text-forest-700 hover:underline shrink-0"
                              >
                                {focusedMapStop.phone}
                              </a>
                            </div>
                          </div>
                        ) : (
                          <div className="p-3.5 rounded-2xl bg-cream-50 border border-edge flex items-center justify-between gap-3 text-xs">
                            <div className="min-w-0 flex-1">
                              <span className="text-[10px] font-bold text-charcoal-muted uppercase block">
                                Circuit Overview • Godown Hub Active
                              </span>
                              <p className="text-xs font-semibold text-charcoal truncate mt-0.5">
                                Godown Hub ➔ {activeStops.map(s => s.name.split(' ')[0]).join(' ➔ ')} ➔ Return Hub
                              </p>
                            </div>

                            <a
                              href={multiStopDirectionsUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="px-3 py-1.5 rounded-xl bg-forest-700 text-white font-bold text-[11px] hover:bg-forest-800 transition-colors flex items-center gap-1.5 shrink-0 shadow-apple-sm"
                              title="Open full circuit loop navigation in official Google Maps"
                            >
                              <Navigation className="w-3 h-3" />
                              <span>Full Loop Navigation</span>
                              <ExternalLink className="w-2.5 h-2.5 opacity-70" />
                            </a>
                          </div>
                        )}
                      </div>
                    );
                  })()}

                </div>

                {/* 2. Live WhatsApp Route Task Preview (Real Chat Appearance) */}
                <div className="bg-[#EFEAE2] rounded-3xl p-4 sm:p-5 border border-edge shadow-apple-card space-y-3">
                  
                  {/* WhatsApp Chat Header */}
                  <div className="flex items-center justify-between pb-3 border-b border-black/10">
                    <div className="flex items-center gap-2.5">
                      <div className="w-9 h-9 rounded-full bg-[#25D366] text-white flex items-center justify-center shadow-apple-sm">
                        <MessageSquare className="w-5 h-5 fill-white stroke-none" />
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-charcoal flex items-center gap-1.5">
                          <span>WhatsApp Dispatch Preview</span>
                          <span className="w-2 h-2 rounded-full bg-[#25D366]"></span>
                        </h4>
                        <span className="text-[10px] text-charcoal-muted">
                          To: {activeDriver ? `${activeDriver.name} (${activeDriver.phone})` : 'Select Driver'}
                        </span>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleCopyRouteTask(activeRoute, activeDriver, activeStops)}
                      className="px-2.5 py-1 rounded-lg bg-white/80 hover:bg-white text-[11px] font-bold text-charcoal flex items-center gap-1 border border-black/5"
                    >
                      <Copy className="w-3 h-3" />
                      <span>{copiedTask ? 'Copied' : 'Copy'}</span>
                    </button>
                  </div>

                  {/* Realistic WhatsApp Chat Bubble */}
                  <div className="bg-white rounded-2xl rounded-tl-none p-3.5 shadow-sm border border-black/5 text-xs font-mono space-y-2 max-h-64 overflow-y-auto custom-scrollbar">
                    <div className="text-[11px] text-charcoal font-sans whitespace-pre-wrap leading-relaxed select-all">
                      {generateWhatsAppRouteMessage(activeRoute, activeDriver, activeStops)}
                    </div>
                    <div className="flex items-center justify-end gap-1 text-[9px] text-charcoal-muted font-sans pt-1">
                      <span>{new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      <CheckCheck className="w-3 h-3 text-[#53bdeb]" />
                    </div>
                  </div>

                  {/* Big Dispatch Button directly inside WhatsApp preview */}
                  <button
                    type="button"
                    onClick={() => handleDispatchWhatsApp(activeRoute, activeDriver, activeStops)}
                    className="w-full py-3 rounded-2xl bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold text-xs flex items-center justify-center gap-2 shadow-apple-card transition-all apple-press"
                  >
                    <Send className="w-4 h-4" />
                    <span>Send this Task Sheet to Driver via WhatsApp</span>
                  </button>

                  <p className="text-[10px] text-charcoal-muted text-center leading-tight">
                    💡 Clicking opens WhatsApp Web or App directly with full address stops & GPS links ready to send.
                  </p>

                </div>

              </div>

            </div>

          </div>
        );
      })()}

      {/* ========================================================================= */}
      {/* 4. MENU BUILDER & MEAL ASSIGNMENT */}
      {/* ========================================================================= */}
      {activeTab === 'menu' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-charcoal tracking-tight">Daily Menu Master & Recipe Allocation</h2>
              <p className="text-xs text-charcoal-muted mt-0.5">
                Configure today's meals for UNSUN & Alternative-2 plans. Changes sync live to Kitchen Ingredient Calculator.
              </p>
            </div>

            <button
              onClick={() => setShowAddMenuModal(true)}
              className="px-5 py-2.5 text-xs font-bold rounded-2xl bg-forest-700 text-white hover:bg-forest-800 apple-press shadow-apple-sm flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              <span>Add Dish to Menu</span>
            </button>
          </div>

          {/* Sub-Tabs: UNSUN vs Alternative-2 */}
          <div className="flex items-center gap-2 border-b border-edge/80 pb-3">
            <button
              onClick={() => setMenuSubTab('unsun')}
              className={`px-4 sm:px-5 py-2 text-xs font-bold rounded-xl transition-all apple-press ${
                menuSubTab === 'unsun'
                  ? 'bg-forest-700 text-white shadow-apple-sm'
                  : 'text-charcoal-muted hover:text-charcoal bg-white border border-edge'
              }`}
            >
              UNSUN Standard Plan ({dailyMenu.unsun.length} Items)
            </button>
            <button
              onClick={() => setMenuSubTab('alternative2')}
              className={`px-4 sm:px-5 py-2 text-xs font-bold rounded-xl transition-all apple-press ${
                menuSubTab === 'alternative2'
                  ? 'bg-forest-700 text-white shadow-apple-sm'
                  : 'text-charcoal-muted hover:text-charcoal bg-white border border-edge'
              }`}
            >
              Alternative-2 Keto/Millet ({dailyMenu.alternative2.length} Items)
            </button>
          </div>

          {/* Menu Items Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {dailyMenu[menuSubTab].map((item) => (
              <div 
                key={item.id} 
                className="bg-white rounded-3xl border border-edge shadow-apple-card overflow-hidden flex flex-col justify-between group hover:shadow-apple-card-hover transition-all"
              >
                <div>
                  {/* Dish Photo Banner */}
                  <div className="relative h-44 w-full bg-cream-100 overflow-hidden">
                    {item.image ? (
                      <img 
                        src={item.image} 
                        alt={item.name} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-cream-200/70 text-charcoal-muted">
                        <Utensils className="w-8 h-8 opacity-40" />
                      </div>
                    )}

                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-charcoal/70 via-transparent to-black/20 pointer-events-none" />

                    {/* Top Badges */}
                    <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                      <span className="text-[10px] font-extrabold px-2.5 py-1 rounded-full bg-white/95 backdrop-blur-md text-forest-800 shadow-apple-sm border border-white/60">
                        {item.category}
                      </span>
                      <button
                        onClick={() => {
                          if (window.confirm(`Remove ${item.name} from menu?`)) {
                            onDeleteMenuItem(menuSubTab, item.id);
                            showToast(`Removed ${item.name} from menu.`);
                          }
                        }}
                        className="w-7 h-7 rounded-full bg-white/90 hover:bg-rose-50 hover:text-rose-600 backdrop-blur-md text-charcoal flex items-center justify-center shadow-apple-sm transition-all"
                        title="Remove Dish"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* Bottom Price on Image */}
                    <div className="absolute bottom-2.5 left-3 right-3 flex items-center justify-between text-white">
                      <span className="text-base font-extrabold text-white tracking-tight drop-shadow-md">
                        ₹{item.price || 120}
                        <span className="text-[10px] font-normal opacity-90"> / dish</span>
                      </span>
                      {item.dietary && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-black/40 backdrop-blur-sm border border-white/20">
                          {item.dietary}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Card Content */}
                  <div className="p-4 sm:p-5 space-y-3">
                    <h3 className="text-sm font-bold text-charcoal leading-snug group-hover:text-forest-700 transition-colors">
                      {item.name}
                    </h3>

                    {/* Nutritional Badges: Protein & Weight */}
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-forest-50 text-forest-800 text-[11px] font-bold border border-forest-100">
                        <Dumbbell className="w-3 h-3 text-forest-600" />
                        <span>{item.protein || '16g'} Protein</span>
                      </span>

                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-cream-100 text-charcoal text-[11px] font-bold border border-edge">
                        <Scale className="w-3 h-3 text-charcoal-muted" />
                        <span>{item.weight || item.quantity || '200g'}</span>
                      </span>

                      {item.calories && (
                        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-xl bg-warmamber-50 text-warmamber-800 text-[10px] font-bold border border-warmamber-100">
                          <Flame className="w-3 h-3 text-warmamber-600" />
                          <span>{item.calories}</span>
                        </span>
                      )}
                    </div>

                    {/* Ingredients Breakdown */}
                    <div className="pt-2 border-t border-edge/60">
                      <span className="text-[10px] font-bold text-charcoal-muted uppercase tracking-wider block mb-0.5">
                        Ingredients:
                      </span>
                      <p className="text-xs text-charcoal-muted line-clamp-2 leading-relaxed">
                        {item.ingredients || 'Organic seasonal ingredients'}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-4 pt-0">
                  <div className="p-2.5 rounded-xl bg-cream-50 border border-edge/80 text-[11px] text-forest-700 font-semibold flex items-center justify-between">
                    <span className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-forest-600" />
                      <span>Ready for Kitchen Dispatch</span>
                    </span>
                    <span className="text-[10px] font-mono font-bold text-charcoal-muted">{item.id}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 5. DABBA CIRCULATION FLEET & MANAGEMENT (MODERN OS) */}
      {/* ========================================================================= */}
      {activeTab === 'dabbas' && (
        <DabbaFleetManager
          dabbas={dabbas}
          damagedLedger={damagedLedger}
          onAddDabba={onAddDabba}
          onBulkAddDabbas={onBulkAddDabbas}
          onDecommissionDabba={onDecommissionDabba}
          onDeleteDabba={onDeleteDabba}
          showToast={showToast}
        />
      )}

      {/* ========================================================================= */}
      {/* 6. FINANCE & REVENUE (PRESERVED) */}
      {/* ========================================================================= */}
      {activeTab === 'finance' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div className="bg-white rounded-3xl p-6 border border-edge shadow-apple-card flex flex-col justify-between">
              <span className="text-xs font-bold text-charcoal-muted uppercase tracking-wider block">Monthly Revenue</span>
              <span className="text-4xl font-extrabold text-forest-700 mt-2 block tracking-tight">₹{totalRevenue.toLocaleString()}</span>
              <span className="text-[11px] text-forest-700 font-bold mt-2 block">&uarr; 14.8% vs last month</span>
            </div>
            <div className="bg-white rounded-3xl p-6 border border-edge shadow-apple-card flex flex-col justify-between">
              <span className="text-xs font-bold text-charcoal-muted uppercase tracking-wider block">Pending Dues</span>
              <span className="text-4xl font-extrabold text-warmamber-600 mt-2 block tracking-tight">₹{pendingDues.toLocaleString()}</span>
              <span className="text-[11px] text-charcoal-muted mt-2 block">Sunday reminder automated</span>
            </div>
            <div className="bg-white rounded-3xl p-6 border border-edge shadow-apple-card flex flex-col justify-between">
              <span className="text-xs font-bold text-charcoal-muted uppercase tracking-wider block">Renewal Rate</span>
              <span className="text-4xl font-extrabold text-charcoal mt-2 block tracking-tight">{renewalRate}</span>
              <span className="text-[11px] text-forest-700 font-bold mt-2 block">High organic retention</span>
            </div>
            <div className="bg-white rounded-3xl p-6 border border-edge shadow-apple-card flex flex-col justify-between">
              <span className="text-xs font-bold text-charcoal-muted uppercase tracking-wider block">Churn Rate</span>
              <span className="text-4xl font-extrabold text-charcoal mt-2 block tracking-tight">{churnRate}</span>
              <span className="text-[11px] text-charcoal-muted mt-2 block">Industry benchmark: &lt; 5%</span>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 7. URGENT BROADCAST (PRESERVED) */}
      {/* ========================================================================= */}
      {activeTab === 'broadcast' && (
        <div className="bg-white rounded-3xl p-7 border border-edge shadow-apple-card max-w-2xl mx-auto space-y-5">
          <div>
            <h2 className="text-lg font-bold text-charcoal tracking-tight">Push Urgent Broadcast to Staff</h2>
            <p className="text-xs text-charcoal-muted mt-1 leading-relaxed">
              Dispatches real-time alerts to drivers' smartphones and kitchen tablets (e.g. traffic road diversions, bad weather notice, last-minute leaves).
            </p>
          </div>

          <form onSubmit={handleBroadcast} className="space-y-4">
            <div>
              <label className="text-xs font-bold text-charcoal block mb-1.5">Broadcast Message Content</label>
              <textarea
                rows={3}
                required
                placeholder="e.g. Divert Route A via Cyber Towers due to road closure at Madhapur signal. Ensure box return scan for all stops."
                value={broadcastMsg}
                onChange={(e) => setBroadcastMsg(e.target.value)}
                className="w-full px-4 py-3 text-xs rounded-2xl border border-edge bg-cream-50 focus:outline-none focus:border-forest-600 focus:bg-white text-charcoal font-medium"
              ></textarea>
            </div>

            <button
              type="submit"
              className="w-full py-3 text-xs font-bold rounded-2xl bg-forest-700 text-white hover:bg-forest-800 apple-press shadow-apple-sm flex items-center justify-center gap-2"
            >
              <Send className="w-4 h-4" />
              <span>Broadcast Alert to All Active Devices</span>
            </button>
          </form>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODALS */}
      {/* ========================================================================= */}

      {/* 0. Customer Meal Customization & Kitchen Notes Modal */}
      {editingMealCustomer && (
        <PortalModal>
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-charcoal/60 backdrop-blur-md animate-fade-in">
          <div className="w-full max-w-lg bg-white rounded-3xl p-6 sm:p-7 shadow-apple-modal border border-edge space-y-5 max-h-[90vh] overflow-y-auto no-scrollbar">
            
            <div className="flex items-center justify-between pb-3 border-b border-edge">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-terracotta-50 border border-terracotta-100 flex items-center justify-center text-terracotta-600 flex-shrink-0">
                  <Utensils className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-base font-bold text-charcoal">Customer Meal Modifications</h4>
                  <p className="text-xs text-charcoal-muted">
                    Customer: <strong className="text-forest-800">{editingMealCustomer.name}</strong> ({editingMealCustomer.id})
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setEditingMealCustomer(null)}
                className="w-8 h-8 rounded-full bg-cream-100 hover:bg-cream-200 text-charcoal-muted flex items-center justify-center text-xs font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={(e) => {
              e.preventDefault();
              if (onUpdateCustomerMeal) {
                onUpdateCustomerMeal(editingMealCustomer.id, {
                  subscriptionType: mealForm.subscriptionType,
                  chosenDeliveryDay: mealForm.chosenDeliveryDay,
                  kitchenNotes: mealForm.kitchenNotes,
                  deliveryNotes: mealForm.deliveryNotes,
                  specialInstructions: mealForm.kitchenNotes
                });
                showToast(`Plan & Notes updated! Kitchen and Delivery staff synced for ${editingMealCustomer.name}.`);
              }
              setEditingMealCustomer(null);
            }} className="space-y-4">
              
              {/* Meal Plan Allocation */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-charcoal block">Meal Plan Allocation (3 Plans)</label>
                <select
                  value={mealForm.subscriptionType}
                  onChange={(e) => setMealForm({ ...mealForm, subscriptionType: e.target.value })}
                  className="w-full px-3.5 py-2.5 text-xs rounded-2xl border border-edge bg-cream-50 focus:outline-none focus:border-forest-600 focus:bg-white text-charcoal font-semibold"
                >
                  <option value="UNSUN — Alternate Days (Mon, Wed, Fri)">UNSUN — Alternate Days (Mon, Wed, Fri)</option>
                  <option value="Alternative-2 — Alternate Days (Tue, Thu, Sat)">Alternative-2 — Alternate Days (Tue, Thu, Sat)</option>
                  <option value="One Day Meal (Custom Specific Day)">One Day Meal (Custom Specific Day)</option>
                </select>

                {/* Day picker for One Day Meal */}
                {mealForm.subscriptionType.includes('One Day Meal') && (
                  <div className="p-3 rounded-2xl bg-amber-50/80 border border-amber-200 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-amber-900">Custom Delivery Day</span>
                      <span className="text-[10px] font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded-full border border-rose-200">Sunday Closed</span>
                    </div>
                    <div className="grid grid-cols-6 gap-1">
                      {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].map((d) => (
                        <button
                          key={d}
                          type="button"
                          onClick={() => setMealForm({ ...mealForm, chosenDeliveryDay: d })}
                          className={`py-1.5 text-center text-xs font-bold rounded-lg ${
                            mealForm.chosenDeliveryDay === d ? 'bg-forest-700 text-white shadow-sm' : 'bg-white text-charcoal border border-edge hover:bg-cream-50'
                          }`}
                        >
                          {d.slice(0, 3)}
                        </button>
                      ))}
                    </div>
                    <p className="text-[11px] text-charcoal leading-snug">
                      Auto-pickup: <strong>{mealForm.chosenDeliveryDay === 'Saturday' ? 'Monday' : (mealForm.chosenDeliveryDay === 'Monday' ? 'Tuesday' : mealForm.chosenDeliveryDay === 'Tuesday' ? 'Wednesday' : mealForm.chosenDeliveryDay === 'Wednesday' ? 'Thursday' : mealForm.chosenDeliveryDay === 'Thursday' ? 'Friday' : 'Saturday')}</strong> (Sunday kitchen leave).
                    </p>
                  </div>
                )}
              </div>

              {/* 1. SEPARATE KITCHEN PREPARATION NOTES (For Kitchen Staff Only) */}
              <div className="p-4 rounded-2xl bg-terracotta-50/60 border border-terracotta-200/80 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <ChefHat className="w-4 h-4 text-terracotta-600" />
                    <span className="text-xs font-bold text-terracotta-900 uppercase tracking-wider">
                      Kitchen Staff Notes (Dietary & Prep)
                    </span>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-white text-terracotta-700 font-bold border border-terracotta-200">
                    Kitchen Only
                  </span>
                </div>

                {/* Quick Kitchen Chips */}
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
                    const isSelected = mealForm.kitchenNotes.toLowerCase().includes(tag.toLowerCase());
                    return (
                      <button
                        type="button"
                        key={tag}
                        onClick={() => {
                          let current = mealForm.kitchenNotes.trim();
                          if (isSelected) {
                            const regex = new RegExp(`(^|,\\s*)${tag}`, 'i');
                            current = current.replace(regex, '').replace(/^,\s*/, '').replace(/,\s*,/g, ',');
                          } else {
                            current = current ? `${current}, ${tag}` : tag;
                          }
                          setMealForm({ ...mealForm, kitchenNotes: current });
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
                  value={mealForm.kitchenNotes}
                  onChange={(e) => setMealForm({ ...mealForm, kitchenNotes: e.target.value })}
                  placeholder="e.g. No onion, extra cucumber, pack papaya separately..."
                  className="w-full px-3 py-2 text-xs rounded-xl border border-edge bg-white focus:outline-none focus:border-terracotta-500 text-charcoal font-medium leading-relaxed"
                />
                <p className="text-[10px] text-terracotta-700/80">
                  👨‍🍳 <em>Auto-printed onto daily packaging sticker tags for line cooks & prep chefs.</em>
                </p>
              </div>

              {/* 2. SEPARATE DELIVERY HANDOVER NOTES (For Delivery Staff Only) */}
              <div className="p-4 rounded-2xl bg-forest-50/70 border border-forest-200/80 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Bike className="w-4 h-4 text-forest-700" />
                    <span className="text-xs font-bold text-forest-900 uppercase tracking-wider">
                      Delivery Staff Notes (Drop-off & Handover)
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
                    const isSelected = mealForm.deliveryNotes.toLowerCase().includes(tag.toLowerCase());
                    return (
                      <button
                        type="button"
                        key={tag}
                        onClick={() => {
                          let current = mealForm.deliveryNotes.trim();
                          if (isSelected) {
                            const regex = new RegExp(`(^|,\\s*)${tag}`, 'i');
                            current = current.replace(regex, '').replace(/^,\s*/, '').replace(/,\s*,/g, ',');
                          } else {
                            current = current ? `${current}, ${tag}` : tag;
                          }
                          setMealForm({ ...mealForm, deliveryNotes: current });
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
                  value={mealForm.deliveryNotes}
                  onChange={(e) => setMealForm({ ...mealForm, deliveryNotes: e.target.value })}
                  placeholder="e.g. Leave at security if door locked, call flat 402 on intercom..."
                  className="w-full px-3 py-2 text-xs rounded-xl border border-edge bg-white focus:outline-none focus:border-forest-600 text-charcoal font-medium leading-relaxed"
                />
                <p className="text-[10px] text-forest-700/80">
                  🚴 <em>Visible exclusively to delivery boy on Driver Cockpit GPS stop cards.</em>
                </p>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end gap-3 pt-2 border-t border-edge">
                <button
                  type="button"
                  onClick={() => setEditingMealCustomer(null)}
                  className="px-4 py-2 text-xs font-bold text-charcoal-muted hover:text-charcoal rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 text-xs font-bold text-white bg-forest-700 hover:bg-forest-800 rounded-xl shadow-apple-sm apple-press flex items-center gap-1.5"
                >
                  <CheckCircle2 className="w-4 h-4 text-cream-100" />
                  <span>Save Separate Notes</span>
                </button>
              </div>
            </form>
          </div>
        </div>
        </PortalModal>
      )}



{/* 0B. Schedule Customer Leave & Pause Range Modal */}
      {schedulingLeaveCustomer && (
        <PortalModal>
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-charcoal/60 backdrop-blur-md animate-fade-in">
          <div className="w-full max-w-md bg-white rounded-3xl p-6 sm:p-7 shadow-apple-modal border border-edge space-y-5 max-h-[90vh] overflow-y-auto no-scrollbar">
            
            <div className="flex items-center justify-between pb-3 border-b border-edge">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-warmamber-50 border border-warmamber-100 flex items-center justify-center text-warmamber-600 flex-shrink-0">
                  <Calendar className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-base font-bold text-charcoal">Schedule Customer Leave</h4>
                  <p className="text-xs text-charcoal-muted">
                    Customer: <strong className="text-forest-800">{schedulingLeaveCustomer.name}</strong> ({schedulingLeaveCustomer.id})
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSchedulingLeaveCustomer(null)}
                className="w-8 h-8 rounded-full bg-cream-100 hover:bg-cream-200 text-charcoal-muted flex items-center justify-center text-xs font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={(e) => {
              e.preventDefault();
              const fromDate = new Date(leaveRangeForm.from);
              const toDate = new Date(leaveRangeForm.to);
              const diffTime = Math.max(0, toDate - fromDate);
              const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24)) + 1;

              if (onScheduleLeave) {
                onScheduleLeave(schedulingLeaveCustomer.id, {
                  from: leaveRangeForm.from,
                  to: leaveRangeForm.to,
                  days: diffDays,
                  reason: leaveRangeForm.reason,
                  autoExtend: leaveRangeForm.autoExtend
                });
                showToast(`Scheduled ${diffDays} days leave for ${schedulingLeaveCustomer.name}! Subscription extended.`);
              }
              setSchedulingLeaveCustomer(null);
            }} className="space-y-4">
              
              {/* Current Subscription Validity Badge */}
              <div className="p-3.5 rounded-2xl bg-cream-100/70 border border-edge text-xs flex items-center justify-between">
                <div>
                  <span className="text-[11px] text-charcoal-muted block">Current Plan Validity:</span>
                  <strong className="text-charcoal font-bold">{schedulingLeaveCustomer.startDate} to {schedulingLeaveCustomer.endDate}</strong>
                </div>
                <span className="px-2.5 py-1 rounded-full bg-white text-forest-800 font-bold border border-edge">
                  {schedulingLeaveCustomer.remainingDays} days left
                </span>
              </div>

              {/* Date Pickers */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-charcoal block">From Date (Pause starts)</label>
                  <input
                    type="date"
                    required
                    value={leaveRangeForm.from}
                    onChange={(e) => setLeaveRangeForm({ ...leaveRangeForm, from: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-edge bg-cream-50 focus:outline-none focus:border-forest-600 font-semibold text-charcoal"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-charcoal block">To Date (Pause ends)</label>
                  <input
                    type="date"
                    required
                    value={leaveRangeForm.to}
                    onChange={(e) => setLeaveRangeForm({ ...leaveRangeForm, to: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-edge bg-cream-50 focus:outline-none focus:border-forest-600 font-semibold text-charcoal"
                  />
                </div>
              </div>

              {/* Reason Dropdown */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-charcoal block">Reason for Pause</label>
                <select
                  value={leaveRangeForm.reason}
                  onChange={(e) => setLeaveRangeForm({ ...leaveRangeForm, reason: e.target.value })}
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-edge bg-cream-50 focus:outline-none focus:border-forest-600 font-medium text-charcoal"
                >
                  <option value="Personal Travel / Vacation">Personal Travel / Vacation</option>
                  <option value="Office Event / Out of town">Office Event / Out of town</option>
                  <option value="Fasting / Festive Observance">Fasting / Festive Observance</option>
                  <option value="Health / Doctor Advised Diet">Health / Doctor Advised Diet</option>
                  <option value="Temporary WFH / Schedule Shift">Temporary WFH / Schedule Shift</option>
                </select>
              </div>

              {/* Auto-Extension Guarantee Option */}
              <div className="p-3.5 rounded-2xl bg-forest-50/70 border border-forest-200/80 space-y-2">
                <label className="flex items-start gap-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={leaveRangeForm.autoExtend}
                    onChange={(e) => setLeaveRangeForm({ ...leaveRangeForm, autoExtend: e.target.checked })}
                    className="accent-forest-700 w-4 h-4 mt-0.5"
                  />
                  <div>
                    <span className="text-xs font-bold text-forest-900 block">
                      Auto-Extend Subscription Validity
                    </span>
                    <p className="text-[11px] text-forest-700/90 leading-relaxed mt-0.5">
                      Adds paused days to customer's expiration date so customer doesn't lose paid meals.
                    </p>
                  </div>
                </label>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-3 pt-2 border-t border-edge">
                <button
                  type="button"
                  onClick={() => setSchedulingLeaveCustomer(null)}
                  className="px-4 py-2 text-xs font-bold text-charcoal-muted hover:text-charcoal rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 text-xs font-bold text-white bg-forest-700 hover:bg-forest-800 rounded-xl shadow-apple-sm apple-press flex items-center gap-1.5"
                >
                  <CheckCircle2 className="w-4 h-4 text-cream-100" />
                  <span>Confirm Schedule</span>
                </button>
              </div>
            </form>
          </div>
        </div>
        </PortalModal>
      )}

{/* Cancellation & Settlement Modal */}
      {cancellingCustomer && (
        <PortalModal>
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-charcoal/60 backdrop-blur-md animate-fade-in">
          <div className="w-full max-w-md bg-white rounded-3xl p-6 sm:p-7 shadow-apple-modal border border-edge space-y-4 animate-scale-up">
            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-edge">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-rose-50 text-rose-600 border border-rose-100 flex items-center justify-center">
                  <XCircle className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-base font-bold text-charcoal">Cancel Subscription</h4>
                  <p className="text-xs text-charcoal-muted">
                    {cancellingCustomer.name} ({cancellingCustomer.id})
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setCancellingCustomer(null)}
                className="w-8 h-8 rounded-full bg-cream-100 hover:bg-cream-200 flex items-center justify-center text-charcoal-muted text-xs font-bold"
              >
                ✕
              </button>
            </div>

            {/* Subscription Summary */}
            <div className="p-4 rounded-2xl bg-cream-50 border border-edge grid grid-cols-2 gap-3 text-xs">
              <div>
                <span className="text-charcoal-muted block text-[11px]">Current Plan</span>
                <span className="font-bold text-charcoal">{cancellingCustomer.subscriptionType.split('(')[0]}</span>
              </div>
              <div>
                <span className="text-charcoal-muted block text-[11px]">Remaining Meals</span>
                <span className="font-extrabold text-charcoal text-base">{cancellingCustomer.remainingDays} Days</span>
              </div>
            </div>

            {/* Pro-Rata Refund Calculation Box */}
            <div className="p-4 rounded-2xl bg-forest-50/70 border border-forest-200/80 space-y-3">
              <span className="text-xs font-bold text-forest-900 block">
                Pro-Rata Refund Calculation
              </span>
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="text-[11px] text-charcoal-muted block mb-1">Per-Meal Rate (₹)</label>
                  <input
                    type="number"
                    value={cancelForm.perMealRate}
                    onChange={(e) => {
                      const rate = parseFloat(e.target.value) || 0;
                      setCancelForm({
                        ...cancelForm,
                        perMealRate: rate,
                        refundAmount: (cancellingCustomer.remainingDays || 0) * rate
                      });
                    }}
                    className="w-full px-3 py-1.5 text-xs rounded-xl border border-edge bg-white focus:outline-none focus:border-forest-600 font-bold text-charcoal"
                  />
                </div>
                <div>
                  <label className="text-[11px] text-charcoal-muted block mb-1">Total Refund (₹)</label>
                  <div className="px-3 py-1.5 text-sm rounded-xl border border-forest-200 bg-white font-extrabold text-forest-800">
                    ₹{cancelForm.refundAmount}
                  </div>
                </div>
              </div>
              <p className="text-[11px] text-forest-700 leading-tight">
                {cancellingCustomer.remainingDays} days left × ₹{cancelForm.perMealRate}/meal = ₹{cancelForm.refundAmount}
              </p>
            </div>

            {/* Circular Dabba Recovery Notice */}
            {cancellingCustomer.dabbasHeld && cancellingCustomer.dabbasHeld.length > 0 ? (
              <div className="p-3.5 rounded-2xl bg-warmamber-50 border border-warmamber-200 text-xs space-y-1">
                <div className="flex items-center gap-1.5 text-warmamber-900 font-bold">
                  <AlertTriangle className="w-4 h-4 text-warmamber-600 flex-shrink-0" />
                  <span>Dabba Recovery Required ({cancellingCustomer.dabbasHeld.length} Box)</span>
                </div>
                <p className="text-warmamber-800/90 leading-relaxed text-[11px]">
                  Customer holds box <strong>{cancellingCustomer.dabbasHeld.join(', ')}</strong>. A final pickup stop will be assigned to driver. Refund status: <strong>"Pending Dabba Return"</strong> until tiffin is verified in godown.
                </p>
              </div>
            ) : (
              <div className="p-3 rounded-2xl bg-forest-50 border border-forest-200 text-xs flex items-center gap-2 text-forest-800 font-semibold">
                <CheckCircle2 className="w-4 h-4 text-forest-600 flex-shrink-0" />
                <span>All boxes returned. Refund can be processed immediately.</span>
              </div>
            )}

            {/* Reason */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-charcoal block">Cancellation Reason</label>
              <select
                value={cancelForm.reason}
                onChange={(e) => setCancelForm({ ...cancelForm, reason: e.target.value })}
                className="w-full px-3.5 py-2 text-xs rounded-xl border border-edge bg-cream-50 focus:outline-none focus:border-forest-600 font-medium text-charcoal"
              >
                <option value="Relocating / Moving out of city">Relocating / Moving out of city</option>
                <option value="Diet change / Medical doctor advice">Diet change / Medical doctor advice</option>
                <option value="Budget / Financial reasons">Budget / Financial reasons</option>
                <option value="Dissatisfied with meal taste or delivery">Dissatisfied with meal taste or delivery</option>
                <option value="Personal travel / Taking a break">Personal travel / Taking a break</option>
              </select>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-end gap-3 pt-2 border-t border-edge">
              <button
                type="button"
                onClick={() => setCancellingCustomer(null)}
                className="px-4 py-2 text-xs font-bold text-charcoal-muted hover:text-charcoal rounded-xl apple-press"
              >
                Keep Subscription
              </button>
              <button
                type="button"
                onClick={() => {
                  onCancelSubscription && onCancelSubscription(cancellingCustomer.id, {
                    reason: cancelForm.reason,
                    refundAmount: cancelForm.refundAmount
                  });
                  showToast(`Cancelled subscription for ${cancellingCustomer.name}. Pro-rata refund ₹${cancelForm.refundAmount} registered.`);
                  setCancellingCustomer(null);
                }}
                className="px-5 py-2.5 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-xl shadow-apple-sm apple-press flex items-center gap-1.5"
              >
                <XCircle className="w-4 h-4" />
                <span>Confirm Cancellation & Refund</span>
              </button>
            </div>
          </div>
        </div>
        </PortalModal>
      )}

      {/* 1. Add Customer Modal */}
      {showAddCustomerModal && (
        <PortalModal>
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-charcoal/60 backdrop-blur-md animate-fade-in">
          <div className="w-full max-w-md bg-white rounded-3xl p-7 shadow-apple-modal border border-edge space-y-4 max-h-[90vh] overflow-y-auto no-scrollbar">
            <h4 className="text-base font-bold text-charcoal">Enroll New Customer</h4>
            <form onSubmit={handleCustomerSubmit} className="space-y-3.5">
              <div>
                <label className="text-xs font-bold text-charcoal block mb-1">Customer Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Srikanth Reddy"
                  value={newCustomer.name}
                  onChange={(e) => setNewCustomer({ ...newCustomer, name: e.target.value })}
                  className="w-full px-3.5 py-2.5 text-xs rounded-2xl border border-edge bg-cream-50 focus:outline-none focus:border-forest-600 focus:bg-white text-charcoal font-medium"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-charcoal block mb-1">Phone Number</label>
                  <input
                    type="text"
                    required
                    placeholder="+91 98..."
                    value={newCustomer.phone}
                    onChange={(e) => setNewCustomer({ ...newCustomer, phone: e.target.value })}
                    className="w-full px-3.5 py-2.5 text-xs rounded-2xl border border-edge bg-cream-50 focus:outline-none focus:border-forest-600 focus:bg-white text-charcoal font-medium"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-charcoal block mb-1">Assign Route</label>
                  <select
                    value={newCustomer.routeId}
                    onChange={(e) => setNewCustomer({ ...newCustomer, routeId: e.target.value })}
                    className="w-full px-3.5 py-2.5 text-xs rounded-2xl border border-edge bg-cream-50 focus:outline-none focus:border-forest-600 focus:bg-white text-charcoal font-medium"
                  >
                    {routes.map(r => (
                      <option key={r.id} value={r.id}>{r.name.split('—')[0]}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div>
                <label className="text-xs font-bold text-charcoal block mb-1">Delivery Address</label>
                <input
                  type="text"
                  required
                  placeholder="Flat, Building, Street, Area"
                  value={newCustomer.address}
                  onChange={(e) => setNewCustomer({ ...newCustomer, address: e.target.value })}
                  className="w-full px-3.5 py-2.5 text-xs rounded-2xl border border-edge bg-cream-50 focus:outline-none focus:border-forest-600 focus:bg-white text-charcoal font-medium"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-charcoal block">Subscription Plan (3 Plans)</label>
                <select
                  value={newCustomer.subscriptionType}
                  onChange={(e) => setNewCustomer({ ...newCustomer, subscriptionType: e.target.value })}
                  className="w-full px-3.5 py-2.5 text-xs rounded-2xl border border-edge bg-cream-50 focus:outline-none focus:border-forest-600 focus:bg-white text-charcoal font-medium"
                >
                  <option value="UNSUN — Alternate Days (Mon, Wed, Fri)">UNSUN — Alternate Days (Mon, Wed, Fri)</option>
                  <option value="Alternative-2 — Alternate Days (Tue, Thu, Sat)">Alternative-2 — Alternate Days (Tue, Thu, Sat)</option>
                  <option value="One Day Meal (Custom Specific Day)">One Day Meal (Custom Specific Day)</option>
                </select>

                {newCustomer.subscriptionType.includes('One Day Meal') && (
                  <div className="p-3 rounded-2xl bg-amber-50/80 border border-amber-200 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-amber-900">Delivery Day</span>
                      <span className="text-[10px] font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded-full border border-rose-200">Sunday Closed</span>
                    </div>
                    <div className="grid grid-cols-6 gap-1">
                      {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].map((d) => (
                        <button
                          key={d}
                          type="button"
                          onClick={() => setNewCustomer({ ...newCustomer, chosenDeliveryDay: d })}
                          className={`py-1.5 text-center text-xs font-bold rounded-lg ${
                            newCustomer.chosenDeliveryDay === d ? 'bg-forest-700 text-white' : 'bg-white text-charcoal border border-edge'
                          }`}
                        >
                          {d.slice(0, 3)}
                        </button>
                      ))}
                    </div>
                    <p className="text-[11px] text-charcoal-muted">
                      Empty dabba auto-pickup scheduled on next day (Sunday leave).
                    </p>
                  </div>
                )}
              </div>
              <div>
                <label className="text-xs font-bold text-terracotta-700 block mb-1">
                  👨‍🍳 Kitchen Notes (Dietary / Allergies / Portions)
                </label>
                <input
                  type="text"
                  placeholder="e.g. No onion, peanut allergy, extra sprouts"
                  value={newCustomer.kitchenNotes}
                  onChange={(e) => setNewCustomer({ ...newCustomer, kitchenNotes: e.target.value, specialInstructions: e.target.value })}
                  className="w-full px-3.5 py-2.5 text-xs rounded-2xl border border-edge bg-cream-50 focus:outline-none focus:border-terracotta-500 focus:bg-white text-charcoal font-medium"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-forest-700 block mb-1">
                  🚴 Delivery Notes (Gate Pass / Drop-off Instructions)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Leave at security if door locked, call on arrival"
                  value={newCustomer.deliveryNotes}
                  onChange={(e) => setNewCustomer({ ...newCustomer, deliveryNotes: e.target.value })}
                  className="w-full px-3.5 py-2.5 text-xs rounded-2xl border border-edge bg-cream-50 focus:outline-none focus:border-forest-600 focus:bg-white text-charcoal font-medium"
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddCustomerModal(false)}
                  className="flex-1 py-2.5 text-xs font-bold rounded-xl border border-edge text-charcoal hover:bg-cream-100 apple-press"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 text-xs font-bold rounded-xl bg-forest-700 text-white hover:bg-forest-800 apple-press shadow-apple-sm"
                >
                  Save Customer
                </button>
              </div>
            </form>
          </div>
        </div>
        </PortalModal>
      )}

{/* 2. Add Driver Modal (Comprehensive Staff Recruitment) */}
      {showAddDriverModal && (
        <PortalModal>
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-charcoal/60 backdrop-blur-md animate-fade-in">
          <div className="w-full max-w-xl bg-white rounded-3xl p-6 sm:p-8 shadow-apple-modal border border-edge space-y-5 max-h-[90vh] overflow-y-auto no-scrollbar animate-scale-up">
            
            {/* Header */}
            <div className="flex items-center justify-between pb-3.5 border-b border-edge">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-2xl bg-forest-50 border border-forest-100 flex items-center justify-center text-forest-700 flex-shrink-0">
                  <Bike className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-base sm:text-lg font-bold text-charcoal leading-tight">Recruit Delivery Partner</h4>
                  <p className="text-xs text-charcoal-muted mt-0.5">Onboard logistics driver with verified identity & route assignment</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowAddDriverModal(false)}
                className="w-8 h-8 rounded-full bg-cream-100 hover:bg-cream-200 text-charcoal-muted flex items-center justify-center text-xs font-bold transition-colors apple-press"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleDriverSubmit} className="space-y-4">
              
              {/* Photo Upload & Presets Card */}
              <div className="p-4 bg-cream-50/80 rounded-2xl border border-edge space-y-2.5">
                <label className="text-xs font-bold text-charcoal block">Staff Profile Photo</label>
                <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4">
                  <div className="relative w-16 h-16 rounded-2xl overflow-hidden bg-cream-200 border-2 border-forest-600/30 flex items-center justify-center shrink-0 shadow-apple-sm">
                    {newDriver.photo ? (
                      <img src={newDriver.photo} alt="Preview" className="w-full h-full object-cover" />
                    ) : (
                      <Camera className="w-6 h-6 text-charcoal-muted opacity-60" />
                    )}
                  </div>

                  <div className="space-y-2.5 flex-1 w-full">
                    <div className="flex items-center gap-2">
                      <label 
                        htmlFor="driver-photo-file" 
                        className="px-3.5 py-1.5 rounded-xl bg-forest-700 text-white font-bold text-xs hover:bg-forest-800 transition-colors cursor-pointer flex items-center gap-1.5 shadow-apple-sm apple-press"
                      >
                        <Upload className="w-3.5 h-3.5" />
                        <span>Upload Photo</span>
                      </label>
                      <input 
                        type="file" 
                        id="driver-photo-file" 
                        accept="image/*" 
                        className="hidden" 
                        onChange={(e) => {
                          const file = e.target.files[0];
                          if (file) {
                            const reader = new FileReader();
                            reader.onloadend = () => {
                              setNewDriver(prev => ({ ...prev, photo: reader.result }));
                            };
                            reader.readAsDataURL(file);
                          }
                        }} 
                      />
                      {newDriver.photo && (
                        <button
                          type="button"
                          onClick={() => setNewDriver(prev => ({ ...prev, photo: '' }))}
                          className="px-3 py-1.5 rounded-xl bg-white border border-edge text-charcoal-muted hover:text-charcoal text-xs font-semibold hover:bg-cream-100 transition-colors"
                        >
                          Remove
                        </button>
                      )}
                    </div>

                    {/* Presets */}
                    <div>
                      <span className="text-[10px] text-charcoal-muted font-bold block mb-1.5">Or choose photo preset:</span>
                      <div className="flex items-center gap-1.5 flex-wrap">
                        {STAFF_AVATAR_PRESETS.map((p) => (
                          <button
                            type="button"
                            key={p.name}
                            onClick={() => setNewDriver(prev => ({ ...prev, photo: p.url }))}
                            className={`w-7 h-7 rounded-xl overflow-hidden border-2 transition-all ${
                              newDriver.photo === p.url ? 'border-forest-600 ring-2 ring-forest-500/40 scale-105' : 'border-transparent opacity-70 hover:opacity-100'
                            }`}
                            title={p.name}
                          >
                            <img src={p.url} alt={p.name} className="w-full h-full object-cover" />
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Grid 2-column: Name & Phone (Balanced label heights) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="text-xs font-bold text-charcoal block mb-1.5">
                    Driver Name (Peru) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Suresh Varma"
                    value={newDriver.name}
                    onChange={(e) => setNewDriver({ ...newDriver, name: e.target.value })}
                    className="w-full h-10 px-3.5 text-xs rounded-xl border border-edge bg-cream-50 focus:outline-none focus:border-forest-600 focus:bg-white text-charcoal font-medium transition-all"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-charcoal block mb-1.5">
                    Primary Phone Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="+91 98480 12345"
                    value={newDriver.phone}
                    onChange={(e) => setNewDriver({ ...newDriver, phone: e.target.value })}
                    className="w-full h-10 px-3.5 text-xs rounded-xl border border-edge bg-cream-50 focus:outline-none focus:border-forest-600 focus:bg-white text-charcoal font-medium transition-all"
                  />
                </div>
              </div>

              {/* Grid 2-column: Secondary Phone & Aadhaar (Balanced single-line labels) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="text-xs font-bold text-charcoal block mb-1.5">
                    Secondary Phone (Emergency)
                  </label>
                  <input
                    type="text"
                    placeholder="+91 94400 98765"
                    value={newDriver.secondaryPhone}
                    onChange={(e) => setNewDriver({ ...newDriver, secondaryPhone: e.target.value })}
                    className="w-full h-10 px-3.5 text-xs rounded-xl border border-edge bg-cream-50 focus:outline-none focus:border-forest-600 focus:bg-white text-charcoal font-medium transition-all"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-charcoal block mb-1.5">
                    Aadhaar Number (12 Digits)
                  </label>
                  <input
                    type="text"
                    maxLength={14}
                    placeholder="e.g. 5412 8901 2345"
                    value={newDriver.aadhaar}
                    onChange={(e) => setNewDriver({ ...newDriver, aadhaar: e.target.value })}
                    className="w-full h-10 px-3.5 text-xs rounded-xl border border-edge bg-cream-50 focus:outline-none focus:border-forest-600 focus:bg-white text-charcoal font-medium tracking-wide transition-all"
                  />
                </div>
              </div>

              {/* Residential Address */}
              <div>
                <label className="text-xs font-bold text-charcoal block mb-1.5">
                  Residential Address (Full Address)
                </label>
                <textarea
                  rows={2}
                  placeholder="e.g. Plot 42, Sri Sai Nagar, Madhapur, Hyderabad - 500081"
                  value={newDriver.address}
                  onChange={(e) => setNewDriver({ ...newDriver, address: e.target.value })}
                  className="w-full p-3 text-xs rounded-xl border border-edge bg-cream-50 focus:outline-none focus:border-forest-600 focus:bg-white text-charcoal font-medium leading-relaxed resize-none transition-all"
                />
              </div>

              {/* Route Assignment Card */}
              <div className="p-4 bg-forest-50/60 rounded-2xl border border-forest-100 space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-forest-900 flex items-center gap-1.5">
                    <Navigation className="w-3.5 h-3.5 text-forest-700" />
                    <span>Assign Primary Route</span>
                  </label>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-forest-100 text-forest-800">
                    Changeable Anytime
                  </span>
                </div>
                <div className="relative">
                  <select
                    value={newDriver.assignedRouteId}
                    onChange={(e) => setNewDriver({ ...newDriver, assignedRouteId: e.target.value })}
                    className="w-full h-10 px-3.5 text-xs rounded-xl border border-forest-200 bg-white font-bold text-charcoal focus:outline-none focus:border-forest-600 appearance-none pr-8 cursor-pointer shadow-apple-sm"
                  >
                    {routes.map(r => (
                      <option key={r.id} value={r.id}>
                        📍 {r.name} — ({r.zone})
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="w-4 h-4 text-charcoal-muted absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
                <p className="text-[11px] text-forest-800/80 font-medium">
                  💡 Note: You can reassign or swap this driver's route directly from the table anytime.
                </p>
              </div>

              {/* Modal Actions */}
              <div className="flex items-center justify-end gap-3 pt-3 border-t border-edge">
                <button
                  type="button"
                  onClick={() => setShowAddDriverModal(false)}
                  className="px-5 py-2.5 text-xs font-bold rounded-xl border border-edge text-charcoal hover:bg-cream-100 transition-all apple-press"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 text-xs font-bold rounded-xl bg-forest-700 text-white hover:bg-forest-800 apple-press shadow-apple-sm flex items-center gap-2 transition-all"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Onboard Delivery Driver</span>
                </button>
              </div>
            </form>
          </div>
        </div>
        </PortalModal>
      )}

{/* 3. Add Kitchen Staff Modal (Comprehensive Recruitment) */}
      {showAddKitchenModal && (
        <PortalModal>
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-charcoal/60 backdrop-blur-md animate-fade-in">
          <div className="w-full max-w-xl bg-white rounded-3xl p-6 sm:p-8 shadow-apple-modal border border-edge space-y-5 max-h-[90vh] overflow-y-auto no-scrollbar animate-scale-up">
            
            {/* Header */}
            <div className="flex items-center justify-between pb-3.5 border-b border-edge">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-2xl bg-forest-50 border border-forest-100 flex items-center justify-center text-forest-700 flex-shrink-0">
                  <ChefHat className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-base sm:text-lg font-bold text-charcoal leading-tight">Recruit Kitchen Crew Member</h4>
                  <p className="text-xs text-charcoal-muted mt-0.5">Onboard kitchen chef, prep cook, or packaging specialist</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowAddKitchenModal(false)}
                className="w-8 h-8 rounded-full bg-cream-100 hover:bg-cream-200 text-charcoal-muted flex items-center justify-center text-xs font-bold transition-colors apple-press"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleKitchenStaffSubmit} className="space-y-4">
              
              {/* Photo Upload & Presets Card */}
              <div className="p-4 bg-cream-50/80 rounded-2xl border border-edge space-y-2.5">
                <label className="text-xs font-bold text-charcoal block">Staff Profile Photo</label>
                <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4">
                  <div className="relative w-16 h-16 rounded-2xl overflow-hidden bg-cream-200 border-2 border-forest-600/30 flex items-center justify-center shrink-0 shadow-apple-sm">
                    {newKitchenStaff.photo ? (
                      <img src={newKitchenStaff.photo} alt="Preview" className="w-full h-full object-cover" />
                    ) : (
                      <Camera className="w-6 h-6 text-charcoal-muted opacity-60" />
                    )}
                  </div>

                  <div className="space-y-2.5 flex-1 w-full">
                    <div className="flex items-center gap-2">
                      <label 
                        htmlFor="kitchen-photo-file" 
                        className="px-3.5 py-1.5 rounded-xl bg-forest-700 text-white font-bold text-xs hover:bg-forest-800 transition-colors cursor-pointer flex items-center gap-1.5 shadow-apple-sm apple-press"
                      >
                        <Upload className="w-3.5 h-3.5" />
                        <span>Upload Photo</span>
                      </label>
                      <input 
                        type="file" 
                        id="kitchen-photo-file" 
                        accept="image/*" 
                        className="hidden" 
                        onChange={(e) => {
                          const file = e.target.files[0];
                          if (file) {
                            const reader = new FileReader();
                            reader.onloadend = () => {
                              setNewKitchenStaff(prev => ({ ...prev, photo: reader.result }));
                            };
                            reader.readAsDataURL(file);
                          }
                        }} 
                      />
                      {newKitchenStaff.photo && (
                        <button
                          type="button"
                          onClick={() => setNewKitchenStaff(prev => ({ ...prev, photo: '' }))}
                          className="px-3 py-1.5 rounded-xl bg-white border border-edge text-charcoal-muted hover:text-charcoal text-xs font-semibold hover:bg-cream-100 transition-colors"
                        >
                          Remove
                        </button>
                      )}
                    </div>

                    {/* Presets */}
                    <div>
                      <span className="text-[10px] text-charcoal-muted font-bold block mb-1.5">Or choose photo preset:</span>
                      <div className="flex items-center gap-1.5 flex-wrap">
                        {STAFF_AVATAR_PRESETS.map((p) => (
                          <button
                            type="button"
                            key={p.name}
                            onClick={() => setNewKitchenStaff(prev => ({ ...prev, photo: p.url }))}
                            className={`w-7 h-7 rounded-xl overflow-hidden border-2 transition-all ${
                              newKitchenStaff.photo === p.url ? 'border-forest-600 ring-2 ring-forest-500/40 scale-105' : 'border-transparent opacity-70 hover:opacity-100'
                            }`}
                            title={p.name}
                          >
                            <img src={p.url} alt={p.name} className="w-full h-full object-cover" />
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Grid 2-column: Name & Phone */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="text-xs font-bold text-charcoal block mb-1.5">
                    Crew Name (Peru) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Ramesh Sharma"
                    value={newKitchenStaff.name}
                    onChange={(e) => setNewKitchenStaff({ ...newKitchenStaff, name: e.target.value })}
                    className="w-full h-10 px-3.5 text-xs rounded-xl border border-edge bg-cream-50 focus:outline-none focus:border-forest-600 focus:bg-white text-charcoal font-medium transition-all"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-charcoal block mb-1.5">
                    Primary Phone Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="+91 98490 22334"
                    value={newKitchenStaff.phone}
                    onChange={(e) => setNewKitchenStaff({ ...newKitchenStaff, phone: e.target.value })}
                    className="w-full h-10 px-3.5 text-xs rounded-xl border border-edge bg-cream-50 focus:outline-none focus:border-forest-600 focus:bg-white text-charcoal font-medium transition-all"
                  />
                </div>
              </div>

              {/* Grid 2-column: Secondary Phone & Aadhaar */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="text-xs font-bold text-charcoal block mb-1.5">
                    Secondary Phone (Emergency)
                  </label>
                  <input
                    type="text"
                    placeholder="+91 98490 55443"
                    value={newKitchenStaff.secondaryPhone}
                    onChange={(e) => setNewKitchenStaff({ ...newKitchenStaff, secondaryPhone: e.target.value })}
                    className="w-full h-10 px-3.5 text-xs rounded-xl border border-edge bg-cream-50 focus:outline-none focus:border-forest-600 focus:bg-white text-charcoal font-medium transition-all"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-charcoal block mb-1.5">
                    Aadhaar Number (12 Digits)
                  </label>
                  <input
                    type="text"
                    maxLength={14}
                    placeholder="e.g. 3489 1276 5643"
                    value={newKitchenStaff.aadhaar}
                    onChange={(e) => setNewKitchenStaff({ ...newKitchenStaff, aadhaar: e.target.value })}
                    className="w-full h-10 px-3.5 text-xs rounded-xl border border-edge bg-cream-50 focus:outline-none focus:border-forest-600 focus:bg-white text-charcoal font-medium tracking-wide transition-all"
                  />
                </div>
              </div>

              {/* Address */}
              <div>
                <label className="text-xs font-bold text-charcoal block mb-1.5">
                  Residential Address (Full Address)
                </label>
                <textarea
                  rows={2}
                  placeholder="e.g. H.No 3-4-118, Barkatpura, Hyderabad - 500027"
                  value={newKitchenStaff.address}
                  onChange={(e) => setNewKitchenStaff({ ...newKitchenStaff, address: e.target.value })}
                  className="w-full p-3 text-xs rounded-xl border border-edge bg-cream-50 focus:outline-none focus:border-forest-600 focus:bg-white text-charcoal font-medium leading-relaxed resize-none transition-all"
                />
              </div>

              {/* Role & Station */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="text-xs font-bold text-charcoal block mb-1.5">Kitchen Role</label>
                  <div className="relative">
                    <select
                      value={newKitchenStaff.role}
                      onChange={(e) => setNewKitchenStaff({ ...newKitchenStaff, role: e.target.value })}
                      className="w-full h-10 px-3.5 text-xs rounded-xl border border-edge bg-cream-50 focus:outline-none focus:border-forest-600 focus:bg-white text-charcoal font-medium appearance-none pr-8 cursor-pointer"
                    >
                      <option value="Head Cook">Head Cook</option>
                      <option value="Prep Cook">Prep Cook</option>
                      <option value="Packing Specialist">Packing Specialist</option>
                      <option value="Nutrition Quality Checker">Nutrition Quality Checker</option>
                      <option value="Sanitization Specialist">Sanitization Specialist</option>
                    </select>
                    <ChevronDown className="w-4 h-4 text-charcoal-muted absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-charcoal block mb-1.5">Kitchen Station</label>
                  <input
                    type="text"
                    placeholder="e.g. Hot Boiling / Sprouts Prep"
                    value={newKitchenStaff.station}
                    onChange={(e) => setNewKitchenStaff({ ...newKitchenStaff, station: e.target.value })}
                    className="w-full h-10 px-3.5 text-xs rounded-xl border border-edge bg-cream-50 focus:outline-none focus:border-forest-600 focus:bg-white text-charcoal font-medium transition-all"
                  />
                </div>
              </div>

              {/* Modal Actions */}
              <div className="flex items-center justify-end gap-3 pt-3 border-t border-edge">
                <button
                  type="button"
                  onClick={() => setShowAddKitchenModal(false)}
                  className="px-5 py-2.5 text-xs font-bold rounded-xl border border-edge text-charcoal hover:bg-cream-100 transition-all apple-press"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 text-xs font-bold rounded-xl bg-forest-700 text-white hover:bg-forest-800 apple-press shadow-apple-sm flex items-center gap-2 transition-all"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Onboard Kitchen Staff</span>
                </button>
              </div>
            </form>
          </div>
        </div>
        </PortalModal>
      )}

{/* 3B. Edit Staff Profile & Route Modal */}
      {editingStaff && (
        <PortalModal>
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-charcoal/60 backdrop-blur-md animate-fade-in">
          <div className="w-full max-w-xl bg-white rounded-3xl p-6 sm:p-8 shadow-apple-modal border border-edge space-y-5 max-h-[90vh] overflow-y-auto no-scrollbar animate-scale-up">
            
            {/* Header */}
            <div className="flex items-center justify-between pb-3.5 border-b border-edge">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-2xl bg-forest-50 border border-forest-100 flex items-center justify-center text-forest-700 flex-shrink-0">
                  {editingStaff.type === 'driver' ? <Bike className="w-5 h-5" /> : <ChefHat className="w-5 h-5" />}
                </div>
                <div>
                  <h4 className="text-base sm:text-lg font-bold text-charcoal leading-tight">
                    Edit {editingStaff.type === 'driver' ? 'Driver Profile & Route' : 'Kitchen Staff Profile'}
                  </h4>
                  <p className="text-xs text-charcoal-muted mt-0.5">
                    Staff ID: <strong>{editingStaff.data.id}</strong> • {editingStaff.data.name}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setEditingStaff(null)}
                className="w-8 h-8 rounded-full bg-cream-100 hover:bg-cream-200 text-charcoal-muted flex items-center justify-center text-xs font-bold transition-colors apple-press"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveStaffEdit} className="space-y-4">
              
              {/* Photo & Presets Card */}
              <div className="p-4 bg-cream-50/80 rounded-2xl border border-edge space-y-2.5">
                <label className="text-xs font-bold text-charcoal block">Profile Photo</label>
                <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4">
                  <div className="relative w-16 h-16 rounded-2xl overflow-hidden bg-cream-200 border-2 border-forest-600/30 flex items-center justify-center shrink-0 shadow-apple-sm">
                    {editingStaff.data.photo ? (
                      <img src={editingStaff.data.photo} alt="Preview" className="w-full h-full object-cover" />
                    ) : (
                      <User className="w-6 h-6 text-charcoal-muted" />
                    )}
                  </div>
                  <div className="flex-1 w-full space-y-2.5">
                    <div className="flex items-center gap-2">
                      <label 
                        htmlFor="edit-photo-file" 
                        className="px-3.5 py-1.5 rounded-xl bg-forest-700 text-white font-bold text-xs hover:bg-forest-800 transition-colors cursor-pointer flex items-center gap-1.5 shadow-apple-sm apple-press"
                      >
                        <Upload className="w-3.5 h-3.5" />
                        <span>Change Photo</span>
                      </label>
                      <input 
                        type="file" 
                        id="edit-photo-file" 
                        accept="image/*" 
                        className="hidden" 
                        onChange={(e) => {
                          const file = e.target.files[0];
                          if (file) {
                            const reader = new FileReader();
                            reader.onloadend = () => {
                              setEditingStaff(prev => ({ ...prev, data: { ...prev.data, photo: reader.result } }));
                            };
                            reader.readAsDataURL(file);
                          }
                        }} 
                      />
                    </div>
                    <div>
                      <span className="text-[10px] text-charcoal-muted font-bold block mb-1.5">Or choose photo preset:</span>
                      <div className="flex items-center gap-1.5 flex-wrap">
                        {STAFF_AVATAR_PRESETS.map((p) => (
                          <button
                            type="button"
                            key={p.name}
                            onClick={() => setEditingStaff(prev => ({ ...prev, data: { ...prev.data, photo: p.url } }))}
                            className={`w-7 h-7 rounded-xl overflow-hidden border-2 transition-all ${
                              editingStaff.data.photo === p.url ? 'border-forest-600 ring-2 ring-forest-500/40 scale-105' : 'border-transparent opacity-70 hover:opacity-100'
                            }`}
                            title={p.name}
                          >
                            <img src={p.url} alt={p.name} className="w-full h-full object-cover" />
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Name & Phone */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="text-xs font-bold text-charcoal block mb-1.5">Full Name</label>
                  <input
                    type="text"
                    required
                    value={editingStaff.data.name || ''}
                    onChange={(e) => setEditingStaff(prev => ({ ...prev, data: { ...prev.data, name: e.target.value } }))}
                    className="w-full h-10 px-3.5 text-xs rounded-xl border border-edge bg-cream-50 focus:outline-none focus:border-forest-600 focus:bg-white text-charcoal font-medium transition-all"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-charcoal block mb-1.5">Primary Phone</label>
                  <input
                    type="text"
                    required
                    value={editingStaff.data.phone || ''}
                    onChange={(e) => setEditingStaff(prev => ({ ...prev, data: { ...prev.data, phone: e.target.value } }))}
                    className="w-full h-10 px-3.5 text-xs rounded-xl border border-edge bg-cream-50 focus:outline-none focus:border-forest-600 focus:bg-white text-charcoal font-medium transition-all"
                  />
                </div>
              </div>

              {/* Secondary Phone & Aadhaar */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="text-xs font-bold text-charcoal block mb-1.5">Secondary Phone (Emergency)</label>
                  <input
                    type="text"
                    placeholder="+91..."
                    value={editingStaff.data.secondaryPhone || ''}
                    onChange={(e) => setEditingStaff(prev => ({ ...prev, data: { ...prev.data, secondaryPhone: e.target.value } }))}
                    className="w-full h-10 px-3.5 text-xs rounded-xl border border-edge bg-cream-50 focus:outline-none focus:border-forest-600 focus:bg-white text-charcoal font-medium transition-all"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-charcoal block mb-1.5">Aadhaar Number (12 Digits)</label>
                  <input
                    type="text"
                    placeholder="12-digit Aadhaar"
                    value={editingStaff.data.aadhaar || ''}
                    onChange={(e) => setEditingStaff(prev => ({ ...prev, data: { ...prev.data, aadhaar: e.target.value } }))}
                    className="w-full h-10 px-3.5 text-xs rounded-xl border border-edge bg-cream-50 focus:outline-none focus:border-forest-600 focus:bg-white text-charcoal font-medium tracking-wide transition-all"
                  />
                </div>
              </div>

              {/* Address */}
              <div>
                <label className="text-xs font-bold text-charcoal block mb-1.5">Residential Address</label>
                <textarea
                  rows={2}
                  value={editingStaff.data.address || ''}
                  onChange={(e) => setEditingStaff(prev => ({ ...prev, data: { ...prev.data, address: e.target.value } }))}
                  className="w-full p-3 text-xs rounded-xl border border-edge bg-cream-50 focus:outline-none focus:border-forest-600 focus:bg-white text-charcoal font-medium leading-relaxed resize-none transition-all"
                />
              </div>

              {/* Route Assignment (Specifically for Delivery Boys with easy change!) */}
              {editingStaff.type === 'driver' && (
                <div className="p-4 bg-forest-50/60 rounded-2xl border border-forest-100 space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-forest-900 flex items-center gap-1.5">
                      <Navigation className="w-3.5 h-3.5 text-forest-700" />
                      <span>Change Assigned Route Zone</span>
                    </label>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-forest-100 text-forest-800">
                      Changeable Anytime
                    </span>
                  </div>
                  <div className="relative">
                    <select
                      value={editingStaff.data.assignedRouteId || ''}
                      onChange={(e) => {
                        const newRId = e.target.value;
                        const rObj = routes.find(r => r.id === newRId);
                        setEditingStaff(prev => ({
                          ...prev,
                          data: {
                            ...prev.data,
                            assignedRouteId: newRId,
                            routeZone: rObj ? `${rObj.name} (${rObj.zone})` : prev.data.routeZone
                          }
                        }));
                      }}
                      className="w-full h-10 px-3.5 text-xs rounded-xl border border-forest-200 bg-white font-bold text-charcoal focus:outline-none focus:border-forest-600 appearance-none pr-8 cursor-pointer shadow-apple-sm"
                    >
                      {routes.map(r => (
                        <option key={r.id} value={r.id}>
                          📍 {r.name} — ({r.zone})
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="w-4 h-4 text-charcoal-muted absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                </div>
              )}

              {/* Kitchen Role & Station for Kitchen Staff */}
              {editingStaff.type === 'kitchen' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div>
                    <label className="text-xs font-bold text-charcoal block mb-1.5">Kitchen Role</label>
                    <div className="relative">
                      <select
                        value={editingStaff.data.role || 'Prep Cook'}
                        onChange={(e) => setEditingStaff(prev => ({ ...prev, data: { ...prev.data, role: e.target.value } }))}
                        className="w-full h-10 px-3.5 text-xs rounded-xl border border-edge bg-cream-50 focus:outline-none focus:border-forest-600 focus:bg-white text-charcoal font-medium appearance-none pr-8 cursor-pointer"
                      >
                        <option value="Head Cook">Head Cook</option>
                        <option value="Prep Cook">Prep Cook</option>
                        <option value="Packing Specialist">Packing Specialist</option>
                        <option value="Nutrition Quality Checker">Nutrition Quality Checker</option>
                        <option value="Sanitization Specialist">Sanitization Specialist</option>
                      </select>
                      <ChevronDown className="w-4 h-4 text-charcoal-muted absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-charcoal block mb-1.5">Kitchen Station</label>
                    <input
                      type="text"
                      value={editingStaff.data.station || ''}
                      onChange={(e) => setEditingStaff(prev => ({ ...prev, data: { ...prev.data, station: e.target.value } }))}
                      className="w-full h-10 px-3.5 text-xs rounded-xl border border-edge bg-cream-50 focus:outline-none focus:border-forest-600 focus:bg-white text-charcoal font-medium transition-all"
                    />
                  </div>
                </div>
              )}

              {/* Modal Actions */}
              <div className="flex items-center justify-end gap-3 pt-3 border-t border-edge">
                <button
                  type="button"
                  onClick={() => setEditingStaff(null)}
                  className="px-5 py-2.5 text-xs font-bold rounded-xl border border-edge text-charcoal hover:bg-cream-100 transition-all apple-press"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 text-xs font-bold rounded-xl bg-forest-700 text-white hover:bg-forest-800 apple-press shadow-apple-sm flex items-center gap-2 transition-all"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Save Staff Profile</span>
                </button>
              </div>
            </form>
          </div>
        </div>
        </PortalModal>
      )}

{/* 4. Create Route Modal */}
      {showCreateRouteModal && (
        <PortalModal>
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-charcoal/60 backdrop-blur-md animate-fade-in">
          <div className="w-full max-w-sm bg-white rounded-3xl p-7 shadow-apple-modal border border-edge space-y-4">
            <h4 className="text-base font-bold text-charcoal">Create Delivery Route</h4>
            <form onSubmit={handleRouteSubmit} className="space-y-3.5">
              <div>
                <label className="text-xs font-bold text-charcoal block mb-1">Route Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Route D — Manikonda & Nanakramguda"
                  value={newRoute.name}
                  onChange={(e) => setNewRoute({ ...newRoute, name: e.target.value })}
                  className="w-full px-3.5 py-2.5 text-xs rounded-2xl border border-edge bg-cream-50 focus:outline-none focus:border-forest-600 focus:bg-white text-charcoal font-medium"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-charcoal block mb-1">Zone Region</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. West Hyderabad IT Corridor"
                  value={newRoute.zone}
                  onChange={(e) => setNewRoute({ ...newRoute, zone: e.target.value })}
                  className="w-full px-3.5 py-2.5 text-xs rounded-2xl border border-edge bg-cream-50 focus:outline-none focus:border-forest-600 focus:bg-white text-charcoal font-medium"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-charcoal block mb-1">Coverage Description</label>
                <textarea
                  rows={2}
                  placeholder="Covers Puppalguda, Nanakramguda & Financial District Phase 2"
                  value={newRoute.description}
                  onChange={(e) => setNewRoute({ ...newRoute, description: e.target.value })}
                  className="w-full px-3.5 py-2.5 text-xs rounded-2xl border border-edge bg-cream-50 focus:outline-none focus:border-forest-600 focus:bg-white text-charcoal font-medium"
                ></textarea>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCreateRouteModal(false)}
                  className="flex-1 py-2.5 text-xs font-bold rounded-xl border border-edge text-charcoal hover:bg-cream-100 apple-press"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 text-xs font-bold rounded-xl bg-forest-700 text-white hover:bg-forest-800 apple-press shadow-apple-sm"
                >
                  Create Route
                </button>
              </div>
            </form>
          </div>
        </div>
        </PortalModal>
      )}

      {/* 5. Comprehensive Add Dish to Menu Modal */}
      {showAddMenuModal && (
        <PortalModal>
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-charcoal/60 backdrop-blur-md animate-fade-in">
          <div className="w-full max-w-xl bg-white rounded-3xl p-6 sm:p-7 shadow-apple-modal border border-edge space-y-4 max-h-[92vh] overflow-y-auto no-scrollbar animate-scale-up">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3 border-b border-edge">
              <div>
                <h4 className="text-base sm:text-lg font-bold text-charcoal flex items-center gap-2">
                  <Utensils className="w-5 h-5 text-forest-700" />
                  <span>Add Dish to {menuSubTab.toUpperCase()} Menu</span>
                </h4>
                <p className="text-xs text-charcoal-muted mt-0.5">
                  Configure photo, protein, weight, ingredients, category & price
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowAddMenuModal(false)}
                className="w-8 h-8 rounded-full bg-cream-100 hover:bg-cream-200 flex items-center justify-center text-charcoal-muted text-xs font-bold apple-press"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleMenuSubmit} className="space-y-4">
              
              {/* 1. DISH PHOTO SECTION */}
              <div className="space-y-2.5 p-4 rounded-2xl bg-cream-50 border border-edge">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-charcoal flex items-center gap-1.5">
                    <Camera className="w-3.5 h-3.5 text-forest-700" />
                    <span>Dish Photo & Visual Preview</span>
                  </label>
                  <span className="text-[10px] text-charcoal-muted">Upload file, URL, or select preset</span>
                </div>

                {/* Live Preview Box */}
                <div className="relative h-40 w-full rounded-2xl overflow-hidden bg-white border border-edge flex items-center justify-center group shadow-apple-sm">
                  {newMenuItem.image ? (
                    <>
                      <img
                        src={newMenuItem.image}
                        alt="Dish Preview"
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-charcoal/70 via-transparent to-black/20" />
                      
                      {/* Live Badge Preview */}
                      <div className="absolute top-2.5 left-2.5">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-white/95 text-forest-800 shadow-apple-sm">
                          {newMenuItem.category || 'High Protein'}
                        </span>
                      </div>

                      <div className="absolute bottom-2.5 left-2.5 right-2.5 flex items-baseline justify-between text-white">
                        <div>
                          <span className="text-sm font-bold block drop-shadow-sm leading-tight">
                            {newMenuItem.name || 'Untitled Dish Preview'}
                          </span>
                          <span className="text-[10px] opacity-90 drop-shadow-sm">
                            {newMenuItem.protein || '16g'} Protein • {newMenuItem.weight || '200g'}
                          </span>
                        </div>
                        <span className="text-base font-extrabold text-white drop-shadow-md">
                          ₹{newMenuItem.price || 120}
                        </span>
                      </div>
                    </>
                  ) : (
                    <div className="text-center p-4">
                      <ImageIcon className="w-8 h-8 text-charcoal-muted mx-auto mb-1 opacity-50" />
                      <span className="text-xs font-semibold text-charcoal-muted block">No photo selected</span>
                      <span className="text-[11px] text-charcoal-subtle">Pick a preset or upload below</span>
                    </div>
                  )}
                </div>

                {/* Upload & URL Inputs */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                  <div>
                    <input
                      type="file"
                      id="dish-file-input"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onloadend = () => {
                            setNewMenuItem(prev => ({ ...prev, image: reader.result }));
                          };
                          reader.readAsDataURL(file);
                        }
                      }}
                    />
                    <label
                      htmlFor="dish-file-input"
                      className="w-full py-2 px-3 text-xs font-bold rounded-xl border border-edge bg-white hover:bg-cream-100 text-charcoal apple-press flex items-center justify-center gap-1.5 cursor-pointer shadow-apple-sm"
                    >
                      <Upload className="w-3.5 h-3.5 text-forest-700" />
                      <span>Upload Photo from Device</span>
                    </label>
                  </div>

                  <div>
                    <input
                      type="url"
                      placeholder="Or paste image URL (https://...)"
                      value={newMenuItem.image}
                      onChange={(e) => setNewMenuItem({ ...newMenuItem, image: e.target.value })}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-edge bg-white focus:outline-none focus:border-forest-600 font-medium text-charcoal"
                    />
                  </div>
                </div>

                {/* Quick Preset Gallery */}
                <div className="space-y-1.5 pt-1 border-t border-edge/60">
                  <span className="text-[10px] font-bold text-charcoal-muted uppercase tracking-wider block">
                    Quick 1-Click Healthy Food Presets:
                  </span>
                  <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                    {dishPhotoPresets.map((preset, idx) => (
                      <button
                        type="button"
                        key={idx}
                        onClick={() => {
                          setNewMenuItem(prev => ({
                            ...prev,
                            image: preset.image,
                            category: prev.category || preset.category,
                            protein: prev.protein || preset.defaultProtein,
                            weight: prev.weight || preset.defaultWeight,
                            quantity: prev.weight || preset.defaultWeight,
                            price: prev.price || preset.defaultPrice
                          }));
                        }}
                        className={`p-1 rounded-xl border text-center transition-all ${
                          newMenuItem.image === preset.image
                            ? 'border-forest-600 bg-forest-50/60 shadow-apple-sm'
                            : 'border-edge bg-white hover:bg-cream-100'
                        }`}
                      >
                        <img
                          src={preset.image}
                          alt={preset.title}
                          className="w-full h-11 object-cover rounded-lg"
                        />
                        <span className="text-[10px] font-bold text-charcoal truncate block mt-1">
                          {preset.title}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* 2. DISH NAME & CATEGORY */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-charcoal block mb-1">
                    Dish Name <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Sprouted Moong & Pomegranate Bowl"
                    value={newMenuItem.name}
                    onChange={(e) => setNewMenuItem({ ...newMenuItem, name: e.target.value })}
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-edge bg-cream-50 focus:outline-none focus:border-forest-600 focus:bg-white text-charcoal font-semibold"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-charcoal block mb-1">Nutrition Category</label>
                  <select
                    value={newMenuItem.category}
                    onChange={(e) => setNewMenuItem({ ...newMenuItem, category: e.target.value })}
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-edge bg-cream-50 focus:outline-none focus:border-forest-600 focus:bg-white text-charcoal font-semibold"
                  >
                    <option value="High Protein">High Protein</option>
                    <option value="Hydration & Fiber">Hydration & Fiber</option>
                    <option value="Healthy Fats">Healthy Fats</option>
                    <option value="Keto Special">Keto Special</option>
                    <option value="Iron & Energy">Iron & Energy</option>
                    <option value="Antioxidants">Antioxidants</option>
                  </select>
                </div>
              </div>

              {/* 3. NUTRITION & PRICING STATS: Protein, Weight, Price, Calories */}
              <div className="p-4 rounded-2xl bg-cream-50 border border-edge space-y-3">
                <span className="text-xs font-bold text-forest-900 block">
                  Nutritional Stats & Pricing Details
                </span>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {/* Amount / Price */}
                  <div>
                    <label className="text-[11px] font-bold text-charcoal block mb-1">
                      Price / Amount (₹)
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-charcoal-muted">₹</span>
                      <input
                        type="number"
                        required
                        min="10"
                        step="5"
                        placeholder="130"
                        value={newMenuItem.price}
                        onChange={(e) => setNewMenuItem({ ...newMenuItem, price: e.target.value })}
                        className="w-full pl-7 pr-3 py-2 text-xs rounded-xl border border-edge bg-white focus:outline-none focus:border-forest-600 text-charcoal font-extrabold"
                      />
                    </div>
                  </div>

                  {/* Protein */}
                  <div>
                    <label className="text-[11px] font-bold text-charcoal block mb-1 flex items-center gap-1">
                      <Dumbbell className="w-3 h-3 text-forest-600" />
                      <span>Protein (g)</span>
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. 18g"
                      value={newMenuItem.protein}
                      onChange={(e) => setNewMenuItem({ ...newMenuItem, protein: e.target.value })}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-edge bg-white focus:outline-none focus:border-forest-600 text-charcoal font-bold"
                    />
                  </div>

                  {/* Weight / Portion */}
                  <div>
                    <label className="text-[11px] font-bold text-charcoal block mb-1 flex items-center gap-1">
                      <Scale className="w-3 h-3 text-charcoal-muted" />
                      <span>Portion Weight</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. 250g"
                      value={newMenuItem.weight}
                      onChange={(e) => setNewMenuItem({ ...newMenuItem, weight: e.target.value, quantity: e.target.value })}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-edge bg-white focus:outline-none focus:border-forest-600 text-charcoal font-bold"
                    />
                  </div>

                  {/* Calories */}
                  <div>
                    <label className="text-[11px] font-bold text-charcoal block mb-1 flex items-center gap-1">
                      <Flame className="w-3 h-3 text-warmamber-600" />
                      <span>Calories</span>
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. 280 kcal"
                      value={newMenuItem.calories}
                      onChange={(e) => setNewMenuItem({ ...newMenuItem, calories: e.target.value })}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-edge bg-white focus:outline-none focus:border-forest-600 text-charcoal font-medium"
                    />
                  </div>
                </div>

                {/* Dietary Tag */}
                <div className="pt-2 border-t border-edge/60">
                  <label className="text-[11px] font-bold text-charcoal block mb-1">Dietary Speciality Tag</label>
                  <select
                    value={newMenuItem.dietary}
                    onChange={(e) => setNewMenuItem({ ...newMenuItem, dietary: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-edge bg-white focus:outline-none focus:border-forest-600 text-charcoal font-medium"
                  >
                    <option value="Vegan & High Fiber">Vegan & High Fiber</option>
                    <option value="100% Pure Veg">100% Pure Veg</option>
                    <option value="High Protein Keto">High Protein Keto</option>
                    <option value="Gluten-Free Millet">Gluten-Free Millet</option>
                    <option value="100% Raw & Digestive">100% Raw & Digestive</option>
                    <option value="Heart Healthy Omega-3">Heart Healthy Omega-3</option>
                  </select>
                </div>
              </div>

              {/* 4. INGREDIENTS BREAKDOWN */}
              <div>
                <label className="text-xs font-bold text-charcoal block mb-1">
                  Ingredients Breakdown & Sourcing
                </label>
                <textarea
                  rows={2}
                  required
                  placeholder="e.g. Sprouted Green Moong, Pomegranate pearls, Persian cucumber, Lemon vinaigrette, Himalayan pink salt"
                  value={newMenuItem.ingredients}
                  onChange={(e) => setNewMenuItem({ ...newMenuItem, ingredients: e.target.value })}
                  className="w-full px-3.5 py-2.5 text-xs rounded-2xl border border-edge bg-cream-50 focus:outline-none focus:border-forest-600 focus:bg-white text-charcoal font-medium leading-relaxed"
                />
                <span className="text-[11px] text-charcoal-muted mt-1 block">
                  👨‍🍳 Auto-scaled into the Kitchen Warehouse Ingredient Calculator for prep cooks.
                </span>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-3 pt-3 border-t border-edge">
                <button
                  type="button"
                  onClick={() => setShowAddMenuModal(false)}
                  className="px-4 py-2.5 text-xs font-bold rounded-xl border border-edge text-charcoal hover:bg-cream-100 apple-press"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 text-xs font-bold rounded-xl bg-forest-700 text-white hover:bg-forest-800 apple-press shadow-apple-sm flex items-center gap-1.5"
                >
                  <CheckCircle2 className="w-4 h-4 text-cream-100" />
                  <span>Add Dish to Daily Plan</span>
                </button>
              </div>

            </form>
          </div>
        </div>
        </PortalModal>
      )}

</div>
  );
}
