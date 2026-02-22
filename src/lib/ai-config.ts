/**
 * AI System Configuration
 * إعدادات نظام الذكاء الاصطناعي - Campus26
 */

// ═══ Provider Configuration ═══
export const AI_CONFIG = {
  provider: (process.env.AI_PROVIDER || "anthropic") as "anthropic" | "openai",
  model: process.env.AI_MODEL || "claude-sonnet-4-20250514",
  maxTokens: parseInt(process.env.AI_MAX_TOKENS || "2048"),
  temperature: parseFloat(process.env.AI_TEMPERATURE || "0.3"),
  cacheTtlMinutes: parseInt(process.env.AI_CACHE_TTL_MINUTES || "30"),
  rateLimitPerMinute: parseInt(process.env.AI_RATE_LIMIT_PER_MINUTE || "20"),
} as const;

// ═══ Early Warning Thresholds ═══
export const EARLY_WARNING = {
  weights: {
    attendance: 0.35,    // w1: attendance rate impact
    grades: 0.30,        // w2: grade performance impact
    absenceStreak: 0.20, // w3: consecutive absences
    gpaThreshold: 0.15,  // w4: GPA below 2.0
  },
  riskLevels: {
    low: { min: 0, max: 30, labelAr: "منخفض", labelEn: "Low", color: "teal" },
    medium: { min: 30, max: 60, labelAr: "متوسط", labelEn: "Medium", color: "amber" },
    high: { min: 60, max: 80, labelAr: "مرتفع", labelEn: "High", color: "orange" },
    critical: { min: 80, max: 100, labelAr: "حرج", labelEn: "Critical", color: "red" },
  },
} as const;

// ═══ Feature Flags ═══
export const AI_FEATURES = {
  chatEnabled: true,
  earlyWarningEnabled: true,
  predictionsEnabled: true,
  recommendationsEnabled: true,
  reportGenerationEnabled: true,
  // Disable LLM features if no API key
  get llmEnabled() {
    return !!(process.env.ANTHROPIC_API_KEY || process.env.OPENAI_API_KEY);
  },
} as const;

// ═══ Cache Keys ═══
export const CACHE_KEYS = {
  academicOverview: (semesterId?: string) => `academic:${semesterId || "current"}`,
  departmentPerformance: (deptId: string) => `dept:${deptId}`,
  financialSummary: (year: string) => `finance:${year}`,
  qualityGaps: () => "quality:gaps",
  earlyWarning: (deptId?: string) => `warning:${deptId || "all"}`,
  insights: (scope: string) => `insights:${scope}`,
  recommendations: (role: string) => `recs:${role}`,
} as const;

// ═══ Rate Limit Store (in-memory) ═══
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();

export function checkRateLimit(userId: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(userId);

  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(userId, { count: 1, resetAt: now + 60_000 });
    return true;
  }

  if (entry.count >= AI_CONFIG.rateLimitPerMinute) {
    return false;
  }

  entry.count++;
  return true;
}
