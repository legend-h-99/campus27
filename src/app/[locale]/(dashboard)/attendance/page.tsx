"use client";

import { useState, useEffect, useCallback } from "react";
import { useTranslations, useLocale } from "next-intl";
import { PageHeader } from "@/components/shared/page-header";
import {
  Search,
  Filter,
  Download,
  Calendar,
  UserCheck,
  UserX,
  Clock,
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
  CheckCircle,
  XCircle,
  MinusCircle,
  BarChart3,
  RefreshCw,
} from "lucide-react";

// ---------- Types ----------
interface AttendanceRecord {
  id: string;
  traineeId: string;
  traineeName: string;
  studentNumber: string;
  department: string;
  departmentId: string;
  course: string;
  courseCode: string;
  date: string;
  status: "present" | "absent" | "late" | "excused";
  time?: string;
  excuse?: string;
  room?: string;
}

interface AttendanceStats {
  total: number;
  present: number;
  absent: number;
  late: number;
  excused: number;
  rate: number;
}

interface DepartmentOption {
  id: string;
  name: string;
}

interface PaginationInfo {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

// ---------- Component ----------
export default function AttendancePage() {
  const t = useTranslations("attendance");
  const locale = useLocale();
  const isAr = locale === "ar";

  const [records, setRecords] = useState<AttendanceRecord[]>([]);
  const [stats, setStats] = useState<AttendanceStats>({
    total: 0,
    present: 0,
    absent: 0,
    late: 0,
    excused: 0,
    rate: 0,
  });
  const [departments, setDepartments] = useState<DepartmentOption[]>([]);
  const [pagination, setPagination] = useState<PaginationInfo>({
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0,
  });
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [departmentFilter, setDepartmentFilter] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedDate, setSelectedDate] = useState("");

