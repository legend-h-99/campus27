// src/app/api/v1/workflows/[id]/nodes/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

type Ctx = { params: Promise<{ id: string }> };
interface NodeInput {
  type: string;
  title: string;
  description?: string;
  position: number;
  config?: Record<string, unknown>;
}

export async function PUT(req: NextRequest, { params }: Ctx) {
  const start = Date.now();
  const requestId = crypto.randomUUID();
  const { id } = await params;
  try {
    const body = await req.json();
    const { nodes } = body as { nodes: NodeInput[] };

    if (!Array.isArray(nodes)) {
      return NextResponse.json(
        { success: false, data: null, error: { code: "INVALID_BODY", message: "nodes array required" }, meta: { requestId, durationMs: Date.now() - start } },
        { status: 400 }
      );
    }

    // Verify workflow exists
    const workflow = await prisma.workflow.findUnique({ where: { id } });
    if (!workflow) {
      return NextResponse.json(
        { success: false, data: null, error: { code: "NOT_FOUND", message: "Workflow not found" }, meta: { requestId, durationMs: Date.now() - start } },
        { status: 404 }
      );
    }

    // Atomic replace: delete all existing nodes, then create new
    await prisma.$transaction([
      prisma.workflowNode.deleteMany({ where: { workflowId: id } }),
      prisma.workflowNode.createMany({
        data: nodes.map((n, i) => ({
          workflowId: id,
          type: n.type,
          title: n.title,
          description: n.description ?? null,
          position: n.position ?? i,
          config: n.config ?? {},
        })),
      }),
    ]);

    const updated = await prisma.workflow.findUnique({
      where: { id },
      include: { nodes: { orderBy: { position: "asc" } } },
    });
    return NextResponse.json({ success: true, data: updated, error: null, meta: { requestId, durationMs: Date.now() - start } });
  } catch (err) {
    console.error("[workflows/[id]/nodes PUT]", err);
    return NextResponse.json({ success: false, data: null, error: { code: "INTERNAL", message: "Internal server error" }, meta: { requestId, durationMs: Date.now() - start } }, { status: 500 });
  }
}
