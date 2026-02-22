"use client";

import { useTranslations } from "next-intl";
import { PageHeader } from "@/components/shared/page-header";
import { StatCard } from "@/components/ui/stat-card";
import {
  Users,
  UserCheck,
  UserX,
  CalendarDays,
  Plus,
  Clock,
  CheckCircle2,
  XCircle,
  Briefcase,
  Award,
  Star,
} from "lucide-react";

interface LeaveRequest {
  id: string;
  employeeName: string;
  department: string;
  type: string;
  startDate: string;
  endDate: string;
  days: number;
  status: "معلق" | "معتمد" | "مرفوض";
}

const leaveRequests: LeaveRequest[] = [
  {
    id: "LR-001",
    employeeName: "م. فهد الدوسري",
    department: "قسم الحاسب الآلي",
    type: "إجازة اضطرارية",
    startDate: "2024-02-01",
    endDate: "2024-02-03",
    days: 3,
    status: "معلق",
  },
  {
    id: "LR-002",
    employeeName: "د. سارة العمري",
    department: "قسم إدارة الأعمال",
    type: "إجازة سنوية",
    startDate: "2024-02-10",
    endDate: "2024-02-20",
    days: 10,
    status: "معتمد",
  },
  {
    id: "LR-003",
    employeeName: "أ. محمد الشهري",
    department: "قسم الكهرباء",
    type: "إجازة مرضية",
    startDate: "2024-01-28",
    endDate: "2024-01-30",
    days: 2,
    status: "معتمد",
  },
  {
    id: "LR-004",
    employeeName: "م. عبدالرحمن الغامدي",
    department: "قسم الميكانيكا",
    type: "إجازة سنوية",
    startDate: "2024-02-15",
    endDate: "2024-02-25",
    days: 10,
    status: "معلق",
  },
  {
    id: "LR-005",
    employeeName: "د. نورة القحطاني",
    department: "قسم الحاسب الآلي",
    type: "إجازة اضطرارية",
    startDate: "2024-02-05",
    endDate: "2024-02-06",
    days: 1,
    status: "مرفوض",
  },
];

const evaluationSummary = [
  { rating: "ممتاز", count: 28, percentage: 32, color: "bg-teal-500" },
  { rating: "جيد جدا", count: 35, percentage: 40, color: "bg-teal-600" },
  { rating: "جيد", count: 16, percentage: 18, color: "bg-amber-500" },
  { rating: "مقبول", count: 6, percentage: 7, color: "bg-red-400" },
  { rating: "ضعيف", count: 2, percentage: 3, color: "bg-red-500" },
];

