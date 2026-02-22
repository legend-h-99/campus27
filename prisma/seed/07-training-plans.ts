import type { PrismaClient } from "@prisma/client";

// ---------- Training plan definitions per department ----------
interface PlanDef {
  seq: string;
  nameAr: string;
  nameEn: string;
  level: "diploma" | "advanced_diploma";
}

const planDefs: Record<string, PlanDef[]> = {
  "dept-cs": [
    { seq: "01", nameAr: "دبلوم علوم الحاسب", nameEn: "Computer Science Diploma", level: "diploma" },
    { seq: "02", nameAr: "دبلوم تقنية المعلومات", nameEn: "Information Technology Diploma", level: "diploma" },
    { seq: "03", nameAr: "دبلوم البرمجة التطبيقية", nameEn: "Applied Programming Diploma", level: "diploma" },
    { seq: "04", nameAr: "دبلوم متقدم في علوم الحاسب", nameEn: "Advanced Diploma in Computer Science", level: "advanced_diploma" },
  ],
  "dept-ee": [
    { seq: "01", nameAr: "دبلوم الهندسة الكهربائية", nameEn: "Electrical Engineering Diploma", level: "diploma" },
    { seq: "02", nameAr: "دبلوم الإلكترونيات الصناعية", nameEn: "Industrial Electronics Diploma", level: "diploma" },
    { seq: "03", nameAr: "دبلوم القوى الكهربائية", nameEn: "Electrical Power Diploma", level: "diploma" },
    { seq: "04", nameAr: "دبلوم متقدم في الهندسة الكهربائية", nameEn: "Advanced Diploma in Electrical Engineering", level: "advanced_diploma" },
  ],
  "dept-me": [
    { seq: "01", nameAr: "دبلوم الهندسة الميكانيكية", nameEn: "Mechanical Engineering Diploma", level: "diploma" },
    { seq: "02", nameAr: "دبلوم التبريد والتكييف", nameEn: "Refrigeration & Air Conditioning Diploma", level: "diploma" },
    { seq: "03", nameAr: "دبلوم الإنتاج والتصنيع", nameEn: "Production & Manufacturing Diploma", level: "diploma" },
    { seq: "04", nameAr: "دبلوم متقدم في الهندسة الميكانيكية", nameEn: "Advanced Diploma in Mechanical Engineering", level: "advanced_diploma" },
  ],
  "dept-ba": [
    { seq: "01", nameAr: "دبلوم إدارة الأعمال", nameEn: "Business Administration Diploma", level: "diploma" },
    { seq: "02", nameAr: "دبلوم الموارد البشرية", nameEn: "Human Resources Diploma", level: "diploma" },
    { seq: "03", nameAr: "دبلوم إدارة المشاريع", nameEn: "Project Management Diploma", level: "diploma" },
    { seq: "04", nameAr: "دبلوم متقدم في إدارة الأعمال", nameEn: "Advanced Diploma in Business Administration", level: "advanced_diploma" },
  ],
  "dept-em": [
    { seq: "01", nameAr: "دبلوم التسويق الإلكتروني", nameEn: "E-Marketing Diploma", level: "diploma" },
    { seq: "02", nameAr: "دبلوم التجارة الإلكترونية", nameEn: "E-Commerce Diploma", level: "diploma" },
    { seq: "03", nameAr: "دبلوم التسويق الرقمي", nameEn: "Digital Marketing Diploma", level: "diploma" },
    { seq: "04", nameAr: "دبلوم متقدم في التسويق الإلكتروني", nameEn: "Advanced Diploma in E-Marketing", level: "advanced_diploma" },
  ],
  "dept-wd": [
    { seq: "01", nameAr: "دبلوم تطوير الويب", nameEn: "Web Development Diploma", level: "diploma" },
    { seq: "02", nameAr: "دبلوم البرمجة وتطوير التطبيقات", nameEn: "Programming & App Development Diploma", level: "diploma" },
    { seq: "03", nameAr: "دبلوم تطوير الواجهات", nameEn: "Frontend Development Diploma", level: "diploma" },
    { seq: "04", nameAr: "دبلوم متقدم في تطوير البرمجيات", nameEn: "Advanced Diploma in Software Development", level: "advanced_diploma" },
  ],
  "dept-cy": [
    { seq: "01", nameAr: "دبلوم الأمن السيبراني", nameEn: "Cybersecurity Diploma", level: "diploma" },
    { seq: "02", nameAr: "دبلوم الشبكات وأمن المعلومات", nameEn: "Networks & Information Security Diploma", level: "diploma" },
    { seq: "03", nameAr: "دبلوم التحقيق الرقمي", nameEn: "Digital Forensics Diploma", level: "diploma" },
    { seq: "04", nameAr: "دبلوم متقدم في الأمن السيبراني", nameEn: "Advanced Diploma in Cybersecurity", level: "advanced_diploma" },
  ],
  "dept-gd": [
    { seq: "01", nameAr: "دبلوم التصميم الجرافيكي", nameEn: "Graphic Design Diploma", level: "diploma" },
    { seq: "02", nameAr: "دبلوم الوسائط المتعددة", nameEn: "Multimedia Diploma", level: "diploma" },
    { seq: "03", nameAr: "دبلوم تصميم واجهات المستخدم", nameEn: "UI/UX Design Diploma", level: "diploma" },
    { seq: "04", nameAr: "دبلوم متقدم في التصميم الجرافيكي", nameEn: "Advanced Diploma in Graphic Design", level: "advanced_diploma" },
  ],
  "dept-ac": [
    { seq: "01", nameAr: "دبلوم المحاسبة", nameEn: "Accounting Diploma", level: "diploma" },
    { seq: "02", nameAr: "دبلوم المحاسبة الحكومية", nameEn: "Government Accounting Diploma", level: "diploma" },
    { seq: "03", nameAr: "دبلوم المراجعة والتدقيق", nameEn: "Auditing & Review Diploma", level: "diploma" },
    { seq: "04", nameAr: "دبلوم متقدم في المحاسبة", nameEn: "Advanced Diploma in Accounting", level: "advanced_diploma" },
  ],
  "dept-os": [
    { seq: "01", nameAr: "دبلوم السلامة المهنية", nameEn: "Occupational Safety Diploma", level: "diploma" },
    { seq: "02", nameAr: "دبلوم السلامة الصناعية", nameEn: "Industrial Safety Diploma", level: "diploma" },
    { seq: "03", nameAr: "دبلوم الصحة والسلامة البيئية", nameEn: "Environmental Health & Safety Diploma", level: "diploma" },
    { seq: "04", nameAr: "دبلوم متقدم في السلامة المهنية", nameEn: "Advanced Diploma in Occupational Safety", level: "advanced_diploma" },
  ],
};