  // Fetch attendance data from API
  const fetchAttendance = useCallback(async () => {
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
      if (selectedDate) params.set("date", selectedDate);

      const res = await fetch(`/api/attendance?${params.toString()}`);
      const data = await res.json();

      if (data.success) {
        setRecords(data.data);
        setStats(data.stats);
        setDepartments(data.departments || []);
        setPagination(data.pagination);
      }
    } catch (error) {
      console.error("Failed to fetch attendance:", error);
    } finally {
      setLoading(false);
    }
  }, [locale, currentPage, searchQuery, statusFilter, departmentFilter, selectedDate]);

  useEffect(() => {
    fetchAttendance();
  }, [fetchAttendance]);

  // Debounced search
  const [searchTimeout, setSearchTimeout] = useState<NodeJS.Timeout | null>(null);
  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    if (searchTimeout) clearTimeout(searchTimeout);
    const timeout = setTimeout(() => {
      setCurrentPage(1);
    }, 300);
    setSearchTimeout(timeout);
  };

  // Status config
  function getStatusConfig(status: AttendanceRecord["status"]) {
    switch (status) {
      case "present":
        return {
          label: t("present"),
          icon: CheckCircle,
          bg: "bg-emerald-50",
          text: "text-emerald-600",
          border: "border-emerald-200",
        };
      case "absent":
        return {
          label: t("absent"),
          icon: XCircle,
          bg: "bg-red-50",
          text: "text-red-600",
          border: "border-red-200",
        };
      case "late":
        return {
          label: t("late"),
          icon: Clock,
          bg: "bg-amber-50",
          text: "text-amber-600",
          border: "border-amber-200",
        };
      case "excused":
        return {
          label: t("excused"),
          icon: MinusCircle,
          bg: "bg-blue-50",
          text: "text-blue-600",
          border: "border-blue-200",
        };
    }
  }

  return (
    <div className="animate-fade-in">
      <PageHeader
        title={t("title")}
        description={
          isAr ? "متابعة حضور وغياب المتدربين" : "Track trainee attendance and absences"
        }
        actions={
          <div className="flex items-center gap-2">
            <button
              onClick={() => fetchAttendance()}
              className="inline-flex items-center gap-2 rounded-lg border border-border px-3 py-2.5 text-sm font-medium text-muted transition-colors hover:bg-background"
            >
              <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
            </button>
            <button className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-teal-600 to-aqua-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition-all hover:from-teal-700 hover:to-aqua-700">
              <Calendar className="h-4 w-4" />
              {t("recordAttendance")}
            </button>
            <button className="inline-flex items-center gap-2 rounded-lg border border-border px-4 py-2.5 text-sm font-medium text-muted transition-colors hover:bg-background">
              <Download className="h-4 w-4" />
              {isAr ? "تصدير" : "Export"}
            </button>
          </div>
        }
      />

      {/* Stats Cards */}
      <div className="mb-4 grid grid-cols-2 gap-3 md:mb-6 md:gap-4 lg:grid-cols-5">
        {/* Total */}
        <div className="glass-card flex items-center gap-3 p-3 md:p-4">
          <div className="rounded-xl bg-teal-100 p-2.5">
            <BarChart3 className="h-5 w-5 text-teal-600" />
          </div>
          <div className="min-w-0">
            <p className="truncate text-[11px] text-muted">
              {isAr ? "إجمالي السجلات" : "Total Records"}
            </p>
            <p className="text-xl font-bold text-foreground">
              {loading ? "..." : stats.total.toLocaleString()}
            </p>
          </div>
        </div>

        {/* Present */}
        <div className="glass-card flex items-center gap-3 p-3 md:p-4">
          <div className="rounded-xl bg-emerald-100 p-2.5">
            <UserCheck className="h-5 w-5 text-emerald-600" />
          </div>
          <div className="min-w-0">
            <p className="truncate text-[11px] text-muted">{t("present")}</p>
            <p className="text-xl font-bold text-emerald-600">
              {loading ? "..." : stats.present.toLocaleString()}
            </p>
          </div>
        </div>

        {/* Absent */}
        <div className="glass-card flex items-center gap-3 p-3 md:p-4">
          <div className="rounded-xl bg-red-100 p-2.5">
            <UserX className="h-5 w-5 text-red-600" />
          </div>
          <div className="min-w-0">
            <p className="truncate text-[11px] text-muted">{t("absent")}</p>
            <p className="text-xl font-bold text-red-600">
              {loading ? "..." : stats.absent.toLocaleString()}
            </p>
          </div>
        </div>

        {/* Late */}
        <div className="glass-card flex items-center gap-3 p-3 md:p-4">
          <div className="rounded-xl bg-amber-100 p-2.5">
            <Clock className="h-5 w-5 text-amber-600" />
          </div>
          <div className="min-w-0">
            <p className="truncate text-[11px] text-muted">{t("late")}</p>
            <p className="text-xl font-bold text-amber-600">
              {loading ? "..." : stats.late.toLocaleString()}
            </p>
          </div>
        </div>

        {/* Attendance Rate */}
        <div className="glass-card col-span-2 flex items-center gap-3 p-3 md:p-4 lg:col-span-1">
          <div className="rounded-xl bg-teal-100 p-2.5">
            <AlertTriangle className="h-5 w-5 text-teal-600" />
          </div>
          <div className="min-w-0">
            <p className="truncate text-[11px] text-muted">{t("attendanceRate")}</p>
            <p className="text-xl font-bold text-teal-600">
              {loading ? "..." : `${stats.rate}%`}
            </p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="glass-card mb-4 p-3 md:mb-6 md:p-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          {/* Search */}
          <div className="relative flex-1 sm:max-w-xs">
            <Search className="absolute start-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
            <input
              type="text"
              placeholder={
                isAr ? "ابحث بالاسم أو الرقم..." : "Search by name or number..."
              }
              value={searchQuery}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="w-full rounded-lg border border-border bg-background py-2.5 pe-3 ps-10 text-sm outline-none transition-colors focus:border-teal-500 focus:ring-1 focus:ring-teal-500/20"
            />
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Date Picker */}
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => {
                setSelectedDate(e.target.value);
                setCurrentPage(1);
              }}
              className="rounded-lg border border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-teal-500"
            />

            {/* Status Filter */}
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-muted" />
              <select
                value={statusFilter}
                onChange={(e) => {
                  setStatusFilter(e.target.value);
                  setCurrentPage(1);
                }}
                className="rounded-lg border border-border bg-background px-3 py-2.5 text-sm focus:border-teal-500 focus:outline-none"
              >
                <option value="all">{isAr ? "كل الحالات" : "All Statuses"}</option>
                <option value="present">{t("present")}</option>
                <option value="absent">{t("absent")}</option>
                <option value="late">{t("late")}</option>
                <option value="excused">{t("excused")}</option>
              </select>
            </div>

            {/* Department Filter */}
            <select
              value={departmentFilter}
              onChange={(e) => {
                setDepartmentFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="rounded-lg border border-border bg-background px-3 py-2.5 text-sm focus:border-teal-500 focus:outline-none"
            >
              <option value="all">{isAr ? "كل الأقسام" : "All Departments"}</option>
              {departments.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.name}
                </option>
              ))}
            </select>

            {/* Clear filters */}
            {(searchQuery || statusFilter !== "all" || departmentFilter !== "all" || selectedDate) && (
              <button
                onClick={() => {
                  setSearchQuery("");
                  setStatusFilter("all");
                  setDepartmentFilter("all");
                  setSelectedDate("");
                  setCurrentPage(1);
                }}
                className="rounded-lg border border-red-200 bg-red-50 px-3 py-2.5 text-xs font-medium text-red-600 transition-colors hover:bg-red-100"
              >
                {isAr ? "مسح الفلاتر" : "Clear Filters"}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Attendance Table */}
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
                  <th className="px-4 py-3 text-start text-xs font-semibold text-muted">
                    {isAr ? "الرقم" : "#"}
                  </th>
                  <th className="px-4 py-3 text-start text-xs font-semibold text-muted">
                    {isAr ? "المتدرب" : "Trainee"}
                  </th>
                  <th className="px-4 py-3 text-start text-xs font-semibold text-muted">
                    {isAr ? "القسم" : "Department"}
                  </th>
                  <th className="px-4 py-3 text-start text-xs font-semibold text-muted">
                    {isAr ? "المقرر" : "Course"}
                  </th>
                  <th className="px-4 py-3 text-start text-xs font-semibold text-muted">
                    {t("date")}
                  </th>
                  <th className="px-4 py-3 text-center text-xs font-semibold text-muted">
                    {isAr ? "الحالة" : "Status"}
                  </th>
                  <th className="px-4 py-3 text-start text-xs font-semibold text-muted">
                    {isAr ? "الوقت" : "Time"}
                  </th>
                  <th className="px-4 py-3 text-start text-xs font-semibold text-muted">
                    {isAr ? "ملاحظات" : "Notes"}
                  </th>
                </tr>
              </thead>
              <tbody>
                {records.map((record, idx) => {
                  const cfg = getStatusConfig(record.status);
                  const Icon = cfg.icon;
                  return (
                    <tr
                      key={record.id}
                      className="border-b border-border/50 transition-colors hover:bg-slate-50/50"
                    >
                      <td className="px-4 py-3 text-sm text-muted">
                        {(currentPage - 1) * pagination.limit + idx + 1}
                      </td>
                      <td className="px-4 py-3">
                        <div>
                          <p className="text-sm font-medium text-foreground">
                            {record.traineeName}
                          </p>
                          <p className="text-[11px] text-muted" dir="ltr">
                            {record.studentNumber}
                          </p>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm text-muted">
                        {record.department}
                      </td>
                      <td className="px-4 py-3">
                        <div>
                          <p className="text-sm text-muted">{record.course}</p>
                          <p className="text-[10px] text-muted/60" dir="ltr">
                            {record.courseCode}
                          </p>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm text-muted" dir="ltr">
                        {record.date}
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span
                          className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-[11px] font-medium ${cfg.bg} ${cfg.text} ${cfg.border}`}
                        >
                          <Icon className="h-3 w-3" />
                          {cfg.label}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-muted" dir="ltr">
                        {record.time || "--"}
                      </td>
                      <td className="px-4 py-3 text-sm text-muted">
                        {record.excuse || (record.room ? `${isAr ? "قاعة" : "Room"} ${record.room}` : "--")}
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
                ? `عرض ${(currentPage - 1) * pagination.limit + 1} - ${Math.min(
                    currentPage * pagination.limit,
                    pagination.total
                  )} من ${pagination.total.toLocaleString()}`
                : `Showing ${(currentPage - 1) * pagination.limit + 1} - ${Math.min(
                    currentPage * pagination.limit,
                    pagination.total
                  )} of ${pagination.total.toLocaleString()}`}
            </p>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="rounded-lg p-2 text-muted transition-colors hover:bg-background disabled:opacity-30"
              >
                {isAr ? (
                  <ChevronRight className="h-4 w-4" />
                ) : (
                  <ChevronLeft className="h-4 w-4" />
                )}
              </button>

              {/* Page numbers */}
              <div className="flex items-center gap-1">
                {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                  let pageNum: number;
                  if (pagination.totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (currentPage <= 3) {
                    pageNum = i + 1;
                  } else if (currentPage >= pagination.totalPages - 2) {
                    pageNum = pagination.totalPages - 4 + i;
                  } else {
                    pageNum = currentPage - 2 + i;
                  }
                  return (
                    <button
                      key={pageNum}
                      onClick={() => setCurrentPage(pageNum)}
                      className={`min-w-[32px] rounded-lg px-2 py-1 text-xs font-medium transition-colors ${
                        currentPage === pageNum
                          ? "bg-teal-600 text-white"
                          : "text-muted hover:bg-background"
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
              </div>

              <button
                onClick={() =>
                  setCurrentPage(Math.min(pagination.totalPages, currentPage + 1))
                }
                disabled={currentPage === pagination.totalPages}
                className="rounded-lg p-2 text-muted transition-colors hover:bg-background disabled:opacity-30"
              >
                {isAr ? (
                  <ChevronLeft className="h-4 w-4" />
                ) : (
                  <ChevronRight className="h-4 w-4" />
                )}
              </button>
            </div>
          </div>
        )}

        {/* Empty state */}
        {!loading && records.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16">
            <Calendar className="mb-3 h-12 w-12 text-muted/40" />
            <p className="text-sm text-muted">
              {isAr ? "لا توجد سجلات حضور" : "No attendance records found"}
            </p>
            {(searchQuery || statusFilter !== "all" || departmentFilter !== "all" || selectedDate) && (
              <button
                onClick={() => {
                  setSearchQuery("");
                  setStatusFilter("all");
                  setDepartmentFilter("all");
                  setSelectedDate("");
                  setCurrentPage(1);
                }}
                className="mt-3 text-sm text-teal-600 underline hover:text-teal-700"
              >
                {isAr ? "مسح الفلاتر والمحاولة مرة أخرى" : "Clear filters and try again"}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
