# Workflow Builder — Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Build a full-screen modal Workflow Builder for سهيل that lets college admins drag-and-drop automation steps onto a visual canvas and save them to PostgreSQL.

**Architecture:** Portal-rendered `position:fixed` modal over the existing dashboard. Vertical sortable canvas powered by `@dnd-kit/sortable`. Zustand store holds in-flight state; explicit Save button calls `PUT /api/v1/workflows/[id]/nodes`.

**Tech Stack:** Next.js 16 App Router · Tailwind CSS v4 · `@dnd-kit/core` + `@dnd-kit/sortable` · Zustand 5 · Prisma 7 · PostgreSQL

**Design doc:** `docs/plans/2026-02-25-workflow-builder-design.md`

---

## Task 1: Install @dnd-kit dependencies

**Files:**
- Modify: `package.json` (via npm install)

**Step 1: Install packages**

```bash
cd /Users/hossam/Documents/saohil1
npm install @dnd-kit/core @dnd-kit/sortable @dnd-kit/utilities
```

**Step 2: Verify install**

```bash
cat package.json | grep dnd-kit
```
Expected output: three `@dnd-kit/*` entries in dependencies.

**Step 3: Commit**

```bash
git add package.json package-lock.json
git commit -m "deps: install @dnd-kit/core, sortable, utilities"
```

---

## Task 2: Add Workflow + WorkflowNode to Prisma schema

**Files:**
- Modify: `prisma/schema.prisma` — append after the `// ============== MARKETING MODELS ==============` section, before `// ============== NOTIFICATION & AUDIT MODELS ==============`

**Step 1: Add models to schema.prisma**

Append this block after the `Lead` model (before the Notification section):

```prisma
// ============== WORKFLOW MODELS ==============

model Workflow {
  id          String   @id @default(cuid())
  name        String
  description String?
  status      String   @default("draft")  // draft | active | archived
  role        String?
  schedule    String?
  createdById String
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  nodes WorkflowNode[]

  @@index([createdById])
  @@index([status])
  @@map("workflows")
}

model WorkflowNode {
  id          String   @id @default(cuid())
  workflowId  String
  type        String   // trigger | action | condition
  title       String
  description String?
  position    Int
  config      Json     @default("{}")
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  workflow Workflow @relation(fields: [workflowId], references: [id], onDelete: Cascade)

  @@index([workflowId])
  @@map("workflow_nodes")
}
```

**Step 2: Generate Prisma client (no migration needed yet — DB may not be connected)**

```bash
cd /Users/hossam/Documents/saohil1
npx prisma generate
```
Expected: `✔ Generated Prisma Client`

**Step 3: Verify TypeScript types**

```bash
npx tsc --noEmit 2>&1 | head -20
```
Expected: no errors related to `prisma.workflow` or `prisma.workflowNode`.

**Step 4: Commit**

```bash
git add prisma/schema.prisma
git commit -m "feat(db): add Workflow and WorkflowNode prisma models"
```

---

## Task 3: Create shared TypeScript types

**Files:**
- Create: `src/components/workflows/workflow-types.ts`

**Step 1: Create the types file**

```typescript
// src/components/workflows/workflow-types.ts

export type WorkflowNodeType = "trigger" | "action" | "condition";
export type WorkflowStatus = "draft" | "active" | "archived";

/** A node as it exists in the database */
export interface WorkflowNodeRecord {
  id: string;
  workflowId: string;
  type: WorkflowNodeType;
  title: string;
  description?: string | null;
  position: number;
  config: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}

/** A workflow record from the DB (with nodes) */
export interface WorkflowRecord {
  id: string;
  name: string;
  description?: string | null;
  status: WorkflowStatus;
  role?: string | null;
  schedule?: string | null;
  createdById: string;
  createdAt: string;
  updatedAt: string;
  nodes: WorkflowNodeRecord[];
}

/** In-flight node (may not yet be saved — no DB id required) */
export interface WorkflowNodeDraft {
  draftId: string;       // local UUID, replaced by DB id after save
  type: WorkflowNodeType;
  title: string;
  description?: string;
  config: Record<string, unknown>;
}

/** A block in the right-panel palette */
export interface PaletteBlock {
  key: string;           // e.g. "trigger_plan_approved"
  type: WorkflowNodeType;
  title: string;         // Arabic label
  description?: string;
  iconName: string;      // Lucide icon name
}

/** Draggable ID helpers */
export const toPaletteId = (key: string) => `palette:${key}` as const;
export const isPaletteId = (id: string) => id.startsWith("palette:");
export const paletteKeyFrom = (id: string) => id.replace("palette:", "");
```

**Step 2: Verify no TypeScript errors**

```bash
cd /Users/hossam/Documents/saohil1
npx tsc --noEmit 2>&1 | grep workflow-types
```
Expected: no output (no errors).

**Step 3: Commit**

```bash
git add src/components/workflows/workflow-types.ts
git commit -m "feat(workflows): add shared TypeScript types"
```

---

## Task 4: Create Zustand workflow store

**Files:**
- Create: `src/stores/workflow-store.ts`

**Step 1: Create the store**

