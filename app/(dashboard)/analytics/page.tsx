/* eslint-disable @typescript-eslint/no-explicit-any */

"use client";

import { Topbar } from "@/components/layout/Topbar";
import { useGetOverviewQuery, useGetWaiterPerformanceQuery, useGetRatingDistributionQuery, useGetTrendQuery, useGetEvaluatorsQuery, useGetRestaurantLeaderboardQuery } from "@/redux/analytics/feedbackAnalyticsApi";


import {
  ComposedChart,
  Area,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

/* ---------- Palette: same ledger system as the per-restaurant page ---------- */
const INK = "#26211B";
const PAPER_BASE = "#FFFFFF";
const SURFACE = "rgba(255, 255, 255, 0.6)";
const SURFACE_SOFT = "rgba(255, 255, 255, 0.4)";
const HAIRLINE = "rgba(38, 33, 27, 0.10)";
const HAIRLINE_STRONG = "rgba(38, 33, 27, 0.16)";
const MUTED = "#8C8070";
const BRASS = "#B8860B";
const BRASS_SOFT = "rgba(184, 134, 11, 0.28)";
const BORDEAUX = "#8C2F3B";
const SAGE = "#6B7A4F";

export default function GlobalAnalyticsPage() {
  // undefined restaurantId = global, same endpoints the per-restaurant page uses
  const { data: overviewRes, isLoading: loadingOverview } = useGetOverviewQuery(undefined);
  const { data: waiterRes } = useGetWaiterPerformanceQuery(undefined);
  const { data: distRes } = useGetRatingDistributionQuery(undefined);
  const { data: trendRes } = useGetTrendQuery({ restaurantId: undefined });
  const { data: evalRes } = useGetEvaluatorsQuery({ restaurantId: undefined, page: 1, pageSize: 10 });
  const { data: leaderboardRes, isLoading: loadingLeaderboard } = useGetRestaurantLeaderboardQuery();

  const overview = overviewRes?.data;
  const leaderboard = leaderboardRes?.data ?? [];

  // The service returns one distribution entry per rating field; pull "overall_rating" for this chart
  const overallDist = distRes?.data?.find((d) => d.field === "overall_rating")?.distribution;
  const maxDistCount = overallDist ? Math.max(1, ...Object.values(overallDist)) : 1;

  return (

    <div className="relative min-h-screen px-6 py-1 md:px-12" style={{ color: INK }}>
        <Topbar />
      <div className="pointer-events-none fixed inset-0 -z-10" style={{ backgroundColor: PAPER_BASE }} />

      <div className="mx-8 max-w-5xl pt-6 ">
        <p className="mb-1 text-[11px] font-medium uppercase tracking-[0.28em]" style={{ color: BRASS }}>
          Group Ledger
        </p>
        <h1 className="mb-8 font-display text-3xl italic" style={{ color: INK }}>
          Every restaurant, one book.
        </h1>

        {loadingOverview && (
          <p className="text-sm italic" style={{ color: MUTED }}>
            Reading the ledger…
          </p>
        )}

        {overview && (
          <div className="space-y-10">
            {/* Hero band */}
            <div
              className="flex flex-wrap items-center gap-x-10 gap-y-6 rounded-sm border p-6 backdrop-blur-md"
              style={{
                borderColor: HAIRLINE,
                backgroundColor: SURFACE,
                boxShadow: "0 1px 0 rgba(255,255,255,0.5) inset, 0 12px 30px -18px rgba(38,33,27,0.25)",
              }}
            >
              <div>
                <div className="flex items-baseline gap-1">
                  <span className="font-display text-6xl italic" style={{ color: BRASS }}>
                    {(overview.averages.overall_rating ?? 0).toFixed(1)}
                  </span>
                  <span className="text-sm" style={{ color: MUTED }}>
                    / 5
                  </span>
                </div>
                <p className="mt-1 text-[11px] uppercase tracking-[0.2em]" style={{ color: MUTED }}>
                  Overall rating, all restaurants
                </p>
              </div>

              <Hairline vertical />

              <LedgerStat label="Covers logged" value={overview.totalFeedbacks} />
              <Hairline vertical />
              <LedgerStat label="Restaurants tracked" value={leaderboard.length} accent={SAGE} />
              <Hairline vertical />
              <LedgerStat
                label="Last covered"
                value={overview.lastFeedbackAt ? new Date(overview.lastFeedbackAt).toLocaleDateString() : "—"}
              />
            </div>

            {/* Trend */}
            {trendRes?.data && trendRes.data.length > 0 && (
              <section>
                <SectionTitle>Service over time</SectionTitle>
                <div
                  className="h-64 rounded-sm border p-4 backdrop-blur-md"
                  style={{
                    borderColor: HAIRLINE,
                    backgroundColor: SURFACE,
                    boxShadow: "0 1px 0 rgba(255,255,255,0.5) inset, 0 12px 30px -18px rgba(38,33,27,0.25)",
                  }}
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <ComposedChart data={trendRes.data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
                      <defs>
                        <linearGradient id="ratingWashGlobal" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor={BORDEAUX} stopOpacity={0.35} />
                          <stop offset="100%" stopColor={BORDEAUX} stopOpacity={0.02} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="2 4" stroke={HAIRLINE} vertical={false} />
                      <XAxis dataKey="bucket" tick={{ fill: MUTED, fontSize: 11 }} axisLine={{ stroke: HAIRLINE }} tickLine={false} />
                      <YAxis yAxisId="left" tick={{ fill: MUTED, fontSize: 11 }} axisLine={false} tickLine={false} width={30} />
                      <YAxis
                        yAxisId="right"
                        orientation="right"
                        domain={[0, 5]}
                        tick={{ fill: MUTED, fontSize: 11 }}
                        axisLine={false}
                        tickLine={false}
                        width={26}
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "rgba(255,255,255,0.9)",
                          backdropFilter: "blur(6px)",
                          border: `1px solid ${HAIRLINE_STRONG}`,
                          borderRadius: 2,
                          fontSize: 12,
                        }}
                        labelStyle={{ color: INK, fontFamily: "var(--font-fraunces)", fontStyle: "italic" }}
                      />
                      <Bar
                        yAxisId="left"
                        dataKey="feedbackCount"
                        name="Covers"
                        fill={BRASS_SOFT}
                        stroke={BRASS}
                        strokeWidth={1}
                        radius={[2, 2, 0, 0]}
                        barSize={18}
                      />
                      <Area
                        yAxisId="right"
                        type="monotone"
                        dataKey="averageOverallRating"
                        name="Avg rating"
                        stroke={BORDEAUX}
                        strokeWidth={2}
                        fill="url(#ratingWashGlobal)"
                        dot={{ r: 2.5, fill: BORDEAUX, strokeWidth: 0 }}
                        activeDot={{ r: 4 }}
                      />
                    </ComposedChart>
                  </ResponsiveContainer>
                </div>
              </section>
            )}

            {/* Restaurant leaderboard — unique to this page */}
            <section>
              <SectionTitle>Restaurant leaderboard</SectionTitle>
              <div className="rounded-sm border backdrop-blur-md" style={{ borderColor: HAIRLINE, backgroundColor: SURFACE }}>
                {loadingLeaderboard && (
                  <p className="p-4 text-sm italic" style={{ color: MUTED }}>
                    Ranking the houses…
                  </p>
                )}
                {leaderboard
                  .slice()
                  .sort((a:any, b:any) => b.averageOverallRating - a.averageOverallRating)
                  .map((r:any, i:any) => (
                    <div
                      key={r.restaurantId}
                      className="flex items-center gap-4 border-b px-4 py-3 last:border-b-0"
                      style={{ borderColor: HAIRLINE }}
                    >
                      <span className="w-6 font-display text-sm italic" style={{ color: BRASS }}>
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <div className="flex-1 min-w-0">
                        <p className="truncate text-sm" style={{ color: INK }}>
                          {r.name ?? r.restaurantId}
                        </p>
                        {r.location && (
                          <p className="truncate text-xs" style={{ color: MUTED }}>
                            {r.location}
                          </p>
                        )}
                      </div>
                      <span className="font-mono-custom text-xs" style={{ color: MUTED }}>
                        {r.feedbackCount} covers
                      </span>
                      <ScoreBar value={r.averageOverallRating} />
                      <span className="w-8 text-right font-mono-custom text-xs" style={{ color: INK }}>
                        {r.averageOverallRating.toFixed(1)}
                      </span>
                    </div>
                  ))}
              </div>
            </section>

            <div className="grid gap-10 md:grid-cols-2">
              {/* Waiter roster — across all restaurants */}
              {waiterRes?.data && (
                <section>
                  <SectionTitle>Service roster, all houses</SectionTitle>
                  <div className="rounded-sm border backdrop-blur-md" style={{ borderColor: HAIRLINE, backgroundColor: SURFACE }}>
                    {[...waiterRes.data]
                      .sort((a, b) => (b.averages.overall_rating ?? 0) - (a.averages.overall_rating ?? 0))
                      .map((w, i) => (
                        <div
                          key={w.waiter_name}
                          className="flex items-center gap-4 border-b px-4 py-3 last:border-b-0"
                          style={{ borderColor: HAIRLINE }}
                        >
                          <span className="w-6 font-display text-sm italic" style={{ color: BRASS }}>
                            {String(i + 1).padStart(2, "0")}
                          </span>
                          <span className="flex-1 truncate text-sm" style={{ color: INK }}>
                            {w.waiter_name}
                          </span>
                          <span className="font-mono-custom text-xs" style={{ color: MUTED }}>
                            {w.feedbackCount} covers
                          </span>
                          <ScoreBar value={w.averages.overall_rating ?? 0} />
                          <span className="w-8 text-right font-mono-custom text-xs" style={{ color: INK }}>
                            {(w.averages.overall_rating ?? 0).toFixed(1)}
                          </span>
                        </div>
                      ))}
                  </div>
                </section>
              )}

              {/* Distribution */}
              {overallDist && (
                <section>
                  <SectionTitle>Overall rating spread</SectionTitle>
                  <div className="space-y-3 rounded-sm border p-4 backdrop-blur-md" style={{ borderColor: HAIRLINE, backgroundColor: SURFACE }}>
                    {[5, 4, 3, 2, 1].map((star) => {
                      const count = overallDist[star as 1 | 2 | 3 | 4 | 5] ?? 0;
                      const pct = (count / maxDistCount) * 100;
                      return (
                        <div key={star} className="flex items-center gap-3">
                          <span className="w-10 font-display text-sm italic" style={{ color: MUTED }}>
                            {star} star
                          </span>
                          <div className="h-1.5 flex-1 overflow-hidden rounded-full" style={{ backgroundColor: SURFACE_SOFT }}>
                            <div className="h-full rounded-full" style={{ width: `${pct}%`, backgroundColor: BRASS }} />
                          </div>
                          <span className="w-6 text-right font-mono-custom text-xs" style={{ color: MUTED }}>
                            {count}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </section>
              )}
            </div>

            {/* Evaluators */}
            {evalRes?.data?.data && (
              <section>
                <SectionTitle>Recent evaluations, all houses</SectionTitle>
                <div className="overflow-x-auto rounded-sm border backdrop-blur-md" style={{ borderColor: HAIRLINE, backgroundColor: SURFACE }}>
                  <table className="w-full text-sm">
                    <thead>
                      <tr
                        className="border-b text-left text-[11px] uppercase tracking-[0.15em]"
                        style={{ borderColor: HAIRLINE, color: MUTED }}
                      >
                        <th className="px-4 py-3 font-medium">Guest</th>
                        <th className="px-4 py-3 font-medium">Server</th>
                        <th className="px-4 py-3 font-medium">Rating</th>
                        <th className="px-4 py-3 font-medium">Would return</th>
                        <th className="px-4 py-3 font-medium">Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {evalRes.data.data.map((e:any) => (
                        <tr key={e.id} className="border-b last:border-b-0" style={{ borderColor: HAIRLINE }}>
                          <td className="px-4 py-3 font-display italic" style={{ color: INK }}>
                            {e.customer_name}
                          </td>
                          <td className="px-4 py-3" style={{ color: MUTED }}>
                            {e.waiter_name}
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-2">
                              <ScoreBar value={e.overall_rating} />
                              <span className="font-mono-custom text-xs" style={{ color: INK }}>
                                {e.overall_rating?.toFixed(1)}
                              </span>
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <RecommendationTag value={e.recommendation} />
                          </td>
                          <td className="px-4 py-3 font-mono-custom text-xs" style={{ color: MUTED }}>
                            {new Date(e.date).toLocaleDateString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

/* ---------- Shared bits, same as the per-restaurant analytics page ---------- */
function ScoreBar({ value, max = 5 }: { value: number; max?: number }) {
  const pct = Math.max(0, Math.min(1, value / max)) * 100;
  return (
    <div className="relative h-0.75 w-16 shrink-0 overflow-hidden rounded-full" style={{ backgroundColor: "rgba(38,33,27,0.10)" }}>
      <div className="absolute inset-y-0 left-0" style={{ width: `${pct}%`, backgroundColor: BRASS }} />
      {[1, 2, 3, 4].map((tick) => (
        <div
          key={tick}
          className="absolute inset-y-0 w-px"
          style={{ left: `${(tick / max) * 100}%`, backgroundColor: "rgba(255,255,255,0.7)" }}
        />
      ))}
    </div>
  );
}

function LedgerStat({ label, value, accent }: { label: string; value: string | number; accent?: string }) {
  return (
    <div>
      <div className="font-display text-2xl" style={{ color: accent ?? INK }}>
        {value}
      </div>
      <p className="mt-1 text-[11px] uppercase tracking-[0.2em]" style={{ color: MUTED }}>
        {label}
      </p>
    </div>
  );
}

function Hairline({ vertical }: { vertical?: boolean }) {
  return <div className={vertical ? "hidden h-10 w-px self-stretch md:block" : "h-px w-full"} style={{ backgroundColor: HAIRLINE_STRONG }} />;
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="mb-3 text-[11px] font-medium uppercase tracking-[0.22em]" style={{ color: BRASS }}>
      {children}
    </h2>
  );
}

function RecommendationTag({ value }: { value: string }) {
  const color = value === "Very Likely" || value === "Likely" ? SAGE : value === "Neutral" ? MUTED : BORDEAUX;
  return (
    <span className="rounded-full border px-2 py-0.5 text-[11px]" style={{ borderColor: color, color, backgroundColor: "rgba(255,255,255,0.4)" }}>
      {value}
    </span>
  );
}