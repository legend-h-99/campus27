/**
 * AI Audit Findings Analysis API
 * تحليل نتائج التدقيق بالذكاء الاصطناعي
 *
 * POST /api/quality/ai/analyze-audit/[id]
 * Fetches audit findings by audit ID and analyzes them with AI
 */

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { analyzeAuditFindingsWithAI } from "@/services/ai/quality-analyzer";
import { checkRateLimit } from "@/lib/ai-config";

export async function POST(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: auditId } = await params;

    // TODO: Replace with actual session auth
    const userId = "system";
    if (!checkRateLimit(userId)) {
      return NextResponse.json(
        { success: false, error: "Rate limit exceeded" },
        { status: 429 }
      );
    }

    // Verify audit exists
    const audit = await prisma.qualityAudit.findUnique({
      where: { id: auditId },
      select: { id: true, titleAr: true },
    });

    if (!audit) {
      return NextResponse.json(
        { success: false, error: "Audit not found" },
        { status: 404 }
      );
    }

    // Fetch findings for this audit with standard info
    const findings = await prisma.auditFinding.findMany({
      where: { auditId },
      include: {
        standard: {
          select: { nameAr: true },
        },
      },
      orderBy: [{ severity: "asc" }, { createdAt: "desc" }],
    });

    if (findings.length === 0) {
      return NextResponse.json({
        success: true,
        data: {
          analysis:
            "لا توجد ملاحظات مسجلة لهذا التدقيق بعد.",
        },
      });
    }

    // Build findings data for analysis
    const findingsData = findings.map((f) => ({
      findingType: f.findingType,
      severity: f.severity ?? "OBSERVATION",
      descriptionAr: f.descriptionAr,
      evidence: f.evidence,
      standardNameAr: f.standard?.nameAr ?? null,
    }));

    const analysis = await analyzeAuditFindingsWithAI(findingsData);

    return NextResponse.json({
      success: true,
      data: { analysis },
    });
  } catch (error) {
    console.error("[API] analyze-audit error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to analyze audit findings" },
      { status: 500 }
    );
  }
}
