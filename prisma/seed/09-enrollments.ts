// =============================================================================
// Campus26 Seed: Enrollments
// Enrolls active trainees into courses matching their department and level
// =============================================================================

import type { PrismaClient } from "@prisma/client";
import { randomInt, shuffleArray } from "./helpers";

export async function seedEnrollments(
  prisma: PrismaClient,
  trainees: any[],
  courses: any[],
  semesterId: string
) {
  console.log("  Seeding enrollments...");

  // Group courses by department
  const coursesByDept = new Map<string, any[]>();
  for (const course of courses) {
    const deptId = course.departmentId;
    if (!coursesByDept.has(deptId)) {
      coursesByDept.set(deptId, []);
    }
    coursesByDept.get(deptId)!.push(course);
  }

  // Retrieve semester start date for enrollmentDate
  const semester = await prisma.semester.findUnique({
    where: { id: semesterId },
  });
  const enrollmentDate = semester?.startDate ?? new Date("2024-09-01");

  // Build enrollment records for createMany
  const enrollmentRecords: {
    traineeId: string;
    courseId: string;
    semesterId: string;
    enrollmentDate: Date;
    status: string;
  }[] = [];

  // Filter active trainees only
  const activeTrainees = trainees.filter(
    (t: any) => t.status === "ACTIVE"
  );

  for (const trainee of activeTrainees) {
    const deptId = trainee.departmentId;
    const traineeLevel = trainee.level ?? 1;
    const deptCourses = coursesByDept.get(deptId);

    if (!deptCourses || deptCourses.length === 0) {
      continue;
    }

    // Find courses at or below the trainee's level
    const eligibleCourses = deptCourses.filter(
      (c: any) => c.level <= traineeLevel
    );

    if (eligibleCourses.length === 0) {
      continue;
    }

    // Randomly select 4-6 courses (capped by available courses)
    const numCourses = Math.min(
      randomInt(4, 6),
      eligibleCourses.length
    );
    const selectedCourses = shuffleArray(eligibleCourses).slice(
      0,
      numCourses
    );

    for (const course of selectedCourses) {
      enrollmentRecords.push({
        traineeId: trainee.id,
        courseId: course.id,
        semesterId,
        enrollmentDate,
        status: "ENROLLED",
      });
    }
  }

  // Batch insert with skipDuplicates (unique constraint: [traineeId, courseId, semesterId])
  if (enrollmentRecords.length > 0) {
    await prisma.enrollment.createMany({
      data: enrollmentRecords,
      skipDuplicates: true,
    });
  }

  // Fetch all created enrollments with IDs (needed for attendance and grades)
  const enrollments = await prisma.enrollment.findMany({
    where: { semesterId },
    include: {
      trainee: true,
      course: true,
    },
  });

  console.log(`  Created ${enrollments.length} enrollments.`);

  return enrollments;
}
