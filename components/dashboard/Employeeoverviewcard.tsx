/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import Link from "next/link";
import { Users2, ArrowUpRight } from "lucide-react";
import { useGetEmployeeAnalyticsQuery } from "@/redux/Employee/Employeeapi";


export function EmployeeOverviewCard() {
  const { data, isLoading } = useGetEmployeeAnalyticsQuery();

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
            <Users2 size={15} />
          </span>
          <h3 className="text-sm font-semibold text-slate-900">Team overview</h3>
        </div>
        <Link
          href="/employees/analytics"
          className="flex items-center gap-1 text-xs font-medium text-violet-600 hover:text-violet-700"
        >
          Full analytics <ArrowUpRight size={12} />
        </Link>
      </div>

      {isLoading || !data ? (
        <div className="space-y-2">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-8 animate-pulse rounded-md bg-slate-100" />
          ))}
        </div>
      ) : (
        <>
          <div className="mb-4 flex items-end justify-between rounded-xl bg-slate-50 px-4 py-3">
            <div>
              <p className="text-2xl font-semibold text-slate-900">{data.total}</p>
              <p className="text-xs text-slate-400">
                employees · {data.hiredThisMonth} hired this month
              </p>
            </div>
          </div>

          {data.byDepartment.length === 0 ? (
            <p className="py-4 text-center text-sm text-slate-400">No employee records yet.</p>
          ) : (
            <div className="space-y-2">
              {data.byDepartment.slice(0, 4).map((d: any) => (
                <div key={d.department} className="flex items-center justify-between text-sm">
                  <span className="truncate text-slate-600">{d.department}</span>
                  <span className="font-medium text-slate-900">{d.count}</span>
                </div>
              ))}
            </div>
          )}

          {(data.probationPendingCount > 0 || data.contractsNearingEndCount > 0) && (
            <div className="mt-4 flex flex-wrap gap-2 border-t border-slate-100 pt-3">
              {data.probationPendingCount > 0 && (
                <span className="rounded-full bg-amber-50 px-2.5 py-1 text-xs font-medium text-amber-700">
                  {data.probationPendingCount} probation review{data.probationPendingCount > 1 ? "s" : ""}
                </span>
              )}
              {data.contractsNearingEndCount > 0 && (
                <span className="rounded-full bg-rose-50 px-2.5 py-1 text-xs font-medium text-rose-700">
                  {data.contractsNearingEndCount} contract{data.contractsNearingEndCount > 1 ? "s" : ""} ending
                </span>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}