// ============== Quality Module Types ==============

// Tab types for the quality dashboard
export type QualityTab =
  | "dashboard"
  | "kpis"
  | "standards"
  | "audits"
  | "findings"
  | "plans"
  | "surveys"
  | "reports"
  | "documents"
  | "accreditations";

// ============== Standards ==============

export interface QualityStandard {
  id: string;
  standardCode: string;
  nameAr: string;
  nameEn: string | null;
  category: "ACADEMIC" | "INSTITUTIONAL" | "PROGRAM" | "LEARNING_OUTCOMES";
  descriptionAr: string | null;
  descriptionEn: string | null;
  weight: number | null;
  ncaaaVersion: string | null;
  isActive: boolean;
  kpis?: QualityKpi[];
}

// ============== KPIs ==============

export interface QualityKpi {
  id: string;
  standardId: string | null;
  kpiCode: string;
  nameAr: string;
  nameEn: string | null;
  descriptionAr: string | null;
  measurementUnit: string | null;
  targetValue: number;
  minAcceptableValue: number | null;
  dataSource: string | null;
  frequency: KpiFrequency;
  isActive: boolean;
  standard?: QualityStandard;
  measurements?: KpiMeasurement[];
  latestMeasurement?: KpiMeasurement | null;
}

export type KpiFrequency =
  | "DAILY"
  | "WEEKLY"
  | "MONTHLY"
  | "QUARTERLY"
  | "SEMESTER"
  | "ANNUAL";

export interface KpiMeasurement {
  id: string;
  kpiId: string;
  measurementDate: string;
  actualValue: number;
  targetValue: number | null;
  achievementRate: number | null;
  status: KpiMeasurementStatus;
  notes: string | null;
  measuredBy?: { fullNameAr: string } | null;
}

export type KpiMeasurementStatus = "EXCEEDS" | "MEETS" | "BELOW" | "CRITICAL";

// ============== Audits ==============

export interface QualityAudit {
  id: string;
  auditType: AuditType;
  titleAr: string;
  titleEn: string | null;
  departmentId: string | null;
  scheduledDate: string | null;
  completionDate: string | null;
  status: AuditStatus;
  leadAuditorId: string | null;
  overallRating: AuditRating | null;
  scopeAr: string | null;
  findingsSummary: string | null;
  leadAuditor?: { fullNameAr: string } | null;
  findings?: AuditFinding[];
  _count?: { findings: number };
}

export type AuditType =
  | "INTERNAL"
  | "EXTERNAL"
  | "PROGRAM_REVIEW"
  | "COURSE_REVIEW"
  | "SELF_ASSESSMENT";

export type AuditStatus = "PLANNED" | "IN_PROGRESS" | "COMPLETED" | "CANCELLED";

export type AuditRating =
  | "EXCELLENT"
  | "GOOD"
  | "SATISFACTORY"
  | "NEEDS_IMPROVEMENT"
  | "UNSATISFACTORY";

// ============== Findings ==============

export interface AuditFinding {
  id: string;
  auditId: string;
  standardId: string | null;
  findingType: FindingType;
  severity: FindingSeverity | null;
  descriptionAr: string;
  descriptionEn: string | null;
  evidence: string | null;
  recommendationAr: string | null;
  responsibleDept: string | null;
  dueDate: string | null;
  status: FindingStatus;
  resolutionNotes: string | null;
  audit?: { titleAr: string };
  standard?: { nameAr: string; standardCode: string } | null;
}

export type FindingType =
  | "STRENGTH"
  | "WEAKNESS"
  | "OPPORTUNITY"
  | "THREAT"
  | "NON_COMPLIANCE";

export type FindingSeverity = "CRITICAL" | "MAJOR" | "MINOR" | "OBSERVATION";

export type FindingStatus = "OPEN" | "IN_PROGRESS" | "RESOLVED" | "CLOSED";

// ============== Improvement Plans ==============

export interface ImprovementPlan {
  id: string;
  titleAr: string;
  titleEn: string | null;
  planType: ImprovementPlanType;
  relatedFindingId: string | null;
  descriptionAr: string | null;
  objectives: string | null;
  startDate: string | null;
  targetCompletionDate: string | null;
  actualCompletionDate: string | null;
  status: ImprovementPlanStatus;
  budget: number | null;
  progressPercentage: number;
  owner?: { fullNameAr: string } | null;
  actions?: ImprovementAction[];
  relatedFinding?: { descriptionAr: string } | null;
}

export type ImprovementPlanType = "CORRECTIVE" | "PREVENTIVE" | "ENHANCEMENT";

export type ImprovementPlanStatus =
  | "DRAFT"
  | "APPROVED"
  | "IP_IN_PROGRESS"
  | "IP_COMPLETED"
  | "IP_CANCELLED";

