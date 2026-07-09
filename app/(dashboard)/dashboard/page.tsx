import { QrCode, Scan, Eye, Store } from "lucide-react";
import { Topbar } from "@/components/layout/Topbar";

import { restaurantsData } from "@/data/restaurants";
import { QrHeroCard } from "@/components/dashboard/QrHeroCard";
import { StatCard } from "@/components/dashboard/StatCard";
import { ScansChart } from "@/components/dashboard/ScansChart";
import { RecentActivity } from "@/components/dashboard/RecentActivity";



export default function DashboardPage() {

  const scansToday = restaurantsData.reduce((s, r) => s + r.scansToday, 0);
  const menuViews = restaurantsData.reduce((s, r) => s + r.menuViews, 0);
  const activeQRs = restaurantsData.reduce((s, r) => s + (r.qrValue ? 1 : 0), 0);

  return (
    <>
      <Topbar title="Good morning, Admin 👋" subtitle="Here's how every restaurant is performing today." />

      <div className="space-y-6 px-8 py-6">
        <QrHeroCard />

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard label="Restaurants onboard" value={restaurantsData.length} delta="+2 this month" icon={<Store size={15} />} color="violet" />
          <StatCard label="Scans today" value={scansToday} delta="+12.4%" icon={<Scan size={15} />} color="amber" />
          <StatCard label="Menu views" value={menuViews} delta="+8.1%" icon={<Eye size={15} />} color="amber" />
          <StatCard label="Active QR codes" value={activeQRs} delta="+34 new" icon={<QrCode size={15} />} color="pink" />
        </div>

        <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
          <div className="xl:col-span-2">
            <ScansChart />
          </div>
          <RecentActivity />
        </div>

  
      </div>
    </>
  );
}
