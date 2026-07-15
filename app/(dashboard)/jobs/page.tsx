/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  BriefcaseIcon,
  SearchIcon,
  Loader2Icon,
  InboxIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  XIcon,
  PlusIcon,
  PencilIcon,
  Trash2Icon,
  MapPinIcon,

  BuildingIcon,
  AlertTriangleIcon,
  CalendarIcon,
} from "lucide-react";

import { Job, JobFilters, JobStatus, EmploymentType } from "@/types";
import {
  useGetAllJobsQuery,
  useGetJobsByRestaurantQuery,
  useCreateJobMutation,
  useUpdateJobMutation,
  useDeleteJobMutation,
} from "@/redux/jods/jobApi";
import { Topbar } from "@/components/layout/Topbar";
import { useGetAllRestaurantsQuery } from "@/redux/restaurants/restaurantApi";
import { RichTextEditor } from "@/components/dashboard/jobs/RichTextEditor";

const PAGE_SIZE = 25;

const STATUSES: JobStatus[] = ["open", "closed", "draft"];
const EMPLOYMENT_TYPES: EmploymentType[] = [
  "Full-time",
  "Part-time",
  "Contract",
  "Seasonal",
  "Internship",
];

const STATUS_COLOR: Record<string, string> = {
  open: "bg-emerald-100 text-emerald-700",
  closed: "bg-red-100 text-red-700",
  draft: "bg-slate-100 text-slate-700",
};

function statusLabel(s?: string) {
  if (!s) return "Draft";
  return s.charAt(0).toUpperCase() + s.slice(1);
}

function LedgerFonts() {
  return (
    <style jsx global>{`
      @import url("https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,400;0,9..144,500;1,9..144,400;1,9..144,500&family=Inter:wght@400;500;600&family=IBM+Plex+Mono:wght@400;500&display=swap");
    `}</style>
  );
}



