"use client";

import { useState, useRef, useEffect } from "react";
import { useTranslations, useLocale } from "next-intl";
import { useSession } from "next-auth/react";
import { cn } from "@/lib/utils";
import { useAIChat } from "@/hooks/use-ai-chat";
import {
  Bot,
  X,
  Send,
  Loader2,
  Sparkles,
  MessageSquare,
  GraduationCap,
  BarChart3,
  Calendar,
  Users,
  Minimize2,
  Trash2,
  AlertCircle,
  Shield,
  DollarSign,
  ClipboardCheck,
  BookOpen,
  TrendingUp,
  Activity,
} from "lucide-react";

interface QuickAction {
  label: string;
  labelEn: string;
  icon: React.ElementType;
  query: string;
  queryEn: string;
}

function getQuickActionsForRole(role: string): QuickAction[] {
  const baseActions: Record<string, QuickAction[]> = {
    trainee: [
      {
        label: "درجاتي",
        labelEn: "My Grades",
        icon: GraduationCap,
        query: "أظهر لي درجاتي في جميع المقررات المسجلة",
        queryEn: "Show me my grades in all enrolled courses",
      },
      {
        label: "جدولي",
        labelEn: "My Schedule",
        icon: Calendar,
        query: "أعطني جدولي الأسبوعي",
        queryEn: "Give me my weekly schedule",
      },
      {
        label: "حضوري",
        labelEn: "My Attendance",
        icon: Activity,
        query: "كم نسبة حضوري وكم عدد أيام الغياب؟",
        queryEn: "What is my attendance rate and how many absences do I have?",
      },
      {
        label: "نصائح دراسية",
        labelEn: "Study Tips",
        icon: BookOpen,
        query: "أعطني نصائح لتحسين أدائي الأكاديمي بناءً على درجاتي",
        queryEn: "Give me tips to improve my academic performance based on my grades",
      },
    ],
    trainer: [
      {
        label: "أداء طلابي",
        labelEn: "Student Performance",
        icon: Users,
        query: "حلل أداء الطلاب في مقرراتي مع الإحصائيات",
        queryEn: "Analyze my students' performance across my courses with statistics",
      },
      {
        label: "حضور المتدربين",
        labelEn: "Trainee Attendance",
        icon: Calendar,
        query: "أعطني تحليل حضور المتدربين في مقرراتي",
        queryEn: "Give me attendance analysis for trainees in my courses",
      },
      {
        label: "تحليل الدرجات",
        labelEn: "Grades Analysis",
        icon: BarChart3,
        query: "حلل توزيع الدرجات في مقرراتي وأبرز المشكلات",
        queryEn: "Analyze grade distribution in my courses and highlight issues",
      },
      {
        label: "توصيات تدريسية",
        labelEn: "Teaching Tips",
        icon: Sparkles,
        query: "ما هي أبرز التوصيات لتحسين نتائج مقرراتي؟",
        queryEn: "What are the key recommendations to improve my course outcomes?",
      },
    ],
    dept_head: [
      {
        label: "أداء القسم",
        labelEn: "Department Performance",
        icon: BarChart3,
        query: "أعطني ملخص أداء قسمي مع جميع الإحصائيات",
        queryEn: "Give me my department performance summary with all statistics",
      },
      {
        label: "المعرضون للخطر",
        labelEn: "At-Risk Trainees",
        icon: Users,
        query: "من هم المتدربون المعرضون للخطر في قسمي ولماذا؟",
        queryEn: "Who are the at-risk trainees in my department and why?",
      },
      {
        label: "مقارنة المدربين",
        labelEn: "Trainer Comparison",
        icon: TrendingUp,
        query: "قارن أداء مقررات القسم من حيث الدرجات والحضور",
        queryEn: "Compare department course performance by grades and attendance",
      },
      {
        label: "توصيات التحسين",
        labelEn: "Improvement Tips",
        icon: Sparkles,
        query: "ما هي أبرز التوصيات لتحسين أداء قسمي؟",
        queryEn: "What are the key recommendations to improve my department?",
      },
    ],
    accountant: [
      {
        label: "حالة الميزانية",
        labelEn: "Budget Status",
        icon: DollarSign,
        query: "ما هي حالة الميزانية الحالية ونسبة الاستهلاك؟",
        queryEn: "What is the current budget status and utilization rate?",
      },
      {
        label: "المعاملات المعلقة",
        labelEn: "Pending Transactions",
        icon: ClipboardCheck,
        query: "كم عدد المعاملات المالية المعلقة والمعتمدة؟",
        queryEn: "How many financial transactions are pending and approved?",
      },
      {
        label: "الإيرادات والمصروفات",
        labelEn: "Income & Expenses",
        icon: BarChart3,
        query: "أعطني تحليل الإيرادات والمصروفات",
        queryEn: "Give me an income and expenses analysis",
      },
      {
        label: "توصيات مالية",
        labelEn: "Financial Tips",
        icon: Sparkles,
        query: "ما هي أبرز التوصيات لتحسين إدارة الميزانية؟",
        queryEn: "What are the key recommendations for budget management?",
      },
    ],
    quality_officer: [
      {
        label: "مؤشرات الجودة",
        labelEn: "Quality KPIs",
        icon: ClipboardCheck,
        query: "أعطني ملخص مؤشرات الجودة ونسب الإنجاز",
        queryEn: "Give me a quality KPIs summary with achievement rates",
      },
      {
        label: "ملاحظات التدقيق",
        labelEn: "Audit Findings",
        icon: Shield,
        query: "كم عدد ملاحظات التدقيق المفتوحة حسب الخطورة؟",
        queryEn: "How many open audit findings are there by severity?",
      },
      {
        label: "خطط التحسين",
        labelEn: "Improvement Plans",
        icon: TrendingUp,
        query: "ما هي حالة خطط التحسين ونسبة التقدم؟",
        queryEn: "What is the status of improvement plans and progress?",
      },
      {
        label: "توصيات الجودة",
        labelEn: "Quality Tips",
        icon: Sparkles,
        query: "ما هي أبرز التوصيات لرفع مستوى الجودة؟",
        queryEn: "What are the key recommendations to improve quality?",
      },
    ],
  };

  // Dean and super_admin get the original general overview actions
  const defaultActions: QuickAction[] = [
    {
      label: "ملخص أداء الكلية",
      labelEn: "College Performance Summary",
      icon: BarChart3,
      query: "أعطني ملخص أداء الكلية مع الإحصائيات الرئيسية",
      queryEn: "Give me a college performance summary with key statistics",
    },
    {
      label: "إحصائيات المتدربين",
      labelEn: "Trainee Statistics",
      icon: GraduationCap,
      query: "أعطني إحصائيات المتدربين والتوزيع حسب الأقسام",
      queryEn: "Give me trainee statistics and distribution by department",
    },
    {
      label: "تحليل الحضور",
      labelEn: "Attendance Analysis",
      icon: Calendar,
      query: "حلل بيانات الحضور وأبرز المشكلات إن وجدت",
      queryEn: "Analyze attendance data and highlight any issues",
    },
    {
      label: "توصيات تحسين",
      labelEn: "Improvement Tips",
      icon: Sparkles,
      query: "ما هي أبرز التوصيات لتحسين أداء الكلية؟",
      queryEn: "What are the key recommendations to improve college performance?",
    },
  ];

  // VP roles use same as their focus area
  if (role === "vp_quality") return baseActions.quality_officer || defaultActions;
  if (role === "vp_trainers") return defaultActions; // Full access
  if (role === "vp_trainees") return defaultActions; // Full access

  return baseActions[role] || defaultActions;
}

