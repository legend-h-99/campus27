"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { StatCard } from "@/components/ui/stat-card";
import { AIInsightsPanel, AISmartBanner } from "@/components/ai/ai-insights";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Legend,
  AreaChart,
  Area,
} from "recharts";
import {
  Users,
  GraduationCap,
  Building2,
  BookOpen,
  TrendingUp,
  ClipboardCheck,
  DollarSign,
  Award,
  Calendar,
  UserCheck,
  Briefcase,
  MapPin,
  ArrowUpRight,
} from "lucide-react";

// --- Chart Data ---

const weeklyData = [
  { day: "الأحد", newTrainees: 65, admissionRequests: 40 },
  { day: "الاثنين", newTrainees: 85, admissionRequests: 55 },
  { day: "الثلاثاء", newTrainees: 70, admissionRequests: 45 },
  { day: "الأربعاء", newTrainees: 90, admissionRequests: 70 },
  { day: "الخميس", newTrainees: 75, admissionRequests: 50 },
  { day: "الجمعة", newTrainees: 95, admissionRequests: 80 },
  { day: "السبت", newTrainees: 60, admissionRequests: 35 },
];

const specializations = [
  { name: "الحاسب", value: 35, color: "#1BA9A0" },
  { name: "الكهرباء", value: 20, color: "#3BACC9" },
  { name: "الميكانيكا", value: 18, color: "#8DC4A8" },
  { name: "الإلكترونيات", value: 15, color: "#F59E0B" },
  { name: "الإدارة", value: 12, color: "#DC2626" },
];

const admissionStages = [
  { stage: "تقديم", value: 180 },
  { stage: "فرز", value: 142 },
  { stage: "مقابلة", value: 100 },
  { stage: "عرض", value: 60 },
  { stage: "مقبول", value: 45 },
];

const regionData = [
  { name: "الرياض", count: 420, max: 420 },
  { name: "مكة", count: 310, max: 420 },
  { name: "المدينة", count: 180, max: 420 },
  { name: "الشرقية", count: 165, max: 420 },
  { name: "عسير", count: 90, max: 420 },
  { name: "تبوك", count: 80, max: 420 },
];

const recentActivities = [
  { text: "تم اعتماد درجات قسم الحاسب الآلي", time: "منذ 5 دقائق", color: "bg-mint-500" },
  { text: "طلب إجازة جديد من م. فهد الدوسري", time: "منذ 15 دقيقة", color: "bg-warning" },
  { text: "تم إضافة 12 متدرب جديد", time: "منذ ساعة", color: "bg-teal-500" },
  { text: "تقرير الجودة الشهري جاهز", time: "منذ ساعتين", color: "bg-aqua-500" },
  { text: "تم اعتماد ميزانية قسم الكهرباء", time: "منذ 3 ساعات", color: "bg-mint-500" },
];

const pendingApprovals = [
  { type: "درجات", desc: "درجات مقرر CS101", from: "د. خالد السعيد", date: "2024-01-15" },
  { type: "إجازة", desc: "إجازة اضطرارية", from: "م. فهد الدوسري", date: "2024-01-14" },
  { type: "مالي", desc: "طلب صرف معدات", from: "إدارة المشتريات", date: "2024-01-13" },
];

// --- Shared Tooltip Style ---
const chartTooltipStyle = {
  borderRadius: "12px",
  border: "none",
  boxShadow: "0 4px 24px rgba(0,0,0,0.1)",
  background: "rgba(255,255,255,0.95)",
  backdropFilter: "blur(8px)",
};

// --- Main Dashboard ---

