"use client";

import React, { useState } from "react";
import { X, Sparkles, CheckCircle2, Truck, Navigation, AlertCircle, Loader2 } from "lucide-react";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  pendingCount: number;
  onDispatchComplete: () => void;
}

export default function SmartAssignModal({
  isOpen,
  onClose,
  pendingCount,
  onDispatchComplete,
}: Props) {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleRunSmartDispatch = async () => {
    setLoading(true);
    setErrorMsg(null);
    try {
      const res = await fetch("/api/dispatch/auto-assign", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({}),
      });

      const data = await res.json();
      if (data.success) {
        setResult(data);
        onDispatchComplete();
      } else {
        setErrorMsg(data.error || "Auto dispatch execution failed");
      }
    } catch (err: any) {
      setErrorMsg(err?.message || "Execution error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-xl w-full p-6 animate-in fade-in zoom-in-95">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center space-x-2">
            <div className="p-2 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white shadow-sm">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900">AI Smart Dispatch Engine</h3>
              <p className="text-xs text-slate-500">Autonomous Proximity & Workload Optimization</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {!result ? (
          <div className="py-4 space-y-4">
            <div className="p-4 rounded-xl bg-emerald-50/70 border border-emerald-200/80 text-xs text-emerald-900 space-y-2">
              <div className="font-bold flex items-center gap-1.5 text-emerald-800">
                <Navigation className="w-4 h-4 text-emerald-600" />
                Algorithm Multi-Factor Matching Parameters:
              </div>
              <ul className="list-disc list-inside space-y-1 text-emerald-700/90 pl-1">
                <li><strong>Haversine Proximity:</strong> Pinpoints closest available driver to waste coordinates</li>
                <li><strong>Workload Balancing:</strong> Prioritizes drivers with fewer ongoing assignments</li>
                <li><strong>Hazard Priority:</strong> Dispatches high-priority items (&ge;70 score) first</li>
              </ul>
            </div>

            <div className="flex items-center justify-between p-3 rounded-lg bg-slate-50 border border-slate-200 text-xs">
              <span className="text-slate-600 font-medium">Pending Unassigned Complaints:</span>
              <strong className="text-amber-600 text-sm">{pendingCount} in queue</strong>
            </div>

            {errorMsg && (
              <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            <button
              onClick={handleRunSmartDispatch}
              disabled={loading || pendingCount === 0}
              className="w-full py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-md transition-all flex items-center justify-center space-x-2 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Computing Optimal Fleet Routing...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Execute AI Auto-Dispatch ({pendingCount} Complaints)</span>
                </>
              )}
            </button>
          </div>
        ) : (
          <div className="py-4 space-y-4">
            <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 flex items-center space-x-3">
              <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0" />
              <div>
                <p className="font-bold text-xs">{result.message}</p>
                <p className="text-[11px] text-emerald-700">Fleet mission plans generated in real time.</p>
              </div>
            </div>

            {result.assignmentsMade?.length > 0 && (
              <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
                {result.assignmentsMade.map((a: any) => (
                  <div
                    key={a.complaintId}
                    className="p-3 rounded-lg border border-slate-200 bg-slate-50/70 text-xs flex items-center justify-between"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-slate-800">{a.ticketNo}</span>
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-rose-100 text-rose-800 font-bold">
                          {a.priorityLevel}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 mt-1">{a.reason}</p>
                    </div>

                    <div className="text-right">
                      <span className="font-bold text-emerald-700 flex items-center gap-1 justify-end">
                        <Truck className="w-3.5 h-3.5" />
                        {a.workerName}
                      </span>
                      <span className="text-[10px] text-slate-400 font-medium">
                        Suitability: {a.suitabilityScore}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <button
              onClick={onClose}
              className="w-full py-2.5 px-4 rounded-xl bg-slate-900 text-white font-semibold text-xs hover:bg-slate-800"
            >
              Done & Return to Dashboard
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
