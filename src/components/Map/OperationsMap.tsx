"use client";

import React, { useEffect, useRef, useState } from "react";
import { getPriorityBadgeColor, getStatusBadgeColor, getWasteTypeBadgeColor } from "@/lib/utils";
import { AlertCircle, User, MapPin, Eye, CheckCircle2, Navigation, Compass } from "lucide-react";

interface ComplaintMapItem {
  id: string;
  ticketNo: string;
  title: string;
  wasteType: string;
  quantity: string;
  estimatedWeightKg?: number;
  priorityLevel: "HIGH" | "MEDIUM" | "LOW" | string;
  priorityScore: number;
  status: "PENDING" | "ASSIGNED" | "COLLECTED" | string;
  latitude: number;
  longitude: number;
  address: string;
  assignedWorker?: { id: string; name: string; phone: string } | null;
  imageUrl?: string | null;
}

interface WorkerMapItem {
  id: string;
  name: string;
  vehicleType: string;
  status: string;
  currentLat: number;
  currentLng: number;
  activeMissionsCount: number;
}

interface Props {
  complaints: ComplaintMapItem[];
  workers?: WorkerMapItem[];
  selectedComplaintId?: string | null;
  onSelectComplaint?: (complaint: ComplaintMapItem) => void;
  center?: [number, number];
  zoom?: number;
}

const MUMBAI_NEIGHBORHOODS = [
  { name: "All Mumbai", lat: 19.0760, lng: 72.8777, zoom: 11 },
  { name: "Dadar", lat: 19.0178, lng: 72.8478, zoom: 14 },
  { name: "Bandra W", lat: 19.0596, lng: 72.8295, zoom: 14 },
  { name: "Andheri W", lat: 19.1363, lng: 72.8277, zoom: 14 },
  { name: "Powai", lat: 19.1176, lng: 72.9060, zoom: 14 },
  { name: "Lower Parel", lat: 18.9953, lng: 72.8315, zoom: 14 },
  { name: "Sion", lat: 19.0434, lng: 72.8634, zoom: 14 },
  { name: "Mahim", lat: 19.0354, lng: 72.8437, zoom: 14 },
  { name: "Prabhadevi", lat: 19.0166, lng: 72.8295, zoom: 14 },
  { name: "Navi Mumbai", lat: 19.0330, lng: 73.0297, zoom: 13 },
];

