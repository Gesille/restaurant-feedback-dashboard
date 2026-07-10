"use client";

import { useState } from "react";
import Link from "next/link";
import {
  QrCode,
  BarChart3,
  ArrowUp,
  ArrowDown,
  ChevronDown,
  ArrowUpRight,
} from "lucide-react";
import { Card } from "@/components/ui/Card";

import { brand } from "@/lib/colors";
import { IRestaurant } from "@/types";

export function RestaurantCard({ r }: { r: IRestaurant }) {
  const c = brand[r.color];
  const isLive = r.status === "active";
  const [open, setOpen] = useState(false);

  const trend = r.scansTrend;
  const hasTrend = typeof trend === "number" && trend !== 0;
  const trendUp = hasTrend && trend > 0;

  return (
    <Card className="overflow-hidden border border-slate-200 bg-white p-0 transition-shadow duration-200 hover:shadow-md">
      {/* header row */}
      <div className="flex items-center justify-between px-5 pt-5">
        <span className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
          <span
            className="h-1.5 w-1.5 rounded-full"
            style={{ backgroundColor: isLive ? "#22c55e" : "#cbd5e1" }}
          />
          {isLive ? "Live" : "Paused"}
        </span>
        <span className="flex items-center gap-1 text-xs font-semibold text-slate-600">
          <span className="text-amber-500">★</span> {r.avgRating}
        </span>
      </div>

      {/* identity */}
      <div className="flex items-center gap-3 px-5 pb-4 pt-3">
        <div
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-base font-semibold text-white"
          style={{ backgroundColor: c.solid }}
        >
          {r.name.charAt(0)}
        </div>
        <div className="min-w-0">
          <h3 className="truncate text-base font-semibold leading-tight text-slate-900">
            {r.name}
          </h3>
          <p className="text-xs text-slate-500">{r.tables} tables</p>
        </div>
      </div>

      {/* big stat */}
      <div className="px-5 pb-4">
        <div className="rounded-xl border border-slate-100 bg-slate-50 px-4 py-3">
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold tracking-tight text-slate-900">
              {r.totalScans}
            </span>

            {hasTrend && (
              <span
                className="flex items-center gap-0.5 text-xs font-semibold"
                style={{ color: trendUp ? "#16a34a" : "#dc2626" }}
              >
                {trendUp ? <ArrowUp size={12} /> : <ArrowDown size={12} />}
                {Math.abs(trend)}%
              </span>
            )}
          </div>
          <span className="text-[11px] font-medium uppercase tracking-wide text-slate-400">
            scans this month
          </span>
        </div>
      </div>

      {/* actions */}
      <div className="flex gap-2 px-5 pb-5">
        <button
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          className="flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-slate-200 bg-white py-2.5 text-xs font-semibold text-slate-700 transition-colors hover:bg-slate-50"
        >
          <BarChart3 size={14} /> Analytics
          <ChevronDown
            size={14}
            className={`transition-transform duration-200 ${open ? "rotate-180" : ""}`}
          />
        </button>
        <Link
          href={`/qr-generator?restaurant=${r.id}`}
          className="flex flex-1 items-center justify-center gap-1.5 rounded-lg py-2.5 text-xs font-semibold text-white transition-opacity hover:opacity-90"
          style={{ backgroundColor: c.solid }}
        >
          <QrCode size={14} /> QR code
        </Link>
      </div>

      {/* analytics drawer */}
      <div
        className={`grid transition-all duration-200 ease-out ${
          open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
        }`}
      >
        <div className="overflow-hidden">
          <div className="border-t border-slate-100 bg-slate-50 px-5 py-4">
            <div className="grid grid-cols-3 gap-3">
              <div className="rounded-lg bg-white border border-slate-100 px-3 py-2.5 text-center">
                <p className="text-lg font-bold text-slate-900">{r.totalScans}</p>
                <p className="text-[10px] font-medium uppercase tracking-wide text-slate-400">
                  Total scans
                </p>
              </div>
              <div className="rounded-lg bg-white border border-slate-100 px-3 py-2.5 text-center">
                <p className="text-lg font-bold text-slate-900">{r.avgRating}</p>
                <p className="text-[10px] font-medium uppercase tracking-wide text-slate-400">
                  Avg rating
                </p>
              </div>
              <div className="rounded-lg bg-white border border-slate-100 px-3 py-2.5 text-center">
                <p
                  className="text-lg font-bold"
                  style={{ color: trendUp ? "#16a34a" : hasTrend ? "#dc2626" : "#0f172a" }}
                >
                  {hasTrend ? `${trendUp ? "+" : "-"}${Math.abs(trend)}%` : "—"}
                </p>
                <p className="text-[10px] font-medium uppercase tracking-wide text-slate-400">
                  Trend
                </p>
              </div>
            </div>

            <Link
              href={`/restaurants/${r.id}`}
              className="mt-3 flex items-center justify-center gap-1 rounded-lg border border-slate-200 bg-white py-2 text-xs font-semibold text-slate-700 transition-colors hover:bg-slate-50"
            >
              View full report <ArrowUpRight size={12} />
            </Link>
          </div>
        </div>
      </div>
    </Card>
  );
}