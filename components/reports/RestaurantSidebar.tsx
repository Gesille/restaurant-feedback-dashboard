/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import Link from "next/link";
import { Loader2Icon, MapPinIcon, UtensilsIcon } from "lucide-react";
import { useGetAllRestaurantsQuery } from "@/redux/restaurants/restaurantApi";

export function RestaurantSidebar({ activeId }: { activeId?: string }) {
  const { data, isLoading, isError } = useGetAllRestaurantsQuery();
  const restaurants = data?.data ?? [];

  return (
    <aside className="w-full shrink-0 sm:sticky sm:top-6 sm:w-64">
      <p className="mb-3 px-1 font-['IBM_Plex_Mono'] text-[11px] font-semibold uppercase tracking-widest text-fuchsia-600">
        [ Restaurants ]
      </p>

      {isLoading ? (
        <div className="flex items-center gap-2 px-1 py-4 text-slate-400">
          <Loader2Icon className="size-4 animate-spin" />
          <span className="text-xs">Loading…</span>
        </div>
      ) : isError ? (
        <p className="px-1 text-xs text-red-600">Failed to load restaurants</p>
      ) : restaurants.length === 0 ? (
        <p className="px-1 text-xs text-slate-400">No restaurants found.</p>
      ) : (
        <div className="flex gap-2 overflow-x-auto pb-2 sm:flex-col sm:overflow-visible sm:pb-0">
          {restaurants.map((r: any) => {
            const id = r.id ?? r._id;
            const isActive = id === activeId;
            return (
              <Link
                key={id}
                href={`/restaurants/${id}/reports`}
                className={`flex shrink-0 items-center gap-2.5 rounded-xl border px-3 py-2.5 transition sm:shrink ${
                  isActive
                    ? "border-fuchsia-300 bg-white shadow-sm"
                    : "border-fuchsia-100 bg-white/50 hover:border-fuchsia-200 hover:bg-white/80"
                }`}
              >
                <div
                  className={`flex size-8 shrink-0 items-center justify-center rounded-lg ${
                    isActive
                      ? "bg-linear-to-br from-pink-500 via-fuchsia-600 to-purple-600"
                      : "bg-fuchsia-50"
                  }`}
                >
                  <UtensilsIcon className={`size-3.5 ${isActive ? "text-white" : "text-fuchsia-400"}`} />
                </div>
                <div className="min-w-0">
                  <p
                    className={`truncate font-['Fraunces'] text-sm italic ${
                      isActive ? "text-slate-900" : "text-slate-600"
                    }`}
                  >
                    {r.x_name ?? r.name}
                  </p>
                  {(r.x_location ?? r.location) && (
                    <p className="flex items-center gap-1 truncate text-[10px] text-slate-400">
                      <MapPinIcon className="size-2.5 shrink-0" />
                      {r.x_location ?? r.location}
                    </p>
                  )}
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </aside>
  );
}