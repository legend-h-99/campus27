/**
 * AI Chat Hook
 * خطاف المحادثة الذكية
 *
 * Manages chat interaction with the AI:
 * - Send messages to streaming API
 * - Handle SSE stream parsing
 * - Manage conversation state
 * - Handle errors and fallbacks
 */

"use client";

import { useCallback, useRef } from "react";
import { useAIStore } from "@/stores/ai-store";
import type { ChatMessage } from "@/stores/ai-store";

interface UseAIChatOptions {
  locale?: string;
}

interface UseAIChatReturn {
  messages: ChatMessage[];
  isStreaming: boolean;
  error: string | null;
  conversationId: string | null;
  sendMessage: (content: string) => Promise<void>;
  clearChat: () => void;
  cancelStream: () => void;
}

export function useAIChat(options: UseAIChatOptions = {}): UseAIChatReturn {
  const { locale = "ar" } = options;
  const abortRef = useRef<AbortController | null>(null);

  const {
    messages,
    isStreaming,
    chatError: error,
    conversationId,
    addMessage,
    updateLastAssistantMessage,
    setStreaming,
    setChatError,
    setConversationId,
    clearChat,
  } = useAIStore();

  const sendMessage = useCallback(
    async (content: string) => {
      // Read isStreaming directly from store to avoid stale closure
      if (!content.trim() || useAIStore.getState().isStreaming) return;

      // Cancel any ongoing stream
      abortRef.current?.abort();
      abortRef.current = new AbortController();

      // Add user message
      const userMessage: ChatMessage = {
        id: `user-${Date.now()}`,
        role: "user",
        content: content.trim(),
        timestamp: new Date(),
      };
      addMessage(userMessage);

      // Add placeholder assistant message
      const assistantMessage: ChatMessage = {
        id: `assistant-${Date.now()}`,
        role: "assistant",
        content: "",
        timestamp: new Date(),
        isStreaming: true,
      };
      addMessage(assistantMessage);
      setStreaming(true);
      setChatError(null);

      try {
        const response = await fetch("/api/ai/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            message: content.trim(),
            conversationId,
            locale,
          }),
          signal: abortRef.current.signal,
        });

        // Store conversationId from headers
        const newConvId = response.headers.get("X-Conversation-Id");
        if (newConvId && newConvId !== conversationId) {
          setConversationId(newConvId);
        }

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(
            errorData.error ||
              (locale === "ar"
                ? "حدث خطأ في الاتصال"
                : "Connection error occurred")
          );
        }

        // Check if it's a non-streaming JSON response (fallback mode)
        const contentType = response.headers.get("content-type") || "";
        if (contentType.includes("application/json")) {
          const data = await response.json();
          updateLastAssistantMessage(data.text, false);
          if (data.conversationId) {
            setConversationId(data.conversationId);
          }
          setStreaming(false);
          return;
        }

        // Handle SSE streaming response
        if (!response.body) {
          throw new Error("No response body");
        }

        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let accumulated = "";

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value, { stream: true });

          // Parse Vercel AI SDK data stream format
          // Format: 0:"text chunk"\n
          const lines = chunk.split("\n");
          for (const line of lines) {
            if (!line.trim()) continue;

            // Vercel AI SDK text chunk format: 0:"text"
            if (line.startsWith("0:")) {
              try {
                const textChunk = JSON.parse(line.slice(2));
                accumulated += textChunk;
                updateLastAssistantMessage(accumulated);
              } catch {
                // Not valid JSON, skip
              }
            }
            // Finish message format: d:{...}
            else if (line.startsWith("d:")) {
              // Stream finished - mark message as complete
              updateLastAssistantMessage(accumulated, false);
            }
            // Error format: 3:"error"
            else if (line.startsWith("3:")) {
              try {
                const errorMsg = JSON.parse(line.slice(2));
                setChatError(errorMsg);
              } catch {
                // Ignore parse errors
              }
            }
          }
        }

        // Ensure streaming state is finalized
        updateLastAssistantMessage(accumulated, false);
        setStreaming(false);
      } catch (err: unknown) {
        if (err instanceof Error && err.name === "AbortError") {
          // User cancelled - don't show error
          setStreaming(false);
          return;
        }

        const errorMsg =
          err instanceof Error
            ? err.message
            : locale === "ar"
              ? "حدث خطأ غير متوقع"
              : "An unexpected error occurred";

        setChatError(errorMsg);
        updateLastAssistantMessage(
          locale === "ar"
            ? `⚠️ ${errorMsg}\n\nيرجى المحاولة مرة أخرى.`
            : `⚠️ ${errorMsg}\n\nPlease try again.`,
          false
        );
        setStreaming(false);
      }
    },
    [
      conversationId,
      locale,
      addMessage,
      updateLastAssistantMessage,
      setStreaming,
      setChatError,
      setConversationId,
    ]
  );

  const cancelStream = useCallback(() => {
    abortRef.current?.abort();
    abortRef.current = null;
    setStreaming(false);
  }, [setStreaming]);

  return {
    messages,
    isStreaming,
    error,
    conversationId,
    sendMessage,
    clearChat,
    cancelStream,
  };
}
