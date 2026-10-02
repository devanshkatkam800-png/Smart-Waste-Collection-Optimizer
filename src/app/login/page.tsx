"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Recycle, Lock, Mail, User, ShieldCheck, Truck, Loader2, AlertCircle, Sparkles, ArrowRight } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        if (data.user.role === "ADMIN") {
          router.push("/admin");
        } else if (data.user.role === "WORKER") {
          router.push("/worker");
        } else {
          router.push("/citizen");
        }
        router.refresh();
      } else {
        setErrorMsg(data.error || "Authentication failed");
      }
    } catch (err: any) {
      setErrorMsg(err?.message || "Login error");
    } finally {
      setLoading(false);
    }
  };

  const autofillAccount = (targetEmail: string) => {
    setEmail(targetEmail);
    setPassword("password123");
    setErrorMsg(null);
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full space-y-6">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white flex items-center justify-center mx-auto shadow-sm shadow-emerald-500/20">
            <Recycle className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Sign In to EcoRoute AI
          </h1>
          <p className="text-xs text-slate-500">
            Smart waste collection & municipal optimization platform
          </p>
        </div>

        {/* Evaluation Helper Accounts (Pre-fills inputs for authentic evaluation) */}
        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/90 text-slate-800 space-y-2.5">
          <div className="text-[10px] font-bold text-slate-600 uppercase tracking-wider flex items-center justify-between">
            <span className="flex items-center gap-1.5 font-semibold text-emerald-800">
              Evaluation Credentials
            </span>
            <span className="text-[10px] text-slate-400 font-mono">1-Click Pre-fill</span>
          </div>

          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => autofillAccount("citizen@ecoroute.ai")}
              className={`p-2.5 rounded-xl border text-left transition-all ${
                email === "citizen@ecoroute.ai"
                  ? "bg-emerald-50 border-emerald-600 text-emerald-950 ring-1 ring-emerald-600 shadow-xs"
                  : "bg-white border-slate-200/90 hover:border-emerald-500 hover:bg-emerald-50/30 text-slate-700 shadow-xs"
              }`}
            >
              <User className="w-4 h-4 text-emerald-700 mb-1" />
              <div className="text-xs font-bold leading-tight">Citizen</div>
              <div className="text-[10px] text-slate-500 truncate">Aarav M.</div>
            </button>

            <button
              type="button"
              onClick={() => autofillAccount("admin@ecoroute.ai")}
              className={`p-2.5 rounded-xl border text-left transition-all ${
                email === "admin@ecoroute.ai"
                  ? "bg-emerald-50 border-emerald-600 text-emerald-950 ring-1 ring-emerald-600 shadow-xs"
                  : "bg-white border-slate-200/90 hover:border-emerald-500 hover:bg-emerald-50/30 text-slate-700 shadow-xs"
              }`}
            >
              <ShieldCheck className="w-4 h-4 text-slate-700 mb-1" />
              <div className="text-xs font-bold leading-tight">Admin</div>
              <div className="text-[10px] text-slate-500 truncate">Officer Dave</div>
            </button>

            <button
              type="button"
              onClick={() => autofillAccount("worker@ecoroute.ai")}
              className={`p-2.5 rounded-xl border text-left transition-all ${
                email === "worker@ecoroute.ai"
                  ? "bg-emerald-50 border-emerald-600 text-emerald-950 ring-1 ring-emerald-600 shadow-xs"
                  : "bg-white border-slate-200/90 hover:border-emerald-500 hover:bg-emerald-50/30 text-slate-700 shadow-xs"
              }`}
            >
              <Truck className="w-4 h-4 text-slate-700 mb-1" />
              <div className="text-xs font-bold leading-tight">Worker</div>
              <div className="text-[10px] text-slate-500 truncate">Carlos R.</div>
            </button>
          </div>
        </div>

        {/* Login Form */}
        <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-7 shadow-[0_4px_25px_-5px_rgba(15,23,42,0.05)]">
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="text-xs font-bold text-slate-800 block mb-1.5">
                Official Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@domain.com"
                  className="w-full text-xs font-medium rounded-xl border border-slate-300 pl-10 pr-3.5 py-2.5 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-800 block mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full text-xs font-medium rounded-xl border border-slate-300 pl-10 pr-3.5 py-2.5 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>
            </div>

            {errorMsg && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs shadow-md shadow-emerald-600/20 transition-all flex items-center justify-center space-x-2 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Authenticating...</span>
                </>
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </form>

          <div className="mt-5 pt-4 border-t border-slate-100 text-center text-xs text-slate-500">
            Don't have an account?{" "}
            <Link href="/register" className="font-bold text-emerald-700 hover:text-emerald-800">
              Register Citizen Profile
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
