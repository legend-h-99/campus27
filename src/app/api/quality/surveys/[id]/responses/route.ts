import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { PERMISSIONS } from "@/lib/permissions";
import { guardRequest } from "@/lib/authorization";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const check = await guardRequest(request, [PERMISSIONS.QUALITY_SURVEYS_ANALYZE], "quality_survey_responses", "GET");
  if (!check.ok) return check.response;

  try {
    const { id } = await params;

    const [responses, avgSatisfaction] = await Promise.all([
      prisma.surveyResponse.findMany({
        where: { surveyId: id },
        orderBy: { responseDate: "desc" },
      }),
      prisma.surveyResponse.aggregate({
        where: { surveyId: id },
        _avg: { satisfactionScore: true },
      }),
    ]);

    return NextResponse.json({
      success: true,
      data: {
        responses,
        avgSatisfaction: avgSatisfaction._avg.satisfactionScore || 0,
        totalResponses: responses.length,
      },
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to fetch survey responses" },
      { status: 500 }
    );
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const check = await guardRequest(request, [PERMISSIONS.QUALITY_SURVEYS_VIEW], "quality_survey_responses", "POST");
  if (!check.ok) return check.response;

  try {
    const { id } = await params;
    const body = await request.json();

    const survey = await prisma.qualitySurvey.findUnique({ where: { id } });
    if (!survey) {
      return NextResponse.json({ success: false, error: "Survey not found" }, { status: 404 });
    }

    const response = await prisma.surveyResponse.create({
      data: {
        surveyId: id,
        respondentType: body.respondentType,
        responses: body.responses,
        satisfactionScore: body.satisfactionScore,
        comments: body.comments,
      },
    });

    await prisma.qualitySurvey.update({
      where: { id },
      data: { totalResponses: { increment: 1 } },
    });

    return NextResponse.json({ success: true, data: response }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to submit survey response" },
      { status: 500 }
    );
  }
}
