"use client";

import React, { useState } from "react";
import { Recycle, Mail, Phone, Building2, X } from "lucide-react";

export default function Footer() {
  const [modalType, setModalType] = useState<"about" | "contact" | "privacy" | null>(null);

  return (
    <>
      <footer className="mt-auto border-t border-slate-100 bg-white py-14 text-xs text-slate-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-slate-100">
            {/* Col 1 & 2: Brand & Mission */}
            <div className="lg:col-span-2 space-y-4">
              <div className="flex items-center space-x-2.5">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white flex items-center justify-center shadow-xs">
                  <Recycle className="w-4 h-4" />
                </div>
                <span className="font-extrabold text-slate-900 tracking-tight text-base">
                  EcoRoute AI
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                  Municipal Tech
                </span>
              </div>
              <p className="text-xs text-slate-500 leading-relaxed max-w-sm">
                Smart waste collection & municipal optimization platform. Connecting citizens, operations dispatchers, and field operatives for cleaner, net-zero urban communities.
              </p>
              <div className="text-[11px] text-emerald-800 font-medium">
                Municipal Operations Command &bull; Smart City Initiative
              </div>
            </div>

            {/* Col 3: Navigation */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Platform</h4>
              <ul className="space-y-2 text-xs">
                <li>
                  <a href="/#features" className="hover:text-emerald-700 transition-colors">Features</a>
                </li>
                <li>
                  <a href="/#how-it-works" className="hover:text-emerald-700 transition-colors">How It Works</a>
                </li>
                <li>
                  <a href="/#impact" className="hover:text-emerald-700 transition-colors">Impact Statistics</a>
                </li>
                <li>
                  <a href="/#about" className="hover:text-emerald-700 transition-colors">About Mission</a>
                </li>
                <li>
                  <a href="/#contact" className="hover:text-emerald-700 transition-colors">Operations Contact</a>
                </li>
              </ul>
            </div>

            {/* Col 4: Portals */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Access Portals</h4>
              <ul className="space-y-2 text-xs">
                <li>
                  <a href="/login" className="hover:text-emerald-700 transition-colors">Citizen Report Portal</a>
                </li>
                <li>
                  <a href="/login" className="hover:text-emerald-700 transition-colors">Operations Admin Hub</a>
                </li>
                <li>
                  <a href="/login" className="hover:text-emerald-700 transition-colors">Field Worker Missions</a>
                </li>
                <li>
                  <a href="/register" className="hover:text-emerald-700 transition-colors">Create Citizen Account</a>
                </li>
              </ul>
            </div>

            {/* Col 5: Disclosures & Support */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Municipal Support</h4>
              <ul className="space-y-2 text-xs">
                <li>
                  <button onClick={() => setModalType("about")} className="hover:text-emerald-700 transition-colors text-left">
                    About Platform
                  </button>
                </li>
                <li>
                  <button onClick={() => setModalType("contact")} className="hover:text-emerald-700 transition-colors text-left">
                    Direct Contact
                  </button>
                </li>
                <li>
                  <button onClick={() => setModalType("privacy")} className="hover:text-emerald-700 transition-colors text-left">
                    Privacy & Compliance
                  </button>
                </li>
                <li>
                  <span className="text-[11px] text-slate-400 block pt-1">
                    Hotline: +91 22 2430 1122
                  </span>
                </li>
              </ul>
            </div>
          </div>

          <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-400">
            <div>
              &copy; {new Date().getFullYear()} EcoRoute AI. Municipal Waste Collection Optimizer. All rights reserved.
            </div>
            <div className="flex items-center space-x-6">
              <button onClick={() => setModalType("privacy")} className="hover:text-slate-600 transition-colors">
                Privacy Policy
              </button>
              <button onClick={() => setModalType("about")} className="hover:text-slate-600 transition-colors">
                Municipal Terms
              </button>
              <button onClick={() => setModalType("contact")} className="hover:text-slate-600 transition-colors">
                Sanitation Command
              </button>
            </div>
          </div>
        </div>
      </footer>

      {/* Information Modal */}
      {modalType && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 sm:p-8 shadow-xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 text-base capitalize">
                {modalType === "about" && "About EcoRoute AI"}
                {modalType === "contact" && "Contact Operations"}
                {modalType === "privacy" && "Privacy Policy"}
              </h3>
              <button
                onClick={() => setModalType(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="text-xs text-slate-600 leading-relaxed space-y-3">
              {modalType === "about" && (
                <>
                  <p>
                    <strong>EcoRoute AI</strong> is an enterprise municipal platform engineered to streamline smart city waste collection operations.
                  </p>
                  <p>
                    By connecting citizens, municipal operations administrators, and field collection operatives through intelligent reporting and dynamic dispatching, EcoRoute AI helps cities eliminate backlog and maintain cleaner neighborhoods.
                  </p>
                </>
              )}

              {modalType === "contact" && (
                <div className="space-y-2">
                  <p>For municipal partnerships, deployments, or municipal inquiries:</p>
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5 font-mono text-[11px] text-slate-700">
                    <div className="flex items-center gap-2">
                      <Mail className="w-3.5 h-3.5 text-emerald-600" />
                      <span>contact@ecoroute.ai</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="w-3.5 h-3.5 text-emerald-600" />
                      <span>+91 22 2430 1122</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Building2 className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Municipal Operations Command, Mumbai, MH</span>
                    </div>
                  </div>
                </div>
              )}

              {modalType === "privacy" && (
                <>
                  <p>
                    EcoRoute AI adheres to municipal data standards. Citizen photographic submissions and GPS coordinates are strictly utilized for sanitation dispatch and collection verification.
                  </p>
                  <p>
                    Personal identifiable information is protected with role-based access control and is never sold or shared with external commercial third parties.
                  </p>
                </>
              )}
            </div>

            <div className="pt-2">
              <button
                onClick={() => setModalType(null)}
                className="w-full py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