export default function HRPage() {
  const t = useTranslations("nav");

  return (
    <div className="animate-fade-in space-y-4 md:space-y-6">
      <PageHeader
        title={t("hr")}
        description="إدارة شؤون الموظفين والإجازات والتقييمات"
        actions={
          <button className="flex items-center gap-2 rounded-lg bg-teal-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-teal-700 active:scale-[0.98]">
            <Plus className="h-4 w-4" />
            إضافة موظف
          </button>
        }
      />

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3 md:gap-4 lg:grid-cols-4">
        <StatCard
          title="إجمالي الموظفين"
          value="87"
          icon={Users}
          trend={{ value: 3, isPositive: true }}
          gradient="from-teal-600 to-teal-700"
        />
        <StatCard
          title="على رأس العمل"
          value="79"
          icon={UserCheck}
          gradient="from-teal-500 to-teal-600"
        />
        <StatCard
          title="في إجازة"
          value="5"
          icon={UserX}
          gradient="from-amber-500 to-amber-600"
        />
        <StatCard
          title="طلبات معلقة"
          value="8"
          icon={CalendarDays}
          gradient="from-red-500 to-red-600"
        />
      </div>

      <div className="grid grid-cols-1 gap-4 md:gap-6 lg:grid-cols-3">
        {/* Leave Requests Table */}
        <div className="glass-card lg:col-span-2 p-4 md:p-6">
          <h3 className="mb-3 flex items-center gap-2 text-base font-semibold text-foreground md:mb-4 md:text-lg">
            <CalendarDays className="h-5 w-5 text-teal-600" />
            طلبات الإجازات
          </h3>
          <div className="overflow-x-auto">
            <table className="min-w-[600px] w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="px-3 py-3 text-start text-sm font-semibold text-muted md:px-4">الموظف</th>
                  <th className="px-4 py-3 text-start text-sm font-semibold text-muted">القسم</th>
                  <th className="px-4 py-3 text-start text-sm font-semibold text-muted">النوع</th>
                  <th className="px-4 py-3 text-start text-sm font-semibold text-muted">المدة</th>
                  <th className="px-4 py-3 text-start text-sm font-semibold text-muted">الحالة</th>
                  <th className="px-4 py-3 text-start text-sm font-semibold text-muted">الإجراء</th>
                </tr>
              </thead>
              <tbody>
                {leaveRequests.map((req) => (
                  <tr key={req.id} className="border-b border-border last:border-0 transition-colors duration-200 hover:bg-background/50">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-teal-600/10 text-sm font-bold text-teal-600">
                          {req.employeeName.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                        </div>
                        <span className="text-sm font-medium text-foreground">{req.employeeName}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-muted">{req.department}</td>
                    <td className="px-4 py-3">
                      <span className="rounded-full bg-teal-600/10 px-2.5 py-1 text-xs font-medium text-teal-600">
                        {req.type}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-muted">
                      {req.startDate} - {req.endDate} ({req.days} أيام)
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`flex w-fit items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium ${
                          req.status === "معتمد"
                            ? "bg-teal-500/10 text-teal-500"
                            : req.status === "مرفوض"
                              ? "bg-red-500/10 text-red-500"
                              : "bg-amber-500/10 text-amber-500"
                        }`}
                      >
                        {req.status === "معتمد" && <CheckCircle2 className="h-3 w-3" />}
                        {req.status === "مرفوض" && <XCircle className="h-3 w-3" />}
                        {req.status === "معلق" && <Clock className="h-3 w-3" />}
                        {req.status}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      {req.status === "معلق" && (
                        <div className="flex gap-2">
                          <button className="rounded-md bg-teal-500 px-3 py-1 text-xs text-white transition-colors hover:bg-teal-600 active:scale-[0.98]">
                            موافقة
                          </button>
                          <button className="rounded-md bg-red-500 px-3 py-1 text-xs text-white transition-colors hover:bg-red-600 active:scale-[0.98]">
                            رفض
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Evaluation Summary */}
        <div className="space-y-4 md:space-y-6">
          <div className="glass-card p-4 md:p-6">
            <h3 className="mb-3 flex items-center gap-2 text-base font-semibold text-foreground md:mb-4 md:text-lg">
              <Award className="h-5 w-5 text-teal-600" />
              ملخص التقييمات
            </h3>
            <div className="space-y-3">
              {evaluationSummary.map((item) => (
                <div key={item.rating}>
                  <div className="mb-1 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Star className="h-3.5 w-3.5 text-amber-500" />
                      <span className="text-sm font-medium text-foreground">{item.rating}</span>
                    </div>
                    <span className="text-sm text-muted">{item.count} موظف</span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-background">
                    <div
                      className={`h-2 rounded-full transition-all duration-500 ${item.color}`}
                      style={{ width: `${item.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 rounded-lg bg-background p-3 text-center">
              <p className="text-xs text-muted">متوسط التقييم العام</p>
              <p className="text-xl font-bold text-teal-600">4.1 / 5.0</p>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="glass-card p-4 md:p-6">
            <h3 className="mb-3 flex items-center gap-2 text-base font-semibold text-foreground md:mb-4 md:text-lg">
              <Briefcase className="h-5 w-5 text-teal-600" />
              إحصائيات سريعة
            </h3>
            <div className="space-y-3">
              {[
                { label: "مدربون", value: 62, color: "text-teal-600" },
                { label: "إداريون", value: 15, color: "text-teal-500" },
                { label: "فنيون", value: 10, color: "text-amber-500" },
                { label: "متعاقدون", value: 8, color: "text-red-500" },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="flex items-center justify-between rounded-lg border border-border p-3 transition-all duration-200"
                >
                  <span className="text-sm text-foreground">{stat.label}</span>
                  <span className={`text-lg font-bold ${stat.color}`}>{stat.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
