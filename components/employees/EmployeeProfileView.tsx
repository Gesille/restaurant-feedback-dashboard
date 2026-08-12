/* eslint-disable react-hooks/purity */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useEffect, useRef, useState } from "react";
import {
  Loader2Icon,
  MailIcon,
  PhoneIcon,
  BriefcaseIcon,
  PlusIcon,
  UserIcon,
  CalendarClockIcon,
  ClipboardListIcon,
  BadgeDollarSignIcon,
  MapPinIcon,
  HashIcon,
  WalletIcon,
  GiftIcon,
  TrendingUpIcon,
  PieChartIcon,
  ShieldIcon,
  PercentIcon,
  XIcon,
} from "lucide-react";
import { EmployeeProfile, EmployeeSummary } from "@/types";
import {
  useUpdateEmployeeBasicInfoMutation,
  useUpdateEmployeeJobCoreMutation,
  useAddEmploymentStatusEntryMutation,
  useAddJobInformationEntryMutation,
  useAddCompensationEntryMutation,
  useAddAllowanceEntryMutation,
  useAddAirportSecurityPassEntryMutation,
  useAddBonusEntryMutation,
  useAddCommissionEntryMutation,
  useAddEquityEntryMutation,
  useUpdatePayRatesMutation,
  useUpdatePotentialBonusMutation,
  useResolveProbationMutation,
} from "@/redux/Employee/Employeeapi";
import {
  FormField,
  FormSection,
  ComboField,
  inputCls,
  EMPLOYMENT_STATUS_OPTIONS,
  uniqueSorted,
} from "./formPrimitives";

function currentJobInfo(profile: EmployeeProfile) {
  return profile.job_tab.job_information.current;
}
function currentStatus(profile: EmployeeProfile) {
  return profile.job_tab.employment_status.current;
}
function currentCompensation(profile: EmployeeProfile) {
  return profile.job_tab.compensation.current;
}
function currentAllowances(profile: EmployeeProfile) {
  return profile.job_tab.allowances.current;
}

function initials(name?: string) {
  if (!name) return "?";
  const parts = name.trim().split(/\s+/);
  const first = parts[0]?.[0] || "";
  const last = parts.length > 1 ? parts[parts.length - 1][0] : "";
  return (first + last).toUpperCase();
}
function addMonthsToDateStr(dateStr: string, months: number) {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  d.setMonth(d.getMonth() + months);
  return d.toISOString().slice(0, 10);
}
// Employment statuses that indicate a fixed-term arrangement — only these
// need a Contract End Date. Probation is a separate, always-applicable concept.
const CONTRACT_TYPE_RE = /contract|seasonal|temporary/i;
function isContractEndingSoon(dateStr?: string, withinDays = 30) {
  if (!dateStr) return false;
  const diffDays = (new Date(dateStr).getTime() - Date.now()) / 86_400_000;
  return diffDays <= withinDays;
}
const STATUS_STYLES: Record<string, string> = {
  Active: "bg-[#EAF7EE] text-[#1E8A4C]",
  "On Leave": "bg-[#FFF4E5] text-[#B4740E]",
  Terminated: "bg-[#FDEAEA] text-[#C6362F]",
};

// ── Tabs config ─────────────────────────────────────────────────────────
type TabKey =
  | "personal"
  | "job"
  | "status"
  | "jobinfo"
  | "compensation"
  | "allowances"
  | "payrates"
  | "bonus"
  | "commission"
  | "equity"
  | "airportpass";

const TABS: { key: TabKey; label: string; short: string; icon: any }[] = [
  { key: "personal", label: "Personal & Contact", short: "Personal", icon: UserIcon },
  { key: "job", label: "Job", short: "Job", icon: BriefcaseIcon },
  { key: "status", label: "Employment Status", short: "Status", icon: ClipboardListIcon },
  { key: "jobinfo", label: "Job Information", short: "Job Info", icon: MapPinIcon },
  { key: "compensation", label: "Compensation", short: "Compensation", icon: BadgeDollarSignIcon },
  { key: "allowances", label: "Allowances", short: "Allowances", icon: WalletIcon },
  { key: "payrates", label: "Pay Rates & Bonus", short: "Pay Rates", icon: PercentIcon },
  { key: "bonus", label: "Bonus", short: "Bonus", icon: GiftIcon },
  { key: "commission", label: "Commission", short: "Commission", icon: TrendingUpIcon },
  { key: "equity", label: "Equity", short: "Equity", icon: PieChartIcon },
  { key: "airportpass", label: "Airport Security Pass", short: "Airport Pass", icon: ShieldIcon },
];

