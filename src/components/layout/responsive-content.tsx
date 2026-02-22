"use client";

import { useSidebarStore } from "@/stores/sidebar-store";
import { useLocale } from "next-intl";
import { cn } from "@/lib/utils";

export function ResponsiveContent({ children }: { children: React.ReactNode }) {
  const { isOpen, mode } = useSidebarStore();
  const locale = useLocale();
  const isRtl = locale === "ar";

  const getContentPadding = () => {
    if (mode === "hidden") {
      // Mobile: no sidebar offset
      return "";
    }
    // Sidebar is on the inline-start side (right in RTL, left in LTR)
    // So content needs padding-inline-start to avoid overlap
    if (mode === "collapsed") {
      return isOpen ? "ps-[280px]" : "ps-20";
    }
    // Desktop: full sidebar
    return isOpen ? "ps-[280px]" : "ps-20";
  };

  return (
    <main
      className={cn(
        "min-h-screen pt-16 transition-all duration-300 ease-out md:pt-[72px]",
        getContentPadding()
      )}
      role="main"
    >
      <div className="min-w-0 p-3 pb-8 xs:p-4 md:p-6 lg:p-8">{children}</div>
    </main>
  );
}
