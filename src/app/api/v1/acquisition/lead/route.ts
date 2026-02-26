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
  return new NextResponse(null, { status: 204, headers: corsHeaders(req.headers.get("origin")) });
}

export async function POST(req: NextRequest) {
  const start = Date.now();
  const requestId = crypto.randomUUID();
  const origin = req.headers.get("origin");

  try {
    const body = await req.json();
    const { name, email, intent, utm, metadata, sessionId } = body as {
      name?: string;
      email: string;
      intent?: string;
      utm?: { source?: string; medium?: string; campaign?: string };
      metadata?: { aestheticPreset?: string; viewedSections?: string[]; experiments?: Record<string, string> };
      sessionId?: string;
    };

    if (!email || !email.includes("@")) {
      return NextResponse.json(
        { success: false, data: null, error: { code: "INVALID_EMAIL", message: "Valid email required" }, meta: { requestId, durationMs: Date.now() - start } },
        { status: 400, headers: corsHeaders(origin) }
      );
    }

    // Upsert session if provided
    if (sessionId) {
      await prisma.session.upsert({
        where: { id: sessionId },
        create: { id: sessionId, userAgent: req.headers.get("user-agent") ?? undefined },
        update: {},
      });
    }

    const lead = await prisma.lead.create({
      data: {
        email,
        name: name ?? null,
        intent: intent ?? null,
        utm: utm ?? {},
        metadata: metadata ?? {},
        sessionId: sessionId ?? null,
      },
    });

    return NextResponse.json(
      { success: true, data: { id: lead.id }, error: null, meta: { requestId, durationMs: Date.now() - start } },
      { status: 201, headers: corsHeaders(origin) }
    );
  } catch (err: unknown) {
    // P2002 = unique constraint (duplicate email)
    if ((err as { code?: string }).code === "P2002") {
      return NextResponse.json(
        { success: true, data: { duplicate: true }, error: null, meta: { requestId, durationMs: Date.now() - start } },
        { status: 200, headers: corsHeaders(origin) }
      );
    }
    console.error("[acquisition/lead]", err);
    return NextResponse.json(
      { success: false, data: null, error: { code: "INTERNAL", message: "Internal server error" }, meta: { requestId, durationMs: Date.now() - start } },
      { status: 500, headers: corsHeaders(origin) }
    );
  }
}
