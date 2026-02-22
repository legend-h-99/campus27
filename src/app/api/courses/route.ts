import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const courses = await prisma.course.findMany({
      where: { isActive: true },
      include: {
        department: { select: { nameAr: true, nameEn: true } },
        _count: { select: { schedules: true, enrollments: true } },
      },
      orderBy: { courseCode: "asc" },
    });

    return NextResponse.json({ success: true, data: courses });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to fetch courses" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const course = await prisma.course.create({
      data: {
        courseCode: body.courseCode,
        nameAr: body.nameAr,
        nameEn: body.nameEn,
        descriptionAr: body.descriptionAr,
        descriptionEn: body.descriptionEn,
        departmentId: body.departmentId,
        credits: body.credits || 3,
        hours: body.hours || 3,
        level: body.level || 1,
      },
    });

    return NextResponse.json({ success: true, data: course }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to create course" },
      { status: 500 }
    );
  }
}
