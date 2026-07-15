/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { use, useMemo, useState } from "react";
import { motion } from "motion/react";
import {
  CalendarIcon, DownloadIcon, ChevronLeftIcon, ChevronRightIcon, Loader2Icon, StarIcon,
} from "lucide-react";
import {
  useGetDailyReportQuery,
  useGetMonthlyReportQuery,
  useGetOverviewQuery,
} from "@/redux/analytics/feedbackAnalyticsApi";
import { Topbar } from "@/components/layout/Topbar";
import { RestaurantSidebar } from "@/components/reports/RestaurantSidebar";

const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];
const DAY_LABELS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function LedgerFonts() {
  return (
    <style jsx global>{`
      @import url("https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,400;0,9..144,500;1,9..144,400;1,9..144,500&family=Inter:wght@400;500;600&family=IBM+Plex+Mono:wght@400;500&display=swap");
    `}</style>
  );
}

export default function RestaurantReportPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id: restaurantId } = use(params);

  const now = new Date();
  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth() + 1);

  const { data: overviewRes } = useGetOverviewQuery(restaurantId);
  const { data: dailyRes, isLoading: loadingDaily } = useGetDailyReportQuery({ restaurantId, year, month });
  const { data: monthlyRes } = useGetMonthlyReportQuery({ restaurantId, year });

  const overview = overviewRes?.data;
  const daily = dailyRes?.data ?? [];
  const monthly = monthlyRes?.data ?? [];

  const maxMonthlyCount = Math.max(1, ...monthly.map((m) => m.feedbackCount));

  const goPrevMonth = () => {
    if (month === 1) { setMonth(12); setYear((y) => y - 1); }
    else setMonth((m) => m - 1);
  };
  const goNextMonth = () => {
    if (month === 12) { setMonth(1); setYear((y) => y + 1); }
    else setMonth((m) => m + 1);
  };

  const pdfUrl = `${process.env.NEXT_PUBLIC_SERVER_URL}/analytics/report/${restaurantId}/pdf?year=${year}&month=${month}`;

  const firstWeekday = useMemo(() => new Date(Date.UTC(year, month - 1, 1)).getUTCDay(), [year, month]);
  const leadingBlanks = Array.from({ length: firstWeekday });

  return (
   <div className="mx-auto max-w-6xl font-['Inter']">
      <LedgerFonts />
      <Topbar />
    <div className="px-6 py-9">
        <motion.div initial={{ y: 16, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.5 }}>
          <span className="font-['IBM_Plex_Mono'] text-xs font-semibold uppercase tracking-widest text-fuchsia-600">
            [ Analytics ]
          </span>
          <h1 className="mt-2 font-['Fraunces'] text-3xl italic text-slate-900 sm:text-4xl">
            Feedback report
          </h1>
          <p className="mt-2 max-w-xl text-sm leading-relaxed text-slate-600 sm:text-base">
            Daily and monthly breakdowns for this restaurant, with a downloadable PDF summary.
          </p>
        </motion.div>


    </div>
     
 
      <div className="flex flex-col gap-6 px-6 pb-10 sm:flex-row">
        <RestaurantSidebar activeId={restaurantId} />

        <div className="min-w-0 flex-1">
          {overview && (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              <StatCard label="Total feedback" value={overview.totalFeedbacks} icon={CalendarIcon} />
              <StatCard label="Avg overall" value={(overview.averages.overall_rating ?? 0).toFixed(1)} icon={StarIcon} />
              <StatCard label="This month" value={daily.reduce((s, d) => s + d.feedbackCount, 0)} icon={CalendarIcon} />
              <StatCard
                label="Month avg"
                value={(
                  daily.filter((d) => d.feedbackCount > 0).reduce((s, d) => s + d.averageOverallRating, 0) /
                  Math.max(1, daily.filter((d) => d.feedbackCount > 0).length)
                ).toFixed(1)}
                icon={StarIcon}
              />
            </div>
          )}

          <div className="mt-6 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-fuchsia-100 bg-white/70 px-4 py-3 shadow-sm backdrop-blur-xl">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={goPrevMonth}
                className="flex size-8 items-center justify-center rounded-full border border-fuchsia-200 text-fuchsia-600 transition hover:bg-fuchsia-50"
              >
                <ChevronLeftIcon className="size-4" />
              </button>
              <span className="font-['Fraunces'] text-lg italic text-slate-900">
                {MONTH_NAMES[month - 1]} {year}
              </span>
              <button
                type="button"
                onClick={goNextMonth}
                className="flex size-8 items-center justify-center rounded-full border border-fuchsia-200 text-fuchsia-600 transition hover:bg-fuchsia-50"
              >
                <ChevronRightIcon className="size-4" />
              </button>
            </div>

            <a
              href={pdfUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 rounded-full bg-linear-to-br from-pink-500 via-fuchsia-600 to-purple-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:opacity-90"
            >
              <DownloadIcon className="size-4" />
              Download PDF report
            </a>
          </div>

          <div className="mt-6 overflow-hidden rounded-2xl border border-fuchsia-100 bg-white/70 p-4 shadow-sm backdrop-blur-xl">
            {loadingDaily ? (
              <div className="flex items-center justify-center gap-2 py-16 text-slate-400">
                <Loader2Icon className="size-4 animate-spin" />
                <span className="text-sm">Loading calendar…</span>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-7 gap-1.5 pb-2 text-center font-['IBM_Plex_Mono'] text-[10px] font-medium uppercase tracking-wide text-slate-400">
                  {DAY_LABELS.map((d) => <div key={d}>{d}</div>)}
                </div>
                <div className="grid grid-cols-7 gap-1.5">
                  {leadingBlanks.map((_, i) => <div key={`blank-${i}`} />)}
                  {daily.map((entry) => (
                    <DayCell key={entry.date} entry={entry} />
                  ))}
                </div>
              </>
            )}
          </div>

          {monthly.length > 0 && (
            <div className="mt-6 rounded-2xl border border-fuchsia-100 bg-white/70 p-5 shadow-sm backdrop-blur-xl">
              <p className="font-['IBM_Plex_Mono'] text-xs font-semibold uppercase tracking-widest text-fuchsia-600">
                {year} at a glance
              </p>
              <div className="mt-4 space-y-2.5">
                {monthly.map((m) => {
                  const pct = (m.feedbackCount / maxMonthlyCount) * 100;
                  const isActive = Number(m.month.split("-")[1]) === month;
                  return (
                    <button
                      type="button"
                      key={m.month}
                      onClick={() => setMonth(Number(m.month.split("-")[1]))}
                      className="flex w-full items-center gap-3 text-left"
                    >
                      <span
                        className={`w-10 shrink-0 font-['Fraunces'] text-sm italic ${
                          isActive ? "text-fuchsia-600" : "text-slate-500"
                        }`}
                      >
                        {MONTH_NAMES[Number(m.month.split("-")[1]) - 1].slice(0, 3)}
                      </span>
                      <div className="h-2 flex-1 overflow-hidden rounded-full bg-fuchsia-50">
                        <div
                          className="h-full rounded-full bg-linear-to-r from-pink-500 via-fuchsia-600 to-purple-600"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                      <span className="w-16 shrink-0 text-right font-['IBM_Plex_Mono'] text-xs text-slate-500">
                        {m.feedbackCount} fb
                      </span>
                      <span className="w-10 shrink-0 text-right font-['IBM_Plex_Mono'] text-xs font-medium text-slate-700">
                        {m.feedbackCount > 0 ? m.averageOverallRating.toFixed(1) : "—"}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value, icon: Icon }: { label: string; value: number | string; icon: any }) {
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-fuchsia-100 bg-white/70 p-4 shadow-sm backdrop-blur-xl">
      <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-linear-to-br from-pink-500 via-fuchsia-600 to-purple-600">
        <Icon className="size-5 text-white" />
      </div>
      <div>
        <p className="font-['Fraunces'] text-xl italic text-slate-900">{value}</p>
        <p className="text-xs text-slate-500">{label}</p>
      </div>
    </div>
  );
}

function DayCell({
  entry,
}: {
  entry: { date: string; feedbackCount: number; averageOverallRating: number };
}) {
  const dayNum = Number(entry.date.split("-")[2]);
  const hasData = entry.feedbackCount > 0;

  const intensity = hasData ? Math.min(1, entry.averageOverallRating / 5) : 0;
  const bg = hasData
    ? `rgba(192, 38, 211, ${0.08 + intensity * 0.22})`
    : "rgba(250, 245, 252, 0.5)";

  return (
    <div
      className="flex h-16 flex-col justify-between rounded-md border border-fuchsia-50 px-1.5 py-1 transition hover:border-fuchsia-200 sm:h-20"
      style={{ backgroundColor: bg }}
    >
      <span className="font-['IBM_Plex_Mono'] text-[10px] text-slate-400">{dayNum}</span>
      {hasData ? (
        <div className="flex items-baseline justify-between gap-1">
          <span className="font-['Fraunces'] text-xs italic text-fuchsia-700">
            {entry.averageOverallRating.toFixed(1)}
          </span>
          <span className="font-['IBM_Plex_Mono'] text-[9px] text-slate-400">
            {entry.feedbackCount}
          </span>
        </div>
      ) : (
        <span className="font-['IBM_Plex_Mono'] text-[9px] text-slate-300">—</span>
      )}
    </div>
  );
}