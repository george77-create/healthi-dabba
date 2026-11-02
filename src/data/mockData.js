// Central Data Store for Healthi Dabba System
// Configured with Exactly 50 Live Testing Customers & 50 Matched Dabbas across Tirupati

export const SUBSCRIPTION_PLANS = [
  {
    id: "PLAN-UNSUN-ALT",
    name: "UNSUN — Alternate Days (Mon, Wed, Fri)",
    shortName: "UNSUN (Mon/Wed/Fri)",
    cadence: "Alternate Days (Except Sunday)",
    deliveryDays: ["Monday", "Wednesday", "Friday"],
    pickupRule: "Delivered Mon ➔ Tue Pickup, Wed ➔ Thu Pickup, Fri ➔ Sat Pickup",
    sundayPolicy: "Sunday Kitchen Leave (No Delivery / No Pickup)",
    category: "Balanced Nutrition"
  },
  {
    id: "PLAN-ALT2-ALT",
    name: "Alternative-2 — Alternate Days (Tue, Thu, Sat)",
    shortName: "Alternative-2 (Tue/Thu/Sat)",
    cadence: "Alternate Days (Except Sunday)",
    deliveryDays: ["Tuesday", "Thursday", "Saturday"],
    pickupRule: "Delivered Tue ➔ Wed Pickup, Thu ➔ Fri Pickup, Sat ➔ Mon Pickup (Sunday Leave)",
    sundayPolicy: "Sunday Kitchen Leave (No Delivery / No Pickup)",
    category: "Keto & Sprout Energy"
  },
  {
    id: "PLAN-ONE-DAY",
    name: "One Day Meal (Custom Specific Day)",
    shortName: "One Day Meal",
    cadence: "Specific Chosen Day (Mon - Sat)",
    deliveryDays: ["Customer Specific Day"],
    pickupRule: "Delivered on Selected Day ➔ Next Day Automatic Dabba Pickup",
    sundayPolicy: "Sunday Kitchen Leave (No Delivery / No Pickup)",
    category: "Single Day Meal"
  }
];

