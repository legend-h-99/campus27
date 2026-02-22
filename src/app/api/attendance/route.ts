import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");
    const search = searchParams.get("search") || "";
    const status = searchParams.get("status") || "";
    const department = searchParams.get("department") || "";
    const date = searchParams.get("date") || "";
    const locale = searchParams.get("locale") || "ar";

    // Build where clause
    const where: Record<string, unknown> = {};

    if (status && status !== "all") {
      where.status = status.toUpperCase();
    }

    if (date) {
      const startOfDay = new Date(date);
      startOfDay.setHours(0, 0, 0, 0);
      const endOfDay = new Date(date);
      endOfDay.setHours(23, 59, 59, 999);
      where.date = { gte: startOfDay, lte: endOfDay };
    }

    // Build enrollment filter for search and department
    const enrollmentWhere: Record<string, unknown> = {};

    if (search) {
      enrollmentWhere.trainee = {
        OR: [
          { fullNameAr: { contains: search, mode: "insensitive" } },
          { fullNameEn: { contains: search, mode: "insensitive" } },
          { studentNumber: { contains: search, mode: "insensitive" } },
        ],
      };
    }

    if (department && department !== "all") {
      enrollmentWhere.trainee = {
        ...(enrollmentWhere.trainee as object || {}),
        departmentId: department,
      };
    }

    if (Object.keys(enrollmentWhere).length > 0) {
      where.enrollment = enrollmentWhere;
    }

    // Get attendance records with related data
    const [records, total] = await Promise.all([
      prisma.attendance.findMany({
        where: where as any,
        include: {
          enrollment: {
            include: {
              trainee: {
                include: {
                  department: {
                    select: { id: true, nameAr: true, nameEn: true },
                  },
                },
              },
              course: {
                select: { nameAr: true, nameEn: true, courseCode: true },
              },
            },
          },
          schedule: {
            select: { startTime: true, endTime: true, room: true },
          },
        },
        skip: (page - 1) * limit,
        take: limit,
        orderBy: [{ date: "desc" }, { createdAt: "desc" }],
      }),
      prisma.attendance.count({ where: where as any }),
    ]);

    // Get stats for the filtered date (or overall)
    const statsWhere: Record<string, unknown> = {};
    if (date) {
      const startOfDay = new Date(date);
      startOfDay.setHours(0, 0, 0, 0);
      const endOfDay = new Date(date);
      endOfDay.setHours(23, 59, 59, 999);
      statsWhere.date = { gte: startOfDay, lte: endOfDay };
    }
    if (department && department !== "all") {
      statsWhere.enrollment = { trainee: { departmentId: department } };
    }

    const [totalCount, presentCount, absentCount, lateCount, excusedCount] =
      await Promise.all([
        prisma.attendance.count({ where: statsWhere as any }),
        prisma.attendance.count({
          where: { ...statsWhere, status: "PRESENT" } as any,
        }),
        prisma.attendance.count({
          where: { ...statsWhere, status: "ABSENT" } as any,
        }),
        prisma.attendance.count({
          where: { ...statsWhere, status: "LATE" } as any,
        }),
        prisma.attendance.count({
          where: { ...statsWhere, status: "EXCUSED" } as any,
        }),
      ]);

    // Get departments for filter dropdown
    const departments = await prisma.department.findMany({
      where: { isActive: true },
      select: { id: true, nameAr: true, nameEn: true },
      orderBy: { nameAr: "asc" },
    });

    // Format records
    const formattedRecords = records.map((r) => ({
      id: r.id,
      traineeId: r.enrollment.trainee.id,
      traineeName:
        locale === "ar"
          ? r.enrollment.trainee.fullNameAr
          : r.enrollment.trainee.fullNameEn,
      studentNumber: r.enrollment.trainee.studentNumber,
      department:
        locale === "ar"
          ? r.enrollment.trainee.department.nameAr
          : r.enrollment.trainee.department.nameEn,
      departmentId: r.enrollment.trainee.department.id,
      course:
        locale === "ar"
          ? r.enrollment.course.nameAr
          : r.enrollment.course.nameEn,
      courseCode: r.enrollment.course.courseCode,
      date: r.date.toISOString().split("T")[0],
      status: r.status.toLowerCase() as
        | "present"
        | "absent"
        | "late"
        | "excused",
      time: r.schedule?.startTime || undefined,
      excuse: r.excuse || undefined,
      room: r.schedule?.room || undefined,
    }));

    return NextResponse.json({
      success: true,
      data: formattedRecords,
      stats: {
        total: totalCount,
        present: presentCount,
        absent: absentCount,
        late: lateCount,
        excused: excusedCount,
        rate:
          totalCount > 0
            ? Math.round((presentCount / totalCount) * 100)
            : 0,
      },
      departments: departments.map((d) => ({
        id: d.id,
        name: locale === "ar" ? d.nameAr : d.nameEn,
      })),
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Attendance API error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch attendance records" },
      { status: 500 }
    );
  }
}
