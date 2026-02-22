/**
 * Early Warning System
 * نظام الإنذار المبكر للمتدربين المعرضين للخطر الأكاديمي
 *
 * Uses weighted scoring model:
 * - Attendance rate (35%)
 * - Grade performance (30%)
 * - Absence streak (20%)
 * - GPA threshold (15%)
 */

import prisma from "@/lib/prisma";
import { EARLY_WARNING } from "@/lib/ai-config";
import { aiCache } from "./cache";
import { AI_CONFIG } from "@/lib/ai-config";

// ═══ Types ═══

export interface TraineeRiskAssessment {
  traineeId: string;
  traineeName: string;
  studentNumber: string;
  departmentId: string;
  departmentName: string;
  riskScore: number; // 0-100
  riskLevel: "low" | "medium" | "high" | "critical";
  factors: {
    attendanceRate: number;
    attendanceScore: number;
    avgGrade: number;
    gradeScore: number;
    absenceStreak: number;
    absenceStreakScore: number;
    gpa: number;
    gpaBelow: boolean;
    gpaScore: number;
  };
  recommendations: string[];
}

export interface EarlyWarningReport {
  totalAssessed: number;
  atRisk: number;
  criticalCount: number;
  highCount: number;
  mediumCount: number;
  lowCount: number;
  trainees: TraineeRiskAssessment[];
  generatedAt: string;
}

// ═══ Risk Calculation ═══

/**
 * Calculate risk score for a single trainee
 */
function calculateRiskScore(factors: {
  attendanceRate: number;
  avgGrade: number;
  absenceStreak: number;
  gpa: number;
}): {
  score: number;
  level: "low" | "medium" | "high" | "critical";
  breakdown: {
    attendanceScore: number;
    gradeScore: number;
    absenceStreakScore: number;
    gpaScore: number;
  };
} {
  const { weights } = EARLY_WARNING;

  // Attendance score (0-100): lower attendance = higher risk
  const attendanceScore = Math.max(0, Math.min(100, 100 - factors.attendanceRate));

  // Grade score (0-100): lower grades = higher risk
  const gradeScore = Math.max(0, Math.min(100, 100 - factors.avgGrade));

  // Absence streak score (0-100): more consecutive absences = higher risk
  const absenceStreakScore = Math.min(100, factors.absenceStreak * 15); // Each day = 15 points

  // GPA score (0-100): below 2.0 = 100, above 3.0 = 0, linear between
  const gpaScore =
    factors.gpa < 2.0
      ? 100
      : factors.gpa > 3.0
        ? 0
        : Math.round((1 - (factors.gpa - 2.0)) * 100);

  // Weighted total
  const totalScore = Math.round(
    attendanceScore * weights.attendance +
      gradeScore * weights.grades +
      absenceStreakScore * weights.absenceStreak +
      gpaScore * weights.gpaThreshold
  );

  // Determine risk level
  const { riskLevels } = EARLY_WARNING;
  let level: "low" | "medium" | "high" | "critical" = "low";
  if (totalScore >= riskLevels.critical.min) level = "critical";
  else if (totalScore >= riskLevels.high.min) level = "high";
  else if (totalScore >= riskLevels.medium.min) level = "medium";

  return {
    score: totalScore,
    level,
    breakdown: {
      attendanceScore,
      gradeScore,
      absenceStreakScore,
      gpaScore,
    },
  };
}

/**
 * Generate recommendations based on risk factors
 */
function generateRecommendations(
  factors: TraineeRiskAssessment["factors"],
  locale: string
): string[] {
  const isAr = locale === "ar";
  const recs: string[] = [];

  if (factors.attendanceRate < 80) {
    recs.push(
      isAr
        ? "معدل الحضور منخفض - يُنصح بالتواصل مع المتدرب وولي أمره"
        : "Low attendance rate - contact trainee and guardian recommended"
    );
  }

  if (factors.absenceStreak >= 3) {
    recs.push(
      isAr
        ? `غياب متواصل (${factors.absenceStreak} أيام) - يتطلب تدخل فوري`
        : `Consecutive absences (${factors.absenceStreak} days) - immediate intervention required`
    );
  }

  if (factors.avgGrade < 60) {
    recs.push(
      isAr
        ? "الدرجات أقل من الحد الأدنى - يُنصح بتوفير دعم أكاديمي إضافي"
        : "Grades below minimum - additional academic support recommended"
    );
  }

  if (factors.gpaBelow) {
    recs.push(
      isAr
        ? "المعدل التراكمي أقل من 2.0 - يتطلب خطة تحسين أكاديمي"
        : "GPA below 2.0 - academic improvement plan required"
    );
  }

  if (recs.length === 0) {
    recs.push(
      isAr
        ? "الأداء مقبول - يُنصح بالمتابعة الدورية"
        : "Performance acceptable - periodic monitoring recommended"
    );
  }

  return recs;
}

