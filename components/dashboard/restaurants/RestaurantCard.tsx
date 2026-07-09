import Link from "next/link";
import { QrCode, BarChart3, ArrowUp, ArrowDown } from "lucide-react";
import { Card } from "@/components/ui/Card";

import { brand } from "@/lib/colors";
import { IRestaurant } from "@/types";

export function RestaurantCard({ r }: { r: IRestaurant }) {
  const c = brand[r.color];
  const isLive = r.status === "active";


  const trend = r.scansTrend;
  const hasTrend = typeof trend === "number" && trend !== 0;
  const trendUp = hasTrend && trend > 0;

  return (
    <Card
      className="group relative overflow-hidden p-0 transition-all duration-200 hover:-translate-y-1 hover:shadow-lg"
      style={{ backgroundColor: `${c.solid}0D` }}
    >
      {/* header row */}
      <div className="flex items-center justify-between px-5 pt-5">
        <span className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-slate-500">
          <span
            className="h-1.5 w-1.5 rounded-full"
            style={{
              backgroundColor: isLive ? "#22c55e" : "#cbd5e1",
              boxShadow: isLive ? "0 0 0 3px #22c55e26" : "none",
            }}
          />
          {isLive ? "Live" : "Paused"}
        </span>
        <span className="flex items-center gap-1 text-xs font-bold text-slate-700">
          <span style={{ color: c.solid }}>★</span> {r.avgRating}
        </span>
      </div>

      {/* identity */}
      <div className="flex items-center gap-3 px-5 pb-4 pt-3">
        <div
          className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl text-lg font-bold text-white shadow-sm"
          style={{ backgroundColor: c.solid }}
        >
          {r.name.charAt(0)}
        </div>
        <div className="min-w-0">
          <h3 className="truncate text-lg font-bold leading-tight text-slate-900">
            {r.name}
          </h3>
          <p className="text-xs font-medium text-slate-500">{r.tables} tables</p>
        </div>
      </div>

      {/* big stat */}
     {/* big stat */}
<div className="px-5 pb-4">
  <div
    className="rounded-2xl border-l-[3px] bg-white px-4 py-3 shadow-sm"
    style={{ borderColor: c.solid }}
  >
    <div className="flex items-baseline gap-2">
      <span className="text-3xl font-extrabold tracking-tight" style={{ color: c.solid }}>
        {r.totalScans}
      </span>

      {hasTrend && (
        <span
          className="flex items-center gap-0.5 text-xs font-bold"
          style={{ color: trendUp ? "#16a34a" : "#dc2626" }}
        >
          {trendUp ? <ArrowUp size={12} /> : <ArrowDown size={12} />}
          {Math.abs(trend)}%
        </span>
      )}
    </div>
    <span className="text-[11px] font-bold uppercase tracking-wide text-slate-400">
      scans this month
    </span>
  </div>
</div>

      {/* actions */}
      <div className="flex gap-2 px-5 pb-5">
        <Link
          href={`/restaurants/${r.id}`}
          className="flex flex-1 items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-white py-2.5 text-xs font-bold text-slate-700 transition-colors hover:bg-slate-50"
        >
          <BarChart3 size={14} /> Analytics
        </Link>
        <Link
          href={`/qr-generator?restaurant=${r.id}`}
          className="flex flex-1 items-center justify-center gap-1.5 rounded-xl py-2.5 text-xs font-bold text-white shadow-sm transition-transform group-hover:scale-[1.02] hover:shadow-md"
          style={{ backgroundColor: c.solid }}
        >
          <QrCode size={14} /> QR code
        </Link>
      </div>
    </Card>
  );
}