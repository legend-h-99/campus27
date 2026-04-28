// src/components/workflows/workflow-builder-modal.tsx
"use client";

import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { useWorkflowStore } from "@/stores/workflow-store";
import { WorkflowTopBar } from "./workflow-top-bar";
import { WorkflowSidebar } from "./workflow-sidebar";
import { WorkflowCanvas } from "./workflow-canvas";
import { WorkflowRightPanel } from "./workflow-right-panel";

export function WorkflowBuilderModal() {
  const isOpen = useWorkflowStore((s) => s.isOpen);
  const meta = useWorkflowStore((s) => s.meta);
  const launchClean = useWorkflowStore((s) => s.launchClean);
  const nodes = useWorkflowStore((s) => s.nodes);
  const closeBuilder = useWorkflowStore((s) => s.closeBuilder);
  const setSaving = useWorkflowStore((s) => s.setSaving);
  const markClean = useWorkflowStore((s) => s.markClean);

  const launchInFlight = useRef(false);

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

  const handleLaunch = async () => {
    if (launchInFlight.current) return;
    launchInFlight.current = true;
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
        if (!createRes.ok) {
          throw new Error(`فشل إنشاء سير العمل (${createRes.status})`);
        }
        const created = await createRes.json();
        if (typeof created?.data?.id !== "string") {
          throw new Error("استجابة غير متوقعة من الخادم");
        }
        workflowId = created.data.id;
      }

      // Step B: Persist nodes (atomic replace)
      const nodesRes = await fetch(`/api/v1/workflows/${workflowId}/nodes`, {
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
      if (!nodesRes.ok) {
        throw new Error(`فشل حفظ خطوات سير العمل (${nodesRes.status})`);
      }

      // Step C: Activate — set status to active + persist meta fields
      const activateRes = await fetch(`/api/v1/workflows/${workflowId}`, {
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
      if (!activateRes.ok) {
        throw new Error(`فشل تفعيل سير العمل (${activateRes.status})`);
      }

      // Step D: Sync store atomically (single set call — no dirty-badge flicker)
      launchClean(workflowId!);
    } catch (err) {
      console.error("[handleLaunch]", err);
      // Surface error to user — replace with toast if available
      alert(err instanceof Error ? err.message : "حدث خطأ أثناء الإطلاق");
    } finally {
      launchInFlight.current = false;
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
        <WorkflowTopBar onSave={handleSave} onLaunch={handleLaunch} />
        <div className="flex flex-1 overflow-hidden">
          <WorkflowCanvas />
          <WorkflowRightPanel />
        </div>
      </div>
    </div>,
    document.body
  );
}