/**
 * Sanitize HTML to prevent XSS - only allow <strong> tags
 */
function sanitizeHtml(html: string): string {
  return html
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#x27;")
    // Re-enable only <strong> tags after sanitizing
    .replace(/&lt;strong&gt;/g, "<strong>")
    .replace(/&lt;\/strong&gt;/g, "</strong>");
}

// Format message content with basic markdown-like formatting
function formatContent(content: string) {
  return content.split("\n").map((line, i) => {
    // Detect structural patterns on raw line BEFORE sanitization
    const isH3 = line.startsWith("### ");
    const isH2 = line.startsWith("## ");
    const isBullet = line.trimStart().startsWith("•") || line.trimStart().startsWith("-");
    const isNumbered = /^\d+\./.test(line.trimStart());
    const isHr = /^---+$/.test(line.trim());

    // Sanitize then apply formatting
    const sanitized = sanitizeHtml(line);
    let formatted = sanitized
      .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
      .replace(/`([^`]+)`/g, '<code class="rounded bg-gray-100 px-1 py-0.5 text-xs font-mono text-teal-700">$1</code>');

    // Horizontal rule
    if (isHr) {
      return <hr key={i} className="my-2 border-border" />;
    }

    // Headers
    if (isH3) {
      return (
        <p
          key={i}
          className="mt-2 text-sm font-bold text-foreground"
          dangerouslySetInnerHTML={{
            __html: formatted.replace(/^#{3}\s/, ""),
          }}
        />
      );
    }
    if (isH2) {
      return (
        <p
          key={i}
          className="mt-3 text-sm font-bold text-foreground"
          dangerouslySetInnerHTML={{
            __html: formatted.replace(/^#{2}\s/, ""),
          }}
        />
      );
    }
    // List items (• or -)
    if (isBullet) {
      return (
        <p
          key={i}
          className="text-sm leading-relaxed ps-2"
          dangerouslySetInnerHTML={{ __html: formatted }}
        />
      );
    }
    // Numbered items
    if (isNumbered) {
      return (
        <p
          key={i}
          className="text-sm leading-relaxed ps-2"
          dangerouslySetInnerHTML={{ __html: formatted }}
        />
      );
    }
    return (
      <p
        key={i}
        className={cn("text-sm leading-relaxed", !line.trim() && "h-2")}
        dangerouslySetInnerHTML={{ __html: formatted }}
      />
    );
  });
}

export function AIChatbot() {
  const t = useTranslations("ai");
  const locale = useLocale();
  const isRtl = locale === "ar";
  const { data: session } = useSession();
  const userRole = session?.user?.role ?? "dean";
  const quickActions = getQuickActionsForRole(userRole);
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Use the real AI chat hook
  const { messages, isStreaming, error, sendMessage, clearChat, cancelStream } = useAIChat({
    locale,
  });

  useEffect(() => {
    // Use instant scroll during streaming for smoother UX
    messagesEndRef.current?.scrollIntoView({
      behavior: isStreaming ? "instant" : "smooth",
    });
  }, [messages, isStreaming]);

  useEffect(() => {
    if (isOpen && !isMinimized) {
      inputRef.current?.focus();
    }
  }, [isOpen, isMinimized]);

  const handleSend = async () => {
    if (!input.trim() || isStreaming) return;
    const text = input.trim();
    setInput("");
    await sendMessage(text);
  };

  const handleQuickAction = async (action: QuickAction) => {
    const query = locale === "ar" ? action.query : action.queryEn;
    setInput("");
    await sendMessage(query);
  };

  const handleClearChat = () => {
    cancelStream(); // Cancel any active stream first
    clearChat();
  };

  return (
    <>
      {/* Floating Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className={cn(
            "fixed z-50 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-teal-600 to-aqua-600 shadow-lg transition-all hover:scale-110 hover:shadow-xl",
            "bottom-6",
            isRtl ? "left-6" : "right-6"
          )}
          title={t("title")}
          aria-label={t("title")}
        >
          <Bot className="h-7 w-7 text-white" />
          {/* Pulse animation - RTL aware */}
          <span className={cn("absolute -top-1 flex h-4 w-4", isRtl ? "-left-1" : "-right-1")}>
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-aqua-600 opacity-75"></span>
            <span className="relative inline-flex h-4 w-4 rounded-full bg-aqua-600"></span>
          </span>
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div
          className={cn(
            "fixed z-50 flex flex-col overflow-hidden rounded-2xl bg-white shadow-2xl transition-all duration-300",
            isMinimized
              ? "h-14 w-80"
              : "h-[520px] w-[380px] max-h-[85vh] max-w-[95vw]",
            "bottom-6",
            isRtl ? "left-6" : "right-6",
            // Mobile: full width
            "max-md:bottom-0 max-md:end-0 max-md:start-0 max-md:h-[100dvh] max-md:max-h-[100dvh] max-md:w-full max-md:max-w-full max-md:rounded-none"
          )}
          role="dialog"
          aria-label={t("title")}
        >
          {/* Header */}
          <div className="flex shrink-0 items-center justify-between bg-gradient-to-r from-teal-600 to-aqua-600 px-4 py-3">
            <div className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white/20">
                <Bot className="h-5 w-5 text-white" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">{t("title")}</h3>
                <p className="text-[10px] text-white/80">
                  {isStreaming
                    ? locale === "ar"
                      ? "يكتب..."
                      : "Typing..."
                    : t("subtitle")}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              {messages.length > 0 && (
                <button
                  onClick={handleClearChat}
                  className="rounded-lg p-1.5 text-white/80 transition-colors hover:bg-white/20 hover:text-white"
                  title={locale === "ar" ? "مسح المحادثة" : "Clear chat"}
                  aria-label={locale === "ar" ? "مسح المحادثة" : "Clear chat"}
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              )}
              <button
                onClick={() => setIsMinimized(!isMinimized)}
                className="rounded-lg p-1.5 text-white/80 transition-colors hover:bg-white/20 hover:text-white max-md:hidden"
                aria-label={locale === "ar" ? "تصغير" : "Minimize"}
              >
                <Minimize2 className="h-4 w-4" />
              </button>
              <button
                onClick={() => {
                  setIsOpen(false);
                  setIsMinimized(false);
                }}
                className="rounded-lg p-1.5 text-white/80 transition-colors hover:bg-white/20 hover:text-white"
                aria-label={locale === "ar" ? "إغلاق" : "Close"}
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>

          {!isMinimized && (
            <>
              {/* Messages Area */}
              <div className="flex-1 overflow-y-auto p-4">
                {messages.length === 0 ? (
                  <div className="flex h-full flex-col items-center justify-center">
                    {/* Welcome State */}
                    <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-teal-100 to-aqua-100">
                      <Sparkles className="h-8 w-8 text-teal-600" />
                    </div>
                    <h4 className="mb-1 text-base font-bold text-foreground">
                      {t("welcomeTitle")}
                    </h4>
                    <p className="mb-6 text-center text-xs text-muted">
                      {t("welcomeDesc")}
                    </p>

                    {/* Quick Actions */}
                    <div className="grid w-full grid-cols-2 gap-2">
                      {quickActions.map((action, i) => (
                        <button
                          key={i}
                          onClick={() => handleQuickAction(action)}
                          disabled={isStreaming}
                          className="flex flex-col items-center gap-1.5 rounded-xl border border-border bg-background p-3 text-center transition-all hover:border-teal-500/30 hover:bg-teal-50 hover:shadow-sm disabled:opacity-50"
                        >
                          <action.icon className="h-5 w-5 text-teal-600" />
                          <span className="text-[11px] font-medium leading-tight text-foreground">
                            {locale === "ar" ? action.label : action.labelEn}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {messages.map((msg) => (
                      <div
                        key={msg.id}
                        className={cn(
                          "flex",
                          msg.role === "user" ? "justify-end" : "justify-start"
                        )}
                      >
                        <div
                          className={cn(
                            "max-w-[85%] rounded-2xl px-3.5 py-2.5",
                            msg.role === "user"
                              ? "bg-teal-600 text-white"
                              : "border border-border bg-background text-foreground"
                          )}
                        >
                          {msg.role === "assistant" && (
                            <div className="mb-1.5 flex items-center gap-1.5">
                              <Bot className="h-3.5 w-3.5 text-teal-600" />
                              <span className="text-[10px] font-semibold text-teal-600">
                                {t("assistantName")}
                              </span>
                              {msg.isStreaming && (
                                <Loader2 className="h-3 w-3 animate-spin text-teal-600" />
                              )}
                            </div>
                          )}
                          <div
                            className={cn(
                              msg.role === "user"
                                ? "text-sm"
                                : "text-[13px]"
                            )}
                          >
                            {msg.role === "assistant" ? (
                              msg.content ? (
                                formatContent(msg.content)
                              ) : (
                                <div className="flex items-center gap-1.5">
                                  <div className="h-2 w-2 animate-bounce rounded-full bg-teal-600 [animation-delay:0ms]" />
                                  <div className="h-2 w-2 animate-bounce rounded-full bg-teal-600 [animation-delay:150ms]" />
                                  <div className="h-2 w-2 animate-bounce rounded-full bg-teal-600 [animation-delay:300ms]" />
                                </div>
                              )
                            ) : (
                              <p className="text-sm">{msg.content}</p>
                            )}
                          </div>
                          <p
                            className={cn(
                              "mt-1 text-[10px]",
                              msg.role === "user"
                                ? "text-white/60"
                                : "text-muted"
                            )}
                          >
                            {msg.timestamp.toLocaleTimeString(
                              locale === "ar" ? "ar-SA" : "en-US",
                              {
                                hour: "2-digit",
                                minute: "2-digit",
                              }
                            )}
                          </p>
                        </div>
                      </div>
                    ))}

                    <div ref={messagesEndRef} />
                  </div>
                )}
              </div>

              {/* Error Banner */}
              {error && (
                <div className="shrink-0 border-t border-red-200 bg-red-50 px-4 py-2">
                  <div className="flex items-center gap-2 text-xs text-red-600">
                    <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                    <span className="line-clamp-1">{error}</span>
                  </div>
                </div>
              )}

              {/* Input Area */}
              <div className="shrink-0 border-t border-border bg-white p-3">
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleSend();
                  }}
                  className="flex items-center gap-2"
                >
                  <input
                    ref={inputRef}
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder={t("inputPlaceholder")}
                    disabled={isStreaming}
                    className="flex-1 rounded-xl border border-border bg-background px-3.5 py-2.5 text-sm outline-none transition-colors placeholder:text-muted focus:border-teal-500 focus:ring-2 focus:ring-teal-600/20 disabled:opacity-50"
                    dir={isRtl ? "rtl" : "ltr"}
                  />
                  <button
                    type="submit"
                    disabled={!input.trim() || isStreaming}
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-teal-600 text-white transition-all hover:bg-teal-700 disabled:opacity-40"
                    aria-label={locale === "ar" ? "إرسال" : "Send"}
                  >
                    {isStreaming ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Send
                        className={cn("h-4 w-4", isRtl && "rotate-180")}
                      />
                    )}
                  </button>
                </form>
                <p className="mt-2 text-center text-[10px] text-muted">
                  {t("poweredBy")}
                </p>
              </div>
            </>
          )}
        </div>
      )}
    </>
  );
}
