/**
 * Brand constants — single source of truth.
 * Arabic context → nameAr, English context → nameEn.
 * AI/backend strings always use nameEn.
 */
export const BRAND = {
  nameAr:    "سهيل",
  nameEn:    "Saohil",
  name:      (locale: string) => locale === "ar" ? "سهيل" : "Saohil",
  taglineAr: "نظام إدارة الكليات التقنية",
  taglineEn: "Technical College Management System",
  iconLetter: "س",
  url:       "saohil.sa",
} as const;
