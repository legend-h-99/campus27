import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { PERMISSIONS } from "@/lib/permissions";
import { guardRequest } from "@/lib/authorization";

export async function GET(request: NextRequest) {
  const check = await guardRequest(request, [PERMISSIONS.NOTIFICATIONS_VIEW], "notifications", "GET");
  if (!check.ok) return check.response;
  const { session } = check;

  try {
    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");

    const [notifications, total, unreadCount] = await Promise.all([
      prisma.notification.findMany({
        where: { receiverId: session.user.id },
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.notification.count({ where: { receiverId: session.user.id } }),
      prisma.notification.count({
        where: { receiverId: session.user.id, isRead: false },
      }),
    ]);

    return NextResponse.json({
      success: true,
      data: notifications,
      unreadCount,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to fetch notifications" },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  const check = await guardRequest(request, [PERMISSIONS.NOTIFICATIONS_VIEW], "notifications", "PATCH");
  if (!check.ok) return check.response;
  const { session } = check;

  try {
    const body = await request.json();

    if (body.markAllRead) {
      await prisma.notification.updateMany({
        where: { receiverId: session.user.id, isRead: false },
        data: { isRead: true },
      });
    } else if (body.notificationId) {
      await prisma.notification.update({
        where: { id: body.notificationId },
        data: { isRead: true },
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to update notifications" },
      { status: 500 }
    );
  }
}
