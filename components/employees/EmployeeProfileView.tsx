/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useState } from "react";
import { Loader2Icon, MailIcon, PhoneIcon, BriefcaseIcon, PlusIcon } from "lucide-react";
import { EmployeeProfile, EmployeeSummary } from "@/types";
import {
  useUpdateEmployeeBasicInfoMutation,
  useUpdateEmployeeJobCoreMutation,
  useAddEmploymentStatusEntryMutation,
  useAddJobInformationEntryMutation,
  useAddCompensationEntryMutation,
} from "@/redux/Employee/Employeeapi";
import { FormField, FormSection, ComboField, inputCls, EMPLOYMENT_STATUS_OPTIONS, uniqueSorted } from "./formPrimitives";

function currentJobInfo(profile: EmployeeProfile) {
  return profile.job_tab.job_information.current;
}
function currentStatus(profile: EmployeeProfile) {
  return profile.job_tab.employment_status.current;
}
function currentCompensation(profile: EmployeeProfile) {
  return profile.job_tab.compensation.current;
}

export function EmployeeProfileView({
  profile,
  existingEmployees,
}: {
  profile: EmployeeProfile;
  existingEmployees: EmployeeSummary[];
}) {
  const jobInfo = currentJobInfo(profile);
  const status = currentStatus(profile);
  const comp = currentCompensation(profile);

  return (
    <div className="px-8 py-8 space-y-6">
      <BasicInfoSection profile={profile} />
      <JobCoreSection employeeId={profile.id} job={profile.job_tab.job} />
      <EmploymentStatusSection employeeId={profile.id} current={status} />
      <JobInformationSection employeeId={profile.id} current={jobInfo} existingEmployees={existingEmployees} selfId={profile.id} />
      <CompensationSection employeeId={profile.id} current={comp} />
    </div>
  );
}

function Vital({ icon: Icon, label, value }: { icon?: any; label: string; value?: string }) {
  return (
    <div>
      <span className="font-['IBM_Plex_Mono'] text-xs font-medium uppercase tracking-wide text-slate-400">{label}</span>
      <div className="mt-1 flex items-center gap-1.5">
        {Icon && <Icon className="size-3.5 text-slate-400" />}
        <span>{value || "—"}</span>
      </div>
    </div>
  );
}

