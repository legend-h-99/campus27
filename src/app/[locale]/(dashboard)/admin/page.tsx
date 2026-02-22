"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { PageHeader } from "@/components/shared/page-header";
import { StatCard } from "@/components/ui/stat-card";
import {
  Shield,
  Users,
  UserPlus,
  Server,
  HardDrive,
  Cpu,
  Activity,
  Search,
  MoreVertical,
  Edit,
  Trash2,
  Lock,
  Unlock,
  CheckCircle2,
  XCircle,
  Clock,
  Database,
  Globe,
} from "lucide-react";

type UserRole = "super_admin" | "dean" | "head_department" | "trainer" | "trainee" | "finance" | "hr";
type UserStatus = "active" | "inactive" | "suspended";

interface SystemUser {
  id: string;
  nameAr: string;
  nameEn: string;
  email: string;
  role: UserRole;
  department: string;
  status: UserStatus;
  lastLogin: string;
  createdAt: string;
}

const users: SystemUser[] = [
  {
    id: "USR-001",
    nameAr: "د. عبدالله المحمدي",
    nameEn: "Dr. Abdullah Al-Mohammadi",
    email: "a.mohammadi@tvtc.gov.sa",
    role: "dean",
    department: "العمادة",
    status: "active",
    lastLogin: "2024-01-30 09:15",
    createdAt: "2023-01-01",
  },
  {
    id: "USR-002",
    nameAr: "د. خالد السعيد",
    nameEn: "Dr. Khalid Al-Saeed",
    email: "k.saeed@tvtc.gov.sa",
    role: "head_department",
    department: "قسم الحاسب الآلي",
    status: "active",
    lastLogin: "2024-01-30 08:30",
    createdAt: "2023-02-15",
  },
  {
    id: "USR-003",
    nameAr: "م. فهد الدوسري",
    nameEn: "Eng. Fahad Al-Dosari",
    email: "f.dosari@tvtc.gov.sa",
    role: "trainer",
    department: "قسم الحاسب الآلي",
    status: "active",
    lastLogin: "2024-01-29 14:20",
    createdAt: "2023-03-10",
  },
  {
    id: "USR-004",
    nameAr: "د. سارة العمري",
    nameEn: "Dr. Sarah Al-Omari",
    email: "s.omari@tvtc.gov.sa",
    role: "trainer",
    department: "قسم إدارة الأعمال",
    status: "active",
    lastLogin: "2024-01-30 07:45",
    createdAt: "2023-04-20",
  },
  {
    id: "USR-005",
    nameAr: "أ. نورة العتيبي",
    nameEn: "Noura Al-Otaibi",
    email: "n.otaibi@tvtc.gov.sa",
    role: "finance",
    department: "الشؤون المالية",
    status: "active",
    lastLogin: "2024-01-28 11:00",
    createdAt: "2023-05-05",
  },
  {
    id: "USR-006",
    nameAr: "أ. فاطمة الزهراني",
    nameEn: "Fatimah Al-Zahrani",
    email: "f.zahrani@tvtc.gov.sa",
    role: "hr",
    department: "الموارد البشرية",
    status: "active",
    lastLogin: "2024-01-30 10:30",
    createdAt: "2023-06-12",
  },
  {
    id: "USR-007",
    nameAr: "م. سعد القحطاني",
    nameEn: "Eng. Saad Al-Qahtani",
    email: "s.qahtani@tvtc.gov.sa",
    role: "head_department",
    department: "قسم الكهرباء",
    status: "inactive",
    lastLogin: "2024-01-15 09:00",
    createdAt: "2023-07-01",
  },
  {
    id: "USR-008",
    nameAr: "أحمد الحربي",
    nameEn: "Ahmed Al-Harbi",
    email: "a.harbi@tvtc.gov.sa",
    role: "trainee",
    department: "قسم الحاسب الآلي",
    status: "suspended",
    lastLogin: "2024-01-10 13:15",
    createdAt: "2023-09-01",
  },
];

