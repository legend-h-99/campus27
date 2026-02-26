# Saohil1 Dynamic Platform Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** نسخ مشروع Campus27 إلى بيئة محلية مستقلة باسم Saohil1 تعمل على port 3001 عبر Docker Compose، مع إضافة Global Search Command Palette (⌘K) وMicro-Interactions متكاملة.

**Architecture:** نسخ المشروع كاملاً إلى `/Users/hossam/Documents/saohil1/` ← تغيير جميع مراجع الاسم ← إضافة `docker-compose.dev.yml` معزول على port 3001 ← بناء Command Palette كـ client component مستقل يستدعي API endpoint جديد ← إضافة Micro-Interactions عبر CSS animations + Framer Motion.

**Tech Stack:** Next.js 16, React 19, TypeScript, Tailwind CSS v4, Zustand, Docker Compose, PostgreSQL 16-alpine

---

## Task 1: نسخ المشروع وإنشاء البيئة المستقلة

**Files:**
- Create: `/Users/hossam/Documents/saohil1/` (مجلد جديد)

**Step 1: نسخ المشروع كاملاً**

```bash
cp -r /Users/hossam/Documents/saas-s-1 /Users/hossam/Documents/saohil1
cd /Users/hossam/Documents/saohil1
```

**Step 2: التحقق من النسخ**

```bash
ls /Users/hossam/Documents/saohil1
```
Expected: يظهر Dockerfile، src، prisma، package.json، etc.

**Step 3: Commit الأساسي**

```bash
cd /Users/hossam/Documents/saohil1
git init
git add .
git commit -m "chore: initial copy from campus27 as saohil1 base"
```

---

## Task 2: تغيير اسم المنصة من Campus27 إلى Saohil1

**Files:**
- Modify: `package.json`
- Modify: `src/components/layout/sidebar.tsx`
- Modify: `src/components/layout/header.tsx`
- Modify: `docker-compose.prod.yml`

**Step 1: تغيير اسم الحزمة في package.json**

في `/Users/hossam/Documents/saohil1/package.json`، سطر 2:
```json
"name": "saohil1",
```

**Step 2: تغيير الاسم في sidebar.tsx**

في `src/components/layout/sidebar.tsx`، استبدل كل `Campus27` بـ `Saohil1`:
- سطر 602: `<span className="text-[17px] font-bold text-slate-800">Saohil1</span>`
- سطر 697: `<span className="text-[17px] font-bold text-slate-800">Saohil1</span>`

**Step 3: تغيير الاسم في header.tsx**

في `src/components/layout/header.tsx`، سطر 105:
```tsx
<span className="text-sm font-bold text-teal-600">Saohil1</span>
```

**Step 4: تغيير اسم قاعدة البيانات في docker-compose.prod.yml**

استبدل كل `campus27` بـ `saohil1` في:
- `POSTGRES_DB: saohil1`
- `POSTGRES_USER: ${DB_USER:-saohil1}`
- healthcheck: `pg_isready -U ${DB_USER:-saohil1} -d saohil1`
- `DATABASE_URL`: استبدل `campus27` بـ `saohil1`

**Step 5: تشغيل البحث الشامل للتأكد من عدم وجود مراجع متبقية**

```bash
cd /Users/hossam/Documents/saohil1
grep -r "Campus27\|campus27" --include="*.ts" --include="*.tsx" --include="*.json" --include="*.yml" src/ package.json docker-compose.prod.yml
```
Expected: لا نتائج.

**Step 6: Commit**

```bash
git add -A
git commit -m "feat: rebrand from Campus27 to Saohil1"
```

---

## Task 3: إنشاء docker-compose.dev.yml للبيئة المحلية المعزولة

**Files:**
- Create: `/Users/hossam/Documents/saohil1/docker-compose.dev.yml`
- Create: `/Users/hossam/Documents/saohil1/.env.local.example`

**Step 1: إنشاء docker-compose.dev.yml**

