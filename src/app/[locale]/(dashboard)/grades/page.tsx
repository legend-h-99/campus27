"use client";

import { useState, useEffect, useCallback } from "react";
import { useTranslations, useLocale } from "next-intl";
import { PageHeader } from "@/components/shared/page-header";
import {
  Search,
  Filter,
  Download,
  FileText,
  CheckCircle,
  XCircle,
  Clock,
  Send,
  ChevronLeft,
  ChevronRight,
  BarChart3,
  BookOpen,
  Award,
  AlertTriangle,
  RefreshCw,
} from "lucide-react";

// ---------- Types ----------
interface GradeRecord {
  id: string;
  enrollmentId: string;
  traineeId: string;
  traineeName: string;
  studentNumber: string;
  department: string;
  departmentId: string;
  course: string;
  courseCode: string;
  courseId: string;
  semester: string;
  midtermGrade: number | null;
  finalGrade: number | null;
  assignmentsGrade: number | null;
  attendanceGrade: number | null;
  totalGrade: number | null;
  letterGrade: string | null;
  status: string;
  approvedBy: string | null;
  approvedDate: string | null;
  remarks: string | null;
  updatedAt: string;
}

interface GradeStats {
  total: number;
  draft: number;
  submitted: number;
  approved: number;
  rejected: number;
  average: number;
}

interface FilterOption {
  id: string;
  name: string;
  code?: string;
}

