/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useMemo, useState } from "react";
import { ArrowLeftIcon, AlertTriangleIcon, Loader2Icon } from "lucide-react";
import { brand } from "@/lib/colors";
import { CreateEmployeeRequest, EmployeeSummary } from "@/types";
import { useCreateEmployeeMutation } from "@/redux/Employee/Employeeapi";
import {
  ComboField, FormField, FormSection, inputCls,
  EMPLOYMENT_STATUS_OPTIONS, uniqueSorted,
} from "./formPrimitives";

const emptyEmployeeForm: CreateEmployeeRequest = {
  first_name: "",
  last_name: "",
  self_service_access: "no_access",
  country: "Antigua and Barbuda",
  pay_rate_currency: "XCD",
};

export function EmployeeForm({
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

  const set = (key: keyof CreateEmployeeRequest) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm((f) => ({ ...f, [key]: e.target.value }));

  const setNum = (key: keyof CreateEmployeeRequest) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((f) => ({ ...f, [key]: e.target.value === "" ? undefined : Number(e.target.value) }));

  const setField = (key: keyof CreateEmployeeRequest) => (value: string) => setForm((f) => ({ ...f, [key]: value }));

  const jobTitleOptions = useMemo(() => uniqueSorted(existingEmployees.map((e) => e.job_title)), [existingEmployees]);
  const departmentOptions = useMemo(() => uniqueSorted(existingEmployees.map((e) => e.department)), [existingEmployees]);
  const divisionOptions = useMemo(() => uniqueSorted(existingEmployees.map((e) => e.division)), [existingEmployees]);
  const locationOptions = useMemo(() => uniqueSorted(existingEmployees.map((e) => e.location)), [existingEmployees]);

  const handleSave = async () => {
    if (!form.first_name.trim()) return setFormError("First Name is required");
    if (!form.last_name.trim()) return setFormError("Last Name is required");
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
        <button type="button" onClick={onCancel} className="flex size-8 items-center justify-center rounded-full border border-[#EDEBF7] text-slate-500 hover:bg-[#F5F3FF]">
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
        <FormSection title="Personal">
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            <FormField label="Employee #"><input value={form.employee_number || ""} onChange={set("employee_number")} className={inputCls} /></FormField>
            <FormField label="First Name *"><input value={form.first_name} onChange={set("first_name")} className={inputCls} /></FormField>
            <FormField label="Middle Name"><input value={form.middle_name || ""} onChange={set("middle_name")} className={inputCls} /></FormField>
            <FormField label="Last Name *"><input value={form.last_name} onChange={set("last_name")} className={inputCls} /></FormField>
            <FormField label="Preferred Name"><input value={form.preferred_name || ""} onChange={set("preferred_name")} className={inputCls} /></FormField>
            <FormField label="Birth Date"><input type="date" value={form.birth_date || ""} onChange={set("birth_date")} className={inputCls} /></FormField>
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

        <FormSection title="Address">
          <div className="grid grid-cols-2 gap-4">
            <FormField label="Street 1"><input value={form.street1 || ""} onChange={set("street1")} className={inputCls} /></FormField>
            <FormField label="Street 2"><input value={form.street2 || ""} onChange={set("street2")} className={inputCls} /></FormField>
          </div>
          <div className="mt-4 grid grid-cols-3 gap-4">
            <FormField label="City"><input value={form.city || ""} onChange={set("city")} className={inputCls} /></FormField>
            <FormField label="Province"><input value={form.province || ""} onChange={set("province")} className={inputCls} /></FormField>
            <FormField label="Postal Code"><input value={form.postal_code || ""} onChange={set("postal_code")} className={inputCls} /></FormField>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-4">
            <FormField label="Country"><input value={form.country || ""} onChange={set("country")} className={inputCls} /></FormField>
          </div>
        </FormSection>

        <FormSection title="Job">
          <div className="grid grid-cols-2 gap-4">
            <FormField label="Hire Date"><input type="date" value={form.hire_date || ""} onChange={set("hire_date")} className={inputCls} /></FormField>
          </div>
        </FormSection>

        <FormSection title="Contact">
          <div className="grid grid-cols-2 gap-4">
            <FormField label="Work Phone"><input value={form.work_phone || ""} onChange={set("work_phone")} className={inputCls} /></FormField>
            <FormField label="Ext"><input value={form.work_phone_ext || ""} onChange={set("work_phone_ext")} className={inputCls} /></FormField>
            <FormField label="Mobile Phone"><input value={form.mobile_phone || ""} onChange={set("mobile_phone")} className={inputCls} /></FormField>
            <FormField label="Home Phone"><input value={form.home_phone || ""} onChange={set("home_phone")} className={inputCls} /></FormField>
            <FormField label="Work Email"><input type="email" value={form.work_email || ""} onChange={set("work_email")} className={inputCls} /></FormField>
            <FormField label="Home Email"><input type="email" value={form.home_email || ""} onChange={set("home_email")} className={inputCls} /></FormField>
          </div>
        </FormSection>

        <FormSection title="Employment Status">
          <div className="grid grid-cols-2 gap-4">
            <ComboField label="Employment Status" value={form.employment_status || ""} onChange={setField("employment_status")} options={EMPLOYMENT_STATUS_OPTIONS} placeholder="e.g. Probation Full-time" />
          </div>
        </FormSection>

        <FormSection title="Job Information">
          <div className="grid grid-cols-2 gap-4">
            <ComboField label="Job Title" value={form.job_title || ""} onChange={setField("job_title")} options={jobTitleOptions} placeholder="e.g. Front Desk Manager" />
            <FormField label="Reports To">
              <select value={form.reports_to || ""} onChange={set("reports_to")} className={inputCls}>
                <option value="">– Select –</option>
                {existingEmployees.map((e) => (
                  <option key={e.id} value={e.id}>{e.full_name}</option>
                ))}
              </select>
            </FormField>
            <ComboField label="Department" value={form.department || ""} onChange={setField("department")} options={departmentOptions} placeholder="e.g. Kitchen" />
            <ComboField label="Division" value={form.division || ""} onChange={setField("division")} options={divisionOptions} placeholder="e.g. Front of House" />
            <ComboField label="Location" value={form.location || ""} onChange={setField("location")} options={locationOptions} placeholder="e.g. Jolly Harbour" />
          </div>
        </FormSection>

        <FormSection title="Compensation">
          <div className="grid grid-cols-2 gap-4">
            <FormField label="Pay Schedule"><input value={form.pay_schedule || ""} onChange={set("pay_schedule")} placeholder="e.g. Every other week" className={inputCls} /></FormField>
            <FormField label="Pay Type">
              <select value={form.pay_type || ""} onChange={set("pay_type")} className={inputCls}>
                <option value="">– Select –</option>
                <option value="Salary">Salary</option>
                <option value="Hourly">Hourly</option>
              </select>
            </FormField>
          </div>
          <div className="mt-4 grid grid-cols-3 gap-4">
            <FormField label="Pay Rate"><input type="number" min={0} value={form.pay_rate_amount ?? ""} onChange={setNum("pay_rate_amount")} className={inputCls} /></FormField>
            <FormField label="Currency"><input value={form.pay_rate_currency || ""} onChange={set("pay_rate_currency")} className={inputCls} /></FormField>
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

        <FormSection title="Self-service access">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <button
              type="button"
              onClick={() => setForm((f) => ({ ...f, self_service_access: "full_access" }))}
              className={`rounded-xl border p-4 text-left transition ${form.self_service_access === "full_access" ? "border-[#6C4DF4] bg-[#F1EDFF]" : "border-[#EDEBF7] bg-white hover:bg-[#FBFAFF]"}`}
            >
              <p className="font-['Fraunces'] italic text-slate-900">Allow Access</p>
              <p className="mt-1 text-xs text-slate-500">They will be able to log in using the access level in settings.</p>
            </button>
            <button
              type="button"
              onClick={() => setForm((f) => ({ ...f, self_service_access: "no_access" }))}
              className={`rounded-xl border p-4 text-left transition ${form.self_service_access === "no_access" ? "border-[#6C4DF4] bg-[#F1EDFF]" : "border-[#EDEBF7] bg-white hover:bg-[#FBFAFF]"}`}
            >
              <p className="font-['Fraunces'] italic text-slate-900">No Access</p>
              <p className="mt-1 text-xs text-slate-500">They won&apos;t have access and won&apos;t be able to log in.</p>
            </button>
          </div>
        </FormSection>

        {formError && (
          <div className="flex items-center gap-2 rounded-lg bg-red-50 px-3 py-2 text-xs text-red-600">
            <AlertTriangleIcon className="size-3.5 shrink-0" />
            {formError}
          </div>
        )}

        <div className="flex gap-2 border-t border-[#EDEBF7] pt-5">
          <button type="button" onClick={onCancel} className="flex-1 rounded-xl border border-[#EDEBF7] px-4 py-2.5 text-sm font-semibold text-slate-600 hover:bg-[#FBFAFF] sm:flex-none sm:px-8">
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