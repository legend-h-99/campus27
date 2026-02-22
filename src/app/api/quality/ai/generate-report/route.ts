/**
 * AI Quality Report Generation API
 * توليد تقرير الجودة الشامل بالذكاء الاصطناعي
 *
 * POST /api/quality/ai/generate-report
 * Body: { periodStart: string, periodEnd: string }
 * Aggregates all quality data for the period and generates a report
 */

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { generateQualityReportWithAI } from "@/services/ai/quality-analyzer";
import { checkRateLimit } from "@/lib/ai-config";

interface GenerateReportRequest {
  periodStart: string;
  periodEnd: string;
}

export async function POST(request: NextRequest) {
  try {
    const body: GenerateReportRequest = await request.json();
    const { periodStart, periodEnd } = body;

    if (!periodStart || !periodEnd) {
      return NextResponse.json(
        {
          success: false,
          error: "periodStart and periodEnd are required",
        },
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

    const startDate = new Date(periodStart);
    const endDate = new Date(periodEnd);

    // Fetch KPI measurements for the period
    const measurements = await prisma.kpiMeasurement.findMany({
      where: {
        measurementDate: {
          gte: startDate,
          lte: endDate,
        },
      },
      include: {
        kpi: {
          select: { kpiCode: true, nameAr: true, targetValue: true },
        },
      },
      orderBy: { measurementDate: "desc" },
    });

    const kpis = measurements.map((m) => ({
      kpiCode: m.kpi.kpiCode,
      nameAr: m.kpi.nameAr,
      actualValue: m.actualValue,
      targetValue: m.targetValue ?? m.kpi.targetValue,
      achievementRate: m.achievementRate,
      status: m.status,
    }));

    // Fetch audit findings for the period
    const findings = await prisma.auditFinding.findMany({
      where: {
        createdAt: {
          gte: startDate,
          lte: endDate,
        },
      },
      select: {
        findingType: true,
        severity: true,
        descriptionAr: true,
        status: true,
      },
      orderBy: { createdAt: "desc" },
    });

    // Fetch improvement plans for the period
    const plans = await prisma.improvementPlan.findMany({
      where: {
        OR: [
          {
            startDate: { gte: startDate, lte: endDate },
          },
          {
            targetCompletionDate: { gte: startDate, lte: endDate },
          },
          {
            createdAt: { gte: startDate, lte: endDate },
          },
        ],
      },
      select: {
        titleAr: true,
        planType: true,
        status: true,
        progressPercentage: true,
      },
    });

    // Fetch surveys for the period
    const surveys = await prisma.qualitySurvey.findMany({
      where: {
        OR: [
          {
            startDate: { gte: startDate, lte: endDate },
          },
          {
            endDate: { gte: startDate, lte: endDate },
          },
          {
            createdAt: { gte: startDate, lte: endDate },
          },
        ],
      },
      select: {
        titleAr: true,
        surveyType: true,
        totalResponses: true,
        status: true,
      },
    });

    const report = await generateQualityReportWithAI({
      kpis,
      findings,
      plans,
      surveys,
      periodStart,
      periodEnd,
    });

    return NextResponse.json({
      success: true,
      data: { report },
    });
  } catch (error) {
    console.error("[API] generate-report error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to generate quality report" },
      { status: 500 }
    );
  }
}
