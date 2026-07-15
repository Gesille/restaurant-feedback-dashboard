import { notFound } from "next/navigation";
import { QRCodeSVG } from "qrcode.react";
import { MapPin, Star } from "lucide-react";

import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Avatar } from "@/components/ui/Avatar";

import { brand } from "@/lib/colors";
import { getRestaurant } from "@/data/restaurants";

export default function RestaurantDetailPage({ params }: { params: { id: string } }) {
  const restaurant = getRestaurant(params.id);
  if (!restaurant) notFound();

  const theme = brand[restaurant.color] ?? brand.violet;

  return (
    <>
     
      <div className="space-y-6 px-8 py-10">
        <Card className="p-6">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-center gap-4">
              <Avatar label={restaurant.name} color={restaurant.color} size="lg" />
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-lg font-bold text-slate-900">{restaurant.name}</h2>
                  <Badge color={restaurant.status === "active" ? "teal" : "amber"}>
                    {restaurant.status === "active" ? "Active" : "Paused"}
                  </Badge>
                </div>
                <p className="mt-1 flex items-center gap-3 text-xs text-slate-400">
                  <span className="flex items-center gap-1">
                    <MapPin size={12} /> {restaurant.location}
                  </span>
                  <span className="flex items-center gap-1">
                    <Star size={12} /> {restaurant.rating} avg rating
                  </span>
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4 rounded-2xl bg-slate-50 p-4">
              <div className="rounded-xl bg-white p-2.5 shadow-sm">
                <QRCodeSVG value={restaurant.qrValue ?? restaurant.website} size={72} fgColor={theme.solid} />
              </div>
              <div>
                <p className="text-xs text-slate-400">Master menu QR</p>
                <p className="max-w-45 truncate text-xs font-medium text-slate-600">
                  {restaurant.qrValue ?? restaurant.website}
                </p>
              </div>
            </div>
          </div>
        </Card>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <Card className="p-5">
            <p className="text-2xl font-bold text-slate-900">{restaurant.scansToday.toLocaleString()}</p>
            <p className="text-sm text-slate-400">Total scans</p>
          </Card>
          <Card className="p-5">
            <p className="text-2xl font-bold text-slate-900">{restaurant.menuViews.toLocaleString()}</p>
            <p className="text-sm text-slate-400">Menu views</p>
          </Card>
         
        </div>

  
      </div>
    </>
  );
}