// =============================================================================
// Campus26 Seed: Grades & Exams
// Generates grade records for enrollments and exam definitions for courses
// =============================================================================

import type { PrismaClient } from "@prisma/client";
import { randomInt, randomFrom, shuffleArray } from "./helpers";

// -----------------------------------------------------------------------------
// Grade Helpers
// -----------------------------------------------------------------------------

/**
 * Generate a weighted random number biased toward a center value.
 * Uses averaging of two random draws to create a bell-curve-like distribution.
 */
function weightedRandom(min: number, max: number, center: number): number {
  // Average of two randoms + slight bias toward center
  const r1 = min + Math.random() * (max - min);
  const r2 = min + Math.random() * (max - min);
  const avg = (r1 + r2 + center) / 3;
  return Math.round(Math.max(min, Math.min(max, avg)));
}

/**
 * Derive letter grade from total score (out of 100).
 */
function getLetterGrade(total: number): string {
  if (total >= 95) return "A+";
  if (total >= 90) return "A";
  if (total >= 85) return "B+";
  if (total >= 80) return "B";
  if (total >= 75) return "C+";
  if (total >= 70) return "C";
  if (total >= 65) return "D+";
  if (total >= 60) return "D";
  return "F";
}

/**
 * Pick a grade status with approximate distribution:
 * 70% APPROVED, 20% SUBMITTED, 10% DRAFT
 */
function pickGradeStatus(): string {
  const r = Math.random();
  if (r < 0.70) return "APPROVED";
  if (r < 0.90) return "SUBMITTED";
  return "DRAFT";
}

// -----------------------------------------------------------------------------
// Exam Helpers
// -----------------------------------------------------------------------------

/** Exam type distribution weights */
const EXAM_TYPE_POOL = [
  "QUIZ",
  "QUIZ",
  "QUIZ",
  "QUIZ", // 40%
  "MIDTERM",
  "MIDTERM", // 20%
  "FINAL",
  "FINAL", // 20%
  "ASSIGNMENT",
  "ASSIGNMENT", // 20%
];

/** Marks and duration by exam type */
const EXAM_CONFIG: Record<
  string,
  { totalMarks: number; duration: number }
> = {
  QUIZ: { totalMarks: 20, duration: 30 },
  MIDTERM: { totalMarks: 30, duration: 90 },
  FINAL: { totalMarks: 40, duration: 120 },
  ASSIGNMENT: { totalMarks: 20, duration: 0 },
};

/** Arabic titles by exam type */
const EXAM_TITLES_AR: Record<string, string[]> = {
  QUIZ: ["اختبار قصير", "كويز"],
  MIDTERM: ["اختبار نصفي"],
  FINAL: ["اختبار نهائي"],
  ASSIGNMENT: ["تكليف", "مشروع"],
};

/** English titles by exam type */
const EXAM_TITLES_EN: Record<string, string[]> = {
  QUIZ: ["Quiz", "Short Quiz"],
  MIDTERM: ["Midterm Exam"],
  FINAL: ["Final Exam"],
  ASSIGNMENT: ["Assignment", "Project"],
};

/**
 * Generate exam start/end dates based on type and semester timeline.
 * Semester: Sep 1 - Dec 22, 2024
 */
function getExamDates(
  examType: string,
  courseIndex: number,
  examIndex: number
): { startDate: Date; endDate: Date } {
  const semStart = new Date("2024-09-01");

  switch (examType) {
    case "QUIZ": {
      // Quizzes spread across weeks 2-14
      const weekOffset = 2 + ((courseIndex * 3 + examIndex * 4) % 13);
      const start = new Date(semStart);
      start.setDate(start.getDate() + weekOffset * 7);
      const end = new Date(start);
      end.setMinutes(end.getMinutes() + 30);
      return { startDate: start, endDate: end };
    }
    case "MIDTERM": {
      // Midterms in weeks 7-9
      const weekOffset = 7 + (courseIndex % 3);
      const start = new Date(semStart);
      start.setDate(start.getDate() + weekOffset * 7);
      start.setHours(8, 0, 0, 0);
      const end = new Date(start);
      end.setMinutes(end.getMinutes() + 90);
      return { startDate: start, endDate: end };
    }
    case "FINAL": {
      // Finals in weeks 15-16
      const weekOffset = 15 + (courseIndex % 2);
      const start = new Date(semStart);
      start.setDate(start.getDate() + weekOffset * 7);
      start.setHours(8, 0, 0, 0);
      const end = new Date(start);
      end.setMinutes(end.getMinutes() + 120);
      return { startDate: start, endDate: end };
    }
    case "ASSIGNMENT": {
      // Assignments given in weeks 3-12, due 2 weeks later
      const weekOffset = 3 + ((courseIndex * 2 + examIndex * 3) % 10);
      const start = new Date(semStart);
      start.setDate(start.getDate() + weekOffset * 7);
      const end = new Date(start);
      end.setDate(end.getDate() + 14);
      return { startDate: start, endDate: end };
    }
    default: {
      const start = new Date(semStart);
      start.setDate(start.getDate() + 30);
      const end = new Date(start);
      end.setDate(end.getDate() + 7);
      return { startDate: start, endDate: end };
    }
  }
}

