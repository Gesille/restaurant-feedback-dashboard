"use client";

import { useState } from "react";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { Star, Users, MessageSquare, TrendingUp } from "lucide-react";

import { Topbar } from "@/components/layout/Topbar";
import { Card } from "@/components/ui/Card";
import {
  useGetFeedbackOverviewQuery,
  useGetWaiterPerformanceQuery,
  useGetRatingDistributionQuery,
  useGetEvaluatorsQuery,
  useGetFeedbackTrendQuery,
  TrendGranularity,
} from "@/redux/analytics/analyticsApi";

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

export default function AnalyticsPage() {
  const [granularity, setGranularity] = useState<TrendGranularity>("day");
  const [page, setPage] = useState(1);
  const pageSize = 10;

  const { data: overviewRes, isLoading: overviewLoading } =
    useGetFeedbackOverviewQuery();
  const { data: waitersRes, isLoading: waitersLoading } =
    useGetWaiterPerformanceQuery();
  const { data: distributionRes, isLoading: distributionLoading } =
    useGetRatingDistributionQuery();
  const { data: trendRes, isLoading: trendLoading } = useGetFeedbackTrendQuery({
    granularity,
  });
  const { data: evaluatorsRes, isLoading: evaluatorsLoading } = useGetEvaluatorsQuery({
    page,
    pageSize,
  });

  const overview = overviewRes?.data;
  const waiters = waitersRes?.data ?? [];
  const distribution = distributionRes?.data ?? [];
  const trend = trendRes?.data ?? [];
  const evaluators = evaluatorsRes?.data;

  const overallDistribution =
    distribution.find((d) => d.field === "overall_rating")?.distribution;

  const totalPages = evaluators ? Math.ceil(evaluators.total / evaluators.pageSize) : 1;

  return (
    <>
      <Topbar title="Feedback analytics" subtitle="Ratings, evaluators, and trends across all restaurants." />

      <div className="space-y-6 px-8 py-6">
        {/* overview stat cards */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard
            label="Total feedbacks"
            value={overviewLoading ? "—" : overview?.totalFeedbacks ?? 0}
            icon={<MessageSquare size={18} />}
          />
          <StatCard
            label="Avg overall rating"
            value={overviewLoading ? "—" : overview?.averages.overall_rating ?? 0}
            icon={<Star size={18} />}
          />
          <StatCard
            label="Very likely to recommend"
            value={
              overviewLoading
                ? "—"
                : `${overview?.recommendationPercentage["Very Likely"] ?? 0}%`
            }
            icon={<TrendingUp size={18} />}
          />
          <StatCard
            label="Evaluators"
            value={evaluatorsLoading ? "—" : evaluators?.total ?? 0}
            icon={<Users size={18} />}
          />
        </div>

        <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
          {/* trend chart */}
          <Card className="border border-slate-200 bg-white p-5">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-sm font-semibold text-slate-900">Feedback trend</h2>
              <select
                value={granularity}
                onChange={(e) => setGranularity(e.target.value as TrendGranularity)}
                className="rounded-md border border-slate-200 px-2 py-1 text-xs text-slate-600"
              >
                <option value="day">Daily</option>
                <option value="week">Weekly</option>
                <option value="month">Monthly</option>
              </select>
            </div>
            {trendLoading ? (
              <p className="py-12 text-center text-sm text-slate-400">Loading…</p>
            ) : trend.length === 0 ? (
              <p className="py-12 text-center text-sm text-slate-400">No feedback yet.</p>
            ) : (
              <ResponsiveContainer width="100%" height={260}>
                <LineChart data={trend}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="bucket" tick={{ fontSize: 11 }} />
                  <YAxis yAxisId="left" tick={{ fontSize: 11 }} />
                  <YAxis
                    yAxisId="right"
                    orientation="right"
                    domain={[0, 5]}
                    tick={{ fontSize: 11 }}
                  />
                  <Tooltip />
                  <Legend wrapperStyle={{ fontSize: 12 }} />
                  <Line
                    yAxisId="left"
                    type="monotone"
                    dataKey="feedbackCount"
                    name="Feedback count"
                    stroke="#0f172a"
                    strokeWidth={2}
                    dot={false}
                  />
                  <Line
                    yAxisId="right"
                    type="monotone"
                    dataKey="averageOverallRating"
                    name="Avg rating"
                    stroke="#94a3b8"
                    strokeWidth={2}
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            )}
          </Card>

          {/* rating distribution */}
          <Card className="border border-slate-200 bg-white p-5">
            <h2 className="mb-4 text-sm font-semibold text-slate-900">
              Overall rating distribution
            </h2>
            {distributionLoading ? (
              <p className="py-12 text-center text-sm text-slate-400">Loading…</p>
            ) : !overallDistribution ? (
              <p className="py-12 text-center text-sm text-slate-400">No data yet.</p>
            ) : (
              <ResponsiveContainer width="100%" height={260}>
                <BarChart
                  data={[1, 2, 3, 4, 5].map((star) => ({
                    star: `${star} star`,
                    count: overallDistribution[star as 1 | 2 | 3 | 4 | 5],
                  }))}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="star" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} allowDecimals={false} />
                  <Tooltip />
                  <Bar dataKey="count" fill="#0f172a" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </Card>
        </div>

        {/* recommendation breakdown */}
        <Card className="border border-slate-200 bg-white p-5">
          <h2 className="mb-4 text-sm font-semibold text-slate-900">Recommendation breakdown</h2>
          {overviewLoading ? (
            <p className="py-6 text-center text-sm text-slate-400">Loading…</p>
          ) : (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
              {(
                ["Very Likely", "Likely", "Neutral", "Unlikely", "Very Unlikely"] as const
              ).map((rec) => (
                <div key={rec} className="rounded-lg bg-slate-50 px-3 py-3 text-center">
                  <p className="text-lg font-semibold text-slate-900">
                    {overview?.recommendationBreakdown[rec] ?? 0}
                  </p>
                  <p className="text-[11px] text-slate-500">{rec}</p>
                </div>
              ))}
            </div>
          )}
        </Card>

        {/* waiter performance */}
        <Card className="border border-slate-200 bg-white p-0">
          <h2 className="px-5 pt-5 text-sm font-semibold text-slate-900">
            Waiter performance
          </h2>
          <div className="mt-3 overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-t border-slate-100 text-xs text-slate-400">
                  <th className="px-5 py-2 font-medium">Waiter</th>
                  <th className="px-3 py-2 font-medium">Feedbacks</th>
                  <th className="px-3 py-2 font-medium">Friendliness</th>
                  <th className="px-3 py-2 font-medium">Speed</th>
                  <th className="px-3 py-2 font-medium">Food quality</th>
                  <th className="px-3 py-2 font-medium">Cleanliness</th>
                  <th className="px-5 py-2 font-medium">Overall</th>
                </tr>
              </thead>
              <tbody>
                {waitersLoading ? (
                  <tr>
                    <td colSpan={7} className="px-5 py-6 text-center text-slate-400">
                      Loading…
                    </td>
                  </tr>
                ) : waiters.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-5 py-6 text-center text-slate-400">
                      No feedback yet.
                    </td>
                  </tr>
                ) : (
                  waiters.map((w) => (
                    <tr key={w.waiter_name} className="border-t border-slate-100">
                      <td className="px-5 py-2.5 font-medium text-slate-900">
                        {w.waiter_name}
                      </td>
                      <td className="px-3 py-2.5 text-slate-600">{w.feedbackCount}</td>
                      <td className="px-3 py-2.5 text-slate-600">
                        {w.averages.friendliness_rating}
                      </td>
                      <td className="px-3 py-2.5 text-slate-600">
                        {w.averages.service_speed_rating}
                      </td>
                      <td className="px-3 py-2.5 text-slate-600">
                        {w.averages.food_quality_rating}
                      </td>
                      <td className="px-3 py-2.5 text-slate-600">
                        {w.averages.cleanliness_rating}
                      </td>
                      <td className="px-5 py-2.5 font-semibold text-slate-900">
                        {w.averages.overall_rating}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </Card>

        {/* evaluators */}
        <Card className="border border-slate-200 bg-white p-0">
          <h2 className="px-5 pt-5 text-sm font-semibold text-slate-900">Evaluators</h2>
          <div className="mt-3 overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-t border-slate-100 text-xs text-slate-400">
                  <th className="px-5 py-2 font-medium">Customer</th>
                  <th className="px-3 py-2 font-medium">Email</th>
                  <th className="px-3 py-2 font-medium">Waiter</th>
                  <th className="px-3 py-2 font-medium">Rating</th>
                  <th className="px-3 py-2 font-medium">Recommendation</th>
                  <th className="px-5 py-2 font-medium">Date</th>
                </tr>
              </thead>
              <tbody>
                {evaluatorsLoading ? (
                  <tr>
                    <td colSpan={6} className="px-5 py-6 text-center text-slate-400">
                      Loading…
                    </td>
                  </tr>
                ) : !evaluators || evaluators.data.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-5 py-6 text-center text-slate-400">
                      No feedback yet.
                    </td>
                  </tr>
                ) : (
                  evaluators.data.map((e) => (
                    <tr key={e.id} className="border-t border-slate-100 align-top">
                      <td className="px-5 py-2.5 font-medium text-slate-900">
                        {e.customer_name}
                      </td>
                      <td className="px-3 py-2.5 text-slate-600">{e.customer_email}</td>
                      <td className="px-3 py-2.5 text-slate-600">{e.waiter_name}</td>
                      <td className="px-3 py-2.5 text-slate-600">
                        {e.overall_rating} <span className="text-amber-500">★</span>
                      </td>
                      <td className="px-3 py-2.5 text-slate-600">{e.recommendation}</td>
                      <td className="px-5 py-2.5 text-slate-500">
                        {new Date(e.date).toLocaleDateString()}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {evaluators && totalPages > 1 && (
            <div className="flex items-center justify-between border-t border-slate-100 px-5 py-3">
              <p className="text-xs text-slate-500">
                Page {evaluators.page} of {totalPages}
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page <= 1}
                  className="rounded-md border border-slate-200 px-3 py-1 text-xs font-medium text-slate-600 disabled:opacity-40"
                >
                  Previous
                </button>
                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page >= totalPages}
                  className="rounded-md border border-slate-200 px-3 py-1 text-xs font-medium text-slate-600 disabled:opacity-40"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </Card>
      </div>
    </>
  );
}