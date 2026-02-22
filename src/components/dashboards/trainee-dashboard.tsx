"use client";

import { useTranslations } from "next-intl";
import { StatCard } from "@/components/ui/stat-card";
import { BookOpen, TrendingUp, ClipboardCheck, Calendar } from "lucide-react";

export function TraineeDashboard() {
  const t = useTranslations("dashboard");

  const sessions = [
    { time: "08:00 - 09:30", course: "برمجة الويب المتقدمة", trainer: "م. نورة العتيبي", room: "A201" },
    { time: "10:00 - 11:30", course: "قواعد البيانات", trainer: "د. خالد السعيد", room: "B105" },
    { time: "12:00 - 13:30", course: "هياكل البيانات", trainer: "م. عمر الزهراني", room: "A305" },
    { time: "14:00 - 15:30", course: "الرياضيات", trainer: "د. أحمد المالكي", room: "C102" },
  ];

  const grades = [
    { course: "برمجة الويب المتقدمة", grade: 92, letter: "A" },
    { course: "قواعد البيانات", grade: 88, letter: "B+" },
    { course: "هياكل البيانات", grade: 78, letter: "C+" },
    { course: "الشبكات", grade: 95, letter: "A+" },
    { course: "أمن المعلومات", grade: 85, letter: "B+" },
  ];

  return (
    <div className="space-y-4 md:space-y-6">
      {/* Stat Cards */}
      <div className="grid grid-cols-2 gap-3 md:gap-4 lg:grid-cols-4">
        <StatCard
          title={t("myCourses")}
          value="6"
          icon={BookOpen}
          gradient="from-teal-600 to-teal-800"
        />
        <StatCard
          title={t("myGrades")}
          value="3.8"
          icon={TrendingUp}
          gradient="from-aqua-500 to-aqua-700"
        />
        <StatCard
          title={t("myAttendance")}
          value="92%"
          icon={ClipboardCheck}
          gradient="from-teal-500 to-teal-600"
        />
        <StatCard
          title={t("todaySchedule")}
          value="4"
          icon={Calendar}
          gradient="from-mint-500 to-mint-700"
        />
      </div>

      <div className="grid grid-cols-1 gap-4 md:gap-6 lg:grid-cols-2">
        {/* Today's Schedule */}
        <div className="glass-card rounded-xl p-4 md:p-6">
          <h3 className="mb-3 md:mb-4 text-base md:text-lg font-semibold text-foreground">
            {t("todaySchedule")}
          </h3>

          {/* Mobile Card Layout (<md) */}
          <div className="space-y-3 md:hidden">
            {sessions.map((session, i) => (
              <div key={i} className="rounded-lg bg-background p-3">
                <div className="mb-2">
                  <div className="inline-block rounded-lg bg-primary/10 px-2 py-1">
                    <p className="text-xs font-medium text-primary">{session.time}</p>
                  </div>
                </div>
                <p className="text-xs font-medium text-foreground">{session.course}</p>
                <p className="text-xs text-muted">
                  {session.trainer} - {session.room}
                </p>
              </div>
            ))}
          </div>

          {/* Desktop Table Layout (>=md) */}
          <div className="hidden md:block">
            <div className="space-y-3">
              {sessions.map((session, i) => (
                <div key={i} className="flex items-center gap-3 rounded-lg bg-background p-3">
                  <div className="rounded-lg bg-primary/10 px-2 py-1 text-center">
                    <p className="text-xs font-medium text-primary">{session.time}</p>
                  </div>
                  <div className="flex-1">
                    <p className="text-xs md:text-sm font-medium text-foreground">{session.course}</p>
                    <p className="text-xs text-muted">
                      {session.trainer} - {session.room}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Grades */}
        <div className="glass-card rounded-xl p-4 md:p-6">
          <h3 className="mb-3 md:mb-4 text-base md:text-lg font-semibold text-foreground">
            {t("myGrades")}
          </h3>

          {/* Mobile Card Layout (<md) */}
          <div className="space-y-3 md:hidden">
            {grades.map((item, i) => (
              <div key={i} className="rounded-lg bg-background p-3">
                <p className="mb-1 text-xs font-medium text-foreground">{item.course}</p>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-foreground">{item.grade}</span>
                  <span className="rounded-full bg-success/10 px-2 py-0.5 text-xs font-semibold text-success">
                    {item.letter}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Desktop Table Layout (>=md) */}
          <div className="hidden md:block">
            <div className="space-y-3">
              {grades.map((item, i) => (
                <div key={i} className="flex items-center justify-between rounded-lg bg-background p-3">
                  <span className="text-xs md:text-sm text-foreground">{item.course}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-xs md:text-sm font-bold text-foreground">{item.grade}</span>
                    <span className="rounded-full bg-success/10 px-2 py-0.5 text-xs font-semibold text-success">
                      {item.letter}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