export const initialCustomers = [
  {
    "id": "CUST-001",
    "name": "Srikanth Reddy",
    "phone": "+91 98480 10000",
    "address": "Flat 101, Balaji Heights, KT Road, Tirupati, Andhra Pradesh - 517501",
    "coordinates": {
      "lat": 13.6395,
      "lng": 79.4215
    },
    "mapLink": "https://maps.google.com/?q=13.6395,79.4215",
    "routeId": "ROUTE-A",
    "subscriptionType": "UNSUN — Alternate Days (Mon, Wed, Fri)",
    "deliveryCadence": "Alternate Days (Except Sunday)",
    "deliveryDays": [
      "Monday",
      "Wednesday",
      "Friday"
    ],
    "lastDelivery": {
      "dabbaId": "DB-101",
      "deliveredDay": "Monday",
      "deliveredDate": "2026-11-02"
    },
    "autoPickupDue": {
      "isDue": true,
      "dabbaId": "DB-101",
      "pickupDay": "Tuesday",
      "deliveredDay": "Monday",
      "note": "Monday Delivery ➔ Tuesday Auto-Pickup"
    },
    "startDate": "2026-10-15",
    "endDate": "2026-11-15",
    "remainingDays": 14,
    "paymentStatus": "Pending",
    "paymentMode": "UPI (Google Pay)",
    "lastPaymentDate": "2026-10-15",
    "todayDeliveryStatus": "Delivered",
    "kitchenNotes": "No onion & garlic, extra cucumber",
    "deliveryNotes": "Leave at security cabin if apartment door locked",
    "specialInstructions": "No onion & garlic, extra cucumber",
    "leaveHistory": [
      {
        "id": "LV-100",
        "from": "2026-11-05",
        "to": "2026-11-06",
        "days": 2,
        "status": "Approved",
        "autoExtendedUntil": "2026-11-17"
      }
    ],
    "allottedDishIds": [
      "MNU-1",
      "MNU-2",
      "MNU-3",
      "MNU-4"
    ],
    "dabbasHeld": [
      "DB-101"
    ],
    "dabbasReturnedTotal": 12,
    "handedOverToday": [
      "DB-91"
    ],
    "unreadNotifications": 1
  },
  {
    "id": "CUST-002",
    "name": "Ananya Rayapati",
    "phone": "+91 98480 10073",
    "address": "Flat 202, Alipiri Enclave, Near Foot Steps, Alipiri Road, Tirupati, Andhra Pradesh - 517502",
    "coordinates": {
      "lat": 13.642,
      "lng": 79.408
    },
    "mapLink": "https://maps.google.com/?q=13.642,79.408",
    "routeId": "ROUTE-A",
    "subscriptionType": "UNSUN — Alternate Days (Mon, Wed, Fri)",
    "deliveryCadence": "Alternate Days (Except Sunday)",
    "deliveryDays": [
      "Monday",
      "Wednesday",
      "Friday"
    ],
    "lastDelivery": null,
    "autoPickupDue": null,
    "startDate": "2026-10-15",
    "endDate": "2026-11-15",
    "remainingDays": 15,
    "paymentStatus": "Paid",
    "paymentMode": "UPI (PhonePe)",
    "lastPaymentDate": "2026-10-15",
    "todayDeliveryStatus": "Pending",
    "kitchenNotes": "Low spice, extra sprouts for double protein",
    "deliveryNotes": "Ring doorbell twice, deliver before 12:30 PM",
    "specialInstructions": "Low spice, extra sprouts for double protein",
    "leaveHistory": [],
    "allottedDishIds": [
      "MNU-5",
      "MNU-6",
      "MNU-7"
    ],
    "dabbasHeld": [],
    "dabbasReturnedTotal": 13,
    "handedOverToday": [],
    "unreadNotifications": 0
  },
  {
    "id": "CUST-003",
    "name": "Vikram Varma",
    "phone": "+91 98480 10146",
    "address": "Flat 303, Balaji Colony Phase 1, Tirupati, Andhra Pradesh - 517503",
    "coordinates": {
      "lat": 13.641,
      "lng": 79.414
    },
    "mapLink": "https://maps.google.com/?q=13.641,79.414",
    "routeId": "ROUTE-A",
    "subscriptionType": "UNSUN — Alternate Days (Mon, Wed, Fri)",
    "deliveryCadence": "Alternate Days (Except Sunday)",
    "deliveryDays": [
      "Monday",
      "Wednesday",
      "Friday"
    ],
    "lastDelivery": null,
    "autoPickupDue": null,
    "startDate": "2026-10-15",
    "endDate": "2026-11-15",
    "remainingDays": 16,
    "paymentStatus": "Paid",
    "paymentMode": "Net Banking",
    "lastPaymentDate": "2026-10-15",
    "todayDeliveryStatus": "Pending",
    "kitchenNotes": "Severe peanut allergy. Keep sprouts separate in container.",
    "deliveryNotes": "Call on mobile upon reaching building gate",
    "specialInstructions": "Severe peanut allergy. Keep sprouts separate in container.",
    "leaveHistory": [],
    "allottedDishIds": [
      "MNU-1",
      "MNU-2",
      "MNU-3",
      "MNU-4"
    ],
    "dabbasHeld": [],
    "dabbasReturnedTotal": 14,
    "handedOverToday": [],
    "unreadNotifications": 0
  },
  {
    "id": "CUST-004",
    "name": "Harika Chowdary",
    "phone": "+91 98480 10219",
    "address": "Flat 404, Near Kapila Theertham Temple, KT Road, Tirupati, Andhra Pradesh - 517504",
    "coordinates": {
      "lat": 13.644,
      "lng": 79.423
    },
    "mapLink": "https://maps.google.com/?q=13.644,79.423",
    "routeId": "ROUTE-A",
    "subscriptionType": "UNSUN — Alternate Days (Mon, Wed, Fri)",
    "deliveryCadence": "Alternate Days (Except Sunday)",
    "deliveryDays": [
      "Monday",
      "Wednesday",
      "Friday"
    ],
    "lastDelivery": null,
    "autoPickupDue": null,
    "startDate": "2026-10-15",
    "endDate": "2026-11-15",
    "remainingDays": 17,
    "paymentStatus": "Paid",
    "paymentMode": "UPI (Google Pay)",
    "lastPaymentDate": "2026-10-15",
    "todayDeliveryStatus": "Pending",
    "kitchenNotes": "Diabetic-friendly (low glycemic index), less salt",
    "deliveryNotes": "Keep inside wooden delivery box near main door",
    "specialInstructions": "Diabetic-friendly (low glycemic index), less salt",
    "leaveHistory": [],
    "allottedDishIds": [
      "MNU-5",
      "MNU-6",
      "MNU-7"
    ],
    "dabbasHeld": [],
    "dabbasReturnedTotal": 15,
    "handedOverToday": [],
    "unreadNotifications": 0
  },
  {
    "id": "CUST-005",
    "name": "Sai Krishna Naidu",
    "phone": "+91 98480 10292",
    "address": "Flat 501, Sri Balaji Residency, ISKCON Temple Road, Tirupati, Andhra Pradesh - 517505",
    "coordinates": {
      "lat": 13.6475,
      "lng": 79.4115
    },
    "mapLink": "https://maps.google.com/?q=13.6475,79.4115",
    "routeId": "ROUTE-A",
    "subscriptionType": "UNSUN — Alternate Days (Mon, Wed, Fri)",
    "deliveryCadence": "Alternate Days (Except Sunday)",
    "deliveryDays": [
      "Monday",
      "Wednesday",
      "Friday"
    ],
    "lastDelivery": {
      "dabbaId": "DB-105",
      "deliveredDay": "Monday",
      "deliveredDate": "2026-11-02"
    },
    "autoPickupDue": {
      "isDue": true,
      "dabbaId": "DB-105",
      "pickupDay": "Tuesday",
      "deliveredDay": "Monday",
      "note": "Monday Delivery ➔ Tuesday Auto-Pickup"
    },
    "startDate": "2026-10-15",
    "endDate": "2026-11-15",
    "remainingDays": 18,
    "paymentStatus": "Paid",
    "paymentMode": "UPI (PhonePe)",
    "lastPaymentDate": "2026-10-15",
    "todayDeliveryStatus": "Delivered",
    "kitchenNotes": "No dairy (no curd or paneer), extra fruit portion",
    "deliveryNotes": "Ground floor flat, hand over directly to resident",
    "specialInstructions": "No dairy (no curd or paneer), extra fruit portion",
    "leaveHistory": [],
    "allottedDishIds": [
      "MNU-1",
      "MNU-2",
      "MNU-3",
      "MNU-4"
    ],
    "dabbasHeld": [
      "DB-105"
    ],
    "dabbasReturnedTotal": 16,
    "handedOverToday": [],
    "unreadNotifications": 0
  },
  {
    "id": "CUST-006",
    "name": "Lakshmi Prasanna",
    "phone": "+91 98480 10365",
    "address": "Flat 102, Old Balaji Colony, Behind Bliss Hotel, Tirupati, Andhra Pradesh - 517506",
    "coordinates": {
      "lat": 13.638,
      "lng": 79.413
    },
    "mapLink": "https://maps.google.com/?q=13.638,79.413",
    "routeId": "ROUTE-A",
    "subscriptionType": "UNSUN — Alternate Days (Mon, Wed, Fri)",
    "deliveryCadence": "Alternate Days (Except Sunday)",
    "deliveryDays": [
      "Monday",
      "Wednesday",
      "Friday"
    ],
    "lastDelivery": null,
    "autoPickupDue": {
      "isDue": true,
      "dabbaId": "DB-106",
      "pickupDay": "Tuesday",
      "deliveredDay": "Monday",
      "note": "Monday Delivery ➔ Tuesday Auto-Pickup"
    },
    "startDate": "2026-10-15",
    "endDate": "2026-11-15",
    "remainingDays": 19,
    "paymentStatus": "Paid",
    "paymentMode": "Net Banking",
    "lastPaymentDate": "2026-10-15",
    "todayDeliveryStatus": "Pending",
    "kitchenNotes": "Gluten-free, light lemon dressing",
    "deliveryNotes": "Call on intercom at Tower reception before entering",
    "specialInstructions": "Gluten-free, light lemon dressing",
    "leaveHistory": [],
    "allottedDishIds": [
      "MNU-5",
      "MNU-6",
      "MNU-7"
    ],
    "dabbasHeld": [
      "DB-106"
    ],
    "dabbasReturnedTotal": 17,
    "handedOverToday": [],
    "unreadNotifications": 1
  },
  {
    "id": "CUST-007",
    "name": "Venkata Ramana",
    "phone": "+91 98480 10438",
    "address": "Flat 203, SV Pearl Apartments, Nandi Circle, Alipiri Bypass, Tirupati, Andhra Pradesh - 517507",
    "coordinates": {
      "lat": 13.645,
      "lng": 79.406
    },
    "mapLink": "https://maps.google.com/?q=13.645,79.406",
    "routeId": "ROUTE-A",
    "subscriptionType": "UNSUN — Alternate Days (Mon, Wed, Fri)",
    "deliveryCadence": "Alternate Days (Except Sunday)",
    "deliveryDays": [
      "Monday",
      "Wednesday",
      "Friday"
    ],
    "lastDelivery": null,
    "autoPickupDue": null,
    "startDate": "2026-10-15",
    "endDate": "2026-11-15",
    "remainingDays": 20,
    "paymentStatus": "Paid",
    "paymentMode": "UPI (Google Pay)",
    "lastPaymentDate": "2026-10-15",
    "todayDeliveryStatus": "Pending",
    "kitchenNotes": "Pack salad dressing separately, no raw tomato",
    "deliveryNotes": "Leave at security cabin if apartment door locked",
    "specialInstructions": "Pack salad dressing separately, no raw tomato",
    "leaveHistory": [],
    "allottedDishIds": [
      "MNU-1",
      "MNU-2",
      "MNU-3",
      "MNU-4"
    ],
    "dabbasHeld": [],
    "dabbasReturnedTotal": 18,
    "handedOverToday": [
      "DB-97"
    ],
    "unreadNotifications": 0
  },
  {
    "id": "CUST-008",
    "name": "Bhavani Shankar",
    "phone": "+91 98480 10511",
    "address": "Flat 304, Vinayaka Nagar, KT Road Junction, Tirupati, Andhra Pradesh - 517501",
    "coordinates": {
      "lat": 13.637,
      "lng": 79.42
    },
    "mapLink": "https://maps.google.com/?q=13.637,79.42",
    "routeId": "ROUTE-A",
    "subscriptionType": "UNSUN — Alternate Days (Mon, Wed, Fri)",
    "deliveryCadence": "Alternate Days (Except Sunday)",
    "deliveryDays": [
      "Monday",
      "Wednesday",
      "Friday"
    ],
    "lastDelivery": null,
    "autoPickupDue": null,
    "startDate": "2026-10-15",
    "endDate": "2026-11-15",
    "remainingDays": 21,
    "paymentStatus": "Paid",
    "paymentMode": "UPI (PhonePe)",
    "lastPaymentDate": "2026-10-15",
    "todayDeliveryStatus": "On Leave",
    "kitchenNotes": "Low sodium, extra roasted almonds & walnuts",
    "deliveryNotes": "Ring doorbell twice, deliver before 12:30 PM",
    "specialInstructions": "Low sodium, extra roasted almonds & walnuts",
    "leaveHistory": [],
    "allottedDishIds": [
      "MNU-5",
      "MNU-6",
      "MNU-7"
    ],
    "dabbasHeld": [],
    "dabbasReturnedTotal": 19,
    "handedOverToday": [],
    "unreadNotifications": 0
  },
  {
    "id": "CUST-009",
    "name": "Pavani Goud",
    "phone": "+91 98480 10584",
    "address": "Flat 401, Temple View Villas, Hare Krishna Land, ISKCON Road, Tirupati, Andhra Pradesh - 517502",
    "coordinates": {
      "lat": 13.649,
      "lng": 79.413
    },
    "mapLink": "https://maps.google.com/?q=13.649,79.413",
    "routeId": "ROUTE-A",
    "subscriptionType": "UNSUN — Alternate Days (Mon, Wed, Fri)",
    "deliveryCadence": "Alternate Days (Except Sunday)",
    "deliveryDays": [
      "Monday",
      "Wednesday",
      "Friday"
    ],
    "lastDelivery": {
      "dabbaId": "DB-109",
      "deliveredDay": "Monday",
      "deliveredDate": "2026-11-02"
    },
    "autoPickupDue": {
      "isDue": true,
      "dabbaId": "DB-109",
      "pickupDay": "Tuesday",
      "deliveredDay": "Monday",
      "note": "Monday Delivery ➔ Tuesday Auto-Pickup"
    },
    "startDate": "2026-10-15",
    "endDate": "2026-11-15",
    "remainingDays": 22,
    "paymentStatus": "Paid",
    "paymentMode": "Net Banking",
    "lastPaymentDate": "2026-10-15",
    "todayDeliveryStatus": "Delivered",
    "kitchenNotes": "No onion & garlic, extra cucumber",
    "deliveryNotes": "Call on mobile upon reaching building gate",
    "specialInstructions": "No onion & garlic, extra cucumber",
    "leaveHistory": [],
    "allottedDishIds": [
      "MNU-1",
      "MNU-2",
      "MNU-3",
      "MNU-4"
    ],
    "dabbasHeld": [
      "DB-109"
    ],
    "dabbasReturnedTotal": 20,
    "handedOverToday": [],
    "unreadNotifications": 0
  },
  {
    "id": "CUST-010",
    "name": "Rajesh Kothapalli",
    "phone": "+91 98480 10657",
    "address": "Flat 502, Tirumala Darshan Enclave, Alipiri Road, Tirupati, Andhra Pradesh - 517503",
    "coordinates": {
      "lat": 13.643,
      "lng": 79.41
    },
    "mapLink": "https://maps.google.com/?q=13.643,79.41",
    "routeId": "ROUTE-A",
    "subscriptionType": "UNSUN — Alternate Days (Mon, Wed, Fri)",
    "deliveryCadence": "Alternate Days (Except Sunday)",
    "deliveryDays": [
      "Monday",
      "Wednesday",
      "Friday"
    ],
    "lastDelivery": null,
    "autoPickupDue": null,
    "startDate": "2026-10-15",
    "endDate": "2026-11-15",
    "remainingDays": 23,
    "paymentStatus": "Pending",
    "paymentMode": "UPI (Google Pay)",
    "lastPaymentDate": "2026-10-15",
    "todayDeliveryStatus": "Pending",
    "kitchenNotes": "Low spice, extra sprouts for double protein",
    "deliveryNotes": "Keep inside wooden delivery box near main door",
    "specialInstructions": "Low spice, extra sprouts for double protein",
    "leaveHistory": [],
    "allottedDishIds": [
      "MNU-5",
      "MNU-6",
      "MNU-7"
    ],
    "dabbasHeld": [],
    "dabbasReturnedTotal": 21,
    "handedOverToday": [],
    "unreadNotifications": 0
  },
  {
    "id": "CUST-011",
    "name": "Sowmya Penubolu",
    "phone": "+91 98480 10730",
    "address": "Flat 103, Kapila Theertham Arch Road, Tirupati, Andhra Pradesh - 517504",
    "coordinates": {
      "lat": 13.6425,
      "lng": 79.4245
    },
    "mapLink": "https://maps.google.com/?q=13.6425,79.4245",
    "routeId": "ROUTE-A",
    "subscriptionType": "UNSUN — Alternate Days (Mon, Wed, Fri)",
    "deliveryCadence": "Alternate Days (Except Sunday)",
    "deliveryDays": [
      "Monday",
      "Wednesday",
      "Friday"
    ],
    "lastDelivery": null,
    "autoPickupDue": {
      "isDue": true,
      "dabbaId": "DB-111",
      "pickupDay": "Tuesday",
      "deliveredDay": "Monday",
      "note": "Monday Delivery ➔ Tuesday Auto-Pickup"
    },
    "startDate": "2026-10-15",
    "endDate": "2026-11-15",
    "remainingDays": 24,
    "paymentStatus": "Paid",
    "paymentMode": "UPI (PhonePe)",
    "lastPaymentDate": "2026-10-15",
    "todayDeliveryStatus": "Pending",
    "kitchenNotes": "Severe peanut allergy. Keep sprouts separate in container.",
    "deliveryNotes": "Ground floor flat, hand over directly to resident",
    "specialInstructions": "Severe peanut allergy. Keep sprouts separate in container.",
    "leaveHistory": [
      {
        "id": "LV-110",
        "from": "2026-11-05",
        "to": "2026-11-06",
        "days": 2,
        "status": "Approved",
        "autoExtendedUntil": "2026-11-17"
      }
    ],
    "allottedDishIds": [
      "MNU-1",
      "MNU-2",
      "MNU-3",
      "MNU-4"
    ],
    "dabbasHeld": [
      "DB-111"
    ],
    "dabbasReturnedTotal": 22,
    "handedOverToday": [],
    "unreadNotifications": 1
  },
  {
    "id": "CUST-012",
    "name": "Tharun Kumar Raju",
    "phone": "+91 98480 10803",
    "address": "Flat 204, Golden Temple Colony, KT Bypass, Tirupati, Andhra Pradesh - 517505",
    "coordinates": {
      "lat": 13.6405,
      "lng": 79.418
    },
    "mapLink": "https://maps.google.com/?q=13.6405,79.418",
    "routeId": "ROUTE-A",
    "subscriptionType": "UNSUN — Alternate Days (Mon, Wed, Fri)",
    "deliveryCadence": "Alternate Days (Except Sunday)",
    "deliveryDays": [
      "Monday",
      "Wednesday",
      "Friday"
    ],
    "lastDelivery": null,
    "autoPickupDue": null,
    "startDate": "2026-10-15",
    "endDate": "2026-11-15",
    "remainingDays": 25,
    "paymentStatus": "Paid",
    "paymentMode": "Net Banking",
    "lastPaymentDate": "2026-10-15",
    "todayDeliveryStatus": "Pending",
    "kitchenNotes": "Diabetic-friendly (low glycemic index), less salt",
    "deliveryNotes": "Call on intercom at Tower reception before entering",
    "specialInstructions": "Diabetic-friendly (low glycemic index), less salt",
    "leaveHistory": [],
    "allottedDishIds": [
      "MNU-5",
      "MNU-6",
      "MNU-7"
    ],
    "dabbasHeld": [],
    "dabbasReturnedTotal": 23,
    "handedOverToday": [],
    "unreadNotifications": 0
  },
  {
    "id": "CUST-013",
    "name": "Divya Bharathi",
    "phone": "+91 98480 10876",
    "address": "Flat 301, Lotus Towers, Near Devalokam, Alipiri Road, Tirupati, Andhra Pradesh - 517506",
    "coordinates": {
      "lat": 13.6445,
      "lng": 79.4095
    },
    "mapLink": "https://maps.google.com/?q=13.6445,79.4095",
    "routeId": "ROUTE-A",
    "subscriptionType": "UNSUN — Alternate Days (Mon, Wed, Fri)",
    "deliveryCadence": "Alternate Days (Except Sunday)",
    "deliveryDays": [
      "Monday",
      "Wednesday",
      "Friday"
    ],
    "lastDelivery": {
      "dabbaId": "DB-113",
      "deliveredDay": "Monday",
      "deliveredDate": "2026-11-02"
    },
    "autoPickupDue": {
      "isDue": true,
      "dabbaId": "DB-113",
      "pickupDay": "Tuesday",
      "deliveredDay": "Monday",
      "note": "Monday Delivery ➔ Tuesday Auto-Pickup"
    },
    "startDate": "2026-10-15",
    "endDate": "2026-11-15",
    "remainingDays": 26,
    "paymentStatus": "Paid",
    "paymentMode": "UPI (Google Pay)",
    "lastPaymentDate": "2026-10-15",
    "todayDeliveryStatus": "Delivered",
    "kitchenNotes": "No dairy (no curd or paneer), extra fruit portion",
    "deliveryNotes": "Leave at security cabin if apartment door locked",
    "specialInstructions": "No dairy (no curd or paneer), extra fruit portion",
    "leaveHistory": [],
    "allottedDishIds": [
      "MNU-1",
      "MNU-2",
      "MNU-3",
      "MNU-4"
    ],
    "dabbasHeld": [
      "DB-113"
    ],
    "dabbasReturnedTotal": 24,
    "handedOverToday": [
      "DB-103"
    ],
    "unreadNotifications": 0
  },
  {
    "id": "CUST-014",
    "name": "Suresh Babu",
    "phone": "+91 98480 10949",
    "address": "Flat 402, Srinivasa Grand, Bhavani Nagar, Tirupati, Andhra Pradesh - 517507",
    "coordinates": {
      "lat": 13.6265,
      "lng": 79.425
    },
    "mapLink": "https://maps.google.com/?q=13.6265,79.425",
    "routeId": "ROUTE-B",
    "subscriptionType": "UNSUN — Alternate Days (Mon, Wed, Fri)",
    "deliveryCadence": "Alternate Days (Except Sunday)",
    "deliveryDays": [
      "Monday",
      "Wednesday",
      "Friday"
    ],
    "lastDelivery": null,
    "autoPickupDue": null,
    "startDate": "2026-10-15",
    "endDate": "2026-11-15",
    "remainingDays": 27,
    "paymentStatus": "Paid",
    "paymentMode": "UPI (PhonePe)",
    "lastPaymentDate": "2026-10-15",
    "todayDeliveryStatus": "Pending",
    "kitchenNotes": "Gluten-free, light lemon dressing",
    "deliveryNotes": "Ring doorbell twice, deliver before 12:30 PM",
    "specialInstructions": "Gluten-free, light lemon dressing",
    "leaveHistory": [],
    "allottedDishIds": [
      "MNU-5",
      "MNU-6",
      "MNU-7"
    ],
    "dabbasHeld": [],
    "dabbasReturnedTotal": 25,
    "handedOverToday": [],
    "unreadNotifications": 0
  },
  {
    "id": "CUST-015",
    "name": "Madhavi Latha",
    "phone": "+91 98480 11022",
    "address": "Flat 503, Korlagunta Main Road, Tirupati, Andhra Pradesh - 517501",
    "coordinates": {
      "lat": 13.629,
      "lng": 79.432
    },
    "mapLink": "https://maps.google.com/?q=13.629,79.432",
    "routeId": "ROUTE-B",
    "subscriptionType": "UNSUN — Alternate Days (Mon, Wed, Fri)",
    "deliveryCadence": "Alternate Days (Except Sunday)",
    "deliveryDays": [
      "Monday",
      "Wednesday",
      "Friday"
    ],
    "lastDelivery": null,
    "autoPickupDue": null,
    "startDate": "2026-10-15",
    "endDate": "2026-11-15",
    "remainingDays": 28,
    "paymentStatus": "Paid",
    "paymentMode": "Net Banking",
    "lastPaymentDate": "2026-10-15",
    "todayDeliveryStatus": "On Leave",
    "kitchenNotes": "Pack salad dressing separately, no raw tomato",
    "deliveryNotes": "Call on mobile upon reaching building gate",
    "specialInstructions": "Pack salad dressing separately, no raw tomato",
    "leaveHistory": [],
    "allottedDishIds": [
      "MNU-1",
      "MNU-2",
      "MNU-3",
      "MNU-4"
    ],
    "dabbasHeld": [],
    "dabbasReturnedTotal": 26,
    "handedOverToday": [],
    "unreadNotifications": 0
  },
  {
    "id": "CUST-016",
    "name": "Pradeep Varma",
    "phone": "+91 98480 11095",
    "address": "Flat 104, AIR Bypass Road, Near Annamaiah Circle, Tirupati, Andhra Pradesh - 517502",
    "coordinates": {
      "lat": 13.624,
      "lng": 79.422
    },
    "mapLink": "https://maps.google.com/?q=13.624,79.422",
    "routeId": "ROUTE-B",
    "subscriptionType": "UNSUN — Alternate Days (Mon, Wed, Fri)",
    "deliveryCadence": "Alternate Days (Except Sunday)",
    "deliveryDays": [
      "Monday",
      "Wednesday",
      "Friday"
    ],
    "lastDelivery": null,
    "autoPickupDue": {
      "isDue": true,
      "dabbaId": "DB-116",
      "pickupDay": "Tuesday",
      "deliveredDay": "Monday",
      "note": "Monday Delivery ➔ Tuesday Auto-Pickup"
    },
    "startDate": "2026-10-15",
    "endDate": "2026-11-15",
    "remainingDays": 14,
    "paymentStatus": "Paid",
    "paymentMode": "UPI (Google Pay)",
    "lastPaymentDate": "2026-10-15",
    "todayDeliveryStatus": "Pending",
    "kitchenNotes": "Low sodium, extra roasted almonds & walnuts",
    "deliveryNotes": "Keep inside wooden delivery box near main door",
    "specialInstructions": "Low sodium, extra roasted almonds & walnuts",
    "leaveHistory": [],
    "allottedDishIds": [
      "MNU-5",
      "MNU-6",
      "MNU-7"
    ],
    "dabbasHeld": [
      "DB-116"
    ],
    "dabbasReturnedTotal": 27,
    "handedOverToday": [],
    "unreadNotifications": 1
  },
  {
    "id": "CUST-017",
    "name": "Keerthi Vangaveeti",
    "phone": "+91 98480 11168",
    "address": "Flat 201, Saptagiri Enclave, Maruthi Nagar, Korlagunta, Tirupati, Andhra Pradesh - 517503",
    "coordinates": {
      "lat": 13.631,
      "lng": 79.434
    },
    "mapLink": "https://maps.google.com/?q=13.631,79.434",
    "routeId": "ROUTE-B",
    "subscriptionType": "UNSUN — Alternate Days (Mon, Wed, Fri)",
    "deliveryCadence": "Alternate Days (Except Sunday)",
    "deliveryDays": [
      "Monday",
      "Wednesday",
      "Friday"
    ],
    "lastDelivery": {
      "dabbaId": "DB-117",
      "deliveredDay": "Monday",
      "deliveredDate": "2026-11-02"
    },
    "autoPickupDue": {
      "isDue": true,
      "dabbaId": "DB-117",
      "pickupDay": "Tuesday",
      "deliveredDay": "Monday",
      "note": "Monday Delivery ➔ Tuesday Auto-Pickup"
    },
    "startDate": "2026-10-15",
    "endDate": "2026-11-15",
    "remainingDays": 15,
    "paymentStatus": "Paid",
    "paymentMode": "UPI (PhonePe)",
    "lastPaymentDate": "2026-10-15",
    "todayDeliveryStatus": "Delivered",
    "kitchenNotes": "No onion & garlic, extra cucumber",
    "deliveryNotes": "Ground floor flat, hand over directly to resident",
    "specialInstructions": "No onion & garlic, extra cucumber",
    "leaveHistory": [],
    "allottedDishIds": [
      "MNU-1",
      "MNU-2",
      "MNU-3",
      "MNU-4"
    ],
    "dabbasHeld": [
      "DB-117"
    ],
    "dabbasReturnedTotal": 28,
    "handedOverToday": [],
    "unreadNotifications": 0
  },
  {
    "id": "CUST-018",
    "name": "Manoj Prabhakar",
    "phone": "+91 98480 11241",
    "address": "Flat 302, Green Meadows, Behind Shilparamam, AIR Bypass, Tirupati, Andhra Pradesh - 517504",
    "coordinates": {
      "lat": 13.622,
      "lng": 79.426
    },
    "mapLink": "https://maps.google.com/?q=13.622,79.426",
    "routeId": "ROUTE-B",
    "subscriptionType": "UNSUN — Alternate Days (Mon, Wed, Fri)",
    "deliveryCadence": "Alternate Days (Except Sunday)",
    "deliveryDays": [
      "Monday",
      "Wednesday",
      "Friday"
    ],
    "lastDelivery": null,
    "autoPickupDue": null,
    "startDate": "2026-10-15",
    "endDate": "2026-11-15",
    "remainingDays": 16,
    "paymentStatus": "Paid",
    "paymentMode": "Net Banking",
    "lastPaymentDate": "2026-10-15",
    "todayDeliveryStatus": "Pending",
    "kitchenNotes": "Low spice, extra sprouts for double protein",
    "deliveryNotes": "Call on intercom at Tower reception before entering",
    "specialInstructions": "Low spice, extra sprouts for double protein",
    "leaveHistory": [],
    "allottedDishIds": [
      "MNU-5",
      "MNU-6",
      "MNU-7"
    ],
    "dabbasHeld": [],
    "dabbasReturnedTotal": 29,
    "handedOverToday": [],
    "unreadNotifications": 0
  },
  {
    "id": "CUST-019",
    "name": "Swapna Rani",
    "phone": "+91 98480 11314",
    "address": "Flat 403, Bhavani Nagar 3rd Cross, Tirupati, Andhra Pradesh - 517505",
    "coordinates": {
      "lat": 13.6275,
      "lng": 79.424
    },
    "mapLink": "https://maps.google.com/?q=13.6275,79.424",
    "routeId": "ROUTE-B",
    "subscriptionType": "UNSUN — Alternate Days (Mon, Wed, Fri)",
    "deliveryCadence": "Alternate Days (Except Sunday)",
    "deliveryDays": [
      "Monday",
      "Wednesday",
      "Friday"
    ],
    "lastDelivery": null,
    "autoPickupDue": null,
    "startDate": "2026-10-15",
    "endDate": "2026-11-15",
    "remainingDays": 17,
    "paymentStatus": "Pending",
    "paymentMode": "UPI (Google Pay)",
    "lastPaymentDate": "2026-10-15",
    "todayDeliveryStatus": "Pending",
    "kitchenNotes": "Severe peanut allergy. Keep sprouts separate in container.",
    "deliveryNotes": "Leave at security cabin if apartment door locked",
    "specialInstructions": "Severe peanut allergy. Keep sprouts separate in container.",
    "leaveHistory": [],
    "allottedDishIds": [
      "MNU-1",
      "MNU-2",
      "MNU-3",
      "MNU-4"
    ],
    "dabbasHeld": [],
    "dabbasReturnedTotal": 30,
    "handedOverToday": [
      "DB-109"
    ],
    "unreadNotifications": 0
  },
  {
    "id": "CUST-020",
    "name": "Kalyan Chakravarthy",
    "phone": "+91 98480 11387",
    "address": "Flat 504, Royal Palms, Tilak Road, Ramanuja Circle, Tirupati, Andhra Pradesh - 517506",
    "coordinates": {
      "lat": 13.631,
      "lng": 79.42
    },
    "mapLink": "https://maps.google.com/?q=13.631,79.42",
    "routeId": "ROUTE-B",
    "subscriptionType": "UNSUN — Alternate Days (Mon, Wed, Fri)",
    "deliveryCadence": "Alternate Days (Except Sunday)",
    "deliveryDays": [
      "Monday",
      "Wednesday",
      "Friday"
    ],
    "lastDelivery": null,
    "autoPickupDue": null,
    "startDate": "2026-10-15",
    "endDate": "2026-11-15",
    "remainingDays": 18,
    "paymentStatus": "Paid",
    "paymentMode": "UPI (PhonePe)",
    "lastPaymentDate": "2026-10-15",
    "todayDeliveryStatus": "Pending",
    "kitchenNotes": "Diabetic-friendly (low glycemic index), less salt",
    "deliveryNotes": "Ring doorbell twice, deliver before 12:30 PM",
    "specialInstructions": "Diabetic-friendly (low glycemic index), less salt",
    "leaveHistory": [],
    "allottedDishIds": [
      "MNU-5",
      "MNU-6",
      "MNU-7"
    ],
    "dabbasHeld": [],
    "dabbasReturnedTotal": 31,
    "handedOverToday": [],
    "unreadNotifications": 0
  },
  {
    "id": "CUST-021",
    "name": "Akhila Mudhiraj",
    "phone": "+91 98480 11460",
    "address": "Flat 101, RTC Bus Stand Road, Near Leela Mahal Circle, Tirupati, Andhra Pradesh - 517507",
    "coordinates": {
      "lat": 13.634,
      "lng": 79.424
    },
    "mapLink": "https://maps.google.com/?q=13.634,79.424",
    "routeId": "ROUTE-B",
    "subscriptionType": "UNSUN — Alternate Days (Mon, Wed, Fri)",
    "deliveryCadence": "Alternate Days (Except Sunday)",
    "deliveryDays": [
      "Monday",
      "Wednesday",
      "Friday"
    ],
    "lastDelivery": {
      "dabbaId": "DB-121",
      "deliveredDay": "Monday",
      "deliveredDate": "2026-11-02"
    },
    "autoPickupDue": {
      "isDue": true,
      "dabbaId": "DB-121",
      "pickupDay": "Tuesday",
      "deliveredDay": "Monday",
      "note": "Monday Delivery ➔ Tuesday Auto-Pickup"
    },
    "startDate": "2026-10-15",
    "endDate": "2026-11-15",
    "remainingDays": 19,
    "paymentStatus": "Paid",
    "paymentMode": "Net Banking",
    "lastPaymentDate": "2026-10-15",
    "todayDeliveryStatus": "Delivered",
    "kitchenNotes": "No dairy (no curd or paneer), extra fruit portion",
    "deliveryNotes": "Call on mobile upon reaching building gate",
    "specialInstructions": "No dairy (no curd or paneer), extra fruit portion",
    "leaveHistory": [
      {
        "id": "LV-120",
        "from": "2026-11-05",
        "to": "2026-11-06",
        "days": 2,
        "status": "Approved",
        "autoExtendedUntil": "2026-11-17"
      }
    ],
    "allottedDishIds": [
      "MNU-1",
      "MNU-2",
      "MNU-3",
      "MNU-4"
    ],
    "dabbasHeld": [
      "DB-121"
    ],
    "dabbasReturnedTotal": 12,
    "handedOverToday": [],
    "unreadNotifications": 1
  },
  {
    "id": "CUST-022",
    "name": "Ravindra Reddy",
    "phone": "+91 98480 11533",
    "address": "Flat 202, Sai Teja Residency, Korlagunta Railway Gate Road, Tirupati, Andhra Pradesh - 517501",
    "coordinates": {
      "lat": 13.628,
      "lng": 79.436
    },
    "mapLink": "https://maps.google.com/?q=13.628,79.436",
    "routeId": "ROUTE-B",
    "subscriptionType": "UNSUN — Alternate Days (Mon, Wed, Fri)",
    "deliveryCadence": "Alternate Days (Except Sunday)",
    "deliveryDays": [
      "Monday",
      "Wednesday",
      "Friday"
    ],
    "lastDelivery": null,
    "autoPickupDue": null,
    "startDate": "2026-10-15",
    "endDate": "2026-11-15",
    "remainingDays": 20,
    "paymentStatus": "Paid",
    "paymentMode": "UPI (Google Pay)",
    "lastPaymentDate": "2026-10-15",
    "todayDeliveryStatus": "On Leave",
    "kitchenNotes": "Gluten-free, light lemon dressing",
    "deliveryNotes": "Keep inside wooden delivery box near main door",
    "specialInstructions": "Gluten-free, light lemon dressing",
    "leaveHistory": [],
    "allottedDishIds": [
      "MNU-5",
      "MNU-6",
      "MNU-7"
    ],
    "dabbasHeld": [],
    "dabbasReturnedTotal": 13,
    "handedOverToday": [],
    "unreadNotifications": 0
  },
  {
    "id": "CUST-023",
    "name": "Sneha Madhavapeddi",
    "phone": "+91 98480 11606",
    "address": "Flat 303, Near Mahati Auditorium, Prakasam Road, Tirupati, Andhra Pradesh - 517502",
    "coordinates": {
      "lat": 13.63,
      "lng": 79.418
    },
    "mapLink": "https://maps.google.com/?q=13.63,79.418",
    "routeId": "ROUTE-B",
    "subscriptionType": "Alternative-2 — Alternate Days (Tue, Thu, Sat)",
    "deliveryCadence": "Alternate Days (Except Sunday)",
    "deliveryDays": [
      "Tuesday",
      "Thursday",
      "Saturday"
    ],
    "lastDelivery": null,
    "autoPickupDue": null,
    "startDate": "2026-10-15",
    "endDate": "2026-11-15",
    "remainingDays": 21,
    "paymentStatus": "Paid",
    "paymentMode": "UPI (PhonePe)",
    "lastPaymentDate": "2026-10-15",
    "todayDeliveryStatus": "Pending",
    "kitchenNotes": "Pack salad dressing separately, no raw tomato",
    "deliveryNotes": "Ground floor flat, hand over directly to resident",
    "specialInstructions": "Pack salad dressing separately, no raw tomato",
    "leaveHistory": [],
    "allottedDishIds": [
      "MNU-1",
      "MNU-2",
      "MNU-3",
      "MNU-4"
    ],
    "dabbasHeld": [],
    "dabbasReturnedTotal": 14,
    "handedOverToday": [],
    "unreadNotifications": 0
  },
  {
    "id": "CUST-024",
    "name": "Gopinath Achari",
    "phone": "+91 98480 11679",
    "address": "Flat 404, Seven Hills Boulevard, AIR Bypass Road, Tirupati, Andhra Pradesh - 517503",
    "coordinates": {
      "lat": 13.621,
      "lng": 79.421
    },
    "mapLink": "https://maps.google.com/?q=13.621,79.421",
    "routeId": "ROUTE-B",
    "subscriptionType": "Alternative-2 — Alternate Days (Tue, Thu, Sat)",
    "deliveryCadence": "Alternate Days (Except Sunday)",
    "deliveryDays": [
      "Tuesday",
      "Thursday",
      "Saturday"
    ],
    "lastDelivery": null,
    "autoPickupDue": null,
    "startDate": "2026-10-15",
    "endDate": "2026-11-15",
    "remainingDays": 22,
    "paymentStatus": "Paid",
    "paymentMode": "Net Banking",
    "lastPaymentDate": "2026-10-15",
    "todayDeliveryStatus": "Pending",
    "kitchenNotes": "Low sodium, extra roasted almonds & walnuts",
    "deliveryNotes": "Call on intercom at Tower reception before entering",
    "specialInstructions": "Low sodium, extra roasted almonds & walnuts",
    "leaveHistory": [],
    "allottedDishIds": [
      "MNU-5",
      "MNU-6",
      "MNU-7"
    ],
    "dabbasHeld": [],
    "dabbasReturnedTotal": 15,
    "handedOverToday": [],
    "unreadNotifications": 0
  },
  {
    "id": "CUST-025",
    "name": "Usha Rani",
    "phone": "+91 98480 11752",
    "address": "Flat 501, Vishnu Towers, Gandhi Road, Tirupati, Andhra Pradesh - 517504",
    "coordinates": {
      "lat": 13.6275,
      "lng": 79.4185
    },
    "mapLink": "https://maps.google.com/?q=13.6275,79.4185",
    "routeId": "ROUTE-B",
    "subscriptionType": "Alternative-2 — Alternate Days (Tue, Thu, Sat)",
    "deliveryCadence": "Alternate Days (Except Sunday)",
    "deliveryDays": [
      "Tuesday",
      "Thursday",
      "Saturday"
    ],
    "lastDelivery": {
      "dabbaId": "DB-125",
      "deliveredDay": "Monday",
      "deliveredDate": "2026-11-02"
    },
    "autoPickupDue": {
      "isDue": true,
      "dabbaId": "DB-125",
      "pickupDay": "Tuesday",
      "deliveredDay": "Monday",
      "note": "Monday Delivery ➔ Tuesday Auto-Pickup"
    },
    "startDate": "2026-10-15",
    "endDate": "2026-11-15",
    "remainingDays": 23,
    "paymentStatus": "Paid",
    "paymentMode": "UPI (Google Pay)",
    "lastPaymentDate": "2026-10-15",
    "todayDeliveryStatus": "Delivered",
    "kitchenNotes": "No onion & garlic, extra cucumber",
    "deliveryNotes": "Leave at security cabin if apartment door locked",
    "specialInstructions": "No onion & garlic, extra cucumber",
    "leaveHistory": [],
    "allottedDishIds": [
      "MNU-1",
      "MNU-2",
      "MNU-3",
      "MNU-4"
    ],
    "dabbasHeld": [
      "DB-125"
    ],
    "dabbasReturnedTotal": 16,
    "handedOverToday": [
      "DB-115"
    ],
    "unreadNotifications": 0
  },
  {
    "id": "CUST-026",
    "name": "Naveen Kumar",
    "phone": "+91 98480 11825",
    "address": "Flat 102, Padmavathi Nilayam, MR Palli Circle, Tirupati, Andhra Pradesh - 517505",
    "coordinates": {
      "lat": 13.618,
      "lng": 79.408
    },
    "mapLink": "https://maps.google.com/?q=13.618,79.408",
    "routeId": "ROUTE-C",
    "subscriptionType": "Alternative-2 — Alternate Days (Tue, Thu, Sat)",
    "deliveryCadence": "Alternate Days (Except Sunday)",
    "deliveryDays": [
      "Tuesday",
      "Thursday",
      "Saturday"
    ],
    "lastDelivery": null,
    "autoPickupDue": {
      "isDue": true,
      "dabbaId": "DB-126",
      "pickupDay": "Tuesday",
      "deliveredDay": "Monday",
      "note": "Monday Delivery ➔ Tuesday Auto-Pickup"
    },
    "startDate": "2026-10-15",
    "endDate": "2026-11-15",
    "remainingDays": 24,
    "paymentStatus": "Paid",
    "paymentMode": "UPI (PhonePe)",
    "lastPaymentDate": "2026-10-15",
    "todayDeliveryStatus": "Pending",
    "kitchenNotes": "Low spice, extra sprouts for double protein",
    "deliveryNotes": "Ring doorbell twice, deliver before 12:30 PM",
    "specialInstructions": "Low spice, extra sprouts for double protein",
    "leaveHistory": [],
    "allottedDishIds": [
      "MNU-5",
      "MNU-6",
      "MNU-7"
    ],
    "dabbasHeld": [
      "DB-126"
    ],
    "dabbasReturnedTotal": 17,
    "handedOverToday": [],
    "unreadNotifications": 1
  },
  {
    "id": "CUST-027",
    "name": "Tejaswini Rao",
    "phone": "+91 98480 11898",
    "address": "Flat 203, Postal Colony, Chandragiri Road, Tirupati, Andhra Pradesh - 517506",
    "coordinates": {
      "lat": 13.624,
      "lng": 79.398
    },
    "mapLink": "https://maps.google.com/?q=13.624,79.398",
    "routeId": "ROUTE-C",
    "subscriptionType": "Alternative-2 — Alternate Days (Tue, Thu, Sat)",
    "deliveryCadence": "Alternate Days (Except Sunday)",
    "deliveryDays": [
      "Tuesday",
      "Thursday",
      "Saturday"
    ],
    "lastDelivery": null,
    "autoPickupDue": null,
    "startDate": "2026-10-15",
    "endDate": "2026-11-15",
    "remainingDays": 25,
    "paymentStatus": "Paid",
    "paymentMode": "Net Banking",
    "lastPaymentDate": "2026-10-15",
    "todayDeliveryStatus": "Pending",
    "kitchenNotes": "Severe peanut allergy. Keep sprouts separate in container.",
    "deliveryNotes": "Call on mobile upon reaching building gate",
    "specialInstructions": "Severe peanut allergy. Keep sprouts separate in container.",
    "leaveHistory": [],
    "allottedDishIds": [
      "MNU-1",
      "MNU-2",
      "MNU-3",
      "MNU-4"
    ],
    "dabbasHeld": [],
    "dabbasReturnedTotal": 18,
    "handedOverToday": [],
    "unreadNotifications": 0
  },
  {
    "id": "CUST-028",
    "name": "Sudheer Varma",
    "phone": "+91 98480 11971",
    "address": "Flat 304, SV University Faculty Quarters, West Campus Road, Tirupati, Andhra Pradesh - 517507",
    "coordinates": {
      "lat": 13.63,
      "lng": 79.395
    },
    "mapLink": "https://maps.google.com/?q=13.63,79.395",
    "routeId": "ROUTE-C",
    "subscriptionType": "Alternative-2 — Alternate Days (Tue, Thu, Sat)",
    "deliveryCadence": "Alternate Days (Except Sunday)",
    "deliveryDays": [
      "Tuesday",
      "Thursday",
      "Saturday"
    ],
    "lastDelivery": null,
    "autoPickupDue": null,
    "startDate": "2026-10-15",
    "endDate": "2026-11-15",
    "remainingDays": 26,
    "paymentStatus": "Pending",
    "paymentMode": "UPI (Google Pay)",
    "lastPaymentDate": "2026-10-15",
    "todayDeliveryStatus": "Pending",
    "kitchenNotes": "Diabetic-friendly (low glycemic index), less salt",
    "deliveryNotes": "Keep inside wooden delivery box near main door",
    "specialInstructions": "Diabetic-friendly (low glycemic index), less salt",
    "leaveHistory": [],
    "allottedDishIds": [
      "MNU-5",
      "MNU-6",
      "MNU-7"
    ],
    "dabbasHeld": [],
    "dabbasReturnedTotal": 19,
    "handedOverToday": [],
    "unreadNotifications": 0
  },
  {
    "id": "CUST-029",
    "name": "Geetha Govind",
    "phone": "+91 98480 12044",
    "address": "Flat 401, Near Bairagipatteda Park, Bairagipatteda, Tirupati, Andhra Pradesh - 517501",
    "coordinates": {
      "lat": 13.621,
      "lng": 79.415
    },
    "mapLink": "https://maps.google.com/?q=13.621,79.415",
    "routeId": "ROUTE-C",
    "subscriptionType": "Alternative-2 — Alternate Days (Tue, Thu, Sat)",
    "deliveryCadence": "Alternate Days (Except Sunday)",
    "deliveryDays": [
      "Tuesday",
      "Thursday",
      "Saturday"
    ],
    "lastDelivery": {
      "dabbaId": "DB-129",
      "deliveredDay": "Monday",
      "deliveredDate": "2026-11-02"
    },
    "autoPickupDue": {
      "isDue": true,
      "dabbaId": "DB-129",
      "pickupDay": "Tuesday",
      "deliveredDay": "Monday",
      "note": "Monday Delivery ➔ Tuesday Auto-Pickup"
    },
    "startDate": "2026-10-15",
    "endDate": "2026-11-15",
    "remainingDays": 27,
    "paymentStatus": "Paid",
    "paymentMode": "UPI (PhonePe)",
    "lastPaymentDate": "2026-10-15",
    "todayDeliveryStatus": "Delivered",
    "kitchenNotes": "No dairy (no curd or paneer), extra fruit portion",
    "deliveryNotes": "Ground floor flat, hand over directly to resident",
    "specialInstructions": "No dairy (no curd or paneer), extra fruit portion",
    "leaveHistory": [],
    "allottedDishIds": [
      "MNU-1",
      "MNU-2",
      "MNU-3",
      "MNU-4"
    ],
    "dabbasHeld": [
      "DB-129"
    ],
    "dabbasReturnedTotal": 20,
    "handedOverToday": [],
    "unreadNotifications": 0
  },
  {
    "id": "CUST-030",
    "name": "Phani Bhushan",
    "phone": "+91 98480 12117",
    "address": "Flat 502, Doctors Colony, Opposite SVIMS Hospital, Tirupati, Andhra Pradesh - 517502",
    "coordinates": {
      "lat": 13.636,
      "lng": 79.403
    },
    "mapLink": "https://maps.google.com/?q=13.636,79.403",
    "routeId": "ROUTE-C",
    "subscriptionType": "Alternative-2 — Alternate Days (Tue, Thu, Sat)",
    "deliveryCadence": "Alternate Days (Except Sunday)",
    "deliveryDays": [
      "Tuesday",
      "Thursday",
      "Saturday"
    ],
    "lastDelivery": null,
    "autoPickupDue": null,
    "startDate": "2026-10-15",
    "endDate": "2026-11-15",
    "remainingDays": 28,
    "paymentStatus": "Paid",
    "paymentMode": "Net Banking",
    "lastPaymentDate": "2026-10-15",
    "todayDeliveryStatus": "Pending",
    "kitchenNotes": "Gluten-free, light lemon dressing",
    "deliveryNotes": "Call on intercom at Tower reception before entering",
    "specialInstructions": "Gluten-free, light lemon dressing",
    "leaveHistory": [],
    "allottedDishIds": [
      "MNU-5",
      "MNU-6",
      "MNU-7"
    ],
    "dabbasHeld": [],
    "dabbasReturnedTotal": 21,
    "handedOverToday": [],
    "unreadNotifications": 0
  },
  {
    "id": "CUST-031",
    "name": "Sirisha Chebrolu",
    "phone": "+91 98480 12190",
    "address": "Flat 103, New Indira Nagar, MR Palli Railway Overbridge, Tirupati, Andhra Pradesh - 517503",
    "coordinates": {
      "lat": 13.616,
      "lng": 79.405
    },
    "mapLink": "https://maps.google.com/?q=13.616,79.405",
    "routeId": "ROUTE-C",
    "subscriptionType": "Alternative-2 — Alternate Days (Tue, Thu, Sat)",
    "deliveryCadence": "Alternate Days (Except Sunday)",
    "deliveryDays": [
      "Tuesday",
      "Thursday",
      "Saturday"
    ],
    "lastDelivery": null,
    "autoPickupDue": {
      "isDue": true,
      "dabbaId": "DB-131",
      "pickupDay": "Tuesday",
      "deliveredDay": "Monday",
      "note": "Monday Delivery ➔ Tuesday Auto-Pickup"
    },
    "startDate": "2026-10-15",
    "endDate": "2026-11-15",
    "remainingDays": 14,
    "paymentStatus": "Paid",
    "paymentMode": "UPI (Google Pay)",
    "lastPaymentDate": "2026-10-15",
    "todayDeliveryStatus": "Pending",
    "kitchenNotes": "Pack salad dressing separately, no raw tomato",
    "deliveryNotes": "Leave at security cabin if apartment door locked",
    "specialInstructions": "Pack salad dressing separately, no raw tomato",
    "leaveHistory": [
      {
        "id": "LV-130",
        "from": "2026-11-05",
        "to": "2026-11-06",
        "days": 2,
        "status": "Approved",
        "autoExtendedUntil": "2026-11-17"
      }
    ],
    "allottedDishIds": [
      "MNU-1",
      "MNU-2",
      "MNU-3",
      "MNU-4"
    ],
    "dabbasHeld": [
      "DB-131"
    ],
    "dabbasReturnedTotal": 22,
    "handedOverToday": [
      "DB-121"
    ],
    "unreadNotifications": 1
  },
  {
    "id": "CUST-032",
    "name": "Jagadeesh Naidu",
    "phone": "+91 98480 12263",
    "address": "Flat 204, Prakruthi Vihar, Chandragiri Bypass Road, Tirupati, Andhra Pradesh - 517504",
    "coordinates": {
      "lat": 13.622,
      "lng": 79.392
    },
    "mapLink": "https://maps.google.com/?q=13.622,79.392",
    "routeId": "ROUTE-C",
    "subscriptionType": "Alternative-2 — Alternate Days (Tue, Thu, Sat)",
    "deliveryCadence": "Alternate Days (Except Sunday)",
    "deliveryDays": [
      "Tuesday",
      "Thursday",
      "Saturday"
    ],
    "lastDelivery": null,
    "autoPickupDue": null,
    "startDate": "2026-10-15",
    "endDate": "2026-11-15",
    "remainingDays": 15,
    "paymentStatus": "Paid",
    "paymentMode": "UPI (PhonePe)",
    "lastPaymentDate": "2026-10-15",
    "todayDeliveryStatus": "Pending",
    "kitchenNotes": "Low sodium, extra roasted almonds & walnuts",
    "deliveryNotes": "Ring doorbell twice, deliver before 12:30 PM",
    "specialInstructions": "Low sodium, extra roasted almonds & walnuts",
    "leaveHistory": [],
    "allottedDishIds": [
      "MNU-5",
      "MNU-6",
      "MNU-7"
    ],
    "dabbasHeld": [],
    "dabbasReturnedTotal": 23,
    "handedOverToday": [],
    "unreadNotifications": 0
  },
  {
    "id": "CUST-033",
    "name": "Chandana Priya",
    "phone": "+91 98480 12336",
    "address": "Flat 301, Padmavati Mahila University Road, Tirupati, Andhra Pradesh - 517505",
    "coordinates": {
      "lat": 13.633,
      "lng": 79.397
    },
    "mapLink": "https://maps.google.com/?q=13.633,79.397",
    "routeId": "ROUTE-C",
    "subscriptionType": "Alternative-2 — Alternate Days (Tue, Thu, Sat)",
    "deliveryCadence": "Alternate Days (Except Sunday)",
    "deliveryDays": [
      "Tuesday",
      "Thursday",
      "Saturday"
    ],
    "lastDelivery": {
      "dabbaId": "DB-133",
      "deliveredDay": "Monday",
      "deliveredDate": "2026-11-02"
    },
    "autoPickupDue": {
      "isDue": true,
      "dabbaId": "DB-133",
      "pickupDay": "Tuesday",
      "deliveredDay": "Monday",
      "note": "Monday Delivery ➔ Tuesday Auto-Pickup"
    },
    "startDate": "2026-10-15",
    "endDate": "2026-11-15",
    "remainingDays": 16,
    "paymentStatus": "Paid",
    "paymentMode": "Net Banking",
    "lastPaymentDate": "2026-10-15",
    "todayDeliveryStatus": "Delivered",
    "kitchenNotes": "No onion & garlic, extra cucumber",
    "deliveryNotes": "Call on mobile upon reaching building gate",
    "specialInstructions": "No onion & garlic, extra cucumber",
    "leaveHistory": [],
    "allottedDishIds": [
      "MNU-1",
      "MNU-2",
      "MNU-3",
      "MNU-4"
    ],
    "dabbasHeld": [
      "DB-133"
    ],
    "dabbasReturnedTotal": 24,
    "handedOverToday": [],
    "unreadNotifications": 0
  },
  {
    "id": "CUST-034",
    "name": "Murali Mohan",
    "phone": "+91 98480 12409",
    "address": "Flat 402, Green Acres, Thummalagunta, Tirupati, Andhra Pradesh - 517506",
    "coordinates": {
      "lat": 13.627,
      "lng": 79.39
    },
    "mapLink": "https://maps.google.com/?q=13.627,79.39",
    "routeId": "ROUTE-C",
    "subscriptionType": "Alternative-2 — Alternate Days (Tue, Thu, Sat)",
    "deliveryCadence": "Alternate Days (Except Sunday)",
    "deliveryDays": [
      "Tuesday",
      "Thursday",
      "Saturday"
    ],
    "lastDelivery": null,
    "autoPickupDue": null,
    "startDate": "2026-10-15",
    "endDate": "2026-11-15",
    "remainingDays": 17,
    "paymentStatus": "Paid",
    "paymentMode": "UPI (Google Pay)",
    "lastPaymentDate": "2026-10-15",
    "todayDeliveryStatus": "Pending",
    "kitchenNotes": "Low spice, extra sprouts for double protein",
    "deliveryNotes": "Keep inside wooden delivery box near main door",
    "specialInstructions": "Low spice, extra sprouts for double protein",
    "leaveHistory": [],
    "allottedDishIds": [
      "MNU-5",
      "MNU-6",
      "MNU-7"
    ],
    "dabbasHeld": [],
    "dabbasReturnedTotal": 25,
    "handedOverToday": [],
    "unreadNotifications": 0
  },
  {
    "id": "CUST-035",
    "name": "Sravanthi Allu",
    "phone": "+91 98480 12482",
    "address": "Flat 503, BIRRD Hospital Staff Quarters Road, Tirupati, Andhra Pradesh - 517507",
    "coordinates": {
      "lat": 13.6345,
      "lng": 79.4045
    },
    "mapLink": "https://maps.google.com/?q=13.6345,79.4045",
    "routeId": "ROUTE-C",
    "subscriptionType": "Alternative-2 — Alternate Days (Tue, Thu, Sat)",
    "deliveryCadence": "Alternate Days (Except Sunday)",
    "deliveryDays": [
      "Tuesday",
      "Thursday",
      "Saturday"
    ],
    "lastDelivery": null,
    "autoPickupDue": null,
    "startDate": "2026-10-15",
    "endDate": "2026-11-15",
    "remainingDays": 18,
    "paymentStatus": "Paid",
    "paymentMode": "UPI (PhonePe)",
    "lastPaymentDate": "2026-10-15",
    "todayDeliveryStatus": "Pending",
    "kitchenNotes": "Severe peanut allergy. Keep sprouts separate in container.",
    "deliveryNotes": "Ground floor flat, hand over directly to resident",
    "specialInstructions": "Severe peanut allergy. Keep sprouts separate in container.",
    "leaveHistory": [],
    "allottedDishIds": [
      "MNU-1",
      "MNU-2",
      "MNU-3",
      "MNU-4"
    ],
    "dabbasHeld": [],
    "dabbasReturnedTotal": 26,
    "handedOverToday": [],
    "unreadNotifications": 0
  },
  {
    "id": "CUST-036",
    "name": "Srinivasulu Setty",
    "phone": "+91 98480 12555",
    "address": "Flat 104, Teachers Colony, Behind MR Palli Police Station, Tirupati, Andhra Pradesh - 517501",
    "coordinates": {
      "lat": 13.6195,
      "lng": 79.4095
    },
    "mapLink": "https://maps.google.com/?q=13.6195,79.4095",
    "routeId": "ROUTE-C",
    "subscriptionType": "Alternative-2 — Alternate Days (Tue, Thu, Sat)",
    "deliveryCadence": "Alternate Days (Except Sunday)",
    "deliveryDays": [
      "Tuesday",
      "Thursday",
      "Saturday"
    ],
    "lastDelivery": null,
    "autoPickupDue": null,
    "startDate": "2026-10-15",
    "endDate": "2026-11-15",
    "remainingDays": 19,
    "paymentStatus": "Paid",
    "paymentMode": "Net Banking",
    "lastPaymentDate": "2026-10-15",
    "todayDeliveryStatus": "On Leave",
    "kitchenNotes": "Diabetic-friendly (low glycemic index), less salt",
    "deliveryNotes": "Call on intercom at Tower reception before entering",
    "specialInstructions": "Diabetic-friendly (low glycemic index), less salt",
    "leaveHistory": [],
    "allottedDishIds": [
      "MNU-5",
      "MNU-6",
      "MNU-7"
    ],
    "dabbasHeld": [],
    "dabbasReturnedTotal": 27,
    "handedOverToday": [],
    "unreadNotifications": 1
  },
  {
    "id": "CUST-037",
    "name": "Meena Kumari",
    "phone": "+91 98480 12628",
    "address": "Flat 201, Avilala Lake View Road, Bairagipatteda, Tirupati, Andhra Pradesh - 517502",
    "coordinates": {
      "lat": 13.612,
      "lng": 79.414
    },
    "mapLink": "https://maps.google.com/?q=13.612,79.414",
    "routeId": "ROUTE-C",
    "subscriptionType": "Alternative-2 — Alternate Days (Tue, Thu, Sat)",
    "deliveryCadence": "Alternate Days (Except Sunday)",
    "deliveryDays": [
      "Tuesday",
      "Thursday",
      "Saturday"
    ],
    "lastDelivery": {
      "dabbaId": "DB-137",
      "deliveredDay": "Monday",
      "deliveredDate": "2026-11-02"
    },
    "autoPickupDue": {
      "isDue": true,
      "dabbaId": "DB-137",
      "pickupDay": "Tuesday",
      "deliveredDay": "Monday",
      "note": "Monday Delivery ➔ Tuesday Auto-Pickup"
    },
    "startDate": "2026-10-15",
    "endDate": "2026-11-15",
    "remainingDays": 20,
    "paymentStatus": "Pending",
    "paymentMode": "UPI (Google Pay)",
    "lastPaymentDate": "2026-10-15",
    "todayDeliveryStatus": "Delivered",
    "kitchenNotes": "No dairy (no curd or paneer), extra fruit portion",
    "deliveryNotes": "Leave at security cabin if apartment door locked",
    "specialInstructions": "No dairy (no curd or paneer), extra fruit portion",
    "leaveHistory": [],
    "allottedDishIds": [
      "MNU-1",
      "MNU-2",
      "MNU-3",
      "MNU-4"
    ],
    "dabbasHeld": [
      "DB-137"
    ],
    "dabbasReturnedTotal": 28,
    "handedOverToday": [
      "DB-127"
    ],
    "unreadNotifications": 0
  },
  {
    "id": "CUST-038",
    "name": "Karthik Varma",
    "phone": "+91 98480 12701",
    "address": "Flat 302, Hill View Towers, Near Zoo Park Road, Tirupati, Andhra Pradesh - 517503",
    "coordinates": {
      "lat": 13.638,
      "lng": 79.399
    },
    "mapLink": "https://maps.google.com/?q=13.638,79.399",
    "routeId": "ROUTE-C",
    "subscriptionType": "Alternative-2 — Alternate Days (Tue, Thu, Sat)",
    "deliveryCadence": "Alternate Days (Except Sunday)",
    "deliveryDays": [
      "Tuesday",
      "Thursday",
      "Saturday"
    ],
    "lastDelivery": null,
    "autoPickupDue": null,
    "startDate": "2026-10-15",
    "endDate": "2026-11-15",
    "remainingDays": 21,
    "paymentStatus": "Paid",
    "paymentMode": "UPI (PhonePe)",
    "lastPaymentDate": "2026-10-15",
    "todayDeliveryStatus": "Pending",
    "kitchenNotes": "Gluten-free, light lemon dressing",
    "deliveryNotes": "Ring doorbell twice, deliver before 12:30 PM",
    "specialInstructions": "Gluten-free, light lemon dressing",
    "leaveHistory": [],
    "allottedDishIds": [
      "MNU-5",
      "MNU-6",
      "MNU-7"
    ],
    "dabbasHeld": [],
    "dabbasReturnedTotal": 29,
    "handedOverToday": [],
    "unreadNotifications": 0
  },
  {
    "id": "CUST-039",
    "name": "Renuka Devi",
    "phone": "+91 98480 12774",
    "address": "Flat 403, Padmavathi Nagar, Mangalam Road, Tirupati, Andhra Pradesh - 517504",
    "coordinates": {
      "lat": 13.645,
      "lng": 79.445
    },
    "mapLink": "https://maps.google.com/?q=13.645,79.445",
    "routeId": "ROUTE-D",
    "subscriptionType": "Alternative-2 — Alternate Days (Tue, Thu, Sat)",
    "deliveryCadence": "Alternate Days (Except Sunday)",
    "deliveryDays": [
      "Tuesday",
      "Thursday",
      "Saturday"
    ],
    "lastDelivery": null,
    "autoPickupDue": null,
    "startDate": "2026-10-15",
    "endDate": "2026-11-15",
    "remainingDays": 22,
    "paymentStatus": "Paid",
    "paymentMode": "Net Banking",
    "lastPaymentDate": "2026-10-15",
    "todayDeliveryStatus": "Pending",
    "kitchenNotes": "Pack salad dressing separately, no raw tomato",
    "deliveryNotes": "Call on mobile upon reaching building gate",
    "specialInstructions": "Pack salad dressing separately, no raw tomato",
    "leaveHistory": [],
    "allottedDishIds": [
      "MNU-1",
      "MNU-2",
      "MNU-3",
      "MNU-4"
    ],
    "dabbasHeld": [],
    "dabbasReturnedTotal": 30,
    "handedOverToday": [],
    "unreadNotifications": 0
  },
  {
    "id": "CUST-040",
    "name": "Dileep Reddy",
    "phone": "+91 98480 12847",
    "address": "Flat 504, Karakambadi Industrial Road, Near Hero Showroom, Tirupati, Andhra Pradesh - 517505",
    "coordinates": {
      "lat": 13.655,
      "lng": 79.44
    },
    "mapLink": "https://maps.google.com/?q=13.655,79.44",
    "routeId": "ROUTE-D",
    "subscriptionType": "One Day Meal (Custom Specific Day)",
    "deliveryCadence": "Specific Chosen Day",
    "deliveryDays": [
      "Thursday"
    ],
    "chosenDeliveryDay": "Thursday",
    "lastDelivery": null,
    "autoPickupDue": null,
    "startDate": "2026-10-15",
    "endDate": "2026-11-15",
    "remainingDays": 23,
    "paymentStatus": "Paid",
    "paymentMode": "UPI (Google Pay)",
    "lastPaymentDate": "2026-10-15",
    "todayDeliveryStatus": "Pending",
    "kitchenNotes": "Low sodium, extra roasted almonds & walnuts",
    "deliveryNotes": "Keep inside wooden delivery box near main door",
    "specialInstructions": "Low sodium, extra roasted almonds & walnuts",
    "leaveHistory": [],
    "allottedDishIds": [
      "MNU-5",
      "MNU-6",
      "MNU-7"
    ],
    "dabbasHeld": [],
    "dabbasReturnedTotal": 31,
    "handedOverToday": [],
    "unreadNotifications": 0
  },
  {
    "id": "CUST-041",
    "name": "Deepthi Rayalu",
    "phone": "+91 98480 12920",
    "address": "Flat 101, Green Valley, Akkarampalli, Tirupati, Andhra Pradesh - 517506",
    "coordinates": {
      "lat": 13.64,
      "lng": 79.435
    },
    "mapLink": "https://maps.google.com/?q=13.64,79.435",
    "routeId": "ROUTE-D",
    "subscriptionType": "One Day Meal (Custom Specific Day)",
    "deliveryCadence": "Specific Chosen Day",
    "deliveryDays": [
      "Friday"
    ],
    "chosenDeliveryDay": "Friday",
    "lastDelivery": {
      "dabbaId": "DB-141",
      "deliveredDay": "Monday",
      "deliveredDate": "2026-11-02"
    },
    "autoPickupDue": {
      "isDue": true,
      "dabbaId": "DB-141",
      "pickupDay": "Tuesday",
      "deliveredDay": "Monday",
      "note": "Monday Delivery ➔ Tuesday Auto-Pickup"
    },
    "startDate": "2026-10-15",
    "endDate": "2026-11-15",
    "remainingDays": 24,
    "paymentStatus": "Paid",
    "paymentMode": "UPI (PhonePe)",
    "lastPaymentDate": "2026-10-15",
    "todayDeliveryStatus": "Delivered",
    "kitchenNotes": "No onion & garlic, extra cucumber",
    "deliveryNotes": "Ground floor flat, hand over directly to resident",
    "specialInstructions": "No onion & garlic, extra cucumber",
    "leaveHistory": [
      {
        "id": "LV-140",
        "from": "2026-11-05",
        "to": "2026-11-06",
        "days": 2,
        "status": "Approved",
        "autoExtendedUntil": "2026-11-17"
      }
    ],
    "allottedDishIds": [
      "MNU-1",
      "MNU-2",
      "MNU-3",
      "MNU-4"
    ],
    "dabbasHeld": [
      "DB-141"
    ],
    "dabbasReturnedTotal": 12,
    "handedOverToday": [],
    "unreadNotifications": 1
  },
  {
    "id": "CUST-042",
    "name": "Hemanth Kumar",
    "phone": "+91 98480 12993",
    "address": "Flat 202, Settipalli High Life, Renigunta Road, Tirupati, Andhra Pradesh - 517507",
    "coordinates": {
      "lat": 13.632,
      "lng": 79.452
    },
    "mapLink": "https://maps.google.com/?q=13.632,79.452",
    "routeId": "ROUTE-D",
    "subscriptionType": "One Day Meal (Custom Specific Day)",
    "deliveryCadence": "Specific Chosen Day",
    "deliveryDays": [
      "Saturday"
    ],
    "chosenDeliveryDay": "Saturday",
    "lastDelivery": null,
    "autoPickupDue": null,
    "startDate": "2026-10-15",
    "endDate": "2026-11-15",
    "remainingDays": 25,
    "paymentStatus": "Paid",
    "paymentMode": "Net Banking",
    "lastPaymentDate": "2026-10-15",
    "todayDeliveryStatus": "Pending",
    "kitchenNotes": "Low spice, extra sprouts for double protein",
    "deliveryNotes": "Call on intercom at Tower reception before entering",
    "specialInstructions": "Low spice, extra sprouts for double protein",
    "leaveHistory": [],
    "allottedDishIds": [
      "MNU-5",
      "MNU-6",
      "MNU-7"
    ],
    "dabbasHeld": [],
    "dabbasReturnedTotal": 13,
    "handedOverToday": [],
    "unreadNotifications": 0
  },
  {
    "id": "CUST-043",
    "name": "Swathi Pinnamaneni",
    "phone": "+91 98480 13066",
    "address": "Flat 303, Daminedu Village Road, Tirupati, Andhra Pradesh - 517501",
    "coordinates": {
      "lat": 13.615,
      "lng": 79.442
    },
    "mapLink": "https://maps.google.com/?q=13.615,79.442",
    "routeId": "ROUTE-D",
    "subscriptionType": "One Day Meal (Custom Specific Day)",
    "deliveryCadence": "Specific Chosen Day",
    "deliveryDays": [
      "Monday"
    ],
    "chosenDeliveryDay": "Monday",
    "lastDelivery": null,
    "autoPickupDue": null,
    "startDate": "2026-10-15",
    "endDate": "2026-11-15",
    "remainingDays": 26,
    "paymentStatus": "Paid",
    "paymentMode": "UPI (Google Pay)",
    "lastPaymentDate": "2026-10-15",
    "todayDeliveryStatus": "On Leave",
    "kitchenNotes": "Severe peanut allergy. Keep sprouts separate in container.",
    "deliveryNotes": "Leave at security cabin if apartment door locked",
    "specialInstructions": "Severe peanut allergy. Keep sprouts separate in container.",
    "leaveHistory": [],
    "allottedDishIds": [
      "MNU-1",
      "MNU-2",
      "MNU-3",
      "MNU-4"
    ],
    "dabbasHeld": [],
    "dabbasReturnedTotal": 14,
    "handedOverToday": [
      "DB-133"
    ],
    "unreadNotifications": 0
  },
  {
    "id": "CUST-044",
    "name": "Nanda Kishore",
    "phone": "+91 98480 13139",
    "address": "Flat 404, Rameswaram Road, Mangalam Quarters, Tirupati, Andhra Pradesh - 517502",
    "coordinates": {
      "lat": 13.648,
      "lng": 79.449
    },
    "mapLink": "https://maps.google.com/?q=13.648,79.449",
    "routeId": "ROUTE-D",
    "subscriptionType": "One Day Meal (Custom Specific Day)",
    "deliveryCadence": "Specific Chosen Day",
    "deliveryDays": [
      "Tuesday"
    ],
    "chosenDeliveryDay": "Tuesday",
    "lastDelivery": null,
    "autoPickupDue": null,
    "startDate": "2026-10-15",
    "endDate": "2026-11-15",
    "remainingDays": 27,
    "paymentStatus": "Paid",
    "paymentMode": "UPI (PhonePe)",
    "lastPaymentDate": "2026-10-15",
    "todayDeliveryStatus": "Pending",
    "kitchenNotes": "Diabetic-friendly (low glycemic index), less salt",
    "deliveryNotes": "Ring doorbell twice, deliver before 12:30 PM",
    "specialInstructions": "Diabetic-friendly (low glycemic index), less salt",
    "leaveHistory": [],
    "allottedDishIds": [
      "MNU-5",
      "MNU-6",
      "MNU-7"
    ],
    "dabbasHeld": [],
    "dabbasReturnedTotal": 15,
    "handedOverToday": [],
    "unreadNotifications": 0
  },
  {
    "id": "CUST-045",
    "name": "Ramadevi Kalvakuntla",
    "phone": "+91 98480 13212",
    "address": "Flat 501, Sri Krishna Arcade, Renigunta Tollgate Road, Tirupati, Andhra Pradesh - 517503",
    "coordinates": {
      "lat": 13.63,
      "lng": 79.458
    },
    "mapLink": "https://maps.google.com/?q=13.63,79.458",
    "routeId": "ROUTE-D",
    "subscriptionType": "One Day Meal (Custom Specific Day)",
    "deliveryCadence": "Specific Chosen Day",
    "deliveryDays": [
      "Wednesday"
    ],
    "chosenDeliveryDay": "Wednesday",
    "lastDelivery": {
      "dabbaId": "DB-145",
      "deliveredDay": "Monday",
      "deliveredDate": "2026-11-02"
    },
    "autoPickupDue": {
      "isDue": true,
      "dabbaId": "DB-145",
      "pickupDay": "Tuesday",
      "deliveredDay": "Monday",
      "note": "Monday Delivery ➔ Tuesday Auto-Pickup"
    },
    "startDate": "2026-10-15",
    "endDate": "2026-11-15",
    "remainingDays": 28,
    "paymentStatus": "Paid",
    "paymentMode": "Net Banking",
    "lastPaymentDate": "2026-10-15",
    "todayDeliveryStatus": "Delivered",
    "kitchenNotes": "No dairy (no curd or paneer), extra fruit portion",
    "deliveryNotes": "Call on mobile upon reaching building gate",
    "specialInstructions": "No dairy (no curd or paneer), extra fruit portion",
    "leaveHistory": [],
    "allottedDishIds": [
      "MNU-1",
      "MNU-2",
      "MNU-3",
      "MNU-4"
    ],
    "dabbasHeld": [
      "DB-145"
    ],
    "dabbasReturnedTotal": 16,
    "handedOverToday": [],
    "unreadNotifications": 0
  },
  {
    "id": "CUST-046",
    "name": "Sandeep Chowdary",
    "phone": "+91 98480 13285",
    "address": "Flat 102, Akkarampalli Reservoir Road, Tirupati, Andhra Pradesh - 517504",
    "coordinates": {
      "lat": 13.643,
      "lng": 79.432
    },
    "mapLink": "https://maps.google.com/?q=13.643,79.432",
    "routeId": "ROUTE-D",
    "subscriptionType": "One Day Meal (Custom Specific Day)",
    "deliveryCadence": "Specific Chosen Day",
    "deliveryDays": [
      "Thursday"
    ],
    "chosenDeliveryDay": "Thursday",
    "lastDelivery": null,
    "autoPickupDue": {
      "isDue": true,
      "dabbaId": "DB-146",
      "pickupDay": "Tuesday",
      "deliveredDay": "Monday",
      "note": "Monday Delivery ➔ Tuesday Auto-Pickup"
    },
    "startDate": "2026-10-15",
    "endDate": "2026-11-15",
    "remainingDays": 14,
    "paymentStatus": "Pending",
    "paymentMode": "UPI (Google Pay)",
    "lastPaymentDate": "2026-10-15",
    "todayDeliveryStatus": "Pending",
    "kitchenNotes": "Gluten-free, light lemon dressing",
    "deliveryNotes": "Keep inside wooden delivery box near main door",
    "specialInstructions": "Gluten-free, light lemon dressing",
    "leaveHistory": [],
    "allottedDishIds": [
      "MNU-5",
      "MNU-6",
      "MNU-7"
    ],
    "dabbasHeld": [
      "DB-146"
    ],
    "dabbasReturnedTotal": 17,
    "handedOverToday": [],
    "unreadNotifications": 1
  },
  {
    "id": "CUST-047",
    "name": "Pushpalatha",
    "phone": "+91 98480 13358",
    "address": "Flat 203, Near Auto Nagar, Karakambadi Road, Tirupati, Andhra Pradesh - 517505",
    "coordinates": {
      "lat": 13.652,
      "lng": 79.443
    },
    "mapLink": "https://maps.google.com/?q=13.652,79.443",
    "routeId": "ROUTE-D",
    "subscriptionType": "One Day Meal (Custom Specific Day)",
    "deliveryCadence": "Specific Chosen Day",
    "deliveryDays": [
      "Friday"
    ],
    "chosenDeliveryDay": "Friday",
    "lastDelivery": null,
    "autoPickupDue": null,
    "startDate": "2026-10-15",
    "endDate": "2026-11-15",
    "remainingDays": 15,
    "paymentStatus": "Paid",
    "paymentMode": "UPI (PhonePe)",
    "lastPaymentDate": "2026-10-15",
    "todayDeliveryStatus": "Pending",
    "kitchenNotes": "Pack salad dressing separately, no raw tomato",
    "deliveryNotes": "Ground floor flat, hand over directly to resident",
    "specialInstructions": "Pack salad dressing separately, no raw tomato",
    "leaveHistory": [],
    "allottedDishIds": [
      "MNU-1",
      "MNU-2",
      "MNU-3",
      "MNU-4"
    ],
    "dabbasHeld": [],
    "dabbasReturnedTotal": 18,
    "handedOverToday": [],
    "unreadNotifications": 0
  },
  {
    "id": "CUST-048",
    "name": "Vamsi Krishna",
    "phone": "+91 98480 13431",
    "address": "Flat 304, Surya Teja Grand, Ramanuja Circle East, Tirupati, Andhra Pradesh - 517506",
    "coordinates": {
      "lat": 13.633,
      "lng": 79.438
    },
    "mapLink": "https://maps.google.com/?q=13.633,79.438",
    "routeId": "ROUTE-D",
    "subscriptionType": "One Day Meal (Custom Specific Day)",
    "deliveryCadence": "Specific Chosen Day",
    "deliveryDays": [
      "Saturday"
    ],
    "chosenDeliveryDay": "Saturday",
    "lastDelivery": null,
    "autoPickupDue": null,
    "startDate": "2026-10-15",
    "endDate": "2026-11-15",
    "remainingDays": 16,
    "paymentStatus": "Paid",
    "paymentMode": "Net Banking",
    "lastPaymentDate": "2026-10-15",
    "todayDeliveryStatus": "Pending",
    "kitchenNotes": "Low sodium, extra roasted almonds & walnuts",
    "deliveryNotes": "Call on intercom at Tower reception before entering",
    "specialInstructions": "Low sodium, extra roasted almonds & walnuts",
    "leaveHistory": [],
    "allottedDishIds": [
      "MNU-5",
      "MNU-6",
      "MNU-7"
    ],
    "dabbasHeld": [],
    "dabbasReturnedTotal": 19,
    "handedOverToday": [],
    "unreadNotifications": 0
  },
  {
    "id": "CUST-049",
    "name": "Lavanya Gudipati",
    "phone": "+91 98480 13504",
    "address": "Flat 401, Chennaiah Gunta, Renigunta Road, Tirupati, Andhra Pradesh - 517507",
    "coordinates": {
      "lat": 13.627,
      "lng": 79.447
    },
    "mapLink": "https://maps.google.com/?q=13.627,79.447",
    "routeId": "ROUTE-D",
    "subscriptionType": "One Day Meal (Custom Specific Day)",
    "deliveryCadence": "Specific Chosen Day",
    "deliveryDays": [
      "Monday"
    ],
    "chosenDeliveryDay": "Monday",
    "lastDelivery": {
      "dabbaId": "DB-149",
      "deliveredDay": "Monday",
      "deliveredDate": "2026-11-02"
    },
    "autoPickupDue": {
      "isDue": true,
      "dabbaId": "DB-149",
      "pickupDay": "Tuesday",
      "deliveredDay": "Monday",
      "note": "Monday Delivery ➔ Tuesday Auto-Pickup"
    },
    "startDate": "2026-10-15",
    "endDate": "2026-11-15",
    "remainingDays": 17,
    "paymentStatus": "Paid",
    "paymentMode": "UPI (Google Pay)",
    "lastPaymentDate": "2026-10-15",
    "todayDeliveryStatus": "Delivered",
    "kitchenNotes": "No onion & garlic, extra cucumber",
    "deliveryNotes": "Leave at security cabin if apartment door locked",
    "specialInstructions": "No onion & garlic, extra cucumber",
    "leaveHistory": [],
    "allottedDishIds": [
      "MNU-1",
      "MNU-2",
      "MNU-3",
      "MNU-4"
    ],
    "dabbasHeld": [
      "DB-149"
    ],
    "dabbasReturnedTotal": 20,
    "handedOverToday": [
      "DB-139"
    ],
    "unreadNotifications": 0
  },
  {
    "id": "CUST-050",
    "name": "Bhanu Prakash",
    "phone": "+91 98480 13577",
    "address": "Flat 502, Tirupati Airport Road Enclave, Settipalli, Tirupati, Andhra Pradesh - 517501",
    "coordinates": {
      "lat": 13.635,
      "lng": 79.46
    },
    "mapLink": "https://maps.google.com/?q=13.635,79.46",
    "routeId": "ROUTE-D",
    "subscriptionType": "One Day Meal (Custom Specific Day)",
    "deliveryCadence": "Specific Chosen Day",
    "deliveryDays": [
      "Tuesday"
    ],
    "chosenDeliveryDay": "Tuesday",
    "lastDelivery": null,
    "autoPickupDue": null,
    "startDate": "2026-10-15",
    "endDate": "2026-11-15",
    "remainingDays": 18,
    "paymentStatus": "Paid",
    "paymentMode": "UPI (PhonePe)",
    "lastPaymentDate": "2026-10-15",
    "todayDeliveryStatus": "On Leave",
    "kitchenNotes": "Low spice, extra sprouts for double protein",
    "deliveryNotes": "Ring doorbell twice, deliver before 12:30 PM",
    "specialInstructions": "Low spice, extra sprouts for double protein",
    "leaveHistory": [],
    "allottedDishIds": [
      "MNU-5",
      "MNU-6",
      "MNU-7"
    ],
    "dabbasHeld": [],
    "dabbasReturnedTotal": 21,
    "handedOverToday": [],
    "unreadNotifications": 0
  }
];

