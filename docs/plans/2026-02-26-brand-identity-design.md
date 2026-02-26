# Brand Identity Unification — Design Doc
**Date:** 2026-02-26
**Status:** Approved

---

## Problem

The platform has 4 conflicting brand representations across the codebase:

| Location | Current value | Issue |
|----------|---------------|-------|
| Marketing (navbar, footer, CTA) | "سهيل" | Correct Arabic, but hardcoded |
| App header + Login page | "Saohil1" | Wrong — "1" is a code suffix, not a brand name |
| Sidebar (mobile) | "Saohil1" | Wrong |
| Sidebar (collapsible desktop) | "سهيل" | Correct, but hardcoded |
| Page `<title>` | "Saohil1" | Wrong |
| AI prompts | "Saohil1" | Wrong |

---

## Decision

**Bilingual brand:** Arabic context → `"سهيل"`, English context → `"Saohil"` (no "1" suffix).

**Architecture:** Single source of truth via `src/config/brand.ts`.

---

## Brand Constants (`src/config/brand.ts`)

```ts
export const BRAND = {
  nameAr:     "سهيل",
  nameEn:     "Saohil",
  name:       (locale: string) => locale === "ar" ? "سهيل" : "Saohil",
  taglineAr:  "نظام إدارة الكليات التقنية",
  taglineEn:  "Technical College Management System",
  iconLetter: "س",
  url:        "saohil.sa",
} as const;
```

---

## Usage Rules

| Context | Use |
|---------|-----|
| Arabic UI (`isAr = true`) | `BRAND.nameAr` → `"سهيل"` |
| English UI (`isAr = false`) | `BRAND.nameEn` → `"Saohil"` |
| Locale-aware (components) | `BRAND.name(locale)` |
| AI/backend strings | `BRAND.nameEn` (always English) |
| Collapsed sidebar icon | `BRAND.iconLetter` → `"س"` |
| `<title>` tag | `BRAND.nameEn` + tagline |

---

## Files to Update (10 locations across 8 files)

| File | Line(s) | Change |
|------|---------|--------|
| `src/config/brand.ts` | new | Create file |
| `src/app/layout.tsx` | 6 | `"Saohil1"` → `BRAND.nameEn` |
| `src/components/layout/sidebar.tsx` | 545, 644 | `"Saohil1"` / `"سهيل"` → `BRAND` constants |
| `src/components/layout/header.tsx` | 111 | `"Saohil1"` → `BRAND.nameEn` |
| `src/app/[locale]/(auth)/login/page.tsx` | 233 | `"Saohil1"` → `BRAND.name(locale)` |
| `src/app/[locale]/(marketing)/features/page.tsx` | 17 | `"Saohil1"` × 2 → `BRAND.name(locale)` |
| `src/components/marketing/marketing-navbar.tsx` | 50 | `"سهيل"` → `BRAND.nameAr` |
| `src/components/marketing/marketing-footer.tsx` | 64, 113 | `"سهيل"` × 2 → `BRAND.nameAr` |
| `src/lib/ai-config.ts` | 3 | `"Saohil1"` → `BRAND.nameEn` |
| `src/services/ai/prompt-templates.ts` | 21,24,48,51 | `"Saohil1"` × 4 → `BRAND.nameEn` |

---

## Out of Scope

- Inline brand references within prose sentences (e.g. `"انضم لأكثر من 500 مؤسسة تثق في سهيل"`) — name is part of the sentence, not a standalone brand token
- Email addresses (`@saohil1.sa`) — these are data/seed values, not brand display
- Git repo name and directory (`saohil1/`) — technical identifiers, unchanged

---

## Verification

After implementation, run:
```bash
grep -rn "Saohil1" src/ --include="*.tsx" --include="*.ts"
# Expected: 0 results
```
