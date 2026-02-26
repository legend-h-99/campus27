# Campus27 Cinematic Marketing Site — Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Upgrade the existing Next.js marketing pages from clean-functional to cinematic — floating navbar, full-bleed hero, interactive micro-UI feature cards, philosophy manifesto, sticky protocol cards, dark footer, and engagement API routes.

**Architecture:** Pure CSS animation upgrade on existing Next.js 16 App Router structure. No new animation libraries. New sections added as separate components composed in `home/page.tsx`. Three new API routes under `/api/v1/`. Two new Prisma models for marketing analytics.

**Tech Stack:** Next.js 16, TypeScript, Tailwind CSS 4, Prisma + PostgreSQL, next-intl (AR/EN), CSS `@keyframes`, IntersectionObserver, `position: sticky`

**Design doc:** `docs/plans/2026-02-25-cinematic-marketing-design.md`

---

## Task 1: Foundation — Fonts + next.config + CSS

**Files:**
- Modify: `next.config.ts`
- Modify: `src/app/[locale]/layout.tsx`
- Modify: `src/app/globals.css`

**Step 1: Add Unsplash to next.config.ts remote patterns**

```ts
// next.config.ts — add inside images.remotePatterns array:
{
  protocol: "https",
  hostname: "images.unsplash.com",
},
```

**Step 2: Add Playfair Display font link to locale layout**

In `src/app/[locale]/layout.tsx`, add inside `<html>` before `<body>`:
```tsx
<head>
  <link
    href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@1,700;1,800&display=swap"
    rel="stylesheet"
  />
</head>
```

**Step 3: Add cinematic CSS variables + new keyframes to globals.css**

Append to `src/app/globals.css`:
```css
/* ═══ Cinematic Marketing Variables ═══ */
:root {
  --c27-dark: #0F172A;
  --c27-accent-orange: #F97316;
  --font-drama: "Playfair Display", Georgia, serif;
}

/* ═══ Cinematic Keyframes ═══ */
@keyframes cursor-move {
  0%   { transform: translate(0px, 0px); opacity: 0; }
  5%   { opacity: 1; }
  20%  { transform: translate(40px, 10px); }
  35%  { transform: translate(40px, 10px) scale(0.92); }
  50%  { transform: translate(40px, 10px) scale(1); }
  65%  { transform: translate(90px, 48px); }
  80%  { transform: translate(90px, 48px) scale(0.92); }
  90%  { transform: translate(90px, 48px) scale(1); opacity: 1; }
  100% { transform: translate(90px, 48px); opacity: 0; }
}

@keyframes scan-line {
  0%   { transform: translateY(0); opacity: 0.8; }
  100% { transform: translateY(80px); opacity: 0; }
}

@keyframes ekg-draw {
  0%   { stroke-dashoffset: 400; }
  100% { stroke-dashoffset: 0; }
}

@keyframes concentric-spin {
  from { transform: rotate(0deg); }
  to   { transform: rotate(360deg); }
}

@keyframes border-pulse {
  0%, 100% { box-shadow: 0 0 0 0 rgba(27, 169, 160, 0.3); }
  50%       { box-shadow: 0 0 0 6px rgba(27, 169, 160, 0); }
}

@keyframes search-expand {
  from { max-width: 44px; }
  to   { max-width: 400px; }
}

@keyframes float-continuous {
  0%, 100% { transform: translateY(0px); }
  50%       { transform: translateY(-8px); }
}

@keyframes word-reveal {
  from { opacity: 0; transform: translateY(12px); }
  to   { opacity: 1; transform: translateY(0); }
}

@keyframes sticky-scale-out {
  to { transform: scale(0.90); filter: blur(4px); opacity: 0.45; }
}

/* ═══ Reduced Motion Safety ═══ */
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

**Step 4: Verify TypeScript still compiles**

```bash
cd /Users/hossam/Documents/saohil1
npx tsc --noEmit
```
Expected: no errors

**Step 5: Commit**

```bash
git add next.config.ts src/app/globals.css src/app/\[locale\]/layout.tsx
git commit -m "feat: add cinematic CSS variables, keyframes, Playfair font, Unsplash domain"
```

---

## Task 2: Floating Navbar — Pill Island

**Files:**
- Modify: `src/components/marketing/marketing-navbar.tsx`

**Step 1: Rewrite the navbar**

Replace the full file content:

```tsx
"use client";

import { Link } from "@/i18n/routing";
import { useLocale } from "next-intl";
import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";

