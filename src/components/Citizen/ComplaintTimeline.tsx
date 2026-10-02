"use client";

import React from "react";
import {
  Clock,
  UserCheck,
  CheckCircle,
  Truck,
  MapPin,
  Calendar,
  AlertCircle,
  ShieldCheck,
  ExternalLink,
} from "lucide-react";
import { formatDateTime, getPriorityBadgeColor, getStatusBadgeColor, getWasteTypeBadgeColor } from "@/lib/utils";

interface ComplaintItem {
  id: string;
  ticketNo: string;
  title: string;
  description?: string;
  wasteType: string;
  quantity: string;
  priorityLevel: string;
  priorityScore: number;
  status: "PENDING" | "ASSIGNED" | "COLLECTED" | string;
  address: string;
  imageUrl?: string | null;
  createdAt: string;
  assignedWorker?: {
    name: string;
    phone: string;
    vehicleType: string;
  } | null;
  proofPhotos?: Array<{
    id: string;
    photoUrl: string;
    notes?: string;
    uploadedAt: string;
    verifiedByAdmin: boolean;
  }>;
}

interface Props {
  complaints: ComplaintItem[];
  onRefresh?: () => void;
}

export default function ComplaintTimeline({ complaints, onRefresh }: Props) {
  if (complaints.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center text-slate-500">
        <Clock className="w-10 h-10 mx-auto text-slate-300 mb-3" />
        <p className="font-semibold text-slate-700">No complaints reported yet</p>
        <p className="text-xs text-slate-400 mt-1">Use the report form to submit your first waste ticket.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {complaints.map((item) => {
        const isPending = item.status === "PENDING";
        const isAssigned = item.status === "ASSIGNED";
        const isCollected = item.status === "COLLECTED";

        const proof = item.proofPhotos?.[0];

        return (
          <div
            key={item.id}
            className="bg-white rounded-2xl border border-slate-200/90 shadow-xs hover:shadow-md transition-all p-5"
          >
            {/* Header */}
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3">
              <div className="flex items-center space-x-2">
                <span className="font-mono font-bold text-xs bg-slate-100 text-slate-800 px-2 py-1 rounded">
                  {item.ticketNo}
                </span>
                <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full border ${getStatusBadgeColor(item.status)}`}>
                  {item.status}
                </span>
                <span className={`text-[11px] font-semibold px-2 py-0.5 rounded border ${getWasteTypeBadgeColor(item.wasteType)}`}>
                  {item.wasteType}
                </span>
              </div>

              <div className="flex items-center space-x-2 text-xs text-slate-400">
                <Calendar className="w-3.5 h-3.5" />
                <span>{formatDateTime(item.createdAt)}</span>
              </div>
            </div>

            {/* Stepper Lifecycle */}
            <div className="my-5">
              <div className="relative flex items-center justify-between">
                {/* Connecting track */}
                <div className="absolute left-6 right-6 top-1/2 -translate-y-1/2 h-1 bg-slate-200 -z-0">
                  <div
                    className="h-full bg-emerald-500 transition-all duration-500"
                    style={{
                      width: isCollected ? "100%" : isAssigned ? "50%" : "5%",
                    }}
                  />
                </div>

                {/* Step 1: Pending */}
                <div className="relative z-10 flex flex-col items-center">
                  <div className="w-9 h-9 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-sm">
                    <CheckCircle className="w-4 h-4" />
                  </div>
                  <span className="text-[11px] font-semibold text-slate-800 mt-1.5">1. Reported</span>
                  <span className="text-[10px] text-slate-400">AI Analyzed</span>
                </div>

                {/* Step 2: Assigned */}
                <div className="relative z-10 flex flex-col items-center">
                  <div
                    className={`w-9 h-9 rounded-full flex items-center justify-center shadow-sm transition-colors ${
                      isAssigned || isCollected
                        ? "bg-emerald-500 text-white"
                        : "bg-slate-100 text-slate-400 border border-slate-300"
                    }`}
                  >
                    <Truck className="w-4 h-4" />
                  </div>
                  <span className={`text-[11px] font-semibold mt-1.5 ${isAssigned || isCollected ? "text-slate-800" : "text-slate-400"}`}>
                    2. Assigned
                  </span>
                  <span className="text-[10px] text-slate-400">
                    {item.assignedWorker ? item.assignedWorker.name : "Waiting for Fleet"}
                  </span>
                </div>

                {/* Step 3: Collected */}
                <div className="relative z-10 flex flex-col items-center">
                  <div
                    className={`w-9 h-9 rounded-full flex items-center justify-center shadow-sm transition-colors ${
                      isCollected
                        ? "bg-emerald-600 text-white ring-4 ring-emerald-100"
                        : "bg-slate-100 text-slate-400 border border-slate-300"
                    }`}
                  >
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <span className={`text-[11px] font-semibold mt-1.5 ${isCollected ? "text-emerald-700 font-bold" : "text-slate-400"}`}>
                    3. Collected
                  </span>
                  <span className="text-[10px] text-slate-400">
                    {isCollected ? "Verified Clean" : "Pending Action"}
                  </span>
                </div>
              </div>
            </div>

            {/* Details Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-3 border-t border-slate-100 text-xs text-slate-600">
              <div>
                <h4 className="font-semibold text-slate-800 text-sm">{item.title}</h4>
                {item.description && <p className="text-slate-500 mt-1 text-xs">{item.description}</p>}
                <div className="flex items-center gap-1.5 mt-2 text-slate-500">
                  <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span className="line-clamp-1">{item.address}</span>
                </div>
              </div>

              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/60 space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-slate-500">AI Priority Score:</span>
                  <span className={`font-bold px-1.5 py-0.5 rounded text-[11px] border ${getPriorityBadgeColor(item.priorityLevel)}`}>
                    {item.priorityLevel} ({item.priorityScore}/100)
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Assigned Fleet Worker:</span>
                  <span className="font-semibold text-slate-800">
                    {item.assignedWorker ? (
                      <span className="text-emerald-700 flex items-center gap-1">
                        <UserCheck className="w-3.5 h-3.5" />
                        {item.assignedWorker.name} ({item.assignedWorker.vehicleType})
                      </span>
                    ) : (
                      <span className="text-slate-400 italic">Queueing for Smart Dispatch</span>
                    )}
                  </span>
                </div>
                {item.assignedWorker?.phone && (
                  <div className="flex justify-between">
                    <span className="text-slate-500">Worker Contact:</span>
                    <span className="font-mono text-slate-700">{item.assignedWorker.phone}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Photos: Reported vs Proof */}
            <div className="mt-4 flex flex-wrap gap-4 pt-3 border-t border-slate-100">
              {item.imageUrl && (
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                    Citizen Photo (Before)
                  </span>
                  <div className="w-28 h-24 rounded-lg overflow-hidden border border-slate-200 bg-slate-100">
                    <img src={item.imageUrl} alt="Before" className="w-full h-full object-cover" />
                  </div>
                </div>
              )}

              {proof && (
                <div>
                  <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider flex items-center gap-1 mb-1">
                    <CheckCircle className="w-3 h-3 text-emerald-600" />
                    Collection Proof (After)
                  </span>
                  <div className="w-28 h-24 rounded-lg overflow-hidden border border-emerald-300 ring-2 ring-emerald-500/20 bg-slate-100">
                    <img src={proof.photoUrl} alt="After Proof" className="w-full h-full object-cover" />
                  </div>
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
