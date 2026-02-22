"use client";

import { useTranslations } from "next-intl";
import { StatCard } from "@/components/ui/stat-card";
import { BookOpen, Users, ClipboardCheck, Clock } from "lucide-react";

export function TrainerDashboard() {
  const t = useTranslations("dashboard");

  const sessions = [
    { time: "08:00 - 09:30", course: "برمجة الويب المتقدمة", room: "A201", students: 32 },
    { time: "10:00 - 11:30", course: "قواعد البيانات", room: "B105", students: 28 },
    { time: "12:00 - 13:30", course: "هياكل البيانات", room: "A305", students: 30 },
  ];

  return (
    <div className="space-y-4 md:space-y-6">
      {/* Stat Cards */}
      <div className="grid grid-cols-2 gap-3 md:gap-4 lg:grid-cols-4">
        <StatCard
          title={t("myCourses")}
          value="5"
          icon={BookOpen}
          gradient="from-teal-600 to-teal-800"
        />
        <StatCard
          title={t("totalTrainees")}
          value="156"
          icon={Users}
          gradient="from-aqua-500 to-aqua-700"
        />
        <StatCard
          title={t("attendanceRate")}
          value="94%"
          icon={ClipboardCheck}
          gradient="from-teal-500 to-teal-600"
        />
        <StatCard
          title={t("todaySchedule")}
          value="3"
          icon={Clock}
          gradient="from-mint-500 to-mint-700"
        />
      </div>

      {/* Today's Schedule */}
      <div className="glass-card rounded-xl p-4 md:p-6">
        <h3 className="mb-3 md:mb-4 text-base md:text-lg font-semibold text-foreground">
          {t("todaySchedule")}
        </h3>

        {/* Mobile Card Layout (<md) */}
        <div className="space-y-3 md:hidden">
          {sessions.map((session, i) => (
            <div key={i} className="rounded-lg border border-border p-3">
              <div className="mb-2 flex items-center justify-between">
                <div className="rounded-lg bg-primary/10 px-2 py-1">
                  <p className="text-xs font-medium text-primary">{session.time}</p>
                </div>
                <button className="rounded-lg bg-primary px-3 py-1.5 text-xs text-white hover:bg-primary-dark">
                  تسجيل حضور
                </button>
              </div>
              <p className="text-xs font-medium text-foreground">{session.course}</p>
              <p className="text-xs text-muted">
                القاعة: {session.room} | المتدربون: {session.students}
              </p>
            </div>
          ))}
        </div>

        {/* Desktop Table Layout (>=md) */}
        <div className="hidden md:block">
          <div className="space-y-3">
            {sessions.map((session, i) => (
              <div key={i} className="flex items-center gap-4 rounded-lg border border-border p-4">
                <div className="rounded-lg bg-primary/10 px-3 py-2 text-center">
                  <p className="text-xs font-medium text-primary">{session.time}</p>
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-foreground">{session.course}</p>
                  <p className="text-xs md:text-sm text-muted">
                    القاعة: {session.room} | المتدربون: {session.students}
                  </p>
                </div>
                <button className="rounded-lg bg-primary px-4 py-2 text-sm text-white hover:bg-primary-dark">
                  تسجيل حضور
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
