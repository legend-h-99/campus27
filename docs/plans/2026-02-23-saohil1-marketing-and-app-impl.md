# Saohil1 Marketing Site + App Enhancement — Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Add a full marketing site (Landing, Pricing, Features, Contact) as a `(marketing)` route group + enhance the existing dashboard with motion improvements (page transitions, CountUp KPIs, table interactions, toast notifications, empty states).

**Architecture:** Route group `(marketing)` inside `src/app/[locale]/` shares Design Tokens and components with the dashboard but has its own `layout.tsx` (Navbar + Footer only, no sidebar). Animation utilities (`FadeInSection`, `StaggerChildren`, `CountUp`) are added to `src/components/ui/` and reused in both marketing and dashboard. Style: "Institutional SaaS" — subtle gradient hero + scroll-triggered fade-ins, no parallax or particles.

**Tech Stack:** Next.js 16 App Router, React 19, TypeScript, Tailwind CSS v4, next-intl (ar/en RTL/LTR), Lucide icons, existing TVTC teal/slate design tokens in `globals.css`. No new npm packages needed — use native Intersection Observer API for scroll triggers, CSS transitions for animations.

---

## Phase 1 — Marketing Site

---

### Task 1: Create Marketing Layout (Navbar + Footer)

**Files:**
- Create: `src/app/[locale]/(marketing)/layout.tsx`
- Create: `src/components/marketing/marketing-navbar.tsx`
- Create: `src/components/marketing/marketing-footer.tsx`

**Step 1: Create marketing-navbar.tsx**

```tsx
// src/components/marketing/marketing-navbar.tsx
"use client";

import Link from "next/link";
import { useLocale } from "next-intl";
import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";

export function MarketingNavbar() {
  const locale = useLocale();
  const isAr = locale === "ar";
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 16);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const links = [
    { href: `/${locale}/features`, label: isAr ? "الميزات" : "Features" },
    { href: `/${locale}/pricing`, label: isAr ? "التسعير" : "Pricing" },
    { href: `/${locale}/contact`, label: isAr ? "تواصل معنا" : "Contact" },
  ];

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white/95 shadow-sm backdrop-blur-md border-b border-slate-100"
          : "bg-transparent"
      }`}
    >
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        {/* Logo */}
        <Link href={`/${locale}`} className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-teal-600 text-white font-bold text-sm">
            S
          </div>
          <span className="text-lg font-bold text-slate-900">Saohil1</span>
        </Link>

        {/* Desktop nav links */}
        <div className="hidden items-center gap-8 md:flex">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="text-sm font-medium text-slate-600 transition-colors hover:text-teal-600"
            >
              {l.label}
            </Link>
          ))}
        </div>

        {/* CTA buttons */}
        <div className="hidden items-center gap-3 md:flex">
          <Link
            href={`/${locale}/login`}
            className="text-sm font-medium text-slate-600 transition-colors hover:text-teal-600"
          >
            {isAr ? "تسجيل الدخول" : "Sign In"}
          </Link>
          <Link
            href={`/${locale}/contact`}
            className="rounded-xl bg-teal-600 px-4 py-2 text-sm font-semibold text-white transition-all hover:bg-teal-700 hover:shadow-md active:scale-95"
          >
            {isAr ? "ابدأ تجربتك" : "Get Started"}
          </Link>
        </div>

        {/* Mobile menu toggle */}
        <button
          className="flex items-center justify-center rounded-lg p-2 text-slate-600 hover:bg-slate-100 md:hidden"
          onClick={() => setMenuOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </nav>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="border-t border-slate-100 bg-white px-6 pb-4 md:hidden">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="block py-3 text-sm font-medium text-slate-700"
              onClick={() => setMenuOpen(false)}
            >
              {l.label}
            </Link>
          ))}
          <Link
            href={`/${locale}/contact`}
            className="mt-2 block rounded-xl bg-teal-600 px-4 py-2 text-center text-sm font-semibold text-white"
            onClick={() => setMenuOpen(false)}
          >
            {isAr ? "ابدأ تجربتك" : "Get Started"}
          </Link>
        </div>
      )}
    </header>
  );
}
```

**Step 2: Create marketing-footer.tsx**

```tsx
// src/components/marketing/marketing-footer.tsx
import Link from "next/link";
import { useLocale } from "next-intl";

