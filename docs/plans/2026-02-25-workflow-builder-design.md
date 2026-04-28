# Workflow Builder — Design Document
**Date:** 2026-02-25
**Project:** سهيل — منصة إدارة الكليات التقنية
**Status:** Approved ✓

---

## 1. Overview

A full-screen modal Workflow Builder that allows college administrators and deans to visually construct automation workflows (e.g., "when a training plan is approved → update trainee schedules → notify trainers"). The builder opens on top of the existing dashboard — no new routing required.

**Design decisions:**
- Integration: portal-rendered `position: fixed, inset-0, z-50` overlay
- Canvas model: vertical sortable column (Approach A — linear workflows)
- Interaction: full Drag & Drop via `@dnd-kit/core` + `@dnd-kit/sortable`
- Persistence: explicit save button → `PUT /api/v1/workflows/[id]/nodes`
- State: Zustand store (`useWorkflowStore`) for in-flight canvas state

---

## 2. Layout Anatomy (RTL)

```
┌─────────────────────────────────────────────────────────────────┐
│  Top Bar: [عنوان سير العمل ✏]    [إعدادات]   [إطلاق]   [✕]    │
├───────────┬────────────────────────────────┬────────────────────┤
│  Sidebar  │        Canvas (dotted grid)    │   Right Panel      │
│  (mini)   │                                │ ─── الإعدادات ───  │
│  60px–200 │  ○── Trigger ──────────────── │ name, role, sched  │
│  px wide  │  │                            │ ─── كتل الإضافة ── │
│           │  ●── Action 1 ─────────────  │ 📦 block 1         │
│  [أدوار]  │  │                            │ 📦 block 2         │
│           │  ●── Action 2 ─────────────  │ 📦 block 3 ...     │
│           │  │                            │                    │
│           │  [+ أضف خطوة]               │                    │
└───────────┴────────────────────────────────┴────────────────────┘
```

---

## 3. Component Tree

```
src/components/workflows/
├── workflow-builder-modal.tsx    ← portal + overlay shell + open trigger
├── workflow-top-bar.tsx          ← editable title + action buttons (save, launch, close)
├── workflow-sidebar.tsx          ← mini role-aware nav (icons collapsed / labels expanded)
├── workflow-canvas.tsx           ← DndContext + SortableContext + dotted grid background
├── workflow-node.tsx             ← individual node card (SortableItem)
├── workflow-connector.tsx        ← 1px vertical line between nodes
├── workflow-right-panel.tsx      ← settings form (top) + palette blocks (bottom)
├── palette-block.tsx             ← Draggable block card from palette
└── workflow-types.ts             ← WorkflowDraft, WorkflowNodeDraft, PaletteBlock types
```

**State management:**
```
src/stores/workflow-store.ts      ← Zustand store
  - nodes: WorkflowNodeDraft[]
  - workflow: WorkflowMeta
  - isDirty: boolean
  - actions: addNode, removeNode, reorderNodes, updateWorkflow, reset
```

---

## 4. Prisma Models

```prisma
model Workflow {
  id          String   @id @default(cuid())
  name        String
  description String?
  status      String   @default("draft")  // draft | active | archived
  role        String?                      // responsible role key
  schedule    String?                      // trigger description or cron
  createdById String
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  nodes WorkflowNode[]

  @@index([createdById])
  @@map("workflows")
}

model WorkflowNode {
  id          String   @id @default(cuid())
  workflowId  String
  type        String   // "trigger" | "action" | "condition"
  title       String
  description String?
  position    Int      // sort order in vertical list (0-based)
  config      Json     @default("{}")
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  workflow Workflow @relation(fields: [workflowId], references: [id], onDelete: Cascade)

  @@index([workflowId])
  @@map("workflow_nodes")
}
```

---

## 5. API Routes

All under `src/app/api/v1/workflows/`:

