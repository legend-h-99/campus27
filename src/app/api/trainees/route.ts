import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const search = searchParams.get("search") || "";
    const department = searchParams.get("department") || "";
    const status = searchParams.get("status") || "";

    const where: Record<string, unknown> = { isActive: true };

    if (search) {
      where.OR = [
        { fullNameAr: { contains: search, mode: "insensitive" } },
        { fullNameEn: { contains: search, mode: "insensitive" } },
        { studentNumber: { contains: search, mode: "insensitive" } },
      ];
    }

    if (department) where.departmentId = department;
    if (status) where.status = status;

    const [trainees, total] = await Promise.all([
      prisma.trainee.findMany({
        where: where as any,
        include: {
          department: { select: { nameAr: true, nameEn: true } },
          user: { select: { email: true, avatar: true } },
        },
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { fullNameAr: "asc" },
      }),
      prisma.trainee.count({ where: where as any }),
    ]);

    return NextResponse.json({
      success: true,
      data: trainees,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to fetch trainees" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { hash } = await import("bcryptjs");
    const passwordHash = await hash("123456", 12);

    const user = await prisma.user.create({
      data: {
        email: body.email,
        passwordHash,
        nameAr: body.fullNameAr,
        nameEn: body.fullNameEn,
        role: "trainee",
        phone: body.phone,
      },
    });

    const trainee = await prisma.trainee.create({
      data: {
        userId: user.id,
        studentNumber: body.studentNumber,
        fullNameAr: body.fullNameAr,
        fullNameEn: body.fullNameEn,
        nationalId: body.nationalId,
        departmentId: body.departmentId,
        level: body.level || 1,
        enrollmentDate: new Date(body.enrollmentDate || Date.now()),
        phone: body.phone,
        guardianPhone: body.guardianPhone,
      },
      include: {
        department: { select: { nameAr: true, nameEn: true } },
      },
    });

    return NextResponse.json({ success: true, data: trainee }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to create trainee" },
      { status: 500 }
    );
  }
}
