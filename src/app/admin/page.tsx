"use client";

import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import AuthGuard from "@/components/AuthGuard";
import {
  Layers,
  Clock,
  UserCheck,
  CheckCircle2,
  Truck,
  Sparkles,
  Users,
  RefreshCw,
  TrendingUp,
  MapPin,
  ShieldCheck,
} from "lucide-react";
import StatCard from "@/components/Admin/StatCard";
import ComplaintsTable from "@/components/Admin/ComplaintsTable";
import WorkerManagementModal from "@/components/Admin/WorkerManagementModal";
import SmartAssignModal from "@/components/Admin/SmartAssignModal";
import ProofVerifyModal from "@/components/Admin/ProofVerifyModal";

const OperationsMap = dynamic(() => import("@/components/Map/OperationsMap"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[540px] rounded-3xl bg-slate-100 flex items-center justify-center text-slate-400 font-medium">
      Loading Mumbai operations GIS map...
    </div>
  ),
});

export default function AdminPage() {
  const [complaints, setComplaints] = useState<any[]>([]);
  const [workers, setWorkers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedComplaintId, setSelectedComplaintId] = useState<string | null>(null);

  // Modals
  const [workerModalOpen, setWorkerModalOpen] = useState(false);
  const [smartAssignModalOpen, setSmartAssignModalOpen] = useState(false);
  const [proofModalComplaint, setProofModalComplaint] = useState<any | null>(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [cRes, wRes] = await Promise.all([
        fetch("/api/complaints"),
        fetch("/api/workers"),
      ]);

      if (cRes.ok) {
        const cData = await cRes.json();
        setComplaints(cData.complaints || []);
      }
      if (wRes.ok) {
        const wData = await wRes.json();
        setWorkers(wData.workers || []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // 5 Meaningful KPIs
  const totalCount = complaints.length;
  const pendingCount = complaints.filter((c) => c.status === "PENDING").length;
  const assignedCount = complaints.filter((c) => c.status === "ASSIGNED").length;
  const collectedCount = complaints.filter((c) => c.status === "COLLECTED").length;
  const activeWorkersCount = workers.filter((w) => w.status === "ACTIVE" || w.status === "ON_DUTY").length;

  return (
    <AuthGuard allowedRoles={["ADMIN"]}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200/80 pb-6">
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-[10px] px-2.5 py-0.5 rounded-full font-extrabold bg-emerald-50 text-emerald-800 border border-emerald-200">
                MUNICIPAL OPERATIONS
              </span>
              <span className="text-xs text-slate-400 font-medium">Mumbai Smart City Command Grid</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
              Operations Command Hub
            </h1>
          </div>

          <div className="flex items-center space-x-2.5 flex-wrap">
            <button
              onClick={() => setSmartAssignModalOpen(true)}
              className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs transition-colors"
            >
              <Sparkles className="w-4 h-4" />
              <span>AI Auto-Assign ({pendingCount} Pending)</span>
            </button>

            <button
              onClick={() => setWorkerModalOpen(true)}
              className="inline-flex items-center space-x-2 px-3.5 py-2.5 rounded-xl bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 font-bold text-xs shadow-xs transition-colors"
            >
              <Users className="w-4 h-4 text-slate-500" />
              <span>Manage Fleet ({workers.length})</span>
            </button>

            <Link
              href="/admin/analytics"
              className="inline-flex items-center space-x-2 px-3.5 py-2.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border border-emerald-300 font-bold text-xs transition-colors"
            >
              <TrendingUp className="w-4 h-4 text-emerald-700" />
              <span>Analytics & Predictions</span>
            </Link>

            <button
              onClick={fetchData}
              title="Refresh Grid"
              className="p-2.5 rounded-xl border border-slate-300 bg-white hover:bg-slate-100 text-slate-600 transition-colors"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin text-emerald-600" : ""}`} />
            </button>
          </div>
        </div>

        {/* 5 Core Meaningful KPI Cards */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          <StatCard
            title="Total Complaints"
            value={totalCount}
            subtitle="Municipal reports"
            icon={Layers}
            colorScheme="slate"
          />
          <StatCard
            title="Pending Dispatch"
            value={pendingCount}
            subtitle="Immediate action required"
            icon={Clock}
            colorScheme="amber"
            trend={pendingCount > 0 ? `${pendingCount} In Queue` : "All Dispatched"}
          />
          <StatCard
            title="Assigned Fleet"
            value={assignedCount}
            subtitle="En route for collection"
            icon={Truck}
            colorScheme="blue"
          />
          <StatCard
            title="Collected Clean"
            value={collectedCount}
            subtitle="Resolution efficiency"
            icon={CheckCircle2}
            colorScheme="emerald"
            trend={`${Math.round((collectedCount / Math.max(1, totalCount)) * 100)}%`}
          />
          <StatCard
            title="Active Workers"
            value={activeWorkersCount}
            subtitle="Deployable units"
            icon={UserCheck}
            colorScheme="purple"
          />
        </div>

        {/* Live Mumbai Operations Map */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <h2 className="text-base font-extrabold text-slate-900">
                Live Mumbai Operations Map & Fleet Telemetry
              </h2>
            </div>
            <span className="text-xs text-slate-400">
              Red: High Priority (&ge;70) &bull; Yellow: Medium &bull; Green: Low &bull; 🚚 Fleet GPS
            </span>
          </div>

          <OperationsMap
            complaints={complaints}
            workers={workers}
            selectedComplaintId={selectedComplaintId}
            onSelectComplaint={(c) => setSelectedComplaintId(c.id)}
          />
        </div>

        {/* Complaints Roster */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-extrabold text-slate-900">
                Municipal Incident Queue
              </h2>
              <p className="text-xs text-slate-500">Live feed from citizen mobile complaints</p>
            </div>
          </div>

          <ComplaintsTable
            complaints={complaints}
            workers={workers}
            onSelectComplaint={(c) => setSelectedComplaintId(c.id)}
            onRefresh={fetchData}
            onViewProof={(c) => setProofModalComplaint(c)}
          />
        </div>

        {/* Modals */}
        <WorkerManagementModal
          isOpen={workerModalOpen}
          onClose={() => setWorkerModalOpen(false)}
          workers={workers}
          onRefreshWorkers={fetchData}
        />

        <SmartAssignModal
          isOpen={smartAssignModalOpen}
          onClose={() => setSmartAssignModalOpen(false)}
          pendingCount={pendingCount}
          onDispatchComplete={fetchData}
        />

        <ProofVerifyModal
          isOpen={proofModalComplaint !== null}
          onClose={() => setProofModalComplaint(null)}
          complaint={proofModalComplaint}
          onVerified={fetchData}
        />
      </div>
    </AuthGuard>
  );
}
