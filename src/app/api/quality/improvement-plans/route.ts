import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    const planType = searchParams.get("planType");

    const where: Record<string, unknown> = {};
    if (status) where.status = status;
    if (planType) where.planType = planType;

    const plans = await prisma.improvementPlan.findMany({
      where,
      include: {
        owner: {
          select: { id: true, fullNameAr: true, fullNameEn: true },
        },
        _count: { select: { actions: true } },
        relatedFinding: {
          select: { id: true, descriptionAr: true, severity: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ success: true, data: plans });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to fetch improvement plans" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const plan = await prisma.improvementPlan.create({
      data: {
        titleAr: body.titleAr,
        titleEn: body.titleEn,
        planType: body.planType,
        relatedFindingId: body.relatedFindingId,
        departmentId: body.departmentId,
        descriptionAr: body.descriptionAr,
        objectives: body.objectives,
        startDate: body.startDate ? new Date(body.startDate) : undefined,
        targetCompletionDate: body.targetCompletionDate
          ? new Date(body.targetCompletionDate)
          : undefined,
        ownerId: body.ownerId,
        budget: body.budget,
      },
    });

    return NextResponse.json({ success: true, data: plan }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to create improvement plan" },
      { status: 500 }
    );
  }
}
