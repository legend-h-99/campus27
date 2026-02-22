import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    const type = searchParams.get("type");

    const where: Record<string, unknown> = {};
    if (status) where.status = status;
    if (type) where.accreditationType = type;

    const accreditations = await prisma.accreditation.findMany({
      where,
      orderBy: { expiryDate: "asc" },
    });

    return NextResponse.json({ success: true, data: accreditations });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to fetch accreditations" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const accreditation = await prisma.accreditation.create({
      data: {
        accreditationType: body.accreditationType,
        accreditingBody: body.accreditingBody,
        departmentId: body.departmentId,
        programId: body.programId,
        certificateNumber: body.certificateNumber,
        grantDate: body.grantDate ? new Date(body.grantDate) : undefined,
        expiryDate: body.expiryDate ? new Date(body.expiryDate) : undefined,
        notes: body.notes,
      },
    });

    return NextResponse.json({ success: true, data: accreditation }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to create accreditation" },
      { status: 500 }
    );
  }
}