export const initialRoutes = [
  {
    "id": "ROUTE-A",
    "name": "Route A — KT Road, Alipiri & Balaji Colony",
    "zone": "Zone 1 (Alipiri Corridor)",
    "coordinates": {
      "lat": 13.642,
      "lng": 79.414
    },
    "assignedDriverId": "DBOY-01",
    "totalStops": 13,
    "description": "Covers Kapila Theertham Road, Alipiri Foot Steps, Balaji Colony & ISKCON Temple Road"
  },
  {
    "id": "ROUTE-B",
    "name": "Route B — Bhavani Nagar, Korlagunta & AIR Bypass",
    "zone": "Zone 2 (Central Tirupati)",
    "coordinates": {
      "lat": 13.628,
      "lng": 79.426
    },
    "assignedDriverId": "DBOY-02",
    "totalStops": 12,
    "description": "Covers Bhavani Nagar, Korlagunta, Annamaiah Circle, RTC Bus Stand & Tilak Road"
  },
  {
    "id": "ROUTE-C",
    "name": "Route C — MR Palli, Postal Colony & SV University",
    "zone": "Zone 3 (South-West Tirupati)",
    "coordinates": {
      "lat": 13.624,
      "lng": 79.403
    },
    "assignedDriverId": "DBOY-03",
    "totalStops": 13,
    "description": "Covers MR Palli Circle, Postal Colony, Chandragiri Bypass, SVIMS Hospital & SV University"
  },
  {
    "id": "ROUTE-D",
    "name": "Route D — Mangalam, Karakambadi & Renigunta Road",
    "zone": "Zone 4 (East Corridor)",
    "coordinates": {
      "lat": 13.638,
      "lng": 79.447
    },
    "assignedDriverId": "DBOY-04",
    "totalStops": 12,
    "description": "Covers Padmavathi Nagar, Mangalam, Akkarampalli, Karakambadi Industrial Road & Settipalli"
  }
];

