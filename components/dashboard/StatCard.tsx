
"use client";

import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import clsx from "clsx";
import { ReactNode, useEffect, useRef, useState } from "react";
import { Card } from "@/components/ui/Card";
import { BrandColor, brand } from "@/lib/colors";

export function StatCard({
  label,
  value,
  delta,
  trend = "up",
  icon,
  color,
  data,
}: {
  label: string;
  value: number;
  delta: string;
  trend?: "up" | "down";
  icon: ReactNode;
  color: BrandColor;
  data?: number[];
}) {
  const theme = brand[color] ?? brand.violet;
  const trendUp = trend === "up";
  const displayValue = useCountUp(value);

  const deltaMagnitude = Math.min(Math.abs(parseFloat(delta)) || 0, 100);
  const ringOffset = 100 - deltaMagnitude;

  return (
    <Card className="relative overflow-hidden p-5 font-mono-custom">
      {data && data.length > 1 && <Sparkline data={data} theme={theme} />}

      <div className="relative flex items-start justify-between">
        <div className="relative flex h-11 w-11 items-center justify-center">
          <svg viewBox="0 0 40 40" className="absolute inset-0 -rotate-90">
            <circle cx="20" cy="20" r="17" fill="none" strokeWidth="2.5" className={clsx(theme.soft, "stroke-current")} style={{ opacity: 0.20 }} />
            <circle
              cx="20" cy="20" r="17" fill="none" strokeWidth="2.5" strokeLinecap="round"
              className={clsx(theme.text, "stroke-current")}
              strokeDasharray={2 * Math.PI * 17}
              strokeDashoffset={(ringOffset / 100) * 2 * Math.PI * 17}
              style={{ transition: "stroke-dashoffset 900ms cubic-bezier(0.16, 1, 0.3, 1)" }}
            />
          </svg>
          <span className={clsx("flex h-8 w-8 items-center justify-center rounded-full", theme.soft, theme.text)}>
            {icon}
          </span>
        </div>

        <span className={clsx("flex items-center gap-0.5 rounded-full px-2 py-0.5 text-[11px] font-semibold", trendUp ? theme.soft : "bg-rose-50", trendUp ? theme.text : "text-rose-600")}>
          {trendUp ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
          {delta}
        </span>
      </div>

      <p className="mt-5 text-[28px] font-semibold leading-none tracking-tight text-slate-900 tabular-nums">
        {displayValue}
      </p>
      <p className="mt-1.5 text-[13px] text-slate-400">{label}</p>
    </Card>
  );
}



function useCountUp(target: number, duration = 900) {
  const [display, setDisplay] = useState(0);
  const startRef = useRef<number | null>(null);

  useEffect(() => {
    startRef.current = null;
    let raf: number;

    const step = (timestamp: number) => {
      if (startRef.current === null) startRef.current = timestamp;
      const progress = Math.min((timestamp - startRef.current) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
      setDisplay(Math.round(target * eased));
      if (progress < 1) raf = requestAnimationFrame(step);
    };

    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [target, duration]);

  return display.toLocaleString();
}

function Sparkline({
  data,
  theme,
}: {
  data: number[];
  theme: { text: string };
}) {
  const w = 200;
  const h = 60;
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;

  const points = data.map((d, i) => ({
    x: (i / (data.length - 1)) * w,
    y: h - ((d - min) / range) * h,
  }));

  const linePath = points
    .map((p, i) => `${i === 0 ? "M" : "L"}${p.x},${p.y}`)
    .join(" ");
  const areaPath = `${linePath} L${w},${h} L0,${h} Z`;

  const gradientId = `spark-${theme.text.replace(/[^a-z0-9]/gi, "")}`;

  return (
    <svg
      viewBox={`0 0 ${w} ${h}`}
      preserveAspectRatio="none"
      className={clsx("pointer-events-none absolute inset-x-0 bottom-0 h-16 w-full", theme.text)}
    >
      <defs>
        <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="currentColor" stopOpacity="0.16" />
          <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={areaPath} fill={`url(#${gradientId})`} stroke="none" />
      <path d={linePath} fill="none" stroke="currentColor" strokeWidth="1.5" strokeOpacity="0.5" />
    </svg>
  );
}