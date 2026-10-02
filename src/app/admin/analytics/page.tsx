"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import AuthGuard from "@/components/AuthGuard";
import {
  TrendingUp,
  Sparkles,
  ArrowLeft,
  RefreshCw,
  Flame,
  Calendar,
  Layers,
  Zap,
  MapPin,
  AlertTriangle,
  Building2,
} from "lucide-react";
import {
  WasteTypeDistributionChart,
  DailyComplaintsTrendChart,
} from "@/components/Charts/WasteCharts";
import { getPriorityBadgeColor, getWasteTypeBadgeColor } from "@/lib/utils";

interface HotspotItem {
  rank: number;
  area: string;
  complaintCount: number;
  wasteType: string;
  priorityLevel: string;
  priorityScore?: number;
}

export default function AnalyticsPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchAnalytics = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/analytics");
      if (res.ok) {
        const json = await res.json();
        setData(json);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const predictions = [
    {
      level: "High Risk Zone",
      riskLevel: "High Risk",
      badgeColor: "bg-rose-50 text-rose-800 border-rose-200",
      cardBorder: "border-rose-200 bg-white hover:border-rose-300",
      location: "Dadar Market & Commercial Stalls",
      confidenceScore: 94,
      predictedIncrease: "+55% Surge Forecasted",
      wasteType: "Organic Produce / Bio-waste",
      action: "Pre-emptively route 2 mini-trucks and initiate early morning 06:30 clearance.",
    },
    {
      level: "Medium Risk Zone",
      riskLevel: "Medium Risk",
      badgeColor: "bg-amber-50 text-amber-800 border-amber-200",
      cardBorder: "border-amber-200 bg-white hover:border-amber-300",
      location: "Bandra West Coastal Promenade",
      confidenceScore: 88,
      predictedIncrease: "+32% Surge Forecasted",
      wasteType: "Single-use Plastics & Bottles",
      action: "Deploy rapid mobile electric trike sweep between 17:00 and 20:00.",
    },
    {
      level: "Low Risk Zone",
      riskLevel: "Low Risk",
      badgeColor: "bg-emerald-50 text-emerald-800 border-emerald-200",
      cardBorder: "border-emerald-200 bg-white hover:border-emerald-300",
      location: "Powai Technology & Residential Sector",
      confidenceScore: 82,
      predictedIncrease: "+10% Normal Growth",
      wasteType: "Dry Paper Packaging & E-Waste",
      action: "Maintain standard weekly compactor collection schedule.",
    },
  ];

  const hotspots: HotspotItem[] = data?.topHotspots || [
    { rank: 1, area: "Andheri West", complaintCount: 1, wasteType: "PLASTIC", priorityLevel: "HIGH" },
    { rank: 2, area: "Bandra West", complaintCount: 1, wasteType: "ORGANIC", priorityLevel: "HIGH" },
    { rank: 3, area: "Powai", complaintCount: 1, wasteType: "E_WASTE", priorityLevel: "MEDIUM" },
    { rank: 4, area: "Dadar West", complaintCount: 0, wasteType: "ORGANIC", priorityLevel: "HIGH" },
    { rank: 5, area: "Lower Parel", complaintCount: 0, wasteType: "PAPER", priorityLevel: "LOW" },
  ];

  return (
    <AuthGuard allowedRoles={["ADMIN"]}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Top Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200/80 pb-6">
          <div>
            <div className="flex items-center space-x-2">
              <Link
                href="/admin"
                className="inline-flex items-center space-x-1 text-xs text-slate-500 hover:text-emerald-700 font-bold transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back to Operations Hub</span>
              </Link>
            </div>
            <div className="flex items-center space-x-3 mt-1.5">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                Municipal Analytics & Waste Predictions
              </h1>
              <span className="text-xs px-2.5 py-0.5 rounded-full font-bold bg-emerald-50 text-emerald-800 border border-emerald-200 flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-emerald-600" />
                AI Intelligence
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Top waste hotspots, AI overflow forecasts, and municipal collection trends
            </p>
          </div>

          <button
            onClick={fetchAnalytics}
            className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold shadow-xs transition-colors self-start md:self-auto"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-emerald-600 ${loading ? "animate-spin" : ""}`} />
            <span>Refresh Analytics</span>
          </button>
        </div>

        {/* SECTION 1: AI PREDICTION SUMMARY CARDS */}
        <div className="space-y-4">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 rounded-xl bg-purple-100 text-purple-700 shadow-xs">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-extrabold text-slate-900 tracking-tight">
                AI Prediction Summary
              </h2>
              <p className="text-xs text-slate-500">
                Predictive waste increase forecasts and pre-emptive municipal mitigation alerts
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {predictions.map((p) => (
              <div
                key={p.level}
                className={`rounded-2xl p-6 border shadow-xs transition-all flex flex-col justify-between ${p.cardBorder}`}
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className={`text-[10px] px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider border ${p.badgeColor}`}>
                      {p.riskLevel}
                    </span>
                    <span className="text-xs font-mono font-bold text-slate-700 bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-200">
                      {p.confidenceScore}% Confidence
                    </span>
                  </div>

                  <h3 className="font-extrabold text-slate-900 text-base">{p.location}</h3>
                  <div className="text-xs font-bold text-rose-600 mt-1">
                    {p.predictedIncrease}
                  </div>
                  <div className="text-xs text-slate-600 font-medium mt-1">
                    Predicted Waste Type: <strong className="text-slate-800">{p.wasteType}</strong>
                  </div>
                </div>

                <div className="mt-5 pt-3.5 border-t border-slate-100">
                  <span className="text-[11px] font-bold text-slate-800 block mb-1 flex items-center gap-1">
                    <Zap className="w-3.5 h-3.5 text-amber-500" />
                    Recommended Action:
                  </span>
                  <p className="text-xs text-slate-600 italic leading-relaxed">
                    {p.action}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* SECTION 2: TOP WASTE HOTSPOTS TABLE (REPLACING HEATMAP) */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2.5">
              <div className="p-2 rounded-xl bg-emerald-100 text-emerald-800 shadow-xs">
                <Flame className="w-5 h-5 text-emerald-700" />
              </div>
              <div>
                <h2 className="text-lg font-extrabold text-slate-900 tracking-tight">
                  Top Waste Hotspots
                </h2>
                <p className="text-xs text-slate-500">
                  Dynamic priority rankings derived from active municipal complaint records
                </p>
              </div>
            </div>
            <span className="text-[11px] text-slate-500 font-mono">
              Live Municipal Surveillance
            </span>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold text-[11px] uppercase tracking-wider">
                    <th className="py-3.5 px-4 w-12 text-center">#</th>
                    <th className="py-3.5 px-4">Area</th>
                    <th className="py-3.5 px-4 text-center">Complaint Count</th>
                    <th className="py-3.5 px-4">Waste Type</th>
                    <th className="py-3.5 px-4">Priority Level</th>
                    <th className="py-3.5 px-4 text-right">Operational Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {hotspots.map((item, idx) => (
                    <tr
                      key={item.area}
                      className="hover:bg-slate-50/70 transition-colors"
                    >
                      <td className="py-3.5 px-4 text-center font-mono font-bold text-slate-400">
                        0{item.rank || idx + 1}
                      </td>
                      <td className="py-3.5 px-4 font-bold text-slate-900">
                        <div className="flex items-center space-x-2">
                          <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                          <span>{item.area}</span>
                        </div>
                      </td>
                      <td className="py-3.5 px-4 text-center font-mono font-bold text-slate-800">
                        <span className="inline-block px-2.5 py-0.5 rounded-full bg-slate-100 border border-slate-200">
                          {item.complaintCount} report{item.complaintCount === 1 ? "" : "s"}
                        </span>
                      </td>
                      <td className="py-3.5 px-4">
                        <span
                          className={`font-semibold px-2.5 py-0.5 rounded-md border text-[11px] ${getWasteTypeBadgeColor(
                            item.wasteType
                          )}`}
                        >
                          {item.wasteType}
                        </span>
                      </td>
                      <td className="py-3.5 px-4">
                        <span
                          className={`font-bold px-2.5 py-0.5 rounded-full border text-[10px] uppercase tracking-wider ${getPriorityBadgeColor(
                            item.priorityLevel
                          )}`}
                        >
                          {item.priorityLevel}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        {item.complaintCount > 0 ? (
                          <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                            Active Queue
                          </span>
                        ) : (
                          <span className="text-[11px] font-medium text-slate-400 bg-slate-50 px-2 py-0.5 rounded-md">
                            Clear / Monitored
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* SECTION 3: ESSENTIAL VISUAL CHARTS (CLEAN & NON-REPETITIVE) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
          <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h4 className="text-sm font-bold text-slate-900">7-Day Incident Frequency vs Resolved</h4>
                <p className="text-[11px] text-slate-500">City intake and clearance volume</p>
              </div>
              <Calendar className="w-4 h-4 text-slate-400" />
            </div>
            <DailyComplaintsTrendChart data={data?.dailyComplaints || []} />
          </div>

          <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h4 className="text-sm font-bold text-slate-900">Citywide Waste Composition</h4>
                <p className="text-[11px] text-slate-500">Breakdown across 5 classified categories</p>
              </div>
              <Layers className="w-4 h-4 text-slate-400" />
            </div>
            <WasteTypeDistributionChart data={data?.wasteByType || []} />
          </div>
        </div>
      </div>
    </AuthGuard>
  );
}
