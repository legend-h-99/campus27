/**
 * AI Quality Analyzer Service
 * خدمة تحليل الجودة بالذكاء الاصطناعي
 *
 * Provides AI-powered analysis for:
 * - KPI performance analysis
 * - Audit findings root cause analysis
 * - KPI trend prediction
 * - Accreditation readiness assessment
 * - Comprehensive quality report generation
 *
 * All prompts are in Arabic to match the NCAAA context and user base.
 */

import { generateText, isLLMAvailable } from "./llm-client";

// ═══ Constants ═══

const LLM_NOT_CONFIGURED_AR =
  "خدمة الذكاء الاصطناعي غير مُفعّلة حالياً. يرجى تكوين مفتاح API للاستفادة من التحليلات الذكية.";

// ═══ KPI Analysis ═══

/**
 * Analyze KPI data using AI - identifies strengths, weaknesses, and provides recommendations
 */
export async function analyzeKpisWithAI(
  kpisData: Array<{
    kpiCode: string;
    nameAr: string;
    actualValue: number;
    targetValue: number;
    achievementRate: number;
    status: string;
  }>
): Promise<string> {
  if (!isLLMAvailable()) {
    return LLM_NOT_CONFIGURED_AR;
  }

  const kpisSummary = kpisData
    .map(
      (kpi) =>
        `- ${kpi.kpiCode} (${kpi.nameAr}): القيمة الفعلية ${kpi.actualValue}، المستهدف ${kpi.targetValue}، نسبة الإنجاز ${kpi.achievementRate}%، الحالة: ${kpi.status}`
    )
    .join("\n");

  const systemPrompt = `أنت محلل جودة متخصص في معايير الهيئة الوطنية للتقويم والاعتماد الأكاديمي (NCAAA) في المملكة العربية السعودية.
مهمتك تحليل مؤشرات الأداء الرئيسية (KPIs) للكلية التقنية وتقديم تقرير تحليلي شامل باللغة العربية.

يجب أن يتضمن التحليل:
1. ملخص عام للأداء
2. نقاط القوة (المؤشرات المتفوقة)
3. نقاط الضعف (المؤشرات المتدنية)
4. تحليل الفجوات بين الفعلي والمستهدف
5. خمس توصيات عملية للتحسين مرتبة حسب الأولوية

استخدم لغة مهنية واضحة ومنظمة.`;

  const userPrompt = `حلّل مؤشرات الأداء التالية وقدّم تقريراً تحليلياً شاملاً:

${kpisSummary}

عدد المؤشرات: ${kpisData.length}
المؤشرات المتفوقة (EXCEEDS): ${kpisData.filter((k) => k.status === "EXCEEDS").length}
المؤشرات المحققة (MEETS): ${kpisData.filter((k) => k.status === "MEETS").length}
المؤشرات دون المستهدف (BELOW): ${kpisData.filter((k) => k.status === "BELOW").length}
المؤشرات الحرجة (CRITICAL): ${kpisData.filter((k) => k.status === "CRITICAL").length}`;

  try {
    const result = await generateText({
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      maxTokens: 2048,
      temperature: 0.3,
    });

    return result.text;
  } catch (error) {
    console.error("[Quality AI] KPI analysis error:", error);
    return "حدث خطأ أثناء تحليل مؤشرات الأداء. يرجى المحاولة لاحقاً.";
  }
}

// ═══ Audit Findings Analysis ═══

/**
 * Analyze audit findings - root cause analysis and corrective actions
 */
export async function analyzeAuditFindingsWithAI(
  findings: Array<{
    findingType: string;
    severity: string;
    descriptionAr: string;
    evidence: string | null;
    standardNameAr: string | null;
  }>
): Promise<string> {
  if (!isLLMAvailable()) {
    return LLM_NOT_CONFIGURED_AR;
  }

  const findingsSummary = findings
    .map(
      (f, i) =>
        `${i + 1}. النوع: ${f.findingType} | الخطورة: ${f.severity}
   الوصف: ${f.descriptionAr}
   ${f.evidence ? `الأدلة: ${f.evidence}` : ""}
   ${f.standardNameAr ? `المعيار المرتبط: ${f.standardNameAr}` : ""}`
    )
    .join("\n\n");

  const systemPrompt = `أنت مدقق جودة أكاديمي متخصص في معايير NCAAA.
مهمتك تحليل نتائج التدقيق وتقديم:

1. تحليل الأسباب الجذرية لكل ملاحظة
2. الإجراءات التصحيحية المقترحة
3. الإجراءات الوقائية لمنع التكرار
4. الأولويات المقترحة للمعالجة
5. الجدول الزمني المقترح للتنفيذ

قدّم التحليل بشكل منظم وعملي باللغة العربية.`;

  const userPrompt = `حلّل نتائج التدقيق التالية وقدّم تحليل أسباب جذرية وإجراءات تصحيحية:

${findingsSummary}

إجمالي الملاحظات: ${findings.length}
ملاحظات حرجة: ${findings.filter((f) => f.severity === "CRITICAL").length}
ملاحظات رئيسية: ${findings.filter((f) => f.severity === "MAJOR").length}
ملاحظات فرعية: ${findings.filter((f) => f.severity === "MINOR").length}`;

  try {
    const result = await generateText({
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      maxTokens: 2048,
      temperature: 0.3,
    });

    return result.text;
  } catch (error) {
    console.error("[Quality AI] Audit findings analysis error:", error);
    return "حدث خطأ أثناء تحليل نتائج التدقيق. يرجى المحاولة لاحقاً.";
  }
}

