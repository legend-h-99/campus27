import type { PrismaClient } from "@prisma/client";
import { randomFrom, randomInt, randomDate } from "./helpers";

// =============================================================================
// Campus26 Tasks, Projects, Leaves, Evaluations & Notifications Seed
// =============================================================================

// -----------------------------------------------------------------------------
// Project Definitions
// -----------------------------------------------------------------------------

interface ProjectDef {
  nameAr: string;
  nameEn: string;
  descriptionAr: string;
  descriptionEn: string;
  status: "PLANNING" | "IN_PROGRESS" | "ON_HOLD" | "COMPLETED" | "CANCELLED";
  progress: number;
  budget: number;
  startDate: Date;
  endDate: Date | null;
}

const PROJECTS: ProjectDef[] = [
  {
    nameAr: "التحول الرقمي",
    nameEn: "Digital Transformation",
    descriptionAr: "مشروع شامل لرقمنة جميع العمليات الإدارية والأكاديمية",
    descriptionEn: "Comprehensive project to digitize all administrative and academic operations",
    status: "IN_PROGRESS",
    progress: 65,
    budget: 500_000,
    startDate: new Date("2024-06-01"),
    endDate: new Date("2025-06-30"),
  },
  {
    nameAr: "تجهيز مختبرات جديدة",
    nameEn: "New Lab Setup",
    descriptionAr: "إنشاء وتجهيز 5 مختبرات تقنية جديدة",
    descriptionEn: "Setting up 5 new technology laboratories",
    status: "PLANNING",
    progress: 10,
    budget: 2_000_000,
    startDate: new Date("2025-03-01"),
    endDate: new Date("2025-12-31"),
  },
  {
    nameAr: "تحديث منصة التعلم الإلكتروني",
    nameEn: "E-Learning Platform Upgrade",
    descriptionAr: "ترقية وتحسين منصة التعلم الإلكتروني بميزات جديدة",
    descriptionEn: "Upgrading the e-learning platform with new features and improvements",
    status: "IN_PROGRESS",
    progress: 40,
    budget: 300_000,
    startDate: new Date("2024-09-01"),
    endDate: new Date("2025-04-30"),
  },
  {
    nameAr: "إعادة تصميم بوابة المتدربين",
    nameEn: "Student Portal Redesign",
    descriptionAr: "إعادة تصميم بوابة المتدربين بواجهة حديثة وسهلة الاستخدام",
    descriptionEn: "Redesigning student portal with a modern, user-friendly interface",
    status: "COMPLETED",
    progress: 100,
    budget: 150_000,
    startDate: new Date("2024-03-01"),
    endDate: new Date("2024-08-31"),
  },
  {
    nameAr: "نظام توثيق الجودة",
    nameEn: "Quality Documentation System",
    descriptionAr: "بناء نظام إلكتروني لإدارة وتوثيق عمليات الجودة",
    descriptionEn: "Building an electronic system for quality documentation management",
    status: "ON_HOLD",
    progress: 25,
    budget: 200_000,
    startDate: new Date("2024-07-01"),
    endDate: new Date("2025-03-31"),
  },
];

// -----------------------------------------------------------------------------
// Task Template Definitions
// -----------------------------------------------------------------------------

interface TaskTemplate {
  titleAr: string;
  titleEn: string;
  descriptionAr: string;
  descriptionEn: string;
  projectIndex: number | null; // null = no project link
}