```yaml
# docker-compose.dev.yml — Saohil1 Local Dev Environment (port 3001)
services:
  db:
    image: postgres:16-alpine
    restart: unless-stopped
    environment:
      POSTGRES_DB: saohil1_dev
      POSTGRES_USER: saohil1
      POSTGRES_PASSWORD: saohil1_dev_pass
    volumes:
      - saohil1_pgdata:/var/lib/postgresql/data
    ports:
      - "127.0.0.1:5433:5432"
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U saohil1 -d saohil1_dev"]
      interval: 10s
      timeout: 5s
      retries: 5

  migrator:
    build:
      context: .
      dockerfile: Dockerfile
      target: migrator
    depends_on:
      db:
        condition: service_healthy
    environment:
      DATABASE_URL: postgresql://saohil1:saohil1_dev_pass@db:5432/saohil1_dev
    profiles:
      - migrate

  app:
    build:
      context: .
      dockerfile: Dockerfile
    restart: unless-stopped
    depends_on:
      db:
        condition: service_healthy
    environment:
      DATABASE_URL: postgresql://saohil1:saohil1_dev_pass@db:5432/saohil1_dev
      NEXTAUTH_SECRET: saohil1-local-dev-secret-change-in-prod
      NEXTAUTH_URL: http://localhost:3001
      NODE_ENV: production
      AI_PROVIDER: anthropic
      ANTHROPIC_API_KEY: ${ANTHROPIC_API_KEY:-}
      AI_MODEL: claude-sonnet-4-20250514
      AI_MAX_TOKENS: "2048"
      AI_TEMPERATURE: "0.3"
      AI_CACHE_TTL_MINUTES: "30"
      AI_RATE_LIMIT_PER_MINUTE: "20"
      PORT: "3001"
    ports:
      - "127.0.0.1:3001:3001"

volumes:
  saohil1_pgdata:
```

**Step 2: إنشاء .env.local.example**

```bash
cat > /Users/hossam/Documents/saohil1/.env.local.example << 'EOF'
# Saohil1 Local Dev — copy to .env.local and fill in values
DATABASE_URL=postgresql://saohil1:saohil1_dev_pass@localhost:5433/saohil1_dev
NEXTAUTH_SECRET=saohil1-local-dev-secret-change-in-prod
NEXTAUTH_URL=http://localhost:3001
ANTHROPIC_API_KEY=your_key_here
EOF
```

**Step 3: Commit**

```bash
git add docker-compose.dev.yml .env.local.example
git commit -m "feat: add Docker Compose dev environment on port 3001"
```

---

## Task 4: إنشاء Global Search API Endpoint

**Files:**
- Create: `src/app/api/search/route.ts`

**Step 1: إنشاء API route للبحث الشامل**

