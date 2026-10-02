import { NextResponse } from "next/server";
import prisma from "@/lib/db";
import { getSessionUser } from "@/lib/auth";
import { calculatePriorityScore } from "@/lib/priority-engine";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    const priority = searchParams.get("priority");
    const wasteType = searchParams.get("wasteType");
    const citizenId = searchParams.get("citizenId");
    const workerId = searchParams.get("workerId");
    const search = searchParams.get("search");

    const where: any = {};

    if (status && status !== "ALL") {
      where.status = status;
    }
    if (priority && priority !== "ALL") {
      where.priorityLevel = priority;
    }
    if (wasteType && wasteType !== "ALL") {
      where.wasteType = wasteType;
    }
    if (citizenId) {
      where.citizenId = citizenId;
    }
    if (workerId) {
      where.assignedWorkerId = workerId;
    }
    if (search) {
      where.OR = [
        { ticketNo: { contains: search } },
        { title: { contains: search } },
        { address: { contains: search } },
        { citizenName: { contains: search } },
      ];
    }

    const complaints = await prisma.complaint.findMany({
      where,
      include: {
        citizen: {
          select: { id: true, name: true, email: true, phone: true },
        },
        assignedWorker: true,
        proofPhotos: true,
        assignments: {
          include: { worker: true },
          orderBy: { assignedAt: "desc" },
        },
      },
      orderBy: [
        { priorityScore: "desc" },
        { createdAt: "desc" },
      ],
    });

    return NextResponse.json({ success: true, complaints });
  } catch (error: any) {
    console.error("Fetch complaints error:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to fetch complaints" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const session = getSessionUser();
    const body = await request.json();

    const {
      title,
      description,
      wasteType = "MIXED",
      quantity = "MEDIUM",
      estimatedWeightKg,
      imageUrl,
      latitude,
      longitude,
      address,
      citizenName,
      citizenPhone,
      aiConfidence = 0.94,
    } = body;

    if (!latitude || !longitude || !address) {
      return NextResponse.json(
        { error: "GPS location and address are required" },
        { status: 400 }
      );
    }

    // Weight estimation based on quantity if not supplied
    let weight = estimatedWeightKg;
    if (!weight) {
      switch (quantity) {
        case "OVERFLOW":
          weight = 65.0;
          break;
        case "LARGE":
          weight = 35.0;
          break;
        case "MEDIUM":
          weight = 15.0;
          break;
        case "SMALL":
        default:
          weight = 4.0;
          break;
      }
    }

    // Calculate priority using AI Priority Engine
    const priorityResult = calculatePriorityScore({
      wasteType,
      quantity,
      estimatedWeightKg: weight,
      address,
    });

    // Generate unique readable ticket number
    const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, "");
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const ticketNo = `EC-${dateStr}-${randomSuffix}`;

    const complaint = await prisma.complaint.create({
      data: {
        ticketNo,
        title: title || `${wasteType.charAt(0) + wasteType.slice(1).toLowerCase()} waste accumulation`,
        description: description || `Reported ${quantity.toLowerCase()} volume waste in public corridor.`,
        wasteType,
        quantity,
        estimatedWeightKg: weight,
        imageUrl: imageUrl || null,
        latitude: parseFloat(latitude),
        longitude: parseFloat(longitude),
        address,
        citizenId: session?.id || null,
        citizenName: citizenName || session?.name || "Citizen Reporter",
        citizenPhone: citizenPhone || session?.phone || null,
        priorityLevel: priorityResult.priorityLevel,
        priorityScore: priorityResult.priorityScore,
        aiConfidence: parseFloat(aiConfidence.toString()),
        status: "PENDING",
      },
      include: {
        citizen: true,
        assignedWorker: true,
      },
    });

    return NextResponse.json({
      success: true,
      complaint,
      priorityDetails: priorityResult,
    });
  } catch (error: any) {
    console.error("Create complaint error:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to create complaint" },
      { status: 500 }
    );
  }
}
