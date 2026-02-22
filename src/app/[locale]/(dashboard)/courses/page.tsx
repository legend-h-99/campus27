"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { PageHeader } from "@/components/shared/page-header";
import {
  Search,
  Filter,
  Plus,
  BookOpen,
  Clock,
  ChevronLeft,
  ChevronRight,
  Download,
  Eye,
  LayoutGrid,
  List,
} from "lucide-react";

// ---------- Types ----------
interface Course {
  id: string;
  code: string;
  name: string;
  department: string;
  credits: number;
  theoreticalHours: number;
  practicalHours: number;
  level: number;
  status: "active" | "inactive" | "under_review";
  prerequisite: string | null;
  trainer: string;
}

// ---------- Mock Data ----------
const mockCourses: Course[] = [
  {
    id: "1",
    code: "CS101",
    name: "مقدمة في الحاسب الآلي",
    department: "الحاسب الآلي",
    credits: 3,
    theoreticalHours: 2,
    practicalHours: 2,
    level: 1,
    status: "active",
    prerequisite: null,
    trainer: "د. خالد السعيد",
  },
  {
    id: "2",
    code: "CS201",
    name: "البرمجة بلغة جافا",
    department: "الحاسب الآلي",
    credits: 4,
    theoreticalHours: 2,
    practicalHours: 4,
    level: 2,
    status: "active",
    prerequisite: "CS101",
    trainer: "د. عبدالرحمن الشهري",
  },
  {
    id: "3",
    code: "CS301",
    name: "قواعد البيانات",
    department: "الحاسب الآلي",
    credits: 4,
    theoreticalHours: 2,
    practicalHours: 4,
    level: 3,
    status: "active",
    prerequisite: "CS201",
    trainer: "د. عبدالرحمن الشهري",
  },
  {
    id: "4",
    code: "CS401",
    name: "شبكات الحاسب",
    department: "الحاسب الآلي",
    credits: 3,
    theoreticalHours: 2,
    practicalHours: 2,
    level: 4,
    status: "active",
    prerequisite: "CS201",
    trainer: "م. بدر الراشد",
  },
  {
    id: "5",
    code: "EE101",
    name: "أساسيات الكهرباء",
    department: "الكهرباء",
    credits: 3,
    theoreticalHours: 2,
    practicalHours: 2,
    level: 1,
    status: "active",
    prerequisite: null,
    trainer: "د. محمد الزهراني",
  },
  {
    id: "6",
    code: "EE201",
    name: "الدوائر الكهربائية",
    department: "الكهرباء",
    credits: 4,
    theoreticalHours: 2,
    practicalHours: 4,
    level: 2,
    status: "active",
    prerequisite: "EE101",
    trainer: "د. محمد الزهراني",
  },
  {
    id: "7",
    code: "EE301",
    name: "أنظمة التحكم الآلي",
    department: "الكهرباء",
    credits: 4,
    theoreticalHours: 2,
    practicalHours: 4,
    level: 3,
    status: "active",
    prerequisite: "EE201",
    trainer: "م. فهد الدوسري",
  },
  {
    id: "8",
    code: "ME101",
    name: "الرسم الهندسي",
    department: "الميكانيكا",
    credits: 3,
    theoreticalHours: 1,
    practicalHours: 4,
    level: 1,
    status: "active",
    prerequisite: null,
    trainer: "د. أحمد الغامدي",
  },
  {
    id: "9",
    code: "ME201",
    name: "ميكانيكا المواد",
    department: "الميكانيكا",
    credits: 3,
    theoreticalHours: 2,
    practicalHours: 2,
    level: 2,
    status: "active",
    prerequisite: "ME101",
    trainer: "د. أحمد الغامدي",
  },
  {
    id: "10",
    code: "ME301",
    name: "صيانة المركبات",
    department: "الميكانيكا",
    credits: 4,
    theoreticalHours: 1,
    practicalHours: 6,
    level: 3,
    status: "under_review",
    prerequisite: "ME201",
    trainer: "د. سعد الحربي",
  },
  {
    id: "11",
    code: "EL101",
    name: "أساسيات الإلكترونيات",
    department: "الإلكترونيات",
    credits: 3,
    theoreticalHours: 2,
    practicalHours: 2,
    level: 1,
    status: "active",
    prerequisite: null,
    trainer: "م. سلطان القحطاني",
  },
  {
    id: "12",
    code: "BA101",
    name: "مبادئ إدارة الأعمال",
    department: "الإدارة المكتبية",
    credits: 3,
    theoreticalHours: 3,
    practicalHours: 0,
    level: 1,
    status: "active",
    prerequisite: null,
    trainer: "م. تركي العتيبي",
  },
  {
    id: "13",
    code: "WD101",
    name: "أساسيات اللحام",
    department: "اللحام والتشكيل",
    credits: 3,
    theoreticalHours: 1,
    practicalHours: 4,
    level: 1,
    status: "active",
    prerequisite: null,
    trainer: "م. يوسف المطيري",
  },
  {
    id: "14",
    code: "CS501",
    name: "أمن المعلومات",
    department: "الحاسب الآلي",
    credits: 3,
    theoreticalHours: 2,
    practicalHours: 2,
    level: 5,
    status: "inactive",
    prerequisite: "CS401",
    trainer: "م. بدر الراشد",
  },
];

