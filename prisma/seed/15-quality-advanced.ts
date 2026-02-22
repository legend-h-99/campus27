import type { PrismaClient } from "@prisma/client";

// =============================================================================
// Campus27 Quality Advanced Seed Data
// بيانات وهمية متقدمة لوكالة الجودة:
// - مؤشرات أداء مفصلة (KPI measurements) بأنماط واقعية
// - استبيانات رضا مع ردود متعددة
// - تقارير جودة شاملة
// - اجتماعات لجان الجودة
// - وثائق ومحاضر
// - خطط تحسين مع متابعة التنفيذ
// =============================================================================

// ------------- Helper Functions -------------

function randomBetween(min: number, max: number): number {
  return Math.round((Math.random() * (max - min) + min) * 100) / 100;
}

function randomDate(start: Date, end: Date): Date {
  return new Date(
    start.getTime() + Math.random() * (end.getTime() - start.getTime())
  );
}

function pickRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

// ------------- KPI Performance Patterns (واقعية) -------------

interface MonthlyKpiPattern {
  month: string;
  baseMultiplier: number; // عامل التأثير الموسمي
}

// نمط أداء واقعي: بداية السنة أقل، تحسن تدريجي، تراجع بسيط في رمضان
const MONTHLY_PATTERNS: MonthlyKpiPattern[] = [
  { month: "2025-01", baseMultiplier: 0.88 },
  { month: "2025-02", baseMultiplier: 0.90 },
  { month: "2025-03", baseMultiplier: 0.92 }, // رمضان - تراجع طفيف
  { month: "2025-04", baseMultiplier: 0.87 },
  { month: "2025-05", baseMultiplier: 0.93 },
  { month: "2025-06", baseMultiplier: 0.95 },
  { month: "2025-07", baseMultiplier: 0.91 }, // إجازة صيفية
  { month: "2025-08", baseMultiplier: 0.89 },
  { month: "2025-09", baseMultiplier: 0.94 },
  { month: "2025-10", baseMultiplier: 0.96 },
  { month: "2025-11", baseMultiplier: 0.97 },
  { month: "2025-12", baseMultiplier: 0.95 },
];

// ملاحظات عربية واقعية لمؤشرات الأداء
const KPI_NOTES_POSITIVE = [
  "تحسن ملحوظ مقارنة بالفترة السابقة بفضل تطبيق خطة التحسين",
  "النتائج تفوق المستهدف نتيجة التزام أعضاء هيئة التدريب",
  "أداء ممتاز يعكس جودة البرامج التدريبية المقدمة",
  "تحقق المستهدف بعد تنفيذ التوصيات السابقة",
  "مؤشر إيجابي يدعم ملف الاعتماد الأكاديمي",
];

const KPI_NOTES_NEGATIVE = [
  "انخفاض بسبب نقص الموارد البشرية المؤهلة في القسم",
  "تأثر المؤشر بفترة الاختبارات والضغط الأكاديمي",
  "يحتاج لمراجعة آلية القياس وتحديث أدوات التقييم",
  "تراجع مؤقت متوقع أثناء فترة إعادة الهيكلة",
  "يتطلب تدخل عاجل من الإدارة لتصحيح المسار",
];

// ------------- Survey Response Patterns -------------

interface SurveyTemplate {
  titleAr: string;
  titleEn: string;
  surveyType: string;
  targetAudience: string;
  questions: object[];
  responseCount: number;
  avgSatisfaction: number;
}