interface PaginationInfo {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

// ---------- Component ----------
export default function GradesPage() {
  const t = useTranslations("grades");
  const locale = useLocale();
  const isAr = locale === "ar";

  const [grades, setGrades] = useState<GradeRecord[]>([]);
  const [stats, setStats] = useState<GradeStats>({
    total: 0, draft: 0, submitted: 0, approved: 0, rejected: 0, average: 0,
  });
  const [departments, setDepartments] = useState<FilterOption[]>([]);
  const [courses, setCourses] = useState<FilterOption[]>([]);
  const [pagination, setPagination] = useState<PaginationInfo>({
    page: 1, limit: 20, total: 0, totalPages: 0,
  });
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [departmentFilter, setDepartmentFilter] = useState("all");
  const [courseFilter, setCourseFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);

  // Fetch grades
  const fetchGrades = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: "20",
        locale,
      });
      if (searchQuery) params.set("search", searchQuery);
      if (statusFilter !== "all") params.set("status", statusFilter);
      if (departmentFilter !== "all") params.set("department", departmentFilter);
      if (courseFilter !== "all") params.set("course", courseFilter);

      const res = await fetch(`/api/grades?${params.toString()}`);
      const data = await res.json();

      if (data.success) {
        setGrades(data.data);
        setStats(data.stats);
        setDepartments(data.departments || []);
        setCourses(data.courses || []);
        setPagination(data.pagination);
      }
    } catch (error) {
      console.error("Failed to fetch grades:", error);
    } finally {
      setLoading(false);
    }
  }, [locale, currentPage, searchQuery, statusFilter, departmentFilter, courseFilter]);

  useEffect(() => {
    fetchGrades();
  }, [fetchGrades]);

  // Debounced search
  const [searchTimeout, setSearchTimeout] = useState<NodeJS.Timeout | null>(null);
  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    if (searchTimeout) clearTimeout(searchTimeout);
    const timeout = setTimeout(() => setCurrentPage(1), 300);
    setSearchTimeout(timeout);
  };

  // Status config
  function getStatusConfig(status: string) {
    switch (status) {
      case "draft":
        return { label: isAr ? "مسودة" : "Draft", icon: FileText, bg: "bg-slate-50", text: "text-slate-600", border: "border-slate-200" };
      case "submitted":
        return { label: t("pendingApproval"), icon: Send, bg: "bg-amber-50", text: "text-amber-600", border: "border-amber-200" };
      case "approved":
        return { label: t("approved"), icon: CheckCircle, bg: "bg-emerald-50", text: "text-emerald-600", border: "border-emerald-200" };
      case "rejected":
        return { label: t("rejected"), icon: XCircle, bg: "bg-red-50", text: "text-red-600", border: "border-red-200" };
      default:
        return { label: status, icon: Clock, bg: "bg-slate-50", text: "text-slate-600", border: "border-slate-200" };
    }
  }

  // Letter grade color
  function getGradeColor(grade: number | null) {
    if (grade === null) return "text-muted";
    if (grade >= 90) return "text-emerald-600 font-bold";
    if (grade >= 80) return "text-blue-600 font-semibold";
    if (grade >= 70) return "text-amber-600";
    if (grade >= 60) return "text-orange-600";
    return "text-red-600 font-semibold";
  }

  function getLetterColor(letter: string | null) {
    if (!letter) return "text-muted";
    if (letter.startsWith("A")) return "text-emerald-600";
    if (letter.startsWith("B")) return "text-blue-600";
    if (letter.startsWith("C")) return "text-amber-600";
    if (letter.startsWith("D")) return "text-orange-600";
    return "text-red-600";
  }

  return (
    <div className="animate-fade-in">
      <PageHeader
        title={t("title")}
        description={isAr ? "عرض وإدارة درجات المتدربين في جميع المقررات" : "View and manage trainee grades across all courses"}
        actions={
          <div className="flex items-center gap-2">
            <button onClick={() => fetchGrades()} className="inline-flex items-center gap-2 rounded-lg border border-border px-3 py-2.5 text-sm font-medium text-muted transition-colors hover:bg-background">
              <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
            </button>
            <button className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-teal-600 to-aqua-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition-all hover:from-teal-700 hover:to-aqua-700">
              <FileText className="h-4 w-4" />
              {t("enterGrades")}
            </button>
            <button className="inline-flex items-center gap-2 rounded-lg border border-border px-4 py-2.5 text-sm font-medium text-muted transition-colors hover:bg-background">
              <Download className="h-4 w-4" />
              {isAr ? "تصدير" : "Export"}
            </button>
          </div>
        }
      />

      {/* Stats Cards */}
      <div className="mb-4 grid grid-cols-2 gap-3 md:mb-6 md:gap-4 lg:grid-cols-6">
        <div className="glass-card flex items-center gap-3 p-3 md:p-4">
          <div className="rounded-xl bg-teal-100 p-2.5"><BarChart3 className="h-5 w-5 text-teal-600" /></div>
          <div className="min-w-0">
            <p className="truncate text-[11px] text-muted">{isAr ? "إجمالي الدرجات" : "Total Grades"}</p>
            <p className="text-xl font-bold text-foreground">{loading ? "..." : stats.total.toLocaleString()}</p>
          </div>
        </div>

        <div className="glass-card flex items-center gap-3 p-3 md:p-4">
          <div className="rounded-xl bg-slate-100 p-2.5"><FileText className="h-5 w-5 text-slate-600" /></div>
          <div className="min-w-0">
            <p className="truncate text-[11px] text-muted">{isAr ? "مسودة" : "Draft"}</p>
            <p className="text-xl font-bold text-slate-600">{loading ? "..." : stats.draft.toLocaleString()}</p>
          </div>
        </div>

        <div className="glass-card flex items-center gap-3 p-3 md:p-4">
          <div className="rounded-xl bg-amber-100 p-2.5"><Send className="h-5 w-5 text-amber-600" /></div>
          <div className="min-w-0">
            <p className="truncate text-[11px] text-muted">{t("pendingApproval")}</p>
            <p className="text-xl font-bold text-amber-600">{loading ? "..." : stats.submitted.toLocaleString()}</p>
          </div>
        </div>

        <div className="glass-card flex items-center gap-3 p-3 md:p-4">
          <div className="rounded-xl bg-emerald-100 p-2.5"><CheckCircle className="h-5 w-5 text-emerald-600" /></div>
          <div className="min-w-0">
            <p className="truncate text-[11px] text-muted">{t("approved")}</p>
            <p className="text-xl font-bold text-emerald-600">{loading ? "..." : stats.approved.toLocaleString()}</p>
          </div>
        </div>

        <div className="glass-card flex items-center gap-3 p-3 md:p-4">
          <div className="rounded-xl bg-red-100 p-2.5"><XCircle className="h-5 w-5 text-red-600" /></div>
          <div className="min-w-0">
            <p className="truncate text-[11px] text-muted">{t("rejected")}</p>
            <p className="text-xl font-bold text-red-600">{loading ? "..." : stats.rejected.toLocaleString()}</p>
          </div>
        </div>

        <div className="glass-card col-span-2 flex items-center gap-3 p-3 md:p-4 lg:col-span-1">
          <div className="rounded-xl bg-blue-100 p-2.5"><Award className="h-5 w-5 text-blue-600" /></div>
          <div className="min-w-0">
            <p className="truncate text-[11px] text-muted">{isAr ? "متوسط الدرجات" : "Average Grade"}</p>
            <p className="text-xl font-bold text-blue-600">{loading ? "..." : stats.average}</p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="glass-card mb-4 p-3 md:mb-6 md:p-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative flex-1 sm:max-w-xs">
            <Search className="absolute start-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
            <input type="text" placeholder={isAr ? "ابحث بالاسم أو الرقم..." : "Search by name or number..."} value={searchQuery} onChange={(e) => handleSearchChange(e.target.value)} className="w-full rounded-lg border border-border bg-background py-2.5 pe-3 ps-10 text-sm outline-none transition-colors focus:border-teal-500 focus:ring-1 focus:ring-teal-500/20" />
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-muted" />
              <select value={statusFilter} onChange={(e) => { setStatusFilter(e.target.value); setCurrentPage(1); }} className="rounded-lg border border-border bg-background px-3 py-2.5 text-sm focus:border-teal-500 focus:outline-none">
                <option value="all">{isAr ? "كل الحالات" : "All Statuses"}</option>
                <option value="draft">{isAr ? "مسودة" : "Draft"}</option>
                <option value="submitted">{t("pendingApproval")}</option>
                <option value="approved">{t("approved")}</option>
                <option value="rejected">{t("rejected")}</option>
              </select>
            </div>

            <select value={departmentFilter} onChange={(e) => { setDepartmentFilter(e.target.value); setCurrentPage(1); }} className="rounded-lg border border-border bg-background px-3 py-2.5 text-sm focus:border-teal-500 focus:outline-none">
              <option value="all">{isAr ? "كل الأقسام" : "All Departments"}</option>
              {departments.map((d) => (<option key={d.id} value={d.id}>{d.name}</option>))}
            </select>

            <select value={courseFilter} onChange={(e) => { setCourseFilter(e.target.value); setCurrentPage(1); }} className="rounded-lg border border-border bg-background px-3 py-2.5 text-sm focus:border-teal-500 focus:outline-none">
              <option value="all">{isAr ? "كل المقررات" : "All Courses"}</option>
              {courses.map((c) => (<option key={c.id} value={c.id}>{c.code} - {c.name}</option>))}
            </select>

            {(searchQuery || statusFilter !== "all" || departmentFilter !== "all" || courseFilter !== "all") && (
              <button onClick={() => { setSearchQuery(""); setStatusFilter("all"); setDepartmentFilter("all"); setCourseFilter("all"); setCurrentPage(1); }} className="rounded-lg border border-red-200 bg-red-50 px-3 py-2.5 text-xs font-medium text-red-600 transition-colors hover:bg-red-100">
                {isAr ? "مسح الفلاتر" : "Clear Filters"}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Grades Table */}
      <div className="glass-card overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-teal-200 border-t-teal-600" />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border bg-slate-50/50">
                  <th className="px-3 py-3 text-start text-xs font-semibold text-muted">{isAr ? "#" : "#"}</th>
                  <th className="px-3 py-3 text-start text-xs font-semibold text-muted">{isAr ? "المتدرب" : "Trainee"}</th>
                  <th className="px-3 py-3 text-start text-xs font-semibold text-muted">{isAr ? "المقرر" : "Course"}</th>
                  <th className="px-3 py-3 text-center text-xs font-semibold text-muted">{t("midterm")}</th>
                  <th className="px-3 py-3 text-center text-xs font-semibold text-muted">{t("final")}</th>
                  <th className="px-3 py-3 text-center text-xs font-semibold text-muted">{t("assignments")}</th>
                  <th className="px-3 py-3 text-center text-xs font-semibold text-muted">{t("attendanceGrade")}</th>
                  <th className="px-3 py-3 text-center text-xs font-semibold text-muted">{t("totalGrade")}</th>
                  <th className="px-3 py-3 text-center text-xs font-semibold text-muted">{t("letterGrade")}</th>
                  <th className="px-3 py-3 text-center text-xs font-semibold text-muted">{isAr ? "الحالة" : "Status"}</th>
                </tr>
              </thead>
              <tbody>
                {grades.map((grade, idx) => {
                  const cfg = getStatusConfig(grade.status);
                  const Icon = cfg.icon;
                  return (
                    <tr key={grade.id} className="border-b border-border/50 transition-colors hover:bg-slate-50/50">
                      <td className="px-3 py-3 text-sm text-muted">{(currentPage - 1) * pagination.limit + idx + 1}</td>
                      <td className="px-3 py-3">
                        <div>
                          <p className="text-sm font-medium text-foreground">{grade.traineeName}</p>
                          <p className="text-[11px] text-muted" dir="ltr">{grade.studentNumber}</p>
                        </div>
                      </td>
                      <td className="px-3 py-3">
                        <div>
                          <p className="text-sm text-foreground">{grade.course}</p>
                          <p className="text-[10px] text-muted/60" dir="ltr">{grade.courseCode}</p>
                        </div>
                      </td>
                      <td className={`px-3 py-3 text-center text-sm ${getGradeColor(grade.midtermGrade)}`} dir="ltr">
                        {grade.midtermGrade !== null ? grade.midtermGrade : "--"}
                      </td>
                      <td className={`px-3 py-3 text-center text-sm ${getGradeColor(grade.finalGrade)}`} dir="ltr">
                        {grade.finalGrade !== null ? grade.finalGrade : "--"}
                      </td>
                      <td className={`px-3 py-3 text-center text-sm ${getGradeColor(grade.assignmentsGrade)}`} dir="ltr">
                        {grade.assignmentsGrade !== null ? grade.assignmentsGrade : "--"}
                      </td>
                      <td className={`px-3 py-3 text-center text-sm ${getGradeColor(grade.attendanceGrade)}`} dir="ltr">
                        {grade.attendanceGrade !== null ? grade.attendanceGrade : "--"}
                      </td>
                      <td className={`px-3 py-3 text-center text-sm ${getGradeColor(grade.totalGrade)}`} dir="ltr">
                        {grade.totalGrade !== null ? grade.totalGrade : "--"}
                      </td>
                      <td className={`px-3 py-3 text-center text-sm font-bold ${getLetterColor(grade.letterGrade)}`}>
                        {grade.letterGrade || "--"}
                      </td>
                      <td className="px-3 py-3 text-center">
                        <span className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-[11px] font-medium ${cfg.bg} ${cfg.text} ${cfg.border}`}>
                          <Icon className="h-3 w-3" />
                          {cfg.label}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {!loading && pagination.totalPages > 1 && (
          <div className="flex items-center justify-between border-t border-border px-4 py-3">
            <p className="text-xs text-muted">
              {isAr
                ? `عرض ${(currentPage - 1) * pagination.limit + 1} - ${Math.min(currentPage * pagination.limit, pagination.total)} من ${pagination.total.toLocaleString()}`
                : `Showing ${(currentPage - 1) * pagination.limit + 1} - ${Math.min(currentPage * pagination.limit, pagination.total)} of ${pagination.total.toLocaleString()}`}
            </p>
            <div className="flex items-center gap-1">
              <button onClick={() => setCurrentPage(Math.max(1, currentPage - 1))} disabled={currentPage === 1} className="rounded-lg p-2 text-muted transition-colors hover:bg-background disabled:opacity-30">
                {isAr ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
              </button>
              <div className="flex items-center gap-1">
                {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                  let pageNum: number;
                  if (pagination.totalPages <= 5) pageNum = i + 1;
                  else if (currentPage <= 3) pageNum = i + 1;
                  else if (currentPage >= pagination.totalPages - 2) pageNum = pagination.totalPages - 4 + i;
                  else pageNum = currentPage - 2 + i;
                  return (
                    <button key={pageNum} onClick={() => setCurrentPage(pageNum)} className={`min-w-[32px] rounded-lg px-2 py-1 text-xs font-medium transition-colors ${currentPage === pageNum ? "bg-teal-600 text-white" : "text-muted hover:bg-background"}`}>
                      {pageNum}
                    </button>
                  );
                })}
              </div>
              <button onClick={() => setCurrentPage(Math.min(pagination.totalPages, currentPage + 1))} disabled={currentPage === pagination.totalPages} className="rounded-lg p-2 text-muted transition-colors hover:bg-background disabled:opacity-30">
                {isAr ? <ChevronLeft className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
              </button>
            </div>
          </div>
        )}

        {/* Empty state */}
        {!loading && grades.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16">
            <BookOpen className="mb-3 h-12 w-12 text-muted/40" />
            <p className="text-sm text-muted">{isAr ? "لا توجد درجات مسجلة" : "No grades found"}</p>
            {(searchQuery || statusFilter !== "all" || departmentFilter !== "all" || courseFilter !== "all") && (
              <button onClick={() => { setSearchQuery(""); setStatusFilter("all"); setDepartmentFilter("all"); setCourseFilter("all"); setCurrentPage(1); }} className="mt-3 text-sm text-teal-600 underline hover:text-teal-700">
                {isAr ? "مسح الفلاتر والمحاولة مرة أخرى" : "Clear filters and try again"}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
