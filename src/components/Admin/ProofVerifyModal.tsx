"use client";

import React, { useState } from "react";
import { X, CheckCircle2, ShieldCheck, Calendar, User, FileText, ExternalLink } from "lucide-react";
import { formatDateTime } from "@/lib/utils";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  complaint: any;
  onVerified: () => void;
}

export default function ProofVerifyModal({
  isOpen,
  onClose,
  complaint,
  onVerified,
}: Props) {
  const [submitting, setSubmitting] = useState(false);

  if (!isOpen || !complaint) return null;

  const proof = complaint.proofPhotos?.[0];

  const handleVerify = async (verified: boolean) => {
    if (!proof) return;
    setSubmitting(true);
    try {
      const res = await fetch("/api/proof", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          proofId: proof.id,
          verified,
        }),
      });
      if (res.ok) {
        onVerified();
        onClose();
      }
    } catch (e) {
      console.error(e);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-3xl w-full p-6 animate-in fade-in zoom-in-95">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center space-x-2">
            <div className="p-2 rounded-xl bg-emerald-100 text-emerald-700">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900">Proof-of-Collection Verification</h3>
              <p className="text-xs text-slate-500">Ticket: {complaint.ticketNo} &bull; {complaint.title}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Side-by-Side Comparison */}
        <div className="my-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Before */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                1. Citizen Report (Before)
              </span>
              <span className="text-[11px] text-slate-400">
                {formatDateTime(complaint.createdAt)}
              </span>
            </div>
            <div className="rounded-xl overflow-hidden border border-slate-200 bg-slate-100 h-64 flex items-center justify-center">
              {complaint.imageUrl ? (
                <img
                  src={complaint.imageUrl}
                  alt="Before Report"
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-xs text-slate-400">No initial image provided</span>
              )}
            </div>
            <p className="text-xs text-slate-600 italic line-clamp-2">
              "{complaint.description || "Reported waste accumulation"}"
            </p>
          </div>

          {/* After */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                2. Field Cleanup (After)
              </span>
              <span className="text-[11px] text-slate-400">
                {proof ? formatDateTime(proof.uploadedAt) : "Pending"}
              </span>
            </div>
            <div className="rounded-xl overflow-hidden border-2 border-emerald-400 ring-2 ring-emerald-500/20 bg-slate-100 h-64 flex items-center justify-center">
              {proof?.photoUrl ? (
                <img
                  src={proof.photoUrl}
                  alt="After Proof"
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-xs text-slate-400">Worker has not submitted proof yet</span>
              )}
            </div>
            <p className="text-xs text-slate-700 font-medium">
              Notes: {proof?.notes || "Cleaned and cleared from site."}
            </p>
          </div>
        </div>

        {/* Verification Status Banner */}
        <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <User className="w-4 h-4 text-slate-400" />
            <span className="text-slate-600">
              Cleaned By: <strong className="text-slate-800">{complaint.assignedWorker?.name || "Fleet Operative"}</strong>
            </span>
          </div>

          <div>
            {proof?.verifiedByAdmin ? (
              <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 font-bold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Verified by Municipal Admin
              </span>
            ) : (
              <span className="px-2.5 py-1 rounded-full bg-amber-100 text-amber-800 font-bold">
                Awaiting Admin Verification
              </span>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="mt-6 border-t border-slate-100 pt-4 flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs"
          >
            Close
          </button>
          {proof && (
            <button
              onClick={() => handleVerify(!proof.verifiedByAdmin)}
              disabled={submitting}
              className={`px-5 py-2 rounded-xl text-white font-bold text-xs shadow-sm transition-all ${
                proof.verifiedByAdmin
                  ? "bg-slate-700 hover:bg-slate-800"
                  : "bg-emerald-600 hover:bg-emerald-700 shadow-emerald-600/20"
              }`}
            >
              {submitting
                ? "Processing..."
                : proof.verifiedByAdmin
                ? "Revoke Verification"
                : "Approve & Mark Verified"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
