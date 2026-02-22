import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const findings = await prisma.auditFinding.findMany({
      where: { auditId: id },
      include: {
        standard: {
          select: { id: true, standardCode: true, nameAr: true, nameEn: true, category: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ success: true, data: findings });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to fetch audit findings" },
      { status: 500 }
    );
  }
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    // Verify audit exists
    const audit = await prisma.qualityAudit.findUnique({
      where: { id },
    });

    if (!audit) {
      return NextResponse.json(
        { success: false, error: "Audit not found" },
        { status: 404 }
      );
    }

    const finding = await prisma.auditFinding.create({
      data: {
        auditId: id,
        findingType: body.findingType,
        severity: body.severity,
        descriptionAr: body.descriptionAr,
        descriptionEn: body.descriptionEn,
        standardId: body.standardId,
        evidence: body.evidence,
        recommendationAr: body.recommendationAr,
        responsibleDept: body.responsibleDept,
        dueDate: body.dueDate ? new Date(body.dueDate) : undefined,
      },
    });

    return NextResponse.json({ success: true, data: finding }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to create audit finding" },
      { status: 500 }
    );
  }
}
