"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { User, ShieldCheck, Truck, RefreshCw, CheckCircle2 } from "lucide-react";

export default function RoleSwitcher() {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [loadingRole, setLoadingRole] = useState<string | null>(null);
  const [resetting, setResetting] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);

  const fetchSession = async () => {
    try {
      const res = await fetch("/api/auth/me");
      if (res.ok) {
        const data = await res.json();
        setCurrentUser(data.user);
      }
    } catch (e) {
      // ignore
    }
  };

  useEffect(() => {
    fetchSession();
  }, []);

  const switchRole = async (email: string, targetPath: string, roleName: string) => {
    setLoadingRole(roleName);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password: "password123" }),
      });

      if (res.ok) {
        const data = await res.json();
        setCurrentUser(data.user);
        setNotification(`Switched to ${roleName}`);
        setTimeout(() => setNotification(null), 3000);
        router.push(targetPath);
        router.refresh();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingRole(null);
    }
  };

  const handleResetData = async () => {
    if (!confirm("Reset all complaints, fleet assignments and predictions to demo defaults?")) return;
    setResetting(true);
    try {
      const res = await fetch("/api/seed", { method: "POST" });
      if (res.ok) {
        setNotification("Demo data reset to fresh state!");
        setTimeout(() => setNotification(null), 3000);
        router.refresh();
      }
    } catch (e) {
      console.error(e);
    } finally {
      setResetting(false);
    }
  };

  return (
    <div className="bg-slate-900 text-slate-200 text-xs border-b border-slate-800 px-4 py-2 relative z-50">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center space-x-2">
          <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
            DEMO MODE
          </span>
          <span className="text-slate-400 hidden sm:inline">
            Quick Persona Switcher:
          </span>
          {currentUser && (
            <span className="text-slate-300 bg-slate-800 px-2 py-0.5 rounded border border-slate-700">
              Active: <strong className="text-emerald-400">{currentUser.name}</strong> ({currentUser.role})
            </span>
          )}
        </div>

        <div className="flex items-center space-x-1.5 flex-wrap">
          <button
            onClick={() => switchRole("citizen@ecoroute.ai", "/citizen", "Citizen Alice")}
            disabled={loadingRole !== null}
            className={`inline-flex items-center space-x-1 px-2.5 py-1 rounded transition-all font-medium ${
              currentUser?.role === "CITIZEN"
                ? "bg-emerald-600 text-white shadow-sm ring-1 ring-emerald-400"
                : "bg-slate-800 hover:bg-slate-700 text-slate-200"
            }`}
          >
            <User className="w-3.5 h-3.5 text-emerald-400" />
            <span>Citizen (Alice)</span>
          </button>

          <button
            onClick={() => switchRole("admin@ecoroute.ai", "/admin", "Admin Dave")}
            disabled={loadingRole !== null}
            className={`inline-flex items-center space-x-1 px-2.5 py-1 rounded transition-all font-medium ${
              currentUser?.role === "ADMIN"
                ? "bg-blue-600 text-white shadow-sm ring-1 ring-blue-400"
                : "bg-slate-800 hover:bg-slate-700 text-slate-200"
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
            <span>Admin (Dave)</span>
          </button>

          <button
            onClick={() => switchRole("worker@ecoroute.ai", "/worker", "Worker Carlos")}
            disabled={loadingRole !== null}
            className={`inline-flex items-center space-x-1 px-2.5 py-1 rounded transition-all font-medium ${
              currentUser?.role === "WORKER"
                ? "bg-amber-600 text-white shadow-sm ring-1 ring-amber-400"
                : "bg-slate-800 hover:bg-slate-700 text-slate-200"
            }`}
          >
            <Truck className="w-3.5 h-3.5 text-amber-400" />
            <span>Worker (Carlos)</span>
          </button>

          <button
            onClick={handleResetData}
            disabled={resetting}
            title="Reset complaints to fresh demo dataset"
            className="inline-flex items-center space-x-1 px-2 py-1 rounded bg-slate-800/80 hover:bg-rose-950/60 hover:text-rose-300 text-slate-400 transition-colors ml-1 border border-slate-700/60"
          >
            <RefreshCw className={`w-3 h-3 ${resetting ? "animate-spin text-rose-400" : ""}`} />
            <span className="hidden md:inline">Reset Data</span>
          </button>
        </div>
      </div>

      {notification && (
        <div className="absolute top-full left-1/2 -translate-x-1/2 mt-1 bg-emerald-600 text-white text-xs px-3 py-1 rounded shadow-lg flex items-center space-x-1.5 animate-bounce z-50">
          <CheckCircle2 className="w-3.5 h-3.5" />
          <span>{notification}</span>
        </div>
      )}
    </div>
  );
}
