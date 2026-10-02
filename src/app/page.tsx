"use client";

import React from "react";
import Link from "next/link";
import {
  Camera,
  Cpu,
  Truck,
  Navigation,
  Activity,
  BarChart3,
  ArrowRight,
} from "lucide-react";

export default function HomePage() {

  const features = [
    {
      title: "Report Waste",
      desc: "Citizens report waste incidents instantly with photo uploads and precise GPS location tagging.",
      icon: Camera,
    },
    {
      title: "AI Waste Detection",
      desc: "Computer vision algorithms automatically categorize waste composition and estimate volume.",
      icon: Cpu,
    },
    {
      title: "Smart Assignment",
      desc: "Automated dispatch pairs complaints with the closest available municipal workers based on vehicle capacity.",
      icon: Truck,
    },
    {
      title: "Route Optimization",
      desc: "Calculates optimal collection routes to minimize fuel consumption and shorten municipal response times.",
      icon: Navigation,
    },
    {
      title: "Live Tracking",
      desc: "Real-time visibility into collection missions, incident resolution progress, and worker telemetry.",
      icon: Activity,
    },
    {
      title: "Hotspot Analytics",
      desc: "Predictive city intelligence identifies high-density waste zones before overflows occur.",
      icon: BarChart3,
    },
  ];

  const steps = [
    {
      step: "01",
      title: "Citizen Reports Waste",
      desc: "Residents capture photos of waste accumulations and submit them with verified location data.",
    },
    {
      step: "02",
      title: "Admin Reviews & Assigns",
      desc: "Operations administrators review AI priority scores and assign missions to field units.",
    },
    {
      step: "03",
      title: "Worker Collects & Uploads Proof",
      desc: "Field operatives complete the pickup, upload photo proof, and mark the complaint resolved.",
    },
  ];

  return (
    <div className="bg-[#fbfcfd] min-h-screen text-slate-900 selection:bg-emerald-500 selection:text-white">
      {/* ====================================================
          SECTION 1 — HERO
          ==================================================== */}
      <section className="pt-24 pb-20 sm:pt-32 sm:pb-28 px-4 sm:px-6 lg:px-8 border-b border-slate-200/80 bg-white">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>Municipal Smart City Platform</span>
          </div>

          <div className="space-y-3">
            <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-slate-900">
              EcoRoute AI
            </h1>
            <p className="text-2xl sm:text-3xl font-bold text-emerald-700 tracking-tight">
              Smart Waste Collection Optimizer
            </p>
          </div>

          <p className="max-w-2xl mx-auto text-base sm:text-lg text-slate-600 leading-relaxed font-normal">
            Helping cities collect waste more efficiently through smart reporting, intelligent assignment, optimized routes, and real-time tracking.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <Link
              href="/login"
              className="px-8 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm transition-all shadow-xs flex items-center gap-2 group"
            >
              <span>Sign In</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>

            <Link
              href="/register"
              className="px-8 py-3.5 rounded-xl bg-white hover:bg-slate-50 text-slate-700 font-bold text-sm transition-all border border-slate-300"
            >
              <span>Register</span>
            </Link>
          </div>
        </div>
      </section>

      {/* ====================================================
          SECTION 2 — FEATURES (6 MODERN FEATURE CARDS)
          ==================================================== */}
      <section className="py-24 sm:py-32 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
          <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
            Platform Capabilities
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Built for Modern Smart Cities
          </h2>
          <p className="text-sm sm:text-base text-slate-600">
            Core features engineered to modernize urban waste management workflows.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="bg-white rounded-2xl p-8 border border-slate-200/90 shadow-xs hover:border-emerald-500/50 hover:shadow-md transition-all group"
              >
                <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center mb-6 group-hover:scale-105 group-hover:bg-emerald-600 group-hover:text-white transition-all">
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">
                  {item.title}
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  {item.desc}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* ====================================================
          SECTION 3 — HOW IT WORKS (SIMPLE 3-STEP WORKFLOW)
          ==================================================== */}
      <section className="py-24 sm:py-32 px-4 sm:px-6 lg:px-8 border-y border-slate-200/80 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
            <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
              Workflow Process
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              How It Works
            </h2>
            <p className="text-sm sm:text-base text-slate-600">
              A seamless municipal pipeline from citizen reporting to verified resolution.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            {steps.map((s, idx) => (
              <div
                key={idx}
                className="bg-[#fbfcfd] rounded-2xl p-8 border border-slate-200/90 shadow-xs space-y-4 flex flex-col justify-between"
              >
                <div>
                  <span className="text-2xl font-black text-emerald-600/30 font-mono block mb-2">
                    {s.step}
                  </span>
                  <h3 className="text-lg font-bold text-slate-900 mb-2">
                    {s.title}
                  </h3>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    {s.desc}
                  </p>
                </div>
                <div className="pt-4 border-t border-slate-200/60 flex items-center text-xs font-semibold text-emerald-700">
                  <span>Step {idx + 1} of 3</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* The global footer component in layout.tsx renders Section 4 (Footer: EcoRoute AI, Smart Waste Collection Optimizer, About, Contact, Privacy Policy) */}
    </div>
  );
}
