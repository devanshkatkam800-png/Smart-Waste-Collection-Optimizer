# EcoRoute AI - Smart Waste Collection Optimizer

Production-quality municipal waste management and collection optimization platform built with **Next.js 14 (App Router)**, **TypeScript**, **Tailwind CSS**, **Prisma ORM**, and **Interactive Leaflet Mapping**.

Designed with a clean, municipal smart-city aesthetic inspired by modern municipal technology platforms (Rewaste Webflow Template).

---

## 🚀 Quick Start & Live Access

The application runs locally at:
**[http://localhost:3000](http://localhost:3000)**

### 🔐 Official Demo Credentials (Role-Based Access Control)
The platform enforces strict role-based routing. Authenticate using actual credentials:
- **Citizen (Aarav Mehta)**: `citizen@ecoroute.ai` / `password123` &rarr; [`/citizen`](http://localhost:3000/citizen)
- **Operations Admin (Officer Dave)**: `admin@ecoroute.ai` / `password123` &rarr; [`/admin`](http://localhost:3000/admin)
- **Field Worker (Carlos Rodriguez)**: `worker@ecoroute.ai` / `password123` &rarr; [`/worker`](http://localhost:3000/worker)

*(1-Click credential pre-fill helper buttons are available on the `/login` page).*

---

## 🌟 Key Features

### 1. Public Municipal Website (`/`)
- Minimalist 4-section layout:
  1. **Hero**: Headline, subtitle, municipal platform badge, and Sign In / Register CTAs.
  2. **Features**: 6 clean cards (Report Waste, AI Waste Detection, Smart Assignment, Route Optimization, Live Tracking, Hotspot Analytics).
  3. **How It Works**: 3-step workflow (Citizen Reports Waste &rarr; Admin Reviews & Assigns &rarr; Worker Collects & Uploads Proof).
  4. **Footer**: Municipal contact and privacy policy links.

### 2. Citizen Portal (`/citizen`)
- **AI Computer Vision Waste Classifier**: Categorizes waste into **Plastic**, **Organic**, **Paper**, **E-Waste**, or **Mixed** with confidence scores.
- **GPS Location Capture**: Captures HTML5 geolocation coordinates with map fallback.
- **Complaint Lifecycle Tracker**: Track complaints from `Pending` &rarr; `Assigned` &rarr; `Collected` with assigned worker details and photo proof verification.

### 3. Operations Admin Command Hub (`/admin`)
- **Operations Map & Fleet Telemetry**:
  - Priority Filter (`ALL`, `HIGH`, `MEDIUM`, `LOW`)
  - Status Filter (`ALL`, `PENDING`, `ASSIGNED`, `COLLECTED`)
  - Fleet Telemetry Toggle (`[x] Fleet Telemetry`)
  - Mumbai Hub Selectors (`All Mumbai`, `Dadar`, `Bandra W`, `Andheri W`, `Powai`, `Lower Parel`, `Sion`)
  - Color-coded Priority Pins (Red, Yellow, Green with scores)
  - Vehicle Telemetry Pins (🚚 Blue pins)
  - Live Assignment Tracking (interactive dashed vector connecting driver to pickup location)
- **AI Smart Auto-Assign**: Proximity-based dispatch using Haversine distance calculations and payload balancing.
- **Fleet Management**: Register drivers, update vehicle types, and adjust duty statuses.
- **Photo Proof Verification**: Inspect before and after cleanup photos before closing tickets.

### 4. Municipal Analytics & Predictions (`/admin/analytics`)
- **Top Waste Hotspots Table**: Dynamically ranks sectors using real database complaint records (Area, Complaint Count, Waste Type, Priority Level, Operational Status).
- **AI Prediction Summary Cards**: 3 predictive risk cards (High, Medium, Low Risk) forecasting waste surges (e.g., Dadar Market +55% produce surge, Bandra Promenade +32% plastic surge, Powai Sector +10% trend).
- **Visual Trends**: 7-day intake vs. resolution trends and citywide waste category breakdown.

### 5. Field Worker Mission Control (`/worker`)
- **Mobile-First Task View**: Review assigned missions with priority indicators, waste weights, and navigation links.
- **Duty Status Selector**: Switch between `ACTIVE`, `ON_DUTY`, and `OFFLINE`.
- **Proof-of-Collection Upload**: Take or upload cleanup photo to transition status to `COLLECTED`.

---

## 🛠️ Tech Stack

- **Framework**: Next.js 14 (App Router, Server Actions, API Route Handlers)
- **Language**: TypeScript
- **Styling**: Tailwind CSS, Lucide React Icons
- **Database & ORM**: Prisma ORM with SQLite
- **Authentication**: JWT Cookie Session Auth with Edge Middleware Route Guards
- **Mapping**: Leaflet with OpenStreetMap Carto tiles
- **Analytics**: Custom SVG / Canvas Responsive Charts

---

## 📦 Setup & Development

```bash
# Install dependencies
npm install

# Setup database & run migrations
npx prisma db push

# Seed baseline demo complaints (Andheri West, Bandra West, Powai)
node scripts/seed.mjs

# Start development server
npm run dev

# Or build and start for production
npm run build
npm start
```
