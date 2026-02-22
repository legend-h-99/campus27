import type { PrismaClient } from "@prisma/client";

// =============================================================================
// Campus26 Quality Seed Data (Additive)
// KPI measurements, surveys, documents, meetings
// Adds ON TOP of existing quality data (standards, KPIs, audits already seeded)
// =============================================================================

// -----------------------------------------------------------------------------
// KPI Value Generators by measurement unit
// -----------------------------------------------------------------------------

interface KpiValueProfile {
  baseValues: [number, number, number]; // Oct, Nov, Dec baseline values
  variance: number; // random +/- variance
}

/**
 * Returns a realistic measurement profile based on the KPI's unit and target.
 * The three values represent Oct, Nov, Dec 2024 with a slight upward trend.
 */
function getKpiProfile(unit: string | null, target: number): KpiValueProfile {
  switch (unit) {
    case "%":
      if (target >= 85) {
        return { baseValues: [80, 83, 86], variance: 3 };
      }
      return { baseValues: [72, 75, 78], variance: 4 };
    case "GPA":
      return { baseValues: [2.7, 2.9, 3.1], variance: 0.2 };
    case "1-5":
      return { baseValues: [3.5, 3.7, 3.9], variance: 0.3 };
    case "hours":
      return { baseValues: [15, 15.5, 16], variance: 1 };
    case "count":
      if (target >= 10) {
        return { baseValues: [6, 8, 11], variance: 2 };
      }
      return { baseValues: [3, 5, 7], variance: 1 };
    default:
      return { baseValues: [70, 75, 80], variance: 5 };
  }
}

/**
 * Determine measurement status based on achievement rate.
 */
function getKpiStatus(achievementRate: number): "EXCEEDS" | "MEETS" | "BELOW" | "CRITICAL" {
  if (achievementRate >= 100) return "EXCEEDS";
  if (achievementRate >= 85) return "MEETS";
  if (achievementRate >= 70) return "BELOW";
  return "CRITICAL";
}

// -----------------------------------------------------------------------------
// Survey Definitions
// -----------------------------------------------------------------------------

interface SurveyDef {
  titleAr: string;
  titleEn: string;
  surveyType: "STUDENT_SATISFACTION" | "COURSE_EVALUATION" | "TRAINER_EVALUATION";
  targetAudience: "STUDENTS" | "TRAINERS";
  status: "SURVEY_ACTIVE" | "SURVEY_CLOSED" | "SURVEY_DRAFT";
  totalResponses: number;
  startDate: Date | null;
  endDate: Date | null;
}

const SURVEYS: SurveyDef[] = [
  {
    titleAr: "استبيان رضا المتدربين",
    titleEn: "Student Satisfaction Survey",
    surveyType: "STUDENT_SATISFACTION",
    targetAudience: "STUDENTS",
    status: "SURVEY_ACTIVE",
    totalResponses: 150,
    startDate: new Date("2024-12-01"),
    endDate: new Date("2025-01-31"),
  },
  {
    titleAr: "استبيان تقييم المقررات",
    titleEn: "Course Evaluation Survey",
    surveyType: "COURSE_EVALUATION",
    targetAudience: "STUDENTS",
    status: "SURVEY_CLOSED",
    totalResponses: 200,
    startDate: new Date("2024-10-01"),
    endDate: new Date("2024-11-30"),
  },
  {
    titleAr: "استبيان تقييم المدربين",
    titleEn: "Trainer Evaluation Survey",
    surveyType: "TRAINER_EVALUATION",
    targetAudience: "TRAINERS",
    status: "SURVEY_DRAFT",
    totalResponses: 0,
    startDate: null,
    endDate: null,
  },
];

// -----------------------------------------------------------------------------
// Document Definitions
// -----------------------------------------------------------------------------

interface QualityDocDef {
  titleAr: string;
  titleEn: string;
  docType: "POLICY" | "PROCEDURE" | "FORM" | "MANUAL" | "DOC_STANDARD";
  docCode: string;
  version: string;
  status: "DOC_ACTIVE" | "DOC_UNDER_REVIEW" | "DOC_DRAFT";
  descriptionAr: string;
  effectiveDate: Date;
  reviewDate: Date;
}