export function DeanDashboard() {
  const t = useTranslations("dashboard");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="min-w-0 space-y-4 md:space-y-6">
      {/* ====== Row 1: Primary Stat Cards ====== */}
      <div className="grid min-w-0 grid-cols-2 gap-3 md:gap-4 lg:grid-cols-4">
        <StatCard
          title="إجمالي المتدربين"
          value="1,245"
          icon={GraduationCap}
          iconColor="text-teal-600 bg-teal-100"
          trend={{ value: 12, isPositive: true }}
        />
        <StatCard
          title="المدربين"
          value="87"
          icon={Users}
          iconColor="text-aqua-600 bg-aqua-100"
          trend={{ value: 5, isPositive: true }}
        />
        <StatCard
          title="معدل النجاح"
          value="92%"
          icon={TrendingUp}
          iconColor="text-mint-700 bg-mint-100"
          trend={{ value: 3, isPositive: true }}
        />
        <StatCard
          title="معدل التوظيف"
          value="78%"
          icon={Briefcase}
          iconColor="text-orange-500 bg-orange-100"
          trend={{ value: 8, isPositive: true }}
        />
      </div>

      {/* ====== Row 2: Secondary Stat Cards ====== */}
      <div className="grid min-w-0 grid-cols-2 gap-3 md:gap-4 lg:grid-cols-4">
        <StatCard
          title="الأقسام"
          value="8"
          icon={Building2}
          iconColor="text-teal-600 bg-teal-100"
        />
        <StatCard
          title="البرامج التدريبية"
          value="120+"
          icon={BookOpen}
          iconColor="text-aqua-700 bg-aqua-100"
        />
        <StatCard
          title="نسبة الحضور"
          value="89%"
          icon={ClipboardCheck}
          iconColor="text-mint-700 bg-mint-100"
        />
        <StatCard
          title="الميزانية"
          value="25M"
          icon={DollarSign}
          iconColor="text-warning bg-warning/10"
        />
      </div>

      {/* ====== AI Smart Banner ====== */}
      <AISmartBanner />

      {/* ====== Charts Row 1: Bar Chart + Pie Chart ====== */}
      <div className="grid grid-cols-1 gap-4 md:gap-6 lg:grid-cols-2">
        {/* Bar Chart - Weekly Stats */}
        <div className="glass-card p-5 md:p-6">
          <h3 className="mb-4 text-base font-semibold text-foreground md:text-lg">
            إحصائيات الأسبوع
          </h3>
          {mounted && (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={weeklyData} barGap={4}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis
                  dataKey="day"
                  tick={{ fontSize: 12, fill: "#6b7280" }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fontSize: 12, fill: "#6b7280" }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip contentStyle={chartTooltipStyle} />
                <Bar
                  dataKey="newTrainees"
                  name="متدربين جدد"
                  fill="#1BA9A0"
                  radius={[6, 6, 0, 0]}
                  animationDuration={800}
                  animationEasing="ease-out"
                />
                <Bar
                  dataKey="admissionRequests"
                  name="طلبات قبول"
                  fill="#3BACC9"
                  radius={[6, 6, 0, 0]}
                  animationDuration={1000}
                  animationEasing="ease-out"
                />
                <Legend
                  wrapperStyle={{ fontSize: "12px", paddingTop: "12px" }}
                />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Donut / Pie Chart - Specialization Distribution */}
        <div className="glass-card p-5 md:p-6">
          <h3 className="mb-4 text-base font-semibold text-foreground md:text-lg">
            توزيع التخصصات
          </h3>
          {mounted && (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={specializations}
                  cx="50%"
                  cy="45%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={3}
                  dataKey="value"
                  label={false}
                  animationDuration={1000}
                  animationEasing="ease-out"
                >
                  {specializations.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                {/* Center label */}
                <text
                  x="50%"
                  y="42%"
                  textAnchor="middle"
                  dominantBaseline="central"
                  className="fill-foreground text-xl font-bold"
                >
                  862
                </text>
                <text
                  x="50%"
                  y="50%"
                  textAnchor="middle"
                  dominantBaseline="central"
                  className="fill-muted text-xs"
                >
                  متدرب
                </text>
                <Tooltip
                  contentStyle={chartTooltipStyle}
                  formatter={(value) => [`${value}%`, ""]}
                />
                <Legend
                  layout="horizontal"
                  verticalAlign="bottom"
                  align="center"
                  wrapperStyle={{ fontSize: "12px", paddingTop: "8px" }}
                />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* ====== Charts Row 2: Area Chart + Quick Stats ====== */}
      <div className="grid grid-cols-1 gap-4 md:gap-6 lg:grid-cols-2">
        {/* Area Chart - Admission Pipeline */}
        <div className="glass-card p-5 md:p-6">
          <h3 className="mb-4 text-base font-semibold text-foreground md:text-lg">
            مراحل القبول
          </h3>
          {mounted && (
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={admissionStages}>
                <defs>
                  <linearGradient id="admissionGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#1BA9A0" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#1BA9A0" stopOpacity={0.02} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis
                  dataKey="stage"
                  tick={{ fontSize: 12, fill: "#6b7280" }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fontSize: 12, fill: "#6b7280" }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip contentStyle={chartTooltipStyle} />
                <Area
                  type="monotone"
                  dataKey="value"
                  name="عدد الطلبات"
                  stroke="#1BA9A0"
                  strokeWidth={2.5}
                  fill="url(#admissionGradient)"
                  dot={{ r: 5, fill: "#1BA9A0", strokeWidth: 2, stroke: "#fff" }}
                  activeDot={{ r: 7, fill: "#1BA9A0", strokeWidth: 2, stroke: "#fff" }}
                  animationDuration={1200}
                  animationEasing="ease-out"
                />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Quick Stats Grid */}
        <div className="glass-card p-5 md:p-6">
          <h3 className="mb-4 text-base font-semibold text-foreground md:text-lg">
            أبرز الإحصائيات
          </h3>
          <div className="grid grid-cols-2 gap-3 md:gap-4">
            {/* Satisfaction Rate */}
            <div className="group flex items-center gap-3 rounded-xl border border-mint-200 bg-mint-50/60 p-3 transition-all duration-300 hover:shadow-md hover:-translate-y-0.5 md:p-4">
              <div className="rounded-xl bg-mint-100 p-2.5 transition-transform duration-300 group-hover:scale-110">
                <Award className="h-5 w-5 text-mint-700" />
              </div>
              <div>
                <p className="text-[11px] text-muted md:text-xs">معدل الرضا</p>
                <p className="text-lg font-bold text-mint-700 md:text-xl">95%</p>
              </div>
            </div>
            {/* Scholarships */}
            <div className="group flex items-center gap-3 rounded-xl border border-teal-100 bg-teal-50/60 p-3 transition-all duration-300 hover:shadow-md hover:-translate-y-0.5 md:p-4">
              <div className="rounded-xl bg-teal-100 p-2.5 transition-transform duration-300 group-hover:scale-110">
                <GraduationCap className="h-5 w-5 text-teal-600" />
              </div>
              <div>
                <p className="text-[11px] text-muted md:text-xs">المنح الدراسية</p>
                <p className="text-lg font-bold text-teal-600 md:text-xl">156</p>
              </div>
            </div>
            {/* Warnings */}
            <div className="group flex items-center gap-3 rounded-xl border border-danger/20 bg-danger/5 p-3 transition-all duration-300 hover:shadow-md hover:-translate-y-0.5 md:p-4">
              <div className="rounded-xl bg-danger/10 p-2.5 transition-transform duration-300 group-hover:scale-110">
                <ClipboardCheck className="h-5 w-5 text-danger" />
              </div>
              <div>
                <p className="text-[11px] text-muted md:text-xs">الإنذارات</p>
                <p className="text-lg font-bold text-danger md:text-xl">23</p>
              </div>
            </div>
            {/* Graduates */}
            <div className="group flex items-center gap-3 rounded-xl border border-aqua-100 bg-aqua-50/60 p-3 transition-all duration-300 hover:shadow-md hover:-translate-y-0.5 md:p-4">
              <div className="rounded-xl bg-aqua-100 p-2.5 transition-transform duration-300 group-hover:scale-110">
                <UserCheck className="h-5 w-5 text-aqua-600" />
              </div>
              <div>
                <p className="text-[11px] text-muted md:text-xs">المتخرجين</p>
                <p className="text-lg font-bold text-aqua-600 md:text-xl">312</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ====== Row 3: Regions Table + Recent Activity ====== */}
      <div className="grid grid-cols-1 gap-4 md:gap-6 lg:grid-cols-2">
        {/* Top Regions Table */}
        <div className="glass-card p-5 md:p-6">
          <h3 className="mb-4 text-base font-semibold text-foreground md:text-lg">
            توزيع الطلاب حسب المنطقة
          </h3>
          <div className="space-y-3">
            {regionData.map((region, i) => {
              const percentage = Math.round((region.count / region.max) * 100);
              return (
                <div key={i} className="group space-y-1.5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <MapPin className="h-3.5 w-3.5 text-muted transition-colors duration-200 group-hover:text-teal-600" />
                      <span className="text-xs font-medium text-foreground md:text-sm">
                        {region.name}
                      </span>
                    </div>
                    <span className="text-xs font-semibold text-foreground md:text-sm">
                      {region.count}
                    </span>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-gray-100">
                    <div
                      className="progress-bar-animated h-full rounded-full bg-gradient-to-r from-teal-600 to-aqua-600"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="glass-card p-5 md:p-6">
          <h3 className="mb-4 text-base font-semibold text-foreground md:text-lg">
            النشاط الأخير
          </h3>
          <div className="space-y-2 md:space-y-3">
            {recentActivities.map((activity, i) => (
              <div
                key={i}
                className="group flex cursor-pointer items-center gap-2.5 rounded-xl bg-white/40 p-2.5 backdrop-blur-sm transition-all duration-200 hover:bg-white/60 hover:shadow-sm md:gap-3 md:p-3"
              >
                <div
                  className={`h-2.5 w-2.5 shrink-0 rounded-full ${activity.color}`}
                />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-xs text-foreground md:text-sm">
                    {activity.text}
                  </p>
                  <p className="text-[10px] text-muted md:text-xs">
                    {activity.time}
                  </p>
                </div>
                <ArrowUpRight className="h-3.5 w-3.5 shrink-0 text-muted transition-all duration-200 group-hover:text-teal-600 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ====== AI Insights Panel ====== */}
      <AIInsightsPanel />

      {/* ====== Pending Approvals ====== */}
      <div className="glass-card p-4 md:p-6">
        <h3 className="mb-3 text-base font-semibold text-foreground md:mb-4 md:text-lg">
          {t("pendingApprovals")}
        </h3>

        {/* Mobile card layout */}
        <div className="space-y-3 md:hidden">
          {pendingApprovals.map((item, i) => (
            <div
              key={i}
              className="rounded-xl border border-white/20 bg-white/30 p-3 backdrop-blur-sm transition-all duration-200 hover:bg-white/40"
            >
              <div className="mb-2 flex items-center justify-between">
                <span className="rounded-full bg-teal-100 px-2.5 py-1 text-xs font-medium text-teal-600">
                  {item.type}
                </span>
                <span className="flex items-center gap-1 text-xs text-muted">
                  <Calendar className="h-3 w-3" />
                  {item.date}
                </span>
              </div>
              <p className="text-sm font-medium text-foreground">{item.desc}</p>
              <p className="mt-1 text-xs text-muted">{item.from}</p>
              <div className="mt-3 flex gap-2">
                <button
                  aria-label={`موافقة على ${item.desc} من ${item.from}`}
                  className="flex-1 rounded-lg bg-teal-500 px-3 py-1.5 text-xs font-medium text-white transition-all duration-200 hover:bg-teal-600 active:scale-[0.98]"
                >
                  موافقة
                </button>
                <button
                  aria-label={`رفض ${item.desc} من ${item.from}`}
                  className="flex-1 rounded-lg bg-danger px-3 py-1.5 text-xs font-medium text-white transition-all duration-200 hover:bg-red-700 active:scale-[0.98]"
                >
                  رفض
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Desktop table layout */}
        <div className="hidden overflow-x-auto md:block">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/20">
                <th className="px-4 py-3 text-start text-sm font-semibold text-muted">
                  النوع
                </th>
                <th className="px-4 py-3 text-start text-sm font-semibold text-muted">
                  الوصف
                </th>
                <th className="px-4 py-3 text-start text-sm font-semibold text-muted">
                  مقدم من
                </th>
                <th className="px-4 py-3 text-start text-sm font-semibold text-muted">
                  التاريخ
                </th>
                <th className="px-4 py-3 text-start text-sm font-semibold text-muted">
                  الإجراء
                </th>
              </tr>
            </thead>
            <tbody>
              {pendingApprovals.map((item, i) => (
                <tr
                  key={i}
                  className="table-row-hover border-b border-white/10 last:border-0"
                >
                  <td className="px-4 py-3">
                    <span className="rounded-full bg-teal-100 px-2.5 py-1 text-xs font-medium text-teal-600">
                      {item.type}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-foreground">
                    {item.desc}
                  </td>
                  <td className="px-4 py-3 text-sm text-muted">{item.from}</td>
                  <td className="px-4 py-3 text-sm text-muted">{item.date}</td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <button
                        aria-label={`موافقة على ${item.desc} من ${item.from}`}
                        className="rounded-lg bg-teal-500 px-3 py-1.5 text-xs font-medium text-white transition-all duration-200 hover:bg-teal-600 active:scale-[0.98]"
                      >
                        موافقة
                      </button>
                      <button
                        aria-label={`رفض ${item.desc} من ${item.from}`}
                        className="rounded-lg bg-danger px-3 py-1.5 text-xs font-medium text-white transition-all duration-200 hover:bg-red-700 active:scale-[0.98]"
                      >
                        رفض
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
