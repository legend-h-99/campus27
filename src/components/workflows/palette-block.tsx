// src/components/workflows/palette-block.tsx
"use client";

import { useDraggable } from "@dnd-kit/core";
import {
  PlayCircle,
  Calendar,
  Bell,
  FileText,
  ClipboardList,
  AlertCircle,
  GitBranch,
  UserPlus,
} from "lucide-react";
import type { PaletteBlock, WorkflowNodeType } from "./workflow-types";
import { toPaletteId } from "./workflow-types";

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
        <Icon
          size={14}
          style={{ color: TYPE_COLOR[block.type], flexShrink: 0 }}
        />
        <p
          className="text-xs font-medium leading-tight"
          style={{ color: "var(--bs-steel)" }}
        >
          {block.title}
        </p>
      </div>
    </div>
  );
}
