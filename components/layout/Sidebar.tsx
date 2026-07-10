/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";
import { motion, type Variants } from "framer-motion";
import {
  LayoutGrid,
  UtensilsCrossed,
  QrCode,
  BarChart3,
  Settings,
  ScanLine,
  Users,
  FileBarChart,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";


import { BrandColor, brand } from "@/lib/colors";
import { useSelector } from "react-redux";

const mainNav: { href: string; label: string; icon: any; color: BrandColor; badge?: string }[] = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutGrid, color: "violet" },
  { href: "/restaurants", label: "Restaurants", icon: UtensilsCrossed, color: "teal" },
  { href: "/qr-generator", label: "QR Codes", icon: QrCode, color: "amber", badge: "12" },
  { href: "/analytics", label: "Analytics", icon: BarChart3, color: "pink" },
];

const workspaceNav: { href: string; label: string; icon: any; color: BrandColor }[] = [
  { href: "/CV", label: "New CV Submissions", icon: Users, color: "blue" },
  { href: "/reports", label: "Reports", icon: FileBarChart, color: "coral" },
  { href: "/settings", label: "Settings", icon: Settings, color: "slate" },
];

// Soft tint colors per brand key, used for icon chips when a row is inactive
const iconTint: Record<BrandColor, string> = {
  violet: "text-[#6C4DF4] bg-[#6C4DF4]/10",
  teal: "text-[#0DA5A0] bg-[#0DA5A0]/10",
  amber: "text-[#D9931F] bg-[#D9931F]/10",
  pink: "text-[#F651A8] bg-[#F651A8]/10",
  blue: "text-[#3B82F6] bg-[#3B82F6]/10",
  coral: "text-[#FF6B6B] bg-[#FF6B6B]/10",
  slate: "text-[#64748B] bg-[#64748B]/10",
};

const listVariants: Variants = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.045, delayChildren: 0.05 },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, x: -12 },
  show: { opacity: 1, x: 0, transition: { duration: 0.28, ease: "easeOut" as const } },
};

