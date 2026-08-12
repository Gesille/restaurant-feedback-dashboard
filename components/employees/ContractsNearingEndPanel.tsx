/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { CalendarClockIcon } from "lucide-react";
import { useGetContractsNearingEndQuery } from "@/redux/Employee/Employeeapi";
import { EmployeeSummary } from "@/types";

export function ContractsNearingEndPanel({
  onOpen,
}: {
  onOpen: (emp: EmployeeSummary) => void;
}) {
  const { data, isLoading } = useGetContractsNearingEndQuery();
  const employees = data ?? [];

  if (isLoading || employees.length === 0) return null;

  return (
    <div className="mx-8 mt-6 rounded-2xl border border-amber-200 bg-amber-50 p-4">
      <div className="flex items-center gap-2">
        <CalendarClockIcon className="size-4 text-amber-700" />
        <p className="font-['Fraunces'] italic text-amber-900">
          {employees.length} contract{employees.length > 1 ? "s" : ""} ending soon
        </p>
      </div>
      <ul className="mt-3 divide-y divide-amber-200/60">
        {employees.map((emp: any) => (
          <li key={emp.id}>
            <button
              type="button"
              onClick={() => onOpen(emp)}
              className="flex w-full items-center justify-between gap-3 py-2 text-left text-sm hover:opacity-80"
            >
              <span className="font-medium text-amber-900">{emp.full_name}</span>
              <span className="font-['IBM_Plex_Mono'] text-xs text-amber-700">
                {emp.contract_end_date ? new Date(emp.contract_end_date).toLocaleDateString() : "—"}
              </span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}