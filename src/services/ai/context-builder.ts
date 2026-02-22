/**
 * RAG Context Builder
 * بانٍ سياق الاسترجاع المعزز (RAG)
 *
 * Builds relevant context for the AI chatbot based on:
 * - User's role and permissions
 * - Current data from the database
 * - User's query intent
 */

import { getFullDataContext, contextToText, getRoleFilteredDataContext } from "./data-aggregator";
import type { FullDataContext, RoleScopedContext, TraineePersonalContext, TrainerScopedContext, DepartmentScopedContext } from "./data-aggregator";
import { getChatSystemPrompt, getRoleSpecificInstructions } from "./prompt-templates";
import { aiCache } from "./cache";
import { AI_CONFIG } from "@/lib/ai-config";

// ═══ Types ═══

export interface ChatContext {
  systemPrompt: string;
  dataContext: string;
  rawData: FullDataContext;
}

export interface ContextOptions {
  userName: string;
  userRole: string;
  locale: string;
  departmentId?: string;
  userId?: string;
}

// ═══ Context Building ═══

/**
 * Build the complete chat context for a user
 * Includes system prompt with embedded data context
 * Uses role-filtered data for non-admin roles
 */
export async function buildChatContext(
  options: ContextOptions
): Promise<ChatContext> {
  const isAr = options.locale === "ar";
  const fullAccessRoles = ["dean", "super_admin", "vp_trainers", "vp_trainees"];

  let dataContext: string;
  let rawData: FullDataContext;
  let roleAlerts = "";

  if (options.userId && !fullAccessRoles.includes(options.userRole)) {
    // Role-scoped data
    const scopedCtx = await getRoleFilteredDataContext(options.userRole, options.userId, options.departmentId);
    roleAlerts = buildRoleAlerts(options.userRole, scopedCtx, isAr);

    if (scopedCtx.trainee) {
      dataContext = traineeContextToText(scopedCtx.trainee, isAr);
      rawData = scopedCtx.full ?? await getFullDataContext();
    } else if (scopedCtx.trainer) {
      dataContext = trainerContextToText(scopedCtx.trainer, isAr);
      rawData = scopedCtx.full ?? await getFullDataContext();
    } else if (scopedCtx.department) {
      dataContext = deptHeadContextToText(scopedCtx.department, scopedCtx.full, isAr);
      rawData = scopedCtx.full ?? await getFullDataContext();
    } else if (scopedCtx.full) {
      dataContext = contextToText(scopedCtx.full, options.locale);
      rawData = scopedCtx.full;
    } else {
      rawData = await getFullDataContext();
      dataContext = contextToText(rawData, options.locale);
    }
  } else {
    // Full access
    rawData = await getFullDataContext();
    dataContext = contextToText(rawData, options.locale);
    const scopedCtx: RoleScopedContext = { role: options.userRole, full: rawData };
    roleAlerts = buildRoleAlerts(options.userRole, scopedCtx, isAr);
  }

  // Add role alerts to context
  if (roleAlerts) {
    dataContext += roleAlerts;
  }

  // Get role-specific instructions
  const roleInstructions = getRoleSpecificInstructions(options.userRole, isAr);

  // Build the system prompt with data context
  const systemPrompt = getChatSystemPrompt({
    userName: options.userName,
    userRole: getRoleLabel(options.userRole, options.locale),
    locale: options.locale,
    dataContext,
    roleInstructions,
  });

  return {
    systemPrompt,
    dataContext,
    rawData,
  };
}

/**
 * Build a scoped context for specific data domains
 * Useful for insights and recommendations that focus on specific areas
 */
export async function buildScopedContext(
  scope: "academic" | "financial" | "quality" | "tasks",
  locale: string
): Promise<string> {
  const cacheKey = `context:${scope}:${locale}`;

  return aiCache.getOrCompute(
    cacheKey,
    async () => {
      const fullData = await getFullDataContext();
      const isAr = locale === "ar";

      switch (scope) {
        case "academic":
          return buildAcademicContext(fullData, isAr);
        case "financial":
          return buildFinancialContext(fullData, isAr);
        case "quality":
          return buildQualityContext(fullData, isAr);
        case "tasks":
          return buildTasksContext(fullData, isAr);
        default:
          return contextToText(fullData, locale);
      }
    },
    AI_CONFIG.cacheTtlMinutes
  );
}

