import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const standardId = searchParams.get("standardId");
    const frequency = searchParams.get("frequency");
    const isActive = searchParams.get("isActive");

    const where: Record<string, unknown> = {};
    if (standardId) where.standardId = standardId;
    if (frequency) where.frequency = frequency;
    if (isActive !== null && isActive !== undefined && isActive !== "") {
      where.isActive = isActive === "true";
    }

    const kpis = await prisma.qualityKpi.findMany({
      where,
      include: {
        standard: {
          select: {
            id: true,
            standardCode: true,
            nameAr: true,
            nameEn: true,
            category: true,
          },
        },
        measurements: {
          take: 1,
          orderBy: { measurementDate: "desc" },
        },
      },
      orderBy: { kpiCode: "asc" },
    });

    return NextResponse.json({ success: true, data: kpis });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to fetch KPIs" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const kpi = await prisma.qualityKpi.create({
      data: {
        standardId: body.standardId,
        kpiCode: body.kpiCode,
        nameAr: body.nameAr,
        nameEn: body.nameEn,
        descriptionAr: body.descriptionAr,
        measurementUnit: body.measurementUnit,
        targetValue: body.targetValue,
        minAcceptableValue: body.minAcceptableValue,
        calculationMethod: body.calculationMethod,
        dataSource: body.dataSource,
        frequency: body.frequency || "SEMESTER",
        responsibleDept: body.responsibleDept,
      },
    });

    return NextResponse.json({ success: true, data: kpi }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to create KPI" },
      { status: 500 }
    );
  }
}
