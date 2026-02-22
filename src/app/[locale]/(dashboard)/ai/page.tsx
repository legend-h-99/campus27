"use client";

import { useState, useEffect } from "react";
import { useTranslations, useLocale } from "next-intl";
import { PageHeader } from "@/components/shared/page-header";
import { StatCard } from "@/components/ui/stat-card";
import { AIInsightsPanel } from "@/components/ai/ai-insights";
import { useAIRecommendations } from "@/hooks/use-ai-insights";
import {
  Brain,
  Sparkles,
  BarChart3,
  TrendingUp,
  Target,
  Zap,
  Users,
  GraduationCap,
  AlertTriangle,
  CheckCircle2,
  Lightbulb,
  Bot,
  Loader2,
  RefreshCw,
  Shield,
} from "lucide-react";

// ---------- Static Capabilities ----------
interface Capability {
  id: string;
  titleAr: string;
  titleEn: string;
  descAr: string;
  descEn: string;
  icon: React.ElementType;
  color: string;
}

const capabilities: Capability[] = [
  {
    id: "1",
    titleAr: "التحليلات التنبؤية",
    titleEn: "Predictive Analytics",
    descAr: "توقع أداء المتدربين ومعدلات النجاح بناء على البيانات التاريخية",
    descEn: "Predict trainee performance and success rates based on historical data",
    icon: TrendingUp,
    color: "from-teal-600 to-teal-800",
  },
  {
    id: "2",
    titleAr: "نظام الإنذار المبكر",
    titleEn: "Early Warning System",
    descAr: "تنبيهات استباقية للمتدربين المعرضين للخطر الأكاديمي",
    descEn: "Proactive alerts for trainees at academic risk",
    icon: AlertTriangle,
    color: "from-amber-500 to-orange-400",
  },
  {
    id: "3",
    titleAr: "المساعد الذكي (RAG)",
    titleEn: "AI Assistant (RAG)",
    descAr: "مساعد محادثة ذكي يستخدم بيانات الكلية الحقيقية للإجابة على استفساراتك",
    descEn: "Smart chat assistant using real college data to answer your questions",
    icon: Bot,
    color: "from-aqua-600 to-teal-600",
  },
  {
    id: "4",
    titleAr: "تحليل رضا المستفيدين",
    titleEn: "Satisfaction Analysis",
    descAr: "تحليل استبيانات الرضا واستخراج الرؤى والاتجاهات",
    descEn: "Analyze satisfaction surveys and extract insights and trends",
    icon: Users,
    color: "from-mint-600 to-mint-800",
  },
  {
    id: "5",
    titleAr: "التوصيات الذكية",
    titleEn: "Smart Recommendations",
    descAr: "توصيات مخصصة مبنية على بيانات الكلية الفعلية وقواعد تحليلية ذكية",
    descEn: "Data-driven recommendations based on actual college data and smart analytics rules",
    icon: GraduationCap,
    color: "from-aqua-700 to-aqua-900",
  },
  {
    id: "6",
    titleAr: "تقارير ذكية",
    titleEn: "AI Reports",
    descAr: "إنشاء تقارير تحليلية شاملة باستخدام الذكاء الاصطناعي",
    descEn: "Generate comprehensive analytical reports using AI",
    icon: BarChart3,
    color: "from-teal-500 to-teal-700",
  },
];

// ---------- Helpers ----------
function getPriorityConfig(priority: string, isAr: boolean) {
  switch (priority) {
    case "high":
      return { label: isAr ? "أولوية عالية" : "High Priority", bg: "bg-red-100", text: "text-red-600" };
    case "medium":
      return { label: isAr ? "أولوية متوسطة" : "Medium Priority", bg: "bg-amber-100", text: "text-amber-600" };
    default:
      return { label: isAr ? "أولوية منخفضة" : "Low Priority", bg: "bg-teal-100", text: "text-teal-700" };
  }
}

// ---------- Types ----------
interface EarlyWarningData {
  totalAssessed: number;
  atRisk: number;
  criticalCount: number;
  highCount: number;
}

