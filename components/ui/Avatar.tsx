import clsx from "clsx";
import { BrandColor, brand } from "@/lib/colors";

export function Avatar({
  label,
  color = "slate",
  size = "md",
}: {
  label: string;
  color?: BrandColor;
  size?: "sm" | "md" | "lg";
}) {
  const sizes = {
    sm: "h-8 w-8 text-xs",
    md: "h-11 w-11 text-sm",
    lg: "h-14 w-14 text-lg",
  };
  return (
    <div
      className={clsx(
        "flex shrink-0 items-center justify-center rounded-xl bg-gradient-to-br font-semibold text-white",
        brand[color].grad,
        sizes[size]
      )}
    >
      {label
        .split(" ")
        .slice(0, 2)
        .map((w) => w[0])
        .join("")
        .toUpperCase()}
    </div>
  );
}
