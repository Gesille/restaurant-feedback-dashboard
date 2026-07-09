"use client";

import { QRCodeSVG } from "qrcode.react";
import { ArrowUpRight, Sparkles } from "lucide-react";
import Link from "next/link";

export function QrHeroCard() {
  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#6C4DF4] via-[#7C5CF6] to-[#B968E8] p-8 text-white">
      <div className="absolute -right-10 -top-16 h-56 w-56 rounded-full bg-white/10 blur-2xl" />
      <div className="absolute -bottom-16 left-1/3 h-48 w-48 rounded-full bg-white/10 blur-2xl" />

      <div className="relative flex flex-col items-start justify-between gap-8 lg:flex-row lg:items-center">
        <div className="max-w-md">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 text-xs font-medium">
            <Sparkles size={13} /> Live QR engine
          </span>
          <h2 className="mt-4 text-2xl font-bold leading-tight">
            Every table, every menu, one scan away.
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-white/80">
            Generate a branded QR code for any restaurant, table or campaign in seconds —
            then watch the scans land here in real time.
          </p>
          <Link
            href="/qr-generator"
            className="mt-5 inline-flex items-center gap-1.5 rounded-xl bg-white px-4 py-2.5 text-sm font-semibold text-violet-700 hover:bg-white/90"
          >
            Generate a QR code
            <ArrowUpRight size={16} />
          </Link>
        </div>

        <div className="flex items-center gap-5 rounded-2xl bg-white/10 p-5 backdrop-blur">
          <div className="rounded-xl bg-white p-3">
            <QRCodeSVG value="https://menu.qrsuite.app/demo" size={104} fgColor="#4E2FD9" />
          </div>
          <div>
            <p className="text-[11px] uppercase tracking-wide text-white/70">Scanned today</p>
            <p className="text-3xl font-bold">714</p>
            <p className="mt-1 text-xs text-emerald-200">▲ 12.4% vs yesterday</p>
          </div>
        </div>
      </div>
    </div>
  );
}
