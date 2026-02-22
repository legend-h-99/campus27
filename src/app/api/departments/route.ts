import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const departments = await prisma.department.findMany({
      where: { isActive: true },
      include: {
        head: { select: { nameAr: true, nameEn: true } },
        _count: { select: { trainers: true, trainees: true, courses: true } },
      },
      orderBy: { nameAr: "asc" },
    });

    return NextResponse.json({ success: true, data: departments });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to fetch departments" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const department = await prisma.department.create({
      data: {
        nameAr: body.nameAr,
        nameEn: body.nameEn,
        descriptionAr: body.descriptionAr,
        descriptionEn: body.descriptionEn,
        capacity: body.capacity || 0,
        headId: body.headId,
      },
    });

    return NextResponse.json({ success: true, data: department }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to create department" },
      { status: 500 }
    );
  }
}