const TASK_TEMPLATES: TaskTemplate[] = [
  // Digital Transformation tasks (project 0)
  { titleAr: "تحليل الأنظمة الحالية", titleEn: "Analyze current systems", descriptionAr: "دراسة وتحليل جميع الأنظمة المستخدمة حالياً", descriptionEn: "Study and analyze all currently used systems", projectIndex: 0 },
  { titleAr: "تصميم قاعدة البيانات الموحدة", titleEn: "Design unified database", descriptionAr: "تصميم قاعدة بيانات مركزية لجميع الأنظمة", descriptionEn: "Design a centralized database for all systems", projectIndex: 0 },
  { titleAr: "تطوير واجهة المستخدم", titleEn: "Develop user interface", descriptionAr: "بناء واجهة مستخدم حديثة وسهلة الاستخدام", descriptionEn: "Build a modern and user-friendly interface", projectIndex: 0 },
  { titleAr: "اختبار النظام المتكامل", titleEn: "Test integrated system", descriptionAr: "إجراء اختبارات شاملة للنظام المتكامل", descriptionEn: "Conduct comprehensive testing of the integrated system", projectIndex: 0 },
  { titleAr: "تدريب المستخدمين على النظام الجديد", titleEn: "Train users on new system", descriptionAr: "تنفيذ برامج تدريبية للموظفين", descriptionEn: "Execute training programs for staff", projectIndex: 0 },
  // New Lab Setup tasks (project 1)
  { titleAr: "إعداد المخططات الهندسية", titleEn: "Prepare engineering blueprints", descriptionAr: "تصميم المخططات الهندسية للمختبرات الجديدة", descriptionEn: "Design engineering blueprints for new labs", projectIndex: 1 },
  { titleAr: "الحصول على عروض أسعار المعدات", titleEn: "Obtain equipment quotations", descriptionAr: "جمع عروض أسعار من الموردين المعتمدين", descriptionEn: "Collect quotations from approved suppliers", projectIndex: 1 },
  { titleAr: "تجهيز البنية التحتية", titleEn: "Prepare infrastructure", descriptionAr: "تجهيز الكهرباء والشبكات والتكييف", descriptionEn: "Set up electricity, networks, and HVAC", projectIndex: 1 },
  // E-Learning tasks (project 2)
  { titleAr: "تحديث محتوى المقررات الإلكترونية", titleEn: "Update e-course content", descriptionAr: "مراجعة وتحديث المحتوى التعليمي الرقمي", descriptionEn: "Review and update digital educational content", projectIndex: 2 },
  { titleAr: "إضافة ميزة الاختبارات التفاعلية", titleEn: "Add interactive quiz feature", descriptionAr: "تطوير نظام اختبارات تفاعلية مع تصحيح آلي", descriptionEn: "Develop interactive quiz system with auto-grading", projectIndex: 2 },
  // Quality Documentation tasks (project 4)
  { titleAr: "جمع الوثائق الحالية", titleEn: "Collect current documents", descriptionAr: "جمع وفهرسة جميع وثائق الجودة الحالية", descriptionEn: "Collect and index all current quality documents", projectIndex: 4 },
  { titleAr: "تصميم قوالب التوثيق", titleEn: "Design documentation templates", descriptionAr: "إنشاء قوالب موحدة لجميع أنواع الوثائق", descriptionEn: "Create standardized templates for all document types", projectIndex: 4 },
  // General tasks (no project)
  { titleAr: "إعداد تقرير الأداء الشهري", titleEn: "Prepare monthly performance report", descriptionAr: "تجميع وتحليل بيانات الأداء وإعداد التقرير الشهري", descriptionEn: "Compile and analyze performance data for monthly report", projectIndex: null },
  { titleAr: "مراجعة سياسات القبول", titleEn: "Review admission policies", descriptionAr: "مراجعة وتحديث سياسات القبول والتسجيل", descriptionEn: "Review and update admission and registration policies", projectIndex: null },
  { titleAr: "تنظيم ورشة عمل للمدربين", titleEn: "Organize trainer workshop", descriptionAr: "تخطيط وتنفيذ ورشة عمل لتطوير المهارات التدريبية", descriptionEn: "Plan and execute a workshop for training skills development", projectIndex: null },
  { titleAr: "تحديث الموقع الإلكتروني", titleEn: "Update website content", descriptionAr: "تحديث محتوى الموقع الإلكتروني بآخر الأخبار والفعاليات", descriptionEn: "Update website with latest news and events", projectIndex: null },
  { titleAr: "إعداد خطة الطوارئ", titleEn: "Prepare emergency plan", descriptionAr: "مراجعة وتحديث خطة الطوارئ والإخلاء", descriptionEn: "Review and update emergency and evacuation plan", projectIndex: null },
  { titleAr: "تقييم رضا المتدربين", titleEn: "Assess student satisfaction", descriptionAr: "إجراء استطلاع رضا المتدربين وتحليل النتائج", descriptionEn: "Conduct student satisfaction survey and analyze results", projectIndex: null },
  { titleAr: "متابعة الخريجين", titleEn: "Follow up with graduates", descriptionAr: "التواصل مع الخريجين وتحديث بيانات التوظيف", descriptionEn: "Contact graduates and update employment data", projectIndex: null },
  { titleAr: "إعداد ملف الاعتماد", titleEn: "Prepare accreditation file", descriptionAr: "تجهيز المستندات والأدلة لملف الاعتماد", descriptionEn: "Prepare documents and evidence for accreditation file", projectIndex: null },
  { titleAr: "مراجعة الميزانية الفصلية", titleEn: "Review quarterly budget", descriptionAr: "مراجعة وتحليل المصروفات مقارنة بالميزانية المخصصة", descriptionEn: "Review and analyze expenses against allocated budget", projectIndex: null },
  { titleAr: "تحديث سجلات المخزون", titleEn: "Update inventory records", descriptionAr: "جرد وتحديث سجلات المستودعات", descriptionEn: "Inventory count and update warehouse records", projectIndex: null },
  { titleAr: "إعداد جداول الفصل القادم", titleEn: "Prepare next semester schedules", descriptionAr: "إعداد الجداول الدراسية للفصل الدراسي القادم", descriptionEn: "Prepare class schedules for the upcoming semester", projectIndex: null },
  { titleAr: "تنسيق زيارة شركاء التدريب", titleEn: "Coordinate training partner visit", descriptionAr: "الترتيب لزيارة ممثلي شركات التدريب التعاوني", descriptionEn: "Arrange visit for cooperative training company representatives", projectIndex: null },
  { titleAr: "تطوير خطة التوظيف", titleEn: "Develop recruitment plan", descriptionAr: "وضع خطة لاستقطاب مدربين جدد للعام القادم", descriptionEn: "Create a plan to recruit new trainers for next year", projectIndex: null },
  { titleAr: "إعداد النشرة الإخبارية", titleEn: "Prepare newsletter", descriptionAr: "إعداد النشرة الإخبارية الفصلية للكلية", descriptionEn: "Prepare the college's quarterly newsletter", projectIndex: null },
  { titleAr: "تنظيم يوم مهني", titleEn: "Organize career day", descriptionAr: "تخطيط وتنفيذ يوم مهني للمتدربين", descriptionEn: "Plan and execute a career day for trainees", projectIndex: null },
  { titleAr: "مراجعة عقود الموردين", titleEn: "Review supplier contracts", descriptionAr: "مراجعة وتجديد عقود الموردين الحاليين", descriptionEn: "Review and renew current supplier contracts", projectIndex: null },
  { titleAr: "تحسين نظام الحضور الإلكتروني", titleEn: "Improve electronic attendance", descriptionAr: "تطوير نظام الحضور الإلكتروني ليشمل البصمة", descriptionEn: "Enhance electronic attendance system with biometric support", projectIndex: null },
  { titleAr: "إعداد تقرير البحث العلمي", titleEn: "Prepare research report", descriptionAr: "تجميع إنجازات البحث العلمي السنوية", descriptionEn: "Compile annual scientific research achievements", projectIndex: null },
  { titleAr: "تحديث خطة التطوير المهني", titleEn: "Update professional development plan", descriptionAr: "مراجعة وتحديث خطة التطوير المهني للمدربين", descriptionEn: "Review and update trainer professional development plan", projectIndex: null },
  { titleAr: "تنفيذ صيانة المختبرات", titleEn: "Execute lab maintenance", descriptionAr: "تنفيذ جدول الصيانة الدورية للمختبرات", descriptionEn: "Execute periodic laboratory maintenance schedule", projectIndex: null },
  { titleAr: "إعداد تقرير الجودة الفصلي", titleEn: "Prepare quarterly quality report", descriptionAr: "إعداد تقرير مؤشرات الأداء الرئيسية الفصلي", descriptionEn: "Prepare quarterly KPI report", projectIndex: null },
  { titleAr: "مراجعة لوائح السلامة", titleEn: "Review safety regulations", descriptionAr: "مراجعة وتحديث لوائح السلامة المهنية", descriptionEn: "Review and update occupational safety regulations", projectIndex: null },
  { titleAr: "تنسيق برنامج التدريب الصيفي", titleEn: "Coordinate summer training program", descriptionAr: "التخطيط لبرنامج التدريب الصيفي التعاوني", descriptionEn: "Plan cooperative summer training program", projectIndex: null },
  { titleAr: "تقييم أداء الأقسام", titleEn: "Evaluate department performance", descriptionAr: "إجراء تقييم شامل لأداء جميع الأقسام الأكاديمية", descriptionEn: "Conduct comprehensive evaluation of all academic departments", projectIndex: null },
  { titleAr: "إعداد خطة القبول الجديدة", titleEn: "Prepare new admission plan", descriptionAr: "وضع خطة القبول للعام الأكاديمي القادم", descriptionEn: "Create admission plan for next academic year", projectIndex: null },
  { titleAr: "تطوير تطبيق الجوال", titleEn: "Develop mobile application", descriptionAr: "تطوير تطبيق جوال للمتدربين والمدربين", descriptionEn: "Develop mobile app for trainees and trainers", projectIndex: null },
  { titleAr: "إعداد خطة تقنية المعلومات", titleEn: "Prepare IT plan", descriptionAr: "وضع الخطة التقنية السنوية لتقنية المعلومات", descriptionEn: "Create annual IT technology plan", projectIndex: null },
];

