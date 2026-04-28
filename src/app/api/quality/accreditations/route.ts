import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { PERMISSIONS } from "@/lib/permissions";
import { guardRequest } from "@/lib/authorization";

export async function GET(request: NextRequest) {
  const check = await guardRequest(request, [PERMISSIONS.QUALITY_VIEW], "quality_accreditations", "GET");
  if (!check.ok) return check.response;

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

export async function POST(request: NextRequest) {
  const check = await guardRequest(request, [PERMISSIONS.QUALITY_ACCREDITATIONS_MANAGE], "quality_accreditations", "POST");
  if (!check.ok) return check.response;

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
