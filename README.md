# 🍱 Healthi Dabba — Zero-Loss Circular Tiffin Delivery & Logistics OS

A comprehensive, production-grade cloud operating system for healthy meal subscription delivery, circular stainless-steel dabba fleet tracking, automated next-day returns, and intelligent route navigation.

---

## 🌟 Key Features

### 1. 📅 3 Subscription Plans & Automated Next-Day Dabba Pickups
- **UNSUN — Alternate Days (Mon, Wed, Fri):** Balanced nutrition meal box. Delivers Mon/Wed/Fri; automatically schedules empty dabba collection on Tue/Thu/Sat mornings.
- **Alternative-2 — Alternate Days (Tue, Thu, Sat):** Keto & Sprout energy box. Delivers Tue/Thu/Sat; schedules empty dabba collection on Wed/Fri/Mon (Saturday delivery collects on Monday due to Sunday kitchen leave).
- **One Day Meal (Custom Specific Day):** Single-meal box where customers can pick any day (Mon–Sat, Sunday kitchen leave is disabled).
- **Automated Next-Day Pickup Workflow:** When a meal is delivered (`Monday`), the system automatically computes and flags an upcoming pickup for `Tuesday` in the customer profile, driver stop card, and admin manifest.

### 2. 🏷️ Zero-Loss QR Dabba Fleet Tracking
- **Physical Laser-Etched QR Verification:** Each insulated stainless-steel box (`DB-101` to `DB-150`) has a unique digital passport.
- **Apple-Style Camera Scanner:** Integrated viewfinder with laser sweep, instant audio-visual checkmark, quick test simulation buttons, and manual fallback entry.
- **Custody Handshake:** Tracks status transitions: `in_godown` ➔ `with_delivery` ➔ `with_customer` ➔ `washing` ➔ `in_godown`.
- **Godown Intake Verification:** Delivery drivers can batch-transfer or scan individual returned boxes directly at the kitchen godown desk.
- **Unreturned Box Radar:** Flags customers holding boxes for > 2 days with 1-tap WhatsApp nudge.

### 3. 🗺️ Turn-by-Turn Route Navigation & Leaflet Road Engine
- **Central Kitchen Godown:** Located at Annamaiah Circle, AIR Bypass Road, Tirupati.
- **4 Delivery Routes (50 Real Tirupati Stops):**
  - **Route A:** KT Road, Kapila Theertham, Alipiri Foot Steps, Balaji Colony & ISKCON Temple Road.
  - **Route B:** Bhavani Nagar, Korlagunta, AIR Bypass Road, Annamaiah Circle & RTC Bus Stand.
  - **Route C:** MR Palli Circle, Postal Colony, Chandragiri Bypass, SVIMS & SV University.
  - **Route D:** Padmavathi Nagar, Mangalam, Akkarampalli, Karakambadi Road & Settipalli.
- **Real Road Curves (OSRM Engine):** Visualizes driving turns along actual streets instead of straight lines, with 1-tap Google Maps integration.

### 4. 👥 Unified Multi-Role Portals
- **Customer Portal:** Dietary customization, live delivery timeline, pause/leave planner, and Dabba Circulation Passport.
- **Admin Control Tower:** Customer CRUD, route re-ordering, QR accountability ledger, and 1-tap WhatsApp driver task dispatcher.
- **Delivery Driver Portal:** Turn-by-turn stop manifest, 1-tap call & WhatsApp navigation, unreturned radar, and warehouse check-in.
- **Kitchen Operations:** Personalized dish allotment manifest, hygiene checklists, and inventory management.

---

## 🛠️ Tech Stack
- **Framework:** React 18 (Vite)
- **Styling:** Tailwind CSS (Apple Human Interface Design Guidelines)
- **Maps:** Leaflet & OpenStreetMap / Esri Satellite Imagery + OSRM Routing
- **Icons:** Lucide React
- **Typography:** SF Pro / Inter Clean Typography

---

## 🚀 Getting Started Locally

```bash
# 1. Clone the repository
git clone https://github.com/george77-create/healthi-dabba.git

# 2. Navigate to project directory
cd healthi-dabba

# 3. Install dependencies
npm install

# 4. Start the development server
npm run dev
```

Visit `http://localhost:3000/` in your browser.

---

## 📜 License
Private & Proprietary — Healthi Dabba System.
