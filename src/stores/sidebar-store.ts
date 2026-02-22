import { create } from "zustand";

type SidebarMode = "full" | "collapsed" | "hidden";

interface SidebarStore {
  isOpen: boolean;
  isMobileOpen: boolean;
  mode: SidebarMode;
  toggle: () => void;
  open: () => void;
  close: () => void;
  openMobile: () => void;
  closeMobile: () => void;
  setMode: (mode: SidebarMode) => void;
  updateForScreenSize: (width: number) => void;
}

export const useSidebarStore = create<SidebarStore>((set) => ({
  isOpen: true,
  isMobileOpen: false,
  mode: "full" as SidebarMode,
  toggle: () =>
    set((state) => {
      if (state.mode === "hidden") {
        return { isMobileOpen: !state.isMobileOpen };
      }
      return { isOpen: !state.isOpen };
    }),
  open: () => set({ isOpen: true }),
  close: () => set({ isOpen: false }),
  openMobile: () => set({ isMobileOpen: true }),
  closeMobile: () => set({ isMobileOpen: false }),
  setMode: (mode) => set({ mode }),
  updateForScreenSize: (width: number) =>
    set(() => {
      if (width < 768) {
        // Mobile: sidebar hidden, hamburger menu
        return { mode: "hidden" as SidebarMode, isOpen: false, isMobileOpen: false };
      } else if (width < 1024) {
        // Tablet: sidebar collapsed (icons only)
        return { mode: "collapsed" as SidebarMode, isOpen: false, isMobileOpen: false };
      } else {
        // Desktop/Laptop: sidebar full
        return { mode: "full" as SidebarMode, isOpen: true, isMobileOpen: false };
      }
    }),
}));
