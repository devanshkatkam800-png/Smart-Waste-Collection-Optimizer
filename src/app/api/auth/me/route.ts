import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth";
import prisma from "@/lib/db";

export async function GET() {
  const session = getSessionUser();
  if (!session) {
    return NextResponse.json({ user: null });
  }

  // Fetch updated user from DB to keep role & workerId synced
  try {
    const user = await prisma.user.findUnique({
      where: { id: session.id },
      include: { worker: true },
    });

    if (!user) {
      return NextResponse.json({ user: null });
    }

    return NextResponse.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        workerId: user.worker?.id || null,
      },
    });
  } catch {
    return NextResponse.json({ user: session });
  }
}
