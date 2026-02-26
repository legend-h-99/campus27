// src/app/api/v1/workflows/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function POST(req: NextRequest) {
  const start = Date.now();
  const requestId = crypto.randomUUID();
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, data: null, error: { code: "UNAUTHORIZED", message: "Unauthorized" }, meta: { requestId, durationMs: Date.now() - start } },
        { status: 401 }
      );
    }
    const body = await req.json();
    const { name, description, role, schedule } = body as {
      name: string;
      description?: string;
      role?: string;
      schedule?: string;
    };
    if (!name) {
      return NextResponse.json(
        { success: false, data: null, error: { code: "MISSING_FIELDS", message: "name is required" }, meta: { requestId, durationMs: Date.now() - start } },
        { status: 400 }
      );
    }
    const workflow = await prisma.workflow.create({
      data: { name, description: description ?? null, role: role ?? null, schedule: schedule ?? null, createdById: session.user.id },
      include: { nodes: { orderBy: { position: "asc" } } },
    });
    return NextResponse.json(
      { success: true, data: workflow, error: null, meta: { requestId, durationMs: Date.now() - start } },
      { status: 201 }
    );
  } catch (err) {
    console.error("[workflows POST]", err);
    return NextResponse.json(
      { success: false, data: null, error: { code: "INTERNAL", message: "Internal server error" }, meta: { requestId, durationMs: Date.now() - start } },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  const start = Date.now();
  const requestId = crypto.randomUUID();
  try {
    const { searchParams } = new URL(req.url);
    const page = Math.max(1, Number(searchParams.get("page") ?? "1"));
    const limit = Math.min(50, Math.max(1, Number(searchParams.get("limit") ?? "20")));
    const skip = (page - 1) * limit;

    const [workflows, total] = await Promise.all([
      prisma.workflow.findMany({
        skip,
        take: limit,
        orderBy: { updatedAt: "desc" },
        include: { nodes: { orderBy: { position: "asc" } } },
      }),
      prisma.workflow.count(),
    ]);
    return NextResponse.json({
      success: true,
      data: { workflows, total, page, limit },
      error: null,
      meta: { requestId, durationMs: Date.now() - start },
    });
  } catch (err) {
    console.error("[workflows GET]", err);
    return NextResponse.json(
      { success: false, data: null, error: { code: "INTERNAL", message: "Internal server error" }, meta: { requestId, durationMs: Date.now() - start } },
      { status: 500 }
    );
  }
}
