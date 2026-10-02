import { NextResponse } from "next/server";
import prisma from "@/lib/db";

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const { name, phone, vehicleType, status, currentLat, currentLng } = body;

    const updated = await prisma.worker.update({
      where: { id: params.id },
      data: {
        ...(name && { name }),
        ...(phone && { phone }),
        ...(vehicleType && { vehicleType }),
        ...(status && { status }),
        ...(currentLat !== undefined && { currentLat: parseFloat(currentLat) }),
        ...(currentLng !== undefined && { currentLng: parseFloat(currentLng) }),
      },
    });

    return NextResponse.json({ success: true, worker: updated });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || "Failed to update worker" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    // Unassign any assigned complaints first
    await prisma.complaint.updateMany({
      where: { assignedWorkerId: params.id, status: "ASSIGNED" },
      data: { assignedWorkerId: null, status: "PENDING" },
    });

    await prisma.worker.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ success: true, message: "Worker removed" });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || "Failed to delete worker" },
      { status: 500 }
    );
  }
}
