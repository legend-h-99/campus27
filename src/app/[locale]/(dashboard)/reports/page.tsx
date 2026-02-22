"use client";

import { useTranslations } from "next-intl";
import { PageHeader } from "@/components/shared/page-header";
import { StatCard } from "@/components/ui/stat-card";
import {
  FileBarChart,
  Download,
  Eye,
  Calendar,
  FileText,
  PieChart,
  BarChart3,
  TrendingUp,
  Users,
  DollarSign,
  GraduationCap,
  ClipboardCheck,
  BookOpen,
  Building2,
  Filter,
} from "lucide-react";

interface Report {
  id: string;
  title: string;
  description: string;
  category: string;
  icon: typeof FileText;
  iconColor: string;
  iconBg: string;
  lastGenerated: string;
  frequency: string;
  format: string;
}

const reports: Report[] = [
  {
    id: "RPT-001",
    title: "التقرير الأكاديمي الفصلي",
    description: "تقرير شامل عن الأداء الأكاديمي ومعدلات النجاح والرسوب والحضور",
    category: "أكاديمي",
    icon: GraduationCap,
    iconColor: "text-teal-600",
    iconBg: "bg-teal-600/10",
    lastGenerated: "2024-01-15",
    frequency: "فصلي",
    format: "PDF",
  },
  {
    id: "RPT-002",
    title: "التقرير المالي الشهري",
    description: "ملخص المصروفات والإيرادات وتوزيع الميزانية حسب الأقسام",
    category: "مالي",
    icon: DollarSign,
    iconColor: "text-teal-500",
    iconBg: "bg-teal-500/10",
    lastGenerated: "2024-01-28",
    frequency: "شهري",
    format: "Excel",
  },
  {
    id: "RPT-003",
    title: "تقرير مؤشرات الجودة",
    description: "متابعة مؤشرات الأداء الرئيسية ومدى تحقيق المستهدفات",
    category: "جودة",
    icon: ClipboardCheck,
    iconColor: "text-amber-500",
    iconBg: "bg-amber-500/10",
    lastGenerated: "2024-01-20",
    frequency: "ربع سنوي",
    format: "PDF",
  },
  {
    id: "RPT-004",
    title: "تقرير الحضور والغياب",
    description: "إحصائيات الحضور والغياب للمدربين والمتدربين",
    category: "أكاديمي",
    icon: Users,
    iconColor: "text-red-500",
    iconBg: "bg-red-500/10",
    lastGenerated: "2024-01-30",
    frequency: "أسبوعي",
    format: "Excel",
  },
  {
    id: "RPT-005",
    title: "تقرير المشاريع والإنجازات",
    description: "ملخص تقدم المشاريع التطويرية والإنجازات المحققة",
    category: "إداري",
    icon: BarChart3,
    iconColor: "text-aqua-600",
    iconBg: "bg-aqua-600/10",
    lastGenerated: "2024-01-25",
    frequency: "شهري",
    format: "PDF",
  },
  {
    id: "RPT-006",
    title: "تقرير الموارد البشرية",
    description: "إحصائيات الموظفين والإجازات والتقييمات والتطوير المهني",
    category: "موارد بشرية",
    icon: Users,
    iconColor: "text-teal-600",
    iconBg: "bg-teal-600/10",
    lastGenerated: "2024-01-22",
    frequency: "شهري",
    format: "PDF",
  },
  {
    id: "RPT-007",
    title: "تقرير التعليم الإلكتروني",
    description: "إحصائيات المقررات الإلكترونية ومعدلات الإكمال والتفاعل",
    category: "أكاديمي",
    icon: BookOpen,
    iconColor: "text-teal-500",
    iconBg: "bg-teal-500/10",
    lastGenerated: "2024-01-18",
    frequency: "شهري",
    format: "PDF",
  },
  {
    id: "RPT-008",
    title: "تقرير الأقسام التفصيلي",
    description: "تقرير مفصل عن أداء كل قسم يشمل المدربين والمتدربين والمقررات",
    category: "إداري",
    icon: Building2,
    iconColor: "text-amber-500",
    iconBg: "bg-amber-500/10",
    lastGenerated: "2024-01-10",
    frequency: "فصلي",
    format: "PDF",
  },
  {
    id: "RPT-009",
    title: "تقرير خدمة المجتمع",
    description: "ملخص البرامج المجتمعية وعدد المستفيدين والمتطوعين",
    category: "مجتمعي",
    icon: TrendingUp,
    iconColor: "text-red-500",
    iconBg: "bg-red-500/10",
    lastGenerated: "2024-01-05",
    frequency: "فصلي",
    format: "PDF",
  },
];

