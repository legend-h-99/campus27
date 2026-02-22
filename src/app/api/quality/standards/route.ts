import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");

    const where: Record<string, unknown> = {};
    if (category) {
      where.category = category;
    }

    const standards = await prisma.qualityStandard.findMany({
      where,
      include: {
        _count: { select: { kpis: true } },
      },
      orderBy: { weight: "desc" },
    });

    return NextResponse.json({ success: true, data: standards });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to fetch quality standards" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const standard = await prisma.qualityStandard.create({
      data: {
        standardCode: body.standardCode,
        nameAr: body.nameAr,
        nameEn: body.nameEn,
        category: body.category,
        descriptionAr: body.descriptionAr,
        weight: body.weight,
        ncaaaVersion: body.ncaaaVersion,
      },
    });

    return NextResponse.json({ success: true, data: standard }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to create quality standard" },
      { status: 500 }
    );
  }
}
