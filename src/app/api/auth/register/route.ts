import { NextResponse } from "next/server";
import prisma from "@/lib/db";
import { hashPassword, signToken, TOKEN_COOKIE_NAME } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const { name, email, password, phone, role } = await request.json();

    if (!name || !email || !password) {
      return NextResponse.json(
        { error: "Name, email, and password are required" },
        { status: 400 }
      );
    }

    const cleanEmail = email.toLowerCase().trim();

    const existing = await prisma.user.findUnique({
      where: { email: cleanEmail },
    });

    if (existing) {
      return NextResponse.json(
        { error: "Email is already registered" },
        { status: 400 }
      );
    }

    const userRole = role === "WORKER" || role === "ADMIN" ? role : "CITIZEN";

    const user = await prisma.user.create({
      data: {
        name: name.trim(),
        email: cleanEmail,
        passwordHash: hashPassword(password),
        phone: phone || null,
        role: userRole,
      },
    });

    let workerId = null;
    if (userRole === "WORKER") {
      const worker = await prisma.worker.create({
        data: {
          userId: user.id,
          name: user.name,
          phone: user.phone || "+91 98765 00000",
          vehicleType: "E-Trike",
          status: "ACTIVE",
          currentLat: 12.9716,
          currentLng: 77.5946,
        },
      });
      workerId = worker.id;
    }

    const sessionUser = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role as "CITIZEN" | "ADMIN" | "WORKER",
      phone: user.phone,
      workerId,
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
      maxAge: 60 * 60 * 24 * 7,
    });

    return response;
  } catch (error: any) {
    console.error("Register error:", error);
    return NextResponse.json(
      { error: error?.message || "Registration failed" },
      { status: 500 }
    );
  }
}
