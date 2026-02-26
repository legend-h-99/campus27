"use client";

import { useEffect, useState } from "react";
import { FadeInSection } from "@/components/ui/fade-in-section";
import { StaggerChildren } from "@/components/ui/stagger-children";

interface FeaturesGridProps {
  locale: string;
}

// ── Card 1: Diagnostic Shuffler ──────────────────────────────────────────────
function DiagnosticShuffler({ isAr }: { isAr: boolean }) {
  const labels = isAr
    ? ["القبول الذكي", "تسجيل الحضور", "رصد الدرجات"]
    : ["Smart Admission", "Attendance Tracking", "Grade Recording"];
  const [top, setTop] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setTop((p) => (p + 1) % labels.length), 3000);
    return () => clearInterval(id);
  }, [labels.length]);

  return (
    <div className="relative h-28 mt-4">
      {labels.map((label, i) => {
        const offset = (i - top + labels.length) % labels.length;
        const zIndex = labels.length - offset;
        const translateY = offset * 10;
        const scale = 1 - offset * 0.06;
        const opacity = offset === 0 ? 1 : offset === 1 ? 0.6 : 0.3;
        return (
          <div
            key={label}
            className="absolute inset-x-0 top-0 flex items-center gap-3 rounded-2xl bg-white px-4 py-3 shadow-sm"
            style={{
              border: "1px solid rgba(28,28,30,0.07)",
              zIndex,
              transform: `translateY(${translateY}px) scale(${scale})`,
              opacity,
              transition: "all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)",
            }}
          >
            <div className="h-2 w-2 rounded-full" style={{ background: "var(--bs-signal)" }} />
            <span className="text-sm font-medium" style={{ color: "var(--bs-steel)" }}>
              {label}
            </span>
          </div>
        );
      })}
    </div>
  );
}

// ── Card 2: Telemetry Typewriter ─────────────────────────────────────────────
const FEED_LINES_AR = [
  "✓ تم تسجيل حضور 47 متدرباً",
  "⚡ درجات الاختبار محدّثة",
  "📊 تقرير الأسبوع جاهز",
  "🔔 تحذير: 3 متدربين بنسبة غياب عالية",
];
const FEED_LINES_EN = [
  "✓ 47 trainees attendance recorded",
  "⚡ Exam grades updated",
  "📊 Weekly report ready",
  "🔔 Alert: 3 trainees with high absence",
];

function TelemetryTypewriter({ isAr }: { isAr: boolean }) {
  const lines = isAr ? FEED_LINES_AR : FEED_LINES_EN;
  const [lineIdx, setLineIdx] = useState(0);
  const [charIdx, setCharIdx] = useState(0);
  const [displayed, setDisplayed] = useState("");

  useEffect(() => {
    const current = lines[lineIdx];
    if (charIdx < current.length) {
      const t = setTimeout(() => {
        setDisplayed(current.slice(0, charIdx + 1));
        setCharIdx((c) => c + 1);
      }, 45);
      return () => clearTimeout(t);
    } else {
      const t = setTimeout(() => {
        setLineIdx((i) => (i + 1) % lines.length);
        setCharIdx(0);
        setDisplayed("");
      }, 2000);
      return () => clearTimeout(t);
    }
  }, [charIdx, lineIdx, lines]);

  return (
    <div
      className="mt-4 rounded-xl p-4 text-sm"
      style={{ background: "var(--bs-steel)", fontFamily: "var(--bs-mono)" }}
    >
      <div className="flex items-center gap-2 mb-3">
        <span
          className="h-1.5 w-1.5 animate-pulse rounded-full"
          style={{ background: "var(--bs-signal)" }}
        />
        <span className="text-xs" style={{ color: "var(--bs-signal)" }}>
          {isAr ? "بث مباشر" : "Live Feed"}
        </span>
      </div>
      <p className="min-h-[1.25rem]" style={{ color: "rgba(255,255,255,0.75)" }}>
        {displayed}
        <span className="animate-pulse" style={{ color: "var(--bs-signal)" }}>|</span>
      </p>
    </div>
  );
}

