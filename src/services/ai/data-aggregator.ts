/**
 * Data Aggregator Service
 * خدمة تجميع البيانات من قاعدة البيانات للسياق الذكي
 *
 * Fetches and aggregates data from Prisma models to build
 * context for AI features (chat, insights, early warning, etc.)
 */

import prisma from "@/lib/prisma";
import { aiCache } from "./cache";
import { AI_CONFIG, CACHE_KEYS } from "@/lib/ai-config";

// ═══ Types ═══

export interface AcademicOverview {
  totalTrainees: number;
  activeTrainees: number;
  suspendedTrainees: number;
  withdrawnTrainees: number;
  totalTrainers: number;
  activeTrainers: number;
  totalDepartments: number;
  totalCourses: number;
  avgGPA: number;
  successRate: number; // % of passing grades
  totalEnrollments: number;
}

export interface AttendanceOverview {
  totalRecords: number;
  presentCount: number;
  absentCount: number;
  lateCount: number;
  excusedCount: number;
  attendanceRate: number;
}

export interface FinancialOverview {
  totalIncome: number;
  totalExpenses: number;
  pendingTransactions: number;
  approvedTransactions: number;
  totalBudgetAllocated: number;
  totalBudgetSpent: number;
  budgetUtilization: number;
}

export interface DepartmentPerformance {
  id: string;
  nameAr: string;
  nameEn: string;
  traineeCount: number;
  trainerCount: number;
  courseCount: number;
  avgGPA: number;
}

export interface QualityOverview {
  totalKpis: number;
  exceeds: number;
  meets: number;
  below: number;
  critical: number;
  avgAchievementRate: number;
  openFindings: {
    critical: number;
    major: number;
    minor: number;
    total: number;
  };
  improvementPlans: {
    total: number;
    inProgress: number;
    completed: number;
    avgProgress: number;
  };
  accreditations: {
    active: number;
    expired: number;
    underRenewal: number;
  };
}

export interface TasksOverview {
  total: number;
  todo: number;
  inProgress: number;
  inReview: number;
  completed: number;
  overdue: number;
}

export interface FullDataContext {
  academic: AcademicOverview;
  attendance: AttendanceOverview;
  financial: FinancialOverview;
  departments: DepartmentPerformance[];
  quality: QualityOverview;
  tasks: TasksOverview;
  generatedAt: string;
}

// ═══ Aggregation Functions ═══

export async function getAcademicOverview(): Promise<AcademicOverview> {
  return aiCache.getOrCompute(
    CACHE_KEYS.academicOverview(),
    async () => {
      const [
        totalTrainees,
        activeTrainees,
        suspendedTrainees,
        withdrawnTrainees,
        totalTrainers,
        activeTrainers,
        totalDepartments,
        totalCourses,
        totalEnrollments,
        grades,
      ] = await Promise.all([
        prisma.trainee.count(),
        prisma.trainee.count({ where: { status: "ACTIVE" } }),
        prisma.trainee.count({ where: { status: "SUSPENDED" } }),
        prisma.trainee.count({ where: { status: "WITHDRAWN" } }),
        prisma.trainer.count(),
        prisma.trainer.count({ where: { status: "ACTIVE" } }),
        prisma.department.count({ where: { isActive: true } }),
        prisma.course.count({ where: { isActive: true } }),
        prisma.enrollment.count(),
        prisma.grade.findMany({
          where: { totalGrade: { not: null } },
          select: { totalGrade: true },
        }),
      ]);

      // Calculate GPA average from active trainees
      const gpaResult = await prisma.trainee.aggregate({
        where: { status: "ACTIVE" },
        _avg: { gpa: true },
      });

      // Calculate success rate (grades >= 60 out of 100)
      const passingGrades = grades.filter(
        (g) => g.totalGrade !== null && g.totalGrade >= 60
      ).length;
      const successRate =
        grades.length > 0
          ? Math.round((passingGrades / grades.length) * 100 * 10) / 10
          : 0;

      return {
        totalTrainees,
        activeTrainees,
        suspendedTrainees,
        withdrawnTrainees,
        totalTrainers,
        activeTrainers,
        totalDepartments,
        totalCourses,
        avgGPA: Math.round((gpaResult._avg.gpa ?? 0) * 100) / 100,
        successRate,
        totalEnrollments,
      };
    },
    AI_CONFIG.cacheTtlMinutes
  );
}

