"use client";

import React, { useState } from "react";
import { X, Camera, Upload, CheckCircle2, Loader2, Sparkles } from "lucide-react";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  complaint: any;
  workerId: string;
  onProofSubmitted: () => void;
}

const SAMPLE_CLEANUP_PROOFS = [
  {
    name: "Clean Pavement & Restored Bin",
    url: "https://images.unsplash.com/photo-1582408921715-18e7806365c1?auto=format&fit=crop&w=600&q=80",
  },
  {
    name: "Swept Street & Sanitized Curb",
    url: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=600&q=80",
  },
  {
    name: "Emptied Public Disposal Point",
    url: "https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?auto=format&fit=crop&w=600&q=80",
  },
];

export default function ProofUploadModal({
  isOpen,
  onClose,
  complaint,
  workerId,
  onProofSubmitted,
}: Props) {
  const [photoUrl, setPhotoUrl] = useState<string>("");
  const [notes, setNotes] = useState<string>("Area swept clean, washed, and disinfected.");
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen || !complaint) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      setPhotoUrl(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const finalPhoto = photoUrl || SAMPLE_CLEANUP_PROOFS[0].url;

    setSubmitting(true);
    setErrorMsg(null);

    try {
      const res = await fetch("/api/proof", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          complaintId: complaint.id,
          workerId,
          photoUrl: finalPhoto,
          notes,
        }),
      });

      const data = await res.json();
      if (data.success) {
        onProofSubmitted();
        onClose();
      } else {
        setErrorMsg(data.error || "Failed to submit proof");
      }
    } catch (err: any) {
      setErrorMsg(err?.message || "Error submitting proof");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-lg w-full p-6 animate-in fade-in zoom-in-95">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center space-x-2">
            <div className="p-2 rounded-xl bg-emerald-100 text-emerald-700">
              <Camera className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Upload Collection Proof</h3>
              <p className="text-xs text-slate-500">Mission: {complaint.ticketNo}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          {/* Quick Demo Preset Proofs */}
          <div>
            <label className="text-xs font-semibold text-slate-700 block mb-1.5">
              Quick Test Proof Photos:
            </label>
            <div className="grid grid-cols-3 gap-2">
              {SAMPLE_CLEANUP_PROOFS.map((s) => (
                <button
                  type="button"
                  key={s.name}
                  onClick={() => setPhotoUrl(s.url)}
                  className={`p-1.5 rounded-lg border text-left text-[11px] transition-all ${
                    photoUrl === s.url
                      ? "border-emerald-500 ring-2 ring-emerald-500/20 bg-emerald-50/50"
                      : "border-slate-200 hover:border-slate-300"
                  }`}
                >
                  <div className="h-14 w-full rounded overflow-hidden mb-1 bg-slate-100">
                    <img src={s.url} alt={s.name} className="w-full h-full object-cover" />
                  </div>
                  <span className="font-medium text-slate-700 line-clamp-1">{s.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Upload input */}
          <div>
            <label className="text-xs font-semibold text-slate-700 block mb-1.5">
              Or Take / Upload Photo
            </label>
            <div className="relative border-2 border-dashed border-slate-300 hover:border-emerald-500 rounded-xl p-3 text-center transition-colors bg-slate-50/50">
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              {photoUrl ? (
                <div className="relative h-32 w-full rounded-lg overflow-hidden bg-slate-900 flex items-center justify-center">
                  <img src={photoUrl} alt="Cleanup Proof" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center text-white text-xs font-medium opacity-0 hover:opacity-100 transition-opacity">
                    Click to replace photo
                  </div>
                </div>
              ) : (
                <div className="py-3 flex flex-col items-center">
                  <Upload className="w-6 h-6 text-slate-400 mb-1" />
                  <span className="text-xs font-medium text-slate-700">Click to upload cleanup proof</span>
                </div>
              )}
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="text-xs font-semibold text-slate-700 block mb-1">
              Field Cleanup Notes
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full text-xs rounded-lg border border-slate-300 p-2 focus:ring-1 focus:ring-emerald-500"
            />
          </div>

          {errorMsg && <div className="text-xs text-rose-600">{errorMsg}</div>}

          <div className="flex justify-end space-x-2 pt-2 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-sm flex items-center gap-1.5 disabled:opacity-50"
            >
              {submitting ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Submitting...</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Verify Cleanup & Complete Mission</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