export default function OperationsMap({
  complaints,
  workers = [],
  selectedComplaintId,
  onSelectComplaint,
  center = [19.0760, 72.8777], // Center around Mumbai
  zoom = 11, // Default Zoom 11
}: Props) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const leafletRef = useRef<any>(null);
  const complaintsLayerRef = useRef<any>(null);
  const workersLayerRef = useRef<any>(null);
  const routesLayerRef = useRef<any>(null);

  const [mapReady, setMapReady] = useState<boolean>(false);
  const [filterPriority, setFilterPriority] = useState<string>("ALL");
  const [filterStatus, setFilterStatus] = useState<string>("ALL");
  const [showWorkers, setShowWorkers] = useState<boolean>(true);
  const [showAssignmentRoutes, setShowAssignmentRoutes] = useState<boolean>(true);
  const [activePopupComplaint, setActivePopupComplaint] = useState<ComplaintMapItem | null>(null);

  // Initialize Leaflet Map once
  useEffect(() => {
    if (!mapContainerRef.current || typeof window === "undefined") return;

    let isMounted = true;

    import("leaflet").then((L) => {
      if (!isMounted || !mapContainerRef.current) return;

      if (!mapInstanceRef.current) {
        const map = L.map(mapContainerRef.current, {
          center,
          zoom,
          zoomControl: true,
          attributionControl: false,
        });

        // Crisp OpenStreetMap Carto tiles
        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
          maxZoom: 19,
        }).addTo(map);

        // Create separate layer groups in order of z-stacking:
        // 1. Routes (bottom)
        // 2. Workers (middle)
        // 3. Complaints (top)
        const routesLayer = L.layerGroup().addTo(map);
        const workersLayer = L.layerGroup().addTo(map);
        const complaintsLayer = L.layerGroup().addTo(map);

        mapInstanceRef.current = map;
        routesLayerRef.current = routesLayer;
        workersLayerRef.current = workersLayer;
        complaintsLayerRef.current = complaintsLayer;
        leafletRef.current = L;

        setMapReady(true);
      }
    });

    return () => {
      isMounted = false;
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
        setMapReady(false);
      }
    };
  }, []);

  const handleJumpToZone = (loc: (typeof MUMBAI_NEIGHBORHOODS)[0]) => {
    const map = mapInstanceRef.current;
    if (map) {
      map.setView([loc.lat, loc.lng], loc.zoom, { animate: true });
    }
  };

  const renderAllMarkers = (L: any) => {
    const map = mapInstanceRef.current;
    const complaintsLayer = complaintsLayerRef.current;
    const workersLayer = workersLayerRef.current;
    const routesLayer = routesLayerRef.current;

    if (!map || !complaintsLayer || !workersLayer || !routesLayer) return;

    // Clear all layers before re-rendering
    complaintsLayer.clearLayers();
    workersLayer.clearLayers();
    routesLayer.clearLayers();

    // 1. Filter Complaints by Priority and Status
    const filteredComplaints = complaints.filter((c) => {
      const score = Number(c.priorityScore) || 0;
      let effectiveLevel = String(c.priorityLevel || "").toUpperCase();
      if (score >= 70) effectiveLevel = "HIGH";
      else if (score >= 45) effectiveLevel = "MEDIUM";
      else effectiveLevel = "LOW";

      // Priority Filter
      let matchP = true;
      if (filterPriority === "HIGH") {
        matchP = score >= 70 || effectiveLevel === "HIGH";
      } else if (filterPriority === "MEDIUM") {
        matchP = (score >= 45 && score < 70) || effectiveLevel === "MEDIUM";
      } else if (filterPriority === "LOW") {
        matchP = score < 45 || effectiveLevel === "LOW";
      }

      // Status Filter
      let matchS = true;
      if (filterStatus !== "ALL") {
        const cStatus = String(c.status || "").toUpperCase();
        if (filterStatus === "PENDING" || filterStatus === "OPEN") {
          matchS = cStatus === "PENDING" || cStatus === "OPEN";
        } else {
          matchS = cStatus === filterStatus.toUpperCase();
        }
      }

      return matchP && matchS;
    });

    // 2. Render Complaint Markers (Red, Yellow, Green)
    // Red = High Priority (>=70), Yellow = Medium Priority (45-69), Green = Low Priority (<45)
    filteredComplaints.forEach((c) => {
      const lat = Number(c.latitude);
      const lng = Number(c.longitude);
      if (isNaN(lat) || isNaN(lng)) return;

      const isSelected = selectedComplaintId === c.id;
      const score = Number(c.priorityScore) || 0;

      let color = "#10B981"; // Low Priority: Green (<45)
      let effectiveLevel = "LOW";
      let pulseClass = "";

      if (score >= 70 || String(c.priorityLevel).toUpperCase() === "HIGH") {
        color = "#EF4444"; // High Priority: Red (>=70)
        effectiveLevel = "HIGH";
        pulseClass = "pulse-urgent";
      } else if (score >= 45 || String(c.priorityLevel).toUpperCase() === "MEDIUM") {
        color = "#F59E0B"; // Medium Priority: Yellow (45-69)
        effectiveLevel = "MEDIUM";
      }

      const iconHtml = `
        <div style="position: relative; width: 34px; height: 34px; display: flex; align-items: center; justify-content: center;">
          <div class="${pulseClass}" style="
            width: ${isSelected ? "34px" : "28px"};
            height: ${isSelected ? "34px" : "28px"};
            border-radius: 9999px;
            background-color: ${color};
            border: 2.5px solid #ffffff;
            box-shadow: 0 4px 12px rgba(15,23,42,0.35);
            display: flex;
            align-items: center;
            justify-content: center;
            color: #ffffff;
            font-size: 11px;
            font-weight: 800;
            cursor: pointer;
            transition: all 0.2s ease-in-out;
            ${isSelected ? "transform: scale(1.25); outline: 3px solid #059669;" : ""}
          ">
            ${score}
          </div>
        </div>
      `;

      const customIcon = L.divIcon({
        html: iconHtml,
        className: "custom-leaflet-marker",
        iconSize: [34, 34],
        iconAnchor: [17, 17],
      });

      const marker = L.marker([lat, lng], {
        icon: customIcon,
        zIndexOffset: 1000, // Always render complaints on top
      });

      marker.bindTooltip(
        `<strong>${c.ticketNo}</strong><br/>Priority: ${score} (${effectiveLevel})<br/>${c.address}`,
        { direction: "top", offset: [0, -14] }
      );

      marker.on("click", () => {
        setActivePopupComplaint(c);
        if (onSelectComplaint) onSelectComplaint(c);
      });

      marker.addTo(complaintsLayer);

      if (isSelected) {
        map.setView([lat, lng], Math.max(map.getZoom(), 14), { animate: true });
      }
    });

    // 3. Render Fleet Vehicle GPS Pins (Blue 🚚)
    if (showWorkers) {
      workers.forEach((w) => {
        const lat = Number(w.currentLat);
        const lng = Number(w.currentLng);
        if (isNaN(lat) || isNaN(lng)) return;

        const workerHtml = `
          <div style="
            width: 32px;
            height: 32px;
            border-radius: 9px;
            background: linear-gradient(135deg, #0284c7, #0369a1);
            border: 2px solid white;
            box-shadow: 0 4px 10px rgba(2, 132, 199, 0.4);
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-size: 14px;
            cursor: pointer;
          " title="${w.name} (${w.vehicleType})">
            🚚
          </div>
        `;

        const workerIcon = L.divIcon({
          html: workerHtml,
          className: "custom-worker-marker",
          iconSize: [32, 32],
          iconAnchor: [16, 16],
        });

        const workerMarker = L.marker([lat, lng], {
          icon: workerIcon,
          zIndexOffset: 500,
        });

        workerMarker.bindTooltip(
          `<strong>${w.name}</strong><br/>${w.vehicleType} &bull; ${w.status}`,
          { direction: "top", offset: [0, -12] }
        );

        workerMarker.addTo(workersLayer);
      });
    }

    // 4. Live Assignment Tracking: Render Connecting Vectors
    if (showAssignmentRoutes) {
      filteredComplaints.forEach((c) => {
        if (c.status === "ASSIGNED") {
          const workerId = c.assignedWorker?.id;
          const workerName = c.assignedWorker?.name;
          const matchedWorker = workers.find(
            (w) => (workerId && w.id === workerId) || (workerName && w.name === workerName)
          );
          if (matchedWorker && matchedWorker.currentLat && matchedWorker.currentLng) {
            const isSelected = selectedComplaintId === c.id;
            const routeLine = L.polyline(
              [
                [Number(matchedWorker.currentLat), Number(matchedWorker.currentLng)],
                [Number(c.latitude), Number(c.longitude)],
              ],
              {
                color: isSelected ? "#059669" : "#0284c7",
                weight: isSelected ? 4 : 2.5,
                dashArray: "6, 8",
                opacity: 0.9,
              }
            );
            routeLine.bindTooltip(
              `<strong>Live Assignment Route</strong><br/>${matchedWorker.name} ➔ ${c.ticketNo}`,
              { sticky: true }
            );
            routeLine.on("click", () => {
              setActivePopupComplaint(c);
              if (onSelectComplaint) onSelectComplaint(c);
            });
            routeLine.addTo(routesLayer);
          }
        }
      });
    }
  };

  // Re-render markers whenever data, filters, or map readiness changes
  useEffect(() => {
    if (!mapReady || !leafletRef.current || !mapInstanceRef.current) return;
    renderAllMarkers(leafletRef.current);
  }, [
    mapReady,
    complaints,
    workers,
    filterPriority,
    filterStatus,
    showWorkers,
    showAssignmentRoutes,
    selectedComplaintId,
  ]);

  return (
    <div className="relative w-full h-[540px] rounded-2xl overflow-hidden border border-slate-200/90 shadow-sm bg-slate-50">
      {/* Top Controls Bar */}
      <div className="absolute top-3 left-3 right-3 z-[400] flex flex-wrap items-center justify-between gap-2 pointer-events-none">
        {/* Filter controls */}
        <div className="flex flex-wrap items-center gap-2 bg-white/95 backdrop-blur-md p-2 rounded-xl border border-slate-200 shadow-sm text-xs pointer-events-auto">
          <div className="flex items-center space-x-1">
            <span className="font-bold text-slate-700">Priority:</span>
            <select
              value={filterPriority}
              onChange={(e) => setFilterPriority(e.target.value)}
              className="border border-slate-300 rounded-lg px-2 py-1 text-xs bg-white text-slate-800 focus:outline-none focus:ring-1 focus:ring-emerald-500"
            >
              <option value="ALL">All Priorities</option>
              <option value="HIGH">High (Red &ge;70)</option>
              <option value="MEDIUM">Medium (Yellow 45-69)</option>
              <option value="LOW">Low (Green &lt;45)</option>
            </select>
          </div>

          <div className="flex items-center space-x-1">
            <span className="font-bold text-slate-700">Status:</span>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="border border-slate-300 rounded-lg px-2 py-1 text-xs bg-white text-slate-800 focus:outline-none focus:ring-1 focus:ring-emerald-500"
            >
              <option value="ALL">All Statuses</option>
              <option value="PENDING">Open / Pending</option>
              <option value="ASSIGNED">Assigned</option>
              <option value="COLLECTED">Collected</option>
            </select>
          </div>

          <label className="flex items-center space-x-1.5 text-slate-700 cursor-pointer ml-1">
            <input
              type="checkbox"
              checked={showWorkers}
              onChange={(e) => setShowWorkers(e.target.checked)}
              className="rounded text-emerald-600 focus:ring-emerald-500"
            />
            <span className="text-slate-700 font-semibold">Fleet Telemetry</span>
          </label>

          <label className="flex items-center space-x-1.5 text-slate-700 cursor-pointer ml-1">
            <input
              type="checkbox"
              checked={showAssignmentRoutes}
              onChange={(e) => setShowAssignmentRoutes(e.target.checked)}
              className="rounded text-sky-600 focus:ring-sky-500"
            />
            <span className="text-slate-700 font-semibold">Live Assignments</span>
          </label>
        </div>

        {/* Quick Mumbai Hub Jump Selector */}
        <div className="hidden sm:flex items-center gap-1 bg-white/95 backdrop-blur-md p-1.5 rounded-xl border border-slate-200 shadow-sm text-[11px] overflow-x-auto pointer-events-auto">
          <Compass className="w-3.5 h-3.5 text-emerald-600 ml-1 mr-0.5" />
          <span className="text-slate-400 font-medium mr-1">Mumbai Hubs:</span>
          {MUMBAI_NEIGHBORHOODS.slice(0, 7).map((loc) => (
            <button
              key={loc.name}
              onClick={() => handleJumpToZone(loc)}
              className="px-2 py-1 rounded-md text-slate-700 hover:text-emerald-700 hover:bg-emerald-50 font-medium transition-colors"
            >
              {loc.name}
            </button>
          ))}
        </div>
      </div>

      {/* Legend Badge (Rewaste Clean Style) */}
      <div className="absolute bottom-3 left-3 z-[400] bg-white/95 backdrop-blur-md p-3 rounded-xl border border-slate-200 shadow-sm text-[11px] space-y-1.5">
        <div className="font-bold text-slate-900 tracking-wide flex items-center justify-between border-b border-slate-100 pb-1">
          <span>Mumbai Command Grid</span>
          <span className="text-[10px] text-emerald-600 font-bold bg-emerald-50 px-1.5 py-0.2 rounded">19.076° N, 72.877° E</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-red-500 ring-2 ring-red-200"></span>
          <span className="text-slate-700 font-medium">Red = High Priority (&ge;70)</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-amber-500 ring-2 ring-amber-200"></span>
          <span className="text-slate-700 font-medium">Yellow = Medium Priority (45-69)</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-emerald-500 ring-2 ring-emerald-200"></span>
          <span className="text-slate-700 font-medium">Green = Low Priority (&lt;45)</span>
        </div>
        <div className="flex items-center gap-2 pt-0.5 border-t border-slate-100">
          <span className="w-4 h-4 rounded-md bg-sky-600 text-white text-[10px] flex items-center justify-center">🚚</span>
          <span className="text-slate-700 font-medium">Blue = On-Duty Fleet Driver</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-4 h-0.5 border-t-2 border-dashed border-sky-600"></span>
          <span className="text-slate-700 font-medium">Dashed Blue = Live Assignment Route</span>
        </div>
      </div>

      {/* Interactive Detail Modal when Marker is Clicked */}
      {activePopupComplaint && (
        <div className="absolute top-16 right-3 z-[400] w-84 bg-white/98 backdrop-blur-md rounded-2xl p-4 border border-slate-200 shadow-xl transition-all animate-in fade-in slide-in-from-top-2">
          <div className="flex items-start justify-between gap-2 border-b border-slate-100 pb-2.5">
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-mono font-bold text-slate-900">{activePopupComplaint.ticketNo}</span>
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold border ${getPriorityBadgeColor(activePopupComplaint.priorityLevel)}`}>
                  {activePopupComplaint.priorityLevel} ({activePopupComplaint.priorityScore})
                </span>
              </div>
              <h4 className="text-xs font-bold text-slate-900 mt-1 line-clamp-1">{activePopupComplaint.title}</h4>
            </div>
            <button
              onClick={() => setActivePopupComplaint(null)}
              className="text-slate-400 hover:text-slate-700 text-base font-bold p-1 leading-none rounded-md hover:bg-slate-100"
            >
              &times;
            </button>
          </div>

          <div className="mt-3 space-y-2 text-xs text-slate-600">
            <div className="flex justify-between items-center">
              <span className="text-slate-500 font-medium">Waste Type:</span>
              <span className={`font-bold px-2 py-0.5 rounded border text-[11px] ${getWasteTypeBadgeColor(activePopupComplaint.wasteType)}`}>
                {activePopupComplaint.wasteType}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-500 font-medium">Quantity / Weight:</span>
              <span className="font-bold text-slate-800">
                {activePopupComplaint.quantity} (~{activePopupComplaint.estimatedWeightKg || 25} kg)
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-500 font-medium">Complaint Status:</span>
              <span className={`text-[11px] px-2 py-0.5 rounded-full font-bold border ${getStatusBadgeColor(activePopupComplaint.status)}`}>
                {activePopupComplaint.status}
              </span>
            </div>
            <div className="flex justify-between items-center pt-1 border-t border-slate-100">
              <span className="text-slate-500 font-medium">Assigned Worker:</span>
              <span className="font-bold text-emerald-800">
                {activePopupComplaint.assignedWorker ? (
                  <span className="flex items-center gap-1">
                    <User className="w-3.5 h-3.5 text-emerald-600" />
                    {activePopupComplaint.assignedWorker.name}
                  </span>
                ) : (
                  <span className="text-slate-400 italic">Unassigned</span>
                )}
              </span>
            </div>
            <div className="flex items-start gap-1 pt-1 text-[11px] text-slate-500">
              <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
              <span className="line-clamp-2">{activePopupComplaint.address}</span>
            </div>
          </div>

          {activePopupComplaint.imageUrl && (
            <div className="mt-3 rounded-xl overflow-hidden border border-slate-200 h-28 bg-slate-100">
              <img
                src={activePopupComplaint.imageUrl}
                alt="Complaint"
                className="w-full h-full object-cover"
              />
            </div>
          )}
        </div>
      )}

      {/* Map Leaflet Container */}
      <div ref={mapContainerRef} className="w-full h-full" />
    </div>
  );
}
