// =============================================================================
// Campus27 - Main Seed Orchestrator
// Calls all modular seed scripts in dependency order
// =============================================================================

import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";

// Seed modules
import { getPasswordHash } from "./seed/00-config";
import { seedAdminUsers } from "./seed/01-users-admin";
import { seedDepartments } from "./seed/02-departments";
import { seedSemesters } from "./seed/03-semesters";
import { seedTrainers } from "./seed/04-trainers";
import { seedTrainees } from "./seed/05-trainees";
import { seedCourses } from "./seed/06-courses";
import { seedTrainingPlans } from "./seed/07-training-plans";
import { seedSchedules } from "./seed/08-schedules";
import { seedEnrollments } from "./seed/09-enrollments";
import { seedAttendance } from "./seed/10-attendance";
import { seedGradesAndExams } from "./seed/11-grades-exams";
import { seedFinancial } from "./seed/12-financial";
import { seedQualityBase } from "./seed/13a-quality-base";
import { seedQuality } from "./seed/13-quality";
import { seedTasksAndProjects } from "./seed/14-tasks-projects";
import { seedQualityAdvanced } from "./seed/15-quality-advanced";

// ──────────────────────────────────────────────────
// Database connection (Prisma 7 adapter pattern)
// ──────────────────────────────────────────────────

const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
  max: 3,
  idleTimeoutMillis: 120000,
  keepAlive: true,
  keepAliveInitialDelayMillis: 10000,
});
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter }) as unknown as PrismaClient;

// ──────────────────────────────────────────────────
// Main
// ──────────────────────────────────────────────────

