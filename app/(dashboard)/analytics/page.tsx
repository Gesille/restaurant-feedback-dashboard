"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Star, Users, MessageSquare, TrendingUp, ArrowUpRight } from "lucide-react";

import { Topbar } from "@/components/layout/Topbar";
import { Card } from "@/components/ui/Card";
import { useGetAllRestaurantsQuery, Restaurant } from "@/redux/restaurants/restaurantApi";
import { useGetFeedbackOverviewQuery, OverviewStats } from "@/redux/analytics/analyticsApi";

function StatCard({
  label,
  value,
  icon,
}: {
  label: string;
  value: string | number;
  icon: React.ReactNode;
}) {
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

// Each row owns its own query so we're not calling hooks in a loop.
// It reports its overview back up to the parent for the aggregate totals.
function RestaurantAnalyticsRow({
  restaurant,
  onData,
}: {
  restaurant: Restaurant;
  onData: (id: string, overview: OverviewStats | null) => void;
}) {
  const { data: overviewRes, isLoading } = useGetFeedbackOverviewQuery(restaurant.id);
  const overview = overviewRes?.data ?? null;

  useEffect(() => {
    onData(restaurant.id, overview);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [overview?.totalFeedbacks, overview?.averages.overall_rating]);

  return (
    <tr className="border-t border-slate-100">
      <td className="px-5 py-2.5">
        <p className="font-medium text-slate-900">{restaurant.x_name}</p>
        <p className="text-xs text-slate-400">{restaurant.x_location}</p>
      </td>
      <td className="px-3 py-2.5 text-slate-600">
        {isLoading ? "—" : overview?.totalFeedbacks ?? 0}
      </td>
      <td className="px-3 py-2.5 text-slate-600">
        {isLoading ? "—" : overview?.averages.overall_rating ?? "—"}
      </td>
      <td className="px-3 py-2.5 text-slate-600">
        {isLoading ? "—" : `${overview?.recommendationPercentage["Very Likely"] ?? 0}%`}
      </td>
      <td className="px-5 py-2.5 text-right">
        <Link
          href={`/restaurants/${restaurant.id}/analytics`}
          className="inline-flex items-center gap-1 text-xs font-medium text-slate-600 hover:text-slate-900"
        >
          View <ArrowUpRight size={12} />
        </Link>
      </td>
    </tr>
  );
}

export default function AllRestaurantsAnalyticsPage() {
  const { data: restaurantsRes, isLoading: restaurantsLoading } = useGetAllRestaurantsQuery();
  const restaurants = restaurantsRes?.data ?? [];

  // id -> overview, populated as each row's query resolves
  const [overviews, setOverviews] = useState<Record<string, OverviewStats | null>>({});

  const handleData = (id: string, overview: OverviewStats | null) => {
    setOverviews((prev) => {
      if (prev[id] === overview) return prev;
      return { ...prev, [id]: overview };
    });
  };

  const aggregate = useMemo(() => {
    const values = Object.values(overviews).filter(Boolean) as OverviewStats[];
    const totalFeedbacks = values.reduce((sum, o) => sum + o.totalFeedbacks, 0);

    const weightedRatingSum = values.reduce(
      (sum, o) => sum + o.averages.overall_rating * o.totalFeedbacks,
      0
    );
    const avgRating = totalFeedbacks > 0 ? weightedRatingSum / totalFeedbacks : 0;

    const veryLikelyCount = values.reduce(
      (sum, o) => sum + o.recommendationBreakdown["Very Likely"],
      0
    );
    const veryLikelyPct = totalFeedbacks > 0 ? (veryLikelyCount / totalFeedbacks) * 100 : 0;

    return {
      totalFeedbacks,
      avgRating: Math.round(avgRating * 100) / 100,
      veryLikelyPct: Math.round(veryLikelyPct * 100) / 100,
      restaurantsWithData: values.filter((o) => o.totalFeedbacks > 0).length,
    };
  }, [overviews]);

  return (
    <>
      <Topbar
        title="Analytics — all restaurants"
        subtitle="Feedback performance across every restaurant onboard."
      />

      <div className="space-y-6 px-8 py-6">
        {/* aggregate stat cards */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard
            label="Restaurants onboard"
            value={restaurantsLoading ? "—" : restaurants.length}
            icon={<Users size={18} />}
          />
          <StatCard
            label="Total feedback submissions"
            value={aggregate.totalFeedbacks}
            icon={<MessageSquare size={18} />}
          />
          <StatCard
            label="Average rating (weighted)"
            value={aggregate.avgRating || "—"}
            icon={<Star size={18} />}
          />
          <StatCard
            label="Would very likely recommend"
            value={`${aggregate.veryLikelyPct}%`}
            icon={<TrendingUp size={18} />}
          />
        </div>

        {/* per-restaurant table */}
        <Card className="border border-slate-200 bg-white p-0">
          <h2 className="px-5 pt-5 text-sm font-semibold text-slate-900">
            Restaurants
          </h2>
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
                  <tr>
                    <td colSpan={5} className="px-5 py-6 text-center text-slate-400">
                      Loading…
                    </td>
                  </tr>
                ) : restaurants.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-5 py-6 text-center text-slate-400">
                      No restaurants yet.
                    </td>
                  </tr>
                ) : (
                  restaurants.map((r) => (
                    <RestaurantAnalyticsRow key={r.id} restaurant={r} onData={handleData} />
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