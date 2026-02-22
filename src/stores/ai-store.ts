/**
 * AI Store (Zustand)
 * مخزن حالة الذكاء الاصطناعي
 *
 * Manages client-side state for AI features:
 * chat messages, insights, loading states, errors
 */

import { create } from "zustand";

// ═══ Types ═══

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  isStreaming?: boolean;
}

export interface AIInsight {
  type: "success" | "warning" | "info" | "prediction";
  title: string;
  description: string;
  metric?: string;
  priority: number;
}

export interface AIRecommendation {
  title: string;
  description: string;
  priority: "high" | "medium" | "low";
  impact: string;
  category: "academic" | "financial" | "quality" | "hr" | "operational";
}

export interface EarlyWarningItem {
  traineeId: string;
  traineeName: string;
  studentNumber: string;
  department: string;
  riskScore: number;
  riskLevel: "low" | "medium" | "high" | "critical";
  factors: {
    attendance: number;
    grades: number;
    absenceStreak: number;
    gpaBelow: boolean;
  };
}

// ═══ Store Interface ═══

interface AIStore {
  // Chat State
  messages: ChatMessage[];
  isStreaming: boolean;
  chatError: string | null;
  conversationId: string | null;
  userRole: string | null;

  // Insights State
  insights: AIInsight[];
  insightsLoading: boolean;
  insightsError: string | null;
  insightsLastUpdated: Date | null;

  // Recommendations State
  recommendations: AIRecommendation[];
  recommendationsLoading: boolean;

  // Early Warning State
  earlyWarnings: EarlyWarningItem[];
  earlyWarningsLoading: boolean;

  // Chat Actions
  addMessage: (message: ChatMessage) => void;
  updateLastAssistantMessage: (content: string, isStreaming?: boolean) => void;
  setStreaming: (streaming: boolean) => void;
  setChatError: (error: string | null) => void;
  setConversationId: (id: string | null) => void;
  setUserRole: (role: string | null) => void;
  clearChat: () => void;

  // Insights Actions
  setInsights: (insights: AIInsight[]) => void;
  setInsightsLoading: (loading: boolean) => void;
  setInsightsError: (error: string | null) => void;

  // Recommendations Actions
  setRecommendations: (recs: AIRecommendation[]) => void;
  setRecommendationsLoading: (loading: boolean) => void;

  // Early Warning Actions
  setEarlyWarnings: (warnings: EarlyWarningItem[]) => void;
  setEarlyWarningsLoading: (loading: boolean) => void;
}

// ═══ Store Implementation ═══

export const useAIStore = create<AIStore>((set) => ({
  // ─── Initial State ───
  messages: [],
  isStreaming: false,
  chatError: null,
  conversationId: null,
  userRole: null,

  insights: [],
  insightsLoading: false,
  insightsError: null,
  insightsLastUpdated: null,

  recommendations: [],
  recommendationsLoading: false,

  earlyWarnings: [],
  earlyWarningsLoading: false,

  // ─── Chat Actions ───
  addMessage: (message) =>
    set((state) => {
      // Keep last 100 messages to prevent memory leaks in long sessions
      const MAX_MESSAGES = 100;
      const msgs = [...state.messages, message];
      return {
        messages: msgs.length > MAX_MESSAGES ? msgs.slice(-MAX_MESSAGES) : msgs,
        chatError: null,
      };
    }),

  updateLastAssistantMessage: (content, isStreaming = true) =>
    set((state) => {
      const msgs = [...state.messages];
      const lastIdx = msgs.findLastIndex((m) => m.role === "assistant");
      if (lastIdx >= 0) {
        msgs[lastIdx] = { ...msgs[lastIdx], content, isStreaming };
      }
      return { messages: msgs };
    }),

  setStreaming: (streaming) => set({ isStreaming: streaming }),

  setChatError: (error) => set({ chatError: error }),

  setConversationId: (id) => set({ conversationId: id }),

  setUserRole: (role) => set({ userRole: role }),

  clearChat: () =>
    set({
      messages: [],
      isStreaming: false,
      chatError: null,
      conversationId: null,
    }),

  // ─── Insights Actions ───
  setInsights: (insights) =>
    set({
      insights,
      insightsLoading: false,
      insightsError: null,
      insightsLastUpdated: new Date(),
    }),

  setInsightsLoading: (loading) => set({ insightsLoading: loading }),

  setInsightsError: (error) =>
    set({ insightsError: error, insightsLoading: false }),

  // ─── Recommendations Actions ───
  setRecommendations: (recommendations) =>
    set({ recommendations, recommendationsLoading: false }),

  setRecommendationsLoading: (loading) =>
    set({ recommendationsLoading: loading }),

  // ─── Early Warning Actions ───
  setEarlyWarnings: (earlyWarnings) =>
    set({ earlyWarnings, earlyWarningsLoading: false }),

  setEarlyWarningsLoading: (loading) =>
    set({ earlyWarningsLoading: loading }),
}));
