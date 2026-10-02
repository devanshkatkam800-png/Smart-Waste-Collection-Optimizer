"use client";

import React, { useState } from "react";
import { Recycle, Mail, Phone, Building2, X } from "lucide-react";

export default function Footer() {
  const [modalType, setModalType] = useState<"about" | "contact" | "privacy" | null>(null);

  return (
    <>
      <footer className="mt-auto border-t border-slate-200/80 bg-white py-8 text-xs text-slate-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-1 text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start space-x-2">
              <div className="w-6 h-6 rounded-lg bg-emerald-600 text-white flex items-center justify-center">
                <Recycle className="w-4 h-4" />
              </div>
              <span className="font-extrabold text-slate-900 tracking-tight text-sm">
                EcoRoute AI
              </span>
            </div>
            <p className="text-xs text-slate-500">
              Smart Waste Collection Optimizer
            </p>
          </div>

          <div className="flex items-center space-x-8 text-xs font-semibold text-slate-600">
            <button
              onClick={() => setModalType("about")}
              className="hover:text-emerald-700 transition-colors"
            >
              About
            </button>
            <button
              onClick={() => setModalType("contact")}
              className="hover:text-emerald-700 transition-colors"
            >
              Contact
            </button>
            <button
              onClick={() => setModalType("privacy")}
              className="hover:text-emerald-700 transition-colors"
            >
              Privacy Policy
            </button>
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
