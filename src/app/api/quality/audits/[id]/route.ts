import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const audit = await prisma.qualityAudit.findUnique({
      where: { id },
      include: {
        leadAuditor: {
          select: { id: true, fullNameAr: true, fullNameEn: true },
        },
        createdBy: {
          select: { id: true, fullNameAr: true, fullNameEn: true },
        },
        findings: {
          include: {
            standard: {
              select: { id: true, standardCode: true, nameAr: true, nameEn: true },
            },
          },
          orderBy: { createdAt: "desc" },
        },
      },
    });

    if (!audit) {
      return NextResponse.json(
        { success: false, error: "Audit not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: audit });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to fetch audit" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    const data: Record<string, unknown> = {};
    if (body.status !== undefined) data.status = body.status;
    if (body.completionDate !== undefined) data.completionDate = new Date(body.completionDate);
    if (body.overallRating !== undefined) data.overallRating = body.overallRating;
    if (body.findingsSummary !== undefined) data.findingsSummary = body.findingsSummary;
    if (body.titleAr !== undefined) data.titleAr = body.titleAr;
    if (body.titleEn !== undefined) data.titleEn = body.titleEn;
    if (body.leadAuditorId !== undefined) data.leadAuditorId = body.leadAuditorId;
    if (body.auditTeam !== undefined) data.auditTeam = body.auditTeam;
    if (body.scopeAr !== undefined) data.scopeAr = body.scopeAr;
    if (body.reportFilePath !== undefined) data.reportFilePath = body.reportFilePath;

    const audit = await prisma.qualityAudit.update({
      where: { id },
      data,
    });

    return NextResponse.json({ success: true, data: audit });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to update audit" },
      { status: 500 }
    );
  }
}
