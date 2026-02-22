import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const reportType = searchParams.get("reportType");
    const status = searchParams.get("status");

    const where: Record<string, unknown> = {};
    if (reportType) where.reportType = reportType;
    if (status) where.status = status;

    const reports = await prisma.qualityReport.findMany({
      where,
      include: {
        preparedBy: {
          select: { id: true, fullNameAr: true, fullNameEn: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ success: true, data: reports });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to fetch quality reports" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const report = await prisma.qualityReport.create({
      data: {
        reportType: body.reportType,
        titleAr: body.titleAr,
        titleEn: body.titleEn,
        departmentId: body.departmentId,
        academicYear: body.academicYear,
        reportPeriodStart: body.reportPeriodStart
          ? new Date(body.reportPeriodStart)
          : undefined,
        reportPeriodEnd: body.reportPeriodEnd
          ? new Date(body.reportPeriodEnd)
          : undefined,
        executiveSummary: body.executiveSummary,
        recommendations: body.recommendations,
        preparedById: body.preparedById,
      },
    });

    return NextResponse.json({ success: true, data: report }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to create quality report" },
      { status: 500 }
    );
  }
}