const SURVEY_TEMPLATES: SurveyTemplate[] = [
  {
    titleAr: "استبيان رضا المتدربين عن البيئة التعليمية - الفصل الأول 1446",
    titleEn: "Trainee Satisfaction Survey - Academic Environment S1 1446",
    surveyType: "STUDENT_SATISFACTION",
    targetAudience: "STUDENTS",
    questions: [
      {
        id: "q1",
        textAr: "مدى رضاك عن جودة المحتوى التعليمي",
        type: "rating",
        scale: 5,
      },
      {
        id: "q2",
        textAr: "مدى رضاك عن أداء المدربين",
        type: "rating",
        scale: 5,
      },
      {
        id: "q3",
        textAr: "مدى رضاك عن التجهيزات والمعامل",
        type: "rating",
        scale: 5,
      },
      {
        id: "q4",
        textAr: "مدى رضاك عن الخدمات المساندة",
        type: "rating",
        scale: 5,
      },
      {
        id: "q5",
        textAr: "مدى رضاك عن البيئة التعليمية بشكل عام",
        type: "rating",
        scale: 5,
      },
      {
        id: "q6",
        textAr: "هل توصي بالكلية لزملائك؟",
        type: "yes_no",
      },
      {
        id: "q7",
        textAr: "ملاحظاتك ومقترحاتك",
        type: "text",
      },
    ],
    responseCount: 180,
    avgSatisfaction: 3.8,
  },
  {
    titleAr: "استبيان رضا المدربين عن بيئة العمل - 1446",
    titleEn: "Trainer Satisfaction Survey - Work Environment 1446",
    surveyType: "TRAINER_EVALUATION",
    targetAudience: "TRAINERS",
    questions: [
      {
        id: "q1",
        textAr: "مدى رضاك عن الدعم الإداري",
        type: "rating",
        scale: 5,
      },
      {
        id: "q2",
        textAr: "مدى رضاك عن فرص التطوير المهني",
        type: "rating",
        scale: 5,
      },
      {
        id: "q3",
        textAr: "مدى رضاك عن التجهيزات التقنية",
        type: "rating",
        scale: 5,
      },
      {
        id: "q4",
        textAr: "مدى رضاك عن بيئة العمل العامة",
        type: "rating",
        scale: 5,
      },
    ],
    responseCount: 45,
    avgSatisfaction: 3.6,
  },
  {
    titleAr: "استبيان تقييم البرنامج التدريبي - علوم الحاسب",
    titleEn: "Program Evaluation Survey - Computer Science",
    surveyType: "COURSE_EVALUATION",
    targetAudience: "STUDENTS",
    questions: [
      {
        id: "q1",
        textAr: "مدى توافق المقررات مع سوق العمل",
        type: "rating",
        scale: 5,
      },
      {
        id: "q2",
        textAr: "مدى كفاية التدريب العملي",
        type: "rating",
        scale: 5,
      },
      {
        id: "q3",
        textAr: "جودة المراجع والمصادر التعليمية",
        type: "rating",
        scale: 5,
      },
    ],
    responseCount: 60,
    avgSatisfaction: 3.5,
  },
  {
    titleAr: "استبيان رضا أصحاب العمل عن الخريجين",
    titleEn: "Employer Satisfaction Survey",
    surveyType: "EMPLOYER_SURVEY",
    targetAudience: "EMPLOYERS",
    questions: [
      {
        id: "q1",
        textAr: "مدى رضاك عن المهارات التقنية للخريجين",
        type: "rating",
        scale: 5,
      },
      {
        id: "q2",
        textAr: "مدى رضاك عن المهارات الشخصية للخريجين",
        type: "rating",
        scale: 5,
      },
      {
        id: "q3",
        textAr: "مدى توافق مخرجات التعلم مع متطلبات سوق العمل",
        type: "rating",
        scale: 5,
      },
      {
        id: "q4",
        textAr: "هل تفضل توظيف خريجي الكلية مستقبلاً؟",
        type: "yes_no",
      },
    ],
    responseCount: 25,
    avgSatisfaction: 3.4,
  },
];

// ------------- Improvement Plan Details -------------

interface AdvancedPlanTemplate {
  titleAr: string;
  titleEn: string;
  planType: string;
  descriptionAr: string;
  objectives: string;
  budget: number;
  status: string;
  progressPercentage: number;
  actions: {
    descriptionAr: string;
    status: string;
    completionPercentage: number;
    notes?: string;
  }[];
}

