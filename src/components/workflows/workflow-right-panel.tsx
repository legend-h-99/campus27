// src/components/workflows/workflow-right-panel.tsx
"use client";

import { useWorkflowStore } from "@/stores/workflow-store";
import { PALETTE_BLOCKS } from "./palette-blocks-data";
import { PaletteBlockCard } from "./palette-block";

const ROLES = [
  { value: "admin", label: "مسؤول النظام" },
  { value: "dean", label: "العميد" },
  { value: "qa", label: "مسؤول الجودة" },
  { value: "trainer", label: "المدرب" },
];

export function WorkflowRightPanel() {
  const meta = useWorkflowStore((s) => s.meta);
  const updateMeta = useWorkflowStore((s) => s.updateMeta);

  return (
    <aside
      className="flex w-72 shrink-0 flex-col overflow-y-auto"
      style={{
        background: "#fff",
        borderInlineStart: "1px solid rgba(28,28,30,0.08)",
      }}
    >
      {/* Settings section */}
      <div className="p-5">
        <p
          className="mb-3 text-xs font-semibold uppercase tracking-widest"
          style={{
            color: "var(--bs-signal)",
            fontFamily: "var(--bs-mono)",
          }}
        >
          // الإعدادات
        </p>
        <div className="space-y-3">
          <div>
            <label
              className="mb-1 block text-xs font-medium"
              style={{ color: "var(--bs-muted)" }}
            >
              الوصف
            </label>
            <textarea
              rows={2}
              value={meta.description}
              onChange={(e) => updateMeta({ description: e.target.value })}
              className="w-full resize-none rounded-xl px-3 py-2 text-sm outline-none transition-all"
              style={{
                border: "1px solid rgba(28,28,30,0.1)",
                background: "rgba(28,28,30,0.02)",
                color: "var(--bs-steel)",
              }}
              placeholder="وصف اختياري..."
            />
          </div>
          <div>
            <label
              className="mb-1 block text-xs font-medium"
              style={{ color: "var(--bs-muted)" }}
            >
              الدور المسؤول
            </label>
            <select
              value={meta.role}
              onChange={(e) => updateMeta({ role: e.target.value })}
              className="w-full rounded-xl px-3 py-2 text-sm outline-none"
              style={{
                border: "1px solid rgba(28,28,30,0.1)",
                background: "rgba(28,28,30,0.02)",
                color: "var(--bs-steel)",
              }}
            >
              <option value="">اختر الدور</option>
              {ROLES.map((r) => (
                <option key={r.value} value={r.value}>
                  {r.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label
              className="mb-1 block text-xs font-medium"
              style={{ color: "var(--bs-muted)" }}
            >
              وقت التفعيل
            </label>
            <input
              type="text"
              value={meta.schedule}
              onChange={(e) => updateMeta({ schedule: e.target.value })}
              className="w-full rounded-xl px-3 py-2 text-sm outline-none"
              style={{
                border: "1px solid rgba(28,28,30,0.1)",
                background: "rgba(28,28,30,0.02)",
                color: "var(--bs-steel)",
              }}
              placeholder="مثال: يومياً الساعة 8 صباحاً"
            />
          </div>
        </div>
      </div>

      {/* Divider */}
      <div
        style={{
          height: "1px",
          background: "rgba(28,28,30,0.08)",
          margin: "0 20px",
        }}
      />

      {/* Palette section */}
      <div className="flex-1 p-5">
        <p
          className="mb-3 text-xs font-semibold uppercase tracking-widest"
          style={{
            color: "var(--bs-signal)",
            fontFamily: "var(--bs-mono)",
          }}
        >
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