// ═══ Scoped Context Builders ═══

function buildAcademicContext(data: FullDataContext, isAr: boolean): string {
  const { academic, attendance, departments } = data;

  if (isAr) {
    const deptLines = departments
      .map(
        (d) =>
          `| ${d.nameAr} | ${d.traineeCount} | ${d.trainerCount} | ${d.courseCount} | ${d.avgGPA} |`
      )
      .join("\n");

    return `
## البيانات الأكاديمية

### ملخص عام:
- إجمالي المتدربين: ${academic.totalTrainees} (نشط: ${academic.activeTrainees})
- إجمالي المدربين: ${academic.totalTrainers} (نشط: ${academic.activeTrainers})
- المقررات النشطة: ${academic.totalCourses}
- متوسط المعدل التراكمي: ${academic.avgGPA}
- معدل النجاح: ${academic.successRate}%

### الحضور:
- معدل الحضور العام: ${attendance.attendanceRate}%
- حاضر: ${attendance.presentCount} | غائب: ${attendance.absentCount}

### أداء الأقسام:
| القسم | المتدربون | المدربون | المقررات | المعدل |
|-------|----------|---------|---------|--------|
${deptLines}
`.trim();
  }

  const deptLines = departments
    .map(
      (d) =>
        `| ${d.nameEn} | ${d.traineeCount} | ${d.trainerCount} | ${d.courseCount} | ${d.avgGPA} |`
    )
    .join("\n");

  return `
## Academic Data

### Overview:
- Total Trainees: ${academic.totalTrainees} (Active: ${academic.activeTrainees})
- Total Trainers: ${academic.totalTrainers} (Active: ${academic.activeTrainers})
- Active Courses: ${academic.totalCourses}
- Average GPA: ${academic.avgGPA}
- Success Rate: ${academic.successRate}%

### Attendance:
- Overall Rate: ${attendance.attendanceRate}%
- Present: ${attendance.presentCount} | Absent: ${attendance.absentCount}

### Department Performance:
| Department | Trainees | Trainers | Courses | Avg GPA |
|-----------|----------|----------|---------|---------|
${deptLines}
`.trim();
}

function buildFinancialContext(data: FullDataContext, isAr: boolean): string {
  const { financial } = data;

  if (isAr) {
    return `
## البيانات المالية

- إجمالي الإيرادات: ${financial.totalIncome.toLocaleString("ar-SA")} ريال
- إجمالي المصروفات: ${financial.totalExpenses.toLocaleString("ar-SA")} ريال
- الميزانية المخصصة: ${financial.totalBudgetAllocated.toLocaleString("ar-SA")} ريال
- الميزانية المنفقة: ${financial.totalBudgetSpent.toLocaleString("ar-SA")} ريال
- نسبة الاستهلاك: ${financial.budgetUtilization}%
- معاملات معلقة: ${financial.pendingTransactions}
- معاملات معتمدة: ${financial.approvedTransactions}
`.trim();
  }

  return `
## Financial Data

- Total Income: ${financial.totalIncome.toLocaleString("en-US")} SAR
- Total Expenses: ${financial.totalExpenses.toLocaleString("en-US")} SAR
- Budget Allocated: ${financial.totalBudgetAllocated.toLocaleString("en-US")} SAR
- Budget Spent: ${financial.totalBudgetSpent.toLocaleString("en-US")} SAR
- Utilization: ${financial.budgetUtilization}%
- Pending Transactions: ${financial.pendingTransactions}
- Approved Transactions: ${financial.approvedTransactions}
`.trim();
}