// ── Card 3: Scheduler Animation ──────────────────────────────────────────────
function SchedulerAnimation({ isAr }: { isAr: boolean }) {
  const days = isAr ? ["أ", "ث", "ث", "خ", "ج"] : ["S", "M", "T", "W", "T"];
  const [activeDay, setActiveDay] = useState(-1);

  useEffect(() => {
    const ids: ReturnType<typeof setTimeout>[] = [];
    const cycle = () => {
      setActiveDay(-1);
      days.forEach((_, i) => {
        ids.push(setTimeout(() => setActiveDay(i), i * 600 + 500));
      });
      ids.push(setTimeout(() => setActiveDay(-1), days.length * 600 + 1000));
      ids.push(setTimeout(cycle, days.length * 600 + 2500));
    };
    const start = setTimeout(cycle, 500);
    ids.push(start);
    return () => ids.forEach(clearTimeout);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="mt-4">
      <div className="flex gap-2 justify-between">
        {days.map((d, i) => (
          <div
            key={i}
            className="flex-1 rounded-xl py-2 text-center text-sm font-bold transition-all duration-300"
            style={{
              background: activeDay === i ? "var(--bs-signal)" : "var(--bs-chalk)",
              color: activeDay === i ? "white" : "var(--bs-muted)",
              transform: activeDay === i ? "scale(1.1)" : "scale(1)",
              boxShadow: activeDay === i ? "0 4px 12px rgba(255,59,48,0.3)" : "none",
            }}
          >
            {d}
          </div>
        ))}
      </div>
      <div
        className="mt-3 w-full rounded-xl py-2 text-center text-sm font-semibold transition-all"
        style={{
          color: "var(--bs-steel)",
          background: activeDay >= 0 ? "rgba(255,59,48,0.08)" : "var(--bs-chalk)",
          border: activeDay >= 0 ? "1px solid rgba(255,59,48,0.3)" : "1px solid rgba(28,28,30,0.08)",
        }}
      >
        {isAr ? "حفظ الجدول" : "Save Schedule"}
      </div>
    </div>
  );
}

// ── Main Component ────────────────────────────────────────────────────────────
export function FeaturesGrid({ locale }: FeaturesGridProps) {
  const isAr = locale === "ar";

  const cards = [
    {
      title: isAr ? "تتبع الأداء لحظيًا" : "Real-time Performance",
      desc: isAr
        ? "راقب تقدم كل متدرب فور حدوثه مع تنبيهات ذكية فورية"
        : "Monitor every trainee's progress as it happens with instant smart alerts",
      widget: <DiagnosticShuffler isAr={isAr} />,
    },
    {
      title: isAr ? "بث مباشر للبيانات" : "Live Data Feed",
      desc: isAr
        ? "تدفق مستمر للأحداث مع تنبيهات وتصدير فوري للتقارير"
        : "Continuous event stream with alerts and instant report export",
      widget: <TelemetryTypewriter isAr={isAr} />,
    },
    {
      title: isAr ? "جدولة ذكية للبرامج" : "Smart Program Scheduling",
      desc: isAr
        ? "جداول تلقائية تتجنب التعارضات وتحسّن توزيع الموارد"
        : "Auto-generated schedules with conflict detection and resource optimization",
      widget: <SchedulerAnimation isAr={isAr} />,
    },
  ];

  return (
    <section className="py-24" style={{ background: "var(--bs-concrete)" }}>
      <div className="mx-auto max-w-7xl px-6">
        <FadeInSection className="mb-16 text-center">
          <p
            className="mb-3 text-xs font-semibold uppercase tracking-widest"
            style={{ color: "var(--bs-signal)", fontFamily: "var(--bs-mono)" }}
          >
            {isAr ? "أدوات حقيقية" : "Real Tools"}
          </p>
          <h2
            className="text-3xl font-extrabold md:text-4xl"
            style={{ color: "var(--bs-steel)", fontFamily: "var(--bs-grotesk)" }}
          >
            {isAr ? "ليست مجرد صور — تعمل فعلاً" : "Not Just Screenshots — Actually Working"}
          </h2>
          <p className="mt-4 text-lg" style={{ color: "var(--bs-muted)" }}>
            {isAr
              ? "كل بطاقة هي نظام مصغّر يعمل داخل المنصة"
              : "Every card is a real micro-system running inside the platform"}
          </p>
        </FadeInSection>

        <StaggerChildren className="grid gap-6 md:grid-cols-3" staggerMs={120}>
          {cards.map((card) => (
            <div
              key={card.title}
              className="rounded-3xl p-6 transition-all duration-300 hover:-translate-y-1"
              style={{
                background: "#fff",
                border: "1px solid rgba(28,28,30,0.08)",
                boxShadow: "0 2px 12px rgba(28,28,30,0.06)",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLDivElement).style.boxShadow =
                  "0 12px 40px rgba(255,59,48,0.10)";
                (e.currentTarget as HTMLDivElement).style.borderColor = "rgba(255,59,48,0.2)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLDivElement).style.boxShadow =
                  "0 2px 12px rgba(28,28,30,0.06)";
                (e.currentTarget as HTMLDivElement).style.borderColor = "rgba(28,28,30,0.08)";
              }}
            >
              <h3
                className="text-lg font-bold"
                style={{ color: "var(--bs-steel)", fontFamily: "var(--bs-grotesk)" }}
              >
                {card.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed" style={{ color: "var(--bs-muted)" }}>
                {card.desc}
              </p>
              {card.widget}
            </div>
          ))}
        </StaggerChildren>
      </div>
    </section>
  );
}
