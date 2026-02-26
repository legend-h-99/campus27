import { NextRequest, NextResponse } from "next/server";

// Lightweight A/B assignment without DB (deterministic by sessionId + experimentKey)
// For full persistence, integrate with Prisma ExperimentAssignment model.

const EXPERIMENTS: Record<string, string[]> = {
  hero_headline:   ["control", "variant_a", "variant_b"],
  cta_color:       ["signal", "steel"],
  features_order:  ["standard", "reversed"],
};

function assignVariant(sessionId: string, experimentKey: string): string {
  const variants = EXPERIMENTS[experimentKey];
  if (!variants?.length) return "control";
  // Deterministic hash: simple djb2
  let hash = 5381;
  const str = `${sessionId}:${experimentKey}`;
  for (let i = 0; i < str.length; i++) {
    hash = (hash * 33) ^ str.charCodeAt(i);
  }
  return variants[Math.abs(hash) % variants.length];
}

export async function GET(req: NextRequest) {
  const start = Date.now();
  const requestId = crypto.randomUUID();

  const { searchParams } = new URL(req.url);
  const sessionId = searchParams.get("sessionId");
  const keys = searchParams.getAll("experimentKeys[]");

  if (!sessionId) {
    return NextResponse.json(
      {
        success: false,
        data: null,
        error: { code: "MISSING_SESSION", message: "sessionId required" },
        meta: { requestId, durationMs: Date.now() - start },
      },
      { status: 400 }
    );
  }

  const variants: Record<string, string> = {};
  const targetKeys = keys.length > 0 ? keys : Object.keys(EXPERIMENTS);

  for (const key of targetKeys) {
    variants[key] = assignVariant(sessionId, key);
  }

  return NextResponse.json(
    {
      success: true,
      data: { variants },
      error: null,
      meta: { requestId, durationMs: Date.now() - start },
    },
    {
      headers: { "Cache-Control": "no-store", "X-Request-Id": requestId },
    }
  );
}
