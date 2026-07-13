"use client";

import { useMemo, useState } from "react";
import { Plus, Loader2 } from "lucide-react";
import { Topbar } from "@/components/layout/Topbar";
import { RestaurantCard } from "@/components/dashboard/restaurants/RestaurantCard";
import { useGetAllRestaurantsQuery } from "@/redux/restaurants/restaurantApi";
import { brand, type BrandColor } from "@/lib/colors";
import type { IRestaurant } from "@/types";
import type { Restaurant } from "@/redux/restaurants/restaurantApi";
import { AddRestaurantModal } from "@/components/dashboard/restaurants/AddRestaurantModal";

const brandKeys = Object.keys(brand) as BrandColor[];

function colorForId(id: string): BrandColor {
  let hash = 0;
  for (let i = 0; i < id.length; i++) hash = (hash * 31 + id.charCodeAt(i)) >>> 0;
  return brandKeys[hash % brandKeys.length];
}

function toIRestaurant(r: Restaurant): IRestaurant {
  return {
    id: r.id,
    name: r.x_name,
    color: colorForId(r.id),
    status: "active",
    tables: 0,
    avgRating: 0,
    totalScans: 0,
    scansTrend: 0,
    x_qr_generated: r.x_qr_generated,

    location: "",
    image: "",
    rating: 0,
    reviews: 0,
    website: "",

    menuViews: 0,
    scansToday: 0,
  };
}

export default function RestaurantsPage() {
  const { data, isLoading, isError } = useGetAllRestaurantsQuery();
  const [addOpen, setAddOpen] = useState(false);

  const restaurants = useMemo(() => (data?.data ?? []).map(toIRestaurant), [data]);

  return (
    <>
      <Topbar
        title="Restaurants"
        subtitle={
          isLoading
            ? "Loading locations..."
            : `${restaurants.length} locations connected to QRSuite`
        }
      />

      <div className="px-8 py-6">
        {isLoading ? (
          <div className="flex min-h-70 items-center justify-center text-slate-400">
            <Loader2 size={20} className="animate-spin" />
          </div>
        ) : isError ? (
          <div className="flex min-h-70 items-center justify-center text-sm text-red-500">
            Failed to load restaurants.
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {restaurants.map((r) => (
              <RestaurantCard key={r.id} r={r} />
            ))}

            <button
              onClick={() => setAddOpen(true)}
              className="flex min-h-70 flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-slate-200 text-slate-400 hover:border-violet-300 hover:text-violet-500"
            >
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-50">
                <Plus size={18} />
              </span>
              <span className="text-sm font-medium">Add restaurant</span>
            </button>
          </div>
        )}
      </div>

      <AddRestaurantModal open={addOpen} onClose={() => setAddOpen(false)} />
    </>
  );
}