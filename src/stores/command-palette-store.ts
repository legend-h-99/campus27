import { create } from "zustand";
import type { SearchResult } from "@/app/api/search/route";

interface CommandPaletteStore {
  isOpen: boolean;
  query: string;
  results: SearchResult[];
  isLoading: boolean;
  selectedIndex: number;
  open: () => void;
  close: () => void;
  setQuery: (q: string) => void;
  setResults: (r: SearchResult[]) => void;
  setLoading: (v: boolean) => void;
  setSelectedIndex: (i: number) => void;
  moveUp: () => void;
  moveDown: () => void;
}

export const useCommandPaletteStore = create<CommandPaletteStore>((set, get) => ({
  isOpen: false,
  query: "",
  results: [],
  isLoading: false,
  selectedIndex: 0,
  open: () => set({ isOpen: true, query: "", results: [], selectedIndex: 0 }),
  close: () => set({ isOpen: false, query: "", results: [], selectedIndex: 0 }),
  setQuery: (q) => set({ query: q, selectedIndex: 0 }),
  setResults: (r) => set({ results: r }),
  setLoading: (v) => set({ isLoading: v }),
  setSelectedIndex: (i) => set({ selectedIndex: i }),
  moveUp: () => {
    const { selectedIndex, results } = get();
    set({ selectedIndex: selectedIndex > 0 ? selectedIndex - 1 : results.length - 1 });
  },
  moveDown: () => {
    const { selectedIndex, results } = get();
    set({ selectedIndex: selectedIndex < results.length - 1 ? selectedIndex + 1 : 0 });
  },
}));
