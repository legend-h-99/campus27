"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { PageHeader } from "@/components/shared/page-header";
import {
  Search,
  Plus,
  Building2,
  Users,
  GraduationCap,
  BookOpen,
  TrendingUp,
  ArrowUpRight,
  MoreVertical,
} from "lucide-react";

// ---------- Types ----------
interface Department {
  id: string;
  name: string;
  head: string;
  trainersCount: number;
  traineesCount: number;
  coursesCount: number;
  successRate: number;
  color: string;
  icon: string;
  description: string;
}

// ---------- Mock Data ----------
const mockDepartments: Department[] = [
  {
    id: "DEP-001",
    name: "الحاسب الآلي",
    head: "د. خالد بن محمد السعيد",
    trainersCount: 15,
    traineesCount: 245,
    coursesCount: 22,
    successRate: 94,
    color: "from-teal-600 to-teal-800",
    icon: "laptop",
    description: "يشمل تخصصات البرمجة، الشبكات، قواعد البيانات، وأمن المعلومات",
  },
  {
    id: "DEP-002",
    name: "الكهرباء",
    head: "م. محمد بن علي الزهراني",
    trainersCount: 12,
    traineesCount: 198,
    coursesCount: 18,
    successRate: 91,
    color: "from-aqua-500 to-aqua-700",
    icon: "zap",
    description: "يشمل تخصصات القوى الكهربائية، التحكم الآلي، والتمديدات الكهربائية",
  },
  {
    id: "DEP-003",
    name: "الميكانيكا",
    head: "د. أحمد بن سعد الغامدي",
    trainersCount: 14,
    traineesCount: 210,
    coursesCount: 20,
    successRate: 89,
    color: "from-teal-500 to-teal-700",
    icon: "wrench",
    description: "يشمل تخصصات التصميم الميكانيكي، صيانة المركبات، والتبريد والتكييف",
  },
  {
    id: "DEP-004",
    name: "الإلكترونيات",
    head: "م. سلطان بن فيصل القحطاني",
    trainersCount: 10,
    traineesCount: 156,
    coursesCount: 16,
    successRate: 92,
    color: "from-mint-500 to-mint-700",
    icon: "cpu",
    description: "يشمل تخصصات الدوائر الرقمية، الاتصالات، والأنظمة المدمجة",
  },
  {
    id: "DEP-005",
    name: "الإدارة المكتبية",
    head: "أ. عبدالرحمن بن حسن الشهري",
    trainersCount: 8,
    traineesCount: 120,
    coursesCount: 14,
    successRate: 96,
    color: "from-amber-500 to-amber-600",
    icon: "briefcase",
    description: "يشمل تخصصات إدارة الأعمال، المحاسبة، والسكرتارية التنفيذية",
  },
  {
    id: "DEP-006",
    name: "اللحام والتشكيل",
    head: "م. يوسف بن خالد المطيري",
    trainersCount: 9,
    traineesCount: 135,
    coursesCount: 12,
    successRate: 88,
    color: "from-red-500 to-red-600",
    icon: "flame",
    description: "يشمل تخصصات اللحام الصناعي، تشكيل المعادن، والتفتيش اللاإتلافي",
  },
  {
    id: "DEP-007",
    name: "التقنية المدنية",
    head: "م. عبدالله بن سالم العتيبي",
    trainersCount: 11,
    traineesCount: 175,
    coursesCount: 15,
    successRate: 90,
    color: "from-aqua-600 to-aqua-800",
    icon: "building",
    description: "يشمل تخصصات المساحة، الرسم المعماري، وتقنية البناء",
  },
  {
    id: "DEP-008",
    name: "التقنية الكيميائية",
    head: "د. سعد بن عمر الحربي",
    trainersCount: 8,
    traineesCount: 106,
    coursesCount: 13,
    successRate: 93,
    color: "from-amber-500 to-red-500",
    icon: "flask",
    description: "يشمل تخصصات البتروكيماويات، التحليل الكيميائي، وعمليات التشغيل",
  },
];

