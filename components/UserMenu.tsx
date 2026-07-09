/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import { ChevronDown, LayoutDashboard, LogOut, User as UserIcon } from "lucide-react";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";


import { userLoggedOut } from "@/redux/auth/authSlice";
import { useLazyLogOutQuery } from "@/redux/auth/authApi";

const getInitials = (name?: string) => {
  if (!name) return "??";
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[1][0]).toUpperCase();
};

export default function UserMenu({ user }: { user: any }) {
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const dispatch = useDispatch();
  const router = useRouter();
 const [triggerLogout, { isFetching: loggingOut }] = useLazyLogOutQuery();

  const isAdmin = user?.role === "admin";

  useEffect(() => {
    const onClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    const onEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onClickOutside);
    document.addEventListener("keydown", onEscape);
    return () => {
      document.removeEventListener("mousedown", onClickOutside);
      document.removeEventListener("keydown", onEscape);
    };
  }, []);

  const handleLogout = async () => {
    try {
      await triggerLogout().unwrap();
      dispatch(userLoggedOut());
      toast.success("Logged out");
      setOpen(false);
      router.push("/");
    } catch {
      toast.error("Couldn't log out. Try again.");
    }
  };

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="menu"
        aria-expanded={open}
        className="flex items-center gap-2 rounded-full pl-1 pr-2.5 py-1 hover:bg-fuchsia-50 transition-colors"
      >
        <div className="size-9 rounded-full bg-gradient-to-r from-pink-500 to-fuchsia-600 flex items-center justify-center text-white text-xs font-bold shrink-0">
          {getInitials(user?.name)}
        </div>
        <span className="text-sm font-medium max-w-[120px] truncate">{user?.name}</span>
        <motion.span animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.2 }}>
          <ChevronDown size={16} className="text-gray-400" />
        </motion.span>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            role="menu"
            initial={{ opacity: 0, y: -8, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.97 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            className="absolute right-0 mt-2 w-56 rounded-2xl border border-fuchsia-100 bg-white/95 backdrop-blur-xl shadow-xl shadow-fuchsia-900/10 overflow-hidden origin-top-right"
          >
            <div className="px-4 py-3 border-b border-fuchsia-50">
              <p className="text-sm font-semibold text-gray-900 truncate">{user?.name}</p>
              <p className="text-xs text-gray-500 truncate">{user?.email}</p>
            </div>

            <div className="py-1.5">
              <Link
                href="/Profile"
                onClick={() => setOpen(false)}
                className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-700 hover:bg-fuchsia-50 hover:text-fuchsia-700 transition-colors"
              >
                <UserIcon size={16} />
                Profile
              </Link>

              {isAdmin && (
                <Link
                  href="/dashboard"
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-700 hover:bg-fuchsia-50 hover:text-fuchsia-700 transition-colors"
                >
                  <LayoutDashboard size={16} />
                  Dashboard
                </Link>
              )}
            </div>

            <div className="py-1.5 border-t border-fuchsia-50">
              <button
                onClick={handleLogout}
                disabled={loggingOut}
                className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors disabled:opacity-50"
              >
                <LogOut size={16} />
                {loggingOut ? "Logging out..." : "Log out"}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}