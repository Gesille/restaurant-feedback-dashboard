"use client";

import { useGetRestaurantsNeedingQrQuery } from "@/redux/dashboard/dashboardApi";
import { QrCode } from "lucide-react";

export function SetupNeededCard() {
  const { data, isLoading } = useGetRestaurantsNeedingQrQuery();
  const setup = data?.data;

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-pink-50 text-pink-600">
            <QrCode size={15} />
          </span>
          <h3 className="text-sm font-semibold text-slate-900">QR setup needed</h3>
        </div>
        {!isLoading && setup && setup.count > 0 && (
          <span className="rounded-full bg-pink-50 px-2 py-0.5 text-xs font-medium text-pink-600">
            {setup.count}
          </span>
        )}
      </div>

      {isLoading || !setup ? (
        <div className="space-y-2">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-8 animate-pulse rounded-md bg-slate-100" />
          ))}
        </div>
      ) : setup.count === 0 ? (
        <p className="py-6 text-center text-sm text-slate-400">Every restaurant has a QR code. Nice.</p>
      ) : (
        <ul className="divide-y divide-slate-100">
          {setup.restaurants.slice(0, 5).map((r) => (
            <li key={r.id} className="flex items-center justify-between py-2 text-sm">
              <div className="min-w-0">
                <p className="truncate font-medium text-slate-700">{r.name}</p>
                <p className="truncate text-xs text-slate-400">{r.location}</p>
              </div>
              <a
                href={`/dashboard/restaurants/${r.id}`}
                className="ml-3 shrink-0 rounded-lg bg-pink-50 px-2.5 py-1 text-xs font-medium text-pink-600 hover:bg-pink-100"
              >
                Generate QR
              </a>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}