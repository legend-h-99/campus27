import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const status = searchParams.get("status") || "";
    const priority = searchParams.get("priority") || "";

    const where: Record<string, unknown> = {};
    if (status) where.status = status;
    if (priority) where.priority = priority;

    const tasks = await prisma.task.findMany({
      where: where as any,
      include: {
        assignedTo: { select: { nameAr: true, nameEn: true, avatar: true } },
        assignedBy: { select: { nameAr: true, nameEn: true } },
        project: { select: { nameAr: true, nameEn: true } },
      },
      orderBy: [{ priority: "desc" }, { createdAt: "desc" }],
    });

    return NextResponse.json({ success: true, data: tasks });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to fetch tasks" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const task = await prisma.task.create({
      data: {
        titleAr: body.titleAr,
        titleEn: body.titleEn,
        descriptionAr: body.descriptionAr,
        descriptionEn: body.descriptionEn,
        assignedToId: body.assignedToId,
        assignedById: body.assignedById,
        priority: body.priority || "MEDIUM",
        status: body.status || "TODO",
        dueDate: body.dueDate ? new Date(body.dueDate) : null,
        projectId: body.projectId,
      },
    });

    return NextResponse.json({ success: true, data: task }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to create task" },
      { status: 500 }
    );
  }
}
