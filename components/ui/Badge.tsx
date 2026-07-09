import clsx from "clsx";
import { BrandColor, brand } from "@/lib/colors";

export function Badge({
  color = "slate",
  children,
  className,
}: {
  color?: BrandColor;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <span
      className={clsx(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium",
        brand[color].chip,
        className
      )}
    >
      {children}
    </span>
  );
}
