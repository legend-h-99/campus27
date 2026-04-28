import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { hash } from "bcryptjs";

// One-time setup endpoint — creates admin user if none exists.
// Protected by SETUP_SECRET env var (defaults to AUTH_SECRET).
export async function POST(request: NextRequest) {
  const secret = process.env.SETUP_SECRET || process.env.AUTH_SECRET;
  const authHeader = request.headers.get("x-setup-secret");

  if (!secret || authHeader !== secret) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const existing = await prisma.user.findUnique({
    where: { email: "admin@campus27.sa" },
  });

  if (existing) {
    return NextResponse.json({ message: "Already seeded", skipped: true });
  }

  const passwordHash = await hash("123456", 12);

  await prisma.user.createMany({
    data: [
      {
        email: "admin@campus27.sa",
        passwordHash,
        nameAr: "مدير النظام",
        nameEn: "System Admin",
        role: "super_admin",
        phone: "0500000000",
        status: "ACTIVE",
      },
      {
        email: "dean@campus27.sa",
        passwordHash,
        nameAr: "د. أحمد بن محمد العتيبي",
        nameEn: "Dr. Ahmed Al-Otaibi",
        role: "dean",
        phone: "0501234567",
        status: "ACTIVE",
      },
      {
        email: "vp.trainers@campus27.sa",
        passwordHash,
        nameAr: "د. سعد بن عبدالله الغامدي",
        nameEn: "Dr. Saad Al-Ghamdi",
        role: "vp_trainers",
        phone: "0502345678",
        status: "ACTIVE",
      },
    ],
  });

  return NextResponse.json({
    success: true,
    message: "Admin users created successfully",
    users: [
      "admin@campus27.sa",
      "dean@campus27.sa",
      "vp.trainers@campus27.sa",
    ],
    password: "123456",
  });
}
