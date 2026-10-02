import { NextResponse } from "next/server";
import prisma from "@/lib/db";

export async function GET() {
  try {
    const workers = await prisma.worker.findMany({
      include: {
        complaints: {
          where: { status: "ASSIGNED" },
          select: { id: true, ticketNo: true, priorityLevel: true, title: true },
        },
      },
      orderBy: { name: "asc" },
    });

    const enriched = workers.map((w) => ({
      ...w,
      activeMissionsCount: w.complaints.length,
    }));

    return NextResponse.json({ success: true, workers: enriched });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || "Failed to fetch workers" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, phone, vehicleType = "E-Trike", status = "ACTIVE", currentLat, currentLng } = body;

    if (!name || !phone) {
      return NextResponse.json(
        { error: "Worker name and phone are required" },
        { status: 400 }
      );
    }

    const worker = await prisma.worker.create({
      data: {
        name,
        phone,
        vehicleType,
        status,
        currentLat: currentLat || 12.9716,
        currentLng: currentLng || 77.5946,
      },
    });

    return NextResponse.json({ success: true, worker });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || "Failed to create worker" },
      { status: 500 }
    );
  }
}
