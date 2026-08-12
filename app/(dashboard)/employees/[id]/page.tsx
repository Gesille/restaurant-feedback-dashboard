"use client";
import { useParams, useRouter } from "next/navigation";
import { Loader2Icon } from "lucide-react";
import { Topbar } from "@/components/layout/Topbar";
import { EmployeeProfileView } from "@/components/employees/EmployeeProfileView";
import { useGetAllEmployeesQuery, useGetEmployeeByIdQuery } from "@/redux/Employee/Employeeapi";

export default function EmployeeDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const { data: profile, isLoading, isError } = useGetEmployeeByIdQuery(id);
  const { data: allEmployees } = useGetAllEmployeesQuery(undefined);

  if (isLoading) {
    return (
      <>
        <Topbar title="Employee" subtitle="Loading record…" />
        <div className="flex items-center justify-center gap-2 px-8 py-24 text-slate-400">
          <Loader2Icon className="size-4 animate-spin" />
          <span className="text-sm">Loading employee…</span>
        </div>
      </>
    );
  }

  if (isError || !profile) {
    return (
      <>
        <Topbar title="Employee" subtitle="Not found" />
        <div className="px-8 py-16 text-center text-sm text-red-600">Employee not found.</div>
      </>
    );
  }

  return (
    <>
      <Topbar title={profile.full_name} subtitle="Employee record" />
      <EmployeeProfileView profile={profile} existingEmployees={allEmployees ?? []} />
    </>
  );
}