| Method | Path | Purpose | Body / Params |
|--------|------|---------|---------------|
| `POST` | `/api/v1/workflows` | Create new workflow | `{ name, role?, description? }` |
| `GET` | `/api/v1/workflows` | List workflows (paginated) | `?page&limit` |
| `GET` | `/api/v1/workflows/[id]` | Get workflow + ordered nodes | — |
| `PATCH` | `/api/v1/workflows/[id]` | Update metadata | `{ name?, status?, role?, schedule? }` |
| `PUT` | `/api/v1/workflows/[id]/nodes` | Full node list replace | `{ nodes: WorkflowNodeInput[] }` |
| `DELETE` | `/api/v1/workflows/[id]` | Delete workflow + cascade nodes | — |

All responses use the standard envelope: `{ success, data, error, meta }`.

---

## 6. Drag & Drop Model

```
DndContext (onDragEnd)
 ├─ [Canvas] SortableContext (verticalListSortingStrategy)
 │   ├─ SortableItem (WorkflowNode) × N
 │   └─ DragOverlay (ghost card while dragging)
 └─ [Right Panel] Draggable (PaletteBlock) × M
     └─ id format: "palette:<blockKey>"
```

**`onDragEnd` logic:**
```typescript
if (active.id.toString().startsWith("palette:")) {
  // Insert new node at `over.id` position (or end if no over)
  store.addNode(paletteBlocks[blockKey], insertPosition)
} else {
  // Reorder existing nodes
  store.reorderNodes(arrayMove(nodes, oldIndex, newIndex))
}
```

---

## 7. Palette Blocks (8 predefined)

| Key | Type | Arabic Label | Icon |
|-----|------|-------------|------|
| `trigger_plan_approved` | trigger | بداية عند اعتماد الخطة | `PlayCircle` |
| `trigger_trainee_enrolled` | trigger | بداية عند تسجيل متدرب جديد | `UserPlus` |
| `action_update_schedules` | action | تحديث جداول المتدربين | `Calendar` |
| `action_notify_all` | action | إشعار المتدربين والمدربين | `Bell` |
| `action_generate_report` | action | توليد تقرير أداء | `FileText` |
| `action_update_attendance` | action | تحديث سجلات الحضور | `ClipboardList` |
| `action_alert_dean` | action | إرسال تنبيه للعميد | `AlertCircle` |
| `condition_attendance` | condition | شرط: نسبة الحضور < 75% | `GitBranch` |

---

## 8. Visual Design

Consistent with existing **Brutalist Signal** system (`--bs-*` tokens):

| Element | Style |
|---------|-------|
| Modal overlay | `bg-[#F0EDE8]` (Concrete) — canvas as physical workspace |
| Dotted grid | `radial-gradient(circle, rgba(28,28,30,0.12) 1px, transparent 1px)` 24px spacing |
| Node card | `bg-white rounded-2xl shadow-sm border border-black/6` + left-border stripe by type |
| Trigger node stripe | `border-l-4 border-[var(--bs-signal)]` (Signal red) |
| Action node stripe | `border-l-4 border-[var(--bs-steel)]` (Steel) |
| Condition node stripe | `border-l-4 border-amber-400` |
| Connector line | `w-px h-8 bg-black/12 mx-auto` |
| Right panel | `bg-white` with `h-px bg-black/8` divider |
| Sidebar | `bg-[var(--bs-steel)]` with white icons |
| Save button | `bg-[var(--bs-signal)] text-white` pill |

---

## 9. Role Navigation Config

```typescript
const roleNavigation: Record<string, NavItem[]> = {
  admin:   [dashboard, programs, reports, workflows*, settings],
  dean:    [dashboard, departments, reports, workflows*, quality],
  qa:      [dashboard, audits, kpis, reports],
  trainer: [dashboard, schedules, attendance, grades],
  trainee: [dashboard, courses, schedule, grades],
}
// * = highlighted as active on workflow builder page
```

---

## 10. Success Criteria

- [ ] Modal opens/closes smoothly from sidebar nav item
- [ ] Nodes from palette can be dragged onto canvas and inserted
- [ ] Existing nodes can be reordered by drag
- [ ] Workflow name is inline-editable in top bar
- [ ] Save button persists nodes to DB via PUT endpoint
- [ ] Role-aware sidebar shows correct nav items
- [ ] RTL layout works correctly (sidebar on right visually, panel on left visually)
- [ ] No TypeScript errors, no console errors
