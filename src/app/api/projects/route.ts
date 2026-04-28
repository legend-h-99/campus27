import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { PERMISSIONS } from "@/lib/permissions";
import { guardRequest } from "@/lib/authorization";

export async function GET(request: NextRequest) {
  const check = await guardRequest(request, [PERMISSIONS.PROJECTS_VIEW], "projects", "GET");
  if (!check.ok) return check.response;

  try {
    const projects = await prisma.project.findMany({
      include: {
        manager: { select: { nameAr: true, nameEn: true } },
        _count: { select: { tasks: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ success: true, data: projects });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to fetch projects" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  const check = await guardRequest(request, [PERMISSIONS.PROJECTS_CREATE], "projects", "POST");
  if (!check.ok) return check.response;

  try {
    const body = await request.json();
    const project = await prisma.project.create({
      data: {
        nameAr: body.nameAr,
        nameEn: body.nameEn,
        descriptionAr: body.descriptionAr,
        descriptionEn: body.descriptionEn,
        managerId: body.managerId,
        startDate: body.startDate ? new Date(body.startDate) : null,
        endDate: body.endDate ? new Date(body.endDate) : null,
        budget: body.budget,
        status: body.status || "PLANNING",
      },
    });

    return NextResponse.json({ success: true, data: project }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to create project" },
      { status: 500 }
    );
  }
}