const ADVANCED_PLANS: AdvancedPlanTemplate[] = [
  {
    titleAr: "خطة تطوير مخرجات التعلم لبرامج الحاسب",
    titleEn: "CS Program Learning Outcomes Enhancement Plan",
    planType: "ENHANCEMENT",
    descriptionAr:
      "خطة شاملة لتحسين مخرجات التعلم في برامج الحاسب بما يتوافق مع معايير ABET ومتطلبات سوق العمل السعودي",
    objectives:
      "1. رفع نسبة تحقيق مخرجات التعلم إلى 85%\n2. تحديث المقررات بما يتوافق مع التقنيات الحديثة\n3. زيادة نسبة التدريب العملي إلى 40%\n4. ربط المقررات بمشاريع واقعية من سوق العمل",
    budget: 150000,
    status: "IP_IN_PROGRESS",
    progressPercentage: 65,
    actions: [
      {
        descriptionAr: "مراجعة وتحديث توصيفات المقررات (12 مقرر)",
        status: "IA_COMPLETED",
        completionPercentage: 100,
        notes: "تم تحديث جميع التوصيفات وفق نموذج NCAAA الجديد",
      },
      {
        descriptionAr: "تصميم مشاريع تخرج بالتعاون مع شركات التقنية",
        status: "IA_IN_PROGRESS",
        completionPercentage: 70,
        notes: "تم التعاقد مع 5 شركات، جاري تنفيذ المشاريع",
      },
      {
        descriptionAr: "إنشاء معمل ذكاء اصطناعي متقدم",
        status: "IA_IN_PROGRESS",
        completionPercentage: 45,
        notes: "تم تجهيز المعمل، بانتظار وصول الأجهزة المتخصصة",
      },
      {
        descriptionAr: "تدريب المدربين على التقنيات الحديثة (AI, Cloud, DevOps)",
        status: "IA_IN_PROGRESS",
        completionPercentage: 60,
        notes: "15 مدرب أتموا التدريب من أصل 25",
      },
      {
        descriptionAr: "تطبيق آلية تقييم مخرجات التعلم المباشرة وغير المباشرة",
        status: "PENDING",
        completionPercentage: 10,
      },
    ],
  },
  {
    titleAr: "خطة رفع نسبة رضا المتدربين",
    titleEn: "Trainee Satisfaction Enhancement Plan",
    planType: "CORRECTIVE",
    descriptionAr:
      "خطة لمعالجة نتائج استبيان رضا المتدربين وتحسين البيئة التعليمية والخدمات المساندة",
    objectives:
      "1. رفع نسبة الرضا العام من 72% إلى 85%\n2. تحسين خدمات الإرشاد الأكاديمي\n3. تطوير المرافق والتجهيزات\n4. تفعيل قنوات التواصل مع المتدربين",
    budget: 80000,
    status: "IP_IN_PROGRESS",
    progressPercentage: 45,
    actions: [
      {
        descriptionAr: "إنشاء مكتب خدمات المتدربين الشامل",
        status: "IA_COMPLETED",
        completionPercentage: 100,
      },
      {
        descriptionAr: "تجديد وتحديث المعامل القديمة",
        status: "IA_IN_PROGRESS",
        completionPercentage: 30,
        notes: "تم تجديد 3 معامل من أصل 8",
      },
      {
        descriptionAr: "إطلاق تطبيق جوال للخدمات الأكاديمية",
        status: "PENDING",
        completionPercentage: 0,
      },
    ],
  },
  {
    titleAr: "خطة الاستعداد للاعتماد المؤسسي NCAAA",
    titleEn: "NCAAA Institutional Accreditation Readiness Plan",
    planType: "PREVENTIVE",
    descriptionAr:
      "خطة شاملة للاستعداد لزيارة فريق الاعتماد المؤسسي من الهيئة الوطنية للتقويم والاعتماد الأكاديمي",
    objectives:
      "1. استيفاء جميع معايير NCAAA (11 معيار)\n2. إعداد تقرير الدراسة الذاتية\n3. تجهيز الأدلة والشواهد\n4. تدريب أعضاء الأقسام على عملية الاعتماد",
    budget: 200000,
    status: "IP_IN_PROGRESS",
    progressPercentage: 55,
    actions: [
      {
        descriptionAr: "إعداد تقرير الدراسة الذاتية المؤسسي",
        status: "IA_IN_PROGRESS",
        completionPercentage: 75,
        notes: "تم الانتهاء من 8 معايير، جاري العمل على 3 معايير متبقية",
      },
      {
        descriptionAr: "تجميع وتنظيم الأدلة والشواهد إلكترونياً",
        status: "IA_IN_PROGRESS",
        completionPercentage: 60,
        notes: "تم رفع 450 شاهد من أصل 700 مطلوب",
      },
      {
        descriptionAr: "تنفيذ ورش عمل تعريفية لأعضاء هيئة التدريب",
        status: "IA_COMPLETED",
        completionPercentage: 100,
        notes: "تم تنفيذ 6 ورش عمل بحضور 85% من المدربين",
      },
      {
        descriptionAr: "إجراء مراجعة داخلية محاكية لزيارة الاعتماد",
        status: "PENDING",
        completionPercentage: 0,
      },
      {
        descriptionAr: "معالجة الفجوات المكتشفة في المراجعة الداخلية",
        status: "PENDING",
        completionPercentage: 0,
      },
    ],
  },
  {
    titleAr: "خطة تحسين معدلات النجاح والتخرج",
    titleEn: "Success & Graduation Rates Improvement Plan",
    planType: "ENHANCEMENT",
    descriptionAr:
      "خطة لرفع معدلات النجاح والتخرج من خلال برامج الدعم الأكاديمي والإرشاد المبكر",
    objectives:
      "1. رفع معدل النجاح من 78% إلى 85%\n2. خفض نسبة التسرب إلى أقل من 10%\n3. تقليص متوسط مدة التخرج\n4. تفعيل نظام الإنذار المبكر",
    budget: 50000,
    status: "IP_COMPLETED",
    progressPercentage: 100,
    actions: [
      {
        descriptionAr: "تفعيل نظام الإنذار المبكر للمتدربين المتعثرين",
        status: "IA_COMPLETED",
        completionPercentage: 100,
        notes: "النظام يعمل بنجاح ويكشف 92% من الحالات مبكراً",
      },
      {
        descriptionAr: "إنشاء برنامج التقوية الأكاديمية (دروس إضافية)",
        status: "IA_COMPLETED",
        completionPercentage: 100,
        notes: "استفاد 120 متدرب من البرنامج، نسبة النجاح ارتفعت 15%",
      },
      {
        descriptionAr: "تعيين مرشدين أكاديميين لكل قسم",
        status: "IA_COMPLETED",
        completionPercentage: 100,
      },
    ],
  },
];

