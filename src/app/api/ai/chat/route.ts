/**
 * AI Chat Streaming API
 * نقطة نهاية محادثة الذكاء الاصطناعي بالبث المباشر
 *
 * POST /api/ai/chat
 * - Accepts: { message, conversationId?, locale }
 * - Returns: SSE stream of AI response text
 * - Uses RAG context from database
 * - Rate limited per user
 */

import { NextRequest } from "next/server";
import { AI_FEATURES, checkRateLimit } from "@/lib/ai-config";
import { buildChatContext } from "@/services/ai/context-builder";
import type { FullDataContext } from "@/services/ai/data-aggregator";
import { getLanguageModel } from "@/services/ai/llm-client";
import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";

// ═══ Types ═══

interface ChatRequestBody {
  message: string;
  conversationId?: string;
  locale?: string;
}

// ═══ Route Handler ═══

export async function POST(request: NextRequest) {
  try {
    // Parse request body
    const body: ChatRequestBody = await request.json();
    const { message, conversationId, locale = "ar" } = body;

    if (!message?.trim()) {
      return Response.json(
        { error: locale === "ar" ? "الرسالة مطلوبة" : "Message is required" },
        { status: 400 }
      );
    }

    // Limit message length to prevent abuse
    const MAX_MESSAGE_LENGTH = 2000;
    const trimmedMessage = message.trim().substring(0, MAX_MESSAGE_LENGTH);

    // Get real user session
    const session = await auth();
    if (!session?.user) {
      return Response.json(
        { error: locale === "ar" ? "يرجى تسجيل الدخول أولاً" : "Please login first" },
        { status: 401 }
      );
    }

    const userId = session.user.id;
    const userName = locale === "ar" ? session.user.nameAr : session.user.nameEn;
    const userRole = session.user.role ?? "trainee";

    // Get departmentId for dept-scoped roles
    let departmentId: string | undefined;
    if (["dept_head", "trainer", "trainee"].includes(userRole)) {
      const userRecord = await prisma.user.findUnique({
        where: { id: userId },
        include: {
          trainer: { select: { departmentId: true } },
          trainee: { select: { departmentId: true } },
          headOfDepartment: { select: { id: true } },
        },
      });
      departmentId = userRecord?.trainer?.departmentId
        ?? userRecord?.trainee?.departmentId
        ?? userRecord?.headOfDepartment?.id;
    }

    // Rate limit check
    if (!checkRateLimit(userId)) {
      return Response.json(
        {
          error:
            locale === "ar"
              ? "تم تجاوز حد الطلبات. يرجى المحاولة بعد دقيقة."
              : "Rate limit exceeded. Please try again in a minute.",
        },
        { status: 429 }
      );
    }

    // Build RAG context
    const chatContext = await buildChatContext({
      userName,
      userRole,
      locale,
      userId,
      departmentId,
    });

    // Load conversation history
    let history: Array<{ role: string; content: string }> = [];
    let convId = conversationId;

    if (convId) {
      // Verify conversation exists before loading history
      const convExists = await prisma.aIConversation.findUnique({
        where: { id: convId },
        select: { id: true },
      });

      if (convExists) {
        const existingMessages = await prisma.aIMessage.findMany({
          where: { conversationId: convId },
          orderBy: { createdAt: "asc" },
          take: 20, // Last 20 messages for context
          select: { role: true, content: true },
        });
        history = existingMessages;
      } else {
        // Invalid convId - start fresh
        convId = undefined;
      }
    }

    // Build messages array
    const messages: Array<{ role: "system" | "user" | "assistant"; content: string }> = [
      { role: "system", content: chatContext.systemPrompt },
      ...history.map((m) => ({
        role: m.role as "user" | "assistant",
        content: m.content,
      })),
      { role: "user", content: trimmedMessage },
    ];

    // Check if LLM is available
    const model = getLanguageModel();

    if (!model || !AI_FEATURES.chatEnabled) {
      // Smart fallback: use RAG data to answer common questions
      const isAr = locale === "ar";
      const fallbackText = generateSmartFallback(trimmedMessage, chatContext.rawData, isAr, userRole);

      // Save conversation even with fallback
      const conv = convId
        ? { id: convId }
        : await prisma.aIConversation.create({
            data: { userId, locale, title: trimmedMessage.substring(0, 100) },
          });

      await prisma.aIMessage.createMany({
        data: [
          {
            conversationId: conv.id,
            role: "user",
            content: trimmedMessage,
          },
          {
            conversationId: conv.id,
            role: "assistant",
            content: fallbackText,
          },
        ],
      });

      return Response.json({
        text: fallbackText,
        conversationId: conv.id,
        isStreaming: false,
      });
    }

    // Create/get conversation
    if (!convId) {
      const conv = await prisma.aIConversation.create({
        data: {
          userId,
          locale,
          title: trimmedMessage.substring(0, 100),
        },
      });
      convId = conv.id;
    }

    // Save user message
    await prisma.aIMessage.create({
      data: {
        conversationId: convId,
        role: "user",
        content: trimmedMessage,
      },
    });

    // Stream response using Vercel AI SDK
    const { streamText } = require("ai");

    const result = streamText({
      model,
      messages,
      maxTokens: 2048,
      temperature: 0.3,
      async onFinish({ text, usage }: { text: string; usage?: { totalTokens?: number } }) {
        // Save assistant response to DB
        try {
          await prisma.aIMessage.create({
            data: {
              conversationId: convId!,
              role: "assistant",
              content: text,
              tokenCount: usage?.totalTokens ?? null,
            },
          });
        } catch (err) {
          console.error("[AI Chat] Failed to save response:", err);
        }
      },
    });

    // Return streaming response with conversationId in headers
    const response = result.toDataStreamResponse();

    // Add conversationId to response headers
    const headers = new Headers(response.headers);
    headers.set("X-Conversation-Id", convId);

    return new Response(response.body, {
      status: response.status,
      headers,
    });
  } catch (error) {
    console.error("[AI Chat] Error:", error);
    // Try to detect locale from request body for error message
    let errorLocale = "en";
    try {
      const bodyText = await request.text().catch(() => "");
      if (bodyText.includes('"locale":"ar"') || /[\u0600-\u06FF]/.test(bodyText)) {
        errorLocale = "ar";
      }
    } catch { /* ignore */ }

    return Response.json(
      {
        error: errorLocale === "ar"
          ? "حدث خطأ أثناء معالجة طلبك. يرجى المحاولة مرة أخرى."
          : "An error occurred while processing your request. Please try again.",
      },
      { status: 500 }
    );
  }
}