```typescript
// src/app/api/search/route.ts
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { getPrismaClient } from "@/lib/prisma";

export interface SearchResult {
  id: string;
  title: string;
  subtitle?: string;
  type: "trainee" | "trainer" | "course" | "department" | "task" | "project" | "page";
  href: string;
  icon?: string;
}

export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const q = req.nextUrl.searchParams.get("q")?.trim();
  if (!q || q.length < 2) {
    return NextResponse.json({ results: [] });
  }

  const prisma = await getPrismaClient();
  const term = `%${q}%`;
  const results: SearchResult[] = [];

  try {
    // Search trainees
    const trainees = await prisma.trainee.findMany({
      where: {
        OR: [
          { nameAr: { contains: q, mode: "insensitive" } },
          { nameEn: { contains: q, mode: "insensitive" } },
          { studentId: { contains: q, mode: "insensitive" } },
        ],
      },
      take: 5,
      select: { id: true, nameAr: true, nameEn: true, studentId: true },
    });
    trainees.forEach((t) =>
      results.push({
        id: t.id,
        title: t.nameAr,
        subtitle: t.studentId ?? undefined,
        type: "trainee",
        href: `/trainees`,
        icon: "GraduationCap",
      })
    );

    // Search trainers
    const trainers = await prisma.trainer.findMany({
      where: {
        OR: [
          { nameAr: { contains: q, mode: "insensitive" } },
          { nameEn: { contains: q, mode: "insensitive" } },
        ],
      },
      take: 5,
      select: { id: true, nameAr: true, nameEn: true, specialization: true },
    });
    trainers.forEach((t) =>
      results.push({
        id: t.id,
        title: t.nameAr,
        subtitle: t.specialization ?? undefined,
        type: "trainer",
        href: `/trainers`,
        icon: "Users",
      })
    );

    // Search courses
    const courses = await prisma.course.findMany({
      where: {
        OR: [
          { nameAr: { contains: q, mode: "insensitive" } },
          { nameEn: { contains: q, mode: "insensitive" } },
          { code: { contains: q, mode: "insensitive" } },
        ],
      },
      take: 5,
      select: { id: true, nameAr: true, code: true },
    });
    courses.forEach((c) =>
      results.push({
        id: c.id,
        title: c.nameAr,
        subtitle: c.code,
        type: "course",
        href: `/courses`,
        icon: "BookOpen",
      })
    );

    // Static page results
    const pages = [
      { title: "لوحة التحكم", href: "/", icon: "LayoutDashboard" },
      { title: "المالية", href: "/finance", icon: "DollarSign" },
      { title: "الجودة", href: "/quality", icon: "Award" },
      { title: "الموارد البشرية", href: "/hr", icon: "UserCog" },
      { title: "التقارير", href: "/reports", icon: "BarChart3" },
      { title: "الذكاء الاصطناعي", href: "/ai", icon: "Brain" },
    ];
    pages
      .filter((p) => p.title.includes(q) || p.href.includes(q))
      .forEach((p) =>
        results.push({ id: p.href, title: p.title, type: "page", href: p.href, icon: p.icon })
      );

    return NextResponse.json({ results: results.slice(0, 15) });
  } catch (error) {
    console.error("Search error:", error);
    return NextResponse.json({ results: [] });
  }
}
```

**Step 2: التحقق من أن getPrismaClient موجودة في lib/prisma.ts**

```bash
grep -n "getPrismaClient\|export" /Users/hossam/Documents/saohil1/src/lib/prisma.ts
```
إذا كانت الدالة باسم مختلف، عدّل الـ import في route.ts وفقاً لذلك.

**Step 3: Commit**

```bash
git add src/app/api/search/route.ts
git commit -m "feat: add global search API endpoint"
```

---

## Task 5: إنشاء Zustand Store للـ Command Palette

**Files:**
- Create: `src/stores/command-palette-store.ts`

**Step 1: إنشاء الـ store**

```typescript
// src/stores/command-palette-store.ts
import { create } from "zustand";
import type { SearchResult } from "@/app/api/search/route";

interface CommandPaletteStore {
  isOpen: boolean;
  query: string;
  results: SearchResult[];
  isLoading: boolean;
  selectedIndex: number;
  open: () => void;
  close: () => void;
  setQuery: (q: string) => void;
  setResults: (r: SearchResult[]) => void;
  setLoading: (v: boolean) => void;
  setSelectedIndex: (i: number) => void;
  moveUp: () => void;
  moveDown: () => void;
}

export const useCommandPaletteStore = create<CommandPaletteStore>((set, get) => ({
  isOpen: false,
  query: "",
  results: [],
  isLoading: false,
  selectedIndex: 0,
  open: () => set({ isOpen: true, query: "", results: [], selectedIndex: 0 }),
  close: () => set({ isOpen: false, query: "", results: [], selectedIndex: 0 }),
  setQuery: (q) => set({ query: q, selectedIndex: 0 }),
  setResults: (r) => set({ results: r }),
  setLoading: (v) => set({ isLoading: v }),
  setSelectedIndex: (i) => set({ selectedIndex: i }),
  moveUp: () => {
    const { selectedIndex, results } = get();
    set({ selectedIndex: selectedIndex > 0 ? selectedIndex - 1 : results.length - 1 });
  },
  moveDown: () => {
    const { selectedIndex, results } = get();
    set({ selectedIndex: selectedIndex < results.length - 1 ? selectedIndex + 1 : 0 });
  },
}));
```

