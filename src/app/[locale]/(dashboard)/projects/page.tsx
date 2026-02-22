"use client";

import { useTranslations } from "next-intl";
import { PageHeader } from "@/components/shared/page-header";
import { StatCard } from "@/components/ui/stat-card";
import {
  FolderKanban,
  Plus,
  Calendar,
  DollarSign,
  Users,
  Clock,
  CheckCircle2,
  AlertTriangle,
  BarChart3,
} from "lucide-react";

type ProjectStatus = "active" | "completed" | "on_hold" | "planning";

interface Project {
  id: string;
  name: string;
  manager: string;
  department: string;
  startDate: string;
  endDate: string;
  budget: number;
  spent: number;
  progress: number;
  status: ProjectStatus;
  teamSize: number;
}

const projects: Project[] = [
  {
    id: "PRJ-001",
    name: "تطوير منصة التعليم الإلكتروني",
    manager: "م. فهد الدوسري",
    department: "قسم الحاسب الآلي",
    startDate: "2024-01-01",
    endDate: "2024-06-30",
    budget: 750_000,
    spent: 320_000,
    progress: 45,
    status: "active",
    teamSize: 8,
  },
  {
    id: "PRJ-002",
    name: "تجهيز مختبرات الذكاء الاصطناعي",
    manager: "د. خالد السعيد",
    department: "قسم الحاسب الآلي",
    startDate: "2023-09-01",
    endDate: "2024-03-31",
    budget: 1_200_000,
    spent: 980_000,
    progress: 82,
    status: "active",
    teamSize: 5,
  },
  {
    id: "PRJ-003",
    name: "برنامج التدريب التعاوني مع أرامكو",
    manager: "د. سارة العمري",
    department: "وكالة التدريب",
    startDate: "2023-06-01",
    endDate: "2024-01-31",
    budget: 500_000,
    spent: 500_000,
    progress: 100,
    status: "completed",
    teamSize: 12,
  },
  {
    id: "PRJ-004",
    name: "تحديث البنية التحتية للشبكات",
    manager: "م. عبدالرحمن الغامدي",
    department: "إدارة تقنية المعلومات",
    startDate: "2024-02-01",
    endDate: "2024-08-31",
    budget: 2_000_000,
    spent: 150_000,
    progress: 10,
    status: "planning",
    teamSize: 6,
  },
  {
    id: "PRJ-005",
    name: "مشروع التميز المؤسسي",
    manager: "د. نورة القحطاني",
    department: "إدارة الجودة",
    startDate: "2023-10-01",
    endDate: "2024-09-30",
    budget: 350_000,
    spent: 180_000,
    progress: 55,
    status: "active",
    teamSize: 4,
  },
  {
    id: "PRJ-006",
    name: "إنشاء مركز الابتكار وريادة الأعمال",
    manager: "أ. نورة العتيبي",
    department: "وكالة التطوير",
    startDate: "2024-01-15",
    endDate: "2024-12-31",
    budget: 3_500_000,
    spent: 200_000,
    progress: 8,
    status: "on_hold",
    teamSize: 10,
  },
];

const statusConfig: Record<ProjectStatus, { label: string; color: string; bgColor: string }> = {
  active: { label: "نشط", color: "text-teal-500", bgColor: "bg-teal-500/10" },
  completed: { label: "مكتمل", color: "text-teal-600", bgColor: "bg-teal-600/10" },
  on_hold: { label: "متوقف", color: "text-red-500", bgColor: "bg-red-500/10" },
  planning: { label: "تخطيط", color: "text-amber-500", bgColor: "bg-amber-500/10" },
};