export async function getAttendanceOverview(): Promise<AttendanceOverview> {
  return aiCache.getOrCompute(
    "attendance:overview",
    async () => {
      const [totalRecords, presentCount, absentCount, lateCount, excusedCount] =
        await Promise.all([
          prisma.attendance.count(),
          prisma.attendance.count({ where: { status: "PRESENT" } }),
          prisma.attendance.count({ where: { status: "ABSENT" } }),
          prisma.attendance.count({ where: { status: "LATE" } }),
          prisma.attendance.count({ where: { status: "EXCUSED" } }),
        ]);

      const attendanceRate =
        totalRecords > 0
          ? Math.round(
              ((presentCount + lateCount) / totalRecords) * 100 * 10
            ) / 10
          : 0;

      return {
        totalRecords,
        presentCount,
        absentCount,
        lateCount,
        excusedCount,
        attendanceRate,
      };
    },
    AI_CONFIG.cacheTtlMinutes
  );
}

export async function getFinancialOverview(): Promise<FinancialOverview> {
  return aiCache.getOrCompute(
    CACHE_KEYS.financialSummary(new Date().getFullYear().toString()),
    async () => {
      const [
        incomeResult,
        expenseResult,
        pendingTransactions,
        approvedTransactions,
        budgetResult,
      ] = await Promise.all([
        prisma.financialTransaction.aggregate({
          where: { type: "INCOME", status: "COMPLETED" },
          _sum: { amount: true },
        }),
        prisma.financialTransaction.aggregate({
          where: { type: "EXPENSE", status: "COMPLETED" },
          _sum: { amount: true },
        }),
        prisma.financialTransaction.count({ where: { status: "PENDING" } }),
        prisma.financialTransaction.count({ where: { status: "APPROVED" } }),
        prisma.budgetItem.aggregate({
          _sum: { allocatedAmount: true, spentAmount: true },
        }),
      ]);

      // Convert Prisma Decimal types to plain numbers
      const totalBudgetAllocated =
        Number(budgetResult._sum.allocatedAmount ?? 0);
      const totalBudgetSpent = Number(budgetResult._sum.spentAmount ?? 0);
      const budgetUtilization =
        totalBudgetAllocated > 0
          ? Math.round(
              (totalBudgetSpent / totalBudgetAllocated) * 100 * 10
            ) / 10
          : 0;

      return {
        totalIncome: Number(incomeResult._sum.amount ?? 0),
        totalExpenses: Number(expenseResult._sum.amount ?? 0),
        pendingTransactions,
        approvedTransactions,
        totalBudgetAllocated,
        totalBudgetSpent,
        budgetUtilization,
      };
    },
    AI_CONFIG.cacheTtlMinutes
  );
}

export async function getDepartmentPerformance(): Promise<
  DepartmentPerformance[]
> {
  return aiCache.getOrCompute(
    "departments:performance",
    async () => {
      const departments = await prisma.department.findMany({
        where: { isActive: true },
        include: {
          _count: {
            select: {
              trainees: true,
              trainers: true,
              courses: true,
            },
          },
        },
      });

      const result: DepartmentPerformance[] = [];

      for (const dept of departments) {
        // Get avg GPA per department
        const gpaResult = await prisma.trainee.aggregate({
          where: { departmentId: dept.id, status: "ACTIVE" },
          _avg: { gpa: true },
        });

        result.push({
          id: dept.id,
          nameAr: dept.nameAr,
          nameEn: dept.nameEn,
          traineeCount: dept._count.trainees,
          trainerCount: dept._count.trainers,
          courseCount: dept._count.courses,
          avgGPA: Math.round((gpaResult._avg.gpa ?? 0) * 100) / 100,
        });
      }

      return result;
    },
    AI_CONFIG.cacheTtlMinutes
  );
}