function NavRow({
  href,
  label,
  icon: Icon,
  color,
  badge,
  active,
  layoutKey,
  collapsed,
}: {
  href: string;
  label: string;
  icon: any;
  color: BrandColor;
  badge?: string;
  active: boolean;
  layoutKey: string;
  collapsed: boolean;
}) {
  return (
    <motion.div variants={itemVariants} className="relative" title={collapsed ? label : undefined}>
      <Link href={href} className="relative block">
        {active && (
          <motion.div
            layoutId={layoutKey}
            className={clsx(
              "absolute inset-0 rounded-[11px] bg-gradient-to-br shadow-[0_6px_16px_-4px_rgba(108,77,244,0.35)]",
              brand[color].grad
            )}
            transition={{ type: "spring", stiffness: 500, damping: 40 }}
          />
        )}
        <motion.div
          whileHover={{ x: active || collapsed ? 0 : 3 }}
          whileTap={{ scale: 0.97 }}
          className={clsx(
            "relative z-10 flex items-center gap-3 rounded-[11px] py-2.5 text-sm font-semibold transition-colors",
            collapsed ? "justify-center px-0" : "px-3",
            active ? "text-white" : "text-[#6B6685] hover:text-[#1A1730]"
          )}
        >
          <span
            className={clsx(
              "flex h-7 w-7 shrink-0 items-center justify-center rounded-[8px] transition-colors",
              active ? "bg-white/20 text-white" : iconTint[color]
            )}
          >
            <Icon size={16} />
          </span>
          {!collapsed && (
            <>
              <span className="truncate">{label}</span>
              {badge && (
                <motion.span
                  animate={{ scale: [1, 1.12, 1] }}
                  transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
                  className={clsx(
                    "ml-auto rounded-full px-1.5 py-0.5 text-[10px] font-bold",
                    active ? "bg-white/25 text-white" : "bg-[#FF6B6B] text-white"
                  )}
                >
                  {badge}
                </motion.span>
              )}
            </>
          )}
        </motion.div>
      </Link>
      {collapsed && badge && (
        <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-[#FF6B6B]" />
      )}
    </motion.div>
  );
}

const RAIL_WIDTH = 76;
const FULL_WIDTH = 250;

export function Sidebar() {
  const pathname = usePathname();
  const { user } = useSelector((state: any) => state.auth); 
  const [open, setOpen] = useState(true);

  return (
    <motion.aside
      initial={false}
      animate={{ width: open ? FULL_WIDTH : RAIL_WIDTH }}
      transition={{ duration: 0.28, ease: "easeInOut" }}
      className="sticky top-0 z-30 flex h-screen shrink-0 flex-col gap-1.5 overflow-hidden border-r border-[#EDEBF7] bg-white py-6 text-[#1A1730]"
    >
      {/* toggle button — sits on the edge, follows the sidebar width */}
      <motion.button
        onClick={() => setOpen((o) => !o)}
        initial={false}
        animate={{ left: open ? FULL_WIDTH - 16 : RAIL_WIDTH - 16 }}
        transition={{ duration: 0.28, ease: "easeInOut" }}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.92 }}
        className="fixed top-6 z-40 flex h-7 w-7 items-center justify-center rounded-full border border-[#EDEBF7] bg-white text-[#6B6685] shadow-sm hover:bg-[#F5F3FF]"
        aria-label={open ? "Collapse sidebar" : "Expand sidebar"}
      >
        {open ? <ChevronLeft size={14} /> : <ChevronRight size={14} />}
      </motion.button>

      {/* decorative color blobs */}
      <div className="pointer-events-none absolute -left-16 -top-20 h-56 w-56 rounded-full bg-gradient-to-br from-[#6C4DF4]/20 to-[#F651A8]/10 blur-3xl" />
      <div className="pointer-events-none absolute -right-20 top-1/2 h-48 w-48 rounded-full bg-gradient-to-br from-[#0DA5A0]/15 to-[#3B82F6]/10 blur-3xl" />

      <div
        className={clsx(
          "relative flex-1 flex flex-col overflow-y-auto overflow-x-hidden gap-1.5",
          open ? "px-[18px]" : "px-3"
        )}
      >
        <Link
          href="/"
          className={clsx(
            "flex items-center gap-2.5 pb-[26px] pt-1.5",
            open ? "px-2.5" : "justify-center px-0"
          )}
        >
          <motion.div
            whileHover={{ rotate: -8, scale: 1.05 }}
            className="flex h-[34px] w-[34px] shrink-0 items-center justify-center rounded-[10px] bg-gradient-to-br from-[#6C4DF4] to-[#F651A8] text-white"
          >
            <ScanLine size={17} />
          </motion.div>
          {open && (
            <div className="overflow-hidden whitespace-nowrap">
              <p className="text-[16.5px] font-extrabold tracking-tight leading-tight text-[#1A1730]">
                HR Dashboard
              </p>
              <p className="text-[10.5px] font-semibold uppercase tracking-widest leading-tight text-[#9C97B5]">
                Client Evaluation
              </p>
            </div>
          )}
        </Link>

        {open && (
          <p className="mb-2 mt-1 px-2.5 text-[10.5px] font-semibold uppercase tracking-widest text-[#B4AFC9]">
            Overview
          </p>
        )}
        <motion.div variants={listVariants} initial="hidden" animate="show" className="flex flex-col gap-1.5">
          {mainNav.map((item) => (
            <NavRow
              key={item.href}
              {...item}
              active={pathname === item.href}
              layoutKey="active-main"
              collapsed={!open}
            />
          ))}
        </motion.div>

        {open && (
          <p className="mb-2 mt-4 px-2.5 text-[10.5px] font-semibold uppercase tracking-widest text-[#B4AFC9]">
            Workspace
          </p>
        )}
        <motion.div
          variants={listVariants}
          initial="hidden"
          animate="show"
          className={clsx("flex flex-col gap-1.5", !open && "mt-4")}
        >
          {workspaceNav.map((item) => (
            <NavRow
              key={item.label}
              {...item}
              active={pathname === item.href}
              layoutKey="active-workspace"
              collapsed={!open}
            />
          ))}
        </motion.div>
      </div>

      <motion.div whileHover={{ y: -2 }} className={clsx("relative", open ? "px-[18px]" : "px-3")}>
        <Link
          href="/Profile"
          className={clsx(
            "flex items-center gap-2.5 rounded-[14px] border border-[#EDEBF7] bg-[#FBFAFF] hover:bg-[#F5F3FF]",
            open ? "p-3.5" : "justify-center p-2"
          )}
          title={!open ? (user?.name ?? "Guest") : undefined}
        >
          <div
            className={clsx(
              "flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br text-[13px] font-bold text-white",
              brand.teal.grad
            )}
          >
            {(user?.name ?? "Guest")
              .split(" ")
              .slice(0, 2)
              .map((w:any) => w[0])
              .join("")
              .toUpperCase()}
          </div>
          {open && (
            <div className="min-w-0 overflow-hidden whitespace-nowrap">
              <p className="truncate text-[13px] font-bold text-[#1A1730]">{user?.name ?? "Guest"}</p>
              <p className="truncate text-[11px] text-[#9C97B5]">{user?.role ?? "Not signed in"}</p>
            </div>
          )}
        </Link>
      </motion.div>
    </motion.aside>
  );
}