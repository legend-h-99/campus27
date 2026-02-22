/**
 * AI Report Generation API
 * نقطة نهاية توليد التقارير الذكية
 *
 * POST /api/ai/report
 * Generates analytical reports using LLM
 */

import { NextRequest } from "next/server";
import { AI_FEATURES, checkRateLimit } from "@/lib/ai-config";
import { getFullDataContext, contextToText } from "@/services/ai/data-aggregator";
import { generateText } from "@/services/ai/llm-client";
import { getReportPrompt } from "@/services/ai/prompt-templates";

interface ReportRequest {
  reportType: string;
  locale?: string;
}

export async function POST(request: NextRequest) {
  try {
    const body: ReportRequest = await request.json();
    const { reportType, locale = "ar" } = body;

    if (!reportType) {
      return Response.json(
        { error: "reportType is required" },
        { status: 400 }
      );
    }

    // TODO: Replace with actual session auth
    const userId = "system";
    if (!checkRateLimit(userId)) {
      return Response.json(
        { error: "Rate limit exceeded" },
        { status: 429 }
      );
    }

    // Get data context
    const data = await getFullDataContext();
    const dataText = contextToText(data, locale);

    // Check if LLM is available
    if (!AI_FEATURES.llmEnabled) {
      const isAr = locale === "ar";
      return Response.json({
        report: isAr
          ? `## تقرير ${reportType}\n\nعذرًا، خدمة توليد التقارير الذكية غير متوفرة حاليًا. يرجى مراجعة صفحة التقارير لتوليد تقرير يدوي.\n\n### البيانات المتاحة:\n${dataText}`
          : `## ${reportType} Report\n\nSorry, AI report generation is currently unavailable. Please use the reports page for manual report generation.\n\n### Available Data:\n${dataText}`,
        generatedAt: new Date().toISOString(),
        source: "fallback",
      });
    }

    // Generate AI report
    const prompt = getReportPrompt(dataText, reportType, locale);

    const result = await generateText({
      messages: [
        {
          role: "system",
          content:
            locale === "ar"
              ? "أنت محلل بيانات محترف. اكتب تقارير مهنية ومنظمة."
              : "You are a professional data analyst. Write professional, well-structured reports.",
        },
        { role: "user", content: prompt },
      ],
      maxTokens: 3000,
      temperature: 0.4,
    });

    return Response.json({
      report: result.text,
      generatedAt: new Date().toISOString(),
      source: "ai",
      usage: result.usage,
    });
  } catch (error) {
    console.error("[AI Report] Error:", error);
    return Response.json(
      { error: "Failed to generate report" },
      { status: 500 }
    );
  }
}
