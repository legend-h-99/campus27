# Launch Flow Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Wire the "إطلاق" button in the Workflow Builder to a real POST→PUT nodes→PATCH active sequence, completing the create→edit→launch lifecycle.

**Architecture:** `handleLaunch()` lives in `workflow-builder-modal.tsx` (mirrors existing `handleSave()`). The top bar receives an `onLaunch` prop and renders button state based on `meta.status`. No new store actions needed — `updateMeta()` already patches `{ id, status }`.

**Tech Stack:** Next.js 16 App Router, Zustand 5, TypeScript, Lucide icons, Brutalist Signal design tokens (`--bs-signal`, `--bs-steel`)

---

## Task 1: Update `WorkflowTopBar` — props, button wiring, status badge

**Files:**
- Modify: `src/components/workflows/workflow-top-bar.tsx`

### Step 1: Add `onLaunch` prop to the interface

Replace the current interface (line 8–10):

```typescript
interface WorkflowTopBarProps {
  onSave: () => Promise<void>;
  onLaunch: () => Promise<void>;
}
```

Update the function signature:
```typescript
export function WorkflowTopBar({ onSave, onLaunch }: WorkflowTopBarProps) {
```

### Step 2: Add `isActive` derived value

Right after the existing `const isSaving = ...` line (line 17), add:

```typescript
const isActive = meta.status === "active";
```

### Step 3: Update the "غير محفوظ" badge to show status

Replace the existing `{isDirty && (<span>غير محفوظ</span>)}` block with:

```tsx
{isActive && !isDirty && (
  <span
    className="shrink-0 rounded-full px-2 py-0.5 text-xs font-medium"
    style={{ background: "rgba(52,199,89,0.12)", color: "#1a7a35" }}
  >
    نشط ✓
  </span>
)}
{isDirty && (
  <span
    className="shrink-0 rounded-full px-2 py-0.5 text-xs"
    style={{
      background: "rgba(255,59,48,0.1)",
      color: "var(--bs-signal)",
    }}
  >
    غير محفوظ
  </span>
)}
```

### Step 4: Disable "حفظ" when no id yet

Change the Save button's `disabled` prop from:
```typescript
disabled={isSaving || !isDirty}
```
to:
```typescript
disabled={isSaving || !isDirty || !meta.id}
```

### Step 5: Wire "إطلاق" button with dynamic state

Replace the static Launch button (lines 89–98) with:

```tsx
<button
  onClick={onLaunch}
  disabled={isSaving}
  className="flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-semibold transition-all disabled:opacity-40 hover:opacity-80"
  style={{
    background: isActive ? "rgba(28,28,30,0.06)" : "var(--bs-signal)",
    color: isActive ? "var(--bs-steel)" : "#fff",
  }}
>
  {isActive ? <Square size={12} /> : <Zap size={12} />}
  {isSaving ? "جاري التفعيل..." : isActive ? "إيقاف" : "إطلاق"}
</button>
```

Add `Square` to the lucide import at the top:
```typescript
import { Save, X, Zap, Edit2, Square } from "lucide-react";
```

### Step 6: Commit

```bash
git add src/components/workflows/workflow-top-bar.tsx
git commit -m "feat(workflows): update top bar — onLaunch prop, status badge, dynamic launch button"
```

---

## Task 2: Add `handleLaunch()` to `WorkflowBuilderModal`

**Files:**
- Modify: `src/components/workflows/workflow-builder-modal.tsx`

### Step 1: Read meta.id in the modal

`meta` is already selected on line 14 (`const meta = useWorkflowStore((s) => s.meta)`). Also add `updateMeta`:

```typescript
const updateMeta = useWorkflowStore((s) => s.updateMeta);
```

### Step 2: Add the `handleLaunch` function

Paste this immediately after the closing `}` of `handleSave` (after line 71):

```typescript
const handleLaunch = async () => {
  setSaving(true);
  try {
    let workflowId = meta.id;

    // Step A: Create the workflow if it doesn't exist yet
    if (!workflowId) {
      const createRes = await fetch("/api/v1/workflows", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: meta.name,
          description: meta.description,
          role: meta.role,
          schedule: meta.schedule,
        }),
      });
      const created = await createRes.json();
      workflowId = created.data.id as string;
    }

    // Step B: Persist nodes (atomic replace)
    await fetch(`/api/v1/workflows/${workflowId}/nodes`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        nodes: nodes.map((n, i) => ({
          type: n.type,
          title: n.title,
          description: n.description,
          position: i,
          config: n.config,
        })),
      }),
    });

    // Step C: Activate
    await fetch(`/api/v1/workflows/${workflowId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        status: "active",
        name: meta.name,
        description: meta.description,
        role: meta.role,
        schedule: meta.schedule,
      }),
    });

    // Step D: Sync store — isDirty=false marks clean, don't re-trigger "غير محفوظ"
    updateMeta({ id: workflowId, status: "active" });
    markClean();
  } finally {
    setSaving(false);
  }
};
```

### Step 3: Pass `onLaunch` to `WorkflowTopBar`

Change line (inside the JSX return):
```tsx
<WorkflowTopBar onSave={handleSave} />
```
to:
```tsx
<WorkflowTopBar onSave={handleSave} onLaunch={handleLaunch} />
```

### Step 4: Manual smoke test in preview (port 3001)

1. Click "سير العمل الآلي" in the sidebar → modal opens
2. Add 2–3 nodes from the palette
3. Click "إطلاق"
4. Verify:
   - Button shows spinner briefly → changes to "إيقاف" (grey)
   - "نشط ✓" green badge appears next to title
   - "غير محفوظ" badge is gone
   - No console errors
5. Open a new tab to `http://localhost:3001/api/v1/workflows` → the new workflow should appear with `status: "active"`

### Step 5: Commit

```bash
git add src/components/workflows/workflow-builder-modal.tsx
git commit -m "feat(workflows): add handleLaunch — POST→PUT nodes→PATCH active lifecycle"
```

---

## Done

Full launch lifecycle is now wired. Future work:
- "إيقاف" button → PATCH `status: "archived"`
- Workflow list/management page (GET /api/v1/workflows UI)
- Node config forms (click node → right panel shows config fields)
