/**
 * Recommendations Engine
 * محرك التوصيات الذكية
 *
 * Generates role-specific actionable recommendations
 * based on current data patterns and thresholds.
 * Uses rule-based engine + optional LLM enhancement
 */

import { AI_CONFIG, AI_FEATURES } from "@/lib/ai-config";
import { aiCache } from "./cache";
import {
  getAcademicOverview,
  getAttendanceOverview,
  getFinancialOverview,
  getQualityOverview,
  getTasksOverview,
  getDepartmentPerformance,
} from "./data-aggregator";
import { generateText } from "./llm-client";
import { getRecommendationsPrompt } from "./prompt-templates";
import { buildScopedContext } from "./context-builder";

// ═══ Types ═══

export interface Recommendation {
  id: string;
  titleAr: string;
  titleEn: string;
  descriptionAr: string;
  descriptionEn: string;
  priority: "high" | "medium" | "low";
  category: "academic" | "financial" | "quality" | "hr" | "operational";
  impact: string;
  impactAr: string;
}

export interface RecommendationsReport {
  recommendations: Recommendation[];
  generatedAt: string;
  source: "rules" | "ai" | "hybrid";
}

// ═══ Rule-Based Recommendations ═══

/**
 * Generate recommendations using rule engine
 * Fallback when LLM is not available
 */
async function generateRuleBasedRecommendations(): Promise<Recommendation[]> {
  const [academic, attendance, financial, quality, tasks, departments] =
    await Promise.all([
      getAcademicOverview(),
      getAttendanceOverview(),
      getFinancialOverview(),
      getQualityOverview(),
      getTasksOverview(),
      getDepartmentPerformance(),
    ]);

  const recs: Recommendation[] = [];
  let id = 1;

  // ─── Attendance-based recommendations ───
  if (attendance.attendanceRate < 85) {
    recs.push({
      id: `rec-${id++}`,
      titleAr: "تحسين معدل الحضور",
      titleEn: "Improve Attendance Rate",
      descriptionAr: `معدل الحضور الحالي ${attendance.attendanceRate}% وهو أقل من الهدف (85%). يُنصح بتفعيل نظام الإنذار المبكر وإرسال إشعارات تلقائية لأولياء الأمور عند الغياب`,
      descriptionEn: `Current attendance rate is ${attendance.attendanceRate}%, below target (85%). Activate early warning system and send automatic guardian notifications on absences`,
      priority: attendance.attendanceRate < 75 ? "high" : "medium",
      category: "academic",
      impact: "Potential 10-15% attendance improvement",
      impactAr: "تحسن محتمل 10-15% في الحضور",
    });
  }

  // ─── GPA-based recommendations ───
  if (academic.avgGPA < 2.5) {
    recs.push({
      id: `rec-${id++}`,
      titleAr: "برنامج دعم أكاديمي",
      titleEn: "Academic Support Program",
      descriptionAr: `المعدل التراكمي العام ${academic.avgGPA} يحتاج تحسين. يُنصح بتخصيص حصص دعم أكاديمي إضافية وتفعيل نظام المتابعة الفردية`,
      descriptionEn: `Overall GPA of ${academic.avgGPA} needs improvement. Allocate additional academic support sessions and activate individual monitoring`,
      priority: academic.avgGPA < 2.0 ? "high" : "medium",
      category: "academic",
      impact: "Expected 0.3-0.5 GPA improvement",
      impactAr: "تحسن متوقع 0.3-0.5 في المعدل",
    });
  }

  // ─── Success rate recommendations ───
  if (academic.successRate < 90) {
    recs.push({
      id: `rec-${id++}`,
      titleAr: "رفع معدل النجاح",
      titleEn: "Raise Success Rate",
      descriptionAr: `معدل النجاح ${academic.successRate}%. يُنصح بتحديد المقررات ذات معدل الرسوب العالي وتوفير موارد تعليمية إضافية`,
      descriptionEn: `Success rate is ${academic.successRate}%. Identify courses with high failure rates and provide additional learning resources`,
      priority: academic.successRate < 80 ? "high" : "medium",
      category: "academic",
      impact: "Target: 92%+ success rate",
      impactAr: "الهدف: معدل نجاح 92% فأكثر",
    });
  }

  // ─── Financial recommendations ───
  if (financial.budgetUtilization > 85) {
    recs.push({
      id: `rec-${id++}`,
      titleAr: "مراجعة استهلاك الميزانية",
      titleEn: "Review Budget Utilization",
      descriptionAr: `استهلاك الميزانية وصل إلى ${financial.budgetUtilization}%. يُنصح بتحويل المشتريات المتكررة إلى عقود سنوية وترشيد الإنفاق`,
      descriptionEn: `Budget utilization reached ${financial.budgetUtilization}%. Convert recurring purchases to annual contracts and optimize spending`,
      priority: financial.budgetUtilization > 92 ? "high" : "medium",
      category: "financial",
      impact: "Potential 8-12% savings",
      impactAr: "توفير محتمل 8-12%",
    });
  }

  if (financial.pendingTransactions > 10) {
    recs.push({
      id: `rec-${id++}`,
      titleAr: "تسريع اعتماد المعاملات المالية",
      titleEn: "Expedite Financial Transaction Approvals",
      descriptionAr: `يوجد ${financial.pendingTransactions} معاملة معلقة تحتاج اعتماد. التأخير قد يؤثر على سير العمل`,
      descriptionEn: `${financial.pendingTransactions} pending transactions need approval. Delays may affect operations`,
      priority: financial.pendingTransactions > 20 ? "high" : "medium",
      category: "financial",
      impact: "Improved financial workflow",
      impactAr: "تحسين سير العمل المالي",
    });
  }

  // ─── Quality recommendations ───
  if (quality.below > 0 || quality.critical > 0) {
    recs.push({
      id: `rec-${id++}`,
      titleAr: "معالجة مؤشرات الجودة المتأخرة",
      titleEn: "Address Lagging Quality Indicators",
      descriptionAr: `${quality.below + quality.critical} مؤشر جودة يحتاج متابعة (${quality.critical} حرج، ${quality.below} دون المستهدف)`,
      descriptionEn: `${quality.below + quality.critical} quality indicators need attention (${quality.critical} critical, ${quality.below} below target)`,
      priority: quality.critical > 0 || quality.below > 3 ? "high" : "medium",
      category: "quality",
      impact: `Target: ${quality.totalKpis} KPIs on track`,
      impactAr: `الهدف: ${quality.totalKpis} مؤشر على المسار`,
    });
  }

  // ─── Task recommendations ───
  if (tasks.overdue > 0) {
    recs.push({
      id: `rec-${id++}`,
      titleAr: "متابعة المهام المتأخرة",
      titleEn: "Follow Up on Overdue Tasks",
      descriptionAr: `${tasks.overdue} مهمة متأخرة عن الموعد. يُنصح بمراجعة أولويات المهام وإعادة التوزيع إذا لزم الأمر`,
      descriptionEn: `${tasks.overdue} overdue tasks. Review task priorities and redistribute if necessary`,
      priority: tasks.overdue > 10 ? "high" : "medium",
      category: "operational",
      impact: "Improved task completion rate",
      impactAr: "تحسين معدل إكمال المهام",
    });
  }

  // ─── Department-specific recommendations ───
  const lowPerformingDepts = departments.filter((d) => d.avgGPA < 2.0 && d.traineeCount > 0);
  if (lowPerformingDepts.length > 0) {
    recs.push({
      id: `rec-${id++}`,
      titleAr: "أقسام تحتاج تطوير",
      titleEn: "Departments Needing Development",
      descriptionAr: `${lowPerformingDepts.length} أقسام بمعدل تراكمي أقل من 2.0: ${lowPerformingDepts.map((d) => d.nameAr).join("، ")}`,
      descriptionEn: `${lowPerformingDepts.length} departments with GPA below 2.0: ${lowPerformingDepts.map((d) => d.nameEn).join(", ")}`,
      priority: "high",
      category: "academic",
      impact: "Targeted departmental improvement plans",
      impactAr: "خطط تحسين مستهدفة للأقسام",
    });
  }

  // Ensure at least one positive recommendation
  if (recs.length === 0 || recs.every((r) => r.priority !== "low")) {
    recs.push({
      id: `rec-${id++}`,
      titleAr: "تعزيز التعليم الإلكتروني",
      titleEn: "Enhance E-Learning",
      descriptionAr: "يُنصح بزيادة نسبة المحتوى الرقمي وإضافة اختبارات تفاعلية لكل مقرر لتحسين تجربة المتدربين",
      descriptionEn: "Increase digital content percentage and add interactive assessments per course to improve trainee experience",
      priority: "low",
      category: "academic",
      impact: "15% higher satisfaction expected",
      impactAr: "تحسن متوقع 15% في الرضا",
    });
  }

  return recs;
}