**Step 2: Commit**

```bash
git add src/stores/command-palette-store.ts
git commit -m "feat: add command palette Zustand store"
```

---

## Task 6: بناء Command Palette Component

**Files:**
- Create: `src/components/ui/command-palette.tsx`

**Step 1: إنشاء الـ component**

```tsx
// src/components/ui/command-palette.tsx
"use client";

import { useEffect, useRef, useCallback } from "react";
import { useRouter } from "@/i18n/routing";
import { useLocale } from "next-intl";
import { useCommandPaletteStore } from "@/stores/command-palette-store";
import { cn } from "@/lib/utils";
import {
  Search, GraduationCap, Users, BookOpen, LayoutDashboard,
  DollarSign, Award, UserCog, BarChart3, Brain, Building2,
  X, ArrowUp, ArrowDown, CornerDownLeft, Loader2,
} from "lucide-react";
import type { SearchResult } from "@/app/api/search/route";

const iconMap: Record<string, React.ElementType> = {
  GraduationCap, Users, BookOpen, LayoutDashboard,
  DollarSign, Award, UserCog, BarChart3, Brain, Building2,
};

const typeColors: Record<SearchResult["type"], string> = {
  trainee: "bg-teal-100 text-teal-700",
  trainer: "bg-aqua-100 text-aqua-700",
  course: "bg-mint-100 text-mint-700",
  department: "bg-sage-100 text-sage-700",
  task: "bg-orange-100 text-orange-700",
  project: "bg-purple-100 text-purple-700",
  page: "bg-slate-100 text-slate-600",
};

const typeLabels: Record<SearchResult["type"], { ar: string; en: string }> = {
  trainee: { ar: "متدرب", en: "Trainee" },
  trainer: { ar: "مدرب", en: "Trainer" },
  course: { ar: "مقرر", en: "Course" },
  department: { ar: "قسم", en: "Dept" },
  task: { ar: "مهمة", en: "Task" },
  project: { ar: "مشروع", en: "Project" },
  page: { ar: "صفحة", en: "Page" },
};

export function CommandPalette() {
  const { isOpen, query, results, isLoading, selectedIndex, close, setQuery, setResults, setLoading, moveUp, moveDown } =
    useCommandPaletteStore();
  const router = useRouter();
  const locale = useLocale();
  const inputRef = useRef<HTMLInputElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  // Debounced search
  const handleSearch = useCallback(
    (value: string) => {
      setQuery(value);
      if (debounceRef.current) clearTimeout(debounceRef.current);
      if (!value.trim() || value.length < 2) {
        setResults([]);
        return;
      }
      setLoading(true);
      debounceRef.current = setTimeout(async () => {
        try {
          const res = await fetch(`/api/search?q=${encodeURIComponent(value)}`);
          const data = await res.json();
          setResults(data.results ?? []);
        } catch {
          setResults([]);
        } finally {
          setLoading(false);
        }
      }, 300);
    },
    [setQuery, setResults, setLoading]
  );

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") { close(); return; }
      if (e.key === "ArrowUp") { e.preventDefault(); moveUp(); return; }
      if (e.key === "ArrowDown") { e.preventDefault(); moveDown(); return; }
      if (e.key === "Enter" && results[selectedIndex]) {
        e.preventDefault();
        router.push(results[selectedIndex].href as "/");
        close();
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [isOpen, results, selectedIndex, close, moveUp, moveDown, router]);

  if (!isOpen) return null;

  return (
    <div
      className="command-palette-overlay fixed inset-0 z-50 flex items-start justify-center pt-[15vh] px-4"
      onClick={(e) => e.target === e.currentTarget && close()}
    >
      <div className="command-palette-panel w-full max-w-xl overflow-hidden rounded-2xl shadow-2xl">
        {/* Search Input */}
        <div className="flex items-center gap-3 border-b border-slate-200/60 px-4 py-3">
          {isLoading ? (
            <Loader2 className="h-5 w-5 shrink-0 animate-spin text-teal-500" />
          ) : (
            <Search className="h-5 w-5 shrink-0 text-slate-400" />
          )}
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => handleSearch(e.target.value)}
            placeholder={locale === "ar" ? "ابحث في كل شيء..." : "Search everything..."}
            className="flex-1 bg-transparent text-[15px] text-slate-800 outline-none placeholder:text-slate-400"
            dir={locale === "ar" ? "rtl" : "ltr"}
          />
          <button
            onClick={close}
            className="rounded-lg p-1 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Results */}
        {results.length > 0 && (
          <ul className="max-h-80 overflow-y-auto py-2">
            {results.map((result, idx) => {
              const Icon = iconMap[result.icon ?? ""] ?? Search;
              const label = typeLabels[result.type][locale as "ar" | "en"] ?? result.type;
              return (
                <li key={`${result.type}-${result.id}`}>
                  <button
                    onClick={() => { router.push(result.href as "/"); close(); }}
                    className={cn(
                      "command-palette-item flex w-full items-center gap-3 px-4 py-2.5 text-start transition-colors",
                      idx === selectedIndex ? "bg-teal-50" : "hover:bg-slate-50"
                    )}
                  >
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-teal-50">
                      <Icon className="h-4 w-4 text-teal-600" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-[13px] font-medium text-slate-800">{result.title}</p>
                      {result.subtitle && (
                        <p className="truncate text-[11px] text-slate-500">{result.subtitle}</p>
                      )}
                    </div>
                    <span className={cn("rounded-md px-2 py-0.5 text-[10px] font-medium", typeColors[result.type])}>
                      {label}
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        )}

        {/* Empty state */}
        {!isLoading && query.length >= 2 && results.length === 0 && (
          <div className="py-8 text-center text-[13px] text-slate-400">
            {locale === "ar" ? `لا نتائج لـ "${query}"` : `No results for "${query}"`}
          </div>
        )}

        {/* Hints */}
        <div className="flex items-center gap-4 border-t border-slate-200/60 px-4 py-2">
          <div className="flex items-center gap-1 text-[11px] text-slate-400">
            <ArrowUp className="h-3 w-3" /><ArrowDown className="h-3 w-3" />
            <span>{locale === "ar" ? "للتنقل" : "navigate"}</span>
          </div>
          <div className="flex items-center gap-1 text-[11px] text-slate-400">
            <CornerDownLeft className="h-3 w-3" />
            <span>{locale === "ar" ? "للفتح" : "open"}</span>
          </div>
          <div className="flex items-center gap-1 text-[11px] text-slate-400">
            <span className="rounded border border-slate-200 px-1 text-[10px]">Esc</span>
            <span>{locale === "ar" ? "للإغلاق" : "close"}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
```

