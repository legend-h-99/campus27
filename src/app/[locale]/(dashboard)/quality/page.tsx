"use client";

import { useTranslations } from "next-intl";
import { PageHeader } from "@/components/shared/page-header";
import { StatCard } from "@/components/ui/stat-card";
import { useState, useEffect, useCallback } from "react";
import {
  Award,
  Target,
  TrendingUp,
  ClipboardCheck,
  ShieldCheck,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Plus,
  BarChart3,
  FileText,
  Users,
  Calendar,
  FolderOpen,
  Star,
  Search,
  Sparkles,
  RefreshCw,
  ChevronDown,
  ChevronUp,
  BookOpen,
  ListChecks,
  MessageSquare,
} from "lucide-react";
import type {
  QualityTab,
  QualityDashboardData,
  QualityKpi,
  KpiMeasurement,
  QualityStandard,
  QualityAudit,
  AuditFinding,
  ImprovementPlan,
  QualitySurvey,
  QualityReport,
  QualityDocument,
  QualityMeeting,
  Accreditation,
  KpiMeasurementStatus,
  FindingSeverity,
  FindingStatus,
} from "@/types/quality";

// ============== Tab Configuration ==============

const TABS: { key: QualityTab; icon: typeof Target }[] = [
  { key: "dashboard", icon: BarChart3 },
  { key: "kpis", icon: Target },
  { key: "standards", icon: BookOpen },
  { key: "audits", icon: ClipboardCheck },
  { key: "findings", icon: AlertTriangle },
  { key: "plans", icon: ListChecks },
  { key: "surveys", icon: MessageSquare },
  { key: "reports", icon: FileText },
  { key: "documents", icon: FolderOpen },
  { key: "accreditations", icon: Award },
];

// ============== Status Helpers ==============

const kpiStatusConfig: Record<KpiMeasurementStatus, { color: string; bg: string }> = {
  EXCEEDS: { color: "text-teal-700", bg: "bg-teal-100" },
  MEETS: { color: "text-green-700", bg: "bg-green-100" },
  BELOW: { color: "text-amber-600", bg: "bg-amber-100" },
  CRITICAL: { color: "text-red-600", bg: "bg-red-100" },
};

const severityConfig: Record<string, { color: string; bg: string }> = {
  CRITICAL: { color: "text-red-700", bg: "bg-red-100" },
  MAJOR: { color: "text-orange-700", bg: "bg-orange-100" },
  MINOR: { color: "text-amber-600", bg: "bg-amber-100" },
  OBSERVATION: { color: "text-slate-600", bg: "bg-slate-100" },
};

const findingStatusConfig: Record<FindingStatus, { color: string; bg: string }> = {
  OPEN: { color: "text-red-600", bg: "bg-red-100" },
  IN_PROGRESS: { color: "text-amber-600", bg: "bg-amber-100" },
  RESOLVED: { color: "text-teal-700", bg: "bg-teal-100" },
  CLOSED: { color: "text-slate-600", bg: "bg-slate-100" },
};

// ============== Status Mapping Helpers ==============

/** Map DB accreditation status to i18n key */
function mapAccreditationStatus(dbStatus: string): string {
  const map: Record<string, string> = {
    ACCREDITATION_ACTIVE: "active",
    EXPIRED: "expired",
    UNDER_RENEWAL: "pending",
    SUSPENDED: "suspended",
  };
  return map[dbStatus] || dbStatus.toLowerCase();
}

/** Map DB survey status to i18n key (strip SURVEY_ prefix) */
function mapSurveyStatus(dbStatus: string): string {
  return dbStatus.replace(/^SURVEY_/, "").toLowerCase();
}

/** Map DB plan status to i18n key (strip IP_ prefix) */
function mapPlanStatus(dbStatus: string): string {
  return dbStatus.replace(/^IP_/, "").toLowerCase();
}

/** Map DB report status to i18n key */
function mapReportStatus(dbStatus: string): string {
  const map: Record<string, string> = {
    REPORT_DRAFT: "draft",
    UNDER_REVIEW: "under_review",
    REPORT_APPROVED: "approved",
    PUBLISHED: "published",
  };
  return map[dbStatus] || dbStatus.toLowerCase();
}

/** Map DB document status to i18n key (strip DOC_ prefix) */
function mapDocStatus(dbStatus: string): string {
  return dbStatus.replace(/^DOC_/, "").toLowerCase();
}

// ============== Main Component ==============

