import React from "react";
import { LucideIcon } from "lucide-react";

interface Props {
  title: string;
  value: number | string;
  subtitle?: string;
  icon: LucideIcon;
  colorScheme: "emerald" | "amber" | "blue" | "rose" | "purple" | "slate";
  trend?: string;
}

export default function StatCard({
  title,
  value,
  subtitle,
  icon: Icon,
  colorScheme,
  trend,
}: Props) {
  const schemeStyles = {
    emerald: {
      border: "border-emerald-200/80",
      bg: "bg-emerald-50/50",
      iconBg: "bg-emerald-100 text-emerald-600",
      text: "text-emerald-700",
    },
    amber: {
      border: "border-amber-200/80",
      bg: "bg-amber-50/50",
      iconBg: "bg-amber-100 text-amber-600",
      text: "text-amber-700",
    },
    blue: {
      border: "border-blue-200/80",
      bg: "bg-blue-50/50",
      iconBg: "bg-blue-100 text-blue-600",
      text: "text-blue-700",
    },
    rose: {
      border: "border-rose-200/80",
      bg: "bg-rose-50/50",
      iconBg: "bg-rose-100 text-rose-600",
      text: "text-rose-700",
    },
    purple: {
      border: "border-purple-200/80",
      bg: "bg-purple-50/50",
      iconBg: "bg-purple-100 text-purple-600",
      text: "text-purple-700",
    },
    slate: {
      border: "border-slate-200/80",
      bg: "bg-slate-50/50",
      iconBg: "bg-slate-100 text-slate-600",
      text: "text-slate-700",
    },
  }[colorScheme];

  return (
    <div
      className={`rounded-2xl p-5 bg-white border ${schemeStyles.border} shadow-xs hover:shadow-md transition-all flex flex-col justify-between`}
    >
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-slate-500 tracking-wide uppercase">
          {title}
        </span>
        <div className={`p-2.5 rounded-xl ${schemeStyles.iconBg}`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>

      <div className="mt-3">
        <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          {value}
        </div>
        {subtitle && (
          <div className="flex items-center justify-between mt-1 text-xs text-slate-500">
            <span>{subtitle}</span>
            {trend && <span className={`font-semibold ${schemeStyles.text}`}>{trend}</span>}
          </div>
        )}
      </div>
    </div>
  );
}
