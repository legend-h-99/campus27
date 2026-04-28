// src/components/workflows/workflow-sidebar.tsx
"use client";

import {
  LayoutDashboard,
  GraduationCap,
  BarChart3,
  Workflow,
  Settings,
  CheckSquare,
  BookOpen,
} from "lucide-react";

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
      style={{
        background: "var(--bs-steel)",
        borderInlineEnd: "1px solid rgba(255,255,255,0.06)",
      }}
    >
      {/* Logo mark */}
      <div
        className="mb-3 flex h-9 w-9 items-center justify-center rounded-xl text-base font-extrabold"
        style={{
          background: "var(--bs-signal)",
          color: "#fff",
          fontFamily: "var(--bs-grotesk)",
        }}
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
              background: item.active
                ? "rgba(255,255,255,0.12)"
                : "transparent",
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

      {/* Role label */}
      <div className="mt-auto pb-1">
        <p
          className="rotate-180 text-center text-[9px] uppercase tracking-widest [writing-mode:vertical-rl]"
          style={{
            color: "rgba(255,255,255,0.2)",
            fontFamily: "var(--bs-mono)",
          }}
        >
          {role === "admin" ? "مسؤول" : role === "dean" ? "عميد" : role}
        </p>
      </div>
    </aside>
  );
}