export function MarketingNavbar() {
  const locale = useLocale();
  const isAr = locale === "ar";
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const links = [
    { href: "/features", label: isAr ? "الميزات" : "Features" },
    { href: "/pricing",  label: isAr ? "التسعير" : "Pricing"  },
    { href: "/contact",  label: isAr ? "تواصل معنا" : "Contact" },
  ];

  return (
    <header className="fixed inset-x-0 top-4 z-50 flex justify-center px-4">
      {/* Floating Pill */}
      <nav
        aria-label={isAr ? "التنقل الرئيسي" : "Main navigation"}
        className={`flex items-center gap-6 rounded-full px-5 py-2.5 transition-all duration-500
          ${scrolled
            ? "bg-white/85 backdrop-blur-xl border border-slate-200/60 shadow-xl shadow-slate-900/10"
            : "bg-transparent border border-white/20"
          }`}
      >
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 shrink-0">
          <div className="flex h-7 w-7 items-center justify-center rounded-xl bg-teal-600 text-white font-bold text-xs shadow-sm">
            C
          </div>
          <span className={`text-sm font-bold transition-colors duration-300 ${scrolled ? "text-slate-900" : "text-white"}`}>
            Campus27
          </span>
        </Link>

        {/* Desktop Links */}
        <div className="hidden items-center gap-5 md:flex">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={`text-sm font-medium transition-colors duration-300 hover:text-teal-500
                ${scrolled ? "text-slate-600" : "text-white/80"}`}
            >
              {l.label}
            </Link>
          ))}
        </div>

        {/* Desktop CTA */}
        <div className="hidden items-center gap-3 md:flex">
          <Link
            href="/login"
            className={`text-sm font-medium transition-colors duration-300
              ${scrolled ? "text-slate-600 hover:text-teal-600" : "text-white/80 hover:text-white"}`}
          >
            {isAr ? "دخول" : "Sign In"}
          </Link>
          <Link
            href="/contact"
            className="relative overflow-hidden rounded-full bg-orange-500 px-4 py-1.5 text-sm font-semibold text-white shadow-md
                       transition-transform duration-200 hover:-translate-y-0.5 hover:shadow-lg active:scale-95"
          >
            <span className="relative z-10">{isAr ? "ابدأ الآن" : "Get Started"}</span>
            <span className="absolute inset-0 -translate-x-full bg-orange-600 transition-transform duration-300 group-hover:translate-x-0" />
          </Link>
        </div>

        {/* Mobile Toggle */}
        <button
          className={`flex items-center justify-center rounded-full p-1.5 transition-colors md:hidden
            ${scrolled ? "text-slate-600 hover:bg-slate-100" : "text-white hover:bg-white/10"}`}
          onClick={() => setMenuOpen((v) => !v)}
          aria-label={isAr ? "القائمة" : "Menu"}
          aria-expanded={menuOpen}
        >
          {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </nav>

      {/* Mobile Drawer */}
      {menuOpen && (
        <div className="absolute inset-x-4 top-14 rounded-2xl border border-slate-100 bg-white/95 backdrop-blur-xl p-4 shadow-xl md:hidden"
             style={{ animation: "scaleIn 0.15s cubic-bezier(0.16,1,0.3,1) both" }}>
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="block py-2.5 text-sm font-medium text-slate-700 hover:text-teal-600"
              onClick={() => setMenuOpen(false)}
            >
              {l.label}
            </Link>
          ))}
          <Link
            href="/contact"
            className="mt-3 block rounded-xl bg-orange-500 px-4 py-2 text-center text-sm font-semibold text-white"
            onClick={() => setMenuOpen(false)}
          >
            {isAr ? "ابدأ الآن" : "Get Started"}
          </Link>
        </div>
      )}
    </header>
  );
}
```

**Step 2: Verify build**
```bash
npx tsc --noEmit
```

**Step 3: Commit**
```bash
git add src/components/marketing/marketing-navbar.tsx
git commit -m "feat: upgrade navbar to floating pill island"
```

---

## Task 3: Hero Section — Full-Bleed Cinematic

**Files:**
- Modify: `src/components/marketing/hero-section.tsx`

**Step 1: Rewrite hero-section.tsx**

```tsx
import { Link } from "@/i18n/routing";
import { ArrowLeft, ArrowRight } from "lucide-react";

interface HeroSectionProps {
  locale: string;
}

// Unsplash image: modern academic institution, architectural, cinematic
const BG_IMAGE =
  "https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&w=1920&q=80";

