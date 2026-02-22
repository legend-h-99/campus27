import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type");
    const status = searchParams.get("status");
    const includeFindings = searchParams.get("include_findings") === "true";

    const where: Record<string, unknown> = {};
    if (type) where.auditType = type;
    if (status) where.status = status;

    const audits = await prisma.qualityAudit.findMany({
      where,
      include: {
        leadAuditor: {
          select: { id: true, fullNameAr: true, fullNameEn: true },
        },
        _count: { select: { findings: true } },
        ...(includeFindings && {
          findings: {
            include: {
              standard: {
                select: { id: true, standardCode: true, nameAr: true, nameEn: true },
              },
            },
            orderBy: { createdAt: "desc" as const },
          },
        }),
      },
      orderBy: { scheduledDate: "desc" },
    });

    return NextResponse.json({ success: true, data: audits });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to fetch audits" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const audit = await prisma.qualityAudit.create({
      data: {
        auditType: body.auditType,
        titleAr: body.titleAr,
        titleEn: body.titleEn,
        departmentId: body.departmentId,
        scheduledDate: body.scheduledDate ? new Date(body.scheduledDate) : undefined,
        leadAuditorId: body.leadAuditorId,
        scopeAr: body.scopeAr,
      },
    });

    return NextResponse.json({ success: true, data: audit }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to create audit" },
      { status: 500 }
    );
  }
}