/**
 * Returns the department prefix from a department id.
 * e.g. "dept-cs" => "CS"
 */
function getDeptPrefix(deptId: string): string {
  return deptId.replace("dept-", "").toUpperCase();
}

/**
 * Seed 40 training plans (4 per department) with course assignments.
 * Links 12 courses to each plan via TrainingPlanCourse.
 */
export async function seedTrainingPlans(
  prisma: PrismaClient,
  departments: any[],
  courses: any[]
) {
  console.log("  Seeding 40 training plans...");

  // ---------- Index courses by department ----------
  const coursesByDept: Record<string, any[]> = {};
  for (const course of courses) {
    const deptId = course.departmentId;
    if (!coursesByDept[deptId]) {
      coursesByDept[deptId] = [];
    }
    coursesByDept[deptId].push(course);
  }

  const createdPlans: any[] = [];

  for (const dept of departments) {
    const deptPlans = planDefs[dept.id];
    if (!deptPlans) {
      console.warn(`  No training plan definitions for department ${dept.id}, skipping`);
      continue;
    }

    const deptCourses = coursesByDept[dept.id] || [];
    if (deptCourses.length === 0) {
      console.warn(`  No courses found for department ${dept.id}, skipping plan creation`);
      continue;
    }

    // Sort department courses by level then courseCode for deterministic assignment
    deptCourses.sort((a: any, b: any) => {
      if (a.level !== b.level) return a.level - b.level;
      return a.courseCode.localeCompare(b.courseCode);
    });

    for (let planIdx = 0; planIdx < deptPlans.length; planIdx++) {
      const def = deptPlans[planIdx];
      const prefix = getDeptPrefix(dept.id);
      const planCode = `TP-${prefix}-${def.seq}`;

      // For each plan, pick 12-15 courses from the department.
      // Different plans emphasise different subsets / elective patterns.
      // Plan 1: first 12 courses (standard path)
      // Plan 2: first 12 courses but swap one level-3 for another elective
      // Plan 3: first 13 courses
      // Plan 4 (advanced): all available courses (up to 15)
      const maxCourses = planIdx === 3 ? Math.min(15, deptCourses.length) : Math.min(12 + planIdx, deptCourses.length);

      // Select courses for this plan: rotate the start slightly per plan
      // to give variety across plans
      const selectedCourses: any[] = [];
      const startOffset = planIdx; // each plan starts picking from a slightly different spot

      for (let i = 0; i < maxCourses; i++) {
        const courseIdx = (startOffset + i) % deptCourses.length;
        // Avoid duplicates in this plan
        if (!selectedCourses.find((c: any) => c.id === deptCourses[courseIdx].id)) {
          selectedCourses.push(deptCourses[courseIdx]);
        }
      }

      // If offset caused fewer courses, fill from the beginning
      for (let i = 0; selectedCourses.length < maxCourses && i < deptCourses.length; i++) {
        if (!selectedCourses.find((c: any) => c.id === deptCourses[i].id)) {
          selectedCourses.push(deptCourses[i]);
        }
      }

      // Calculate total credits from selected courses
      const totalCredits = selectedCourses.reduce(
        (sum: number, c: any) => sum + (c.credits || 3),
        0
      );

      // Upsert the training plan
      const plan = await prisma.trainingPlan.upsert({
        where: { planCode },
        update: {},
        create: {
          planCode,
          nameAr: def.nameAr,
          nameEn: def.nameEn,
          descriptionAr: `${def.nameAr} - خطة تدريبية شاملة لمدة أربعة فصول دراسية`,
          descriptionEn: `${def.nameEn} - Comprehensive training plan spanning four semesters`,
          departmentId: dept.id,
          totalCredits,
          durationSemesters: 4,
          level: def.level,
          isActive: true,
        },
      });

      // ---------- Link courses to plan via TrainingPlanCourse ----------
      for (let i = 0; i < selectedCourses.length; i++) {
        const course = selectedCourses[i];

        // Determine semester number based on course level
        const semesterNumber = Math.min(course.level || 1, 4);

        // First 10 courses are required, rest are elective
        const isElective = i >= 10;

        await prisma.trainingPlanCourse.upsert({
          where: {
            trainingPlanId_courseId: {
              trainingPlanId: plan.id,
              courseId: course.id,
            },
          },
          update: {},
          create: {
            trainingPlanId: plan.id,
            courseId: course.id,
            semesterNumber,
            isElective,
          },
        });
      }

      createdPlans.push(plan);
    }
  }

  console.log(`  Created ${createdPlans.length} training plans with course assignments`);
  return createdPlans;
}