export default function QualityPage() {
  const t = useTranslations("quality");
  const [activeTab, setActiveTab] = useState<QualityTab>("dashboard");
  const [loading, setLoading] = useState(true);

  // Data state
  const [dashboardData, setDashboardData] = useState<QualityDashboardData | null>(null);
  const [kpis, setKpis] = useState<QualityKpi[]>([]);
  const [standards, setStandards] = useState<QualityStandard[]>([]);
  const [audits, setAudits] = useState<QualityAudit[]>([]);
  const [findings, setFindings] = useState<AuditFinding[]>([]);
  const [plans, setPlans] = useState<ImprovementPlan[]>([]);
  const [surveys, setSurveys] = useState<QualitySurvey[]>([]);
  const [reports, setReports] = useState<QualityReport[]>([]);
  const [documents, setDocuments] = useState<QualityDocument[]>([]);
  const [meetings, setMeetings] = useState<QualityMeeting[]>([]);
  const [accreditations, setAccreditations] = useState<Accreditation[]>([]);

  // Fetch dashboard data and transform to expected shape
  const fetchDashboard = useCallback(async () => {
    try {
      const res = await fetch("/api/quality");
      const json = await res.json();
      if (json.success) {
        const raw = json.data;
        // Transform kpiStatusCounts array → kpiSummary object
        const kpiSummary = { total: 0, exceeds: 0, meets: 0, below: 0, critical: 0 };
        for (const item of raw.kpiStatusCounts || []) {
          const count = item._count?.status || 0;
          kpiSummary.total += count;
          if (item.status === "EXCEEDS") kpiSummary.exceeds = count;
          else if (item.status === "MEETS") kpiSummary.meets = count;
          else if (item.status === "BELOW") kpiSummary.below = count;
          else if (item.status === "CRITICAL") kpiSummary.critical = count;
        }
        // If no measurements exist, show total KPIs as 0
        // Transform openFindingsBySeverity array → openFindings object
        const openFindings = { total: 0, critical: 0, major: 0, minor: 0 };
        for (const item of raw.openFindingsBySeverity || []) {
          const count = item._count?.severity || 0;
          openFindings.total += count;
          if (item.severity === "CRITICAL") openFindings.critical = count;
          else if (item.severity === "MAJOR") openFindings.major = count;
          else if (item.severity === "MINOR") openFindings.minor = count;
        }
        // Transform improvementPlans → improvementSummary
        const improvementSummary = { total: 0, inProgress: 0, completed: 0, avgProgress: raw.improvementPlans?.avgProgress || 0 };
        for (const item of raw.improvementPlans?.byStatus || []) {
          const count = item._count?.status || 0;
          improvementSummary.total += count;
          if (item.status === "IP_IN_PROGRESS") improvementSummary.inProgress = count;
          else if (item.status === "IP_COMPLETED") improvementSummary.completed = count;
        }

        setDashboardData({
          kpiSummary,
          openFindings,
          improvementSummary,
          recentAudits: raw.recentAudits || [],
          accreditations: raw.activeAccreditations || [],
        });
      }
    } catch {
      /* ignore */
    }
  }, []);

  // Fetch tab-specific data
  const fetchTabData = useCallback(async (tab: QualityTab) => {
    setLoading(true);
    try {
      const endpoints: Record<string, string> = {
        kpis: "/api/quality/kpis",
        standards: "/api/quality/standards",
        audits: "/api/quality/audits",
        findings: "/api/quality/audits?findingsOnly=true",
        plans: "/api/quality/improvement-plans",
        surveys: "/api/quality/surveys",
        reports: "/api/quality/reports",
        documents: "/api/quality/documents",
        accreditations: "/api/quality/accreditations",
      };

      if (tab === "dashboard") {
        await fetchDashboard();
      } else if (tab === "findings") {
        // Fetch all findings across audits (include findings in response)
        const res = await fetch("/api/quality/audits?include_findings=true");
        const json = await res.json();
        if (json.success) {
          const allFindings: AuditFinding[] = [];
          for (const audit of json.data || []) {
            if (audit.findings) {
              allFindings.push(...audit.findings.map((f: AuditFinding) => ({ ...f, audit: { titleAr: audit.titleAr } })));
            }
          }
          setFindings(allFindings);
        }
      } else {
        const endpoint = endpoints[tab];
        if (endpoint) {
          const res = await fetch(endpoint);
          const json = await res.json();
          if (json.success) {
            const data = json.data;
            switch (tab) {
              case "kpis": setKpis(data); break;
              case "standards": setStandards(data); break;
              case "audits": setAudits(data); break;
              case "plans": setPlans(data); break;
              case "surveys": setSurveys(data); break;
              case "reports": setReports(data); break;
              case "documents": setDocuments(data); break;
              case "accreditations": setAccreditations(data); break;
            }
          }
        }
      }
    } catch {
      /* ignore */
    } finally {
      setLoading(false);
    }
  }, [fetchDashboard]);

  useEffect(() => {
    fetchTabData(activeTab);
  }, [activeTab, fetchTabData]);

  return (
    <div className="animate-fade-in space-y-4 md:space-y-6">
      <PageHeader
        title={t("title")}
        description={t("description")}
      />

      {/* Tab Navigation */}
      <div className="scrollbar-hide flex gap-1 overflow-x-auto rounded-xl bg-white/60 p-1 backdrop-blur-sm">
        {TABS.map(({ key, icon: Icon }) => (
          <button
            key={key}
            onClick={() => setActiveTab(key)}
            className={`flex shrink-0 items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-medium transition-all sm:text-sm ${
              activeTab === key
                ? "bg-gradient-to-r from-teal-600 to-aqua-600 text-white shadow-sm"
                : "text-muted hover:bg-teal-50 hover:text-teal-700"
            }`}
          >
            <Icon className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
            <span className="hidden xs:inline">{t(`tabs.${key}`)}</span>
          </button>
        ))}
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex items-center justify-center py-12">
          <RefreshCw className="h-6 w-6 animate-spin text-teal-600" />
        </div>
      )}

      {/* Tab Content */}
      {!loading && (
        <>
          {activeTab === "dashboard" && <DashboardTab data={dashboardData} t={t} />}
          {activeTab === "kpis" && <KpisTab kpis={kpis} t={t} />}
          {activeTab === "standards" && <StandardsTab standards={standards} t={t} />}
          {activeTab === "audits" && <AuditsTab audits={audits} t={t} />}
          {activeTab === "findings" && <FindingsTab findings={findings} t={t} />}
          {activeTab === "plans" && <PlansTab plans={plans} t={t} />}
          {activeTab === "surveys" && <SurveysTab surveys={surveys} t={t} />}
          {activeTab === "reports" && <ReportsTab reports={reports} t={t} />}
          {activeTab === "documents" && <DocumentsTab documents={documents} t={t} />}
          {activeTab === "accreditations" && <AccreditationsTab accreditations={accreditations} t={t} />}
        </>
      )}
    </div>
  );
}

