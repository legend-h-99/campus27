"use client";

import { useState, useRef, useCallback } from "react";
import { Search, Loader2, X } from "lucide-react";

interface CinematicSearchBarProps {
  onSearch?: (query: string) => void;
  placeholder?: string;
  className?: string;
}

type State = "idle" | "focused" | "typing" | "submitting" | "done";

export function CinematicSearchBar({
  onSearch,
  placeholder,
  className = "",
}: CinematicSearchBarProps) {
  const [state, setState] = useState<State>("idle");
  const [value, setValue] = useState("");
  const [ripple, setRipple] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const isAr = typeof window !== "undefined"
    ? document.documentElement.lang === "ar"
    : false;

  const defaultPlaceholder =
    placeholder ?? (isAr ? "ابحث عن برنامج أو متدرب..." : "Search programs, trainees...");

  const handleFocus = () => setState("focused");
  const handleBlur = () => {
    if (!value) setState("idle");
  };

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
    setState(e.target.value ? "typing" : "focused");
  }, []);

  const handleSubmit = useCallback(
    async (e?: React.FormEvent) => {
      e?.preventDefault();
      if (!value.trim()) return;
      setState("submitting");
      setRipple(true);
      await new Promise((r) => setTimeout(r, 120));
      setRipple(false);
      onSearch?.(value.trim());
      await new Promise((r) => setTimeout(r, 800));
      setState("done");
      setTimeout(() => setState("focused"), 1200);
    },
    [value, onSearch]
  );

  const handleClear = () => {
    setValue("");
    setState("focused");
    inputRef.current?.focus();
  };

  const expanded = state !== "idle";

  return (
    <form
      onSubmit={handleSubmit}
      className={`relative flex items-center transition-all duration-400 ${className}`}
      style={{
        width: expanded ? "min(480px, 90vw)" : "44px",
        height: "44px",
        borderRadius: "9999px",
        background: expanded ? "#fff" : "rgba(28,28,30,0.05)",
        border: expanded
          ? state === "submitting"
            ? "1.5px solid var(--bs-signal)"
            : "1.5px solid rgba(28,28,30,0.15)"
          : state === "idle"
          ? "1.5px solid rgba(28,28,30,0.1)"
          : "1.5px solid rgba(28,28,30,0.15)",
        boxShadow: expanded
          ? state === "submitting"
            ? "0 0 0 4px rgba(255,59,48,0.1)"
            : "0 4px 24px rgba(28,28,30,0.08)"
          : "none",
        overflow: "hidden",
        cursor: expanded ? "text" : "pointer",
        fontFamily: "var(--bs-grotesk)",
        // Breathing padding on typing
        padding: state === "typing" ? "0 14px" : "0 12px",
        transition: "width 0.35s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.25s ease, padding 0.2s ease, background 0.25s ease",
      }}
      onClick={() => {
        if (!expanded) {
          setState("focused");
          setTimeout(() => inputRef.current?.focus(), 350);
        }
      }}
    >
      {/* Ripple */}
      {ripple && (
        <span
          className="pointer-events-none absolute inset-0 rounded-full"
          style={{
            background: "var(--bs-signal)",
            opacity: 0.12,
            animation: "scaleIn 0.4s ease-out both",
          }}
        />
      )}

      {/* Icon / Spinner */}
      <div className="shrink-0 flex items-center justify-center" style={{ width: 20, height: 20 }}>
        {state === "submitting" ? (
          <Loader2
            className="animate-spin"
            style={{ width: 16, height: 16, color: "var(--bs-signal)" }}
          />
        ) : (
          <Search
            style={{
              width: 16,
              height: 16,
              color: expanded ? "var(--bs-signal)" : "var(--bs-muted)",
              transition: "color 0.2s ease, transform 0.3s ease",
              transform: expanded ? "scale(1.1)" : "scale(1)",
            }}
          />
        )}
      </div>

      {/* Input */}
      {expanded && (
        <>
          <input
            ref={inputRef}
            type="text"
            value={value}
            onChange={handleChange}
            onFocus={handleFocus}
            onBlur={handleBlur}
            onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
            placeholder={defaultPlaceholder}
            className="flex-1 bg-transparent text-sm outline-none placeholder:text-slate-400"
            style={{
              marginInline: "8px",
              color: "var(--bs-steel)",
              fontFamily: "var(--bs-grotesk)",
              // Custom blinking cursor
              caretColor: "var(--bs-signal)",
            }}
            autoComplete="off"
          />

          {/* Clear button */}
          {value && (
            <button
              type="button"
              onClick={handleClear}
              className="shrink-0 flex items-center justify-center rounded-full transition-colors hover:bg-slate-100"
              style={{ width: 20, height: 20 }}
              aria-label="Clear"
            >
              <X style={{ width: 12, height: 12, color: "var(--bs-muted)" }} />
            </button>
          )}
        </>
      )}
    </form>
  );
}