// -----------------------------------------------------------------------------
// Main Seed Function
// -----------------------------------------------------------------------------

export async function seedGradesAndExams(
  prisma: PrismaClient,
  enrollments: any[],
  courses: any[]
) {
  console.log("  Seeding grades and exams...");

  // ===================== GRADES =====================

  const gradeRecords: {
    enrollmentId: string;
    midtermGrade: number;
    finalGrade: number;
    assignmentsGrade: number;
    attendanceGrade: number;
    totalGrade: number;
    letterGrade: string;
    status: string;
  }[] = [];

  for (const enrollment of enrollments) {
    const midterm = weightedRandom(15, 30, 22); // out of 30, center 22
    const final_ = weightedRandom(20, 40, 30); // out of 40, center 30
    const assignments = weightedRandom(12, 20, 16); // out of 20, center 16
    const attendance = weightedRandom(5, 10, 9); // out of 10, center 9
    const total = midterm + final_ + assignments + attendance;
    const letter = getLetterGrade(total);
    const status = pickGradeStatus();

    gradeRecords.push({
      enrollmentId: enrollment.id,
      midtermGrade: midterm,
      finalGrade: final_,
      assignmentsGrade: assignments,
      attendanceGrade: attendance,
      totalGrade: total,
      letterGrade: letter,
      status,
    });
  }

  // Insert grades in batches using createMany
  const GRADE_BATCH_SIZE = 500;
  let gradesInserted = 0;

  for (let i = 0; i < gradeRecords.length; i += GRADE_BATCH_SIZE) {
    const batch = gradeRecords.slice(i, i + GRADE_BATCH_SIZE);

    await prisma.grade.createMany({
      data: batch.map((rec) => ({
        enrollmentId: rec.enrollmentId,
        midtermGrade: rec.midtermGrade,
        finalGrade: rec.finalGrade,
        assignmentsGrade: rec.assignmentsGrade,
        attendanceGrade: rec.attendanceGrade,
        totalGrade: rec.totalGrade,
        letterGrade: rec.letterGrade,
        status: rec.status as any,
      })),
      skipDuplicates: true,
    });

    gradesInserted += batch.length;
  }

  console.log(`  Created ${gradesInserted} grade records.`);

  // ===================== EXAMS =====================

  // Target ~250 exams across all courses (2-3 per course)
  const examRecords: {
    titleAr: string;
    titleEn: string;
    courseCode: string | null;
    type: string;
    totalMarks: number;
    duration: number;
    questions: any;
    isPublished: boolean;
    startDate: Date;
    endDate: Date;
  }[] = [];

  const shuffledCourses = shuffleArray([...courses]);
  let examCount = 0;

  for (let ci = 0; ci < shuffledCourses.length && examCount < 250; ci++) {
    const course = shuffledCourses[ci];
    const numExams = randomInt(2, 3);

    for (let ei = 0; ei < numExams && examCount < 250; ei++) {
      const examType = randomFrom(EXAM_TYPE_POOL);
      const config = EXAM_CONFIG[examType];
      const { startDate, endDate } = getExamDates(examType, ci, ei);

      const titleArBase = randomFrom(EXAM_TITLES_AR[examType]);
      const titleEnBase = randomFrom(EXAM_TITLES_EN[examType]);

      // Build bilingual title with course name
      const titleAr = `${titleArBase} - ${course.nameAr}`;
      const titleEn = `${titleEnBase} - ${course.nameEn}`;

      // Generate simple placeholder questions JSON
      const numQuestions = examType === "QUIZ" ? randomInt(5, 10) : randomInt(10, 25);
      const questions = Array.from({ length: numQuestions }, (_, qi) => ({
        id: qi + 1,
        textAr: `السؤال ${qi + 1}`,
        textEn: `Question ${qi + 1}`,
        marks: Math.round(config.totalMarks / numQuestions),
        type: randomFrom(["MCQ", "TRUE_FALSE", "SHORT_ANSWER"]),
      }));

      examRecords.push({
        titleAr,
        titleEn,
        courseCode: course.courseCode,
        type: examType,
        totalMarks: config.totalMarks,
        duration: config.duration,
        questions,
        isPublished: true,
        startDate,
        endDate,
      });

      examCount++;
    }
  }

  // Insert exams in batches
  const EXAM_BATCH_SIZE = 50;

  for (let i = 0; i < examRecords.length; i += EXAM_BATCH_SIZE) {
    const batch = examRecords.slice(i, i + EXAM_BATCH_SIZE);

    await prisma.exam.createMany({
      data: batch.map((rec) => ({
        titleAr: rec.titleAr,
        titleEn: rec.titleEn,
        courseCode: rec.courseCode,
        type: rec.type as any,
        totalMarks: rec.totalMarks,
        duration: rec.duration,
        questions: rec.questions,
        isPublished: rec.isPublished,
        startDate: rec.startDate,
        endDate: rec.endDate,
      })),
    });
  }

  console.log(`  Created ${examRecords.length} exam records.`);
}
