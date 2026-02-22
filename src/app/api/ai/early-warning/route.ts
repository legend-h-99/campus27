/**
 * Early Warning API
 * نقطة نهاية نظام الإنذار المبكر
 *
 * GET /api/ai/early-warning?locale=ar&departmentId=xxx
 * Returns risk assessments for active trainees
 */

import { NextRequest } from "next/server";
import { assessAllTrainees } from "@/services/ai/early-warning";
import { checkRateLimit } from "@/lib/ai-config";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const locale = searchParams.get("locale") || "ar";
    const departmentId = searchParams.get("departmentId") || undefined;

    // TODO: Replace with actual session auth
    const userId = "system";
    if (!checkRateLimit(userId)) {
      return Response.json(
        { error: "Rate limit exceeded" },
        { status: 429 }
      );
    }

    const report = await assessAllTrainees(locale, departmentId);

    return Response.json(report);
  } catch (error) {
    console.error("[AI Early Warning] Error:", error);
    return Response.json(
      { error: "Failed to generate early warning report" },
      { status: 500 }
    );
  }
}