function buildQualityContext(data: FullDataContext, isAr: boolean): string {
  const { quality } = data;

  if (isAr) {
    return `
## بيانات الجودة

### مؤشرات الأداء:
- إجمالي المؤشرات: ${quality.totalKpis}
- متفوق: ${quality.exceeds} | محقق: ${quality.meets} | دون المستهدف: ${quality.below} | حرج: ${quality.critical}
- متوسط نسبة الإنجاز: ${quality.avgAchievementRate}%

### ملاحظات التدقيق المفتوحة:
- حرجة: ${quality.openFindings.critical} | رئيسية: ${quality.openFindings.major} | فرعية: ${quality.openFindings.minor}
- الإجمالي: ${quality.openFindings.total}

### خطط التحسين:
- الإجمالي: ${quality.improvementPlans.total} | قيد التنفيذ: ${quality.improvementPlans.inProgress} | مكتمل: ${quality.improvementPlans.completed}
- متوسط التقدم: ${quality.improvementPlans.avgProgress}%

### الاعتمادات:
- نشطة: ${quality.accreditations.active} | منتهية: ${quality.accreditations.expired} | قيد التجديد: ${quality.accreditations.underRenewal}
`.trim();
  }

  return `
## Quality Data

### KPI Performance:
- Total KPIs: ${quality.totalKpis}
- Exceeds: ${quality.exceeds} | Meets: ${quality.meets} | Below: ${quality.below} | Critical: ${quality.critical}
- Avg Achievement Rate: ${quality.avgAchievementRate}%

### Open Audit Findings:
- Critical: ${quality.openFindings.critical} | Major: ${quality.openFindings.major} | Minor: ${quality.openFindings.minor}
- Total: ${quality.openFindings.total}

### Improvement Plans:
- Total: ${quality.improvementPlans.total} | In Progress: ${quality.improvementPlans.inProgress} | Completed: ${quality.improvementPlans.completed}
- Avg Progress: ${quality.improvementPlans.avgProgress}%

### Accreditations:
- Active: ${quality.accreditations.active} | Expired: ${quality.accreditations.expired} | Under Renewal: ${quality.accreditations.underRenewal}
`.trim();
}

function buildTasksContext(data: FullDataContext, isAr: boolean): string {
  const { tasks } = data;

  if (isAr) {
    return `
## بيانات المهام

- إجمالي المهام: ${tasks.total}
- قيد الانتظار: ${tasks.todo}
- قيد التنفيذ: ${tasks.inProgress}
- قيد المراجعة: ${tasks.inReview}
- مكتمل: ${tasks.completed}
- متأخر: ${tasks.overdue}
`.trim();
  }

  return `
## Tasks Data

- Total Tasks: ${tasks.total}
- To Do: ${tasks.todo}
- In Progress: ${tasks.inProgress}
- In Review: ${tasks.inReview}
- Completed: ${tasks.completed}
- Overdue: ${tasks.overdue}
`.trim();
}

// ═══ Role-Scoped Context Text Builders ═══

