import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { PERMISSIONS } from "@/lib/permissions";
import { guardRequest } from "@/lib/authorization";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const check = await guardRequest(request, [PERMISSIONS.QUALITY_PLANS_CREATE], "quality_improvement_actions", "POST");
  if (!check.ok) return check.response;

  try {
    const { id } = await params;
    const body = await request.json();

    const plan = await prisma.improvementPlan.findUnique({ where: { id } });
    if (!plan) {
      return NextResponse.json({ success: false, error: "Improvement plan not found" }, { status: 404 });
    }

    const action = await prisma.improvementAction.create({
      data: {
        planId: id,
        descriptionAr: body.descriptionAr,
        responsiblePerson: body.responsiblePerson,
        startDate: body.startDate ? new Date(body.startDate) : undefined,
        dueDate: body.dueDate ? new Date(body.dueDate) : undefined,
      },
    });

    return NextResponse.json({ success: true, data: action }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to create improvement action" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const check = await guardRequest(request, [PERMISSIONS.QUALITY_PLANS_CREATE], "quality_improvement_actions", "PATCH");
  if (!check.ok) return check.response;

  try {
    const { id } = await params;
    const { searchParams } = new URL(request.url);
    const actionId = searchParams.get("actionId");

    if (!actionId) {
      return NextResponse.json(
        { success: false, error: "actionId query parameter is required" },
        { status: 400 }
      );
    }

    const body = await request.json();

    const existingAction = await prisma.improvementAction.findFirst({
      where: { id: actionId, planId: id },
    });

    if (!existingAction) {
      return NextResponse.json({ success: false, error: "Action not found in this plan" }, { status: 404 });
    }

    const data: Record<string, unknown> = {};
    if (body.status !== undefined) data.status = body.status;
    if (body.completionPercentage !== undefined) data.completionPercentage = body.completionPercentage;
    if (body.completionDate !== undefined) data.completionDate = new Date(body.completionDate);
    if (body.notes !== undefined) data.notes = body.notes;
    if (body.descriptionAr !== undefined) data.descriptionAr = body.descriptionAr;
    if (body.responsiblePerson !== undefined) data.responsiblePerson = body.responsiblePerson;
    if (body.dueDate !== undefined) data.dueDate = new Date(body.dueDate);

    const action = await prisma.improvementAction.update({ where: { id: actionId }, data });

    return NextResponse.json({ success: true, data: action });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to update improvement action" },
      { status: 500 }
    );
  }
}