// ============== Dashboard Tab ==============

function DashboardTab({ data, t }: { data: QualityDashboardData | null; t: ReturnType<typeof useTranslations> }) {
  if (!data) {
    return <EmptyState message={t("common.noData")} />;
  }

  const { kpiSummary, openFindings, improvementSummary, recentAudits, accreditations } = data;

  return (
    <div className="space-y-4 md:space-y-6">
      {/* KPI Summary Stats */}
      <div className="grid grid-cols-2 gap-3 md:gap-4 lg:grid-cols-5">
        <StatCard title={t("dashboard.totalKpis")} value={kpiSummary.total} icon={Target} iconColor="text-teal-600 bg-teal-100" />
        <StatCard title={t("kpis.statuses.exceeds")} value={kpiSummary.exceeds} icon={CheckCircle2} iconColor="text-teal-700 bg-teal-100" />
        <StatCard title={t("kpis.statuses.meets")} value={kpiSummary.meets} icon={TrendingUp} iconColor="text-green-700 bg-green-100" />
        <StatCard title={t("kpis.statuses.below")} value={kpiSummary.below} icon={AlertTriangle} iconColor="text-amber-600 bg-amber-100" />
        <StatCard title={t("kpis.statuses.critical")} value={kpiSummary.critical} icon={XCircle} iconColor="text-red-600 bg-red-100" />
      </div>

      <div className="grid grid-cols-1 gap-4 md:gap-6 lg:grid-cols-2">
        {/* Open Findings */}
        <div className="glass-card p-4 md:p-6">
          <h3 className="mb-3 flex items-center gap-2 text-base font-semibold text-foreground md:text-lg">
            <AlertTriangle className="h-5 w-5 text-amber-600" />
            {t("dashboard.openFindings")}
          </h3>
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: t("findings.severities.critical"), count: openFindings.critical, color: "text-red-600 bg-red-50" },
              { label: t("findings.severities.major"), count: openFindings.major, color: "text-orange-600 bg-orange-50" },
              { label: t("findings.severities.minor"), count: openFindings.minor, color: "text-amber-600 bg-amber-50" },
              { label: t("dashboard.total"), count: openFindings.total, color: "text-slate-700 bg-slate-50" },
            ].map((item, i) => (
              <div key={i} className={`rounded-xl p-3 ${item.color.split(" ")[1]}`}>
                <p className="text-2xl font-bold">{item.count}</p>
                <p className="text-xs text-muted">{item.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Improvement Plans Summary */}
        <div className="glass-card p-4 md:p-6">
          <h3 className="mb-3 flex items-center gap-2 text-base font-semibold text-foreground md:text-lg">
            <ListChecks className="h-5 w-5 text-teal-600" />
            {t("tabs.plans")}
          </h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted">{t("dashboard.total")}</span>
              <span className="font-semibold">{improvementSummary.total}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted">{t("plans.statuses.in_progress")}</span>
              <span className="font-semibold text-aqua-600">{improvementSummary.inProgress}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted">{t("plans.statuses.completed")}</span>
              <span className="font-semibold text-teal-700">{improvementSummary.completed}</span>
            </div>
            <div className="mt-2">
              <div className="mb-1 flex items-center justify-between text-xs text-muted">
                <span>{t("dashboard.avgProgress")}</span>
                <span>{Math.round(improvementSummary.avgProgress)}%</span>
              </div>
              <div className="h-2.5 w-full rounded-full bg-slate-200" role="progressbar" aria-valuenow={Math.round(improvementSummary.avgProgress)} aria-valuemin={0} aria-valuemax={100} aria-label={t("dashboard.avgProgress")}>
                <div
                  className="h-2.5 rounded-full bg-gradient-to-r from-teal-500 to-aqua-500"
                  style={{ width: `${Math.min(improvementSummary.avgProgress, 100)}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Audits & Accreditations */}
      <div className="grid grid-cols-1 gap-4 md:gap-6 lg:grid-cols-2">
        {/* Recent Audits */}
        <div className="glass-card p-4 md:p-6">
          <h3 className="mb-3 flex items-center gap-2 text-base font-semibold text-foreground md:text-lg">
            <ClipboardCheck className="h-5 w-5 text-teal-600" />
            {t("dashboard.recentAudits")}
          </h3>
          <div className="space-y-2">
            {(recentAudits || []).length === 0 ? (
              <p className="py-4 text-center text-sm text-muted">{t("common.noData")}</p>
            ) : (
              recentAudits.map((audit) => (
                <div key={audit.id} className="flex items-center justify-between rounded-lg bg-white/40 p-3 backdrop-blur-sm">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-foreground">{audit.titleAr}</p>
                    <p className="text-xs text-muted">
                      {audit.scheduledDate ? new Date(audit.scheduledDate).toLocaleDateString("ar-SA") : "—"}
                    </p>
                  </div>
                  <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                    audit.status === "COMPLETED" ? "bg-teal-100 text-teal-700" :
                    audit.status === "IN_PROGRESS" ? "bg-amber-100 text-amber-600" :
                    "bg-slate-100 text-slate-600"
                  }`}>
                    {t(`audits.statuses.${audit.status.toLowerCase()}`)}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Accreditations */}
        <div className="glass-card p-4 md:p-6">
          <h3 className="mb-3 flex items-center gap-2 text-base font-semibold text-foreground md:text-lg">
            <ShieldCheck className="h-5 w-5 text-teal-600" />
            {t("tabs.accreditations")}
          </h3>
          <div className="space-y-3">
            {(accreditations || []).map((acc) => (
              <div key={acc.id} className="flex items-center gap-3 rounded-lg border border-border p-3">
                <div className={`rounded-lg p-2 ${
                  acc.status === "ACCREDITATION_ACTIVE" ? "bg-teal-100" : "bg-amber-100"
                }`}>
                  <Award className={`h-4 w-4 ${
                    acc.status === "ACCREDITATION_ACTIVE" ? "text-teal-600" : "text-amber-600"
                  }`} />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-foreground">{acc.accreditingBody || acc.notes}</p>
                  <p className="text-xs text-muted">
                    {acc.expiryDate ? `${t("accreditations.expiryDate")}: ${new Date(acc.expiryDate).toLocaleDateString("ar-SA")}` : "—"}
                  </p>
                </div>
                <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                  acc.status === "ACCREDITATION_ACTIVE" ? "bg-teal-100 text-teal-700" :
                  acc.status === "UNDER_RENEWAL" ? "bg-amber-100 text-amber-600" :
                  "bg-red-100 text-red-600"
                }`}>
                  {t(`accreditations.statuses.${mapAccreditationStatus(acc.status)}`)}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ============== KPIs Tab ==============

function KpisTab({ kpis, t }: { kpis: QualityKpi[]; t: ReturnType<typeof useTranslations> }) {
  const [aiAnalysis, setAiAnalysis] = useState<string | null>(null);
  const [analyzing, setAnalyzing] = useState(false);

  const handleAiAnalysis = async () => {
    setAnalyzing(true);
    try {
      const res = await fetch("/api/quality/ai/analyze-kpis", { method: "POST" });
      const json = await res.json();
      if (json.success) setAiAnalysis(json.data.analysis);
    } catch { /* ignore */ } finally {
      setAnalyzing(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* AI Analysis Button */}
      <div className="flex justify-end">
        <button
          onClick={handleAiAnalysis}
          disabled={analyzing}
          className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-purple-600 to-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition-opacity hover:opacity-90 disabled:opacity-50"
        >
          <Sparkles className={`h-4 w-4 ${analyzing ? "animate-spin" : ""}`} />
          {t("actions.analyze")}
        </button>
      </div>

      {/* AI Analysis Result */}
      {aiAnalysis && (
        <div className="glass-card border-l-4 border-purple-500 p-4 md:p-6">
          <h4 className="mb-2 flex items-center gap-2 font-semibold text-purple-700">
            <Sparkles className="h-4 w-4" />
            {t("kpis.aiAnalysis")}
          </h4>
          <div className="whitespace-pre-wrap text-sm leading-relaxed text-foreground">{aiAnalysis}</div>
        </div>
      )}

      {/* KPI Cards */}
      <div className="grid grid-cols-1 gap-3 md:gap-4 lg:grid-cols-2 xl:grid-cols-3">
        {kpis.length === 0 ? (
          <div className="col-span-full">
            <EmptyState message={t("common.noData")} />
          </div>
        ) : (
          kpis.map((kpi) => {
            const latest = kpi.latestMeasurement;
            const status = latest?.status || "BELOW";
            const config = kpiStatusConfig[status as KpiMeasurementStatus] || kpiStatusConfig.BELOW;
            const achievementRate = latest?.achievementRate || 0;
            const progress = Math.min(achievementRate, 100);

            return (
              <div key={kpi.id} className="glass-card p-4 transition-shadow hover:shadow-md md:p-5">
                <div className="mb-3 flex items-start justify-between">
                  <div className="flex-1">
                    <span className="rounded-full bg-teal-100 px-2.5 py-0.5 text-xs font-medium text-teal-700">
                      {kpi.kpiCode}
                    </span>
                    <h4 className="mt-2 text-sm font-semibold text-foreground">{kpi.nameAr}</h4>
                    {kpi.standard && (
                      <p className="mt-0.5 text-xs text-muted">{kpi.standard.nameAr}</p>
                    )}
                  </div>
                  <span className={`flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium ${config.bg} ${config.color}`}>
                    {t(`kpis.statuses.${status.toLowerCase()}`)}
                  </span>
                </div>

                <div className="mb-3 flex items-end justify-between">
                  <div>
                    <p className="text-xs text-muted">{t("kpis.actualValue")}</p>
                    <p className="text-2xl font-bold text-foreground">
                      {latest?.actualValue?.toFixed(1) || "—"}{kpi.measurementUnit ? ` ${kpi.measurementUnit}` : ""}
                    </p>
                  </div>
                  <div className="text-end">
                    <p className="text-xs text-muted">{t("kpis.targetValue")}</p>
                    <p className="text-lg font-semibold text-muted">
                      {kpi.targetValue}{kpi.measurementUnit ? ` ${kpi.measurementUnit}` : ""}
                    </p>
                  </div>
                </div>

                <div className="mb-2 h-2 w-full rounded-full bg-background">
                  <div
                    className={`h-2 rounded-full transition-all ${
                      status === "EXCEEDS" || status === "MEETS" ? "bg-teal-500" :
                      status === "BELOW" ? "bg-amber-400" : "bg-red-500"
                    }`}
                    style={{ width: `${progress}%` }}
                  />
                </div>

                <div className="flex items-center justify-between text-xs text-muted">
                  <span>{t("standards.achievementRate")}: {achievementRate.toFixed(1)}%</span>
                  <span>{t(`kpis.frequencies.${kpi.frequency.toLowerCase()}`)}</span>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

// ============== Standards Tab ==============

function StandardsTab({ standards, t }: { standards: QualityStandard[]; t: ReturnType<typeof useTranslations> }) {
  const categoryColors: Record<string, string> = {
    INSTITUTIONAL: "bg-blue-100 text-blue-700",
    ACADEMIC: "bg-teal-100 text-teal-700",
    PROGRAM: "bg-purple-100 text-purple-700",
    LEARNING_OUTCOMES: "bg-amber-100 text-amber-700",
  };

  return (
    <div className="space-y-3">
      {standards.length === 0 ? (
        <EmptyState message={t("common.noData")} />
      ) : (
        standards.map((std) => (
          <div key={std.id} className="glass-card p-4 md:p-5">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="mb-2 flex items-center gap-2">
                  <span className="rounded bg-teal-600 px-2 py-0.5 text-xs font-bold text-white">
                    {std.standardCode}
                  </span>
                  <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${categoryColors[std.category] || "bg-slate-100 text-slate-600"}`}>
                    {t(`standards.categories.${std.category.toLowerCase()}`)}
                  </span>
                </div>
                <h4 className="text-base font-semibold text-foreground">{std.nameAr}</h4>
                {std.nameEn && <p className="text-sm text-muted">{std.nameEn}</p>}
                {std.descriptionAr && <p className="mt-1 text-sm text-muted">{std.descriptionAr}</p>}
              </div>
              <div className="text-end">
                {std.weight && (
                  <div>
                    <p className="text-xs text-muted">{t("standards.weight")}</p>
                    <p className="text-lg font-bold text-teal-600">{std.weight}%</p>
                  </div>
                )}
                {std.ncaaaVersion && (
                  <p className="mt-1 text-xs text-muted">NCAAA v{std.ncaaaVersion}</p>
                )}
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
}

// ============== Audits Tab ==============

function AuditsTab({ audits, t }: { audits: QualityAudit[]; t: ReturnType<typeof useTranslations> }) {
  const typeColors: Record<string, string> = {
    INTERNAL: "bg-blue-100 text-blue-700",
    EXTERNAL: "bg-purple-100 text-purple-700",
    PROGRAM_REVIEW: "bg-teal-100 text-teal-700",
    COURSE_REVIEW: "bg-amber-100 text-amber-700",
    SELF_ASSESSMENT: "bg-green-100 text-green-700",
  };

  return (
    <div className="space-y-3">
      {audits.length === 0 ? (
        <EmptyState message={t("common.noData")} />
      ) : (
        audits.map((audit) => (
          <div key={audit.id} className="glass-card p-4 md:p-5">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="mb-2 flex flex-wrap items-center gap-2">
                  <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${typeColors[audit.auditType] || "bg-slate-100"}`}>
                    {t(`audits.types.${audit.auditType.toLowerCase()}`)}
                  </span>
                  <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
                    audit.status === "COMPLETED" ? "bg-teal-100 text-teal-700" :
                    audit.status === "IN_PROGRESS" ? "bg-amber-100 text-amber-600" :
                    audit.status === "CANCELLED" ? "bg-red-100 text-red-600" :
                    "bg-slate-100 text-slate-600"
                  }`}>
                    {t(`audits.statuses.${audit.status.toLowerCase()}`)}
                  </span>
                  {audit.overallRating && (
                    <span className="flex items-center gap-1 rounded-full bg-yellow-100 px-2.5 py-0.5 text-xs font-medium text-yellow-700">
                      <Star className="h-3 w-3" />
                      {t(`audits.ratings.${audit.overallRating.toLowerCase()}`)}
                    </span>
                  )}
                </div>
                <h4 className="text-sm font-semibold text-foreground">{audit.titleAr}</h4>
                {audit.leadAuditor && (
                  <p className="mt-1 text-xs text-muted">
                    {t("audits.leadAuditor")}: {audit.leadAuditor.fullNameAr}
                  </p>
                )}
              </div>
              <div className="text-end">
                <p className="text-xs text-muted">
                  {audit.scheduledDate ? new Date(audit.scheduledDate).toLocaleDateString("ar-SA") : "—"}
                </p>
                {audit._count && (
                  <p className="mt-1 text-xs text-muted">
                    {audit._count.findings} {t("audits.findingsCount")}
                  </p>
                )}
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
}

// ============== Findings Tab ==============

function FindingsTab({ findings, t }: { findings: AuditFinding[]; t: ReturnType<typeof useTranslations> }) {
  const [filter, setFilter] = useState<string>("all");

  const filtered = filter === "all" ? findings : findings.filter((f) => f.status === filter);

  return (
    <div className="space-y-4">
      {/* Filter */}
      <div className="flex flex-wrap gap-2">
        {["all", "OPEN", "IN_PROGRESS", "RESOLVED", "CLOSED"].map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-all ${
              filter === s
                ? "bg-teal-600 text-white"
                : "bg-white/60 text-muted hover:bg-teal-50"
            }`}
          >
            {s === "all" ? t("common.all") : t(`findings.statuses.${s.toLowerCase()}`)}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <EmptyState message={t("common.noData")} />
      ) : (
        <div className="space-y-3">
          {filtered.map((finding) => {
            const sevConfig = severityConfig[finding.severity || "OBSERVATION"] || severityConfig.OBSERVATION;
            const statusConf = findingStatusConfig[finding.status] || findingStatusConfig.OPEN;

            return (
              <div key={finding.id} className="glass-card p-4 md:p-5">
                <div className="mb-2 flex flex-wrap items-center gap-2">
                  <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                    finding.findingType === "STRENGTH" ? "bg-green-100 text-green-700" :
                    finding.findingType === "WEAKNESS" ? "bg-red-100 text-red-700" :
                    finding.findingType === "OPPORTUNITY" ? "bg-blue-100 text-blue-700" :
                    finding.findingType === "THREAT" ? "bg-orange-100 text-orange-700" :
                    "bg-red-200 text-red-800"
                  }`}>
                    {t(`findings.types.${finding.findingType.toLowerCase()}`)}
                  </span>
                  {finding.severity && (
                    <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${sevConfig.bg} ${sevConfig.color}`}>
                      {t(`findings.severities.${finding.severity.toLowerCase()}`)}
                    </span>
                  )}
                  <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${statusConf.bg} ${statusConf.color}`}>
                    {t(`findings.statuses.${finding.status.toLowerCase()}`)}
                  </span>
                </div>
                <p className="text-sm text-foreground">{finding.descriptionAr}</p>
                {finding.recommendationAr && (
                  <p className="mt-2 text-xs text-teal-700">
                    <strong>{t("findings.recommendation")}:</strong> {finding.recommendationAr}
                  </p>
                )}
                <div className="mt-2 flex items-center gap-4 text-xs text-muted">
                  {finding.standard && <span>{finding.standard.standardCode} - {finding.standard.nameAr}</span>}
                  {finding.dueDate && <span>{t("plans.dueDate")}: {new Date(finding.dueDate).toLocaleDateString("ar-SA")}</span>}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ============== Plans Tab ==============

function PlansTab({ plans, t }: { plans: ImprovementPlan[]; t: ReturnType<typeof useTranslations> }) {
  const [expandedPlan, setExpandedPlan] = useState<string | null>(null);

  const typeColors: Record<string, string> = {
    CORRECTIVE: "bg-red-100 text-red-700",
    PREVENTIVE: "bg-blue-100 text-blue-700",
    ENHANCEMENT: "bg-green-100 text-green-700",
  };

  return (
    <div className="space-y-3">
      {plans.length === 0 ? (
        <EmptyState message={t("common.noData")} />
      ) : (
        plans.map((plan) => (
          <div key={plan.id} className="glass-card p-4 md:p-5">
            <div
              className="flex cursor-pointer items-start justify-between"
              onClick={() => setExpandedPlan(expandedPlan === plan.id ? null : plan.id)}
            >
              <div className="flex-1">
                <div className="mb-2 flex flex-wrap items-center gap-2">
                  <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${typeColors[plan.planType] || "bg-slate-100"}`}>
                    {t(`plans.types.${plan.planType.toLowerCase()}`)}
                  </span>
                  <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                    plan.status === "IP_COMPLETED" ? "bg-teal-100 text-teal-700" :
                    plan.status === "IP_IN_PROGRESS" ? "bg-amber-100 text-amber-600" :
                    plan.status === "APPROVED" ? "bg-blue-100 text-blue-700" :
                    "bg-slate-100 text-slate-600"
                  }`}>
                    {t(`plans.statuses.${mapPlanStatus(plan.status)}`)}
                  </span>
                </div>
                <h4 className="text-sm font-semibold text-foreground">{plan.titleAr}</h4>
                {plan.owner && <p className="mt-0.5 text-xs text-muted">{plan.owner.fullNameAr}</p>}
              </div>
              <div className="flex items-center gap-3">
                <div className="text-end">
                  <p className="text-lg font-bold text-teal-600">{plan.progressPercentage}%</p>
                  {plan.targetCompletionDate && (
                    <p className="text-xs text-muted">
                      {new Date(plan.targetCompletionDate).toLocaleDateString("ar-SA")}
                    </p>
                  )}
                </div>
                {expandedPlan === plan.id ? <ChevronUp className="h-4 w-4 text-muted" /> : <ChevronDown className="h-4 w-4 text-muted" />}
              </div>
            </div>

            {/* Progress Bar */}
            <div className="mt-3 h-2 w-full rounded-full bg-slate-200">
              <div
                className={`h-2 rounded-full ${plan.progressPercentage >= 100 ? "bg-teal-500" : "bg-gradient-to-r from-teal-500 to-aqua-500"}`}
                style={{ width: `${Math.min(plan.progressPercentage, 100)}%` }}
              />
            </div>

            {/* Expanded Actions */}
            {expandedPlan === plan.id && plan.actions && plan.actions.length > 0 && (
              <div className="mt-4 space-y-2 border-t border-border pt-3">
                <h5 className="text-xs font-semibold text-muted">{t("plans.actions")}</h5>
                {plan.actions.map((action) => (
                  <div key={action.id} className="flex items-center gap-3 rounded-lg bg-white/40 p-2.5">
                    <div className={`h-2 w-2 shrink-0 rounded-full ${
                      action.status === "IA_COMPLETED" ? "bg-teal-500" :
                      action.status === "IA_IN_PROGRESS" ? "bg-amber-400" :
                      action.status === "DELAYED" ? "bg-red-500" :
                      "bg-slate-300"
                    }`} />
                    <div className="flex-1">
                      <p className="text-xs text-foreground">{action.descriptionAr}</p>
                      {action.responsiblePerson && (
                        <p className="text-xs text-muted">{action.responsiblePerson}</p>
                      )}
                    </div>
                    <span className="text-xs font-medium text-muted">{action.completionPercentage}%</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))
      )}
    </div>
  );
}

// ============== Surveys Tab ==============

function SurveysTab({ surveys, t }: { surveys: QualitySurvey[]; t: ReturnType<typeof useTranslations> }) {
  const typeColors: Record<string, string> = {
    STUDENT_SATISFACTION: "bg-blue-100 text-blue-700",
    COURSE_EVALUATION: "bg-teal-100 text-teal-700",
    TRAINER_EVALUATION: "bg-purple-100 text-purple-700",
    FACILITIES: "bg-amber-100 text-amber-700",
    SERVICES: "bg-green-100 text-green-700",
    GRADUATE_SURVEY: "bg-indigo-100 text-indigo-700",
    EMPLOYER_SURVEY: "bg-orange-100 text-orange-700",
  };

  return (
    <div className="space-y-3">
      {surveys.length === 0 ? (
        <EmptyState message={t("common.noData")} />
      ) : (
        surveys.map((survey) => (
          <div key={survey.id} className="glass-card p-4 md:p-5">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="mb-2 flex flex-wrap items-center gap-2">
                  <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${typeColors[survey.surveyType] || "bg-slate-100"}`}>
                    {t(`surveys.types.${survey.surveyType.toLowerCase()}`)}
                  </span>
                  <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                    survey.status === "SURVEY_ACTIVE" ? "bg-green-100 text-green-700" :
                    survey.status === "SURVEY_CLOSED" ? "bg-slate-100 text-slate-600" :
                    "bg-amber-100 text-amber-600"
                  }`}>
                    {t(`surveys.statuses.${mapSurveyStatus(survey.status)}`)}
                  </span>
                </div>
                <h4 className="text-sm font-semibold text-foreground">{survey.titleAr}</h4>
                <p className="mt-0.5 text-xs text-muted">
                  {t(`surveys.targetAudiences.${survey.targetAudience.toLowerCase()}`)}
                  {survey.academicYear && ` • ${survey.academicYear}`}
                </p>
              </div>
              <div className="text-end">
                <p className="text-lg font-bold text-teal-600">{survey.totalResponses}</p>
                <p className="text-xs text-muted">{t("surveys.responses")}</p>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
}

// ============== Reports Tab ==============

function ReportsTab({ reports, t }: { reports: QualityReport[]; t: ReturnType<typeof useTranslations> }) {
  return (
    <div className="space-y-3">
      {reports.length === 0 ? (
        <EmptyState message={t("common.noData")} />
      ) : (
        reports.map((report) => (
          <div key={report.id} className="glass-card p-4 md:p-5">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="mb-2 flex flex-wrap items-center gap-2">
                  <span className="rounded-full bg-indigo-100 px-2 py-0.5 text-xs font-medium text-indigo-700">
                    {t(`reports.types.${report.reportType.toLowerCase()}`)}
                  </span>
                  <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                    report.status === "PUBLISHED" ? "bg-teal-100 text-teal-700" :
                    report.status === "REPORT_APPROVED" ? "bg-green-100 text-green-700" :
                    report.status === "UNDER_REVIEW" ? "bg-amber-100 text-amber-600" :
                    "bg-slate-100 text-slate-600"
                  }`}>
                    {t(`reports.statuses.${mapReportStatus(report.status)}`)}
                  </span>
                </div>
                <h4 className="text-sm font-semibold text-foreground">{report.titleAr}</h4>
                {report.preparedBy && (
                  <p className="mt-0.5 text-xs text-muted">{report.preparedBy.fullNameAr}</p>
                )}
              </div>
              <div className="text-end text-xs text-muted">
                {report.academicYear && <p>{report.academicYear}</p>}
                <p>{new Date(report.createdAt).toLocaleDateString("ar-SA")}</p>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
}

// ============== Documents Tab ==============

function DocumentsTab({ documents, t }: { documents: QualityDocument[]; t: ReturnType<typeof useTranslations> }) {
  const typeIcons: Record<string, string> = {
    POLICY: "bg-blue-100 text-blue-700",
    PROCEDURE: "bg-teal-100 text-teal-700",
    GUIDELINE: "bg-green-100 text-green-700",
    FORM: "bg-amber-100 text-amber-700",
    MANUAL: "bg-purple-100 text-purple-700",
    DOC_STANDARD: "bg-indigo-100 text-indigo-700",
  };

  return (
    <div className="space-y-3">
      {documents.length === 0 ? (
        <EmptyState message={t("common.noData")} />
      ) : (
        documents.map((doc) => (
          <div key={doc.id} className="glass-card flex items-center gap-4 p-4 md:p-5">
            <div className={`rounded-lg p-2.5 ${typeIcons[doc.docType] || "bg-slate-100"}`}>
              <FileText className="h-5 w-5" />
            </div>
            <div className="flex-1">
              <h4 className="text-sm font-semibold text-foreground">{doc.titleAr}</h4>
              <div className="mt-0.5 flex flex-wrap items-center gap-2 text-xs text-muted">
                <span>{t(`documents.types.${doc.docType.toLowerCase()}`)}</span>
                {doc.docCode && <span>• {doc.docCode}</span>}
                {doc.version && <span>• v{doc.version}</span>}
              </div>
            </div>
            <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${
              doc.status === "DOC_ACTIVE" ? "bg-teal-100 text-teal-700" :
              doc.status === "DOC_UNDER_REVIEW" ? "bg-amber-100 text-amber-600" :
              "bg-slate-100 text-slate-600"
            }`}>
              {t(`documents.statuses.${mapDocStatus(doc.status)}`)}
            </span>
          </div>
        ))
      )}
    </div>
  );
}

// ============== Accreditations Tab ==============

function AccreditationsTab({ accreditations, t }: { accreditations: Accreditation[]; t: ReturnType<typeof useTranslations> }) {
  const [readiness, setReadiness] = useState<string | null>(null);
  const [assessing, setAssessing] = useState(false);

  const handleReadiness = async () => {
    setAssessing(true);
    try {
      const res = await fetch("/api/quality/ai/accreditation-readiness", { method: "POST" });
      const json = await res.json();
      if (json.success) setReadiness(json.data.assessment);
    } catch { /* ignore */ } finally {
      setAssessing(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* AI Readiness Button */}
      <div className="flex justify-end">
        <button
          onClick={handleReadiness}
          disabled={assessing}
          className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-purple-600 to-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition-opacity hover:opacity-90 disabled:opacity-50"
        >
          <Sparkles className={`h-4 w-4 ${assessing ? "animate-spin" : ""}`} />
          {t("accreditations.assessReadiness")}
        </button>
      </div>

      {/* Readiness Result */}
      {readiness && (
        <div className="glass-card border-l-4 border-purple-500 p-4 md:p-6">
          <h4 className="mb-2 flex items-center gap-2 font-semibold text-purple-700">
            <Sparkles className="h-4 w-4" />
            {t("accreditations.readinessAssessment")}
          </h4>
          <div className="whitespace-pre-wrap text-sm leading-relaxed text-foreground">{readiness}</div>
        </div>
      )}

      {/* Accreditation Cards */}
      <div className="grid grid-cols-1 gap-3 md:gap-4 lg:grid-cols-2">
        {accreditations.length === 0 ? (
          <div className="col-span-full">
            <EmptyState message={t("common.noData")} />
          </div>
        ) : (
          accreditations.map((acc) => {
            const isExpiringSoon = acc.expiryDate && new Date(acc.expiryDate) < new Date(Date.now() + 90 * 24 * 60 * 60 * 1000);

            return (
              <div key={acc.id} className="glass-card p-4 md:p-5">
                <div className="flex items-start gap-4">
                  <div className={`rounded-xl p-3 ${
                    acc.status === "ACCREDITATION_ACTIVE" ? "bg-teal-100" :
                    acc.status === "UNDER_RENEWAL" ? "bg-amber-100" :
                    "bg-red-100"
                  }`}>
                    <Award className={`h-6 w-6 ${
                      acc.status === "ACCREDITATION_ACTIVE" ? "text-teal-600" :
                      acc.status === "UNDER_RENEWAL" ? "text-amber-600" :
                      "text-red-600"
                    }`} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="text-sm font-semibold text-foreground">
                          {acc.accreditingBody || t(`accreditations.types.${acc.accreditationType.toLowerCase()}`)}
                        </h4>
                        <span className={`mt-1 inline-block rounded-full px-2 py-0.5 text-xs font-medium ${
                          acc.status === "ACCREDITATION_ACTIVE" ? "bg-teal-100 text-teal-700" :
                          acc.status === "UNDER_RENEWAL" ? "bg-amber-100 text-amber-600" :
                          acc.status === "EXPIRED" ? "bg-red-100 text-red-600" :
                          "bg-slate-100 text-slate-600"
                        }`}>
                          {t(`accreditations.statuses.${mapAccreditationStatus(acc.status)}`)}
                        </span>
                      </div>
                    </div>
                    <div className="mt-2 space-y-1 text-xs text-muted">
                      {acc.certificateNumber && <p>{t("accreditations.certificateNumber")}: {acc.certificateNumber}</p>}
                      {acc.grantDate && <p>{t("accreditations.grantDate")}: {new Date(acc.grantDate).toLocaleDateString("ar-SA")}</p>}
                      {acc.expiryDate && (
                        <p className={isExpiringSoon ? "font-medium text-amber-600" : ""}>
                          {t("accreditations.expiryDate")}: {new Date(acc.expiryDate).toLocaleDateString("ar-SA")}
                          {isExpiringSoon && ` ⚠️`}
                        </p>
                      )}
                      {acc.notes && <p className="mt-1">{acc.notes}</p>}
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

// ============== Empty State ==============

function EmptyState({ message }: { message: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-12">
      <FolderOpen className="mb-3 h-12 w-12 text-slate-300" />
      <p className="text-sm text-muted">{message}</p>
    </div>
  );
}
