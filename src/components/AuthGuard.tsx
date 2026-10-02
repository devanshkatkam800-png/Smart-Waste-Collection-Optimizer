"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, ShieldAlert } from "lucide-react";

interface Props {
  children: React.ReactNode;
  allowedRoles: ("CITIZEN" | "ADMIN" | "WORKER")[];
}

export default function AuthGuard({ children, allowedRoles }: Props) {
  const router = useRouter();
  const [checking, setChecking] = useState(true);
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    let isMounted = true;

    async function checkAuth() {
      try {
        const res = await fetch("/api/auth/me");
        if (!res.ok) {
          router.replace("/login");
          return;
        }

        const data = await res.json();
        const user = data.user;

        if (!user) {
          router.replace("/login");
          return;
        }

        if (allowedRoles.includes(user.role)) {
          if (isMounted) {
            setAuthorized(true);
            setChecking(false);
          }
        } else {
          // Redirect unauthorized users to their designated portal
          if (user.role === "CITIZEN") {
            router.replace("/citizen");
          } else if (user.role === "ADMIN") {
            router.replace("/admin");
          } else if (user.role === "WORKER") {
            router.replace("/worker");
          } else {
            router.replace("/login");
          }
        }
      } catch (err) {
        console.error("AuthGuard check failed:", err);
        router.replace("/login");
      }
    }

    checkAuth();

    return () => {
      isMounted = false;
    };
  }, [allowedRoles, router]);

  if (checking) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center space-y-3">
        <Loader2 className="w-8 h-8 animate-spin text-emerald-600" />
        <span className="text-xs font-semibold text-slate-500 tracking-wide uppercase">
          Verifying Role Authorization...
        </span>
      </div>
    );
  }

  if (!authorized) {
    return null;
  }

  return <>{children}</>;
}