// Make sure we have exactly 50 templates (38 defined above, add 12 more generic)
const EXTRA_TASK_TEMPLATES: TaskTemplate[] = [
  { titleAr: "تحديث قاعدة بيانات الموظفين", titleEn: "Update employee database", descriptionAr: "تحديث بيانات جميع الموظفين في النظام", descriptionEn: "Update all employee records in the system", projectIndex: null },
  { titleAr: "إعداد تقرير المخاطر", titleEn: "Prepare risk report", descriptionAr: "تقييم وتوثيق المخاطر المحتملة", descriptionEn: "Assess and document potential risks", projectIndex: null },
  { titleAr: "تنظيم حفل التخرج", titleEn: "Organize graduation ceremony", descriptionAr: "التخطيط والتنسيق لحفل تخريج الدفعة الجديدة", descriptionEn: "Plan and coordinate new batch graduation ceremony", projectIndex: null },
  { titleAr: "مراجعة عقود الصيانة", titleEn: "Review maintenance contracts", descriptionAr: "مراجعة وتجديد عقود الصيانة السنوية", descriptionEn: "Review and renew annual maintenance contracts", projectIndex: null },
  { titleAr: "تحليل بيانات الطلاب", titleEn: "Analyze student data", descriptionAr: "تحليل بيانات أداء المتدربين وإعداد إحصائيات", descriptionEn: "Analyze trainee performance data and prepare statistics", projectIndex: null },
  { titleAr: "إعداد خطة التسويق", titleEn: "Prepare marketing plan", descriptionAr: "وضع خطة تسويقية لجذب متدربين جدد", descriptionEn: "Create marketing plan to attract new trainees", projectIndex: null },
  { titleAr: "تطوير برنامج التوجيه", titleEn: "Develop orientation program", descriptionAr: "تصميم برنامج توجيهي للمتدربين الجدد", descriptionEn: "Design orientation program for new trainees", projectIndex: null },
  { titleAr: "متابعة شهادات المدربين", titleEn: "Track trainer certifications", descriptionAr: "متابعة صلاحية الشهادات المهنية للمدربين", descriptionEn: "Track validity of trainer professional certifications", projectIndex: null },
  { titleAr: "تنظيم معرض المشاريع", titleEn: "Organize project exhibition", descriptionAr: "تنظيم معرض مشاريع تخرج المتدربين", descriptionEn: "Organize trainee graduation project exhibition", projectIndex: null },
  { titleAr: "إعداد دراسة جدوى", titleEn: "Prepare feasibility study", descriptionAr: "إعداد دراسة جدوى لبرنامج جديد", descriptionEn: "Prepare feasibility study for a new program", projectIndex: null },
  { titleAr: "تحديث أدلة البرامج", titleEn: "Update program guides", descriptionAr: "تحديث أدلة البرامج الأكاديمية لجميع الأقسام", descriptionEn: "Update academic program guides for all departments", projectIndex: null },
  { titleAr: "مراجعة سياسة الخصوصية", titleEn: "Review privacy policy", descriptionAr: "مراجعة وتحديث سياسة حماية البيانات الشخصية", descriptionEn: "Review and update personal data protection policy", projectIndex: null },
];

