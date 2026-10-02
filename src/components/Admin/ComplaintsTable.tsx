"use client";

import React, { useState } from "react";
import {
  Search,
  Filter,
  User,
  Eye,
  CheckCircle2,
  MapPin,
  Sparkles,
  ArrowUpDown,
} from "lucide-react";
import {
  getPriorityBadgeColor,
  getStatusBadgeColor,
  getWasteTypeBadgeColor,
  formatDateTime,
} from "@/lib/utils";

interface Worker {
  id: string;
  name: string;
  phone: string;
  vehicleType: string;
}

interface Complaint {
  id: string;
  ticketNo: string;
  title: string;
  wasteType: string;
  quantity: string;
  estimatedWeightKg: number;
  priorityLevel: string;
  priorityScore: number;
  status: string;
  address: string;
  latitude: number;
  longitude: number;
  createdAt: string;
  assignedWorkerId?: string | null;
  assignedWorker?: Worker | null;
  proofPhotos?: any[];
  imageUrl?: string | null;
}

interface Props {
  complaints: Complaint[];
  workers: Worker[];
  onSelectComplaint?: (c: Complaint) => void;
  onRefresh: () => void;
  onViewProof: (c: Complaint) => void;
}

export default function ComplaintsTable({
  complaints,
  workers,
  onSelectComplaint,
  onRefresh,
  onViewProof,
}: Props) {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [priorityFilter, setPriorityFilter] = useState("ALL");
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const handleAssignWorker = async (complaintId: string, workerId: string) => {
    setUpdatingId(complaintId);
    try {
      await fetch(`/api/complaints/${complaintId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          assignedWorkerId: workerId || null,
          status: workerId ? "ASSIGNED" : "PENDING",
        }),
      });
      onRefresh();
    } catch (err) {
      console.error(err);
    } finally {
      setUpdatingId(null);
    }
  };

  const filtered = complaints.filter((c) => {
    const matchSearch =
      c.ticketNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.address.toLowerCase().includes(searchTerm.toLowerCase());
    const matchStatus = statusFilter === "ALL" || c.status === statusFilter;
    const matchPriority = priorityFilter === "ALL" || c.priorityLevel === priorityFilter;
    return matchSearch && matchStatus && matchPriority;
  });

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden">
      {/* Table Controls */}
      <div className="p-4 border-b border-slate-100 flex flex-wrap items-center justify-between gap-3">
        <div className="relative flex-1 min-w-[220px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search ticket, title, or address..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full text-xs rounded-xl border border-slate-300 pl-9 pr-3 py-2 bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        <div className="flex items-center space-x-2 text-xs">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded-xl border border-slate-300 px-3 py-2 bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          >
            <option value="ALL">All Statuses ({complaints.length})</option>
            <option value="PENDING">Pending ({complaints.filter((c) => c.status === "PENDING").length})</option>
            <option value="ASSIGNED">Assigned ({complaints.filter((c) => c.status === "ASSIGNED").length})</option>
            <option value="COLLECTED">Collected ({complaints.filter((c) => c.status === "COLLECTED").length})</option>
          </select>

          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="rounded-xl border border-slate-300 px-3 py-2 bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          >
            <option value="ALL">All Priorities</option>
            <option value="HIGH">High Priority (&ge;70)</option>
            <option value="MEDIUM">Medium Priority</option>
            <option value="LOW">Low Priority</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs text-slate-600">
          <thead className="bg-slate-50/80 text-[11px] uppercase font-bold text-slate-500 border-b border-slate-100">
            <tr>
              <th className="py-3 px-4">Ticket & Title</th>
              <th className="py-3 px-3">AI Priority</th>
              <th className="py-3 px-3">Type & Quantity</th>
              <th className="py-3 px-3">Location</th>
              <th className="py-3 px-3">Status</th>
              <th className="py-3 px-3">Assigned Worker</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-8 text-center text-slate-400">
                  No complaints match the specified filters.
                </td>
              </tr>
            ) : (
              filtered.map((c) => {
                const hasProof = c.proofPhotos && c.proofPhotos.length > 0;
                return (
                  <tr
                    key={c.id}
                    className="hover:bg-slate-50/70 transition-colors group cursor-pointer"
                    onClick={() => onSelectComplaint && onSelectComplaint(c)}
                  >
                    {/* Ticket & Title */}
                    <td className="py-3.5 px-4">
                      <div className="font-mono font-bold text-slate-900 group-hover:text-emerald-700">
                        {c.ticketNo}
                      </div>
                      <div className="text-[11px] text-slate-500 font-medium line-clamp-1 mt-0.5">
                        {c.title}
                      </div>
                    </td>

                    {/* Priority */}
                    <td className="py-3.5 px-3">
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full font-bold text-[10px] border ${getPriorityBadgeColor(
                          c.priorityLevel
                        )}`}
                      >
                        {c.priorityLevel === "HIGH" && (
                          <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />
                        )}
                        {c.priorityLevel} ({c.priorityScore})
                      </span>
                    </td>

                    {/* Type & Quantity */}
                    <td className="py-3.5 px-3">
                      <div className="flex flex-col gap-0.5">
                        <span
                          className={`inline-block px-1.5 py-0.5 rounded text-[10px] font-semibold border w-fit ${getWasteTypeBadgeColor(
                            c.wasteType
                          )}`}
                        >
                          {c.wasteType}
                        </span>
                        <span className="text-[10px] text-slate-400">
                          {c.quantity} (~{c.estimatedWeightKg}kg)
                        </span>
                      </div>
                    </td>

                    {/* Location */}
                    <td className="py-3.5 px-3 max-w-[200px]">
                      <div className="flex items-start gap-1 text-[11px] text-slate-700">
                        <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                        <span className="truncate">{c.address}</span>
                      </div>
                    </td>

                    {/* Status */}
                    <td className="py-3.5 px-3">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold border ${getStatusBadgeColor(
                          c.status
                        )}`}
                      >
                        {c.status}
                      </span>
                    </td>

                    {/* Assigned Worker Dropdown */}
                    <td
                      className="py-3.5 px-3"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <select
                        value={c.assignedWorkerId || ""}
                        disabled={updatingId === c.id || c.status === "COLLECTED"}
                        onChange={(e) => handleAssignWorker(c.id, e.target.value)}
                        className="text-[11px] rounded-lg border border-slate-300 px-2 py-1 bg-white text-slate-800 disabled:opacity-50 focus:ring-1 focus:ring-emerald-500"
                      >
                        <option value="">-- Unassigned --</option>
                        {workers.map((w) => (
                          <option key={w.id} value={w.id}>
                            {w.name} ({w.vehicleType})
                          </option>
                        ))}
                      </select>
                    </td>

                    {/* Actions */}
                    <td
                      className="py-3.5 px-4 text-right"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div className="flex items-center justify-end space-x-2">
                        {hasProof && (
                          <button
                            onClick={() => onViewProof(c)}
                            title="Verify Proof Photo"
                            className="inline-flex items-center space-x-1 px-2 py-1 rounded-md text-[11px] font-semibold bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                            <span>Proof</span>
                          </button>
                        )}

                        <button
                          onClick={() => onSelectComplaint && onSelectComplaint(c)}
                          title="Focus on Map"
                          className="p-1.5 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-100"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      <div className="p-3 border-t border-slate-100 text-[11px] text-slate-500 flex justify-between items-center bg-slate-50/50">
        <span>Showing {filtered.length} of {complaints.length} municipal reports</span>
        <span className="text-slate-400">Click any row to pinpoint on live map</span>
      </div>
    </div>
  );
}
