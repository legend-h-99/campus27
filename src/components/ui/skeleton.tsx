"use client";

import { cn } from "@/lib/utils";

interface SkeletonProps {
  className?: string;
}

export function Skeleton({ className }: SkeletonProps) {
  return (
    <div
      className={cn("skeleton bg-teal-100/50", className)}
      aria-hidden="true"
    />
  );
}

/* ═══ Pre-composed Skeleton Layouts ═══ */

export function SkeletonStatCards({ count = 4 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 gap-3 md:gap-4 lg:grid-cols-4">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="glass-card rounded-2xl p-4 md:p-6"
          style={{ animationDelay: `${i * 0.1}s` }}
        >
          <div className="flex items-center justify-between">
            <div className="flex-1 space-y-3">
              <Skeleton className="h-3 w-20 md:h-4 md:w-24" />
              <Skeleton className="h-7 w-16 md:h-8 md:w-20" />
            </div>
            <Skeleton className="h-12 w-12 rounded-2xl md:h-14 md:w-14" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function SkeletonTable({ rows = 5 }: { rows?: number }) {
  return (
    <div className="glass-card overflow-hidden rounded-xl">
      {/* Table Header */}
      <div className="flex gap-4 border-b border-border p-4">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="hidden h-4 w-24 md:block" />
        <Skeleton className="hidden h-4 w-28 lg:block" />
        <Skeleton className="h-4 w-20" />
      </div>
      {/* Table Rows */}
      {Array.from({ length: rows }).map((_, i) => (
        <div
          key={i}
          className="flex items-center gap-4 border-b border-border/50 p-4 last:border-b-0"
          style={{ animationDelay: `${i * 0.05}s` }}
        >
          <Skeleton className="h-9 w-9 shrink-0 rounded-full" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-3.5 w-3/4" />
            <Skeleton className="h-3 w-1/2" />
          </div>
          <Skeleton className="hidden h-6 w-16 rounded-full md:block" />
          <Skeleton className="h-8 w-8 rounded-lg" />
        </div>
      ))}
    </div>
  );
}

export function SkeletonCards({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 gap-4 md:gap-5 lg:grid-cols-2 xl:grid-cols-3">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="glass-card overflow-hidden rounded-xl"
          style={{ animationDelay: `${i * 0.08}s` }}
        >
          {/* Card Header Skeleton */}
          <Skeleton className="h-32 w-full rounded-none" />
          {/* Card Body */}
          <div className="space-y-3 p-4">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-3 w-1/2" />
            <div className="flex gap-3 pt-2">
              <Skeleton className="h-3 w-16" />
              <Skeleton className="h-3 w-16" />
              <Skeleton className="h-3 w-16" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export function SkeletonChart() {
  return (
    <div className="glass-card rounded-xl p-4 md:p-6">
      <div className="mb-4 flex items-center justify-between">
        <Skeleton className="h-5 w-32" />
        <Skeleton className="h-8 w-24 rounded-lg" />
      </div>
      <Skeleton className="h-64 w-full rounded-xl md:h-80" />
    </div>
  );
}

export function SkeletonDashboard() {
  return (
    <div className="animate-fade-in space-y-4 md:space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <Skeleton className="h-7 w-48 md:h-8" />
          <Skeleton className="h-4 w-64" />
        </div>
        <Skeleton className="h-10 w-32 rounded-lg" />
      </div>

      {/* Stat Cards */}
      <SkeletonStatCards />

      {/* Charts Row */}
      <div className="grid grid-cols-1 gap-4 md:gap-6 lg:grid-cols-2">
        <SkeletonChart />
        <SkeletonChart />
      </div>

      {/* Table */}
      <SkeletonTable />
    </div>
  );
}

export function SkeletonPageWithCards() {
  return (
    <div className="animate-fade-in space-y-4 md:space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <Skeleton className="h-7 w-48 md:h-8" />
          <Skeleton className="h-4 w-64" />
        </div>
        <Skeleton className="h-10 w-32 rounded-lg" />
      </div>

      {/* Stat Cards */}
      <SkeletonStatCards />

      {/* Cards Grid */}
      <SkeletonCards />
    </div>
  );
}