interface PredictionData {
  id: string;
  titleAr: string;
  titleEn: string;
  descriptionAr: string;
  descriptionEn: string;
  confidence: number;
  impact: string;
}

// ---------- Component ----------
export default function AIPage() {
  const t = useTranslations("ai");
  const locale = useLocale();
  const isAr = locale === "ar";

  // Fetch real data
  const [earlyWarning, setEarlyWarning] = useState<EarlyWarningData | null>(null);
  const [predictions, setPredictions] = useState<PredictionData[]>([]);
  const [loadingEW, setLoadingEW] = useState(true);
  const [loadingPred, setLoadingPred] = useState(true);

  const { recommendations, loading: loadingRecs, refresh: refreshRecs } = useAIRecommendations({
    locale,
    role: "dean",
    autoFetch: true,
  });

  // Fetch early warning
  useEffect(() => {
    async function fetchEW() {
      try {
        const res = await fetch(`/api/ai/early-warning?locale=${locale}`);
        if (res.ok) {
          const data = await res.json();
          setEarlyWarning(data);
        }
      } catch (e) {
        console.error("Failed to fetch early warning:", e);
      } finally {
        setLoadingEW(false);
      }
    }
    fetchEW();
  }, [locale]);

  // Fetch predictions (from the insights data since predictions are embedded)
  useEffect(() => {
    async function fetchPred() {
      try {
        const res = await fetch(`/api/ai/insights?locale=${locale}`);
        if (res.ok) {
          const data = await res.json();
          // Map insights to predictions format
          const preds = (data.insights || [])
            .filter((i: { type: string }) => i.type === "prediction" || i.type === "warning")
            .slice(0, 4)
            .map((i: { type: string; title: string; description: string; metric?: string; priority?: number }, idx: number) => ({
              id: `pred-${idx}`,
              titleAr: i.title,
              titleEn: i.title,
              descriptionAr: i.description,
              descriptionEn: i.description,
              // Derive confidence from priority: priority 1 → 95%, 2 → 88%, 3 → 80%, etc.
              confidence: Math.max(60, 100 - ((i.priority ?? 3) * 7)),
              impact: i.type === "warning" ? "high" : "medium",
            }));
          setPredictions(preds);
        }
      } catch (e) {
        console.error("Failed to fetch predictions:", e);
      } finally {
        setLoadingPred(false);
      }
    }
    fetchPred();
  }, [locale]);

  return (
    <div className="animate-fade-in space-y-4 md:space-y-6">
      {/* Page Header */}
      <PageHeader
        title={t("pageTitle")}
        description={t("pageDescription")}
        actions={
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1.5 rounded-full bg-teal-100 px-3 py-1.5 text-xs font-medium text-teal-700">
              <Sparkles className="h-3.5 w-3.5" />
              {t("aiPowered")}
            </span>
          </div>
        }
      />

      {/* AI Stat Cards - Real Data */}
      <div className="grid grid-cols-2 gap-3 md:gap-4 lg:grid-cols-4">
        <StatCard
          title={t("totalPredictions")}
          value={loadingPred ? "..." : String(predictions.length)}
          icon={Brain}
          iconColor="text-teal-600 bg-teal-100"
        />
        <StatCard
          title={t("accuracy")}
          value={predictions.length > 0 ? `${predictions[0].confidence}%` : "—"}
          icon={Target}
          iconColor="text-teal-700 bg-teal-100"
        />
        <StatCard
          title={t("recommendations")}
          value={loadingRecs ? "..." : String(recommendations.length)}
          icon={Lightbulb}
          iconColor="text-aqua-600 bg-aqua-100"
        />
        <StatCard
          title={t("alerts")}
          value={loadingEW ? "..." : String(earlyWarning?.atRisk ?? 0)}
          icon={AlertTriangle}
          iconColor="text-amber-600 bg-amber-100"
        />
      </div>

      {/* Early Warning Summary */}
      {earlyWarning && earlyWarning.atRisk > 0 && (
        <div className="glass-card border border-amber-300/30 bg-gradient-to-r from-amber-50 to-orange-50 p-4 md:p-5">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-100">
              <Shield className="h-5 w-5 text-amber-600" />
            </div>
            <div className="flex-1">
              <h3 className="text-sm font-bold text-foreground md:text-base">
                {isAr ? "نظام الإنذار المبكر" : "Early Warning System"}
              </h3>
              <p className="mt-1 text-xs text-muted md:text-sm">
                {isAr
                  ? `${earlyWarning.atRisk} متدرب معرضون للخطر الأكاديمي (${earlyWarning.criticalCount} حرج، ${earlyWarning.highCount} مرتفع) من أصل ${earlyWarning.totalAssessed} متدرب تم تقييمهم`
                  : `${earlyWarning.atRisk} trainees at academic risk (${earlyWarning.criticalCount} critical, ${earlyWarning.highCount} high) out of ${earlyWarning.totalAssessed} assessed`}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* AI Capabilities Grid */}
      <div>
        <h2 className="mb-3 flex items-center gap-2 text-base font-bold text-foreground md:mb-4 md:text-lg">
          <Zap className="h-5 w-5 text-teal-600" />
          {t("capabilities")}
        </h2>
        <div className="grid grid-cols-1 gap-3 md:gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {capabilities.map((cap) => (
            <div
              key={cap.id}
              className="glass-card group p-4 transition-all hover:shadow-md md:p-5"
            >
              <div className="mb-3 flex items-center gap-3">
                <div className={`flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br ${cap.color} transition-transform group-hover:scale-110`}>
                  <cap.icon className="h-5 w-5 text-white" />
                </div>
                <h3 className="text-sm font-semibold text-foreground md:text-base">
                  {isAr ? cap.titleAr : cap.titleEn}
                </h3>
              </div>
              <p className="text-xs leading-relaxed text-muted md:text-sm">
                {isAr ? cap.descAr : cap.descEn}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* AI Insights Panel (real data) */}
      <AIInsightsPanel />

      {/* Predictions Section */}
      {predictions.length > 0 && (
        <div>
          <h2 className="mb-3 flex items-center gap-2 text-base font-bold text-foreground md:mb-4 md:text-lg">
            <BarChart3 className="h-5 w-5 text-teal-600" />
            {t("predictiveAnalytics")}
          </h2>
          <div className="grid grid-cols-1 gap-3 md:gap-4 lg:grid-cols-2">
            {predictions.map((pred) => {
              const impactCfg = pred.impact === "high"
                ? { label: isAr ? "تأثير عالي" : "High Impact", bg: "bg-red-100", text: "text-red-600" }
                : { label: isAr ? "تأثير متوسط" : "Medium Impact", bg: "bg-amber-100", text: "text-amber-600" };
              return (
                <div
                  key={pred.id}
                  className="glass-card p-4 transition-shadow hover:shadow-md md:p-5"
                >
                  <div className="mb-3 flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-teal-100">
                        <TrendingUp className="h-5 w-5 text-teal-600" />
                      </div>
                      <div>
                        <h4 className="text-sm font-semibold text-foreground md:text-base">
                          {isAr ? pred.titleAr : pred.titleEn}
                        </h4>
                        <span className={`mt-1 inline-flex rounded-full px-2 py-0.5 text-[10px] font-medium ${impactCfg.bg} ${impactCfg.text}`}>
                          {impactCfg.label}
                        </span>
                      </div>
                    </div>
                  </div>
                  <p className="mb-3 text-xs leading-relaxed text-muted md:text-sm">
                    {isAr ? pred.descriptionAr : pred.descriptionEn}
                  </p>
                  <div className="flex items-center gap-3">
                    <div className="h-2 flex-1 rounded-full bg-background">
                      <div
                        className="h-2 rounded-full bg-gradient-to-r from-teal-500 to-aqua-500 transition-all"
                        style={{ width: `${pred.confidence}%` }}
                      />
                    </div>
                    <span className="shrink-0 text-sm font-bold text-teal-600">
                      {pred.confidence}%
                    </span>
                  </div>
                  <p className="mt-1 text-end text-[10px] text-muted">
                    {isAr ? "مستوى الثقة" : "Confidence level"}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Smart Recommendations Section (Real Data) */}
      <div>
        <div className="mb-3 flex items-center justify-between md:mb-4">
          <h2 className="flex items-center gap-2 text-base font-bold text-foreground md:text-lg">
            <Lightbulb className="h-5 w-5 text-teal-600" />
            {t("smartRecommendations")}
          </h2>
          <button
            onClick={refreshRecs}
            disabled={loadingRecs}
            className="flex items-center gap-1 rounded-lg p-1.5 text-muted transition-colors hover:bg-gray-100 disabled:opacity-50"
            aria-label={isAr ? "تحديث التوصيات" : "Refresh recommendations"}
          >
            {loadingRecs ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <RefreshCw className="h-4 w-4" />
            )}
          </button>
        </div>
        {loadingRecs ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="glass-card animate-pulse p-4 md:p-5">
                <div className="flex items-start gap-3">
                  <div className="h-10 w-10 rounded-xl bg-gray-200" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 w-2/3 rounded bg-gray-200" />
                    <div className="h-3 w-full rounded bg-gray-200" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-3 md:space-y-4">
            {recommendations.map((rec, idx) => {
              const priorityCfg = getPriorityConfig(rec.priority, isAr);
              return (
                <div
                  key={idx}
                  className="glass-card flex items-start gap-3 p-4 transition-shadow hover:shadow-md md:gap-4 md:p-5"
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-teal-100">
                    <Lightbulb className="h-5 w-5 text-teal-600" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="mb-1 flex flex-wrap items-center gap-2">
                      <h4 className="text-sm font-semibold text-foreground md:text-base">
                        {rec.title}
                      </h4>
                      <span className={`inline-flex rounded-full px-2 py-0.5 text-[10px] font-medium ${priorityCfg.bg} ${priorityCfg.text}`}>
                        {priorityCfg.label}
                      </span>
                    </div>
                    <p className="text-xs leading-relaxed text-muted md:text-sm">
                      {rec.description}
                    </p>
                    {rec.impact && (
                      <p className="mt-1 text-[10px] font-medium text-teal-600">
                        {isAr ? "التأثير المتوقع:" : "Expected impact:"} {rec.impact}
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* AI Chatbot Feature Highlight */}
      <div className="glass-card border border-teal-300 bg-gradient-to-br from-teal-50 to-aqua-50 p-5 md:p-8">
        <div className="flex flex-col items-center text-center md:flex-row md:text-start md:gap-6">
          <div className="mb-4 flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-teal-600 to-aqua-600 md:mb-0 md:h-20 md:w-20">
            <Bot className="h-8 w-8 text-white md:h-10 md:w-10" />
          </div>
          <div className="flex-1">
            <h3 className="mb-1 text-lg font-bold text-foreground md:text-xl">
              {t("aiAssistant")}
            </h3>
            <p className="mb-4 text-xs leading-relaxed text-muted md:text-sm">
              {isAr
                ? "تحدث مع المساعد الذكي للحصول على إجابات فورية مبنية على بيانات الكلية الحقيقية. المساعد يستخدم تقنية RAG لتقديم تحليلات دقيقة ومخصصة."
                : "Chat with the AI assistant for instant answers based on real college data. The assistant uses RAG technology for accurate, personalized analytics."}
            </p>
            <div className="flex flex-wrap items-center justify-center gap-2 md:justify-start">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-teal-100 px-3 py-1.5 text-xs font-medium text-teal-700">
                <BarChart3 className="h-3.5 w-3.5" />
                {isAr ? "بيانات حقيقية" : "Real Data"}
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-aqua-100 px-3 py-1.5 text-xs font-medium text-aqua-700">
                <Zap className="h-3.5 w-3.5" />
                {isAr ? "بث مباشر" : "Live Streaming"}
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-mint-100 px-3 py-1.5 text-xs font-medium text-mint-700">
                <Sparkles className="h-3.5 w-3.5" />
                {isAr ? "تحليلات ذكية" : "Smart Analytics"}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
