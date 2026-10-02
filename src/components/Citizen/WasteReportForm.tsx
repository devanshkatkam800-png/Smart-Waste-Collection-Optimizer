"use client";

import React, { useState } from "react";
import {
  Camera,
  Upload,
  Sparkles,
  MapPin,
  CheckCircle2,
  AlertTriangle,
  Loader2,
  Info,
  ShieldCheck,
} from "lucide-react";
import { getWasteTypeBadgeColor } from "@/lib/utils";

interface Props {
  onComplaintSubmitted?: () => void;
}

const SAMPLE_PRESETS_MUMBAI = [
  {
    name: "Produce Waste (Dadar)",
    url: "https://images.unsplash.com/photo-1530587191325-3db32d826c18?auto=format&fit=crop&w=600&q=80",
    expected: "ORGANIC",
    desc: "Market vegetable scrap & rotting bio-waste on pedestrian pathway",
    lat: 19.0185,
    lng: 72.8432,
    address: "Dadar West, Near Flower Market & Senapati Bapat Marg, Mumbai",
  },
  {
    name: "Plastic Litter (Bandra)",
    url: "https://images.unsplash.com/photo-1618477461853-cf6ed80faba5?auto=format&fit=crop&w=600&q=80",
    expected: "PLASTIC",
    desc: "Discarded PET beverage bottles and takeaway packaging along walkway",
    lat: 19.0544,
    lng: 72.8268,
    address: "Bandra West, Carter Road Promenade, Mumbai",
  },
  {
    name: "Cardboard Packaging (Andheri)",
    url: "https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?auto=format&fit=crop&w=600&q=80",
    expected: "PAPER",
    desc: "Commercial boxes and delivery cartons blocking service alleyway",
    lat: 19.1363,
    lng: 72.8277,
    address: "Andheri West, Near Infinity Mall, Link Road, Mumbai",
  },
  {
    name: "Electronic Scrap (Powai)",
    url: "https://images.unsplash.com/photo-1605600659908-0ef719419d41?auto=format&fit=crop&w=600&q=80",
    expected: "E_WASTE",
    desc: "Discarded motherboards, lithium battery cells, and insulated cabling",
    lat: 19.1176,
    lng: 72.9060,
    address: "Powai, Near Hiranandani Tech Park, Mumbai",
  },
];

