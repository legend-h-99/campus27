"use client";

/**
 * Permission Guard Components
 *
 * Conditionally renders UI elements based on the user's active RBAC permissions.
 * Elements are fully hidden (not just visually) when the user lacks permission,
 * satisfying the requirement that UI elements must not be visible OR accessible
 * for unpermitted users.
 *
 * Usage:
 *   <PermissionGate permissions={[PERMISSIONS.USERS_CREATE]}>
 *     <CreateUserButton />
 *   </PermissionGate>
 *
 *   <RoleGate roles={["super_admin", "it_admin"]}>
 *     <AdminPanel />
 *   </RoleGate>
 */

import { useSession } from "next-auth/react";
import type { ReactNode } from "react";
import { hasAnyPermission, hasAllPermissions, type Permission, type Role } from "@/lib/permissions";

// ─────────────────────────────────────────────
// PermissionGate — hides children without required permission(s)
// ─────────────────────────────────────────────

interface PermissionGateProps {
  /** One or more permissions to check. Default logic: user must have ANY one of them. */
  permissions: Permission[];
  /** When true, the user must hold ALL listed permissions (instead of any). */
  requireAll?: boolean;
  /** Fallback rendered when access is denied (default: nothing). */
  fallback?: ReactNode;
  children: ReactNode;
}

export function PermissionGate({
  permissions,
  requireAll = false,
  fallback = null,
  children,
}: PermissionGateProps) {
  const { data: session, status } = useSession();

  if (status === "loading") return null;

  const userPermissions: Permission[] = session?.user?.permissions ?? [];

  const allowed = requireAll
    ? hasAllPermissions(userPermissions, permissions)
    : hasAnyPermission(userPermissions, permissions);

  return allowed ? <>{children}</> : <>{fallback}</>;
}

// ─────────────────────────────────────────────
// RoleGate — hides children unless user holds one of the specified roles
// ─────────────────────────────────────────────

interface RoleGateProps {
  /** Roles that are permitted to see the children. */
  roles: Role[];
  /** Fallback rendered when access is denied (default: nothing). */
  fallback?: ReactNode;
  children: ReactNode;
}

export function RoleGate({ roles, fallback = null, children }: RoleGateProps) {
  const { data: session, status } = useSession();

  if (status === "loading") return null;

  const userRole = session?.user?.role;
  const allowed = userRole ? roles.includes(userRole as Role) : false;

  return allowed ? <>{children}</> : <>{fallback}</>;
}

// ─────────────────────────────────────────────
// usePermission — hook for inline permission checks
// ─────────────────────────────────────────────

export function usePermission(permission: Permission): boolean {
  const { data: session } = useSession();
  const userPermissions: Permission[] = session?.user?.permissions ?? [];
  return hasAnyPermission(userPermissions, [permission]);
}

export function usePermissions(permissions: Permission[], requireAll = false): boolean {
  const { data: session } = useSession();
  const userPermissions: Permission[] = session?.user?.permissions ?? [];
  return requireAll
    ? hasAllPermissions(userPermissions, permissions)
    : hasAnyPermission(userPermissions, permissions);
}

export function useRole(): Role | undefined {
  const { data: session } = useSession();
  return session?.user?.role as Role | undefined;
}