export function MarketingFooter() {
  const locale = useLocale();
  const isAr = locale === "ar";

  return (
    <footer className="border-t border-slate-100 bg-slate-50">
      <div className="mx-auto max-w-7xl px-6 py-12">
        <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-teal-600 text-white font-bold text-xs">
              S
            </div>
            <span className="font-semibold text-slate-900">Saohil1</span>
            <span className="text-sm text-slate-400">
              {isAr ? "© 2026 جميع الحقوق محفوظة" : "© 2026 All rights reserved"}
            </span>
          </div>
          <div className="flex items-center gap-6 text-sm text-slate-500">
            <Link href={`/${locale}/features`} className="hover:text-teal-600 transition-colors">
              {isAr ? "الميزات" : "Features"}
            </Link>
            <Link href={`/${locale}/pricing`} className="hover:text-teal-600 transition-colors">
              {isAr ? "التسعير" : "Pricing"}
            </Link>
            <Link href={`/${locale}/contact`} className="hover:text-teal-600 transition-colors">
              {isAr ? "تواصل معنا" : "Contact"}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
```

**Step 3: Create marketing layout**

```tsx
// src/app/[locale]/(marketing)/layout.tsx
import { MarketingNavbar } from "@/components/marketing/marketing-navbar";
import { MarketingFooter } from "@/components/marketing/marketing-footer";

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <MarketingNavbar />
      <main className="min-h-screen">{children}</main>
      <MarketingFooter />
    </>
  );
}
```

**Step 4: Verify build compiles**

```bash
export NVM_DIR="$HOME/.nvm" && [ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"
cd /Users/hossam/Documents/saohil1
npm run build 2>&1 | tail -20
```
Expected: `✓ Compiled successfully`

**Step 5: Commit**

```bash
git add src/app/\[locale\]/\(marketing\)/ src/components/marketing/
git commit -m "feat: add marketing layout with navbar and footer"
```

---

### Task 2: Animation Utilities (FadeInSection + StaggerChildren + CountUp)

**Files:**
- Create: `src/components/ui/fade-in-section.tsx`
- Create: `src/components/ui/stagger-children.tsx`
- Create: `src/components/ui/count-up.tsx`

**Step 1: Create FadeInSection**

Uses native `IntersectionObserver` — no dependencies needed.

```tsx
// src/components/ui/fade-in-section.tsx
"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

interface FadeInSectionProps {
  children: React.ReactNode;
  className?: string;
  delay?: number; // ms
  direction?: "up" | "down" | "left" | "right" | "none";
}

export function FadeInSection({
  children,
  className,
  delay = 0,
  direction = "up",
}: FadeInSectionProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.unobserve(el);
        }
      },
      { threshold: 0.1, rootMargin: "0px 0px -40px 0px" }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const translateMap = {
    up: "translate-y-4",
    down: "-translate-y-4",
    left: "translate-x-4",
    right: "-translate-x-4",
    none: "",
  };

  return (
    <div
      ref={ref}
      className={cn(
        "transition-all",
        visible ? "opacity-100 translate-x-0 translate-y-0" : `opacity-0 ${translateMap[direction]}`,
        className
      )}
      style={{
        transitionDuration: "500ms",
        transitionDelay: `${delay}ms`,
        transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)",
      }}
    >
      {children}
    </div>
  );
}
```

**Step 2: Create StaggerChildren**

```tsx
// src/components/ui/stagger-children.tsx
"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

interface StaggerChildrenProps {
  children: React.ReactNode;
  className?: string;
  staggerMs?: number; // delay between each child
  initialDelay?: number;
}

export function StaggerChildren({
  children,
  className,
  staggerMs = 80,
  initialDelay = 0,
}: StaggerChildrenProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.unobserve(el);
        }
      },
      { threshold: 0.1, rootMargin: "0px 0px -40px 0px" }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const childArray = Array.isArray(children) ? children : [children];

  return (
    <div ref={ref} className={className}>
      {childArray.map((child, i) => (
        <div
          key={i}
          className={cn(
            "transition-all",
            visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          )}
          style={{
            transitionDuration: "400ms",
            transitionDelay: `${initialDelay + i * staggerMs}ms`,
            transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)",
          }}
        >
          {child}
        </div>
      ))}
    </div>
  );
}
```

**Step 3: Create CountUp**

```tsx
// src/components/ui/count-up.tsx
"use client";

import { useEffect, useRef, useState } from "react";

interface CountUpProps {
  end: number;
  duration?: number; // ms
  prefix?: string;
  suffix?: string;
  className?: string;
}

export function CountUp({
  end,
  duration = 1500,
  prefix = "",
  suffix = "",
  className,
}: CountUpProps) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const started = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true;
          const startTime = performance.now();
          const animate = (now: number) => {
            const elapsed = now - startTime;
            const progress = Math.min(elapsed / duration, 1);
            // ease-out cubic
            const eased = 1 - Math.pow(1 - progress, 3);
            setCount(Math.round(eased * end));
            if (progress < 1) requestAnimationFrame(animate);
          };
          requestAnimationFrame(animate);
          observer.unobserve(el);
        }
      },
      { threshold: 0.5 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [end, duration]);

  return (
    <span ref={ref} className={className}>
      {prefix}{count.toLocaleString("ar-SA")}{suffix}
    </span>
  );
}
```

**Step 4: Build check**

```bash
npm run build 2>&1 | tail -5
```
Expected: `✓ Compiled successfully`

**Step 5: Commit**

```bash
git add src/components/ui/fade-in-section.tsx src/components/ui/stagger-children.tsx src/components/ui/count-up.tsx
git commit -m "feat: add FadeInSection, StaggerChildren, CountUp animation utilities"
```

---

### Task 3: Landing Page — Hero Section

**Files:**
- Create: `src/components/marketing/hero-section.tsx`
- Create: `src/app/[locale]/(marketing)/page.tsx` (partial — hero only first)

**Step 1: Create HeroSection component**

```tsx
// src/components/marketing/hero-section.tsx
import Link from "next/link";
import { useLocale } from "next-intl";
import { ArrowLeft, ArrowRight, Play } from "lucide-react";