**Step 2: Commit**

```bash
git add src/components/ui/command-palette.tsx
git commit -m "feat: add Command Palette UI component with keyboard navigation"
```

---

## Task 7: إضافة CSS للـ Command Palette + Micro-Interactions

**Files:**
- Modify: `src/app/globals.css`

**Step 1: إضافة CSS للـ Command Palette**

أضف في نهاية ملف `src/app/globals.css`:

```css
/* ═══════════════════════════════════════════
   COMMAND PALETTE — Saohil1
   ═══════════════════════════════════════════ */

.command-palette-overlay {
  background: rgba(15, 23, 42, 0.5);
  backdrop-filter: blur(4px);
  animation: overlay-in 0.15s ease-out;
}

.command-palette-panel {
  background: rgba(255, 255, 255, 0.97);
  backdrop-filter: blur(24px) saturate(180%);
  border: 1px solid rgba(27, 169, 160, 0.15);
  animation: palette-in 0.2s cubic-bezier(0.16, 1, 0.3, 1);
}

.command-palette-item {
  transition: background-color 0.1s ease;
}

@keyframes overlay-in {
  from { opacity: 0; }
  to   { opacity: 1; }
}

@keyframes palette-in {
  from { opacity: 0; transform: scale(0.96) translateY(-8px); }
  to   { opacity: 1; transform: scale(1)    translateY(0);    }
}

/* ═══════════════════════════════════════════
   MICRO-INTERACTIONS — Saohil1
   ═══════════════════════════════════════════ */

/* Stat cards: lift on hover */
.stats-card,
.glass-card {
  transition: transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1),
              box-shadow 0.2s ease;
}
.stats-card:hover,
.glass-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 12px 32px rgba(27, 169, 160, 0.12);
}

/* Buttons: spring press */
button:not(:disabled):active,
a[role="button"]:active {
  transform: scale(0.97);
  transition: transform 0.08s ease;
}

/* Nav items: icon scale on hover (already in sidebar but reinforced) */
.nav-item:hover .lucide {
  transform: scale(1.1);
  transition: transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1);
}

/* Active nav item: shimmer pulse */
.nav-item-active::after {
  content: "";
  position: absolute;
  inset: 0;
  border-radius: inherit;
  background: linear-gradient(
    105deg,
    transparent 40%,
    rgba(255, 255, 255, 0.15) 50%,
    transparent 60%
  );
  background-size: 200% 100%;
  animation: nav-shimmer 3s ease-in-out infinite;
}

@keyframes nav-shimmer {
  0%   { background-position: 200% center; }
  50%  { background-position: -200% center; }
  100% { background-position: 200% center; }
}

/* Notification badge: heartbeat */
.notification-badge-pulse {
  animation: badge-beat 2s ease-in-out infinite;
}

@keyframes badge-beat {
  0%, 100% { transform: scale(1); }
  50%       { transform: scale(1.15); }
}

/* Page transitions: fade + slide up */
.animate-fade-in {
  animation: fade-slide-in 0.3s cubic-bezier(0.16, 1, 0.3, 1) both;
}

@keyframes fade-slide-in {
  from { opacity: 0; transform: translateY(12px); }
  to   { opacity: 1; transform: translateY(0);    }
}

/* Circular progress in sidebar: animated on mount */
.sidebar-capacity-card circle {
  transition: stroke-dashoffset 1.2s cubic-bezier(0.34, 1.56, 0.64, 1);
}

/* Dropdown menus: smooth open */
.dropdown-animate {
  animation: dropdown-open 0.18s cubic-bezier(0.16, 1, 0.3, 1);
}

@keyframes dropdown-open {
  from { opacity: 0; transform: scale(0.95) translateY(-4px); }
  to   { opacity: 1; transform: scale(1)    translateY(0);    }
}

/* Chevron rotation for user menu */
.chevron-rotate {
  transition: transform 0.2s ease;
}
.chevron-rotate.open {
  transform: rotate(180deg);
}

/* Skeleton loading shimmer */
@keyframes skeleton-shimmer {
  0%   { background-position: -400px 0; }
  100% { background-position: 400px 0; }
}

.skeleton-shimmer {
  background: linear-gradient(
    90deg,
    rgba(27, 169, 160, 0.06) 25%,
    rgba(27, 169, 160, 0.12) 37%,
    rgba(27, 169, 160, 0.06) 63%
  );
  background-size: 400px 100%;
  animation: skeleton-shimmer 1.4s ease infinite;
}

/* Focus ring — accessible */
:focus-visible {
  outline: 2px solid #1BA9A0;
  outline-offset: 2px;
  border-radius: 6px;
}

/* ═══ Keyboard shortcut badge in header ═══ */
.kbd-badge {
  display: inline-flex;
  align-items: center;
  gap: 2px;
  padding: 2px 6px;
  border-radius: 6px;
  border: 1px solid rgba(27, 169, 160, 0.2);
  background: rgba(27, 169, 160, 0.06);
  font-size: 11px;
  font-weight: 500;
  color: #1BA9A0;
  font-family: ui-monospace, monospace;
}
```

