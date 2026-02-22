"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { PageHeader } from "@/components/shared/page-header";
import { StatCard } from "@/components/ui/stat-card";
import {
  ListTodo,
  Clock,
  CheckCircle2,
  Plus,
  Calendar,
  User,
  Flag,
  LayoutGrid,
  List,
} from "lucide-react";

type Priority = "high" | "medium" | "low";
type TaskStatus = "todo" | "in_progress" | "completed";

interface Task {
  id: string;
  title: string;
  description: string;
  assignedTo: string;
  assignedBy: string;
  priority: Priority;
  dueDate: string;
  status: TaskStatus;
}

const tasks: Task[] = [
  {
    id: "TSK-001",
    title: "إعداد تقرير الجودة الفصلي",
    description: "تجميع بيانات مؤشرات الأداء وإعداد التقرير الفصلي للجودة",
    assignedTo: "د. خالد السعيد",
    assignedBy: "العميد",
    priority: "high",
    dueDate: "2024-02-15",
    status: "in_progress",
  },
  {
    id: "TSK-002",
    title: "تحديث خطة الطوارئ",
    description: "مراجعة وتحديث خطة الإخلاء والطوارئ للمباني",
    assignedTo: "م. سعد القحطاني",
    assignedBy: "العميد",
    priority: "high",
    dueDate: "2024-02-10",
    status: "todo",
  },
  {
    id: "TSK-003",
    title: "جرد المستودع السنوي",
    description: "إجراء الجرد السنوي لمستودع المعدات والأجهزة",
    assignedTo: "أ. محمد الشهري",
    assignedBy: "مدير الشؤون المالية",
    priority: "medium",
    dueDate: "2024-02-20",
    status: "todo",
  },
  {
    id: "TSK-004",
    title: "تنظيم ورشة عمل التطوير المهني",
    description: "إعداد وتنظيم ورشة عمل لتطوير مهارات المدربين",
    assignedTo: "د. سارة العمري",
    assignedBy: "وكيل التدريب",
    priority: "medium",
    dueDate: "2024-02-18",
    status: "in_progress",
  },
  {
    id: "TSK-005",
    title: "مراجعة المناهج الدراسية",
    description: "مراجعة وتحديث محتوى المقررات لتتوافق مع متطلبات السوق",
    assignedTo: "د. نورة القحطاني",
    assignedBy: "وكيل التدريب",
    priority: "low",
    dueDate: "2024-03-01",
    status: "todo",
  },
  {
    id: "TSK-006",
    title: "إعداد تقرير الحضور الشهري",
    description: "تجميع بيانات الحضور والغياب للموظفين",
    assignedTo: "أ. فاطمة الزهراني",
    assignedBy: "مدير الموارد البشرية",
    priority: "medium",
    dueDate: "2024-01-31",
    status: "completed",
  },
  {
    id: "TSK-007",
    title: "صيانة أجهزة المختبرات",
    description: "الصيانة الدورية لأجهزة مختبرات الحاسب والشبكات",
    assignedTo: "م. عبدالرحمن الغامدي",
    assignedBy: "مدير الدعم الفني",
    priority: "high",
    dueDate: "2024-02-05",
    status: "completed",
  },
  {
    id: "TSK-008",
    title: "تنسيق زيارة هيئة الاعتماد",
    description: "التحضير والتنسيق لزيارة فريق الاعتماد الأكاديمي",
    assignedTo: "د. خالد السعيد",
    assignedBy: "العميد",
    priority: "high",
    dueDate: "2024-02-28",
    status: "in_progress",
  },
  {
    id: "TSK-009",
    title: "إعداد ميزانية الفصل القادم",
    description: "تقدير المصروفات وإعداد الميزانية التشغيلية",
    assignedTo: "أ. نورة العتيبي",
    assignedBy: "مدير الشؤون المالية",
    priority: "medium",
    dueDate: "2024-02-12",
    status: "completed",
  },
];

const priorityConfig: Record<Priority, { label: string; color: string; bgColor: string }> = {
  high: { label: "عالية", color: "text-red-500", bgColor: "bg-red-500/10" },
  medium: { label: "متوسطة", color: "text-amber-500", bgColor: "bg-amber-500/10" },
  low: { label: "منخفضة", color: "text-teal-500", bgColor: "bg-teal-500/10" },
};

const statusColumns: { key: TaskStatus; label: string; color: string; borderColor: string }[] = [
  { key: "todo", label: "للتنفيذ", color: "bg-red-500", borderColor: "border-t-red-500" },
  { key: "in_progress", label: "قيد التنفيذ", color: "bg-amber-500", borderColor: "border-t-amber-500" },
  { key: "completed", label: "مكتملة", color: "bg-teal-500", borderColor: "border-t-teal-500" },
];

