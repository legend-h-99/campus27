"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { PageHeader } from "@/components/shared/page-header";
import {
  ChevronLeft,
  ChevronRight,
  Calendar,
  Clock,
  MapPin,
  Download,
  Filter,
  Printer,
} from "lucide-react";

// ---------- Types ----------
interface ScheduleSlot {
  id: string;
  courseCode: string;
  courseName: string;
  trainer: string;
  room: string;
  day: number; // 0 = Sunday, 1 = Monday, ..., 4 = Thursday
  startPeriod: number; // 1-8
  endPeriod: number;
  department: string;
  type: "lecture" | "lab" | "seminar";
}

// ---------- Constants ----------
const days = [
  { key: 0, label: "الأحد" },
  { key: 1, label: "الاثنين" },
  { key: 2, label: "الثلاثاء" },
  { key: 3, label: "الأربعاء" },
  { key: 4, label: "الخميس" },
];

const periods = [
  { num: 1, time: "07:30 - 08:20" },
  { num: 2, time: "08:30 - 09:20" },
  { num: 3, time: "09:30 - 10:20" },
  { num: 4, time: "10:30 - 11:20" },
  { num: 5, time: "11:30 - 12:20" },
  { num: 6, time: "12:30 - 01:20" },
  { num: 7, time: "01:30 - 02:20" },
  { num: 8, time: "02:30 - 03:20" },
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

// ---------- Mock Data ----------
const mockSchedule: ScheduleSlot[] = [
  // Sunday
  {
    id: "1",
    courseCode: "CS101",
    courseName: "مقدمة في الحاسب الآلي",
    trainer: "د. خالد السعيد",
    room: "A-101",
    day: 0,
    startPeriod: 1,
    endPeriod: 2,
    department: "الحاسب الآلي",
    type: "lecture",
  },
  {
    id: "2",
    courseCode: "EE101",
    courseName: "أساسيات الكهرباء",
    trainer: "د. محمد الزهراني",
    room: "B-201",
    day: 0,
    startPeriod: 3,
    endPeriod: 4,
    department: "الكهرباء",
    type: "lecture",
  },
  {
    id: "3",
    courseCode: "ME101",
    courseName: "الرسم الهندسي",
    trainer: "د. أحمد الغامدي",
    room: "C-Lab1",
    day: 0,
    startPeriod: 5,
    endPeriod: 7,
    department: "الميكانيكا",
    type: "lab",
  },

  // Monday
  {
    id: "4",
    courseCode: "CS201",
    courseName: "البرمجة بلغة جافا",
    trainer: "د. عبدالرحمن الشهري",
    room: "A-Lab2",
    day: 1,
    startPeriod: 1,
    endPeriod: 3,
    department: "الحاسب الآلي",
    type: "lab",
  },
  {
    id: "5",
    courseCode: "EE201",
    courseName: "الدوائر الكهربائية",
    trainer: "د. محمد الزهراني",
    room: "B-202",
    day: 1,
    startPeriod: 4,
    endPeriod: 5,
    department: "الكهرباء",
    type: "lecture",
  },
  {
    id: "6",
    courseCode: "BA101",
    courseName: "مبادئ إدارة الأعمال",
    trainer: "م. تركي العتيبي",
    room: "D-301",
    day: 1,
    startPeriod: 6,
    endPeriod: 7,
    department: "الإدارة المكتبية",
    type: "lecture",
  },

  // Tuesday
  {
    id: "7",
    courseCode: "CS301",
    courseName: "قواعد البيانات",
    trainer: "د. عبدالرحمن الشهري",
    room: "A-Lab3",
    day: 2,
    startPeriod: 1,
    endPeriod: 3,
    department: "الحاسب الآلي",
    type: "lab",
  },
  {
    id: "8",
    courseCode: "EL101",
    courseName: "أساسيات الإلكترونيات",
    trainer: "م. سلطان القحطاني",
    room: "B-Lab1",
    day: 2,
    startPeriod: 3,
    endPeriod: 4,
    department: "الإلكترونيات",
    type: "lecture",
  },
  {
    id: "9",
    courseCode: "WD101",
    courseName: "أساسيات اللحام",
    trainer: "م. يوسف المطيري",
    room: "W-Shop1",
    day: 2,
    startPeriod: 5,
    endPeriod: 8,
    department: "اللحام والتشكيل",
    type: "lab",
  },

  // Wednesday
  {
    id: "10",
    courseCode: "CS401",
    courseName: "شبكات الحاسب",
    trainer: "م. بدر الراشد",
    room: "A-Lab4",
    day: 3,
    startPeriod: 1,
    endPeriod: 2,
    department: "الحاسب الآلي",
    type: "lecture",
  },
  {
    id: "11",
    courseCode: "EE301",
    courseName: "أنظمة التحكم الآلي",
    trainer: "م. فهد الدوسري",
    room: "B-Lab2",
    day: 3,
    startPeriod: 3,
    endPeriod: 5,
    department: "الكهرباء",
    type: "lab",
  },
  {
    id: "12",
    courseCode: "ME201",
    courseName: "ميكانيكا المواد",
    trainer: "د. أحمد الغامدي",
    room: "C-201",
    day: 3,
    startPeriod: 6,
    endPeriod: 7,
    department: "الميكانيكا",
    type: "lecture",
  },

  // Thursday
  {
    id: "13",
    courseCode: "CS101",
    courseName: "مقدمة في الحاسب الآلي",
    trainer: "د. خالد السعيد",
    room: "A-Lab1",
    day: 4,
    startPeriod: 1,
    endPeriod: 3,
    department: "الحاسب الآلي",
    type: "lab",
  },
  {
    id: "14",
    courseCode: "ME301",
    courseName: "صيانة المركبات",
    trainer: "د. سعد الحربي",
    room: "M-Shop1",
    day: 4,
    startPeriod: 3,
    endPeriod: 6,
    department: "الميكانيكا",
    type: "lab",
  },
  {
    id: "15",
    courseCode: "EE101",
    courseName: "أساسيات الكهرباء",
    trainer: "د. محمد الزهراني",
    room: "B-Lab3",
    day: 4,
    startPeriod: 7,
    endPeriod: 8,
    department: "الكهرباء",
    type: "lab",
  },
];

// ---------- Helpers ----------
function getTypeConfig(type: ScheduleSlot["type"]) {
  switch (type) {
    case "lecture":
      return {
        label: "نظري",
        bg: "bg-teal-100 border-teal-600/30",
        text: "text-teal-600",
        accent: "bg-teal-600",
      };
    case "lab":
      return {
        label: "عملي",
        bg: "bg-teal-100 border-teal-700/30",
        text: "text-teal-700",
        accent: "bg-teal-700",
      };
    case "seminar":
      return {
        label: "ندوة",
        bg: "bg-amber-100 border-amber-600/30",
        text: "text-amber-600",
        accent: "bg-amber-600",
      };
  }
}

function getDeptColor(dept: string) {
  const colors: Record<string, string> = {
    "الحاسب الآلي": "border-s-[#667eea]",
    "الكهرباء": "border-s-[#f5576c]",
    "الميكانيكا": "border-s-[#4facfe]",
    "الإلكترونيات": "border-s-[#43e97b]",
    "الإدارة المكتبية": "border-s-[#fa709a]",
    "اللحام والتشكيل": "border-s-[#a18cd1]",
  };
  return colors[dept] || "border-s-teal-600";
}

// ---------- Component ----------
export default function SchedulesPage() {
  const t = useTranslations("schedules");

  const [selectedDepartment, setSelectedDepartment] = useState("الكل");
  const [currentWeek, setCurrentWeek] = useState("الأسبوع الحالي");

  const filtered =
    selectedDepartment === "الكل"
      ? mockSchedule
      : mockSchedule.filter((s) => s.department === selectedDepartment);

  // Compute slot for given day and period
  function getSlot(day: number, period: number) {
    return filtered.find(
      (s) => s.day === day && s.startPeriod <= period && s.endPeriod >= period
    );
  }

  // Check if this period is the start of a slot
  function isSlotStart(day: number, period: number) {
    return filtered.find((s) => s.day === day && s.startPeriod === period);
  }

  // Check if this period is inside (but not start) of a slot
  function isInsideSlot(day: number, period: number) {
    return filtered.find(
      (s) => s.day === day && s.startPeriod < period && s.endPeriod >= period
    );
  }

  // Stats
  const lectureCount = filtered.filter((s) => s.type === "lecture").length;
  const labCount = filtered.filter((s) => s.type === "lab").length;
  const uniqueRooms = new Set(filtered.map((s) => s.room)).size;

  return (
    <div className="animate-fade-in">
      <PageHeader
        title={t("title")}
        description={t("description")}
        actions={
          <div className="flex items-center gap-2">
            <button className="inline-flex items-center gap-2 rounded-lg border border-border px-4 py-2.5 text-sm font-medium text-muted transition-colors hover:bg-background">
              <Printer className="h-4 w-4" />
              {t("print")}
            </button>
            <button className="inline-flex items-center gap-2 rounded-lg border border-border px-4 py-2.5 text-sm font-medium text-muted transition-colors hover:bg-background">
              <Download className="h-4 w-4" />
              {t("export")}
            </button>
          </div>
        }
      />

      {/* Summary Cards */}
      <div className="mb-4 grid grid-cols-2 gap-3 md:mb-6 md:gap-4 lg:grid-cols-4">
        <div className="glass-card flex items-center gap-3 p-3 md:gap-4 md:p-4">
          <div className="rounded-lg bg-teal-100 p-2 md:p-3">
            <Calendar className="h-5 w-5 text-teal-600 md:h-6 md:w-6" />
          </div>
          <div>
            <p className="text-xs text-muted md:text-sm">{t("totalSessions")}</p>
            <p className="text-xl font-bold text-foreground md:text-2xl">{filtered.length}</p>
          </div>
        </div>

        <div className="glass-card flex items-center gap-3 p-3 md:gap-4 md:p-4">
          <div className="rounded-lg bg-aqua-100 p-2 md:p-3">
            <Clock className="h-5 w-5 text-aqua-700 md:h-6 md:w-6" />
          </div>
          <div>
            <p className="text-xs text-muted md:text-sm">{t("lectures")}</p>
            <p className="text-xl font-bold text-foreground md:text-2xl">{lectureCount}</p>
          </div>
        </div>

        <div className="glass-card flex items-center gap-3 p-3 md:gap-4 md:p-4">
          <div className="rounded-lg bg-teal-100 p-2 md:p-3">
            <Clock className="h-5 w-5 text-teal-700 md:h-6 md:w-6" />
          </div>
          <div>
            <p className="text-xs text-muted md:text-sm">{t("labs")}</p>
            <p className="text-xl font-bold text-foreground md:text-2xl">{labCount}</p>
          </div>
        </div>

        <div className="glass-card flex items-center gap-3 p-3 md:gap-4 md:p-4">
          <div className="rounded-lg bg-amber-100 p-2 md:p-3">
            <MapPin className="h-5 w-5 text-amber-600 md:h-6 md:w-6" />
          </div>
          <div>
            <p className="text-xs text-muted md:text-sm">{t("rooms")}</p>
            <p className="text-xl font-bold text-foreground md:text-2xl">{uniqueRooms}</p>
          </div>
        </div>
      </div>

      {/* Filters + Week Navigation */}
      <div className="glass-card mb-4 flex flex-col gap-3 p-3 sm:flex-row sm:items-center sm:justify-between md:mb-6 md:gap-4 md:p-4">
        <div className="flex items-center gap-3">
          <Filter className="h-4 w-4 text-muted" />
          <select
            value={selectedDepartment}
            onChange={(e) => setSelectedDepartment(e.target.value)}
            className="rounded-lg border border-border bg-background px-3 py-2.5 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          >
            {departments.map((dept) => (
              <option key={dept} value={dept}>
                {dept}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setCurrentWeek("الأسبوع السابق")}
            className="rounded-lg p-2 text-muted transition-colors hover:bg-background"
            aria-label="الأسبوع السابق"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
          <span className="min-w-[140px] text-center text-sm font-medium text-foreground">
            {currentWeek}
          </span>
          <button
            onClick={() => setCurrentWeek("الأسبوع التالي")}
            className="rounded-lg p-2 text-muted transition-colors hover:bg-background"
            aria-label="الأسبوع التالي"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <div className="h-3 w-3 rounded-sm bg-teal-600/20" />
            <span className="text-xs text-muted">{t("lecture")}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="h-3 w-3 rounded-sm bg-teal-700/20" />
            <span className="text-xs text-muted">{t("lab")}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="h-3 w-3 rounded-sm bg-amber-600/20" />
            <span className="text-xs text-muted">{t("seminar")}</span>
          </div>
        </div>
      </div>

      {/* Weekly Schedule Grid */}
      <div className="glass-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-[600px] w-full border-collapse">
            <thead>
              <tr>
                <th className="sticky start-0 z-10 min-w-[100px] border-b border-e border-border bg-white/30 px-3 py-3.5 text-start text-xs font-semibold text-muted backdrop-blur-sm">
                  {t("period")}
                </th>
                {days.map((day) => (
                  <th
                    key={day.key}
                    className="min-w-[180px] border-b border-border bg-white/30 px-3 py-3.5 text-center text-sm font-semibold text-foreground"
                  >
                    {day.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {periods.map((period) => (
                <tr key={period.num} className="group">
                  {/* Period label */}
                  <td className="sticky start-0 z-10 border-b border-e border-border bg-white/30 px-3 py-2 backdrop-blur-sm">
                    <div className="text-center">
                      <p className="text-xs font-semibold text-foreground">
                        {t("periodNum")} {period.num}
                      </p>
                      <p className="mt-0.5 text-[10px] text-muted" dir="ltr">
                        {period.time}
                      </p>
                    </div>
                  </td>

                  {/* Day cells */}
                  {days.map((day) => {
                    const slot = isSlotStart(day.key, period.num);
                    const inside = isInsideSlot(day.key, period.num);

                    // Skip rendering if we're inside a multi-period slot
                    if (inside) {
                      return null;
                    }

                    if (slot) {
                      const span = slot.endPeriod - slot.startPeriod + 1;
                      const typeCfg = getTypeConfig(slot.type);
                      const deptColor = getDeptColor(slot.department);

                      return (
                        <td
                          key={day.key}
                          rowSpan={span}
                          className="border-b border-border p-1.5"
                        >
                          <div
                            className={`h-full rounded-lg border ${typeCfg.bg} border-s-4 ${deptColor} p-2.5 transition-all hover:shadow-sm`}
                          >
                            <div className="flex items-start justify-between">
                              <span className="font-mono text-xs font-bold text-teal-600">
                                {slot.courseCode}
                              </span>
                              <span
                                className={`rounded px-1.5 py-0.5 text-[10px] font-medium ${typeCfg.bg} ${typeCfg.text}`}
                              >
                                {typeCfg.label}
                              </span>
                            </div>
                            <p className="mt-1 text-xs font-medium leading-relaxed text-foreground">
                              {slot.courseName}
                            </p>
                            <div className="mt-2 space-y-1">
                              <p className="text-[10px] text-muted">
                                {slot.trainer}
                              </p>
                              <div className="flex items-center gap-1">
                                <MapPin className="h-2.5 w-2.5 text-muted" />
                                <span className="text-[10px] font-medium text-muted">
                                  {slot.room}
                                </span>
                              </div>
                            </div>
                          </div>
                        </td>
                      );
                    }

                    // Empty cell
                    return (
                      <td
                        key={day.key}
                        className="border-b border-border p-1.5"
                      >
                        <div className="flex h-full min-h-[60px] items-center justify-center rounded-lg border border-dashed border-border/50 bg-background/30">
                          <span className="text-[10px] text-muted/40">--</span>
                        </div>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* No sessions message */}
      {filtered.length === 0 && (
        <div className="glass-card mt-4 flex flex-col items-center justify-center py-16">
          <Calendar className="mb-3 h-12 w-12 text-muted/40" />
          <p className="text-sm text-muted">{t("noSessions")}</p>
        </div>
      )}
    </div>
  );
}
