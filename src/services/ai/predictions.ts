/**
 * Predictions Engine
 * محرك التنبؤات الأكاديمية
 *
 * Uses simple statistical methods (no external ML):
 * - Moving averages for trend detection
 * - Linear regression for projections
 * - Pattern-based risk estimation
 */

import prisma from "@/lib/prisma";
import { aiCache } from "./cache";
import { AI_CONFIG } from "@/lib/ai-config";

// ═══ Types ═══

export interface Prediction {
  id: string;
  type: "enrollment" | "performance" | "attendance" | "capacity" | "financial";
  titleAr: string;
  titleEn: string;
  descriptionAr: string;
  descriptionEn: string;
  value: number;
  unit: string;
  confidence: number; // 0-100%
  impact: "high" | "medium" | "low";
  trend: "up" | "down" | "stable";
  basedOn: string;
}

export interface PredictionsReport {
  predictions: Prediction[];
  generatedAt: string;
}

// ═══ Statistical Helpers ═══

/**
 * Simple linear regression: y = mx + b
 * Returns slope (m) and intercept (b)
 */
function linearRegression(data: number[]): { slope: number; intercept: number } {
  const n = data.length;
  if (n < 2) return { slope: 0, intercept: data[0] || 0 };

  let sumX = 0, sumY = 0, sumXY = 0, sumX2 = 0;
  for (let i = 0; i < n; i++) {
    sumX += i;
    sumY += data[i];
    sumXY += i * data[i];
    sumX2 += i * i;
  }

  const denominator = n * sumX2 - sumX * sumX;
  if (denominator === 0) return { slope: 0, intercept: sumY / n || 0 };

  const slope = (n * sumXY - sumX * sumY) / denominator;
  const intercept = (sumY - slope * sumX) / n;

  return {
    slope: isNaN(slope) || !isFinite(slope) ? 0 : slope,
    intercept: isNaN(intercept) || !isFinite(intercept) ? 0 : intercept,
  };
}

/**
 * Moving average
 */
function movingAverage(data: number[], window: number): number[] {
  const result: number[] = [];
  for (let i = 0; i < data.length; i++) {
    const start = Math.max(0, i - window + 1);
    const slice = data.slice(start, i + 1);
    result.push(slice.reduce((a, b) => a + b, 0) / slice.length);
  }
  return result;
}

/**
 * Calculate confidence based on data variance
 */
function calculateConfidence(data: number[]): number {
  if (data.length < 3) return 50;
  const mean = data.reduce((a, b) => a + b, 0) / data.length;
  const variance = data.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / data.length;
  const cv = Math.sqrt(variance) / (mean || 1); // Coefficient of variation
  // Lower CV = higher confidence
  return Math.max(40, Math.min(95, Math.round(100 - cv * 100)));
}

// ═══ Prediction Generators ═══

/**
 * Generate all predictions based on current data
 */
export async function generatePredictions(): Promise<PredictionsReport> {
  return aiCache.getOrCompute(
    "predictions:all",
    async () => {
      const predictions: Prediction[] = [];

      // 1. Enrollment Prediction
      const enrollmentPred = await predictEnrollment();
      if (enrollmentPred) predictions.push(enrollmentPred);

      // 2. Performance Prediction
      const perfPred = await predictPerformance();
      if (perfPred) predictions.push(perfPred);

      // 3. Attendance Prediction
      const attendancePred = await predictAttendance();
      if (attendancePred) predictions.push(attendancePred);

      // 4. At-Risk Prediction
      const riskPred = await predictAtRiskCount();
      if (riskPred) predictions.push(riskPred);

      // 5. Budget Prediction
      const budgetPred = await predictBudgetUtilization();
      if (budgetPred) predictions.push(budgetPred);

      return {
        predictions,
        generatedAt: new Date().toISOString(),
      };
    },
    AI_CONFIG.cacheTtlMinutes
  );
}

