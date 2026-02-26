import type { PrismaClient } from "@prisma/client";
import {
  maleFirstNames,
  femaleFirstNames,
  familyNames,
  departmentSpecializations,
  randomQualification,
  generateSaudiPhone,
  randomFrom,
  randomDate,
  type NameEntry,
} from "./helpers";

// ──────────────────────────────────────────────
// Distribution helper: allocate N trainers across departments proportionally
// ──────────────────────────────────────────────

function distributeToDepartments(
  total: number,
  departments: { id: string; capacity: number }[]
): Map<string, number> {
  const totalCapacity = departments.reduce((s, d) => s + (d.capacity || 1), 0);
  const dist = new Map<string, number>();
  let assigned = 0;

  for (let i = 0; i < departments.length; i++) {
    const dept = departments[i];
    if (i === departments.length - 1) {
      // Last department gets the remainder to hit exactly `total`
      dist.set(dept.id, total - assigned);
    } else {
      const count = Math.max(
        1,
        Math.round((dept.capacity / totalCapacity) * total)
      );
      dist.set(dept.id, count);
      assigned += count;
    }
  }

  return dist;
}

// ──────────────────────────────────────────────
// Main export
// ──────────────────────────────────────────────

/**
 * Seed 60 trainers distributed across departments proportionally by capacity.
 * Creates a User record (role "trainer") and a linked Trainer record for each.
 */
export async function seedTrainers(
  prisma: PrismaClient,
  passwordHash: string,
  departments: any[]
) {
  console.log("  Seeding 60 trainers...");

  const TOTAL_TRAINERS = 60;
  const HIRE_START = new Date("2018-01-01");
  const HIRE_END = new Date("2024-06-01");

  const distribution = distributeToDepartments(TOTAL_TRAINERS, departments);

  // Track used emails to prevent collisions
  const usedEmails = new Set<string>();

  const trainers: Array<{
    id: string;
    userId: string;
    departmentId: string;
    employeeNumber: string;
    fullNameAr: string;
    fullNameEn: string;
  }> = [];

  let globalIndex = 0;

  for (const dept of departments) {
    const count = distribution.get(dept.id) ?? 0;
    const specializations = departmentSpecializations[dept.id] ?? [
      { ar: "تخصص عام", en: "General" },
    ];

    for (let i = 0; i < count; i++) {
      globalIndex++;

      // 75% male, 25% female (approximate for Saudi technical college context)
      const isMale = globalIndex % 4 !== 0;
      const firstNames: NameEntry[] = isMale
        ? maleFirstNames
        : femaleFirstNames;

      const firstName = randomFrom(firstNames);
      const lastName = randomFrom(familyNames);

      // Arabic title based on qualification
      const qual = randomQualification();
      const titleAr = qual.ar === "دكتوراه" ? "د." : isMale ? "م." : "أ.";
      const titleEn = qual.en === "PhD" ? "Dr." : isMale ? "Eng." : "Ms.";

      const fullNameAr = `${titleAr} ${firstName.ar} ${lastName.ar}`;
      const fullNameEn = `${titleEn} ${firstName.en} ${lastName.en}`;

      // Generate unique email
      const cleanFirst = firstName.en.toLowerCase().replace(/[^a-z]/g, "");
      const cleanLast = lastName.en
        .toLowerCase()
        .replace(/^al-/, "al")
        .replace(/[^a-z]/g, "");
      let email = `trainer.${cleanFirst}.${cleanLast}@saohil1.sa`;
      if (usedEmails.has(email)) {
        email = `trainer.${cleanFirst}.${cleanLast}.${globalIndex}@saohil1.sa`;
      }
      usedEmails.add(email);

      // Employee number: EMP1001, EMP1002, ...
      const employeeNumber = `EMP${(1000 + globalIndex).toString()}`;

      // Specialization for this department
      const specialization = randomFrom(specializations);

      // Hire date
      const hireDate = randomDate(HIRE_START, HIRE_END);

      // Phone
      const phone = generateSaudiPhone();

      // Status: 55 ACTIVE, 3 ON_LEAVE, 2 TRANSFERRED
      let status: "ACTIVE" | "ON_LEAVE" | "TRANSFERRED" = "ACTIVE";
      if (globalIndex === 56 || globalIndex === 57 || globalIndex === 58) {
        status = "ON_LEAVE";
      } else if (globalIndex === 59 || globalIndex === 60) {
        status = "TRANSFERRED";
      }

      const isActive = status === "ACTIVE";

      // Create the User record
      const user = await prisma.user.create({
        data: {
          email,
          passwordHash,
          nameAr: `${firstName.ar} ${lastName.ar}`,
          nameEn: `${firstName.en} ${lastName.en}`,
          role: "trainer",
          phone,
          status: isActive ? "ACTIVE" : "INACTIVE",
        },
      });

      // Create the Trainer record
      const trainer = await prisma.trainer.create({
        data: {
          userId: user.id,
          employeeNumber,
          fullNameAr,
          fullNameEn,
          departmentId: dept.id,
          specialization: specialization.ar,
          qualificationAr: qual.ar,
          qualificationEn: qual.en,
          hireDate,
          phone,
          status,
          isActive,
        },
      });

      trainers.push({
        id: trainer.id,
        userId: user.id,
        departmentId: dept.id,
        employeeNumber,
        fullNameAr,
        fullNameEn,
      });
    }
  }

  console.log(
    `  Created ${trainers.length} trainers across ${departments.length} departments.`
  );

  // Log distribution summary
  const summary = new Map<string, number>();
  for (const t of trainers) {
    summary.set(t.departmentId, (summary.get(t.departmentId) ?? 0) + 1);
  }
  for (const [deptId, count] of summary) {
    console.log(`    ${deptId}: ${count} trainers`);
  }

  return trainers;
}
