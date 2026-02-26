# Brand Identity Unification — Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Replace all hardcoded brand strings with constants from a single `BRAND` config object, establishing "سهيل" (Arabic) / "Saohil" (English) as the official bilingual brand — with zero occurrences of "Saohil1" remaining in production code.

**Architecture:** One new file (`src/config/brand.ts`) exports a `BRAND` constant. Every other file imports from it. No logic changes — pure string-constant substitution across 10 locations in 8 files.

**Tech Stack:** TypeScript, Next.js 16, next-intl (locale-aware rendering)

---

## Verification Command (run after every task)

```bash
grep -rn "Saohil1" src/ --include="*.tsx" --include="*.ts"
```
**Expected at the end:** 0 results. Run after each task to track progress.

---

### Task 1: Create `src/config/brand.ts`

**Files:**
- Create: `src/config/brand.ts`

**Step 1: Create the file**

```ts
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
```

**Step 2: Verify the file compiles**

```bash
npx tsc --noEmit src/config/brand.ts 2>&1 || true
```
Expected: no errors (or "cannot be compiled alone" — that's fine, it's a module).

**Step 3: Commit**

```bash
git add src/config/brand.ts
git commit -m "feat(brand): add single-source-of-truth brand constants"
```

---

### Task 2: Update `src/app/layout.tsx` — page `<title>`

**Files:**
- Modify: `src/app/layout.tsx:6`

**Context:** This file exports Next.js metadata. The title currently says "Saohil1".

**Step 1: Add the import at the top of the file**

After line 1 (`import type { Metadata } from "next";`), add:
```ts
import { BRAND } from "@/config/brand";
```

**Step 2: Replace the metadata title**

Find:
```ts
  title: "Saohil1 - نظام إدارة الكليات التقنية",
```
Replace with:
```ts
  title: `${BRAND.nameEn} - ${BRAND.taglineAr}`,
```

**Step 3: Verify**

```bash
grep -n "Saohil1" src/app/layout.tsx
```
Expected: 0 results.

**Step 4: Commit**

```bash
git add src/app/layout.tsx
git commit -m "fix(brand): use BRAND constants in root layout title"
```

---

### Task 3: Update `src/components/layout/header.tsx` — mobile logo

**Files:**
- Modify: `src/components/layout/header.tsx:111`

**Context:** The mobile sidebar logo shows "Saohil1". The header component already receives `locale` as a prop (check the component signature; if not, it reads from context).

**Step 1: Add the import**

At the top of `src/components/layout/header.tsx`, add:
```ts
import { BRAND } from "@/config/brand";
```

**Step 2: Replace the brand string**

Find (line ~111):
```tsx
            <span className="text-sm font-bold text-teal-600">Saohil1</span>
```
Replace with:
```tsx
            <span className="text-sm font-bold text-teal-600">{BRAND.nameEn}</span>
```

**Step 3: Verify**

```bash
grep -n "Saohil1" src/components/layout/header.tsx
```
Expected: 0 results.

**Step 4: Commit**

```bash
git add src/components/layout/header.tsx
git commit -m "fix(brand): use BRAND.nameEn in app header mobile logo"
```

---

### Task 4: Update `src/components/layout/sidebar.tsx` — 2 locations

**Files:**
- Modify: `src/components/layout/sidebar.tsx:545` (mobile sidebar logo)
- Modify: `src/components/layout/sidebar.tsx:644` (collapsible desktop sidebar)

**Context:** Two brand strings in the sidebar — one is "Saohil1" in the mobile drawer header, the other is "سهيل" hardcoded in the expanded desktop sidebar. Line 647 shows a collapsed icon "س" — this should also come from BRAND.iconLetter.

**Step 1: Add the import**

At the top of `src/components/layout/sidebar.tsx`, add:
```ts
import { BRAND } from "@/config/brand";
```

**Step 2: Fix mobile sidebar — line ~545**

Find:
```tsx
              <span className="text-[17px] font-bold text-slate-800">Saohil1</span>
```
Replace with:
```tsx
              <span className="text-[17px] font-bold text-slate-800">{BRAND.nameEn}</span>
```

**Step 3: Fix desktop sidebar expanded — line ~644**

Find:
```tsx
          <span className="text-sm font-semibold tracking-tight text-[var(--color-primary)]">
            سهيل
          </span>
```
Replace with:
```tsx
          <span className="text-sm font-semibold tracking-tight text-[var(--color-primary)]">
            {BRAND.nameAr}
          </span>
```

**Step 4: Fix desktop sidebar collapsed icon — line ~647**

Find:
```tsx
          <span className="text-base font-bold text-[var(--color-primary)]">س</span>
```
Replace with:
```tsx
          <span className="text-base font-bold text-[var(--color-primary)]">{BRAND.iconLetter}</span>
```

**Step 5: Verify**

```bash
grep -n "Saohil1\|>سهيل<\|>س<" src/components/layout/sidebar.tsx
```
Expected: 0 results (prose sentences containing the name are out of scope).

