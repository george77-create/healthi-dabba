import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import CustomerPortal from './components/CustomerPortal';
import DeliveryPortal from './components/DeliveryPortal';
import DriverCopilotApp from './copilot/DriverCopilotApp';
import KitchenPortal from './components/KitchenPortal';
import AdminPortal from './components/AdminPortal';
import QRModal from './components/QRModal';
import LoginPage from './components/LoginPage';
import { 
  initialCustomers, 
  initialDeliveryBoys, 
  initialKitchenStaff,
  initialRoutes,
  initialDailyMenu,
  initialDabbas, 
  initialDamagedDabbas,
  initialKitchenInventory, 
  initialKitchenTasks, 
  dispatchChecklist 
} from './data/mockData';

export default function App() {
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const saved = localStorage.getItem('healthi_dabba_user');
      return saved ? JSON.parse(saved) : null;
    } catch (e) {
      return null;
    }
  });

  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    try {
      return !!localStorage.getItem('healthi_dabba_user');
    } catch (e) {
      return false;
    }
  });

  const [currentRole, setCurrentRole] = useState(() => {
    try {
      const saved = localStorage.getItem('healthi_dabba_user');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.role) return parsed.role;
      }
    } catch (e) {}
    return 'admin';
  });

  const [activeCustomerId, setActiveCustomerId] = useState(() => {
    try {
      const saved = localStorage.getItem('healthi_dabba_user');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.customerId) return parsed.customerId;
      }
    } catch (e) {}
    return 'CUST-001';
  });
  
  // Central synced state
  const [customers, setCustomers] = useState(initialCustomers);
  const [deliveryBoys, setDeliveryBoys] = useState(initialDeliveryBoys);
  const [kitchenStaff, setKitchenStaff] = useState(initialKitchenStaff);
  const [routes, setRoutes] = useState(initialRoutes);
  const [dailyMenu, setDailyMenu] = useState(initialDailyMenu);
  const [dabbas, setDabbas] = useState(initialDabbas);
  const [damagedLedger, setDamagedLedger] = useState(initialDamagedDabbas);
  const [inventory, setInventory] = useState(initialKitchenInventory);
  const [tasks, setTasks] = useState(initialKitchenTasks);
  const [checklist, setChecklist] = useState(dispatchChecklist);
  const [urgentInstructions, setUrgentInstructions] = useState([
    {
      id: "URG-1",
      message: "Customer Vikram Varma (CUST-003) is On Leave today. Please skip drop-off for Stop 3 and proceed to Kondapur.",
      time: "08:15 AM"
    }
  ]);

  // Current selected customer
  const currentCustomer = customers.find(c => c.id === activeCustomerId) || customers[0];

  // QR Modal State
  const [qrModal, setQrModal] = useState({
    isOpen: false,
    title: '',
    subtitle: '',
    actionType: 'deliver',
    targetCustomerId: null,
    expectedDabbas: []
  });

  // 1-Click Instant Skip Today / Resume Today
  const handleToggleSkipToday = (customerId) => {
    setCustomers(prev => prev.map(c => {
      if (c.id === customerId) {
        const isCurrentlyPaused = c.todayDeliveryStatus === 'On Leave';
        const todayStr = new Date().toISOString().slice(0, 10);
        
        if (isCurrentlyPaused) {
          // Resume Today
          return {
            ...c,
            todayDeliveryStatus: 'Pending'
          };
        } else {
          // Skip Today (+1 day auto-extension)
          const currentEnd = new Date(c.endDate);
          currentEnd.setDate(currentEnd.getDate() + 1);
          const newEndDateStr = currentEnd.toISOString().slice(0, 10);

          const skipEntry = {
            id: `SKP-${Date.now()}`,
            from: todayStr,
            to: todayStr,
            days: 1,
            reason: 'Daily Skip (Eroju Vadhu)',
            status: 'Approved',
            autoExtendedUntil: newEndDateStr
          };

          return {
            ...c,
            endDate: newEndDateStr,
            remainingDays: (c.remainingDays || 0) + 1,
            todayDeliveryStatus: 'On Leave',
            leaveHistory: [skipEntry, ...(c.leaveHistory || [])]
          };
        }
      }
      return c;
    }));
  };

  // Schedule Custom Date Range Leave with Auto-Extension
  const handleScheduleLeave = (customerId, leaveData) => {
    setCustomers(prev => prev.map(c => {
      if (c.id === customerId) {
        const days = parseInt(leaveData.days, 10) || 1;
        const autoExtend = leaveData.autoExtend !== false;
        
        let newEndDateStr = c.endDate;
        if (autoExtend) {
          const currentEnd = new Date(c.endDate);
          currentEnd.setDate(currentEnd.getDate() + days);
          newEndDateStr = currentEnd.toISOString().slice(0, 10);
        }

        const todayStr = new Date().toISOString().slice(0, 10);
        const isTodayInRange = todayStr >= leaveData.from && todayStr <= leaveData.to;

        const newLeave = {
          id: `LV-${Date.now()}`,
          from: leaveData.from,
          to: leaveData.to,
          days: days,
          reason: leaveData.reason || 'Vacation / Personal Travel',
          status: 'Approved',
          autoExtendedUntil: newEndDateStr
        };

        return {
          ...c,
          endDate: newEndDateStr,
          remainingDays: autoExtend ? (c.remainingDays || 0) + days : c.remainingDays,
          todayDeliveryStatus: isTodayInRange ? 'On Leave' : c.todayDeliveryStatus,
          leaveHistory: [newLeave, ...(c.leaveHistory || [])]
        };
      }
      return c;
    }));
  };

  // Backward compatibility alias
  const handleApplyLeave = handleScheduleLeave;

  // Cancel Subscription & Pro-rata Settlement
  const handleCancelSubscription = (customerId, cancelData = {}) => {
    setCustomers(prev => prev.map(c => {
      if (c.id === customerId) {
        const remainingDays = c.remainingDays || 0;
        const refundAmount = cancelData.refundAmount !== undefined ? cancelData.refundAmount : (remainingDays * 120);
        
        return {
          ...c,
          subscriptionStatus: 'Cancelled',
          todayDeliveryStatus: 'Cancelled',
          cancellationInfo: {
            cancelledAt: new Date().toISOString().slice(0, 10),
            reason: cancelData.reason || 'Customer requested cancellation',
            remainingDays: remainingDays,
            refundAmount: refundAmount,
            refundStatus: (c.dabbasHeld && c.dabbasHeld.length > 0) ? 'Pending Dabba Return' : 'Processed',
            finalDabbaPickupScheduled: (c.dabbasHeld && c.dabbasHeld.length > 0)
          }
        };
      }
      return c;
    }));
  };

  // Reactivate a Cancelled Subscription
  const handleReactivateSubscription = (customerId) => {
    setCustomers(prev => prev.map(c => {
      if (c.id === customerId) {
        return {
          ...c,
          subscriptionStatus: 'Active',
          todayDeliveryStatus: 'Pending',
          cancellationInfo: null
        };
      }
      return c;
    }));
  };

  // Handler: Customer Makes Payment
  const handleMakePayment = (customerId, mode) => {
    setCustomers(prev => prev.map(c => {
      if (c.id === customerId) {
        return {
          ...c,
          paymentStatus: 'Paid',
          paymentMode: mode.toUpperCase(),
          lastPaymentDate: new Date().toISOString().slice(0, 10)
        };
      }
      return c;
    }));
  };

  // URL Hash Listener for direct Driver Copilot access (#/copilot or #copilot)
  useEffect(() => {
    const handleHashSync = () => {
      const hash = window.location.hash.toLowerCase();
      if (hash === '#copilot' || hash === '#/copilot' || hash === '#driver' || hash === '#driver-copilot') {
        setCurrentRole('delivery');
      }
    };
    handleHashSync();
    window.addEventListener('hashchange', handleHashSync);
    return () => window.removeEventListener('hashchange', handleHashSync);
  }, []);

  // Handler: Delivery Boy Updates Delivery Status
  const handleUpdateDeliveryStatus = (customerId, status) => {
    setCustomers(prev => prev.map(c => {
      if (c.id === customerId) {
        return { ...c, todayDeliveryStatus: status };
      }
      return c;
    }));
  };

  // Open QR Scanner for Delivery Boy
  const handleOpenScanner = (actionType, customerId) => {
    const cust = customers.find(c => c.id === customerId);
    if (actionType === 'godown_intake') {
      const boy = deliveryBoys.find(b => b.id === 'DBOY-01');
      setQrModal({
        isOpen: true,
        title: "Godown Intake & Sanitization Scan",
        subtitle: "Scan returned box QR barcode to verify arrival at Kitchen Godown",
        actionType: 'godown_intake',
        targetCustomerId: null,
        expectedDabbas: boy?.collectedReturnDabbas?.length > 0 ? boy.collectedReturnDabbas : ['DB-098', 'DB-104', 'DB-112']
      });
    } else if (actionType === 'deliver') {
      setQrModal({
        isOpen: true,
        title: `Deliver Meal Box to ${cust?.name}`,
        subtitle: `Scan the fresh sealed dabba QR before handing over`,
        actionType: 'deliver',
        targetCustomerId: customerId,
        expectedDabbas: ['DB-104', 'DB-105', 'DB-106']
      });
    } else {
      setQrModal({
        isOpen: true,
        title: `Collect Empty Dabba from ${cust?.name}`,
        subtitle: `Scan the returned box barcode to clear customer ledger`,
        actionType: 'return',
        targetCustomerId: customerId,
        expectedDabbas: cust?.dabbasHeld.length > 0 ? cust.dabbasHeld : ['DB-104', 'DB-112', 'DB-098']
      });
    }
  };

  // Report Delivery Issue from Driver Copilot
  const handleReportDeliveryIssue = (reportData) => {
    setCustomers(prev => prev.map(c => {
      if (c.id === reportData.customerId) {
        return {
          ...c,
          todayDeliveryStatus: 'Not Available',
          deliveryIssue: reportData
        };
      }
      return c;
    }));

    setUrgentInstructions(prev => [
      {
        id: `URG-${Date.now()}`,
        message: `🚨 Driver Copilot Alert: ${reportData.customerName} marked "${reportData.reasonLabel}" at ${reportData.timestamp}. Notes: ${reportData.notes || 'None'}`,
        time: reportData.timestamp
      },
      ...prev
    ]);
  };

  // Execute QR Scan Result
  const handleScanComplete = (scannedCode, actionType = 'deliver', targetCustId = null) => {
    const custId = targetCustId || qrModal.targetCustomerId;
    const cust = customers.find(c => c.id === custId);

    if (actionType === 'deliver') {
      const now = new Date();
      const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
      const currentDayName = days[now.getDay()];
      // Next day pickup rule: Saturday delivery ➔ Monday pickup (Sunday is kitchen leave)
      const nextDayIdx = now.getDay() === 6 ? 1 : (now.getDay() === 0 ? 1 : now.getDay() + 1);
      const nextPickupDay = days[nextDayIdx];

      setCustomers(prev => prev.map(c => {
        if (c.id === custId) {
          return {
            ...c,
            todayDeliveryStatus: 'Delivered',
            dabbasHeld: [...new Set([...c.dabbasHeld, scannedCode])],
            lastDelivery: {
              dabbaId: scannedCode,
              deliveredDay: currentDayName,
              deliveredDate: now.toISOString().slice(0, 10)
            },
            autoPickupDue: {
              isDue: true,
              dabbaId: scannedCode,
              pickupDay: nextPickupDay,
              deliveredDay: currentDayName,
              note: `${currentDayName} Delivery ➔ ${nextPickupDay} Auto-Pickup`
            }
          };
        }
        return c;
      }));

      setDabbas(prev => prev.map(d => {
        if (d.code === scannedCode) {
          return {
            ...d,
            status: 'with_customer',
            holder: `${cust?.name} (${custId})`,
            lastUpdate: `${new Date().toISOString().slice(0, 10)} ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`
          };
        }
        return d;
      }));
    } else if (actionType === 'return') {
      setCustomers(prev => prev.map(c => {
        if (c.id === custId) {
          const updatedHeld = c.dabbasHeld.filter(x => x !== scannedCode);
          let updatedAutoPickup = c.autoPickupDue;
          if (c.autoPickupDue && c.autoPickupDue.dabbaId === scannedCode) {
            updatedAutoPickup = null;
          }
          let updatedCancellationInfo = c.cancellationInfo;
          if (c.subscriptionStatus === 'Cancelled' && c.cancellationInfo) {
            if (updatedHeld.length === 0) {
              updatedCancellationInfo = {
                ...c.cancellationInfo,
                refundStatus: 'Processed / Refund Disbursed',
                finalDabbaPickupScheduled: false
              };
            }
          }
          return {
            ...c,
            dabbasHeld: updatedHeld,
            autoPickupDue: updatedAutoPickup,
            dabbasReturnedTotal: c.dabbasReturnedTotal + 1,
            handedOverToday: [...new Set([...c.handedOverToday, scannedCode])],
            cancellationInfo: updatedCancellationInfo
          };
        }
        return c;
      }));

      setDeliveryBoys(prev => prev.map(b => {
        if (b.id === 'DBOY-01') {
          return {
            ...b,
            collectedReturnDabbas: [...new Set([...b.collectedReturnDabbas, scannedCode])]
          };
        }
        return b;
      }));

      setDabbas(prev => prev.map(d => {
        if (d.code === scannedCode) {
          return {
            ...d,
            status: 'with_delivery',
            holder: `Raju Kumar (Delivery Boy) - Collected Return`,
            lastUpdate: `${new Date().toISOString().slice(0, 10)} ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`
          };
        }
        return d;
      }));
    } else if (actionType === 'godown_intake') {
      setDeliveryBoys(prev => prev.map(b => ({
        ...b,
        collectedReturnDabbas: b.collectedReturnDabbas.filter(code => code !== scannedCode)
      })));

      setDabbas(prev => prev.map(d => {
        if (d.code === scannedCode) {
          return {
            ...d,
            status: 'in_godown',
            holder: 'Godown Sanitized Rack',
            lastUpdate: `${new Date().toISOString().slice(0, 10)} ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`
          };
        }
        return d;
      }));
    }
  };

  // Handover collected boxes back to Godown
  const handleHandoverToGodown = (deliveryBoyId) => {
    const boy = deliveryBoys.find(b => b.id === deliveryBoyId);
    if (!boy) return;
    const returnedCodes = boy.collectedReturnDabbas;

    setDeliveryBoys(prev => prev.map(b => {
      if (b.id === deliveryBoyId) {
        return { ...b, collectedReturnDabbas: [] };
      }
      return b;
    }));

    setDabbas(prev => prev.map(d => {
      if (returnedCodes.includes(d.code)) {
        return {
          ...d,
          status: 'in_godown',
          holder: 'Godown Sanitized Rack',
          lastUpdate: `${new Date().toISOString().slice(0, 10)} ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`
        };
      }
      return d;
    }));
  };

  // Shift Check-in / Check-out
  const handleCheckInOut = (deliveryBoyId) => {
    setDeliveryBoys(prev => prev.map(b => {
      if (b.id === deliveryBoyId) {
        const isCurrentlyIn = b.status === 'Checked In';
        return {
          ...b,
          status: isCurrentlyIn ? 'Checked Out' : 'Checked In',
          checkedOutTime: isCurrentlyIn ? new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : null,
          checkedInTime: !isCurrentlyIn ? new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : b.checkedInTime
        };
      }
      return b;
    }));
  };

  // Kitchen inventory restock
  const handleAddStock = (item) => {
    setInventory(prev => {
      const existing = prev.find(i => i.name.toLowerCase() === item.name.toLowerCase());
      if (existing) {
        const currentQty = parseFloat(existing.inStock) || 0;
        const addQty = parseFloat(item.qty) || 0;
        return prev.map(i => i.id === existing.id ? { ...i, inStock: `${(currentQty + addQty).toFixed(1)} ${existing.unit}`, status: 'Adequate' } : i);
      } else {
        return [...prev, {
          id: `ING-${Date.now()}`,
          name: item.name,
          requiredToday: '—',
          inStock: `${item.qty} ${item.unit}`,
          unit: item.unit,
          status: 'Adequate'
        }];
      }
    });
  };

  // Checklist toggle
  const handleToggleChecklistItem = (itemId) => {
    setChecklist(prev => prev.map(c => c.id === itemId ? { ...c, checked: !c.checked } : c));
  };

  // ADMIN OPERATIONS HANDLERS:

  // 1. Customer CRUD & Assignment
  const handleAddCustomer = (customerData) => {
    setCustomers(prev => [customerData, ...prev]);
  };

  const handleDeleteCustomer = (customerId) => {
    setCustomers(prev => prev.filter(c => c.id !== customerId));
  };

  const handleAssignCustomerToRoute = (customerId, routeId) => {
    setCustomers(prev => prev.map(c => c.id === customerId ? { ...c, routeId } : c));
  };

  const handleUpdateCustomerMeal = (customerId, updatedData) => {
    setCustomers(prev => prev.map(c => {
      if (c.id === customerId) {
        const sub = updatedData.subscriptionType !== undefined ? updatedData.subscriptionType : c.subscriptionType;
        let deliveryDays = c.deliveryDays;
        if (sub.includes('Mon, Wed, Fri')) {
          deliveryDays = ['Monday', 'Wednesday', 'Friday'];
        } else if (sub.includes('Tue, Thu, Sat')) {
          deliveryDays = ['Tuesday', 'Thursday', 'Saturday'];
        } else if (updatedData.chosenDeliveryDay) {
          deliveryDays = [updatedData.chosenDeliveryDay];
        }

        return {
          ...c,
          subscriptionType: sub,
          chosenDeliveryDay: updatedData.chosenDeliveryDay !== undefined ? updatedData.chosenDeliveryDay : c.chosenDeliveryDay,
          deliveryDays,
          kitchenNotes: updatedData.kitchenNotes !== undefined ? updatedData.kitchenNotes : c.kitchenNotes,
          deliveryNotes: updatedData.deliveryNotes !== undefined ? updatedData.deliveryNotes : c.deliveryNotes,
          specialInstructions: updatedData.kitchenNotes !== undefined ? updatedData.kitchenNotes : c.specialInstructions
        };
      }
      return c;
    }));
  };

  // Allot Specific Dishes to a Customer
  const handleAllotDishes = (customerId, dishIds) => {
    setCustomers(prev => prev.map(c => {
      if (c.id === customerId) {
        return {
          ...c,
          allottedDishIds: dishIds
        };
      }
      return c;
    }));
  };

  // 2. Staff Management (Delivery & Kitchen)
  const handleAddDeliveryBoy = (driverData) => {
    setDeliveryBoys(prev => [...prev, driverData]);
  };

  const handleUpdateDeliveryBoy = (driverId, updatedFields) => {
    setDeliveryBoys(prev => prev.map(b => {
      if (b.id === driverId) {
        const updated = { ...b, ...updatedFields };
        if (updatedFields.assignedRouteId) {
          const matchingRoute = routes.find(r => r.id === updatedFields.assignedRouteId);
          if (matchingRoute) {
            updated.routeZone = `${matchingRoute.name} (${matchingRoute.zone})`;
          }
        }
        return updated;
      }
      return b;
    }));

    if (updatedFields.assignedRouteId) {
      setRoutes(prev => prev.map(r => {
        if (r.id === updatedFields.assignedRouteId) {
          return { ...r, assignedDriverId: driverId };
        }
        if (r.assignedDriverId === driverId) {
          return { ...r, assignedDriverId: null };
        }
        return r;
      }));
    }
  };

  const handleDeleteDeliveryBoy = (driverId) => {
    setDeliveryBoys(prev => prev.filter(b => b.id !== driverId));
  };

  const handleAddKitchenStaff = (staffData) => {
    setKitchenStaff(prev => [...prev, staffData]);
  };

  const handleUpdateKitchenStaff = (staffId, updatedFields) => {
    setKitchenStaff(prev => prev.map(s => s.id === staffId ? { ...s, ...updatedFields } : s));
  };

  const handleDeleteKitchenStaff = (staffId) => {
    setKitchenStaff(prev => prev.filter(s => s.id !== staffId));
  };

  // 3. Routes Management
  const handleCreateRoute = (routeData) => {
    setRoutes(prev => [...prev, routeData]);
  };

  const handleDeleteRoute = (routeId) => {
    setRoutes(prev => prev.filter(r => r.id !== routeId));
  };

  const handleAssignDriverToRoute = (routeId, driverId) => {
    setRoutes(prev => prev.map(r => r.id === routeId ? { ...r, assignedDriverId: driverId || null } : r));
    setDeliveryBoys(prev => prev.map(b => b.id === driverId ? { ...b, assignedRouteId: routeId } : b));
  };

  // 4. Menu Management
  const handleAddMenuItem = (menuType, itemData) => {
    setDailyMenu(prev => ({
      ...prev,
      [menuType]: [...prev[menuType], itemData]
    }));
  };

  const handleDeleteMenuItem = (menuType, itemId) => {
    setDailyMenu(prev => ({
      ...prev,
      [menuType]: prev[menuType].filter(i => i.id !== itemId)
    }));
  };

  // 5. Broadcast
  const handleBroadcastUrgent = (msg) => {
    setUrgentInstructions(prev => [{
      id: `URG-${Date.now()}`,
      message: msg,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }, ...prev]);
  };

  // Auth Handlers
  const handleLogin = (userData) => {
    setCurrentUser(userData);
    setIsAuthenticated(true);
    if (userData.role) {
      setCurrentRole(userData.role);
    }
    if (userData.customerId) {
      setActiveCustomerId(userData.customerId);
    }
  };

  const handleLogout = () => {
    try {
      localStorage.removeItem('healthi_dabba_user');
    } catch (e) {
      console.error(e);
    }
    setCurrentUser(null);
    setIsAuthenticated(false);
  };

  // Dabba Fleet OS Handlers
  const handleAddDabba = (dabbaData) => {
    setDabbas(prev => [dabbaData, ...prev]);
  };

  const handleBulkAddDabbas = (count, prefix = 'DB-') => {
    setDabbas(prev => {
      const existingCodes = new Set([
        ...prev.map(d => d.code),
        ...damagedLedger.map(d => d.retiredCode)
      ]);

      let maxNum = 100;
      existingCodes.forEach(c => {
        const num = parseInt(c.replace(/\D/g, '') || '0', 10);
        if (num > maxNum) maxNum = num;
      });

      const newItems = [];
      let curr = maxNum + 1;
      while (newItems.length < count) {
        const candidate = `${prefix}${curr}`;
        if (!existingCodes.has(candidate)) {
          newItems.push({
            code: candidate,
            status: 'in_godown',
            holder: 'Godown Sanitized Rack',
            lastUpdate: new Date().toISOString().slice(0, 16).replace('T', ' ')
          });
          existingCodes.add(candidate);
        }
        curr++;
      }
      return [...newItems, ...prev];
    });
  };

  const handleDecommissionDabba = ({ code, reasonCategory, notes, reportedBy, autoReplace }) => {
    const target = dabbas.find(d => d.code === code);
    if (!target) return;

    let replacementCode = null;
    if (autoReplace) {
      const allExisting = new Set([
        ...dabbas.map(d => d.code),
        ...damagedLedger.map(d => d.retiredCode)
      ]);
      let maxNum = 100;
      allExisting.forEach(c => {
        const num = parseInt(c.replace(/\D/g, '') || '0', 10);
        if (num > maxNum) maxNum = num;
      });
      let next = maxNum + 1;
      while (allExisting.has(`DB-${next}`)) {
        next++;
      }
      replacementCode = `DB-${next}`;
    }

    // 1. Remove damaged dabba from active circulation & insert replacement if requested
    setDabbas(prev => {
      const filtered = prev.filter(d => d.code !== code);
      if (replacementCode) {
        const newReplacementBox = {
          code: replacementCode,
          status: target.status,
          holder: target.holder,
          lastUpdate: new Date().toISOString().slice(0, 16).replace('T', ' ')
        };
        return [newReplacementBox, ...filtered];
      }
      return filtered;
    });

    // 2. If it was held by a customer, update customer's dabbasHeld
    setCustomers(prev => prev.map(c => {
      if (c.dabbasHeld && c.dabbasHeld.includes(code)) {
        const updatedHeld = c.dabbasHeld.filter(x => x !== code);
        if (replacementCode) updatedHeld.push(replacementCode);
        return { ...c, dabbasHeld: updatedHeld };
      }
      return c;
    }));

    // 3. Add to damaged/blacklisted ledger permanently
    const logEntry = {
      id: `SCRAP-${Date.now()}`,
      retiredCode: code,
      decommissionDate: new Date().toISOString().slice(0, 10),
      decommissionTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      reasonCategory,
      notes,
      reportedBy,
      previousHolder: target.holder,
      previousStatus: target.status,
      replacementCode: replacementCode || 'None (Fleet Downsized)',
      qrStatus: 'Permanently Blacklisted'
    };

    setDamagedLedger(prev => [logEntry, ...prev]);
  };

  const handleDeleteDabba = (code) => {
    setDabbas(prev => prev.filter(d => d.code !== code));
  };

  if (!isAuthenticated) {
    return <LoginPage onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-cream-100 flex flex-col text-charcoal font-apple antialiased">
      
      {/* Top Navbar (Hidden when Driver Copilot is full-screen) */}
      {currentRole !== 'delivery' && (
        <Navbar
          currentRole={currentRole}
          setCurrentRole={setCurrentRole}
          currentUser={currentUser}
          onLogout={handleLogout}
        />
      )}

      {/* Main Responsive Canvas */}
      <main className={`flex-1 flex justify-center w-full ${currentRole === 'delivery' ? 'p-0 pb-0' : 'p-2 sm:p-6 lg:p-8 pb-24 md:pb-8'}`}>
        <div className={`w-full ${currentRole === 'delivery' ? 'max-w-none' : 'max-w-[1520px]'} animate-fade-in`}>
          {currentRole === 'customer' && (
            <CustomerPortal
              customer={currentCustomer}
              customers={customers}
              dailyMenu={dailyMenu}
              onSelectCustomer={setActiveCustomerId}
              onApplyLeave={handleApplyLeave}
              onScheduleLeave={handleScheduleLeave}
              onToggleSkipToday={handleToggleSkipToday}
              onCancelSubscription={handleCancelSubscription}
              onReactivateSubscription={handleReactivateSubscription}
              onMakePayment={handleMakePayment}
              onUpdateCustomerMeal={handleUpdateCustomerMeal}
              onAllotDishes={handleAllotDishes}
              onReportIssue={() => {}}
            />
          )}
          {currentRole === 'delivery' && (
            <DriverCopilotApp
              deliveryBoys={deliveryBoys}
              customers={customers}
              dabbas={dabbas}
              onUpdateDeliveryStatus={handleUpdateDeliveryStatus}
              onScanDabba={handleScanComplete}
              onReportIssue={handleReportDeliveryIssue}
              onExitToAdmin={() => setCurrentRole('admin')}
            />
          )}
          {currentRole === 'kitchen' && (
            <KitchenPortal
              customers={customers}
              inventory={inventory}
              tasks={tasks}
              checklist={checklist}
              deliveryBoys={deliveryBoys}
              dabbas={dabbas}
              damagedLedger={damagedLedger}
              onAddStock={handleAddStock}
              onToggleChecklistItem={handleToggleChecklistItem}
              dailyMenu={dailyMenu}
              onAssignDabbaQR={() => {}}
              onUpdateDabbaStatus={(code, newStatus, newHolder) => {
                setDabbas(prev => prev.map(d => d.code === code ? { 
                  ...d, 
                  status: newStatus, 
                  holder: newHolder || (newStatus === 'in_godown' ? 'Godown Sanitized Rack' : d.holder), 
                  lastUpdate: new Date().toISOString().slice(0, 16).replace('T', ' ') 
                } : d));
              }}
            />
          )}
          {currentRole === 'admin' && (
            <AdminPortal
              customers={customers}
              deliveryBoys={deliveryBoys}
              kitchenStaff={kitchenStaff}
              routes={routes}
              dabbas={dabbas}
              damagedLedger={damagedLedger}
              dailyMenu={dailyMenu}
              onSelectCustomer={(customerId) => {
                setActiveCustomerId(customerId);
                setCurrentRole('customer');
              }}
              onAddCustomer={handleAddCustomer}
              onDeleteCustomer={handleDeleteCustomer}
              onAddDeliveryBoy={handleAddDeliveryBoy}
              onUpdateDeliveryBoy={handleUpdateDeliveryBoy}
              onDeleteDeliveryBoy={handleDeleteDeliveryBoy}
              onAddKitchenStaff={handleAddKitchenStaff}
              onUpdateKitchenStaff={handleUpdateKitchenStaff}
              onDeleteKitchenStaff={handleDeleteKitchenStaff}
              onCreateRoute={handleCreateRoute}
              onDeleteRoute={handleDeleteRoute}
              onAssignDriverToRoute={handleAssignDriverToRoute}
              onAssignCustomerToRoute={handleAssignCustomerToRoute}
              onUpdateCustomerMeal={handleUpdateCustomerMeal}
              onAllotDishes={handleAllotDishes}
              onToggleSkipToday={handleToggleSkipToday}
              onScheduleLeave={handleScheduleLeave}
              onCancelSubscription={handleCancelSubscription}
              onReactivateSubscription={handleReactivateSubscription}
              onAddMenuItem={handleAddMenuItem}
              onDeleteMenuItem={handleDeleteMenuItem}
              onBroadcastUrgentInstruction={handleBroadcastUrgent}
              onAddDabba={handleAddDabba}
              onBulkAddDabbas={handleBulkAddDabbas}
              onDecommissionDabba={handleDecommissionDabba}
              onDeleteDabba={handleDeleteDabba}
            />
          )}
        </div>
      </main>

      {/* QR Scanner & Laser Modal */}
      <QRModal
        isOpen={qrModal.isOpen}
        onClose={() => setQrModal(prev => ({ ...prev, isOpen: false }))}
        title={qrModal.title}
        subtitle={qrModal.subtitle}
        actionType={qrModal.actionType}
        expectedDabbas={qrModal.expectedDabbas}
        onScanComplete={handleScanComplete}
      />

      {/* Subtle Apple-style Minimal Footer */}
      {currentRole !== 'delivery' && (
        <footer className="border-t border-edge bg-white/70 backdrop-blur-md py-4 px-6 text-center text-xs text-charcoal-muted">
          <div className="max-w-[1520px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
            <span>&copy; 2026 Healthi Dabba Logistics & Nutrition. All rights reserved.</span>
            <span className="text-[11px] text-charcoal-subtle">
              Apple SF Pro Typography • No Neon Palette • Circular Zero-Loss Dabba Lifecycle
            </span>
          </div>
        </footer>
      )}
    </div>
  );
}
