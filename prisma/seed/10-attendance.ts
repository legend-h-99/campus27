// =============================================================================
// Campus26 Seed: Attendance
// Generates 16 weeks of attendance records for all enrollments
// =============================================================================

import type { PrismaClient } from "@prisma/client";

/**
 * Map DayOfWeek enum values to numeric day offsets within a week.
 * Saudi working week: Sunday(0) through Thursday(4).
 */
const DAY_OFFSET: Record<string, number> = {
  SUNDAY: 0,
  MONDAY: 1,
  TUESDAY: 2,
  WEDNESDAY: 3,
  THURSDAY: 4,
};

/** Semester starts September 1, 2024 (which is a Sunday) */
const SEMESTER_START = new Date("2024-09-01");

/** Number of weeks in the semester */
const TOTAL_WEEKS = 16;

/** Attendance status distribution for normal trainees */
const NORMAL_WEIGHTS = [
  { status: "PRESENT", cumulative: 0.82 },
  { status: "ABSENT", cumulative: 0.90 },
  { status: "LATE", cumulative: 0.95 },
  { status: "EXCUSED", cumulative: 1.0 },
];

/** Attendance status distribution for at-risk trainees (30%+ absence) */
const AT_RISK_WEIGHTS = [
  { status: "PRESENT", cumulative: 0.55 },
  { status: "ABSENT", cumulative: 0.88 },
  { status: "LATE", cumulative: 0.95 },
  { status: "EXCUSED", cumulative: 1.0 },
];

/**
 * Pick an attendance status based on weighted distribution.
 */
function pickAttendanceStatus(
  weights: { status: string; cumulative: number }[]
): string {
  const r = Math.random();
  for (const w of weights) {
    if (r <= w.cumulative) return w.status;
  }
  return "PRESENT";
}

/**
 * Calculate the actual date for a given week and day offset.
 * Week 0 = Sep 1-5, Week 1 = Sep 8-12, etc.
 */
function getDateForWeekDay(week: number, dayOffset: number): Date {
  const date = new Date(SEMESTER_START);
  date.setDate(date.getDate() + week * 7 + dayOffset);
  return date;
}

export async function seedAttendance(
  prisma: PrismaClient,
  enrollments: any[],
  schedules: any[]
) {
  console.log("  Seeding attendance records...");

  // Group schedules by courseId for quick lookup
  const schedulesByCourse = new Map<string, any[]>();
  for (const schedule of schedules) {
    const courseId = schedule.courseId;
    if (!schedulesByCourse.has(courseId)) {
      schedulesByCourse.set(courseId, []);
    }
    schedulesByCourse.get(courseId)!.push(schedule);
  }

  // Collect unique trainee IDs from enrollments
  const traineeIds = new Set<string>();
  for (const enrollment of enrollments) {
    traineeIds.add(enrollment.traineeId);
  }

  // Randomly designate ~20% of trainees as "at-risk" (higher absence rate)
  const traineeIdArray = Array.from(traineeIds);
  const atRiskCount = Math.min(20, Math.floor(traineeIdArray.length * 0.2));
  const atRiskSet = new Set<string>();

  // Simple selection: pick first N from a shuffled copy
  const shuffled = [...traineeIdArray];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  for (let i = 0; i < atRiskCount; i++) {
    atRiskSet.add(shuffled[i]);
  }

  // Build all attendance records in memory first
  const attendanceRecords: {
    enrollmentId: string;
    scheduleId: string;
    trainerId: string | null;
    date: Date;
    status: string;
  }[] = [];

  // Track unique keys to prevent duplicates: "enrollmentId-scheduleId-dateISO"
  const seenKeys = new Set<string>();

  for (const enrollment of enrollments) {
    const courseSchedules = schedulesByCourse.get(enrollment.courseId);
    if (!courseSchedules || courseSchedules.length === 0) continue;

    const isAtRisk = atRiskSet.has(enrollment.traineeId);
    const weights = isAtRisk ? AT_RISK_WEIGHTS : NORMAL_WEIGHTS;

    for (const schedule of courseSchedules) {
      const dayOffset = DAY_OFFSET[schedule.dayOfWeek];
      if (dayOffset === undefined) continue;

      for (let week = 0; week < TOTAL_WEEKS; week++) {
        const date = getDateForWeekDay(week, dayOffset);
        const dateKey = date.toISOString().split("T")[0];
        const uniqueKey = `${enrollment.id}-${schedule.id}-${dateKey}`;

        if (seenKeys.has(uniqueKey)) continue;
        seenKeys.add(uniqueKey);

        attendanceRecords.push({
          enrollmentId: enrollment.id,
          scheduleId: schedule.id,
          trainerId: schedule.trainerId ?? null,
          date,
          status: pickAttendanceStatus(weights),
        });
      }
    }
  }

  // Insert in batches of 1000 for performance
  const BATCH_SIZE = 1000;
  let inserted = 0;

  for (let i = 0; i < attendanceRecords.length; i += BATCH_SIZE) {
    const batch = attendanceRecords.slice(i, i + BATCH_SIZE);

    await prisma.attendance.createMany({
      data: batch.map((rec) => ({
        enrollmentId: rec.enrollmentId,
        scheduleId: rec.scheduleId,
        trainerId: rec.trainerId,
        date: rec.date,
        status: rec.status as any,
      })),
      skipDuplicates: true,
    });

    inserted += batch.length;

    if (inserted % 5000 === 0 || inserted === attendanceRecords.length) {
      console.log(
        `    Attendance progress: ${inserted}/${attendanceRecords.length} records`
      );
    }
  }

  console.log(
    `  Created ${attendanceRecords.length} attendance records (${atRiskSet.size} at-risk trainees).`
  );
}
