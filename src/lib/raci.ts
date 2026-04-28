/**
 * RACI Matrix - Defines Responsible, Accountable, Consulted, Informed roles
 * for all critical platform processes.
 *
 * R = Responsible  (executes the task)
 * A = Accountable  (single owner; approves the output - exactly one per task)
 * C = Consulted    (provides input before/during)
 * I = Informed     (notified after completion)
 */

import { ROLES, type Role } from "@/lib/permissions";

export type RaciRole = "R" | "A" | "C" | "I";

export interface RaciEntry {
  process: string;
  processAr: string;
  module: string;
  moduleAr: string;
  assignments: Partial<Record<Role, RaciRole>>;
}

export const RACI_MATRIX: RaciEntry[] = [
  // ─────────────────────── USER MANAGEMENT ───────────────────────
  {
    process: "Create User Account",
    processAr: "إنشاء حساب مستخدم",
    module: "User Management",
    moduleAr: "إدارة المستخدمين",
    assignments: {
      [ROLES.IT_ADMIN]: "R",
      [ROLES.SUPER_ADMIN]: "A",
      [ROLES.HR_MANAGER]: "C",
      [ROLES.DEAN]: "I",
    },
  },
  {
    process: "Edit User Account",
    processAr: "تعديل حساب مستخدم",
    module: "User Management",
    moduleAr: "إدارة المستخدمين",
    assignments: {
      [ROLES.IT_ADMIN]: "R",
      [ROLES.SUPER_ADMIN]: "A",
      [ROLES.HR_MANAGER]: "C",
      [ROLES.DEAN]: "I",
    },
  },
  {
    process: "Delete / Suspend User Account",
    processAr: "حذف/تعليق حساب مستخدم",
    module: "User Management",
    moduleAr: "إدارة المستخدمين",
    assignments: {
      [ROLES.IT_ADMIN]: "R",
      [ROLES.SUPER_ADMIN]: "A",
      [ROLES.HR_MANAGER]: "C",
      [ROLES.DEAN]: "I",
    },
  },
  {
    process: "Assign / Change User Role",
    processAr: "تعيين/تغيير دور المستخدم",
    module: "User Management",
    moduleAr: "إدارة المستخدمين",
    assignments: {
      [ROLES.IT_ADMIN]: "R",
      [ROLES.SUPER_ADMIN]: "A",
      [ROLES.DEAN]: "C",
      [ROLES.HR_MANAGER]: "I",
    },
  },

  // ─────────────────────── ACCESS MANAGEMENT ───────────────────────
  {
    process: "Define Role Permissions",
    processAr: "تحديد صلاحيات الأدوار",
    module: "Access Management",
    moduleAr: "إدارة الصلاحيات",
    assignments: {
      [ROLES.IT_ADMIN]: "R",
      [ROLES.SUPER_ADMIN]: "A",
      [ROLES.DEAN]: "C",
      [ROLES.HR_MANAGER]: "I",
    },
  },
  {
    process: "Grant / Revoke Permissions",
    processAr: "منح/سحب الصلاحيات",
    module: "Access Management",
    moduleAr: "إدارة الصلاحيات",
    assignments: {
      [ROLES.IT_ADMIN]: "R",
      [ROLES.SUPER_ADMIN]: "A",
      [ROLES.DEAN]: "C",
      [ROLES.HR_MANAGER]: "C",
    },
  },
  {
    process: "Periodic RBAC Review",
    processAr: "المراجعة الدورية للصلاحيات",
    module: "Access Management",
    moduleAr: "إدارة الصلاحيات",
    assignments: {
      [ROLES.IT_ADMIN]: "R",
      [ROLES.SUPER_ADMIN]: "A",
      [ROLES.DEAN]: "C",
      [ROLES.HR_MANAGER]: "C",
      [ROLES.VP_QUALITY]: "I",
    },
  },

  // ─────────────────────── TRAINER MANAGEMENT ───────────────────────
  {
    process: "Hire / Register Trainer",
    processAr: "تسجيل مدرب جديد",
    module: "Trainer Management",
    moduleAr: "إدارة المدربين",
    assignments: {
      [ROLES.HR_MANAGER]: "R",
      [ROLES.VP_TRAINERS]: "A",
      [ROLES.DEPT_HEAD]: "C",
      [ROLES.DEAN]: "I",
    },
  },
  {
    process: "Evaluate Trainer Performance",
    processAr: "تقييم أداء المدرب",
    module: "Trainer Management",
    moduleAr: "إدارة المدربين",
    assignments: {
      [ROLES.DEPT_HEAD]: "R",
      [ROLES.VP_TRAINERS]: "A",
      [ROLES.HR_MANAGER]: "C",
      [ROLES.DEAN]: "I",
    },
  },

  // ─────────────────────── TRAINEE MANAGEMENT ───────────────────────
  {
    process: "Enroll Trainee",
    processAr: "تسجيل متدرب",
    module: "Trainee Management",
    moduleAr: "إدارة المتدربين",
    assignments: {
      [ROLES.UNIT_COORDINATOR]: "R",
      [ROLES.VP_TRAINEES]: "A",
      [ROLES.DEPT_HEAD]: "C",
      [ROLES.TRAINEE]: "I",
    },
  },
  {
    process: "Update Trainee Status",
    processAr: "تحديث حالة المتدرب",
    module: "Trainee Management",
    moduleAr: "إدارة المتدربين",
    assignments: {
      [ROLES.UNIT_COORDINATOR]: "R",
      [ROLES.VP_TRAINEES]: "A",
      [ROLES.DEPT_HEAD]: "C",
      [ROLES.HR_MANAGER]: "I",
    },
  },

  // ─────────────────────── CONTENT MANAGEMENT ───────────────────────
  {
    process: "Create Course",
    processAr: "إنشاء مقرر دراسي",
    module: "Content Management",
    moduleAr: "إدارة المحتوى",
    assignments: {
      [ROLES.DEPT_HEAD]: "R",
      [ROLES.VP_TRAINERS]: "A",
      [ROLES.TRAINER]: "C",
      [ROLES.VP_QUALITY]: "C",
      [ROLES.TRAINEE]: "I",
    },
  },
  {
    process: "Publish E-Learning Content",
    processAr: "نشر محتوى التعلم الإلكتروني",
    module: "Content Management",
    moduleAr: "إدارة المحتوى",
    assignments: {
      [ROLES.TRAINER]: "R",
      [ROLES.DEPT_HEAD]: "A",
      [ROLES.VP_TRAINEES]: "C",
      [ROLES.TRAINEE]: "I",
    },
  },

  // ─────────────────────── SCHEDULING ───────────────────────
  {
    process: "Create Training Schedule",
    processAr: "إنشاء جدول التدريب",
    module: "Scheduling",
    moduleAr: "الجدولة",
    assignments: {
      [ROLES.UNIT_COORDINATOR]: "R",
      [ROLES.VP_TRAINERS]: "A",
      [ROLES.DEPT_HEAD]: "C",
      [ROLES.TRAINER]: "I",
      [ROLES.TRAINEE]: "I",
    },
  },

  // ─────────────────────── GRADES ───────────────────────
  {
    process: "Submit Grades",
    processAr: "رفع الدرجات",
    module: "Grades",
    moduleAr: "الدرجات",
    assignments: {
      [ROLES.TRAINER]: "R",
      [ROLES.DEPT_HEAD]: "A",
      [ROLES.VP_TRAINERS]: "C",
      [ROLES.TRAINEE]: "I",
    },
  },
  {
    process: "Approve Grades",
    processAr: "اعتماد الدرجات",
    module: "Grades",
    moduleAr: "الدرجات",
    assignments: {
      [ROLES.DEPT_HEAD]: "R",
      [ROLES.VP_TRAINERS]: "A",
      [ROLES.DEAN]: "I",
      [ROLES.TRAINEE]: "I",
    },
  },

  // ─────────────────────── ATTENDANCE ───────────────────────
  {
    process: "Record Attendance",
    processAr: "تسجيل الحضور والغياب",
    module: "Attendance",
    moduleAr: "الحضور والغياب",
    assignments: {
      [ROLES.TRAINER]: "R",
      [ROLES.DEPT_HEAD]: "A",
      [ROLES.VP_TRAINEES]: "I",
    },
  },

  // ─────────────────────── FINANCE ───────────────────────
  {
    process: "Create Financial Transaction",
    processAr: "إنشاء معاملة مالية",
    module: "Finance",
    moduleAr: "المالية",
    assignments: {
      [ROLES.ACCOUNTANT]: "R",
      [ROLES.DEAN]: "A",
      [ROLES.VP_TRAINERS]: "C",
      [ROLES.VP_TRAINEES]: "C",
    },
  },
  {
    process: "Approve Financial Transaction",
    processAr: "اعتماد معاملة مالية",
    module: "Finance",
    moduleAr: "المالية",
    assignments: {
      [ROLES.DEAN]: "A",
      [ROLES.ACCOUNTANT]: "C",
    },
  },
  {
    process: "Generate Financial Report",
    processAr: "إنشاء تقرير مالي",
    module: "Finance",
    moduleAr: "المالية",
    assignments: {
      [ROLES.ACCOUNTANT]: "R",
      [ROLES.DEAN]: "A",
      [ROLES.VP_TRAINERS]: "I",
      [ROLES.VP_TRAINEES]: "I",
    },
  },

  // ─────────────────────── QUALITY ───────────────────────
  {
    process: "Conduct Quality Audit",
    processAr: "إجراء تدقيق الجودة",
    module: "Quality",
    moduleAr: "الجودة",
    assignments: {
      [ROLES.QUALITY_OFFICER]: "R",
      [ROLES.VP_QUALITY]: "A",
      [ROLES.DEPT_HEAD]: "C",
      [ROLES.DEAN]: "I",
    },
  },
  {
    process: "Approve Improvement Plan",
    processAr: "اعتماد خطة التحسين",
    module: "Quality",
    moduleAr: "الجودة",
    assignments: {
      [ROLES.VP_QUALITY]: "R",
      [ROLES.DEAN]: "A",
      [ROLES.QUALITY_OFFICER]: "C",
      [ROLES.DEPT_HEAD]: "I",
    },
  },
  {
    process: "Manage Accreditation",
    processAr: "إدارة الاعتماد",
    module: "Quality",
    moduleAr: "الجودة",
    assignments: {
      [ROLES.VP_QUALITY]: "R",
      [ROLES.DEAN]: "A",
      [ROLES.QUALITY_OFFICER]: "C",
      [ROLES.IT_ADMIN]: "C",
    },
  },

  // ─────────────────────── HR ───────────────────────
  {
    process: "Manage Leave Requests",
    processAr: "إدارة طلبات الإجازة",
    module: "HR",
    moduleAr: "الموارد البشرية",
    assignments: {
      [ROLES.HR_MANAGER]: "R",
      [ROLES.VP_TRAINERS]: "A",
      [ROLES.DEPT_HEAD]: "C",
      [ROLES.TRAINER]: "I",
    },
  },
  {
    process: "Manage Payroll",
    processAr: "إدارة الرواتب",
    module: "HR",
    moduleAr: "الموارد البشرية",
    assignments: {
      [ROLES.HR_MANAGER]: "R",
      [ROLES.DEAN]: "A",
      [ROLES.ACCOUNTANT]: "C",
    },
  },

  // ─────────────────────── REPORTS ───────────────────────
  {
    process: "Generate Platform Reports",
    processAr: "إنشاء تقارير المنصة",
    module: "Reports",
    moduleAr: "التقارير",
    assignments: {
      [ROLES.UNIT_COORDINATOR]: "R",
      [ROLES.DEAN]: "A",
      [ROLES.VP_TRAINERS]: "C",
      [ROLES.VP_TRAINEES]: "C",
      [ROLES.VP_QUALITY]: "I",
    },
  },
  {
    process: "Export Reports",
    processAr: "تصدير التقارير",
    module: "Reports",
    moduleAr: "التقارير",
    assignments: {
      [ROLES.UNIT_COORDINATOR]: "R",
      [ROLES.DEAN]: "A",
      [ROLES.IT_ADMIN]: "C",
    },
  },

  // ─────────────────────── SETTINGS ───────────────────────
  {
    process: "Configure Platform Settings",
    processAr: "ضبط إعدادات المنصة",
    module: "Settings",
    moduleAr: "الإعدادات",
    assignments: {
      [ROLES.IT_ADMIN]: "R",
      [ROLES.SUPER_ADMIN]: "A",
      [ROLES.DEAN]: "C",
    },
  },

  // ─────────────────────── NOTIFICATIONS ───────────────────────
  {
    process: "Broadcast Notifications",
    processAr: "إرسال الإشعارات الجماعية",
    module: "Notifications",
    moduleAr: "الإشعارات",
    assignments: {
      [ROLES.IT_ADMIN]: "R",
      [ROLES.DEAN]: "A",
      [ROLES.VP_TRAINERS]: "C",
      [ROLES.VP_TRAINEES]: "C",
    },
  },

  // ─────────────────────── AUDIT LOG ───────────────────────
  {
    process: "Review Audit Logs",
    processAr: "مراجعة سجلات التدقيق",
    module: "Audit",
    moduleAr: "التدقيق",
    assignments: {
      [ROLES.IT_ADMIN]: "R",
      [ROLES.SUPER_ADMIN]: "A",
      [ROLES.DEAN]: "C",
      [ROLES.VP_QUALITY]: "I",
    },
  },
];

/**
 * Returns all RACI entries for a given module.
 */
export function getRaciByModule(module: string): RaciEntry[] {
  return RACI_MATRIX.filter((e) => e.module === module);
}

/**
 * Returns all RACI entries where the given role has the specified RACI assignment.
 */
export function getRaciByRole(role: Role, raciRole?: RaciRole): RaciEntry[] {
  return RACI_MATRIX.filter((e) =>
    raciRole ? e.assignments[role] === raciRole : role in e.assignments
  );
}

/**
 * Returns the distinct list of modules in the RACI matrix.
 */
export function getRaciModules(): string[] {
  return [...new Set(RACI_MATRIX.map((e) => e.module))];
}
