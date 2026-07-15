"use client";

import { QrCode, MessageSquareHeart, FileText } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { brand } from "@/lib/colors";
import { useGetRecentActivityQuery } from "@/redux/dashboard/dashboardApi";

const iconFor = { scan: QrCode, feedback: MessageSquareHeart, applicant: FileText };
const colorFor = { scan: "amber", feedback: "pink", applicant: "blue" } as const;

function timeAgo(iso: string) {
  const diffMs = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diffMs / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

export function RecentActivity() {
  const { data, isLoading } = useGetRecentActivityQuery({ limit: 15 });
  const events = data?.data ?? [];

  return (
    <Card className="flex h-91.75 flex-col p-6 font-mono-custom">
      <div className="shrink-0">
        <h3 className="text-sm font-semibold text-slate-900">Recent activity</h3>
        <p className="text-xs text-slate-400">Live feed across every location</p>
      </div>

      <div className="mt-4 min-h-0 flex-1 overflow-y-auto pr-1">
        {isLoading ? (
          <div className="space-y-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-9 animate-pulse rounded-lg bg-slate-100" />
            ))}
          </div>
        ) : events.length === 0 ? (
          <p className="text-sm text-slate-400">No activity yet.</p>
        ) : (
          <ul className="space-y-4">
            {events.map((event) => {
              const Icon = iconFor[event.type];
              const color = colorFor[event.type];
              return (
                <li key={event.id} className="flex gap-3">
                  <span
                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg"
                    style={{ backgroundColor: `${brand[color].solid}1A`, color: brand[color].solid }}
                  >
                    <Icon size={15} />
                  </span>
                  <div className="min-w-0">
                    <p className="truncate text-sm text-slate-700">
                      <span className="font-semibold text-slate-900">{event.restaurantName}</span> {event.detail}
                    </p>
                    <p className="text-xs text-slate-400">{timeAgo(event.time)}</p>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </Card>
  );
}