export function EmployeeProfileView({
  profile,
  existingEmployees,
}: {
  profile: EmployeeProfile;
  existingEmployees: EmployeeSummary[];
}) {
  const [activeTab, setActiveTab] = useState<TabKey>("personal");
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  const jobInfo = currentJobInfo(profile);
  const status = currentStatus(profile);
  const comp = currentCompensation(profile);
  const allowances = currentAllowances(profile);

  const activeTabMeta = TABS.find((t) => t.key === activeTab)!;
  const activeIndex = TABS.findIndex((t) => t.key === activeTab);

  const selectTab = (key: TabKey) => {
    setActiveTab(key);
    setMobileNavOpen(false);
    // Content area gets its own scroll container on desktop; on mobile the
    // whole page scrolls, so bring the top of the section into view.
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen w-full bg-[#F7F6FB]">
      <div className="mx-auto flex w-full max-w-[1400px] gap-6 px-4 py-6 pb-28 sm:px-6 lg:px-10 lg:py-10 lg:pb-10">
        {/* ── Desktop sidebar — sticky, always in view, no scroll-hunting ── */}
        <aside className="sticky top-8 hidden h-fit w-[272px] shrink-0 self-start lg:block">
          <IdentityCard profile={profile} jobInfo={jobInfo} status={status} />

          <nav
            aria-label="Profile sections"
            className="mt-4 max-h-[calc(100vh-22rem)] overflow-y-auto rounded-2xl border border-[#EAE7F6] bg-white p-1.5 shadow-[0_1px_2px_rgba(23,15,60,0.04)]"
          >
            {TABS.map((tab) => (
              <SidebarLink
                key={tab.key}
                tab={tab}
                active={activeTab === tab.key}
                onClick={() => selectTab(tab.key)}
              />
            ))}
          </nav>
        </aside>

        {/* ── Main column ─────────────────────────────────────────── */}
        <div className="min-w-0 flex-1">
          {/* Mobile identity strip */}
          <div className="mb-4 flex items-center gap-3 rounded-2xl border border-[#EAE7F6] bg-white p-4 shadow-sm lg:hidden">
            <div className="flex size-11 shrink-0 items-center justify-center rounded-full bg-[#F1EDFF] font-['Fraunces'] italic text-[#6C4DF4]">
              {initials(profile.full_name)}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate font-['Fraunces'] italic text-slate-900">
                {profile.full_name}
              </p>
              <p className="truncate text-xs text-slate-500">
                {jobInfo?.job_title || "—"}
              </p>
            </div>
            {status?.employment_status && (
              <span
                className={`shrink-0 rounded-full px-2.5 py-1 font-['IBM_Plex_Mono'] text-[10px] font-semibold uppercase tracking-wide ${
                  STATUS_STYLES[status.employment_status] ||
                  "bg-slate-100 text-slate-600"
                }`}
              >
                {status.employment_status}
              </span>
            )}
          </div>

          {profile.job_tab.job.probation_pending && (
            <ProbationBanner
              employeeId={profile.id}
              probationEndDate={profile.job_tab.job.probation_end_date}
            />
          )}
{isContractEndingSoon(profile.job_tab.job.contract_end_date) && (
            <ContractEndBanner
              endDate={profile.job_tab.job.contract_end_date}
              onReview={() => selectTab("job")}
            />
          )}
          {/* Section heading — orients the user; the count shows progress
              through the sections without needing the nav visible. */}
          <div className="mb-4 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <activeTabMeta.icon className="size-4 text-[#6C4DF4]" />
              <h2 className="font-['Fraunces'] text-lg italic text-slate-900">
                {activeTabMeta.label}
              </h2>
            </div>
            <span className="hidden shrink-0 font-['IBM_Plex_Mono'] text-[11px] text-slate-400 lg:block">
              {String(activeIndex + 1).padStart(2, "0")} / {String(TABS.length).padStart(2, "0")}
            </span>
          </div>

          {/* Tab content */}
          <div>
            {activeTab === "personal" && <BasicInfoSection profile={profile} />}
            {activeTab === "job" && (
              <JobCoreSection
                employeeId={profile.id}
                job={profile.job_tab.job}
                employmentStatus={status?.employment_status}
              />
            )}
            {activeTab === "status" && (
              <EmploymentStatusSection
                employeeId={profile.id}
                current={status}
              />
            )}
            {activeTab === "jobinfo" && (
              <JobInformationSection
                employeeId={profile.id}
                current={jobInfo}
                existingEmployees={existingEmployees}
                selfId={profile.id}
              />
            )}
            {activeTab === "compensation" && (
              <CompensationSection employeeId={profile.id} current={comp} />
            )}
            {activeTab === "allowances" && (
              <AllowancesSection employeeId={profile.id} current={allowances} />
            )}
            {activeTab === "payrates" && (
              <PayRatesSection
                employeeId={profile.id}
                payRates={profile.job_tab.pay_rates}
                potentialBonus={profile.job_tab.potential_bonus}
              />
            )}
            {activeTab === "bonus" && (
              <BonusSection
                employeeId={profile.id}
                history={profile.job_tab.bonus_history}
              />
            )}
            {activeTab === "commission" && (
              <CommissionSection
                employeeId={profile.id}
                history={profile.job_tab.commission_history}
              />
            )}
            {activeTab === "equity" && (
              <EquitySection
                employeeId={profile.id}
                history={profile.job_tab.equity_history}
              />
            )}
            {activeTab === "airportpass" && (
              <AirportPassSection
                employeeId={profile.id}
                history={profile.job_tab.airport_security_pass_history}
              />
            )}
          </div>
        </div>
      </div>

      {/* ── Mobile bottom nav — fixed to the viewport, always reachable,
          never requires scrolling up or down to find it ── */}
      <MobileBottomNav
        tabs={TABS}
        activeTab={activeTab}
        onSelect={selectTab}
        open={mobileNavOpen}
        onOpenChange={setMobileNavOpen}
      />
    </div>
  );
}

// ── Identity card (desktop sidebar header) ──────────────────────────────
function IdentityCard({
  profile,
  jobInfo,
  status,
}: {
  profile: EmployeeProfile;
  jobInfo?: any;
  status?: any;
}) {
  return (
    <div className="overflow-hidden rounded-2xl border border-[#EAE7F6] bg-white shadow-[0_1px_2px_rgba(23,15,60,0.04)]">
      <div className="h-16 bg-gradient-to-r from-[#6C4DF4] to-[#8F7BFA]" />
      <div className="-mt-10 flex flex-col items-center px-6 pb-6 text-center">
        <div className="flex size-20 items-center justify-center rounded-full border-4 border-white bg-[#F1EDFF] font-['Fraunces'] text-2xl italic text-[#6C4DF4] shadow-sm">
          {initials(profile.full_name)}
        </div>
        <p className="mt-3 font-['Fraunces'] text-lg italic text-slate-900">
          {profile.full_name}
        </p>
        <p className="mt-0.5 text-sm text-slate-500">
          {jobInfo?.job_title || "—"}
        </p>

        {status?.employment_status && (
          <span
            className={`mt-3 rounded-full px-2.5 py-1 font-['IBM_Plex_Mono'] text-[10px] font-semibold uppercase tracking-wide ${
              STATUS_STYLES[status.employment_status] ||
              "bg-slate-100 text-slate-600"
            }`}
          >
            {status.employment_status}
          </span>
        )}
      </div>

      <div className="space-y-4 border-t border-[#EDEBF7] px-6 py-5">
        <SideRow
          icon={HashIcon}
          label="Employee #"
          value={profile.vitals.employee_number}
        />
        <SideRow
          icon={MailIcon}
          label="Work Email"
          value={profile.vitals.work_email}
        />
        <SideRow
          icon={PhoneIcon}
          label="Work Phone"
          value={profile.vitals.work_phone}
        />
        <SideRow icon={MapPinIcon} label="Location" value={jobInfo?.location} />
        <SideRow
          icon={BriefcaseIcon}
          label="Department"
          value={jobInfo?.department}
        />
        <SideRow
          icon={CalendarClockIcon}
          label="Hire Date"
          value={
            profile.job_tab.job.hire_date
              ? new Date(profile.job_tab.job.hire_date).toLocaleDateString()
              : undefined
          }
        />
      </div>
    </div>
  );
}

// ── Desktop sidebar link ─────────────────────────────────────────────────
function SidebarLink({
  tab,
  active,
  onClick,
}: {
  tab: { key: TabKey; label: string; icon: any };
  active: boolean;
  onClick: () => void;
}) {
  const Icon = tab.icon;
  return (
    <button
      type="button"
      onClick={onClick}
      aria-current={active ? "page" : undefined}
      className={`group relative flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-left text-[13px] font-medium transition ${
        active
          ? "bg-[#6C4DF4] text-white shadow-sm"
          : "text-slate-600 hover:bg-[#F1EDFF] hover:text-[#6C4DF4]"
      }`}
    >
      <Icon
        className={`size-4 shrink-0 ${active ? "text-white" : "text-slate-400 group-hover:text-[#6C4DF4]"}`}
      />
      <span className="truncate">{tab.label}</span>
    </button>
  );
}

// ── Mobile bottom nav: fixed pill trigger + slide-up sheet ─────────────────
function MobileBottomNav({
  tabs,
  activeTab,
  onSelect,
  open,
  onOpenChange,
}: {
  tabs: { key: TabKey; label: string; short: string; icon: any }[];
  activeTab: TabKey;
  onSelect: (key: TabKey) => void;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const sheetRef = useRef<HTMLDivElement>(null);
  const activeMeta = tabs.find((t) => t.key === activeTab)!;
  const activeIndex = tabs.findIndex((t) => t.key === activeTab);

  // Lock body scroll while the sheet is open.
  useEffect(() => {
    if (open) {
      const original = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = original;
      };
    }
  }, [open]);

  return (
    <div className="lg:hidden">
      {/* Fixed trigger bar — always pinned to the bottom of the viewport,
          thumb-reachable, no scrolling required to find it. */}
      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-[#EAE7F6] bg-white/95 px-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-3 backdrop-blur">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => onOpenChange(true)}
            aria-haspopup="dialog"
            aria-expanded={open}
            className="flex flex-1 items-center gap-2.5 rounded-2xl bg-[#6C4DF4] px-4 py-3 text-left text-white shadow-[0_6px_16px_rgba(108,77,244,0.32)] active:opacity-90"
          >
            <activeMeta.icon className="size-4 shrink-0" />
            <span className="min-w-0 flex-1 truncate text-sm font-semibold">
              {activeMeta.label}
            </span>
            <span className="shrink-0 font-['IBM_Plex_Mono'] text-[10px] text-white/70">
              {activeIndex + 1}/{tabs.length}
            </span>
          </button>
        </div>
      </div>

      {/* Backdrop */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-[1px] transition-opacity"
          onClick={() => onOpenChange(false)}
          aria-hidden="true"
        />
      )}

      {/* Sheet */}
      <div
        ref={sheetRef}
        role="dialog"
        aria-modal="true"
        aria-label="Choose a section"
        className={`fixed inset-x-0 bottom-0 z-50 max-h-[75vh] overflow-hidden rounded-t-3xl bg-white shadow-[0_-8px_30px_rgba(23,15,60,0.18)] transition-transform duration-300 ease-out ${
          open ? "translate-y-0" : "translate-y-full"
        }`}
      >
        <div className="flex items-center justify-between border-b border-[#EDEBF7] px-5 pb-3 pt-3">
          <div className="mx-auto h-1 w-10 rounded-full bg-slate-200 sm:hidden" />
        </div>
        <div className="flex items-center justify-between px-5 pt-2">
          <p className="font-['Fraunces'] text-base italic text-slate-900">
            Jump to section
          </p>
          <button
            type="button"
            onClick={() => onOpenChange(false)}
            aria-label="Close"
            className="flex size-8 items-center justify-center rounded-full text-slate-400 hover:bg-slate-100 hover:text-slate-600"
          >
            <XIcon className="size-4" />
          </button>
        </div>
        <div className="max-h-[calc(75vh-4.5rem)] overflow-y-auto px-3 pb-[max(1rem,env(safe-area-inset-bottom))] pt-2">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const active = tab.key === activeTab;
            return (
              <button
                key={tab.key}
                type="button"
                onClick={() => onSelect(tab.key)}
                className={`flex w-full items-center gap-3 rounded-2xl px-4 py-3.5 text-left text-sm font-medium transition ${
                  active
                    ? "bg-[#F1EDFF] text-[#6C4DF4]"
                    : "text-slate-600 active:bg-slate-50"
                }`}
              >
                <span
                  className={`flex size-9 shrink-0 items-center justify-center rounded-full ${
                    active ? "bg-[#6C4DF4] text-white" : "bg-slate-100 text-slate-400"
                  }`}
                >
                  <Icon className="size-4" />
                </span>
                <span className="flex-1">{tab.label}</span>
                {active && (
                  <span className="size-1.5 shrink-0 rounded-full bg-[#6C4DF4]" />
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function SideRow({
  icon: Icon,
  label,
  value,
}: {
  icon: any;
  label: string;
  value?: string;
}) {
  return (
    <div className="flex items-start gap-2.5">
      <Icon className="mt-0.5 size-3.5 shrink-0 text-slate-400" />
      <div className="min-w-0">
        <p className="font-['IBM_Plex_Mono'] text-[10px] font-medium uppercase tracking-wide text-slate-400">
          {label}
        </p>
        <p className="truncate text-sm text-slate-700">{value || "—"}</p>
      </div>
    </div>
  );
}

// Full-width stacked row: label on the left, value on the right, one field
// per line. Used for read-only section views so values never crowd or run
// into each other, no matter how long they are.
function InfoRow({
  icon: Icon,
  label,
  value,
}: {
  icon?: any;
  label: string;
  value?: string;
}) {
  return (
    <div className="flex items-start gap-6 py-3.5 first:pt-0 last:pb-0">
      <div className="flex w-44 shrink-0 items-center gap-2 pt-0.5 font-['IBM_Plex_Mono'] text-[11px] font-medium uppercase tracking-wide text-slate-400">
        {Icon && <Icon className="size-3.5 shrink-0 text-slate-400" />}
        <span>{label}</span>
      </div>
      <div className="min-w-0 flex-1 break-words text-sm text-slate-800">
        {value || "—"}
      </div>
    </div>
  );
}

function ProbationBanner({
  employeeId,
  probationEndDate,
}: {
  employeeId: string;
  probationEndDate?: string;
}) {
  const [resolve, { isLoading }] = useResolveProbationMutation();

  return (
    <div className="mb-6 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-amber-200 bg-amber-50 px-5 py-4">
      <div>
        <p className="font-['Fraunces'] italic text-amber-900">
          Probation ended{" "}
          {probationEndDate
            ? new Date(probationEndDate).toLocaleDateString()
            : ""}
        </p>
        <p className="mt-0.5 text-xs text-amber-700">
          Confirm whether this employee has passed their probation.
        </p>
      </div>
      <div className="flex shrink-0 gap-2">
        <button
          type="button"
          onClick={() => resolve({ id: employeeId, passed: false })}
          disabled={isLoading}
          className="rounded-lg border border-red-200 bg-white px-3 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-50"
        >
          Did not pass
        </button>
        <button
          type="button"
          onClick={() => resolve({ id: employeeId, passed: true })}
          disabled={isLoading}
          className="flex items-center gap-1.5 rounded-lg bg-[#6C4DF4] px-3 py-1.5 text-xs font-semibold text-white hover:opacity-90"
        >
          {isLoading && <Loader2Icon className="size-3 animate-spin" />}
          Passed — move to Full-time
        </button>
      </div>
    </div>
  );
}
function ContractEndBanner({
  endDate,
  onReview,
}: {
  endDate?: string;
  onReview: () => void;
}) {
  const isPast = endDate ? new Date(endDate).getTime() < Date.now() : false;
  const tone = isPast
    ? { border: "border-red-200", bg: "bg-red-50", title: "text-red-900", body: "text-red-700" }
    : { border: "border-amber-200", bg: "bg-amber-50", title: "text-amber-900", body: "text-amber-700" };

  return (
    <div className={`mb-6 flex flex-wrap items-center justify-between gap-4 rounded-2xl border ${tone.border} ${tone.bg} px-5 py-4`}>
      <div>
        <p className={`font-['Fraunces'] italic ${tone.title}`}>
          {isPast ? "Contract ended" : "Contract ending"}{" "}
          {endDate ? new Date(endDate).toLocaleDateString() : ""}
        </p>
        <p className={`mt-0.5 text-xs ${tone.body}`}>
          Review this employee&apos;s job details to renew, extend, or update their contract.
        </p>
      </div>
      <button
        type="button"
        onClick={onReview}
        className="shrink-0 rounded-lg bg-[#6C4DF4] px-3 py-1.5 text-xs font-semibold text-white hover:opacity-90"
      >
        Review Job Details
      </button>
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
    birth_date: v.birth_date
      ? new Date(v.birth_date).toISOString().slice(0, 10)
      : "",
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

  const set =
    (key: keyof typeof form) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
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

        self_service_access: form.self_service_access as
          | "full_access"
          | "no_access",
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
          <div className="min-w-0 flex-1 divide-y divide-[#EDEBF7]">
            <InfoRow label="Name" value={profile.full_name} />
            <InfoRow label="Preferred Name" value={v.preferred_name} />
            <InfoRow
              label="Birth Date"
              value={
                v.birth_date
                  ? new Date(v.birth_date).toLocaleDateString()
                  : undefined
              }
            />
            <InfoRow label="Gender" value={v.gender} />
            <InfoRow label="Marital Status" value={v.marital_status} />
            <InfoRow label="Address" value={v.address} />
            <InfoRow icon={MailIcon} label="Work Email" value={v.work_email} />
            <InfoRow label="Home Email" value={v.home_email} />
            <InfoRow icon={PhoneIcon} label="Work Phone" value={v.work_phone} />
            <InfoRow label="Mobile" value={v.mobile_phone} />
            <InfoRow label="Home Phone" value={v.home_phone} />
            <InfoRow
              label="Self-service access"
              value={
                v.self_service_access === "full_access"
                  ? "Allow Access"
                  : "No Access"
              }
            />
          </div>
          <button
            type="button"
            onClick={() => setEditing(true)}
            className="shrink-0 text-xs font-semibold text-[#6C4DF4] hover:underline"
          >
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
          <p className="mb-3 font-['IBM_Plex_Mono'] text-xs font-semibold uppercase tracking-wide text-slate-400">
            Personal
          </p>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            <FormField label="Employee #">
              <input
                value={form.employee_number}
                onChange={set("employee_number")}
                className={inputCls}
              />
            </FormField>
            <FormField label="First Name *">
              <input
                value={form.first_name}
                onChange={set("first_name")}
                className={inputCls}
              />
            </FormField>
            <FormField label="Middle Name">
              <input
                value={form.middle_name}
                onChange={set("middle_name")}
                className={inputCls}
              />
            </FormField>
            <FormField label="Last Name *">
              <input
                value={form.last_name}
                onChange={set("last_name")}
                className={inputCls}
              />
            </FormField>
            <FormField label="Preferred Name">
              <input
                value={form.preferred_name}
                onChange={set("preferred_name")}
                className={inputCls}
              />
            </FormField>
            <FormField label="Birth Date">
              <input
                type="date"
                value={form.birth_date}
                onChange={set("birth_date")}
                className={inputCls}
              />
            </FormField>
            <FormField label="Gender">
              <select
                value={form.gender}
                onChange={set("gender")}
                className={inputCls}
              >
                <option value="">– Select –</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </FormField>
            <FormField label="Marital Status">
              <select
                value={form.marital_status}
                onChange={set("marital_status")}
                className={inputCls}
              >
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
          <p className="mb-3 font-['IBM_Plex_Mono'] text-xs font-semibold uppercase tracking-wide text-slate-400">
            Address
          </p>
          <div className="grid grid-cols-2 gap-4">
            <FormField label="Street 1">
              <input
                value={form.street1}
                onChange={set("street1")}
                className={inputCls}
              />
            </FormField>
            <FormField label="Street 2">
              <input
                value={form.street2}
                onChange={set("street2")}
                className={inputCls}
              />
            </FormField>
          </div>
          <div className="mt-4 grid grid-cols-3 gap-4">
            <FormField label="City">
              <input
                value={form.city}
                onChange={set("city")}
                className={inputCls}
              />
            </FormField>
            <FormField label="Province">
              <input
                value={form.province}
                onChange={set("province")}
                className={inputCls}
              />
            </FormField>
            <FormField label="Postal Code">
              <input
                value={form.postal_code}
                onChange={set("postal_code")}
                className={inputCls}
              />
            </FormField>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-4">
            <FormField label="Country">
              <input
                value={form.country}
                onChange={set("country")}
                className={inputCls}
              />
            </FormField>
          </div>
        </div>

        <div>
          <p className="mb-3 font-['IBM_Plex_Mono'] text-xs font-semibold uppercase tracking-wide text-slate-400">
            Contact
          </p>
          <div className="grid grid-cols-2 gap-4">
            <FormField label="Work Phone">
              <input
                value={form.work_phone}
                onChange={set("work_phone")}
                className={inputCls}
              />
            </FormField>
            <FormField label="Ext">
              <input
                value={form.work_phone_ext}
                onChange={set("work_phone_ext")}
                className={inputCls}
              />
            </FormField>
            <FormField label="Mobile Phone">
              <input
                value={form.mobile_phone}
                onChange={set("mobile_phone")}
                className={inputCls}
              />
            </FormField>
            <FormField label="Home Phone">
              <input
                value={form.home_phone}
                onChange={set("home_phone")}
                className={inputCls}
              />
            </FormField>
            <FormField label="Work Email">
              <input
                type="email"
                value={form.work_email}
                onChange={set("work_email")}
                className={inputCls}
              />
            </FormField>
            <FormField label="Home Email">
              <input
                type="email"
                value={form.home_email}
                onChange={set("home_email")}
                className={inputCls}
              />
            </FormField>
          </div>
        </div>

        <div>
          <p className="mb-3 font-['IBM_Plex_Mono'] text-xs font-semibold uppercase tracking-wide text-slate-400">
            Self-service access
          </p>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <button
              type="button"
              onClick={() =>
                setForm((f) => ({ ...f, self_service_access: "full_access" }))
              }
              className={`rounded-xl border p-4 text-left transition ${form.self_service_access === "full_access" ? "border-[#6C4DF4] bg-[#F1EDFF]" : "border-[#EDEBF7] bg-white hover:bg-[#FBFAFF]"}`}
            >
              <p className="font-['Fraunces'] italic text-slate-900">
                Allow Access
              </p>
              <p className="mt-1 text-xs text-slate-500">
                They will be able to log in using the access level in settings.
              </p>
            </button>
            <button
              type="button"
              onClick={() =>
                setForm((f) => ({ ...f, self_service_access: "no_access" }))
              }
              className={`rounded-xl border p-4 text-left transition ${form.self_service_access === "no_access" ? "border-[#6C4DF4] bg-[#F1EDFF]" : "border-[#EDEBF7] bg-white hover:bg-[#FBFAFF]"}`}
            >
              <p className="font-['Fraunces'] italic text-slate-900">
                No Access
              </p>
              <p className="mt-1 text-xs text-slate-500">
                They won&apos;t have access and won&apos;t be able to log in.
              </p>
            </button>
          </div>
        </div>

        {formError && <p className="text-xs text-red-600">{formError}</p>}

        <div className="flex gap-2 border-t border-[#EDEBF7] pt-4">
          <button
            type="button"
            onClick={() => setEditing(false)}
            className="rounded-lg border border-[#EDEBF7] px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-[#FBFAFF]"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={isLoading}
            className="flex items-center gap-1.5 rounded-lg bg-[#6C4DF4] px-3 py-1.5 text-xs font-semibold text-white hover:opacity-90 disabled:opacity-60"
          >
            {isLoading && <Loader2Icon className="size-3 animate-spin" />}
            Save
          </button>
        </div>
      </div>
    </FormSection>
  );
}

// ── Job core — Hire Date / Job Code / Probation / Contract / Hours / Days ─
// NOTE: Contract End Date only applies to fixed-term employees (Contract /
// Temporary / Seasonal). Probation End Date is a separate concept that
// applies to every new hire and is unrelated to Contract End Date — do not
// derive one from the other.
function JobCoreSection({
  employeeId,
  job,
  employmentStatus,
}: {
  employeeId: string;
  job: any;
  employmentStatus?: string;
}) {
  const [editing, setEditing] = useState(false);
  const [probationTouched, setProbationTouched] = useState(false);
  const [form, setForm] = useState({
    hire_date: job.hire_date
      ? new Date(job.hire_date).toISOString().slice(0, 10)
      : "",
    job_code: job.job_code || "",
    probation_end_date: job.probation_end_date
      ? new Date(job.probation_end_date).toISOString().slice(0, 10)
      : "",
    contract_end_date: job.contract_end_date
      ? new Date(job.contract_end_date).toISOString().slice(0, 10)
      : "",
    contracted_hours_per_week: job.contracted_hours_per_week ?? "",
    contracted_days_per_week: job.contracted_days_per_week ?? "",
  });
  const [save, { isLoading }] = useUpdateEmployeeJobCoreMutation();

  const isContractType = employmentStatus
    ? CONTRACT_TYPE_RE.test(employmentStatus)
    : false;
  const showContractEnd = isContractType || Boolean(form.contract_end_date);

  const handleSave = async () => {
    await save({
      id: employeeId,
      hire_date: form.hire_date || undefined,
      job_code: form.job_code || undefined,
      probation_end_date: form.probation_end_date || undefined,
      contract_end_date: form.contract_end_date || undefined,
      contracted_hours_per_week:
        form.contracted_hours_per_week === ""
          ? undefined
          : Number(form.contracted_hours_per_week),
      contracted_days_per_week:
        form.contracted_days_per_week === ""
          ? undefined
          : Number(form.contracted_days_per_week),
    }).unwrap();
    setEditing(false);
  };

  return (
    <FormSection title="Job">
      {!editing ? (
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0 flex-1 divide-y divide-[#EDEBF7]">
            <InfoRow
              label="Hire Date"
              value={
                job.hire_date
                  ? new Date(job.hire_date).toLocaleDateString()
                  : undefined
              }
            />
            <InfoRow label="Job Code" value={job.job_code} />
            <InfoRow
              label="Direct Reports"
              value={String(job.direct_reports_count)}
            />
            <InfoRow
              label="Probation End"
              value={
                job.probation_end_date
                  ? new Date(job.probation_end_date).toLocaleDateString()
                  : undefined
              }
            />
            {showContractEnd && (
              <InfoRow
                label="Contract End"
                value={
                  job.contract_end_date
                    ? new Date(job.contract_end_date).toLocaleDateString()
                    : undefined
                }
              />
            )}
          </div>
          <button
            type="button"
            onClick={() => setEditing(true)}
            className="shrink-0 text-xs font-semibold text-[#6C4DF4] hover:underline"
          >
            Edit
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <FormField label="Hire Date">
              <input
                type="date"
                value={form.hire_date}
                onChange={(e) => {
                  const newHire = e.target.value;
                  setForm((f) => ({
                    ...f,
                    hire_date: newHire,
                    probation_end_date: probationTouched
                      ? f.probation_end_date
                      : addMonthsToDateStr(newHire, 4),
                  }));
                }}
                className={inputCls}
              />
            </FormField>
            <FormField label="Job Code">
              <input
                value={form.job_code}
                onChange={(e) =>
                  setForm((f) => ({ ...f, job_code: e.target.value }))
                }
                className={inputCls}
              />
            </FormField>
            <FormField label="Probation End">
              <input
                type="date"
                value={form.probation_end_date}
                onChange={(e) => {
                  setProbationTouched(true);
                  setForm((f) => ({
                    ...f,
                    probation_end_date: e.target.value,
                  }));
                }}
                className={inputCls}
              />
              <p className="mt-1 text-[11px] text-slate-400">
                Auto-filled 4 months from hire date — edit if needed.
              </p>
            </FormField>
            {showContractEnd ? (
              <FormField label="Contract End">
                <input
                  type="date"
                  value={form.contract_end_date}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, contract_end_date: e.target.value }))
                  }
                  className={inputCls}
                />
                <p className="mt-1 text-[11px] text-slate-400">
                  Fixed-term contract expiry — independent of probation.
                </p>
              </FormField>
            ) : (
              <div className="flex items-end">
                <p className="text-[11px] text-slate-400">
                  Contract End Date only applies to Contract / Temporary /
                  Seasonal employees. Change Employment Status to set one.
                </p>
              </div>
            )}
            <FormField label="Contracted Hours/Week">
              <input
                type="number"
                value={form.contracted_hours_per_week}
                onChange={(e) =>
                  setForm((f) => ({
                    ...f,
                    contracted_hours_per_week: e.target.value,
                  }))
                }
                className={inputCls}
              />
            </FormField>
            <FormField label="Contracted Days/Week">
              <input
                type="number"
                value={form.contracted_days_per_week}
                onChange={(e) =>
                  setForm((f) => ({
                    ...f,
                    contracted_days_per_week: e.target.value,
                  }))
                }
                className={inputCls}
              />
            </FormField>
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setEditing(false)}
              className="rounded-lg border border-[#EDEBF7] px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-[#FBFAFF]"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSave}
              disabled={isLoading}
              className="flex items-center gap-1.5 rounded-lg bg-[#6C4DF4] px-3 py-1.5 text-xs font-semibold text-white hover:opacity-90 disabled:opacity-60"
            >
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
function EmploymentStatusSection({
  employeeId,
  current,
}: {
  employeeId: string;
  current?: any;
}) {
  const [adding, setAdding] = useState(false);
  const [effectiveDate, setEffectiveDate] = useState(
    new Date().toISOString().slice(0, 10),
  );
  const [status, setStatus] = useState("");
  const [comment, setComment] = useState("");
  const [addEntry, { isLoading }] = useAddEmploymentStatusEntryMutation();

  const handleAdd = async () => {
    if (!status) return;
    await addEntry({
      id: employeeId,
      effective_date: effectiveDate,
      employment_status: status,
      comment: comment || undefined,
    }).unwrap();
    setAdding(false);
    setStatus("");
    setComment("");
  };

  return (
    <FormSection title="Employment Status">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0 flex-1">
          <InfoRow label="Current Status" value={current?.employment_status} />
        </div>
        {!adding && (
          <button
            type="button"
            onClick={() => setAdding(true)}
            className="flex items-center gap-1 text-xs font-semibold text-[#6C4DF4] hover:underline"
          >
            <PlusIcon className="size-3.5" /> Add entry
          </button>
        )}
      </div>
      {adding && (
        <div className="mt-4 space-y-4 border-t border-[#EDEBF7] pt-4">
          <div className="grid grid-cols-2 gap-4">
            <FormField label="Effective Date">
              <input
                type="date"
                value={effectiveDate}
                onChange={(e) => setEffectiveDate(e.target.value)}
                className={inputCls}
              />
            </FormField>
            <ComboField
              label="Status"
              value={status}
              onChange={setStatus}
              options={EMPLOYMENT_STATUS_OPTIONS}
            />
          </div>
          <FormField label="Comment">
            <input
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className={inputCls}
            />
          </FormField>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setAdding(false)}
              className="rounded-lg border border-[#EDEBF7] px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-[#FBFAFF]"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleAdd}
              disabled={isLoading}
              className="flex items-center gap-1.5 rounded-lg bg-[#6C4DF4] px-3 py-1.5 text-xs font-semibold text-white hover:opacity-90 disabled:opacity-60"
            >
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
  const [effectiveDate, setEffectiveDate] = useState(
    new Date().toISOString().slice(0, 10),
  );
  const [form, setForm] = useState({
    job_title: "",
    reports_to: "",
    department: "",
    division: "",
    location: "",
  });
  const [addEntry, { isLoading }] = useAddJobInformationEntryMutation();

  const jobTitleOptions = uniqueSorted(
    existingEmployees.map((e) => e.job_title),
  );
  const departmentOptions = uniqueSorted(
    existingEmployees.map((e) => e.department),
  );
  const divisionOptions = uniqueSorted(
    existingEmployees.map((e) => e.division),
  );
  const locationOptions = uniqueSorted(
    existingEmployees.map((e) => e.location),
  );

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
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0 flex-1 divide-y divide-[#EDEBF7]">
          <InfoRow label="Job Title" value={current?.job_title} />
          <InfoRow label="Department" value={current?.department} />
          <InfoRow label="Division" value={current?.division} />
          <InfoRow label="Location" value={current?.location} />
        </div>
        {!adding && (
          <button
            type="button"
            onClick={() => setAdding(true)}
            className="flex shrink-0 items-center gap-1 text-xs font-semibold text-[#6C4DF4] hover:underline"
          >
            <PlusIcon className="size-3.5" /> Add entry
          </button>
        )}
      </div>
      {adding && (
        <div className="mt-4 space-y-4 border-t border-[#EDEBF7] pt-4">
          <FormField label="Effective Date">
            <input
              type="date"
              value={effectiveDate}
              onChange={(e) => setEffectiveDate(e.target.value)}
              className={inputCls}
            />
          </FormField>
          <div className="grid grid-cols-2 gap-4">
            <ComboField
              label="Job Title"
              value={form.job_title}
              onChange={(v) => setForm((f) => ({ ...f, job_title: v }))}
              options={jobTitleOptions}
            />
            <FormField label="Reports To">
              <select
                value={form.reports_to}
                onChange={(e) =>
                  setForm((f) => ({ ...f, reports_to: e.target.value }))
                }
                className={inputCls}
              >
                <option value="">– Select –</option>
                {existingEmployees
                  .filter((e) => e.id !== selfId)
                  .map((e) => (
                    <option key={e.id} value={e.id}>
                      {e.full_name}
                    </option>
                  ))}
              </select>
            </FormField>
            <ComboField
              label="Department"
              value={form.department}
              onChange={(v) => setForm((f) => ({ ...f, department: v }))}
              options={departmentOptions}
            />
            <ComboField
              label="Division"
              value={form.division}
              onChange={(v) => setForm((f) => ({ ...f, division: v }))}
              options={divisionOptions}
            />
            <ComboField
              label="Location"
              value={form.location}
              onChange={(v) => setForm((f) => ({ ...f, location: v }))}
              options={locationOptions}
            />
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setAdding(false)}
              className="rounded-lg border border-[#EDEBF7] px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-[#FBFAFF]"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleAdd}
              disabled={isLoading}
              className="flex items-center gap-1.5 rounded-lg bg-[#6C4DF4] px-3 py-1.5 text-xs font-semibold text-white hover:opacity-90 disabled:opacity-60"
            >
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
function CompensationSection({
  employeeId,
  current,
}: {
  employeeId: string;
  current?: any;
}) {
  const [adding, setAdding] = useState(false);
  const [effectiveDate, setEffectiveDate] = useState(
    new Date().toISOString().slice(0, 10),
  );
  const [form, setForm] = useState({
    pay_schedule: "",
    pay_type: "",
    pay_rate_amount: "",
    pay_rate_currency: "XCD",
    pay_rate_per: "",
  });
  const [addEntry, { isLoading }] = useAddCompensationEntryMutation();

  const handleAdd = async () => {
    if (
      !form.pay_schedule ||
      !form.pay_type ||
      form.pay_rate_amount === "" ||
      !form.pay_rate_per
    )
      return;
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
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0 flex-1 divide-y divide-[#EDEBF7]">
          <InfoRow label="Pay Type" value={current?.pay_type} />
          <InfoRow
            label="Rate"
            value={
              current
                ? `${current.pay_rate_amount} ${current.pay_rate_currency} / ${current.pay_rate_per}`
                : undefined
            }
          />
          <InfoRow label="Schedule" value={current?.pay_schedule} />
        </div>
        {!adding && (
          <button
            type="button"
            onClick={() => setAdding(true)}
            className="flex shrink-0 items-center gap-1 text-xs font-semibold text-[#6C4DF4] hover:underline"
          >
            <PlusIcon className="size-3.5" /> Add entry
          </button>
        )}
      </div>
      {adding && (
        <div className="mt-4 space-y-4 border-t border-[#EDEBF7] pt-4">
          <FormField label="Effective Date">
            <input
              type="date"
              value={effectiveDate}
              onChange={(e) => setEffectiveDate(e.target.value)}
              className={inputCls}
            />
          </FormField>
          <div className="grid grid-cols-2 gap-4">
            <FormField label="Pay Schedule">
              <input
                value={form.pay_schedule}
                onChange={(e) =>
                  setForm((f) => ({ ...f, pay_schedule: e.target.value }))
                }
                className={inputCls}
              />
            </FormField>
            <FormField label="Pay Type">
              <select
                value={form.pay_type}
                onChange={(e) =>
                  setForm((f) => ({ ...f, pay_type: e.target.value }))
                }
                className={inputCls}
              >
                <option value="">– Select –</option>
                <option value="Salary">Salary</option>
                <option value="Hourly">Hourly</option>
              </select>
            </FormField>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <FormField label="Amount">
              <input
                type="number"
                value={form.pay_rate_amount}
                onChange={(e) =>
                  setForm((f) => ({ ...f, pay_rate_amount: e.target.value }))
                }
                className={inputCls}
              />
            </FormField>
            <FormField label="Currency">
              <input
                value={form.pay_rate_currency}
                onChange={(e) =>
                  setForm((f) => ({ ...f, pay_rate_currency: e.target.value }))
                }
                className={inputCls}
              />
            </FormField>
            <FormField label="Per">
              <select
                value={form.pay_rate_per}
                onChange={(e) =>
                  setForm((f) => ({ ...f, pay_rate_per: e.target.value }))
                }
                className={inputCls}
              >
                <option value="">– Select –</option>
                <option value="Hour">Hour</option>
                <option value="Pay Period">Pay Period</option>
                <option value="Month">Month</option>
                <option value="Year">Year</option>
              </select>
            </FormField>
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setAdding(false)}
              className="rounded-lg border border-[#EDEBF7] px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-[#FBFAFF]"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleAdd}
              disabled={isLoading}
              className="flex items-center gap-1.5 rounded-lg bg-[#6C4DF4] px-3 py-1.5 text-xs font-semibold text-white hover:opacity-90 disabled:opacity-60"
            >
              {isLoading && <Loader2Icon className="size-3 animate-spin" />}
              Save
            </button>
          </div>
        </div>
      )}
    </FormSection>
  );
}

// ── Allowances — effective-dated, add new entry ────────────────────────────
function AllowancesSection({
  employeeId,
  current,
}: {
  employeeId: string;
  current?: any;
}) {
  const [adding, setAdding] = useState(false);
  const [effectiveDate, setEffectiveDate] = useState(
    new Date().toISOString().slice(0, 10),
  );
  const [form, setForm] = useState({
    phone: "",
    travel: "",
    housing: "",
    electricity: "",
    acting: "",
    additional_duties: "",
    shift_leader: "",
    call_out: "",
    other: "",
    currency: "XCD",
  });
  const [addEntry, { isLoading }] = useAddAllowanceEntryMutation();

  const set =
    (key: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
      setForm((f) => ({ ...f, [key]: e.target.value }));

  const handleAdd = async () => {
    await addEntry({
      id: employeeId,
      effective_date: effectiveDate,
      phone: form.phone === "" ? undefined : Number(form.phone),
      travel: form.travel === "" ? undefined : Number(form.travel),
      housing: form.housing === "" ? undefined : Number(form.housing),
      electricity:
        form.electricity === "" ? undefined : Number(form.electricity),
      acting: form.acting === "" ? undefined : Number(form.acting),
      additional_duties:
        form.additional_duties === ""
          ? undefined
          : Number(form.additional_duties),
      shift_leader:
        form.shift_leader === "" ? undefined : Number(form.shift_leader),
      call_out: form.call_out === "" ? undefined : Number(form.call_out),
      other: form.other === "" ? undefined : Number(form.other),
      currency: form.currency,
    }).unwrap();
    setAdding(false);
  };

  const rows: [string, number | undefined][] = [
    ["Phone", current?.phone],
    ["Travel", current?.travel],
    ["Housing", current?.housing],
    ["Electricity", current?.electricity],
    ["Acting", current?.acting],
    ["Additional Duties", current?.additional_duties],
    ["Shift Leader", current?.shift_leader],
    ["Call Out", current?.call_out],
    ["Other", current?.other],
  ];

  return (
    <FormSection title="Allowances">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0 flex-1 divide-y divide-[#EDEBF7]">
          {rows.map(([label, value]) => (
            <InfoRow
              key={label}
              label={label}
              value={
                value !== undefined
                  ? `${value} ${current?.currency || ""}`.trim()
                  : undefined
              }
            />
          ))}
        </div>
        {!adding && (
          <button
            type="button"
            onClick={() => setAdding(true)}
            className="flex shrink-0 items-center gap-1 text-xs font-semibold text-[#6C4DF4] hover:underline"
          >
            <PlusIcon className="size-3.5" /> Add entry
          </button>
        )}
      </div>
      {adding && (
        <div className="mt-4 space-y-4 border-t border-[#EDEBF7] pt-4">
          <div className="grid grid-cols-2 gap-4">
            <FormField label="Effective Date">
              <input
                type="date"
                value={effectiveDate}
                onChange={(e) => setEffectiveDate(e.target.value)}
                className={inputCls}
              />
            </FormField>
            <FormField label="Currency">
              <input value={form.currency} onChange={set("currency")} className={inputCls} />
            </FormField>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <FormField label="Phone"><input type="number" value={form.phone} onChange={set("phone")} className={inputCls} /></FormField>
            <FormField label="Travel"><input type="number" value={form.travel} onChange={set("travel")} className={inputCls} /></FormField>
            <FormField label="Housing"><input type="number" value={form.housing} onChange={set("housing")} className={inputCls} /></FormField>
            <FormField label="Electricity"><input type="number" value={form.electricity} onChange={set("electricity")} className={inputCls} /></FormField>
            <FormField label="Acting"><input type="number" value={form.acting} onChange={set("acting")} className={inputCls} /></FormField>
            <FormField label="Additional Duties"><input type="number" value={form.additional_duties} onChange={set("additional_duties")} className={inputCls} /></FormField>
            <FormField label="Shift Leader"><input type="number" value={form.shift_leader} onChange={set("shift_leader")} className={inputCls} /></FormField>
            <FormField label="Call Out"><input type="number" value={form.call_out} onChange={set("call_out")} className={inputCls} /></FormField>
            <FormField label="Other"><input type="number" value={form.other} onChange={set("other")} className={inputCls} /></FormField>
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

// ── Pay Rates & Potential Bonus — single-value panels ──────────────────────
function PayRatesSection({
  employeeId,
  payRates,
  potentialBonus,
}: {
  employeeId: string;
  payRates?: any;
  potentialBonus?: any;
}) {
  const [editingRates, setEditingRates] = useState(false);
  const [ratesForm, setRatesForm] = useState({
    daily: payRates?.daily ?? "",
    holiday: payRates?.holiday ?? "",
    sick: payRates?.sick ?? "",
    vacation_pay_in_lieu_rate: payRates?.vacation_pay_in_lieu_rate ?? "",
  });
  const [saveRates, { isLoading: savingRates }] = useUpdatePayRatesMutation();

  const [editingBonus, setEditingBonus] = useState(false);
  const [bonusForm, setBonusForm] = useState({
    annual_percentage: potentialBonus?.annual_percentage ?? "",
    annual_amount: potentialBonus?.annual_amount ?? "",
    annual_amount_currency: potentialBonus?.annual_amount_currency || "XCD",
  });
  const [saveBonus, { isLoading: savingBonus }] =
    useUpdatePotentialBonusMutation();

  const setRate =
    (key: keyof typeof ratesForm) => (e: React.ChangeEvent<HTMLInputElement>) =>
      setRatesForm((f) => ({ ...f, [key]: e.target.value }));
  const setBonusField =
    (key: keyof typeof bonusForm) => (e: React.ChangeEvent<HTMLInputElement>) =>
      setBonusForm((f) => ({ ...f, [key]: e.target.value }));

  const handleSaveRates = async () => {
    await saveRates({
      id: employeeId,
      daily: ratesForm.daily === "" ? undefined : Number(ratesForm.daily),
      holiday: ratesForm.holiday === "" ? undefined : Number(ratesForm.holiday),
      sick: ratesForm.sick === "" ? undefined : Number(ratesForm.sick),
      vacation_pay_in_lieu_rate:
        ratesForm.vacation_pay_in_lieu_rate === ""
          ? undefined
          : Number(ratesForm.vacation_pay_in_lieu_rate),
    }).unwrap();
    setEditingRates(false);
  };

  const handleSaveBonus = async () => {
    await saveBonus({
      id: employeeId,
      annual_percentage:
        bonusForm.annual_percentage === ""
          ? undefined
          : Number(bonusForm.annual_percentage),
      annual_amount:
        bonusForm.annual_amount === "" ? undefined : Number(bonusForm.annual_amount),
      annual_amount_currency: bonusForm.annual_amount_currency,
    }).unwrap();
    setEditingBonus(false);
  };

  return (
    <div className="space-y-6">
      <FormSection title="Pay Rates">
        {!editingRates ? (
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0 flex-1 divide-y divide-[#EDEBF7]">
              <InfoRow label="Daily" value={payRates?.daily !== undefined ? String(payRates.daily) : undefined} />
              <InfoRow label="Holiday" value={payRates?.holiday !== undefined ? String(payRates.holiday) : undefined} />
              <InfoRow label="Sick" value={payRates?.sick !== undefined ? String(payRates.sick) : undefined} />
              <InfoRow
                label="Vacation Pay in Lieu"
                value={
                  payRates?.vacation_pay_in_lieu_rate !== undefined
                    ? String(payRates.vacation_pay_in_lieu_rate)
                    : undefined
                }
              />
            </div>
            <button
              type="button"
              onClick={() => setEditingRates(true)}
              className="shrink-0 text-xs font-semibold text-[#6C4DF4] hover:underline"
            >
              Edit
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <FormField label="Daily"><input type="number" value={ratesForm.daily} onChange={setRate("daily")} className={inputCls} /></FormField>
              <FormField label="Holiday"><input type="number" value={ratesForm.holiday} onChange={setRate("holiday")} className={inputCls} /></FormField>
              <FormField label="Sick"><input type="number" value={ratesForm.sick} onChange={setRate("sick")} className={inputCls} /></FormField>
              <FormField label="Vacation Pay in Lieu"><input type="number" value={ratesForm.vacation_pay_in_lieu_rate} onChange={setRate("vacation_pay_in_lieu_rate")} className={inputCls} /></FormField>
            </div>
            <div className="flex gap-2">
              <button type="button" onClick={() => setEditingRates(false)} className="rounded-lg border border-[#EDEBF7] px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-[#FBFAFF]">
                Cancel
              </button>
              <button type="button" onClick={handleSaveRates} disabled={savingRates} className="flex items-center gap-1.5 rounded-lg bg-[#6C4DF4] px-3 py-1.5 text-xs font-semibold text-white hover:opacity-90 disabled:opacity-60">
                {savingRates && <Loader2Icon className="size-3 animate-spin" />}
                Save
              </button>
            </div>
          </div>
        )}
      </FormSection>

      <FormSection title="Potential Bonus">
        {!editingBonus ? (
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0 flex-1 divide-y divide-[#EDEBF7]">
              <InfoRow
                label="Annual %"
                value={
                  potentialBonus?.annual_percentage !== undefined
                    ? `${potentialBonus.annual_percentage}%`
                    : undefined
                }
              />
              <InfoRow
                label="Annual Amount"
                value={
                  potentialBonus?.annual_amount !== undefined
                    ? `${potentialBonus.annual_amount} ${potentialBonus.annual_amount_currency || ""}`.trim()
                    : undefined
                }
              />
            </div>
            <button
              type="button"
              onClick={() => setEditingBonus(true)}
              className="shrink-0 text-xs font-semibold text-[#6C4DF4] hover:underline"
            >
              Edit
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-4">
              <FormField label="Annual %"><input type="number" value={bonusForm.annual_percentage} onChange={setBonusField("annual_percentage")} className={inputCls} /></FormField>
              <FormField label="Annual Amount"><input type="number" value={bonusForm.annual_amount} onChange={setBonusField("annual_amount")} className={inputCls} /></FormField>
              <FormField label="Currency"><input value={bonusForm.annual_amount_currency} onChange={setBonusField("annual_amount_currency")} className={inputCls} /></FormField>
            </div>
            <div className="flex gap-2">
              <button type="button" onClick={() => setEditingBonus(false)} className="rounded-lg border border-[#EDEBF7] px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-[#FBFAFF]">
                Cancel
              </button>
              <button type="button" onClick={handleSaveBonus} disabled={savingBonus} className="flex items-center gap-1.5 rounded-lg bg-[#6C4DF4] px-3 py-1.5 text-xs font-semibold text-white hover:opacity-90 disabled:opacity-60">
                {savingBonus && <Loader2Icon className="size-3 animate-spin" />}
                Save
              </button>
            </div>
          </div>
        )}
      </FormSection>
    </div>
  );
}

// ── Bonus — flat list, add new entry ────────────────────────────────────────
function BonusSection({
  employeeId,
  history,
}: {
  employeeId: string;
  history: any[];
}) {
  const [adding, setAdding] = useState(false);
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [amount, setAmount] = useState("");
  const [reason, setReason] = useState("");
  const [comment, setComment] = useState("");
  const [addEntry, { isLoading }] = useAddBonusEntryMutation();

  const handleAdd = async () => {
    if (amount === "") return;
    await addEntry({
      id: employeeId,
      date,
      amount: Number(amount),
      reason: reason || undefined,
      comment: comment || undefined,
    }).unwrap();
    setAdding(false);
    setAmount("");
    setReason("");
    setComment("");
  };

  return (
    <FormSection title="Bonus">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0 flex-1">
          {history.length === 0 ? (
            <p className="text-sm text-slate-400">No bonus entries yet.</p>
          ) : (
            <div className="divide-y divide-[#EDEBF7]">
              {history.map((b: any, i: number) => (
                <InfoRow
                  key={b._id || i}
                  label={new Date(b.date).toLocaleDateString()}
                  value={`${b.amount}${b.reason ? ` — ${b.reason}` : ""}`}
                />
              ))}
            </div>
          )}
        </div>
        {!adding && (
          <button
            type="button"
            onClick={() => setAdding(true)}
            className="flex shrink-0 items-center gap-1 text-xs font-semibold text-[#6C4DF4] hover:underline"
          >
            <PlusIcon className="size-3.5" /> Add entry
          </button>
        )}
      </div>
      {adding && (
        <div className="mt-4 space-y-4 border-t border-[#EDEBF7] pt-4">
          <div className="grid grid-cols-2 gap-4">
            <FormField label="Date"><input type="date" value={date} onChange={(e) => setDate(e.target.value)} className={inputCls} /></FormField>
            <FormField label="Amount"><input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} className={inputCls} /></FormField>
          </div>
          <FormField label="Reason"><input value={reason} onChange={(e) => setReason(e.target.value)} className={inputCls} /></FormField>
          <FormField label="Comment"><input value={comment} onChange={(e) => setComment(e.target.value)} className={inputCls} /></FormField>
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

// ── Commission — flat list, add new entry ───────────────────────────────────
function CommissionSection({
  employeeId,
  history,
}: {
  employeeId: string;
  history: any[];
}) {
  const [adding, setAdding] = useState(false);
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [amount, setAmount] = useState("");
  const [comment, setComment] = useState("");
  const [addEntry, { isLoading }] = useAddCommissionEntryMutation();

  const handleAdd = async () => {
    if (amount === "") return;
    await addEntry({
      id: employeeId,
      date,
      amount: Number(amount),
      comment: comment || undefined,
    }).unwrap();
    setAdding(false);
    setAmount("");
    setComment("");
  };

  return (
    <FormSection title="Commission">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0 flex-1">
          {history.length === 0 ? (
            <p className="text-sm text-slate-400">No commission entries yet.</p>
          ) : (
            <div className="divide-y divide-[#EDEBF7]">
              {history.map((c: any, i: number) => (
                <InfoRow
                  key={c._id || i}
                  label={new Date(c.date).toLocaleDateString()}
                  value={String(c.amount)}
                />
              ))}
            </div>
          )}
        </div>
        {!adding && (
          <button
            type="button"
            onClick={() => setAdding(true)}
            className="flex shrink-0 items-center gap-1 text-xs font-semibold text-[#6C4DF4] hover:underline"
          >
            <PlusIcon className="size-3.5" /> Add entry
          </button>
        )}
      </div>
      {adding && (
        <div className="mt-4 space-y-4 border-t border-[#EDEBF7] pt-4">
          <div className="grid grid-cols-2 gap-4">
            <FormField label="Date"><input type="date" value={date} onChange={(e) => setDate(e.target.value)} className={inputCls} /></FormField>
            <FormField label="Amount"><input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} className={inputCls} /></FormField>
          </div>
          <FormField label="Comment"><input value={comment} onChange={(e) => setComment(e.target.value)} className={inputCls} /></FormField>
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

// ── Equity — flat list, add new entry ───────────────────────────────────────
const EQUITY_GRANT_TYPES = ["ISO", "NSO", "RSU", "Options", "Other"];

function EquitySection({
  employeeId,
  history,
}: {
  employeeId: string;
  history: any[];
}) {
  const [adding, setAdding] = useState(false);
  const [form, setForm] = useState({
    grant_type: "",
    custom_grant_type_name: "",
    grant_date: new Date().toISOString().slice(0, 10),
    vesting_start_date: "",
    equity_granted: "",
    strike_price: "",
    vesting_schedule: "",
    vesting_months: "",
    cliff_months: "",
  });
  const [addEntry, { isLoading }] = useAddEquityEntryMutation();

  const set =
    (key: keyof typeof form) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
      setForm((f) => ({ ...f, [key]: e.target.value }));

  const handleAdd = async () => {
    if (!form.grant_type || !form.grant_date || form.equity_granted === "")
      return;
    await addEntry({
      id: employeeId,
      grant_type: form.grant_type,
      custom_grant_type_name: form.custom_grant_type_name || undefined,
      grant_date: form.grant_date,
      vesting_start_date: form.vesting_start_date || undefined,
      equity_granted: Number(form.equity_granted),
      strike_price: form.strike_price === "" ? undefined : Number(form.strike_price),
      vesting_schedule: form.vesting_schedule || undefined,
      vesting_months:
        form.vesting_months === "" ? undefined : Number(form.vesting_months),
      cliff_months:
        form.cliff_months === "" ? undefined : Number(form.cliff_months),
    }).unwrap();
    setAdding(false);
  };

  return (
    <FormSection title="Equity">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0 flex-1">
          {history.length === 0 ? (
            <p className="text-sm text-slate-400">No equity grants yet.</p>
          ) : (
            <div className="divide-y divide-[#EDEBF7]">
              {history.map((eq: any, i: number) => (
                <InfoRow
                  key={eq._id || i}
                  label={`${eq.grant_type}${
                    eq.grant_type === "Other" && eq.custom_grant_type_name
                      ? ` (${eq.custom_grant_type_name})`
                      : ""
                  } — ${new Date(eq.grant_date).toLocaleDateString()}`}
                  value={`${eq.equity_granted} units${
                    eq.strike_price ? ` @ ${eq.strike_price} strike` : ""
                  }`}
                />
              ))}
            </div>
          )}
        </div>
        {!adding && (
          <button
            type="button"
            onClick={() => setAdding(true)}
            className="flex shrink-0 items-center gap-1 text-xs font-semibold text-[#6C4DF4] hover:underline"
          >
            <PlusIcon className="size-3.5" /> Add entry
          </button>
        )}
      </div>
      {adding && (
        <div className="mt-4 space-y-4 border-t border-[#EDEBF7] pt-4">
          <div className="grid grid-cols-2 gap-4">
            <FormField label="Grant Type">
              <select value={form.grant_type} onChange={set("grant_type")} className={inputCls}>
                <option value="">– Select –</option>
                {EQUITY_GRANT_TYPES.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </FormField>
            {form.grant_type === "Other" && (
              <FormField label="Custom Grant Type">
                <input value={form.custom_grant_type_name} onChange={set("custom_grant_type_name")} className={inputCls} />
              </FormField>
            )}
            <FormField label="Grant Date"><input type="date" value={form.grant_date} onChange={set("grant_date")} className={inputCls} /></FormField>
            <FormField label="Vesting Start Date"><input type="date" value={form.vesting_start_date} onChange={set("vesting_start_date")} className={inputCls} /></FormField>
            <FormField label="Equity Granted"><input type="number" value={form.equity_granted} onChange={set("equity_granted")} className={inputCls} /></FormField>
            <FormField label="Strike Price"><input type="number" value={form.strike_price} onChange={set("strike_price")} className={inputCls} /></FormField>
            <FormField label="Vesting Schedule"><input value={form.vesting_schedule} onChange={set("vesting_schedule")} placeholder="e.g. 4yr / 1yr cliff" className={inputCls} /></FormField>
            <FormField label="Vesting Months"><input type="number" value={form.vesting_months} onChange={set("vesting_months")} className={inputCls} /></FormField>
            <FormField label="Cliff Months"><input type="number" value={form.cliff_months} onChange={set("cliff_months")} className={inputCls} /></FormField>
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

// ── Airport Security Pass — most recent + history, add new entry ───────────
function AirportPassSection({
  employeeId,
  history,
}: {
  employeeId: string;
  history: any[];
}) {
  const [adding, setAdding] = useState(false);
  const [issueDate, setIssueDate] = useState(new Date().toISOString().slice(0, 10));
  const [expirationDate, setExpirationDate] = useState("");
  const [comments, setComments] = useState("");
  const [addEntry, { isLoading }] = useAddAirportSecurityPassEntryMutation();

  const handleAdd = async () => {
    if (!issueDate || !expirationDate) return;
    await addEntry({
      id: employeeId,
      issue_date: issueDate,
      expiration_date: expirationDate,
      comments: comments || undefined,
    }).unwrap();
    setAdding(false);
    setComments("");
  };

  const mostRecent = history[0];
  const isExpired = mostRecent
    ? new Date(mostRecent.expiration_date) < new Date()
    : false;

  return (
    <FormSection title="Airport Security Pass">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0 flex-1">
          {mostRecent ? (
            <div className="divide-y divide-[#EDEBF7]">
              <InfoRow label="Issue Date" value={new Date(mostRecent.issue_date).toLocaleDateString()} />
              <InfoRow label="Expiration Date" value={new Date(mostRecent.expiration_date).toLocaleDateString()} />
              <InfoRow label="Comments" value={mostRecent.comments} />
              {isExpired && (
                <p className="pt-3 text-xs font-semibold text-red-600">
                  This pass has expired.
                </p>
              )}
            </div>
          ) : (
            <p className="text-sm text-slate-400">No airport security pass on file.</p>
          )}
        </div>
        {!adding && (
          <button
            type="button"
            onClick={() => setAdding(true)}
            className="flex shrink-0 items-center gap-1 text-xs font-semibold text-[#6C4DF4] hover:underline"
          >
            <PlusIcon className="size-3.5" /> Add entry
          </button>
        )}
      </div>
      {adding && (
        <div className="mt-4 space-y-4 border-t border-[#EDEBF7] pt-4">
          <div className="grid grid-cols-2 gap-4">
            <FormField label="Issue Date"><input type="date" value={issueDate} onChange={(e) => setIssueDate(e.target.value)} className={inputCls} /></FormField>
            <FormField label="Expiration Date"><input type="date" value={expirationDate} onChange={(e) => setExpirationDate(e.target.value)} className={inputCls} /></FormField>
          </div>
          <FormField label="Comments"><input value={comments} onChange={(e) => setComments(e.target.value)} className={inputCls} /></FormField>
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
      {history.length > 1 && (
        <div className="mt-6 border-t border-[#EDEBF7] pt-4">
          <p className="mb-2 font-['IBM_Plex_Mono'] text-xs font-semibold uppercase tracking-wide text-slate-400">
            History
          </p>
          <div className="space-y-2">
            {history.slice(1).map((h: any, i: number) => (
              <div key={h._id || i} className="rounded-lg bg-[#FBFAFF] px-3 py-2 text-xs text-slate-600">
                {new Date(h.issue_date).toLocaleDateString()} – {new Date(h.expiration_date).toLocaleDateString()}
                {h.comments && <span className="text-slate-400"> · {h.comments}</span>}
              </div>
            ))}
          </div>
        </div>
      )}
    </FormSection>
  );
}