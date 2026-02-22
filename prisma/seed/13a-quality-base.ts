import type { PrismaClient } from "@prisma/client";

// =============================================================================
// Campus26 Quality BASE Seed Data
// Creates foundational quality records: QualityStaff, QualityStandard,
// QualityKpi, QualityAudit, AuditFinding, ImprovementPlan,
// ImprovementAction, Accreditation
//
// Must run BEFORE 13-quality.ts (the additive quality seed)
// =============================================================================

// -----------------------------------------------------------------------------
// Quality Standards - NCAAA v3 aligned for Saudi technical colleges
// -----------------------------------------------------------------------------

interface StandardDef {
  standardCode: string;
  nameAr: string;
  nameEn: string;
  category: "ACADEMIC" | "INSTITUTIONAL" | "PROGRAM" | "LEARNING_OUTCOMES";
  descriptionAr: string;
  descriptionEn: string;
  weight: number;
  ncaaaVersion: string;
}

const QUALITY_STANDARDS: StandardDef[] = [
  // INSTITUTIONAL (3)
  {
    standardCode: "NCAAA-S1",
    nameAr: "الرسالة والأهداف والتخطيط",
    nameEn: "Mission, Goals and Planning",
    category: "INSTITUTIONAL",
    descriptionAr:
      "يجب أن تكون للمؤسسة رسالة واضحة وأهداف محددة وخطط استراتيجية قابلة للقياس تتوافق مع رؤية المملكة 2030",
    descriptionEn:
      "The institution must have a clear mission, defined goals, and measurable strategic plans aligned with Saudi Vision 2030",
    weight: 10,
    ncaaaVersion: "3.0",
  },
  {
    standardCode: "NCAAA-S2",
    nameAr: "الحوكمة والإدارة والقيادة",
    nameEn: "Governance, Administration and Leadership",
    category: "INSTITUTIONAL",
    descriptionAr:
      "يجب أن تتوفر هياكل حوكمة فعالة وقيادة مؤهلة تضمن اتخاذ القرارات بشفافية ومساءلة",
    descriptionEn:
      "Effective governance structures and qualified leadership must ensure transparent and accountable decision-making",
    weight: 10,
    ncaaaVersion: "3.0",
  },
  {
    standardCode: "NCAAA-S3",
    nameAr: "إدارة ضمان الجودة",
    nameEn: "Quality Assurance Management",
    category: "INSTITUTIONAL",
    descriptionAr:
      "يجب أن يكون لدى المؤسسة نظام شامل لضمان الجودة يتضمن آليات التقويم والمراجعة والتحسين المستمر",
    descriptionEn:
      "The institution must have a comprehensive quality assurance system including evaluation, review, and continuous improvement mechanisms",
    weight: 15,
    ncaaaVersion: "3.0",
  },
  // ACADEMIC (3)
  {
    standardCode: "NCAAA-S4",
    nameAr: "التعليم والتعلم",
    nameEn: "Teaching and Learning",
    category: "ACADEMIC",
    descriptionAr:
      "يجب أن تطبق المؤسسة استراتيجيات تعليم وتعلم فعالة تركز على المتدرب وتحقق مخرجات التعلم المستهدفة",
    descriptionEn:
      "The institution must apply effective student-centered teaching and learning strategies that achieve targeted learning outcomes",
    weight: 15,
    ncaaaVersion: "3.0",
  },
  {
    standardCode: "NCAAA-S5",
    nameAr: "أعضاء هيئة التدريب",
    nameEn: "Training Staff",
    category: "ACADEMIC",
    descriptionAr:
      "يجب توفير أعضاء هيئة تدريب مؤهلين بأعداد كافية مع برامج تطوير مهني مستمرة وتقييم أداء دوري",
    descriptionEn:
      "Sufficient qualified training staff must be provided with continuous professional development programs and periodic performance evaluation",
    weight: 10,
    ncaaaVersion: "3.0",
  },
  {
    standardCode: "NCAAA-S6",
    nameAr: "الموارد التعليمية والمرافق",
    nameEn: "Educational Resources and Facilities",
    category: "ACADEMIC",
    descriptionAr:
      "يجب توفير موارد تعليمية ومرافق وتجهيزات كافية وحديثة تدعم العملية التعليمية والتدريبية",
    descriptionEn:
      "Adequate and modern educational resources, facilities, and equipment must support the teaching and training process",
    weight: 10,
    ncaaaVersion: "3.0",
  },
  // PROGRAM (2)
  {
    standardCode: "NCAAA-S7",
    nameAr: "تصميم البرامج وإدارتها",
    nameEn: "Program Design and Management",
    category: "PROGRAM",
    descriptionAr:
      "يجب أن تصمم البرامج التدريبية وفق احتياجات سوق العمل مع مراجعة دورية وتحديث مستمر للمحتوى",
    descriptionEn:
      "Training programs must be designed according to labor market needs with periodic review and continuous content updates",
    weight: 10,
    ncaaaVersion: "3.0",
  },
  {
    standardCode: "NCAAA-S8",
    nameAr: "شؤون المتدربين وخدمات الدعم",
    nameEn: "Trainee Affairs and Support Services",
    category: "PROGRAM",
    descriptionAr:
      "يجب توفير خدمات دعم شاملة للمتدربين تشمل الإرشاد الأكاديمي والمهني والنفسي والأنشطة اللامنهجية",
    descriptionEn:
      "Comprehensive trainee support services must be provided including academic, career, and psychological counseling, and extracurricular activities",
    weight: 10,
    ncaaaVersion: "3.0",
  },
  // LEARNING_OUTCOMES (2)
  {
    standardCode: "NCAAA-S9",
    nameAr: "مخرجات التعلم وتقييمها",
    nameEn: "Learning Outcomes and Assessment",
    category: "LEARNING_OUTCOMES",
    descriptionAr:
      "يجب تحديد مخرجات تعلم واضحة وقابلة للقياس لكل برنامج ومقرر مع آليات تقييم متنوعة وعادلة",
    descriptionEn:
      "Clear, measurable learning outcomes must be defined for each program and course with diverse and fair assessment mechanisms",
    weight: 10,
    ncaaaVersion: "3.0",
  },
  {
    standardCode: "NCAAA-S10",
    nameAr: "البحث العلمي وخدمة المجتمع",
    nameEn: "Research and Community Service",
    category: "LEARNING_OUTCOMES",
    descriptionAr:
      "يجب أن تسهم المؤسسة في البحث العلمي التطبيقي وخدمة المجتمع المحلي وبناء شراكات مع القطاعين العام والخاص",
    descriptionEn:
      "The institution must contribute to applied research, local community service, and build partnerships with public and private sectors",
    weight: 10,
    ncaaaVersion: "3.0",
  },
];