// ------------- Quality Report Templates -------------

interface QualityReportTemplate {
  titleAr: string;
  titleEn: string;
  reportType: string;
  academicYear: string;
  executiveSummary: string;
  recommendations: string;
  reportData: object;
  status: string;
}

const QUALITY_REPORTS: QualityReportTemplate[] = [
  {
    titleAr: "التقرير السنوي للجودة والتطوير 1445-1446",
    titleEn: "Annual Quality & Development Report 1445-1446",
    reportType: "ANNUAL_REPORT",
    academicYear: "1445-1446",
    executiveSummary:
      "يقدم هذا التقرير نظرة شاملة على أنشطة وإنجازات وكالة الجودة والتطوير خلال العام الأكاديمي 1445-1446هـ. تم تنفيذ 85% من خطة الجودة السنوية، وتحسنت مؤشرات الأداء الرئيسية بنسبة 12% مقارنة بالعام السابق. كما تم الانتهاء من إعداد 70% من ملف الاعتماد المؤسسي.",
    recommendations:
      "1. تكثيف الجهود لاستكمال متطلبات الاعتماد المؤسسي\n2. تخصيص ميزانية إضافية لتطوير المعامل\n3. تعزيز برامج التطوير المهني للمدربين\n4. تفعيل نظام إدارة الجودة الإلكتروني\n5. إنشاء وحدة قياس وتقويم مستقلة",
    reportData: {
      kpiSummary: {
        total: 16,
        exceeds: 4,
        meets: 7,
        below: 3,
        critical: 2,
      },
      auditSummary: { completed: 3, findings: 8, resolved: 5 },
      surveySummary: { conducted: 4, totalResponses: 310, avgSatisfaction: 3.6 },
      improvementPlans: { total: 4, completed: 1, inProgress: 3 },
      trainingHours: 1200,
      documentsPublished: 15,
    },
    status: "REPORT_APPROVED",
  },
  {
    titleAr: "تقرير أداء مؤشرات الجودة - الفصل الأول 1446",
    titleEn: "KPI Performance Report - S1 1446",
    reportType: "KPI_REPORT",
    academicYear: "1446",
    executiveSummary:
      "يستعرض التقرير نتائج قياس 16 مؤشر أداء رئيسي للفصل الدراسي الأول 1446هـ. حقق 11 مؤشراً المستهدف أو تجاوزه (68.7%)، بينما لم يحقق 5 مؤشرات المستوى المطلوب. أبرز المؤشرات المتفوقة: نسبة رضا المتدربين (88%) ومعدل النجاح (83%). أبرز المؤشرات المتراجعة: نسبة البحث العلمي (62%) وساعات التطوير المهني.",
    recommendations:
      "1. وضع خطط تصحيحية عاجلة للمؤشرات المتراجعة\n2. تشجيع البحث العلمي من خلال حوافز مالية\n3. إلزام المدربين بحد أدنى من ساعات التطوير المهني",
    reportData: {
      period: "الفصل الأول 1446هـ",
      kpiResults: [
        { name: "معدل نجاح المتدربين", target: 80, actual: 83, status: "MEETS" },
        {
          name: "نسبة رضا المتدربين",
          target: 85,
          actual: 88,
          status: "EXCEEDS",
        },
        {
          name: "نسبة رضا المدربين",
          target: 80,
          actual: 76,
          status: "BELOW",
        },
        {
          name: "معدل التسرب",
          target: 10,
          actual: 8,
          status: "EXCEEDS",
        },
        {
          name: "نسبة توظيف الخريجين",
          target: 75,
          actual: 71,
          status: "BELOW",
        },
      ],
    },
    status: "PUBLISHED",
  },
  {
    titleAr: "تقرير المراجعة الداخلية - قسم علوم الحاسب",
    titleEn: "Internal Audit Report - CS Department",
    reportType: "AUDIT_REPORT",
    academicYear: "1446",
    executiveSummary:
      "تمت المراجعة الداخلية لقسم علوم الحاسب وفق معايير NCAAA. أظهرت النتائج التزام القسم بـ 7 من 11 معيار بشكل كامل، و3 معايير بشكل جزئي، ومعيار واحد يحتاج تحسين جوهري. أبرز نقاط القوة: جودة البرامج التعليمية وتأهيل المدربين. أبرز فرص التحسين: البحث العلمي وخدمة المجتمع.",
    recommendations:
      "1. إنشاء وحدة بحث علمي في القسم\n2. تفعيل اتفاقيات الشراكة مع القطاع الخاص\n3. تحديث خطة القسم الاستراتيجية",
    reportData: {
      auditScope: "قسم علوم الحاسب",
      standards: { fullCompliance: 7, partialCompliance: 3, nonCompliance: 1 },
      strengths: [
        "برامج تعليمية محدثة",
        "كوادر مؤهلة",
        "معامل متطورة",
      ],
      weaknesses: [
        "ضعف النشاط البحثي",
        "محدودية خدمة المجتمع",
      ],
    },
    status: "REPORT_APPROVED",
  },
];

