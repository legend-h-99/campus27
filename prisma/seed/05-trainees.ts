import type { PrismaClient } from "@prisma/client";
import {
  maleFirstNames,
  femaleFirstNames,
  familyNames,
  generateSaudiPhone,
  generateNationalId,
  generateStudentNumber,
  generateGPA,
  randomFrom,
  randomDate,
} from "./helpers";

/**
 * Seed 300 trainees distributed across departments proportionally by capacity.
 * Creates a User record (role "trainee") and a linked Trainee record for each.
 */
export async function seedTrainees(
  prisma: PrismaClient,
  passwordHash: string,
  departments: any[]
) {
  console.log("  Seeding 300 trainees...");

  const TOTAL_TRAINEES = 300;

  // The first sample trainee in the base seed uses studentNumber "241001".
  // generateStudentNumber(index) = "24" + padStart(index+1, 4, "0"),
  // so to produce "241001" we need to start at index 1000.
  const STUDENT_INDEX_OFFSET = 1000;

  // ---------- distribute trainees proportionally to dept capacity ----------
  const totalCapacity = departments.reduce(
    (sum: number, d: any) => sum + (d.capacity || 1),
    0
  );

  // Calculate proportional counts, ensuring every dept gets at least 1
  const rawCounts = departments.map((d: any) =>
    Math.max(1, Math.round(((d.capacity || 1) / totalCapacity) * TOTAL_TRAINEES))
  );

  // Adjust rounding error so total is exactly TOTAL_TRAINEES
  let diff = TOTAL_TRAINEES - rawCounts.reduce((a: number, b: number) => a + b, 0);
  while (diff !== 0) {
    for (let i = 0; i < rawCounts.length && diff !== 0; i++) {
      if (diff > 0) {
        rawCounts[i]++;
        diff--;
      } else if (rawCounts[i] > 1) {
        rawCounts[i]--;
        diff++;
      }
    }
  }

  // ---------- status distribution ----------
  // 270 ACTIVE, 15 SUSPENDED, 10 WITHDRAWN, 5 GRADUATED
  const statusPool: Array<"ACTIVE" | "SUSPENDED" | "WITHDRAWN" | "GRADUATED"> = [
    ...Array(270).fill("ACTIVE" as const),
    ...Array(15).fill("SUSPENDED" as const),
    ...Array(10).fill("WITHDRAWN" as const),
    ...Array(5).fill("GRADUATED" as const),
  ];
  // Shuffle the status pool for realistic distribution
  for (let i = statusPool.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [statusPool[i], statusPool[j]] = [statusPool[j], statusPool[i]];
  }

  // ---------- level distribution ----------
  // 30% level 1, 30% level 2, 25% level 3, 15% level 4
  function pickLevel(): number {
    const r = Math.random();
    if (r < 0.30) return 1;
    if (r < 0.60) return 2;
    if (r < 0.85) return 3;
    return 4;
  }

  // ---------- build creation payloads ----------
  const userCreateData: any[] = [];
  const traineeCreateData: any[] = [];

  let globalIndex = 0;

  for (let deptIdx = 0; deptIdx < departments.length; deptIdx++) {
    const dept = departments[deptIdx];
    const count = rawCounts[deptIdx];

    for (let j = 0; j < count; j++) {
      const idx = globalIndex;
      globalIndex++;

      // 80% male, 20% female
      const isMale = Math.random() < 0.8;
      const firstNameEntry = isMale
        ? randomFrom(maleFirstNames)
        : randomFrom(femaleFirstNames);
      const fatherNameEntry = randomFrom(maleFirstNames);
      const familyEntry = randomFrom(familyNames);

      // Arabic full name with traditional patronymic style
      const fullNameAr = isMale
        ? `${firstNameEntry.ar} بن ${fatherNameEntry.ar} ${familyEntry.ar}`
        : `${firstNameEntry.ar} بنت ${fatherNameEntry.ar} ${familyEntry.ar}`;

      // English full name
      const fullNameEn = `${firstNameEntry.en} ${familyEntry.en}`;

      const studentNumber = generateStudentNumber(idx + STUDENT_INDEX_OFFSET);
      const email = `s${studentNumber}@stu.campus26.sa`;
      const nationalId = generateNationalId(isMale ? "male" : "female");
      const phone = generateSaudiPhone();
      const guardianPhone = generateSaudiPhone();
      const level = pickLevel();
      const gpa = generateGPA();
      const enrollmentDate = randomDate(
        new Date("2021-09-01"),
        new Date("2024-09-01")
      );
      const status = statusPool[idx];
      const isActive = status === "ACTIVE";

      userCreateData.push({
        email,
        passwordHash,
        nameAr: fullNameAr,
        nameEn: fullNameEn,
        role: "trainee" as const,
        phone,
        status: isActive ? ("ACTIVE" as const) : ("INACTIVE" as const),
      });

      traineeCreateData.push({
        studentNumber,
        fullNameAr,
        fullNameEn,
        nationalId,
        departmentId: dept.id,
        level,
        enrollmentDate,
        gpa: parseFloat(gpa.toFixed(2)),
        phone,
        guardianPhone,
        status,
        isActive,
      });
    }
  }

  // ---------- batch create: users first, then trainees ----------
  const BATCH_SIZE = 50;
  const createdTrainees: any[] = [];

  for (let start = 0; start < userCreateData.length; start += BATCH_SIZE) {
    const end = Math.min(start + BATCH_SIZE, userCreateData.length);
    const batchUsers = userCreateData.slice(start, end);
    const batchTrainees = traineeCreateData.slice(start, end);

    // Create users in this batch
    const users = await Promise.all(
      batchUsers.map((u: any) =>
        prisma.user.upsert({
          where: { email: u.email },
          update: {},
          create: u,
        })
      )
    );

    // Create trainees linked to the created users
    const trainees = await Promise.all(
      batchTrainees.map((t: any, i: number) =>
        prisma.trainee.upsert({
          where: { studentNumber: t.studentNumber },
          update: {},
          create: {
            ...t,
            userId: users[i].id,
          },
        })
      )
    );

    createdTrainees.push(...trainees);
  }

  console.log(`  Created ${createdTrainees.length} trainees across ${departments.length} departments`);
  return createdTrainees;
}
