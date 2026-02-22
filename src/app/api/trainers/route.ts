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
        { employeeNumber: { contains: search, mode: "insensitive" } },
      ];
    }

    if (department) {
      where.departmentId = department;
    }

    if (status) {
      where.status = status;
    }

    const [trainers, total] = await Promise.all([
      prisma.trainer.findMany({
        where: where as any,
        include: {
          department: { select: { nameAr: true, nameEn: true } },
          user: { select: { email: true, avatar: true } },
        },
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { fullNameAr: "asc" },
      }),
      prisma.trainer.count({ where: where as any }),
    ]);

    return NextResponse.json({
      success: true,
      data: trainers,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to fetch trainers" },
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
        role: "trainer",
        phone: body.phone,
      },
    });

    const trainer = await prisma.trainer.create({
      data: {
        userId: user.id,
        employeeNumber: body.employeeNumber,
        fullNameAr: body.fullNameAr,
        fullNameEn: body.fullNameEn,
        departmentId: body.departmentId,
        specialization: body.specialization,
        qualificationAr: body.qualificationAr,
        qualificationEn: body.qualificationEn,
        hireDate: new Date(body.hireDate),
        phone: body.phone,
      },
      include: {
        department: { select: { nameAr: true, nameEn: true } },
      },
    });

    return NextResponse.json({ success: true, data: trainer }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to create trainer" },
      { status: 500 }
    );
  }
}
