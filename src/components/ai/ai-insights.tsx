"use client";

import { useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import { cn } from "@/lib/utils";
import { useAIInsights } from "@/hooks/use-ai-insights";
import {
  Sparkles,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  Brain,
  Lightbulb,
  ChevronDown,
  ChevronUp,
  Zap,
  RefreshCw,
  Loader2,
  Info,
} from "lucide-react";
import type { AIInsight } from "@/stores/ai-store";

// ═══ Icon Map ═══

const typeIcons = {
  success: CheckCircle2,
  warning: AlertTriangle,
  info: Info,
  prediction: TrendingUp,
};

// ═══ Insight Card ═══

interface AIInsightCardProps {
  insight: AIInsight;
  locale: string;
}

function AIInsightCard({ insight, locale }: AIInsightCardProps) {
  const [expanded, setExpanded] = useState(false);
  const isAr = locale === "ar";

  const typeStyles = {
    success: "border-teal-700/20 bg-teal-50",
    warning: "border-amber-600/20 bg-amber-50",
    info: "border-aqua-600/20 bg-aqua-50",
    prediction: "border-teal-500/20 bg-teal-50",
  };

  const iconStyles = {
    success: "text-teal-700 bg-teal-100",
    warning: "text-amber-600 bg-amber-100",
    info: "text-aqua-600 bg-aqua-100",
    prediction: "text-teal-600 bg-teal-100",
  };

  const metricStyles = {
    success: "text-teal-700",
    warning: "text-amber-600",
    info: "text-aqua-600",
    prediction: "text-teal-600",
  };

  const IconComponent = typeIcons[insight.type] || Info;

  return (
    <div
      className={cn(
        "rounded-xl border p-3 transition-all hover:shadow-sm md:p-4",
        typeStyles[insight.type]
      )}
    >
      <div className="flex items-start gap-3">
        <div
          className={cn("shrink-0 rounded-lg p-2", iconStyles[insight.type])}
        >
          <IconComponent className="h-4 w-4 md:h-5 md:w-5" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <h4 className="text-sm font-semibold text-foreground md:text-base">
              {insight.title}
            </h4>
            {insight.metric && (
              <span
                className={cn(
                  "shrink-0 text-lg font-bold md:text-xl",
                  metricStyles[insight.type]
                )}
              >
                {insight.metric}
              </span>
            )}
          </div>
          <p
            className={cn(
              "mt-1 text-xs text-muted transition-all md:text-sm",
              !expanded && "line-clamp-2"
            )}
          >
            {insight.description}
          </p>
          {insight.description.length > 80 && (
            <button
              onClick={() => setExpanded(!expanded)}
              className="mt-1.5 flex items-center gap-1 text-[11px] font-medium text-teal-600 hover:text-teal-700 md:text-xs"
            >
              {expanded
                ? isAr
                  ? "عرض أقل"
                  : "Show less"
                : isAr
                  ? "عرض المزيد"
                  : "Show more"}
              {expanded ? (
                <ChevronUp className="h-3 w-3" />
              ) : (
                <ChevronDown className="h-3 w-3" />
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// ═══ Loading Skeleton ═══

function InsightSkeleton() {
  return (
    <div className="animate-pulse rounded-xl border border-gray-200 bg-gray-50 p-3 md:p-4">
      <div className="flex items-start gap-3">
        <div className="h-9 w-9 rounded-lg bg-gray-200" />
        <div className="flex-1 space-y-2">
          <div className="h-4 w-3/4 rounded bg-gray-200" />
          <div className="h-3 w-full rounded bg-gray-200" />
          <div className="h-3 w-2/3 rounded bg-gray-200" />
        </div>
      </div>
    </div>
  );
}

// ═══ Main Panel ═══

export function AIInsightsPanel() {
  const t = useTranslations("ai");
  const locale = useLocale();
  const [isVisible, setIsVisible] = useState(true);

  const { insights, loading, error, lastUpdated, refresh } = useAIInsights({
    locale,
    autoFetch: true,
  });

  if (!isVisible) return null;

  return (
    <div className="rounded-2xl border border-teal-500/10 bg-gradient-to-br from-white to-teal-600/[0.02] p-4 shadow-sm md:p-6">
      {/* Header */}
      <div className="mb-4 flex items-center justify-between md:mb-5">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-teal-600 to-aqua-600 md:h-10 md:w-10">
            <Brain className="h-5 w-5 text-white md:h-6 md:w-6" />
          </div>
          <div>
            <h3 className="text-base font-bold text-foreground md:text-lg">
              {t("insightsTitle")}
            </h3>
            <p className="text-[10px] text-muted md:text-xs">
              {t("insightsSubtitle")}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1.5">
          <button
            onClick={refresh}
            disabled={loading}
            className="flex items-center gap-1 rounded-lg p-1.5 text-muted transition-colors hover:bg-gray-100 hover:text-foreground disabled:opacity-50"
            title={locale === "ar" ? "تحديث" : "Refresh"}
            aria-label={locale === "ar" ? "تحديث التحليلات" : "Refresh insights"}
          >
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <RefreshCw className="h-4 w-4" />
            )}
          </button>
          <span className="flex items-center gap-1 rounded-full bg-teal-100 px-2.5 py-1 text-[10px] font-medium text-teal-600 md:text-xs">
            <Sparkles className="h-3 w-3" />
            {t("aiPowered")}
          </span>
        </div>
      </div>

      {/* Error State */}
      {error && (
        <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3">
          <p className="text-xs text-red-600">{error}</p>
        </div>
      )}

      {/* Insights Grid */}
      <div className="space-y-3">
        {loading && insights.length === 0 ? (
          <>
            <InsightSkeleton />
            <InsightSkeleton />
            <InsightSkeleton />
          </>
        ) : insights.length > 0 ? (
          insights.map((insight, index) => (
            <AIInsightCard
              key={`insight-${index}`}
              insight={insight}
              locale={locale}
            />
          ))
        ) : (
          <div className="py-8 text-center">
            <Lightbulb className="mx-auto mb-2 h-8 w-8 text-muted" />
            <p className="text-sm text-muted">
              {locale === "ar"
                ? "لا تتوفر تحليلات حاليًا. يرجى المحاولة لاحقًا."
                : "No insights available. Please try again later."}
            </p>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="mt-4 flex items-center justify-between border-t border-border/50 pt-3 md:mt-5 md:pt-4">
        <p className="text-[10px] text-muted md:text-xs">
          {t("lastUpdated")}:{" "}
          {lastUpdated
            ? lastUpdated.toLocaleTimeString(
                locale === "ar" ? "ar-SA" : "en-US"
              )
            : locale === "ar"
              ? "غير متوفر"
              : "N/A"}
        </p>
        <button
          onClick={refresh}
          className="flex items-center gap-1.5 text-xs font-medium text-teal-600 hover:text-teal-700"
        >
          <Zap className="h-3.5 w-3.5" />
          {t("viewAllInsights")}
        </button>
      </div>
    </div>
  );
}

// ═══ Compact prediction badge ═══

export function AIPredictionBadge({
  prediction,
  className,
}: {
  prediction: string;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex items-center gap-1 rounded-full bg-aqua-100 px-2 py-0.5 text-[10px] font-medium text-aqua-600",
        className
      )}
    >
      <Sparkles className="h-2.5 w-2.5" />
      <span>{prediction}</span>
    </div>
  );
}

// ═══ Smart suggestion banner ═══

export function AISmartBanner() {
  const t = useTranslations("ai");
  const locale = useLocale();
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  return (
    <div className="mb-4 flex items-center gap-3 rounded-xl border border-aqua-600/20 bg-gradient-to-r from-aqua-600/5 to-teal-600/5 p-3 md:mb-6 md:p-4">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-aqua-100">
        <Lightbulb className="h-5 w-5 text-aqua-600" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-xs font-semibold text-foreground md:text-sm">
          {t("smartSuggestionTitle")}
        </p>
        <p className="mt-0.5 text-[10px] text-muted md:text-xs">
          {t("smartSuggestionDesc")}
        </p>
      </div>
      <button
        onClick={() => setDismissed(true)}
        className="shrink-0 text-xs font-medium text-muted hover:text-foreground"
      >
        {locale === "ar" ? "إخفاء" : "Dismiss"}
      </button>
    </div>
  );
}
