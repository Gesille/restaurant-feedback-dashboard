// app/(dashboard)/analytics/page.tsx
"use client";

import { useGetEvaluatorsQuery, useGetOverviewQuery, useGetRatingDistributionQuery, useGetTrendQuery, useGetWaiterPerformanceQuery } from "@/redux/analytics/feedbackAnalyticsApi";
import { useGetAllRestaurantsQuery } from "@/redux/restaurants/restaurantApi";
import { useState } from "react";


import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
} from "recharts";

export default function RestaurantAnalyticsPage() {
  const { data: restaurantsRes, isLoading: loadingRestaurants } = useGetAllRestaurantsQuery();
  const [restaurantId, setRestaurantId] = useState<string | null>(null);

  const skip = !restaurantId;

  const { data: overviewRes, isLoading: loadingOverview } = useGetOverviewQuery(restaurantId!, { skip });
  const { data: waiterRes } = useGetWaiterPerformanceQuery(restaurantId!, { skip });
  const { data: distRes } = useGetRatingDistributionQuery(restaurantId!, { skip });
  const { data: trendRes } = useGetTrendQuery({ restaurantId: restaurantId! }, { skip });
  const { data: evalRes } = useGetEvaluatorsQuery({ restaurantId: restaurantId! }, { skip });

  const restaurants = restaurantsRes?.data ?? [];
  const overview = overviewRes?.data;

  return (
    <div className="p-6 space-y-6">
      {/* Restaurant picker */}
      <div className="flex flex-wrap gap-3">
        {loadingRestaurants && <span>Loading restaurants…</span>}
        {restaurants.map((r) => (
          <button
            key={r.id}
            onClick={() => setRestaurantId(r.id)}
            className={`px-4 py-2 rounded-full border text-sm transition ${
              restaurantId === r.id
                ? "bg-black text-white border-black"
                : "border-gray-300 hover:border-black"
            }`}
          >
            {r.x_name}
          </button>
        ))}
      </div>

      {!restaurantId && (
        <p className="text-gray-500">Select a restaurant to see its analytics.</p>
      )}

      {restaurantId && loadingOverview && <p>Loading analytics…</p>}

      {restaurantId && overview && (
        <>
          {/* Stat cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <StatCard label="Total Feedbacks" value={overview.totalFeedbacks} />
            <StatCard label="Avg Overall" value={overview.averages.overall_rating ?? 0} />
            <StatCard
              label="Would Recommend"
              value={`${(overview.recommendationPercentage["Very Likely"] ?? 0) +
                (overview.recommendationPercentage["Likely"] ?? 0)}%`}
            />
            <StatCard
              label="Last Feedback"
              value={overview.lastFeedbackAt ? new Date(overview.lastFeedbackAt).toLocaleDateString() : "—"}
            />
          </div>

          {/* Trend chart */}
          {trendRes?.data && (
            <div className="h-72 bg-white rounded-xl p-4 border">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={trendRes.data}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="bucket" />
                  <YAxis yAxisId="left" />
                  <YAxis yAxisId="right" orientation="right" domain={[0, 5]} />
                  <Tooltip />
                  <Line yAxisId="left" type="monotone" dataKey="feedbackCount" stroke="#1a1a1a" />
                  <Line yAxisId="right" type="monotone" dataKey="averageOverallRating" stroke="#C9A227" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}

          {/* Waiter performance */}
          {waiterRes?.data && (
            <div className="bg-white rounded-xl border p-4">
              <h3 className="font-semibold mb-3">Waiter Performance</h3>
              <div className="space-y-2">
                {waiterRes.data.map((w) => (
                  <div key={w.waiter_name} className="flex justify-between text-sm border-b py-2">
                    <span>{w.waiter_name}</span>
                    <span>{w.feedbackCount} reviews</span>
                    <span>{w.averages.overall_rating} ★</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Rating distribution (overall only, expand as needed) */}
          {distRes?.data && (
            <div className="h-64 bg-white rounded-xl p-4 border">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={Object.entries(
                    distRes.data.find((d) => d.field === "overall_rating")?.distribution ?? {}
                  ).map(([star, count]) => ({ star, count }))}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="star" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count" fill="#C9A227" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}

          {/* Evaluators table */}
          {evalRes?.data && (
            <div className="bg-white rounded-xl border p-4 overflow-x-auto">
              <h3 className="font-semibold mb-3">Recent Evaluators</h3>
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-gray-500">
                    <th className="py-2">Name</th>
                    <th>Waiter</th>
                    <th>Rating</th>
                    <th>Recommendation</th>
                    <th>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {evalRes.data.data.map((e) => (
                    <tr key={e.id} className="border-t">
                      <td className="py-2">{e.customer_name}</td>
                      <td>{e.waiter_name}</td>
                      <td>{e.overall_rating} ★</td>
                      <td>{e.recommendation}</td>
                      <td>{new Date(e.date).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="bg-white rounded-xl border p-4">
      <div className="text-xs text-gray-500">{label}</div>
      <div className="text-2xl font-bold">{value}</div>
    </div>
  );
}