/**
 * AI KPI Analysis API
 * تحليل مؤشرات الأداء بالذكاء الاصطناعي
 *
 * POST /api/quality/ai/analyze-kpis
 * Fetches latest KPI measurements and analyzes them with AI
 */

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { analyzeKpisWithAI } from "@/services/ai/quality-analyzer";
import { checkRateLimit } from "@/lib/ai-config";
import { PERMISSIONS } from "@/lib/permissions";
import { guardRequest } from "@/lib/authorization";

export async function POST(request: NextRequest) {
  const check = await guardRequest(request, [PERMISSIONS.QUALITY_KPIS_VIEW, PERMISSIONS.AI_INSIGHTS], "quality_ai_kpis", "POST");
  if (!check.ok) return check.response;

  try {
    // TODO: Replace with actual session auth
    const userId = "system";
    if (!checkRateLimit(userId)) {
      return NextResponse.json(
        { success: false, error: "Rate limit exceeded" },
        { status: 429 }
      );
    }

    // Fetch active KPIs with their latest measurement
    const kpis = await prisma.qualityKpi.findMany({
      where: { isActive: true },
      include: {
        measurements: {
          orderBy: { measurementDate: "desc" },
          take: 1,
        },
      },
    });

    // Build KPI data for analysis
    const kpisData = kpis
      .filter((kpi) => kpi.measurements.length > 0)
      .map((kpi) => {
        const latest = kpi.measurements[0];
        return {
          kpiCode: kpi.kpiCode,
          nameAr: kpi.nameAr,
          actualValue: latest.actualValue,
          targetValue: latest.targetValue ?? kpi.targetValue,
          achievementRate: latest.achievementRate ?? 0,
          status: latest.status,
        };
      });

    if (kpisData.length === 0) {
      return NextResponse.json({
        success: true,
        data: {
          analysis:
            "لا توجد قياسات حديثة لمؤشرات الأداء. يرجى إضافة قياسات أولاً.",
        },
      });
    }

    const analysis = await analyzeKpisWithAI(kpisData);

    return NextResponse.json({
      success: true,
      data: { analysis },
    });
  } catch (error) {
    console.error("[API] analyze-kpis error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to analyze KPIs" },
      { status: 500 }
    );
  }
}