```typescript
// src/stores/workflow-store.ts
import { create } from "zustand";
import { arrayMove } from "@dnd-kit/sortable";
import type { WorkflowNodeDraft, WorkflowRecord, WorkflowStatus } from "@/components/workflows/workflow-types";

interface WorkflowMeta {
  id: string | null;         // null = not yet persisted
  name: string;
  description: string;
  status: WorkflowStatus;
  role: string;
  schedule: string;
}

interface WorkflowStore {
  // State
  isOpen: boolean;
  isDirty: boolean;
  isSaving: boolean;
  meta: WorkflowMeta;
  nodes: WorkflowNodeDraft[];

  // Actions
  openBuilder: (workflow?: WorkflowRecord) => void;
  closeBuilder: () => void;
  updateMeta: (patch: Partial<WorkflowMeta>) => void;
  addNode: (node: Omit<WorkflowNodeDraft, "draftId">, atIndex?: number) => void;
  removeNode: (draftId: string) => void;
  reorderNodes: (newOrder: WorkflowNodeDraft[]) => void;
  setNodes: (nodes: WorkflowNodeDraft[]) => void;
  setSaving: (v: boolean) => void;
  markClean: () => void;
}

const DEFAULT_META: WorkflowMeta = {
  id: null,
  name: "سير عمل جديد",
  description: "",
  status: "draft",
  role: "",
  schedule: "",
};

export const useWorkflowStore = create<WorkflowStore>((set) => ({
  isOpen: false,
  isDirty: false,
  isSaving: false,
  meta: DEFAULT_META,
  nodes: [],

  openBuilder: (workflow) =>
    set({
      isOpen: true,
      isDirty: false,
      meta: workflow
        ? {
            id: workflow.id,
            name: workflow.name,
            description: workflow.description ?? "",
            status: workflow.status,
            role: workflow.role ?? "",
            schedule: workflow.schedule ?? "",
          }
        : DEFAULT_META,
      nodes: workflow
        ? workflow.nodes.map((n) => ({
            draftId: n.id,
            type: n.type as WorkflowNodeDraft["type"],
            title: n.title,
            description: n.description ?? undefined,
            config: n.config as Record<string, unknown>,
          }))
        : [],
    }),

  closeBuilder: () =>
    set({ isOpen: false, nodes: [], meta: DEFAULT_META, isDirty: false }),

  updateMeta: (patch) =>
    set((s) => ({ meta: { ...s.meta, ...patch }, isDirty: true })),

  addNode: (node, atIndex) =>
    set((s) => {
      const newNode: WorkflowNodeDraft = {
        ...node,
        draftId: crypto.randomUUID(),
      };
      const nodes = [...s.nodes];
      if (atIndex !== undefined) {
        nodes.splice(atIndex, 0, newNode);
      } else {
        nodes.push(newNode);
      }
      return { nodes, isDirty: true };
    }),

  removeNode: (draftId) =>
    set((s) => ({
      nodes: s.nodes.filter((n) => n.draftId !== draftId),
      isDirty: true,
    })),

  reorderNodes: (newOrder) =>
    set({ nodes: newOrder, isDirty: true }),

  setNodes: (nodes) => set({ nodes }),

  setSaving: (v) => set({ isSaving: v }),

  markClean: () => set({ isDirty: false }),
}));
```

**Step 2: Verify no TypeScript errors**

```bash
npx tsc --noEmit 2>&1 | grep workflow-store
```
Expected: no output.

**Step 3: Commit**

```bash
git add src/stores/workflow-store.ts
git commit -m "feat(workflows): add useWorkflowStore Zustand store"
```

---

## Task 5: Define palette blocks data

**Files:**
- Create: `src/components/workflows/palette-blocks-data.ts`

**Step 1: Create the palette data file**

```typescript
// src/components/workflows/palette-blocks-data.ts
import type { PaletteBlock } from "./workflow-types";

export const PALETTE_BLOCKS: PaletteBlock[] = [
  {
    key: "trigger_plan_approved",
    type: "trigger",
    title: "بداية عند اعتماد الخطة",
    description: "يُطلق سير العمل عند اعتماد خطة الفصل التدريبي",
    iconName: "PlayCircle",
  },
  {
    key: "trigger_trainee_enrolled",
    type: "trigger",
    title: "بداية عند تسجيل متدرب",
    description: "يُطلق عند تسجيل متدرب جديد في البرنامج",
    iconName: "UserPlus",
  },
  {
    key: "action_update_schedules",
    type: "action",
    title: "تحديث جداول المتدربين",
    description: "إنشاء وربط الجداول بالبرامج والشعب",
    iconName: "Calendar",
  },
  {
    key: "action_notify_all",
    type: "action",
    title: "إشعار المتدربين والمدربين",
    description: "إرسال رسالة + بريد إلكتروني لجميع المعنيين",
    iconName: "Bell",
  },
  {
    key: "action_generate_report",
    type: "action",
    title: "توليد تقرير أداء",
    description: "إنشاء تقرير أداء تلقائي وإرساله للعميد",
    iconName: "FileText",
  },
  {
    key: "action_update_attendance",
    type: "action",
    title: "تحديث سجلات الحضور",
    description: "مزامنة سجلات الحضور مع الجداول المحدّثة",
    iconName: "ClipboardList",
  },
  {
    key: "action_alert_dean",
    type: "action",
    title: "إرسال تنبيه للعميد",
    description: "تنبيه فوري للعميد عند وجود حالة استثنائية",
    iconName: "AlertCircle",
  },
  {
    key: "condition_attendance",
    type: "condition",
    title: "شرط: نسبة الحضور < 75%",
    description: "تحقق من نسبة الحضور وتفرّع بناءً على النتيجة",
    iconName: "GitBranch",
  },
];

export const paletteBlockByKey = Object.fromEntries(
  PALETTE_BLOCKS.map((b) => [b.key, b])
) as Record<string, PaletteBlock>;
```

**Step 2: Commit**

```bash
git add src/components/workflows/palette-blocks-data.ts
git commit -m "feat(workflows): add palette blocks data"
```

---

## Task 6: Create API route — POST + GET /api/v1/workflows

**Files:**
- Create: `src/app/api/v1/workflows/route.ts`

**Step 1: Create the route**

