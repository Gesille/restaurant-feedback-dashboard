"use client";

import { usePathname } from "next/navigation";
import { LedgerFonts } from "@/components/employees/formPrimitives";

const EMPLOYEE_DETAIL_RE = /^\/employees\/[^/]+$/;

export default function EmployeesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const isDetailPage =
    pathname ? EMPLOYEE_DETAIL_RE.test(pathname) && pathname !== "/employees/new" : false;

  return (
    <div className={isDetailPage ? "w-full" : "w-full"}>
      <LedgerFonts />
      {children}
    </div>
  );
}