**Step 6: Commit**

```bash
git add src/components/layout/sidebar.tsx
git commit -m "fix(brand): use BRAND constants in sidebar (mobile + desktop)"
```

---

### Task 5: Update `src/app/[locale]/(auth)/login/page.tsx` — login logo

**Files:**
- Modify: `src/app/[locale]/(auth)/login/page.tsx:233`

**Context:** Login page shows the brand name as the main `<h1>`. The page receives `locale` from params — use `BRAND.name(locale)` for bilingual rendering.

**Step 1: Add the import**

```ts
import { BRAND } from "@/config/brand";
```

**Step 2: Find and replace — line ~233**

Find:
```tsx
              <h1 className="text-xl font-bold text-teal-600 xs:text-2xl">Saohil1</h1>
```
Replace with:
```tsx
              <h1 className="text-xl font-bold text-teal-600 xs:text-2xl">{BRAND.name(locale)}</h1>
```

> **Note:** `locale` must be available in scope. In Next.js App Router pages, it comes from `params`. Confirm it's destructured at the top of the component — e.g., `const { locale } = await params;`.

**Step 3: Verify**

```bash
grep -n "Saohil1" src/app/[locale]/\(auth\)/login/page.tsx
```
Expected: 0 results.

**Step 4: Commit**

```bash
git add "src/app/[locale]/(auth)/login/page.tsx"
git commit -m "fix(brand): use BRAND.name(locale) in login page logo"
```

---

### Task 6: Update `src/app/[locale]/(marketing)/features/page.tsx` — 2 occurrences

**Files:**
- Modify: `src/app/[locale]/(marketing)/features/page.tsx:17`

**Context:** The features page heading uses "Saohil1" twice (Arabic + English variants on the same line via ternary).

**Step 1: Add the import**

```ts
import { BRAND } from "@/config/brand";
```

**Step 2: Replace — line ~17**

Find:
```tsx
            {isAr ? "ميزات منصة Saohil1" : "Saohil1 Platform Features"}
```
Replace with:
```tsx
            {isAr ? `ميزات منصة ${BRAND.nameAr}` : `${BRAND.nameEn} Platform Features`}
```

**Step 3: Verify**

```bash
grep -n "Saohil1" "src/app/[locale]/(marketing)/features/page.tsx"
```
Expected: 0 results.

**Step 4: Commit**

```bash
git add "src/app/[locale]/(marketing)/features/page.tsx"
git commit -m "fix(brand): use BRAND constants in features page heading"
```

---

### Task 7: Update `src/components/marketing/marketing-navbar.tsx` — navbar logo

**Files:**
- Modify: `src/components/marketing/marketing-navbar.tsx:50`

**Context:** Marketing navbar is Arabic-only context (always shows Arabic brand). Replace the hardcoded "سهيل" with `BRAND.nameAr`.

**Step 1: Add the import**

```ts
import { BRAND } from "@/config/brand";
```

**Step 2: Replace — line ~50**

Find:
```tsx
            سهيل
```
(inside the `<span>` with scroll styling)

Replace with:
```tsx
            {BRAND.nameAr}
```

The full span should look like:
```tsx
          <span
            className="text-sm font-bold transition-colors duration-300"
            style={{ color: scrolled ? "var(--bs-steel)" : "#fff" }}
          >
            {BRAND.nameAr}
          </span>
```

**Step 3: Verify**

```bash
grep -n "Saohil1" src/components/marketing/marketing-navbar.tsx
```
Expected: 0 results.

**Step 4: Commit**

```bash
git add src/components/marketing/marketing-navbar.tsx
git commit -m "fix(brand): use BRAND.nameAr in marketing navbar"
```

---

### Task 8: Update `src/components/marketing/marketing-footer.tsx` — 2 locations

**Files:**
- Modify: `src/components/marketing/marketing-footer.tsx:64` (footer logo text)
- Modify: `src/components/marketing/marketing-footer.tsx:113` (copyright line)

**Step 1: Add the import**

```ts
import { BRAND } from "@/config/brand";
```

**Step 2: Fix footer logo — line ~64**

Find:
```tsx
                  سهيل
```
(inside `<span className="text-base font-bold text-white" ...>`)

Replace with:
```tsx
                  {BRAND.nameAr}
```

**Step 3: Fix copyright — line ~113**

Find:
```tsx
              © {year} سهيل. {isAr ? "جميع الحقوق محفوظة." : "All rights reserved."}
```
Replace with:
```tsx
              © {year} {BRAND.nameAr}. {isAr ? "جميع الحقوق محفوظة." : "All rights reserved."}
```

**Step 4: Verify**

```bash
grep -n "Saohil1" src/components/marketing/marketing-footer.tsx
```
Expected: 0 results.

**Step 5: Commit**

```bash
git add src/components/marketing/marketing-footer.tsx
git commit -m "fix(brand): use BRAND.nameAr in marketing footer (logo + copyright)"
```

---