export const initialDeliveryBoys = [
  {
    "id": "DBOY-01",
    "name": "Raju Kumar",
    "photo": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80",
    "phone": "+91 98480 12345",
    "secondaryPhone": "+91 98480 88776",
    "aadhaar": "5412 8901 2345",
    "address": "H.No 4-12, Near Kapila Theertham Temple, KT Road, Tirupati - 517501",
    "routeZone": "Route A (KT Road, Alipiri & Balaji Colony)",
    "assignedRouteId": "ROUTE-A",
    "assignedCustomerIds": [
      "CUST-001",
      "CUST-002",
      "CUST-003",
      "CUST-004",
      "CUST-005",
      "CUST-006",
      "CUST-007",
      "CUST-008",
      "CUST-009",
      "CUST-010",
      "CUST-011",
      "CUST-012",
      "CUST-013"
    ],
    "status": "Checked In",
    "checkedInTime": "07:15 AM",
    "checkedOutTime": null,
    "totalDeliveriesToday": 13,
    "completedDeliveries": 3,
    "carryingDabbas": [
      "DB-101",
      "DB-102",
      "DB-103",
      "DB-104",
      "DB-105"
    ],
    "collectedReturnDabbas": [
      "DB-098",
      "DB-099"
    ],
    "pendingCollectionCustomerIds": [
      "CUST-002",
      "CUST-005"
    ]
  },
  {
    "id": "DBOY-02",
    "name": "Suresh Reddy",
    "photo": "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&auto=format&fit=crop&q=80",
    "phone": "+91 94400 98765",
    "secondaryPhone": "+91 94400 33221",
    "aadhaar": "7823 4561 9087",
    "address": "Plot 24, Near Annamaiah Circle, AIR Bypass Road, Tirupati - 517502",
    "routeZone": "Route B (Bhavani Nagar, Korlagunta & AIR Bypass)",
    "assignedRouteId": "ROUTE-B",
    "assignedCustomerIds": [
      "CUST-014",
      "CUST-015",
      "CUST-016",
      "CUST-017",
      "CUST-018",
      "CUST-019",
      "CUST-020",
      "CUST-021",
      "CUST-022",
      "CUST-023",
      "CUST-024",
      "CUST-025"
    ],
    "status": "Checked In",
    "checkedInTime": "07:30 AM",
    "checkedOutTime": null,
    "totalDeliveriesToday": 12,
    "completedDeliveries": 2,
    "carryingDabbas": [
      "DB-114",
      "DB-115",
      "DB-116"
    ],
    "collectedReturnDabbas": [
      "DB-095"
    ],
    "pendingCollectionCustomerIds": [
      "CUST-015"
    ]
  },
  {
    "id": "DBOY-03",
    "name": "Mahesh Naidu",
    "photo": "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=200&auto=format&fit=crop&q=80",
    "phone": "+91 99880 44556",
    "secondaryPhone": "+91 99880 77889",
    "aadhaar": "4532 9012 7834",
    "address": "Flat 102, Padmavathi Enclave, MR Palli Circle, Tirupati - 517502",
    "routeZone": "Route C (MR Palli, Postal Colony & SV University)",
    "assignedRouteId": "ROUTE-C",
    "assignedCustomerIds": [
      "CUST-026",
      "CUST-027",
      "CUST-028",
      "CUST-029",
      "CUST-030",
      "CUST-031",
      "CUST-032",
      "CUST-033",
      "CUST-034",
      "CUST-035",
      "CUST-036",
      "CUST-037",
      "CUST-038"
    ],
    "status": "Checked In",
    "checkedInTime": "07:45 AM",
    "checkedOutTime": null,
    "totalDeliveriesToday": 13,
    "completedDeliveries": 1,
    "carryingDabbas": [
      "DB-126",
      "DB-127",
      "DB-128"
    ],
    "collectedReturnDabbas": [],
    "pendingCollectionCustomerIds": [
      "CUST-028"
    ]
  },
  {
    "id": "DBOY-04",
    "name": "Venkat Rao",
    "photo": "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&auto=format&fit=crop&q=80",
    "phone": "+91 97000 66778",
    "secondaryPhone": "+91 97000 11223",
    "aadhaar": "8901 2345 6712",
    "address": "H.No 12-8, Padmavathi Nagar, Mangalam Road, Tirupati - 517507",
    "routeZone": "Route D (Mangalam, Karakambadi & Renigunta Road)",
    "assignedRouteId": "ROUTE-D",
    "assignedCustomerIds": [
      "CUST-039",
      "CUST-040",
      "CUST-041",
      "CUST-042",
      "CUST-043",
      "CUST-044",
      "CUST-045",
      "CUST-046",
      "CUST-047",
      "CUST-048",
      "CUST-049",
      "CUST-050"
    ],
    "status": "Checked In",
    "checkedInTime": "08:00 AM",
    "checkedOutTime": null,
    "totalDeliveriesToday": 12,
    "completedDeliveries": 0,
    "carryingDabbas": [
      "DB-139",
      "DB-140"
    ],
    "collectedReturnDabbas": [],
    "pendingCollectionCustomerIds": [
      "CUST-040"
    ]
  }
];

