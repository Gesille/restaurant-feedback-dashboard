"use client";

import { QrCode, Scan, Eye, Store, FileText } from "lucide-react";
import { Topbar } from "@/components/layout/Topbar";

import { restaurantsData } from "@/data/restaurants";
import { QrHeroCard } from "@/components/dashboard/QrHeroCard";
import { StatCard } from "@/components/dashboard/StatCard";
import { ScansChart } from "@/components/dashboard/ScansChart";
import { RecentActivity } from "@/components/dashboard/RecentActivity";
import { useGetAllCVsQuery } from "@/redux/careers/careersApi";


export default function DashboardPage() {
  const scansToday = restaurantsData.reduce((s, r) => s + r.scansToday, 0);
  const activeQRs = restaurantsData.reduce((s, r) => s + (r.qrValue ? 1 : 0), 0);

  const { data: cvResponse, isLoading: cvLoading } = useGetAllCVsQuery();
  const applicants = cvResponse?.data ?? [];

  const totalSubmissions = applicants.length;

  const submittedToday = applicants.filter((a) => {
    const submittedDate = new Date(a.submittedAt);
    const now = new Date();
    return (
      submittedDate.getFullYear() === now.getFullYear() &&
      submittedDate.getMonth() === now.getMonth() &&
      submittedDate.getDate() === now.getDate()
    );
  }).length;

  return (
    <>
      <Topbar title="Good morning, Admin 👋" subtitle="Here's how every restaurant is performing today." />

      <div className="space-y-6 px-8 py-6">
        <QrHeroCard />

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard label="Restaurants onboard" value={restaurantsData.length} delta="+2 this month" icon={<Store size={15} />} color="violet" />
          <StatCard label="Scans today" value={scansToday} delta="+12.4%" icon={<Scan size={15} />} color="amber" />
          <StatCard
            label="CV submissions"
            value={cvLoading ? 0 : totalSubmissions}
            delta={`+${submittedToday} today`}
            icon={<FileText size={15} />}
            color="amber"
          />
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