### Task 9: Update AI files — `ai-config.ts` and `prompt-templates.ts`

**Files:**
- Modify: `src/lib/ai-config.ts:3` (comment)
- Modify: `src/services/ai/prompt-templates.ts:21,24,48,51` (4 AI prompt strings)

**Context:** AI prompts always use the English brand name (`BRAND.nameEn`). The comment in `ai-config.ts` also contains "Saohil1".

**Step 1: Fix `ai-config.ts` comment — line 3**

Add import at top:
```ts
// (no import needed — this is just a comment fix)
```

Find:
```ts
 * إعدادات نظام الذكاء الاصطناعي - Saohil1
```
Replace with:
```ts
 * إعدادات نظام الذكاء الاصطناعي - Saohil
```

> **Note:** This is a code comment, not a template string — no import needed. It's corrected manually.

**Step 2: Fix `prompt-templates.ts` — add import**

At the top of `src/services/ai/prompt-templates.ts`:
```ts
import { BRAND } from "@/config/brand";
```

**Step 3: Fix Arabic system prompt — line ~21**

Find:
```ts
    return `أنت مساعد ذكي متخصص في إدارة الكليات التقنية السعودية، تعمل ضمن منصة Saohil1 التابعة للمؤسسة العامة للتدريب التقني والمهني.
```
Replace with:
```ts
    return `أنت مساعد ذكي متخصص في إدارة الكليات التقنية السعودية، تعمل ضمن منصة ${BRAND.nameEn} التابعة للمؤسسة العامة للتدريب التقني والمهني.
```

**Step 4: Fix Arabic assistant name — line ~24**

Find:
```ts
- اسمك: مساعد Saohil1
```
Replace with:
```ts
- اسمك: مساعد ${BRAND.nameEn}
```

**Step 5: Fix English system prompt — line ~48**

Find:
```ts
    return `You are an AI assistant specialized in Saudi technical college management, working within the Saohil1 platform under the Technical and Vocational Training Corporation (TVTC).
```
Replace with:
```ts
    return `You are an AI assistant specialized in Saudi technical college management, working within the ${BRAND.nameEn} platform under the Technical and Vocational Training Corporation (TVTC).
```

**Step 6: Fix English assistant name — line ~51**

Find:
```ts
- Name: Saohil1 Assistant
```
Replace with:
```ts
- Name: ${BRAND.nameEn} Assistant
```

**Step 7: Verify both files**

```bash
grep -n "Saohil1" src/lib/ai-config.ts src/services/ai/prompt-templates.ts
```
Expected: 0 results.

**Step 8: Commit**

```bash
git add src/lib/ai-config.ts src/services/ai/prompt-templates.ts
git commit -m "fix(brand): use BRAND.nameEn in AI config and prompt templates"
```

---

### Task 10: Final verification + cleanup commit

**Step 1: Run the full verification sweep**

```bash
grep -rn "Saohil1" src/ --include="*.tsx" --include="*.ts"
```
**Expected: 0 results.** If any remain, fix them now.

**Step 2: TypeScript check**

```bash
npx tsc --noEmit
```
Expected: no errors.

**Step 3: Check dev server loads correctly**

Start the server (if not already running):
```bash
npm run dev
```
Then verify visually:
- `http://localhost:3001/ar` → navbar shows "سهيل", page `<title>` shows "Saohil"
- `http://localhost:3001/en` → navbar shows "Saohil"
- `http://localhost:3001/ar/login` → login logo shows "سهيل"
- `http://localhost:3001/en/login` → login logo shows "Saohil"
- `http://localhost:3001/ar/dashboard` → sidebar shows "سهيل" (expanded), "س" (collapsed)

**Step 4: Final commit (if any leftover fixes were needed)**

```bash
git add -u
git commit -m "fix(brand): resolve remaining brand string occurrences"
```

---

## Out of Scope (do NOT change)

| Pattern | Reason |
|---------|--------|
| `"انضم لأكثر من 500 مؤسسة تثق في سهيل"` | Name is part of prose sentence, not a token |
| `@saohil1.sa` email addresses | Data/seed values, not brand display |
| `saohil1/` directory name | Technical identifier |
| Git repo name | Technical identifier |

---

## Summary Checklist

- [ ] `src/config/brand.ts` created
- [ ] `src/app/layout.tsx` title updated
- [ ] `src/components/layout/header.tsx` mobile logo updated
- [ ] `src/components/layout/sidebar.tsx` 2 locations updated (+ icon)
- [ ] `src/app/[locale]/(auth)/login/page.tsx` updated
- [ ] `src/app/[locale]/(marketing)/features/page.tsx` 2 occurrences updated
- [ ] `src/components/marketing/marketing-navbar.tsx` updated
- [ ] `src/components/marketing/marketing-footer.tsx` 2 locations updated
- [ ] `src/lib/ai-config.ts` comment updated
- [ ] `src/services/ai/prompt-templates.ts` 4 prompt strings updated
- [ ] `grep -rn "Saohil1" src/` returns 0 results ✅