export function HeroSection() {
  const locale = useLocale();
  const isAr = locale === "ar";

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-slate-50 via-white to-teal-50 pt-32 pb-20">
      {/* Subtle background pattern */}
      <div
        className="pointer-events-none absolute inset-0 opacity-30"
        style={{
          backgroundImage:
            "radial-gradient(circle at 20% 50%, rgba(27,169,160,0.08) 0%, transparent 60%), radial-gradient(circle at 80% 20%, rgba(59,172,201,0.06) 0%, transparent 50%)",
        }}
      />

      <div className="relative mx-auto max-w-7xl px-6">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          {/* Text content */}
          <div className="text-center lg:text-start">
            {/* Badge */}
            <div
              className="mb-6 inline-flex items-center gap-2 rounded-full border border-teal-200 bg-teal-50 px-4 py-1.5 text-sm font-medium text-teal-700"
              style={{
                animation: "fade-in-up 0.4s cubic-bezier(0.16,1,0.3,1) both",
              }}
            >
              <span className="h-1.5 w-1.5 rounded-full bg-teal-500 animate-pulse" />
              {isAr ? "منصة معتمدة لكليات التقنية" : "Certified Platform for Technical Colleges"}
            </div>

            {/* Headline */}
            <h1
              className="mb-6 text-4xl font-bold leading-tight text-slate-900 lg:text-5xl xl:text-6xl"
              style={{
                animation: "fade-in-up 0.5s cubic-bezier(0.16,1,0.3,1) 0.1s both",
              }}
            >
              {isAr ? (
                <>
                  إدارة كليتك التقنية
                  <br />
                  <span className="text-teal-600">بذكاء واحترافية</span>
                </>
              ) : (
                <>
                  Manage Your Technical
                  <br />
                  <span className="text-teal-600">College with Intelligence</span>
                </>
              )}
            </h1>

            {/* Subtitle */}
            <p
              className="mb-8 text-lg leading-relaxed text-slate-500 lg:text-xl"
              style={{
                animation: "fade-in-up 0.5s cubic-bezier(0.16,1,0.3,1) 0.2s both",
              }}
            >
              {isAr
                ? "من القبول إلى التخرج — كل شيء في مكان واحد، بالعربية والإنجليزية"
                : "From Admission to Graduation — Everything in One Place, Arabic & English"}
            </p>

            {/* CTAs */}
            <div
              className="flex flex-wrap items-center justify-center gap-3 lg:justify-start"
              style={{
                animation: "fade-in-up 0.5s cubic-bezier(0.16,1,0.3,1) 0.3s both",
              }}
            >
              <Link
                href={`/${locale}/contact`}
                className="flex items-center gap-2 rounded-xl bg-teal-600 px-6 py-3 text-sm font-semibold text-white shadow-md transition-all hover:bg-teal-700 hover:shadow-lg active:scale-95"
              >
                {isAr ? "ابدأ تجربتك المجانية" : "Start Free Trial"}
                {isAr ? <ArrowLeft className="h-4 w-4" /> : <ArrowRight className="h-4 w-4" />}
              </Link>
              <Link
                href={`/${locale}/features`}
                className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-slate-700 transition-all hover:border-teal-200 hover:bg-teal-50 hover:text-teal-700 active:scale-95"
              >
                <Play className="h-4 w-4" />
                {isAr ? "شاهد العرض التوضيحي" : "Watch Demo"}
              </Link>
            </div>
          </div>

          {/* Floating dashboard mockup */}
          <div
            className="relative"
            style={{
              animation: "float-in 0.7s cubic-bezier(0.16,1,0.3,1) 0.4s both",
            }}
          >
            <div className="relative rounded-2xl border border-slate-200 bg-white shadow-2xl shadow-teal-100/50 overflow-hidden">
              {/* Browser chrome bar */}
              <div className="flex items-center gap-1.5 border-b border-slate-100 bg-slate-50 px-4 py-3">
                <div className="h-2.5 w-2.5 rounded-full bg-red-400" />
                <div className="h-2.5 w-2.5 rounded-full bg-yellow-400" />
                <div className="h-2.5 w-2.5 rounded-full bg-green-400" />
                <div className="mx-4 flex-1 rounded-md bg-slate-200 px-3 py-1 text-xs text-slate-400">
                  app.saohil1.sa
                </div>
              </div>
              {/* Dashboard preview content */}
              <div className="p-6 space-y-4">
                {/* Fake KPI row */}
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { label: isAr ? "الطلاب" : "Students", value: "1,247", color: "bg-teal-50 text-teal-700" },
                    { label: isAr ? "الحضور" : "Attendance", value: "94%", color: "bg-mint-50 text-mint-700" },
                    { label: isAr ? "المقررات" : "Courses", value: "86", color: "bg-aqua-50 text-aqua-700" },
                  ].map((kpi) => (
                    <div key={kpi.label} className={`rounded-xl p-3 ${kpi.color}`}>
                      <p className="text-xs font-medium opacity-70">{kpi.label}</p>
                      <p className="text-xl font-bold">{kpi.value}</p>
                    </div>
                  ))}
                </div>
                {/* Fake chart bar */}
                <div className="rounded-xl border border-slate-100 p-4">
                  <p className="mb-3 text-xs font-medium text-slate-500">
                    {isAr ? "حضور الأسبوع" : "Weekly Attendance"}
                  </p>
                  <div className="flex items-end gap-2 h-16">
                    {[60, 85, 70, 95, 75, 90, 65].map((h, i) => (
                      <div
                        key={i}
                        className="flex-1 rounded-sm bg-teal-500 opacity-80"
                        style={{ height: `${h}%` }}
                      />
                    ))}
                  </div>
                </div>
                {/* Fake table rows */}
                <div className="space-y-2">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="flex items-center gap-3 rounded-lg bg-slate-50 p-2">
                      <div className="h-6 w-6 rounded-full bg-slate-200" />
                      <div className="flex-1 space-y-1">
                        <div className="h-2 w-24 rounded bg-slate-200" />
                        <div className="h-1.5 w-16 rounded bg-slate-100" />
                      </div>
                      <div className="h-5 w-14 rounded-full bg-teal-100" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
            {/* Floating accent cards */}
            <div className="absolute -bottom-4 -start-6 rounded-xl border border-slate-100 bg-white px-4 py-3 shadow-lg text-sm">
              <span className="font-semibold text-teal-600">+12</span>
              <span className="ms-1 text-slate-500">{isAr ? "متدرب جديد" : "new trainees"}</span>
            </div>
            <div className="absolute -top-4 -end-4 rounded-xl border border-slate-100 bg-white px-4 py-3 shadow-lg text-sm">
              <span className="font-semibold text-green-600">94%</span>
              <span className="ms-1 text-slate-500">{isAr ? "معدل الحضور" : "attendance"}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
```

**Step 2: Add `@keyframes` for hero animations to `globals.css`**

Append after the last `}` in the file:

```css
/* ═══════════════════════════════════════════
   MARKETING SITE ANIMATIONS
   ═══════════════════════════════════════════ */

