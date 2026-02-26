"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { PageHeader } from "@/components/shared/page-header";
import {
  Search,
  Filter,
  Plus,
  ChevronLeft,
  ChevronRight,
  GraduationCap,
  UserCheck,
  UserX,
  AlertTriangle,
  Download,
  Eye,
} from "lucide-react";

// ---------- Types ----------
interface Trainee {
  id: string;
  studentNumber: string;
  name: string;
  department: string;
  level: number;
  gpa: number;
  status: "active" | "suspended" | "graduated" | "withdrawn";
  enrollmentDate: string;
  email: string;
}

// ---------- Mock Data ----------
const mockTrainees: Trainee[] = [
  {
    id: "1",
    studentNumber: "441001234",
    name: "محمد بن عبدالله العمري",
    department: "الحاسب الآلي",
    level: 4,
    gpa: 4.52,
    status: "active",
    enrollmentDate: "2022-09-01",
    email: "m.alomari@stu.saohil1.edu.sa",
  },
  {
    id: "2",
    studentNumber: "441005678",
    name: "عبدالعزيز بن سعد القرني",
    department: "الكهرباء",
    level: 3,
    gpa: 3.85,
    status: "active",
    enrollmentDate: "2022-09-01",
    email: "a.alqarni@stu.saohil1.edu.sa",
  },
  {
    id: "3",
    studentNumber: "431002345",
    name: "فيصل بن ناصر المالكي",
    department: "الميكانيكا",
    level: 5,
    gpa: 4.10,
    status: "active",
    enrollmentDate: "2021-09-01",
    email: "f.almalki@stu.saohil1.edu.sa",
  },
  {
    id: "4",
    studentNumber: "441003456",
    name: "سلمان بن أحمد الحربي",
    department: "الحاسب الآلي",
    level: 2,
    gpa: 2.95,
    status: "active",
    enrollmentDate: "2023-09-01",
    email: "s.alharbi@stu.saohil1.edu.sa",
  },
  {
    id: "5",
    studentNumber: "431006789",
    name: "عمر بن يوسف الشمري",
    department: "الإلكترونيات",
    level: 5,
    gpa: 4.75,
    status: "graduated",
    enrollmentDate: "2021-09-01",
    email: "o.alshammari@stu.saohil1.edu.sa",
  },
  {
    id: "6",
    studentNumber: "441007890",
    name: "ياسر بن فهد الرشيدي",
    department: "الكهرباء",
    level: 3,
    gpa: 1.85,
    status: "suspended",
    enrollmentDate: "2022-09-01",
    email: "y.alrashidi@stu.saohil1.edu.sa",
  },
  {
    id: "7",
    studentNumber: "441008901",
    name: "نواف بن تركي المطيري",
    department: "الحاسب الآلي",
    level: 4,
    gpa: 3.60,
    status: "active",
    enrollmentDate: "2022-09-01",
    email: "n.almutairi@stu.saohil1.edu.sa",
  },
  {
    id: "8",
    studentNumber: "441009012",
    name: "مشاري بن خالد العنزي",
    department: "الإدارة المكتبية",
    level: 2,
    gpa: 3.25,
    status: "active",
    enrollmentDate: "2023-09-01",
    email: "m.alanazi@stu.saohil1.edu.sa",
  },
  {
    id: "9",
    studentNumber: "431004567",
    name: "بندر بن محمد الجهني",
    department: "اللحام والتشكيل",
    level: 5,
    gpa: 3.90,
    status: "active",
    enrollmentDate: "2021-09-01",
    email: "b.aljuhani@stu.saohil1.edu.sa",
  },
  {
    id: "10",
    studentNumber: "441000123",
    name: "خالد بن عبدالرحمن السبيعي",
    department: "الميكانيكا",
    level: 1,
    gpa: 0,
    status: "withdrawn",
    enrollmentDate: "2023-09-01",
    email: "k.alsubaie@stu.saohil1.edu.sa",
  },
  {
    id: "11",
    studentNumber: "441002468",
    name: "صالح بن حمد الدوسري",
    department: "الحاسب الآلي",
    level: 3,
    gpa: 4.30,
    status: "active",
    enrollmentDate: "2022-09-01",
    email: "s.aldossari@stu.saohil1.edu.sa",
  },
  {
    id: "12",
    studentNumber: "441001357",
    name: "عادل بن سعيد الغامدي",
    department: "الكهرباء",
    level: 4,
    gpa: 3.45,
    status: "active",
    enrollmentDate: "2022-09-01",
    email: "a.alghamdi@stu.saohil1.edu.sa",
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
function getStatusConfig(status: Trainee["status"]) {
  switch (status) {
    case "active":
      return { label: "مستمر", bg: "bg-teal-100", text: "text-teal-700" };
    case "suspended":
      return { label: "مطوي قيده", bg: "bg-red-100", text: "text-red-600" };
    case "graduated":
      return { label: "متخرج", bg: "bg-aqua-100", text: "text-aqua-700" };
    case "withdrawn":
      return { label: "منسحب", bg: "bg-amber-100", text: "text-amber-600" };
  }
}

function getGPAColor(gpa: number) {
  if (gpa >= 4.5) return "text-teal-700 font-bold";
  if (gpa >= 3.5) return "text-aqua-700 font-semibold";
  if (gpa >= 2.5) return "text-foreground";
  if (gpa >= 2.0) return "text-amber-600 font-semibold";
  return "text-red-600 font-semibold";
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
export default function TraineesPage() {
  const t = useTranslations("trainees");

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("الكل");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // Filtered data
  const filtered = mockTrainees.filter((trainee) => {
    const matchesSearch =
      trainee.name.includes(searchQuery) ||
      trainee.studentNumber.includes(searchQuery) ||
      trainee.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDept =
      selectedDepartment === "الكل" || trainee.department === selectedDepartment;
    const matchesStatus =
      selectedStatus === "all" || trainee.status === selectedStatus;
    return matchesSearch && matchesDept && matchesStatus;
  });

  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const paginated = filtered.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Stats
  const activeCount = mockTrainees.filter((s) => s.status === "active").length;
  const graduatedCount = mockTrainees.filter((s) => s.status === "graduated").length;
  const suspendedCount = mockTrainees.filter((s) => s.status === "suspended").length;
  const avgGPA =
    mockTrainees
      .filter((s) => s.status === "active" && s.gpa > 0)
      .reduce((sum, s) => sum + s.gpa, 0) /
    mockTrainees.filter((s) => s.status === "active" && s.gpa > 0).length;

  return (
    <div className="animate-fade-in">
      <PageHeader
        title={t("title")}
        description={t("description")}
        actions={
          <button className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-teal-600 to-aqua-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm shadow-teal-600/20 transition-colors hover:from-teal-700 hover:to-aqua-700">
            <Plus className="h-4 w-4" />
            {t("addTrainee")}
          </button>
        }
      />

      {/* Summary Cards */}
      <div className="mb-4 grid grid-cols-2 gap-3 md:mb-6 md:gap-4 lg:grid-cols-4">
        <div className="glass-card flex items-center gap-3 p-3 md:gap-4 md:p-4">
          <div className="rounded-lg bg-teal-100 p-2 md:p-3">
            <GraduationCap className="h-5 w-5 text-teal-600 md:h-6 md:w-6" />
          </div>
          <div>
            <p className="text-xs text-muted md:text-sm">{t("totalTrainees")}</p>
            <p className="text-xl font-bold text-foreground md:text-2xl">{mockTrainees.length}</p>
          </div>
        </div>

        <div className="glass-card flex items-center gap-3 p-3 md:gap-4 md:p-4">
          <div className="rounded-lg bg-success/10 p-2 md:p-3">
            <UserCheck className="h-5 w-5 text-success md:h-6 md:w-6" />
          </div>
          <div>
            <p className="text-xs text-muted md:text-sm">{t("activeTrainees")}</p>
            <p className="text-xl font-bold text-foreground md:text-2xl">{activeCount}</p>
          </div>
        </div>

        <div className="glass-card flex items-center gap-3 p-3 md:gap-4 md:p-4">
          <div className="rounded-lg bg-aqua-100 p-2 md:p-3">
            <GraduationCap className="h-5 w-5 text-aqua-600 md:h-6 md:w-6" />
          </div>
          <div>
            <p className="text-xs text-muted md:text-sm">{t("graduated")}</p>
            <p className="text-xl font-bold text-foreground md:text-2xl">{graduatedCount}</p>
          </div>
        </div>

        <div className="glass-card flex items-center gap-3 p-3 md:gap-4 md:p-4">
          <div className="rounded-lg bg-warning/10 p-2 md:p-3">
            <AlertTriangle className="h-5 w-5 text-warning md:h-6 md:w-6" />
          </div>
          <div>
            <p className="text-xs text-muted md:text-sm">{t("averageGPA")}</p>
            <p className="text-xl font-bold text-foreground md:text-2xl">{avgGPA.toFixed(2)}</p>
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
            <option value="graduated">{t("graduatedStatus")}</option>
            <option value="suspended">{t("suspended")}</option>
            <option value="withdrawn">{t("withdrawn")}</option>
          </select>

          <button className="inline-flex items-center gap-2 rounded-lg border border-border px-3 py-2 text-sm text-muted transition-colors hover:bg-background md:px-4 md:py-2.5">
            <Download className="h-4 w-4" />
            <span className="hidden xs:inline">{t("export")}</span>
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="glass-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-[600px] w-full">
            <thead>
              <tr className="border-b border-border bg-white/30">
                <th className="px-3 py-3 text-start text-xs font-semibold uppercase tracking-wider text-muted md:px-4 md:py-3.5">
                  {t("studentNumber")}
                </th>
                <th className="px-4 py-3.5 text-start text-xs font-semibold uppercase tracking-wider text-muted">
                  {t("traineeName")}
                </th>
                <th className="px-4 py-3.5 text-start text-xs font-semibold uppercase tracking-wider text-muted">
                  {t("department")}
                </th>
                <th className="px-4 py-3.5 text-start text-xs font-semibold uppercase tracking-wider text-muted">
                  {t("level")}
                </th>
                <th className="px-4 py-3.5 text-start text-xs font-semibold uppercase tracking-wider text-muted">
                  {t("gpa")}
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
              {paginated.map((trainee) => {
                const statusCfg = getStatusConfig(trainee.status);
                return (
                  <tr
                    key={trainee.id}
                    className="transition-colors hover:bg-white/30"
                  >
                    <td className="whitespace-nowrap px-4 py-3.5 text-sm font-mono font-medium text-teal-600">
                      {trainee.studentNumber}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-teal-100 text-sm font-bold text-teal-700">
                          {trainee.name.charAt(0)}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-foreground">
                            {trainee.name}
                          </p>
                          <p className="text-xs text-muted">{trainee.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-4 py-3.5 text-sm text-foreground">
                      {trainee.department}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3.5">
                      <span className="inline-flex items-center rounded-md bg-background px-2 py-1 text-xs font-medium text-foreground">
                        {t("levelLabel")} {getLevelLabel(trainee.level)}
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-4 py-3.5">
                      <span className={`text-sm ${getGPAColor(trainee.gpa)}`}>
                        {trainee.gpa > 0 ? trainee.gpa.toFixed(2) : "--"}
                      </span>
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
                        aria-label={`عرض ملف ${trainee.name}`}
                        className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium text-teal-600 transition-colors hover:bg-teal-50"
                      >
                        <Eye className="h-3.5 w-3.5" />
                        {t("viewProfile")}
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
          <div className="flex flex-col items-center gap-2 border-t border-border px-3 py-3 xs:flex-row xs:justify-between md:px-4">
            <p className="text-xs text-muted md:text-sm">
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
                  {...(currentPage === i + 1 ? { "aria-current": "page" as const } : {})}
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

        {/* Empty state */}
        {paginated.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12">
            <GraduationCap className="mb-3 h-12 w-12 text-muted/40" />
            <p className="text-sm text-muted">{t("noResults")}</p>
          </div>
        )}
      </div>
    </div>
  );
}
