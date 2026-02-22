"use client";

import { useTranslations } from "next-intl";
import { PageHeader } from "@/components/shared/page-header";
import { StatCard } from "@/components/ui/stat-card";
import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  Wallet,
  ArrowUpRight,
  ArrowDownRight,
  Download,
  Filter,
} from "lucide-react";

const transactions = [
  {
    id: "TXN-001",
    description: "صرف رواتب المدربين - يناير",
    category: "رواتب",
    amount: -2_450_000,
    date: "2024-01-28",
    status: "مكتمل",
    approvedBy: "د. عبدالله المحمدي",
  },
  {
    id: "TXN-002",
    description: "شراء أجهزة مختبر الحاسب",
    category: "معدات",
    amount: -385_000,
    date: "2024-01-25",
    status: "مكتمل",
    approvedBy: "م. سعد القحطاني",
  },
  {
    id: "TXN-003",
    description: "إيرادات التدريب التعاوني",
    category: "إيرادات",
    amount: 520_000,
    date: "2024-01-22",
    status: "مكتمل",
    approvedBy: "أ. نورة العتيبي",
  },
  {
    id: "TXN-004",
    description: "صيانة المباني والمرافق",
    category: "صيانة",
    amount: -175_000,
    date: "2024-01-20",
    status: "قيد المراجعة",
    approvedBy: "-",
  },
  {
    id: "TXN-005",
    description: "دعم صندوق المتدربين",
    category: "صندوق المتدربين",
    amount: -300_000,
    date: "2024-01-18",
    status: "مكتمل",
    approvedBy: "د. فاطمة الشهري",
  },
  {
    id: "TXN-006",
    description: "إيرادات الاستشارات",
    category: "إيرادات",
    amount: 280_000,
    date: "2024-01-15",
    status: "مكتمل",
    approvedBy: "د. عبدالله المحمدي",
  },
];

const expenseCategories = [
  { name: "رواتب وبدلات", amount: 12_500_000, percentage: 50, color: "bg-teal-600" },
  { name: "معدات وتجهيزات", amount: 3_750_000, percentage: 15, color: "bg-aqua-600" },
  { name: "صيانة ومرافق", amount: 2_500_000, percentage: 10, color: "bg-amber-500" },
  { name: "تطوير أكاديمي", amount: 2_000_000, percentage: 8, color: "bg-teal-500" },
  { name: "صندوق المتدربين", amount: 1_750_000, percentage: 7, color: "bg-red-500" },
  { name: "مصاريف تشغيلية", amount: 2_500_000, percentage: 10, color: "bg-slate-500" },
];