const categories = ["الكل", "أكاديمي", "مالي", "جودة", "إداري", "موارد بشرية", "مجتمعي"];

export default function ReportsPage() {
  const t = useTranslations("nav");

  return (
    <div className="animate-fade-in space-y-4 md:space-y-6">
      <PageHeader
        title={t("reports")}
        description="إنشاء وعرض التقارير التحليلية والإحصائية"
        actions={
          <div className="flex gap-2">
            <button className="flex items-center gap-2 rounded-lg border border-border bg-white px-4 py-2 text-sm font-medium text-foreground transition-all duration-200 active:scale-[0.98] hover:bg-background">
              <Filter className="h-4 w-4" />
              تصفية
            </button>
            <button className="flex items-center gap-2 rounded-lg bg-teal-600 px-4 py-2 text-sm font-medium text-white transition-all duration-200 active:scale-[0.98] hover:bg-teal-700">
              <FileBarChart className="h-4 w-4" />
              إنشاء تقرير مخصص
            </button>
          </div>
        }
      />

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3 md:gap-4 lg:grid-cols-4">
        <StatCard
          title="إجمالي التقارير"
          value={reports.length}
          icon={FileText}
          gradient="from-teal-600 to-teal-700"
        />
        <StatCard
          title="تم تنزيلها هذا الشهر"
          value="47"
          icon={Download}
          trend={{ value: 8, isPositive: true }}
          gradient="from-teal-500 to-teal-600"
        />
        <StatCard
          title="تقارير مجدولة"
          value="12"
          icon={Calendar}
          gradient="from-amber-500 to-amber-600"
        />
        <StatCard
          title="تقارير مخصصة"
          value="5"
          icon={PieChart}
          gradient="from-red-500 to-red-600"
        />
      </div>

      {/* Category Filter */}
      <div className="flex flex-wrap gap-2">
        {categories.map((cat) => (
          <button
            key={cat}
            className={`rounded-full px-3 py-1.5 text-sm font-medium transition-all duration-200 active:scale-[0.98] md:px-4 ${
              cat === "الكل"
                ? "bg-teal-600 text-white"
                : "bg-white text-foreground border border-border hover:bg-background"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Report Cards */}
      <div className="grid grid-cols-1 gap-3 md:gap-4 lg:grid-cols-2 xl:grid-cols-3">
        {reports.map((report) => {
          const ReportIcon = report.icon;
          return (
            <div
              key={report.id}
              className="glass-card group rounded-xl p-4 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 md:p-5"
            >
              <div className="mb-4 flex items-start justify-between">
                <div className={`rounded-xl p-3 ${report.iconBg}`}>
                  <ReportIcon className={`h-6 w-6 ${report.iconColor}`} />
                </div>
                <div className="flex items-center gap-1">
                  <span className="rounded-full bg-background px-2.5 py-0.5 text-xs font-medium text-muted">
                    {report.format}
                  </span>
                  <span className="rounded-full bg-background px-2.5 py-0.5 text-xs font-medium text-muted">
                    {report.frequency}
                  </span>
                </div>
              </div>

              <h4 className="mb-1 text-sm font-semibold text-foreground">{report.title}</h4>
              <p className="mb-4 text-xs leading-relaxed text-muted">{report.description}</p>

              <div className="mb-4 flex items-center gap-2 text-xs text-muted">
                <Calendar className="h-3.5 w-3.5" />
                <span>آخر إنشاء: {report.lastGenerated}</span>
              </div>

              {/* Actions */}
              <div className="flex gap-2 border-t border-border pt-4">
                <button className="flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-border py-2 text-xs font-medium text-foreground transition-all duration-200 active:scale-[0.98] hover:bg-background">
                  <Eye className="h-3.5 w-3.5" />
                  عرض
                </button>
                <button className="flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-teal-600 py-2 text-xs font-medium text-white transition-all duration-200 active:scale-[0.98] hover:bg-teal-700">
                  <Download className="h-3.5 w-3.5" />
                  تنزيل
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