export default function TasksPage() {
  const t = useTranslations("tasks");
  const [viewMode, setViewMode] = useState<"kanban" | "list">("kanban");

  const todoTasks = tasks.filter((task) => task.status === "todo");
  const inProgressTasks = tasks.filter((task) => task.status === "in_progress");
  const completedTasks = tasks.filter((task) => task.status === "completed");

  const getColumnTasks = (status: TaskStatus) => {
    switch (status) {
      case "todo": return todoTasks;
      case "in_progress": return inProgressTasks;
      case "completed": return completedTasks;
    }
  };

  return (
    <div className="animate-fade-in space-y-4 md:space-y-6">
      <PageHeader
        title={t("title")}
        description="متابعة وإدارة المهام والأعمال المسندة"
        actions={
          <div className="flex gap-2">
            <div className="flex rounded-lg border border-border bg-white">
              <button
                onClick={() => setViewMode("kanban")}
                aria-label="عرض كانبان"
                aria-pressed={viewMode === "kanban"}
                className={`flex items-center gap-1.5 rounded-s-lg px-3 py-2 text-sm transition-all duration-200 ${
                  viewMode === "kanban" ? "bg-teal-600 text-white" : "text-foreground"
                }`}
              >
                <LayoutGrid className="h-4 w-4" />
                {t("kanban")}
              </button>
              <button
                onClick={() => setViewMode("list")}
                aria-label="عرض قائمة"
                aria-pressed={viewMode === "list"}
                className={`flex items-center gap-1.5 rounded-e-lg px-3 py-2 text-sm transition-all duration-200 ${
                  viewMode === "list" ? "bg-teal-600 text-white" : "text-foreground"
                }`}
              >
                <List className="h-4 w-4" />
                {t("list")}
              </button>
            </div>
            <button aria-label="إضافة مهمة جديدة" className="flex items-center gap-2 rounded-lg bg-teal-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-teal-700 active:scale-[0.98]">
              <Plus className="h-4 w-4" />
              {t("addTask")}
            </button>
          </div>
        }
      />

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3 md:gap-4 lg:grid-cols-4">
        <StatCard
          title="إجمالي المهام"
          value={tasks.length}
          icon={ListTodo}
          gradient="from-teal-600 to-teal-800"
        />
        <StatCard
          title={t("todo")}
          value={todoTasks.length}
          icon={Clock}
          gradient="from-red-500 to-red-700"
        />
        <StatCard
          title={t("inProgress")}
          value={inProgressTasks.length}
          icon={Clock}
          gradient="from-amber-500 to-amber-600"
        />
        <StatCard
          title={t("completed")}
          value={completedTasks.length}
          icon={CheckCircle2}
          gradient="from-teal-500 to-teal-700"
        />
      </div>

      {/* Kanban Board */}
      {viewMode === "kanban" ? (
        <div className="grid grid-cols-1 gap-4 md:gap-6 md:grid-cols-3">
          {statusColumns.map((column) => {
            const columnTasks = getColumnTasks(column.key);
            return (
              <div key={column.key} role="region" aria-label={`عمود ${column.label}`} className="space-y-3">
                {/* Column Header */}
                <div className={`rounded-t-xl border-t-4 glass-card p-3 shadow-sm md:p-4 ${column.borderColor}`}>
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-semibold text-foreground">{column.label}</h3>
                    <span className={`flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold text-white ${column.color}`}>
                      {columnTasks.length}
                    </span>
                  </div>
                </div>

                {/* Task Cards */}
                <div className="space-y-3">
                  {columnTasks.map((task) => {
                    const priority = priorityConfig[task.priority];
                    return (
                      <div
                        key={task.id}
                        role="article"
                        aria-label={`مهمة: ${task.title}`}
                        className="rounded-xl glass-card p-4 shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 cursor-pointer"
                      >
                        <div className="mb-2 flex items-start justify-between">
                          <span className="text-xs text-muted">{task.id}</span>
                          <span className={`flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ${priority.bgColor} ${priority.color}`}>
                            <Flag className="h-3 w-3" />
                            {priority.label}
                          </span>
                        </div>
                        <h4 className="mb-1 text-sm font-semibold text-foreground">{task.title}</h4>
                        <p className="mb-3 text-xs text-muted leading-relaxed">{task.description}</p>
                        <div className="flex items-center justify-between border-t border-border pt-3">
                          <div className="flex items-center gap-1.5 text-xs text-muted">
                            <User className="h-3 w-3" />
                            {task.assignedTo}
                          </div>
                          <div className="flex items-center gap-1.5 text-xs text-muted">
                            <Calendar className="h-3 w-3" />
                            {task.dueDate}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* List View */
        <div className="rounded-xl glass-card p-4 shadow-sm md:p-6">
          <div className="overflow-x-auto">
            <table className="min-w-[600px] w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="px-3 py-3 text-start text-sm font-semibold text-muted md:px-4">الرقم</th>
                  <th className="px-4 py-3 text-start text-sm font-semibold text-muted">{t("taskTitle")}</th>
                  <th className="px-4 py-3 text-start text-sm font-semibold text-muted">{t("assignedTo")}</th>
                  <th className="px-4 py-3 text-start text-sm font-semibold text-muted">{t("priority")}</th>
                  <th className="px-4 py-3 text-start text-sm font-semibold text-muted">{t("dueDate")}</th>
                  <th className="px-4 py-3 text-start text-sm font-semibold text-muted">الحالة</th>
                </tr>
              </thead>
              <tbody>
                {tasks.map((task) => {
                  const priority = priorityConfig[task.priority];
                  const statusLabel = task.status === "todo" ? t("todo") : task.status === "in_progress" ? t("inProgress") : t("completed");
                  const statusColor = task.status === "completed" ? "bg-teal-500/10 text-teal-500" : task.status === "in_progress" ? "bg-amber-500/10 text-amber-500" : "bg-red-500/10 text-red-500";

                  return (
                    <tr key={task.id} className="border-b border-border last:border-0 hover:bg-background/50 transition-colors duration-200">
                      <td className="px-4 py-3 text-sm font-medium text-foreground">{task.id}</td>
                      <td className="px-4 py-3 text-sm text-foreground">{task.title}</td>
                      <td className="px-4 py-3 text-sm text-muted">{task.assignedTo}</td>
                      <td className="px-4 py-3">
                        <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${priority.bgColor} ${priority.color}`}>
                          {priority.label}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-muted">{task.dueDate}</td>
                      <td className="px-4 py-3">
                        <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${statusColor}`}>
                          {statusLabel}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