export default function FinancePage() {
  const t = useTranslations("finance");

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("ar-SA", {
      style: "currency",
      currency: "SAR",
      maximumFractionDigits: 0,
    }).format(Math.abs(amount));
  };

  return (
    <div className="animate-fade-in space-y-4 md:space-y-6">
      <PageHeader
        title={t("title")}
        description="إدارة الميزانية والمعاملات المالية للكلية"
        actions={
          <div className="flex gap-2">
            <button className="flex items-center gap-2 rounded-lg border border-border bg-white px-4 py-2 text-sm font-medium text-foreground transition-all duration-200 hover:bg-background active:scale-[0.98]">
              <Filter className="h-4 w-4" />
              {t("category")}
            </button>
            <button className="flex items-center gap-2 rounded-lg bg-teal-600 px-4 py-2 text-sm font-medium text-white transition-all duration-200 hover:bg-teal-700 active:scale-[0.98]">
              <Download className="h-4 w-4" />
              تصدير التقرير
            </button>
          </div>
        }
      />

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3 md:gap-4 lg:grid-cols-4">
        <StatCard
          title={t("budget")}
          value="25,000,000 ر.س"
          icon={Wallet}
          gradient="from-teal-600 to-teal-700"
        />
        <StatCard
          title={t("income")}
          value="8,200,000 ر.س"
          icon={TrendingUp}
          trend={{ value: 12, isPositive: true }}
          gradient="from-teal-500 to-emerald-700"
        />
        <StatCard
          title={t("expense")}
          value="18,350,000 ر.س"
          icon={TrendingDown}
          trend={{ value: 5, isPositive: false }}
          gradient="from-red-500 to-red-700"
        />
        <StatCard
          title="المتبقي"
          value="6,650,000 ر.س"
          icon={DollarSign}
          gradient="from-amber-500 to-amber-600"
        />
      </div>

      <div className="grid grid-cols-1 gap-4 md:gap-6 lg:grid-cols-3">
        {/* Transactions Table */}
        <div className="glass-card lg:col-span-2 rounded-xl p-4 shadow-sm md:p-6">
          <h3 className="mb-3 text-base font-semibold text-foreground md:mb-4 md:text-lg">{t("transactions")}</h3>
          <div className="overflow-x-auto">
            <table className="min-w-[600px] w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="px-4 py-3 text-start text-sm font-semibold text-muted">الرقم</th>
                  <th className="px-4 py-3 text-start text-sm font-semibold text-muted">الوصف</th>
                  <th className="px-4 py-3 text-start text-sm font-semibold text-muted">{t("category")}</th>
                  <th className="px-4 py-3 text-start text-sm font-semibold text-muted">{t("amount")}</th>
                  <th className="px-4 py-3 text-start text-sm font-semibold text-muted">التاريخ</th>
                  <th className="px-4 py-3 text-start text-sm font-semibold text-muted">الحالة</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((tx) => (
                  <tr key={tx.id} className="border-b border-border last:border-0 hover:bg-teal-50/30 transition-colors duration-200">
                    <td className="px-4 py-3 text-sm font-medium text-foreground">{tx.id}</td>
                    <td className="px-4 py-3 text-sm text-foreground">{tx.description}</td>
                    <td className="px-4 py-3">
                      <span className="rounded-full bg-teal-600/10 px-2.5 py-1 text-xs font-medium text-teal-600">
                        {tx.category}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm font-medium">
                      <span className={`flex items-center gap-1 ${tx.amount > 0 ? "text-teal-500" : "text-red-500"}`}>
                        {tx.amount > 0 ? (
                          <ArrowUpRight className="h-3.5 w-3.5" />
                        ) : (
                          <ArrowDownRight className="h-3.5 w-3.5" />
                        )}
                        {formatCurrency(tx.amount)}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-muted">{tx.date}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                          tx.status === "مكتمل"
                            ? "bg-teal-500/10 text-teal-500"
                            : "bg-amber-500/10 text-amber-500"
                        }`}
                      >
                        {tx.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Expense Categories */}
        <div className="glass-card rounded-xl p-4 shadow-sm md:p-6">
          <h3 className="mb-3 text-base font-semibold text-foreground md:mb-4 md:text-lg">توزيع المصروفات</h3>
          <div className="space-y-4">
            {expenseCategories.map((cat) => (
              <div key={cat.name}>
                <div className="mb-1 flex items-center justify-between">
                  <span className="text-sm font-medium text-foreground">{cat.name}</span>
                  <span className="text-sm text-muted">{cat.percentage}%</span>
                </div>
                <div className="h-2.5 w-full rounded-full bg-background">
                  <div
                    className={`h-2.5 rounded-full ${cat.color} transition-all duration-300`}
                    style={{ width: `${cat.percentage}%` }}
                  />
                </div>
                <p className="mt-1 text-xs text-muted">{formatCurrency(cat.amount)}</p>
              </div>
            ))}
          </div>

          {/* Budget Overview */}
          <div className="mt-6 rounded-lg bg-background p-4">
            <h4 className="mb-2 text-sm font-semibold text-foreground">ملخص الميزانية</h4>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted">إجمالي الميزانية</span>
                <span className="font-medium text-foreground">25,000,000 ر.س</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted">المصروف</span>
                <span className="font-medium text-red-500">18,350,000 ر.س</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted">المتبقي</span>
                <span className="font-medium text-teal-500">6,650,000 ر.س</span>
              </div>
              <div className="mt-2 h-3 w-full rounded-full bg-teal-500/20">
                <div className="h-3 rounded-full bg-red-500 transition-all duration-300" style={{ width: "73.4%" }} />
              </div>
              <p className="text-center text-xs text-muted">تم صرف 73.4% من الميزانية</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
