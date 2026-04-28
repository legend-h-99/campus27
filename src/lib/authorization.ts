/**
 * Centralized Authorization Middleware
 *
 * Provides:
 * - guardRequest()  — inline auth + permission check used directly in route handlers
 * - withAuth()      — wraps API route handlers with auth + RBAC permission checks + audit logging
 * - createAuditLog() — records successful and failed access attempts
 * - requirePermissions() — validates a session against required permissions
 */

import { NextRequest, NextResponse } from "next/server";
import type { Session } from "next-auth";
import { auth } from "@/lib/auth";
import {
  hasAnyPermission,
  type Permission,
  type Role,
} from "@/lib/permissions";
import { prisma } from "@/lib/prisma";

// ─────────────────────────────────────────────
// Typed session used throughout this module
// ─────────────────────────────────────────────

type AuthedSession = Session & {
  user: Session["user"] & {
    id: string;
    role: string;
    permissions: Permission[];
  };
};

// ─────────────────────────────────────────────
// Audit Log helpers
// ─────────────────────────────────────────────

export interface AuditLogParams {
  userId?: string;
  userRole?: string;
  action: string;
  entity: string;
  entityId?: string;
  success: boolean;
  description?: string;
  ipAddress?: string;
  oldValues?: unknown;
  newValues?: unknown;
  metadata?: unknown;
}

export async function createAuditLog(params: AuditLogParams): Promise<void> {
  try {
    await prisma.auditLog.create({
      data: {
        userId: params.userId ?? null,
        userRole: params.userRole ?? null,
        action: params.action,
        entity: params.entity,
        entityId: params.entityId ?? null,
        success: params.success,
        description: params.description ?? null,
        ipAddress: params.ipAddress ?? null,
        oldValues: params.oldValues ? (params.oldValues as any) : undefined,
        newValues: params.newValues ? (params.newValues as any) : undefined,
        metadata: params.metadata ? (params.metadata as any) : undefined,
      },
    });
  } catch {
    // audit logging must never break the main flow
  }
}

function getIpAddress(request: NextRequest): string | undefined {
  return (
    request.headers.get("x-forwarded-for")?.split(",")[0].trim() ||
    request.headers.get("x-real-ip") ||
    undefined
  );
}

// ─────────────────────────────────────────────
// Standard error responses
// ─────────────────────────────────────────────

export function unauthorizedResponse(): NextResponse {
  return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
}

export function forbiddenResponse(): NextResponse {
  return NextResponse.json({ success: false, error: "Forbidden" }, { status: 403 });
}

/**
 * Checks authentication and (optionally) permissions inline.
 * Returns `{ ok: true, session }` or `{ ok: false, response }`.
 *
 * Usage inside a route handler:
 * ```ts
 * const check = await guardRequest(request, [PERMISSIONS.TRAINERS_VIEW], "trainers", "GET");
 * if (!check.ok) return check.response;
 * const { session } = check;
 * ```
 */
export async function guardRequest(
  request: NextRequest,
  permissions: Permission[],
  entity: string,
  action?: string
): Promise<
  | { ok: true; session: AuthedSession }
  | { ok: false; response: NextResponse }
> {
  const ip = getIpAddress(request);
  const method = action ?? request.method;

  const rawSession = await auth();
  const session = rawSession as AuthedSession | null;

  if (!session?.user?.id) {
    await createAuditLog({
      action: method,
      entity,
      success: false,
      description: "Unauthenticated request",
      ipAddress: ip,
      metadata: { path: request.nextUrl.pathname },
    });
    return { ok: false, response: unauthorizedResponse() };
  }

  if (permissions.length > 0 && !hasAnyPermission(session.user.permissions, permissions)) {
    await createAuditLog({
      userId: session.user.id,
      userRole: session.user.role,
      action: method,
      entity,
      success: false,
      description: `Access denied — missing permissions: ${permissions.join(", ")}`,
      ipAddress: ip,
      metadata: { path: request.nextUrl.pathname, required: permissions },
    });
    return { ok: false, response: forbiddenResponse() };
  }

  return { ok: true, session };
}

// ─────────────────────────────────────────────
// withAuth — route handler wrapper
// ─────────────────────────────────────────────

type RouteHandler = (
  request: NextRequest,
  context: { session: AuthedSession; params?: unknown }
) => Promise<NextResponse> | NextResponse;

interface WithAuthOptions {
  permissions?: Permission[];
  entity?: string;
  action?: string;
  skipAudit?: boolean;
}

/**
 * Wraps a Next.js App Router handler with auth + permission checks + audit logging.
 */
export function withAuth(
  handler: RouteHandler,
  options: WithAuthOptions = {}
): (request: NextRequest, context?: unknown) => Promise<NextResponse> {
  return async (request: NextRequest, context?: unknown) => {
    const ip = getIpAddress(request);
    const entity = options.entity ?? request.nextUrl.pathname;
    const action = options.action ?? request.method;

    const rawSession = await auth();
    const session = rawSession as AuthedSession | null;

    if (!session?.user?.id) {
      if (!options.skipAudit) {
        await createAuditLog({
          action,
          entity,
          success: false,
          description: "Unauthenticated request",
          ipAddress: ip,
          metadata: { path: request.nextUrl.pathname },
        });
      }
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    if (
      options.permissions &&
      options.permissions.length > 0 &&
      !hasAnyPermission(session.user.permissions, options.permissions)
    ) {
      if (!options.skipAudit) {
        await createAuditLog({
          userId: session.user.id,
          userRole: session.user.role,
          action,
          entity,
          success: false,
          description: `Access denied — missing permissions: ${options.permissions.join(", ")}`,
          ipAddress: ip,
          metadata: { path: request.nextUrl.pathname, required: options.permissions },
        });
      }
      return NextResponse.json({ success: false, error: "Forbidden" }, { status: 403 });
    }

    const routeContext = { session, params: (context as any)?.params };

    try {
      const response = await handler(request, routeContext);

      if (!options.skipAudit) {
        const isSuccess = response.status < 400;
        await createAuditLog({
          userId: session.user.id,
          userRole: session.user.role,
          action,
          entity,
          success: isSuccess,
          description: isSuccess
            ? `${action} ${entity} — success`
            : `${action} ${entity} — failed (status ${response.status})`,
          ipAddress: ip,
          metadata: { path: request.nextUrl.pathname, status: response.status },
        });
      }

      return response;
    } catch (err) {
      if (!options.skipAudit) {
        await createAuditLog({
          userId: session.user.id,
          userRole: session.user.role,
          action,
          entity,
          success: false,
          description: `${action} ${entity} — unhandled error`,
          ipAddress: ip,
          metadata: {
            path: request.nextUrl.pathname,
            error: err instanceof Error ? err.message : String(err),
          },
        });
      }
      throw err;
    }
  };
}

// ─────────────────────────────────────────────
// requirePermissions — for Server Components / server actions
// ─────────────────────────────────────────────

export interface AuthorizedSession {
  userId: string;
  userRole: Role;
  permissions: Permission[];
}

export async function requirePermissions(
  requiredPermissions: Permission[]
): Promise<AuthorizedSession> {
  const rawSession = await auth();
  const session = rawSession as AuthedSession | null;

  if (!session?.user?.id) {
    throw { status: 401, message: "Unauthorized" };
  }

  if (
    requiredPermissions.length > 0 &&
    !hasAnyPermission(session.user.permissions, requiredPermissions)
  ) {
    throw { status: 403, message: "Forbidden" };
  }

  return {
    userId: session.user.id,
    userRole: session.user.role as Role,
    permissions: session.user.permissions,
  };
}