@keyframes fade-in-up {
  from {
    opacity: 0;
    transform: translateY(16px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes float-in {
  from {
    opacity: 0;
    transform: translateY(24px) scale(0.97);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

@media (prefers-reduced-motion: reduce) {
  [style*="animation"] {
    animation: none !important;
  }
}
```

**Step 3: Create (marketing)/page.tsx with hero only**

```tsx
// src/app/[locale]/(marketing)/page.tsx
import { HeroSection } from "@/components/marketing/hero-section";

export default function MarketingHomePage() {
  return (
    <div>
      <HeroSection />
    </div>
  );
}
```

**Step 4: Build check**

```bash
npm run build 2>&1 | tail -10
```
Expected: route `ƒ /[locale]` compiles (marketing page = locale root)

**Step 5: Commit**

```bash
git add src/components/marketing/hero-section.tsx src/app/\[locale\]/\(marketing\)/ src/app/globals.css
git commit -m "feat: add landing page hero section with floating mockup"
```

---

### Task 4: Landing Page — Stats Banner + Features Grid + CTA

**Files:**
- Create: `src/components/marketing/stats-banner.tsx`
- Create: `src/components/marketing/features-grid.tsx`
- Create: `src/components/marketing/cta-section.tsx`
- Modify: `src/app/[locale]/(marketing)/page.tsx`

**Step 1: Create stats-banner.tsx**

```tsx
// src/components/marketing/stats-banner.tsx
import { CountUp } from "@/components/ui/count-up";
import { FadeInSection } from "@/components/ui/fade-in-section";
import { useLocale } from "next-intl";

export function StatsBanner() {
  const locale = useLocale();
  const isAr = locale === "ar";

  const stats = [
    { value: 200, prefix: "+", suffix: "", label: isAr ? "كلية تستخدمنا" : "Colleges Trust Us" },
    { value: 94, prefix: "", suffix: "%", label: isAr ? "معدل الحضور" : "Attendance Rate" },
    { value: 50, prefix: "+", suffix: "", label: isAr ? "تخصصاً مدعوماً" : "Supported Majors" },
    { value: 99.9, prefix: "", suffix: "%", label: isAr ? "وقت تشغيل مضمون" : "Guaranteed Uptime" },
  ];

  return (
    <FadeInSection>
      <section className="border-y border-slate-100 bg-white py-16">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
            {stats.map((s) => (
              <div key={s.label} className="text-center">
                <p className="text-3xl font-bold text-slate-900 md:text-4xl">
                  <CountUp end={s.value} prefix={s.prefix} suffix={s.suffix} />
                </p>
                <p className="mt-1 text-sm text-slate-500">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </FadeInSection>
  );
}
```

**Step 2: Create features-grid.tsx**

```tsx
// src/components/marketing/features-grid.tsx
import { StaggerChildren } from "@/components/ui/stagger-children";
import { FadeInSection } from "@/components/ui/fade-in-section";
import { useLocale } from "next-intl";
import {
  GraduationCap, Calendar, Award,
  DollarSign, Brain, BarChart3,
} from "lucide-react";

export function FeaturesGrid() {
  const locale = useLocale();
  const isAr = locale === "ar";

  const features = [
    {
      icon: GraduationCap,
      title: isAr ? "إدارة الطلاب" : "Student Management",
      desc: isAr ? "تسجيل، حضور، درجات، وتحذيرات مبكرة ذكية" : "Enrollment, attendance, grades, and smart early warnings",
      color: "text-teal-600 bg-teal-50",
    },
    {
      icon: Calendar,
      title: isAr ? "الجداول الذكية" : "Smart Scheduling",
      desc: isAr ? "جداول تلقائية تتجنب التعارضات وتحسن التوزيع" : "Auto-generated schedules with conflict detection",
      color: "text-aqua-600 bg-aqua-50",
    },
    {
      icon: Award,
      title: isAr ? "الجودة والاعتماد" : "Quality & Accreditation",
      desc: isAr ? "مؤشرات KPI، مسوحات، وخطط تحسين مستمر" : "KPIs, surveys, and continuous improvement plans",
      color: "text-mint-600 bg-mint-50",
    },
    {
      icon: DollarSign,
      title: isAr ? "الإدارة المالية" : "Finance Management",
      desc: isAr ? "رسوم، فواتير، مدفوعات، ومنح دراسية" : "Fees, invoices, payments, and scholarships",
      color: "text-teal-600 bg-teal-50",
    },
    {
      icon: Brain,
      title: isAr ? "الذكاء الاصطناعي" : "AI-Powered Insights",
      desc: isAr ? "توصيات ذكية وتحليلات تنبؤية للأداء الأكاديمي" : "Smart recommendations and predictive academic analytics",
      color: "text-aqua-600 bg-aqua-50",
    },
    {
      icon: BarChart3,
      title: isAr ? "التقارير والتحليلات" : "Reports & Analytics",
      desc: isAr ? "تقارير قابلة للتخصيص مع تصدير Excel وPDF" : "Customizable reports with Excel and PDF export",
      color: "text-mint-600 bg-mint-50",
    },
  ];

  return (
    <section className="bg-slate-50 py-20">
      <div className="mx-auto max-w-7xl px-6">
        <FadeInSection className="mb-12 text-center">
          <h2 className="text-3xl font-bold text-slate-900 md:text-4xl">
            {isAr ? "كل ما تحتاجه في منصة واحدة" : "Everything You Need in One Platform"}
          </h2>
          <p className="mt-4 text-lg text-slate-500">
            {isAr
              ? "أدوات متكاملة صُممت خصيصاً لكليات التقنية والتدريب"
              : "Integrated tools designed specifically for technical colleges"}
          </p>
        </FadeInSection>

        <StaggerChildren className="grid gap-6 md:grid-cols-2 lg:grid-cols-3" staggerMs={80}>
          {features.map((f) => (
            <div
              key={f.title}
              className="group rounded-2xl border border-slate-100 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md"
            >
              <div className={`mb-4 inline-flex rounded-xl p-2.5 ${f.color}`}>
                <f.icon className="h-5 w-5" />
              </div>
              <h3 className="mb-2 font-semibold text-slate-900">{f.title}</h3>
              <p className="text-sm leading-relaxed text-slate-500">{f.desc}</p>
            </div>
          ))}
        </StaggerChildren>
      </div>
    </section>
  );
}
```

**Step 3: Create cta-section.tsx**

```tsx
// src/components/marketing/cta-section.tsx
import Link from "next/link";
import { useLocale } from "next-intl";
import { FadeInSection } from "@/components/ui/fade-in-section";
import { ArrowLeft, ArrowRight, MessageSquare } from "lucide-react";

export function CTASection() {
  const locale = useLocale();
  const isAr = locale === "ar";

  return (
    <FadeInSection>
      <section className="bg-gradient-to-br from-teal-600 to-teal-700 py-20">
        <div className="mx-auto max-w-3xl px-6 text-center">
          <h2 className="mb-4 text-3xl font-bold text-white md:text-4xl">
            {isAr ? "جاهز لتحديث إدارة كليتك؟" : "Ready to Transform Your College?"}
          </h2>
          <p className="mb-8 text-lg text-teal-100">
            {isAr
              ? "انضم لأكثر من 200 كلية تقنية تثق بمنصة Saohil1"
              : "Join 200+ technical colleges that trust Saohil1"}
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Link
              href={`/${locale}/contact`}
              className="flex items-center gap-2 rounded-xl bg-white px-6 py-3 text-sm font-semibold text-teal-700 shadow-md transition-all hover:bg-teal-50 hover:shadow-lg active:scale-95"
            >
              {isAr ? "ابدأ الآن مجاناً" : "Start Free Now"}
              {isAr ? <ArrowLeft className="h-4 w-4" /> : <ArrowRight className="h-4 w-4" />}
            </Link>
            <Link
              href={`/${locale}/contact`}
              className="flex items-center gap-2 rounded-xl border border-teal-400 px-6 py-3 text-sm font-semibold text-white transition-all hover:bg-teal-500 active:scale-95"
            >
              <MessageSquare className="h-4 w-4" />
              {isAr ? "تواصل مع فريق المبيعات" : "Talk to Sales"}
            </Link>
          </div>
        </div>
      </section>
    </FadeInSection>
  );
}
```

**Step 4: Complete landing page**

```tsx
// src/app/[locale]/(marketing)/page.tsx
import { HeroSection } from "@/components/marketing/hero-section";
import { StatsBanner } from "@/components/marketing/stats-banner";
import { FeaturesGrid } from "@/components/marketing/features-grid";
import { CTASection } from "@/components/marketing/cta-section";

export default function MarketingHomePage() {
  return (
    <>
      <HeroSection />
      <StatsBanner />
      <FeaturesGrid />
      <CTASection />
    </>
  );
}
```

**Step 5: Build check**

```bash
npm run build 2>&1 | tail -10
```

**Step 6: Commit**

```bash
git add src/components/marketing/ src/app/\[locale\]/\(marketing\)/page.tsx
git commit -m "feat: complete landing page (stats, features grid, CTA)"
```

---

### Task 5: Pricing Page

**Files:**
- Create: `src/app/[locale]/(marketing)/pricing/page.tsx`

**Step 1: Create pricing page**

```tsx
// src/app/[locale]/(marketing)/pricing/page.tsx
import { FadeInSection } from "@/components/ui/fade-in-section";
import { StaggerChildren } from "@/components/ui/stagger-children";
import Link from "next/link";
import { Check } from "lucide-react";

// NOTE: This is a Server Component — useLocale() won't work here.
// Pass locale via params instead.
export default async function PricingPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const isAr = locale === "ar";

  const plans = [
    {
      name: isAr ? "المبتدئ" : "Starter",
      nameEn: "Starter",
      price: isAr ? "1,200" : "1,200",
      currency: isAr ? "ر.س/شهر" : "SAR/mo",
      description: isAr ? "للمعاهد الصغيرة" : "For small institutes",
      limit: isAr ? "حتى 500 طالب" : "Up to 500 students",
      highlight: false,
      features: [
        isAr ? "إدارة الطلاب والمدربين" : "Students & trainers management",
        isAr ? "الجداول الأساسية" : "Basic scheduling",
        isAr ? "التقارير الأساسية" : "Basic reports",
        isAr ? "دعم بالبريد الإلكتروني" : "Email support",
      ],
    },
    {
      name: isAr ? "الاحترافي" : "Professional",
      nameEn: "Professional",
      price: isAr ? "3,500" : "3,500",
      currency: isAr ? "ر.س/شهر" : "SAR/mo",
      description: isAr ? "للكليات المتوسطة" : "For mid-size colleges",
      limit: isAr ? "حتى 5,000 طالب" : "Up to 5,000 students",
      highlight: true,
      features: [
        isAr ? "كل ميزات المبتدئ" : "All Starter features",
        isAr ? "الذكاء الاصطناعي" : "AI insights",
        isAr ? "إدارة الجودة والاعتماد" : "Quality & accreditation",
        isAr ? "الإدارة المالية الكاملة" : "Full finance management",
        isAr ? "دعم ذو أولوية" : "Priority support",
      ],
    },
    {
      name: isAr ? "المؤسسي" : "Enterprise",
      nameEn: "Enterprise",
      price: isAr ? "تواصل معنا" : "Contact Us",
      currency: "",
      description: isAr ? "للجامعات والمجموعات" : "For universities & groups",
      limit: isAr ? "طلاب غير محدودين" : "Unlimited students",
      highlight: false,
      features: [
        isAr ? "كل ميزات الاحترافي" : "All Professional features",
        isAr ? "API مخصص" : "Custom API access",
        isAr ? "تكامل الأنظمة الخارجية" : "External system integration",
        isAr ? "مدير حساب مخصص" : "Dedicated account manager",
        isAr ? "SLA مضمون 99.9%" : "99.9% SLA guarantee",
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 pt-24 pb-20">
      <div className="mx-auto max-w-7xl px-6">
        <FadeInSection className="mb-16 text-center">
          <h1 className="text-4xl font-bold text-slate-900 md:text-5xl">
            {isAr ? "خطط تناسب كل مؤسسة" : "Plans for Every Institution"}
          </h1>
          <p className="mt-4 text-lg text-slate-500">
            {isAr
              ? "ابدأ مجاناً لمدة 30 يوماً. لا تحتاج بطاقة ائتمانية."
              : "Start free for 30 days. No credit card required."}
          </p>
        </FadeInSection>

        <StaggerChildren
          className="grid gap-6 md:grid-cols-3"
          staggerMs={100}
          initialDelay={100}
        >
          {plans.map((plan) => (
            <div
              key={plan.nameEn}
              className={`relative rounded-2xl border p-8 transition-all duration-300 hover:-translate-y-1 ${
                plan.highlight
                  ? "border-teal-300 bg-white shadow-xl shadow-teal-100/50 ring-2 ring-teal-200"
                  : "border-slate-200 bg-white shadow-sm hover:shadow-md"
              }`}
            >
              {plan.highlight && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                  <span className="rounded-full bg-teal-600 px-4 py-1 text-xs font-semibold text-white">
                    {isAr ? "الأكثر شيوعاً" : "Most Popular"}
                  </span>
                </div>
              )}
              <h3 className="text-xl font-bold text-slate-900">{plan.name}</h3>
              <p className="mt-1 text-sm text-slate-500">{plan.description}</p>
              <p className="mt-4 text-3xl font-bold text-slate-900">
                {plan.price}
                {plan.currency && (
                  <span className="text-base font-normal text-slate-500"> {plan.currency}</span>
                )}
              </p>
              <p className="mt-1 text-xs text-teal-600 font-medium">{plan.limit}</p>
              <ul className="mt-6 space-y-3">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm text-slate-600">
                    <Check className="mt-0.5 h-4 w-4 flex-shrink-0 text-teal-600" />
                    {f}
                  </li>
                ))}
              </ul>
              <Link
                href={`/${locale}/contact`}
                className={`mt-8 block rounded-xl px-4 py-3 text-center text-sm font-semibold transition-all active:scale-95 ${
                  plan.highlight
                    ? "bg-teal-600 text-white hover:bg-teal-700 shadow-md hover:shadow-lg"
                    : "border border-slate-200 text-slate-700 hover:border-teal-300 hover:bg-teal-50 hover:text-teal-700"
                }`}
              >
                {plan.nameEn === "Enterprise"
                  ? (isAr ? "تواصل مع فريق المبيعات" : "Contact Sales")
                  : (isAr ? "ابدأ مجاناً" : "Start Free")}
              </Link>
            </div>
          ))}
        </StaggerChildren>
      </div>
    </div>
  );
}
```

**Step 2: Build check**

```bash
npm run build 2>&1 | grep -E "pricing|error|Error" | head -10
```
Expected: `ƒ /[locale]/pricing` listed

**Step 3: Commit**

```bash
git add src/app/\[locale\]/\(marketing\)/pricing/
git commit -m "feat: add pricing page with 3-tier plan comparison"
```

---

### Task 6: Features Page + Contact Page

**Files:**
- Create: `src/app/[locale]/(marketing)/features/page.tsx`
- Create: `src/app/[locale]/(marketing)/contact/page.tsx`

**Step 1: Create features page**

```tsx
// src/app/[locale]/(marketing)/features/page.tsx
import { FadeInSection } from "@/components/ui/fade-in-section";
import { FeaturesGrid } from "@/components/marketing/features-grid";

export default async function FeaturesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const isAr = locale === "ar";

  return (
    <div className="min-h-screen pt-24 pb-20">
      <div className="mx-auto max-w-7xl px-6">
        <FadeInSection className="mb-4 text-center">
          <h1 className="text-4xl font-bold text-slate-900 md:text-5xl">
            {isAr ? "ميزات منصة Saohil1" : "Saohil1 Platform Features"}
          </h1>
          <p className="mt-4 text-lg text-slate-500 max-w-2xl mx-auto">
            {isAr
              ? "منصة شاملة تغطي كل احتياجات كليتك التقنية من يوم القبول حتى يوم التخرج"
              : "A comprehensive platform covering all your technical college needs from admission to graduation"}
          </p>
        </FadeInSection>
      </div>
      <FeaturesGrid />
    </div>
  );
}
```

**Step 2: Create contact page**

```tsx
// src/app/[locale]/(marketing)/contact/page.tsx
import { FadeInSection } from "@/components/ui/fade-in-section";
import { CheckCircle, Clock, Shield } from "lucide-react";

export default async function ContactPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const isAr = locale === "ar";

  const trustSignals = [
    {
      icon: Clock,
      text: isAr ? "يتواصل معك فريقنا خلال 24 ساعة" : "Our team contacts you within 24 hours",
    },
    {
      icon: CheckCircle,
      text: isAr ? "تجربة مجانية كاملة 30 يوماً" : "Full free trial for 30 days",
    },
    {
      icon: Shield,
      text: isAr ? "بدون بطاقة ائتمانية" : "No credit card required",
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 pt-24 pb-20">
      <div className="mx-auto max-w-5xl px-6">
        <FadeInSection className="mb-12 text-center">
          <h1 className="text-4xl font-bold text-slate-900">
            {isAr ? "احجز عرضاً توضيحياً مجانياً" : "Book a Free Demo"}
          </h1>
          <p className="mt-4 text-lg text-slate-500">
            {isAr
              ? "أخبرنا عن مؤسستك وسنقدم لك عرضاً مخصصاً"
              : "Tell us about your institution and we'll tailor the demo for you"}
          </p>
        </FadeInSection>

        <FadeInSection delay={100}>
          <div className="grid gap-8 md:grid-cols-2">
            {/* Form */}
            <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
              <form className="space-y-4">
                {[
                  { id: "name", label: isAr ? "الاسم الكامل" : "Full Name", type: "text" },
                  { id: "email", label: isAr ? "البريد الإلكتروني" : "Email Address", type: "email" },
                  { id: "institution", label: isAr ? "اسم المؤسسة" : "Institution Name", type: "text" },
                ].map((field) => (
                  <div key={field.id}>
                    <label htmlFor={field.id} className="mb-1.5 block text-sm font-medium text-slate-700">
                      {field.label}
                    </label>
                    <input
                      id={field.id}
                      type={field.type}
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-900 outline-none transition-all focus:border-teal-400 focus:bg-white focus:ring-2 focus:ring-teal-100"
                    />
                  </div>
                ))}
                <div>
                  <label htmlFor="size" className="mb-1.5 block text-sm font-medium text-slate-700">
                    {isAr ? "عدد الطلاب التقريبي" : "Approximate Student Count"}
                  </label>
                  <select
                    id="size"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-900 outline-none transition-all focus:border-teal-400 focus:bg-white focus:ring-2 focus:ring-teal-100"
                  >
                    <option>{isAr ? "أقل من 500" : "Less than 500"}</option>
                    <option>{isAr ? "500 – 2,000" : "500 – 2,000"}</option>
                    <option>{isAr ? "2,000 – 10,000" : "2,000 – 10,000"}</option>
                    <option>{isAr ? "أكثر من 10,000" : "More than 10,000"}</option>
                  </select>
                </div>
                <button
                  type="submit"
                  className="w-full rounded-xl bg-teal-600 py-3 text-sm font-semibold text-white shadow-md transition-all hover:bg-teal-700 hover:shadow-lg active:scale-95"
                >
                  {isAr ? "احجز العرض التوضيحي" : "Book the Demo"}
                </button>
              </form>
            </div>

            {/* Trust signals */}
            <div className="flex flex-col justify-center space-y-6">
              {trustSignals.map((s) => (
                <div key={s.text} className="flex items-start gap-4">
                  <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-teal-50 text-teal-600">
                    <s.icon className="h-5 w-5" />
                  </div>
                  <p className="pt-2 text-sm text-slate-600">{s.text}</p>
                </div>
              ))}
            </div>
          </div>
        </FadeInSection>
      </div>
    </div>
  );
}
```

**Step 3: Build check**

```bash
npm run build 2>&1 | grep -E "features|contact|pricing|✓|error" | head -15
```
Expected: all 4 marketing routes listed

**Step 4: Commit**

```bash
git add src/app/\[locale\]/\(marketing\)/features/ src/app/\[locale\]/\(marketing\)/contact/
git commit -m "feat: add features and contact/demo pages"
```

---

## Phase 2 — App Enhancements

---

### Task 7: Page Transitions for Dashboard

**Files:**
- Create: `src/components/ui/page-transition.tsx`
- Modify: `src/app/[locale]/(dashboard)/layout.tsx`

**Step 1: Create PageTransition component**

```tsx
// src/components/ui/page-transition.tsx
"use client";

import { useEffect, useRef } from "react";

export function PageTransition({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.style.opacity = "0";
    el.style.transform = "translateY(-6px)";
    requestAnimationFrame(() => {
      el.style.transition = "opacity 220ms ease-out, transform 220ms ease-out";
      el.style.opacity = "1";
      el.style.transform = "translateY(0)";
    });
  }, []);

  return (
    <div ref={ref} style={{ opacity: 0 }}>
      {children}
    </div>
  );
}
```

**Step 2: Wrap ResponsiveContent in layout.tsx**

Find in `src/app/[locale]/(dashboard)/layout.tsx`:
```tsx
import { ResponsiveContent } from "@/components/layout/responsive-content";
```

Add below it:
```tsx
import { PageTransition } from "@/components/ui/page-transition";
```

Find:
```tsx
<div id="main-content">
  <ResponsiveContent>{children}</ResponsiveContent>
</div>
```

Replace with:
```tsx
<div id="main-content">
  <PageTransition>
    <ResponsiveContent>{children}</ResponsiveContent>
  </PageTransition>
</div>
```

**Step 3: Build check**

```bash
npm run build 2>&1 | tail -5
```

**Step 4: Commit**

```bash
git add src/components/ui/page-transition.tsx src/app/\[locale\]/\(dashboard\)/layout.tsx
git commit -m "feat: add page transition animation to dashboard layout"
```

---

### Task 8: Enhanced Table Interactions via CSS

**Files:**
- Modify: `src/app/globals.css`

**Step 1: Append table enhancement styles to globals.css**

```css
/* ═══════════════════════════════════════════
   ENHANCED TABLE INTERACTIONS
   ═══════════════════════════════════════════ */

/* Row hover — ink slide (LTR: left; RTL: right) */
.table-row-hover {
  position: relative;
  transition: background-color 150ms ease;
}

.table-row-hover::before {
  content: "";
  position: absolute;
  inset-inline-start: 0;
  top: 0;
  bottom: 0;
  width: 3px;
  background: var(--color-teal-500);
  transform: scaleY(0);
  transition: transform 150ms cubic-bezier(0.16, 1, 0.3, 1);
  border-radius: 0 2px 2px 0;
}

.table-row-hover:hover::before {
  transform: scaleY(1);
}

/* Selected row highlight */
.table-row-selected {
  background-color: var(--color-teal-50) !important;
  border-inline-start: 2px solid var(--color-teal-500);
}

/* Sort icon rotation */
.sort-icon-asc {
  transform: rotate(0deg);
  transition: transform 200ms ease;
}

.sort-icon-desc {
  transform: rotate(180deg);
  transition: transform 200ms ease;
}

/* Filter panel slide */
.filter-panel {
  overflow: hidden;
  transition: max-height 200ms cubic-bezier(0.16, 1, 0.3, 1), opacity 150ms ease;
}

.filter-panel[data-open="false"] {
  max-height: 0;
  opacity: 0;
}

.filter-panel[data-open="true"] {
  max-height: 400px;
  opacity: 1;
}

/* Empty state fade */
.empty-state {
  animation: fade-in-up 0.4s cubic-bezier(0.16, 1, 0.3, 1) both;
}

/* ═══════════════════════════════════════════
   TOAST NOTIFICATIONS
   ═══════════════════════════════════════════ */

.toast-container {
  position: fixed;
  bottom: 1.5rem;
  inset-inline-end: 1.5rem;
  z-index: 9999;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  pointer-events: none;
}

.toast {
  pointer-events: auto;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  min-width: 280px;
  max-width: 380px;
  border-radius: 14px;
  padding: 0.875rem 1rem;
  background: white;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);
  border: 1px solid rgba(0, 0, 0, 0.06);
  animation: toast-in 300ms cubic-bezier(0.16, 1, 0.3, 1) both;
}

.toast-exit {
  animation: toast-out 200ms ease-in both;
}

.toast-success { border-inline-start: 3px solid #10B981; }
.toast-error   { border-inline-start: 3px solid #EF4444; }
.toast-info    { border-inline-start: 3px solid var(--color-teal-500); }

@keyframes toast-in {
  from {
    opacity: 0;
    transform: translateX(100%) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translateX(0) scale(1);
  }
}

[dir="rtl"] .toast {
  animation-name: toast-in-rtl;
}

@keyframes toast-in-rtl {
  from {
    opacity: 0;
    transform: translateX(-100%) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translateX(0) scale(1);
  }
}

@keyframes toast-out {
  to {
    opacity: 0;
    transform: scale(0.95);
  }
}
```

**Step 2: Build check**

```bash
npm run build 2>&1 | tail -5
```
Expected: `✓ Compiled successfully`

**Step 3: Commit**

```bash
git add src/app/globals.css
git commit -m "feat: add table interactions and toast notification CSS"
```

---

### Task 9: Toast Notification Component + Store

**Files:**
- Create: `src/stores/toast-store.ts`
- Create: `src/components/ui/toast.tsx`
- Modify: `src/app/[locale]/(dashboard)/layout.tsx`

**Step 1: Create toast-store.ts**

```ts
// src/stores/toast-store.ts
import { create } from "zustand";

export type ToastType = "success" | "error" | "info";

export interface Toast {
  id: string;
  message: string;
  type: ToastType;
}

interface ToastStore {
  toasts: Toast[];
  add: (message: string, type?: ToastType) => void;
  remove: (id: string) => void;
}

export const useToastStore = create<ToastStore>((set) => ({
  toasts: [],
  add: (message, type = "info") => {
    const id = Math.random().toString(36).slice(2);
    set((s) => ({ toasts: [...s.toasts, { id, message, type }] }));
    // Auto-dismiss success/info after 3s
    if (type !== "error") {
      setTimeout(() => {
        set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) }));
      }, 3000);
    }
  },
  remove: (id) => set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) })),
}));
```

**Step 2: Create Toast component**

```tsx
// src/components/ui/toast.tsx
"use client";