// ═══ KPI Trend Prediction ═══

/**
 * Predict KPI trend based on historical data
 */
export async function predictKpiTrend(
  kpiCode: string,
  kpiName: string,
  historicalData: Array<{
    date: string;
    value: number;
  }>
): Promise<string> {
  if (!isLLMAvailable()) {
    return LLM_NOT_CONFIGURED_AR;
  }

  const dataPoints = historicalData
    .map((d) => `- ${d.date}: ${d.value}`)
    .join("\n");

  const systemPrompt = `أنت محلل بيانات متخصص في التنبؤ بالاتجاهات لمؤشرات الأداء الأكاديمية.
مهمتك تحليل البيانات التاريخية لمؤشر أداء وتقديم:

1. تحليل الاتجاه العام (تصاعدي، تنازلي، مستقر، متذبذب)
2. تحديد الأنماط الموسمية إن وجدت
3. التنبؤ بالقيم المتوقعة للفترة القادمة
4. تحديد نقاط التحول المهمة
5. توصيات لتحسين المؤشر

قدّم التحليل بلغة واضحة مع أرقام محددة باللغة العربية.`;

  const userPrompt = `حلّل اتجاه مؤشر الأداء التالي وقدّم تنبؤاً:

المؤشر: ${kpiCode} - ${kpiName}
عدد نقاط البيانات: ${historicalData.length}

البيانات التاريخية:
${dataPoints}

${historicalData.length >= 2 ? `أول قيمة: ${historicalData[0].value} (${historicalData[0].date})
آخر قيمة: ${historicalData[historicalData.length - 1].value} (${historicalData[historicalData.length - 1].date})
التغيّر: ${(historicalData[historicalData.length - 1].value - historicalData[0].value).toFixed(2)}` : ""}`;

  try {
    const result = await generateText({
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      maxTokens: 1500,
      temperature: 0.3,
    });

    return result.text;
  } catch (error) {
    console.error("[Quality AI] KPI trend prediction error:", error);
    return "حدث خطأ أثناء تحليل اتجاه المؤشر. يرجى المحاولة لاحقاً.";
  }
}

// ═══ Accreditation Readiness Assessment ═══

/**
 * Assess readiness for NCAAA accreditation
 */
export async function assessAccreditationReadiness(data: {
  kpisSummary: {
    total: number;
    exceeds: number;
    meets: number;
    below: number;
    critical: number;
  };
  openFindings: { critical: number; major: number; minor: number };
  plansProgress: number;
  documentsCount: number;
}): Promise<string> {
  if (!isLLMAvailable()) {
    return LLM_NOT_CONFIGURED_AR;
  }

  const systemPrompt = `أنت مستشار اعتماد أكاديمي متخصص في متطلبات الهيئة الوطنية للتقويم والاعتماد الأكاديمي (NCAAA).
مهمتك تقييم جاهزية المؤسسة للاعتماد الأكاديمي وتقديم:

1. تقييم عام للجاهزية (نسبة مئوية تقديرية)
2. نقاط القوة التي تدعم ملف الاعتماد
3. الفجوات الحرجة التي يجب معالجتها
4. خطة عمل مقترحة بأولويات واضحة
5. الجدول الزمني المقترح للتجهيز
6. المخاطر المحتملة وكيفية التخفيف منها

كن واقعياً ومحدداً في التقييم باللغة العربية.`;

  const userPrompt = `قيّم جاهزية المؤسسة للاعتماد الأكاديمي بناءً على البيانات التالية:

## مؤشرات الأداء (KPIs):
- إجمالي المؤشرات: ${data.kpisSummary.total}
- متفوقة (EXCEEDS): ${data.kpisSummary.exceeds}
- محققة (MEETS): ${data.kpisSummary.meets}
- دون المستهدف (BELOW): ${data.kpisSummary.below}
- حرجة (CRITICAL): ${data.kpisSummary.critical}
- نسبة الإنجاز: ${data.kpisSummary.total > 0 ? Math.round(((data.kpisSummary.exceeds + data.kpisSummary.meets) / data.kpisSummary.total) * 100) : 0}%

## ملاحظات التدقيق المفتوحة:
- حرجة: ${data.openFindings.critical}
- رئيسية: ${data.openFindings.major}
- فرعية: ${data.openFindings.minor}
- إجمالي المفتوحة: ${data.openFindings.critical + data.openFindings.major + data.openFindings.minor}

## خطط التحسين:
- متوسط نسبة التقدم: ${data.plansProgress}%

## الوثائق:
- عدد الوثائق المتاحة: ${data.documentsCount}`;

  try {
    const result = await generateText({
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      maxTokens: 2048,
      temperature: 0.3,
    });

    return result.text;
  } catch (error) {
    console.error("[Quality AI] Accreditation readiness error:", error);
    return "حدث خطأ أثناء تقييم جاهزية الاعتماد. يرجى المحاولة لاحقاً.";
  }
}

