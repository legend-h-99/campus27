import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { PERMISSIONS } from "@/lib/permissions";
import { guardRequest } from "@/lib/authorization";

export async function GET(request: NextRequest) {
  const check = await guardRequest(request, [PERMISSIONS.QUALITY_VIEW], "quality", "GET");
  if (!check.ok) return check.response;

  try {
    const [
      kpiStatusCounts,
      openFindingsBySeverity,
      improvementPlansByStatus,
      avgProgress,
      recentAudits,
      activeAccreditations,
    ] = await Promise.all([
      prisma.kpiMeasurement.groupBy({
        by: ["status"],
        _count: { status: true },
        orderBy: { _count: { status: "desc" } },
      }),
      prisma.auditFinding.groupBy({
        by: ["severity"],
        where: { status: { in: ["OPEN", "IN_PROGRESS"] } },
        _count: { severity: true },
      }),
      prisma.improvementPlan.groupBy({
        by: ["status"],
        _count: { status: true },
      }),
      prisma.improvementPlan.aggregate({
        _avg: { progressPercentage: true },
      }),
      prisma.qualityAudit.findMany({
        take: 5,
        orderBy: { createdAt: "desc" },
        include: {
          leadAuditor: { select: { fullNameAr: true, fullNameEn: true } },
          _count: { select: { findings: true } },
        },
      }),
      prisma.accreditation.findMany({
        where: { status: "ACCREDITATION_ACTIVE" },
        orderBy: { expiryDate: "asc" },
      }),
    ]);

    return NextResponse.json({
      success: true,
      data: {
        kpiStatusCounts,
        openFindingsBySeverity,
        improvementPlans: {
          byStatus: improvementPlansByStatus,
          avgProgress: avgProgress._avg.progressPercentage || 0,
        },
        recentAudits,
        activeAccreditations,
      },
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to fetch quality dashboard data" },
      { status: 500 }
    );
  }
}
