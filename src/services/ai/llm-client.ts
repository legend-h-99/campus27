/**
 * LLM Client Abstraction Layer
 * طبقة تجريد عميل نماذج اللغة الكبيرة
 *
 * Supports: Anthropic (Claude) and OpenAI via Vercel AI SDK
 * Graceful fallback when no API key is configured
 */

import { AI_CONFIG, AI_FEATURES } from "@/lib/ai-config";

// ═══ Types ═══

export interface LLMMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

export interface LLMStreamOptions {
  messages: LLMMessage[];
  maxTokens?: number;
  temperature?: number;
  onText?: (text: string) => void;
  onFinish?: (fullText: string) => void;
  onError?: (error: Error) => void;
  signal?: AbortSignal;
}

export interface LLMGenerateOptions {
  messages: LLMMessage[];
  maxTokens?: number;
  temperature?: number;
}

export interface LLMResponse {
  text: string;
  usage?: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
}

// ═══ Provider Factory ═══

/**
 * Get the configured AI provider model for Vercel AI SDK
 * Returns null if no API key is available
 */
export function getLanguageModel() {
  if (!AI_FEATURES.llmEnabled) {
    return null;
  }

  if (AI_CONFIG.provider === "anthropic") {
    // Dynamic import to avoid bundling unused providers
    const { createAnthropic } = require("@ai-sdk/anthropic");
    const anthropic = createAnthropic({
      apiKey: process.env.ANTHROPIC_API_KEY,
    });
    return anthropic(AI_CONFIG.model);
  }

  if (AI_CONFIG.provider === "openai") {
    const { createOpenAI } = require("@ai-sdk/openai");
    const openai = createOpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
    return openai(AI_CONFIG.model);
  }

  return null;
}

/**
 * Stream text from LLM using Vercel AI SDK
 * Returns a ReadableStream for SSE responses
 */
export async function streamText(options: LLMStreamOptions) {
  const model = getLanguageModel();

  if (!model) {
    // Fallback: return a simple non-streaming response
    const fallbackText = getFallbackResponse(options.messages);
    options.onText?.(fallbackText);
    options.onFinish?.(fallbackText);
    return null;
  }

  try {
    const { streamText: aiStreamText } = require("ai");

    const result = aiStreamText({
      model,
      messages: options.messages,
      maxTokens: options.maxTokens ?? AI_CONFIG.maxTokens,
      temperature: options.temperature ?? AI_CONFIG.temperature,
      abortSignal: options.signal,
    });

    return result;
  } catch (error) {
    const err = error instanceof Error ? error : new Error(String(error));
    options.onError?.(err);

    // Fallback on error
    const fallbackText = getFallbackResponse(options.messages);
    options.onText?.(fallbackText);
    options.onFinish?.(fallbackText);
    return null;
  }
}

/**
 * Generate text (non-streaming) from LLM
 * Used for insights, recommendations, reports
 */
export async function generateText(
  options: LLMGenerateOptions
): Promise<LLMResponse> {
  const model = getLanguageModel();

  if (!model) {
    return {
      text: getFallbackResponse(options.messages),
      usage: { promptTokens: 0, completionTokens: 0, totalTokens: 0 },
    };
  }

  try {
    const { generateText: aiGenerateText } = require("ai");

    const result = await aiGenerateText({
      model,
      messages: options.messages,
      maxTokens: options.maxTokens ?? AI_CONFIG.maxTokens,
      temperature: options.temperature ?? AI_CONFIG.temperature,
    });

    return {
      text: result.text,
      usage: result.usage
        ? {
            promptTokens: result.usage.promptTokens ?? 0,
            completionTokens: result.usage.completionTokens ?? 0,
            totalTokens: result.usage.totalTokens ?? 0,
          }
        : undefined,
    };
  } catch (error) {
    console.error("[AI] LLM generation error:", error);
    return {
      text: getFallbackResponse(options.messages),
      usage: { promptTokens: 0, completionTokens: 0, totalTokens: 0 },
    };
  }
}

// ═══ Fallback Responses ═══

/**
 * Generate a helpful fallback response when LLM is unavailable
 */
function getFallbackResponse(messages: LLMMessage[]): string {
  const lastMessage = messages.findLast((m) => m.role === "user");
  const query = lastMessage?.content?.toLowerCase() ?? "";

  // Detect language from query
  const isArabic = /[\u0600-\u06FF]/.test(query);

  if (isArabic) {
    return (
      `عذرًا، خدمة الذكاء الاصطناعي غير متوفرة حاليًا.\n\n` +
      `يمكنك:\n` +
      `• مراجعة لوحة التحكم للاطلاع على الإحصائيات الحالية\n` +
      `• استخدام صفحة التقارير لتوليد تقارير مخصصة\n` +
      `• التواصل مع الدعم الفني إذا استمرت المشكلة\n\n` +
      `سيتم إعادة تفعيل الخدمة في أقرب وقت.`
    );
  }

  return (
    `Sorry, the AI service is currently unavailable.\n\n` +
    `You can:\n` +
    `• Check the dashboard for current statistics\n` +
    `• Use the reports page to generate custom reports\n` +
    `• Contact technical support if the issue persists\n\n` +
    `The service will be reactivated as soon as possible.`
  );
}

/**
 * Check if LLM service is healthy
 */
export function isLLMAvailable(): boolean {
  return AI_FEATURES.llmEnabled;
}
