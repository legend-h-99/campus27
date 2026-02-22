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
    const course = searchParams.get("course") || "";
    const locale = searchParams.get("locale") || "ar";

    // Build where clause
    const where: Record<string, unknown> = {};

    if (status && status !== "all") {
      where.status = status.toUpperCase();
    }

    // Build enrollment filter
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

    if (course && course !== "all") {
      enrollmentWhere.courseId = course;
    }

    if (Object.keys(enrollmentWhere).length > 0) {
      where.enrollment = enrollmentWhere;
    }

    // Get grades with related data
    const [grades, total] = await Promise.all([
      prisma.grade.findMany({
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
                select: { id: true, nameAr: true, nameEn: true, courseCode: true },
              },
              semester: {
                select: { id: true, nameAr: true, nameEn: true },
              },
            },
          },
          approvedBy: {
            select: { nameAr: true, nameEn: true },
          },
        },
        skip: (page - 1) * limit,
        take: limit,
        orderBy: [{ updatedAt: "desc" }],
      }),
      prisma.grade.count({ where: where as any }),
    ]);

    // Get stats
    const statsWhere: Record<string, unknown> = {};
    if (department && department !== "all") {
      statsWhere.enrollment = { trainee: { departmentId: department } };
    }
    if (course && course !== "all") {
      statsWhere.enrollment = {
        ...(statsWhere.enrollment as object || {}),
        courseId: course,
      };
    }

    const [totalGrades, draftCount, submittedCount, approvedCount, rejectedCount] =
      await Promise.all([
        prisma.grade.count({ where: statsWhere as any }),
        prisma.grade.count({ where: { ...statsWhere, status: "DRAFT" } as any }),
        prisma.grade.count({ where: { ...statsWhere, status: "SUBMITTED" } as any }),
        prisma.grade.count({ where: { ...statsWhere, status: "APPROVED" } as any }),
        prisma.grade.count({ where: { ...statsWhere, status: "REJECTED" } as any }),
      ]);

    // Get departments & courses for filters
    const [departments, courses] = await Promise.all([
      prisma.department.findMany({
        where: { isActive: true },
        select: { id: true, nameAr: true, nameEn: true },
        orderBy: { nameAr: "asc" },
      }),
      prisma.course.findMany({
        where: { isActive: true },
        select: { id: true, nameAr: true, nameEn: true, courseCode: true },
        orderBy: { courseCode: "asc" },
      }),
    ]);

    // Calculate average
    const gradesWithTotal = await prisma.grade.findMany({
      where: { ...statsWhere, totalGrade: { not: null } } as any,
      select: { totalGrade: true },
    });
    const avgGrade = gradesWithTotal.length > 0
      ? Math.round(
          (gradesWithTotal.reduce((sum, g) => sum + (g.totalGrade || 0), 0) /
            gradesWithTotal.length) * 10
        ) / 10
      : 0;

    // Format grades
    const formattedGrades = grades.map((g) => ({
      id: g.id,
      enrollmentId: g.enrollmentId,
      traineeId: g.enrollment.trainee.id,
      traineeName:
        locale === "ar"
          ? g.enrollment.trainee.fullNameAr
          : g.enrollment.trainee.fullNameEn,
      studentNumber: g.enrollment.trainee.studentNumber,
      department:
        locale === "ar"
          ? g.enrollment.trainee.department.nameAr
          : g.enrollment.trainee.department.nameEn,
      departmentId: g.enrollment.trainee.department.id,
      course:
        locale === "ar"
          ? g.enrollment.course.nameAr
          : g.enrollment.course.nameEn,
      courseCode: g.enrollment.course.courseCode,
      courseId: g.enrollment.course.id,
      semester:
        locale === "ar"
          ? g.enrollment.semester.nameAr
          : g.enrollment.semester.nameEn,
      midtermGrade: g.midtermGrade,
      finalGrade: g.finalGrade,
      assignmentsGrade: g.assignmentsGrade,
      attendanceGrade: g.attendanceGrade,
      totalGrade: g.totalGrade,
      letterGrade: g.letterGrade,
      status: g.status.toLowerCase(),
      approvedBy: g.approvedBy
        ? locale === "ar"
          ? g.approvedBy.nameAr
          : g.approvedBy.nameEn
        : null,
      approvedDate: g.approvedDate?.toISOString().split("T")[0] || null,
      remarks: g.remarks,
      updatedAt: g.updatedAt.toISOString().split("T")[0],
    }));

    return NextResponse.json({
      success: true,
      data: formattedGrades,
      stats: {
        total: totalGrades,
        draft: draftCount,
        submitted: submittedCount,
        approved: approvedCount,
        rejected: rejectedCount,
        average: avgGrade,
      },
      departments: departments.map((d) => ({
        id: d.id,
        name: locale === "ar" ? d.nameAr : d.nameEn,
      })),
      courses: courses.map((c) => ({
        id: c.id,
        name: locale === "ar" ? c.nameAr : c.nameEn,
        code: c.courseCode,
      })),
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Grades API error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch grades" },
      { status: 500 }
    );
  }
}