**Step 2: Commit**

```bash
git add src/app/globals.css
git commit -m "feat: add command palette CSS + micro-interactions animations"
```

---

## Task 8: تفعيل Command Palette في الـ Layout + Header

**Files:**
- Modify: `src/app/[locale]/(dashboard)/layout.tsx`
- Modify: `src/components/layout/header.tsx`
- Modify: `src/stores/command-palette-store.ts` (لا تعديل مطلوب — الـ store جاهز)

**Step 1: إضافة CommandPalette إلى layout.tsx**

في `src/app/[locale]/(dashboard)/layout.tsx`، أضف import:
```tsx
import { CommandPalette } from "@/components/ui/command-palette";
```

وأضف `<CommandPalette />` قبل `</div>` الأخيرة في الـ return:
```tsx
        <AIChatbot />
        <CommandPalette />
      </div>
    </SessionProvider>
```

**Step 2: إضافة زر البحث في header.tsx مع اختصار ⌘K**

في `src/components/layout/header.tsx`، أضف import:
```tsx
import { useCommandPaletteStore } from "@/stores/command-palette-store";
```

بعد `const { isOpen, mode, toggle, openMobile } = useSidebarStore();`، أضف:
```tsx
const { open: openPalette } = useCommandPaletteStore();
```

أضف global keyboard listener في useEffect موجود أو أضف useEffect جديد:
```tsx
useEffect(() => {
  const handleGlobalKey = (e: KeyboardEvent) => {
    if ((e.metaKey || e.ctrlKey) && e.key === "k") {
      e.preventDefault();
      openPalette();
    }
  };
  document.addEventListener("keydown", handleGlobalKey);
  return () => document.removeEventListener("keydown", handleGlobalKey);
}, [openPalette]);
```

