"use client";

import { useEffect, useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";

interface PageTransitionProps {
  children: ReactNode;
  className?: string;
}

/**
 * Wraps page content with a smooth fade-in + slide-up animation.
 * Uses requestAnimationFrame for smoother entry.
 */
export function PageTransition({ children, className }: PageTransitionProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Use rAF to ensure the initial state is painted before animating
    requestAnimationFrame(() => {
      setMounted(true);
    });
  }, []);

  return (
    <div
      className={cn(
        "transition-all duration-500 ease-out",
        mounted
          ? "translate-y-0 opacity-100"
          : "translate-y-3 opacity-0",
        className
      )}
    >
      {children}
    </div>
  );
}

/**
 * Animates children in sequence with staggered delays.
 * Each child gets a progressively longer delay for a cascade effect.
 */
export function StaggeredList({
  children,
  className,
  staggerDelay = 60,
}: {
  children: ReactNode[];
  className?: string;
  staggerDelay?: number;
}) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    requestAnimationFrame(() => setMounted(true));
  }, []);

  return (
    <div className={className}>
      {children.map((child, i) => (
        <div
          key={i}
          className="transition-all duration-400 ease-out"
          style={{
            opacity: mounted ? 1 : 0,
            transform: mounted ? "translateY(0)" : "translateY(12px)",
            transitionDelay: `${i * staggerDelay}ms`,
          }}
        >
          {child}
        </div>
      ))}
    </div>
  );
}
