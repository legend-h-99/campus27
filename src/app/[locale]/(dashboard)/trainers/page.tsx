"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { PageHeader } from "@/components/shared/page-header";
import {
  Search,
  Filter,
  Plus,
  Mail,
  Phone,
  ChevronLeft,
  ChevronRight,
  Users,
  UserCheck,
  UserX,
  Download,
} from "lucide-react";

// ---------- Types ----------
interface Trainer {
  id: string;
  name: string;
  email: string;
  phone: string;
  department: string;
  specialization: string;
  status: "active" | "inactive" | "on_leave";
  coursesCount: number;
  rating: number;
  joinDate: string;
}

// ---------- Mock Data ----------
const mockTrainers: Trainer[] = [
  {
    id: "TR-001",
    name: "د. خالد بن محمد السعيد",
    email: "k.alsaeed@saohil1.edu.sa",
    phone: "0501234567",
    department: "الحاسب الآلي",
    specialization: "هندسة البرمجيات",
    status: "active",
    coursesCount: 4,
    rating: 4.8,
    joinDate: "2020-09-01",
  },
  {
    id: "TR-002",
    name: "م. فهد بن عبدالله الدوسري",
    email: "f.aldossari@saohil1.edu.sa",
    phone: "0559876543",
    department: "الكهرباء",
    specialization: "أنظمة التحكم الآلي",
    status: "active",
    coursesCount: 3,
    rating: 4.5,
    joinDate: "2019-01-15",
  },
  {
    id: "TR-003",
    name: "د. أحمد بن سعد الغامدي",
    email: "a.alghamdi@saohil1.edu.sa",
    phone: "0567891234",
    department: "الميكانيكا",
    specialization: "التصميم الميكانيكي",
    status: "active",
    coursesCount: 5,
    rating: 4.9,
    joinDate: "2018-09-01",
  },
  {
    id: "TR-004",
    name: "م. سلطان بن فيصل القحطاني",
    email: "s.alqahtani@saohil1.edu.sa",
    phone: "0543216789",
    department: "الإلكترونيات",
    specialization: "الدوائر الرقمية",
    status: "on_leave",
    coursesCount: 2,
    rating: 4.3,
    joinDate: "2021-02-01",
  },
  {
    id: "TR-005",
    name: "د. عبدالرحمن بن ناصر الشهري",
    email: "a.alshehri@saohil1.edu.sa",
    phone: "0512345678",
    department: "الحاسب الآلي",
    specialization: "قواعد البيانات",
    status: "active",
    coursesCount: 3,
    rating: 4.6,
    joinDate: "2017-09-01",
  },
  {
    id: "TR-006",
    name: "م. تركي بن سعود العتيبي",
    email: "t.alotaibi@saohil1.edu.sa",
    phone: "0578901234",
    department: "الإدارة المكتبية",
    specialization: "إدارة الأعمال",
    status: "inactive",
    coursesCount: 0,
    rating: 4.1,
    joinDate: "2022-01-10",
  },
  {
    id: "TR-007",
    name: "د. محمد بن علي الزهراني",
    email: "m.alzahrani@saohil1.edu.sa",
    phone: "0534567890",
    department: "الكهرباء",
    specialization: "القوى الكهربائية",
    status: "active",
    coursesCount: 4,
    rating: 4.7,
    joinDate: "2019-09-01",
  },
  {
    id: "TR-008",
    name: "م. يوسف بن خالد المطيري",
    email: "y.almutairi@saohil1.edu.sa",
    phone: "0556789012",
    department: "اللحام والتشكيل",
    specialization: "اللحام الصناعي",
    status: "active",
    coursesCount: 3,
    rating: 4.4,
    joinDate: "2020-02-15",
  },
  {
    id: "TR-009",
    name: "د. سعد بن عمر الحربي",
    email: "s.alharbi@saohil1.edu.sa",
    phone: "0523456789",
    department: "الميكانيكا",
    specialization: "ميكانيكا المركبات",
    status: "on_leave",
    coursesCount: 2,
    rating: 4.2,
    joinDate: "2018-01-20",
  },
  {
    id: "TR-010",
    name: "م. بدر بن حمد الراشد",
    email: "b.alrashid@saohil1.edu.sa",
    phone: "0545678901",
    department: "الحاسب الآلي",
    specialization: "الشبكات وأمن المعلومات",
    status: "active",
    coursesCount: 4,
    rating: 4.8,
    joinDate: "2021-09-01",
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
function getStatusConfig(status: Trainer["status"]) {
  switch (status) {
    case "active":
      return { label: "نشط", bg: "bg-teal-100", text: "text-teal-700" };
    case "inactive":
      return { label: "غير نشط", bg: "bg-red-100", text: "text-red-600" };
    case "on_leave":
      return { label: "في إجازة", bg: "bg-amber-100", text: "text-amber-600" };
  }
}

function renderStars(rating: number) {
  return (
    <div className="flex items-center gap-1">
      <span className="text-sm font-medium text-foreground">{rating}</span>
      <div className="flex">
        {Array.from({ length: 5 }).map((_, i) => (
          <svg
            key={i}
            className={`h-3.5 w-3.5 ${i < Math.floor(rating) ? "text-warning" : "text-border"}`}
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
      </div>
    </div>
  );
}

// ---------- Component ----------
export default function TrainersPage() {
  const t = useTranslations("trainers");

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("الكل");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // Filtered data
  const filtered = mockTrainers.filter((trainer) => {
    const matchesSearch =
      trainer.name.includes(searchQuery) ||
      trainer.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      trainer.specialization.includes(searchQuery);
    const matchesDept =
      selectedDepartment === "الكل" || trainer.department === selectedDepartment;
    const matchesStatus =
      selectedStatus === "all" || trainer.status === selectedStatus;
    return matchesSearch && matchesDept && matchesStatus;
  });

  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const paginated = filtered.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Stats
  const activeCount = mockTrainers.filter((t) => t.status === "active").length;
  const onLeaveCount = mockTrainers.filter((t) => t.status === "on_leave").length;
  const inactiveCount = mockTrainers.filter((t) => t.status === "inactive").length;

  return (
    <div className="animate-fade-in">
      <PageHeader
        title={t("title")}
        description={t("description")}
        actions={
          <button className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-teal-600 to-aqua-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm shadow-teal-600/20 transition-colors hover:from-teal-700 hover:to-aqua-700">
            <Plus className="h-4 w-4" />
            {t("addTrainer")}
          </button>
        }
      />

      {/* Summary Cards */}
      <div className="mb-4 grid grid-cols-2 gap-3 md:mb-6 md:gap-4 lg:grid-cols-4">
        <div className="glass-card flex items-center gap-3 p-3 md:gap-4 md:p-4">
          <div className="rounded-lg bg-teal-100 p-2 md:p-3">
            <Users className="h-5 w-5 text-teal-600 md:h-6 md:w-6" />
          </div>
          <div>
            <p className="text-xs text-muted md:text-sm">{t("totalTrainers")}</p>
            <p className="text-xl font-bold text-foreground md:text-2xl">{mockTrainers.length}</p>
          </div>
        </div>

        <div className="glass-card flex items-center gap-3 p-3 md:gap-4 md:p-4">
          <div className="rounded-lg bg-success/10 p-2 md:p-3">
            <UserCheck className="h-5 w-5 text-success md:h-6 md:w-6" />
          </div>
          <div>
            <p className="text-xs text-muted md:text-sm">{t("activeTrainers")}</p>
            <p className="text-xl font-bold text-foreground md:text-2xl">{activeCount}</p>
          </div>
        </div>

        <div className="glass-card flex items-center gap-3 p-3 md:gap-4 md:p-4">
          <div className="rounded-lg bg-warning/10 p-2 md:p-3">
            <Users className="h-5 w-5 text-warning md:h-6 md:w-6" />
          </div>
          <div>
            <p className="text-xs text-muted md:text-sm">{t("onLeave")}</p>
            <p className="text-xl font-bold text-foreground md:text-2xl">{onLeaveCount}</p>
          </div>
        </div>

        <div className="glass-card flex items-center gap-3 p-3 md:gap-4 md:p-4">
          <div className="rounded-lg bg-danger/10 p-2 md:p-3">
            <UserX className="h-5 w-5 text-danger md:h-6 md:w-6" />
          </div>
          <div>
            <p className="text-xs text-muted md:text-sm">{t("inactiveTrainers")}</p>
            <p className="text-xl font-bold text-foreground md:text-2xl">{inactiveCount}</p>
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
              className="rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary md:px-3 md:py-2.5"
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
            <option value="on_leave">{t("onLeaveStatus")}</option>
            <option value="inactive">{t("inactive")}</option>
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
                  {t("id")}
                </th>
                <th className="px-4 py-3.5 text-start text-xs font-semibold uppercase tracking-wider text-muted">
                  {t("trainerName")}
                </th>
                <th className="px-4 py-3.5 text-start text-xs font-semibold uppercase tracking-wider text-muted">
                  {t("department")}
                </th>
                <th className="px-4 py-3.5 text-start text-xs font-semibold uppercase tracking-wider text-muted">
                  {t("specialization")}
                </th>
                <th className="px-4 py-3.5 text-start text-xs font-semibold uppercase tracking-wider text-muted">
                  {t("courses")}
                </th>
                <th className="px-4 py-3.5 text-start text-xs font-semibold uppercase tracking-wider text-muted">
                  {t("rating")}
                </th>
                <th className="px-4 py-3.5 text-start text-xs font-semibold uppercase tracking-wider text-muted">
                  {t("status")}
                </th>
                <th className="px-4 py-3.5 text-start text-xs font-semibold uppercase tracking-wider text-muted">
                  {t("contact")}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {paginated.map((trainer) => {
                const statusCfg = getStatusConfig(trainer.status);
                return (
                  <tr
                    key={trainer.id}
                    className="transition-colors hover:bg-white/30"
                  >
                    <td className="whitespace-nowrap px-4 py-3.5 text-sm font-medium text-teal-600">
                      {trainer.id}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-teal-100 text-sm font-bold text-teal-700">
                          {trainer.name.charAt(0)}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-foreground">
                            {trainer.name}
                          </p>
                          <p className="text-xs text-muted">{trainer.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-4 py-3.5 text-sm text-foreground">
                      {trainer.department}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3.5 text-sm text-muted">
                      {trainer.specialization}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3.5 text-sm text-foreground">
                      {trainer.coursesCount}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3.5">
                      {renderStars(trainer.rating)}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3.5">
                      <span
                        className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${statusCfg.bg} ${statusCfg.text}`}
                      >
                        {statusCfg.label}
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-4 py-3.5">
                      <div className="flex items-center gap-2">
                        <button
                          title={trainer.email}
                          aria-label={`إرسال بريد إلكتروني إلى ${trainer.name}`}
                          className="rounded-lg bg-teal-50 p-2 text-teal-600 transition-colors hover:bg-teal-100 hover:text-teal-700"
                        >
                          <Mail className="h-5 w-5" />
                        </button>
                        <button
                          title={trainer.phone}
                          aria-label={`الاتصال بـ ${trainer.name}`}
                          className="rounded-lg bg-mint-50 p-2 text-mint-700 transition-colors hover:bg-mint-100"
                        >
                          <Phone className="h-5 w-5" />
                        </button>
                      </div>
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
            <Users className="mb-3 h-12 w-12 text-muted/40" />
            <p className="text-sm text-muted">{t("noResults")}</p>
          </div>
        )}
      </div>
    </div>
  );
}