const ALL_TASK_TEMPLATES = [...TASK_TEMPLATES, ...EXTRA_TASK_TEMPLATES];

// -----------------------------------------------------------------------------
// Leave Definitions
// -----------------------------------------------------------------------------

interface LeaveDef {
  type: "ANNUAL" | "SICK" | "EMERGENCY" | "OTHER";
  status: "APPROVED" | "PENDING" | "REJECTED" | "CANCELLED";
  reason: string;
  durationDays: number;
}

const LEAVE_RECORDS: LeaveDef[] = [
  // 10 ANNUAL
  { type: "ANNUAL", status: "APPROVED", reason: "إجازة سنوية - زيارة عائلية", durationDays: 10 },
  { type: "ANNUAL", status: "APPROVED", reason: "إجازة سنوية - سفر", durationDays: 14 },
  { type: "ANNUAL", status: "APPROVED", reason: "إجازة سنوية - راحة", durationDays: 7 },
  { type: "ANNUAL", status: "APPROVED", reason: "إجازة سنوية - مناسبة عائلية", durationDays: 5 },
  { type: "ANNUAL", status: "APPROVED", reason: "إجازة سنوية - عمرة", durationDays: 7 },
  { type: "ANNUAL", status: "APPROVED", reason: "إجازة سنوية - حج", durationDays: 14 },
  { type: "ANNUAL", status: "PENDING", reason: "إجازة سنوية - سفر خارجي", durationDays: 21 },
  { type: "ANNUAL", status: "PENDING", reason: "إجازة سنوية - شؤون شخصية", durationDays: 5 },
  { type: "ANNUAL", status: "REJECTED", reason: "إجازة سنوية - فترة اختبارات", durationDays: 10 },
  { type: "ANNUAL", status: "APPROVED", reason: "إجازة سنوية - زواج", durationDays: 5 },
  // 5 SICK
  { type: "SICK", status: "APPROVED", reason: "إجازة مرضية - مراجعة طبية", durationDays: 3 },
  { type: "SICK", status: "APPROVED", reason: "إجازة مرضية - عملية جراحية", durationDays: 14 },
  { type: "SICK", status: "APPROVED", reason: "إجازة مرضية - إنفلونزا", durationDays: 5 },
  { type: "SICK", status: "PENDING", reason: "إجازة مرضية - علاج طبيعي", durationDays: 7 },
  { type: "SICK", status: "APPROVED", reason: "إجازة مرضية - مراجعة أسنان", durationDays: 2 },
  // 3 EMERGENCY
  { type: "EMERGENCY", status: "APPROVED", reason: "إجازة اضطرارية - وفاة قريب", durationDays: 5 },
  { type: "EMERGENCY", status: "APPROVED", reason: "إجازة اضطرارية - حالة طارئة", durationDays: 3 },
  { type: "EMERGENCY", status: "REJECTED", reason: "إجازة اضطرارية - ظرف عائلي", durationDays: 7 },
  // 2 OTHER
  { type: "OTHER", status: "APPROVED", reason: "إجازة دراسية - دورة تدريبية", durationDays: 5 },
  { type: "OTHER", status: "CANCELLED", reason: "إجازة بدون راتب - ظروف خاصة", durationDays: 30 },
];