```typescript
// src/app/api/v1/workflows/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

function envelope(success: boolean, data: unknown, error: unknown, requestId: string, start: number) {
  return NextResponse.json(
    { success, data, error, meta: { requestId, durationMs: Date.now() - start } },
    { status: success ? 200 : 400 }
  );
}

export async function POST(req: NextRequest) {
  const start = Date.now();
  const requestId = crypto.randomUUID();
  try {
    const body = await req.json();
    const { name, description, role, createdById } = body as {
      name: string;
      description?: string;
      role?: string;
      createdById: string;
    };
    if (!name || !createdById) {
      return NextResponse.json(
        { success: false, data: null, error: { code: "MISSING_FIELDS", message: "name and createdById required" }, meta: { requestId, durationMs: Date.now() - start } },
        { status: 400 }
      );
    }
    const workflow = await prisma.workflow.create({
      data: { name, description: description ?? null, role: role ?? null, createdById },
      include: { nodes: { orderBy: { position: "asc" } } },
    });
    return NextResponse.json(
      { success: true, data: workflow, error: null, meta: { requestId, durationMs: Date.now() - start } },
      { status: 201 }
    );
  } catch (err) {
    console.error("[workflows POST]", err);
    return NextResponse.json(
      { success: false, data: null, error: { code: "INTERNAL", message: "Internal server error" }, meta: { requestId, durationMs: Date.now() - start } },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  const start = Date.now();
  const requestId = crypto.randomUUID();
  try {
    const { searchParams } = new URL(req.url);
    const page = Math.max(1, Number(searchParams.get("page") ?? "1"));
    const limit = Math.min(50, Math.max(1, Number(searchParams.get("limit") ?? "20")));
    const skip = (page - 1) * limit;

    const [workflows, total] = await Promise.all([
      prisma.workflow.findMany({
        skip,
        take: limit,
        orderBy: { updatedAt: "desc" },
        include: { nodes: { orderBy: { position: "asc" } } },
      }),
      prisma.workflow.count(),
    ]);
    return NextResponse.json({
      success: true,
      data: { workflows, total, page, limit },
      error: null,
      meta: { requestId, durationMs: Date.now() - start },
    });
  } catch (err) {
    console.error("[workflows GET]", err);
    return NextResponse.json(
      { success: false, data: null, error: { code: "INTERNAL", message: "Internal server error" }, meta: { requestId, durationMs: Date.now() - start } },
      { status: 500 }
    );
  }
}
```

**Step 2: Commit**

```bash
git add src/app/api/v1/workflows/route.ts
git commit -m "feat(api): add POST+GET /api/v1/workflows"
```

---

## Task 7: Create API routes — GET + PATCH + DELETE /api/v1/workflows/[id]

**Files:**
- Create: `src/app/api/v1/workflows/[id]/route.ts`

**Step 1: Create the file**

```typescript
// src/app/api/v1/workflows/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

type Ctx = { params: Promise<{ id: string }> };

export async function GET(_req: NextRequest, { params }: Ctx) {
  const start = Date.now();
  const requestId = crypto.randomUUID();
  const { id } = await params;
  try {
    const workflow = await prisma.workflow.findUnique({
      where: { id },
      include: { nodes: { orderBy: { position: "asc" } } },
    });
    if (!workflow) {
      return NextResponse.json(
        { success: false, data: null, error: { code: "NOT_FOUND", message: "Workflow not found" }, meta: { requestId, durationMs: Date.now() - start } },
        { status: 404 }
      );
    }
    return NextResponse.json({ success: true, data: workflow, error: null, meta: { requestId, durationMs: Date.now() - start } });
  } catch (err) {
    console.error("[workflows/[id] GET]", err);
    return NextResponse.json({ success: false, data: null, error: { code: "INTERNAL", message: "Internal server error" }, meta: { requestId, durationMs: Date.now() - start } }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest, { params }: Ctx) {
  const start = Date.now();
  const requestId = crypto.randomUUID();
  const { id } = await params;
  try {
    const body = await req.json();
    const { name, description, status, role, schedule } = body as {
      name?: string; description?: string; status?: string; role?: string; schedule?: string;
    };
    const workflow = await prisma.workflow.update({
      where: { id },
      data: {
        ...(name !== undefined && { name }),
        ...(description !== undefined && { description }),
        ...(status !== undefined && { status }),
        ...(role !== undefined && { role }),
        ...(schedule !== undefined && { schedule }),
      },
      include: { nodes: { orderBy: { position: "asc" } } },
    });
    return NextResponse.json({ success: true, data: workflow, error: null, meta: { requestId, durationMs: Date.now() - start } });
  } catch (err) {
    console.error("[workflows/[id] PATCH]", err);
    return NextResponse.json({ success: false, data: null, error: { code: "INTERNAL", message: "Internal server error" }, meta: { requestId, durationMs: Date.now() - start } }, { status: 500 });
  }
}

export async function DELETE(_req: NextRequest, { params }: Ctx) {
  const start = Date.now();
  const requestId = crypto.randomUUID();
  const { id } = await params;
  try {
    await prisma.workflow.delete({ where: { id } });
    return NextResponse.json({ success: true, data: { deleted: true }, error: null, meta: { requestId, durationMs: Date.now() - start } });
  } catch (err) {
    console.error("[workflows/[id] DELETE]", err);
    return NextResponse.json({ success: false, data: null, error: { code: "INTERNAL", message: "Internal server error" }, meta: { requestId, durationMs: Date.now() - start } }, { status: 500 });
  }
}
```

**Step 2: Commit**

```bash
git add "src/app/api/v1/workflows/[id]/route.ts"
git commit -m "feat(api): add GET+PATCH+DELETE /api/v1/workflows/[id]"
```

---

## Task 8: Create API route — PUT /api/v1/workflows/[id]/nodes

**Files:**
- Create: `src/app/api/v1/workflows/[id]/nodes/route.ts`

**Step 1: Create the nodes save route**

