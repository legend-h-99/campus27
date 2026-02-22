/**
 * AI Insights API
 * نقطة نهاية التحليلات الذكية
 *
 * GET /api/ai/insights?locale=ar&scope=all
 * Returns AI-generated insights from current data
 */

import { NextRequest } from "next/server";
import { AI_FEATURES, checkRateLimit } from "@/lib/ai-config";
import { getFullDataContext, contextToText } from "@/services/ai/data-aggregator";
import { generateText } from "@/services/ai/llm-client";
import { getInsightsPrompt } from "@/services/ai/prompt-templates";
import { aiCache } from "@/services/ai/cache";
import { AI_CONFIG } from "@/lib/ai-config";

// ═══ Types ═══

interface Insight {
  type: "success" | "warning" | "info" | "prediction";
  title: string;
  description: string;
  metric?: string;
  priority: number;
}

// ═══ Rule-based insights (fallback) ═══

async function generateRuleBasedInsights(locale: string): Promise<Insight[]> {
  const data = await getFullDataContext();
  const isAr = locale === "ar";
  const insights: Insight[] = [];

  // Success: high attendance
  if (data.attendance.attendanceRate >= 85) {
    insights.push({
      type: "success",
      title: isAr ? "معدل حضور جيد" : "Good Attendance Rate",
      description: isAr
        ? `معدل الحضور العام ${data.attendance.attendanceRate}% وهو ضمن النطاق المقبول`
        : `Overall attendance rate is ${data.attendance.attendanceRate}%, within acceptable range`,
      metric: `${data.attendance.attendanceRate}%`,
      priority: 3,
    });
  }

  // Warning: low attendance
  if (data.attendance.attendanceRate < 85) {
    insights.push({
      type: "warning",
      title: isAr ? "معدل حضور يحتاج تحسين" : "Attendance Needs Improvement",
      description: isAr
        ? `معدل الحضور ${data.attendance.attendanceRate}% أقل من الهدف 85%. يُنصح بمراجعة الأسباب`
        : `Attendance rate ${data.attendance.attendanceRate}% is below 85% target. Review causes recommended`,
      metric: `${data.attendance.attendanceRate}%`,
      priority: 1,
    });
  }

  // Success/Warning: success rate
  if (data.academic.successRate >= 90) {
    insights.push({
      type: "success",
      title: isAr ? "معدل نجاح ممتاز" : "Excellent Success Rate",
      description: isAr
        ? `معدل النجاح ${data.academic.successRate}% يعكس جودة التعليم`
        : `Success rate of ${data.academic.successRate}% reflects quality education`,
      metric: `${data.academic.successRate}%`,
      priority: 2,
    });
  } else if (data.academic.successRate > 0) {
    insights.push({
      type: "warning",
      title: isAr ? "معدل النجاح يحتاج تحسين" : "Success Rate Needs Attention",
      description: isAr
        ? `معدل النجاح ${data.academic.successRate}%. الهدف 90% فأكثر`
        : `Success rate is ${data.academic.successRate}%. Target is 90%+`,
      metric: `${data.academic.successRate}%`,
      priority: 1,
    });
  }

  // Info: financial
  if (data.financial.budgetUtilization > 0) {
    insights.push({
      type: data.financial.budgetUtilization > 85 ? "warning" : "info",
      title: isAr ? "استهلاك الميزانية" : "Budget Utilization",
      description: isAr
        ? `تم استهلاك ${data.financial.budgetUtilization}% من الميزانية المخصصة`
        : `${data.financial.budgetUtilization}% of allocated budget has been consumed`,
      metric: `${data.financial.budgetUtilization}%`,
      priority: data.financial.budgetUtilization > 85 ? 2 : 4,
    });
  }

  // Prediction: trainee overview
  if (data.academic.totalTrainees > 0) {
    insights.push({
      type: "prediction",
      title: isAr ? "نظرة على المتدربين" : "Trainee Overview",
      description: isAr
        ? `${data.academic.activeTrainees} متدرب نشط من أصل ${data.academic.totalTrainees}. معدل تراكمي عام: ${data.academic.avgGPA}`
        : `${data.academic.activeTrainees} active out of ${data.academic.totalTrainees} trainees. Overall GPA: ${data.academic.avgGPA}`,
      metric: `${data.academic.activeTrainees}`,
      priority: 3,
    });
  }

  // Info: tasks
  if (data.tasks.overdue > 0) {
    insights.push({
      type: "warning",
      title: isAr ? "مهام متأخرة" : "Overdue Tasks",
      description: isAr
        ? `${data.tasks.overdue} مهمة متأخرة عن الموعد تحتاج متابعة`
        : `${data.tasks.overdue} overdue tasks need attention`,
      metric: `${data.tasks.overdue}`,
      priority: 2,
    });
  }

  // Quality insight
  if (data.quality.totalKpis > 0) {
    const onTargetCount = data.quality.exceeds + data.quality.meets;
    const onTargetPct = Math.round((onTargetCount / data.quality.totalKpis) * 100);
    insights.push({
      type: onTargetPct >= 70 ? "success" : "info",
      title: isAr ? "مؤشرات الأداء" : "Quality KPIs",
      description: isAr
        ? `${onTargetCount} مؤشر محقق من ${data.quality.totalKpis} (${onTargetPct}%)`
        : `${onTargetCount} of ${data.quality.totalKpis} KPIs on target (${onTargetPct}%)`,
      metric: `${onTargetPct}%`,
      priority: 3,
    });
  }

  // Sort by priority
  return insights.sort((a, b) => a.priority - b.priority).slice(0, 6);
}

// ═══ Route Handler ═══

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const locale = searchParams.get("locale") || "ar";

    // TODO: Replace with actual session auth
    const userId = "system";
    if (!checkRateLimit(userId)) {
      return Response.json({ error: "Rate limit exceeded" }, { status: 429 });
    }

    // Try AI-generated insights first, fallback to rules
    const cacheKey = `insights:${locale}`;

    const insights = await aiCache.getOrCompute<Insight[]>(
      cacheKey,
      async () => {
        if (AI_FEATURES.llmEnabled && AI_FEATURES.predictionsEnabled) {
          try {
            const data = await getFullDataContext();
            const dataText = contextToText(data, locale);
            const prompt = getInsightsPrompt(dataText, locale);

            const result = await generateText({
              messages: [
                { role: "system", content: "You are a data analyst. Respond ONLY with valid JSON array." },
                { role: "user", content: prompt },
              ],
              maxTokens: 1500,
              temperature: 0.3,
            });

            const parsed = JSON.parse(result.text);
            if (Array.isArray(parsed) && parsed.length > 0) {
              return parsed.map((item: Record<string, unknown>) => ({
                type: item.type || "info",
                title: item.title || "",
                description: item.description || "",
                metric: item.metric || "",
                priority: item.priority || 3,
              })) as Insight[];
            }
          } catch (err) {
            console.warn("[AI Insights] LLM failed, using rules:", err);
          }
        }

        return generateRuleBasedInsights(locale);
      },
      AI_CONFIG.cacheTtlMinutes
    );

    return Response.json({
      insights,
      generatedAt: new Date().toISOString(),
      source: AI_FEATURES.llmEnabled ? "ai" : "rules",
    });
  } catch (error) {
    console.error("[AI Insights] Error:", error);
    return Response.json(
      { error: "Failed to generate insights" },
      { status: 500 }
    );
  }
}