// -----------------------------------------------------------------------------
// Evaluation Comments
// -----------------------------------------------------------------------------

const EVALUATION_COMMENTS = [
  "أداء متميز في التدريس واستخدام التقنيات الحديثة",
  "ملتزم بالحضور والمواعيد، ويحرص على تطوير المقررات",
  "يحتاج لتطوير مهارات البحث العلمي والنشر",
  "مبادر في خدمة المجتمع والمشاركة في الأنشطة",
  "أداء جيد في التدريس مع حاجة للتطوير في الجانب البحثي",
  "متعاون مع الزملاء ويساهم في لجان القسم",
  "يتميز بأساليب تدريس مبتكرة وتفاعلية",
  "مشارك فعال في الأنشطة البحثية والمؤتمرات",
  "يحرص على التطوير المهني المستمر والحصول على شهادات مهنية",
  "أداء ممتاز في التدريب العملي والتطبيقي",
];

// -----------------------------------------------------------------------------
// Notification Templates
// -----------------------------------------------------------------------------

interface NotificationTemplate {
  titleAr: string;
  titleEn: string;
  messageAr: string;
  messageEn: string;
  type: "INFO" | "WARNING" | "SUCCESS" | "TASK" | "GRADE" | "ATTENDANCE" | "SYSTEM";
}