const roleConfig: Record<UserRole, { label: string; color: string; bgColor: string }> = {
  super_admin: { label: "مدير النظام", color: "text-red-500", bgColor: "bg-red-500/10" },
  dean: { label: "العميد", color: "text-teal-600", bgColor: "bg-teal-600/10" },
  head_department: { label: "رئيس قسم", color: "text-teal-500", bgColor: "bg-teal-500/10" },
  trainer: { label: "مدرب", color: "text-amber-500", bgColor: "bg-amber-500/10" },
  trainee: { label: "متدرب", color: "text-aqua-600", bgColor: "bg-aqua-600/10" },
  finance: { label: "مالية", color: "text-slate-500", bgColor: "bg-slate-500/10" },
  hr: { label: "موارد بشرية", color: "text-aqua-500", bgColor: "bg-aqua-500/10" },
};

const statusConfig: Record<UserStatus, { label: string; color: string; bgColor: string; icon: typeof CheckCircle2 }> = {
  active: { label: "نشط", color: "text-teal-500", bgColor: "bg-teal-500/10", icon: CheckCircle2 },
  inactive: { label: "غير نشط", color: "text-amber-500", bgColor: "bg-amber-500/10", icon: Clock },
  suspended: { label: "موقوف", color: "text-red-500", bgColor: "bg-red-500/10", icon: XCircle },
};

const systemStats = [
  { label: "استخدام المعالج", value: 34, unit: "%", icon: Cpu, color: "text-teal-600" },
  { label: "استخدام الذاكرة", value: 62, unit: "%", icon: Activity, color: "text-amber-500" },
  { label: "التخزين المستخدم", value: 45, unit: "%", icon: HardDrive, color: "text-teal-500" },
  { label: "قاعدة البيانات", value: 28, unit: "%", icon: Database, color: "text-red-500" },
];

