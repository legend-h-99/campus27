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
  launchClean: (id: string) => void;
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

  launchClean: (id) =>
    set((s) => ({
      meta: { ...s.meta, id, status: "active" as const },
      isDirty: false,
    })),
}));
