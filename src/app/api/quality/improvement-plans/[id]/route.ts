import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const plan = await prisma.improvementPlan.findUnique({
      where: { id },
      include: {
        owner: {
          select: { id: true, fullNameAr: true, fullNameEn: true },
        },
        createdBy: {
          select: { id: true, fullNameAr: true, fullNameEn: true },
        },
        relatedFinding: {
          select: { id: true, descriptionAr: true, severity: true, status: true },
        },
        actions: {
          orderBy: { createdAt: "asc" },
        },
      },
    });

    if (!plan) {
      return NextResponse.json(
        { success: false, error: "Improvement plan not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: plan });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to fetch improvement plan" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    const data: Record<string, unknown> = {};
    if (body.status !== undefined) data.status = body.status;
    if (body.progressPercentage !== undefined) data.progressPercentage = body.progressPercentage;
    if (body.titleAr !== undefined) data.titleAr = body.titleAr;
    if (body.titleEn !== undefined) data.titleEn = body.titleEn;
    if (body.descriptionAr !== undefined) data.descriptionAr = body.descriptionAr;
    if (body.objectives !== undefined) data.objectives = body.objectives;
    if (body.ownerId !== undefined) data.ownerId = body.ownerId;
    if (body.budget !== undefined) data.budget = body.budget;
    if (body.startDate !== undefined) data.startDate = new Date(body.startDate);
    if (body.targetCompletionDate !== undefined)
      data.targetCompletionDate = new Date(body.targetCompletionDate);
    if (body.actualCompletionDate !== undefined)
      data.actualCompletionDate = new Date(body.actualCompletionDate);

    const plan = await prisma.improvementPlan.update({
      where: { id },
      data,
    });

    return NextResponse.json({ success: true, data: plan });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to update improvement plan" },
      { status: 500 }
    );
  }
}
