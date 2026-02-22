"use client";

import { useTranslations } from "next-intl";
import { PageHeader } from "@/components/shared/page-header";
import { StatCard } from "@/components/ui/stat-card";
import {
  Heart,
  Users,
  Calendar,
  MapPin,
  Clock,
  Plus,
  Target,
  HandHeart,
  GraduationCap,
  Wrench,
} from "lucide-react";

type ProgramStatus = "active" | "completed" | "upcoming";

interface CommunityProgram {
  id: string;
  name: string;
  description: string;
  category: string;
  coordinator: string;
  location: string;
  startDate: string;
  endDate: string;
  beneficiaries: number;
  volunteers: number;
  status: ProgramStatus;
  icon: typeof Heart;
}

const programs: CommunityProgram[] = [
  {
    id: "COM-001",
    name: "صيانة أجهزة الحاسب للمدارس",
    description: "برنامج تطوعي لصيانة وتجهيز معامل الحاسب في المدارس المحتاجة",
    category: "تقنية",
    coordinator: "م. فهد الدوسري",
    location: "مدارس المنطقة الشرقية",
    startDate: "2024-01-15",
    endDate: "2024-03-15",
    beneficiaries: 350,
    volunteers: 25,
    status: "active",
    icon: Wrench,
  },
  {
    id: "COM-002",
    name: "دورات محو الأمية الرقمية",
    description: "تعليم أساسيات استخدام الحاسب والإنترنت لكبار السن",
    category: "تعليم",
    coordinator: "د. سارة العمري",
    location: "مركز الحي النموذجي",
    startDate: "2024-02-01",
    endDate: "2024-04-30",
    beneficiaries: 80,
    volunteers: 12,
    status: "active",
    icon: GraduationCap,
  },
  {
    id: "COM-003",
    name: "حملة التبرع بالدم",
    description: "حملة سنوية للتبرع بالدم بالتعاون مع بنك الدم",
    category: "صحة",
    coordinator: "أ. محمد الشهري",
    location: "الكلية التقنية",
    startDate: "2024-03-01",
    endDate: "2024-03-03",
    beneficiaries: 200,
    volunteers: 30,
    status: "upcoming",
    icon: Heart,
  },
  {
    id: "COM-004",
    name: "تأهيل الشباب لسوق العمل",
    description: "برنامج تدريبي مجاني لتأهيل الشباب بالمهارات التقنية المطلوبة",
    category: "تدريب",
    coordinator: "د. خالد السعيد",
    location: "الكلية التقنية",
    startDate: "2023-10-01",
    endDate: "2024-01-31",
    beneficiaries: 120,
    volunteers: 15,
    status: "completed",
    icon: Target,
  },
  {
    id: "COM-005",
    name: "صيانة المنازل لذوي الاحتياجات",
    description: "صيانة التمديدات الكهربائية والسباكة للأسر المحتاجة",
    category: "خدمات",
    coordinator: "م. سعد القحطاني",
    location: "أحياء متفرقة",
    startDate: "2024-01-01",
    endDate: "2024-06-30",
    beneficiaries: 45,
    volunteers: 20,
    status: "active",
    icon: HandHeart,
  },
  {
    id: "COM-006",
    name: "معرض التوعية بالأمن السيبراني",
    description: "توعية المجتمع بمخاطر الجرائم الإلكترونية وطرق الحماية",
    category: "توعية",
    coordinator: "م. عبدالرحمن الغامدي",
    location: "مول الظهران",
    startDate: "2024-02-15",
    endDate: "2024-02-17",
    beneficiaries: 500,
    volunteers: 18,
    status: "upcoming",
    icon: Target,
  },
];

const statusConfig: Record<ProgramStatus, { label: string; color: string; bgColor: string }> = {
  active: { label: "قائم", color: "text-teal-500", bgColor: "bg-teal-500/10" },
  completed: { label: "مكتمل", color: "text-teal-600", bgColor: "bg-teal-600/10" },
  upcoming: { label: "قادم", color: "text-amber-500", bgColor: "bg-amber-500/10" },
};