// -----------------------------------------------------------------------------
// Quality KPIs - linked to standards
// -----------------------------------------------------------------------------

interface KpiDef {
  kpiCode: string;
  standardCode: string; // links to QUALITY_STANDARDS above
  nameAr: string;
  nameEn: string;
  descriptionAr: string;
  measurementUnit: string;
  targetValue: number;
  minAcceptableValue: number;
  calculationMethod: string;
  dataSource: string;
  frequency: "DAILY" | "WEEKLY" | "MONTHLY" | "QUARTERLY" | "SEMESTER" | "ANNUAL";
  responsibleDept: string;
}

const QUALITY_KPIS: KpiDef[] = [
  // NCAAA-S1: Mission, Goals, Planning
  {
    kpiCode: "KPI-01",
    standardCode: "NCAAA-S1",
    nameAr: "نسبة تحقيق الأهداف الاستراتيجية",
    nameEn: "Strategic Goals Achievement Rate",
    descriptionAr: "نسبة الأهداف الاستراتيجية المحققة من إجمالي الأهداف المعتمدة في الخطة الاستراتيجية",
    measurementUnit: "%",
    targetValue: 85,
    minAcceptableValue: 70,
    calculationMethod: "(عدد الأهداف المحققة / إجمالي الأهداف) × 100",
    dataSource: "تقارير الأداء المؤسسي",
    frequency: "ANNUAL",
    responsibleDept: "مكتب العميد",
  },
  {
    kpiCode: "KPI-02",
    standardCode: "NCAAA-S1",
    nameAr: "نسبة رضا أصحاب المصلحة عن الرؤية والرسالة",
    nameEn: "Stakeholder Satisfaction with Vision & Mission",
    descriptionAr: "مستوى رضا أصحاب المصلحة عن وضوح وملاءمة رسالة وأهداف المؤسسة",
    measurementUnit: "1-5",
    targetValue: 4.0,
    minAcceptableValue: 3.5,
    calculationMethod: "متوسط تقييم أصحاب المصلحة على مقياس ليكرت الخماسي",
    dataSource: "استبيانات أصحاب المصلحة",
    frequency: "ANNUAL",
    responsibleDept: "وحدة الجودة",
  },
  // NCAAA-S3: Quality Assurance Management
  {
    kpiCode: "KPI-03",
    standardCode: "NCAAA-S3",
    nameAr: "نسبة تنفيذ خطط التحسين",
    nameEn: "Improvement Plans Completion Rate",
    descriptionAr: "نسبة خطط التحسين المنجزة من إجمالي الخطط المعتمدة خلال الفترة",
    measurementUnit: "%",
    targetValue: 90,
    minAcceptableValue: 75,
    calculationMethod: "(عدد الخطط المكتملة / إجمالي الخطط المعتمدة) × 100",
    dataSource: "نظام متابعة خطط التحسين",
    frequency: "SEMESTER",
    responsibleDept: "وحدة الجودة",
  },
  {
    kpiCode: "KPI-04",
    standardCode: "NCAAA-S3",
    nameAr: "نسبة إغلاق ملاحظات المراجعة",
    nameEn: "Audit Finding Closure Rate",
    descriptionAr: "نسبة ملاحظات المراجعة التي تم معالجتها وإغلاقها ضمن المهلة المحددة",
    measurementUnit: "%",
    targetValue: 85,
    minAcceptableValue: 70,
    calculationMethod: "(عدد الملاحظات المغلقة / إجمالي الملاحظات) × 100",
    dataSource: "نظام المراجعات الداخلية",
    frequency: "QUARTERLY",
    responsibleDept: "وحدة الجودة",
  },
  // NCAAA-S4: Teaching and Learning
  {
    kpiCode: "KPI-05",
    standardCode: "NCAAA-S4",
    nameAr: "نسبة نجاح المتدربين",
    nameEn: "Trainee Pass Rate",
    descriptionAr: "نسبة المتدربين الناجحين من إجمالي المتدربين المسجلين في الفصل الدراسي",
    measurementUnit: "%",
    targetValue: 85,
    minAcceptableValue: 75,
    calculationMethod: "(عدد المتدربين الناجحين / إجمالي المتدربين المسجلين) × 100",
    dataSource: "نظام شؤون المتدربين",
    frequency: "SEMESTER",
    responsibleDept: "شؤون المتدربين",
  },
  {
    kpiCode: "KPI-06",
    standardCode: "NCAAA-S4",
    nameAr: "معدل رضا المتدربين عن جودة التدريس",
    nameEn: "Trainee Satisfaction with Teaching Quality",
    descriptionAr: "متوسط تقييم المتدربين لجودة العملية التعليمية والتدريبية",
    measurementUnit: "1-5",
    targetValue: 4.0,
    minAcceptableValue: 3.5,
    calculationMethod: "متوسط تقييم المتدربين على مقياس ليكرت الخماسي",
    dataSource: "استبيان تقييم المقررات",
    frequency: "SEMESTER",
    responsibleDept: "شؤون المتدربين",
  },
  {
    kpiCode: "KPI-07",
    standardCode: "NCAAA-S4",
    nameAr: "المعدل التراكمي العام للمتدربين",
    nameEn: "Overall Trainee GPA",
    descriptionAr: "متوسط المعدل التراكمي لجميع المتدربين المنتظمين",
    measurementUnit: "GPA",
    targetValue: 3.0,
    minAcceptableValue: 2.5,
    calculationMethod: "مجموع المعدلات التراكمية / عدد المتدربين",
    dataSource: "نظام السجلات الأكاديمية",
    frequency: "SEMESTER",
    responsibleDept: "شؤون المتدربين",
  },
  // NCAAA-S5: Training Staff
  {
    kpiCode: "KPI-08",
    standardCode: "NCAAA-S5",
    nameAr: "نسبة المدربين الحاصلين على تأهيل عالٍ",
    nameEn: "Highly Qualified Trainers Ratio",
    descriptionAr: "نسبة المدربين الحاصلين على ماجستير أو دكتوراه من إجمالي المدربين",
    measurementUnit: "%",
    targetValue: 70,
    minAcceptableValue: 50,
    calculationMethod: "(عدد المدربين بتأهيل عالٍ / إجمالي المدربين) × 100",
    dataSource: "ملفات شؤون الموظفين",
    frequency: "ANNUAL",
    responsibleDept: "شؤون المدربين",
  },
  {
    kpiCode: "KPI-09",
    standardCode: "NCAAA-S5",
    nameAr: "ساعات التطوير المهني لكل مدرب",
    nameEn: "Professional Development Hours per Trainer",
    descriptionAr: "متوسط ساعات التدريب والتطوير المهني التي حصل عليها كل مدرب خلال العام",
    measurementUnit: "hours",
    targetValue: 30,
    minAcceptableValue: 20,
    calculationMethod: "إجمالي ساعات التدريب / عدد المدربين",
    dataSource: "سجلات التطوير المهني",
    frequency: "ANNUAL",
    responsibleDept: "شؤون المدربين",
  },
  // NCAAA-S6: Resources and Facilities
  {
    kpiCode: "KPI-10",
    standardCode: "NCAAA-S6",
    nameAr: "نسبة رضا المتدربين عن المرافق",
    nameEn: "Trainee Satisfaction with Facilities",
    descriptionAr: "مستوى رضا المتدربين عن المرافق التعليمية والتجهيزات المتاحة",
    measurementUnit: "1-5",
    targetValue: 3.8,
    minAcceptableValue: 3.0,
    calculationMethod: "متوسط تقييم المتدربين على مقياس ليكرت الخماسي",
    dataSource: "استبيان رضا المتدربين",
    frequency: "SEMESTER",
    responsibleDept: "الشؤون الإدارية",
  },
  // NCAAA-S7: Program Design
  {
    kpiCode: "KPI-11",
    standardCode: "NCAAA-S7",
    nameAr: "نسبة البرامج المراجعة دورياً",
    nameEn: "Periodically Reviewed Programs Rate",
    descriptionAr: "نسبة البرامج التي خضعت لمراجعة دورية خلال آخر عامين",
    measurementUnit: "%",
    targetValue: 100,
    minAcceptableValue: 80,
    calculationMethod: "(عدد البرامج المراجعة / إجمالي البرامج) × 100",
    dataSource: "سجلات مراجعة البرامج",
    frequency: "ANNUAL",
    responsibleDept: "شؤون المدربين",
  },
  {
    kpiCode: "KPI-12",
    standardCode: "NCAAA-S7",
    nameAr: "نسبة توظيف الخريجين",
    nameEn: "Graduate Employment Rate",
    descriptionAr: "نسبة الخريجين الذين حصلوا على وظيفة خلال 6 أشهر من التخرج",
    measurementUnit: "%",
    targetValue: 75,
    minAcceptableValue: 60,
    calculationMethod: "(عدد الخريجين الموظفين / إجمالي الخريجين) × 100",
    dataSource: "استبيان تتبع الخريجين",
    frequency: "ANNUAL",
    responsibleDept: "شؤون المتدربين",
  },
  // NCAAA-S8: Trainee Affairs
  {
    kpiCode: "KPI-13",
    standardCode: "NCAAA-S8",
    nameAr: "نسبة التسرب (الانسحاب)",
    nameEn: "Dropout Rate",
    descriptionAr: "نسبة المتدربين المنسحبين من إجمالي المتدربين المسجلين",
    measurementUnit: "%",
    targetValue: 5,
    minAcceptableValue: 10,
    calculationMethod: "(عدد المتدربين المنسحبين / إجمالي المتدربين) × 100",
    dataSource: "نظام شؤون المتدربين",
    frequency: "SEMESTER",
    responsibleDept: "شؤون المتدربين",
  },
  // NCAAA-S9: Learning Outcomes
  {
    kpiCode: "KPI-14",
    standardCode: "NCAAA-S9",
    nameAr: "نسبة المقررات المحققة لمخرجات التعلم",
    nameEn: "Courses Achieving Learning Outcomes Rate",
    descriptionAr: "نسبة المقررات التي حققت 80% أو أكثر من مخرجات التعلم المستهدفة",
    measurementUnit: "%",
    targetValue: 90,
    minAcceptableValue: 75,
    calculationMethod: "(عدد المقررات المحققة / إجمالي المقررات) × 100",
    dataSource: "تقارير مخرجات التعلم",
    frequency: "SEMESTER",
    responsibleDept: "وحدة الجودة",
  },
  {
    kpiCode: "KPI-15",
    standardCode: "NCAAA-S9",
    nameAr: "نسبة تنوع أساليب التقييم",
    nameEn: "Assessment Methods Diversity Rate",
    descriptionAr: "نسبة المقررات التي تستخدم 3 أساليب تقييم مختلفة أو أكثر",
    measurementUnit: "%",
    targetValue: 80,
    minAcceptableValue: 60,
    calculationMethod: "(عدد المقررات بتقييم متنوع / إجمالي المقررات) × 100",
    dataSource: "توصيف المقررات",
    frequency: "SEMESTER",
    responsibleDept: "شؤون المدربين",
  },
  // NCAAA-S10: Research and Community Service
  {
    kpiCode: "KPI-16",
    standardCode: "NCAAA-S10",
    nameAr: "عدد الشراكات المجتمعية الفاعلة",
    nameEn: "Active Community Partnerships Count",
    descriptionAr: "عدد الشراكات الفعالة مع مؤسسات القطاعين العام والخاص",
    measurementUnit: "count",
    targetValue: 10,
    minAcceptableValue: 5,
    calculationMethod: "إحصاء الشراكات النشطة ذات الأنشطة المنفذة",
    dataSource: "سجل الشراكات المجتمعية",
    frequency: "ANNUAL",
    responsibleDept: "وحدة الشراكات",
  },
];

