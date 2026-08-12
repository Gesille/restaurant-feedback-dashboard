"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence } from "motion/react";
import { PlusIcon, SearchIcon } from "lucide-react";
import { Topbar } from "@/components/layout/Topbar";
import { brand } from "@/lib/colors";
import { useGetAllEmployeesQuery } from "@/redux/Employee/Employeeapi";
import { EmployeeStats } from "@/components/employees/EmployeeStats";
import { EmployeeTable } from "@/components/employees/EmployeeTable";
import { DeleteConfirmModal } from "@/components/employees/DeleteConfirmModal";
import { EmployeeSummary } from "@/types";
import { ContractsNearingEndPanel } from "@/components/employees/ContractsNearingEndPanel";

export default function EmployeesPage() {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [deleteTarget, setDeleteTarget] = useState<EmployeeSummary | null>(null);

  const { data, isLoading, isError } = useGetAllEmployeesQuery(search || undefined);
  const employees = data ?? [];

  return (
    <>
      <Topbar />

      <div className="flex flex-wrap items-start justify-between gap-4 px-8 py-6">
        <div>
          <span className="font-['IBM_Plex_Mono'] text-xs font-semibold uppercase tracking-widest text-[#6C4DF4]">[ People ]</span>
          <h1 className="mt-2 font-['Fraunces'] text-3xl italic text-slate-900 sm:text-4xl">Employees</h1>
          <p className="mt-2 max-w-xl text-sm leading-relaxed text-slate-600 sm:text-base">
            Every employee record — personal, job, and compensation history.
          </p>
        </div>
        <button
          type="button"
          onClick={() => router.push("/employees/new")}
          className={`flex items-center gap-2 rounded-xl bg-linear-to-br ${brand.violet.grad} px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:opacity-90`}
        >
          <PlusIcon className="size-4" />
          Add new employee
        </button>
      </div>

      <EmployeeStats employees={employees} />
<ContractsNearingEndPanel onOpen={(emp) => router.push(`/employees/${emp.id}`)} />

      <div className="mt-8 px-8">
        <div className="relative max-w-sm">
          <SearchIcon className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name or email"
            className="w-full rounded-xl border border-transparent bg-[#F1EDFF] py-2.5 pl-10 pr-3.5 text-sm text-slate-900 outline-none placeholder:text-slate-400 focus:border-[#6C4DF4]/40 focus:bg-white"
          />
        </div>
      </div>

      <div className="px-8 pb-16">
        <EmployeeTable
          employees={employees}
          isLoading={isLoading}
          isError={isError}
          onOpen={(emp) => router.push(`/employees/${emp.id}`)}
          onDelete={setDeleteTarget}
        />
      </div>

      <AnimatePresence>
        {deleteTarget && <DeleteConfirmModal employee={deleteTarget} onClose={() => setDeleteTarget(null)} />}
      </AnimatePresence>
    </>
  );
}