function traineeContextToText(ctx: TraineePersonalContext, isAr: boolean): string {
  if (isAr) {
    const gradesLines = ctx.grades.map(g =>
      `  - ${g.courseNameAr} (${g.courseCode}): أعمال ${g.assignmentsGrade ?? '-'} | اختبار نصفي ${g.midtermGrade ?? '-'} | نهائي ${g.finalGrade ?? '-'} | المجموع ${g.totalGrade ?? '-'} | التقدير ${g.letterGrade ?? '-'}`
    ).join('\n');

    const scheduleLines = ctx.schedule.map(s =>
      `  - ${s.courseNameAr}: ${s.dayOfWeek} ${s.startTime}-${s.endTime} (${s.room ?? 'غير محدد'})`
    ).join('\n');

    return `### بياناتك الشخصية:
- الاسم: ${ctx.trainee.fullNameAr}
- الرقم التدريبي: ${ctx.trainee.studentNumber}
- القسم: ${ctx.trainee.departmentNameAr}
- المستوى: ${ctx.trainee.level}
- المعدل التراكمي: ${ctx.trainee.gpa}
- الحالة: ${ctx.trainee.status}

### الحضور:
- إجمالي السجلات: ${ctx.attendance.totalRecords}
- حاضر: ${ctx.attendance.presentCount} | غائب: ${ctx.attendance.absentCount} | متأخر: ${ctx.attendance.lateCount} | معذور: ${ctx.attendance.excusedCount}
- نسبة الحضور: ${ctx.attendance.attendanceRate}%

### الدرجات:
${gradesLines || '  لا توجد درجات مسجلة حالياً'}

### الجدول الأسبوعي:
${scheduleLines || '  لا يوجد جدول مسجل حالياً'}`;
  }

  const gradesLines = ctx.grades.map(g =>
    `  - ${g.courseNameEn} (${g.courseCode}): Assignments ${g.assignmentsGrade ?? '-'} | Midterm ${g.midtermGrade ?? '-'} | Final ${g.finalGrade ?? '-'} | Total ${g.totalGrade ?? '-'} | Grade ${g.letterGrade ?? '-'}`
  ).join('\n');

  const scheduleLines = ctx.schedule.map(s =>
    `  - ${s.courseNameEn}: ${s.dayOfWeek} ${s.startTime}-${s.endTime} (${s.room ?? 'TBD'})`
  ).join('\n');

  return `### Your Personal Data:
- Name: ${ctx.trainee.fullNameEn}
- Student Number: ${ctx.trainee.studentNumber}
- Department: ${ctx.trainee.departmentNameEn}
- Level: ${ctx.trainee.level}
- GPA: ${ctx.trainee.gpa}
- Status: ${ctx.trainee.status}

### Attendance:
- Total Records: ${ctx.attendance.totalRecords}
- Present: ${ctx.attendance.presentCount} | Absent: ${ctx.attendance.absentCount} | Late: ${ctx.attendance.lateCount} | Excused: ${ctx.attendance.excusedCount}
- Attendance Rate: ${ctx.attendance.attendanceRate}%

### Grades:
${gradesLines || '  No grades recorded yet'}

### Weekly Schedule:
${scheduleLines || '  No schedule recorded yet'}`;
}

function trainerContextToText(ctx: TrainerScopedContext, isAr: boolean): string {
  if (isAr) {
    const courseLines = ctx.courses.map(c =>
      `  - ${c.courseNameAr} (${c.courseCode}): ${c.enrollmentCount} متدرب | متوسط الدرجة ${c.avgGrade}`
    ).join('\n');

    const scheduleLines = ctx.schedule.map(s =>
      `  - ${s.courseNameAr}: ${s.dayOfWeek} ${s.startTime}-${s.endTime} (${s.room ?? 'غير محدد'})`
    ).join('\n');

    return `### بياناتك:
- الاسم: ${ctx.trainer.fullNameAr}
- الرقم الوظيفي: ${ctx.trainer.employeeNumber}
- القسم: ${ctx.trainer.departmentNameAr}
- التخصص: ${ctx.trainer.specialization ?? 'غير محدد'}

### المقررات التي تدرسها:
${courseLines || '  لا توجد مقررات مسندة حالياً'}

### إحصائيات الطلاب:
- إجمالي الطلاب: ${ctx.students.total}
- متوسط الحضور: ${ctx.students.avgAttendanceRate}%
- متوسط المعدل: ${ctx.students.avgGPA}

### الجدول الأسبوعي:
${scheduleLines || '  لا يوجد جدول مسجل حالياً'}`;
  }

  const courseLines = ctx.courses.map(c =>
    `  - ${c.courseNameEn} (${c.courseCode}): ${c.enrollmentCount} students | Avg Grade ${c.avgGrade}`
  ).join('\n');

  const scheduleLines = ctx.schedule.map(s =>
    `  - ${s.courseNameEn}: ${s.dayOfWeek} ${s.startTime}-${s.endTime} (${s.room ?? 'TBD'})`
  ).join('\n');

  return `### Your Data:
- Name: ${ctx.trainer.fullNameEn}
- Employee Number: ${ctx.trainer.employeeNumber}
- Department: ${ctx.trainer.departmentNameEn}
- Specialization: ${ctx.trainer.specialization ?? 'Not specified'}

### Your Courses:
${courseLines || '  No courses assigned yet'}

### Student Statistics:
- Total Students: ${ctx.students.total}
- Avg Attendance: ${ctx.students.avgAttendanceRate}%
- Avg GPA: ${ctx.students.avgGPA}

### Weekly Schedule:
${scheduleLines || '  No schedule recorded yet'}`;
}

