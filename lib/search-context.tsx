"use client";

import { createContext, useContext, useState, useCallback, ReactNode } from "react";

type SearchContextValue = {
  query: string;
  setQuery: (q: string) => void;
  isPaletteOpen: boolean;
  openPalette: () => void;
  closePalette: () => void;
};

const SearchContext = createContext<SearchContextValue | null>(null);

export function SearchProvider({ children }: { children: ReactNode }) {
  const [query, setQuery] = useState("");
  const [isPaletteOpen, setIsPaletteOpen] = useState(false);

  const openPalette = useCallback(() => setIsPaletteOpen(true), []);
  const closePalette = useCallback(() => setIsPaletteOpen(false), []);

  return (
    <SearchContext.Provider value={{ query, setQuery, isPaletteOpen, openPalette, closePalette }}>
      {children}
    </SearchContext.Provider>
  );
}

export function useSearch() {
  const ctx = useContext(SearchContext);
  if (!ctx) throw new Error("useSearch must be used within a SearchProvider");
  return ctx;
}