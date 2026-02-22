import type { PrismaClient } from "@prisma/client";
import { SEMESTERS } from "./00-config";

/**
 * Seed 3 academic semesters into the database.
 * Uses the SEMESTERS config from 00-config.ts.
 */
export async function seedSemesters(prisma: PrismaClient) {
  console.log("  Seeding semesters...");

  const semesters = [];

  for (const sem of SEMESTERS) {
    const record = await prisma.semester.upsert({
      where: { year_term: { year: sem.year, term: sem.term } },
      update: {
        nameAr: sem.nameAr,
        nameEn: sem.nameEn,
        startDate: new Date(sem.start),
        endDate: new Date(sem.end),
        isCurrent: sem.isCurrent,
      },
      create: {
        id: sem.id,
        nameAr: sem.nameAr,
        nameEn: sem.nameEn,
        year: sem.year,
        term: sem.term,
        startDate: new Date(sem.start),
        endDate: new Date(sem.end),
        isCurrent: sem.isCurrent,
      },
    });
    semesters.push(record);
  }

  console.log(`  Created ${semesters.length} semesters.`);

  return semesters;
}