// =============================================================================
// Main Seed Function
// =============================================================================

export async function seedQualityBase(prisma: PrismaClient, adminUsers: any) {
  console.log("  Seeding quality BASE data...");

  // ---------------------------------------------------------------------------
  // 1. Quality Staff (3 records)
  // ---------------------------------------------------------------------------
  console.log("    Creating quality staff...");

  const vpQualityUser = adminUsers.vp_quality;
  const qualityOfficerUser = adminUsers.quality_officer;
  const deanUser = adminUsers.dean;

  const qualityStaffHead = await prisma.qualityStaff.upsert({
    where: { userId: vpQualityUser.id },
    update: {},
    create: {
      userId: vpQualityUser.id,
      fullNameAr: vpQualityUser.nameAr,
      fullNameEn: vpQualityUser.nameEn,
      email: vpQualityUser.email,
      phone: vpQualityUser.phone ?? "0504567890",
      position: "HEAD",
      specialization: "إدارة الجودة والاعتماد الأكاديمي",
      hireDate: new Date("2020-09-01"),
      status: "ACTIVE",
    },
  });

  const qualityStaffCoordinator = await prisma.qualityStaff.upsert({
    where: { userId: qualityOfficerUser.id },
    update: {},
    create: {
      userId: qualityOfficerUser.id,
      fullNameAr: qualityOfficerUser.nameAr,
      fullNameEn: qualityOfficerUser.nameEn,
      email: qualityOfficerUser.email,
      phone: qualityOfficerUser.phone ?? "0506789012",
      position: "COORDINATOR",
      specialization: "ضمان الجودة والتقويم المؤسسي",
      hireDate: new Date("2021-02-15"),
      status: "ACTIVE",
    },
  });

  const qualityStaffAuditor = await prisma.qualityStaff.upsert({
    where: { userId: deanUser.id },
    update: {},
    create: {
      userId: deanUser.id,
      fullNameAr: deanUser.nameAr,
      fullNameEn: deanUser.nameEn,
      email: deanUser.email,
      phone: deanUser.phone ?? "0501234567",
      position: "AUDITOR",
      specialization: "المراجعة الداخلية والامتثال",
      hireDate: new Date("2019-01-10"),
      status: "ACTIVE",
    },
  });

  console.log("    Created 3 quality staff members.");

  // ---------------------------------------------------------------------------
  // 2. Quality Standards (10 records)
  // ---------------------------------------------------------------------------
  console.log("    Creating quality standards...");

  const standardsMap: Record<string, any> = {};

  for (const std of QUALITY_STANDARDS) {
    const record = await prisma.qualityStandard.upsert({
      where: { standardCode: std.standardCode },
      update: {},
      create: {
        standardCode: std.standardCode,
        nameAr: std.nameAr,
        nameEn: std.nameEn,
        category: std.category,
        descriptionAr: std.descriptionAr,
        descriptionEn: std.descriptionEn,
        weight: std.weight,
        ncaaaVersion: std.ncaaaVersion,
        isActive: true,
      },
    });
    standardsMap[std.standardCode] = record;
  }

  console.log(`    Created ${QUALITY_STANDARDS.length} quality standards.`);

  // ---------------------------------------------------------------------------
  // 3. Quality KPIs (16 records)
  // ---------------------------------------------------------------------------
  console.log("    Creating quality KPIs...");

  const kpisMap: Record<string, any> = {};

  for (const kpi of QUALITY_KPIS) {
    const standard = standardsMap[kpi.standardCode];
    const record = await prisma.qualityKpi.upsert({
      where: { kpiCode: kpi.kpiCode },
      update: {},
      create: {
        standardId: standard?.id ?? null,
        kpiCode: kpi.kpiCode,
        nameAr: kpi.nameAr,
        nameEn: kpi.nameEn,
        descriptionAr: kpi.descriptionAr,
        measurementUnit: kpi.measurementUnit,
        targetValue: kpi.targetValue,
        minAcceptableValue: kpi.minAcceptableValue,
        calculationMethod: kpi.calculationMethod,
        dataSource: kpi.dataSource,
        frequency: kpi.frequency,
        responsibleDept: kpi.responsibleDept,
        isActive: true,
      },
    });
    kpisMap[kpi.kpiCode] = record;
  }

  console.log(`    Created ${QUALITY_KPIS.length} quality KPIs.`);

  // ---------------------------------------------------------------------------
  // 4. Quality Audits (3 records)
  // ---------------------------------------------------------------------------
  console.log("    Creating quality audits...");

  const auditInternal = await prisma.qualityAudit.create({
    data: {
      auditType: "INTERNAL",
      titleAr: "المراجعة الداخلية الشاملة - الفصل الأول 1446هـ",
      titleEn: "Comprehensive Internal Audit - Semester 1, 1446H",
      scheduledDate: new Date("2024-10-01"),
      completionDate: new Date("2024-11-15"),
      status: "COMPLETED",
      leadAuditorId: qualityStaffHead.id,
      createdById: qualityStaffCoordinator.id,
      auditTeam: [
        { name: qualityStaffHead.fullNameAr, role: "رئيس فريق المراجعة" },
        { name: qualityStaffCoordinator.fullNameAr, role: "منسق المراجعة" },
        { name: qualityStaffAuditor.fullNameAr, role: "مراجع" },
      ],
      scopeAr:
        "مراجعة شاملة لجميع الأقسام الأكاديمية والإدارية وفق معايير NCAAA الإصدار الثالث",
      findingsSummary:
        "أسفرت المراجعة عن تحديد 3 نقاط قوة و2 ملاحظة تحسين و1 حالة عدم مطابقة. الأداء العام جيد مع وجود فرص تحسين في مجال التوثيق.",
      overallRating: "GOOD",
    },
  });

  const auditProgramReview = await prisma.qualityAudit.create({
    data: {
      auditType: "PROGRAM_REVIEW",
      titleAr: "مراجعة برنامج تقنية الحاسب - 2024",
      titleEn: "Computer Technology Program Review - 2024",
      scheduledDate: new Date("2024-11-01"),
      completionDate: new Date("2024-12-20"),
      status: "IN_PROGRESS",
      leadAuditorId: qualityStaffCoordinator.id,
      createdById: qualityStaffHead.id,
      auditTeam: [
        { name: qualityStaffCoordinator.fullNameAr, role: "رئيس فريق المراجعة" },
        { name: "م. خالد السعيد", role: "خبير أكاديمي" },
      ],
      scopeAr:
        "مراجعة شاملة لبرنامج تقنية الحاسب تشمل المنهج والمخرجات والموارد وآراء أصحاب المصلحة",
      overallRating: null,
    },
  });

  const auditSelfAssessment = await prisma.qualityAudit.create({
    data: {
      auditType: "SELF_ASSESSMENT",
      titleAr: "الدراسة الذاتية المؤسسية - 2025",
      titleEn: "Institutional Self-Study - 2025",
      scheduledDate: new Date("2025-03-01"),
      status: "PLANNED",
      leadAuditorId: qualityStaffHead.id,
      createdById: qualityStaffHead.id,
      auditTeam: [
        { name: qualityStaffHead.fullNameAr, role: "المشرف العام" },
        { name: qualityStaffCoordinator.fullNameAr, role: "منسق الدراسة الذاتية" },
        { name: qualityStaffAuditor.fullNameAr, role: "مشارك" },
      ],
      scopeAr:
        "إعداد تقرير الدراسة الذاتية المؤسسية استعداداً لزيارة هيئة تقويم التعليم والتدريب",
    },
  });

  console.log("    Created 3 quality audits.");

  // ---------------------------------------------------------------------------
  // 5. Audit Findings (8 records)
  // ---------------------------------------------------------------------------
  console.log("    Creating audit findings...");

  // Findings for INTERNAL audit (6 findings)
  const finding1 = await prisma.auditFinding.create({
    data: {
      auditId: auditInternal.id,
      standardId: standardsMap["NCAAA-S4"]?.id,
      findingType: "STRENGTH",
      severity: "OBSERVATION",
      descriptionAr:
        "تميز ملحوظ في استخدام استراتيجيات التعليم النشط والتعلم التعاوني في أقسام تقنية الحاسب والأعمال الإدارية",
      descriptionEn:
        "Notable excellence in using active learning strategies and cooperative learning in CS and Business departments",
      evidence: "زيارات صفية، استبيانات المتدربين، ملفات المقررات",
      status: "CLOSED",
    },
  });

  const finding2 = await prisma.auditFinding.create({
    data: {
      auditId: auditInternal.id,
      standardId: standardsMap["NCAAA-S5"]?.id,
      findingType: "STRENGTH",
      severity: "OBSERVATION",
      descriptionAr:
        "برنامج تطوير مهني متكامل للمدربين يشمل ورش عمل ودورات تدريبية ومشاركات في مؤتمرات متخصصة",
      descriptionEn:
        "Comprehensive professional development program for trainers including workshops, courses, and specialized conference participation",
      evidence: "سجلات التطوير المهني، شهادات التدريب",
      status: "CLOSED",
    },
  });

  const finding3 = await prisma.auditFinding.create({
    data: {
      auditId: auditInternal.id,
      standardId: standardsMap["NCAAA-S3"]?.id,
      findingType: "STRENGTH",
      severity: "OBSERVATION",
      descriptionAr:
        "وجود نظام إلكتروني متكامل لإدارة الجودة يربط بين جميع عمليات الجودة والتحسين المستمر",
      descriptionEn:
        "Integrated electronic quality management system linking all quality and continuous improvement processes",
      evidence: "نظام Campus26، تقارير المتابعة الآلية",
      status: "CLOSED",
    },
  });

  const finding4 = await prisma.auditFinding.create({
    data: {
      auditId: auditInternal.id,
      standardId: standardsMap["NCAAA-S9"]?.id,
      findingType: "WEAKNESS",
      severity: "MAJOR",
      descriptionAr:
        "عدم اكتمال توثيق مصفوفات مخرجات التعلم لبعض البرامج التدريبية، مما يصعب قياس مدى تحقق المخرجات بشكل منهجي",
      descriptionEn:
        "Incomplete documentation of learning outcome matrices for some training programs, making systematic outcome measurement difficult",
      evidence: "مراجعة ملفات البرامج، مقابلات رؤساء الأقسام",
      recommendationAr:
        "إعداد وتحديث مصفوفات مخرجات التعلم لجميع البرامج خلال الفصل الدراسي القادم",
      responsibleDept: "شؤون المدربين",
      dueDate: new Date("2025-06-30"),
      status: "IN_PROGRESS",
    },
  });

  const finding5 = await prisma.auditFinding.create({
    data: {
      auditId: auditInternal.id,
      standardId: standardsMap["NCAAA-S6"]?.id,
      findingType: "WEAKNESS",
      severity: "MINOR",
      descriptionAr:
        "بعض المعامل تحتاج إلى تحديث الأجهزة والبرمجيات لمواكبة متطلبات المقررات الحديثة",
      descriptionEn:
        "Some labs need hardware and software updates to keep up with modern course requirements",
      evidence: "جرد المعامل، تقارير رؤساء الأقسام التقنية",
      recommendationAr:
        "إعداد خطة تحديث للمعامل ذات الأولوية وتخصيص ميزانية كافية",
      responsibleDept: "الشؤون الإدارية",
      dueDate: new Date("2025-09-01"),
      status: "OPEN",
    },
  });

  const finding6 = await prisma.auditFinding.create({
    data: {
      auditId: auditInternal.id,
      standardId: standardsMap["NCAAA-S2"]?.id,
      findingType: "NON_COMPLIANCE",
      severity: "CRITICAL",
      descriptionAr:
        "عدم وجود محاضر موثقة لبعض اجتماعات المجالس واللجان الأكاديمية خلال الفصل الماضي مما يخالف متطلبات الحوكمة",
      descriptionEn:
        "Missing documented minutes for some academic council and committee meetings from last semester, violating governance requirements",
      evidence: "مراجعة سجلات الاجتماعات، مقابلات أمناء المجالس",
      recommendationAr:
        "إلزام جميع المجالس واللجان بتوثيق المحاضر إلكترونياً خلال أسبوع من الاجتماع وتفعيل آلية المتابعة",
      responsibleDept: "مكتب العميد",
      dueDate: new Date("2025-03-31"),
      status: "IN_PROGRESS",
    },
  });

  // Findings for PROGRAM_REVIEW audit (2 findings)
  const finding7 = await prisma.auditFinding.create({
    data: {
      auditId: auditProgramReview.id,
      standardId: standardsMap["NCAAA-S7"]?.id,
      findingType: "STRENGTH",
      severity: "OBSERVATION",
      descriptionAr:
        "البرنامج يتضمن مقررات تدريب تعاوني مع شركات تقنية رائدة مما يعزز الجاهزية المهنية للمتدربين",
      descriptionEn:
        "The program includes cooperative training courses with leading tech companies, enhancing professional readiness",
      evidence: "اتفاقيات التدريب التعاوني، تقارير المتدربين",
      status: "OPEN",
    },
  });

  const finding8 = await prisma.auditFinding.create({
    data: {
      auditId: auditProgramReview.id,
      standardId: standardsMap["NCAAA-S7"]?.id,
      findingType: "WEAKNESS",
      severity: "MINOR",
      descriptionAr:
        "بعض المقررات التخصصية لم تُحدّث أوصافها منذ أكثر من عامين ولا تعكس أحدث التطورات في المجال",
      descriptionEn:
        "Some specialized courses have not had their descriptions updated in over two years and do not reflect the latest developments",
      evidence: "مقارنة توصيف المقررات مع معايير الصناعة",
      recommendationAr:
        "مراجعة وتحديث توصيفات المقررات المتخصصة بمشاركة خبراء من قطاع الأعمال",
      responsibleDept: "قسم تقنية الحاسب",
      dueDate: new Date("2025-08-31"),
      status: "OPEN",
    },
  });

  console.log("    Created 8 audit findings.");

  // ---------------------------------------------------------------------------
  // 6. Improvement Plans (4 records)
  // ---------------------------------------------------------------------------
  console.log("    Creating improvement plans...");

  const plan1 = await prisma.improvementPlan.create({
    data: {
      titleAr: "خطة تحسين توثيق مخرجات التعلم",
      titleEn: "Learning Outcomes Documentation Improvement Plan",
      planType: "CORRECTIVE",
      relatedFindingId: finding4.id,
      descriptionAr:
        "خطة تصحيحية لاستكمال وتحديث مصفوفات مخرجات التعلم لجميع البرامج التدريبية وفق معايير NCAAA",
      objectives:
        "1. إعداد مصفوفات مخرجات تعلم شاملة لجميع البرامج\n2. ربط المخرجات بأساليب التقييم\n3. تدريب أعضاء هيئة التدريب على استخدام المصفوفات",
      startDate: new Date("2025-01-15"),
      targetCompletionDate: new Date("2025-06-30"),
      status: "IP_IN_PROGRESS",
      ownerId: qualityStaffCoordinator.id,
      createdById: qualityStaffHead.id,
      budget: 15000,
      progressPercentage: 45,
    },
  });

  const plan2 = await prisma.improvementPlan.create({
    data: {
      titleAr: "خطة تصحيح توثيق محاضر الاجتماعات",
      titleEn: "Meeting Minutes Documentation Corrective Plan",
      planType: "CORRECTIVE",
      relatedFindingId: finding6.id,
      descriptionAr:
        "خطة تصحيحية عاجلة لمعالجة عدم المطابقة في توثيق محاضر اجتماعات المجالس واللجان الأكاديمية",
      objectives:
        "1. توثيق جميع المحاضر المتأخرة\n2. تفعيل نظام إلكتروني لتوثيق الاجتماعات\n3. تعيين مسؤول توثيق لكل مجلس ولجنة",
      startDate: new Date("2024-12-01"),
      targetCompletionDate: new Date("2025-03-31"),
      status: "IP_IN_PROGRESS",
      ownerId: qualityStaffHead.id,
      createdById: qualityStaffHead.id,
      budget: 5000,
      progressPercentage: 70,
    },
  });

  const plan3 = await prisma.improvementPlan.create({
    data: {
      titleAr: "خطة تحديث معامل الحاسب والتقنية",
      titleEn: "Computer and Technology Labs Upgrade Plan",
      planType: "PREVENTIVE",
      relatedFindingId: finding5.id,
      descriptionAr:
        "خطة وقائية لتحديث تجهيزات وبرمجيات المعامل بما يواكب متطلبات المقررات الحديثة وسوق العمل",
      objectives:
        "1. جرد شامل لاحتياجات المعامل\n2. اقتراح مواصفات الأجهزة والبرمجيات المطلوبة\n3. تنفيذ التحديث على مراحل",
      startDate: new Date("2025-02-01"),
      targetCompletionDate: new Date("2025-09-01"),
      status: "APPROVED",
      ownerId: qualityStaffCoordinator.id,
      createdById: qualityStaffCoordinator.id,
      budget: 250000,
      progressPercentage: 15,
    },
  });

  const plan4 = await prisma.improvementPlan.create({
    data: {
      titleAr: "خطة تعزيز التعلم الإلكتروني",
      titleEn: "E-Learning Enhancement Plan",
      planType: "ENHANCEMENT",
      descriptionAr:
        "خطة تطويرية لتعزيز استخدام منصات التعلم الإلكتروني وتنويع أساليب التدريس الرقمية",
      objectives:
        "1. تطوير محتوى إلكتروني تفاعلي لـ 50% من المقررات\n2. تدريب المدربين على أدوات التعلم الرقمي\n3. قياس أثر التعلم الإلكتروني على تحصيل المتدربين",
      startDate: new Date("2025-01-01"),
      targetCompletionDate: new Date("2025-12-31"),
      status: "IP_IN_PROGRESS",
      ownerId: qualityStaffHead.id,
      createdById: qualityStaffCoordinator.id,
      budget: 80000,
      progressPercentage: 25,
    },
  });

  console.log("    Created 4 improvement plans.");

  // ---------------------------------------------------------------------------
  // 7. Improvement Actions (10 records, 2-3 per plan)
  // ---------------------------------------------------------------------------
  console.log("    Creating improvement actions...");

  // Plan 1 actions (3 actions - Learning Outcomes Documentation)
  await prisma.improvementAction.create({
    data: {
      planId: plan1.id,
      descriptionAr:
        "جمع وتوثيق مخرجات التعلم الحالية لجميع البرامج التدريبية من رؤساء الأقسام",
      responsiblePerson: "رؤساء الأقسام الأكاديمية",
      startDate: new Date("2025-01-15"),
      dueDate: new Date("2025-02-28"),
      completionDate: new Date("2025-02-25"),
      status: "IA_COMPLETED",
      completionPercentage: 100,
      notes: "تم جمع مخرجات التعلم من جميع الأقسام بنجاح",
    },
  });

  await prisma.improvementAction.create({
    data: {
      planId: plan1.id,
      descriptionAr:
        "إعداد مصفوفات مخرجات التعلم وربطها بأساليب التقييم لكل برنامج تدريبي",
      responsiblePerson: "وحدة الجودة بالتعاون مع رؤساء الأقسام",
      startDate: new Date("2025-03-01"),
      dueDate: new Date("2025-05-15"),
      status: "IA_IN_PROGRESS",
      completionPercentage: 40,
      notes: "تم إنجاز مصفوفات 4 برامج من أصل 10",
    },
  });

  await prisma.improvementAction.create({
    data: {
      planId: plan1.id,
      descriptionAr:
        "عقد ورش عمل تدريبية للمدربين على كيفية استخدام مصفوفات المخرجات في التدريس والتقييم",
      responsiblePerson: "وحدة الجودة",
      startDate: new Date("2025-05-16"),
      dueDate: new Date("2025-06-30"),
      status: "PENDING",
      completionPercentage: 0,
    },
  });

  // Plan 2 actions (3 actions - Meeting Minutes)
  await prisma.improvementAction.create({
    data: {
      planId: plan2.id,
      descriptionAr:
        "توثيق جميع محاضر الاجتماعات المتأخرة للفصل الدراسي السابق واعتمادها",
      responsiblePerson: "أمناء المجالس واللجان",
      startDate: new Date("2024-12-01"),
      dueDate: new Date("2025-01-15"),
      completionDate: new Date("2025-01-12"),
      status: "IA_COMPLETED",
      completionPercentage: 100,
      notes: "تم توثيق واعتماد 12 محضراً متأخراً",
    },
  });

  await prisma.improvementAction.create({
    data: {
      planId: plan2.id,
      descriptionAr:
        "تفعيل نظام التوثيق الإلكتروني للاجتماعات وتدريب الأمناء على استخدامه",
      responsiblePerson: "إدارة تقنية المعلومات",
      startDate: new Date("2025-01-16"),
      dueDate: new Date("2025-02-28"),
      completionDate: new Date("2025-02-20"),
      status: "IA_COMPLETED",
      completionPercentage: 100,
      notes: "تم تفعيل النظام وتدريب 8 أمناء مجالس ولجان",
    },
  });

  await prisma.improvementAction.create({
    data: {
      planId: plan2.id,
      descriptionAr:
        "متابعة الالتزام بالتوثيق وإعداد تقرير شهري عن حالة محاضر الاجتماعات",
      responsiblePerson: "وحدة الجودة",
      startDate: new Date("2025-03-01"),
      dueDate: new Date("2025-03-31"),
      status: "IA_IN_PROGRESS",
      completionPercentage: 30,
    },
  });

  // Plan 3 actions (2 actions - Lab Upgrade)
  await prisma.improvementAction.create({
    data: {
      planId: plan3.id,
      descriptionAr:
        "إجراء جرد شامل لجميع المعامل وتحديد الأجهزة والبرمجيات التي تحتاج تحديثاً",
      responsiblePerson: "مشرفو المعامل بالتنسيق مع رؤساء الأقسام",
      startDate: new Date("2025-02-01"),
      dueDate: new Date("2025-03-15"),
      status: "IA_IN_PROGRESS",
      completionPercentage: 60,
      notes: "تم جرد 6 معامل من أصل 10",
    },
  });

  await prisma.improvementAction.create({
    data: {
      planId: plan3.id,
      descriptionAr:
        "إعداد المواصفات الفنية وطلبات الشراء للأجهزة والبرمجيات المطلوبة ورفعها للاعتماد",
      responsiblePerson: "إدارة المشتريات",
      startDate: new Date("2025-03-16"),
      dueDate: new Date("2025-05-31"),
      status: "PENDING",
      completionPercentage: 0,
    },
  });

  // Plan 4 actions (2 actions - E-Learning Enhancement)
  await prisma.improvementAction.create({
    data: {
      planId: plan4.id,
      descriptionAr:
        "تصميم وتطوير محتوى تعليمي إلكتروني تفاعلي لـ 5 مقررات تجريبية في مختلف التخصصات",
      responsiblePerson: "فريق التعلم الإلكتروني",
      startDate: new Date("2025-01-01"),
      dueDate: new Date("2025-04-30"),
      status: "DELAYED",
      completionPercentage: 35,
      notes: "تأخر بسبب نقص في كوادر تطوير المحتوى الإلكتروني",
    },
  });

  await prisma.improvementAction.create({
    data: {
      planId: plan4.id,
      descriptionAr:
        "تنفيذ برنامج تدريبي مكثف للمدربين على استخدام أدوات ومنصات التعلم الإلكتروني",
      responsiblePerson: "وحدة التطوير المهني",
      startDate: new Date("2025-03-01"),
      dueDate: new Date("2025-06-30"),
      status: "PENDING",
      completionPercentage: 0,
    },
  });

  console.log("    Created 10 improvement actions.");

  // ---------------------------------------------------------------------------
  // 8. Accreditations (3 records)
  // ---------------------------------------------------------------------------
  console.log("    Creating accreditations...");

  await prisma.accreditation.create({
    data: {
      accreditationType: "INSTITUTIONAL",
      accreditingBody: "هيئة تقويم التعليم والتدريب (ETEC)",
      certificateNumber: "ETEC-INST-2023-0456",
      grantDate: new Date("2023-06-15"),
      expiryDate: new Date("2028-06-14"),
      status: "ACCREDITATION_ACTIVE",
      notes:
        "الاعتماد المؤسسي الكامل لمدة 5 سنوات من هيئة تقويم التعليم والتدريب. تم الحصول على تقييم \"جيد جداً\" مع توصيات تحسين في مجال البحث العلمي والشراكات المجتمعية.",
    },
  });

  await prisma.accreditation.create({
    data: {
      accreditationType: "PROGRAM_ACCREDITATION",
      accreditingBody: "هيئة تقويم التعليم والتدريب (ETEC)",
      certificateNumber: "ETEC-PROG-CS-2022-0189",
      grantDate: new Date("2022-01-20"),
      expiryDate: new Date("2025-01-19"),
      status: "UNDER_RENEWAL",
      notes:
        "اعتماد برنامج تقنية الحاسب قيد التجديد. تم تقديم طلب التجديد وجاري إعداد تقرير الدراسة الذاتية للبرنامج. الزيارة الميدانية مقررة في الفصل الثاني 2025.",
    },
  });

  await prisma.accreditation.create({
    data: {
      accreditationType: "PROGRAM_ACCREDITATION",
      accreditingBody: "هيئة تقويم التعليم والتدريب (ETEC)",
      certificateNumber: "ETEC-PROG-EE-2020-0095",
      grantDate: new Date("2020-03-10"),
      expiryDate: new Date("2023-03-09"),
      status: "EXPIRED",
      notes:
        "اعتماد برنامج التقنية الكهربائية منتهي الصلاحية. يجري العمل حالياً على إعادة تأهيل البرنامج وتحديث خطته الدراسية تمهيداً لإعادة تقديم طلب الاعتماد.",
    },
  });

  console.log("    Created 3 accreditations.");

  console.log("  Quality BASE seed complete.");
}