export async function getQualityOverview(): Promise<QualityOverview> {
  return aiCache.getOrCompute(
    CACHE_KEYS.qualityGaps(),
    async () => {
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

      // Collect statuses from latest measurements
      const latestStatuses = kpis
        .filter((k) => k.measurements.length > 0)
        .map((k) => k.measurements[0]);

      const totalKpis = latestStatuses.length;
      const exceeds = latestStatuses.filter((m) => m.status === "EXCEEDS").length;
      const meets = latestStatuses.filter((m) => m.status === "MEETS").length;
      const below = latestStatuses.filter((m) => m.status === "BELOW").length;
      const critical = latestStatuses.filter((m) => m.status === "CRITICAL").length;

      // Calculate avg achievement rate from latest measurements
      let avgAchievementRate = 0;
      const withRates = latestStatuses.filter((m) => m.achievementRate !== null);
      if (withRates.length > 0) {
        const total = withRates.reduce(
          (sum, m) => sum + (m.achievementRate ?? 0),
          0
        );
        avgAchievementRate = Math.round((total / withRates.length) * 10) / 10;
      }

      // Aggregate open audit findings by severity
      const [criticalFindings, majorFindings, minorFindings] =
        await Promise.all([
          prisma.auditFinding.count({
            where: {
              status: { in: ["OPEN", "IN_PROGRESS"] },
              severity: "CRITICAL",
            },
          }),
          prisma.auditFinding.count({
            where: {
              status: { in: ["OPEN", "IN_PROGRESS"] },
              severity: "MAJOR",
            },
          }),
          prisma.auditFinding.count({
            where: {
              status: { in: ["OPEN", "IN_PROGRESS"] },
              severity: "MINOR",
            },
          }),
        ]);

      // Improvement plan stats
      const [totalPlans, inProgressPlans, completedPlans, plansAvgResult] =
        await Promise.all([
          prisma.improvementPlan.count(),
          prisma.improvementPlan.count({
            where: { status: "IP_IN_PROGRESS" },
          }),
          prisma.improvementPlan.count({
            where: { status: "IP_COMPLETED" },
          }),
          prisma.improvementPlan.aggregate({
            where: {
              status: { in: ["APPROVED", "IP_IN_PROGRESS"] },
            },
            _avg: { progressPercentage: true },
          }),
        ]);

      // Accreditation counts by status
      const [activeAccreditations, expiredAccreditations, underRenewalAccreditations] =
        await Promise.all([
          prisma.accreditation.count({
            where: { status: "ACCREDITATION_ACTIVE" },
          }),
          prisma.accreditation.count({ where: { status: "EXPIRED" } }),
          prisma.accreditation.count({
            where: { status: "UNDER_RENEWAL" },
          }),
        ]);

      return {
        totalKpis,
        exceeds,
        meets,
        below,
        critical,
        avgAchievementRate,
        openFindings: {
          critical: criticalFindings,
          major: majorFindings,
          minor: minorFindings,
          total: criticalFindings + majorFindings + minorFindings,
        },
        improvementPlans: {
          total: totalPlans,
          inProgress: inProgressPlans,
          completed: completedPlans,
          avgProgress: Math.round(plansAvgResult._avg.progressPercentage ?? 0),
        },
        accreditations: {
          active: activeAccreditations,
          expired: expiredAccreditations,
          underRenewal: underRenewalAccreditations,
        },
      };
    },
    AI_CONFIG.cacheTtlMinutes
  );
}

export async function getTasksOverview(): Promise<TasksOverview> {
  return aiCache.getOrCompute(
    "tasks:overview",
    async () => {
      const [total, todo, inProgress, inReview, completed] =
        await Promise.all([
          prisma.task.count(),
          prisma.task.count({ where: { status: "TODO" } }),
          prisma.task.count({ where: { status: "IN_PROGRESS" } }),
          prisma.task.count({ where: { status: "IN_REVIEW" } }),
          prisma.task.count({ where: { status: "COMPLETED" } }),
        ]);

      // Overdue = tasks with dueDate < now and not completed/cancelled
      const overdue = await prisma.task.count({
        where: {
          dueDate: { lt: new Date() },
          status: { notIn: ["COMPLETED", "CANCELLED"] },
        },
      });

      return { total, todo, inProgress, inReview, completed, overdue };
    },
    AI_CONFIG.cacheTtlMinutes
  );
}

// ═══ Full Context Builder ═══

/**
 * Get complete data context for AI features
 * Used by the chatbot and insights engine
 */
export async function getFullDataContext(): Promise<FullDataContext> {
  const [academic, attendance, financial, departments, quality, tasks] =
    await Promise.all([
      getAcademicOverview(),
      getAttendanceOverview(),
      getFinancialOverview(),
      getDepartmentPerformance(),
      getQualityOverview(),
      getTasksOverview(),
    ]);

  return {
    academic,
    attendance,
    financial,
    departments,
    quality,
    tasks,
    generatedAt: new Date().toISOString(),
  };
}

/**
 * Convert full data context to a text summary for LLM context
 */
