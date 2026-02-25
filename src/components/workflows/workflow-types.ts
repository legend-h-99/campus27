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
