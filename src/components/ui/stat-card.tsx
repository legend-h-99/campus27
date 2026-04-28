"use client";

import { cn } from "@/lib/utils";
import { useLocale } from "next-intl";
import { type LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  gradient?: string;
  iconColor?: string;
  className?: string;
}

export function StatCard({
  title,
  value,
  icon: Icon,
  trend,
  gradient,
  iconColor = "text-teal-600 bg-teal-100",
  className,
}: StatCardProps) {
  const locale = useLocale();
  // Support both glass mode (no gradient) and gradient mode
  const isGlass = !gradient;

  if (isGlass) {
    return (
      <div
        className={cn(
          "stats-card group p-5",
          className
        )}
      >
        <div className="flex items-center justify-between">
          <div className="min-w-0 flex-1">
            <p className="truncate text-xs font-medium text-muted md:text-sm">{title}</p>
            <p className="mt-1.5 text-2xl font-bold tracking-tight text-foreground md:mt-2 md:text-3xl">{value}</p>
            {trend && (
              <p className="mt-2 flex flex-wrap items-center gap-1 text-xs font-medium">
                <span className={cn(
                  "inline-flex shrink-0 items-center gap-0.5 rounded-full px-2 py-0.5 text-[11px] font-semibold transition-all duration-300",
                  trend.isPositive
                    ? "bg-emerald-50 text-emerald-700"
                    : "bg-red-50 text-red-600"
                )}>
                  {trend.isPositive ? "↑" : "↓"} {trend.value}%
                </span>
                <span className="truncate text-[10px] text-muted">{locale === "ar" ? "مقارنة بالشهر الماضي" : "vs last month"}</span>
              </p>
            )}
          </div>
          <div className={cn(
            "rounded-xl p-2.5 transition-transform duration-150 group-hover:scale-105",
            iconColor
          )}>
            <Icon className="h-6 w-6 md:h-7 md:w-7" />
          </div>
        </div>
      </div>
    );
  }

  // Gradient mode with improved TVTC colors
  const gradientMap: Record<string, string> = {
    // Primary TVTC gradients
    "from-[#2D7A8F] to-[#1E5A6B]": "from-teal-600 to-teal-800",
    "from-[#28A745] to-[#1e7e34]": "from-teal-500 to-teal-700",
    "from-[#DC3545] to-[#bd2130]": "from-red-500 to-red-700",
    "from-[#FFC107] to-[#e0a800]": "from-amber-500 to-amber-600",
    // Dashboard-specific gradients (trainee/trainer)
    "from-[#667eea] to-[#764ba2]": "from-teal-600 to-teal-800",
    "from-[#f093fb] to-[#f5576c]": "from-aqua-500 to-aqua-700",
    "from-[#4facfe] to-[#00f2fe]": "from-teal-500 to-teal-600",
    "from-[#43e97b] to-[#38f9d7]": "from-mint-500 to-mint-700",
  };

  const mappedGradient = gradientMap[gradient || ""] || gradient;

  return (
    <div
      className={cn(
        "group rounded-2xl bg-gradient-to-br p-4 text-white shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-xl md:p-6",
        mappedGradient,
        className
      )}
    >
      <div className="flex items-center justify-between">
        <div className="min-w-0 flex-1">
          <p className="truncate text-xs font-semibold text-white/90 md:text-sm">{title}</p>
          <p className="mt-1.5 text-2xl font-bold text-white md:mt-2 md:text-3xl">{value}</p>
          {trend && (
            <p className="mt-2 flex items-center gap-1 text-xs font-medium text-white/90">
              <span className={cn(
                "inline-flex items-center gap-0.5 rounded-full px-2 py-0.5 text-[11px] font-bold transition-all duration-300",
                trend.isPositive ? "bg-white/20 text-white" : "bg-white/15 text-red-200"
              )}>
                {trend.isPositive ? "↑" : "↓"} {trend.value}%
              </span>
            </p>
          )}
        </div>
        <div className="rounded-2xl bg-white/20 p-3 transition-all duration-300 group-hover:scale-110 group-hover:bg-white/30 md:p-3.5">
          <Icon className="h-6 w-6 text-white md:h-7 md:w-7" />
        </div>
      </div>
    </div>
  );
}
