import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { PERMISSIONS } from "@/lib/permissions";
import { guardRequest } from "@/lib/authorization";

/**
 * GET /api/audit-logs
 * Returns paginated audit log entries.
 * Accessible only to roles with dashboard:admin permission (super_admin, dean, it_admin).
 *
 * Query params:
 *   page, limit, userId, entity, success (true|false), role, from, to
 */
export async function GET(request: NextRequest) {
  const check = await guardRequest(request, [PERMISSIONS.DASHBOARD_ADMIN], "audit_logs", "GET");
  if (!check.ok) return check.response;

  try {
    const { searchParams } = request.nextUrl;
    const page = parseInt(searchParams.get("page") || "1");
    const limit = Math.min(parseInt(searchParams.get("limit") || "50"), 100);
    const userId = searchParams.get("userId") || undefined;
    const entity = searchParams.get("entity") || undefined;
    const roleFilter = searchParams.get("role") || undefined;
    const successParam = searchParams.get("success");
    const from = searchParams.get("from") || undefined;
    const to = searchParams.get("to") || undefined;

    const where: Record<string, unknown> = {};
    if (userId) where.userId = userId;
    if (entity) where.entity = { contains: entity, mode: "insensitive" };
    if (roleFilter) where.userRole = roleFilter;
    if (successParam !== null && successParam !== undefined) {
      where.success = successParam === "true";
    }
    if (from || to) {
      where.createdAt = {};
      if (from) (where.createdAt as Record<string, unknown>).gte = new Date(from);
      if (to) (where.createdAt as Record<string, unknown>).lte = new Date(to);
    }

    const [logs, total, failedCount] = await Promise.all([
      prisma.auditLog.findMany({
        where: where as any,
        include: {
          user: { select: { nameAr: true, nameEn: true, email: true } },
        },
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.auditLog.count({ where: where as any }),
      prisma.auditLog.count({ where: { ...where, success: false } as any }),
    ]);

    return NextResponse.json({
      success: true,
      data: logs,
      stats: { total, failed: failedCount, succeeded: total - failedCount },
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to fetch audit logs" },
      { status: 500 }
    );
  }
}