export const initialKitchenStaff = [
  {
    "id": "KSTF-01",
    "name": "Ramesh Sharma",
    "photo": "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=200&auto=format&fit=crop&q=80",
    "phone": "+91 98490 22334",
    "secondaryPhone": "+91 98490 55443",
    "aadhaar": "3489 1276 5643",
    "address": "H.No 7-42, Tilak Road, Tirupati - 517501",
    "role": "Head Cook",
    "shift": "Morning (05:30 AM - 11:30 AM)",
    "station": "Hot Boiling & Legume Cooking",
    "status": "On Shift"
  },
  {
    "id": "KSTF-02",
    "name": "Lakshmi Devi",
    "photo": "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&auto=format&fit=crop&q=80",
    "phone": "+91 97010 33445",
    "secondaryPhone": "+91 97010 66778",
    "aadhaar": "9012 3456 7812",
    "address": "Plot 18, Srinivasa Nagar, Korlagunta, Tirupati - 517501",
    "role": "Prep Cook",
    "shift": "Morning (06:00 AM - 12:00 PM)",
    "station": "Sprouts Prep & Fruit Dicing",
    "status": "On Shift"
  },
  {
    "id": "KSTF-03",
    "name": "Sunil Verma",
    "photo": "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=200&auto=format&fit=crop&q=80",
    "phone": "+91 96520 44556",
    "secondaryPhone": "+91 96520 11223",
    "aadhaar": "6723 9081 4532",
    "address": "Flat 301, Balaji Residency, Alipiri Road, Tirupati - 517501",
    "role": "Packing Specialist",
    "shift": "Morning (06:30 AM - 12:30 PM)",
    "station": "Dabba Insulation & QR Tagging",
    "status": "On Shift"
  }
];

