"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { Star, Users, MessageSquare, TrendingUp, ArrowUpRight } from "lucide-react";

import { Topbar } from "@/components/layout/Topbar";
import { Card } from "@/components/ui/Card";
import { useGetAllRestaurantsQuery, Restaurant } from "@/redux/restaurants/restaurantApi";
import { useGetFeedbackOverviewQuery, OverviewStats } from "@/redux/analytics/analyticsApi";

function StatCard({ label, value, icon }: { label: string; value: string | number; icon: React.ReactNode }) {
  return (
    <Card className="flex items-center gap-3 border border-slate-200 bg-white p-4">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-slate-50 text-slate-500">
        {icon}
      </div>
      <div>
        <p className="text-lg font-semibold text-slate-900">{value}</p>
        <p className="text-xs text-slate-500">{label}</p>
      </div>
    </Card>
  );
}

// Owns its own query; reports data up so the parent can build charts + totals.
function RestaurantDataLoader({
  restaurant,
  onData,
}: {
  restaurant: Restaurant;
  onData: (id: string, overview: OverviewStats | null) => void;
}) {
  const { data: overviewRes } = useGetFeedbackOverviewQuery(restaurant.id);
  const overview = overviewRes?.data ?? null;

  useEffect(() => {
    onData(restaurant.id, overview);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [overview?.totalFeedbacks, overview?.averages.overall_rating]);

  return null;
}

const BAR_COLOR = "#0f172a";
const BAR_COLOR_MUTED = "#cbd5e1";

export default function AllRestaurantsAnalyticsPage() {
  const { data: restaurantsRes, isLoading: restaurantsLoading } = useGetAllRestaurantsQuery();
  const restaurants = restaurantsRes?.data ?? [];

  const [overviews, setOverviews] = useState<Record<string, OverviewStats | null>>({});

  const handleData = (id: string, overview: OverviewStats | null) => {
    setOverviews((prev) => (prev[id] === overview ? prev : { ...prev, [id]: overview }));
  };

  const rows = useMemo(
    () =>
      restaurants.map((r) => ({
        id: r.id,
        name: r.x_name,
        feedbackCount: overviews[r.id]?.totalFeedbacks ?? 0,
        avgRating: overviews[r.id]?.averages.overall_rating ?? 0,
        veryLikelyPct: overviews[r.id]?.recommendationPercentage["Very Likely"] ?? 0,
        hasData: !!overviews[r.id] && (overviews[r.id]?.totalFeedbacks ?? 0) > 0,
      })),
    [restaurants, overviews]
  );

  const ratingChartData = useMemo(
    () => [...rows].sort((a, b) => b.avgRating - a.avgRating),
    [rows]
  );
  const volumeChartData = useMemo(
    () => [...rows].sort((a, b) => b.feedbackCount - a.feedbackCount),
    [rows]
  );

  const aggregate = useMemo(() => {
    const values = Object.values(overviews).filter(Boolean) as OverviewStats[];
    const totalFeedbacks = values.reduce((sum, o) => sum + o.totalFeedbacks, 0);
    const weightedSum = values.reduce((s, o) => s + o.averages.overall_rating * o.totalFeedbacks, 0);
    const avgRating = totalFeedbacks > 0 ? weightedSum / totalFeedbacks : 0;
    const veryLikely = values.reduce((s, o) => s + o.recommendationBreakdown["Very Likely"], 0);
    return {
      totalFeedbacks,
      avgRating: Math.round(avgRating * 100) / 100,
      veryLikelyPct: totalFeedbacks > 0 ? Math.round((veryLikely / totalFeedbacks) * 10000) / 100 : 0,
    };
  }, [overviews]);

  return (
    <>
      {restaurants.map((r) => (
        <RestaurantDataLoader key={r.id} restaurant={r} onData={handleData} />
      ))}

      <Topbar title="Analytics — all restaurants" subtitle="Compare feedback performance across every restaurant." />

      <div className="space-y-6 px-8 py-6">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard label="Restaurants onboard" value={restaurantsLoading ? "—" : restaurants.length} icon={<Users size={18} />} />
          <StatCard label="Total feedback submissions" value={aggregate.totalFeedbacks} icon={<MessageSquare size={18} />} />
          <StatCard label="Average rating (weighted)" value={aggregate.avgRating || "—"} icon={<Star size={18} />} />
          <StatCard label="Would very likely recommend" value={`${aggregate.veryLikelyPct}%`} icon={<TrendingUp size={18} />} />
        </div>

        <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
          <Card className="border border-slate-200 bg-white p-5">
            <h2 className="mb-4 text-sm font-semibold text-slate-900">Average rating by restaurant</h2>
            {ratingChartData.length === 0 ? (
              <p className="py-12 text-center text-sm text-slate-400">No restaurants yet.</p>
            ) : (
              <ResponsiveContainer width="100%" height={Math.max(200, ratingChartData.length * 36)}>
                <BarChart data={ratingChartData} layout="vertical" margin={{ left: 12 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" horizontal={false} />
                  <XAxis type="number" domain={[0, 5]} tick={{ fontSize: 11 }} />
                  <YAxis type="category" dataKey="name" width={110} tick={{ fontSize: 11 }} />
                  <Tooltip />
                  <Bar dataKey="avgRating" radius={[0, 4, 4, 0]}>
                    {ratingChartData.map((r) => (
                      <Cell key={r.id} fill={r.hasData ? BAR_COLOR : BAR_COLOR_MUTED} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            )}
          </Card>

          <Card className="border border-slate-200 bg-white p-5">
            <h2 className="mb-4 text-sm font-semibold text-slate-900">Feedback volume by restaurant</h2>
            {volumeChartData.length === 0 ? (
              <p className="py-12 text-center text-sm text-slate-400">No restaurants yet.</p>
            ) : (
              <ResponsiveContainer width="100%" height={Math.max(200, volumeChartData.length * 36)}>
                <BarChart data={volumeChartData} layout="vertical" margin={{ left: 12 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" horizontal={false} />
                  <XAxis type="number" allowDecimals={false} tick={{ fontSize: 11 }} />
                  <YAxis type="category" dataKey="name" width={110} tick={{ fontSize: 11 }} />
                  <Tooltip />
                  <Bar dataKey="feedbackCount" fill={BAR_COLOR} radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </Card>
        </div>

        <Card className="border border-slate-200 bg-white p-0">
          <h2 className="px-5 pt-5 text-sm font-semibold text-slate-900">Restaurants</h2>
          <div className="mt-3 overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-t border-slate-100 text-xs text-slate-400">
                  <th className="px-5 py-2 font-medium">Restaurant</th>
                  <th className="px-3 py-2 font-medium">Feedbacks</th>
                  <th className="px-3 py-2 font-medium">Avg rating</th>
                  <th className="px-3 py-2 font-medium">Very likely %</th>
                  <th className="px-5 py-2 font-medium text-right">Details</th>
                </tr>
              </thead>
              <tbody>
                {restaurantsLoading ? (
                  <tr><td colSpan={5} className="px-5 py-6 text-center text-slate-400">Loading…</td></tr>
                ) : rows.length === 0 ? (
                  <tr><td colSpan={5} className="px-5 py-6 text-center text-slate-400">No restaurants yet.</td></tr>
                ) : (
                  rows.map((r) => (
                    <tr key={r.id} className="border-t border-slate-100">
                      <td className="px-5 py-2.5 font-medium text-slate-900">{r.name}</td>
                      <td className="px-3 py-2.5 text-slate-600">{r.feedbackCount}</td>
                      <td className="px-3 py-2.5 text-slate-600">{r.avgRating || "—"}</td>
                      <td className="px-3 py-2.5 text-slate-600">{r.veryLikelyPct}%</td>
                      <td className="px-5 py-2.5 text-right">
                        <Link href={`/restaurants/${r.id}/analytics`} className="inline-flex items-center gap-1 text-xs font-medium text-slate-600 hover:text-slate-900">
                          View <ArrowUpRight size={12} />
                        </Link>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </>
  );
}