async function main() {
  const startTime = Date.now();
  console.log("╔══════════════════════════════════════════════════╗");
  console.log("║        Campus27 - Comprehensive Seed Data       ║");
  console.log("╚══════════════════════════════════════════════════╝\n");

  // ── Phase 0: Clean existing data ─────────────
  console.log("▶ Phase 0: Cleaning existing data...");
  // Delete in reverse-dependency order (children before parents)
  await prisma.auditLog.deleteMany();
  await prisma.notification.deleteMany();
  await prisma.aIInsightCache.deleteMany();
  await prisma.aIMessage.deleteMany();
  await prisma.aIConversation.deleteMany();
  await prisma.communityProgram.deleteMany();
  await prisma.researchProject.deleteMany();
  await prisma.exam.deleteMany();
  await prisma.elearningContent.deleteMany();
  await prisma.accreditation.deleteMany();
  await prisma.qualityMeeting.deleteMany();
  await prisma.qualityDocument.deleteMany();
  await prisma.qualityReport.deleteMany();
  await prisma.surveyResponse.deleteMany();
  await prisma.qualitySurvey.deleteMany();
  await prisma.improvementAction.deleteMany();
  await prisma.improvementPlan.deleteMany();
  await prisma.auditFinding.deleteMany();
  await prisma.qualityAudit.deleteMany();
  await prisma.kpiMeasurement.deleteMany();
  await prisma.qualityKpi.deleteMany();
  await prisma.qualityStandard.deleteMany();
  await prisma.qualityStaff.deleteMany();
  await prisma.evaluation.deleteMany();
  await prisma.leave.deleteMany();
  await prisma.task.deleteMany();
  await prisma.project.deleteMany();
  await prisma.warehouseItem.deleteMany();
  await prisma.procurementRequest.deleteMany();
  await prisma.budgetItem.deleteMany();
  await prisma.financialTransaction.deleteMany();
  await prisma.attendance.deleteMany();
  await prisma.grade.deleteMany();
  await prisma.enrollment.deleteMany();
  await prisma.schedule.deleteMany();
  await prisma.trainingPlanCourse.deleteMany();
  await prisma.trainingPlan.deleteMany();
  await prisma.course.deleteMany();
  await prisma.trainee.deleteMany();
  await prisma.trainer.deleteMany();
  await prisma.semester.deleteMany();
  await prisma.department.deleteMany();
  await prisma.user.deleteMany();
  console.log("  Database cleaned.");

  // ── Shared password hash ──────────────────────
  console.log("\n▶ Preparing password hash...");
  const passwordHash = await getPasswordHash();

  // ── Phase 1: Core entities ────────────────────
  console.log("\n▶ Phase 1: Core entities");

  const adminUsers = await seedAdminUsers(prisma, passwordHash);
  const departments = await seedDepartments(prisma, passwordHash);
  const semesters = await seedSemesters(prisma);

  // Current semester ID for schedule/enrollment context
  const currentSemester = semesters.find((s: any) => s.isCurrent) ?? semesters[1];
  const currentSemesterId = currentSemester?.id ?? "sem-2024-t1";

  // ── Phase 2: People ───────────────────────────
  console.log("\n▶ Phase 2: People");

  const trainers = await seedTrainers(prisma, passwordHash, departments);
  const trainees = await seedTrainees(prisma, passwordHash, departments);

  // ── Phase 3: Academics ────────────────────────
  console.log("\n▶ Phase 3: Academics");

  const courses = await seedCourses(prisma, departments);
  await seedTrainingPlans(prisma, departments, courses);

  // ── Phase 4: Schedules & Enrollments ──────────
  console.log("\n▶ Phase 4: Schedules & Enrollments");

  const schedules = await seedSchedules(
    prisma,
    trainers,
    courses,
    currentSemesterId
  );
  const enrollments = await seedEnrollments(
    prisma,
    trainees,
    courses,
    currentSemesterId
  );

  // ── Phase 5: Attendance & Grades ──────────────
  console.log("\n▶ Phase 5: Attendance & Grades");

  await seedAttendance(prisma, enrollments, schedules);
  await seedGradesAndExams(prisma, enrollments, courses);

  // ── Phase 6: Operational Data ─────────────────
  console.log("\n▶ Phase 6: Operational data");

  await seedFinancial(prisma);
  await seedQualityBase(prisma, adminUsers);
  await seedQuality(prisma, adminUsers);
  await seedTasksAndProjects(prisma, adminUsers, departments);

  // ── Phase 7: Advanced Quality Data ────────────
  console.log("\n▶ Phase 7: Advanced Quality Data");
  await seedQualityAdvanced(prisma);

  // ── Summary ───────────────────────────────────
  const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);

  console.log("\n╔══════════════════════════════════════════════════╗");
  console.log("║              Seed Complete ✓                     ║");
  console.log("╚══════════════════════════════════════════════════╝");
  console.log(`\n⏱  Total time: ${elapsed}s\n`);

  console.log("📊 Summary:");
  console.log(`   Admin/VP users : ${Object.keys(adminUsers).length}`);
  console.log(`   Departments    : ${departments.length}`);
  console.log(`   Semesters      : ${semesters.length}`);
  console.log(`   Trainers       : ${trainers.length}`);
  console.log(`   Trainees       : ${trainees.length}`);
  console.log(`   Courses        : ${courses.length}`);
  console.log(`   Schedules      : ${schedules.length}`);
  console.log(`   Enrollments    : ${enrollments.length}`);

  console.log("\n🔑 Login credentials:");
  console.log("   Admin:          admin@campus27.sa / 123456");
  console.log("   Dean:           dean@campus27.sa / 123456");
  console.log("   VP Trainers:    vp.trainers@campus27.sa / 123456");
  console.log("   VP Trainees:    vp.trainees@campus27.sa / 123456");
  console.log("   VP Quality:     vp.quality@campus27.sa / 123456");
  console.log("   Accountant:     accountant@campus27.sa / 123456");
  console.log("   Quality Officer: quality@campus27.sa / 123456");
  console.log("   Dept Heads:     head.cs@campus27.sa / 123456 (etc.)");
  console.log("   Students:       s241001@stu.campus27.sa / 123456 (etc.)");
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