export const initialDailyMenu = {
  unsun: [
    { 
      id: "MNU-1", 
      name: "Moong & Alfalfa Sprouts Power Bowl", 
      category: "High Protein", 
      quantity: "250g", 
      weight: "250g",
      protein: "18g",
      price: 130,
      calories: "280 kcal",
      dietary: "Vegan & High Fiber",
      image: "https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=600&q=80",
      ingredients: "Sprouted Moong, Alfalfa, Pomegranate pearls, Persian Cucumber, Lemon Dressing, Pink Salt" 
    },
    { 
      id: "MNU-2", 
      name: "Diced Papaya & Crisp Cucumber Salad", 
      category: "Hydration & Fiber", 
      quantity: "180g", 
      weight: "180g",
      protein: "4g",
      price: 85,
      calories: "120 kcal",
      dietary: "100% Raw & Digestive",
      image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=600&q=80",
      ingredients: "Farm-Fresh Ripe Papaya, Persian Cucumber, Mint Leaves, Himalayan Rock Salt" 
    },
    { 
      id: "MNU-3", 
      name: "Organic Ragi & Sesame Millet Laddu", 
      category: "Iron & Energy", 
      quantity: "1 pc (40g)", 
      weight: "40g",
      protein: "6g",
      price: 45,
      calories: "160 kcal",
      dietary: "Gluten-Free Millet",
      image: "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=600&q=80",
      ingredients: "Sprouted Ragi flour, Organic Palm Jaggery, Toasted Black Sesame, A2 Cow Ghee" 
    },
    { 
      id: "MNU-4", 
      name: "Slow-Roasted Almonds & Kashmiri Walnuts", 
      category: "Healthy Fats", 
      quantity: "30g", 
      weight: "30g",
      protein: "7g",
      price: 75,
      calories: "190 kcal",
      dietary: "Heart Healthy Omega-3",
      image: "https://images.unsplash.com/photo-1508737027454-e6454ef45afd?auto=format&fit=crop&w=600&q=80",
      ingredients: "California Mamra Almonds, Kashmiri Snow Walnuts, Light Pink Salt" 
    }
  ],
  alternative2: [
    { 
      id: "MNU-5", 
      name: "Keto Boiled Chickpeas & Herb Paneer Salad", 
      category: "Keto Special", 
      quantity: "240g", 
      weight: "240g",
      protein: "22g",
      price: 155,
      calories: "340 kcal",
      dietary: "High Protein Vegetarian",
      image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80",
      ingredients: "Boiled Kabuli Chickpeas, Fresh Malai Paneer cubes, Oregano, Cold Pressed Olive Oil, Crushed Pepper" 
    },
    { 
      id: "MNU-6", 
      name: "Sprouted Fenugreek & Mixed Seeds Crunch Bowl", 
      category: "Enzyme Power", 
      quantity: "160g", 
      weight: "160g",
      protein: "14g",
      price: 120,
      calories: "220 kcal",
      dietary: "Diabetic Friendly",
      image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=600&q=80",
      ingredients: "Sprouted Methi, Pumpkin Seeds, Sunflower Seeds, Flaxseeds, Grated Coconut, Lemon Juice" 
    },
    { 
      id: "MNU-7", 
      name: "Hydrating Chia & Berry Coconut Milk Pudding", 
      category: "Dessert Delight", 
      quantity: "120g", 
      weight: "120g",
      protein: "5g",
      price: 110,
      calories: "210 kcal",
      dietary: "Superfood Vegan",
      image: "https://images.unsplash.com/photo-1490474418585-ba9bad8fd0ea?auto=format&fit=crop&w=600&q=80",
      ingredients: "Organic Black Chia Seeds, Cold Pressed Coconut Milk, Raw Forest Honey, Blueberries" 
    }
  ]
};