async function predictEnrollment(): Promise<Prediction | null> {
  try {
    // Get enrollment counts by semester
    const semesters = await prisma.semester.findMany({
      orderBy: { startDate: "asc" },
      include: { _count: { select: { enrollments: true } } },
    });

    if (semesters.length < 2) return null;

    const counts = semesters.map((s) => s._count.enrollments);
    const { slope } = linearRegression(counts);
    const lastCount = counts[counts.length - 1];
    const predicted = Math.round(lastCount + slope);
    const changePercent = lastCount > 0 ? Math.round((slope / lastCount) * 100) : 0;
    const confidence = calculateConfidence(counts);

    return {
      id: "pred-enrollment",
      type: "enrollment",
      titleAr: slope > 0 ? "ارتفاع متوقع في التسجيل" : "انخفاض متوقع في التسجيل",
      titleEn: slope > 0 ? "Expected Enrollment Increase" : "Expected Enrollment Decrease",
      descriptionAr: `بناءً على تحليل بيانات ${semesters.length} فصول، يُتوقع ${slope > 0 ? "ارتفاع" : "انخفاض"} التسجيل بنسبة ${Math.abs(changePercent)}% في الفصل القادم (${predicted} تسجيل متوقع)`,
      descriptionEn: `Based on ${semesters.length}-semester analysis, enrollment is expected to ${slope > 0 ? "increase" : "decrease"} by ${Math.abs(changePercent)}% next semester (${predicted} enrollments expected)`,
      value: changePercent,
      unit: "%",
      confidence,
      impact: Math.abs(changePercent) > 10 ? "high" : Math.abs(changePercent) > 5 ? "medium" : "low",
      trend: slope > 0 ? "up" : slope < 0 ? "down" : "stable",
      basedOn: `${semesters.length} semesters of data`,
    };
  } catch {
    return null;
  }
}

async function predictPerformance(): Promise<Prediction | null> {
  try {
    // Get avg grades per semester (approximated by months)
    const grades = await prisma.grade.findMany({
      where: { totalGrade: { not: null } },
      select: { totalGrade: true, createdAt: true },
      orderBy: { createdAt: "asc" },
    });

    if (grades.length < 5) return null;

    const gradeValues = grades.map((g) => g.totalGrade!);
    const avgGrades = movingAverage(gradeValues, Math.min(10, gradeValues.length));
    const { slope } = linearRegression(avgGrades);
    const currentAvg = Math.round(avgGrades[avgGrades.length - 1] * 10) / 10;
    const predictedAvg = Math.round((currentAvg + slope) * 10) / 10;
    const confidence = calculateConfidence(avgGrades);

    return {
      id: "pred-performance",
      type: "performance",
      titleAr: slope > 0 ? "تحسن متوقع في الأداء الأكاديمي" : "انخفاض متوقع في الأداء",
      titleEn: slope > 0 ? "Expected Academic Performance Improvement" : "Expected Performance Decline",
      descriptionAr: `المعدل الحالي ${currentAvg} من 100. يُتوقع ${slope > 0 ? "ارتفاع" : "انخفاض"} ليصل إلى ${predictedAvg} بنهاية الفصل`,
      descriptionEn: `Current average: ${currentAvg}/100. Expected to ${slope > 0 ? "rise" : "fall"} to ${predictedAvg} by end of semester`,
      value: predictedAvg,
      unit: "/100",
      confidence,
      impact: Math.abs(slope) > 2 ? "high" : "medium",
      trend: slope > 0 ? "up" : slope < 0 ? "down" : "stable",
      basedOn: `${grades.length} grade records`,
    };
  } catch {
    return null;
  }
}

