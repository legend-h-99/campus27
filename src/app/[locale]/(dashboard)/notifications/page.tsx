"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { PageHeader } from "@/components/shared/page-header";
import {
  Bell,
  CheckCheck,
  AlertTriangle,
  Info,
  CheckCircle2,
  XCircle,
  Calendar,
  DollarSign,
  GraduationCap,
  Users,
  Settings,
  Filter,
  Trash2,
} from "lucide-react";

type NotificationType = "info" | "success" | "warning" | "error";

interface Notification {
  id: string;
  title: string;
  message: string;
  type: NotificationType;
  category: string;
  timestamp: string;
  isRead: boolean;
  sender: string;
}

const initialNotifications: Notification[] = [
  {
    id: "NOT-001",
    title: "اعتماد الدرجات",
    message: "تم اعتماد درجات مقرر CS101 - أساسيات البرمجة من قبل رئيس القسم",
    type: "success",
    category: "أكاديمي",
    timestamp: "منذ 5 دقائق",
    isRead: false,
    sender: "نظام الدرجات",
  },
  {
    id: "NOT-002",
    title: "طلب إجازة جديد",
    message: "قدم م. فهد الدوسري طلب إجازة اضطرارية لمدة 3 أيام بانتظار الموافقة",
    type: "warning",
    category: "موارد بشرية",
    timestamp: "منذ 15 دقيقة",
    isRead: false,
    sender: "نظام الإجازات",
  },
  {
    id: "NOT-003",
    title: "تنبيه ميزانية",
    message: "تم صرف 75% من ميزانية قسم الحاسب الآلي. يرجى مراجعة بنود الصرف",
    type: "warning",
    category: "مالي",
    timestamp: "منذ 30 دقيقة",
    isRead: false,
    sender: "النظام المالي",
  },
  {
    id: "NOT-004",
    title: "إضافة متدربين جدد",
    message: "تم تسجيل 12 متدرب جديد في الفصل التدريبي الحالي وتوزيعهم على الأقسام",
    type: "info",
    category: "أكاديمي",
    timestamp: "منذ ساعة",
    isRead: false,
    sender: "شؤون المتدربين",
  },
  {
    id: "NOT-005",
    title: "فشل في المزامنة",
    message: "حدث خطأ في مزامنة بيانات الحضور من جهاز البصمة - المبنى الرئيسي",
    type: "error",
    category: "نظام",
    timestamp: "منذ ساعتين",
    isRead: true,
    sender: "نظام الحضور",
  },
  {
    id: "NOT-006",
    title: "تقرير الجودة جاهز",
    message: "تم إعداد تقرير مؤشرات الجودة للفصل الأول ويمكنك الاطلاع عليه الآن",
    type: "success",
    category: "جودة",
    timestamp: "منذ 3 ساعات",
    isRead: true,
    sender: "إدارة الجودة",
  },
  {
    id: "NOT-007",
    title: "اجتماع مجلس الكلية",
    message: "تذكير: اجتماع مجلس الكلية غدا الأحد الساعة 10:00 صباحا في قاعة الاجتماعات",
    type: "info",
    category: "إداري",
    timestamp: "منذ 4 ساعات",
    isRead: true,
    sender: "مكتب العميد",
  },
  {
    id: "NOT-008",
    title: "تحديث النظام",
    message: "سيتم إجراء تحديث للنظام يوم الجمعة القادم من الساعة 2-4 صباحا",
    type: "info",
    category: "نظام",
    timestamp: "منذ 5 ساعات",
    isRead: true,
    sender: "إدارة تقنية المعلومات",
  },
  {
    id: "NOT-009",
    title: "اعتماد ميزانية القسم",
    message: "تمت الموافقة على ميزانية قسم الكهرباء للفصل الثاني بمبلغ 1,200,000 ر.س",
    type: "success",
    category: "مالي",
    timestamp: "أمس",
    isRead: true,
    sender: "النظام المالي",
  },
  {
    id: "NOT-010",
    title: "مهمة متأخرة",
    message: "المهمة TSK-002 (تحديث خطة الطوارئ) تجاوزت الموعد المحدد ولم يتم إنجازها",
    type: "error",
    category: "مهام",
    timestamp: "أمس",
    isRead: true,
    sender: "نظام المهام",
  },
];