export function HeroSection({ locale }: HeroSectionProps) {
  const isAr = locale === "ar";

  return (
    <section
      className="relative flex min-h-[100dvh] flex-col justify-end overflow-hidden pb-20 ps-8 pe-8"
      style={{
        backgroundImage: `url(${BG_IMAGE})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Dark gradient overlay */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#0F172A]/95 via-[#0F172A]/55 to-transparent" />

      {/* Noise overlay */}
      <svg
        className="pointer-events-none absolute inset-0 h-full w-full opacity-[0.035]"
        xmlns="http://www.w3.org/2000/svg"
      >
        <filter id="hero-noise">
          <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch" />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width="100%" height="100%" filter="url(#hero-noise)" />
      </svg>

      {/* Content — bottom-start */}
      <div className="relative z-10 max-w-2xl">
        {/* Badge */}
        <div
          className="mb-6 inline-flex items-center gap-2 rounded-full border border-teal-400/30 bg-teal-500/10 px-4 py-1.5 text-sm font-medium text-teal-300"
          style={{ animation: "fade-in-up 0.5s cubic-bezier(0.16,1,0.3,1) 0.1s both" }}
        >
          <span className="h-1.5 w-1.5 rounded-full bg-teal-400 animate-pulse" />
          {isAr ? "منصة معتمدة للكليات التقنية" : "Certified Platform for Technical Colleges"}
        </div>

        {/* Dramatic headline */}
        <h1
          className="mb-6 text-white"
          style={{ animation: "fade-in-up 0.6s cubic-bezier(0.16,1,0.3,1) 0.2s both" }}
        >
          <span className="block text-5xl font-bold leading-tight lg:text-7xl">
            {isAr ? "إدارة الكلية" : "College Management"}
          </span>
          <span
            className="block text-5xl leading-tight text-teal-400 lg:text-7xl"
            style={{ fontFamily: "var(--font-drama)", fontStyle: "italic", fontWeight: 800 }}
          >
            {isAr ? "بـ ذكاء." : "with Intelligence."}
          </span>
        </h1>

        {/* Subtitle */}
        <p
          className="mb-8 max-w-xl text-lg leading-relaxed text-slate-300"
          style={{ animation: "fade-in-up 0.6s cubic-bezier(0.16,1,0.3,1) 0.35s both" }}
        >
          {isAr
            ? "من القبول إلى التخرج — كل شيء في مكان واحد، بالعربية والإنجليزية"
            : "From Admission to Graduation — Everything in One Place, Arabic & English"}
        </p>

        {/* CTAs */}
        <div
          className="flex flex-wrap items-center gap-3"
          style={{ animation: "fade-in-up 0.6s cubic-bezier(0.16,1,0.3,1) 0.5s both" }}
        >
          <Link
            href="/contact"
            className="flex items-center gap-2 rounded-full bg-orange-500 px-6 py-3 text-sm font-semibold text-white shadow-lg
                       transition-all duration-200 hover:-translate-y-0.5 hover:bg-orange-400 hover:shadow-xl active:scale-95"
          >
            {isAr ? "ابدأ تجربتك المجانية" : "Start Free Trial"}
            {isAr ? <ArrowLeft className="h-4 w-4" /> : <ArrowRight className="h-4 w-4" />}
          </Link>
          <Link
            href="/features"
            className="flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-6 py-3 text-sm font-semibold text-white backdrop-blur-sm
                       transition-all duration-200 hover:bg-white/20 hover:-translate-y-0.5 active:scale-95"
          >
            {isAr ? "اكتشف الميزات" : "Explore Features"}
          </Link>
        </div>

        {/* Floating stats */}
        <div
          className="mt-10 flex flex-wrap gap-6"
          style={{ animation: "fade-in-up 0.6s cubic-bezier(0.16,1,0.3,1) 0.65s both" }}
        >
          {[
            { n: "+200", l: isAr ? "كلية" : "Colleges" },
            { n: "94%",  l: isAr ? "معدل حضور" : "Attendance" },
            { n: "99.9%",l: isAr ? "وقت تشغيل" : "Uptime" },
          ].map((s) => (
            <div key={s.l}>
              <p className="text-2xl font-bold text-white">{s.n}</p>
              <p className="text-xs text-slate-400">{s.l}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Scroll indicator */}
      <div
        className="absolute bottom-6 start-1/2 -translate-x-1/2 flex flex-col items-center gap-1 text-white/40"
        style={{ animation: "fade-in-up 0.6s cubic-bezier(0.16,1,0.3,1) 0.8s both" }}
      >
        <div className="h-8 w-px bg-gradient-to-b from-transparent to-white/30" />
        <p className="text-xs font-mono">{isAr ? "مرر للأسفل" : "scroll"}</p>
      </div>
    </section>
  );
}
```

**Step 2: Verify**
```bash
npx tsc --noEmit
```

**Step 3: Commit**
```bash
git add src/components/marketing/hero-section.tsx
git commit -m "feat: upgrade hero to full-bleed cinematic with dramatic Arabic headline"
```

---

## Task 4: Stats Banner — Dark Teal + Noise

**Files:**
- Modify: `src/components/marketing/stats-banner.tsx`

**Step 1: Rewrite stats-banner.tsx**

```tsx
import { CountUp } from "@/components/ui/count-up";
import { FadeInSection } from "@/components/ui/fade-in-section";

interface StatsBannerProps {
  locale: string;
}

export function StatsBanner({ locale }: StatsBannerProps) {
  const isAr = locale === "ar";
  const stats = [
    { value: 200, prefix: "+", suffix: "",    label: isAr ? "كلية تثق بنا"     : "Colleges Trust Us"   },
    { value: 94,  prefix: "",  suffix: "%",   label: isAr ? "معدل الحضور"      : "Attendance Rate"     },
    { value: 50,  prefix: "+", suffix: "",    label: isAr ? "تخصصاً مدعوماً"   : "Supported Majors"   },
    { value: 99,  prefix: "",  suffix: ".9%", label: isAr ? "وقت تشغيل مضمون" : "Guaranteed Uptime"  },
  ];

  return (
    <FadeInSection>
      <section className="relative overflow-hidden bg-teal-900 py-16">
        {/* Noise overlay */}
        <svg
          className="pointer-events-none absolute inset-0 h-full w-full opacity-[0.04]"
          xmlns="http://www.w3.org/2000/svg"
        >
          <filter id="stats-noise">
            <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch" />
            <feColorMatrix type="saturate" values="0" />
          </filter>
          <rect width="100%" height="100%" filter="url(#stats-noise)" />
        </svg>

        <div className="relative mx-auto max-w-7xl px-6">
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
            {stats.map((s, i) => (
              <div key={s.label} className="text-center">
                <p className="text-4xl font-bold text-white md:text-5xl"
                   style={{ animationDelay: `${i * 0.1}s` }}>
                  <CountUp end={s.value} prefix={s.prefix} suffix={s.suffix} />
                </p>
                <p className="mt-2 text-sm text-teal-200">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </FadeInSection>
  );
}
```

**Step 2: Commit**
```bash
git add src/components/marketing/stats-banner.tsx
git commit -m "feat: upgrade stats banner to dark teal with noise overlay"
```

---

## Task 5: Features Grid — 3 Interactive Micro-UI Cards

**Files:**
- Modify: `src/components/marketing/features-grid.tsx`

**Step 1: Rewrite features-grid.tsx**

```tsx
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
            className="absolute inset-x-0 top-0 flex items-center gap-3 rounded-2xl border border-slate-100 bg-white px-4 py-3 shadow-sm"
            style={{
              zIndex,
              transform: `translateY(${translateY}px) scale(${scale})`,
              opacity,
              transition: "all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)",
            }}
          >
            <div className="h-2 w-2 rounded-full bg-teal-500" />
            <span className="text-sm font-medium text-slate-700">{label}</span>
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
    <div className="mt-4 rounded-xl bg-slate-950 p-4 font-mono text-sm">
      <div className="flex items-center gap-2 mb-3">
        <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-teal-400" />
        <span className="text-xs text-teal-400">{isAr ? "بث مباشر" : "Live Feed"}</span>
      </div>
      <p className="text-teal-300 min-h-[1.25rem]">
        {displayed}
        <span className="animate-pulse text-teal-400">|</span>
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
              background: activeDay === i ? "rgb(20 184 166)" : "rgb(248 250 252)",
              color: activeDay === i ? "white" : "rgb(100 116 139)",
              transform: activeDay === i ? "scale(1.1)" : "scale(1)",
              boxShadow: activeDay === i ? "0 4px 12px rgba(27,169,160,0.35)" : "none",
            }}
          >
            {d}
          </div>
        ))}
      </div>
      <div
        className="mt-3 w-full rounded-xl py-2 text-center text-sm font-semibold text-teal-700 transition-all"
        style={{
          background: activeDay >= 0 ? "rgba(27,169,160,0.1)" : "rgb(248 250 252)",
          border: activeDay >= 0 ? "1px solid rgba(27,169,160,0.3)" : "1px solid rgb(226 232 240)",
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
      title: isAr ? "إدارة المتدربين" : "Trainee Management",
      desc: isAr
        ? "قبول ذكي، تسجيل حضور، ومتابعة أداء متكاملة"
        : "Smart admission, attendance, and integrated performance tracking",
      widget: <DiagnosticShuffler isAr={isAr} />,
    },
    {
      title: isAr ? "تقارير لحظية" : "Real-time Reports",
      desc: isAr
        ? "تدفق مستمر للبيانات مع تنبيهات ذكية وتصدير فوري"
        : "Continuous data stream with smart alerts and instant export",
      widget: <TelemetryTypewriter isAr={isAr} />,
    },
    {
      title: isAr ? "جداول ذكية" : "Smart Scheduling",
      desc: isAr
        ? "جداول تلقائية تتجنب التعارضات وتحسّن توزيع الموارد"
        : "Auto-generated schedules with conflict detection and resource optimization",
      widget: <SchedulerAnimation isAr={isAr} />,
    },
  ];

  return (
    <section className="bg-slate-50 py-24">
      <div className="mx-auto max-w-7xl px-6">
        <FadeInSection className="mb-16 text-center">
          <h2 className="text-3xl font-bold text-slate-900 md:text-4xl">
            {isAr ? "أدوات تعمل — ليست مجرد صور" : "Tools That Work — Not Just Screenshots"}
          </h2>
          <p className="mt-4 text-lg text-slate-500">
            {isAr
              ? "كل بطاقة هي نظام مصغّر يعمل فعلاً في المنصة"
              : "Every card is a real micro-system running inside the platform"}
          </p>
        </FadeInSection>

        <StaggerChildren className="grid gap-6 md:grid-cols-3" staggerMs={120}>
          {cards.map((card) => (
            <div
              key={card.title}
              className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-teal-100/50"
            >
              <h3 className="text-lg font-bold text-slate-900">{card.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-500">{card.desc}</p>
              {card.widget}
            </div>
          ))}
        </StaggerChildren>
      </div>
    </section>
  );
}
```

**Step 2: Verify**
```bash
npx tsc --noEmit
```

**Step 3: Commit**
```bash
git add src/components/marketing/features-grid.tsx
git commit -m "feat: replace static feature cards with 3 interactive micro-UI widgets"
```

---

## Task 6: Philosophy Section — Manifesto (New)

**Files:**
- Create: `src/components/marketing/philosophy-section.tsx`

**Step 1: Create the file**

```tsx
"use client";

import { useEffect, useRef, useState } from "react";

interface PhilosophySectionProps {
  locale: string;
}

export function PhilosophySection({ locale }: PhilosophySectionProps) {
  const isAr = locale === "ar";
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); observer.unobserve(el); } },
      { threshold: 0.3 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const line1 = isAr
    ? ["معظم", "الأنظمة", "تُركّز", "على:", "الأوراق", "والإجراءات."]
    : ["Most", "systems", "focus", "on:", "paperwork", "and procedures."];
  const line2parts = isAr
    ? { before: ["نحن", "نُركّز", "على:"], accent: "النتيجة والإنسان." }
    : { before: ["We", "focus", "on:"], accent: "Results and People." };

  return (
    <section className="relative overflow-hidden bg-[#0F172A] py-32">
      {/* Noise overlay */}
      <svg
        className="pointer-events-none absolute inset-0 h-full w-full opacity-[0.04]"
        xmlns="http://www.w3.org/2000/svg"
      >
        <filter id="phil-noise">
          <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch" />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width="100%" height="100%" filter="url(#phil-noise)" />
      </svg>

      <div ref={ref} className="relative mx-auto max-w-4xl px-6 text-center">
        {/* Line 1 */}
        <p className="mb-6 flex flex-wrap justify-center gap-x-3 text-2xl font-bold text-slate-400 md:text-3xl lg:text-4xl">
          {line1.map((word, i) => (
            <span
              key={i}
              className="inline-block transition-all duration-700"
              style={{
                opacity: visible ? 1 : 0,
                transform: visible ? "translateY(0)" : "translateY(16px)",
                transitionDelay: `${i * 80}ms`,
                transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)",
              }}
            >
              {word}
            </span>
          ))}
        </p>

        {/* Line 2 */}
        <p className="flex flex-wrap justify-center gap-x-3 text-2xl font-bold text-white md:text-3xl lg:text-4xl">
          {line2parts.before.map((word, i) => (
            <span
              key={i}
              className="inline-block transition-all duration-700"
              style={{
                opacity: visible ? 1 : 0,
                transform: visible ? "translateY(0)" : "translateY(16px)",
                transitionDelay: `${(line1.length + i) * 80}ms`,
                transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)",
              }}
            >
              {word}
            </span>
          ))}
          <span
            className="inline-block text-teal-400 transition-all duration-700"
            style={{
              fontFamily: "var(--font-drama)",
              fontStyle: "italic",
              opacity: visible ? 1 : 0,
              transform: visible ? "translateY(0)" : "translateY(16px)",
              transitionDelay: `${(line1.length + line2parts.before.length) * 80}ms`,
              transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)",
            }}
          >
            {line2parts.accent}
          </span>
        </p>
      </div>
    </section>
  );
}
```

**Step 2: Commit**
```bash
git add src/components/marketing/philosophy-section.tsx
git commit -m "feat: add philosophy manifesto section with word-by-word reveal"
```

---

## Task 7: Protocol Section — Sticky Stacking (New)

**Files:**
- Create: `src/components/marketing/protocol-section.tsx`

**Step 1: Create the file**

```tsx
"use client";

import { useEffect, useRef, useState } from "react";

interface ProtocolSectionProps {
  locale: string;
}

// ── SVG 1: Concentric Circles ────────────────────────────────────────────────
function ConcentricCircles() {
  return (
    <svg width="120" height="120" viewBox="0 0 120 120" className="mx-auto mt-6">
      {[48, 36, 24, 12].map((r, i) => (
        <circle
          key={r}
          cx="60" cy="60" r={r}
          fill="none"
          stroke="rgb(20 184 166)"
          strokeWidth="1.5"
          opacity={0.3 + i * 0.18}
          style={{
            animation: `concentric-spin ${3 + i}s linear infinite`,
            transformOrigin: "60px 60px",
            animationDirection: i % 2 === 0 ? "normal" : "reverse",
          }}
        />
      ))}
      <circle cx="60" cy="60" r="4" fill="rgb(20 184 166)" />
    </svg>
  );
}

// ── SVG 2: Scanning Line ─────────────────────────────────────────────────────
function ScanningGrid() {
  return (
    <div className="relative mx-auto mt-6 h-24 w-40 overflow-hidden rounded-lg border border-slate-100 bg-slate-50">
      {/* Grid dots */}
      <svg width="100%" height="100%" className="absolute inset-0">
        {Array.from({ length: 5 }).map((_, row) =>
          Array.from({ length: 8 }).map((_, col) => (
            <circle
              key={`${row}-${col}`}
              cx={col * 20 + 10} cy={row * 20 + 10}
              r="1.5"
              fill="rgb(148 163 184)"
            />
          ))
        )}
      </svg>
      {/* Scanning line */}
      <div
        className="absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-transparent via-teal-500 to-transparent"
        style={{ animation: "scan-line 1.8s cubic-bezier(0.4, 0, 0.6, 1) infinite" }}
      />
    </div>
  );
}

// ── SVG 3: EKG Waveform ──────────────────────────────────────────────────────
function EkgWaveform() {
  const path = "M0,40 L20,40 L30,10 L40,70 L50,40 L70,40 L80,20 L90,60 L100,40 L160,40";
  return (
    <svg width="160" height="80" viewBox="0 0 160 80" className="mx-auto mt-6">
      <path
        d={path}
        fill="none"
        stroke="rgb(20 184 166)"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeDasharray="400"
        style={{ animation: "ekg-draw 1.5s ease-in-out infinite alternate" }}
      />
    </svg>
  );
}

// ── Main Component ────────────────────────────────────────────────────────────
export function ProtocolSection({ locale }: ProtocolSectionProps) {
  const isAr = locale === "ar";

  const steps = [
    {
      num: "01",
      title: isAr ? "القبول الذكي" : "Smart Admission",
      desc: isAr
        ? "استقبل الطلبات، قيّم المتقدمين، وأدر دورة القبول كاملة آلياً دون أوراق."
        : "Receive applications, evaluate candidates, and manage the full admission cycle automatically.",
      svg: <ConcentricCircles />,
      bg: "from-teal-950 to-slate-950",
    },
    {
      num: "02",
      title: isAr ? "التتبع اللحظي" : "Real-time Tracking",
      desc: isAr
        ? "حضور، درجات، وأداء — كل شيء يُحدَّث فورياً ويصل لكل صاحب قرار."
        : "Attendance, grades, and performance — all updated instantly and reaching every decision-maker.",
      svg: <ScanningGrid />,
      bg: "from-slate-950 to-teal-950",
    },
    {
      num: "03",
      title: isAr ? "التقارير التلقائية" : "Automatic Reports",
      desc: isAr
        ? "تقارير KPI وجودة تُولَّد تلقائياً، مصدَّرة بـ Excel وPDF، جاهزة للاعتماد."
        : "KPI and quality reports generated automatically, exported as Excel and PDF, ready for accreditation.",
      svg: <EkgWaveform />,
      bg: "from-teal-950 to-slate-900",
    },
  ];

  const containerRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const idx = cardRefs.current.indexOf(entry.target as HTMLDivElement);
            if (idx !== -1) setActiveIndex(idx);
          }
        });
      },
      { threshold: 0.6 }
    );
    cardRefs.current.forEach((el) => el && observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={containerRef} className="relative bg-slate-950">
      {steps.map((step, i) => (
        <div
          key={step.num}
          ref={(el) => { cardRefs.current[i] = el; }}
          className={`sticky top-0 flex min-h-screen flex-col items-center justify-center bg-gradient-to-br ${step.bg}
                      transition-all duration-700`}
          style={{
            transform: activeIndex > i ? `scale(${0.9 - (activeIndex - i) * 0.03})` : "scale(1)",
            filter: activeIndex > i ? `blur(${(activeIndex - i) * 2}px)` : "none",
            opacity: activeIndex > i ? Math.max(0.3, 1 - (activeIndex - i) * 0.3) : 1,
            zIndex: i + 1,
          }}
        >
          {/* Noise */}
          <svg className="pointer-events-none absolute inset-0 h-full w-full opacity-[0.04]" xmlns="http://www.w3.org/2000/svg">
            <filter id={`pnoise-${i}`}>
              <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch" />
              <feColorMatrix type="saturate" values="0" />
            </filter>
            <rect width="100%" height="100%" filter={`url(#pnoise-${i})`} />
          </svg>

          <div className="relative z-10 mx-auto max-w-lg px-6 text-center">
            <p className="mb-4 font-mono text-sm text-teal-400">{step.num}</p>
            <h3 className="text-4xl font-bold text-white md:text-5xl">{step.title}</h3>
            <p className="mt-4 text-lg leading-relaxed text-slate-400">{step.desc}</p>
            {step.svg}
          </div>
        </div>
      ))}
    </section>
  );
}
```

**Step 2: Verify**
```bash
npx tsc --noEmit
```

**Step 3: Commit**
```bash
git add src/components/marketing/protocol-section.tsx
git commit -m "feat: add sticky stacking protocol section with SVG animations"
```

---

## Task 8: Cinematic Search Bar (New Component)

**Files:**
- Create: `src/components/marketing/cinematic-search-bar.tsx`

**Step 1: Create the file**

```tsx
"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { Search, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface CinematicSearchBarProps {
  onSearch?: (query: string) => void;
  placeholder?: string;
  className?: string;
  locale?: string;
}

