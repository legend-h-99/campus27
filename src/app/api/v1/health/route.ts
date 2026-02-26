import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  const start = Date.now();
  const requestId = crypto.randomUUID();

  return NextResponse.json(
    {
      success: true,
      data: {
        status: "operational" as const,
        region: process.env.VERCEL_REGION ?? process.env.REGION ?? "local",
        timestamp: new Date().toISOString(),
      },
      error: null,
      meta: { requestId, durationMs: Date.now() - start },
    },
    {
      headers: {
        "Cache-Control": "no-store",
        "X-Request-Id": requestId,
      },
    }
  );
}