const QUALITY_DOCUMENTS: QualityDocDef[] = [
  {
    titleAr: "سياسة الجودة الأكاديمية",
    titleEn: "Academic Quality Policy",
    docType: "POLICY",
    docCode: "QD-POL-001",
    version: "2.1",
    status: "DOC_ACTIVE",
    descriptionAr: "السياسة العامة لضمان الجودة الأكاديمية في الكلية",
    effectiveDate: new Date("2024-01-01"),
    reviewDate: new Date("2025-06-30"),
  },
  {
    titleAr: "دليل إجراءات الاختبارات",
    titleEn: "Exam Procedures Guide",
    docType: "PROCEDURE",
    docCode: "QD-PRO-001",
    version: "1.3",
    status: "DOC_ACTIVE",
    descriptionAr: "الإجراءات المعتمدة لإعداد وتنفيذ وتصحيح الاختبارات",
    effectiveDate: new Date("2024-03-15"),
    reviewDate: new Date("2025-03-15"),
  },
  {
    titleAr: "نموذج مراجعة المقرر",
    titleEn: "Course Review Form",
    docType: "FORM",
    docCode: "QD-FRM-001",
    version: "1.0",
    status: "DOC_ACTIVE",
    descriptionAr: "نموذج موحد لمراجعة وتقييم المقررات الدراسية",
    effectiveDate: new Date("2024-02-01"),
    reviewDate: new Date("2025-02-01"),
  },
  {
    titleAr: "دليل الجودة الشامل",
    titleEn: "Quality Manual",
    docType: "MANUAL",
    docCode: "QD-MAN-001",
    version: "3.0",
    status: "DOC_UNDER_REVIEW",
    descriptionAr: "الدليل الشامل لنظام إدارة الجودة بالكلية",
    effectiveDate: new Date("2023-09-01"),
    reviewDate: new Date("2024-12-31"),
  },
  {
    titleAr: "مرجع معايير NCAAA",
    titleEn: "NCAAA Standards Reference",
    docType: "DOC_STANDARD",
    docCode: "QD-STD-001",
    version: "3.0",
    status: "DOC_ACTIVE",
    descriptionAr: "المرجع الرسمي لمعايير الاعتماد الأكاديمي NCAAA الإصدار الثالث",
    effectiveDate: new Date("2024-01-01"),
    reviewDate: new Date("2026-01-01"),
  },
];

// -----------------------------------------------------------------------------
// Meeting Definitions
// -----------------------------------------------------------------------------

interface MeetingDef {
  titleAr: string;
  meetingType: "QUALITY_COMMITTEE" | "AUDIT_TEAM" | "PLANNING";
  meetingDate: Date;
  location: string;
  status: "MEETING_COMPLETED" | "SCHEDULED";
  agenda: string;
  minutes: string | null;
  attendeesCount: number;
  decisions: string[];
  actionItems: string[];
}

const QUALITY_MEETINGS: MeetingDef[] = [
  {
    titleAr: "اجتماع لجنة الجودة - يناير 2025",
    meetingType: "QUALITY_COMMITTEE",
    meetingDate: new Date("2025-01-15T10:00:00"),
    location: "قاعة الاجتماعات الرئيسية",
    status: "MEETING_COMPLETED",
    agenda: "1. مراجعة نتائج الفصل الأول\n2. تقييم خطط التحسين\n3. الاستعداد للاعتماد\n4. متابعة مؤشرات الأداء",
    minutes: "تم مناقشة نتائج الفصل الأول وأظهرت تحسناً ملحوظاً في معدلات النجاح. تم الاتفاق على تكثيف الجهود للاستعداد لزيارة الاعتماد المقررة.",
    attendeesCount: 8,
    decisions: [
      "تشكيل فريق عمل للاستعداد للاعتماد",
      "تحديث خطط التحسين الحالية",
      "زيادة ميزانية التطوير المهني",
    ],
    actionItems: [
      "إعداد تقرير الدراسة الذاتية خلال شهرين",
      "تحديث ملفات البرامج الأكاديمية",
      "عقد ورش عمل تدريبية للمدربين",
    ],
  },
  {
    titleAr: "اجتماع فريق المراجعة - فبراير 2025",
    meetingType: "AUDIT_TEAM",
    meetingDate: new Date("2025-02-10T09:00:00"),
    location: "مكتب نائب العميد للجودة",
    status: "MEETING_COMPLETED",
    agenda: "1. مراجعة نتائج المراجعة الداخلية\n2. متابعة تنفيذ التوصيات\n3. تخطيط المراجعات القادمة",
    minutes: "تم استعراض نتائج المراجعة الداخلية الأخيرة. تم تحديد 3 نقاط قوة و 2 ملاحظات تحتاج متابعة.",
    attendeesCount: 5,
    decisions: [
      "إغلاق 4 ملاحظات سابقة تم معالجتها",
      "تحديد مواعيد المراجعات الميدانية",
    ],
    actionItems: [
      "إعداد خطة المراجعة للفصل الثاني",
      "جمع الأدلة والشواهد المطلوبة",
    ],
  },
  {
    titleAr: "جلسة تخطيط - مارس 2025",
    meetingType: "PLANNING",
    meetingDate: new Date("2025-03-05T11:00:00"),
    location: "قاعة المؤتمرات",
    status: "SCHEDULED",
    agenda: "1. مراجعة الخطة الاستراتيجية\n2. تحديد أولويات الفصل الثاني\n3. تخصيص الموارد\n4. مناقشة الشراكات الجديدة",
    minutes: null,
    attendeesCount: 10,
    decisions: [],
    actionItems: [],
  },
];