const typeConfig: Record<NotificationType, { icon: typeof Info; color: string; bgColor: string; borderColor: string }> = {
  info: { icon: Info, color: "text-aqua-600", bgColor: "bg-aqua-600/10", borderColor: "border-s-aqua-600" },
  success: { icon: CheckCircle2, color: "text-teal-500", bgColor: "bg-teal-500/10", borderColor: "border-s-teal-500" },
  warning: { icon: AlertTriangle, color: "text-amber-500", bgColor: "bg-amber-500/10", borderColor: "border-s-amber-500" },
  error: { icon: XCircle, color: "text-red-500", bgColor: "bg-red-500/10", borderColor: "border-s-red-500" },
};

export default function NotificationsPage() {
  const t = useTranslations("notifications");
  const [notifications, setNotifications] = useState(initialNotifications);
  const [filter, setFilter] = useState<"all" | "unread" | "read">("all");

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  };

  const toggleRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: !n.isRead } : n))
    );
  };

  const filteredNotifications = notifications.filter((n) => {
    if (filter === "unread") return !n.isRead;
    if (filter === "read") return n.isRead;
    return true;
  });

  return (
    <div className="animate-fade-in space-y-4 md:space-y-6">
      <PageHeader
        title={t("title")}
        description="جميع الإشعارات والتنبيهات الواردة"
        actions={
          <div className="flex gap-2">
            <button
              onClick={markAllRead}
              className="flex items-center gap-2 rounded-lg border border-border bg-white px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-background active:scale-[0.98]"
            >
              <CheckCheck className="h-4 w-4" />
              {t("markAllRead")}
            </button>
          </div>
        }
      />

      {/* Summary Bar */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between md:gap-4">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 rounded-lg bg-white px-3 py-2 shadow-sm md:px-4">
            <Bell className="h-5 w-5 text-teal-600" />
            <span className="text-sm text-foreground">
              {unreadCount > 0
                ? `${unreadCount} إشعار غير مقروء`
                : "لا توجد إشعارات جديدة"
              }
            </span>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex rounded-lg border border-border bg-white">
          {[
            { key: "all" as const, label: "الكل" },
            { key: "unread" as const, label: t("unread") },
            { key: "read" as const, label: t("readAll") },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setFilter(tab.key)}
              className={`px-3 py-2 text-sm font-medium transition-all duration-200 first:rounded-s-lg last:rounded-e-lg md:px-4 ${
                filter === tab.key
                  ? "bg-teal-600 text-white"
                  : "text-foreground hover:bg-background"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Notifications List */}
      <div className="space-y-2 md:space-y-3">
        {filteredNotifications.length === 0 ? (
          <div className="rounded-xl bg-white p-12 text-center shadow-sm">
            <Bell className="mx-auto mb-3 h-12 w-12 text-muted/30" />
            <p className="text-sm text-muted">{t("noNotifications")}</p>
          </div>
        ) : (
          filteredNotifications.map((notification) => {
            const config = typeConfig[notification.type];
            const TypeIcon = config.icon;

            return (
              <div
                key={notification.id}
                onClick={() => toggleRead(notification.id)}
                className={`glass-card cursor-pointer rounded-xl border-s-4 p-3 shadow-sm transition-all duration-200 hover:shadow-md md:p-4 ${
                  config.borderColor
                } ${!notification.isRead ? "bg-teal-50/30" : ""}`}
              >
                <div className="flex items-start gap-3 md:gap-4">
                  {/* Icon */}
                  <div className={`rounded-lg p-2.5 ${config.bgColor}`}>
                    <TypeIcon className={`h-5 w-5 ${config.color}`} />
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="mb-1 flex items-center gap-2">
                      <h4 className={`text-sm font-semibold text-foreground ${!notification.isRead ? "font-bold" : ""}`}>
                        {notification.title}
                      </h4>
                      {!notification.isRead && (
                        <span className="h-2 w-2 animate-pulse-teal rounded-full bg-teal-600" />
                      )}
                    </div>
                    <p className="mb-2 text-sm text-muted">{notification.message}</p>
                    <div className="flex flex-wrap items-center gap-3 text-xs text-muted">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {notification.timestamp}
                      </span>
                      <span className="rounded-full bg-background px-2 py-0.5">
                        {notification.category}
                      </span>
                      <span className="text-muted/70">{notification.sender}</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex shrink-0 items-center gap-1">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleRead(notification.id);
                      }}
                      className="rounded-lg p-2 text-muted transition-colors hover:bg-background hover:text-foreground active:scale-[0.98]"
                      title={notification.isRead ? "تعيين كغير مقروء" : "تعيين كمقروء"}
                    >
                      <CheckCheck className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