import { useToastStore } from "@/stores/toast-store";
import { CheckCircle, AlertCircle, Info, X } from "lucide-react";

const icons = {
  success: CheckCircle,
  error: AlertCircle,
  info: Info,
};

const iconColors = {
  success: "text-green-500",
  error: "text-red-500",
  info: "text-teal-500",
};

export function ToastContainer() {
  const { toasts, remove } = useToastStore();

  if (toasts.length === 0) return null;

  return (
    <div className="toast-container">
      {toasts.map((t) => {
        const Icon = icons[t.type];
        return (
          <div key={t.id} className={`toast toast-${t.type}`} role="alert">
            <Icon className={`h-4 w-4 flex-shrink-0 ${iconColors[t.type]}`} />
            <p className="flex-1 text-sm font-medium text-slate-800">{t.message}</p>
            <button
              onClick={() => remove(t.id)}
              className="flex-shrink-0 rounded-lg p-1 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        );
      })}
    </div>
  );
}
```

**Step 3: Add ToastContainer to dashboard layout**

Add import to `src/app/[locale]/(dashboard)/layout.tsx`:
```tsx
import { ToastContainer } from "@/components/ui/toast";
```

Add before `</SessionProvider>`:
```tsx
<ToastContainer />
```

**Step 4: Build check**

```bash
npm run build 2>&1 | tail -5
```

**Step 5: Commit**

```bash
git add src/stores/toast-store.ts src/components/ui/toast.tsx src/app/\[locale\]/\(dashboard\)/layout.tsx
git commit -m "feat: add toast notification system with Zustand store"
```

---

### Task 10: Final Build Verification + Documentation Update

**Files:**
- Modify: `docs/LOCAL_DEV.md`

**Step 1: Full build + verify all new routes exist**

```bash
export NVM_DIR="$HOME/.nvm" && [ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"
cd /Users/hossam/Documents/saohil1
npm run build 2>&1
```

Expected routes to appear:
- `ƒ /[locale]` (marketing home)
- `ƒ /[locale]/pricing`
- `ƒ /[locale]/features`
- `ƒ /[locale]/contact`

**Step 2: Dev server smoke test**

```bash
PORT=3001 npm run dev &
sleep 5
curl -I http://localhost:3001/ar        # marketing home
curl -I http://localhost:3001/ar/pricing
curl -I http://localhost:3001/ar/features
curl -I http://localhost:3001/ar/contact
kill %1
```
Expected: All return `HTTP/1.1 200 OK`

**Step 3: Update LOCAL_DEV.md**

Add a new section "Marketing Site" to `docs/LOCAL_DEV.md`:

```markdown
## الموقع التسويقي

| الصفحة | العنوان |
|--------|---------|
| الرئيسية | http://localhost:3001/ar |
| الميزات | http://localhost:3001/ar/features |
| التسعير | http://localhost:3001/ar/pricing |
| تواصل معنا | http://localhost:3001/ar/contact |

> لوحة التحكم: http://localhost:3001/ar/dashboard (تتطلب تسجيل دخول)
```

**Step 4: Final commit**

```bash
git add docs/LOCAL_DEV.md
git commit -m "docs: update LOCAL_DEV.md with marketing site URLs"
```
