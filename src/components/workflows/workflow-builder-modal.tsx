// src/components/workflows/workflow-builder-modal.tsx
"use client";

import { useEffect } from "react";
import { createPortal } from "react-dom";
import { useShallow } from "zustand/react/shallow";
import { useWorkflowStore } from "@/stores/workflow-store";
import { WorkflowTopBar } from "./workflow-top-bar";
import { WorkflowSidebar } from "./workflow-sidebar";
import { WorkflowCanvas } from "./workflow-canvas";
import { WorkflowRightPanel } from "./workflow-right-panel";

export function WorkflowBuilderModal() {
  const { isOpen, meta, nodes, closeBuilder, setSaving, markClean } =
    useWorkflowStore(
      useShallow((s) => ({
        isOpen: s.isOpen,
        meta: s.meta,
        nodes: s.nodes,
        closeBuilder: s.closeBuilder,
        setSaving: s.setSaving,
        markClean: s.markClean,
      }))
    );

  // Close on Escape
  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeBuilder();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [isOpen, closeBuilder]);

  // Prevent body scroll when open
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const handleSave = async () => {
    if (!meta.id) return; // No workflow persisted yet — handled by launch flow
    setSaving(true);
    try {
      // Atomically replace nodes
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
      // Patch workflow metadata
      await fetch(`/api/v1/workflows/${meta.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: meta.name,
          description: meta.description,
          role: meta.role,
          schedule: meta.schedule,
        }),
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
      {/* Mini sidebar (visually on the right in RTL because dir=rtl flips start/end) */}
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