// ------------- Meeting Templates -------------

interface MeetingTemplate {
  meetingType: string;
  titleAr: string;
  location: string;
  agenda: string;
  minutes: string;
  decisions: object[];
  actionItems: object[];
  status: string;
}

const MEETING_TEMPLATES: MeetingTemplate[] = [
  {
    meetingType: "QUALITY_COMMITTEE",
    titleAr: "الاجتماع الثالث لمجلس الجودة - الفصل الأول 1446",
    location: "قاعة الاجتماعات الرئيسية",
    agenda:
      "1. اعتماد محضر الاجتماع السابق\n2. مراجعة تقرير مؤشرات الأداء\n3. متابعة خطة الاستعداد للاعتماد\n4. مناقشة نتائج استبيان رضا المتدربين\n5. ما يستجد من أعمال",
    minutes:
      "بدأ الاجتماع في تمام الساعة 10:00 صباحاً بحضور جميع الأعضاء. تم اعتماد محضر الاجتماع السابق بالإجماع. استعرض وكيل الجودة تقرير مؤشرات الأداء للفصل الأول وأوضح أن 68% من المؤشرات حققت المستهدف. ناقش المجلس نتائج استبيان رضا المتدربين (72%) وأكد على ضرورة رفعها. تم التأكيد على أهمية استكمال ملف الاعتماد قبل نهاية الفصل الثاني.",
    decisions: [
      {
        id: 1,
        textAr: "اعتماد تقرير مؤشرات الأداء للفصل الأول 1446",
      },
      {
        id: 2,
        textAr: "تشكيل لجنة لمعالجة تدني مؤشر رضا المتدربين",
      },
      {
        id: 3,
        textAr: "تخصيص 50,000 ريال لتطوير المعامل",
      },
      {
        id: 4,
        textAr:
          "إلزام جميع الأقسام بتقديم تقارير الأداء الشهرية قبل يوم 5 من كل شهر",
      },
    ],
    actionItems: [
      {
        textAr: "إعداد خطة تصحيحية لمؤشرات الأداء المتراجعة",
        responsible: "وكيل الجودة",
        dueDate: "2025-03-15",
      },
      {
        textAr: "تنظيم ورشة عمل حول آلية كتابة تقرير الدراسة الذاتية",
        responsible: "مدير وحدة الجودة",
        dueDate: "2025-02-28",
      },
      {
        textAr: "جمع شواهد المعيار السابع والثامن",
        responsible: "رؤساء الأقسام",
        dueDate: "2025-04-01",
      },
    ],
    status: "MEETING_COMPLETED",
  },
  {
    meetingType: "REVIEW",
    titleAr: "اجتماع لجنة مراجعة خطط التحسين - يناير 2025",
    location: "غرفة اجتماعات وكالة الجودة",
    agenda:
      "1. متابعة تنفيذ خطة تطوير مخرجات التعلم\n2. مراجعة خطة الاستعداد للاعتماد\n3. تقييم فعالية خطة رفع نسبة الرضا\n4. تحديد العوائق والحلول المقترحة",
    minutes:
      "تم مراجعة حالة 4 خطط تحسين نشطة. خطة تطوير المخرجات تسير وفق الجدول (65%). خطة الاعتماد تحتاج تسريع في جمع الشواهد. لوحظ تأخر في خطة رفع الرضا بسبب تأخر توريد الأجهزة. تم الاتفاق على اجتماعات أسبوعية لمتابعة خطة الاعتماد.",
    decisions: [
      { id: 1, textAr: "عقد اجتماعات أسبوعية لمتابعة ملف الاعتماد" },
      {
        id: 2,
        textAr: "تصعيد موضوع تأخر توريد الأجهزة لمدير الكلية",
      },
    ],
    actionItems: [
      {
        textAr: "إعداد جدول زمني مفصل لاستكمال ملف الاعتماد",
        responsible: "منسق الاعتماد",
        dueDate: "2025-02-10",
      },
    ],
    status: "MEETING_COMPLETED",
  },
  {
    meetingType: "QUALITY_COMMITTEE",
    titleAr: "الاجتماع الرابع لمجلس الجودة - الفصل الثاني 1446",
    location: "قاعة الاجتماعات الرئيسية",
    agenda:
      "1. اعتماد محضر الاجتماع الثالث\n2. استعراض التقرير السنوي للجودة\n3. مناقشة الاستعداد لزيارة فريق الاعتماد\n4. اعتماد خطة الجودة للعام القادم",
    minutes:
      "حضر الاجتماع 12 عضواً من أصل 14. تم استعراض التقرير السنوي والإشادة بتحسن المؤشرات. ناقش المجلس الاستعداد لزيارة الاعتماد المتوقعة في الفصل الأول 1447. تم اعتماد خطة الجودة للعام القادم بميزانية 300,000 ريال.",
    decisions: [
      { id: 1, textAr: "اعتماد التقرير السنوي للجودة 1445-1446" },
      { id: 2, textAr: "اعتماد خطة الجودة 1446-1447 بميزانية 300,000 ريال" },
      {
        id: 3,
        textAr: "تحديد موعد الزيارة التجريبية للاعتماد في شعبان 1446",
      },
    ],
    actionItems: [
      {
        textAr: "إعداد السيناريو التفصيلي لزيارة الاعتماد التجريبية",
        responsible: "وكيل الجودة",
        dueDate: "2025-04-15",
      },
      {
        textAr: "توزيع أدوار أعضاء فريق الاعتماد الداخلي",
        responsible: "مدير وحدة الجودة",
        dueDate: "2025-03-30",
      },
    ],
    status: "MEETING_COMPLETED",
  },
];