export function contextToText(ctx: FullDataContext, locale: string): string {
  const isAr = locale === "ar";

  if (isAr) {
    const deptLines = ctx.departments
      .map(
        (d) =>
          `  - ${d.nameAr}: ${d.traineeCount} متدرب، ${d.trainerCount} مدرب، معدل تراكمي ${d.avgGPA}`
      )
      .join("\n");

    return `
### البيانات الأكاديمية:
- إجمالي المتدربين: ${ctx.academic.totalTrainees} (نشط: ${ctx.academic.activeTrainees}, موقوف: ${ctx.academic.suspendedTrainees}, منسحب: ${ctx.academic.withdrawnTrainees})
- إجمالي المدربين: ${ctx.academic.totalTrainers} (نشط: ${ctx.academic.activeTrainers})
- الأقسام النشطة: ${ctx.academic.totalDepartments}
- المقررات النشطة: ${ctx.academic.totalCourses}
- التسجيلات: ${ctx.academic.totalEnrollments}
- متوسط المعدل التراكمي: ${ctx.academic.avgGPA}
- معدل النجاح: ${ctx.academic.successRate}%

### الحضور:
- إجمالي السجلات: ${ctx.attendance.totalRecords}
- حاضر: ${ctx.attendance.presentCount} | غائب: ${ctx.attendance.absentCount} | متأخر: ${ctx.attendance.lateCount} | معذور: ${ctx.attendance.excusedCount}
- معدل الحضور: ${ctx.attendance.attendanceRate}%

### المالية:
- إجمالي الإيرادات: ${ctx.financial.totalIncome.toLocaleString("ar-SA")} ريال
- إجمالي المصروفات: ${ctx.financial.totalExpenses.toLocaleString("ar-SA")} ريال
- الميزانية المخصصة: ${ctx.financial.totalBudgetAllocated.toLocaleString("ar-SA")} ريال
- الميزانية المنفقة: ${ctx.financial.totalBudgetSpent.toLocaleString("ar-SA")} ريال (${ctx.financial.budgetUtilization}%)
- معاملات معلقة: ${ctx.financial.pendingTransactions}

### أداء الأقسام:
${deptLines}

### الجودة:
- مؤشرات الأداء: ${ctx.quality.totalKpis} (متفوق: ${ctx.quality.exceeds} | محقق: ${ctx.quality.meets} | دون المستهدف: ${ctx.quality.below} | حرج: ${ctx.quality.critical})
- متوسط نسبة الإنجاز: ${ctx.quality.avgAchievementRate}%
- ملاحظات التدقيق المفتوحة: ${ctx.quality.openFindings.total} (حرجة: ${ctx.quality.openFindings.critical} | رئيسية: ${ctx.quality.openFindings.major} | فرعية: ${ctx.quality.openFindings.minor})
- خطط التحسين: ${ctx.quality.improvementPlans.total} (قيد التنفيذ: ${ctx.quality.improvementPlans.inProgress} | مكتمل: ${ctx.quality.improvementPlans.completed} | متوسط التقدم: ${ctx.quality.improvementPlans.avgProgress}%)
- الاعتمادات: نشطة ${ctx.quality.accreditations.active} | منتهية ${ctx.quality.accreditations.expired} | قيد التجديد ${ctx.quality.accreditations.underRenewal}

### المهام:
- إجمالي: ${ctx.tasks.total} | قيد التنفيذ: ${ctx.tasks.inProgress} | مكتمل: ${ctx.tasks.completed} | متأخر: ${ctx.tasks.overdue}

آخر تحديث: ${new Date(ctx.generatedAt).toLocaleString("ar-SA")}`.trim();
  }

  const deptLines = ctx.departments
    .map(
      (d) =>
        `  - ${d.nameEn}: ${d.traineeCount} trainees, ${d.trainerCount} trainers, avg GPA ${d.avgGPA}`
    )
    .join("\n");

  return `
### Academic Data:
- Total Trainees: ${ctx.academic.totalTrainees} (Active: ${ctx.academic.activeTrainees}, Suspended: ${ctx.academic.suspendedTrainees}, Withdrawn: ${ctx.academic.withdrawnTrainees})
- Total Trainers: ${ctx.academic.totalTrainers} (Active: ${ctx.academic.activeTrainers})
- Active Departments: ${ctx.academic.totalDepartments}
- Active Courses: ${ctx.academic.totalCourses}
- Enrollments: ${ctx.academic.totalEnrollments}
- Average GPA: ${ctx.academic.avgGPA}
- Success Rate: ${ctx.academic.successRate}%

### Attendance:
- Total Records: ${ctx.attendance.totalRecords}
- Present: ${ctx.attendance.presentCount} | Absent: ${ctx.attendance.absentCount} | Late: ${ctx.attendance.lateCount} | Excused: ${ctx.attendance.excusedCount}
- Attendance Rate: ${ctx.attendance.attendanceRate}%

### Financial:
- Total Income: ${ctx.financial.totalIncome.toLocaleString("en-US")} SAR
- Total Expenses: ${ctx.financial.totalExpenses.toLocaleString("en-US")} SAR
- Budget Allocated: ${ctx.financial.totalBudgetAllocated.toLocaleString("en-US")} SAR
- Budget Spent: ${ctx.financial.totalBudgetSpent.toLocaleString("en-US")} SAR (${ctx.financial.budgetUtilization}%)
- Pending Transactions: ${ctx.financial.pendingTransactions}

### Department Performance:
${deptLines}

### Quality:
- KPIs: ${ctx.quality.totalKpis} (Exceeds: ${ctx.quality.exceeds} | Meets: ${ctx.quality.meets} | Below: ${ctx.quality.below} | Critical: ${ctx.quality.critical})
- Avg Achievement Rate: ${ctx.quality.avgAchievementRate}%
- Open Audit Findings: ${ctx.quality.openFindings.total} (Critical: ${ctx.quality.openFindings.critical} | Major: ${ctx.quality.openFindings.major} | Minor: ${ctx.quality.openFindings.minor})
- Improvement Plans: ${ctx.quality.improvementPlans.total} (In Progress: ${ctx.quality.improvementPlans.inProgress} | Completed: ${ctx.quality.improvementPlans.completed} | Avg Progress: ${ctx.quality.improvementPlans.avgProgress}%)
- Accreditations: Active ${ctx.quality.accreditations.active} | Expired ${ctx.quality.accreditations.expired} | Under Renewal ${ctx.quality.accreditations.underRenewal}

### Tasks:
- Total: ${ctx.tasks.total} | In Progress: ${ctx.tasks.inProgress} | Completed: ${ctx.tasks.completed} | Overdue: ${ctx.tasks.overdue}

Last Updated: ${new Date(ctx.generatedAt).toLocaleString("en-US")}`.trim();
}

