"use client";

import { motion } from "motion/react";
import { FileBarChart } from "lucide-react";
import { Topbar } from "@/components/layout/Topbar";
import { RestaurantSidebar } from "@/components/reports/RestaurantSidebar";

function LedgerFonts() {
  return (
    <style jsx global>{`
      @import url("https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,400;0,9..144,500;1,9..144,400;1,9..144,500&family=Inter:wght@400;500;600&family=IBM+Plex+Mono:wght@400;500&display=swap");
    `}</style>
  );
}

export default function ReportsPickerPage() {
  return (
    <div className="mx-auto max-w-6xl font-['Inter']">
      <LedgerFonts />
      <Topbar />
      <div className="px-6 py-8">
        <motion.div initial={{ y: 16, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.5 }}>
          <span className="font-['IBM_Plex_Mono'] text-xs font-semibold uppercase tracking-widest text-fuchsia-600">
            [ Reports ]
          </span>
          <h1 className="mt-2 font-['Fraunces'] text-3xl italic text-slate-900 sm:text-4xl">
            Pick a restaurant
          </h1>
          <p className="mt-2 max-w-xl text-sm leading-relaxed text-slate-600 sm:text-base">
            Choose a restaurant to view its daily and monthly feedback report, and download a PDF summary.
          </p>
        </motion.div>
      </div>

      <div className="flex flex-col gap-6 px-6 pb-10 sm:flex-row">
        <RestaurantSidebar />
        <div className="flex flex-1 flex-col items-center justify-center rounded-2xl border border-dashed border-fuchsia-200 bg-white/50 px-6 py-20 text-center">
          <FileBarChart className="mb-3 size-8 text-fuchsia-300" />
          <p className="font-['Fraunces'] text-lg italic text-slate-700">Select a restaurant</p>
          <p className="mt-1 max-w-xs text-sm text-slate-500">
            Choose one from the list to view its feedback report.
          </p>
        </div>
      </div>
    </div>
  );
}