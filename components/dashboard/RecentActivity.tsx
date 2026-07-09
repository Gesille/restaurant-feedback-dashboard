import { QrCode, Eye, MessageSquareHeart } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { brand } from "@/lib/colors";
import { recentActivity } from "@/data/restaurants";

const iconFor = { scan: QrCode, menu_view: Eye, feedback: MessageSquareHeart };

export function RecentActivity() {
  return (
    <Card className="p-6">
      <h3 className="text-sm font-semibold text-slate-900">Recent activity</h3>
      <p className="text-xs text-slate-400">Live feed across every location</p>

      <ul className="mt-4 space-y-4">
        {recentActivity.map((event) => {
          const Icon = iconFor[event.type];
          return (
            <li key={event.id} className="flex gap-3">
              <span
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg"
                style={{ backgroundColor: `${brand[event.color].solid}1A`, color: brand[event.color].solid }}
              >
                <Icon size={15} />
              </span>
              <div className="min-w-0">
                <p className="truncate text-sm text-slate-700">
                  <span className="font-semibold text-slate-900">{event.restaurantName}</span>{" "}
                  {event.detail}
                </p>
                <p className="text-xs text-slate-400">{event.time}</p>
              </div>
            </li>
          );
        })}
      </ul>
    </Card>
  );
}