function deptHeadContextToText(ctx: DepartmentScopedContext, fullData: FullDataContext | undefined, isAr: boolean): string {
  if (isAr) {
    const atRiskLines = ctx.atRiskTrainees.slice(0, 10).map(t =>
      `  - ${t.fullNameAr} (${t.studentNumber}): المعدل ${t.gpa} | المستوى ${t.level}`
    ).join('\n');

    let text = `### بيانات القسم: ${ctx.department.nameAr}
- رئيس القسم: ${ctx.department.headNameAr}
- المتدربون: ${ctx.academic.traineeCount} (نشط: ${ctx.academic.activeTrainees})
- المدربون: ${ctx.academic.trainerCount}
- المقررات: ${ctx.academic.courseCount}
- متوسط المعدل: ${ctx.academic.avgGPA}
- معدل النجاح: ${ctx.academic.successRate}%

### الحضور:
- نسبة الحضور: ${ctx.attendance.attendanceRate}%
- سجلات الغياب: ${ctx.attendance.absentCount}

### المتدربون المعرضون للخطر (معدل < 2.0):
${atRiskLines || '  لا يوجد متدربون معرضون للخطر'}`;

    if (fullData) {
      text += `\n\n### مقارنة مع الأقسام الأخرى:`;
      fullData.departments.forEach(d => {
        text += `\n  - ${d.nameAr}: ${d.traineeCount} متدرب | معدل ${d.avgGPA}`;
      });
    }

    return text;
  }

  const atRiskLines = ctx.atRiskTrainees.slice(0, 10).map(t =>
    `  - ${t.fullNameEn} (${t.studentNumber}): GPA ${t.gpa} | Level ${t.level}`
  ).join('\n');

  let text = `### Department: ${ctx.department.nameEn}
- Head: ${ctx.department.headNameEn}
- Trainees: ${ctx.academic.traineeCount} (Active: ${ctx.academic.activeTrainees})
- Trainers: ${ctx.academic.trainerCount}
- Courses: ${ctx.academic.courseCount}
- Average GPA: ${ctx.academic.avgGPA}
- Success Rate: ${ctx.academic.successRate}%

### Attendance:
- Rate: ${ctx.attendance.attendanceRate}%
- Absence Records: ${ctx.attendance.absentCount}

### At-Risk Trainees (GPA < 2.0):
${atRiskLines || '  No at-risk trainees'}`;

  if (fullData) {
    text += `\n\n### Comparison with Other Departments:`;
    fullData.departments.forEach(d => {
      text += `\n  - ${d.nameEn}: ${d.traineeCount} trainees | GPA ${d.avgGPA}`;
    });
  }

  return text;
}

// ═══ Role Alerts ═══