const NOTIFICATION_TEMPLATES: NotificationTemplate[] = [
  { titleAr: "تحديث النظام", titleEn: "System Update", messageAr: "تم تحديث النظام بنجاح إلى الإصدار الأخير", messageEn: "System has been successfully updated to the latest version", type: "SYSTEM" },
  { titleAr: "مهمة جديدة", titleEn: "New Task Assigned", messageAr: "تم إسناد مهمة جديدة إليك، يرجى مراجعتها", messageEn: "A new task has been assigned to you, please review it", type: "TASK" },
  { titleAr: "اعتماد الدرجات", titleEn: "Grades Approved", messageAr: "تم اعتماد درجات الفصل الأول بنجاح", messageEn: "First semester grades have been approved successfully", type: "GRADE" },
  { titleAr: "تنبيه حضور", titleEn: "Attendance Alert", messageAr: "لديك غياب غير مبرر في مقرر اليوم", messageEn: "You have an unexcused absence in today's course", type: "ATTENDANCE" },
  { titleAr: "اجتماع قادم", titleEn: "Upcoming Meeting", messageAr: "تذكير: لديك اجتماع لجنة الجودة غداً", messageEn: "Reminder: You have a Quality Committee meeting tomorrow", type: "INFO" },
  { titleAr: "تقرير جاهز", titleEn: "Report Ready", messageAr: "تقرير الأداء الشهري جاهز للمراجعة", messageEn: "Monthly performance report is ready for review", type: "INFO" },
  { titleAr: "تحذير ميزانية", titleEn: "Budget Warning", messageAr: "تنبيه: تجاوز المصروفات 80% من الميزانية المخصصة", messageEn: "Alert: Expenses exceeded 80% of allocated budget", type: "WARNING" },
  { titleAr: "إنجاز مهمة", titleEn: "Task Completed", messageAr: "تم إنجاز المهمة المسندة إليك بنجاح", messageEn: "Your assigned task has been completed successfully", type: "SUCCESS" },
  { titleAr: "طلب إجازة", titleEn: "Leave Request", messageAr: "تم تقديم طلب إجازة جديد بانتظار الموافقة", messageEn: "A new leave request has been submitted pending approval", type: "INFO" },
  { titleAr: "نتائج الاستبيان", titleEn: "Survey Results", messageAr: "نتائج استبيان رضا المتدربين متاحة الآن", messageEn: "Student satisfaction survey results are now available", type: "SUCCESS" },
  { titleAr: "موعد تسليم قريب", titleEn: "Deadline Approaching", messageAr: "تذكير: موعد تسليم التقرير خلال يومين", messageEn: "Reminder: Report submission deadline is in 2 days", type: "WARNING" },
  { titleAr: "تحديث المقرر", titleEn: "Course Update", messageAr: "تم تحديث محتوى المقرر الإلكتروني", messageEn: "E-course content has been updated", type: "INFO" },
  { titleAr: "نتيجة التقييم", titleEn: "Evaluation Result", messageAr: "نتيجة تقييم الأداء متاحة للمراجعة", messageEn: "Performance evaluation result is available for review", type: "GRADE" },
  { titleAr: "فعالية جديدة", titleEn: "New Event", messageAr: "تم إضافة فعالية جديدة في تقويم الكلية", messageEn: "A new event has been added to the college calendar", type: "INFO" },
  { titleAr: "صيانة النظام", titleEn: "System Maintenance", messageAr: "صيانة مجدولة للنظام يوم الجمعة من 10-12 مساءً", messageEn: "Scheduled system maintenance Friday 10-12 PM", type: "SYSTEM" },
  { titleAr: "مستند جديد", titleEn: "New Document", messageAr: "تم إضافة مستند جودة جديد يرجى الاطلاع", messageEn: "A new quality document has been added, please review", type: "INFO" },
  { titleAr: "تنبيه مخزون", titleEn: "Inventory Alert", messageAr: "تنبيه: بعض المواد وصلت للحد الأدنى في المخزون", messageEn: "Alert: Some items have reached minimum inventory level", type: "WARNING" },
  { titleAr: "اكتمال المشروع", titleEn: "Project Completed", messageAr: "تم اكتمال مشروع إعادة تصميم بوابة المتدربين", messageEn: "Student Portal Redesign project has been completed", type: "SUCCESS" },
  { titleAr: "تحديث البيانات", titleEn: "Data Update Required", messageAr: "يرجى تحديث بياناتك الشخصية في النظام", messageEn: "Please update your personal information in the system", type: "SYSTEM" },
  { titleAr: "دعوة ورشة عمل", titleEn: "Workshop Invitation", messageAr: "دعوة لحضور ورشة عمل التطوير المهني الأسبوع القادم", messageEn: "Invitation to attend professional development workshop next week", type: "INFO" },
  { titleAr: "نتائج المراجعة", titleEn: "Audit Results", messageAr: "نتائج المراجعة الداخلية الأخيرة متاحة الآن", messageEn: "Latest internal audit results are now available", type: "INFO" },
  { titleAr: "تذكير بالحضور", titleEn: "Attendance Reminder", messageAr: "تذكير: يرجى تسجيل حضور المتدربين يومياً", messageEn: "Reminder: Please record trainee attendance daily", type: "ATTENDANCE" },
  { titleAr: "طلب مشتريات", titleEn: "Purchase Request", messageAr: "طلب مشتريات جديد بانتظار الموافقة", messageEn: "New purchase request pending approval", type: "INFO" },
  { titleAr: "تقييم مقرر", titleEn: "Course Evaluation", messageAr: "يرجى المشاركة في تقييم المقررات للفصل الحالي", messageEn: "Please participate in course evaluation for current semester", type: "GRADE" },
  { titleAr: "تغيير جدول", titleEn: "Schedule Change", messageAr: "تم تعديل جدول المحاضرات ليوم الأربعاء", messageEn: "Wednesday lecture schedule has been modified", type: "ATTENDANCE" },
  { titleAr: "إعلان مهم", titleEn: "Important Announcement", messageAr: "إعلان هام من إدارة الكلية بخصوص الاختبارات النهائية", messageEn: "Important announcement from college management regarding final exams", type: "WARNING" },
  { titleAr: "تهنئة", titleEn: "Congratulations", messageAr: "تهانينا! تم ترشيحك لجائزة الموظف المثالي", messageEn: "Congratulations! You have been nominated for Employee of the Year", type: "SUCCESS" },
  { titleAr: "تحديث أمني", titleEn: "Security Update", messageAr: "يرجى تغيير كلمة المرور الخاصة بك لأسباب أمنية", messageEn: "Please change your password for security reasons", type: "SYSTEM" },
  { titleAr: "نتيجة طلب الإجازة", titleEn: "Leave Request Result", messageAr: "تم الموافقة على طلب إجازتك", messageEn: "Your leave request has been approved", type: "SUCCESS" },
  { titleAr: "تذكير مهمة", titleEn: "Task Reminder", messageAr: "تذكير: لديك مهمة متأخرة يرجى إنجازها", messageEn: "Reminder: You have an overdue task, please complete it", type: "TASK" },
];

// =============================================================================
// Main Seed Function
// =============================================================================

