"use client";

import { Users } from "lucide-react";
import { useGetApplicantFunnelQuery } from "@/redux/dashboard/dashboardApi";

const STAGE_COLORS: Record<string, string> = {
  applied: "bg-violet-500",
  screening: "bg-sky-500",
  interview: "bg-amber-500",
  offer: "bg-emerald-500",
  hired: "bg-emerald-600",
  rejected: "bg-slate-300",
};

function stageColor(stage: string) {
  return STAGE_COLORS[stage.toLowerCase()] ?? "bg-slate-400";
}

function stageLabel(stage: string) {
  return stage.charAt(0).toUpperCase() + stage.slice(1);
}

export function ApplicantFunnelCard() {
  const { data, isLoading } = useGetApplicantFunnelQuery({ days: 30 });
  const funnel = data?.data;

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-violet-50 text-violet-600">
            <Users size={15} />
          </span>
          <h3 className="text-sm font-semibold text-slate-900">Hiring pipeline</h3>
        </div>
        <span className="text-xs text-slate-400">Last 30 days</span>
      </div>

      {isLoading || !funnel ? (
        <div className="space-y-2">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-6 animate-pulse rounded-md bg-slate-100" />
          ))}
        </div>
      ) : funnel.total === 0 ? (
        <p className="py-6 text-center text-sm text-slate-400">No applicants in this window yet.</p>
      ) : (
        <div className="space-y-3">
          {funnel.funnel.map((s) => (
            <div key={s.stage}>
              <div className="mb-1 flex items-center justify-between text-xs">
                <span className="font-medium text-slate-600">{stageLabel(s.stage)}</span>
                <span className="text-slate-400">
                  {s.count} · {s.percentOfTotal}%
                </span>
              </div>
              <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
                <div
                  className={`h-full rounded-full ${stageColor(s.stage)}`}
                  style={{ width: `${Math.max(s.percentOfTotal, s.count > 0 ? 3 : 0)}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}