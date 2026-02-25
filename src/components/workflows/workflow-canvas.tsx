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
import {
  SortableContext,
  arrayMove,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { Plus } from "lucide-react";
import { useState } from "react";
import { useShallow } from "zustand/react/shallow";
import { useWorkflowStore } from "@/stores/workflow-store";
import { isPaletteId, paletteKeyFrom } from "./workflow-types";
import { paletteBlockByKey } from "./palette-blocks-data";
import { WorkflowNode } from "./workflow-node";
import { WorkflowConnector } from "./workflow-connector";

export function WorkflowCanvas() {
  const { nodes, addNode, reorderNodes } = useWorkflowStore(
    useShallow((s) => ({
      nodes: s.nodes,
      addNode: s.addNode,
      reorderNodes: s.reorderNodes,
    }))
  );

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
      addNode(
        {
          type: block.type,
          title: block.title,
          description: block.description,
          config: {},
        },
        overIndex >= 0 ? overIndex : undefined
      );
    } else {
      // Reorder existing nodes
      const oldIndex = nodes.findIndex((n) => n.draftId === activeId);
      const newIndex = nodes.findIndex((n) => n.draftId === overId);
      if (oldIndex !== -1 && newIndex !== -1 && oldIndex !== newIndex) {
        reorderNodes(arrayMove(nodes, oldIndex, newIndex));
      }
    }
  };

  const activePaletteBlock =
    activeDragId && isPaletteId(activeDragId)
      ? paletteBlockByKey[paletteKeyFrom(activeDragId)]
      : null;

  return (
    <DndContext
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      {/* Canvas area with dotted grid */}
      <div
        className="flex-1 overflow-y-auto p-8"
        style={{
          backgroundImage:
            "radial-gradient(circle, rgba(28,28,30,0.12) 1px, transparent 1px)",
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
                style={{
                  borderColor: "rgba(28,28,30,0.15)",
                  color: "var(--bs-muted)",
                }}
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
                      Object.values(paletteBlockByKey).find(
                        (b) => b.title === node.title
                      )?.iconName
                    }
                  />
                </div>
              ))
            )}
          </SortableContext>

          {/* Add step button */}
          <div className="mt-6 flex justify-center">
            <button
              onClick={() =>
                addNode({ type: "action", title: "خطوة جديدة", config: {} })
              }
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