export interface ImprovementAction {
  id: string;
  planId: string;
  descriptionAr: string;
  responsiblePerson: string | null;
  startDate: string | null;
  dueDate: string | null;
  completionDate: string | null;
  status: ImprovementActionStatus;
  completionPercentage: number;
  notes: string | null;
}

export type ImprovementActionStatus =
  | "PENDING"
  | "IA_IN_PROGRESS"
  | "IA_COMPLETED"
  | "DELAYED";

// ============== Surveys ==============

export interface QualitySurvey {
  id: string;
  titleAr: string;
  titleEn: string | null;
  surveyType: SurveyType;
  targetAudience: SurveyTargetAudience;
  semester: string | null;
  academicYear: string | null;
  startDate: string | null;
  endDate: string | null;
  totalResponses: number;
  status: SurveyStatus;
  _count?: { responses: number };
}

export type SurveyType =
  | "STUDENT_SATISFACTION"
  | "COURSE_EVALUATION"
  | "TRAINER_EVALUATION"
  | "FACILITIES"
  | "SERVICES"
  | "GRADUATE_SURVEY"
  | "EMPLOYER_SURVEY";

export type SurveyTargetAudience =
  | "STUDENTS"
  | "TRAINERS"
  | "GRADUATES"
  | "EMPLOYERS"
  | "STAFF";

export type SurveyStatus =
  | "SURVEY_DRAFT"
  | "SURVEY_ACTIVE"
  | "SURVEY_CLOSED"
  | "SURVEY_ARCHIVED";

// ============== Reports ==============

export interface QualityReport {
  id: string;
  reportType: QualityReportType;
  titleAr: string;
  titleEn: string | null;
  academicYear: string | null;
  reportPeriodStart: string | null;
  reportPeriodEnd: string | null;
  executiveSummary: string | null;
  status: QualityReportStatus;
  preparedBy?: { fullNameAr: string } | null;
  createdAt: string;
}

export type QualityReportType =
  | "KPI_REPORT"
  | "AUDIT_REPORT"
  | "ANNUAL_REPORT"
  | "SELF_STUDY"
  | "PROGRAM_REVIEW"
  | "NCAAA_SUBMISSION";

export type QualityReportStatus =
  | "REPORT_DRAFT"
  | "UNDER_REVIEW"
  | "REPORT_APPROVED"
  | "PUBLISHED";

// ============== Documents ==============

export interface QualityDocument {
  id: string;
  docType: QualityDocType;
  titleAr: string;
  titleEn: string | null;
  docCode: string | null;
  version: string | null;
  descriptionAr: string | null;
  effectiveDate: string | null;
  reviewDate: string | null;
  status: QualityDocStatus;
  owner?: { fullNameAr: string } | null;
}

export type QualityDocType =
  | "POLICY"
  | "PROCEDURE"
  | "GUIDELINE"
  | "FORM"
  | "MANUAL"
  | "DOC_STANDARD";

export type QualityDocStatus =
  | "DOC_DRAFT"
  | "DOC_ACTIVE"
  | "DOC_UNDER_REVIEW"
  | "DOC_ARCHIVED";

// ============== Meetings ==============

export interface QualityMeeting {
  id: string;
  meetingType: MeetingType;
  titleAr: string | null;
  meetingDate: string | null;
  location: string | null;
  status: MeetingStatus;
  createdBy?: { fullNameAr: string } | null;
}

export type MeetingType =
  | "QUALITY_COMMITTEE"
  | "AUDIT_TEAM"
  | "REVIEW"
  | "PLANNING";

export type MeetingStatus = "SCHEDULED" | "MEETING_COMPLETED" | "MEETING_CANCELLED";

// ============== Accreditations ==============

export interface Accreditation {
  id: string;
  accreditationType: AccreditationType;
  accreditingBody: string | null;
  departmentId: string | null;
  certificateNumber: string | null;
  grantDate: string | null;
  expiryDate: string | null;
  status: AccreditationStatus;
  notes: string | null;
}

export type AccreditationType =
  | "INSTITUTIONAL"
  | "PROGRAM_ACCREDITATION"
  | "COURSE_ACCREDITATION";

export type AccreditationStatus =
  | "ACCREDITATION_ACTIVE"
  | "EXPIRED"
  | "UNDER_RENEWAL"
  | "SUSPENDED";

// ============== Dashboard Summary ==============

export interface QualityDashboardData {
  kpiSummary: {
    total: number;
    exceeds: number;
    meets: number;
    below: number;
    critical: number;
  };
  openFindings: {
    total: number;
    critical: number;
    major: number;
    minor: number;
  };
  improvementSummary: {
    total: number;
    inProgress: number;
    completed: number;
    avgProgress: number;
  };
  recentAudits: QualityAudit[];
  accreditations: Accreditation[];
}

// ============== API Response Types ==============

export interface QualityApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}
