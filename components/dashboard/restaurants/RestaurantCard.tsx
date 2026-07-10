"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronDown, QrCode, ArrowUpRight } from "lucide-react";
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
    <Card className="overflow-hidden border border-slate-200 bg-white p-0">
      {/* row */}
      <div className="flex items-center gap-4 px-5 py-4">
        <div
          className="h-2 w-2 shrink-0 rounded-full"
          style={{ backgroundColor: isLive ? "#0f172a" : "#e2e8f0" }}
        />

        <div className="min-w-0 flex-1">
          <div className="flex items-baseline gap-2">
            <h3 className="truncate text-sm font-semibold text-slate-900">
              {r.name}
            </h3>
            <span className="text-xs text-slate-400">{r.tables} tables</span>
          </div>
          <p className="text-xs text-slate-500">
            {isLive ? "Live" : "Paused"} · {r.avgRating} avg rating
          </p>
        </div>

        <div className="text-right">
          <p className="text-sm font-semibold text-slate-900">{r.totalScans}</p>
          <p className="text-[11px] text-slate-400">scans</p>
        </div>

        <button
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-label="Toggle analytics"
          className="ml-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-slate-400 transition-colors hover:bg-slate-50 hover:text-slate-600"
        >
          <ChevronDown
            size={16}
            className={`transition-transform duration-200 ${open ? "rotate-180" : ""}`}
          />
        </button>
      </div>

      {/* expanded analytics */}
      <div
        className={`grid transition-all duration-200 ease-out ${
          open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
        }`}
      >
        <div className="overflow-hidden">
          <div className="border-t border-slate-100 px-5 py-4">
            <dl className="grid grid-cols-3 divide-x divide-slate-100">
              <div className="pr-4">
                <dt className="text-[11px] text-slate-400">Total scans</dt>
                <dd className="mt-0.5 text-base font-semibold text-slate-900">
                  {r.totalScans}
                </dd>
              </div>
              <div className="px-4">
                <dt className="text-[11px] text-slate-400">Avg rating</dt>
                <dd className="mt-0.5 text-base font-semibold text-slate-900">
                  {r.avgRating}
                </dd>
              </div>
              <div className="pl-4">
                <dt className="text-[11px] text-slate-400">Trend</dt>
                <dd
                  className="mt-0.5 text-base font-semibold"
                  style={{ color: hasTrend ? (trendUp ? "#0f172a" : "#71717a") : "#0f172a" }}
                >
                  {hasTrend ? `${trendUp ? "+" : "-"}${Math.abs(trend)}%` : "—"}
                </dd>
              </div>
            </dl>

            <div className="mt-3 flex gap-2">
              <Link
                href={`/restaurants/${r.id}`}
                className="flex flex-1 items-center justify-center gap-1.5 rounded-md border border-slate-200 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50"
              >
                Full report <ArrowUpRight size={12} />
              </Link>
              <Link
                href={`/qr-generator?restaurant=${r.id}`}
                className="flex flex-1 items-center justify-center gap-1.5 rounded-md border border-slate-200 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50"
              >
                <QrCode size={12} /> QR code
              </Link>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}