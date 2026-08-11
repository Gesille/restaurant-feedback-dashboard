/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useState } from "react";
import {
  Loader2Icon,
  InboxIcon,
  MailIcon,
  BriefcaseIcon,
  Trash2Icon,
  ChevronLeftIcon,
  ChevronRightIcon,
  PencilIcon,
} from "lucide-react";
import { brand } from "@/lib/colors";
import { EmployeeSummary } from "@/types";
import { initials } from "./formPrimitives";

const PAGE_SIZE = 25;

export function EmployeeTable({
  employees,
  isLoading,
  isError,
  onOpen,
  onDelete,
}: {
  employees: EmployeeSummary[];
  isLoading: boolean;
  isError: boolean;
  onOpen: (emp: EmployeeSummary) => void;
  onDelete: (emp: EmployeeSummary) => void;
}) {
  const [page, setPage] = useState(1);
  const totalPages = Math.max(1, Math.ceil(employees.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const pageItems = employees.slice(
    (safePage - 1) * PAGE_SIZE,
    safePage * PAGE_SIZE,
  );

  if (isLoading) {
    return (
      <div className="mt-16 flex items-center justify-center gap-2 text-slate-400">
        <Loader2Icon className="size-4 animate-spin" />
        <span className="text-sm">Loading employees…</span>
      </div>
    );
  }
  if (isError) {
    return (
      <p className="mt-16 text-center text-sm text-red-600">
        Something went wrong loading employees.
      </p>
    );
  }
  if (employees.length === 0) {
    return (
      <div className="mt-10 rounded-2xl border border-dashed border-[#EDEBF7] bg-white px-6 py-14 text-center">
        <InboxIcon className="mx-auto size-8 text-slate-300" />
        <p className="mt-3 text-sm text-slate-500">
          No employees yet. Add your first one to get started.
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="mt-6 overflow-hidden rounded-2xl border border-[#EDEBF7] bg-white shadow-sm">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-[#EDEBF7] text-xs uppercase tracking-wide text-slate-400">
              <th className="px-4 py-3 font-medium">Employee</th>
              <th className="px-4 py-3 font-medium">Job Title</th>
              <th className="px-4 py-3 font-medium">Department</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">Hire Date</th>
              <th className="px-4 py-3 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {pageItems.map((emp: any) => (
              <tr
                key={emp.id}
                onClick={() => onOpen(emp)}
                className="cursor-pointer border-b border-[#F5F3FF] last:border-0 hover:bg-[#FBFAFF]"
              >
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div
                      className={`flex size-9 shrink-0 items-center justify-center rounded-full bg-linear-to-br ${brand.violet.grad} font-['IBM_Plex_Mono'] text-xs font-bold text-white`}
                    >
                      {initials(emp.full_name)}
                    </div>
                    <div>
                      <p className="font-['Fraunces'] italic text-slate-900 hover:text-[#6C4DF4]">
                        {emp.full_name}
                      </p>
                      {emp.work_email && (
                        <div className="flex items-center gap-1 text-xs text-slate-400">
                          <MailIcon className="size-3" />
                          {emp.work_email}
                        </div>
                      )}
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 text-slate-600">
                  <div className="flex items-center gap-1.5">
                    <BriefcaseIcon className="size-3.5 text-slate-400" />
                    {emp.job_title || "—"}
                  </div>
                </td>
                <td className="px-4 py-3 text-slate-600">
                  {emp.department || emp.division || "—"}
                </td>
                <td className="px-4 py-3">
                  <span className="rounded-full bg-[#F1EFFA] px-2.5 py-1 text-[11px] font-semibold text-[#6B6685]">
                    {emp.employment_status || "—"}
                  </span>
                </td>
                <td className="px-4 py-3 font-['IBM_Plex_Mono'] text-slate-500">
                  {emp.hire_date
                    ? new Date(emp.hire_date).toLocaleDateString()
                    : "—"}
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-end gap-2 text-slate-400">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onOpen(emp); // reuses the same handler that goes to the detail/edit page
                      }}
                      className="rounded-lg p-1.5 hover:bg-[#F1EDFF] hover:text-[#6C4DF4]"
                      title="Edit"
                    >
                      <PencilIcon className="size-4" />
                    </button>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onDelete(emp);
                      }}
                      className="rounded-lg p-1.5 hover:bg-red-50 hover:text-red-600"
                      title="Delete"
                    >
                      <Trash2Icon className="size-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="mt-4 flex items-center justify-between gap-4 rounded-xl border border-[#EDEBF7] bg-white px-4 py-2.5 text-xs text-slate-500">
          <span className="font-['IBM_Plex_Mono']">
            Showing {(safePage - 1) * PAGE_SIZE + 1}–
            {Math.min(safePage * PAGE_SIZE, employees.length)} of{" "}
            {employees.length}
          </span>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={safePage === 1}
              className="flex size-7 items-center justify-center rounded-full border border-[#EDEBF7] text-[#6C4DF4] transition hover:bg-[#F5F3FF] disabled:cursor-not-allowed disabled:opacity-40"
            >
              <ChevronLeftIcon className="size-3.5" />
            </button>
            <span className="font-['IBM_Plex_Mono'] font-medium text-slate-700">
              {safePage} / {totalPages}
            </span>
            <button
              type="button"
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={safePage === totalPages}
              className="flex size-7 items-center justify-center rounded-full border border-[#EDEBF7] text-[#6C4DF4] transition hover:bg-[#F5F3FF] disabled:cursor-not-allowed disabled:opacity-40"
            >
              <ChevronRightIcon className="size-3.5" />
            </button>
          </div>
        </div>
      )}
    </>
  );
}
