"use client";

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
import { Topbar } from "@/components/layout/Topbar";
import { Card } from "@/components/ui/Card";

import { brand } from "@/lib/colors";
import { restaurantsData } from "@/data/restaurants";

const barData = restaurantsData.map((r) => ({
  name: r.name.split(" ")[0],
  scans: r.totalScans,
  fill: brand[r.color].solid,
}));

const peakHours = [
  { hour: "9am", scans: 40 }, { hour: "11am", scans: 95 }, { hour: "1pm", scans: 210 },
  { hour: "3pm", scans: 120 }, { hour: "5pm", scans: 90 }, { hour: "7pm", scans: 260 },
  { hour: "9pm", scans: 180 },
];

export default function AnalyticsPage() {
  return (
    <>
      <Topbar title="Analytics" subtitle="Compare performance across every restaurant" />

      <div className="space-y-6 px-8 py-6">
        <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
          <Card className="p-6 xl:col-span-2">
            <h3 className="text-sm font-semibold text-slate-900">Total scans by restaurant</h3>
            <p className="text-xs text-slate-400">Lifetime scans, most recent 6 locations</p>
            <div className="mt-4 h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={barData} margin={{ left: -20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
                  <XAxis dataKey="name" tick={{ fontSize: 11, fill: "#94A3B8" }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: "#94A3B8" }} axisLine={false} tickLine={false} />
                  <Tooltip
                    contentStyle={{ borderRadius: 12, border: "1px solid #F1F5F9", fontSize: 12 }}
                    cursor={{ fill: "#F8FAFC" }}
                  />
                  <Bar dataKey="scans" radius={[8, 8, 0, 0]}>
                    {barData.map((d, i) => (
                      <Cell key={i} fill={d.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>

          {/* <Card className="p-6">
            <h3 className="text-sm font-semibold text-slate-900">Scan sources</h3>
            <p className="text-xs text-slate-400">Where scans are coming from</p>
            <div className="mt-4 h-72">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={scan}
                    dataKey="value"
                    nameKey="label"
                    innerRadius={55}
                    outerRadius={85}
                    paddingAngle={3}
                  >
                    {scanSources.map((s, i) => (
                      <Cell key={i} fill={s.color} />
                    ))}
                  </Pie>
                  <Legend
                    verticalAlign="bottom"
                    iconType="circle"
                    iconSize={8}
                    formatter={(v) => <span className="text-xs text-slate-500">{v}</span>}
                  />
                  <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid #F1F5F9", fontSize: 12 }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </Card> */}
        </div>

        <Card className="p-6">
          <h3 className="text-sm font-semibold text-slate-900">Peak scan hours</h3>
          <p className="text-xs text-slate-400">When customers scan the most, across all locations</p>
          <div className="mt-4 h-56">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={peakHours} margin={{ left: -20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
                <XAxis dataKey="hour" tick={{ fontSize: 11, fill: "#94A3B8" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: "#94A3B8" }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid #F1F5F9", fontSize: 12 }} cursor={{ fill: "#F8FAFC" }} />
                <Bar dataKey="scans" radius={[8, 8, 0, 0]} fill="#F651A8" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>
    </>
  );
}