export default function WasteReportForm({ onComplaintSubmitted }: Props) {
  const [imageUrl, setImageUrl] = useState<string>("");
  const [isClassifying, setIsClassifying] = useState<boolean>(false);
  const [aiResult, setAiResult] = useState<any>(null);

  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [wasteType, setWasteType] = useState<string>("MIXED");
  const [quantity, setQuantity] = useState<string>("MEDIUM");
  const [latitude, setLatitude] = useState<number>(19.0596);
  const [longitude, setLongitude] = useState<number>(72.8295);
  const [address, setAddress] = useState<string>("Bandra West, Hill Road, Mumbai");
  const [isLocating, setIsLocating] = useState<boolean>(false);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [submittedTicket, setSubmittedTicket] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Auto-capture HTML5 Geolocation
  const handleCaptureGPS = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser");
      return;
    }
    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLatitude(parseFloat(pos.coords.latitude.toFixed(6)));
        setLongitude(parseFloat(pos.coords.longitude.toFixed(6)));
        setAddress(`Captured GPS (${pos.coords.latitude.toFixed(4)}, ${pos.coords.longitude.toFixed(4)}), Mumbai`);
        setIsLocating(false);
      },
      (err) => {
        console.warn("GPS error:", err);
        setIsLocating(false);
        // Fallback default within Mumbai bounds
        setLatitude(19.0760 + (Math.random() - 0.5) * 0.04);
        setLongitude(72.8777 + (Math.random() - 0.5) * 0.04);
      }
    );
  };

  // Run AI Vision Classification
  const runAiClassification = async (imgData: string) => {
    setIsClassifying(true);
    setAiResult(null);
    try {
      const res = await fetch("/api/complaints/ai-classify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image: imgData }),
      });
      const data = await res.json();
      if (data.success && data.classification) {
        setAiResult(data.classification);
        setWasteType(data.classification.wasteType);
        if (!title) {
          setTitle(`${data.classification.wasteType.charAt(0) + data.classification.wasteType.slice(1).toLowerCase()} waste reported`);
        }
      }
    } catch (err) {
      console.error("AI error:", err);
    } finally {
      setIsClassifying(false);
    }
  };

  const handleImageFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result as string;
      setImageUrl(dataUrl);
      runAiClassification(dataUrl);
    };
    reader.readAsDataURL(file);
  };

  const applyPreset = (preset: (typeof SAMPLE_PRESETS_MUMBAI)[0]) => {
    setImageUrl(preset.url);
    setTitle(preset.name + " accumulation");
    setDescription(preset.desc);
    setLatitude(preset.lat);
    setLongitude(preset.lng);
    setAddress(preset.address);
    runAiClassification(preset.url);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!address) {
      setErrorMsg("Please specify the municipal location or address.");
      return;
    }

    setSubmitting(true);
    setErrorMsg(null);

    try {
      const res = await fetch("/api/complaints", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: title || `${wasteType} Waste Accumulation`,
          description,
          wasteType,
          quantity,
          imageUrl: imageUrl || "https://images.unsplash.com/photo-1530587191325-3db32d826c18?auto=format&fit=crop&w=600&q=80",
          latitude,
          longitude,
          address,
          aiConfidence: aiResult?.confidence || 0.95,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setSubmittedTicket(data.complaint.ticketNo);
        if (onComplaintSubmitted) onComplaintSubmitted();
      } else {
        setErrorMsg(data.error || "Failed to submit complaint");
      }
    } catch (err: any) {
      setErrorMsg(err?.message || "Submission failed");
    } finally {
      setSubmitting(false);
    }
  };

  if (submittedTicket) {
    return (
      <div className="bg-white rounded-3xl p-8 border border-emerald-200/80 shadow-[0_4px_25px_-5px_rgba(16,185,129,0.1)] text-center max-w-lg mx-auto">
        <div className="w-16 h-16 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-4 shadow-sm">
          <CheckCircle2 className="w-9 h-9" />
        </div>
        <h3 className="text-xl font-extrabold text-slate-900 tracking-tight">Complaint Successfully Logged!</h3>
        <p className="text-xs text-slate-600 mt-2">
          Your waste report has been analyzed by AI and synchronized with the BMC Mumbai Smart City dispatch command grid.
        </p>

        <div className="my-6 p-4 rounded-2xl bg-emerald-50/50 border border-emerald-200/60 text-left">
          <div className="text-[11px] text-emerald-800 uppercase font-bold tracking-wider">Complaint Ticket Reference</div>
          <div className="text-xl font-mono font-extrabold text-emerald-700 mt-0.5">{submittedTicket}</div>
          <div className="mt-2 text-xs text-slate-700 flex items-center gap-1.5 font-medium">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse"></span>
            Status: <strong className="text-slate-900">PENDING DISPATCH</strong>
          </div>
        </div>

        <button
          onClick={() => {
            setSubmittedTicket(null);
            setImageUrl("");
            setAiResult(null);
            setTitle("");
            setDescription("");
          }}
          className="w-full py-3 px-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-xs transition-all shadow-md shadow-emerald-600/20"
        >
          Submit Another Report
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-3xl border border-slate-200/90 shadow-[0_4px_25px_-5px_rgba(15,23,42,0.05)] p-6 sm:p-8 space-y-6">
      <div className="border-b border-slate-100 pb-4">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 rounded-2xl bg-emerald-100 text-emerald-700 shadow-sm">
            <Camera className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-extrabold text-slate-900 tracking-tight">Report Waste Incident</h2>
            <p className="text-xs text-slate-500">Upload or snap a waste photo to activate instant AI category detection and dispatch routing</p>
          </div>
        </div>
      </div>

      {/* Quick Demo Presets (Mumbai) */}
      <div>
        <label className="text-xs font-bold text-slate-800 mb-2 flex items-center justify-between">
          <span>Mumbai Demo Presets:</span>
          <span className="text-[11px] text-emerald-600 font-semibold bg-emerald-50 px-2 py-0.5 rounded-full">
            1-Click AI Classification Test
          </span>
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          {SAMPLE_PRESETS_MUMBAI.map((p) => (
            <button
              key={p.name}
              type="button"
              onClick={() => applyPreset(p)}
              className="text-left p-2 rounded-xl border border-slate-200 hover:border-emerald-500 hover:bg-emerald-50/40 transition-all text-xs group"
            >
              <div className="h-16 w-full rounded-lg overflow-hidden mb-1.5 bg-slate-100">
                <img src={p.url} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
              </div>
              <div className="font-bold text-slate-800 line-clamp-1">{p.name}</div>
              <div className="text-[10px] text-emerald-700 font-semibold">{p.expected}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Upload Zone */}
      <div>
        <label className="block text-xs font-bold text-slate-800 mb-2">
          Upload Waste Photograph
        </label>
        <div className="relative border-2 border-dashed border-slate-300 hover:border-emerald-500 rounded-2xl p-4 text-center transition-all bg-slate-50/60">
          <input
            type="file"
            accept="image/*"
            onChange={handleImageFile}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />
          {imageUrl ? (
            <div className="relative h-48 w-full rounded-xl overflow-hidden bg-slate-900 flex items-center justify-center">
              <img src={imageUrl} alt="Uploaded waste" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center text-white text-xs font-semibold opacity-0 hover:opacity-100 transition-opacity">
                Click or drop another image to replace
              </div>
            </div>
          ) : (
            <div className="py-7 flex flex-col items-center">
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center mb-2">
                <Upload className="w-6 h-6" />
              </div>
              <p className="text-xs font-bold text-slate-800">Drag & drop waste photo, or click to browse</p>
              <p className="text-[11px] text-slate-400 mt-1">Supports high-res PNG, JPG, WEBP</p>
            </div>
          )}
        </div>
      </div>

      {/* AI Classification Display */}
      {isClassifying && (
        <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200 flex items-center space-x-3 animate-pulse">
          <Loader2 className="w-5 h-5 text-emerald-600 animate-spin shrink-0" />
          <div>
            <p className="text-xs font-bold text-emerald-950 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
              AI Analyzing Waste Composition & Density...
            </p>
            <p className="text-[11px] text-emerald-700 mt-0.5">Detecting polymer signatures, bio-matter & disposal hazard</p>
          </div>
        </div>
      )}

      {aiResult && !isClassifying && (
        <div className="p-5 rounded-2xl bg-gradient-to-r from-emerald-50/90 via-teal-50/60 to-white border border-emerald-200/90 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2.5">
              <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-sm">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[10px] uppercase font-extrabold text-emerald-800 tracking-wider">AI Classification Engine</span>
                <div className="flex items-center gap-2">
                  <h4 className="text-sm font-extrabold text-slate-900">
                    Detected Waste: <span className="text-emerald-700">{aiResult.wasteType}</span>
                  </h4>
                  <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-200/70 text-emerald-900 font-extrabold">
                    {Math.round(aiResult.confidence * 100)}% Confidence
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-3.5 pt-3 border-t border-emerald-200/60 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-700">
            <div>
              <span className="text-slate-500 font-semibold">Identified Waste Composition:</span>
              <p className="font-bold text-slate-900 mt-0.5">{aiResult.detectedItems?.join(", ")}</p>
            </div>
            <div>
              <span className="text-slate-500 font-semibold">Disposal Channel Guidance:</span>
              <p className="font-medium text-slate-800 mt-0.5">{aiResult.disposalGuidance}</p>
            </div>
          </div>
        </div>
      )}

      {/* Form Fields: Waste Type & Quantity */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-bold text-slate-800 mb-1.5">
            Waste Type (AI detected or manual select)
          </label>
          <select
            value={wasteType}
            onChange={(e) => setWasteType(e.target.value)}
            className="w-full text-xs font-medium rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          >
            <option value="PLASTIC">Plastic (Dry Recyclables)</option>
            <option value="ORGANIC">Organic (Bio-degradable / Wet)</option>
            <option value="PAPER">Paper & Cardboard (Pulp)</option>
            <option value="MIXED">Mixed Waste (Solid Refuse)</option>
            <option value="E_WASTE">E-Waste (Hazardous Electronics)</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-800 mb-1.5">
            Estimated Quantity
          </label>
          <select
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            className="w-full text-xs font-medium rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          >
            <option value="SMALL">Small (1 - 5 kg / Single bag)</option>
            <option value="MEDIUM">Medium (5 - 20 kg / 2-4 bags)</option>
            <option value="LARGE">Large (20 - 50 kg / Bin overflow)</option>
            <option value="OVERFLOW">Severe Overflow (&gt; 50 kg / Street pile)</option>
          </select>
        </div>
      </div>

      {/* GPS Location & Address */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold text-slate-800">
            Mumbai Incident Location & Address
          </label>
          <button
            type="button"
            onClick={handleCaptureGPS}
            disabled={isLocating}
            className="inline-flex items-center space-x-1 text-xs text-emerald-600 hover:text-emerald-700 font-bold"
          >
            <MapPin className={`w-3.5 h-3.5 ${isLocating ? "animate-bounce" : ""}`} />
            <span>{isLocating ? "Locating..." : "Auto-Capture GPS"}</span>
          </button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          <input
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="Street address or landmark in Mumbai..."
            className="sm:col-span-2 text-xs rounded-xl border border-slate-300 px-3.5 py-2.5 text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            required
          />
          <div className="text-xs bg-slate-100 rounded-xl px-3 py-2.5 font-mono text-slate-600 flex items-center justify-center font-bold">
            {latitude.toFixed(4)}° N, {longitude.toFixed(4)}° E
          </div>
        </div>
      </div>

      {/* Description */}
      <div>
        <label className="block text-xs font-bold text-slate-800 mb-1.5">
          Incident Notes / Description
        </label>
        <textarea
          rows={3}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="E.g., Accumulating outside station exit, strong smell during market hours..."
          className="w-full text-xs rounded-xl border border-slate-300 px-3.5 py-2.5 text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
        />
      </div>

      {errorMsg && (
        <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      <button
        type="submit"
        disabled={submitting}
        className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-extrabold text-xs shadow-md shadow-emerald-600/25 transition-all flex items-center justify-center space-x-2 disabled:opacity-50"
      >
        {submitting ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>Transmitting to Mumbai Operations Grid...</span>
          </>
        ) : (
          <>
            <Sparkles className="w-4 h-4" />
            <span>Submit Complaint & Trigger AI Priority Dispatch</span>
          </>
        )}
      </button>
    </form>
  );
}
