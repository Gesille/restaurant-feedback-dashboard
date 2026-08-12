/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Loader2Icon, CalendarClockIcon, ClipboardListIcon } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Topbar } from "@/components/layout/Topbar";
import { useGetEmployeeAnalyticsQuery } from "@/redux/Employee/Employeeapi";

const STATUS_COLORS = ["#6C4DF4", "#B968E8", "#F0B429", "#2DD4BF", "#F472B6", "#94A3B8", "#F87171"];
const ACCENT = "#6C4DF4";

export default function EmployeeAnalyticsPage() {
  const { data, isLoading, isError } = useGetEmployeeAnalyticsQuery();

  return (
    <>
      <Topbar title="Employee Analytics" subtitle="" />

      {isLoading || !data ? (
        <div className="flex items-center justify-center gap-2 px-8 py-24 text-slate-400">
          <Loader2Icon className="size-4 animate-spin" />
          <span className="text-sm">Loading analytics…</span>
        </div>
      ) : isError ? (
        <p className="px-8 py-16 text-center text-sm text-red-600">Something went wrong loading employee analytics.</p>
      ) : (
        <div className="pb-16">
          {/* ── Header ────────────────────────────────────────────────── */}
          <div className="px-8 pt-6">
            <span className="font-['IBM_Plex_Mono'] text-xs font-semibold uppercase tracking-widest text-[#6C4DF4]">
              [ Workforce ]
            </span>
            <h1 className="mt-2 font-['Fraunces'] text-3xl italic text-slate-900 sm:text-4xl">
              Employee Analytics
            </h1>
            <p className="mt-2 max-w-xl text-sm leading-relaxed text-slate-600 sm:text-base">
              Headcount, hiring velocity, and team composition — read like a ledger, not a dashboard.
            </p>
          </div>

          {/* ── Ledger stat strip ────────────────────────────────────── */}
          <div className="mx-8 mt-6 grid grid-cols-2 divide-y divide-[#EDEBF7] rounded-2xl border border-[#EDEBF7] bg-white shadow-sm sm:grid-cols-5 sm:divide-x sm:divide-y-0">
            <LedgerStat label="Total Employees" value={data.total} />
            <LedgerStat label="Full Access" value={data.fullAccess} sub={`${data.noAccess} no access`} />
            <LedgerStat label="Hired This Month" value={data.hiredThisMonth} />
            <LedgerStat label="Avg. Tenure" value={data.avgTenureDays} sub="days" />
            <LedgerStat label="Contracts Ending" value={data.contractsNearingEndCount} warn={data.contractsNearingEndCount > 0} />
          </div>

          <div className="mt-6 grid grid-cols-1 gap-6 px-8 xl:grid-cols-5">
            {/* ── Department composition ─────────────────────────────── */}
            <div className="rounded-2xl border border-[#EDEBF7] bg-white p-6 shadow-sm xl:col-span-3">
              <div className="flex items-center justify-between">
                <h3 className="font-['Fraunces'] text-lg italic text-slate-900">Headcount by department</h3>
                <span className="font-['IBM_Plex_Mono'] text-xs text-slate-400">
                  {data.byDepartment.length} dept{data.byDepartment.length !== 1 ? "s" : ""}
                </span>
              </div>

              {data.byDepartment.length === 0 ? (
                <p className="py-10 text-center text-sm text-slate-400">No department data yet.</p>
              ) : (
                <div className="mt-5 space-y-4">
                  {data.byDepartment.map((d: any) => {
                    const pct = data.total ? Math.round((d.count / data.total) * 100) : 0;
                    return (
                      <div key={d.department}>
                        <div className="mb-1.5 flex items-center justify-between text-sm">
                          <span className="font-medium text-slate-700">{d.department}</span>
                          <span className="font-['IBM_Plex_Mono'] text-xs text-slate-400">
                            {d.count} · {pct}%
                          </span>
                        </div>
                        <div className="h-2 w-full overflow-hidden rounded-full bg-[#F5F3FF]">
                          <div
                            className="h-full rounded-full bg-linear-to-r from-[#6C4DF4] to-[#B968E8]"
                            style={{ width: `${Math.max(pct, d.count > 0 ? 3 : 0)}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* ── Status composition ─────────────────────────────────── */}
            <div className="rounded-2xl border border-[#EDEBF7] bg-white p-6 shadow-sm xl:col-span-2">
              <h3 className="font-['Fraunces'] text-lg italic text-slate-900">Employment status</h3>

              {data.byStatus.length === 0 ? (
                <p className="py-10 text-center text-sm text-slate-400">No status data yet.</p>
              ) : (
                <>
                  <div className="mt-5 flex h-3 w-full overflow-hidden rounded-full">
                    {data.byStatus.map((s: any, i: number) => (
                      <div
                        key={s.status}
                        title={`${s.status} — ${s.count}`}
                        style={{
                          width: `${data.total ? (s.count / data.total) * 100 : 0}%`,
                          backgroundColor: STATUS_COLORS[i % STATUS_COLORS.length],
                        }}
                      />
                    ))}
                  </div>

                  <ul className="mt-5 space-y-2.5">
                    {data.byStatus.map((s: any, i: number) => (
                      <li key={s.status} className="flex items-center justify-between text-sm">
                        <span className="flex min-w-0 items-center gap-2 text-slate-600">
                          <span
                            className="size-2 shrink-0 rounded-full"
                            style={{ backgroundColor: STATUS_COLORS[i % STATUS_COLORS.length] }}
                          />
                          <span className="truncate">{s.status}</span>
                        </span>
                        <span className="shrink-0 font-['IBM_Plex_Mono'] text-xs text-slate-400">
                          {s.count} · {data.total ? Math.round((s.count / data.total) * 100) : 0}%
                        </span>
                      </li>
                    ))}
                  </ul>
                </>
              )}
            </div>
          </div>

          {/* ── Hiring trend ──────────────────────────────────────────── */}
          <div className="mx-8 mt-6 rounded-2xl border border-[#EDEBF7] bg-white p-6 shadow-sm">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-['Fraunces'] text-lg italic text-slate-900">Hiring trend</h3>
                <p className="text-xs text-slate-400">New hires per month, last 6 months</p>
              </div>
              <p className="font-['IBM_Plex_Mono'] text-lg text-slate-900">
                {data.hiringTrend.reduce((s: number, m: any) => s + m.hires, 0)}
                <span className="ml-1 text-xs font-normal text-slate-400">total</span>
              </p>
            </div>
            <div className="mt-4 h-56">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data.hiringTrend} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="hiresFill" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor={ACCENT} stopOpacity={0.28} />
                      <stop offset="100%" stopColor={ACCENT} stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
                  <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#94A3B8" }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: "#94A3B8" }} axisLine={false} tickLine={false} width={28} allowDecimals={false} />
                  <Tooltip
                    contentStyle={{ borderRadius: 12, border: "1px solid #F1F5F9", boxShadow: "0 8px 24px -12px rgba(15,23,42,0.15)" }}
                    labelStyle={{ fontSize: 11, color: "#94A3B8" }}
                  />
                  <Area type="monotone" dataKey="hires" stroke={ACCENT} strokeWidth={2.5} fill="url(#hiresFill)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* ── Locations + Alerts ───────────────────────────────────── */}
          <div className="mx-8 mt-6 grid grid-cols-1 gap-6 xl:grid-cols-2">
            <div className="rounded-2xl border border-[#EDEBF7] bg-white p-6 shadow-sm">
              <h3 className="font-['Fraunces'] text-lg italic text-slate-900">Locations</h3>
              {data.byLocation.length === 0 ? (
                <p className="py-6 text-center text-sm text-slate-400">No location data yet.</p>
              ) : (
                <ul className="mt-3 divide-y divide-[#F5F3FF]">
                  {data.byLocation.map((l: any) => (
                    <li key={l.location} className="flex items-center justify-between py-2.5 text-sm">
                      <span className="text-slate-600">{l.location}</span>
                      <span className="font-['IBM_Plex_Mono'] text-slate-400">{l.count}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div className="rounded-2xl border border-[#EDEBF7] bg-white p-6 shadow-sm">
              <h3 className="font-['Fraunces'] text-lg italic text-slate-900">Needs attention</h3>
              {data.probationPendingCount === 0 && data.contractsNearingEndCount === 0 ? (
                <p className="py-6 text-center text-sm text-slate-400">Nothing pending review right now.</p>
              ) : (
                <div className="mt-3 space-y-2.5">
                  {data.probationPendingCount > 0 && (
                    <div className="flex items-center gap-3 rounded-xl border border-amber-200 bg-amber-50 px-3.5 py-2.5">
                      <ClipboardListIcon className="size-4 shrink-0 text-amber-700" />
                      <p className="text-sm text-amber-900">
                        <span className="font-semibold">{data.probationPendingCount}</span> probation review
                        {data.probationPendingCount > 1 ? "s" : ""} due
                      </p>
                    </div>
                  )}
                  {data.contractsNearingEndCount > 0 && (
                    <div className="flex items-center gap-3 rounded-xl border border-rose-200 bg-rose-50 px-3.5 py-2.5">
                      <CalendarClockIcon className="size-4 shrink-0 text-rose-700" />
                      <p className="text-sm text-rose-900">
                        <span className="font-semibold">{data.contractsNearingEndCount}</span> contract
                        {data.contractsNearingEndCount > 1 ? "s" : ""} ending within a week
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function LedgerStat({
  label,
  value,
  sub,
  warn,
}: {
  label: string;
  value: number | string;
  sub?: string;
  warn?: boolean;
}) {
  return (
    <div className="px-5 py-5">
      <p className="font-['IBM_Plex_Mono'] text-[11px] uppercase tracking-widest text-slate-400">{label}</p>
      <p className={`mt-1.5 font-['Fraunces'] text-3xl italic ${warn ? "text-rose-600" : "text-slate-900"}`}>
        {value}
        {sub && <span className="ml-1.5 font-['Inter'] text-xs font-normal not-italic text-slate-400">{sub}</span>}
      </p>
    </div>
  );
}