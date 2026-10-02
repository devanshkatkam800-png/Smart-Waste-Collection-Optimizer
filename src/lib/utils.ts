import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDateTime(date: string | Date | null | undefined): string {
  if (!date) return "N/A";
  const d = new Date(date);
  return d.toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function getPriorityBadgeColor(priority: string) {
  switch (priority?.toUpperCase()) {
    case "HIGH":
      return "bg-rose-50 text-rose-700 border-rose-200 ring-rose-500/20";
    case "MEDIUM":
      return "bg-amber-50 text-amber-700 border-amber-200 ring-amber-500/20";
    case "LOW":
      return "bg-emerald-50 text-emerald-700 border-emerald-200 ring-emerald-500/20";
    default:
      return "bg-slate-50 text-slate-700 border-slate-200 ring-slate-500/20";
  }
}

export function getStatusBadgeColor(status: string) {
  switch (status?.toUpperCase()) {
    case "COLLECTED":
      return "bg-emerald-100 text-emerald-800 border-emerald-300";
    case "ASSIGNED":
      return "bg-blue-100 text-blue-800 border-blue-300";
    case "PENDING":
      return "bg-amber-100 text-amber-800 border-amber-300";
    default:
      return "bg-slate-100 text-slate-800 border-slate-300";
  }
}

export function getWasteTypeBadgeColor(type: string) {
  switch (type?.toUpperCase()) {
    case "PLASTIC":
      return "bg-sky-100 text-sky-800 border-sky-300";
    case "ORGANIC":
      return "bg-emerald-100 text-emerald-800 border-emerald-300";
    case "PAPER":
      return "bg-amber-100 text-amber-800 border-amber-300";
    case "E_WASTE":
      return "bg-purple-100 text-purple-800 border-purple-300";
    case "MIXED":
    default:
      return "bg-gray-100 text-gray-800 border-gray-300";
  }
}
