import { NextResponse } from "next/server";
import prisma from "@/lib/db";
import { verifyPassword, signToken, TOKEN_COOKIE_NAME, hashPassword } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    let user = await prisma.user.findUnique({
      where: { email: email.toLowerCase().trim() },
      include: { worker: true },
    });

    // Auto-create demo accounts if not seeded yet for convenience
    if (!user && (email === "citizen@ecoroute.ai" || email === "admin@ecoroute.ai" || email === "worker@ecoroute.ai")) {
      let role = "CITIZEN";
      let name = "Citizen Alice";
      if (email.startsWith("admin")) {
        role = "ADMIN";
        name = "Chief Officer Dave";
      } else if (email.startsWith("worker")) {
        role = "WORKER";
        name = "Carlos Rodriguez";
      }

      user = await prisma.user.create({
        data: {
          email: email.toLowerCase().trim(),
          name,
          role,
          passwordHash: hashPassword("password123"),
          phone: "+91 98765 43210",
        },
        include: { worker: true },
      });

      if (role === "WORKER" && !user.worker) {
        await prisma.worker.create({
          data: {
            userId: user.id,
            name: user.name,
            phone: user.phone || "+91 98765 43210",
            vehicleType: "E-Trike",
            status: "ACTIVE",
            currentLat: 12.9716,
            currentLng: 77.5946,
          },
        });
        user = await prisma.user.findUnique({
          where: { id: user.id },
          include: { worker: true },
        });
      }
    }

    if (!user) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      );
    }

    const isValid = verifyPassword(password, user.passwordHash);
    if (!isValid) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      );
    }

    const sessionUser = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role as "CITIZEN" | "ADMIN" | "WORKER",
      phone: user.phone,
      workerId: user.worker?.id || null,
    };

    const token = signToken(sessionUser);

    const response = NextResponse.json({
      success: true,
      user: sessionUser,
    });

    response.cookies.set({
      name: TOKEN_COOKIE_NAME,
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    return response;
  } catch (error: any) {
    console.error("Login error:", error);
    return NextResponse.json(
      { error: error?.message || "Internal server error" },
      { status: 500 }
    );
  }
}
