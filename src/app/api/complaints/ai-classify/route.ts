import { NextResponse } from "next/server";
import { classifyWasteImage } from "@/lib/ai-vision";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { image, filename } = body;

    if (!image && !filename) {
      return NextResponse.json(
        { error: "Image data or filename is required" },
        { status: 400 }
      );
    }

    const payload = image || filename;
    const classification = await classifyWasteImage(payload);

    return NextResponse.json({
      success: true,
      classification,
    });
  } catch (error: any) {
    console.error("AI classify error:", error);
    return NextResponse.json(
      { error: error?.message || "Classification failed" },
      { status: 500 }
    );
  }
}
