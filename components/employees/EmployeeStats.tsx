/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useMemo } from "react";
import { IdCardIcon, ShieldCheckIcon, ShieldOffIcon, UserRoundIcon } from "lucide-react";
import { brand } from "@/lib/colors";
import { EmployeeSummary } from "@/types";

function StatCard({ label, value, icon: Icon, color }: { label: string; value: number; icon: any; color: keyof typeof brand }) {
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-[#EDEBF7] bg-white p-4 shadow-sm">
      <div className={`flex size-10 shrink-0 items-center justify-center rounded-xl bg-linear-to-br ${brand[color].grad}`}>
        <Icon className="size-5 text-white" />
      </div>
      <div>
        <p className="font-['Fraunces'] text-xl italic text-slate-900">{value}</p>
        <p className="text-xs text-slate-500">{label}</p>
      </div>
    </div>
  );
}

export function EmployeeStats({ employees }: { employees: EmployeeSummary[] }) {
  const stats = useMemo(() => {
    const total = employees.length;
    const fullAccess = employees.filter((e: any) => e.self_service_access === "full_access").length;
    const noAccess = total - fullAccess;
    const now = new Date();
    const hiredThisMonth = employees.filter((e: any) => {
      if (!e.hire_date) return false;
      const d = new Date(e.hire_date);
      return d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth();
    }).length;
    return { total, fullAccess, noAccess, hiredThisMonth };
  }, [employees]);

  return (
    <div className="grid grid-cols-2 gap-3 px-8 sm:grid-cols-4">
      <StatCard label="Total Employees" value={stats.total} icon={IdCardIcon} color="violet" />
      <StatCard label="Full Access" value={stats.fullAccess} icon={ShieldCheckIcon} color="teal" />
      <StatCard label="No Access" value={stats.noAccess} icon={ShieldOffIcon} color="slate" />
      <StatCard label="Hired This Month" value={stats.hiredThisMonth} icon={UserRoundIcon} color="amber" />
    </div>
  );
}