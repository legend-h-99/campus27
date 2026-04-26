import { NextResponse, type NextRequest } from "next/server";
import createIntlMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";
import { auth } from "@/lib/auth";

const intlMiddleware = createIntlMiddleware(routing);

// Routes that require authentication (dashboard section)
const PROTECTED_PREFIXES = ["/ar/admin", "/en/admin", "/ar/trainees", "/en/trainees",
  "/ar/trainers", "/en/trainers", "/ar/quality", "/en/quality", "/ar/grades", "/en/grades",
  "/ar/attendance", "/en/attendance", "/ar/finance", "/en/finance", "/ar/courses", "/en/courses",
  "/ar/schedules", "/en/schedules", "/ar/hr", "/en/hr", "/ar/tasks", "/en/tasks",
  "/ar/projects", "/en/projects", "/ar/ai", "/en/ai", "/ar/elearning", "/en/elearning",
  "/ar/research", "/en/research", "/ar/community", "/en/community", "/ar/reports", "/en/reports",
  "/ar/notifications", "/en/notifications", "/ar/departments", "/en/departments",
  "/ar/settings", "/en/settings",
];

// Public routes that never require auth
const PUBLIC_PREFIXES = ["/ar/login", "/en/login", "/ar/register", "/en/register"];

function isProtected(pathname: string): boolean {
  return PROTECTED_PREFIXES.some((prefix) => pathname === prefix || pathname.startsWith(prefix + "/"));
}

function isPublic(pathname: string): boolean {
  return PUBLIC_PREFIXES.some((prefix) => pathname === prefix || pathname.startsWith(prefix + "/"));
}

export default async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Always run intl middleware first
  const intlResponse = intlMiddleware(request);

  // Skip auth check for public routes
  if (isPublic(pathname)) {
    return intlResponse;
  }

  // Enforce auth on protected page routes
  if (isProtected(pathname)) {
    const session = await auth();

    if (!session?.user?.id) {
      // Determine locale from pathname
      const locale = pathname.startsWith("/en") ? "en" : "ar";
      const loginUrl = new URL(`/${locale}/login`, request.url);
      loginUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  return intlResponse;
}

export const config = {
  // Match all routes except static files, API routes, and Next.js internals
  matcher: ["/((?!api|_next|_vercel|.*\\..*).*)"],
};