```typescript
// src/app/api/v1/workflows/[id]/nodes/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

type Ctx = { params: Promise<{ id: string }> };
interface NodeInput {
  type: string;
  title: string;
  description?: string;
  position: number;
  config?: Record<string, unknown>;
}

export async function PUT(req: NextRequest, { params }: Ctx) {
  const start = Date.now();
  const requestId = crypto.randomUUID();
  const { id } = await params;
  try {
    const body = await req.json();
    const { nodes } = body as { nodes: NodeInput[] };

    if (!Array.isArray(nodes)) {
      return NextResponse.json(
        { success: false, data: null, error: { code: "INVALID_BODY", message: "nodes array required" }, meta: { requestId, durationMs: Date.now() - start } },
        { status: 400 }
      );
    }

    // Verify workflow exists
    const workflow = await prisma.workflow.findUnique({ where: { id } });
    if (!workflow) {
      return NextResponse.json(
        { success: false, data: null, error: { code: "NOT_FOUND", message: "Workflow not found" }, meta: { requestId, durationMs: Date.now() - start } },
        { status: 404 }
      );
    }

    // Atomic replace: delete all existing nodes, then create new
    await prisma.$transaction([
      prisma.workflowNode.deleteMany({ where: { workflowId: id } }),
      prisma.workflowNode.createMany({
        data: nodes.map((n, i) => ({
          workflowId: id,
          type: n.type,
          title: n.title,
          description: n.description ?? null,
          position: n.position ?? i,
          config: n.config ?? {},
        })),
      }),
    ]);

    const updated = await prisma.workflow.findUnique({
      where: { id },
      include: { nodes: { orderBy: { position: "asc" } } },
    });
    return NextResponse.json({ success: true, data: updated, error: null, meta: { requestId, durationMs: Date.now() - start } });
  } catch (err) {
    console.error("[workflows/[id]/nodes PUT]", err);
    return NextResponse.json({ success: false, data: null, error: { code: "INTERNAL", message: "Internal server error" }, meta: { requestId, durationMs: Date.now() - start } }, { status: 500 });
  }
}
```

**Step 2: TypeScript check**

```bash
npx tsc --noEmit 2>&1 | grep -i "workflow\|route"
```
Expected: no errors.

**Step 3: Commit**

```bash
git add "src/app/api/v1/workflows/[id]/nodes/route.ts"
git commit -m "feat(api): add PUT /api/v1/workflows/[id]/nodes (atomic replace)"
```

---

## Task 9: Build leaf UI components

### 9a: workflow-connector.tsx

**Files:**
- Create: `src/components/workflows/workflow-connector.tsx`

```typescript
// src/components/workflows/workflow-connector.tsx
export function WorkflowConnector() {
  return (
    <div className="flex justify-center py-1" aria-hidden>
      <div className="w-px h-8 rounded-full" style={{ background: "rgba(28,28,30,0.15)" }} />
    </div>
  );
}
```

---

### 9b: workflow-node.tsx

**Files:**
- Create: `src/components/workflows/workflow-node.tsx`

```typescript
// src/components/workflows/workflow-node.tsx
"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical, X, PlayCircle, Calendar, Bell, FileText, ClipboardList, AlertCircle, GitBranch, UserPlus } from "lucide-react";
import type { WorkflowNodeDraft, WorkflowNodeType } from "./workflow-types";
import { useWorkflowStore } from "@/stores/workflow-store";

const ICON_MAP: Record<string, React.ElementType> = {
  PlayCircle, Calendar, Bell, FileText, ClipboardList, AlertCircle, GitBranch, UserPlus,
};

const TYPE_STYLES: Record<WorkflowNodeType, { stripe: string; badge: string; label: string }> = {
  trigger: { stripe: "border-l-4 border-[var(--bs-signal)]", badge: "bg-red-50 text-[var(--bs-signal)]", label: "بدء" },
  action:  { stripe: "border-l-4 border-[var(--bs-steel)]",  badge: "bg-slate-100 text-[var(--bs-steel)]",  label: "خطوة" },
  condition: { stripe: "border-l-4 border-amber-400", badge: "bg-amber-50 text-amber-600", label: "شرط" },
};

interface WorkflowNodeProps {
  node: WorkflowNodeDraft;
  iconName?: string;
}

export function WorkflowNode({ node, iconName }: WorkflowNodeProps) {
  const removeNode = useWorkflowStore((s) => s.removeNode);
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: node.draftId });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
  };

  const typeStyle = TYPE_STYLES[node.type];
  const Icon = iconName ? (ICON_MAP[iconName] ?? FileText) : FileText;

  return (
    <div ref={setNodeRef} style={style} className="group relative">
      <div
        className={`flex items-center gap-4 rounded-2xl bg-white p-4 shadow-sm ${typeStyle.stripe}`}
        style={{ border: "1px solid rgba(28,28,30,0.08)" }}
      >
        {/* Drag handle */}
        <button
          {...attributes}
          {...listeners}
          className="cursor-grab touch-none text-black/20 transition-colors hover:text-black/40 active:cursor-grabbing"
          aria-label="سحب لإعادة الترتيب"
        >
          <GripVertical size={18} />
        </button>

        {/* Icon */}
        <div
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl"
          style={{ background: "rgba(28,28,30,0.04)" }}
        >
          <Icon size={18} style={{ color: "var(--bs-steel)" }} />
        </div>

        {/* Content */}
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold leading-tight" style={{ color: "var(--bs-steel)" }}>
            {node.title}
          </p>
          {node.description && (
            <p className="mt-0.5 truncate text-xs" style={{ color: "var(--bs-muted)" }}>
              {node.description}
            </p>
          )}
        </div>

        {/* Type badge */}
        <span className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-medium ${typeStyle.badge}`}>
          {typeStyle.label}
        </span>

        {/* Remove */}
        <button
          onClick={() => removeNode(node.draftId)}
          className="shrink-0 rounded-lg p-1 text-black/25 transition-colors hover:bg-red-50 hover:text-red-500"
          aria-label="حذف الخطوة"
        >
          <X size={14} />
        </button>
      </div>
    </div>
  );
}
```

**Step: Commit 9a + 9b together**

```bash
git add src/components/workflows/workflow-connector.tsx src/components/workflows/workflow-node.tsx
git commit -m "feat(workflows): add WorkflowConnector and WorkflowNode components"
```

---

## Task 10: Build palette-block.tsx

**Files:**
- Create: `src/components/workflows/palette-block.tsx`

```typescript
// src/components/workflows/palette-block.tsx
"use client";

import { useDraggable } from "@dnd-kit/core";
import { PlayCircle, Calendar, Bell, FileText, ClipboardList, AlertCircle, GitBranch, UserPlus } from "lucide-react";
import type { PaletteBlock, WorkflowNodeType } from "./workflow-types";
import { toPaletteId } from "./workflow-types";

const ICON_MAP: Record<string, React.ElementType> = {
  PlayCircle, Calendar, Bell, FileText, ClipboardList, AlertCircle, GitBranch, UserPlus,
};