export default function ProjectsPage() {
  const t = useTranslations("projects");

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("ar-SA", {
      style: "currency",
      currency: "SAR",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const activeCount = projects.filter((p) => p.status === "active").length;
  const completedCount = projects.filter((p) => p.status === "completed").length;
  const totalBudget = projects.reduce((sum, p) => sum + p.budget, 0);

  return (
    <div className="animate-fade-in space-y-4 md:space-y-6">
      <PageHeader
        title={t("title")}
        description="متابعة وإدارة المشاريع التطويرية والتشغيلية"
        actions={
          <button className="flex items-center gap-2 rounded-lg bg-teal-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-teal-700 active:scale-[0.98]">
            <Plus className="h-4 w-4" />
            {t("addProject")}
          </button>
        }
      />

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3 md:gap-4 lg:grid-cols-4">
        <StatCard
          title="إجمالي المشاريع"
          value={projects.length}
          icon={FolderKanban}
          gradient="from-teal-600 to-teal-700"
        />
        <StatCard
          title="مشاريع نشطة"
          value={activeCount}
          icon={BarChart3}
          gradient="from-teal-500 to-teal-700"
        />
        <StatCard
          title="مشاريع مكتملة"
          value={completedCount}
          icon={CheckCircle2}
          gradient="from-amber-500 to-amber-600"
        />
        <StatCard
          title="إجمالي الميزانيات"
          value={formatCurrency(totalBudget)}
          icon={DollarSign}
          gradient="from-red-500 to-red-600"
        />
      </div>

      {/* Project Cards */}
      <div className="grid grid-cols-1 gap-4 md:gap-6 lg:grid-cols-2">
        {projects.map((project) => {
          const status = statusConfig[project.status];
          const budgetUsage = Math.round((project.spent / project.budget) * 100);
          const budgetColor =
            budgetUsage > 90 ? "bg-red-500" : budgetUsage > 70 ? "bg-amber-500" : "bg-teal-500";
          const progressColor =
            project.progress === 100
              ? "bg-teal-500"
              : project.progress >= 50
                ? "bg-teal-600"
                : "bg-amber-500";

          return (
            <div
              key={project.id}
              className="glass-card p-4 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 md:p-6"
            >
              {/* Header */}
              <div className="mb-3 flex items-start justify-between md:mb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-medium text-muted">{project.id}</span>
                    <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${status.bgColor} ${status.color}`}>
                      {status.label}
                    </span>
                  </div>
                  <h3 className="mt-1 text-base font-semibold text-foreground">{project.name}</h3>
                </div>
                {project.status === "on_hold" && (
                  <AlertTriangle className="h-5 w-5 text-red-500" />
                )}
              </div>

              {/* Info */}
              <div className="mb-3 grid grid-cols-1 gap-2 xs:grid-cols-2 md:mb-4 md:gap-3">
                <div className="flex items-center gap-2 text-sm text-muted">
                  <Users className="h-4 w-4" />
                  <span>{t("manager")}: {project.manager}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted">
                  <Users className="h-4 w-4" />
                  <span>الفريق: {project.teamSize} أعضاء</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted">
                  <Calendar className="h-4 w-4" />
                  <span>{t("startDate")}: {project.startDate}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted">
                  <Clock className="h-4 w-4" />
                  <span>{t("endDate")}: {project.endDate}</span>
                </div>
              </div>

              {/* Progress */}
              <div className="mb-3">
                <div className="mb-1 flex items-center justify-between">
                  <span className="text-sm font-medium text-foreground">{t("progress")}</span>
                  <span className="text-sm font-bold text-foreground">{project.progress}%</span>
                </div>
                <div className="h-2.5 w-full rounded-full bg-background">
                  <div
                    className={`h-2.5 rounded-full ${progressColor} transition-all duration-500`}
                    style={{ width: `${project.progress}%` }}
                  />
                </div>
              </div>

              {/* Budget */}
              <div className="rounded-lg bg-background p-3">
                <div className="mb-1 flex items-center justify-between">
                  <span className="flex items-center gap-1.5 text-sm text-muted">
                    <DollarSign className="h-3.5 w-3.5" />
                    {t("budget")}
                  </span>
                  <span className="text-sm text-muted">{budgetUsage}% مستخدم</span>
                </div>
                <div className="mb-2 h-1.5 w-full rounded-full bg-border">
                  <div
                    className={`h-1.5 rounded-full ${budgetColor} transition-all duration-500`}
                    style={{ width: `${budgetUsage}%` }}
                  />
                </div>
                <div className="flex justify-between text-xs text-muted">
                  <span>المصروف: {formatCurrency(project.spent)}</span>
                  <span>الإجمالي: {formatCurrency(project.budget)}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
