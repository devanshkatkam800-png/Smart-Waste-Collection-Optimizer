"use client";

import React from "react";
import Link from "next/link";
import {
  Cpu,
  Navigation,
  Activity,
  ArrowRight,
  Camera,
  CheckCircle2,
  Sparkles,
} from "lucide-react";

export default function HomePage() {
  const features = [
    {
      title: "AI Waste Detection",
      desc: "Automatically classifies waste using computer vision.",
      icon: Cpu,
    },
    {
      title: "Smart Route Optimization",
      desc: "Assigns collection crews using intelligent routing.",
      icon: Navigation,
    },
    {
      title: "Live Tracking",
      desc: "Track complaint status and collection progress in real time.",
      icon: Activity,
    },
  ];

  const steps = [
    {
      step: "01",
      title: "Report Waste",
      desc: "Citizens submit photos with precise location tagging to report uncollected waste.",
      icon: Camera,
    },
    {
      step: "02",
      title: "AI Analysis & Priority Assignment",
      desc: "Computer vision evaluates waste type, calculates hazard level, and assigns urgency.",
      icon: Sparkles,
    },
    {
      step: "03",
      title: "Collection Completed",
      desc: "Field operatives complete the mission and upload verified photo proof of clearance.",
      icon: CheckCircle2,
    },
  ];

  return (
    <div className="bg-white min-h-screen text-slate-900 selection:bg-emerald-500 selection:text-white">
      {/* ====================================================
          1. HERO SECTION
          ==================================================== */}
      <section className="relative pt-12 pb-20 sm:pt-20 sm:pb-28 px-4 sm:px-6 lg:px-8 border-b border-slate-100 overflow-hidden">
        {/* Subtle top radial gradient */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-b from-emerald-50/50 via-teal-50/20 to-transparent -z-10 pointer-events-none" />

        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-emerald-50 border border-emerald-200/80 text-emerald-800 text-xs font-semibold shadow-xs">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>Environmental Technology Platform</span>
              </div>

              <div className="space-y-4">
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 leading-[1.15]">
                  AI-Powered Smart Waste Management for Modern Cities
                </h1>
                <p className="max-w-xl mx-auto lg:mx-0 text-base sm:text-lg text-slate-600 leading-relaxed font-normal">
                  Report waste issues, track municipal response, and build cleaner communities.
                </p>
              </div>

              {/* Two CTA Buttons */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-2">
                <Link
                  href="/login"
                  className="px-8 py-3.5 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm transition-all shadow-sm hover:shadow-emerald-600/20 flex items-center gap-2 group"
                >
                  <span>Report Waste</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>

                <Link
                  href="/login"
                  className="px-8 py-3.5 rounded-full bg-white hover:bg-slate-50 text-slate-700 font-bold text-sm transition-all border border-slate-200 shadow-xs hover:border-slate-300"
                >
                  Login
                </Link>
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
          2. FEATURES SECTION (ONLY 3 CARDS)
          ==================================================== */}
      <section id="features" className="py-20 sm:py-28 px-4 sm:px-6 lg:px-8 border-b border-slate-100 bg-white">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider bg-emerald-50 px-3.5 py-1.5 rounded-full border border-emerald-200/80">
              Core Capabilities
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Intelligent Waste Infrastructure
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((item, idx) => {
              const Icon = item.icon;
              return (
                <div
                  key={idx}
                  className="bg-white rounded-3xl p-8 border border-slate-100 shadow-[0_4px_25px_rgb(0,0,0,0.03)] hover:border-emerald-300 hover:shadow-md transition-all group"
                >
                  <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center mb-6 group-hover:scale-105 group-hover:bg-emerald-600 group-hover:text-white transition-all shadow-xs">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 mb-2 group-hover:text-emerald-700 transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-sm text-slate-600 leading-relaxed font-normal">
                    {item.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ====================================================
          3. HOW IT WORKS SECTION (SIMPLE 3-STEP PROCESS)
          ==================================================== */}
      <section id="how-it-works" className="py-20 sm:py-28 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider bg-emerald-50 px-3.5 py-1.5 rounded-full border border-emerald-200/80">
              Workflow Process
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Simple 3-Step Process
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            {steps.map((s, idx) => {
              const Icon = s.icon;
              return (
                <div
                  key={idx}
                  className="bg-white rounded-3xl p-8 border border-slate-100 shadow-[0_4px_25px_rgb(0,0,0,0.03)] hover:border-emerald-300 transition-all flex flex-col justify-between group"
                >
                  <div>
                    <div className="flex items-center justify-between mb-6">
                      <span className="text-3xl font-black text-emerald-600/30 group-hover:text-emerald-600 font-mono transition-colors">
                        {s.step}
                      </span>
                      <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
                        <Icon className="w-5 h-5" />
                      </div>
                    </div>

                    <h3 className="text-lg font-bold text-slate-900 mb-2">
                      {s.title}
                    </h3>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      {s.desc}
                    </p>
                  </div>
                  <div className="pt-6 mt-6 border-t border-slate-100">
                    <span className="text-xs font-semibold text-emerald-700">
                      Step {idx + 1}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}