const TYPE_COLOR: Record<WorkflowNodeType, string> = {
  trigger: "var(--bs-signal)",
  action: "var(--bs-steel)",
  condition: "#d97706",
};

interface PaletteBlockProps {
  block: PaletteBlock;
}

export function PaletteBlockCard({ block }: PaletteBlockProps) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: toPaletteId(block.key),
    data: { block },
  });

  const Icon = ICON_MAP[block.iconName] ?? FileText;

  return (
    <div
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      className="cursor-grab touch-none select-none rounded-xl p-3 transition-all active:cursor-grabbing"
      style={{
        background: isDragging ? "rgba(28,28,30,0.06)" : "rgba(28,28,30,0.03)",
        border: "1px solid rgba(28,28,30,0.08)",
        opacity: isDragging ? 0.5 : 1,
      }}
    >
      <div className="flex items-center gap-2.5">
        <Icon size={14} style={{ color: TYPE_COLOR[block.type], flexShrink: 0 }} />
        <p className="text-xs font-medium leading-tight" style={{ color: "var(--bs-steel)" }}>
          {block.title}
        </p>
      </div>
    </div>
  );
}
```

**Step: Commit**

```bash
git add src/components/workflows/palette-block.tsx
git commit -m "feat(workflows): add PaletteBlockCard draggable component"
```

---

## Task 11: Build workflow-canvas.tsx

**Files:**
- Create: `src/components/workflows/workflow-canvas.tsx`

```typescript
// src/components/workflows/workflow-canvas.tsx
"use client";

import {
  DndContext,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragStartEvent,
} from "@dnd-kit/core";
import { SortableContext, arrayMove, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { Plus } from "lucide-react";
import { useState } from "react";
import { useWorkflowStore } from "@/stores/workflow-store";
import { isPaletteId, paletteKeyFrom } from "./workflow-types";
import { paletteBlockByKey } from "./palette-blocks-data";
import { WorkflowNode } from "./workflow-node";
import { WorkflowConnector } from "./workflow-connector";

export function WorkflowCanvas() {
  const { nodes, addNode, reorderNodes } = useWorkflowStore((s) => ({
    nodes: s.nodes,
    addNode: s.addNode,
    reorderNodes: s.reorderNodes,
  }));

  const [activeDragId, setActiveDragId] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } })
  );

  const handleDragStart = ({ active }: DragStartEvent) => {
    setActiveDragId(active.id.toString());
  };

  const handleDragEnd = ({ active, over }: DragEndEvent) => {
    setActiveDragId(null);
    if (!over) return;

    const activeId = active.id.toString();
    const overId = over.id.toString();

    if (isPaletteId(activeId)) {
      // Insert new node from palette
      const key = paletteKeyFrom(activeId);
      const block = paletteBlockByKey[key];
      if (!block) return;
      const overIndex = nodes.findIndex((n) => n.draftId === overId);
      addNode({ type: block.type, title: block.title, description: block.description, config: {} }, overIndex >= 0 ? overIndex : undefined);
    } else {
      // Reorder existing nodes
      const oldIndex = nodes.findIndex((n) => n.draftId === activeId);
      const newIndex = nodes.findIndex((n) => n.draftId === overId);
      if (oldIndex !== -1 && newIndex !== -1 && oldIndex !== newIndex) {
        reorderNodes(arrayMove(nodes, oldIndex, newIndex));
      }
    }
  };

  const activePaletteBlock = activeDragId && isPaletteId(activeDragId)
    ? paletteBlockByKey[paletteKeyFrom(activeDragId)]
    : null;

  return (
    <DndContext sensors={sensors} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
      {/* Canvas area with dotted grid */}
      <div
        className="flex-1 overflow-y-auto p-8"
        style={{
          backgroundImage: "radial-gradient(circle, rgba(28,28,30,0.12) 1px, transparent 1px)",
          backgroundSize: "24px 24px",
        }}
      >
        <div className="mx-auto max-w-xl">
          <SortableContext
            items={nodes.map((n) => n.draftId)}
            strategy={verticalListSortingStrategy}
          >
            {nodes.length === 0 ? (
              <div
                className="flex h-48 items-center justify-center rounded-3xl border-2 border-dashed text-sm"
                style={{ borderColor: "rgba(28,28,30,0.15)", color: "var(--bs-muted)" }}
              >
                اسحب كتلة من اللوحة الجانبية أو اضغط "+"
              </div>
            ) : (
              nodes.map((node, i) => (
                <div key={node.draftId}>
                  {i > 0 && <WorkflowConnector />}
                  <WorkflowNode
                    node={node}
                    iconName={
                      // find iconName from palette data by matching title
                      Object.values(paletteBlockByKey).find((b) => b.title === node.title)?.iconName
                    }
                  />
                </div>
              ))
            )}
          </SortableContext>

          {/* Add step button */}
          <div className="mt-6 flex justify-center">
            <button
              onClick={() => addNode({ type: "action", title: "خطوة جديدة", config: {} })}
              className="flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-all hover:scale-105"
              style={{
                background: "rgba(28,28,30,0.06)",
                border: "1px solid rgba(28,28,30,0.1)",
                color: "var(--bs-muted)",
              }}
            >
              <Plus size={14} />
              أضف خطوة
            </button>
          </div>
        </div>
      </div>

      {/* Drag overlay ghost */}
      <DragOverlay>
        {activePaletteBlock && (
          <div
            className="rounded-xl px-3 py-2 text-xs font-medium shadow-lg"
            style={{ background: "var(--bs-steel)", color: "#fff" }}
          >
            {activePaletteBlock.title}
          </div>
        )}
      </DragOverlay>
    </DndContext>
  );
}
```

**Step: Commit**

```bash
git add src/components/workflows/workflow-canvas.tsx
git commit -m "feat(workflows): add WorkflowCanvas with DnD context"
```

---

## Task 12: Build workflow-right-panel.tsx

**Files:**
- Create: `src/components/workflows/workflow-right-panel.tsx`

```typescript
// src/components/workflows/workflow-right-panel.tsx
"use client";