أضف زر البحث بين Language Switcher وNotifications في الـ header:
```tsx
{/* Global Search Button */}
<button
  onClick={openPalette}
  className="hidden items-center gap-2 rounded-xl border border-slate-200 bg-slate-50/80 px-3 py-1.5 text-[12px] text-slate-400 transition-all duration-200 hover:border-teal-300 hover:bg-teal-50 hover:text-teal-600 sm:flex"
  aria-label={locale === "ar" ? "بحث شامل" : "Global search"}
>
  <Search className="h-3.5 w-3.5" />
  <span>{locale === "ar" ? "ابحث..." : "Search..."}</span>
  <span className="kbd-badge">{locale === "ar" ? "⌘K" : "⌘K"}</span>
</button>
```

**Step 3: Commit**

```bash
git add src/app/[locale]/\(dashboard\)/layout.tsx src/components/layout/header.tsx
git commit -m "feat: integrate Command Palette with ⌘K shortcut in layout and header"
```

---

## Task 9: بناء وتشغيل البيئة المحلية عبر Docker

**Step 1: بناء الـ Docker image**

```bash
cd /Users/hossam/Documents/saohil1
export NVM_DIR="$HOME/.nvm" && [ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"
docker compose -f docker-compose.dev.yml build
```
Expected: `Successfully built ...` — قد يستغرق 3-5 دقائق أول مرة.

**Step 2: تشغيل قاعدة البيانات فقط أولاً**

```bash
docker compose -f docker-compose.dev.yml up db -d
```
Expected: `saohil1-db-1  Started`

**Step 3: تشغيل الـ migrations**

```bash
docker compose -f docker-compose.dev.yml --profile migrate up migrator
```
Expected: Migration completed successfully.

**Step 4: تشغيل التطبيق**

