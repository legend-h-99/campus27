// src/components/workflows/palette-blocks-data.ts
import type { PaletteBlock } from "./workflow-types";

export const PALETTE_BLOCKS: PaletteBlock[] = [
  {
    key: "trigger_plan_approved",
    type: "trigger",
    title: "بداية عند اعتماد الخطة",
    description: "يُطلق سير العمل عند اعتماد خطة الفصل التدريبي",
    iconName: "PlayCircle",
  },
  {
    key: "trigger_trainee_enrolled",
    type: "trigger",
    title: "بداية عند تسجيل متدرب",
    description: "يُطلق عند تسجيل متدرب جديد في البرنامج",
    iconName: "UserPlus",
  },
  {
    key: "action_update_schedules",
    type: "action",
    title: "تحديث جداول المتدربين",
    description: "إنشاء وربط الجداول بالبرامج والشعب",
    iconName: "Calendar",
  },
  {
    key: "action_notify_all",
    type: "action",
    title: "إشعار المتدربين والمدربين",
    description: "إرسال رسالة + بريد إلكتروني لجميع المعنيين",
    iconName: "Bell",
  },
  {
    key: "action_generate_report",
    type: "action",
    title: "توليد تقرير أداء",
    description: "إنشاء تقرير أداء تلقائي وإرساله للعميد",
    iconName: "FileText",
  },
  {
    key: "action_update_attendance",
    type: "action",
    title: "تحديث سجلات الحضور",
    description: "مزامنة سجلات الحضور مع الجداول المحدّثة",
    iconName: "ClipboardList",
  },
  {
    key: "action_alert_dean",
    type: "action",
    title: "إرسال تنبيه للعميد",
    description: "تنبيه فوري للعميد عند وجود حالة استثنائية",
    iconName: "AlertCircle",
  },
  {
    key: "condition_attendance",
    type: "condition",
    title: "شرط: نسبة الحضور < 75%",
    description: "تحقق من نسبة الحضور وتفرّع بناءً على النتيجة",
    iconName: "GitBranch",
  },
];

export const paletteBlockByKey = Object.fromEntries(
  PALETTE_BLOCKS.map((b) => [b.key, b])
) as Record<string, PaletteBlock>;
