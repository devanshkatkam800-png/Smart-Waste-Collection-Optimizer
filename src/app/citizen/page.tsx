"use client";

import React, { useState, useEffect } from "react";
import AuthGuard from "@/components/AuthGuard";
import WasteReportForm from "@/components/Citizen/WasteReportForm";
import ComplaintTimeline from "@/components/Citizen/ComplaintTimeline";
import { PlusCircle, ListOrdered, ShieldCheck, Leaf, Sparkles, RefreshCw, Layers } from "lucide-react";

export default function CitizenPage() {
  const [activeTab, setActiveTab] = useState<"REPORT" | "TRACK">("REPORT");
  const [complaints, setComplaints] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchComplaints = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/complaints");
      const data = await res.json();
      if (data.success) {
        setComplaints(data.complaints);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComplaints();
  }, []);

  const totalReports = complaints.length;
  const collectedCount = complaints.filter((c) => c.status === "COLLECTED").length;
  const pendingCount = complaints.filter((c) => c.status === "PENDING" || c.status === "ASSIGNED").length;

  return (
    <AuthGuard allowedRoles={["CITIZEN"]}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Header - Clean Municipal Design */}
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200/90 shadow-xs space-y-4">
          <div className="max-w-2xl">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold mb-2">
              <Leaf className="w-3.5 h-3.5 text-emerald-600" />
              <span>Citizen Waste Reporting</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
              Report Waste, Keep Cities Clean
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 mt-1.5 leading-relaxed">
              Upload an image of urban refuse. EcoRoute AI automatically categorizes waste composition, computes priority scores, and coordinates municipal field crews.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3 border-t border-slate-100">
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100">
              <span className="text-slate-500 block text-[11px] font-semibold">Total Reports</span>
              <strong className="text-xl text-slate-900 font-extrabold font-mono">{totalReports}</strong>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100">
              <span className="text-slate-500 block text-[11px] font-semibold">Cleaned & Verified</span>
              <strong className="text-xl text-emerald-700 font-extrabold font-mono">{collectedCount}</strong>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100">
              <span className="text-slate-500 block text-[11px] font-semibold">Active In Queue</span>
              <strong className="text-xl text-amber-700 font-extrabold font-mono">{pendingCount}</strong>
            </div>
          </div>
        </div>

        {/* Action Tabs */}
        <div className="flex items-center justify-between border-b border-slate-200/80">
          <div className="flex space-x-6">
            <button
              onClick={() => setActiveTab("REPORT")}
              className={`pb-3.5 text-xs font-bold flex items-center space-x-2 border-b-2 transition-all ${
                activeTab === "REPORT"
                  ? "border-emerald-600 text-emerald-800"
                  : "border-transparent text-slate-500 hover:text-slate-800"
              }`}
            >
              <PlusCircle className="w-4 h-4" />
              <span>Submit New Report</span>
            </button>
            <button
              onClick={() => {
                setActiveTab("TRACK");
                fetchComplaints();
              }}
              className={`pb-3.5 text-xs font-bold flex items-center space-x-2 border-b-2 transition-all ${
                activeTab === "TRACK"
                  ? "border-emerald-600 text-emerald-800"
                  : "border-transparent text-slate-500 hover:text-slate-800"
              }`}
            >
              <ListOrdered className="w-4 h-4" />
              <span>Complaint Tracking & History ({complaints.length})</span>
            </button>
          </div>

          <button
            onClick={fetchComplaints}
            title="Refresh reports"
            className="text-slate-400 hover:text-slate-700 p-2 rounded-xl hover:bg-slate-100 transition-colors"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin text-emerald-600" : ""}`} />
          </button>
        </div>

        {/* Main Content Area */}
        {activeTab === "REPORT" ? (
          <div className="max-w-2xl mx-auto">
            <WasteReportForm
              onComplaintSubmitted={() => {
                fetchComplaints();
                setActiveTab("TRACK");
              }}
            />
          </div>
        ) : (
          <div className="max-w-3xl mx-auto">
            <ComplaintTimeline complaints={complaints} onRefresh={fetchComplaints} />
          </div>
        )}
      </div>
    </AuthGuard>
  );
}
