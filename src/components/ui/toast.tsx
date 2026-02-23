// src/components/ui/toast.tsx
"use client";

import { useToastStore } from "@/stores/toast-store";
import { CheckCircle, AlertCircle, Info, X } from "lucide-react";

const icons = {
  success: CheckCircle,
  error: AlertCircle,
  info: Info,
};

const iconColors = {
  success: "text-green-500",
  error: "text-red-500",
  info: "text-teal-500",
};

export function ToastContainer() {
  const { toasts, remove } = useToastStore();

  if (toasts.length === 0) return null;

  return (
    <div className="toast-container">
      {toasts.map((t) => {
        const Icon = icons[t.type];
        return (
          <div key={t.id} className={`toast toast-${t.type}`} role="alert">
            <Icon className={`h-4 w-4 flex-shrink-0 ${iconColors[t.type]}`} />
            <p className="flex-1 text-sm font-medium text-slate-800">{t.message}</p>
            <button
              onClick={() => remove(t.id)}
              className="flex-shrink-0 rounded-lg p-1 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        );
      })}
    </div>
  );
}