export function CinematicSearchBar({
  onSearch,
  placeholder,
  className,
  locale = "ar",
}: CinematicSearchBarProps) {
  const isAr = locale === "ar";
  const [focused, setFocused] = useState(false);
  const [value, setValue] = useState("");
  const [loading, setLoading] = useState(false);
  const [suggestions] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  const defaultPlaceholder = placeholder ?? (isAr
    ? "ابحث — المتدربون، المقررات، الأقسام..."
    : "Search — trainees, courses, departments...");

  const handleSubmit = useCallback(async () => {
    if (!value.trim()) return;
    setLoading(true);
    await new Promise((r) => setTimeout(r, 800)); // simulate
    setLoading(false);
    onSearch?.(value.trim());
  }, [value, onSearch]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Enter" && focused) handleSubmit();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [focused, handleSubmit]);

  return (
    <div
      className={cn(
        "relative flex items-center gap-3 rounded-full border bg-white transition-all duration-500",
        focused
          ? "border-teal-400 shadow-lg shadow-teal-100/60 ring-2 ring-teal-200/60"
          : "border-slate-200 shadow-sm",
        focused ? "px-5 py-3" : "px-4 py-2.5",
        className
      )}
      style={{
        maxWidth: focused ? "480px" : "200px",
        transition: "max-width 0.4s cubic-bezier(0.16,1,0.3,1), padding 0.3s, box-shadow 0.3s, border-color 0.3s",
        animation: !focused ? "border-pulse 3s ease-in-out infinite" : "none",
      }}
    >
      {/* Icon */}
      {loading ? (
        <Loader2 className="h-4 w-4 shrink-0 animate-spin text-teal-500" />
      ) : (
        <Search
          className={`h-4 w-4 shrink-0 transition-colors duration-200 ${focused ? "text-teal-500" : "text-slate-400"}`}
        />
      )}

      {/* Input */}
      <input
        ref={inputRef}
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setTimeout(() => setFocused(false), 150)}
        placeholder={focused ? defaultPlaceholder : (isAr ? "بحث..." : "Search...")}
        className="w-full bg-transparent text-sm text-slate-700 outline-none placeholder:text-slate-400"
        dir={isAr ? "rtl" : "ltr"}
      />

      {/* Submit hint */}
      {focused && value && !loading && (
        <button
          onClick={handleSubmit}
          className="shrink-0 rounded-full bg-teal-500 px-3 py-1 text-xs font-medium text-white transition-all hover:bg-teal-600 active:scale-95"
        >
          {isAr ? "بحث" : "Go"}
        </button>
      )}

      {/* Suggestions */}
      {focused && suggestions.length > 0 && (
        <div className="absolute inset-x-0 top-full mt-2 rounded-2xl border border-slate-100 bg-white p-2 shadow-xl"
             style={{ animation: "scaleIn 0.15s cubic-bezier(0.16,1,0.3,1) both" }}>
          {suggestions.map((s, i) => (
            <button
              key={s}
              className="w-full rounded-xl px-4 py-2 text-start text-sm text-slate-700 transition-colors hover:bg-teal-50 hover:text-teal-700"
              style={{ animationDelay: `${i * 50}ms` }}
              onClick={() => { setValue(s); onSearch?.(s); }}
            >
              {s}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
```

**Step 2: Commit**
```bash
git add src/components/marketing/cinematic-search-bar.tsx
git commit -m "feat: add CinematicSearchBar with 5-state transitions"
```

---

## Task 9: Footer — Cinematic Dark

**Files:**
- Modify: `src/components/marketing/marketing-footer.tsx`

**Step 1: Rewrite marketing-footer.tsx**

```tsx
import { Link } from "@/i18n/routing";

interface MarketingFooterProps {
  locale: string;
}

export function MarketingFooter({ locale }: MarketingFooterProps) {
  const isAr = locale === "ar";
  const year = new Date().getFullYear();

  const navCols = [
    {
      heading: isAr ? "المنصة" : "Platform",
      links: [
        { href: "/features", label: isAr ? "الميزات" : "Features" },
        { href: "/pricing",  label: isAr ? "التسعير" : "Pricing"  },
        { href: "/contact",  label: isAr ? "تواصل معنا" : "Contact" },
      ],
    },
    {
      heading: isAr ? "الشركة" : "Company",
      links: [
        { href: "/contact",  label: isAr ? "من نحن" : "About"   },
        { href: "/contact",  label: isAr ? "وظائف"  : "Careers" },
        { href: "/contact",  label: isAr ? "الأمان"  : "Security"},
      ],
    },
  ];

  return (
    <footer className="relative overflow-hidden rounded-t-[3rem] bg-[#0F172A] pb-8 pt-16">
      {/* Noise */}
      <svg className="pointer-events-none absolute inset-0 h-full w-full opacity-[0.035]" xmlns="http://www.w3.org/2000/svg">
        <filter id="footer-noise">
          <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch" />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width="100%" height="100%" filter="url(#footer-noise)" />
      </svg>

      <div className="relative mx-auto max-w-7xl px-6">
        <div className="grid gap-10 md:grid-cols-[2fr_1fr_1fr]">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-teal-500 text-white font-bold text-sm">
                C
              </div>
              <span className="text-lg font-bold text-white">Campus27</span>
            </div>
            <p className="mt-3 max-w-xs text-sm leading-relaxed text-slate-400">
              {isAr
                ? "منصة إدارة شاملة للكليات التقنية — من القبول إلى التخرج."
                : "Comprehensive management platform for technical colleges — from admission to graduation."}
            </p>
            {/* System status */}
            <div className="mt-6 flex items-center gap-2">
              <span className="relative flex h-2.5 w-2.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75" />
                <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-green-500" />
              </span>
              <span className="font-mono text-xs text-green-400">
                {isAr ? "النظام يعمل" : "SYSTEM OPERATIONAL"}
              </span>
            </div>
          </div>

          {/* Nav columns */}
          {navCols.map((col) => (
            <div key={col.heading}>
              <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-slate-500">
                {col.heading}
              </p>
              <ul className="space-y-2.5">
                {col.links.map((l) => (
                  <li key={l.label}>
                    <Link
                      href={l.href}
                      className="text-sm text-slate-400 transition-colors hover:text-teal-400"
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-white/5 pt-6 md:flex-row">
          <p className="text-xs text-slate-600">
            © {year} Campus27.{" "}
            {isAr ? "جميع الحقوق محفوظة." : "All rights reserved."}
          </p>
          <div className="flex items-center gap-6 text-xs text-slate-600">
            <Link href="/contact" className="hover:text-slate-400 transition-colors">
              {isAr ? "سياسة الخصوصية" : "Privacy Policy"}
            </Link>
            <Link href="/contact" className="hover:text-slate-400 transition-colors">
              {isAr ? "شروط الاستخدام" : "Terms of Service"}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
```

**Step 2: Commit**
```bash
git add src/components/marketing/marketing-footer.tsx
git commit -m "feat: upgrade footer to dark cinematic with system-operational status"
```

---

## Task 10: Compose Home Page

**Files:**
- Modify: `src/app/[locale]/(marketing)/home/page.tsx`

**Step 1: Update page composition**

```tsx
import { HeroSection }        from "@/components/marketing/hero-section";
import { StatsBanner }        from "@/components/marketing/stats-banner";
import { FeaturesGrid }       from "@/components/marketing/features-grid";
import { PhilosophySection }  from "@/components/marketing/philosophy-section";
import { ProtocolSection }    from "@/components/marketing/protocol-section";
import { CTASection }         from "@/components/marketing/cta-section";

export default async function MarketingHomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  return (
    <>
      <HeroSection locale={locale} />
      <StatsBanner locale={locale} />
      <FeaturesGrid locale={locale} />
      <PhilosophySection locale={locale} />
      <ProtocolSection locale={locale} />
      <CTASection locale={locale} />
    </>
  );
}
```

**Step 2: Verify build compiles**
```bash
npx tsc --noEmit
```

**Step 3: Commit**
```bash
git add src/app/\[locale\]/\(marketing\)/home/page.tsx
git commit -m "feat: compose home page with all cinematic sections"
```

---

## Task 11: Pricing Page — Toggle + Scale

**Files:**
- Modify: `src/app/[locale]/(marketing)/pricing/page.tsx`

**Step 1: Convert to client component with annual/monthly toggle**

Add `"use client";` at top and wrap in a client component that holds `const [annual, setAnnual] = useState(true)`. Multiply prices by 0.8 for annual. Add toggle pill UI above cards. Keep all existing plan data.

Key changes:
```tsx
"use client";
import { useState } from "react";
// ...existing imports...

export default function PricingPage() {
  // NOTE: Remove async — client component. locale from useLocale() instead
  const locale = useLocale(); // from next-intl
  const isAr = locale === "ar";
  const [annual, setAnnual] = useState(true);
  // ...keep plans array...
  // For price display: plan.highlight ? (annual ? Math.round(3500 * 0.8) : 3500) : ...

  // Toggle UI:
  // <div className="mb-10 flex items-center justify-center gap-3">
  //   <button annual/monthly pill toggle with sliding indicator />
  // </div>
}
```

Full implementation: adapt existing pricing page by adding `"use client"`, `useLocale()` import from `next-intl`, `useState` for toggle, and annual discount display.

**Step 2: Commit**
```bash
git add "src/app/[locale]/(marketing)/pricing/page.tsx"
git commit -m "feat: add annual/monthly toggle to pricing page"
```

---

## Task 12: Prisma — Add Marketing Models

**Files:**
- Modify: `prisma/schema.prisma`

**Step 1: Append models to schema.prisma**

```prisma
model MarketingEvent {
  id         String   @id @default(cuid())
  sessionId  String
  eventType  String   // 'section_view' | 'scroll_depth' | 'cta_hover' | 'cta_click' | 'feature_interaction'
  payload    Json
  occurredAt DateTime
  createdAt  DateTime @default(now())

  @@index([sessionId])
  @@index([eventType])
}

model MarketingLead {
  id        String   @id @default(cuid())
  email     String
  name      String?
  intent    String?
  utm       Json?
  metadata  Json?
  createdAt DateTime @default(now())

  @@index([email])
}
```

**Step 2: Run migration**
```bash
cd /Users/hossam/Documents/saohil1
npx prisma migrate dev --name add_marketing_events_leads
```
Expected: `✓ Generated Prisma Client`

**Step 3: Commit**
```bash
git add prisma/schema.prisma prisma/migrations/
git commit -m "feat: add MarketingEvent and MarketingLead Prisma models"
```

---

## Task 13: API Routes — Engagement + Lead + Health

**Files:**
- Create: `src/app/api/v1/engagement/event/route.ts`
- Create: `src/app/api/v1/acquisition/lead/route.ts`
- Create: `src/app/api/v1/health/route.ts`

**Step 1: Create engagement event route**

```ts
// src/app/api/v1/engagement/event/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { randomUUID } from "crypto";

const VALID_TYPES = ["section_view","scroll_depth","cta_hover","cta_click","feature_interaction"] as const;

export async function POST(req: NextRequest) {
  const start = Date.now();
  const requestId = randomUUID();
  try {
    const body = await req.json();
    const { sessionId, eventType, payload, occurredAt } = body;

    if (!sessionId || !VALID_TYPES.includes(eventType) || !occurredAt) {
      return NextResponse.json({
        success: false, data: null,
        error: { code: "VALIDATION_ERROR", message: "Invalid body" },
        meta: { requestId, durationMs: Date.now() - start },
      }, { status: 400 });
    }

    const event = await prisma.marketingEvent.create({
      data: { sessionId, eventType, payload: payload ?? {}, occurredAt: new Date(occurredAt) },
    });

    return NextResponse.json({
      success: true, data: { id: event.id }, error: null,
      meta: { requestId, durationMs: Date.now() - start },
    }, { status: 201 });
  } catch (e) {
    return NextResponse.json({
      success: false, data: null,
      error: { code: "INTERNAL_ERROR", message: "Server error" },
      meta: { requestId, durationMs: Date.now() - start },
    }, { status: 500 });
  }
}
```

**Step 2: Create lead capture route**

```ts
// src/app/api/v1/acquisition/lead/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { randomUUID } from "crypto";

export async function POST(req: NextRequest) {
  const start = Date.now();
  const requestId = randomUUID();
  try {
    const body = await req.json();
    const { email, name, intent, utm, metadata } = body;

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({
        success: false, data: null,
        error: { code: "VALIDATION_ERROR", message: "Valid email required" },
        meta: { requestId, durationMs: Date.now() - start },
      }, { status: 400 });
    }

    const lead = await prisma.marketingLead.create({
      data: { email, name: name ?? null, intent: intent ?? null, utm: utm ?? null, metadata: metadata ?? null },
    });

    return NextResponse.json({
      success: true, data: { id: lead.id }, error: null,
      meta: { requestId, durationMs: Date.now() - start },
    }, { status: 201 });
  } catch {
    return NextResponse.json({
      success: false, data: null,
      error: { code: "INTERNAL_ERROR", message: "Server error" },
      meta: { requestId, durationMs: Date.now() - start },
    }, { status: 500 });
  }
}
```

**Step 3: Create health route**

```ts
// src/app/api/v1/health/route.ts
import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    success: true,
    data: {
      status: "operational",
      region: process.env.RAILWAY_REGION ?? process.env.RENDER_REGION ?? "local",
      timestamp: new Date().toISOString(),
    },
    error: null,
  });
}
```

**Step 4: Verify TypeScript**
```bash
npx tsc --noEmit
```

**Step 5: Commit**
```bash
git add src/app/api/v1/
git commit -m "feat: add /api/v1/engagement/event, /api/v1/acquisition/lead, /api/v1/health routes"
```

---

## Task 14: Final Verification + Dev Server

**Step 1: Full TypeScript check**
```bash
npx tsc --noEmit
```
Expected: 0 errors

**Step 2: Start dev server**
```bash
PORT=3001 npm run dev
```
Expected: `✓ Ready on http://localhost:3001`

**Step 3: Test routes**
```bash
curl http://localhost:3001/api/v1/health
# Expected: {"success":true,"data":{"status":"operational",...}}
```

**Step 4: Check pages**
- http://localhost:3001/ar/home — Arabic cinematic home
- http://localhost:3001/en/home — English cinematic home
- http://localhost:3001/ar/pricing — Pricing with toggle
- http://localhost:3001/ar/features — Features page

**Step 5: Final commit**
```bash
git add -A
git commit -m "feat: campus27 cinematic marketing site — complete upgrade"
```

---

## Summary

| Task | Files | Status |
|------|-------|--------|
| 1 | next.config.ts, layout.tsx, globals.css | Foundation |
| 2 | marketing-navbar.tsx | Floating island |
| 3 | hero-section.tsx | Cinematic hero |
| 4 | stats-banner.tsx | Dark stats |
| 5 | features-grid.tsx | Micro-UI cards |
| 6 | philosophy-section.tsx | New manifesto |
| 7 | protocol-section.tsx | New sticky stack |
| 8 | cinematic-search-bar.tsx | New search |
| 9 | marketing-footer.tsx | Dark footer |
| 10 | home/page.tsx | Composition |
| 11 | pricing/page.tsx | Toggle |
| 12 | schema.prisma | DB models |
| 13 | api/v1/* | 3 API routes |
| 14 | — | Verify + run |