import { useWorkflowStore } from "@/stores/workflow-store";
import { PALETTE_BLOCKS } from "./palette-blocks-data";
import { PaletteBlockCard } from "./palette-block";

const ROLES = [
  { value: "admin",   label: "مسؤول النظام" },
  { value: "dean",    label: "العميد" },
  { value: "qa",      label: "مسؤول الجودة" },
  { value: "trainer", label: "المدرب" },
];

export function WorkflowRightPanel() {
  const { meta, updateMeta } = useWorkflowStore((s) => ({ meta: s.meta, updateMeta: s.updateMeta }));

  return (
    <aside
      className="flex w-72 shrink-0 flex-col overflow-y-auto"
      style={{ background: "#fff", borderInlineStart: "1px solid rgba(28,28,30,0.08)" }}
    >
      {/* Settings */}
      <div className="p-5">
        <p className="mb-3 text-xs font-semibold uppercase tracking-widest" style={{ color: "var(--bs-signal)", fontFamily: "var(--bs-mono)" }}>
          // الإعدادات
        </p>
        <div className="space-y-3">
          <div>
            <label className="mb-1 block text-xs font-medium" style={{ color: "var(--bs-muted)" }}>
              الوصف
            </label>
            <textarea
              rows={2}
              value={meta.description}
              onChange={(e) => updateMeta({ description: e.target.value })}
              className="w-full resize-none rounded-xl px-3 py-2 text-sm outline-none transition-all"
              style={{ border: "1px solid rgba(28,28,30,0.1)", background: "rgba(28,28,30,0.02)", color: "var(--bs-steel)" }}
              placeholder="وصف اختياري..."
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium" style={{ color: "var(--bs-muted)" }}>
              الدور المسؤول
            </label>
            <select
              value={meta.role}
              onChange={(e) => updateMeta({ role: e.target.value })}
              className="w-full rounded-xl px-3 py-2 text-sm outline-none"
              style={{ border: "1px solid rgba(28,28,30,0.1)", background: "rgba(28,28,30,0.02)", color: "var(--bs-steel)" }}
            >
              <option value="">اختر الدور</option>
              {ROLES.map((r) => (
                <option key={r.value} value={r.value}>{r.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium" style={{ color: "var(--bs-muted)" }}>
              وقت التفعيل
            </label>
            <input
              type="text"
              value={meta.schedule}
              onChange={(e) => updateMeta({ schedule: e.target.value })}
              className="w-full rounded-xl px-3 py-2 text-sm outline-none"
              style={{ border: "1px solid rgba(28,28,30,0.1)", background: "rgba(28,28,30,0.02)", color: "var(--bs-steel)" }}
              placeholder="مثال: يومياً الساعة 8 صباحاً"
            />
          </div>
        </div>
      </div>

      {/* Divider */}
      <div style={{ height: "1px", background: "rgba(28,28,30,0.08)", margin: "0 20px" }} />

      {/* Palette */}
      <div className="flex-1 p-5">
        <p className="mb-3 text-xs font-semibold uppercase tracking-widest" style={{ color: "var(--bs-signal)", fontFamily: "var(--bs-mono)" }}>
          // كتل الإضافة
        </p>
        <div className="space-y-2">
          {PALETTE_BLOCKS.map((block) => (
            <PaletteBlockCard key={block.key} block={block} />
          ))}
        </div>
      </div>
    </aside>
  );
}
```

**Step: Commit**

```bash
git add src/components/workflows/workflow-right-panel.tsx
git commit -m "feat(workflows): add WorkflowRightPanel (settings + palette)"
```

---

## Task 13: Build workflow-top-bar.tsx

**Files:**
- Create: `src/components/workflows/workflow-top-bar.tsx`

```typescript
// src/components/workflows/workflow-top-bar.tsx
"use client";

import { Save, X, Zap, Edit2 } from "lucide-react";
import { useState } from "react";
import { useWorkflowStore } from "@/stores/workflow-store";

interface WorkflowTopBarProps {
  onSave: () => Promise<void>;
}

export function WorkflowTopBar({ onSave }: WorkflowTopBarProps) {
  const { meta, updateMeta, closeBuilder, isDirty, isSaving } = useWorkflowStore((s) => ({
    meta: s.meta,
    updateMeta: s.updateMeta,
    closeBuilder: s.closeBuilder,
    isDirty: s.isDirty,
    isSaving: s.isSaving,
  }));
  const [editingName, setEditingName] = useState(false);

  return (
    <header
      className="flex h-14 shrink-0 items-center gap-4 px-5"
      style={{ borderBottom: "1px solid rgba(28,28,30,0.08)", background: "#fff" }}
    >
      {/* Editable title */}
      <div className="flex flex-1 items-center gap-2 min-w-0">
        {editingName ? (
          <input
            autoFocus
            value={meta.name}
            onChange={(e) => updateMeta({ name: e.target.value })}
            onBlur={() => setEditingName(false)}
            onKeyDown={(e) => e.key === "Enter" && setEditingName(false)}
            className="flex-1 rounded-lg px-2 py-1 text-sm font-semibold outline-none"
            style={{ border: "1px solid var(--bs-signal)", color: "var(--bs-steel)", minWidth: 0 }}
          />
        ) : (
          <button
            onClick={() => setEditingName(true)}
            className="group flex items-center gap-1.5 min-w-0"
          >
            <span className="truncate text-sm font-semibold" style={{ color: "var(--bs-steel)" }}>
              {meta.name}
            </span>
            <Edit2 size={12} className="shrink-0 opacity-0 transition-opacity group-hover:opacity-40" />
          </button>
        )}

        {isDirty && (
          <span className="shrink-0 rounded-full px-2 py-0.5 text-xs" style={{ background: "rgba(255,59,48,0.1)", color: "var(--bs-signal)" }}>
            غير محفوظ
          </span>
        )}
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2">
        <button
          onClick={onSave}
          disabled={isSaving || !isDirty}
          className="flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-semibold transition-all disabled:opacity-40"
          style={{ background: isDirty ? "var(--bs-signal)" : "rgba(28,28,30,0.06)", color: isDirty ? "#fff" : "var(--bs-muted)" }}
        >
          <Save size={12} />
          {isSaving ? "جاري الحفظ..." : "حفظ"}
        </button>
        <button
          className="flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-semibold transition-all hover:opacity-80"
          style={{ background: "rgba(28,28,30,0.06)", color: "var(--bs-steel)" }}
        >
          <Zap size={12} />
          إطلاق
        </button>
        <button
          onClick={closeBuilder}
          className="rounded-xl p-1.5 transition-all hover:bg-red-50 hover:text-red-500"
          style={{ color: "var(--bs-muted)" }}
          aria-label="إغلاق"
        >
          <X size={16} />
        </button>
      </div>
    </header>
  );
}
```

**Step: Commit**

```bash
git add src/components/workflows/workflow-top-bar.tsx
git commit -m "feat(workflows): add WorkflowTopBar with inline title editing"
```

---

## Task 14: Build workflow-sidebar.tsx

**Files:**
- Create: `src/components/workflows/workflow-sidebar.tsx`

```typescript
// src/components/workflows/workflow-sidebar.tsx
"use client";

import { LayoutDashboard, GraduationCap, BarChart3, Workflow, Settings, CheckSquare, BookOpen } from "lucide-react";

interface SidebarItem {
  label: string;
  icon: React.ElementType;
  active?: boolean;
}

const NAV_BY_ROLE: Record<string, SidebarItem[]> = {
  admin: [
    { label: "لوحة التحكم", icon: LayoutDashboard },
    { label: "البرامج والشعب", icon: BookOpen },
    { label: "تقارير الأداء", icon: BarChart3 },
    { label: "سير العمل الآلي", icon: Workflow, active: true },
    { label: "الإعدادات", icon: Settings },
  ],
  dean: [
    { label: "لوحة التحكم", icon: LayoutDashboard },
    { label: "الأقسام", icon: BookOpen },
    { label: "تقارير الأداء", icon: BarChart3 },
    { label: "سير العمل الآلي", icon: Workflow, active: true },
  ],
  qa: [
    { label: "لوحة التحكم", icon: LayoutDashboard },
    { label: "مؤشرات الجودة", icon: CheckSquare },
    { label: "التقارير", icon: BarChart3 },
  ],
  trainer: [
    { label: "لوحة التحكم", icon: LayoutDashboard },
    { label: "الجداول", icon: BookOpen },
    { label: "المتدربون", icon: GraduationCap },
  ],
  trainee: [
    { label: "لوحة التحكم", icon: LayoutDashboard },
    { label: "المقررات", icon: BookOpen },
    { label: "جدولي", icon: CheckSquare },
  ],
};

interface WorkflowSidebarProps {
  role?: string;
}

export function WorkflowSidebar({ role = "admin" }: WorkflowSidebarProps) {
  const items = NAV_BY_ROLE[role] ?? NAV_BY_ROLE.admin;

  return (
    <aside
      className="flex w-16 shrink-0 flex-col items-center gap-1 py-4"
      style={{ background: "var(--bs-steel)", borderInlineEnd: "1px solid rgba(255,255,255,0.06)" }}
    >
      {/* Logo mark */}
      <div
        className="mb-3 flex h-9 w-9 items-center justify-center rounded-xl text-base font-extrabold"
        style={{ background: "var(--bs-signal)", color: "#fff", fontFamily: "var(--bs-grotesk)" }}
      >
        س
      </div>

      {/* Nav items */}
      {items.map((item) => {
        const Icon = item.icon;
        return (
          <button
            key={item.label}
            title={item.label}
            className="group relative flex h-10 w-10 items-center justify-center rounded-xl transition-all"
            style={{
              background: item.active ? "rgba(255,255,255,0.12)" : "transparent",
              color: item.active ? "#fff" : "rgba(255,255,255,0.4)",
            }}
          >
            <Icon size={18} />
            {item.active && (
              <span
                className="absolute start-0 top-1/2 h-4 w-0.5 -translate-y-1/2 rounded-full"
                style={{ background: "var(--bs-signal)" }}
              />
            )}
          </button>
        );
      })}

      {/* Role label at bottom */}
      <div className="mt-auto pb-1">
        <p className="rotate-180 text-center text-[9px] uppercase tracking-widest [writing-mode:vertical-rl]"
          style={{ color: "rgba(255,255,255,0.2)", fontFamily: "var(--bs-mono)" }}>
          {role === "admin" ? "مسؤول" : role === "dean" ? "عميد" : role}
        </p>
      </div>
    </aside>
  );
}
```

**Step: Commit**

```bash
git add src/components/workflows/workflow-sidebar.tsx
git commit -m "feat(workflows): add WorkflowSidebar with role-aware nav"
```

---

## Task 15: Build workflow-builder-modal.tsx (shell)

**Files:**
- Create: `src/components/workflows/workflow-builder-modal.tsx`

```typescript
// src/components/workflows/workflow-builder-modal.tsx
"use client";

import { useEffect } from "react";
import { createPortal } from "react-dom";
import { useWorkflowStore } from "@/stores/workflow-store";
import { WorkflowTopBar } from "./workflow-top-bar";
import { WorkflowSidebar } from "./workflow-sidebar";
import { WorkflowCanvas } from "./workflow-canvas";
import { WorkflowRightPanel } from "./workflow-right-panel";

export function WorkflowBuilderModal() {
  const { isOpen, meta, nodes, closeBuilder, setSaving, markClean } = useWorkflowStore((s) => ({
    isOpen: s.isOpen,
    meta: s.meta,
    nodes: s.nodes,
    closeBuilder: s.closeBuilder,
    setSaving: s.setSaving,
    markClean: s.markClean,
  }));

  // Close on Escape
  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") closeBuilder(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [isOpen, closeBuilder]);

  // Prevent body scroll when open
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  const handleSave = async () => {
    if (!meta.id) return; // No workflow created yet — skip (handled by launch flow)
    setSaving(true);
    try {
      await fetch(`/api/v1/workflows/${meta.id}/nodes`, {
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
      // Also patch metadata
      await fetch(`/api/v1/workflows/${meta.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: meta.name, description: meta.description, role: meta.role, schedule: meta.schedule }),
      });
      markClean();
    } finally {
      setSaving(false);
    }
  };

  if (!isOpen) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex"
      style={{ background: "var(--bs-concrete)" }}
      role="dialog"
      aria-modal="true"
      aria-label="منشئ سير العمل"
    >
      {/* Sidebar (visually right in RTL because dir="rtl" flips start/end) */}
      <WorkflowSidebar role={meta.role || "admin"} />

      {/* Main area */}
      <div className="flex flex-1 flex-col overflow-hidden">
        <WorkflowTopBar onSave={handleSave} />
        <div className="flex flex-1 overflow-hidden">
          <WorkflowCanvas />
          <WorkflowRightPanel />
        </div>
      </div>
    </div>,
    document.body
  );
}
```

**Step: TypeScript check**

```bash
npx tsc --noEmit 2>&1 | grep -i "workflow"
```
Expected: no errors.

**Step: Commit**

```bash
git add src/components/workflows/workflow-builder-modal.tsx
git commit -m "feat(workflows): add WorkflowBuilderModal portal shell"
```

---

## Task 16: Wire trigger into existing dashboard sidebar

**Files:**
- Modify: `src/components/layout/sidebar.tsx`

**Step 1: Find the imports section in sidebar.tsx**

Look for the imports block (top of file). Add `Workflow` to the lucide-react import:
```typescript
// In the existing lucide-react import, add:
Workflow,
```

**Step 2: Find the navSections array**

In the `navSections` array, add a new item for workflows to the main section:
```typescript
{
  labelKey: "workflows",
  href: "/",  // not a route — opens modal
  icon: Workflow,
  // Add a special marker so we know to open modal instead
},
```

**Instead**, since the modal opens via Zustand, add a dedicated "quick-launch" button at the bottom of the sidebar. Find the logout button area and add above it:

```typescript
// Import at top of sidebar.tsx:
import { useWorkflowStore } from "@/stores/workflow-store";

// Inside the Sidebar component, get the openBuilder action:
const openWorkflowBuilder = useWorkflowStore((s) => s.openBuilder);

// Add a button in the sidebar (near settings/logout area):
<button
  onClick={() => openWorkflowBuilder()}
  className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 transition-all hover:bg-white/5"
  title="سير العمل الآلي"
>
  <Workflow size={18} className="shrink-0" />
  <span className="text-sm font-medium">{t("workflows")}</span>
</button>
```

**Step 3: Mount the modal in the dashboard layout**

Open `src/app/[locale]/(dashboard)/layout.tsx` and add the modal:

```typescript
// Add import:
import { WorkflowBuilderModal } from "@/components/workflows/workflow-builder-modal";

// Add inside the return, after existing layout children:
<WorkflowBuilderModal />
```

**Step 4: Add the translation key**

Find the `messages/ar.json` (or equivalent) and add:
```json
"workflows": "سير العمل الآلي"
```

Find `messages/en.json` and add:
```json
"workflows": "Workflows"
```

**Step 5: TypeScript check**

```bash
npx tsc --noEmit 2>&1 | head -30
```
Expected: no errors.

**Step 6: Commit**

```bash
git add src/components/layout/sidebar.tsx
git add "src/app/[locale]/(dashboard)/layout.tsx"
git commit -m "feat(workflows): wire WorkflowBuilderModal into dashboard layout"
```

---

## Task 17: Smoke test in preview

**Step 1: Start dev server (if not running)**

```bash
# Server should already be running at port 3001 (server ID: 8abb4a80-5664-4294-b8e4-e3499f07599e)
# Navigate to dashboard
```

**Step 2: Verify via preview tools**
- Open `http://127.0.0.1:3001/ar/` (dashboard)
- Click "سير العمل الآلي" in sidebar
- Verify modal opens full-screen
- Verify dotted grid canvas is visible
- Drag a palette block onto the canvas
- Verify node card appears with type stripe
- Reorder nodes by drag handle
- Click Save (if workflow ID exists)

**Step 3: Check for console errors**

Use `preview_console_logs` — expected: no errors.

**Step 4: Final commit**

```bash
git add -A
git commit -m "feat: complete Workflow Builder modal v1

- @dnd-kit drag & drop (palette → canvas + reorder)
- Zustand store for in-flight state
- 6 API routes under /api/v1/workflows/
- Prisma Workflow + WorkflowNode models
- Role-aware mini sidebar
- Inline-editable workflow title
- Brutalist Signal visual design (Concrete canvas, white nodes)
- RTL-safe layout via dir=rtl"
```

---

## Summary of Files Created

```
src/
├── components/workflows/
│   ├── workflow-types.ts
│   ├── palette-blocks-data.ts
│   ├── workflow-connector.tsx
│   ├── workflow-node.tsx
│   ├── palette-block.tsx
│   ├── workflow-canvas.tsx
│   ├── workflow-right-panel.tsx
│   ├── workflow-top-bar.tsx
│   ├── workflow-sidebar.tsx
│   └── workflow-builder-modal.tsx
├── stores/
│   └── workflow-store.ts
└── app/api/v1/workflows/
    ├── route.ts                  (POST + GET)
    ├── [id]/route.ts             (GET + PATCH + DELETE)
    └── [id]/nodes/route.ts       (PUT)

prisma/
└── schema.prisma                 (+ Workflow + WorkflowNode models)

docs/plans/
├── 2026-02-25-workflow-builder-design.md
└── 2026-02-25-workflow-builder-impl.md
```

## Key Commands

```bash
# Install deps
npm install @dnd-kit/core @dnd-kit/sortable @dnd-kit/utilities

# Generate Prisma client (after schema changes)
npx prisma generate

# Run migration (when DB is connected)
npx prisma migrate dev --name add_workflow_models

# TypeScript check
npx tsc --noEmit

# Dev server
npm run dev
```
