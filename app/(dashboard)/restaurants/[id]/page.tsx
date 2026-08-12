"use client";

import { use } from "react";
import { notFound } from "next/navigation";
import { QRCodeSVG } from "qrcode.react";
import { MapPin, Star, Loader2 } from "lucide-react";

import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Avatar } from "@/components/ui/Avatar";
import { Topbar } from "@/components/layout/Topbar";

import { brand } from "@/lib/colors";
import { useGetRestaurantByIdQuery } from "@/redux/restaurants/restaurantApi";

export default function RestaurantDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { data, isLoading, isError } = useGetRestaurantByIdQuery(id);
  const restaurant = data?.data;

  if (isLoading) {
    return (
      <>
        <Topbar title="Restaurant" subtitle="Loading…" />
        <div className="flex items-center justify-center gap-2 px-8 py-24 text-slate-400">
          <Loader2 size={18} className="animate-spin" />
          <span className="text-sm">Loading restaurant…</span>
        </div>
      </>
    );
  }

  // No match / bad ID — real 404, driven by the actual API response
  // instead of a static lookup table.
  if (isError || !restaurant) {
    notFound();
  }

  const theme = brand.violet; // swap in a per-restaurant color once x_color is modeled on Restaurant

  return (
    <>
      <Topbar title={restaurant.x_name} subtitle="Restaurant overview" />

      <div className="space-y-6 px-8 py-10">
        <Card className="p-6">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-center gap-4">
              <Avatar label={restaurant.x_name} color="violet" size="lg" />
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-lg font-bold text-slate-900">{restaurant.x_name}</h2>
                  <Badge color={restaurant.x_status === "paused" ? "amber" : "teal"}>
                    {restaurant.x_status === "paused" ? "Paused" : "Active"}
                  </Badge>
                </div>
                <p className="mt-1 flex items-center gap-3 text-xs text-slate-400">
                  <span className="flex items-center gap-1">
                    <MapPin size={12} /> {restaurant.x_location}
                  </span>
                  {typeof restaurant.avgRating === "number" && (
                    <span className="flex items-center gap-1">
                      <Star size={12} /> {restaurant.avgRating.toFixed(1)} avg rating
                    </span>
                  )}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4 rounded-2xl bg-slate-50 p-4">
              <div className="rounded-xl bg-white p-2.5 shadow-sm">
                <QRCodeSVG value={restaurant.x_qr_token || restaurant.id} size={72} fgColor={theme.solid} />
              </div>
              <div>
                <p className="text-xs text-slate-400">Master menu QR</p>
                <p className="max-w-45 truncate text-xs font-medium text-slate-600">
                  {restaurant.x_qr_generated ? restaurant.x_qr_token : "Not generated yet"}
                </p>
              </div>
            </div>
          </div>
        </Card>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <Card className="p-5">
            <p className="text-2xl font-bold text-slate-900">{(restaurant.totalScans ?? 0).toLocaleString()}</p>
            <p className="text-sm text-slate-400">Total scans</p>
          </Card>
          <Card className="p-5">
            <p className="text-2xl font-bold text-slate-900">
              {(restaurant.scansTrend ?? 0) >= 0 ? "+" : ""}
              {restaurant.scansTrend ?? 0}%
            </p>
            <p className="text-sm text-slate-400">Scans trend vs last month</p>
          </Card>
          <Card className="p-5">
            <p className="text-2xl font-bold text-slate-900">{(restaurant.avgRating ?? 0).toFixed(1)}</p>
            <p className="text-sm text-slate-400">Avg rating</p>
          </Card>
        </div>
      </div>
    </>
  );
}