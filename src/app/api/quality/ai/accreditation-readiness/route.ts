/**
 * AI Accreditation Readiness Assessment API
 * تقييم جاهزية الاعتماد الأكاديمي بالذكاء الاصطناعي
 *
 * POST /api/quality/ai/accreditation-readiness
 * Aggregates quality data and assesses NCAAA accreditation readiness
 */

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { assessAccreditationReadiness } from "@/services/ai/quality-analyzer";
import { checkRateLimit } from "@/lib/ai-config";

export async function POST() {
  try {
    // TODO: Replace with actual session auth
    const userId = "system";
    if (!checkRateLimit(userId)) {
      return NextResponse.json(
        { success: false, error: "Rate limit exceeded" },
        { status: 429 }
      );
    }

    // Aggregate KPI stats from latest measurements
    const kpis = await prisma.qualityKpi.findMany({
      where: { isActive: true },
      include: {
        measurements: {
          orderBy: { measurementDate: "desc" },
          take: 1,
        },
      },
    });

    const kpiStatuses = kpis
      .filter((k) => k.measurements.length > 0)
      .map((k) => k.measurements[0].status);

    const kpisSummary = {
      total: kpiStatuses.length,
      exceeds: kpiStatuses.filter((s) => s === "EXCEEDS").length,
      meets: kpiStatuses.filter((s) => s === "MEETS").length,
      below: kpiStatuses.filter((s) => s === "BELOW").length,
      critical: kpiStatuses.filter((s) => s === "CRITICAL").length,
    };

    // Aggregate open audit findings
    const [criticalFindings, majorFindings, minorFindings] = await Promise.all([
      prisma.auditFinding.count({
        where: {
          status: { in: ["OPEN", "IN_PROGRESS"] },
          severity: "CRITICAL",
        },
      }),
      prisma.auditFinding.count({
        where: {
          status: { in: ["OPEN", "IN_PROGRESS"] },
          severity: "MAJOR",
        },
      }),
      prisma.auditFinding.count({
        where: {
          status: { in: ["OPEN", "IN_PROGRESS"] },
          severity: "MINOR",
        },
      }),
    ]);

    const openFindings = {
      critical: criticalFindings,
      major: majorFindings,
      minor: minorFindings,
    };

    // Average improvement plan progress
    const plansResult = await prisma.improvementPlan.aggregate({
      where: {
        status: { in: ["APPROVED", "IP_IN_PROGRESS"] },
      },
      _avg: { progressPercentage: true },
    });

    const plansProgress = Math.round(plansResult._avg.progressPercentage ?? 0);

    // Count active quality documents
    const documentsCount = await prisma.qualityDocument.count({
      where: { status: "DOC_ACTIVE" },
    });

    const assessment = await assessAccreditationReadiness({
      kpisSummary,
      openFindings,
      plansProgress,
      documentsCount,
    });

    return NextResponse.json({
      success: true,
      data: { assessment },
    });
  } catch (error) {
    console.error("[API] accreditation-readiness error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to assess accreditation readiness" },
      { status: 500 }
    );
  }
}