// =============================================================================
// MAIN SEED FUNCTION
// =============================================================================

export async function seedQualityAdvanced(prisma: PrismaClient) {
  console.log("  Seeding advanced quality data...");

  // --- Get existing quality staff ---
  const qualityStaff = await (prisma as any).qualityStaff.findMany();
  if (qualityStaff.length === 0) {
    console.log(
      "    ⚠️ No quality staff found. Skipping advanced quality seed."
    );
    return;
  }

  // --- Get existing KPIs ---
  const existingKpis = await (prisma as any).qualityKpi.findMany({
    include: { standard: true },
  });

  // --- Get existing departments ---
  const departments = await (prisma as any).department.findMany();

  // =========================================================================
  // 1. Detailed KPI Measurements (monthly for full year)
  // =========================================================================
  console.log("    Creating detailed KPI measurements (12 months)...");
  let measurementCount = 0;

  for (const kpi of existingKpis) {
    for (const pattern of MONTHLY_PATTERNS) {
      const baseValue =
        kpi.targetValue * pattern.baseMultiplier +
        randomBetween(-3, 3);
      const actualValue =
        kpi.measurementUnit === "%"
          ? Math.min(100, Math.max(0, baseValue))
          : Math.max(0, baseValue);
      const achievementRate = (actualValue / kpi.targetValue) * 100;

      let status: "EXCEEDS" | "MEETS" | "BELOW" | "CRITICAL";
      if (achievementRate >= 100) status = "EXCEEDS";
      else if (achievementRate >= 85) status = "MEETS";
      else if (achievementRate >= 70) status = "BELOW";
      else status = "CRITICAL";

      const notes =
        achievementRate >= 85
          ? pickRandom(KPI_NOTES_POSITIVE)
          : pickRandom(KPI_NOTES_NEGATIVE);

      // Assign to random department for some variety
      const dept =
        Math.random() > 0.5 ? pickRandom(departments) : null;

      await (prisma as any).kpiMeasurement.create({
        data: {
          kpiId: kpi.id,
          measurementDate: new Date(`${pattern.month}-15T00:00:00Z`),
          actualValue: Math.round(actualValue * 100) / 100,
          targetValue: kpi.targetValue,
          achievementRate: Math.round(achievementRate * 100) / 100,
          status,
          departmentId: dept?.id || null,
          notes,
          measuredById: pickRandom(qualityStaff).id,
          verifiedById:
            Math.random() > 0.3
              ? pickRandom(qualityStaff).id
              : null,
        },
      });
      measurementCount++;
    }
  }
  console.log(`    Created ${measurementCount} detailed KPI measurements.`);

  // =========================================================================
  // 2. Surveys with Responses
  // =========================================================================
  console.log("    Creating surveys with responses...");
  let responseCount = 0;

  for (const template of SURVEY_TEMPLATES) {
    const survey = await (prisma as any).qualitySurvey.create({
      data: {
        titleAr: template.titleAr,
        titleEn: template.titleEn,
        surveyType: template.surveyType,
        targetAudience: template.targetAudience,
        academicYear: "1446",
        semester: "الأول",
        startDate: new Date("2025-01-15"),
        endDate: new Date("2025-02-15"),
        questions: template.questions,
        totalResponses: template.responseCount,
        status: "SURVEY_CLOSED",
        createdById: qualityStaff[0]?.id,
      },
    });

    // Generate realistic responses
    const comments = [
      "بشكل عام تجربة جيدة",
      "نحتاج تحسين المعامل",
      "المدربون ممتازون",
      "الجدول مزدحم جداً",
      "أتمنى توفير مصادر تعليمية إضافية",
      "الخدمات الإلكترونية تحتاج تطوير",
      "ممتاز ما شاء الله",
      "نأمل تحسين التكييف في القاعات",
      "المقررات تحتاج تحديث",
      "أفضل كلية تقنية في المنطقة",
      null,
      null,
      null,
    ];

    for (let i = 0; i < template.responseCount; i++) {
      // Generate satisfaction score with normal-ish distribution
      const baseSat = template.avgSatisfaction;
      const satisfaction = Math.max(
        1,
        Math.min(5, baseSat + randomBetween(-1.5, 1.5))
      );

      const responses: Record<string, number | string | boolean> = {};
      for (const q of template.questions as any[]) {
        if (q.type === "rating") {
          responses[q.id] = Math.max(
            1,
            Math.min(5, Math.round(satisfaction + randomBetween(-0.5, 0.5)))
          );
        } else if (q.type === "yes_no") {
          responses[q.id] = satisfaction >= 3;
        } else {
          responses[q.id] =
            Math.random() > 0.7 ? pickRandom(comments.filter(Boolean) as string[]) : "";
        }
      }

      await (prisma as any).surveyResponse.create({
        data: {
          surveyId: survey.id,
          respondentType: template.targetAudience,
          responses,
          satisfactionScore:
            Math.round(satisfaction * 100) / 100,
          comments: pickRandom(comments),
          responseDate: randomDate(
            new Date("2025-01-15"),
            new Date("2025-02-15")
          ),
        },
      });
      responseCount++;
    }
  }
  console.log(
    `    Created ${SURVEY_TEMPLATES.length} surveys with ${responseCount} responses.`
  );

  // =========================================================================
  // 3. Advanced Improvement Plans with Actions
  // =========================================================================
  console.log("    Creating advanced improvement plans...");
  let actionCount = 0;

  // Get existing findings to link
  const existingFindings = await (prisma as any).auditFinding.findMany();

  for (let i = 0; i < ADVANCED_PLANS.length; i++) {
    const template = ADVANCED_PLANS[i];

    const plan = await (prisma as any).improvementPlan.create({
      data: {
        titleAr: template.titleAr,
        titleEn: template.titleEn,
        planType: template.planType,
        descriptionAr: template.descriptionAr,
        objectives: template.objectives,
        budget: template.budget,
        status: template.status,
        progressPercentage: template.progressPercentage,
        startDate: new Date("2025-01-01"),
        targetCompletionDate: new Date("2025-12-31"),
        actualCompletionDate:
          template.status === "IP_COMPLETED"
            ? new Date("2025-11-15")
            : null,
        relatedFindingId:
          existingFindings.length > i
            ? existingFindings[i].id
            : null,
        ownerId: qualityStaff[i % qualityStaff.length]?.id,
        createdById: qualityStaff[0]?.id,
      },
    });

    for (const action of template.actions) {
      await (prisma as any).improvementAction.create({
        data: {
          planId: plan.id,
          descriptionAr: action.descriptionAr,
          status: action.status,
          completionPercentage: action.completionPercentage,
          notes: action.notes || null,
          responsiblePerson: pickRandom([
            "وكيل الجودة",
            "رئيس قسم الحاسب",
            "مدير وحدة الجودة",
            "منسق الاعتماد",
            "رئيس قسم التدريب",
          ]),
          startDate: randomDate(
            new Date("2025-01-01"),
            new Date("2025-03-01")
          ),
          dueDate: randomDate(
            new Date("2025-06-01"),
            new Date("2025-12-31")
          ),
          completionDate:
            action.status === "IA_COMPLETED"
              ? randomDate(
                  new Date("2025-02-01"),
                  new Date("2025-10-01")
                )
              : null,
        },
      });
      actionCount++;
    }
  }
  console.log(
    `    Created ${ADVANCED_PLANS.length} plans with ${actionCount} actions.`
  );

  // =========================================================================
  // 4. Quality Reports
  // =========================================================================
  console.log("    Creating quality reports...");

  for (const report of QUALITY_REPORTS) {
    await (prisma as any).qualityReport.create({
      data: {
        titleAr: report.titleAr,
        titleEn: report.titleEn,
        reportType: report.reportType,
        academicYear: report.academicYear,
        reportPeriodStart: new Date("2025-01-01"),
        reportPeriodEnd: new Date("2025-12-31"),
        executiveSummary: report.executiveSummary,
        recommendations: report.recommendations,
        reportData: report.reportData,
        status: report.status,
        preparedById: qualityStaff[0]?.id,
        reviewedById:
          qualityStaff.length > 1 ? qualityStaff[1]?.id : null,
        approvedById:
          qualityStaff.length > 2 ? qualityStaff[2]?.id : null,
      },
    });
  }
  console.log(`    Created ${QUALITY_REPORTS.length} quality reports.`);

  // =========================================================================
  // 5. Quality Meetings
  // =========================================================================
  console.log("    Creating quality meetings...");

  const meetingDates = [
    new Date("2025-01-15"),
    new Date("2025-02-05"),
    new Date("2025-02-20"),
  ];

  const attendees = qualityStaff.map((s: any) => ({
    id: s.id,
    name: s.userId,
    role: "عضو",
  }));

  for (let i = 0; i < MEETING_TEMPLATES.length; i++) {
    const template = MEETING_TEMPLATES[i];

    await (prisma as any).qualityMeeting.create({
      data: {
        meetingType: template.meetingType,
        titleAr: template.titleAr,
        meetingDate: meetingDates[i],
        location: template.location,
        attendees,
        agenda: template.agenda,
        minutes: template.minutes,
        decisions: template.decisions,
        actionItems: template.actionItems,
        status: template.status,
        createdById: qualityStaff[0]?.id,
      },
    });
  }
  console.log(`    Created ${MEETING_TEMPLATES.length} quality meetings.`);

  // =========================================================================
  // 6. Additional Quality Documents
  // =========================================================================
  console.log("    Creating quality documents...");

  const additionalDocs = [
    {
      docType: "POLICY",
      titleAr: "سياسة ضمان الجودة الداخلية",
      titleEn: "Internal Quality Assurance Policy",
      docCode: "QA-POL-001",
      version: "3.0",
      descriptionAr:
        "السياسة العامة لضمان جودة العمليات الأكاديمية والإدارية في الكلية",
      status: "DOC_ACTIVE",
    },
    {
      docType: "PROCEDURE",
      titleAr: "إجراء المراجعة الداخلية للبرامج",
      titleEn: "Internal Program Review Procedure",
      docCode: "QA-PRO-005",
      version: "2.1",
      descriptionAr:
        "الخطوات التفصيلية لإجراء مراجعة داخلية شاملة للبرامج الأكاديمية",
      status: "DOC_ACTIVE",
    },
    {
      docType: "MANUAL",
      titleAr: "دليل إعداد تقرير الدراسة الذاتية",
      titleEn: "Self-Study Report Preparation Guide",
      docCode: "QA-MAN-003",
      version: "1.2",
      descriptionAr:
        "دليل شامل يوضح خطوات ومتطلبات إعداد تقرير الدراسة الذاتية المؤسسي وفق معايير NCAAA",
      status: "DOC_ACTIVE",
    },
    {
      docType: "FORM",
      titleAr: "نموذج توصيف المقرر الدراسي",
      titleEn: "Course Specification Template",
      docCode: "QA-FRM-012",
      version: "4.0",
      descriptionAr:
        "النموذج المعتمد لتوصيف المقررات الدراسية وفق متطلبات الإطار الوطني للمؤهلات",
      status: "DOC_ACTIVE",
    },
    {
      docType: "FORM",
      titleAr: "نموذج تقرير المقرر الدراسي",
      titleEn: "Course Report Template",
      docCode: "QA-FRM-013",
      version: "3.5",
      descriptionAr:
        "نموذج تقرير نهاية الفصل للمقرر يتضمن تحليل النتائج وتوصيات التحسين",
      status: "DOC_ACTIVE",
    },
    {
      docType: "PROCEDURE",
      titleAr: "إجراء قياس رضا أصحاب المصلحة",
      titleEn: "Stakeholder Satisfaction Measurement Procedure",
      docCode: "QA-PRO-008",
      version: "1.5",
      descriptionAr:
        "إجراء تفصيلي لتصميم وتنفيذ وتحليل استبيانات رضا المتدربين والمدربين وأصحاب العمل",
      status: "DOC_UNDER_REVIEW",
    },
    {
      docType: "POLICY",
      titleAr: "سياسة التطوير المهني المستمر",
      titleEn: "Continuous Professional Development Policy",
      docCode: "QA-POL-004",
      version: "2.0",
      descriptionAr:
        "سياسة تحدد متطلبات وآليات التطوير المهني لأعضاء هيئة التدريب والموظفين",
      status: "DOC_ACTIVE",
    },
  ];

  for (const doc of additionalDocs) {
    await (prisma as any).qualityDocument.create({
      data: {
        ...doc,
        effectiveDate: new Date("2025-01-01"),
        reviewDate: new Date("2026-01-01"),
        ownerId: pickRandom(qualityStaff).id,
      },
    });
  }
  console.log(`    Created ${additionalDocs.length} quality documents.`);

  console.log("  ✅ Advanced quality seed complete.");
}