// ═══ Role-Scoped Context Types ═══

export interface TraineePersonalContext {
  trainee: {
    fullNameAr: string;
    fullNameEn: string;
    studentNumber: string;
    departmentNameAr: string;
    departmentNameEn: string;
    level: number;
    gpa: number;
    status: string;
  };
  enrollments: Array<{
    courseNameAr: string;
    courseNameEn: string;
    courseCode: string;
  }>;
  grades: Array<{
    courseNameAr: string;
    courseNameEn: string;
    courseCode: string;
    midtermGrade: number | null;
    finalGrade: number | null;
    assignmentsGrade: number | null;
    totalGrade: number | null;
    letterGrade: string | null;
  }>;
  attendance: {
    totalRecords: number;
    presentCount: number;
    absentCount: number;
    lateCount: number;
    excusedCount: number;
    attendanceRate: number;
  };
  schedule: Array<{
    courseNameAr: string;
    courseNameEn: string;
    dayOfWeek: string;
    startTime: string;
    endTime: string;
    room: string | null;
  }>;
}

export interface TrainerScopedContext {
  trainer: {
    fullNameAr: string;
    fullNameEn: string;
    employeeNumber: string;
    departmentNameAr: string;
    departmentNameEn: string;
    specialization: string | null;
  };
  courses: Array<{
    courseNameAr: string;
    courseNameEn: string;
    courseCode: string;
    enrollmentCount: number;
    avgGrade: number;
  }>;
  students: {
    total: number;
    avgAttendanceRate: number;
    avgGPA: number;
  };
  schedule: Array<{
    courseNameAr: string;
    courseNameEn: string;
    dayOfWeek: string;
    startTime: string;
    endTime: string;
    room: string | null;
  }>;
}

export interface DepartmentScopedContext {
  department: {
    nameAr: string;
    nameEn: string;
    headNameAr: string;
    headNameEn: string;
  };
  academic: {
    traineeCount: number;
    activeTrainees: number;
    trainerCount: number;
    courseCount: number;
    avgGPA: number;
    successRate: number;
  };
  attendance: {
    attendanceRate: number;
    totalRecords: number;
    absentCount: number;
  };
  atRiskTrainees: Array<{
    fullNameAr: string;
    fullNameEn: string;
    studentNumber: string;
    gpa: number;
    level: number;
  }>;
}