// ── Personal / Address / Contact / Access — all editable in place ────────
function BasicInfoSection({ profile }: { profile: EmployeeProfile }) {
  const [editing, setEditing] = useState(false);
  const [save, { isLoading }] = useUpdateEmployeeBasicInfoMutation();
  const v = profile.vitals;

  const [form, setForm] = useState({
    employee_number: v.employee_number || "",
    first_name: v.first_name || "",
    middle_name: v.middle_name || "",
    last_name: v.last_name || "",
    preferred_name: v.preferred_name || "",
    birth_date: v.birth_date ? new Date(v.birth_date).toISOString().slice(0, 10) : "",
    gender: v.gender || "",
    marital_status: v.marital_status || "",

    street1: v.street1 || "",
    street2: v.street2 || "",
    city: v.city || "",
    province: v.province || "",
    postal_code: v.postal_code || "",
    country: v.country || "",

    work_phone: v.work_phone || "",
    work_phone_ext: v.work_phone_ext || "",
    mobile_phone: v.mobile_phone || "",
    home_phone: v.home_phone || "",
    work_email: v.work_email || "",
    home_email: v.home_email || "",

    self_service_access: v.self_service_access || "no_access",
  });
  const [formError, setFormError] = useState<string | null>(null);

  const set = (key: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm((f) => ({ ...f, [key]: e.target.value }));

  const handleSave = async () => {
    if (!form.first_name.trim() || !form.last_name.trim()) {
      setFormError("First and Last Name are required");
      return;
    }
    setFormError(null);
    try {
      await save({
        id: profile.id,
        employee_number: form.employee_number || undefined,
        first_name: form.first_name,
        middle_name: form.middle_name || undefined,
        last_name: form.last_name,
        preferred_name: form.preferred_name || undefined,
        birth_date: form.birth_date || undefined,
        gender: form.gender || undefined,
        marital_status: form.marital_status || undefined,

        street1: form.street1 || undefined,
        street2: form.street2 || undefined,
        city: form.city || undefined,
        province: form.province || undefined,
        postal_code: form.postal_code || undefined,
        country: form.country || undefined,

        work_phone: form.work_phone || undefined,
        work_phone_ext: form.work_phone_ext || undefined,
        mobile_phone: form.mobile_phone || undefined,
        home_phone: form.home_phone || undefined,
        work_email: form.work_email || undefined,
        home_email: form.home_email || undefined,

        self_service_access: form.self_service_access as "full_access" | "no_access",
      }).unwrap();
      setEditing(false);
    } catch (err: any) {
      setFormError(err?.data?.message || "Failed to update employee");
    }
  };

  if (!editing) {
    return (
      <FormSection title="Personal & Contact">
        <div className="flex items-start justify-between gap-4">
          <div className="grid grid-cols-2 gap-4 text-sm sm:grid-cols-4">
            <Vital label="Name" value={profile.full_name} />
            <Vital label="Preferred Name" value={v.preferred_name} />
            <Vital label="Birth Date" value={v.birth_date ? new Date(v.birth_date).toLocaleDateString() : undefined} />
            <Vital label="Gender" value={v.gender} />
            <Vital label="Marital Status" value={v.marital_status} />
            <Vital label="Address" value={v.address} />
            <Vital icon={MailIcon} label="Work Email" value={v.work_email} />
            <Vital label="Home Email" value={v.home_email} />
            <Vital icon={PhoneIcon} label="Work Phone" value={v.work_phone} />
            <Vital label="Mobile" value={v.mobile_phone} />
            <Vital label="Home Phone" value={v.home_phone} />
            <Vital label="Self-service access" value={v.self_service_access === "full_access" ? "Allow Access" : "No Access"} />
          </div>
          <button type="button" onClick={() => setEditing(true)} className="shrink-0 text-xs font-semibold text-[#6C4DF4] hover:underline">
            Edit
          </button>
        </div>
      </FormSection>
    );
  }

  return (
    <FormSection title="Personal & Contact">
      <div className="space-y-6">
        <div>
          <p className="mb-3 font-['IBM_Plex_Mono'] text-xs font-semibold uppercase tracking-wide text-slate-400">Personal</p>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            <FormField label="Employee #"><input value={form.employee_number} onChange={set("employee_number")} className={inputCls} /></FormField>
            <FormField label="First Name *"><input value={form.first_name} onChange={set("first_name")} className={inputCls} /></FormField>
            <FormField label="Middle Name"><input value={form.middle_name} onChange={set("middle_name")} className={inputCls} /></FormField>
            <FormField label="Last Name *"><input value={form.last_name} onChange={set("last_name")} className={inputCls} /></FormField>
            <FormField label="Preferred Name"><input value={form.preferred_name} onChange={set("preferred_name")} className={inputCls} /></FormField>
            <FormField label="Birth Date"><input type="date" value={form.birth_date} onChange={set("birth_date")} className={inputCls} /></FormField>
            <FormField label="Gender">
              <select value={form.gender} onChange={set("gender")} className={inputCls}>
                <option value="">– Select –</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </FormField>
            <FormField label="Marital Status">
              <select value={form.marital_status} onChange={set("marital_status")} className={inputCls}>
                <option value="">– Select –</option>
                <option value="Single">Single</option>
                <option value="Married">Married</option>
                <option value="Divorced">Divorced</option>
                <option value="Widowed">Widowed</option>
              </select>
            </FormField>
          </div>
        </div>

        <div>
          <p className="mb-3 font-['IBM_Plex_Mono'] text-xs font-semibold uppercase tracking-wide text-slate-400">Address</p>
          <div className="grid grid-cols-2 gap-4">
            <FormField label="Street 1"><input value={form.street1} onChange={set("street1")} className={inputCls} /></FormField>
            <FormField label="Street 2"><input value={form.street2} onChange={set("street2")} className={inputCls} /></FormField>
          </div>
          <div className="mt-4 grid grid-cols-3 gap-4">
            <FormField label="City"><input value={form.city} onChange={set("city")} className={inputCls} /></FormField>
            <FormField label="Province"><input value={form.province} onChange={set("province")} className={inputCls} /></FormField>
            <FormField label="Postal Code"><input value={form.postal_code} onChange={set("postal_code")} className={inputCls} /></FormField>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-4">
            <FormField label="Country"><input value={form.country} onChange={set("country")} className={inputCls} /></FormField>
          </div>
        </div>

        <div>
          <p className="mb-3 font-['IBM_Plex_Mono'] text-xs font-semibold uppercase tracking-wide text-slate-400">Contact</p>
          <div className="grid grid-cols-2 gap-4">
            <FormField label="Work Phone"><input value={form.work_phone} onChange={set("work_phone")} className={inputCls} /></FormField>
            <FormField label="Ext"><input value={form.work_phone_ext} onChange={set("work_phone_ext")} className={inputCls} /></FormField>
            <FormField label="Mobile Phone"><input value={form.mobile_phone} onChange={set("mobile_phone")} className={inputCls} /></FormField>
            <FormField label="Home Phone"><input value={form.home_phone} onChange={set("home_phone")} className={inputCls} /></FormField>
            <FormField label="Work Email"><input type="email" value={form.work_email} onChange={set("work_email")} className={inputCls} /></FormField>
            <FormField label="Home Email"><input type="email" value={form.home_email} onChange={set("home_email")} className={inputCls} /></FormField>
          </div>
        </div>

        <div>
          <p className="mb-3 font-['IBM_Plex_Mono'] text-xs font-semibold uppercase tracking-wide text-slate-400">Self-service access</p>
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
        </div>

        {formError && <p className="text-xs text-red-600">{formError}</p>}

        <div className="flex gap-2 border-t border-[#EDEBF7] pt-4">
          <button type="button" onClick={() => setEditing(false)} className="rounded-lg border border-[#EDEBF7] px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-[#FBFAFF]">
            Cancel
          </button>
          <button type="button" onClick={handleSave} disabled={isLoading} className="flex items-center gap-1.5 rounded-lg bg-[#6C4DF4] px-3 py-1.5 text-xs font-semibold text-white hover:opacity-90 disabled:opacity-60">
            {isLoading && <Loader2Icon className="size-3 animate-spin" />}
            Save
          </button>
        </div>
      </div>
    </FormSection>
  );
}

// ── Job core — Hire Date / Job Code / Probation / Contract / Hours / Days ─
function JobCoreSection({ employeeId, job }: { employeeId: string; job: any }) {
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({
    hire_date: job.hire_date ? new Date(job.hire_date).toISOString().slice(0, 10) : "",
    job_code: job.job_code || "",
    probation_end_date: job.probation_end_date ? new Date(job.probation_end_date).toISOString().slice(0, 10) : "",
    contract_end_date: job.contract_end_date ? new Date(job.contract_end_date).toISOString().slice(0, 10) : "",
    contracted_hours_per_week: job.contracted_hours_per_week ?? "",
    contracted_days_per_week: job.contracted_days_per_week ?? "",
  });
  const [save, { isLoading }] = useUpdateEmployeeJobCoreMutation();

  const handleSave = async () => {
    await save({
      id: employeeId,
      hire_date: form.hire_date || undefined,
      job_code: form.job_code || undefined,
      probation_end_date: form.probation_end_date || undefined,
      contract_end_date: form.contract_end_date || undefined,
      contracted_hours_per_week: form.contracted_hours_per_week === "" ? undefined : Number(form.contracted_hours_per_week),
      contracted_days_per_week: form.contracted_days_per_week === "" ? undefined : Number(form.contracted_days_per_week),
    }).unwrap();
    setEditing(false);
  };

  return (
    <FormSection title="Job">
      {!editing ? (
        <div className="flex items-start justify-between">
          <div className="grid grid-cols-3 gap-4 text-sm text-slate-700 sm:grid-cols-4">
            <Vital label="Hire Date" value={job.hire_date ? new Date(job.hire_date).toLocaleDateString() : undefined} />
            <Vital label="Job Code" value={job.job_code} />
            <Vital label="Direct Reports" value={String(job.direct_reports_count)} />
            <Vital label="Probation End" value={job.probation_end_date ? new Date(job.probation_end_date).toLocaleDateString() : undefined} />
          </div>
          <button type="button" onClick={() => setEditing(true)} className="text-xs font-semibold text-[#6C4DF4] hover:underline">
            Edit
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <FormField label="Hire Date">
              <input type="date" value={form.hire_date} onChange={(e) => setForm((f) => ({ ...f, hire_date: e.target.value }))} className={inputCls} />
            </FormField>
            <FormField label="Job Code">
              <input value={form.job_code} onChange={(e) => setForm((f) => ({ ...f, job_code: e.target.value }))} className={inputCls} />
            </FormField>
            <FormField label="Probation End">
              <input type="date" value={form.probation_end_date} onChange={(e) => setForm((f) => ({ ...f, probation_end_date: e.target.value }))} className={inputCls} />
            </FormField>
            <FormField label="Contract End">
              <input type="date" value={form.contract_end_date} onChange={(e) => setForm((f) => ({ ...f, contract_end_date: e.target.value }))} className={inputCls} />
            </FormField>
            <FormField label="Contracted Hours/Week">
              <input type="number" value={form.contracted_hours_per_week} onChange={(e) => setForm((f) => ({ ...f, contracted_hours_per_week: e.target.value }))} className={inputCls} />
            </FormField>
            <FormField label="Contracted Days/Week">
              <input type="number" value={form.contracted_days_per_week} onChange={(e) => setForm((f) => ({ ...f, contracted_days_per_week: e.target.value }))} className={inputCls} />
            </FormField>
          </div>
          <div className="flex gap-2">
            <button type="button" onClick={() => setEditing(false)} className="rounded-lg border border-[#EDEBF7] px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-[#FBFAFF]">
              Cancel
            </button>
            <button type="button" onClick={handleSave} disabled={isLoading} className="flex items-center gap-1.5 rounded-lg bg-[#6C4DF4] px-3 py-1.5 text-xs font-semibold text-white hover:opacity-90 disabled:opacity-60">
              {isLoading && <Loader2Icon className="size-3 animate-spin" />}
              Save
            </button>
          </div>
        </div>
      )}
    </FormSection>
  );
}

// ── Employment status — effective-dated, add new entry ────────────────────
function EmploymentStatusSection({ employeeId, current }: { employeeId: string; current?: any }) {
  const [adding, setAdding] = useState(false);
  const [effectiveDate, setEffectiveDate] = useState(new Date().toISOString().slice(0, 10));
  const [status, setStatus] = useState("");
  const [comment, setComment] = useState("");
  const [addEntry, { isLoading }] = useAddEmploymentStatusEntryMutation();

  const handleAdd = async () => {
    if (!status) return;
    await addEntry({ id: employeeId, effective_date: effectiveDate, employment_status: status, comment: comment || undefined }).unwrap();
    setAdding(false);
    setStatus("");
    setComment("");
  };

  return (
    <FormSection title="Employment Status">
      <div className="flex items-start justify-between">
        <Vital label="Current Status" value={current?.employment_status} />
        {!adding && (
          <button type="button" onClick={() => setAdding(true)} className="flex items-center gap-1 text-xs font-semibold text-[#6C4DF4] hover:underline">
            <PlusIcon className="size-3.5" /> Add entry
          </button>
        )}
      </div>
      {adding && (
        <div className="mt-4 space-y-4 border-t border-[#EDEBF7] pt-4">
          <div className="grid grid-cols-2 gap-4">
            <FormField label="Effective Date">
              <input type="date" value={effectiveDate} onChange={(e) => setEffectiveDate(e.target.value)} className={inputCls} />
            </FormField>
            <ComboField label="Status" value={status} onChange={setStatus} options={EMPLOYMENT_STATUS_OPTIONS} />
          </div>
          <FormField label="Comment">
            <input value={comment} onChange={(e) => setComment(e.target.value)} className={inputCls} />
          </FormField>
          <div className="flex gap-2">
            <button type="button" onClick={() => setAdding(false)} className="rounded-lg border border-[#EDEBF7] px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-[#FBFAFF]">
              Cancel
            </button>
            <button type="button" onClick={handleAdd} disabled={isLoading} className="flex items-center gap-1.5 rounded-lg bg-[#6C4DF4] px-3 py-1.5 text-xs font-semibold text-white hover:opacity-90 disabled:opacity-60">
              {isLoading && <Loader2Icon className="size-3 animate-spin" />}
              Save
            </button>
          </div>
        </div>
      )}
    </FormSection>
  );
}

// ── Job information — effective-dated, add new entry ──────────────────────
function JobInformationSection({
  employeeId,
  current,
  existingEmployees,
  selfId,
}: {
  employeeId: string;
  current?: any;
  existingEmployees: EmployeeSummary[];
  selfId: string;
}) {
  const [adding, setAdding] = useState(false);
  const [effectiveDate, setEffectiveDate] = useState(new Date().toISOString().slice(0, 10));
  const [form, setForm] = useState({ job_title: "", reports_to: "", department: "", division: "", location: "" });
  const [addEntry, { isLoading }] = useAddJobInformationEntryMutation();

  const jobTitleOptions = uniqueSorted(existingEmployees.map((e) => e.job_title));
  const departmentOptions = uniqueSorted(existingEmployees.map((e) => e.department));
  const divisionOptions = uniqueSorted(existingEmployees.map((e) => e.division));
  const locationOptions = uniqueSorted(existingEmployees.map((e) => e.location));

  const handleAdd = async () => {
    if (!form.job_title) return;
    await addEntry({
      id: employeeId,
      effective_date: effectiveDate,
      job_title: form.job_title,
      reports_to: form.reports_to || undefined,
      department: form.department || undefined,
      division: form.division || undefined,
      location: form.location || undefined,
    }).unwrap();
    setAdding(false);
  };

  return (
    <FormSection title="Job Information">
      <div className="flex items-start justify-between">
        <div className="grid grid-cols-2 gap-4 text-sm sm:grid-cols-4">
          <Vital label="Job Title" value={current?.job_title} />
          <Vital label="Department" value={current?.department} />
          <Vital label="Division" value={current?.division} />
          <Vital label="Location" value={current?.location} />
        </div>
        {!adding && (
          <button type="button" onClick={() => setAdding(true)} className="flex shrink-0 items-center gap-1 text-xs font-semibold text-[#6C4DF4] hover:underline">
            <PlusIcon className="size-3.5" /> Add entry
          </button>
        )}
      </div>
      {adding && (
        <div className="mt-4 space-y-4 border-t border-[#EDEBF7] pt-4">
          <FormField label="Effective Date">
            <input type="date" value={effectiveDate} onChange={(e) => setEffectiveDate(e.target.value)} className={inputCls} />
          </FormField>
          <div className="grid grid-cols-2 gap-4">
            <ComboField label="Job Title" value={form.job_title} onChange={(v) => setForm((f) => ({ ...f, job_title: v }))} options={jobTitleOptions} />
            <FormField label="Reports To">
              <select value={form.reports_to} onChange={(e) => setForm((f) => ({ ...f, reports_to: e.target.value }))} className={inputCls}>
                <option value="">– Select –</option>
                {existingEmployees.filter((e) => e.id !== selfId).map((e) => (
                  <option key={e.id} value={e.id}>{e.full_name}</option>
                ))}
              </select>
            </FormField>
            <ComboField label="Department" value={form.department} onChange={(v) => setForm((f) => ({ ...f, department: v }))} options={departmentOptions} />
            <ComboField label="Division" value={form.division} onChange={(v) => setForm((f) => ({ ...f, division: v }))} options={divisionOptions} />
            <ComboField label="Location" value={form.location} onChange={(v) => setForm((f) => ({ ...f, location: v }))} options={locationOptions} />
          </div>
          <div className="flex gap-2">
            <button type="button" onClick={() => setAdding(false)} className="rounded-lg border border-[#EDEBF7] px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-[#FBFAFF]">
              Cancel
            </button>
            <button type="button" onClick={handleAdd} disabled={isLoading} className="flex items-center gap-1.5 rounded-lg bg-[#6C4DF4] px-3 py-1.5 text-xs font-semibold text-white hover:opacity-90 disabled:opacity-60">
              {isLoading && <Loader2Icon className="size-3 animate-spin" />}
              Save
            </button>
          </div>
        </div>
      )}
    </FormSection>
  );
}

// ── Compensation — effective-dated, add new entry ──────────────────────────
function CompensationSection({ employeeId, current }: { employeeId: string; current?: any }) {
  const [adding, setAdding] = useState(false);
  const [effectiveDate, setEffectiveDate] = useState(new Date().toISOString().slice(0, 10));
  const [form, setForm] = useState({ pay_schedule: "", pay_type: "", pay_rate_amount: "", pay_rate_currency: "XCD", pay_rate_per: "" });
  const [addEntry, { isLoading }] = useAddCompensationEntryMutation();

  const handleAdd = async () => {
    if (!form.pay_schedule || !form.pay_type || form.pay_rate_amount === "" || !form.pay_rate_per) return;
    await addEntry({
      id: employeeId,
      effective_date: effectiveDate,
      pay_schedule: form.pay_schedule,
      pay_type: form.pay_type,
      pay_rate_amount: Number(form.pay_rate_amount),
      pay_rate_currency: form.pay_rate_currency,
      pay_rate_per: form.pay_rate_per,
    }).unwrap();
    setAdding(false);
  };

  return (
    <FormSection title="Compensation">
      <div className="flex items-start justify-between">
        <div className="grid grid-cols-3 gap-4 text-sm">
          <Vital label="Pay Type" value={current?.pay_type} />
          <Vital label="Rate" value={current ? `${current.pay_rate_amount} ${current.pay_rate_currency} / ${current.pay_rate_per}` : undefined} />
          <Vital label="Schedule" value={current?.pay_schedule} />
        </div>
        {!adding && (
          <button type="button" onClick={() => setAdding(true)} className="flex shrink-0 items-center gap-1 text-xs font-semibold text-[#6C4DF4] hover:underline">
            <PlusIcon className="size-3.5" /> Add entry
          </button>
        )}
      </div>
      {adding && (
        <div className="mt-4 space-y-4 border-t border-[#EDEBF7] pt-4">
          <FormField label="Effective Date">
            <input type="date" value={effectiveDate} onChange={(e) => setEffectiveDate(e.target.value)} className={inputCls} />
          </FormField>
          <div className="grid grid-cols-2 gap-4">
            <FormField label="Pay Schedule">
              <input value={form.pay_schedule} onChange={(e) => setForm((f) => ({ ...f, pay_schedule: e.target.value }))} className={inputCls} />
            </FormField>
            <FormField label="Pay Type">
              <select value={form.pay_type} onChange={(e) => setForm((f) => ({ ...f, pay_type: e.target.value }))} className={inputCls}>
                <option value="">– Select –</option>
                <option value="Salary">Salary</option>
                <option value="Hourly">Hourly</option>
              </select>
            </FormField>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <FormField label="Amount">
              <input type="number" value={form.pay_rate_amount} onChange={(e) => setForm((f) => ({ ...f, pay_rate_amount: e.target.value }))} className={inputCls} />
            </FormField>
            <FormField label="Currency">
              <input value={form.pay_rate_currency} onChange={(e) => setForm((f) => ({ ...f, pay_rate_currency: e.target.value }))} className={inputCls} />
            </FormField>
            <FormField label="Per">
              <select value={form.pay_rate_per} onChange={(e) => setForm((f) => ({ ...f, pay_rate_per: e.target.value }))} className={inputCls}>
                <option value="">– Select –</option>
                <option value="Hour">Hour</option>
                <option value="Pay Period">Pay Period</option>
                <option value="Month">Month</option>
                <option value="Year">Year</option>
              </select>
            </FormField>
          </div>
          <div className="flex gap-2">
            <button type="button" onClick={() => setAdding(false)} className="rounded-lg border border-[#EDEBF7] px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-[#FBFAFF]">
              Cancel
            </button>
            <button type="button" onClick={handleAdd} disabled={isLoading} className="flex items-center gap-1.5 rounded-lg bg-[#6C4DF4] px-3 py-1.5 text-xs font-semibold text-white hover:opacity-90 disabled:opacity-60">
              {isLoading && <Loader2Icon className="size-3 animate-spin" />}
              Save
            </button>
          </div>
        </div>
      )}
    </FormSection>
  );
}