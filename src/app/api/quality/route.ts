import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const [
      kpiStatusCounts,
      openFindingsBySeverity,
      improvementPlansByStatus,
      avgProgress,
      recentAudits,
      activeAccreditations,
    ] = await Promise.all([
      // KPI status counts from latest measurements grouped by kpi
      prisma.kpiMeasurement.groupBy({
        by: ["status"],
        _count: { status: true },
        orderBy: { _count: { status: "desc" } },
      }),

      // Open findings counts by severity
      prisma.auditFinding.groupBy({
        by: ["severity"],
        where: { status: { in: ["OPEN", "IN_PROGRESS"] } },
        _count: { severity: true },
      }),

      // Improvement plan stats by status
      prisma.improvementPlan.groupBy({
        by: ["status"],
        _count: { status: true },
      }),

      // Average progress of improvement plans
      prisma.improvementPlan.aggregate({
        _avg: { progressPercentage: true },
      }),

      // 5 recent audits
      prisma.qualityAudit.findMany({
        take: 5,
        orderBy: { createdAt: "desc" },
        include: {
          leadAuditor: { select: { fullNameAr: true, fullNameEn: true } },
          _count: { select: { findings: true } },
        },
      }),

      // Active accreditations
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