const departments = [
  "الكل",
  "الحاسب الآلي",
  "الكهرباء",
  "الميكانيكا",
  "الإلكترونيات",
  "الإدارة المكتبية",
  "اللحام والتشكيل",
];

// ---------- Helpers ----------
function getStatusConfig(status: Course["status"]) {
  switch (status) {
    case "active":
      return { label: "مفعّل", bg: "bg-teal-100", text: "text-teal-700" };
    case "inactive":
      return { label: "غير مفعّل", bg: "bg-red-100", text: "text-red-600" };
    case "under_review":
      return { label: "قيد المراجعة", bg: "bg-amber-100", text: "text-amber-600" };
  }
}

function getLevelLabel(level: number) {
  const labels: Record<number, string> = {
    1: "الأول",
    2: "الثاني",
    3: "الثالث",
    4: "الرابع",
    5: "الخامس",
  };
  return labels[level] || `${level}`;
}

// ---------- Component ----------
export default function CoursesPage() {
  const t = useTranslations("courses");

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("الكل");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [viewMode, setViewMode] = useState<"table" | "grid">("table");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Filtered data
  const filtered = mockCourses.filter((course) => {
    const matchesSearch =
      course.name.includes(searchQuery) ||
      course.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.trainer.includes(searchQuery);
    const matchesDept =
      selectedDepartment === "الكل" || course.department === selectedDepartment;
    const matchesStatus =
      selectedStatus === "all" || course.status === selectedStatus;
    return matchesSearch && matchesDept && matchesStatus;
  });

  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const paginated = filtered.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Stats
  const activeCount = mockCourses.filter((c) => c.status === "active").length;
  const totalCredits = mockCourses.reduce((s, c) => s + c.credits, 0);
  const totalHours = mockCourses.reduce(
    (s, c) => s + c.theoreticalHours + c.practicalHours,
    0
  );

  return (
    <div className="animate-fade-in">
      <PageHeader
        title={t("title")}
        description={t("description")}
        actions={
          <button className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-teal-600 to-aqua-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm shadow-teal-600/20 transition-colors hover:from-teal-700 hover:to-aqua-700">
            <Plus className="h-4 w-4" />
            {t("addCourse")}
          </button>
        }
      />

      {/* Summary Cards */}
      <div className="mb-4 grid grid-cols-2 gap-3 md:mb-6 md:gap-4 lg:grid-cols-4">
        <div className="glass-card flex items-center gap-3 p-3 md:gap-4 md:p-4">
          <div className="rounded-lg bg-teal-100 p-2 md:p-3">
            <BookOpen className="h-5 w-5 text-teal-600 md:h-6 md:w-6" />
          </div>
          <div>
            <p className="text-xs text-muted md:text-sm">{t("totalCourses")}</p>
            <p className="text-xl font-bold text-foreground md:text-2xl">{mockCourses.length}</p>
          </div>
        </div>

        <div className="glass-card flex items-center gap-3 p-3 md:gap-4 md:p-4">
          <div className="rounded-lg bg-teal-100 p-2 md:p-3">
            <BookOpen className="h-5 w-5 text-teal-700 md:h-6 md:w-6" />
          </div>
          <div>
            <p className="text-xs text-muted md:text-sm">{t("activeCourses")}</p>
            <p className="text-xl font-bold text-foreground md:text-2xl">{activeCount}</p>
          </div>
        </div>

        <div className="glass-card flex items-center gap-3 p-3 md:gap-4 md:p-4">
          <div className="rounded-lg bg-aqua-100 p-2 md:p-3">
            <BookOpen className="h-5 w-5 text-aqua-700 md:h-6 md:w-6" />
          </div>
          <div>
            <p className="text-xs text-muted md:text-sm">{t("totalCredits")}</p>
            <p className="text-xl font-bold text-foreground md:text-2xl">{totalCredits}</p>
          </div>
        </div>

        <div className="glass-card flex items-center gap-3 p-3 md:gap-4 md:p-4">
          <div className="rounded-lg bg-amber-100 p-2 md:p-3">
            <Clock className="h-5 w-5 text-amber-600 md:h-6 md:w-6" />
          </div>
          <div>
            <p className="text-xs text-muted md:text-sm">{t("totalHours")}</p>
            <p className="text-xl font-bold text-foreground md:text-2xl">{totalHours}</p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="glass-card mb-4 flex flex-col gap-3 p-3 sm:flex-row sm:items-center md:mb-6 md:gap-4 md:p-4">
        <div className="relative flex-1">
          <Search className="absolute start-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
          <input
            type="text"
            placeholder={t("searchPlaceholder")}
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full rounded-lg border border-border bg-background py-2.5 pe-4 ps-10 text-sm text-foreground placeholder:text-muted focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 md:gap-3">
          <div className="flex items-center gap-2">
            <Filter className="hidden h-4 w-4 text-muted xs:block" />
            <select
              value={selectedDepartment}
              onChange={(e) => {
                setSelectedDepartment(e.target.value);
                setCurrentPage(1);
              }}
              className="rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary md:py-2.5"
            >
              {departments.map((dept) => (
                <option key={dept} value={dept}>
                  {dept}
                </option>
              ))}
            </select>
          </div>

          <select
            value={selectedStatus}
            onChange={(e) => {
              setSelectedStatus(e.target.value);
              setCurrentPage(1);
            }}
            className="rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary md:py-2.5"
          >
            <option value="all">{t("allStatuses")}</option>
            <option value="active">{t("active")}</option>
            <option value="inactive">{t("inactive")}</option>
            <option value="under_review">{t("underReview")}</option>
          </select>

          {/* View Toggle */}
          <div className="flex rounded-lg border border-border">
            <button
              onClick={() => setViewMode("table")}
              aria-label="عرض جدول"
              aria-pressed={viewMode === "table"}
              className={`rounded-s-lg p-2 transition-colors md:p-2.5 ${
                viewMode === "table"
                  ? "bg-gradient-to-r from-teal-600 to-aqua-600 text-white"
                  : "text-muted hover:bg-background"
              }`}
            >
              <List className="h-4 w-4" />
            </button>
            <button
              onClick={() => setViewMode("grid")}
              aria-label="عرض شبكة"
              aria-pressed={viewMode === "grid"}
              className={`rounded-e-lg p-2 transition-colors md:p-2.5 ${
                viewMode === "grid"
                  ? "bg-gradient-to-r from-teal-600 to-aqua-600 text-white"
                  : "text-muted hover:bg-background"
              }`}
            >
              <LayoutGrid className="h-4 w-4" />
            </button>
          </div>

          <button className="inline-flex items-center gap-2 rounded-lg border border-border px-3 py-2 text-sm text-muted transition-colors hover:bg-background md:px-4 md:py-2.5">
            <Download className="h-4 w-4" />
            <span className="hidden xs:inline">{t("export")}</span>
          </button>
        </div>
      </div>

      {/* Table View */}
      {viewMode === "table" && (
        <div className="glass-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-[600px] w-full">
              <thead>
                <tr className="border-b border-border bg-white/30">
                  <th className="px-3 py-3 text-start text-xs font-semibold uppercase tracking-wider text-muted md:px-4 md:py-3.5">
                    {t("courseCode")}
                  </th>
                  <th className="px-4 py-3.5 text-start text-xs font-semibold uppercase tracking-wider text-muted">
                    {t("courseName")}
                  </th>
                  <th className="px-4 py-3.5 text-start text-xs font-semibold uppercase tracking-wider text-muted">
                    {t("department")}
                  </th>
                  <th className="px-4 py-3.5 text-start text-xs font-semibold uppercase tracking-wider text-muted">
                    {t("level")}
                  </th>
                  <th className="px-4 py-3.5 text-start text-xs font-semibold uppercase tracking-wider text-muted">
                    {t("credits")}
                  </th>
                  <th className="px-4 py-3.5 text-start text-xs font-semibold uppercase tracking-wider text-muted">
                    {t("hours")}
                  </th>
                  <th className="px-4 py-3.5 text-start text-xs font-semibold uppercase tracking-wider text-muted">
                    {t("prerequisite")}
                  </th>
                  <th className="px-4 py-3.5 text-start text-xs font-semibold uppercase tracking-wider text-muted">
                    {t("status")}
                  </th>
                  <th className="px-4 py-3.5 text-start text-xs font-semibold uppercase tracking-wider text-muted">
                    {t("actions")}
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {paginated.map((course) => {
                  const statusCfg = getStatusConfig(course.status);
                  return (
                    <tr
                      key={course.id}
                      className="transition-colors hover:bg-white/30"
                    >
                      <td className="whitespace-nowrap px-4 py-3.5">
                        <span className="rounded-md bg-teal-100 px-2 py-1 font-mono text-sm font-semibold text-teal-700">
                          {course.code}
                        </span>
                      </td>
                      <td className="whitespace-nowrap px-4 py-3.5">
                        <div>
                          <p className="text-sm font-medium text-foreground">
                            {course.name}
                          </p>
                          <p className="text-xs text-muted">{course.trainer}</p>
                        </div>
                      </td>
                      <td className="whitespace-nowrap px-4 py-3.5 text-sm text-foreground">
                        {course.department}
                      </td>
                      <td className="whitespace-nowrap px-4 py-3.5 text-sm text-foreground">
                        {getLevelLabel(course.level)}
                      </td>
                      <td className="whitespace-nowrap px-4 py-3.5 text-center text-sm font-medium text-foreground">
                        {course.credits}
                      </td>
                      <td className="whitespace-nowrap px-4 py-3.5">
                        <div className="flex items-center gap-2 text-xs">
                          <span className="rounded bg-aqua-100 px-1.5 py-0.5 text-aqua-700">
                            {t("theoretical")}: {course.theoreticalHours}
                          </span>
                          <span className="rounded bg-amber-100 px-1.5 py-0.5 text-amber-600">
                            {t("practical")}: {course.practicalHours}
                          </span>
                        </div>
                      </td>
                      <td className="whitespace-nowrap px-4 py-3.5 text-sm text-muted">
                        {course.prerequisite ? (
                          <span className="font-mono text-teal-600">
                            {course.prerequisite}
                          </span>
                        ) : (
                          <span className="text-muted/50">--</span>
                        )}
                      </td>
                      <td className="whitespace-nowrap px-4 py-3.5">
                        <span
                          className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${statusCfg.bg} ${statusCfg.text}`}
                        >
                          {statusCfg.label}
                        </span>
                      </td>
                      <td className="whitespace-nowrap px-4 py-3.5">
                        <button
                          aria-label={`${t("view")} ${course.name}`}
                          className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium text-teal-600 transition-colors hover:bg-teal-100"
                        >
                          <Eye className="h-3.5 w-3.5" />
                          {t("view")}
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between border-t border-border px-4 py-3">
              <p className="text-sm text-muted">
                {t("showing")} {(currentPage - 1) * itemsPerPage + 1}-
                {Math.min(currentPage * itemsPerPage, filtered.length)} {t("of")}{" "}
                {filtered.length}
              </p>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  aria-label="الصفحة السابقة"
                  className="rounded-lg p-2 text-muted transition-colors hover:bg-background disabled:opacity-40"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
                {Array.from({ length: totalPages }).map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentPage(i + 1)}
                    aria-current={currentPage === i + 1 ? "page" : undefined}
                    aria-label={`صفحة ${i + 1}`}
                    className={`min-w-[32px] rounded-lg px-2 py-1 text-sm font-medium transition-colors ${
                      currentPage === i + 1
                        ? "bg-gradient-to-r from-teal-600 to-aqua-600 text-white"
                        : "text-muted hover:bg-background"
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
                <button
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  aria-label="الصفحة التالية"
                  className="rounded-lg p-2 text-muted transition-colors hover:bg-background disabled:opacity-40"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Grid View */}
      {viewMode === "grid" && (
        <div className="grid grid-cols-1 gap-3 md:gap-4 lg:grid-cols-2 xl:grid-cols-3">
          {paginated.map((course) => {
            const statusCfg = getStatusConfig(course.status);
            return (
              <div
                key={course.id}
                className="glass-card p-5 transition-all hover:shadow-md"
              >
                <div className="mb-3 flex items-start justify-between">
                  <div>
                    <span className="rounded-md bg-teal-100 px-2 py-1 font-mono text-sm font-semibold text-teal-700">
                      {course.code}
                    </span>
                    <h3 className="mt-2 text-base font-semibold text-foreground">
                      {course.name}
                    </h3>
                  </div>
                  <span
                    className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${statusCfg.bg} ${statusCfg.text}`}
                  >
                    {statusCfg.label}
                  </span>
                </div>

                <p className="mb-3 text-sm text-muted">{course.department}</p>

                <div className="mb-3 flex flex-wrap gap-2 text-xs">
                  <span className="rounded-xl bg-white/40 backdrop-blur-sm px-2.5 py-1.5 text-foreground">
                    {t("levelLabel")} {getLevelLabel(course.level)}
                  </span>
                  <span className="rounded-xl bg-white/40 backdrop-blur-sm px-2.5 py-1.5 text-foreground">
                    {course.credits} {t("creditUnits")}
                  </span>
                  <span className="rounded-lg bg-aqua-100 px-2.5 py-1.5 text-aqua-700">
                    {t("theoretical")}: {course.theoreticalHours}
                  </span>
                  <span className="rounded-lg bg-amber-100 px-2.5 py-1.5 text-amber-600">
                    {t("practical")}: {course.practicalHours}
                  </span>
                </div>

                <div className="flex items-center justify-between border-t border-border pt-3">
                  <p className="text-xs text-muted">{course.trainer}</p>
                  <button
                    aria-label={`${t("view")} ${course.name}`}
                    className="inline-flex items-center gap-1 text-xs font-medium text-teal-600 transition-colors hover:underline"
                  >
                    <Eye className="h-3.5 w-3.5" />
                    {t("view")}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Empty state */}
      {paginated.length === 0 && (
        <div className="glass-card flex flex-col items-center justify-center py-16">
          <BookOpen className="mb-3 h-12 w-12 text-muted/40" />
          <p className="text-sm text-muted">{t("noResults")}</p>
        </div>
      )}
    </div>
  );
}
