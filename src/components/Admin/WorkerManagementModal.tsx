"use client";

import React, { useState } from "react";
import { X, Plus, Trash2, Truck, Phone, CheckCircle2, ShieldAlert } from "lucide-react";

interface Worker {
  id: string;
  name: string;
  phone: string;
  vehicleType: string;
  status: string;
  activeMissionsCount: number;
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
  workers: Worker[];
  onRefreshWorkers: () => void;
}

export default function WorkerManagementModal({
  isOpen,
  onClose,
  workers,
  onRefreshWorkers,
}: Props) {
  const [showAddForm, setShowAddForm] = useState(false);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [vehicleType, setVehicleType] = useState("E-Trike Rapid");
  const [status, setStatus] = useState("ACTIVE");
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleAddWorker = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setErrorMsg(null);
    try {
      const res = await fetch("/api/workers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, phone, vehicleType, status }),
      });
      if (res.ok) {
        setName("");
        setPhone("");
        setShowAddForm(false);
        onRefreshWorkers();
      } else {
        const d = await res.json();
        setErrorMsg(d.error || "Failed to add worker");
      }
    } catch (err: any) {
      setErrorMsg(err?.message || "Error adding worker");
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpdateStatus = async (workerId: string, newStatus: string) => {
    try {
      await fetch(`/api/workers/${workerId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      onRefreshWorkers();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (workerId: string, workerName: string) => {
    if (!confirm(`Are you sure you want to remove worker ${workerName}?`)) return;
    try {
      await fetch(`/api/workers/${workerId}`, { method: "DELETE" });
      onRefreshWorkers();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-2xl w-full p-6 animate-in fade-in zoom-in-95">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center space-x-2">
            <div className="p-2 rounded-xl bg-blue-100 text-blue-700">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900">Municipal Fleet Management</h3>
              <p className="text-xs text-slate-500">Configure collection units, monitor status & assign vehicles</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Add Worker Toggle */}
        <div className="my-4 flex justify-between items-center">
          <span className="text-xs font-semibold text-slate-700">
            Registered Drivers ({workers.length})
          </span>
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>{showAddForm ? "Cancel" : "Add Worker"}</span>
          </button>
        </div>

        {/* Add Form */}
        {showAddForm && (
          <form onSubmit={handleAddWorker} className="p-4 mb-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
            <h4 className="text-xs font-bold text-slate-800 uppercase">New Fleet Operative</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] font-semibold text-slate-600 block mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="E.g., Michael Scott"
                  className="w-full text-xs rounded-lg border border-slate-300 p-2"
                />
              </div>
              <div>
                <label className="text-[11px] font-semibold text-slate-600 block mb-1">Phone Number</label>
                <input
                  type="text"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91 98000 11223"
                  className="w-full text-xs rounded-lg border border-slate-300 p-2"
                />
              </div>
              <div>
                <label className="text-[11px] font-semibold text-slate-600 block mb-1">Vehicle Classification</label>
                <select
                  value={vehicleType}
                  onChange={(e) => setVehicleType(e.target.value)}
                  className="w-full text-xs rounded-lg border border-slate-300 p-2 bg-white"
                >
                  <option value="E-Trike Rapid">E-Trike Rapid (200kg capacity)</option>
                  <option value="Electric Mini-Truck">Electric Mini-Truck (650kg capacity)</option>
                  <option value="Hydraulic Compactor">Hydraulic Compactor (1200kg capacity)</option>
                </select>
              </div>
              <div>
                <label className="text-[11px] font-semibold text-slate-600 block mb-1">Initial Status</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="w-full text-xs rounded-lg border border-slate-300 p-2 bg-white"
                >
                  <option value="ACTIVE">ACTIVE (Available for dispatch)</option>
                  <option value="ON_DUTY">ON_DUTY (In mission)</option>
                  <option value="OFFLINE">OFFLINE (Off shift)</option>
                </select>
              </div>
            </div>

            {errorMsg && <div className="text-xs text-rose-600">{errorMsg}</div>}

            <div className="flex justify-end pt-2">
              <button
                type="submit"
                disabled={submitting}
                className="px-4 py-2 rounded-lg bg-emerald-600 text-white font-semibold text-xs hover:bg-emerald-700 disabled:opacity-50"
              >
                {submitting ? "Saving..." : "Save Worker"}
              </button>
            </div>
          </form>
        )}

        {/* Worker Roster */}
        <div className="divide-y divide-slate-100 max-h-80 overflow-y-auto pr-1">
          {workers.map((w) => (
            <div key={w.id} className="py-3 flex items-center justify-between gap-3">
              <div>
                <div className="flex items-center space-x-2">
                  <h4 className="font-bold text-slate-800 text-xs">{w.name}</h4>
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                      w.status === "ACTIVE"
                        ? "bg-emerald-100 text-emerald-800"
                        : w.status === "ON_DUTY"
                        ? "bg-amber-100 text-amber-800"
                        : "bg-slate-100 text-slate-600"
                    }`}
                  >
                    {w.status}
                  </span>
                </div>
                <div className="flex items-center gap-3 text-[11px] text-slate-500 mt-1">
                  <span className="flex items-center gap-1">
                    <Truck className="w-3 h-3 text-slate-400" />
                    {w.vehicleType}
                  </span>
                  <span className="flex items-center gap-1 font-mono">
                    <Phone className="w-3 h-3 text-slate-400" />
                    {w.phone}
                  </span>
                  <span className="font-semibold text-slate-700">
                    Active Missions: {w.activeMissionsCount || 0}
                  </span>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <select
                  value={w.status}
                  onChange={(e) => handleUpdateStatus(w.id, e.target.value)}
                  className="text-[11px] border border-slate-300 rounded px-2 py-1 bg-white text-slate-700"
                >
                  <option value="ACTIVE">Set Active</option>
                  <option value="ON_DUTY">Set On-Duty</option>
                  <option value="OFFLINE">Set Offline</option>
                </select>
                <button
                  onClick={() => handleDelete(w.id, w.name)}
                  title="Remove worker"
                  className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 border-t border-slate-100 pt-4 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