export type RoleScopedContext = {
  role: string;
  full?: FullDataContext;
  trainee?: TraineePersonalContext;
  trainer?: TrainerScopedContext;
  department?: DepartmentScopedContext;
};

// ═══ Role-Scoped Data Functions ═══

export async function getTraineePersonalContext(userId: string): Promise<TraineePersonalContext | null> {
  const trainee = await prisma.trainee.findUnique({
    where: { userId },
    include: {
      department: { select: { nameAr: true, nameEn: true } },
      enrollments: {
        include: {
          course: { select: { nameAr: true, nameEn: true, courseCode: true } },
          grade: true,
        },
        where: { semester: { isCurrent: true } },
      },
    },
  });

  if (!trainee) return null;

  // Get attendance for current semester enrollments
  const enrollmentIds = trainee.enrollments.map(e => e.id);
  const [totalRecords, presentCount, absentCount, lateCount, excusedCount] = await Promise.all([
    prisma.attendance.count({ where: { enrollmentId: { in: enrollmentIds } } }),
    prisma.attendance.count({ where: { enrollmentId: { in: enrollmentIds }, status: "PRESENT" } }),
    prisma.attendance.count({ where: { enrollmentId: { in: enrollmentIds }, status: "ABSENT" } }),
    prisma.attendance.count({ where: { enrollmentId: { in: enrollmentIds }, status: "LATE" } }),
    prisma.attendance.count({ where: { enrollmentId: { in: enrollmentIds }, status: "EXCUSED" } }),
  ]);

  const attendanceRate = totalRecords > 0
    ? Math.round(((presentCount + lateCount) / totalRecords) * 100 * 10) / 10
    : 0;

  // Get schedule
  const schedules = await prisma.schedule.findMany({
    where: {
      course: { enrollments: { some: { traineeId: trainee.id, semester: { isCurrent: true } } } },
      semester: { isCurrent: true },
    },
    include: { course: { select: { nameAr: true, nameEn: true } } },
  });

  return {
    trainee: {
      fullNameAr: trainee.fullNameAr,
      fullNameEn: trainee.fullNameEn,
      studentNumber: trainee.studentNumber,
      departmentNameAr: trainee.department.nameAr,
      departmentNameEn: trainee.department.nameEn,
      level: trainee.level,
      gpa: trainee.gpa,
      status: trainee.status,
    },
    enrollments: trainee.enrollments.map(e => ({
      courseNameAr: e.course.nameAr,
      courseNameEn: e.course.nameEn,
      courseCode: e.course.courseCode,
    })),
    grades: trainee.enrollments.map(e => {
      const grade = e.grade; // one-to-one relation (Grade? on Enrollment)
      return {
        courseNameAr: e.course.nameAr,
        courseNameEn: e.course.nameEn,
        courseCode: e.course.courseCode,
        midtermGrade: grade?.midtermGrade ?? null,
        finalGrade: grade?.finalGrade ?? null,
        assignmentsGrade: grade?.assignmentsGrade ?? null,
        totalGrade: grade?.totalGrade ?? null,
        letterGrade: grade?.letterGrade ?? null,
      };
    }),
    attendance: { totalRecords, presentCount, absentCount, lateCount, excusedCount, attendanceRate },
    schedule: schedules.map(s => ({
      courseNameAr: s.course.nameAr,
      courseNameEn: s.course.nameEn,
      dayOfWeek: s.dayOfWeek,
      startTime: s.startTime,
      endTime: s.endTime,
      room: s.room,
    })),
  };
}

