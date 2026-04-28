"use client";

import { useEffect, useRef, useCallback } from "react";
import { useRouter } from "@/i18n/routing";
import { useLocale } from "next-intl";
import { useCommandPaletteStore } from "@/stores/command-palette-store";
import { cn } from "@/lib/utils";
import {
  Search,
  GraduationCap,
  Users,
  BookOpen,
  LayoutDashboard,
  DollarSign,
  Award,
  UserCog,
  BarChart3,
  Brain,
  Building2,
  Calendar,
  CheckSquare,
  FolderKanban,
  X,
  ArrowUp,
  ArrowDown,
  CornerDownLeft,
  Loader2,
} from "lucide-react";
import type { SearchResult } from "@/app/api/search/route";

const iconMap: Record<string, React.ElementType> = {
  GraduationCap,
  Users,
  BookOpen,
  LayoutDashboard,
  DollarSign,
  Award,
  UserCog,
  BarChart3,
  Brain,
  Building2,
  Calendar,
  CheckSquare,
  FolderKanban,
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
  const {
    isOpen,
    query,
    results,
    isLoading,
    selectedIndex,
    close,
    setQuery,
    setResults,
    setLoading,
    moveUp,
    moveDown,
  } = useCommandPaletteStore();
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
      if (e.key === "Escape") {
        close();
        return;
      }
      if (e.key === "ArrowUp") {
        e.preventDefault();
        moveUp();
        return;
      }
      if (e.key === "ArrowDown") {
        e.preventDefault();
        moveDown();
        return;
      }
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
      className="command-palette-overlay fixed inset-0 z-50 flex items-start justify-center px-4 pt-[15vh]"
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
            aria-label={locale === "ar" ? "إغلاق" : "Close"}
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Results */}
        {results.length > 0 && (
          <ul className="max-h-80 overflow-y-auto py-2">
            {results.map((result, idx) => {
              const Icon = iconMap[result.icon ?? ""] ?? Search;
              const label = typeLabels[result.type]?.[locale as "ar" | "en"] ?? result.type;
              return (
                <li key={`${result.type}-${result.id}`}>
                  <button
                    onClick={() => {
                      router.push(result.href as "/");
                      close();
                    }}
                    className={cn(
                      "command-palette-item flex w-full items-center gap-3 px-4 py-2.5 text-start transition-colors",
                      idx === selectedIndex ? "bg-teal-50" : "hover:bg-slate-50"
                    )}
                  >
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-teal-50">
                      <Icon className="h-4 w-4 text-teal-600" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-[13px] font-medium text-slate-800">
                        {result.title}
                      </p>
                      {result.subtitle && (
                        <p className="truncate text-[11px] text-slate-500">{result.subtitle}</p>
                      )}
                    </div>
                    <span
                      className={cn(
                        "rounded-md px-2 py-0.5 text-[10px] font-medium",
                        typeColors[result.type]
                      )}
                    >
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

        {/* Keyboard hints */}
        <div className="flex items-center gap-4 border-t border-slate-200/60 px-4 py-2">
          <div className="flex items-center gap-1 text-[11px] text-slate-400">
            <ArrowUp className="h-3 w-3" />
            <ArrowDown className="h-3 w-3" />
            <span>{locale === "ar" ? "للتنقل" : "navigate"}</span>
          </div>
          <div className="flex items-center gap-1 text-[11px] text-slate-400">
            <CornerDownLeft className="h-3 w-3" />
            <span>{locale === "ar" ? "للفتح" : "open"}</span>
          </div>
          <div className="flex items-center gap-1 text-[11px] text-slate-400">
            <span className="rounded border border-slate-200 px-1 font-mono text-[10px]">Esc</span>
            <span>{locale === "ar" ? "للإغلاق" : "close"}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
