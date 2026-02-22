/**
 * Switch User API
 * تبديل المستخدم بدون تسجيل خروج
 *
 * This endpoint allows quick user switching for demo/development purposes.
 * In production, this should be restricted to super_admin only.
 */

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { compare } from "bcryptjs";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    // Find the target user
    const user = await prisma.user.findUnique({
      where: { email: email as string },
    });

    if (!user || user.status !== "ACTIVE") {
      return NextResponse.json(
        { error: "User not found or inactive" },
        { status: 404 }
      );
    }

    // Validate password
    const isValid = await compare(password as string, user.passwordHash);
    if (!isValid) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      );
    }

    // Update last login
    await prisma.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() },
    });

    // Return success - the client will use signIn() with these credentials
    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        nameAr: user.nameAr,
        nameEn: user.nameEn,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("[switch-user] Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json(
    { error: "Method not allowed" },
    { status: 405 }
  );
}
