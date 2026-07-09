"use client";

import {
  AreaChart,
  Area,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Card } from "@/components/ui/Card";
import { scanTrend } from "@/data/restaurants";

const ACCENT = "#6C4DF4";

export function ScansChart() {
  const peak = scanTrend.reduce(
    (max, d) => (d.scans > max.scans ? d : max),
    scanTrend[0]
  );

  const total = scanTrend.reduce((s, d) => s + d.scans, 0);
  const midpoint = Math.floor(scanTrend.length / 2);
  const firstHalf = scanTrend.slice(0, midpoint).reduce((s, d) => s + d.scans, 0);
  const secondHalf = scanTrend.slice(midpoint).reduce((s, d) => s + d.scans, 0);
  const trendPct = firstHalf ? Math.round(((secondHalf - firstHalf) / firstHalf) * 100) : 0;

  return (
    <Card className="p-6">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-sm font-semibold text-slate-900">Scan volume</h3>
          <p className="text-xs text-slate-400">Across all restaurants, last 14 days</p>
        </div>
        <div className="text-right">
          <p className="text-lg font-semibold tabular-nums text-slate-900">
            {total.toLocaleString()}
          </p>
          <p className={trendPct >= 0 ? "text-xs text-emerald-600" : "text-xs text-rose-500"}>
            {trendPct >= 0 ? "▲" : "▼"} {Math.abs(trendPct)}% vs first week
          </p>
        </div>
      </div>

      <div className="mt-4 h-64">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={scanTrend} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="scansFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={ACCENT} stopOpacity={0.32} />
                <stop offset="100%" stopColor={ACCENT} stopOpacity={0} />
              </linearGradient>
            </defs>

            <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />

            <XAxis
              dataKey="date"
              tick={{ fontSize: 11, fill: "#94A3B8" }}
              axisLine={false}
              tickLine={false}
              interval="preserveStartEnd"
            />
            <YAxis
              tick={{ fontSize: 11, fill: "#94A3B8" }}
              axisLine={false}
              tickLine={false}
              width={32}
            />

            <Tooltip content={<CustomTooltip />} cursor={{ stroke: "#E2E8F0", strokeWidth: 1 }} />

            <Area
              type="monotone"
              dataKey="scans"
              stroke={ACCENT}
              strokeWidth={2.5}
              fill="url(#scansFill)"
              dot={(props) => {
                const isPeak = props.payload.date === peak.date;
                if (!isPeak) return <></>;
                return (
                  <circle
                    key={`peak-${props.payload.date}`}
                    cx={props.cx}
                    cy={props.cy}
                    r={4}
                    fill={ACCENT}
                    stroke="#fff"
                    strokeWidth={2}
                  />
                );
              }}
              activeDot={{ r: 5, fill: ACCENT, stroke: "#fff", strokeWidth: 2 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}

function CustomTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: { value: number }[];
  label?: string;
}) {
  if (!active || !payload?.length) return null;

  return (
    <div
      style={{
        borderRadius: 12,
        border: "1px solid #F1F5F9",
        boxShadow: "0 8px 24px -12px rgba(15,23,42,0.15)",
        background: "#fff",
        padding: "8px 12px",
      }}
    >
      <p className="text-[11px] font-medium text-slate-400">{label}</p>
      <p className="text-sm font-semibold text-slate-900 tabular-nums">
        {payload[0].value.toLocaleString()} scans
      </p>
    </div>
  );
}