async function predictAttendance(): Promise<Prediction | null> {
  try {
    const totalRecords = await prisma.attendance.count();
    const presentRecords = await prisma.attendance.count({
      where: { status: { in: ["PRESENT", "LATE"] } },
    });

    if (totalRecords < 10) return null;

    const currentRate = Math.round((presentRecords / totalRecords) * 100 * 10) / 10;

    return {
      id: "pred-attendance",
      type: "attendance",
      titleAr: currentRate >= 85 ? "معدل حضور مستقر" : "معدل حضور يحتاج تحسين",
      titleEn: currentRate >= 85 ? "Stable Attendance Rate" : "Attendance Rate Needs Improvement",
      descriptionAr: `معدل الحضور الحالي ${currentRate}%. ${currentRate < 85 ? "يُنصح بتفعيل نظام الإنذار المبكر لتحسين الحضور" : "المعدل ضمن النطاق المقبول"}`,
      descriptionEn: `Current attendance rate: ${currentRate}%. ${currentRate < 85 ? "Early warning system activation recommended" : "Rate within acceptable range"}`,
      value: currentRate,
      unit: "%",
      confidence: 85,
      impact: currentRate < 80 ? "high" : currentRate < 85 ? "medium" : "low",
      trend: currentRate >= 85 ? "stable" : "down",
      basedOn: `${totalRecords} attendance records`,
    };
  } catch {
    return null;
  }
}

async function predictAtRiskCount(): Promise<Prediction | null> {
  try {
    // Count trainees with GPA below 2.0
    const atRiskGPA = await prisma.trainee.count({
      where: { status: "ACTIVE", gpa: { lt: 2.0, gt: 0 } },
    });
    const totalActive = await prisma.trainee.count({
      where: { status: "ACTIVE" },
    });

    if (totalActive === 0) return null;

    const riskPercent = Math.round((atRiskGPA / totalActive) * 100 * 10) / 10;

    return {
      id: "pred-atrisk",
      type: "performance",
      titleAr: `${atRiskGPA} متدرب معرضون للخطر الأكاديمي`,
      titleEn: `${atRiskGPA} Trainees at Academic Risk`,
      descriptionAr: `${atRiskGPA} متدرب (${riskPercent}%) لديهم معدل تراكمي أقل من 2.0 ويحتاجون تدخل مبكر`,
      descriptionEn: `${atRiskGPA} trainees (${riskPercent}%) have GPA below 2.0 and need early intervention`,
      value: atRiskGPA,
      unit: "trainees",
      confidence: 95,
      impact: riskPercent > 10 ? "high" : riskPercent > 5 ? "medium" : "low",
      trend: "stable",
      basedOn: `${totalActive} active trainees`,
    };
  } catch {
    return null;
  }
}

async function predictBudgetUtilization(): Promise<Prediction | null> {
  try {
    const budget = await prisma.budgetItem.aggregate({
      _sum: { allocatedAmount: true, spentAmount: true },
    });

    const allocated = budget._sum.allocatedAmount ?? 0;
    const spent = budget._sum.spentAmount ?? 0;

    if (allocated === 0) return null;

    const utilization = Math.round((spent / allocated) * 100 * 10) / 10;

    return {
      id: "pred-budget",
      type: "financial",
      titleAr: utilization > 85 ? "ميزانية تقترب من الحد الأقصى" : "استهلاك ميزانية مستقر",
      titleEn: utilization > 85 ? "Budget Nearing Limit" : "Stable Budget Utilization",
      descriptionAr: `نسبة استهلاك الميزانية ${utilization}%. ${utilization > 85 ? "يُنصح بمراجعة بنود الصرف وتحديد الأولويات" : "الاستهلاك ضمن النطاق المقبول"}`,
      descriptionEn: `Budget utilization: ${utilization}%. ${utilization > 85 ? "Review spending items and prioritize recommended" : "Utilization within acceptable range"}`,
      value: utilization,
      unit: "%",
      confidence: 90,
      impact: utilization > 90 ? "high" : utilization > 80 ? "medium" : "low",
      trend: utilization > 85 ? "up" : "stable",
      basedOn: `Budget analysis`,
    };
  } catch {
    return null;
  }
}

