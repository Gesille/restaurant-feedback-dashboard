import { Plus } from "lucide-react";
import { Topbar } from "@/components/layout/Topbar";
import { RestaurantCard } from "@/components/dashboard/restaurants/RestaurantCard";
import { restaurantsData } from "@/data/restaurants";


export default function RestaurantsPage() {
  return (
    <>
      <Topbar title="Restaurants" subtitle={`${restaurantsData.length} locations connected to QRSuite`} />

      <div className="px-8 py-6">
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {restaurantsData.map((r) => (
            <RestaurantCard key={r.id} r={r} />
          ))}

          <button className="flex min-h-[280px] flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-slate-200 text-slate-400 hover:border-violet-300 hover:text-violet-500">
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-50">
              <Plus size={18} />
            </span>
            <span className="text-sm font-medium">Add restaurant</span>
          </button>
        </div>
      </div>
    </>
  );
}