// ═══ Main Function ═══

/**
 * Generate recommendations (rule-based, with optional AI enhancement)
 */
export async function getRecommendations(
  role: string = "dean",
  locale: string = "ar"
): Promise<RecommendationsReport> {
  const cacheKey = `recommendations:${role}:${locale}`;

  return aiCache.getOrCompute(
    cacheKey,
    async () => {
      // Always start with rule-based recommendations
      const ruleRecs = await generateRuleBasedRecommendations();

      // If LLM is available and enabled, try to enhance with AI
      if (AI_FEATURES.llmEnabled && AI_FEATURES.recommendationsEnabled) {
        try {
          const context = await buildScopedContext("academic", locale);
          const prompt = getRecommendationsPrompt(context, role, locale);

          const result = await generateText({
            messages: [
              { role: "system", content: "You are a data analyst. Respond ONLY with valid JSON." },
              { role: "user", content: prompt },
            ],
            maxTokens: 1500,
            temperature: 0.3,
          });

          // Try to parse AI recommendations
          const parsed = JSON.parse(result.text);
          if (Array.isArray(parsed) && parsed.length > 0) {
            const validPriorities = ["high", "medium", "low"] as const;
            const validCategories = ["academic", "financial", "quality", "hr", "operational"] as const;
            const aiRecs: Recommendation[] = parsed.map((item: Record<string, string>, i: number) => ({
              id: `ai-rec-${i + 1}`,
              // LLM responds in the requested locale; use available fields with fallbacks
              titleAr: item.titleAr || item.title || "",
              titleEn: item.titleEn || item.title || "",
              descriptionAr: item.descriptionAr || item.description || "",
              descriptionEn: item.descriptionEn || item.description || "",
              priority: (validPriorities.includes(item.priority as typeof validPriorities[number]) ? item.priority : "medium") as Recommendation["priority"],
              category: (validCategories.includes(item.category as typeof validCategories[number]) ? item.category : "academic") as Recommendation["category"],
              impact: item.impactEn || item.impact || "",
              impactAr: item.impactAr || item.impact || "",
            }));

            return {
              recommendations: [...ruleRecs.slice(0, 3), ...aiRecs.slice(0, 3)],
              generatedAt: new Date().toISOString(),
              source: "hybrid" as const,
            };
          }
        } catch (err) {
          console.warn("[AI Recommendations] LLM enhancement failed, using rules only:", err);
        }
      }

      return {
        recommendations: ruleRecs,
        generatedAt: new Date().toISOString(),
        source: "rules" as const,
      };
    },
    AI_CONFIG.cacheTtlMinutes
  );
}
