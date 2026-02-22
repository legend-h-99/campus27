import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const surveyType = searchParams.get("surveyType");
    const status = searchParams.get("status");

    const where: Record<string, unknown> = {};
    if (surveyType) where.surveyType = surveyType;
    if (status) where.status = status;

    const surveys = await prisma.qualitySurvey.findMany({
      where,
      include: {
        _count: { select: { responses: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ success: true, data: surveys });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to fetch surveys" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const survey = await prisma.qualitySurvey.create({
      data: {
        titleAr: body.titleAr,
        titleEn: body.titleEn,
        surveyType: body.surveyType,
        targetAudience: body.targetAudience,
        departmentId: body.departmentId,
        semester: body.semester,
        academicYear: body.academicYear,
        questions: body.questions,
        startDate: body.startDate ? new Date(body.startDate) : undefined,
        endDate: body.endDate ? new Date(body.endDate) : undefined,
      },
    });

    return NextResponse.json({ success: true, data: survey }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to create survey" },
      { status: 500 }
    );
  }
}
