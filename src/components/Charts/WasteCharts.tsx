"use client";

import React from "react";
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

const TYPE_COLORS: Record<string, string> = {
  PLASTIC: "#0284C7",
  ORGANIC: "#10B981",
  PAPER: "#F59E0B",
  MIXED: "#64748B",
  E_WASTE: "#8B5CF6",
};

export function WasteTypeDistributionChart({ data }: { data: any[] }) {
  const chartData = data.map((d) => ({
    name: d.type,
    value: d.count,
    weightKg: d.weightKg,
    color: TYPE_COLORS[d.type] || "#10B981",
  }));

  return (
    <div className="w-full h-64">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            innerRadius={50}
            outerRadius={80}
            paddingAngle={4}
            dataKey="value"
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip
            formatter={(value: any, name: any, item: any) => [
              `${value} complaints (${item.payload.weightKg} kg)`,
              name,
            ]}
          />
          <Legend
            verticalAlign="bottom"
            height={36}
            formatter={(value) => <span className="text-xs text-slate-600">{value}</span>}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}

export function DailyComplaintsTrendChart({ data }: { data: any[] }) {
  return (
    <div className="w-full h-64">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
          <XAxis dataKey="day" tick={{ fontSize: 11, fill: "#64748b" }} />
          <YAxis tick={{ fontSize: 11, fill: "#64748b" }} />
          <Tooltip
            contentStyle={{
              backgroundColor: "#ffffff",
              borderRadius: "0.75rem",
              border: "1px solid #e2e8f0",
              fontSize: "12px",
            }}
          />
          <Legend
            verticalAlign="top"
            height={36}
            formatter={(value) => <span className="text-xs text-slate-600 font-medium">{value}</span>}
          />
          <Line
            type="monotone"
            dataKey="complaints"
            name="Reported Incidents"
            stroke="#0284c7"
            strokeWidth={3}
            dot={{ r: 4, fill: "#0284c7" }}
            activeDot={{ r: 6 }}
          />
          <Line
            type="monotone"
            dataKey="resolved"
            name="Cleaned & Verified"
            stroke="#10b981"
            strokeWidth={3}
            dot={{ r: 4, fill: "#10b981" }}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export function AreaVolumeBarChart({ data }: { data: any[] }) {
  const chartData = data.slice(0, 6).map((d) => ({
    name: d.area.replace(" Hub", "").replace(" Zone", "").replace(" District", ""),
    complaints: d.complaints,
    weightKg: d.weightKg,
  }));

  return (
    <div className="w-full h-64">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
          <XAxis dataKey="name" tick={{ fontSize: 10, fill: "#64748b" }} />
          <YAxis tick={{ fontSize: 11, fill: "#64748b" }} />
          <Tooltip
            formatter={(value: any, name: any) => [
              name === "weightKg" ? `${value} kg` : `${value} complaints`,
              name === "weightKg" ? "Total Tonnage (kg)" : "Complaints",
            ]}
            contentStyle={{
              backgroundColor: "#ffffff",
              borderRadius: "0.75rem",
              border: "1px solid #e2e8f0",
              fontSize: "12px",
            }}
          />
          <Legend
            verticalAlign="top"
            height={36}
            formatter={(value) => (
              <span className="text-xs text-slate-600 font-medium">
                {value === "weightKg" ? "Volume (kg)" : "Complaint Incidents"}
              </span>
            )}
          />
          <Bar dataKey="complaints" fill="#0D9488" radius={[4, 4, 0, 0]} />
          <Bar dataKey="weightKg" fill="#38BDF8" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
