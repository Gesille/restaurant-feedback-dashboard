"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Bell, Plus, Search } from "lucide-react";
import { useSelector } from "react-redux";

import { useSearch } from "@/lib/search-context";

function getInitials(name?: string) {
  if (!name) return "??";
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[1][0]).toUpperCase();
}

// Maps a route segment to a human title when a page doesn't pass one explicitly.
const ROUTE_TITLES: Record<string, string> = {
  dashboard: "Dashboard",
  "qr-generator": "QR Generator",
  profile: "Profile",
  login: "Log in",
};

function titleFromPathname(pathname: string | null) {
  if (!pathname) return "Dashboard";
  const segment = pathname.split("/").filter(Boolean).pop() ?? "dashboard";
  return ROUTE_TITLES[segment] ?? segment.charAt(0).toUpperCase() + segment.slice(1);
}

export function Topbar({ title, subtitle }: { title?: string; subtitle?: string }) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { user } = useSelector((state: any) => state.auth);
  const { query, setQuery, openPalette } = useSearch();
  const pathname = usePathname();

  // Dashboard is the "home base" — keep its header lean and action-focused.
  // Every other page gets the full toolkit: search, notifications, profile.
  const isDashboard = pathname === "/dashboard";
  const resolvedTitle = title ?? titleFromPathname(pathname);

  return (
    <header className="sticky top-0 z-20 flex items-center justify-between gap-4 border-b border-[#EDEBF7] bg-white/80 px-8 py-5 backdrop-blur">
      <div>
        <h1 className="text-xl font-bold text-[#1A1730]">{resolvedTitle}</h1>
        {subtitle && <p className="mt-0.5 text-sm text-[#9C97B5]">{subtitle}</p>}
      </div>

      <div className="flex items-center gap-3">
        {isDashboard ? (
          <Link
            href="/qr-generator"
            className="flex items-center gap-2 rounded-xl bg-gradient-to-br from-[#6C4DF4] to-[#8C6BFF] px-4 py-2.5 text-sm font-semibold text-white shadow-sm shadow-violet-200 hover:opacity-95"
          >
            <Plus size={16} />
            New restaurant
          </Link>
        ) : (
          <>
            <div className="hidden items-center gap-2 rounded-xl border border-[#EDEBF7] bg-[#FBFAFF] px-3 py-2 text-sm text-[#9C97B5] md:flex">
              <Search size={16} />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onFocus={openPalette}
                placeholder="Search restaurants, tables…"
                className="w-40 bg-transparent outline-none placeholder:text-[#9C97B5] lg:w-56"
              />
              <kbd className="hidden rounded-md border border-[#EDEBF7] px-1.5 py-0.5 text-[10px] font-semibold text-[#B4AFC9] lg:block">
                ⌘K
              </kbd>
            </div>

            <button className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-[#EDEBF7] text-[#6B6685] hover:bg-[#FBFAFF]">
              <Bell size={17} />
              <span className="absolute right-2.5 top-2.5 h-1.5 w-1.5 rounded-full bg-[#FF6B6B]" />
            </button>

            {user ? (
              <Link href="/Profile" aria-label="View profile">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-[#6C4DF4] to-[#8C6BFF] text-xs font-semibold text-white">
                  {getInitials(user?.name)}
                </div>
              </Link>
            ) : (
              <Link
                href="/login"
                className="rounded-xl border border-[#EDEBF7] px-4 py-2.5 text-sm font-semibold text-[#1A1730] hover:bg-[#FBFAFF]"
              >
                Log in
              </Link>
            )}
          </>
        )}
      </div>
    </header>
  );
}