```bash
docker compose -f docker-compose.dev.yml up app -d
```
Expected: `saohil1-app-1  Started`

**Step 5: التحقق من أن التطبيق يعمل على port 3001**

```bash
curl -I http://localhost:3001
```
Expected: `HTTP/1.1 200 OK` أو redirect إلى `/ar` أو `/en`.

**Step 6: الدخول من المتصفح**

افتح: `http://localhost:3001/ar/login`

تسجيل دخول تجريبي: `admin@campus26.sa` / `123456`

---

## Task 10: التحقق الشامل وتوثيق التغييرات

**Step 1: اختبار الـ Command Palette يدوياً**

1. افتح `http://localhost:3001`
2. اضغط `⌘K` (Mac) أو `Ctrl+K` (Windows)
3. اكتب اسم متدرب أو مقرر
4. تحقق من ظهور النتائج خلال 300ms
5. تنقل بالأسهم ← اضغط Enter

**Step 2: اختبار Micro-Interactions**

1. مرر على بطاقات الإحصائيات — يجب أن ترتفع 3px
2. انقر أي زر — يجب أن يُضغط بشكل خفيف
3. افتح قائمة المستخدم — يجب أن تنزلق بسلاسة
4. لاحظ نبضة شارة الإشعارات

**Step 3: اختبار الاسم الجديد**

1. تأكد من ظهور "Saohil1" في الـ Sidebar والـ Header المحمول
2. لا يظهر "Campus27" في أي مكان

**Step 4: كتابة ملف README للبيئة المحلية**

أنشئ `docs/LOCAL_DEV.md`:

```markdown
# Saohil1 — Local Development Guide

## Quick Start

```bash
# 1. Build
docker compose -f docker-compose.dev.yml build

# 2. Start DB
docker compose -f docker-compose.dev.yml up db -d

# 3. Run migrations
docker compose -f docker-compose.dev.yml --profile migrate up migrator

# 4. Start app
docker compose -f docker-compose.dev.yml up app -d

# 5. Open browser
open http://localhost:3001/ar/login
```

## Credentials (Dev)
- Email: admin@campus26.sa
- Password: 123456

## Stop Everything
```bash
docker compose -f docker-compose.dev.yml down
```

## Features Added
- **Saohil1 Branding**: Complete rebrand from Campus27
- **Command Palette (⌘K)**: Global search across trainees, trainers, courses, pages
- **Micro-Interactions**: Hover lifts, spring press, nav shimmer, badge pulse
- **Port**: 3001 (isolated from production on 3000)
```

**Step 5: Final Commit**

```bash
git add docs/LOCAL_DEV.md
git commit -m "docs: add local development guide for Saohil1"
git log --oneline
```

---

## ملخص الملفات المُعدّلة/المُنشأة

| الملف | النوع | الغرض |
|-------|-------|--------|
| `package.json` | تعديل | تغيير الاسم إلى saohil1 |
| `docker-compose.dev.yml` | إنشاء | بيئة Docker معزولة port 3001 |
| `.env.local.example` | إنشاء | متغيرات البيئة المحلية |
| `src/app/api/search/route.ts` | إنشاء | Global Search API |
| `src/stores/command-palette-store.ts` | إنشاء | Zustand store للـ Command Palette |
| `src/components/ui/command-palette.tsx` | إنشاء | Command Palette Component |
| `src/app/globals.css` | تعديل | CSS للـ Command Palette + Micro-Interactions |
| `src/app/[locale]/(dashboard)/layout.tsx` | تعديل | تفعيل Command Palette |
| `src/components/layout/header.tsx` | تعديل | زر البحث + ⌘K listener |
| `src/components/layout/sidebar.tsx` | تعديل | تغيير الاسم |
| `docker-compose.prod.yml` | تعديل | تغيير أسماء قاعدة البيانات |
| `docs/LOCAL_DEV.md` | إنشاء | توثيق البيئة المحلية |
