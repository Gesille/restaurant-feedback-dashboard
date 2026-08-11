"use client";
import { useRouter } from "next/navigation";
import { Topbar } from "@/components/layout/Topbar";
import { EmployeeForm } from "@/components/employees/EmployeeForm";
import { useGetAllEmployeesQuery } from "@/redux/Employee/Employeeapi";

export default function NewEmployeePage() {
  const router = useRouter();
  const { data } = useGetAllEmployeesQuery(undefined);

  return (
    <>
      <Topbar title="New Employee" subtitle="Add a new team member" />
    <EmployeeForm
  existingEmployees={data ?? []}
  onCancel={() => router.push("/employees")}
  onCreated={(id) => router.push(`/employees/${id}`)}
/>
    </>
  );
}