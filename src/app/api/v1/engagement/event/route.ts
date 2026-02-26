import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const ALLOWED_ORIGINS = process.env.ALLOWED_ORIGINS?.split(",").map((o) => o.trim()) ?? [];

function corsHeaders(origin: string | null) {
  const allowed =
    !origin ||
    ALLOWED_ORIGINS.length === 0 ||
    ALLOWED_ORIGINS.some((o) => origin.startsWith(o));
  return allowed
    ? { "Access-Control-Allow-Origin": origin ?? "*", "Access-Control-Allow-Methods": "POST, OPTIONS" }
    : {};
}

export async function OPTIONS(req: NextRequest) {
  return new NextResponse(null, {
    status: 204,
    headers: corsHeaders(req.headers.get("origin")),
  });
}

export async function POST(req: NextRequest) {
  const start = Date.now();
  const requestId = crypto.randomUUID();
  const origin = req.headers.get("origin");

  try {
    const body = await req.json();
    const { sessionId, eventType, payload, occurredAt } = body as {
      sessionId: string;
      eventType: string;
      payload: Record<string, unknown>;
      occurredAt: string;
    };

    if (!sessionId || !eventType || !occurredAt) {
      return NextResponse.json(
        { success: false, data: null, error: { code: "INVALID_BODY", message: "sessionId, eventType, occurredAt required" }, meta: { requestId, durationMs: Date.now() - start } },
        { status: 400, headers: corsHeaders(origin) }
      );
    }

    // Upsert session then record event
    await prisma.session.upsert({
      where: { id: sessionId },
      create: {
        id: sessionId,
        userAgent: req.headers.get("user-agent") ?? undefined,
      },
      update: {},
    });

    await prisma.event.create({
      data: {
        sessionId,
        type: eventType,
        payload: payload ?? {},
        occurredAt: new Date(occurredAt),
      },
    });

    return NextResponse.json(
      { success: true, data: { recorded: true }, error: null, meta: { requestId, durationMs: Date.now() - start } },
      { status: 201, headers: corsHeaders(origin) }
    );
  } catch (err) {
    console.error("[engagement/event]", err);
    return NextResponse.json(
      { success: false, data: null, error: { code: "INTERNAL", message: "Internal server error" }, meta: { requestId, durationMs: Date.now() - start } },
      { status: 500, headers: corsHeaders(origin) }
    );
  }
}