// ═══ GET Handler (Method Not Allowed) ═══
export async function GET() {
  return Response.json(
    { error: "Method not allowed. Use POST to send chat messages." },
    { status: 405 }
  );
}

// ═══ Smart Fallback Engine ═══

/**
 * Generate context-aware responses using RAG data when LLM is unavailable.
 * Analyzes the user's query keywords to provide relevant data-driven answers.
 */
function generateSmartFallback(query: string, data: FullDataContext, isAr: boolean, role: string = "dean"): string {
  const q = query.toLowerCase();

  // Detect query intent by keywords
  const isAboutTrainees = /متدرب|trainee|طالب|student|تسجيل|enrollment/i.test(q);
  const isAboutTrainers = /مدرب|trainer|معلم|teacher|هيئة/i.test(q);
  const isAboutAttendance = /حضور|غياب|attendance|absent|تأخر|late/i.test(q);
  const isAboutFinance = /مال|ميزاني|إيراد|مصروف|budget|finance|income|expense/i.test(q);
  const isAboutQuality = /جودة|مؤشر|quality|indicator|إنجاز|achievement/i.test(q);
  const isAboutTasks = /مهم|مهام|task|واجب|مشروع|project/i.test(q);
  const isAboutDepartments = /قسم|أقسام|department|كلية|college/i.test(q);
  const isAboutGPA = /معدل|gpa|تراكمي|نجاح|success|أداء|performance/i.test(q);
  const isAboutSummary = /ملخص|إحصائ|summary|overview|عام|general|كل شي/i.test(q);
  const isAboutRecommendations = /توصي|نصيح|تحسين|recommend|improve|suggestion/i.test(q);

  // Role-based section filtering
  const restrictedRoles: Record<string, string[]> = {
    trainee: ["isAboutFinance", "isAboutQuality", "isAboutTasks", "isAboutDepartments"],
    trainer: ["isAboutFinance", "isAboutQuality"],
    accountant: ["isAboutTrainees", "isAboutTrainers", "isAboutGPA", "isAboutAttendance"],
    quality_officer: ["isAboutFinance", "isAboutTrainees", "isAboutTrainers"],
  };
  const blockedSections = restrictedRoles[role] || [];

  const isPersonalQuery = /درجاتي|جدولي|حضوري|معدلي|my grades|my schedule|my attendance|my gpa/i.test(q);

  const sections: string[] = [];

  if (isPersonalQuery && role === "trainee") {
    if (isAr) {
      sections.push(`## 📌 بياناتك الشخصية\n`);
      sections.push(`للاطلاع على بياناتك الشخصية (الدرجات، الحضور، الجدول)، يرجى استخدام الأزرار السريعة أو اسأل بشكل محدد.\n`);
    } else {
      sections.push(`## 📌 Your Personal Data\n`);
      sections.push(`To view your personal data (grades, attendance, schedule), please use the quick action buttons or ask specifically.\n`);
    }
  }

  if (isAr) {
    // Arabic response
    if (isAboutSummary || (!isAboutTrainees && !isAboutAttendance && !isAboutFinance && !isAboutQuality && !isAboutTasks && !isAboutGPA && !isAboutRecommendations && !isAboutDepartments && !isAboutTrainers)) {
      sections.push(`## 📊 ملخص أداء الكلية\n`);
      sections.push(`**الأكاديمي:** ${data.academic.totalTrainees} متدرب (${data.academic.activeTrainees} نشط) | ${data.academic.totalTrainers} مدرب | ${data.academic.totalCourses} مقرر | المعدل التراكمي: ${data.academic.avgGPA}`);
      sections.push(`**الحضور:** معدل الحضور ${data.attendance.attendanceRate}% (من ${data.attendance.totalRecords} سجل)`);
      sections.push(`**المالية:** الميزانية ${data.financial.totalBudgetAllocated.toLocaleString("ar-SA")} ريال | المنفق ${data.financial.budgetUtilization}%`);
      sections.push(`**الجودة:** ${data.quality.exceeds + data.quality.meets} مؤشر محقق من ${data.quality.totalKpis} | الإنجاز ${data.quality.avgAchievementRate}%`);
      sections.push(`**المهام:** ${data.tasks.completed} مكتمل من ${data.tasks.total} | ${data.tasks.overdue} متأخر`);
    }

    if (isAboutTrainees && !blockedSections.includes("isAboutTrainees")) {
      sections.push(`## 👥 إحصائيات المتدربين\n`);
      sections.push(`- **الإجمالي:** ${data.academic.totalTrainees} متدرب`);
      sections.push(`- **نشط:** ${data.academic.activeTrainees} | **موقوف:** ${data.academic.suspendedTrainees} | **منسحب:** ${data.academic.withdrawnTrainees}`);
      sections.push(`- **التسجيلات:** ${data.academic.totalEnrollments}`);
      sections.push(`- **متوسط المعدل التراكمي:** ${data.academic.avgGPA}`);
      sections.push(`- **معدل النجاح:** ${data.academic.successRate}%`);
      if (data.departments.length > 0) {
        sections.push(`\n**التوزيع حسب الأقسام:**`);
        data.departments.forEach(d => {
          sections.push(`  • ${d.nameAr}: ${d.traineeCount} متدرب (معدل ${d.avgGPA})`);
        });
      }
    }

    if (isAboutTrainers && !blockedSections.includes("isAboutTrainers")) {
      sections.push(`## 👨‍🏫 إحصائيات المدربين\n`);
      sections.push(`- **الإجمالي:** ${data.academic.totalTrainers} مدرب (${data.academic.activeTrainers} نشط)`);
      sections.push(`- **الأقسام:** ${data.academic.totalDepartments} قسم نشط`);
      if (data.departments.length > 0) {
        sections.push(`\n**التوزيع حسب الأقسام:**`);
        data.departments.forEach(d => {
          sections.push(`  • ${d.nameAr}: ${d.trainerCount} مدرب | ${d.courseCount} مقرر`);
        });
      }
    }

    if (isAboutAttendance && !blockedSections.includes("isAboutAttendance")) {
      sections.push(`## 📋 تحليل الحضور\n`);
      sections.push(`- **معدل الحضور:** ${data.attendance.attendanceRate}%`);
      sections.push(`- **إجمالي السجلات:** ${data.attendance.totalRecords}`);
      sections.push(`- حاضر: ${data.attendance.presentCount} | غائب: ${data.attendance.absentCount} | متأخر: ${data.attendance.lateCount} | معذور: ${data.attendance.excusedCount}`);
      if (data.attendance.attendanceRate < 85) {
        sections.push(`\n⚠️ **تنبيه:** معدل الحضور أقل من الهدف (85%). يُنصح بمراجعة أسباب الغياب.`);
      }
    }

    if (isAboutFinance && !blockedSections.includes("isAboutFinance")) {
      sections.push(`## 💰 البيانات المالية\n`);
      sections.push(`- **الإيرادات:** ${data.financial.totalIncome.toLocaleString("ar-SA")} ريال`);
      sections.push(`- **المصروفات:** ${data.financial.totalExpenses.toLocaleString("ar-SA")} ريال`);
      sections.push(`- **الميزانية المخصصة:** ${data.financial.totalBudgetAllocated.toLocaleString("ar-SA")} ريال`);
      sections.push(`- **المنفق:** ${data.financial.totalBudgetSpent.toLocaleString("ar-SA")} ريال (${data.financial.budgetUtilization}%)`);
      sections.push(`- **معاملات معلقة:** ${data.financial.pendingTransactions}`);
    }

    if (isAboutQuality && !blockedSections.includes("isAboutQuality")) {
      sections.push(`## ✅ مؤشرات الجودة\n`);
      sections.push(`- **إجمالي المؤشرات:** ${data.quality.totalKpis}`);
      sections.push(`- متفوق: ${data.quality.exceeds} | محقق: ${data.quality.meets} | دون المستهدف: ${data.quality.below} | حرج: ${data.quality.critical}`);
      sections.push(`- **متوسط الإنجاز:** ${data.quality.avgAchievementRate}%`);
      sections.push(`- **ملاحظات التدقيق المفتوحة:** ${data.quality.openFindings.total} (حرجة: ${data.quality.openFindings.critical})`);
    }

    if (isAboutTasks && !blockedSections.includes("isAboutTasks")) {
      sections.push(`## 📝 المهام\n`);
      sections.push(`- **الإجمالي:** ${data.tasks.total} مهمة`);
      sections.push(`- قيد الانتظار: ${data.tasks.todo} | قيد التنفيذ: ${data.tasks.inProgress} | قيد المراجعة: ${data.tasks.inReview} | مكتمل: ${data.tasks.completed}`);
      if (data.tasks.overdue > 0) {
        sections.push(`\n⚠️ **${data.tasks.overdue} مهمة متأخرة** تحتاج متابعة عاجلة`);
      }
    }

    if (isAboutDepartments && !blockedSections.includes("isAboutDepartments")) {
      sections.push(`## 🏛️ أداء الأقسام\n`);
      data.departments.forEach(d => {
        sections.push(`### ${d.nameAr}`);
        sections.push(`  - المتدربون: ${d.traineeCount} | المدربون: ${d.trainerCount} | المقررات: ${d.courseCount} | المعدل: ${d.avgGPA}`);
      });
    }

    if (isAboutGPA && !blockedSections.includes("isAboutGPA")) {
      sections.push(`## 📈 الأداء الأكاديمي\n`);
      sections.push(`- **متوسط المعدل التراكمي:** ${data.academic.avgGPA}`);
      sections.push(`- **معدل النجاح:** ${data.academic.successRate}%`);
      if (data.departments.length > 0) {
        const sortedDepts = [...data.departments].sort((a, b) => b.avgGPA - a.avgGPA);
        sections.push(`\n**ترتيب الأقسام حسب المعدل:**`);
        sortedDepts.forEach((d, i) => {
          sections.push(`  ${i + 1}. ${d.nameAr}: ${d.avgGPA}`);
        });
      }
    }

    if (isAboutRecommendations) {
      sections.push(`## 💡 توصيات تحسين\n`);
      if (data.attendance.attendanceRate < 85) {
        sections.push(`1. **تحسين الحضور:** المعدل الحالي ${data.attendance.attendanceRate}% أقل من الهدف. فعّل نظام الإنذار المبكر.`);
      }
      if (data.academic.successRate < 90) {
        sections.push(`${sections.length > 1 ? '2' : '1'}. **رفع معدل النجاح:** المعدل الحالي ${data.academic.successRate}%. حدد المقررات ذات معدل الرسوب العالي.`);
      }
      if (data.quality.below > 0 || data.quality.critical > 0) {
        sections.push(`${sections.length > 1 ? '3' : '1'}. **مؤشرات الجودة:** ${data.quality.below + data.quality.critical} مؤشر دون المستهدف يحتاج متابعة.`);
      }
      if (data.tasks.overdue > 0) {
        sections.push(`${sections.length > 1 ? '4' : '1'}. **المهام المتأخرة:** ${data.tasks.overdue} مهمة متأخرة تحتاج تدخل فوري.`);
      }
      if (sections.length <= 1) {
        sections.push(`الأداء العام جيد. يُنصح بالمتابعة الدورية لمؤشرات الأداء.`);
      }
    }

    sections.push(`\n---\n*البيانات مستخرجة مباشرة من قاعدة بيانات الكلية — ${new Date().toLocaleDateString("ar-SA")}*`);

  } else {
    // English response
    if (isAboutSummary || (!isAboutTrainees && !isAboutAttendance && !isAboutFinance && !isAboutQuality && !isAboutTasks && !isAboutGPA && !isAboutRecommendations && !isAboutDepartments && !isAboutTrainers)) {
      sections.push(`## 📊 College Performance Summary\n`);
      sections.push(`**Academic:** ${data.academic.totalTrainees} trainees (${data.academic.activeTrainees} active) | ${data.academic.totalTrainers} trainers | ${data.academic.totalCourses} courses | GPA: ${data.academic.avgGPA}`);
      sections.push(`**Attendance:** ${data.attendance.attendanceRate}% rate (${data.attendance.totalRecords} records)`);
      sections.push(`**Financial:** Budget ${data.financial.totalBudgetAllocated.toLocaleString("en-US")} SAR | ${data.financial.budgetUtilization}% utilized`);
      sections.push(`**Quality:** ${data.quality.exceeds + data.quality.meets} of ${data.quality.totalKpis} KPIs on target | ${data.quality.avgAchievementRate}% avg`);
      sections.push(`**Tasks:** ${data.tasks.completed} completed of ${data.tasks.total} | ${data.tasks.overdue} overdue`);
    }

    if (isAboutTrainees && !blockedSections.includes("isAboutTrainees")) {
      sections.push(`## 👥 Trainee Statistics\n`);
      sections.push(`- **Total:** ${data.academic.totalTrainees}`);
      sections.push(`- **Active:** ${data.academic.activeTrainees} | **Suspended:** ${data.academic.suspendedTrainees} | **Withdrawn:** ${data.academic.withdrawnTrainees}`);
      sections.push(`- **Enrollments:** ${data.academic.totalEnrollments}`);
      sections.push(`- **Average GPA:** ${data.academic.avgGPA}`);
      sections.push(`- **Success Rate:** ${data.academic.successRate}%`);
      if (data.departments.length > 0) {
        sections.push(`\n**By Department:**`);
        data.departments.forEach(d => {
          sections.push(`  • ${d.nameEn}: ${d.traineeCount} trainees (GPA ${d.avgGPA})`);
        });
      }
    }

    if (isAboutAttendance && !blockedSections.includes("isAboutAttendance")) {
      sections.push(`## 📋 Attendance Analysis\n`);
      sections.push(`- **Rate:** ${data.attendance.attendanceRate}%`);
      sections.push(`- **Total Records:** ${data.attendance.totalRecords}`);
      sections.push(`- Present: ${data.attendance.presentCount} | Absent: ${data.attendance.absentCount} | Late: ${data.attendance.lateCount} | Excused: ${data.attendance.excusedCount}`);
      if (data.attendance.attendanceRate < 85) {
        sections.push(`\n⚠️ **Alert:** Attendance rate below 85% target. Review absence causes.`);
      }
    }

    if (isAboutFinance && !blockedSections.includes("isAboutFinance")) {
      sections.push(`## 💰 Financial Data\n`);
      sections.push(`- **Income:** ${data.financial.totalIncome.toLocaleString("en-US")} SAR`);
      sections.push(`- **Expenses:** ${data.financial.totalExpenses.toLocaleString("en-US")} SAR`);
      sections.push(`- **Budget Allocated:** ${data.financial.totalBudgetAllocated.toLocaleString("en-US")} SAR`);
      sections.push(`- **Spent:** ${data.financial.totalBudgetSpent.toLocaleString("en-US")} SAR (${data.financial.budgetUtilization}%)`);
      sections.push(`- **Pending Transactions:** ${data.financial.pendingTransactions}`);
    }

    if (isAboutQuality && !blockedSections.includes("isAboutQuality")) {
      sections.push(`## ✅ Quality KPIs\n`);
      sections.push(`- **Total KPIs:** ${data.quality.totalKpis}`);
      sections.push(`- Exceeds: ${data.quality.exceeds} | Meets: ${data.quality.meets} | Below: ${data.quality.below} | Critical: ${data.quality.critical}`);
      sections.push(`- **Average Achievement:** ${data.quality.avgAchievementRate}%`);
      sections.push(`- **Open Audit Findings:** ${data.quality.openFindings.total} (Critical: ${data.quality.openFindings.critical})`);
    }

    if (isAboutTasks && !blockedSections.includes("isAboutTasks")) {
      sections.push(`## 📝 Tasks\n`);
      sections.push(`- **Total:** ${data.tasks.total}`);
      sections.push(`- To Do: ${data.tasks.todo} | In Progress: ${data.tasks.inProgress} | In Review: ${data.tasks.inReview} | Completed: ${data.tasks.completed}`);
      if (data.tasks.overdue > 0) {
        sections.push(`\n⚠️ **${data.tasks.overdue} overdue tasks** need immediate attention`);
      }
    }

    if (isAboutDepartments && !blockedSections.includes("isAboutDepartments")) {
      sections.push(`## 🏛️ Department Performance\n`);
      data.departments.forEach(d => {
        sections.push(`### ${d.nameEn}`);
        sections.push(`  - Trainees: ${d.traineeCount} | Trainers: ${d.trainerCount} | Courses: ${d.courseCount} | GPA: ${d.avgGPA}`);
      });
    }

    if (isAboutGPA && !blockedSections.includes("isAboutGPA")) {
      sections.push(`## 📈 Academic Performance\n`);
      sections.push(`- **Average GPA:** ${data.academic.avgGPA}`);
      sections.push(`- **Success Rate:** ${data.academic.successRate}%`);
      if (data.departments.length > 0) {
        const sortedDepts = [...data.departments].sort((a, b) => b.avgGPA - a.avgGPA);
        sections.push(`\n**Departments Ranked by GPA:**`);
        sortedDepts.forEach((d, i) => {
          sections.push(`  ${i + 1}. ${d.nameEn}: ${d.avgGPA}`);
        });
      }
    }

    if (isAboutRecommendations) {
      sections.push(`## 💡 Improvement Recommendations\n`);
      if (data.attendance.attendanceRate < 85) {
        sections.push(`1. **Improve Attendance:** Current rate ${data.attendance.attendanceRate}% is below target. Activate early warning.`);
      }
      if (data.academic.successRate < 90) {
        sections.push(`2. **Raise Success Rate:** Current ${data.academic.successRate}%. Identify high-failure courses.`);
      }
      if (data.quality.below > 0 || data.quality.critical > 0) {
        sections.push(`3. **Quality KPIs:** ${data.quality.below + data.quality.critical} KPIs below target need attention.`);
      }
      if (data.tasks.overdue > 0) {
        sections.push(`4. **Overdue Tasks:** ${data.tasks.overdue} overdue tasks need immediate action.`);
      }
    }

    sections.push(`\n---\n*Data sourced directly from college database — ${new Date().toLocaleDateString("en-US")}*`);
  }

  return sections.join("\n");
}