export const initialDabbas = [
  {
    "code": "DB-101",
    "status": "with_customer",
    "holder": "Srikanth Reddy (CUST-001)",
    "lastUpdate": "2026-11-02 11:30"
  },
  {
    "code": "DB-102",
    "status": "in_godown",
    "holder": "Godown Sanitized Rack",
    "lastUpdate": "2026-11-02 06:00"
  },
  {
    "code": "DB-103",
    "status": "in_godown",
    "holder": "Godown Sanitized Rack",
    "lastUpdate": "2026-11-02 06:00"
  },
  {
    "code": "DB-104",
    "status": "in_godown",
    "holder": "Godown Sanitized Rack",
    "lastUpdate": "2026-11-02 06:00"
  },
  {
    "code": "DB-105",
    "status": "with_customer",
    "holder": "Sai Krishna Naidu (CUST-005)",
    "lastUpdate": "2026-11-02 11:30"
  },
  {
    "code": "DB-106",
    "status": "with_customer",
    "holder": "Lakshmi Prasanna (CUST-006)",
    "lastUpdate": "2026-11-02 11:30"
  },
  {
    "code": "DB-107",
    "status": "in_godown",
    "holder": "Godown Sanitized Rack",
    "lastUpdate": "2026-11-02 06:00"
  },
  {
    "code": "DB-108",
    "status": "in_godown",
    "holder": "Godown Sanitized Rack",
    "lastUpdate": "2026-11-02 06:00"
  },
  {
    "code": "DB-109",
    "status": "with_customer",
    "holder": "Pavani Goud (CUST-009)",
    "lastUpdate": "2026-11-02 11:30"
  },
  {
    "code": "DB-110",
    "status": "in_godown",
    "holder": "Godown Sanitized Rack",
    "lastUpdate": "2026-11-02 06:00"
  },
  {
    "code": "DB-111",
    "status": "with_customer",
    "holder": "Sowmya Penubolu (CUST-011)",
    "lastUpdate": "2026-11-02 11:30"
  },
  {
    "code": "DB-112",
    "status": "in_godown",
    "holder": "Godown Sanitized Rack",
    "lastUpdate": "2026-11-02 06:00"
  },
  {
    "code": "DB-113",
    "status": "with_customer",
    "holder": "Divya Bharathi (CUST-013)",
    "lastUpdate": "2026-11-02 11:30"
  },
  {
    "code": "DB-114",
    "status": "in_godown",
    "holder": "Godown Sanitized Rack",
    "lastUpdate": "2026-11-02 06:00"
  },
  {
    "code": "DB-115",
    "status": "with_delivery",
    "holder": "Raju Kumar (DBOY-01) - Collected Return",
    "lastUpdate": "2026-11-02 12:15"
  },
  {
    "code": "DB-116",
    "status": "with_customer",
    "holder": "Pradeep Varma (CUST-016)",
    "lastUpdate": "2026-11-02 11:30"
  },
  {
    "code": "DB-117",
    "status": "with_customer",
    "holder": "Keerthi Vangaveeti (CUST-017)",
    "lastUpdate": "2026-11-02 11:30"
  },
  {
    "code": "DB-118",
    "status": "in_godown",
    "holder": "Godown Sanitized Rack",
    "lastUpdate": "2026-11-02 06:00"
  },
  {
    "code": "DB-119",
    "status": "in_godown",
    "holder": "Godown Sanitized Rack",
    "lastUpdate": "2026-11-02 06:00"
  },
  {
    "code": "DB-120",
    "status": "in_godown",
    "holder": "Godown Sanitized Rack",
    "lastUpdate": "2026-11-02 06:00"
  },
  {
    "code": "DB-121",
    "status": "with_customer",
    "holder": "Akhila Mudhiraj (CUST-021)",
    "lastUpdate": "2026-11-02 11:30"
  },
  {
    "code": "DB-122",
    "status": "in_godown",
    "holder": "Godown Sanitized Rack",
    "lastUpdate": "2026-11-02 06:00"
  },
  {
    "code": "DB-123",
    "status": "in_godown",
    "holder": "Godown Sanitized Rack",
    "lastUpdate": "2026-11-02 06:00"
  },
  {
    "code": "DB-124",
    "status": "in_godown",
    "holder": "Godown Sanitized Rack",
    "lastUpdate": "2026-11-02 06:00"
  },
  {
    "code": "DB-125",
    "status": "with_customer",
    "holder": "Usha Rani (CUST-025)",
    "lastUpdate": "2026-11-02 11:30"
  },
  {
    "code": "DB-126",
    "status": "with_customer",
    "holder": "Naveen Kumar (CUST-026)",
    "lastUpdate": "2026-11-02 11:30"
  },
  {
    "code": "DB-127",
    "status": "in_godown",
    "holder": "Godown Sanitized Rack",
    "lastUpdate": "2026-11-02 06:00"
  },
  {
    "code": "DB-128",
    "status": "in_godown",
    "holder": "Godown Sanitized Rack",
    "lastUpdate": "2026-11-02 06:00"
  },
  {
    "code": "DB-129",
    "status": "with_customer",
    "holder": "Geetha Govind (CUST-029)",
    "lastUpdate": "2026-11-02 11:30"
  },
  {
    "code": "DB-130",
    "status": "in_godown",
    "holder": "Godown Sanitized Rack",
    "lastUpdate": "2026-11-02 06:00"
  },
  {
    "code": "DB-131",
    "status": "with_customer",
    "holder": "Sirisha Chebrolu (CUST-031)",
    "lastUpdate": "2026-11-02 11:30"
  },
  {
    "code": "DB-132",
    "status": "in_godown",
    "holder": "Godown Sanitized Rack",
    "lastUpdate": "2026-11-02 06:00"
  },
  {
    "code": "DB-133",
    "status": "with_customer",
    "holder": "Chandana Priya (CUST-033)",
    "lastUpdate": "2026-11-02 11:30"
  },
  {
    "code": "DB-134",
    "status": "in_godown",
    "holder": "Godown Sanitized Rack",
    "lastUpdate": "2026-11-02 06:00"
  },
  {
    "code": "DB-135",
    "status": "in_godown",
    "holder": "Godown Sanitized Rack",
    "lastUpdate": "2026-11-02 06:00"
  },
  {
    "code": "DB-136",
    "status": "in_godown",
    "holder": "Godown Sanitized Rack",
    "lastUpdate": "2026-11-02 06:00"
  },
  {
    "code": "DB-137",
    "status": "with_customer",
    "holder": "Meena Kumari (CUST-037)",
    "lastUpdate": "2026-11-02 11:30"
  },
  {
    "code": "DB-138",
    "status": "in_godown",
    "holder": "Godown Sanitized Rack",
    "lastUpdate": "2026-11-02 06:00"
  },
  {
    "code": "DB-139",
    "status": "in_godown",
    "holder": "Godown Sanitized Rack",
    "lastUpdate": "2026-11-02 06:00"
  },
  {
    "code": "DB-140",
    "status": "in_godown",
    "holder": "Godown Sanitized Rack",
    "lastUpdate": "2026-11-02 06:00"
  },
  {
    "code": "DB-141",
    "status": "with_customer",
    "holder": "Deepthi Rayalu (CUST-041)",
    "lastUpdate": "2026-11-02 11:30"
  },
  {
    "code": "DB-142",
    "status": "in_godown",
    "holder": "Godown Sanitized Rack",
    "lastUpdate": "2026-11-02 06:00"
  },
  {
    "code": "DB-143",
    "status": "in_godown",
    "holder": "Godown Sanitized Rack",
    "lastUpdate": "2026-11-02 06:00"
  },
  {
    "code": "DB-144",
    "status": "in_godown",
    "holder": "Godown Sanitized Rack",
    "lastUpdate": "2026-11-02 06:00"
  },
  {
    "code": "DB-145",
    "status": "with_customer",
    "holder": "Ramadevi Kalvakuntla (CUST-045)",
    "lastUpdate": "2026-11-02 11:30"
  },
  {
    "code": "DB-146",
    "status": "with_customer",
    "holder": "Sandeep Chowdary (CUST-046)",
    "lastUpdate": "2026-11-02 11:30"
  },
  {
    "code": "DB-147",
    "status": "in_godown",
    "holder": "Godown Sanitized Rack",
    "lastUpdate": "2026-11-02 06:00"
  },
  {
    "code": "DB-148",
    "status": "in_godown",
    "holder": "Godown Sanitized Rack",
    "lastUpdate": "2026-11-02 06:00"
  },
  {
    "code": "DB-149",
    "status": "with_customer",
    "holder": "Lavanya Gudipati (CUST-049)",
    "lastUpdate": "2026-11-02 11:30"
  },
  {
    "code": "DB-150",
    "status": "in_godown",
    "holder": "Godown Sanitized Rack",
    "lastUpdate": "2026-11-02 06:00"
  }
];

