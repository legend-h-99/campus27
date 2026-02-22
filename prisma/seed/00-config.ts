// =============================================================================
// Campus26 Seed Configuration
// Central constants and config shared across all seed scripts
// =============================================================================

import { hash } from "bcryptjs";

/**
 * Returns a bcrypt hash of the default seed password "123456".
 * Cached after first call to avoid re-hashing.
 */
let _cachedHash: string | null = null;

export async function getPasswordHash(): Promise<string> {
  if (!_cachedHash) {
    _cachedHash = await hash("123456", 12);
  }
  return _cachedHash;
}

// -----------------------------------------------------------------------------
// Department IDs
// -----------------------------------------------------------------------------

export const DEPARTMENT_IDS = [
  "dept-cs",
  "dept-ee",
  "dept-me",
  "dept-ba",
  "dept-em",
  "dept-wd",
  "dept-cy",
  "dept-gd",
  "dept-ac",
  "dept-os",
] as const;

export type DepartmentId = (typeof DEPARTMENT_IDS)[number];

// -----------------------------------------------------------------------------
// Department Capacities
// -----------------------------------------------------------------------------

export const DEPARTMENT_CAPACITIES: Record<DepartmentId, number> = {
  "dept-cs": 300,
  "dept-ee": 250,
  "dept-me": 260,
  "dept-ba": 200,
  "dept-em": 150,
  "dept-wd": 180,
  "dept-cy": 120,
  "dept-gd": 100,
  "dept-ac": 140,
  "dept-os": 100,
};

// -----------------------------------------------------------------------------
// Semesters
// -----------------------------------------------------------------------------

export interface SemesterConfig {
  id: string;
  year: number;
  term: number;
  nameAr: string;
  nameEn: string;
  start: string;
  end: string;
  isCurrent: boolean;
}

export const SEMESTERS: SemesterConfig[] = [
  {
    id: "sem-2023-t2",
    year: 2023,
    term: 2,
    nameAr: "الفصل الثاني 1445هـ",
    nameEn: "Second Semester 2023",
    start: "2024-01-15",
    end: "2024-05-30",
    isCurrent: false,
  },
  {
    id: "sem-2024-t1",
    year: 2024,
    term: 1,
    nameAr: "الفصل الأول 1446هـ",
    nameEn: "First Semester 2024",
    start: "2024-09-01",
    end: "2025-01-15",
    isCurrent: true,
  },
  {
    id: "sem-2024-t2",
    year: 2024,
    term: 2,
    nameAr: "الفصل الثاني 1446هـ",
    nameEn: "Second Semester 2024",
    start: "2025-02-01",
    end: "2025-06-15",
    isCurrent: false,
  },
];

// -----------------------------------------------------------------------------
// Time Slots (Saudi college standard 1.5-hour blocks)
// -----------------------------------------------------------------------------

export interface TimeSlot {
  start: string;
  end: string;
}

export const TIME_SLOTS: TimeSlot[] = [
  { start: "08:00", end: "09:30" },
  { start: "09:45", end: "11:15" },
  { start: "11:30", end: "13:00" },
  { start: "13:30", end: "15:00" },
];

// -----------------------------------------------------------------------------
// Days of Week (Saudi working week: Sunday-Thursday)
// -----------------------------------------------------------------------------

export const DAYS_OF_WEEK = [
  "SUNDAY",
  "MONDAY",
  "TUESDAY",
  "WEDNESDAY",
  "THURSDAY",
] as const;

export type DayOfWeek = (typeof DAYS_OF_WEEK)[number];

// -----------------------------------------------------------------------------
// Seed Volume Targets
// -----------------------------------------------------------------------------

/** Average number of trainers (instructors) per department */
export const TRAINERS_PER_DEPT = 6;

/** Total target number of trainees (students) across all departments */
export const TRAINEES_TARGET = 300;

/** Average number of courses per department */
export const COURSES_PER_DEPT = 12;
