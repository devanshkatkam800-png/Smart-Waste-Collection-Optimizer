"use client";

import React, { useState } from "react";
import {
  Navigation,
  Camera,
  CheckCircle2,
  Clock,
  MapPin,
  AlertTriangle,
  ExternalLink,
  Scale,
} from "lucide-react";
import {
  getPriorityBadgeColor,
  getStatusBadgeColor,
  getWasteTypeBadgeColor,
  formatDateTime,
} from "@/lib/utils";
import ProofUploadModal from "@/components/Worker/ProofUploadModal";

interface Props {
  mission: any;
  workerId: string;
  onRefresh: () => void;
}

export default function MissionCard({ mission, workerId, onRefresh }: Props) {
  const [proofModalOpen, setProofModalOpen] = useState(false);

  const isCollected = mission.status === "COLLECTED";
  const proof = mission.proofPhotos?.[0];

  const handleOpenNavigation = () => {
    // Open in Google Maps directions with precise coordinates
    const url = `https://www.google.com/maps/dir/?api=1&destination=${mission.latitude},${mission.longitude}`;
    window.open(url, "_blank");
  };

  return (
    <div
      className={`rounded-2xl border p-5 transition-all shadow-xs hover:shadow-md ${
        isCollected
          ? "bg-emerald-50/30 border-emerald-200"
          : mission.priorityLevel === "HIGH"
          ? "bg-white border-rose-200 ring-1 ring-rose-500/20"
          : "bg-white border-slate-200"
      }`}
    >
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3">
        <div className="flex items-center space-x-2">
          <span className="font-mono font-bold text-xs bg-slate-100 text-slate-800 px-2 py-0.5 rounded">
            {mission.ticketNo}
          </span>
          <span
            className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${getStatusBadgeColor(
              mission.status
            )}`}
          >
            {mission.status}
          </span>
        </div>

        <div className="flex items-center space-x-1.5">
          <span
            className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${getPriorityBadgeColor(
              mission.priorityLevel
            )}`}
          >
            {mission.priorityLevel} ({mission.priorityScore})
          </span>
          <span
            className={`text-[10px] font-bold px-2 py-0.5 rounded border ${getWasteTypeBadgeColor(
              mission.wasteType
            )}`}
          >
            {mission.wasteType}
          </span>
        </div>
      </div>

      {/* Main Body */}
      <div className="my-3 space-y-2">
        <h3 className="font-bold text-slate-900 text-sm">{mission.title}</h3>
        {mission.description && (
          <p className="text-xs text-slate-500 line-clamp-2">{mission.description}</p>
        )}

        <div className="flex items-start gap-1.5 text-xs text-slate-700 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
          <MapPin className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
          <div className="flex-1">
            <span className="font-medium text-slate-800">{mission.address}</span>
            <div className="text-[11px] text-slate-400 font-mono mt-0.5">
              GPS: {mission.latitude.toFixed(4)}, {mission.longitude.toFixed(4)}
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
          <div className="flex items-center gap-1">
            <Scale className="w-3.5 h-3.5 text-slate-400" />
            <span>Quantity: <strong>{mission.quantity}</strong> (~{mission.estimatedWeightKg} kg)</span>
          </div>
          <div className="text-[11px] text-slate-400">
            Assigned: {formatDateTime(mission.createdAt)}
          </div>
        </div>
      </div>

      {/* Before / Proof Images */}
      <div className="my-3 flex items-center gap-3">
        {mission.imageUrl && (
          <div className="flex-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase block mb-1">
              Report Image
            </span>
            <div className="h-20 w-full rounded-lg overflow-hidden border border-slate-200 bg-slate-100">
              <img
                src={mission.imageUrl}
                alt="Reported Waste"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        )}

        {proof && (
          <div className="flex-1">
            <span className="text-[10px] font-bold text-emerald-600 uppercase block mb-1">
              Cleanup Proof
            </span>
            <div className="h-20 w-full rounded-lg overflow-hidden border-2 border-emerald-400 bg-slate-100">
              <img
                src={proof.photoUrl}
                alt="Completed Proof"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="pt-3 border-t border-slate-100 flex items-center gap-2">
        <button
          onClick={handleOpenNavigation}
          className="flex-1 py-2 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold flex items-center justify-center space-x-1.5 transition-colors"
        >
          <Navigation className="w-3.5 h-3.5 text-blue-600" />
          <span>Navigate GPS</span>
        </button>

        {!isCollected ? (
          <button
            onClick={() => setProofModalOpen(true)}
            className="flex-1 py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs hover:shadow-md transition-all flex items-center justify-center space-x-1.5"
          >
            <Camera className="w-3.5 h-3.5" />
            <span>Upload Proof & Complete</span>
          </button>
        ) : (
          <div className="flex-1 py-2 px-3 rounded-xl bg-emerald-100/80 text-emerald-800 text-xs font-bold flex items-center justify-center space-x-1 border border-emerald-200">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>Mission Completed</span>
          </div>
        )}
      </div>

      {/* Proof Upload Modal */}
      <ProofUploadModal
        isOpen={proofModalOpen}
        onClose={() => setProofModalOpen(false)}
        complaint={mission}
        workerId={workerId}
        onProofSubmitted={onRefresh}
      />
    </div>
  );
}