export const initialKitchenInventory = [
  { id: "ING-1", name: "Fresh Cucumber", requiredToday: "18.5 kg", inStock: "45.0 kg", unit: "kg", status: "Adequate" },
  { id: "ING-2", name: "Ripe Papaya", requiredToday: "22.0 kg", inStock: "35.5 kg", unit: "kg", status: "Adequate" },
  { id: "ING-3", name: "Boiled Chickpeas & Lentils", requiredToday: "24.8 kg", inStock: "28.0 kg", unit: "kg", status: "Low Stock Alert" },
  { id: "ING-4", name: "Moong & Alfalfa Sprouts", requiredToday: "16.2 kg", inStock: "32.0 kg", unit: "kg", status: "Adequate" },
  { id: "ING-5", name: "Millet Laddus", requiredToday: "120 pcs", inStock: "180 pcs", unit: "pcs", status: "Adequate" },
  { id: "ING-6", name: "Roasted Almonds & Walnuts", requiredToday: "10.5 kg", inStock: "22.5 kg", unit: "kg", status: "Adequate" }
];

export const initialKitchenTasks = [
  { id: "TSK-1", task: "Boiling (Lentils, Chickpeas & Millets)", assignedTo: "Ramesh (Head Cook)", status: "Completed", timeSpent: "55 mins" },
  { id: "TSK-2", task: "Sprouts Prep & Sanitization", assignedTo: "Lakshmi (Prep Cook)", status: "Completed", timeSpent: "45 mins" },
  { id: "TSK-3", task: "Fruit & Vegetable Dicing", assignedTo: "Lakshmi (Prep Cook)", status: "In Progress", timeSpent: "60 mins" },
  { id: "TSK-4", task: "Meal Packing & QR Code Tagging (50 Boxes)", assignedTo: "Sunil (Packing Specialist)", status: "In Progress", timeSpent: "40 mins" },
  { id: "TSK-5", task: "Final Dispatch Quality Checklist", assignedTo: "Kitchen Manager", status: "Pending", timeSpent: "—" }
];

export const dispatchChecklist = [
  { id: "CHK-1", label: "All 50 meals packed in hygienic, sealed insulated dabbas", checked: true },
  { id: "CHK-2", label: "Special dietary notes verified (No onion / Allergies / Low salt)", checked: true },
  { id: "CHK-3", label: "QR codes scanned & mapped to 4 Tirupati delivery routes", checked: true },
  { id: "CHK-4", label: "Temperature & freshness audit completed", checked: true },
  { id: "CHK-5", label: "Biodegradable wooden cutlery & napkins attached", checked: false }
];