// =============================================================================
// Main Seed Function
// =============================================================================

export async function seedQuality(prisma: PrismaClient, adminUsers: any) {
  console.log("  Seeding additional quality data...");

  // ---------------------------------------------------------------------------
  // 1. KPI Measurements (48 measurements - 3 per KPI for 16 KPIs)
  // ---------------------------------------------------------------------------
  console.log("    Seeding KPI measurements...");

  // Fetch existing KPIs
  const existingKpis = await prisma.qualityKpi.findMany({
    orderBy: { kpiCode: "asc" },
  });

  if (existingKpis.length === 0) {
    console.log("    WARNING: No existing KPIs found. Skipping KPI measurements.");
  } else {
    // Get the vp_quality quality staff record for measuredById
    const vpQualityUser = adminUsers?.vp_quality;
    let qualityStaffId: string | null = null;

    if (vpQualityUser) {
      const qualityStaff = await prisma.qualityStaff.findUnique({
        where: { userId: vpQualityUser.id },
      });
      qualityStaffId = qualityStaff?.id ?? null;
    }

    // If we couldn't find it via adminUsers, try fallback
    if (!qualityStaffId) {
      const fallbackStaff = await prisma.qualityStaff.findFirst({
        where: { position: "HEAD" },
      });
      qualityStaffId = fallbackStaff?.id ?? null;
    }

    const measurementMonths = [
      { date: new Date("2024-10-15"), label: "Oct 2024" },
      { date: new Date("2024-11-15"), label: "Nov 2024" },
      { date: new Date("2024-12-15"), label: "Dec 2024" },
    ];

    const measurements: Array<{
      kpiId: string;
      measurementDate: Date;
      actualValue: number;
      targetValue: number;
      achievementRate: number;
      status: "EXCEEDS" | "MEETS" | "BELOW" | "CRITICAL";
      notes: string;
      measuredById: string | null;
    }> = [];

    for (const kpi of existingKpis) {
      const profile = getKpiProfile(kpi.measurementUnit, kpi.targetValue);

      for (let monthIdx = 0; monthIdx < 3; monthIdx++) {
        const baseVal = profile.baseValues[monthIdx];
        const variance = (Math.random() - 0.5) * 2 * profile.variance;
        let actualValue = baseVal + variance;

        // Round appropriately based on unit
        if (kpi.measurementUnit === "GPA" || kpi.measurementUnit === "1-5") {
          actualValue = Math.round(actualValue * 100) / 100;
        } else if (kpi.measurementUnit === "count") {
          actualValue = Math.round(actualValue);
        } else {
          actualValue = Math.round(actualValue * 10) / 10;
        }

        const achievementRate = Math.round((actualValue / kpi.targetValue) * 10000) / 100;
        const status = getKpiStatus(achievementRate);

        measurements.push({
          kpiId: kpi.id,
          measurementDate: measurementMonths[monthIdx].date,
          actualValue,
          targetValue: kpi.targetValue,
          achievementRate,
          status,
          notes: `قياس ${measurementMonths[monthIdx].label} - ${kpi.nameAr}`,
          measuredById: qualityStaffId,
        });
      }
    }

    await prisma.kpiMeasurement.createMany({ data: measurements });
    console.log(`    Created ${measurements.length} KPI measurements.`);
  }

  // ---------------------------------------------------------------------------
  // 2. Quality Surveys (3 surveys)
  // ---------------------------------------------------------------------------
  console.log("    Seeding quality surveys...");

  const surveyQuestions = [
    {
      id: "q1",
      textAr: "ما مدى رضاك عن جودة التدريس؟",
      textEn: "How satisfied are you with teaching quality?",
      type: "rating",
      scale: 5,
    },
    {
      id: "q2",
      textAr: "ما مدى رضاك عن المرافق والتجهيزات؟",
      textEn: "How satisfied are you with facilities?",
      type: "rating",
      scale: 5,
    },
    {
      id: "q3",
      textAr: "ما مدى رضاك عن الخدمات المقدمة؟",
      textEn: "How satisfied are you with services?",
      type: "rating",
      scale: 5,
    },
    {
      id: "q4",
      textAr: "هل لديك مقترحات للتحسين؟",
      textEn: "Do you have improvement suggestions?",
      type: "text",
    },
  ];

  for (const survey of SURVEYS) {
    await prisma.qualitySurvey.create({
      data: {
        titleAr: survey.titleAr,
        titleEn: survey.titleEn,
        surveyType: survey.surveyType,
        targetAudience: survey.targetAudience,
        semester: "2024-T1",
        academicYear: "2024-2025",
        startDate: survey.startDate,
        endDate: survey.endDate,
        questions: surveyQuestions,
        totalResponses: survey.totalResponses,
        status: survey.status,
      },
    });
  }

  console.log(`    Created ${SURVEYS.length} quality surveys.`);

  // ---------------------------------------------------------------------------
  // 3. Quality Documents (5 documents)
  // ---------------------------------------------------------------------------
  console.log("    Seeding quality documents...");

  // Get a quality staff owner
  let docOwnerId: string | null = null;
  const qualityOfficerUser = adminUsers?.quality_officer;
  if (qualityOfficerUser) {
    const qs = await prisma.qualityStaff.findUnique({
      where: { userId: qualityOfficerUser.id },
    });
    docOwnerId = qs?.id ?? null;
  }
  if (!docOwnerId) {
    const fallback = await prisma.qualityStaff.findFirst({
      where: { position: "COORDINATOR" },
    });
    docOwnerId = fallback?.id ?? null;
  }

  for (const doc of QUALITY_DOCUMENTS) {
    await prisma.qualityDocument.upsert({
      where: { docCode: doc.docCode },
      update: {},
      create: {
        titleAr: doc.titleAr,
        titleEn: doc.titleEn,
        docType: doc.docType,
        docCode: doc.docCode,
        version: doc.version,
        descriptionAr: doc.descriptionAr,
        effectiveDate: doc.effectiveDate,
        reviewDate: doc.reviewDate,
        status: doc.status,
        ownerId: docOwnerId,
      },
    });
  }

  console.log(`    Created ${QUALITY_DOCUMENTS.length} quality documents.`);

  // ---------------------------------------------------------------------------
  // 4. Quality Meetings (3 meetings)
  // ---------------------------------------------------------------------------
  console.log("    Seeding quality meetings...");

  // Get a quality staff creator
  let meetingCreatorId: string | null = null;
  if (qualityOfficerUser) {
    const qs = await prisma.qualityStaff.findUnique({
      where: { userId: qualityOfficerUser.id },
    });
    meetingCreatorId = qs?.id ?? null;
  }
  if (!meetingCreatorId) {
    const fallback = await prisma.qualityStaff.findFirst();
    meetingCreatorId = fallback?.id ?? null;
  }

  for (const mtg of QUALITY_MEETINGS) {
    // Build attendee list as JSON
    const attendees = Array.from({ length: mtg.attendeesCount }, (_, i) => ({
      name: `عضو ${i + 1}`,
      role: i === 0 ? "رئيس الاجتماع" : "عضو",
    }));

    await prisma.qualityMeeting.create({
      data: {
        titleAr: mtg.titleAr,
        meetingType: mtg.meetingType,
        meetingDate: mtg.meetingDate,
        location: mtg.location,
        status: mtg.status,
        agenda: mtg.agenda,
        minutes: mtg.minutes,
        attendees,
        decisions: mtg.decisions,
        actionItems: mtg.actionItems,
        createdById: meetingCreatorId,
      },
    });
  }

  console.log(`    Created ${QUALITY_MEETINGS.length} quality meetings.`);

  console.log("  Additional quality seed complete.");
}
