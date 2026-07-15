/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { LayoutGrid, UtensilsCrossed, QrCode, BarChart3, Search as SearchIcon } from "lucide-react";

import { useSearch } from "@/lib/search-context";
import { restaurantsData } from "@/data/restaurants";

const staticPages = [
  { label: "Dashboard", href: "/", icon: LayoutGrid },
  { label: "Restaurants", href: "/restaurants", icon: UtensilsCrossed },
  { label: "QR Codes", href: "/qr-generator", icon: QrCode },
  { label: "Analytics", href: "/analytics", icon: BarChart3 },
  { label: "Reports", href: "/reports", icon: BarChart3 },
];

export function CommandPalette() {
  const { query, setQuery, isPaletteOpen, openPalette, closePalette } = useSearch();
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  // ⌘K / Ctrl+K opens the palette from anywhere
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        openPalette();
      }
      if (e.key === "Escape") closePalette();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [openPalette, closePalette]);

  useEffect(() => {
    if (isPaletteOpen) {
      setActiveIndex(0);
      requestAnimationFrame(() => inputRef.current?.focus());
    }
  }, [isPaletteOpen]);

  const matchedPages = useMemo(() => {
    if (!query.trim()) return staticPages;
    return staticPages.filter((p) => p.label.toLowerCase().includes(query.toLowerCase()));
  }, [query]);

  const matchedRestaurants = useMemo(() => {
    if (!query.trim()) return restaurantsData.slice(0, 5);
    return restaurantsData.filter((r) => r.name.toLowerCase().includes(query.toLowerCase()));
  }, [query]);

  const results = [
    ...matchedPages.map((p) => ({ type: "page" as const, href: p.href, label: p.label, icon: p.icon })),
    ...matchedRestaurants.map((r) => ({
      type: "restaurant" as const,
      href: `/restaurants/${r.id}`,
      label: r.name,
     
    })),
  ];

  const go = (href: string) => {
    router.push(href);
    closePalette();
    setQuery("");
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((i) => Math.min(i + 1, results.length - 1));
    }
    if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((i) => Math.max(i - 1, 0));
    }
    if (e.key === "Enter" && results[activeIndex]) {
      go(results[activeIndex].href);
    }
  };

  if (!isPaletteOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[300] flex items-start justify-center bg-slate-900/40 pt-[12vh] backdrop-blur-sm"
      onClick={closePalette}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-lg overflow-hidden rounded-2xl border border-[#EDEBF7] bg-white shadow-2xl"
      >
        <div className="flex items-center gap-2.5 border-b border-[#EDEBF7] px-4 py-3.5">
          <SearchIcon size={17} className="text-[#9C97B5]" />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={onKeyDown}
            placeholder="Search restaurants, tables, pages…"
            className="w-full bg-transparent text-sm text-[#1A1730] outline-none placeholder:text-[#B4AFC9]"
          />
          <kbd className="rounded-md border border-[#EDEBF7] px-1.5 py-0.5 text-[10px] font-semibold text-[#9C97B5]">
            Esc
          </kbd>
        </div>

        <div className="max-h-80 overflow-y-auto py-2">
          {results.length === 0 && (
            <p className="px-4 py-6 text-center text-sm text-[#9C97B5]">No results for &quot;{query}&quot;</p>
          )}

          {results.map((r, i) => (
  <button
    key={`${r.type}-${r.href}-${r.label}`}
    onClick={() => go(r.href)}
    onMouseEnter={() => setActiveIndex(i)}
    className={`flex w-full items-center gap-3 px-4 py-2.5 text-left text-sm ${
      i === activeIndex ? "bg-[#F5F3FF] text-[#1A1730]" : "text-[#6B6685]"
    }`}
  >
    {"icon" in r && r.icon ? (
      <r.icon size={15} className="shrink-0 text-[#9C97B5]" />
    ) : (
      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#6C4DF4] to-[#8C6BFF] text-[9px] font-bold text-white">
        {r.label.charAt(0)}
      </span>
    )}
    <span className="truncate">{r.label}</span>
  </button>
))}
        </div>
      </div>
    </div>
  );
}