"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Recycle,
  LayoutDashboard,
  MapPin,
  TrendingUp,
  Truck,
  LogOut,
  LogIn,
  Menu,
  X,
  Sparkles,
  PlusCircle,
  Clock,
  Shield,
  User,
} from "lucide-react";

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    fetch("/api/auth/me")
      .then((r) => r.json())
      .then((d) => setUser(d.user))
      .catch(() => setUser(null));
  }, [pathname]);

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    setUser(null);
    router.push("/login");
    router.refresh();
  };

  // Define role-specific navigation menus
  let navLinks: { href: string; label: string; icon: any }[] = [];

  if (user?.role === "CITIZEN") {
    navLinks = [
      { href: "/citizen", label: "Citizen Dashboard", icon: LayoutDashboard },
    ];
  } else if (user?.role === "ADMIN") {
    navLinks = [
      { href: "/admin", label: "Operations Hub", icon: LayoutDashboard },
      { href: "/admin/analytics", label: "Analytics & Predictions", icon: TrendingUp },
    ];
  } else if (user?.role === "WORKER") {
    navLinks = [
      { href: "/worker", label: "Worker Missions", icon: Truck },
    ];
  }

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-100 shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo & Platform Title */}
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white shadow-sm shadow-emerald-500/20 group-hover:scale-105 transition-transform">
              <Recycle className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-extrabold text-base tracking-tight text-slate-900 group-hover:text-emerald-700 transition-colors">EcoRoute AI</span>
                <span className="text-[10px] px-2.5 py-0.5 rounded-full font-bold bg-emerald-50 text-emerald-800 border border-emerald-200/80">
                  Smart City
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-medium leading-none mt-0.5">
                Smart Waste Collection Optimizer
              </p>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center space-x-1 lg:space-x-2">
            {user ? (
              // Authenticated Role-Isolated Navigation
              navLinks.map((link) => {
                const Icon = link.icon;
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`inline-flex items-center space-x-2 px-3.5 py-2 rounded-full text-xs font-bold transition-all ${
                      isActive
                        ? "bg-emerald-50 text-emerald-800 shadow-xs border border-emerald-200/80"
                        : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                    }`}
                  >
                    <Icon className={`w-4 h-4 ${isActive ? "text-emerald-600" : "text-slate-400"}`} />
                    <span>{link.label}</span>
                  </Link>
                );
              })
            ) : (
              // Public Visitor Navigation (Rewaste-inspired section links)
              <>
                <Link
                  href="/#features"
                  className="px-3.5 py-2 text-xs font-semibold text-slate-600 hover:text-emerald-700 hover:bg-emerald-50/50 rounded-full transition-all"
                >
                  Features
                </Link>
                <Link
                  href="/#how-it-works"
                  className="px-3.5 py-2 text-xs font-semibold text-slate-600 hover:text-emerald-700 hover:bg-emerald-50/50 rounded-full transition-all"
                >
                  How It Works
                </Link>
                <Link
                  href="/#impact"
                  className="px-3.5 py-2 text-xs font-semibold text-slate-600 hover:text-emerald-700 hover:bg-emerald-50/50 rounded-full transition-all"
                >
                  Impact
                </Link>
                <Link
                  href="/#about"
                  className="px-3.5 py-2 text-xs font-semibold text-slate-600 hover:text-emerald-700 hover:bg-emerald-50/50 rounded-full transition-all"
                >
                  About
                </Link>
                <Link
                  href="/#contact"
                  className="px-3.5 py-2 text-xs font-semibold text-slate-600 hover:text-emerald-700 hover:bg-emerald-50/50 rounded-full transition-all"
                >
                  Contact
                </Link>
              </>
            )}
          </nav>

          {/* User Profile / Auth State */}
          <div className="hidden md:flex items-center space-x-3">
            {user ? (
              <div className="flex items-center space-x-3 pl-3 border-l border-slate-200">
                <div className="flex flex-col text-right">
                  <span className="text-xs font-bold text-slate-800 leading-tight">{user.name}</span>
                  <span className="text-[10px] text-emerald-700 font-extrabold uppercase tracking-wider">
                    {user.role}
                  </span>
                </div>
                <button
                  onClick={handleLogout}
                  title="Sign out"
                  className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors border border-transparent hover:border-rose-100"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-2.5">
                <Link
                  href="/login"
                  className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-full text-xs font-bold text-slate-700 hover:text-slate-900 hover:bg-slate-100 transition-colors"
                >
                  <LogIn className="w-3.5 h-3.5 text-slate-500" />
                  <span>Sign In</span>
                </Link>
                <Link
                  href="/register"
                  className="inline-flex items-center px-4 py-2 rounded-full text-xs font-bold bg-emerald-600 text-white hover:bg-emerald-700 shadow-xs hover:shadow-emerald-600/20 transition-all"
                >
                  Register
                </Link>
              </div>
            )}
          </div>

          {/* Mobile hamburger */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle Menu"
              className="p-2 rounded-xl text-slate-600 hover:bg-slate-100 transition-colors"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-100 bg-white px-4 pt-3 pb-5 space-y-2">
          {user ? (
            navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center space-x-3 px-3 py-2.5 rounded-xl text-xs font-bold ${
                    isActive ? "bg-emerald-50 text-emerald-800" : "text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  <Icon className="w-4 h-4 text-emerald-600" />
                  <span>{link.label}</span>
                </Link>
              );
            })
          ) : (
            <div className="space-y-1 pb-2">
              <Link
                href="/#features"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-50"
              >
                Features
              </Link>
              <Link
                href="/#how-it-works"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-50"
              >
                How It Works
              </Link>
              <Link
                href="/#impact"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-50"
              >
                Impact
              </Link>
              <Link
                href="/#about"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-50"
              >
                About
              </Link>
              <Link
                href="/#contact"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-50"
              >
                Contact
              </Link>
            </div>
          )}

          <div className="pt-3 border-t border-slate-100">
            {user ? (
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-slate-900">{user.name}</p>
                  <p className="text-[10px] text-emerald-700 font-extrabold uppercase">{user.role}</p>
                </div>
                <button
                  onClick={handleLogout}
                  className="px-3 py-1.5 rounded-lg text-xs font-bold text-rose-600 hover:bg-rose-50"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <div className="flex space-x-2">
                <Link
                  href="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex-1 text-center py-2 text-xs font-bold border border-slate-200 rounded-full"
                >
                  Sign In
                </Link>
                <Link
                  href="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex-1 text-center py-2 text-xs font-bold bg-emerald-600 text-white rounded-full shadow-xs"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
