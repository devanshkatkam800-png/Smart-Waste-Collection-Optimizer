"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Camera,
  Cpu,
  Truck,
  Navigation,
  Activity,
  BarChart3,
  ArrowRight,
  CheckCircle2,
  Leaf,
  ShieldCheck,
  Sparkles,
  MapPin,
  Clock,
  Send,
  Building,
  Mail,
  Phone,
  Recycle,
  Layers,
  ChevronRight,
} from "lucide-react";

// Animated Counter Component
function AnimatedCounter({ end, duration = 1500, suffix = "" }: { end: number; duration?: number; suffix?: string }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTimestamp: number | null = null;
    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      const current = Math.floor(progress * (2 - progress) * end);
      setCount(current);
      if (progress < 1) {
        window.requestAnimationFrame(step);
      }
    };
    window.requestAnimationFrame(step);
  }, [end, duration]);

  return (
    <span>
      {count.toLocaleString()}
      {suffix}
    </span>
  );
}

export default function HomePage() {
  const [contactSubmitted, setContactSubmitted] = useState(false);
  const [contactForm, setContactForm] = useState({ name: "", email: "", subject: "", message: "" });

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setContactSubmitted(true);
    setTimeout(() => {
      setContactSubmitted(false);
      setContactForm({ name: "", email: "", subject: "", message: "" });
    }, 4000);
  };

  const features = [
    {
      title: "Citizen Geo-Reporting",
      desc: "Residents report waste accumulations instantly with geotagged photo capture and real-time municipal status verification.",
      icon: Camera,
      tag: "Civic Mobile",
    },
    {
      title: "Computer Vision AI Detection",
      desc: "Automated neural models inspect uploaded imagery, categorizing waste types (Organic, Plastic, E-Waste) with calculated severity scores.",
      icon: Cpu,
      tag: "AI Analysis",
    },
    {
      title: "Automated Haversine Dispatch",
      desc: "Dynamic dispatch algorithm pairs high-priority tickets with nearby field crews based on vehicle capacity and payload limits.",
      icon: Truck,
      tag: "Smart Dispatch",
    },
    {
      title: "Turn-by-Turn Route Optimization",
      desc: "Calculates optimal collection routes across urban sectors, trimming municipal fuel burn and slashing transit delays.",
      icon: Navigation,
      tag: "Eco Routing",
    },
    {
      title: "Real-Time Fleet Telemetry",
      desc: "Live interactive tracking of municipal service vehicles, complaint resolutions, and field operative mission status.",
      icon: Activity,
      tag: "Operations Hub",
    },
    {
      title: "Predictive Hotspot Analytics",
      desc: "City-wide historical risk forecasting alerts municipal leadership to recurring surge zones before waste overflows occur.",
      icon: BarChart3,
      tag: "Predictive AI",
    },
  ];

  const steps = [
    {
      number: "01",
      title: "Complaint",
      subtitle: "Citizen Geo-Report",
      desc: "A resident captures photo proof and tags precise GPS coordinates of uncollected waste through the citizen portal.",
      icon: Camera,
      badge: "Instant Submission",
    },
    {
      number: "02",
      title: "AI Analysis",
      subtitle: "Classification & Priority",
      desc: "Computer vision detects material composition, assesses health hazard severity, and assigns an algorithmic urgency score.",
      icon: Cpu,
      badge: "Zero-Latency Vision",
    },
    {
      number: "03",
      title: "Route Assignment",
      subtitle: "Haversine Proximity Match",
      desc: "The dispatch engine pairs the complaint with the closest capable collection crew and plots an optimal, low-emission route.",
      icon: Navigation,
      badge: "Dynamic Scheduling",
    },
    {
      number: "04",
      title: "Collection",
      subtitle: "Verified Proof of Clearance",
      desc: "Field operatives complete the mission, snap before/after photographic proof, and mark the municipal incident closed.",
      icon: CheckCircle2,
      badge: "Public Audit Trail",
    },
  ];

  return (
    <div className="bg-white min-h-screen text-slate-900 selection:bg-emerald-500 selection:text-white">
      {/* ====================================================
          1. HERO SECTION (Rewaste-inspired Clean Canvas & Custom SVG Illustration)
          ==================================================== */}
      <section className="relative pt-12 pb-20 sm:pt-20 sm:pb-32 px-4 sm:px-6 lg:px-8 border-b border-slate-100 overflow-hidden">
        {/* Subtle top radial gradient */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-b from-emerald-50/50 via-teal-50/20 to-transparent -z-10 pointer-events-none" />

        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-emerald-50 border border-emerald-200/80 text-emerald-800 text-xs font-semibold shadow-xs">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>Sustainable Smart City Infrastructure</span>
              </div>

              <div className="space-y-3">
                <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-slate-900 leading-[1.1]">
                  EcoRoute <span className="text-emerald-600">AI</span>
                </h1>
                <p className="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-800 tracking-tight">
                  Smart Waste Collection Optimizer
                </p>
              </div>

              <p className="max-w-2xl mx-auto lg:mx-0 text-base sm:text-lg text-slate-600 leading-relaxed font-normal">
                Empowering municipal corporations and civic communities with AI-driven waste detection, dynamic proximity dispatch, and real-time route optimization for cleaner, zero-backlog cities.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3.5 pt-2">
                <Link
                  href="/login"
                  className="px-7 py-3.5 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm transition-all shadow-sm hover:shadow-emerald-600/20 flex items-center gap-2 group"
                >
                  <span>Report Waste / Sign In</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>

                <a
                  href="#how-it-works"
                  className="px-7 py-3.5 rounded-full bg-white hover:bg-slate-50 text-slate-700 font-bold text-sm transition-all border border-slate-200 shadow-xs hover:border-slate-300"
                >
                  How It Works
                </a>

                <a
                  href="#impact"
                  className="px-5 py-3.5 rounded-full text-slate-600 hover:text-emerald-700 font-semibold text-sm transition-colors flex items-center gap-1.5"
                >
                  <span>View Impact</span>
                  <ChevronRight className="w-4 h-4" />
                </a>
              </div>

              {/* Trust Badges */}
              <div className="pt-6 border-t border-slate-100 flex flex-wrap items-center justify-center lg:justify-start gap-6 text-xs text-slate-500 font-medium">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Real-time GPS Tracking</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Verified Photo Proof</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Zero-Emission Routing</span>
                </div>
              </div>
            </div>

            {/* Right: Modern Waste Management Illustration */}
            <div className="lg:col-span-5 flex justify-center">
              <div className="relative w-full max-w-lg">
                <div className="relative bg-gradient-to-b from-emerald-50/60 to-white rounded-3xl p-6 sm:p-8 border border-emerald-100 shadow-[0_12px_40px_rgb(0,0,0,0.06)]">
                  {/* Floating Telemetry Tag */}
                  <div className="absolute -top-3.5 right-6 bg-white px-3.5 py-1.5 rounded-full border border-emerald-200 shadow-xs flex items-center gap-2 text-[11px] font-bold text-emerald-800">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                    <span>Live Municipal Telemetry</span>
                  </div>

                  {/* Clean SVG Vector Illustration */}
                  <svg
                    viewBox="0 0 500 380"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-full h-auto drop-shadow-xs"
                  >
                    {/* Sky & Sun Background */}
                    <circle cx="410" cy="70" r="32" fill="#FEF3C7" />
                    <circle cx="410" cy="70" r="22" fill="#FDE68A" />

                    {/* Modern City Buildings in Background */}
                    <rect x="50" y="90" width="44" height="150" rx="4" fill="#E2E8F0" />
                    <rect x="60" y="105" width="8" height="12" rx="1" fill="#FFFFFF" />
                    <rect x="76" y="105" width="8" height="12" rx="1" fill="#FFFFFF" />
                    <rect x="60" y="130" width="8" height="12" rx="1" fill="#FFFFFF" />
                    <rect x="76" y="130" width="8" height="12" rx="1" fill="#FFFFFF" />
                    <rect x="60" y="155" width="8" height="12" rx="1" fill="#FFFFFF" />
                    <rect x="76" y="155" width="8" height="12" rx="1" fill="#FFFFFF" />

                    <rect x="106" y="60" width="60" height="180" rx="4" fill="#CBD5E1" />
                    <rect x="120" y="75" width="10" height="14" rx="1" fill="#F1F5F9" />
                    <rect x="142" y="75" width="10" height="14" rx="1" fill="#F1F5F9" />
                    <rect x="120" y="105" width="10" height="14" rx="1" fill="#F1F5F9" />
                    <rect x="142" y="105" width="10" height="14" rx="1" fill="#F1F5F9" />
                    <rect x="120" y="135" width="10" height="14" rx="1" fill="#F1F5F9" />
                    <rect x="142" y="135" width="10" height="14" rx="1" fill="#F1F5F9" />
                    <rect x="120" y="165" width="10" height="14" rx="1" fill="#F1F5F9" />
                    <rect x="142" y="165" width="10" height="14" rx="1" fill="#F1F5F9" />

                    {/* Solar Roof on Central Command */}
                    <polygon points="106,60 136,44 166,60" fill="#059669" />

                    <rect x="350" y="100" width="55" height="140" rx="4" fill="#E2E8F0" />
                    <rect x="364" y="115" width="10" height="12" rx="1" fill="#FFFFFF" />
                    <rect x="382" y="115" width="10" height="12" rx="1" fill="#FFFFFF" />
                    <rect x="364" y="140" width="10" height="12" rx="1" fill="#FFFFFF" />
                    <rect x="382" y="140" width="10" height="12" rx="1" fill="#FFFFFF" />

                    {/* Green Canopy / Trees */}
                    <circle cx="195" cy="225" r="26" fill="#10B981" />
                    <circle cx="215" cy="215" r="20" fill="#059669" />
                    <rect x="202" y="225" width="6" height="22" rx="2" fill="#78350F" />

                    {/* Clean Paved Road */}
                    <path
                      d="M20 280 Q 250 270 480 280 L 480 340 L 20 340 Z"
                      fill="#334155"
                    />
                    {/* Road Markings */}
                    <line x1="50" y1="310" x2="100" y2="310" stroke="#F8FAFC" strokeWidth="3" strokeDasharray="8 8" />
                    <line x1="140" y1="310" x2="220" y2="310" stroke="#F8FAFC" strokeWidth="3" strokeDasharray="8 8" />
                    <line x1="260" y1="310" x2="360" y2="310" stroke="#F8FAFC" strokeWidth="3" strokeDasharray="8 8" />
                    <line x1="400" y1="310" x2="470" y2="310" stroke="#F8FAFC" strokeWidth="3" strokeDasharray="8 8" />

                    {/* Route Optimization Digital Trajectory line */}
                    <path
                      d="M 60 260 C 140 220, 240 260, 310 240"
                      stroke="#10B981"
                      strokeWidth="2.5"
                      strokeDasharray="5 5"
                    />
                    <circle cx="60" cy="260" r="5" fill="#10B981" />
                    <circle cx="310" cy="240" r="6" fill="#059669" />

                    {/* Modern Electric Waste Collection Truck */}
                    <g transform="translate(180, 220)">
                      {/* Truck Cargo Body */}
                      <rect x="0" y="10" width="120" height="60" rx="8" fill="#059669" />
                      <rect x="15" y="20" width="90" height="20" rx="4" fill="#047857" />
                      <text x="32" y="34" fill="#ECFDF5" fontSize="11" fontWeight="bold" fontFamily="sans-serif">
                        EcoRoute AI
                      </text>

                      {/* Recycle Symbol on Truck */}
                      <circle cx="60" cy="52" r="9" fill="#10B981" />
                      <path d="M 57 50 L 63 50 L 60 55 Z" fill="#FFFFFF" />

                      {/* Truck Cab */}
                      <path
                        d="M 120 28 L 150 28 C 156 28 160 32 160 38 L 160 70 L 120 70 Z"
                        fill="#0F172A"
                      />
                      {/* Windshield */}
                      <path
                        d="M 126 34 L 146 34 C 150 34 153 37 153 41 L 153 50 L 126 50 Z"
                        fill="#93C5FD"
                      />

                      {/* Headlight */}
                      <circle cx="158" cy="60" r="3" fill="#FDE047" />

                      {/* Wheels */}
                      <circle cx="28" cy="72" r="14" fill="#1E293B" />
                      <circle cx="28" cy="72" r="6" fill="#94A3B8" />

                      <circle cx="95" cy="72" r="14" fill="#1E293B" />
                      <circle cx="95" cy="72" r="6" fill="#94A3B8" />

                      <circle cx="140" cy="72" r="14" fill="#1E293B" />
                      <circle cx="140" cy="72" r="6" fill="#94A3B8" />
                    </g>

                    {/* Modern Smart Sorting Bins on Curbside */}
                    {/* Organic Bin */}
                    <rect x="360" y="235" width="20" height="34" rx="3" fill="#16A34A" />
                    <rect x="358" y="232" width="24" height="4" rx="2" fill="#15803D" />
                    <text x="365" y="255" fill="#FFFFFF" fontSize="8" fontWeight="bold">ORG</text>

                    {/* Plastic Recyclable Bin */}
                    <rect x="390" y="235" width="20" height="34" rx="3" fill="#2563EB" />
                    <rect x="388" y="232" width="24" height="4" rx="2" fill="#1D4ED8" />
                    <text x="395" y="255" fill="#FFFFFF" fontSize="8" fontWeight="bold">REC</text>

                    {/* E-Waste Bin */}
                    <rect x="420" y="235" width="20" height="34" rx="3" fill="#D97706" />
                    <rect x="418" y="232" width="24" height="4" rx="2" fill="#B45309" />
                    <text x="424" y="255" fill="#FFFFFF" fontSize="8" fontWeight="bold">E-W</text>

                    {/* Citizen Reporting Hologram / Geotag Marker */}
                    <g transform="translate(60, 215)">
                      <circle cx="0" cy="0" r="16" fill="#ECFDF5" stroke="#10B981" strokeWidth="2" />
                      <circle cx="0" cy="0" r="6" fill="#059669" />
                      <line x1="0" y1="16" x2="0" y2="40" stroke="#10B981" strokeWidth="2" />
                    </g>
                  </svg>

                  {/* Micro Footer inside Illustration Card */}
                  <div className="mt-4 pt-3 border-t border-emerald-100/80 flex items-center justify-between text-xs text-slate-600">
                    <span className="font-semibold text-emerald-800">Dynamic Sector Optimization</span>
                    <span className="font-mono text-[11px] text-slate-500">Haversine Dispatch Active</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ====================================================
          2. IMPACT STATISTICS SECTION (Animated Counters & Rewaste Styling)
          ==================================================== */}
      <section id="impact" className="py-20 sm:py-28 px-4 sm:px-6 lg:px-8 border-b border-slate-100 bg-white">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider bg-emerald-50 px-3.5 py-1.5 rounded-full border border-emerald-200/80">
              Measurable Civic Impact
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Driven by Data, Validated by Results
            </h2>
            <p className="text-sm sm:text-base text-slate-600">
              Real-time operational benchmarks achieved across smart municipal deployment zones.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Stat Card 1 */}
            <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.03)] hover:border-emerald-200 hover:shadow-md transition-all">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center mb-6">
                <Recycle className="w-6 h-6" />
              </div>
              <div className="text-4xl sm:text-5xl font-black text-slate-900 tracking-tight mb-2">
                <AnimatedCounter end={14850} suffix="+" />
              </div>
              <h3 className="text-sm font-bold text-slate-800 mb-1">Tons Waste Collected</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Diverted systematically into segregated processing facilities.
              </p>
            </div>

            {/* Stat Card 2 */}
            <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.03)] hover:border-emerald-200 hover:shadow-md transition-all">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center mb-6">
                <Navigation className="w-6 h-6" />
              </div>
              <div className="text-4xl sm:text-5xl font-black text-emerald-600 tracking-tight mb-2">
                <AnimatedCounter end={98} suffix=".4%" />
              </div>
              <h3 className="text-sm font-bold text-slate-800 mb-1">Routes Optimized</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Haversine dispatch shortening turnaround response times.
              </p>
            </div>

            {/* Stat Card 3 */}
            <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.03)] hover:border-emerald-200 hover:shadow-md transition-all">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center mb-6">
                <Leaf className="w-6 h-6" />
              </div>
              <div className="text-4xl sm:text-5xl font-black text-slate-900 tracking-tight mb-2">
                <AnimatedCounter end={420} suffix=" MT" />
              </div>
              <h3 className="text-sm font-bold text-slate-800 mb-1">CO₂e Emissions Reduced</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Fuel savings achieved through intelligent dynamic grouping.
              </p>
            </div>

            {/* Stat Card 4 */}
            <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.03)] hover:border-emerald-200 hover:shadow-md transition-all">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center mb-6">
                <Building className="w-6 h-6" />
              </div>
              <div className="text-4xl sm:text-5xl font-black text-slate-900 tracking-tight mb-2">
                <AnimatedCounter end={24} suffix=" Zones" />
              </div>
              <h3 className="text-sm font-bold text-slate-800 mb-1">Municipal Sectors</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Continuous active coverage and live citizen telemetry.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ====================================================
          3. FEATURES SECTION (Card-based Layout with Light Green Accents)
          ==================================================== */}
      <section id="features" className="py-24 sm:py-32 px-4 sm:px-6 lg:px-8 border-b border-slate-100 bg-white">
        <div className="max-w-7xl mx-auto space-y-16">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider bg-emerald-50 px-3.5 py-1.5 rounded-full border border-emerald-200/80">
              Core Capabilities
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Engineered for Modern Smart Cities
            </h2>
            <p className="text-sm sm:text-base text-slate-600">
              Six synchronized modules designed to replace chaotic waste queues with automated precision.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((item, idx) => {
              const Icon = item.icon;
              return (
                <div
                  key={idx}
                  className="bg-white rounded-3xl p-8 border border-slate-100 shadow-[0_4px_25px_rgb(0,0,0,0.03)] hover:border-emerald-400/80 hover:shadow-[0_12px_35px_rgba(5,150,105,0.08)] transition-all group flex flex-col justify-between"
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center group-hover:scale-105 group-hover:bg-emerald-600 group-hover:text-white transition-all shadow-xs">
                        <Icon className="w-7 h-7" />
                      </div>
                      <span className="text-[11px] font-bold text-emerald-800 bg-emerald-50/80 px-3 py-1 rounded-full border border-emerald-200/60">
                        {item.tag}
                      </span>
                    </div>

                    <h3 className="text-lg font-bold text-slate-900 group-hover:text-emerald-700 transition-colors">
                      {item.title}
                    </h3>

                    <p className="text-sm text-slate-600 leading-relaxed font-normal">
                      {item.desc}
                    </p>
                  </div>

                  <div className="pt-6 mt-6 border-t border-slate-100 flex items-center text-xs font-bold text-emerald-700 group-hover:translate-x-1 transition-transform">
                    <span>Explore module</span>
                    <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ====================================================
          4. HOW IT WORKS (Step-by-step Timeline: Complaint -> AI Analysis -> Route Assignment -> Collection)
          ==================================================== */}
      <section id="how-it-works" className="py-24 sm:py-32 px-4 sm:px-6 lg:px-8 border-b border-slate-100 bg-white">
        <div className="max-w-7xl mx-auto space-y-16">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider bg-emerald-50 px-3.5 py-1.5 rounded-full border border-emerald-200/80">
              Operational Workflow
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              From Citizen Report to Verified Collection
            </h2>
            <p className="text-sm sm:text-base text-slate-600">
              Four streamlined steps delivering automated municipal sanitation and transparent civic accountability.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative">
            {steps.map((s, idx) => {
              const Icon = s.icon;
              return (
                <div
                  key={idx}
                  className="bg-white rounded-3xl p-8 border border-slate-100 shadow-[0_4px_25px_rgb(0,0,0,0.03)] hover:border-emerald-300 transition-all flex flex-col justify-between relative group"
                >
                  {/* Top Step Pill */}
                  <div>
                    <div className="flex items-center justify-between mb-6">
                      <span className="text-3xl font-black text-emerald-600/30 group-hover:text-emerald-600 font-mono transition-colors">
                        {s.number}
                      </span>
                      <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
                        <Icon className="w-5 h-5" />
                      </div>
                    </div>

                    <div className="space-y-1 mb-3">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 block">
                        Step {idx + 1}
                      </span>
                      <h3 className="text-lg font-bold text-slate-900">
                        {s.title}
                      </h3>
                      <p className="text-xs font-medium text-slate-400">
                        {s.subtitle}
                      </p>
                    </div>

                    <p className="text-xs text-slate-600 leading-relaxed">
                      {s.desc}
                    </p>
                  </div>

                  <div className="pt-6 mt-6 border-t border-slate-100">
                    <span className="text-[11px] font-semibold text-slate-500 bg-slate-50 px-2.5 py-1 rounded-md border border-slate-200/60 block text-center">
                      {s.badge}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ====================================================
          5. ABOUT SECTION (Rewaste-inspired Sustainability Mission)
          ==================================================== */}
      <section id="about" className="py-24 sm:py-32 px-4 sm:px-6 lg:px-8 border-b border-slate-100 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Narrative */}
            <div className="lg:col-span-6 space-y-6">
              <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider bg-emerald-50 px-3.5 py-1.5 rounded-full border border-emerald-200/80">
                About EcoRoute AI
              </span>

              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
                Modernizing Urban Sanitation Through Intelligent Automation
              </h2>

              <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                Traditional municipal waste systems struggle with fragmented reporting, unoptimized diesel-heavy collection routes, and zero visibility into collection integrity.
              </p>

              <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                EcoRoute AI was built to solve these challenges at municipal scale. By harmonizing computer vision categorization, proximity-based dynamic dispatching, and cryptographic photographic verification, our platform bridges citizens directly with municipal operations teams.
              </p>

              {/* Three Value Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                <div className="p-4 rounded-2xl bg-emerald-50/50 border border-emerald-100 space-y-1">
                  <div className="font-bold text-sm text-slate-900">Zero Backlog</div>
                  <div className="text-xs text-slate-600">Auto-prioritizes high density overflows</div>
                </div>
                <div className="p-4 rounded-2xl bg-emerald-50/50 border border-emerald-100 space-y-1">
                  <div className="font-bold text-sm text-slate-900">Data-Driven</div>
                  <div className="text-xs text-slate-600">Predicts hotspots with historical models</div>
                </div>
                <div className="p-4 rounded-2xl bg-emerald-50/50 border border-emerald-100 space-y-1">
                  <div className="font-bold text-sm text-slate-900">Full Audit</div>
                  <div className="text-xs text-slate-600">Photo verification on every collection</div>
                </div>
              </div>
            </div>

            {/* Right Visual Card */}
            <div className="lg:col-span-6">
              <div className="bg-gradient-to-tr from-emerald-600 to-teal-700 rounded-3xl p-8 sm:p-12 text-white shadow-xl relative overflow-hidden space-y-6">
                <div className="relative z-10 space-y-4">
                  <div className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center text-white border border-white/20">
                    <Leaf className="w-6 h-6" />
                  </div>
                  <h3 className="text-2xl font-bold tracking-tight">
                    Committed to Circular Urban Ecosystems
                  </h3>
                  <p className="text-sm text-emerald-50/90 leading-relaxed font-normal">
                    By eliminating unnecessary transit miles and accelerating the segregation of recyclables and hazardous e-waste, EcoRoute AI acts as the operational heartbeat of resilient smart cities.
                  </p>
                </div>

                <div className="relative z-10 pt-4 border-t border-white/20 flex flex-wrap items-center justify-between gap-4 text-xs font-semibold">
                  <span>Municipal Operations Command</span>
                  <Link
                    href="/login"
                    className="px-4 py-2 rounded-full bg-white text-emerald-800 hover:bg-emerald-50 transition-colors shadow-xs"
                  >
                    Enter Portal
                  </Link>
                </div>

                {/* Subtle pattern background */}
                <div className="absolute -bottom-10 -right-10 w-64 h-64 bg-white/5 rounded-full blur-2xl pointer-events-none" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ====================================================
          6. CONTACT SECTION (Municipal Operations Inquiry & Direct Hotline)
          ==================================================== */}
      <section id="contact" className="py-24 sm:py-32 px-4 sm:px-6 lg:px-8 border-b border-slate-100 bg-white">
        <div className="max-w-7xl mx-auto space-y-16">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider bg-emerald-50 px-3.5 py-1.5 rounded-full border border-emerald-200/80">
              Operations & Inquiries
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Connect With Municipal Operations
            </h2>
            <p className="text-sm sm:text-base text-slate-600">
              For ward partnerships, emergency sanitation dispatches, or platform onboarding.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left Contact Information */}
            <div className="lg:col-span-5 space-y-6">
              <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-[0_4px_25px_rgb(0,0,0,0.03)] space-y-6">
                <h3 className="text-lg font-bold text-slate-900">
                  Municipal Command Center
                </h3>

                <div className="space-y-4 text-xs text-slate-600">
                  <div className="flex items-start gap-3.5">
                    <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
                      <Mail className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="font-bold text-slate-800">Direct Dispatch Email</div>
                      <div className="font-mono text-slate-600 mt-0.5">dispatch@ecoroute.ai</div>
                    </div>
                  </div>

                  <div className="flex items-start gap-3.5">
                    <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
                      <Phone className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="font-bold text-slate-800">24/7 Operations Hotline</div>
                      <div className="font-mono text-slate-600 mt-0.5">+91 22 2430 1122</div>
                    </div>
                  </div>

                  <div className="flex items-start gap-3.5">
                    <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
                      <MapPin className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="font-bold text-slate-800">Headquarters</div>
                      <div className="text-slate-600 mt-0.5">Municipal Operations Command, Mumbai, Maharashtra 400001</div>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100">
                  <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-200/80 text-xs text-emerald-900">
                    <span className="font-bold block mb-1">Emergency Waste Hazard?</span>
                    Citizens can immediately submit high-risk complaints via the citizen dashboard for priority routing.
                  </div>
                </div>
              </div>
            </div>

            {/* Right Contact Form */}
            <div className="lg:col-span-7">
              <div className="bg-white rounded-3xl p-8 sm:p-10 border border-slate-100 shadow-[0_4px_25px_rgb(0,0,0,0.03)]">
                {contactSubmitted ? (
                  <div className="py-12 text-center space-y-3">
                    <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
                      <CheckCircle2 className="w-6 h-6" />
                    </div>
                    <h4 className="text-lg font-bold text-slate-900">Message Received</h4>
                    <p className="text-xs text-slate-600 max-w-sm mx-auto">
                      Thank you for contacting EcoRoute AI. A municipal operations coordinator will review your inquiry shortly.
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleContactSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs font-bold text-slate-800 block mb-1.5">
                          Your Full Name
                        </label>
                        <input
                          type="text"
                          required
                          value={contactForm.name}
                          onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                          placeholder="e.g. Officer Dave or Citizen Aarav"
                          className="w-full text-xs font-medium rounded-xl border border-slate-200 px-3.5 py-2.5 focus:ring-2 focus:ring-emerald-500 focus:outline-none transition-all"
                        />
                      </div>

                      <div>
                        <label className="text-xs font-bold text-slate-800 block mb-1.5">
                          Official Email
                        </label>
                        <input
                          type="email"
                          required
                          value={contactForm.email}
                          onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                          placeholder="name@municipal.gov.in"
                          className="w-full text-xs font-medium rounded-xl border border-slate-200 px-3.5 py-2.5 focus:ring-2 focus:ring-emerald-500 focus:outline-none transition-all"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-xs font-bold text-slate-800 block mb-1.5">
                        Subject / Ward Inquiry
                      </label>
                      <input
                        type="text"
                        required
                        value={contactForm.subject}
                        onChange={(e) => setContactForm({ ...contactForm, subject: e.target.value })}
                        placeholder="e.g. Smart bin sensor telemetry inquiry"
                        className="w-full text-xs font-medium rounded-xl border border-slate-200 px-3.5 py-2.5 focus:ring-2 focus:ring-emerald-500 focus:outline-none transition-all"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-bold text-slate-800 block mb-1.5">
                        Message Details
                      </label>
                      <textarea
                        rows={4}
                        required
                        value={contactForm.message}
                        onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                        placeholder="Provide details regarding your inquiry or municipal requirements..."
                        className="w-full text-xs font-medium rounded-xl border border-slate-200 p-3.5 focus:ring-2 focus:ring-emerald-500 focus:outline-none transition-all resize-none"
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full py-3.5 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition-all shadow-xs flex items-center justify-center gap-2 group"
                    >
                      <Send className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                      <span>Transmit Message to Operations</span>
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
