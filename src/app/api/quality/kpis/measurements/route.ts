import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const kpiId = searchParams.get("kpiId");
    const status = searchParams.get("status");
    const from = searchParams.get("from");
    const to = searchParams.get("to");
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "20", 10);
    const skip = (page - 1) * limit;

    const where: Record<string, unknown> = {};
    if (kpiId) where.kpiId = kpiId;
    if (status) where.status = status;
    if (from || to) {
      where.measurementDate = {};
      if (from) (where.measurementDate as Record<string, unknown>).gte = new Date(from);
      if (to) (where.measurementDate as Record<string, unknown>).lte = new Date(to);
    }

    const [measurements, total] = await Promise.all([
      prisma.kpiMeasurement.findMany({
        where,
        include: {
          kpi: { select: { id: true, kpiCode: true, nameAr: true, nameEn: true } },
        },
        orderBy: { measurementDate: "desc" },
        skip,
        take: limit,
      }),
      prisma.kpiMeasurement.count({ where }),
    ]);

    return NextResponse.json({
      success: true,
      data: measurements,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to fetch KPI measurements" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Fetch the KPI to auto-calculate status
    const kpi = await prisma.qualityKpi.findUnique({
      where: { id: body.kpiId },
    });

    if (!kpi) {
      return NextResponse.json(
        { success: false, error: "KPI not found" },
        { status: 404 }
      );
    }

    const actualValue = body.actualValue;
    const targetValue = body.targetValue ?? kpi.targetValue;
    const achievementRate = targetValue > 0 ? (actualValue / targetValue) * 100 : 0;

    // Auto-calculate status based on achievement
    let status: "EXCEEDS" | "MEETS" | "BELOW" | "CRITICAL";
    if (achievementRate >= 100) {
      status = "EXCEEDS";
    } else if (kpi.minAcceptableValue !== null && actualValue >= kpi.minAcceptableValue) {
      status = "MEETS";
    } else if (achievementRate >= 50) {
      status = "BELOW";
    } else {
      status = "CRITICAL";
    }

    const measurement = await prisma.kpiMeasurement.create({
      data: {
        kpiId: body.kpiId,
        measurementDate: new Date(body.measurementDate),
        actualValue,
        targetValue,
        achievementRate: Math.round(achievementRate * 100) / 100,
        status,
        notes: body.notes,
      },
    });

    return NextResponse.json({ success: true, data: measurement }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to create KPI measurement" },
      { status: 500 }
    );
  }
}
