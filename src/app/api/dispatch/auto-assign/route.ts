import { NextResponse } from "next/server";
import prisma from "@/lib/db";
import { rankWorkersForComplaint } from "@/lib/smart-dispatch";

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const { complaintId } = body;

    // Get active workers
    const rawWorkers = await prisma.worker.findMany({
      where: {
        status: { in: ["ACTIVE", "ON_DUTY"] },
      },
      include: {
        complaints: {
          where: { status: "ASSIGNED" },
        },
      },
    });

    if (rawWorkers.length === 0) {
      return NextResponse.json(
        { error: "No active or on-duty workers available for dispatch." },
        { status: 400 }
      );
    }

    const workers = rawWorkers.map((w) => ({
      id: w.id,
      name: w.name,
      phone: w.phone,
      vehicleType: w.vehicleType,
      status: w.status,
      currentLat: w.currentLat,
      currentLng: w.currentLng,
      activeMissionsCount: w.complaints.length,
      maxCapacityKg: w.maxCapacityKg,
    }));

    // Target complaints to assign
    const where: any = { status: "PENDING" };
    if (complaintId) {
      where.id = complaintId;
    }

    const pendingComplaints = await prisma.complaint.findMany({
      where,
      orderBy: [{ priorityScore: "desc" }, { createdAt: "asc" }],
    });

    if (pendingComplaints.length === 0) {
      return NextResponse.json({
        success: true,
        message: "No pending complaints requiring assignment.",
        assignmentsMade: [],
      });
    }

    const assignmentsMade = [];

    // Clone workers array to track live capacity during bulk assignment
    const workingFleet = [...workers];

    for (const c of pendingComplaints) {
      const ranked = rankWorkersForComplaint(
        {
          id: c.id,
          ticketNo: c.ticketNo,
          latitude: c.latitude,
          longitude: c.longitude,
          priorityLevel: c.priorityLevel,
          priorityScore: c.priorityScore,
          estimatedWeightKg: c.estimatedWeightKg,
        },
        workingFleet
      );

      if (ranked.length > 0) {
        const topChoice = ranked[0];

        // Update database
        await prisma.complaint.update({
          where: { id: c.id },
          data: {
            assignedWorkerId: topChoice.workerId,
            status: "ASSIGNED",
          },
        });

        await prisma.assignment.create({
          data: {
            complaintId: c.id,
            workerId: topChoice.workerId,
            notes: `Smart Auto-Dispatched: ${topChoice.reason} (Score: ${topChoice.suitabilityScore}/100)`,
          },
        });

        await prisma.worker.update({
          where: { id: topChoice.workerId },
          data: {
            activeMissionsCount: { increment: 1 },
            status: "ON_DUTY",
          },
        });

        // Update working fleet state
        const targetWorker = workingFleet.find((w) => w.id === topChoice.workerId);
        if (targetWorker) {
          targetWorker.activeMissionsCount += 1;
        }

        assignmentsMade.push({
          complaintId: c.id,
          ticketNo: c.ticketNo,
          priorityLevel: c.priorityLevel,
          workerId: topChoice.workerId,
          workerName: topChoice.workerName,
          distanceKm: topChoice.distanceKm,
          reason: topChoice.reason,
          suitabilityScore: topChoice.suitabilityScore,
        });
      }
    }

    return NextResponse.json({
      success: true,
      message: `Successfully auto-assigned ${assignmentsMade.length} complaint(s) using AI proximity & workload balancing.`,
      assignmentsMade,
    });
  } catch (error: any) {
    console.error("Auto assign error:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to execute smart assignment" },
      { status: 500 }
    );
  }
}
