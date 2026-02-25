// src/components/workflows/workflow-top-bar.tsx
"use client";

import { Save, X, Zap, Edit2, Square } from "lucide-react";
import { useState } from "react";
import { useWorkflowStore } from "@/stores/workflow-store";

interface WorkflowTopBarProps {
  onSave: () => Promise<void>;
  onLaunch: () => Promise<void>;
}

export function WorkflowTopBar({ onSave, onLaunch }: WorkflowTopBarProps) {
  const meta = useWorkflowStore((s) => s.meta);
  const updateMeta = useWorkflowStore((s) => s.updateMeta);
  const closeBuilder = useWorkflowStore((s) => s.closeBuilder);
  const isDirty = useWorkflowStore((s) => s.isDirty);
  const isSaving = useWorkflowStore((s) => s.isSaving);
  const isActive = meta.status === "active";
  const [editingName, setEditingName] = useState(false);

  return (
    <header
      className="flex h-14 shrink-0 items-center gap-4 px-5"
      style={{
        borderBottom: "1px solid rgba(28,28,30,0.08)",
        background: "#fff",
      }}
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
            style={{
              border: "1px solid var(--bs-signal)",
              color: "var(--bs-steel)",
              minWidth: 0,
            }}
          />
        ) : (
          <button
            onClick={() => setEditingName(true)}
            className="group flex items-center gap-1.5 min-w-0"
          >
            <span
              className="truncate text-sm font-semibold"
              style={{ color: "var(--bs-steel)" }}
            >
              {meta.name}
            </span>
            <Edit2
              size={12}
              className="shrink-0 opacity-0 transition-opacity group-hover:opacity-40"
            />
          </button>
        )}

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
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2">
        <button
          onClick={onSave}
          disabled={isSaving || !isDirty || !meta.id}
          className="flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-semibold transition-all disabled:opacity-40"
          style={{
            background: isDirty ? "var(--bs-signal)" : "rgba(28,28,30,0.06)",
            color: isDirty ? "#fff" : "var(--bs-muted)",
          }}
        >
          <Save size={12} />
          {isSaving ? "جاري الحفظ..." : "حفظ"}
        </button>
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
