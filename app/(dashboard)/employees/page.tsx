/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";
import {
  IdCardIcon,
  SearchIcon,
  Loader2Icon,
  InboxIcon,
  PlusIcon,
  ArrowLeftIcon,
  Trash2Icon,
  MailIcon,
  
  BriefcaseIcon,
  UserRoundIcon,
  ShieldCheckIcon,
  ShieldOffIcon,
  AlertTriangleIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from "lucide-react";

import { CreateEmployeeRequest, EmployeeSummary } from "@/types";

import { Topbar } from "@/components/layout/Topbar";
import { brand, ink } from "@/lib/colors";
import { useCreateEmployeeMutation, useDeleteEmployeeMutation, useGetAllEmployeesQuery } from "@/redux/Employee/Employeeapi";

const PAGE_SIZE = 25;

function LedgerFonts() {
  return (
    <style jsx global>{`
      @import url("https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,400;0,9..144,500;1,9..144,400;1,9..144,500&family=Inter:wght@400;500;600&family=IBM+Plex+Mono:wght@400;500&display=swap");
    `}</style>
  );
}

function initials(name: string) {
  return name
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();
}

export default function EmployeesPage() {
  const [viewMode, setViewMode] = useState<"list" | "create">("list");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [deleteTarget, setDeleteTarget] = useState<EmployeeSummary | null>(null);
  const router = useRouter();

  const { data, isLoading, isError } = useGetAllEmployeesQuery(
    search || undefined,
  );
  const employees = data ?? [];

  const totalPages = Math.max(1, Math.ceil(employees.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const pageItems = employees.slice(
    (safePage - 1) * PAGE_SIZE,
    safePage * PAGE_SIZE,
  );

  const stats = useMemo(() => {
    const total = employees.length;
    const fullAccess = employees.filter(
      (e:any) => e.self_service_access === "full_access",
    ).length;
    const noAccess = total - fullAccess;
    const now = new Date();
    const hiredThisMonth = employees.filter((e:any) => {
      if (!e.hire_date) return false;
      const d = new Date(e.hire_date);
      return d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth();
    }).length;
    return { total, fullAccess, noAccess, hiredThisMonth };
  }, [employees]);

  return (
    <div className="mx-auto max-w-6xl font-['Inter']">
      <LedgerFonts />
      <Topbar />

      <AnimatePresence mode="wait">
        {viewMode === "list" ? (
          <motion.div
            key="list"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
          >
            {/* Header */}
            <div className="flex flex-wrap items-start justify-between gap-4 px-8 py-8">
              <div>
                <span className="font-['IBM_Plex_Mono'] text-xs font-semibold uppercase tracking-widest text-[#6C4DF4]">
                  [ People ]
                </span>
                <h1 className="mt-2 font-['Fraunces'] text-3xl italic text-slate-900 sm:text-4xl">
                  Employees
                </h1>
                <p className="mt-2 max-w-xl text-sm leading-relaxed text-slate-600 sm:text-base">
                  Every employee record — personal, job, and compensation history.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setViewMode("create")}
                className={`flex items-center gap-2 rounded-xl bg-linear-to-br ${brand.violet.grad} px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:opacity-90`}
              >
                <PlusIcon className="size-4" />
                Add new employee
              </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-3 px-8 sm:grid-cols-4">
              <StatCard label="Total Employees" value={stats.total} icon={IdCardIcon} color="violet" />
              <StatCard label="Full Access" value={stats.fullAccess} icon={ShieldCheckIcon} color="teal" />
              <StatCard label="No Access" value={stats.noAccess} icon={ShieldOffIcon} color="slate" />
              <StatCard label="Hired This Month" value={stats.hiredThisMonth} icon={UserRoundIcon} color="amber" />
            </div>

            {/* Search */}
            <div className="mt-8 px-8">
              <div className="relative max-w-sm">
                <SearchIcon className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
                <input
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                    setPage(1);
                  }}
                  placeholder="Search by name or email"
                  className="w-full rounded-xl border border-transparent bg-[#F1EDFF] py-2.5 pl-10 pr-3.5 text-sm text-slate-900 outline-none placeholder:text-slate-400 focus:border-[#6C4DF4]/40 focus:bg-white"
                />
              </div>
            </div>

            {/* Table */}
            <div className="px-8 pb-16">
              {isLoading ? (
                <div className="mt-16 flex items-center justify-center gap-2 text-slate-400">
                  <Loader2Icon className="size-4 animate-spin" />
                  <span className="text-sm">Loading employees…</span>
                </div>
              ) : isError ? (
                <p className="mt-16 text-center text-sm text-red-600">
                  Something went wrong loading employees.
                </p>
              ) : employees.length === 0 ? (
                <div className="mt-10 rounded-2xl border border-dashed border-[#EDEBF7] bg-white px-6 py-14 text-center">
                  <InboxIcon className="mx-auto size-8 text-slate-300" />
                  <p className="mt-3 text-sm text-slate-500">
                    No employees yet. Add your first one to get started.
                  </p>
                </div>
              ) : (
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
                        {pageItems.map((emp:any) => (
                          <EmployeeRow
                            key={emp.id}
                            employee={emp}
                            onOpen={() => router.push(`/employees/${emp.id}`)}
                            onDelete={() => setDeleteTarget(emp)}
                          />
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
              )}
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="create"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
          >
            <NewEmployeeContent
              existingEmployees={employees}
              onCancel={() => setViewMode("list")}
              onCreated={(id) => router.push(`/employees/${id}`)}
            />
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {deleteTarget && (
          <DeleteConfirmModal
            employee={deleteTarget}
            onClose={() => setDeleteTarget(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

function StatCard({
  label,
  value,
  icon: Icon,
  color,
}: {
  label: string;
  value: number;
  icon: any;
  color: keyof typeof brand;
}) {
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-[#EDEBF7] bg-white p-4 shadow-sm">
      <div className={`flex size-10 shrink-0 items-center justify-center rounded-xl bg-linear-to-br ${brand[color].grad}`}>
        <Icon className="size-5 text-white" />
      </div>
      <div>
        <p className="font-['Fraunces'] text-xl italic text-slate-900">{value}</p>
        <p className="text-xs text-slate-500">{label}</p>
      </div>
    </div>
  );
}

function EmployeeRow({
  employee,
  onOpen,
  onDelete,
}: {
  employee: EmployeeSummary;
  onOpen: () => void;
  onDelete: () => void;
}) {
  return (
    <tr
      onClick={onOpen}
      className="cursor-pointer border-b border-[#F5F3FF] last:border-0 hover:bg-[#FBFAFF]"
    >
      <td className="px-4 py-3">
        <div className="flex items-center gap-3">
          <div
            className={`flex size-9 shrink-0 items-center justify-center rounded-full bg-linear-to-br ${brand.violet.grad} font-['IBM_Plex_Mono'] text-xs font-bold text-white`}
          >
            {initials(employee.full_name)}
          </div>
          <div>
            <p className="font-['Fraunces'] italic text-slate-900 hover:text-[#6C4DF4]">
              {employee.full_name}
            </p>
            {employee.work_email && (
              <div className="flex items-center gap-1 text-xs text-slate-400">
                <MailIcon className="size-3" />
                {employee.work_email}
              </div>
            )}
          </div>
        </div>
      </td>
      <td className="px-4 py-3 text-slate-600">
        <div className="flex items-center gap-1.5">
          <BriefcaseIcon className="size-3.5 text-slate-400" />
          {employee.job_title || "—"}
        </div>
      </td>
      <td className="px-4 py-3 text-slate-600">
        {employee.department || employee.division || "—"}
      </td>
      <td className="px-4 py-3">
        <span className="rounded-full bg-[#F1EFFA] px-2.5 py-1 text-[11px] font-semibold text-[#6B6685]">
          {employee.employment_status || "—"}
        </span>
      </td>
      <td className="px-4 py-3 font-['IBM_Plex_Mono'] text-slate-500">
        {employee.hire_date ? new Date(employee.hire_date).toLocaleDateString() : "—"}
      </td>
      <td className="px-4 py-3">
        <div className="flex items-center justify-end gap-2 text-slate-400">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
            className="rounded-lg p-1.5 hover:bg-red-50 hover:text-red-600"
          >
            <Trash2Icon className="size-4" />
          </button>
        </div>
      </td>
    </tr>
  );
}

// ── Add new employee — replaces the list content, sidebar stays put ──────

const emptyEmployeeForm: CreateEmployeeRequest = {
  first_name: "",
  last_name: "",
  self_service_access: "no_access",
  country: "Antigua and Barbuda",
  pay_rate_currency: "XCD",
};

function NewEmployeeContent({
  existingEmployees,
  onCancel,
  onCreated,
}: {
  existingEmployees: EmployeeSummary[];
  onCancel: () => void;
  onCreated: (id: string) => void;
}) {
  const [form, setForm] = useState<CreateEmployeeRequest>(emptyEmployeeForm);
  const [formError, setFormError] = useState<string | null>(null);
  const [createEmployee, { isLoading: isCreating }] = useCreateEmployeeMutation();

  const set =
    (key: keyof CreateEmployeeRequest) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
      setForm((f) => ({ ...f, [key]: e.target.value }));

  const setNum =
    (key: keyof CreateEmployeeRequest) =>
    (e: React.ChangeEvent<HTMLInputElement>) =>
      setForm((f) => ({
        ...f,
        [key]: e.target.value === "" ? undefined : Number(e.target.value),
      }));

  const handleSave = async () => {
    if (!form.first_name.trim()) {
      setFormError("First Name is required");
      return;
    }
    if (!form.last_name.trim()) {
      setFormError("Last Name is required");
      return;
    }
    setFormError(null);

    try {
      const res = await createEmployee(form).unwrap();
      onCreated(res.id);
    } catch (err: any) {
      setFormError(err?.data?.message || "Failed to create employee");
    }
  };

  return (
    <div className="px-8 py-8">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onCancel}
          className="flex size-8 items-center justify-center rounded-full border border-[#EDEBF7] text-slate-500 hover:bg-[#F5F3FF]"
        >
          <ArrowLeftIcon className="size-4" />
        </button>
        <div>
          <span className="font-['IBM_Plex_Mono'] text-xs font-semibold uppercase tracking-widest text-[#6C4DF4]">
            [ New ]
          </span>
          <h1 className="font-['Fraunces'] text-2xl italic text-slate-900">New Employee</h1>
        </div>
      </div>

      <div className="mt-8 space-y-6">
        {/* Personal */}
        <FormSection title="Personal">
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            <FormField label="Employee #">
              <input value={form.employee_number || ""} onChange={set("employee_number")} className={inputCls} />
            </FormField>
            <FormField label="First Name *">
              <input value={form.first_name} onChange={set("first_name")} className={inputCls} />
            </FormField>
            <FormField label="Middle Name">
              <input value={form.middle_name || ""} onChange={set("middle_name")} className={inputCls} />
            </FormField>
            <FormField label="Last Name *">
              <input value={form.last_name} onChange={set("last_name")} className={inputCls} />
            </FormField>
            <FormField label="Preferred Name">
              <input value={form.preferred_name || ""} onChange={set("preferred_name")} className={inputCls} />
            </FormField>
            <FormField label="Birth Date">
              <input type="date" value={form.birth_date || ""} onChange={set("birth_date")} className={inputCls} />
            </FormField>
            <FormField label="Gender">
              <select value={form.gender || ""} onChange={set("gender")} className={inputCls}>
                <option value="">– Select –</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </FormField>
            <FormField label="Marital Status">
              <select value={form.marital_status || ""} onChange={set("marital_status")} className={inputCls}>
                <option value="">– Select –</option>
                <option value="Single">Single</option>
                <option value="Married">Married</option>
                <option value="Divorced">Divorced</option>
                <option value="Widowed">Widowed</option>
              </select>
            </FormField>
          </div>
        </FormSection>

        {/* Address */}
        <FormSection title="Address">
          <div className="grid grid-cols-2 gap-4">
            <FormField label="Street 1">
              <input value={form.street1 || ""} onChange={set("street1")} className={inputCls} />
            </FormField>
            <FormField label="Street 2">
              <input value={form.street2 || ""} onChange={set("street2")} className={inputCls} />
            </FormField>
          </div>
          <div className="mt-4 grid grid-cols-3 gap-4">
            <FormField label="City">
              <input value={form.city || ""} onChange={set("city")} className={inputCls} />
            </FormField>
            <FormField label="Province">
              <input value={form.province || ""} onChange={set("province")} className={inputCls} />
            </FormField>
            <FormField label="Postal Code">
              <input value={form.postal_code || ""} onChange={set("postal_code")} className={inputCls} />
            </FormField>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-4">
            <FormField label="Country">
              <input value={form.country || ""} onChange={set("country")} className={inputCls} />
            </FormField>
          </div>
        </FormSection>

        {/* Job */}
        <FormSection title="Job">
          <div className="grid grid-cols-2 gap-4">
            <FormField label="Hire Date">
              <input type="date" value={form.hire_date || ""} onChange={set("hire_date")} className={inputCls} />
            </FormField>
          </div>
        </FormSection>

        {/* Contact */}
        <FormSection title="Contact">
          <div className="grid grid-cols-2 gap-4">
            <FormField label="Work Phone">
              <input value={form.work_phone || ""} onChange={set("work_phone")} className={inputCls} />
            </FormField>
            <FormField label="Ext">
              <input value={form.work_phone_ext || ""} onChange={set("work_phone_ext")} className={inputCls} />
            </FormField>
            <FormField label="Mobile Phone">
              <input value={form.mobile_phone || ""} onChange={set("mobile_phone")} className={inputCls} />
            </FormField>
            <FormField label="Home Phone">
              <input value={form.home_phone || ""} onChange={set("home_phone")} className={inputCls} />
            </FormField>
            <FormField label="Work Email">
              <input type="email" value={form.work_email || ""} onChange={set("work_email")} className={inputCls} />
            </FormField>
            <FormField label="Home Email">
              <input type="email" value={form.home_email || ""} onChange={set("home_email")} className={inputCls} />
            </FormField>
          </div>
        </FormSection>

        {/* Employment Status */}
        <FormSection title="Employment Status">
          <div className="grid grid-cols-2 gap-4">
            <FormField label="Employment Status">
              <input
                value={form.employment_status || ""}
                onChange={set("employment_status")}
                placeholder="e.g. Probation Full-time"
                className={inputCls}
              />
            </FormField>
          </div>
        </FormSection>

        {/* Job Information */}
        <FormSection title="Job Information">
          <div className="grid grid-cols-2 gap-4">
            <FormField label="Job Title">
              <input value={form.job_title || ""} onChange={set("job_title")} className={inputCls} />
            </FormField>
            <FormField label="Reports To">
              <select value={form.reports_to || ""} onChange={set("reports_to")} className={inputCls}>
                <option value="">– Select –</option>
                {existingEmployees.map((e) => (
                  <option key={e.id} value={e.id}>
                    {e.full_name}
                  </option>
                ))}
              </select>
            </FormField>
            <FormField label="Department">
              <input value={form.department || ""} onChange={set("department")} className={inputCls} />
            </FormField>
            <FormField label="Division">
              <input value={form.division || ""} onChange={set("division")} className={inputCls} />
            </FormField>
            <FormField label="Location">
              <input value={form.location || ""} onChange={set("location")} className={inputCls} />
            </FormField>
          </div>
        </FormSection>

        {/* Compensation */}
        <FormSection title="Compensation">
          <div className="grid grid-cols-2 gap-4">
            <FormField label="Pay Schedule">
              <input
                value={form.pay_schedule || ""}
                onChange={set("pay_schedule")}
                placeholder="e.g. Every other week"
                className={inputCls}
              />
            </FormField>
            <FormField label="Pay Type">
              <select value={form.pay_type || ""} onChange={set("pay_type")} className={inputCls}>
                <option value="">– Select –</option>
                <option value="Salary">Salary</option>
                <option value="Hourly">Hourly</option>
              </select>
            </FormField>
          </div>
          <div className="mt-4 grid grid-cols-3 gap-4">
            <FormField label="Pay Rate">
              <input
                type="number"
                min={0}
                value={form.pay_rate_amount ?? ""}
                onChange={setNum("pay_rate_amount")}
                className={inputCls}
              />
            </FormField>
            <FormField label="Currency">
              <input value={form.pay_rate_currency || ""} onChange={set("pay_rate_currency")} className={inputCls} />
            </FormField>
            <FormField label="Per">
              <select value={form.pay_rate_per || ""} onChange={set("pay_rate_per")} className={inputCls}>
                <option value="">– Select –</option>
                <option value="Hour">Hour</option>
                <option value="Pay Period">Pay Period</option>
                <option value="Month">Month</option>
                <option value="Year">Year</option>
              </select>
            </FormField>
          </div>
        </FormSection>

   

        {formError && (
          <div className="flex items-center gap-2 rounded-lg bg-red-50 px-3 py-2 text-xs text-red-600">
            <AlertTriangleIcon className="size-3.5 shrink-0" />
            {formError}
          </div>
        )}

        <div className="flex gap-2 border-t border-[#EDEBF7] pt-5">
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 rounded-xl border border-[#EDEBF7] px-4 py-2.5 text-sm font-semibold text-slate-600 hover:bg-[#FBFAFF] sm:flex-none sm:px-8"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={isCreating}
            className={`flex flex-1 items-center justify-center gap-2 rounded-xl bg-linear-to-br ${brand.violet.grad} px-4 py-2.5 text-sm font-semibold text-white hover:opacity-90 disabled:opacity-60 sm:flex-none sm:px-8`}
          >
            {isCreating && <Loader2Icon className="size-4 animate-spin" />}
            Save Employee
          </button>
        </div>
      </div>
    </div>
  );
}

const inputCls =
  "w-full rounded-lg border border-[#EDEBF7] px-3 py-2 text-sm outline-none focus:border-[#6C4DF4] focus:ring-2 focus:ring-[#6C4DF4]/10";

function FormSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-[#EDEBF7] bg-white p-6 shadow-sm">
      <h2 className="font-['Fraunces'] text-lg italic text-slate-900">{title}</h2>
      <div className="mt-4">{children}</div>
    </div>
  );
}

function FormField({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="font-['IBM_Plex_Mono'] text-xs font-medium uppercase tracking-wide text-slate-400">
        {label}
      </span>
      <div className="mt-1.5">{children}</div>
    </label>
  );
}

function DeleteConfirmModal({
  employee,
  onClose,
}: {
  employee: EmployeeSummary;
  onClose: () => void;
}) {
  const [deleteEmployee, { isLoading }] = useDeleteEmployeeMutation();
  const [error, setError] = useState<string | null>(null);

  const handleDelete = async () => {
    try {
      await deleteEmployee(employee.id).unwrap();
      onClose();
    } catch (err: any) {
      setError(err?.data?.message || "Failed to delete employee");
    }
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 z-40 bg-slate-900/30 backdrop-blur-sm"
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.96 }}
        transition={{ duration: 0.15 }}
        className="fixed left-1/2 top-1/2 z-50 w-full max-w-sm -translate-x-1/2 -translate-y-1/2 rounded-2xl bg-white p-6 shadow-2xl font-['Inter']"
      >
        <div className="flex size-10 items-center justify-center rounded-xl bg-red-50">
          <AlertTriangleIcon className="size-5 text-red-600" />
        </div>
        <h3 className="mt-4 font-['Fraunces'] text-lg italic text-slate-900">
          Delete this employee?
        </h3>
        <p className="mt-1.5 text-sm text-slate-600">
          <span className="font-medium text-slate-900">{employee.full_name}</span>{" "}
          will be removed permanently. This can&apos;t be undone.
        </p>

        {error && <p className="mt-3 text-xs text-red-600">{error}</p>}

        <div className="mt-6 flex gap-2">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 rounded-xl border border-[#EDEBF7] px-4 py-2.5 text-sm font-semibold text-slate-600 hover:bg-[#FBFAFF]"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleDelete}
            disabled={isLoading}
            className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-red-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-red-700 disabled:opacity-60"
          >
            {isLoading && <Loader2Icon className="size-4 animate-spin" />}
            Delete
          </button>
        </div>
      </motion.div>
    </>
  );
}