export default function AdminPage() {
  const t = useTranslations("nav");
  const [searchQuery, setSearchQuery] = useState("");
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);

  const filteredUsers = users.filter(
    (user) =>
      user.nameAr.includes(searchQuery) ||
      user.nameEn.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const activeUsers = users.filter((u) => u.status === "active").length;

  return (
    <div className="animate-fade-in space-y-4 md:space-y-6">
      <PageHeader
        title={t("admin")}
        description="إدارة المستخدمين وإعدادات النظام والصلاحيات"
        actions={
          <button className="flex items-center gap-2 rounded-lg bg-teal-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-teal-700 active:scale-[0.98]">
            <UserPlus className="h-4 w-4" />
            إضافة مستخدم
          </button>
        }
      />

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3 md:gap-4 lg:grid-cols-4">
        <StatCard
          title="إجمالي المستخدمين"
          value={users.length}
          icon={Users}
          gradient="from-teal-600 to-teal-800"
        />
        <StatCard
          title="مستخدمون نشطون"
          value={activeUsers}
          icon={CheckCircle2}
          gradient="from-teal-500 to-teal-700"
        />
        <StatCard
          title="جلسات نشطة"
          value="23"
          icon={Globe}
          gradient="from-amber-500 to-amber-600"
        />
        <StatCard
          title="وقت التشغيل"
          value="99.9%"
          icon={Server}
          gradient="from-red-500 to-red-700"
        />
      </div>

      {/* System Stats */}
      <div className="grid grid-cols-2 gap-3 md:gap-4 lg:grid-cols-4">
        {systemStats.map((stat) => {
          const StatIcon = stat.icon;
          const barColor =
            stat.value > 80 ? "bg-red-500" : stat.value > 60 ? "bg-amber-500" : "bg-teal-500";
          return (
            <div key={stat.label} className="glass-card rounded-xl p-3 shadow-sm md:p-4">
              <div className="mb-2 flex items-center justify-between">
                <StatIcon className={`h-5 w-5 ${stat.color}`} />
                <span className="text-lg font-bold text-foreground">
                  {stat.value}{stat.unit}
                </span>
              </div>
              <div className="mb-1 h-2 w-full rounded-full bg-background">
                <div
                  className={`h-2 rounded-full ${barColor} transition-all duration-500`}
                  style={{ width: `${stat.value}%` }}
                />
              </div>
              <p className="text-xs text-muted">{stat.label}</p>
            </div>
          );
        })}
      </div>

      {/* User Management Table */}
      <div className="glass-card rounded-xl p-4 shadow-sm md:p-6">
        <div className="mb-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between md:mb-4 md:gap-4">
          <h3 className="flex items-center gap-2 text-base font-semibold text-foreground md:text-lg">
            <Shield className="h-5 w-5 text-teal-600" />
            إدارة المستخدمين
          </h3>

          {/* Search */}
          <div className="relative">
            <Search className="absolute start-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
            <input
              type="text"
              placeholder="بحث عن مستخدم..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-lg border border-border bg-background py-2 pe-4 ps-10 text-sm text-foreground outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 sm:w-72"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-[600px] w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="px-3 py-3 text-start text-sm font-semibold text-muted md:px-4">المستخدم</th>
                <th className="px-4 py-3 text-start text-sm font-semibold text-muted">البريد</th>
                <th className="px-4 py-3 text-start text-sm font-semibold text-muted">الدور</th>
                <th className="px-4 py-3 text-start text-sm font-semibold text-muted">القسم</th>
                <th className="px-4 py-3 text-start text-sm font-semibold text-muted">الحالة</th>
                <th className="px-4 py-3 text-start text-sm font-semibold text-muted">آخر دخول</th>
                <th className="px-4 py-3 text-start text-sm font-semibold text-muted">الإجراءات</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => {
                const role = roleConfig[user.role];
                const status = statusConfig[user.status];
                const StatusIcon = status.icon;

                return (
                  <tr key={user.id} className="border-b border-border last:border-0 transition-colors duration-200 hover:bg-background/50">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-teal-600/10 text-sm font-bold text-teal-600">
                          {user.nameAr.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-foreground">{user.nameAr}</p>
                          <p className="text-xs text-muted">{user.nameEn}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-muted">{user.email}</td>
                    <td className="px-4 py-3">
                      <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${role.bgColor} ${role.color}`}>
                        {role.label}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-muted">{user.department}</td>
                    <td className="px-4 py-3">
                      <span className={`flex w-fit items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium ${status.bgColor} ${status.color}`}>
                        <StatusIcon className="h-3 w-3" />
                        {status.label}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-muted">{user.lastLogin}</td>
                    <td className="px-4 py-3">
                      <div className="relative">
                        <button
                          onClick={() => setOpenMenuId(openMenuId === user.id ? null : user.id)}
                          className="rounded-lg p-1.5 text-muted transition-colors hover:bg-background hover:text-foreground active:scale-[0.98]"
                          aria-label={`خيارات ${user.nameAr}`}
                          aria-haspopup="true"
                          aria-expanded={openMenuId === user.id}
                        >
                          <MoreVertical className="h-4 w-4" />
                        </button>

                        {openMenuId === user.id && (
                          <div role="menu" className="dropdown-animate absolute end-0 top-full z-10 mt-1 w-44 rounded-lg border border-border bg-white py-1 shadow-lg">
                            <button role="menuitem" className="flex w-full items-center gap-2 px-4 py-2 text-sm text-foreground hover:bg-background active:scale-[0.98]">
                              <Edit className="h-4 w-4" />
                              تعديل
                            </button>
                            <button role="menuitem" className="flex w-full items-center gap-2 px-4 py-2 text-sm text-foreground hover:bg-background active:scale-[0.98]">
                              {user.status === "active" ? (
                                <>
                                  <Lock className="h-4 w-4" />
                                  تعطيل
                                </>
                              ) : (
                                <>
                                  <Unlock className="h-4 w-4" />
                                  تفعيل
                                </>
                              )}
                            </button>
                            <button role="menuitem" className="flex w-full items-center gap-2 px-4 py-2 text-sm text-red-500 hover:bg-background active:scale-[0.98]">
                              <Trash2 className="h-4 w-4" />
                              حذف
                            </button>
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {filteredUsers.length === 0 && (
          <div className="py-12 text-center">
            <Users className="mx-auto mb-3 h-12 w-12 text-muted/30" />
            <p className="text-sm text-muted">لا توجد نتائج مطابقة للبحث</p>
          </div>
        )}
      </div>
    </div>
  );
}