// ═══ Main Assessment Function ═══

/**
 * Assess all active trainees and generate early warning report
 */
export async function assessAllTrainees(
  locale: string = "ar",
  departmentId?: string
): Promise<EarlyWarningReport> {
  const cacheKey = `early-warning:${departmentId || "all"}:${locale}`;

  return aiCache.getOrCompute(
    cacheKey,
    async () => {
      // Get active trainees with their data
      const whereClause: Record<string, unknown> = { status: "ACTIVE" };
      if (departmentId) {
        whereClause.departmentId = departmentId;
      }

      const trainees = await prisma.trainee.findMany({
        where: whereClause,
        include: {
          department: { select: { nameAr: true, nameEn: true } },
          enrollments: {
            include: {
              grade: { select: { totalGrade: true } },
              attendance: { select: { status: true, date: true } },
            },
          },
        },
      });

      const assessments: TraineeRiskAssessment[] = [];

      for (const trainee of trainees) {
        // Calculate attendance rate
        const allAttendance = trainee.enrollments.flatMap((e) => e.attendance);
        const totalAttendance = allAttendance.length;
        const presentCount = allAttendance.filter(
          (a) => a.status === "PRESENT" || a.status === "LATE"
        ).length;
        const attendanceRate =
          totalAttendance > 0
            ? Math.round((presentCount / totalAttendance) * 100 * 10) / 10
            : 100;

        // Calculate average grade
        const grades = trainee.enrollments
          .map((e) => e.grade?.totalGrade)
          .filter((g): g is number => g !== null && g !== undefined);
        const avgGrade =
          grades.length > 0
            ? Math.round(
                (grades.reduce((a, b) => a + b, 0) / grades.length) * 10
              ) / 10
            : 100;

        // Calculate absence streak (consecutive absent days from most recent)
        const sortedAttendance = [...allAttendance].sort(
          (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
        );
        let absenceStreak = 0;
        for (const record of sortedAttendance) {
          if (record.status === "ABSENT") {
            absenceStreak++;
          } else {
            break;
          }
        }

        // Calculate risk
        const { score, level, breakdown } = calculateRiskScore({
          attendanceRate,
          avgGrade,
          absenceStreak,
          gpa: trainee.gpa,
        });

        const factors = {
          attendanceRate,
          attendanceScore: breakdown.attendanceScore,
          avgGrade,
          gradeScore: breakdown.gradeScore,
          absenceStreak,
          absenceStreakScore: breakdown.absenceStreakScore,
          gpa: trainee.gpa,
          gpaBelow: trainee.gpa < 2.0,
          gpaScore: breakdown.gpaScore,
        };

        const recommendations = generateRecommendations(factors, locale);

        const isAr = locale === "ar";

        assessments.push({
          traineeId: trainee.id,
          traineeName: isAr ? trainee.fullNameAr : trainee.fullNameEn,
          studentNumber: trainee.studentNumber,
          departmentId: trainee.departmentId,
          departmentName: isAr
            ? trainee.department.nameAr
            : trainee.department.nameEn,
          riskScore: score,
          riskLevel: level,
          factors,
          recommendations,
        });
      }

      // Sort by risk score (highest first)
      assessments.sort((a, b) => b.riskScore - a.riskScore);

      return {
        totalAssessed: assessments.length,
        atRisk: assessments.filter((a) =>
          ["medium", "high", "critical"].includes(a.riskLevel)
        ).length,
        criticalCount: assessments.filter((a) => a.riskLevel === "critical")
          .length,
        highCount: assessments.filter((a) => a.riskLevel === "high").length,
        mediumCount: assessments.filter((a) => a.riskLevel === "medium").length,
        lowCount: assessments.filter((a) => a.riskLevel === "low").length,
        trainees: assessments,
        generatedAt: new Date().toISOString(),
      };
    },
    AI_CONFIG.cacheTtlMinutes
  );
}
