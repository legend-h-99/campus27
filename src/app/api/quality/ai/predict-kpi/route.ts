/**
 * AI KPI Trend Prediction API
 * التنبؤ باتجاه مؤشرات الأداء بالذكاء الاصطناعي
 *
 * POST /api/quality/ai/predict-kpi
 * Body: { kpiCode: string }
 * Fetches last 12 measurements and predicts trend
 */

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { predictKpiTrend } from "@/services/ai/quality-analyzer";
import { checkRateLimit } from "@/lib/ai-config";

interface PredictKpiRequest {
  kpiCode: string;
}

export async function POST(request: NextRequest) {
  try {
    const body: PredictKpiRequest = await request.json();
    const { kpiCode } = body;

    if (!kpiCode) {
      return NextResponse.json(
        { success: false, error: "kpiCode is required" },
        { status: 400 }
      );
    }

    // TODO: Replace with actual session auth
    const userId = "system";
    if (!checkRateLimit(userId)) {
      return NextResponse.json(
        { success: false, error: "Rate limit exceeded" },
        { status: 429 }
      );
    }

    // Find the KPI
    const kpi = await prisma.qualityKpi.findUnique({
      where: { kpiCode },
      select: { id: true, kpiCode: true, nameAr: true },
    });

    if (!kpi) {
      return NextResponse.json(
        { success: false, error: "KPI not found" },
        { status: 404 }
      );
    }

    // Fetch the last 12 measurements ordered by date
    const measurements = await prisma.kpiMeasurement.findMany({
      where: { kpiId: kpi.id },
      orderBy: { measurementDate: "asc" },
      take: 12,
      select: {
        measurementDate: true,
        actualValue: true,
      },
    });

    if (measurements.length < 2) {
      return NextResponse.json({
        success: true,
        data: {
          prediction:
            "لا تتوفر بيانات تاريخية كافية للتنبؤ. يلزم قياسان على الأقل.",
        },
      });
    }

    // Build historical data
    const historicalData = measurements.map((m) => ({
      date: m.measurementDate.toISOString().split("T")[0],
      value: m.actualValue,
    }));

    const prediction = await predictKpiTrend(
      kpi.kpiCode,
      kpi.nameAr,
      historicalData
    );

    return NextResponse.json({
      success: true,
      data: { prediction },
    });
  } catch (error) {
    console.error("[API] predict-kpi error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to predict KPI trend" },
      { status: 500 }
    );
  }
}
