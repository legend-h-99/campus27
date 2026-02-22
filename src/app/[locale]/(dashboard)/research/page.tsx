"use client";

import { useTranslations } from "next-intl";
import { PageHeader } from "@/components/shared/page-header";
import { StatCard } from "@/components/ui/stat-card";
import {
  FlaskConical,
  BookOpenCheck,
  Lightbulb,
  Award,
  Plus,
  Calendar,
  Users,
  ExternalLink,
  FileText,
  TrendingUp,
} from "lucide-react";

type ResearchStatus = "active" | "completed" | "under_review" | "published";

interface ResearchProject {
  id: string;
  title: string;
  principalInvestigator: string;
  department: string;
  coInvestigators: string[];
  startDate: string;
  endDate: string;
  status: ResearchStatus;
  fundingSource: string;
  budget: number;
  field: string;
  publications: number;
}

const researchProjects: ResearchProject[] = [
  {
    id: "RSH-001",
    title: "تطبيقات الذكاء الاصطناعي في التعليم التقني",
    principalInvestigator: "د. خالد السعيد",
    department: "قسم الحاسب الآلي",
    coInvestigators: ["د. نورة القحطاني", "م. فهد الدوسري"],
    startDate: "2023-09-01",
    endDate: "2024-08-31",
    status: "active",
    fundingSource: "صندوق البحث العلمي",
    budget: 180_000,
    field: "ذكاء اصطناعي",
    publications: 2,
  },
  {
    id: "RSH-002",
    title: "تحسين كفاءة الطاقة في المنشآت التعليمية",
    principalInvestigator: "م. سعد القحطاني",
    department: "قسم الكهرباء",
    coInvestigators: ["م. عبدالرحمن الغامدي"],
    startDate: "2023-06-01",
    endDate: "2024-05-31",
    status: "active",
    fundingSource: "المؤسسة العامة للتدريب",
    budget: 120_000,
    field: "طاقة متجددة",
    publications: 1,
  },
  {
    id: "RSH-003",
    title: "أثر التدريب التعاوني على جاهزية سوق العمل",
    principalInvestigator: "د. سارة العمري",
    department: "قسم إدارة الأعمال",
    coInvestigators: ["أ. محمد الشهري", "أ. فاطمة الزهراني"],
    startDate: "2023-01-01",
    endDate: "2023-12-31",
    status: "published",
    fundingSource: "ذاتي",
    budget: 50_000,
    field: "تعليم وتدريب",
    publications: 3,
  },
  {
    id: "RSH-004",
    title: "أمن إنترنت الأشياء في البيئات الصناعية",
    principalInvestigator: "م. عبدالرحمن الغامدي",
    department: "قسم الحاسب الآلي",
    coInvestigators: ["د. خالد السعيد"],
    startDate: "2024-01-01",
    endDate: "2024-12-31",
    status: "active",
    fundingSource: "شركة سابك",
    budget: 250_000,
    field: "أمن سيبراني",
    publications: 0,
  },
  {
    id: "RSH-005",
    title: "تطوير مواد تعليمية تفاعلية للتعليم الإلكتروني",
    principalInvestigator: "د. نورة القحطاني",
    department: "قسم الحاسب الآلي",
    coInvestigators: ["م. فهد الدوسري"],
    startDate: "2023-10-01",
    endDate: "2024-03-31",
    status: "under_review",
    fundingSource: "المؤسسة العامة للتدريب",
    budget: 80_000,
    field: "تعليم إلكتروني",
    publications: 1,
  },
];

const statusConfig: Record<ResearchStatus, { label: string; color: string; bgColor: string }> = {
  active: { label: "جاري", color: "text-teal-500", bgColor: "bg-teal-500/10" },
  completed: { label: "مكتمل", color: "text-teal-600", bgColor: "bg-teal-600/10" },
  under_review: { label: "قيد المراجعة", color: "text-amber-500", bgColor: "bg-amber-500/10" },
  published: { label: "منشور", color: "text-red-500", bgColor: "bg-red-500/10" },
};