export async function getTrainerScopedContext(userId: string): Promise<TrainerScopedContext | null> {
  const trainer = await prisma.trainer.findUnique({
    where: { userId },
    include: {
      department: { select: { nameAr: true, nameEn: true } },
      schedules: {
        where: { semester: { isCurrent: true } },
        include: {
          course: {
            select: {
              id: true, nameAr: true, nameEn: true, courseCode: true,
              enrollments: {
                where: { semester: { isCurrent: true } },
                select: { id: true },
              },
            },
          },
        },
      },
    },
  });

  if (!trainer) return null;

  // Build unique courses list from schedules
  const courseMap = new Map<string, { nameAr: string; nameEn: string; courseCode: string; enrollmentIds: string[] }>();
  for (const sched of trainer.schedules) {
    const c = sched.course;
    if (!courseMap.has(c.id)) {
      courseMap.set(c.id, {
        nameAr: c.nameAr,
        nameEn: c.nameEn,
        courseCode: c.courseCode,
        enrollmentIds: c.enrollments.map(e => e.id),
      });
    }
  }

  // For each course, get avg grade
  const courses = [];
  let totalStudents = 0;
  let totalAttendance = 0;
  let attendanceRecordCount = 0;

  for (const [, course] of courseMap) {
    const enrollmentIds = course.enrollmentIds;
    totalStudents += enrollmentIds.length;

    const gradeResult = await prisma.grade.aggregate({
      where: { enrollmentId: { in: enrollmentIds }, totalGrade: { not: null } },
      _avg: { totalGrade: true },
    });

    const [attTotal, attPresent, attLate] = await Promise.all([
      prisma.attendance.count({ where: { enrollmentId: { in: enrollmentIds } } }),
      prisma.attendance.count({ where: { enrollmentId: { in: enrollmentIds }, status: "PRESENT" } }),
      prisma.attendance.count({ where: { enrollmentId: { in: enrollmentIds }, status: "LATE" } }),
    ]);
    attendanceRecordCount += attTotal;
    totalAttendance += attPresent + attLate;

    courses.push({
      courseNameAr: course.nameAr,
      courseNameEn: course.nameEn,
      courseCode: course.courseCode,
      enrollmentCount: enrollmentIds.length,
      avgGrade: Math.round((gradeResult._avg.totalGrade ?? 0) * 10) / 10,
    });
  }

  // Get all trainee GPAs for this trainer's courses
  const allEnrollmentIds = Array.from(courseMap.values()).flatMap(c => c.enrollmentIds);
  const traineeIds = await prisma.enrollment.findMany({
    where: { id: { in: allEnrollmentIds } },
    select: { traineeId: true },
    distinct: ["traineeId"],
  });

  let avgGPA = 0;
  if (traineeIds.length > 0) {
    const gpaResult = await prisma.trainee.aggregate({
      where: { id: { in: traineeIds.map(t => t.traineeId) } },
      _avg: { gpa: true },
    });
    avgGPA = Math.round((gpaResult._avg.gpa ?? 0) * 100) / 100;
  }

  const schedule = trainer.schedules.map(s => ({
    courseNameAr: s.course.nameAr,
    courseNameEn: s.course.nameEn,
    dayOfWeek: s.dayOfWeek,
    startTime: s.startTime,
    endTime: s.endTime,
    room: s.room,
  }));

  return {
    trainer: {
      fullNameAr: trainer.fullNameAr,
      fullNameEn: trainer.fullNameEn,
      employeeNumber: trainer.employeeNumber,
      departmentNameAr: trainer.department.nameAr,
      departmentNameEn: trainer.department.nameEn,
      specialization: trainer.specialization,
    },
    courses,
    students: {
      total: totalStudents,
      avgAttendanceRate: attendanceRecordCount > 0
        ? Math.round((totalAttendance / attendanceRecordCount) * 100 * 10) / 10
        : 0,
      avgGPA,
    },
    schedule,
  };
}

export async function getDepartmentScopedContext(departmentId: string): Promise<DepartmentScopedContext | null> {
  const department = await prisma.department.findUnique({
    where: { id: departmentId },
    include: {
      head: { select: { nameAr: true, nameEn: true } },
      _count: { select: { trainees: true, trainers: true, courses: true } },
    },
  });

  if (!department) return null;

  const [activeTrainees, gpaResult] = await Promise.all([
    prisma.trainee.count({ where: { departmentId, status: "ACTIVE" } }),
    prisma.trainee.aggregate({
      where: { departmentId, status: "ACTIVE" },
      _avg: { gpa: true },
    }),
  ]);

  // Get department attendance
  const deptEnrollments = await prisma.enrollment.findMany({
    where: { trainee: { departmentId }, semester: { isCurrent: true } },
    select: { id: true },
  });
  const enrollmentIds = deptEnrollments.map(e => e.id);

  const [attTotal, attPresent, attLate, attAbsent] = await Promise.all([
    prisma.attendance.count({ where: { enrollmentId: { in: enrollmentIds } } }),
    prisma.attendance.count({ where: { enrollmentId: { in: enrollmentIds }, status: "PRESENT" } }),
    prisma.attendance.count({ where: { enrollmentId: { in: enrollmentIds }, status: "LATE" } }),
    prisma.attendance.count({ where: { enrollmentId: { in: enrollmentIds }, status: "ABSENT" } }),
  ]);

  // Success rate from grades
  const grades = await prisma.grade.findMany({
    where: { enrollment: { trainee: { departmentId } }, totalGrade: { not: null } },
    select: { totalGrade: true },
  });
  const passingGrades = grades.filter(g => g.totalGrade !== null && g.totalGrade >= 60).length;
  const successRate = grades.length > 0 ? Math.round((passingGrades / grades.length) * 100 * 10) / 10 : 0;

  // At-risk trainees (low GPA < 2.0)
  const atRiskTrainees = await prisma.trainee.findMany({
    where: {
      departmentId,
      status: "ACTIVE",
      OR: [
        { gpa: { lt: 2.0 } },
      ],
    },
    select: {
      fullNameAr: true,
      fullNameEn: true,
      studentNumber: true,
      gpa: true,
      level: true,
    },
    take: 20,
    orderBy: { gpa: "asc" },
  });

  return {
    department: {
      nameAr: department.nameAr,
      nameEn: department.nameEn,
      headNameAr: department.head?.nameAr ?? "",
      headNameEn: department.head?.nameEn ?? "",
    },
    academic: {
      traineeCount: department._count.trainees,
      activeTrainees,
      trainerCount: department._count.trainers,
      courseCount: department._count.courses,
      avgGPA: Math.round((gpaResult._avg.gpa ?? 0) * 100) / 100,
      successRate,
    },
    attendance: {
      attendanceRate: attTotal > 0 ? Math.round(((attPresent + attLate) / attTotal) * 100 * 10) / 10 : 0,
      totalRecords: attTotal,
      absentCount: attAbsent,
    },
    atRiskTrainees,
  };
}

