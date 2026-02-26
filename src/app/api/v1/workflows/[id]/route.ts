// src/app/api/v1/workflows/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

type Ctx = { params: Promise<{ id: string }> };

export async function GET(_req: NextRequest, { params }: Ctx) {
  const start = Date.now();
  const requestId = crypto.randomUUID();
  const { id } = await params;
  try {
    const workflow = await prisma.workflow.findUnique({
      where: { id },
      include: { nodes: { orderBy: { position: "asc" } } },
    });
    if (!workflow) {
      return NextResponse.json(
        { success: false, data: null, error: { code: "NOT_FOUND", message: "Workflow not found" }, meta: { requestId, durationMs: Date.now() - start } },
        { status: 404 }
      );
    }
    return NextResponse.json({ success: true, data: workflow, error: null, meta: { requestId, durationMs: Date.now() - start } });
  } catch (err) {
    console.error("[workflows/[id] GET]", err);
    return NextResponse.json({ success: false, data: null, error: { code: "INTERNAL", message: "Internal server error" }, meta: { requestId, durationMs: Date.now() - start } }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest, { params }: Ctx) {
  const start = Date.now();
  const requestId = crypto.randomUUID();
  const { id } = await params;
  try {
    const body = await req.json();
    const { name, description, status, role, schedule } = body as {
      name?: string; description?: string; status?: string; role?: string; schedule?: string;
    };
    const workflow = await prisma.workflow.update({
      where: { id },
      data: {
        ...(name !== undefined && { name }),
        ...(description !== undefined && { description }),
        ...(status !== undefined && { status }),
        ...(role !== undefined && { role }),
        ...(schedule !== undefined && { schedule }),
      },
      include: { nodes: { orderBy: { position: "asc" } } },
    });
    return NextResponse.json({ success: true, data: workflow, error: null, meta: { requestId, durationMs: Date.now() - start } });
  } catch (err) {
    console.error("[workflows/[id] PATCH]", err);
    return NextResponse.json({ success: false, data: null, error: { code: "INTERNAL", message: "Internal server error" }, meta: { requestId, durationMs: Date.now() - start } }, { status: 500 });
  }
}

export async function DELETE(_req: NextRequest, { params }: Ctx) {
  const start = Date.now();
  const requestId = crypto.randomUUID();
  const { id } = await params;
  try {
    await prisma.workflow.delete({ where: { id } });
    return NextResponse.json({ success: true, data: { deleted: true }, error: null, meta: { requestId, durationMs: Date.now() - start } });
  } catch (err) {
    console.error("[workflows/[id] DELETE]", err);
    return NextResponse.json({ success: false, data: null, error: { code: "INTERNAL", message: "Internal server error" }, meta: { requestId, durationMs: Date.now() - start } }, { status: 500 });
  }
}