// ---------- Component ----------
export default function DepartmentsPage() {
  const t = useTranslations("departments");

  const [searchQuery, setSearchQuery] = useState("");

  const filtered = mockDepartments.filter(
    (dept) =>
      dept.name.includes(searchQuery) ||
      dept.head.includes(searchQuery) ||
      dept.description.includes(searchQuery)
  );

  // Totals
  const totalTrainers = mockDepartments.reduce((s, d) => s + d.trainersCount, 0);
  const totalTrainees = mockDepartments.reduce((s, d) => s + d.traineesCount, 0);
  const totalCourses = mockDepartments.reduce((s, d) => s + d.coursesCount, 0);
  const avgSuccess =
    mockDepartments.reduce((s, d) => s + d.successRate, 0) / mockDepartments.length;

  return (
    <div className="animate-fade-in">
      <PageHeader
        title={t("title")}
        description={t("description")}
        actions={
          <button className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-teal-600 to-aqua-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm shadow-teal-600/20 transition-colors hover:from-teal-700 hover:to-aqua-700">
            <Plus className="h-4 w-4" />
            {t("addDepartment")}
          </button>
        }
      />

      {/* Summary Stats */}
      <div className="mb-4 grid grid-cols-2 gap-3 md:mb-6 md:gap-4 lg:grid-cols-4">
        <div className="glass-card flex items-center gap-3 p-3 md:gap-4 md:p-4">
          <div className="rounded-lg bg-teal-100 p-2 md:p-3">
            <Building2 className="h-5 w-5 text-teal-600 md:h-6 md:w-6" />
          </div>
          <div>
            <p className="text-xs text-muted md:text-sm">{t("totalDepartments")}</p>
            <p className="text-xl font-bold text-foreground md:text-2xl">
              {mockDepartments.length}
            </p>
          </div>
        </div>

        <div className="glass-card flex items-center gap-3 p-3 md:gap-4 md:p-4">
          <div className="rounded-lg bg-teal-100 p-2 md:p-3">
            <Users className="h-5 w-5 text-teal-700 md:h-6 md:w-6" />
          </div>
          <div>
            <p className="text-xs text-muted md:text-sm">{t("totalTrainers")}</p>
            <p className="text-xl font-bold text-foreground md:text-2xl">{totalTrainers}</p>
          </div>
        </div>

        <div className="glass-card flex items-center gap-3 p-3 md:gap-4 md:p-4">
          <div className="rounded-lg bg-aqua-100 p-2 md:p-3">
            <GraduationCap className="h-5 w-5 text-aqua-700 md:h-6 md:w-6" />
          </div>
          <div>
            <p className="text-xs text-muted md:text-sm">{t("totalTrainees")}</p>
            <p className="text-xl font-bold text-foreground md:text-2xl">{totalTrainees}</p>
          </div>
        </div>

        <div className="glass-card flex items-center gap-3 p-3 md:gap-4 md:p-4">
          <div className="rounded-lg bg-amber-100 p-2 md:p-3">
            <TrendingUp className="h-5 w-5 text-amber-600 md:h-6 md:w-6" />
          </div>
          <div>
            <p className="text-xs text-muted md:text-sm">{t("avgSuccessRate")}</p>
            <p className="text-xl font-bold text-foreground md:text-2xl">
              {avgSuccess.toFixed(1)}%
            </p>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="mb-4 md:mb-6">
        <div className="relative max-w-md">
          <Search className="absolute start-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
          <input
            type="text"
            placeholder={t("searchPlaceholder")}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-lg border border-border bg-white py-2.5 pe-4 ps-10 text-sm text-foreground shadow-sm placeholder:text-muted focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>
      </div>

      {/* Department Cards */}
      <div className="grid grid-cols-1 gap-4 md:gap-6 lg:grid-cols-2 xl:grid-cols-3">
        {filtered.map((dept) => (
          <div
            key={dept.id}
            className="glass-card group overflow-hidden transition-all hover:shadow-md"
          >
            {/* Card Header */}
            <div className={`bg-gradient-to-r ${dept.color} p-5`}>
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-lg font-bold text-white">{dept.name}</h3>
                  <p className="mt-1 text-sm text-white/80">{dept.head}</p>
                </div>
                <button className="rounded-lg p-1.5 text-white/60 transition-colors hover:bg-white/20 hover:text-white">
                  <MoreVertical className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Card Body */}
            <div className="p-4 md:p-5">
              <p className="mb-4 text-sm leading-relaxed text-muted">
                {dept.description}
              </p>

              {/* Stats Grid */}
              <div className="mb-4 grid grid-cols-2 gap-3">
                <div className="rounded-xl bg-white/40 backdrop-blur-sm p-3 text-center">
                  <div className="flex items-center justify-center gap-1.5">
                    <Users className="h-4 w-4 text-teal-600" />
                    <span className="text-lg font-bold text-foreground">
                      {dept.trainersCount}
                    </span>
                  </div>
                  <p className="mt-0.5 text-xs text-muted">{t("trainers")}</p>
                </div>
                <div className="rounded-xl bg-white/40 backdrop-blur-sm p-3 text-center">
                  <div className="flex items-center justify-center gap-1.5">
                    <GraduationCap className="h-4 w-4 text-aqua-700" />
                    <span className="text-lg font-bold text-foreground">
                      {dept.traineesCount}
                    </span>
                  </div>
                  <p className="mt-0.5 text-xs text-muted">{t("trainees")}</p>
                </div>
                <div className="rounded-xl bg-white/40 backdrop-blur-sm p-3 text-center">
                  <div className="flex items-center justify-center gap-1.5">
                    <BookOpen className="h-4 w-4 text-amber-600" />
                    <span className="text-lg font-bold text-foreground">
                      {dept.coursesCount}
                    </span>
                  </div>
                  <p className="mt-0.5 text-xs text-muted">{t("courses")}</p>
                </div>
                <div className="rounded-xl bg-white/40 backdrop-blur-sm p-3 text-center">
                  <div className="flex items-center justify-center gap-1.5">
                    <TrendingUp className="h-4 w-4 text-teal-700" />
                    <span className="text-lg font-bold text-foreground">
                      {dept.successRate}%
                    </span>
                  </div>
                  <p className="mt-0.5 text-xs text-muted">{t("successRate")}</p>
                </div>
              </div>

              {/* Success Rate Bar */}
              <div className="mb-4">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted">{t("successRate")}</span>
                  <span className="font-medium text-foreground">{dept.successRate}%</span>
                </div>
                <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-white/30">
                  <div
                    className={`h-full rounded-full bg-gradient-to-r ${dept.color} transition-all`}
                    style={{ width: `${dept.successRate}%` }}
                  />
                </div>
              </div>

              {/* View Details */}
              <button className="inline-flex w-full items-center justify-center gap-2 rounded-lg border border-border py-2.5 text-sm font-medium text-teal-600 transition-colors hover:bg-teal-100/50">
                {t("viewDetails")}
                <ArrowUpRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filtered.length === 0 && (
        <div className="glass-card flex flex-col items-center justify-center py-16">
          <Building2 className="mb-3 h-12 w-12 text-muted/40" />
          <p className="text-sm text-muted">{t("noResults")}</p>
        </div>
      )}
    </div>
  );
}