export default function CommunityPage() {
  const t = useTranslations("nav");

  const totalBeneficiaries = programs.reduce((sum, p) => sum + p.beneficiaries, 0);
  const totalVolunteers = programs.reduce((sum, p) => sum + p.volunteers, 0);
  const activeCount = programs.filter((p) => p.status === "active").length;

  return (
    <div className="animate-fade-in space-y-4 md:space-y-6">
      <PageHeader
        title={t("community")}
        description="برامج ومبادرات خدمة المجتمع والمسؤولية الاجتماعية"
        actions={
          <button className="flex items-center gap-2 rounded-lg bg-teal-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-teal-700 active:scale-[0.98]">
            <Plus className="h-4 w-4" />
            إضافة برنامج
          </button>
        }
      />

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3 md:gap-4 lg:grid-cols-4">
        <StatCard
          title="البرامج المجتمعية"
          value={programs.length}
          icon={Heart}
          gradient="from-teal-600 to-teal-700"
        />
        <StatCard
          title="البرامج النشطة"
          value={activeCount}
          icon={Target}
          gradient="from-teal-500 to-teal-700"
        />
        <StatCard
          title="إجمالي المستفيدين"
          value={totalBeneficiaries.toLocaleString("ar-SA")}
          icon={Users}
          trend={{ value: 22, isPositive: true }}
          gradient="from-amber-500 to-amber-600"
        />
        <StatCard
          title="المتطوعون"
          value={totalVolunteers}
          icon={HandHeart}
          gradient="from-rose-500 to-rose-700"
        />
      </div>

      {/* Program Cards */}
      <div className="grid grid-cols-1 gap-4 md:gap-5 lg:grid-cols-2 xl:grid-cols-3">
        {programs.map((program) => {
          const status = statusConfig[program.status];
          const ProgramIcon = program.icon;

          return (
            <div
              key={program.id}
              className="glass-card rounded-xl p-4 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 md:p-6"
            >
              {/* Header */}
              <div className="mb-4 flex items-start justify-between">
                <div className="rounded-xl bg-teal-600/10 p-3">
                  <ProgramIcon className="h-6 w-6 text-teal-600" />
                </div>
                <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${status.bgColor} ${status.color}`}>
                  {status.label}
                </span>
              </div>

              {/* Content */}
              <h4 className="mb-1 text-base font-semibold text-foreground">{program.name}</h4>
              <p className="mb-4 text-xs leading-relaxed text-muted">{program.description}</p>

              {/* Details */}
              <div className="mb-4 space-y-2">
                <div className="flex items-center gap-2 text-sm text-muted">
                  <Users className="h-4 w-4 shrink-0 text-teal-600" />
                  <span>المنسق: {program.coordinator}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted">
                  <MapPin className="h-4 w-4 shrink-0 text-teal-600" />
                  <span>{program.location}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted">
                  <Calendar className="h-4 w-4 shrink-0 text-teal-600" />
                  <span>{program.startDate} - {program.endDate}</span>
                </div>
              </div>

              {/* Stats */}
              <div className="flex items-center justify-between border-t border-border pt-4">
                <div className="text-center">
                  <p className="text-lg font-bold text-teal-600">{program.beneficiaries}</p>
                  <p className="text-xs text-muted">مستفيد</p>
                </div>
                <div className="h-8 w-px bg-slate-200" />
                <div className="text-center">
                  <p className="text-lg font-bold text-teal-500">{program.volunteers}</p>
                  <p className="text-xs text-muted">متطوع</p>
                </div>
                <div className="h-8 w-px bg-slate-200" />
                <div className="text-center">
                  <span className="rounded-full bg-background px-2.5 py-0.5 text-xs font-medium text-foreground">
                    {program.category}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
