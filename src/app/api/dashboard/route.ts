import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const [
      trainersCount,
      traineesCount,
      departmentsCount,
      coursesCount,
      activeTrainers,
      activeTrainees,
      pendingTasks,
      unreadNotifications,
    ] = await Promise.all([
      prisma.trainer.count({ where: { isActive: true } }),
      prisma.trainee.count({ where: { isActive: true } }),
      prisma.department.count({ where: { isActive: true } }),
      prisma.course.count({ where: { isActive: true } }),
      prisma.trainer.count({ where: { status: "ACTIVE" } }),
      prisma.trainee.count({ where: { status: "ACTIVE" } }),
      prisma.task.count({ where: { status: { in: ["TODO", "IN_PROGRESS"] } } }),
      prisma.notification.count({ where: { isRead: false } }),
    ]);

    return NextResponse.json({
      success: true,
      data: {
        trainersCount,
        traineesCount,
        departmentsCount,
        coursesCount,
        activeTrainers,
        activeTrainees,
        pendingTasks,
        unreadNotifications,
      },
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to fetch dashboard data" },
      { status: 500 }
    );
  }
}