function buildRoleAlerts(role: string, scopedCtx: RoleScopedContext, isAr: boolean): string {
  const alerts: string[] = [];

  if (scopedCtx.trainee) {
    const t = scopedCtx.trainee;
    if (t.attendance.attendanceRate < 80) {
      alerts.push(isAr
        ? `⚠️ نسبة حضورك ${t.attendance.attendanceRate}% أقل من الحد المطلوب (80%). تحتاج لتحسين حضورك.`
        : `⚠️ Your attendance rate ${t.attendance.attendanceRate}% is below the required minimum (80%).`);
    }
    if (t.trainee.gpa < 2.0) {
      alerts.push(isAr
        ? `⚠️ معدلك التراكمي ${t.trainee.gpa} أقل من الحد الأدنى (2.0). يُنصح بمراجعة مرشدك الأكاديمي.`
        : `⚠️ Your GPA ${t.trainee.gpa} is below the minimum (2.0). Consider meeting with your academic advisor.`);
    }
    const failingGrades = t.grades.filter(g => g.totalGrade !== null && g.totalGrade < 60);
    if (failingGrades.length > 0) {
      alerts.push(isAr
        ? `⚠️ لديك ${failingGrades.length} مقرر(ات) بدرجة أقل من 60. راجع درجاتك بعناية.`
        : `⚠️ You have ${failingGrades.length} course(s) with grades below 60. Review your grades carefully.`);
    }
  }

  if (scopedCtx.department) {
    const d = scopedCtx.department;
    if (d.atRiskTrainees.length > 0) {
      alerts.push(isAr
        ? `⚠️ يوجد ${d.atRiskTrainees.length} متدرب معرض للخطر في قسمك (معدل أقل من 2.0).`
        : `⚠️ ${d.atRiskTrainees.length} at-risk trainees in your department (GPA below 2.0).`);
    }
    if (d.attendance.attendanceRate < 85) {
      alerts.push(isAr
        ? `⚠️ نسبة حضور القسم ${d.attendance.attendanceRate}% أقل من الهدف (85%).`
        : `⚠️ Department attendance rate ${d.attendance.attendanceRate}% is below target (85%).`);
    }
  }

  if (scopedCtx.full) {
    const f = scopedCtx.full;
    if ((role === 'dean' || role === 'super_admin') && f.quality.accreditations.expired > 0) {
      alerts.push(isAr
        ? `🔴 يوجد ${f.quality.accreditations.expired} اعتماد منتهي الصلاحية يحتاج تجديد عاجل.`
        : `🔴 ${f.quality.accreditations.expired} expired accreditation(s) need urgent renewal.`);
    }
    if ((role === 'dean' || role === 'super_admin') && f.quality.openFindings.critical > 0) {
      alerts.push(isAr
        ? `🔴 يوجد ${f.quality.openFindings.critical} ملاحظة تدقيق حرجة مفتوحة.`
        : `🔴 ${f.quality.openFindings.critical} critical audit finding(s) are open.`);
    }
    if ((role === 'dean' || role === 'super_admin') && f.financial.budgetUtilization > 90) {
      alerts.push(isAr
        ? `⚠️ نسبة استهلاك الميزانية ${f.financial.budgetUtilization}% - قاربت على النفاد.`
        : `⚠️ Budget utilization at ${f.financial.budgetUtilization}% - nearing exhaustion.`);
    }
  }

  if (alerts.length === 0) return '';

  const header = isAr ? '\n\n### 🚨 تنبيهات:' : '\n\n### 🚨 Alerts:';
  return header + '\n' + alerts.join('\n');
}

// ═══ Helpers ═══

function getRoleLabel(role: string, locale: string): string {
  const isAr = locale === "ar";
  const roleLabels: Record<string, { ar: string; en: string }> = {
    super_admin: { ar: "المشرف العام", en: "Super Admin" },
    dean: { ar: "العميد", en: "Dean" },
    vp_trainers: { ar: "وكيل شؤون المدربين", en: "VP of Trainers" },
    vp_trainees: { ar: "وكيل شؤون المتدربين", en: "VP of Trainees" },
    vp_quality: { ar: "وكيل الجودة", en: "VP of Quality" },
    dept_head: { ar: "رئيس القسم", en: "Department Head" },
    trainer: { ar: "مدرب", en: "Trainer" },
    trainee: { ar: "متدرب", en: "Trainee" },
    accountant: { ar: "محاسب", en: "Accountant" },
    quality_officer: { ar: "مسؤول الجودة", en: "Quality Officer" },
    hr_manager: { ar: "مدير الموارد البشرية", en: "HR Manager" },
    it_admin: { ar: "مدير تقنية المعلومات", en: "IT Admin" },
    unit_coordinator: { ar: "منسق الوحدة", en: "Unit Coordinator" },
  };

  const labels = roleLabels[role] || { ar: role, en: role };
  return isAr ? labels.ar : labels.en;
}
