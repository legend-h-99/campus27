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
import { PERMISSIONS } from "@/lib/permissions";
import { guardRequest } from "@/lib/authorization";

export async function GET(request: NextRequest) {
  const check = await guardRequest(request, [PERMISSIONS.AI_CHAT], "ai_recommendations", "GET");
  if (!check.ok) return check.response as any;
  const { session } = check;

  try {
    const { searchParams } = new URL(request.url);
    const locale = searchParams.get("locale") || "ar";
    const role = searchParams.get("role") || "dean";

    const userId = session.user.id;
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
