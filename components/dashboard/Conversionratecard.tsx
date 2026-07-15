"use client";

import { TrendingUp, TrendingDown } from "lucide-react";
import { useGetConversionRateQuery } from "@/redux/dashboard/dashboardApi";

export function ConversionRateCard() {
  const { data, isLoading } = useGetConversionRateQuery({ days: 30 });
  const conversion = data?.data;

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-amber-50 text-amber-600">
            <TrendingUp size={15} />
          </span>
          <h3 className="text-sm font-semibold text-slate-900">Scan → feedback conversion</h3>
        </div>
        <span className="text-xs text-slate-400">Last {conversion?.days ?? 30} days</span>
      </div>

      {isLoading || !conversion ? (
        <div className="space-y-2">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-8 animate-pulse rounded-md bg-slate-100" />
          ))}
        </div>
      ) : (
        <>
          <div className="mb-4 flex items-end justify-between rounded-xl bg-slate-50 px-4 py-3">
            <div>
              <p className="text-2xl font-semibold text-slate-900">{conversion.overall.conversionRate}%</p>
              <p className="text-xs text-slate-400">
                {conversion.overall.feedback} feedback from {conversion.overall.scans} scans
              </p>
            </div>
          </div>

          {conversion.perRestaurant.length === 0 ? (
            <p className="py-4 text-center text-sm text-slate-400">No scans in this window yet.</p>
          ) : (
            <div className="space-y-2">
              {conversion.perRestaurant.slice(0, 5).map((r) => {
                const isAboveOverall = r.conversionRate >= conversion.overall.conversionRate;
                return (
                  <div key={r.restaurantId} className="flex items-center justify-between text-sm">
                    <span className="truncate text-slate-600">{r.restaurantName}</span>
                    <span
                      className={`flex items-center gap-1 font-medium ${
                        isAboveOverall ? "text-emerald-600" : "text-slate-400"
                      }`}
                    >
                      {isAboveOverall ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                      {r.conversionRate}%
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </>
      )}
    </div>
  );
}