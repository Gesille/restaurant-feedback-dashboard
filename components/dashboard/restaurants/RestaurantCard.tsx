"use client";

import { useState } from "react";
import {
  QrCode,
  ArrowUp,
  ArrowDown,
  Loader2,
  X,
} from "lucide-react";
import { Card } from "@/components/ui/Card";

import { brand } from "@/lib/colors";
import { IRestaurant } from "@/types";
import { useGenerateQrMutation } from "@/redux/restaurants/restaurantApi";

const API_BASE_URL = process.env.NEXT_PUBLIC_SERVER_URL;

export function RestaurantCard({ r }: { r: IRestaurant }) {
  const c = brand[r.color];
  const isLive = r.status === "active";
  const [qrModalOpen, setQrModalOpen] = useState(false);

  const trend = r.scansTrend;
  const hasTrend = typeof trend === "number" && trend !== 0;
  const trendUp = hasTrend && trend > 0;
  const hasQr = Boolean(r.x_qr_generated);

  const [generateQr, { isLoading: isGenerating }] = useGenerateQrMutation();

  const handleGenerateQr = async () => {
    try {
      await generateQr(String(r.id)).unwrap();
      // generateQr invalidates ["RestaurantsWithoutQr", "Restaurant"], so
      // the list/query feeding this card will refetch and hasQr will flip.
    } catch (err) {
      console.error("Failed to generate QR code", err);
    }
  };

  const qrPrintUrl = `${API_BASE_URL}/restaurants/${r.id}/qr/print`;

  return (
    <>
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
        <div className="px-5 pb-5">
          {hasQr ? (
            <button
              onClick={() => setQrModalOpen(true)}
              className="flex w-full items-center justify-center gap-1.5 rounded-lg py-2.5 text-xs font-semibold text-white transition-opacity hover:opacity-90"
              style={{ backgroundColor: c.solid }}
            >
              <QrCode size={14} /> View QR
            </button>
          ) : (
            <button
              onClick={handleGenerateQr}
              disabled={isGenerating}
              className="flex w-full items-center justify-center gap-1.5 rounded-lg py-2.5 text-xs font-semibold text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
              style={{ backgroundColor: c.solid }}
            >
              {isGenerating ? (
                <Loader2 size={14} className="animate-spin" />
              ) : (
                <QrCode size={14} />
              )}
              {isGenerating ? "Generating..." : "Generate QR"}
            </button>
          )}
        </div>
      </Card>

      {/* QR modal */}
      {qrModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 px-4"
          onClick={() => setQrModalOpen(false)}
        >
          <div
            className="relative flex h-[85vh] w-full max-w-lg flex-col overflow-hidden rounded-2xl bg-white shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-slate-100 px-5 py-3">
              <h3 className="text-sm font-semibold text-slate-900">{r.name} — QR Code</h3>
              <button
                onClick={() => setQrModalOpen(false)}
                className="rounded-full p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
                aria-label="Close"
              >
                <X size={18} />
              </button>
            </div>

            <iframe
              src={qrPrintUrl}
              title={`${r.name} QR code`}
              className="flex-1 border-0"
            />
          </div>
        </div>
      )}
    </>
  );
}