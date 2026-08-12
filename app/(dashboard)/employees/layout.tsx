"use client";

import { usePathname } from "next/navigation";
import { LedgerFonts } from "@/components/employees/formPrimitives";
import { Sidebar } from "@/components/layout/Sidebar";

const EMPLOYEE_DETAIL_RE = /^\/employees\/[^/]+$/;

export default function EmployeesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const isDetailPage =
    pathname !== "/employees/new" &&
    EMPLOYEE_DETAIL_RE.test(pathname);

  return (
    <>
      <LedgerFonts />

      {isDetailPage ? (
        <main className="min-h-screen w-full">
          {children}
        </main>
      ) : (
        <div className="flex min-h-screen">
          <Sidebar />

          <main className="min-w-0 flex-1">
            {children}
          </main>
        </div>
      )}
    </>
  );
}