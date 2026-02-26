import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export interface SearchResult {
  id: string;
  title: string;
  subtitle?: string;
  type: "trainee" | "trainer" | "course" | "department" | "task" | "project" | "page";
  href: string;
  icon?: string;
}

export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const q = req.nextUrl.searchParams.get("q")?.trim();
  if (!q || q.length < 2) {
    return NextResponse.json({ results: [] });
  }

  const results: SearchResult[] = [];

  try {
    // Search trainees
    const trainees = await prisma.trainee.findMany({
      where: {
        OR: [
          { fullNameAr: { contains: q, mode: "insensitive" } },
          { fullNameEn: { contains: q, mode: "insensitive" } },
          { studentNumber: { contains: q, mode: "insensitive" } },
        ],
      },
      take: 5,
      select: { id: true, fullNameAr: true, studentNumber: true },
    });
    trainees.forEach((t) =>
      results.push({
        id: t.id,
        title: t.fullNameAr,
        subtitle: t.studentNumber,
        type: "trainee",
        href: `/trainees`,
        icon: "GraduationCap",
      })
    );

    // Search trainers
    const trainers = await prisma.trainer.findMany({
      where: {
        OR: [
          { fullNameAr: { contains: q, mode: "insensitive" } },
          { fullNameEn: { contains: q, mode: "insensitive" } },
          { employeeNumber: { contains: q, mode: "insensitive" } },
        ],
      },
      take: 5,
      select: { id: true, fullNameAr: true, employeeNumber: true },
    });
    trainers.forEach((t) =>
      results.push({
        id: t.id,
        title: t.fullNameAr,
        subtitle: t.employeeNumber,
        type: "trainer",
        href: `/trainers`,
        icon: "Users",
      })
    );

    // Search courses
    const courses = await prisma.course.findMany({
      where: {
        OR: [
          { nameAr: { contains: q, mode: "insensitive" } },
          { nameEn: { contains: q, mode: "insensitive" } },
          { courseCode: { contains: q, mode: "insensitive" } },
        ],
      },
      take: 5,
      select: { id: true, nameAr: true, courseCode: true },
    });
    courses.forEach((c) =>
      results.push({
        id: c.id,
        title: c.nameAr,
        subtitle: c.courseCode,
        type: "course",
        href: `/courses`,
        icon: "BookOpen",
      })
    );

    // Search departments
    const departments = await prisma.department.findMany({
      where: {
        OR: [
          { nameAr: { contains: q, mode: "insensitive" } },
          { nameEn: { contains: q, mode: "insensitive" } },
        ],
      },
      take: 3,
      select: { id: true, nameAr: true },
    });
    departments.forEach((d) =>
      results.push({
        id: d.id,
        title: d.nameAr,
        type: "department",
        href: `/departments`,
        icon: "Building2",
      })
    );

    // Static page results
    const pages = [
      { title: "لوحة التحكم", href: "/", icon: "LayoutDashboard" },
      { title: "المالية", href: "/finance", icon: "DollarSign" },
      { title: "الجودة", href: "/quality", icon: "Award" },
      { title: "الموارد البشرية", href: "/hr", icon: "UserCog" },
      { title: "التقارير", href: "/reports", icon: "BarChart3" },
      { title: "الذكاء الاصطناعي", href: "/ai", icon: "Brain" },
      { title: "الجداول", href: "/schedules", icon: "Calendar" },
      { title: "المهام", href: "/tasks", icon: "CheckSquare" },
      { title: "المشاريع", href: "/projects", icon: "FolderKanban" },
    ];
    pages
      .filter((p) => p.title.includes(q) || p.href.includes(q))
      .forEach((p) =>
        results.push({
          id: p.href,
          title: p.title,
          type: "page",
          href: p.href,
          icon: p.icon,
        })
      );

    return NextResponse.json({ results: results.slice(0, 15) });
  } catch (error) {
    console.error("Search error:", error);
    return NextResponse.json({ results: [] });
  }
}