/**
 * Get role-filtered data context based on user's role and identity
 */
export async function getRoleFilteredDataContext(
  role: string,
  userId: string,
  departmentId?: string
): Promise<RoleScopedContext> {
  switch (role) {
    case "trainee": {
      const traineeData = await getTraineePersonalContext(userId);
      return { role, trainee: traineeData ?? undefined };
    }

    case "trainer": {
      const trainerData = await getTrainerScopedContext(userId);
      return { role, trainer: trainerData ?? undefined };
    }

    case "dept_head": {
      if (!departmentId) {
        // Look up department from user
        const user = await prisma.department.findFirst({
          where: { headId: userId },
          select: { id: true },
        });
        departmentId = user?.id;
      }
      if (departmentId) {
        const deptData = await getDepartmentScopedContext(departmentId);
        // Also get limited full context for broader comparison
        const fullData = await getFullDataContext();
        return { role, department: deptData ?? undefined, full: fullData };
      }
      return { role, full: await getFullDataContext() };
    }

    case "accountant": {
      // Financial data + academic summary only
      const [financial, academic, departments] = await Promise.all([
        getFinancialOverview(),
        getAcademicOverview(),
        getDepartmentPerformance(),
      ]);
      return {
        role,
        full: {
          academic,
          attendance: { totalRecords: 0, presentCount: 0, absentCount: 0, lateCount: 0, excusedCount: 0, attendanceRate: 0 },
          financial,
          departments,
          quality: { totalKpis: 0, exceeds: 0, meets: 0, below: 0, critical: 0, avgAchievementRate: 0, openFindings: { critical: 0, major: 0, minor: 0, total: 0 }, improvementPlans: { total: 0, inProgress: 0, completed: 0, avgProgress: 0 }, accreditations: { active: 0, expired: 0, underRenewal: 0 } },
          tasks: { total: 0, todo: 0, inProgress: 0, inReview: 0, completed: 0, overdue: 0 },
          generatedAt: new Date().toISOString(),
        },
      };
    }

    case "quality_officer":
    case "vp_quality": {
      const [quality, academic, departments] = await Promise.all([
        getQualityOverview(),
        getAcademicOverview(),
        getDepartmentPerformance(),
      ]);
      return {
        role,
        full: {
          academic,
          attendance: { totalRecords: 0, presentCount: 0, absentCount: 0, lateCount: 0, excusedCount: 0, attendanceRate: 0 },
          financial: { totalIncome: 0, totalExpenses: 0, pendingTransactions: 0, approvedTransactions: 0, totalBudgetAllocated: 0, totalBudgetSpent: 0, budgetUtilization: 0 },
          departments,
          quality,
          tasks: { total: 0, todo: 0, inProgress: 0, inReview: 0, completed: 0, overdue: 0 },
          generatedAt: new Date().toISOString(),
        },
      };
    }

    // dean, super_admin, vp_trainers, vp_trainees → full access
    default: {
      const fullData = await getFullDataContext();
      return { role, full: fullData };
    }
  }
}
