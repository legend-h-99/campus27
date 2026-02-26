// src/components/workflows/workflow-node.tsx
"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  GripVertical,
  X,
  PlayCircle,
  Calendar,
  Bell,
  FileText,
  ClipboardList,
  AlertCircle,
  GitBranch,
  UserPlus,
} from "lucide-react";
import type { WorkflowNodeDraft, WorkflowNodeType } from "./workflow-types";
import { useWorkflowStore } from "@/stores/workflow-store";

const ICON_MAP: Record<string, React.ElementType> = {
  PlayCircle,
  Calendar,
  Bell,
  FileText,
  ClipboardList,
  AlertCircle,
  GitBranch,
  UserPlus,
};

const TYPE_STYLES: Record<
  WorkflowNodeType,
  { stripe: string; badge: string; label: string }
> = {
  trigger: {
    stripe: "border-l-4 border-[var(--bs-signal)]",
    badge: "bg-red-50 text-[var(--bs-signal)]",
    label: "بدء",
  },
  action: {
    stripe: "border-l-4 border-[var(--bs-steel)]",
    badge: "bg-slate-100 text-[var(--bs-steel)]",
    label: "خطوة",
  },
  condition: {
    stripe: "border-l-4 border-amber-400",
    badge: "bg-amber-50 text-amber-600",
    label: "شرط",
  },
};

interface WorkflowNodeProps {
  node: WorkflowNodeDraft;
  iconName?: string;
}

export function WorkflowNode({ node, iconName }: WorkflowNodeProps) {
  const removeNode = useWorkflowStore((s) => s.removeNode);
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: node.draftId });

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
          <p
            className="text-sm font-semibold leading-tight"
            style={{ color: "var(--bs-steel)" }}
          >
            {node.title}
          </p>
          {node.description && (
            <p
              className="mt-0.5 truncate text-xs"
              style={{ color: "var(--bs-muted)" }}
            >
              {node.description}
            </p>
          )}
        </div>

        {/* Type badge */}
        <span
          className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-medium ${typeStyle.badge}`}
        >
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
