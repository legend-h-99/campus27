/**
 * AI Insights Hook
 * خطاف التحليلات الذكية
 *
 * Fetches real insights from the API and manages state
 */

"use client";

import { useCallback, useEffect } from "react";
import { useAIStore } from "@/stores/ai-store";
import type { AIInsight, AIRecommendation } from "@/stores/ai-store";

interface UseAIInsightsOptions {
  locale?: string;
  autoFetch?: boolean;
}

interface UseAIInsightsReturn {
  insights: AIInsight[];
  loading: boolean;
  error: string | null;
  lastUpdated: Date | null;
  refresh: () => Promise<void>;
}

export function useAIInsights(
  options: UseAIInsightsOptions = {}
): UseAIInsightsReturn {
  const { locale = "ar", autoFetch = true } = options;

  const {
    insights,
    insightsLoading: loading,
    insightsError: error,
    insightsLastUpdated: lastUpdated,
    setInsights,
    setInsightsLoading,
    setInsightsError,
  } = useAIStore();

  const refresh = useCallback(async () => {
    setInsightsLoading(true);
    setInsightsError(null);

    try {
      const response = await fetch(`/api/ai/insights?locale=${locale}`);

      if (!response.ok) {
        throw new Error("Failed to fetch insights");
      }

      const data = await response.json();
      setInsights(data.insights || []);
    } catch (err) {
      const msg =
        err instanceof Error
          ? err.message
          : locale === "ar"
            ? "فشل تحميل التحليلات"
            : "Failed to load insights";
      setInsightsError(msg);
    }
  }, [locale, setInsights, setInsightsLoading, setInsightsError]);

  useEffect(() => {
    if (autoFetch && insights.length === 0 && !loading) {
      refresh();
    }
  }, [autoFetch, insights.length, loading, refresh]);

  return { insights, loading, error, lastUpdated, refresh };
}

// ═══ Recommendations Hook ═══

interface UseAIRecommendationsOptions {
  locale?: string;
  role?: string;
  autoFetch?: boolean;
}

interface UseAIRecommendationsReturn {
  recommendations: AIRecommendation[];
  loading: boolean;
  refresh: () => Promise<void>;
}

export function useAIRecommendations(
  options: UseAIRecommendationsOptions = {}
): UseAIRecommendationsReturn {
  const { locale = "ar", role = "dean", autoFetch = true } = options;

  const {
    recommendations,
    recommendationsLoading: loading,
    setRecommendations,
    setRecommendationsLoading,
  } = useAIStore();

  const refresh = useCallback(async () => {
    setRecommendationsLoading(true);

    try {
      const response = await fetch(
        `/api/ai/recommendations?locale=${locale}&role=${role}`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch recommendations");
      }

      const data = await response.json();
      setRecommendations(data.recommendations || []);
    } catch (err) {
      console.error("[AI Recommendations] Fetch error:", err);
      setRecommendationsLoading(false);
    }
  }, [locale, role, setRecommendations, setRecommendationsLoading]);

  useEffect(() => {
    if (autoFetch && recommendations.length === 0 && !loading) {
      refresh();
    }
  }, [autoFetch, recommendations.length, loading, refresh]);

  return { recommendations, loading, refresh };
}
