import { NextResponse } from "next/server";
import prisma from "@/lib/db";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const complaint = await prisma.complaint.findUnique({
      where: { id: params.id },
      include: {
        citizen: true,
        assignedWorker: true,
        proofPhotos: {
          include: { worker: true },
          orderBy: { uploadedAt: "desc" },
        },
        assignments: {
          include: { worker: true },
          orderBy: { assignedAt: "desc" },
        },
      },
    });

    if (!complaint) {
      return NextResponse.json({ error: "Complaint not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, complaint });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || "Failed to fetch complaint" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const { status, assignedWorkerId, notes, priorityLevel, priorityScore } = body;

    const current = await prisma.complaint.findUnique({
      where: { id: params.id },
    });

    if (!current) {
      return NextResponse.json({ error: "Complaint not found" }, { status: 404 });
    }

    const updateData: any = {};

    if (status) updateData.status = status;
    if (priorityLevel) updateData.priorityLevel = priorityLevel;
    if (typeof priorityScore === "number") updateData.priorityScore = priorityScore;

    // Handle worker assignment
    if (assignedWorkerId !== undefined) {
      if (assignedWorkerId && assignedWorkerId !== current.assignedWorkerId) {
        updateData.assignedWorkerId = assignedWorkerId;
        updateData.status = status || "ASSIGNED";

        // Create assignment audit log
        await prisma.assignment.create({
          data: {
            complaintId: params.id,
            workerId: assignedWorkerId,
            notes: notes || "Assigned via Admin Dispatch",
          },
        });

        // Increment new worker workload
        await prisma.worker.update({
          where: { id: assignedWorkerId },
          data: {
            activeMissionsCount: { increment: 1 },
            status: "ON_DUTY",
          },
        });

        // Decrement previous worker workload if replaced
        if (current.assignedWorkerId && current.assignedWorkerId !== assignedWorkerId) {
          await prisma.worker.update({
            where: { id: current.assignedWorkerId },
            data: {
              activeMissionsCount: { decrement: 1 },
            },
          });
        }
      } else if (!assignedWorkerId && current.assignedWorkerId) {
        // Unassigned
        updateData.assignedWorkerId = null;
        updateData.status = status || "PENDING";

        await prisma.worker.update({
          where: { id: current.assignedWorkerId },
          data: {
            activeMissionsCount: { decrement: 1 },
          },
        });
      }
    }

    const updated = await prisma.complaint.update({
      where: { id: params.id },
      data: updateData,
      include: {
        assignedWorker: true,
        proofPhotos: true,
        citizen: true,
      },
    });

    return NextResponse.json({ success: true, complaint: updated });
  } catch (error: any) {
    console.error("Update complaint error:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to update complaint" },
      { status: 500 }
    );
  }
}
