import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get("ecoroute_token")?.value;

  let userRole: string | null = null;

  if (token) {
    try {
      // Decode JWT payload without external binary dependency
      const parts = token.split(".");
      if (parts.length === 3) {
        const payloadJson = Buffer.from(parts[1], "base64").toString("utf-8");
        const payload = JSON.parse(payloadJson);
        userRole = payload.role;
      }
    } catch {
      userRole = null;
    }
  }

  // 1. Citizen Route Protection
  if (pathname.startsWith("/citizen")) {
    if (!token || !userRole) {
      return NextResponse.redirect(new URL("/login?redirect=/citizen", request.url));
    }
    if (userRole !== "CITIZEN") {
      const destination = userRole === "ADMIN" ? "/admin" : "/worker";
      return NextResponse.redirect(new URL(destination, request.url));
    }
  }

  // 2. Admin Route Protection
  if (pathname.startsWith("/admin")) {
    if (!token || !userRole) {
      return NextResponse.redirect(new URL("/login?redirect=/admin", request.url));
    }
    if (userRole !== "ADMIN") {
      const destination = userRole === "CITIZEN" ? "/citizen" : "/worker";
      return NextResponse.redirect(new URL(destination, request.url));
    }
  }

  // 3. Worker Route Protection
  if (pathname.startsWith("/worker")) {
    if (!token || !userRole) {
      return NextResponse.redirect(new URL("/login?redirect=/worker", request.url));
    }
    if (userRole !== "WORKER") {
      const destination = userRole === "ADMIN" ? "/admin" : "/citizen";
      return NextResponse.redirect(new URL(destination, request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/citizen/:path*", "/admin/:path*", "/worker/:path*"],
};