export default function ResearchPage() {
  const t = useTranslations("nav");

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("ar-SA", {
      style: "currency",
      currency: "SAR",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const totalPublications = researchProjects.reduce((sum, p) => sum + p.publications, 0);
  const activeCount = researchProjects.filter((p) => p.status === "active").length;

  return (
    <div className="animate-fade-in space-y-4 md:space-y-6">
      <PageHeader
        title={t("research")}
        description="إدارة ومتابعة المشاريع البحثية والابتكارية"
        actions={
          <button className="flex items-center gap-2 rounded-lg bg-teal-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-teal-700 active:scale-[0.98]">
            <Plus className="h-4 w-4" />
            إضافة مشروع بحثي
          </button>
        }
      />

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3 md:gap-4 lg:grid-cols-4">
        <StatCard
          title="المشاريع البحثية"
          value={researchProjects.length}
          icon={FlaskConical}
          gradient="from-teal-600 to-teal-700"
        />
        <StatCard
          title="أبحاث نشطة"
          value={activeCount}
          icon={Lightbulb}
          gradient="from-teal-500 to-teal-600"
        />
        <StatCard
          title="الأبحاث المنشورة"
          value={totalPublications}
          icon={BookOpenCheck}
          trend={{ value: 15, isPositive: true }}
          gradient="from-amber-500 to-amber-600"
        />
        <StatCard
          title="براءات اختراع"
          value="2"
          icon={Award}
          gradient="from-red-500 to-red-600"
        />
      </div>

      {/* Research Project Cards */}
      <div className="space-y-3 md:space-y-4">
        {researchProjects.map((project) => {
          const status = statusConfig[project.status];
          return (
            <div
              key={project.id}
              className="glass-card rounded-xl p-4 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 md:p-6"
            >
              <div className="flex flex-col gap-3 md:gap-4 lg:flex-row lg:items-start lg:justify-between">
                {/* Main Info */}
                <div className="flex-1">
                  <div className="mb-2 flex flex-wrap items-center gap-2">
                    <span className="text-xs font-medium text-muted">{project.id}</span>
                    <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${status.bgColor} ${status.color}`}>
                      {status.label}
                    </span>
                    <span className="rounded-full bg-teal-600/10 px-2.5 py-0.5 text-xs font-medium text-teal-600">
                      {project.field}
                    </span>
                  </div>
                  <h3 className="mb-2 text-base font-semibold text-foreground">{project.title}</h3>

                  <div className="mb-3 grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
                    <div className="flex items-center gap-2 text-sm text-muted">
                      <Users className="h-4 w-4 shrink-0" />
                      <span>الباحث الرئيسي: {project.principalInvestigator}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted">
                      <Calendar className="h-4 w-4 shrink-0" />
                      <span>{project.startDate} - {project.endDate}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted">
                      <FileText className="h-4 w-4 shrink-0" />
                      <span>{project.department}</span>
                    </div>
                  </div>

                  {/* Co-investigators */}
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs text-muted">الباحثون المشاركون:</span>
                    {project.coInvestigators.map((ci) => (
                      <span
                        key={ci}
                        className="rounded-full bg-background px-2.5 py-0.5 text-xs text-foreground"
                      >
                        {ci}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Side Info */}
                <div className="flex flex-row gap-3 lg:flex-col lg:items-end">
                  <div className="rounded-lg bg-background p-3 text-center">
                    <p className="text-xs text-muted">التمويل</p>
                    <p className="text-sm font-bold text-teal-600">{formatCurrency(project.budget)}</p>
                    <p className="text-xs text-muted">{project.fundingSource}</p>
                  </div>
                  <div className="rounded-lg bg-background p-3 text-center">
                    <p className="text-xs text-muted">المنشورات</p>
                    <p className="text-lg font-bold text-foreground">{project.publications}</p>
                  </div>
                  {project.status === "published" && (
                    <button className="flex items-center gap-1 rounded-lg border border-teal-600 px-3 py-2 text-xs font-medium text-teal-600 transition-colors hover:bg-teal-600/5 active:scale-[0.98]">
                      <ExternalLink className="h-3.5 w-3.5" />
                      عرض البحث
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Research Stats Summary */}
      <div className="grid grid-cols-1 gap-4 md:gap-6 lg:grid-cols-2">
        <div className="glass-card rounded-xl p-4 shadow-sm md:p-6">
          <h3 className="mb-3 flex items-center gap-2 text-base font-semibold text-foreground md:mb-4 md:text-lg">
            <TrendingUp className="h-5 w-5 text-teal-600" />
            توزيع الأبحاث حسب المجال
          </h3>
          <div className="space-y-3">
            {[
              { field: "ذكاء اصطناعي", count: 3, color: "bg-teal-600" },
              { field: "أمن سيبراني", count: 2, color: "bg-red-500" },
              { field: "تعليم وتدريب", count: 4, color: "bg-teal-500" },
              { field: "طاقة متجددة", count: 1, color: "bg-amber-500" },
              { field: "تعليم إلكتروني", count: 2, color: "bg-aqua-600" },
            ].map((item) => (
              <div key={item.field} className="flex items-center gap-3">
                <div className={`h-3 w-3 rounded-full ${item.color}`} />
                <span className="flex-1 text-sm text-foreground">{item.field}</span>
                <span className="text-sm font-bold text-foreground">{item.count}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="glass-card rounded-xl p-4 shadow-sm md:p-6">
          <h3 className="mb-3 flex items-center gap-2 text-base font-semibold text-foreground md:mb-4 md:text-lg">
            <Award className="h-5 w-5 text-teal-600" />
            إنجازات بحثية بارزة
          </h3>
          <div className="space-y-3">
            {[
              { text: "نشر 7 أبحاث في مجلات محكمة دوليا", date: "2024" },
              { text: "الحصول على براءة اختراع في مجال IoT", date: "2023" },
              { text: "المشاركة في 3 مؤتمرات دولية", date: "2024" },
              { text: "توقيع اتفاقية بحثية مع جامعة الملك سعود", date: "2024" },
            ].map((achievement, i) => (
              <div key={i} className="flex items-start gap-3 rounded-lg bg-background p-3">
                <div className="mt-0.5 h-2 w-2 shrink-0 rounded-full bg-teal-500" />
                <div>
                  <p className="text-sm text-foreground">{achievement.text}</p>
                  <p className="text-xs text-muted">{achievement.date}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
