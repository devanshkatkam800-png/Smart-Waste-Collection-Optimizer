"use client";

import React, { useState, useEffect } from "react";
import AuthGuard from "@/components/AuthGuard";
import {
  Truck,
  CheckCircle2,
  Clock,
  MapPin,
  RefreshCw,
  Phone,
  ShieldCheck,
  AlertTriangle,
  Scale,
} from "lucide-react";
import MissionCard from "@/components/Worker/MissionCard";

export default function WorkerPage() {
  const [worker, setWorker] = useState<any>(null);
  const [missions, setMissions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterTab, setFilterTab] = useState<"ACTIVE" | "COMPLETED">("ACTIVE");

  const fetchWorkerData = async () => {
    setLoading(true);
    try {
      const meRes = await fetch("/api/auth/me");
      const meData = await meRes.json();
      const user = meData.user;

      const wRes = await fetch("/api/workers");
      const wData = await wRes.json();
      const allWorkers = wData.workers || [];

      let currentWorker = allWorkers.find(
        (w: any) => w.id === user?.workerId || w.userId === user?.id
      );
      if (!currentWorker && allWorkers.length > 0) {
        currentWorker = allWorkers[0];
      }
      setWorker(currentWorker);

      if (currentWorker) {
        const cRes = await fetch(`/api/complaints?workerId=${currentWorker.id}`);
        const cData = await cRes.json();
        setMissions(cData.complaints || []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWorkerData();
  }, []);

  const handleStatusChange = async (newStatus: string) => {
    if (!worker) return;
    try {
      const res = await fetch(`/api/workers/${worker.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        setWorker({ ...worker, status: newStatus });
      }
    } catch (e) {
      console.error(e);
    }
  };

  const activeMissions = missions.filter((m) => m.status === "ASSIGNED");
  const completedMissions = missions.filter((m) => m.status === "COLLECTED");
  const currentWeightKg = activeMissions.reduce(
    (acc, m) => acc + (m.estimatedWeightKg || 20),
    0
  );

  return (
    <AuthGuard allowedRoles={["WORKER"]}>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-6">
        {/* Worker Telemetry Header - Clean Municipal Design */}
        <div className="bg-white text-slate-900 rounded-2xl p-6 sm:p-8 border border-slate-200/90 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-700 shadow-xs">
                <Truck className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <span className="text-[10px] px-2.5 py-0.5 rounded-full font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                    FIELD OPERATIVE
                  </span>
                  <span className="text-xs text-slate-500 font-mono">
                    {worker?.vehicleType || "E-Trike Rapid"}
                  </span>
                </div>
                <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight mt-1 text-slate-900">
                  {worker?.name || "Carlos Rodriguez"}
                </h1>
                <div className="text-xs text-slate-500 font-mono mt-0.5">
                  Phone: {worker?.phone || "+91 98203 44556"}
                </div>
              </div>
            </div>

            {/* Duty Status Selector */}
            <div className="flex items-center space-x-2 self-start sm:self-auto">
              <div className="text-right">
                <span className="text-[10px] text-slate-500 block uppercase font-bold tracking-wider">
                  Duty Status
                </span>
                <select
                  value={worker?.status || "ACTIVE"}
                  onChange={(e) => handleStatusChange(e.target.value)}
                  className="text-xs font-bold rounded-xl border border-slate-300 bg-white text-slate-800 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="ACTIVE">ACTIVE (Available)</option>
                  <option value="ON_DUTY">ON_DUTY (In Route)</option>
                  <option value="OFFLINE">OFFLINE (Off Shift)</option>
                </select>
              </div>

              <button
                onClick={fetchWorkerData}
                title="Refresh missions"
                className="p-2 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-600 transition-colors mt-3"
              >
                <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin text-emerald-600" : ""}`} />
              </button>
            </div>
          </div>

          {/* Stats Bar */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3 border-t border-slate-100 text-xs">
            <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100">
              <span className="text-slate-500 block text-[11px] font-semibold">Active Missions</span>
              <strong className="text-xl font-extrabold text-slate-900 font-mono">{activeMissions.length}</strong>
            </div>
            <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100">
              <span className="text-slate-500 block text-[11px] font-semibold">Cleared Today</span>
              <strong className="text-xl font-extrabold text-emerald-700 font-mono">{completedMissions.length}</strong>
            </div>
            <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100">
              <span className="text-slate-500 block text-[11px] font-semibold">Vehicle Payload</span>
              <strong className="text-xl font-extrabold text-slate-900 font-mono">
                {currentWeightKg} / {worker?.maxCapacityKg || 250} kg
              </strong>
            </div>
          </div>
        </div>

        {/* Tab Selection */}
        <div className="flex items-center space-x-6 border-b border-slate-200">
          <button
            onClick={() => setFilterTab("ACTIVE")}
            className={`pb-3 text-xs font-bold flex items-center space-x-2 border-b-2 transition-all ${
              filterTab === "ACTIVE"
                ? "border-emerald-600 text-emerald-800"
                : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            <Clock className="w-4 h-4" />
            <span>Today's Active Missions ({activeMissions.length})</span>
          </button>

          <button
            onClick={() => setFilterTab("COMPLETED")}
            className={`pb-3 text-xs font-bold flex items-center space-x-2 border-b-2 transition-all ${
              filterTab === "COMPLETED"
                ? "border-emerald-600 text-emerald-800"
                : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Collection History ({completedMissions.length})</span>
          </button>
        </div>

        {/* Missions List */}
        <div className="space-y-4">
          {filterTab === "ACTIVE" ? (
            activeMissions.length === 0 ? (
              <div className="bg-white rounded-3xl border border-slate-200/90 p-8 text-center text-slate-500 shadow-xs">
                <CheckCircle2 className="w-12 h-12 mx-auto text-emerald-500 mb-3" />
                <h3 className="font-extrabold text-slate-900 text-base">All Missions Complete!</h3>
                <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                  No active collection assignments in your queue. Municipal auto-dispatch will route new complaints based on your location.
                </p>
              </div>
            ) : (
              activeMissions.map((m) => (
                <MissionCard
                  key={m.id}
                  mission={m}
                  workerId={worker?.id}
                  onRefresh={fetchWorkerData}
                />
              ))
            )
          ) : completedMissions.length === 0 ? (
            <div className="bg-white rounded-3xl border border-slate-200/90 p-8 text-center text-slate-500 shadow-xs">
              <Clock className="w-12 h-12 mx-auto text-slate-300 mb-3" />
              <h3 className="font-extrabold text-slate-900 text-base">No Completed Missions</h3>
              <p className="text-xs text-slate-500 mt-1">
                Cleared tasks with uploaded collection proof photos will be logged in this ledger.
              </p>
            </div>
          ) : (
            completedMissions.map((m) => (
              <MissionCard
                key={m.id}
                mission={m}
                workerId={worker?.id}
                onRefresh={fetchWorkerData}
              />
            ))
          )}
        </div>
      </div>
    </AuthGuard>
  );
}
