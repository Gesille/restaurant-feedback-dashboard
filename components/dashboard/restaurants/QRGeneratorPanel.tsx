"use client";

import { useMemo, useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import { Download, Palette } from "lucide-react";
import { Card } from "@/components/ui/Card";

import { brand, BrandColor } from "@/lib/colors";
import { restaurantsData } from "@/data/restaurants";

const qrTypes = [
  { id: "menu", label: "Full menu" },
  { id: "table", label: "Table order" },
  { id: "feedback", label: "Feedback form" },
  { id: "delivery", label: "Delivery tag" },
];

const swatches: { color: BrandColor; hex: string }[] = [
  { color: "violet", hex: brand.violet.solid },
  { color: "teal", hex: brand.teal.solid },
  { color: "coral", hex: brand.coral.solid },
  { color: "amber", hex: brand.amber.solid },
  { color: "blue", hex: brand.blue.solid },
  { color: "pink", hex: brand.pink.solid },
];

export function QRGeneratorPanel({ defaultRestaurantId }: { defaultRestaurantId?: string }) {
  const initialId =
    restaurantsData.find((r) => r.id === defaultRestaurantId)?.id ?? restaurantsData[0].id;

  const [restaurantId, setRestaurantId] = useState(initialId);
  const [type, setType] = useState(qrTypes[0].id);
  const [tableNumber, setTableNumber] = useState(1);
  const [fg, setFg] = useState(swatches[0].hex);

  const restaurant = restaurantsData.find((r) => r.id === restaurantId) ?? restaurantsData[0];

  const value = useMemo(() => {
    const base = restaurant.qrValue;
    if (type === "table") return `${base}/table/${tableNumber}`;
    return `${base}/${type}`;
  }, [restaurant, type, tableNumber]);

  return (
    <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
      <Card className="p-6">
        <h3 className="text-sm font-semibold text-slate-900">Configure QR code</h3>
        <p className="text-xs text-slate-400">Choose a restaurant, what it links to, and a brand color.</p>

        <div className="mt-5">
          <label className="text-xs font-medium text-slate-600">Restaurant</label>
          <select
            value={restaurantId}
            onChange={(e) => setRestaurantId(e.target.value)}
            className="mt-1.5 w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm text-slate-700 focus:border-violet-400 focus:outline-none focus:ring-2 focus:ring-violet-100"
          >
            {restaurantsData.map((r) => (
              <option key={r.id} value={r.id}>
                {r.name}
              </option>
            ))}
          </select>
        </div>

        <div className="mt-4">
          <label className="text-xs font-medium text-slate-600">QR destination</label>
          <div className="mt-1.5 grid grid-cols-2 gap-2">
            {qrTypes.map((t) => (
              <button
                key={t.id}
                onClick={() => setType(t.id)}
                className={`rounded-xl border px-3 py-2.5 text-sm font-medium transition-colors ${
                  type === t.id
                    ? "border-violet-300 bg-violet-50 text-violet-700"
                    : "border-slate-200 text-slate-500 hover:bg-slate-50"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {type === "table" && (
          <div className="mt-4">
            <label className="text-xs font-medium text-slate-600">Table number</label>
            <input
              type="number"
              min={1}
              max={restaurant.tables}
              value={tableNumber}
              onChange={(e) => setTableNumber(Number(e.target.value))}
              className="mt-1.5 w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm focus:border-violet-400 focus:outline-none focus:ring-2 focus:ring-violet-100"
            />
          </div>
        )}

        <div className="mt-4">
          <label className="flex items-center gap-1.5 text-xs font-medium text-slate-600">
            <Palette size={13} /> Brand color
          </label>
          <div className="mt-2 flex gap-2">
            {swatches.map((s) => (
              <button
                key={s.hex}
                onClick={() => setFg(s.hex)}
                className="h-8 w-8 rounded-full ring-2 ring-offset-2 transition-transform hover:scale-105"
                style={{
                  backgroundColor: s.hex,
                  boxShadow: fg === s.hex ? `0 0 0 2px white, 0 0 0 4px ${s.hex}` : undefined,
                }}
              />
            ))}
          </div>
        </div>
      </Card>

      <Card className="flex flex-col items-center justify-center gap-5 p-6">
        <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
          <QRCodeSVG value={value} size={192} fgColor={fg} />
        </div>
        <div className="text-center">
          <p className="text-sm font-semibold text-slate-900">{restaurant.name}</p>
          <p className="max-w-[220px] truncate text-xs text-slate-400">{value}</p>
        </div>
        <button className="flex w-full items-center justify-center gap-2 rounded-xl bg-slate-900 py-2.5 text-sm font-semibold text-white hover:bg-slate-800">
          <Download size={16} /> Download PNG
        </button>
      </Card>
    </div>
  );
}
