# Launch Flow — Design Document
**Date:** 2026-02-25
**Project:** سهيل — منصة إدارة الكليات التقنية
**Status:** Approved ✓

---

## 1. Overview

Complete the Workflow Builder lifecycle by wiring the "إطلاق" (Launch) button to a real API flow. Currently the button is decorative; this feature makes it trigger a `POST → PUT nodes → PATCH active` sequence, giving users a full **create → edit → launch** cycle without leaving the builder modal.

**Approach chosen:** Option A — unified `handleLaunch()` inside `workflow-builder-modal.tsx`, mirroring the existing `handleSave()` pattern.

---

## 2. State Machine for `meta.id`

```
meta.id = undefined   (new, never saved)
  → "حفظ"    button: disabled / no-op
  → "إطلاق"  button: POST workflow → PUT nodes → PATCH active → updateMeta({ id, status })

meta.id = "clx..."   (previously saved draft)
  → "حفظ"    button: PUT nodes + PATCH meta  (existing behaviour)
  → "إطلاق"  button: PATCH status → active only
```

---

## 3. `handleLaunch()` Flow

```
setSaving(true)

if (!meta.id):
  1. POST /api/v1/workflows          → { data: { id, ... } }
  2. PUT  /api/v1/workflows/{id}/nodes
  3. updateMeta({ id, status: "active" })

else:
  1. PUT  /api/v1/workflows/{meta.id}/nodes
  2. (status update follows)

PATCH /api/v1/workflows/{meta.id}   ← sets status = "active" + saves meta fields

markClean()
setSaving(false)
```

Error handling: wrap in try/finally; if POST fails, setSaving(false) and surface error via toast or console.error.

---

## 4. Top Bar UX Changes

| State | "حفظ" button | "إطلاق" button |
|-------|-------------|----------------|
| new workflow (no id) | disabled (greyed) | enabled — primary action |
| draft (has id) | enabled | enabled |
| active (launched) | enabled | shows "⏹ إيقاف" (PATCH → archived) |

Badge next to title:
- No badge → new/clean
- "غير محفوظ" (amber) → isDirty
- "نشط ✓" (green) → status = active

---

## 5. Files Changed

| File | Change |
|------|--------|
| `workflow-builder-modal.tsx` | Add `handleLaunch()` async fn; pass `onLaunch` prop to `WorkflowTopBar` |
| `workflow-top-bar.tsx` | Accept `onLaunch` prop; render correct button state based on `meta.status`; add "نشط ✓" badge |
| `workflow-store.ts` | No change — `updateMeta()` already handles `{ id, status }` patches |

---

## 6. Success Criteria

- [ ] Clicking "إطلاق" on a new workflow creates it in the DB and sets status = active
- [ ] Clicking "إطلاق" on an existing draft promotes it to active
- [ ] Top bar shows "نشط ✓" badge after successful launch
- [ ] "إطلاق" button changes to "⏹ إيقاف" when status = active
- [ ] "حفظ" is disabled / greyed when meta.id is undefined
- [ ] Saving state (spinner) during the async sequence
- [ ] No TypeScript errors, no console errors