export default function AdminJobsDashboard() {
  const [search, setSearch] = useState("");
  const [restaurantFilter, setRestaurantFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState<JobStatus | "all">("all");
  const [page, setPage] = useState(1);
  const [editingJob, setEditingJob] = useState<Job | null>(null);
  const [creatingOpen, setCreatingOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Job | null>(null);

  const filters: JobFilters = useMemo(
    () => ({
      ...(statusFilter !== "all" ? { status: statusFilter } : {}),
    }),
    [statusFilter],
  );

  const { data, isLoading, isError, error } = useGetAllJobsQuery(filters);
  const jobs = data?.jobs ?? [];

  const restaurants = useMemo(() => {
    const map = new Map<string, string>();
    jobs.forEach((j: any) => {
      if (j.restaurant_id)
        map.set(j.restaurant_id, j.restaurant_name || j.restaurant_id);
    });
    return Array.from(map.entries());
  }, [jobs]);

  // When a specific restaurant is chosen, prefer the dedicated endpoint.
  const { data: byRestaurant, isFetching: isFetchingByRestaurant } =
    useGetJobsByRestaurantQuery(restaurantFilter, {
      skip: restaurantFilter === "all",
    });

  const baseList: any[] =
    restaurantFilter === "all" ? jobs : (byRestaurant ?? []);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return baseList.filter((j) => {
      if (
        q &&
        !(
          j.position?.toLowerCase().includes(q) ||
          j.department?.toLowerCase().includes(q) ||
          j.location?.toLowerCase().includes(q)
        )
      )
        return false;
      if (statusFilter !== "all" && j.status !== statusFilter) return false;
      return true;
    });
  }, [baseList, search, statusFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const pageItems = filtered.slice(
    (safePage - 1) * PAGE_SIZE,
    safePage * PAGE_SIZE,
  );

  const resetToFirstPage = () => setPage(1);

  const statusCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    jobs.forEach((j: any) => {
      const s = j.status || "draft";
      counts[s] = (counts[s] || 0) + 1;
    });
    return counts;
  }, [jobs]);

  const loading =
    isLoading || (restaurantFilter !== "all" && isFetchingByRestaurant);

  return (
    <div className="mx-auto max-w-6xl font-['Inter']">
      <LedgerFonts />
      <Topbar />
      <div className="flex flex-wrap items-start justify-between gap-4 px-8 py-8">
        <motion.div
          initial={{ y: 16, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <span className="font-['IBM_Plex_Mono'] text-xs font-semibold uppercase tracking-widest text-fuchsia-600">
            [ Recruitment ]
          </span>
          <h1 className="mt-2 font-['Fraunces'] text-3xl italic text-slate-900 sm:text-4xl">
            Open Roles
          </h1>
          <p className="mt-2 max-w-xl text-sm leading-relaxed text-slate-600 sm:text-base">
            Every position posted across your restaurants — create, edit, close.
          </p>
        </motion.div>

        <button
          type="button"
          onClick={() => setCreatingOpen(true)}
          className="flex items-center gap-2 rounded-xl bg-linear-to-br from-pink-500 via-fuchsia-600 to-purple-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:opacity-90"
        >
          <PlusIcon className="size-4" />
          New job
        </button>
      </div>

      {/* Stats */}
      <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatCard label="Total" value={jobs.length} icon={InboxIcon} />
        <StatCard
          label="Open"
          value={statusCounts["open"] || 0}
          icon={BriefcaseIcon}
        />
        <StatCard
          label="Draft"
          value={statusCounts["draft"] || 0}
          icon={PencilIcon}
        />
        <StatCard
          label="Closed"
          value={statusCounts["closed"] || 0}
          icon={XIcon}
        />
      </div>

      {/* Filters */}
      <div className="mt-8 flex flex-wrap items-center gap-3">
        <div className="relative max-w-sm flex-1 min-w-55">
          <SearchIcon className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
          <input
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              resetToFirstPage();
            }}
            placeholder="Search title, department, or location"
            className="w-full rounded-xl border border-transparent bg-fuchsia-50/60 py-2.5 pl-10 pr-3.5 text-sm text-slate-900 outline-none placeholder:text-slate-400 focus:border-fuchsia-300 focus:bg-white"
          />
        </div>

        <select
          value={restaurantFilter}
          onChange={(e) => {
            setRestaurantFilter(e.target.value);
            resetToFirstPage();
          }}
          className="rounded-xl border border-fuchsia-100 bg-white/70 px-3 py-2.5 text-sm text-slate-700 outline-none focus:border-fuchsia-300"
        >
          <option value="all">All restaurants</option>
          {restaurants.map(([id, name]) => (
            <option key={id} value={id}>
              {name}
            </option>
          ))}
        </select>

        <select
          value={statusFilter}
          onChange={(e) => {
            setStatusFilter(e.target.value as JobStatus | "all");
            resetToFirstPage();
          }}
          className="rounded-xl border border-fuchsia-100 bg-white/70 px-3 py-2.5 text-sm text-slate-700 outline-none focus:border-fuchsia-300"
        >
          <option value="all">All statuses</option>
          {STATUSES.map((s) => (
            <option key={s} value={s}>
              {statusLabel(s)}
            </option>
          ))}
        </select>
      </div>

      {loading ? (
        <div className="mt-16 flex items-center justify-center gap-2 text-slate-400">
          <Loader2Icon className="size-4 animate-spin" />
          <span className="text-sm">Loading jobs…</span>
        </div>
      ) : isError ? (
        <p className="mt-16 text-center text-sm text-red-600">
          {(error as any)?.data?.message || "Something went wrong"}
        </p>
      ) : filtered.length === 0 ? (
        <div className="mt-10 rounded-2xl border border-dashed border-fuchsia-200 bg-white/50 px-6 py-10 text-center text-sm text-slate-500">
          No jobs match these filters.
        </div>
      ) : (
        <>
          <div className="mt-6 overflow-hidden rounded-2xl border border-fuchsia-100 bg-white/70 shadow-sm backdrop-blur-xl">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-fuchsia-100 text-xs uppercase tracking-wide text-slate-400">
                  <th className="px-4 py-3 font-medium">Role</th>
                  <th className="px-4 py-3 font-medium">Location</th>
                  <th className="px-4 py-3 font-medium">Type</th>
               
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="px-4 py-3 font-medium">Posted</th>
                  <th className="px-4 py-3 font-medium">Closes</th>
                  <th className="px-4 py-3 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {pageItems.map((j) => (
                  <JobRow
                    key={j.id}
                    job={j}
                    onEdit={() => setEditingJob(j)}
                    onDelete={() => setDeleteTarget(j)}
                  />
                ))}
              </tbody>
            </table>
          </div>

          {totalPages > 1 && (
            <div className="mt-4 flex items-center justify-between gap-4 rounded-xl border border-fuchsia-100 bg-white/70 px-4 py-2.5 text-xs text-slate-500">
              <span className="font-['IBM_Plex_Mono']">
                Showing {(safePage - 1) * PAGE_SIZE + 1}–
                {Math.min(safePage * PAGE_SIZE, filtered.length)} of{" "}
                {filtered.length}
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={safePage === 1}
                  className="flex size-7 items-center justify-center rounded-full border border-fuchsia-200 text-fuchsia-600 transition hover:bg-fuchsia-50 disabled:cursor-not-allowed disabled:opacity-40"
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
                  className="flex size-7 items-center justify-center rounded-full border border-fuchsia-200 text-fuchsia-600 transition hover:bg-fuchsia-50 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <ChevronRightIcon className="size-3.5" />
                </button>
              </div>
            </div>
          )}
        </>
      )}

      <AnimatePresence>
        {(creatingOpen || editingJob) && (
          <JobFormDrawer
            job={editingJob}
            onClose={() => {
              setCreatingOpen(false);
              setEditingJob(null);
            }}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {deleteTarget && (
          <DeleteConfirmModal
            job={deleteTarget}
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
}: {
  label: string;
  value: number;
  icon: any;
}) {
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-fuchsia-100 bg-white/70 p-4 shadow-sm backdrop-blur-xl">
      <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-linear-to-br from-pink-500 via-fuchsia-600 to-purple-600">
        <Icon className="size-5 text-white" />
      </div>
      <div>
        <p className="font-['Fraunces'] text-xl italic text-slate-900">
          {value}
        </p>
        <p className="text-xs text-slate-500">{label}</p>
      </div>
    </div>
  );
}

function JobRow({
  job,
  onEdit,
  onDelete,
}: {
  job: any;
  onEdit: () => void;
  onDelete: () => void;
}) {
  return (
    <tr className="border-b border-fuchsia-50 last:border-0 hover:bg-fuchsia-50/40">
      <td className="px-4 py-3">
        <button
          type="button"
          onClick={onEdit}
          className="text-left font-['Fraunces'] italic text-slate-900 hover:text-fuchsia-600 hover:underline"
        >
          {job.title}
        </button>
        <div className="text-xs text-slate-400">
          {job.department || job.restaurant_name || "—"}
        </div>
      </td>
      <td className="px-4 py-3 text-slate-600">
        <div className="flex items-center gap-1.5">
          <MapPinIcon className="size-3.5 text-slate-400" />
          {job.location || "—"}
        </div>
      </td>
      <td className="px-4 py-3 text-slate-600">{job.employment_type || "—"}</td>
     
      <td className="px-4 py-3">
        <span
          className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${STATUS_COLOR[job.status] || "bg-slate-100 text-slate-700"}`}
        >
          {statusLabel(job.status)}
        </span>
      </td>
      <td className="px-4 py-3 font-['IBM_Plex_Mono'] text-slate-500">
        {job.createdAt ? new Date(job.createdAt).toLocaleDateString() : "—"}
      </td>
      <td className="px-4 py-3 font-['IBM_Plex_Mono'] text-slate-500">
        {job.closing_date
          ? new Date(job.closing_date).toLocaleDateString()
          : "—"}
      </td>
      <td className="px-4 py-3">
        <div className="flex items-center justify-end gap-2 text-slate-400">
          <button
            type="button"
            onClick={onEdit}
            className="rounded-lg p-1.5 hover:bg-fuchsia-50 hover:text-fuchsia-600"
          >
            <PencilIcon className="size-4" />
          </button>
          <button
            type="button"
            onClick={onDelete}
            className="rounded-lg p-1.5 hover:bg-red-50 hover:text-red-600"
          >
            <Trash2Icon className="size-4" />
          </button>
        </div>
      </td>
    </tr>
  );
}

const emptyForm = {
  title: "",
  position: "",
  department: "",

  restaurantId: "",
  location: "",
  employmentType: "Full-time" as EmploymentType,
  status: "draft" as JobStatus,
  
  description: "",
  requirements: "",
  responsibilities: "",
  contactEmail: "",
  contactPhone: "",
  closingDate: "",
};

// Converts an ISO date string to yyyy-MM-dd for an <input type="date">
function toDateInputValue(d?: string) {
  if (!d) return "";
  const date = new Date(d);
  if (Number.isNaN(date.getTime())) return "";
  return date.toISOString().slice(0, 10);
}

function JobFormDrawer({
  job,
  onClose,
}: {
  job: Job | null;
  onClose: () => void;
}) {
  const isEdit = !!job;
  const [form, setForm] = useState(emptyForm);
  const [formError, setFormError] = useState<string | null>(null);

  const [createJob, { isLoading: isCreating }] = useCreateJobMutation();
  const [updateJob, { isLoading: isUpdating }] = useUpdateJobMutation();
  const { data: restaurantsData, isLoading: isLoadingRestaurants } =
    useGetAllRestaurantsQuery();
  const restaurantOptions = restaurantsData?.data ?? [];
  const isSaving = isCreating || isUpdating;

  useEffect(() => {
    if (job) {
      const j = job as any;
      setForm({
        title: j.title || "",
        position: j.position || "",
        department: j.department || "",
        restaurantId: j.restaurant_id || "",
        location: j.location || "",
        employmentType: j.employment_type || "Full-time",
        status: j.status || "draft",
      
        description: j.description || "",
        requirements: Array.isArray(j.requirements)
          ? j.requirements.join("\n")
          : "",
        responsibilities: Array.isArray(j.responsibilities)
          ? j.responsibilities.join("\n")
          : "",
        contactEmail: j.contact_email || "",
        contactPhone: j.contact_phone || "",
        closingDate: toDateInputValue(j.closing_date),
      });
    } else {
      setForm(emptyForm);
    }
    setFormError(null);
  }, [job]);

  const set = (key: keyof typeof form) => (e: any) =>
    setForm((f) => ({ ...f, [key]: e.target.value }));

  const handleSave = async () => {
    if (!form.title.trim()) {
      setFormError("Title is required");
      return;
    }
    if (!form.position.trim()) {
      setFormError("Position is required");
      return;
    }
    if (!form.restaurantId.trim()) {
      setFormError("Restaurant is required");
      return;
    }
    if (!form.description.trim()) {
      setFormError("Description is required");
      return;
    }
    if (!form.contactEmail.trim()) {
      setFormError("Contact email is required");
      return;
    }
    if (!form.contactPhone.trim()) {
      setFormError("Contact phone is required");
      return;
    }
    setFormError(null);

    const payload = {
      restaurant_id: form.restaurantId.trim(),
      position: form.position.trim(),
      title: form.title.trim(),
      department: form.department.trim() || undefined,
      location: form.location.trim() || undefined,
      employment_type: form.employmentType,
      status: form.status, // already lowercase, matches backend enum
      description: form.description.trim(),
      requirements: form.requirements
        .split("\n")
        .map((r) => r.trim())
        .filter(Boolean),
      responsibilities: form.responsibilities
        .split("\n")
        .map((r) => r.trim())
        .filter(Boolean),
      contact_email: form.contactEmail.trim(),
      contact_phone: form.contactPhone.trim(),
     
      closing_date: form.closingDate
        ? new Date(form.closingDate).toISOString()
        : undefined,
    };

    try {
      if (isEdit) {
        await updateJob({ id: (job as any).id, ...payload }).unwrap();
      } else {
        await createJob(payload as any).unwrap();
      }
      onClose();
    } catch (err: any) {
      setFormError(err?.data?.message || "Failed to save job");
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
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        exit={{ x: "100%" }}
        transition={{ type: "spring", damping: 28, stiffness: 260 }}
        className="fixed right-0 top-0 z-50 h-full w-full max-w-md overflow-y-auto bg-white p-6 shadow-2xl font-['Inter']"
      >
        <div className="flex items-start justify-between">
          <div>
            <span className="font-['IBM_Plex_Mono'] text-xs font-semibold uppercase tracking-widest text-fuchsia-600">
              [ {isEdit ? "Edit" : "New"} ]
            </span>
            <h2 className="mt-1 font-['Fraunces'] text-lg italic text-slate-900">
              {isEdit ? (job as any).position : "New job"}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-1.5 text-slate-400 hover:bg-slate-100"
          >
            <XIcon className="size-4" />
          </button>
        </div>

        <div className="mt-6 space-y-4 text-sm">
          <Field label="Title">
            <input
              value={form.title}
              onChange={set("title")}
              placeholder="Line Cook"
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-fuchsia-300"
            />
          </Field>
          <Field label="Position">
            <input
              value={form.position}
              onChange={set("position")}
              placeholder="Kitchen Staff"
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-fuchsia-300"
            />
          </Field>

          <div className="grid grid-cols-2 gap-3">
            <Field label="Department">
              <input
                value={form.department}
                onChange={set("department")}
                placeholder="Kitchen"
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-fuchsia-300"
              />
            </Field>
            <Field label="Restaurant">
              <div className="relative">
                <BuildingIcon className="pointer-events-none absolute left-3 top-1/2 z-10 size-3.5 -translate-y-1/2 text-slate-400" />
                <select
                  value={form.restaurantId}
                  onChange={set("restaurantId")}
                  disabled={isLoadingRestaurants}
                  className="w-full appearance-none rounded-lg border border-slate-200 py-2 pl-8 pr-3 text-sm outline-none focus:border-fuchsia-300 disabled:opacity-60"
                >
                  <option value="">
                    {isLoadingRestaurants
                      ? "Loading restaurants…"
                      : "Select a restaurant"}
                  </option>
                  {restaurantOptions.map((r: any) => (
                    <option key={r.id || r._id} value={r.id || r._id}>
                      {r.x_name}
                    </option>
                  ))}
                </select>
              </div>
            </Field>
          </div>

          <Field label="Location">
            <div className="relative">
              <MapPinIcon className="pointer-events-none absolute left-3 top-1/2 size-3.5 -translate-y-1/2 text-slate-400" />
              <input
                value={form.location}
                onChange={set("location")}
                placeholder="St. John's, Antigua"
                className="w-full rounded-lg border border-slate-200 py-2 pl-8 pr-3 text-sm outline-none focus:border-fuchsia-300"
              />
            </div>
          </Field>

          <div className="grid grid-cols-2 gap-3">
            <Field label="Contact email">
              <input
                type="email"
                value={form.contactEmail}
                onChange={set("contactEmail")}
                placeholder="hr@bigbanana.com"
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-fuchsia-300"
              />
            </Field>
            <Field label="Contact phone">
              <input
                type="tel"
                value={form.contactPhone}
                onChange={set("contactPhone")}
                placeholder="+1 268 555 0100"
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-fuchsia-300"
              />
            </Field>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Field label="Employment type">
              <select
                value={form.employmentType}
                onChange={set("employmentType")}
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-fuchsia-300"
              >
                {EMPLOYMENT_TYPES.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Status">
              <select
                value={form.status}
                onChange={set("status")}
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-fuchsia-300"
              >
                {STATUSES.map((s) => (
                  <option key={s} value={s}>
                    {statusLabel(s)}
                  </option>
                ))}
              </select>
            </Field>
          </div>

         

          <Field label="Closing date (deadline to apply)">
            <div className="relative">
              <CalendarIcon className="pointer-events-none absolute left-3 top-1/2 size-3.5 -translate-y-1/2 text-slate-400" />
              <input
                type="date"
                value={form.closingDate}
                onChange={set("closingDate")}
                className="w-full rounded-lg border border-slate-200 py-2 pl-8 pr-3 text-sm outline-none focus:border-fuchsia-300"
              />
            </div>
            {isEdit && (job as any)?.createdAt && (
              <p className="mt-1 text-[11px] text-slate-400">
                Posted {new Date((job as any).createdAt).toLocaleDateString()}
              </p>
            )}
          </Field>

          <Field label="Description">
            <RichTextEditor
              value={form.description}
              onChange={(html) => setForm((f) => ({ ...f, description: html }))}
              placeholder="What the role involves…"
            />
          </Field>

          <Field label="Requirements">
            <RichTextEditor
              value={form.requirements}
              onChange={(html) =>
                setForm((f) => ({ ...f, requirements: html }))
              }
              placeholder="List the requirements…"
            />
          </Field>

          <Field label="Responsibilities">
            <RichTextEditor
              value={form.responsibilities}
              onChange={(html) =>
                setForm((f) => ({ ...f, responsibilities: html }))
              }
              placeholder="List the day-to-day responsibilities…"
            />
          </Field>

          {formError && (
            <div className="flex items-center gap-2 rounded-lg bg-red-50 px-3 py-2 text-xs text-red-600">
              <AlertTriangleIcon className="size-3.5 shrink-0" />
              {formError}
            </div>
          )}
        </div>

        <div className="mt-6 flex gap-2 border-t border-slate-100 pt-5">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={isSaving}
            className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-linear-to-br from-pink-500 via-fuchsia-600 to-purple-600 px-4 py-2.5 text-sm font-semibold text-white hover:opacity-90 disabled:opacity-60"
          >
            {isSaving && <Loader2Icon className="size-4 animate-spin" />}
            {isEdit ? "Save changes" : "Create job"}
          </button>
        </div>
      </motion.div>
    </>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
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
  job,
  onClose,
}: {
  job: any;
  onClose: () => void;
}) {
  const [deleteJob, { isLoading }] = useDeleteJobMutation();
  const [error, setError] = useState<string | null>(null);

  const handleDelete = async () => {
    try {
      await deleteJob(job.id).unwrap();
      onClose();
    } catch (err: any) {
      setError(err?.data?.message || "Failed to delete job");
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
          Delete this job?
        </h3>
        <p className="mt-1.5 text-sm text-slate-600">
          <span className="font-medium text-slate-900">{job.position}</span>{" "}
          will be removed permanently. This can&apos;t be undone.
        </p>

        {error && <p className="mt-3 text-xs text-red-600">{error}</p>}

        <div className="mt-6 flex gap-2">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50"
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