// ═══ Quality Report Generation ═══

/**
 * Generate a comprehensive quality report using AI
 */
export async function generateQualityReportWithAI(data: {
  kpis: any[];
  findings: any[];
  plans: any[];
  surveys: any[];
  periodStart: string;
  periodEnd: string;
}): Promise<string> {
  if (!isLLMAvailable()) {
    return LLM_NOT_CONFIGURED_AR;
  }

  // Build KPI summary
  const kpiLines =
    data.kpis.length > 0
      ? data.kpis
          .slice(0, 20)
          .map(
            (k) =>
              `- ${k.kpiCode || "N/A"}: ${k.nameAr || "مؤشر"} | الفعلي: ${k.actualValue ?? "N/A"} | المستهدف: ${k.targetValue ?? "N/A"} | الحالة: ${k.status || "N/A"}`
          )
          .join("\n")
      : "لا توجد بيانات مؤشرات أداء لهذه الفترة";

  // Build findings summary
  const findingsLines =
    data.findings.length > 0
      ? data.findings
          .slice(0, 15)
          .map(
            (f) =>
              `- ${f.findingType || "N/A"} (${f.severity || "N/A"}): ${f.descriptionAr || "بدون وصف"} | الحالة: ${f.status || "N/A"}`
          )
          .join("\n")
      : "لا توجد ملاحظات تدقيق لهذه الفترة";

  // Build plans summary
  const planLines =
    data.plans.length > 0
      ? data.plans
          .slice(0, 10)
          .map(
            (p) =>
              `- ${p.titleAr || "خطة"}: ${p.status || "N/A"} | التقدم: ${p.progressPercentage ?? 0}%`
          )
          .join("\n")
      : "لا توجد خطط تحسين لهذه الفترة";

  // Build surveys summary
  const surveyLines =
    data.surveys.length > 0
      ? data.surveys
          .slice(0, 10)
          .map(
            (s) =>
              `- ${s.titleAr || "استبيان"}: ${s.surveyType || "N/A"} | الردود: ${s.totalResponses ?? 0}`
          )
          .join("\n")
      : "لا توجد استبيانات لهذه الفترة";

  const systemPrompt = `أنت كاتب تقارير جودة أكاديمية متخصص في معايير NCAAA.
مهمتك إعداد تقرير جودة شامل ومهني باللغة العربية يتضمن:

1. الملخص التنفيذي
2. أداء مؤشرات الأداء الرئيسية
3. نتائج التدقيق والمراجعات
4. خطط التحسين وتقدمها
5. نتائج الاستبيانات ورضا المستفيدين
6. التوصيات والخطوات المقبلة

يجب أن يكون التقرير:
- مهني ورسمي بلغة عربية فصحى
- منظم بعناوين وفقرات واضحة
- يتضمن أرقام ونسب محددة
- يقدم توصيات عملية قابلة للتنفيذ`;

  const userPrompt = `أعدّ تقرير جودة شامل للفترة من ${data.periodStart} إلى ${data.periodEnd}:

## مؤشرات الأداء الرئيسية (${data.kpis.length} مؤشر):
${kpiLines}

## ملاحظات التدقيق (${data.findings.length} ملاحظة):
${findingsLines}

## خطط التحسين (${data.plans.length} خطة):
${planLines}

## الاستبيانات (${data.surveys.length} استبيان):
${surveyLines}`;

  try {
    const result = await generateText({
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      maxTokens: 3000,
      temperature: 0.3,
    });

    return result.text;
  } catch (error) {
    console.error("[Quality AI] Report generation error:", error);
    return "حدث خطأ أثناء إعداد التقرير. يرجى المحاولة لاحقاً.";
  }
}
