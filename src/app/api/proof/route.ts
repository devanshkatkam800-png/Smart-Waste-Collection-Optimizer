import { NextResponse } from "next/server";
import prisma from "@/lib/db";
import { getSessionUser } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const session = getSessionUser();
    const body = await request.json();
    const { complaintId, workerId, photoUrl, notes } = body;

    if (!complaintId || !photoUrl) {
      return NextResponse.json(
        { error: "complaintId and photoUrl are required" },
        { status: 400 }
      );
    }

    const complaint = await prisma.complaint.findUnique({
      where: { id: complaintId },
      include: { assignedWorker: true },
    });

    if (!complaint) {
      return NextResponse.json({ error: "Complaint not found" }, { status: 404 });
    }

    const effectiveWorkerId =
      workerId ||
      session?.workerId ||
      complaint.assignedWorkerId;

    if (!effectiveWorkerId) {
      return NextResponse.json(
        { error: "No worker assigned to this mission" },
        { status: 400 }
      );
    }

    // Create Proof Photo record
    const proof = await prisma.proofPhoto.create({
      data: {
        complaintId,
        workerId: effectiveWorkerId,
        photoUrl,
        notes: notes || "Waste cleared and verified on site",
      },
    });

    // Update Complaint status to COLLECTED
    const updatedComplaint = await prisma.complaint.update({
      where: { id: complaintId },
      data: {
        status: "COLLECTED",
      },
    });

    // Mark active assignment completed
    await prisma.assignment.updateMany({
      where: {
        complaintId,
        workerId: effectiveWorkerId,
        completedAt: null,
      },
      data: {
        completedAt: new Date(),
      },
    });

    // Decrement worker active missions count
    await prisma.worker.update({
      where: { id: effectiveWorkerId },
      data: {
        activeMissionsCount: {
          decrement: 1,
        },
      },
    });

    return NextResponse.json({
      success: true,
      message: "Proof photo uploaded. Complaint marked as COLLECTED.",
      proof,
      complaint: updatedComplaint,
    });
  } catch (error: any) {
    console.error("Proof upload error:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to submit proof of collection" },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { proofId, verified = true } = body;

    if (!proofId) {
      return NextResponse.json({ error: "proofId is required" }, { status: 400 });
    }

    const proof = await prisma.proofPhoto.update({
      where: { id: proofId },
      data: {
        verifiedByAdmin: verified,
        verifiedAt: verified ? new Date() : null,
      },
      include: {
        complaint: true,
        worker: true,
      },
    });

    return NextResponse.json({
      success: true,
      message: verified ? "Proof verified by Admin" : "Verification reset",
      proof,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || "Failed to update verification" },
      { status: 500 }
    );
  }
}
