import type { PrismaClient } from "@prisma/client";

export async function seedAdminUsers(
  prisma: PrismaClient,
  passwordHash: string
) {
  console.log("  Seeding admin & VP users...");

  const superAdmin = await prisma.user.upsert({
    where: { email: "admin@campus26.sa" },
    update: {},
    create: {
      email: "admin@campus26.sa",
      passwordHash,
      nameAr: "مدير النظام",
      nameEn: "System Admin",
      role: "super_admin",
      phone: "0500000000",
    },
  });

  const dean = await prisma.user.upsert({
    where: { email: "dean@campus26.sa" },
    update: {},
    create: {
      email: "dean@campus26.sa",
      passwordHash,
      nameAr: "د. أحمد بن محمد العتيبي",
      nameEn: "Dr. Ahmed Al-Otaibi",
      role: "dean",
      phone: "0501234567",
    },
  });

  const vpTrainers = await prisma.user.upsert({
    where: { email: "vp.trainers@campus26.sa" },
    update: {},
    create: {
      email: "vp.trainers@campus26.sa",
      passwordHash,
      nameAr: "د. سعد بن عبدالله الغامدي",
      nameEn: "Dr. Saad Al-Ghamdi",
      role: "vp_trainers",
      phone: "0502345678",
    },
  });

  const vpTrainees = await prisma.user.upsert({
    where: { email: "vp.trainees@campus26.sa" },
    update: {},
    create: {
      email: "vp.trainees@campus26.sa",
      passwordHash,
      nameAr: "د. عبدالرحمن بن سليمان الراشد",
      nameEn: "Dr. Abdulrahman Al-Rashed",
      role: "vp_trainees",
      phone: "0503456789",
    },
  });

  const vpQuality = await prisma.user.upsert({
    where: { email: "vp.quality@campus26.sa" },
    update: {},
    create: {
      email: "vp.quality@campus26.sa",
      passwordHash,
      nameAr: "د. فاطمة بنت خالد المطيري",
      nameEn: "Dr. Fatima Al-Mutairi",
      role: "vp_quality",
      phone: "0504567890",
    },
  });

  const accountant = await prisma.user.upsert({
    where: { email: "accountant@campus26.sa" },
    update: {},
    create: {
      email: "accountant@campus26.sa",
      passwordHash,
      nameAr: "أ. سلطان الحربي",
      nameEn: "Mr. Sultan Al-Harbi",
      role: "accountant",
      phone: "0505678901",
    },
  });

  const qualityOfficer = await prisma.user.upsert({
    where: { email: "quality@campus26.sa" },
    update: {},
    create: {
      email: "quality@campus26.sa",
      passwordHash,
      nameAr: "د. منال الزهراني",
      nameEn: "Dr. Manal Al-Zahrani",
      role: "quality_officer",
      phone: "0506789012",
    },
  });

  const adminUsers = {
    super_admin: superAdmin,
    dean,
    vp_trainers: vpTrainers,
    vp_trainees: vpTrainees,
    vp_quality: vpQuality,
    accountant,
    quality_officer: qualityOfficer,
  };

  console.log(
    `  Created ${Object.keys(adminUsers).length} admin/VP users.`
  );

  return adminUsers;
}