export async function seedTasksAndProjects(
  prisma: PrismaClient,
  adminUsers: any,
  departments: any[]
) {
  console.log("  Seeding tasks, projects, leaves, evaluations & notifications...");

  // Collect all available user IDs for assignments
  const allUsers = await prisma.user.findMany({
    select: { id: true, role: true },
  });

  const adminUserIds = allUsers
    .filter((u) => ["super_admin", "dean", "vp_trainers", "vp_trainees", "vp_quality", "accountant", "quality_officer", "dept_head"].includes(u.role))
    .map((u) => u.id);

  const trainerUserIds = allUsers
    .filter((u) => u.role === "trainer")
    .map((u) => u.id);

  const allStaffIds = [...adminUserIds, ...trainerUserIds];

  // Fallback if no staff found
  if (allStaffIds.length === 0) {
    console.log("    WARNING: No staff users found. Skipping tasks & projects.");
    return;
  }

  // Get dean and vp IDs for project management
  const deanUser = adminUsers?.dean;
  const vpTrainersUser = adminUsers?.vp_trainers;
  const vpQualityUser = adminUsers?.vp_quality;

  // ---------------------------------------------------------------------------
  // 1. Projects (5 projects)
  // ---------------------------------------------------------------------------
  console.log("    Seeding projects...");

  const projectManagerIds = [
    vpTrainersUser?.id ?? randomFrom(adminUserIds),
    deanUser?.id ?? randomFrom(adminUserIds),
    vpTrainersUser?.id ?? randomFrom(adminUserIds),
    randomFrom(adminUserIds),
    vpQualityUser?.id ?? randomFrom(adminUserIds),
  ];

  const createdProjects: Array<{ id: string }> = [];

  for (let i = 0; i < PROJECTS.length; i++) {
    const proj = PROJECTS[i];
    const project = await prisma.project.create({
      data: {
        nameAr: proj.nameAr,
        nameEn: proj.nameEn,
        descriptionAr: proj.descriptionAr,
        descriptionEn: proj.descriptionEn,
        managerId: projectManagerIds[i],
        startDate: proj.startDate,
        endDate: proj.endDate,
        budget: proj.budget,
        status: proj.status,
        progress: proj.progress,
      },
    });
    createdProjects.push(project);
  }

  console.log(`    Created ${createdProjects.length} projects.`);

  // ---------------------------------------------------------------------------
  // 2. Tasks (50 tasks)
  // ---------------------------------------------------------------------------
  console.log("    Seeding tasks...");

  const priorityPool: Array<"LOW" | "MEDIUM" | "HIGH" | "URGENT"> = [];
  // 10% URGENT, 25% HIGH, 40% MEDIUM, 25% LOW
  for (let i = 0; i < 5; i++) priorityPool.push("URGENT");
  for (let i = 0; i < 13; i++) priorityPool.push("HIGH");
  for (let i = 0; i < 20; i++) priorityPool.push("MEDIUM");
  for (let i = 0; i < 12; i++) priorityPool.push("LOW");

  const statusPool: Array<"TODO" | "IN_PROGRESS" | "IN_REVIEW" | "COMPLETED" | "CANCELLED"> = [];
  // 20% TODO, 25% IN_PROGRESS, 10% IN_REVIEW, 35% COMPLETED, 10% CANCELLED
  for (let i = 0; i < 10; i++) statusPool.push("TODO");
  for (let i = 0; i < 13; i++) statusPool.push("IN_PROGRESS");
  for (let i = 0; i < 5; i++) statusPool.push("IN_REVIEW");
  for (let i = 0; i < 17; i++) statusPool.push("COMPLETED");
  for (let i = 0; i < 5; i++) statusPool.push("CANCELLED");

  const taskDueDateStart = new Date("2025-01-01");
  const taskDueDateEnd = new Date("2025-06-30");

  const tasks: Array<{
    titleAr: string;
    titleEn: string;
    descriptionAr: string | null;
    descriptionEn: string | null;
    assignedToId: string | null;
    assignedById: string | null;
    priority: "LOW" | "MEDIUM" | "HIGH" | "URGENT";
    status: "TODO" | "IN_PROGRESS" | "IN_REVIEW" | "COMPLETED" | "CANCELLED";
    dueDate: Date | null;
    completedAt: Date | null;
    projectId: string | null;
  }> = [];

  for (let i = 0; i < 50; i++) {
    const template = ALL_TASK_TEMPLATES[i % ALL_TASK_TEMPLATES.length];
    const priority = randomFrom(priorityPool);
    const status = randomFrom(statusPool);
    const dueDate = randomDate(taskDueDateStart, taskDueDateEnd);
    const assignedTo = randomFrom(allStaffIds);
    const assignedBy = randomFrom(adminUserIds);

    // Link to project if template specifies
    let projectId: string | null = null;
    if (template.projectIndex !== null && template.projectIndex < createdProjects.length) {
      projectId = createdProjects[template.projectIndex].id;
    }

    // Set completedAt for completed tasks
    let completedAt: Date | null = null;
    if (status === "COMPLETED") {
      completedAt = new Date(dueDate.getTime() - randomInt(1, 14) * 86_400_000);
    }

    tasks.push({
      titleAr: template.titleAr,
      titleEn: template.titleEn,
      descriptionAr: template.descriptionAr,
      descriptionEn: template.descriptionEn,
      assignedToId: assignedTo,
      assignedById: assignedBy,
      priority,
      status,
      dueDate,
      completedAt,
      projectId,
    });
  }

  await prisma.task.createMany({ data: tasks });
  console.log(`    Created ${tasks.length} tasks.`);

  // ---------------------------------------------------------------------------
  // 3. Leave Records (20)
  // ---------------------------------------------------------------------------
  console.log("    Seeding leave records...");

  // Get trainer user IDs (from the User model, not Trainer model)
  const trainerUsers = await prisma.trainer.findMany({
    select: { userId: true },
  });
  const trainerUids = trainerUsers.map((t) => t.userId);

  // Fallback to all staff if no trainers
  const leaveUserPool = trainerUids.length > 0 ? trainerUids : allStaffIds;

  const leaveStartRange = new Date("2024-06-01");
  const leaveEndRange = new Date("2025-03-31");

  // Get a VP for approvals
  const approverUser = vpTrainersUser ?? adminUsers?.dean;
  const approverId = approverUser?.id ?? randomFrom(adminUserIds);

  const leaves: Array<{
    userId: string;
    type: "ANNUAL" | "SICK" | "EMERGENCY" | "OTHER";
    startDate: Date;
    endDate: Date;
    reason: string | null;
    status: "PENDING" | "APPROVED" | "REJECTED" | "CANCELLED";
    approvedById: string | null;
    approvedDate: Date | null;
  }> = [];

  for (const leave of LEAVE_RECORDS) {
    const userId = randomFrom(leaveUserPool);
    const startDate = randomDate(leaveStartRange, leaveEndRange);
    const endDate = new Date(startDate.getTime() + leave.durationDays * 86_400_000);

    const isApproved = leave.status === "APPROVED";
    const isRejected = leave.status === "REJECTED";

    leaves.push({
      userId,
      type: leave.type,
      startDate,
      endDate,
      reason: leave.reason,
      status: leave.status,
      approvedById: isApproved || isRejected ? approverId : null,
      approvedDate: isApproved || isRejected ? new Date(startDate.getTime() - randomInt(1, 5) * 86_400_000) : null,
    });
  }

  await prisma.leave.createMany({ data: leaves });
  console.log(`    Created ${leaves.length} leave records.`);

  // ---------------------------------------------------------------------------
  // 4. Evaluations (10 trainer evaluations)
  // ---------------------------------------------------------------------------
  console.log("    Seeding evaluations...");

  const evaluatorId = vpTrainersUser?.id ?? randomFrom(adminUserIds);

  const evaluations: Array<{
    evaluatedId: string;
    evaluatorId: string;
    period: string;
    overallScore: number;
    categories: object;
    comments: string | null;
  }> = [];

  // Pick up to 10 unique trainer user IDs
  const evalCandidates = trainerUids.length > 0 ? trainerUids : allStaffIds;
  const evalTargets = evalCandidates.slice(0, Math.min(10, evalCandidates.length));

  for (let i = 0; i < 10; i++) {
    const evaluatedId = evalTargets[i % evalTargets.length];

    // Generate scores between 3.0 and 5.0
    const teaching = Math.round((3.0 + Math.random() * 2.0) * 10) / 10;
    const research = Math.round((3.0 + Math.random() * 2.0) * 10) / 10;
    const service = Math.round((3.0 + Math.random() * 2.0) * 10) / 10;
    const overallScore = Math.round(((teaching + research + service) / 3) * 10) / 10;

    evaluations.push({
      evaluatedId,
      evaluatorId,
      period: "2024-T1",
      overallScore,
      categories: {
        teaching: { score: teaching, maxScore: 5.0, weight: 0.5 },
        research: { score: research, maxScore: 5.0, weight: 0.3 },
        service: { score: service, maxScore: 5.0, weight: 0.2 },
      },
      comments: EVALUATION_COMMENTS[i % EVALUATION_COMMENTS.length],
    });
  }

  await prisma.evaluation.createMany({ data: evaluations });
  console.log(`    Created ${evaluations.length} evaluations.`);

  // ---------------------------------------------------------------------------
  // 5. Notifications (30)
  // ---------------------------------------------------------------------------
  console.log("    Seeding notifications...");

  const notifications: Array<{
    senderId: string | null;
    receiverId: string;
    titleAr: string;
    titleEn: string;
    messageAr: string;
    messageEn: string;
    type: "INFO" | "WARNING" | "SUCCESS" | "TASK" | "GRADE" | "ATTENDANCE" | "SYSTEM";
    isRead: boolean;
  }> = [];

  for (let i = 0; i < 30; i++) {
    const template = NOTIFICATION_TEMPLATES[i % NOTIFICATION_TEMPLATES.length];
    const receiverId = randomFrom(allStaffIds);
    const senderId = template.type === "SYSTEM" ? null : randomFrom(adminUserIds);
    // Mix of read/unread: roughly 60% read, 40% unread
    const isRead = Math.random() < 0.6;

    notifications.push({
      senderId,
      receiverId,
      titleAr: template.titleAr,
      titleEn: template.titleEn,
      messageAr: template.messageAr,
      messageEn: template.messageEn,
      type: template.type,
      isRead,
    });
  }

  await prisma.notification.createMany({ data: notifications });
  console.log(`    Created ${notifications.length} notifications.`);

  console.log("  Tasks, projects, leaves, evaluations & notifications seed complete.");
}
