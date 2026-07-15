"use client";

import { QrCode, Scan, Store, FileText } from "lucide-react";
import { Topbar } from "@/components/layout/Topbar";

import { QrHeroCard } from "@/components/dashboard/QrHeroCard";
import { StatCard } from "@/components/dashboard/StatCard";
import { ScansChart } from "@/components/dashboard/ScansChart";
import { RecentActivity } from "@/components/dashboard/RecentActivity";

import { useGetAllCVsQuery } from "@/redux/careers/careersApi";
import { useGetDashboardStatsQuery } from "@/redux/dashboard/dashboardApi";
import { ApplicantFunnelCard } from "@/components/dashboard/Applicantfunnelcard";
import { ConversionRateCard } from "@/components/dashboard/Conversionratecard";
import { SetupNeededCard } from "@/components/dashboard/Setupneededcard";

export default function DashboardPage() {
  const { data: statsRes, isLoading: statsLoading } = useGetDashboardStatsQuery();
  const stats = statsRes?.data;

  const { data: cvResponse, isLoading: cvLoading } = useGetAllCVsQuery();
  const applicants = cvResponse?.data ?? [];
  const totalSubmissions = applicants.length;
  const submittedToday = applicants.filter((a) => {
    const d = new Date(a.submittedAt);
    const now = new Date();
    return d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth() && d.getDate() === now.getDate();
  }).length;

  if (statsLoading || !stats) {
    return (
      <>
        <Topbar title="Good morning, Admin 👋" subtitle="Here's how every restaurant is performing today." />
        <div className="grid grid-cols-1 gap-4 px-8 py-6 sm:grid-cols-2 xl:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-32 animate-pulse rounded-2xl bg-slate-100" />
          ))}
        </div>
      </>
    );
  }

  return (
    <>
      <Topbar title="Good morning, Admin 👋" subtitle="Here's how every restaurant is performing today." />

      <div className="space-y-6 px-8 py-6">
        <QrHeroCard />

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard
            label="Restaurants onboard"
            value={stats.restaurants.value}
            delta={`+${stats.restaurants.newThisMonth} this month`}
            icon={<Store size={15} />}
            color="violet"
          />
          <StatCard
            label="Scans today"
            value={stats.scansToday.value}
            delta={stats.scansToday.delta}
            trend={stats.scansToday.trend}
            icon={<Scan size={15} />}
            color="amber"
          />
          <StatCard
            label="CV submissions"
            value={cvLoading ? 0 : totalSubmissions}
            delta={`+${submittedToday} today`}
            icon={<FileText size={15} />}
            color="amber"
          />
          <StatCard label="Active QR codes" value={stats.activeQRs.value} delta="—" icon={<QrCode size={15} />} color="pink" />
        </div>

        <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
          <div className="xl:col-span-2">
            <ScansChart />
          </div>
          <RecentActivity />
        </div>

        <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
          <ApplicantFunnelCard />
          <ConversionRateCard />
          <SetupNeededCard />
        </div>
      </div>
    </>
  );
}