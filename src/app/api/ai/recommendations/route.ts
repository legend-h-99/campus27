/**
 * AI Recommendations API
 * نقطة نهاية التوصيات الذكية
 *
 * GET /api/ai/recommendations?locale=ar&role=dean
 * Returns actionable recommendations based on data
 */

import { NextRequest } from "next/server";
import { getRecommendations } from "@/services/ai/recommendations";
import { checkRateLimit } from "@/lib/ai-config";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const locale = searchParams.get("locale") || "ar";
    const role = searchParams.get("role") || "dean";

    // TODO: Replace with actual session auth
    const userId = "system";
    if (!checkRateLimit(userId)) {
      return Response.json(
        { error: "Rate limit exceeded" },
        { status: 429 }
      );
    }

    const report = await getRecommendations(role, locale);

    return Response.json(report);
  } catch (error) {
    console.error("[AI Recommendations] Error:", error);
    return Response.json(
      { error: "Failed to generate recommendations" },
      { status: 500 }
    );
  }
}
