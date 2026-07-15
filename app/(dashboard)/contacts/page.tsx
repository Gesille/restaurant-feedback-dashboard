/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  MailIcon,
  UserIcon,
  Loader2Icon,
  ChevronLeftIcon,
  ChevronRightIcon,
  CircleIcon,
  CheckCircle2Icon,
  EyeIcon,
  ClockIcon,
} from "lucide-react";

import { Topbar } from "@/components/layout/Topbar";
import { ContactSubmission, useGetContactsQuery, useUpdateContactStatusMutation } from "@/redux/contacts/contactsApi";

type StatusFilter = "all" | "new" | "read" | "responded";

const STATUS_TABS: { key: StatusFilter; label: string }[] = [
  { key: "all", label: "All" },
  { key: "new", label: "New" },
  { key: "read", label: "Read" },
  { key: "responded", label: "Responded" },
];

const STATUS_STYLES: Record<
  ContactSubmission["status"],
  { label: string; icon: any; badge: string }
> = {
  new: { label: "New", icon: CircleIcon, badge: "bg-fuchsia-50 text-fuchsia-700 border-fuchsia-200" },
  read: { label: "Read", icon: EyeIcon, badge: "bg-slate-50 text-slate-600 border-slate-200" },
  responded: {
    label: "Responded",
    icon: CheckCircle2Icon,
    badge: "bg-emerald-50 text-emerald-700 border-emerald-200",
  },
};

function LedgerFonts() {
  return (
    <style jsx global>{`
      @import url("https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,400;0,9..144,500;1,9..144,400;1,9..144,500&family=Inter:wght@400;500;600&family=IBM+Plex+Mono:wght@400;500&display=swap");
    `}</style>
  );
}

export default function ContactSubmissionsPage() {
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [page, setPage] = useState(1);
  const limit = 10;

  const { data, isLoading, isFetching } = useGetContactsQuery({
    status: statusFilter === "all" ? undefined : statusFilter,
    page,
    limit,
  });

  const [updateStatus] = useUpdateContactStatusMutation();

  const submissions = data?.data ?? [];
  const pagination = data?.pagination;

  const counts = {
    total: pagination?.total ?? 0,
  };

  const goPrevPage = () => setPage((p) => Math.max(1, p - 1));
  const goNextPage = () => {
    if (pagination && page < pagination.totalPages) setPage((p) => p + 1);
  };

  const handleTabChange = (key: StatusFilter) => {
    setStatusFilter(key);
    setPage(1);
  };

  return (
    <div className="mx-auto max-w-6xl font-['Inter']">
      <LedgerFonts />
      <Topbar />
      <div className="px-6 py-9">
        <motion.div initial={{ y: 16, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.5 }}>
          <span className="font-['IBM_Plex_Mono'] text-xs font-semibold uppercase tracking-widest text-fuchsia-600">
            [ Inbox ]
          </span>
          <h1 className="mt-2 font-['Fraunces'] text-3xl italic text-slate-900 sm:text-4xl">
            Contact submissions
          </h1>
          <p className="mt-2 max-w-xl text-sm leading-relaxed text-slate-600 sm:text-base">
            Messages sent in through the website contact form.
          </p>
        </motion.div>
      </div>

      <div className="px-6 pb-10">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <StatCard label="Total messages" value={counts.total} icon={MailIcon} />
          <StatCard
            label="Showing"
            value={submissions.length}
            icon={UserIcon}
          />
          <StatCard label="Page" value={`${pagination?.page ?? 1} / ${pagination?.totalPages ?? 1}`} icon={ClockIcon} />
          <StatCard label="Filter" value={STATUS_TABS.find((t) => t.key === statusFilter)?.label ?? "All"} icon={CircleIcon} />
        </div>

        {/* Status tabs */}
        <div className="mt-6 flex flex-wrap items-center gap-2 rounded-2xl border border-fuchsia-100 bg-white/70 p-2 shadow-sm backdrop-blur-xl">
          {STATUS_TABS.map((tab) => {
            const isActive = statusFilter === tab.key;
            return (
              <button
                key={tab.key}
                type="button"
                onClick={() => handleTabChange(tab.key)}
                className={`rounded-full px-4 py-1.5 font-['IBM_Plex_Mono'] text-xs font-medium uppercase tracking-wide transition ${
                  isActive
                    ? "bg-linear-to-br from-pink-500 via-fuchsia-600 to-purple-600 text-white shadow-sm"
                    : "text-slate-500 hover:bg-fuchsia-50"
                }`}
              >
                {tab.label}
              </button>
            );
          })}

          {isFetching && (
            <span className="ml-auto flex items-center gap-1.5 pr-2 text-xs text-slate-400">
              <Loader2Icon className="size-3.5 animate-spin" />
              Updating…
            </span>
          )}
        </div>

        {/* List */}
        <div className="mt-6 overflow-hidden rounded-2xl border border-fuchsia-100 bg-white/70 shadow-sm backdrop-blur-xl">
          {isLoading ? (
            <div className="flex items-center justify-center gap-2 py-16 text-slate-400">
              <Loader2Icon className="size-4 animate-spin" />
              <span className="text-sm">Loading messages…</span>
            </div>
          ) : submissions.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-2 py-16 text-center">
              <MailIcon className="size-8 text-fuchsia-200" />
              <p className="font-['Fraunces'] text-lg italic text-slate-500">No messages here</p>
              <p className="text-sm text-slate-400">Nothing matches this filter yet.</p>
            </div>
          ) : (
            <div className="divide-y divide-fuchsia-50">
              <AnimatePresence initial={false}>
                {submissions.map((s:any) => (
                  <SubmissionRow
                    key={s._id}
                    submission={s}
                    onUpdateStatus={(status) => updateStatus({ id: s._id, status })}
                  />
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>

        {/* Pagination */}
        {pagination && pagination.totalPages > 1 && (
          <div className="mt-6 flex items-center justify-center gap-3">
            <button
              type="button"
              onClick={goPrevPage}
              disabled={page <= 1}
              className="flex size-8 items-center justify-center rounded-full border border-fuchsia-200 text-fuchsia-600 transition hover:bg-fuchsia-50 disabled:opacity-30"
            >
              <ChevronLeftIcon className="size-4" />
            </button>
            <span className="font-['IBM_Plex_Mono'] text-xs text-slate-500">
              Page {pagination.page} of {pagination.totalPages}
            </span>
            <button
              type="button"
              onClick={goNextPage}
              disabled={page >= pagination.totalPages}
              className="flex size-8 items-center justify-center rounded-full border border-fuchsia-200 text-fuchsia-600 transition hover:bg-fuchsia-50 disabled:opacity-30"
            >
              <ChevronRightIcon className="size-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function StatCard({ label, value, icon: Icon }: { label: string; value: number | string; icon: any }) {
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-fuchsia-100 bg-white/70 p-4 shadow-sm backdrop-blur-xl">
      <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-linear-to-br from-pink-500 via-fuchsia-600 to-purple-600">
        <Icon className="size-5 text-white" />
      </div>
      <div>
        <p className="font-['Fraunces'] text-xl italic text-slate-900">{value}</p>
        <p className="text-xs text-slate-500">{label}</p>
      </div>
    </div>
  );
}

function SubmissionRow({
  submission,
  onUpdateStatus,
}: {
  submission: ContactSubmission;
  onUpdateStatus: (status: ContactSubmission["status"]) => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const statusMeta = STATUS_STYLES[submission.status];
  const StatusIcon = statusMeta.icon;

  const formattedDate = new Date(submission.createdAt).toLocaleString("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  });

  return (
    <motion.div
      layout
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="px-5 py-4"
    >
      <div
        className="flex cursor-pointer flex-col gap-2 sm:flex-row sm:items-center sm:justify-between"
        onClick={() => {
          setExpanded((v) => !v);
          if (submission.status === "new") onUpdateStatus("read");
        }}
      >
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <p className="truncate font-['Fraunces'] text-base italic text-slate-900">{submission.name}</p>
            <span
              className={`flex shrink-0 items-center gap-1 rounded-full border px-2 py-0.5 font-['IBM_Plex_Mono'] text-[10px] font-medium uppercase tracking-wide ${statusMeta.badge}`}
            >
              <StatusIcon className="size-3" />
              {statusMeta.label}
            </span>
          </div>
          <p className="truncate text-xs text-slate-500">{submission.email}</p>
          {!expanded && (
            <p className="mt-1 truncate text-sm text-slate-600">{submission.message}</p>
          )}
        </div>
        <span className="shrink-0 font-['IBM_Plex_Mono'] text-[11px] text-slate-400">
          {formattedDate}
        </span>
      </div>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="mt-3 rounded-xl border border-fuchsia-100 bg-fuchsia-50/40 p-4">
              <p className="whitespace-pre-wrap text-sm leading-relaxed text-slate-700">
                {submission.message}
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                <a
                  href={`mailto:${submission.email}`}
                  className="rounded-full bg-linear-to-br from-pink-500 via-fuchsia-600 to-purple-600 px-3 py-1.5 font-['IBM_Plex_Mono'] text-[11px] font-medium text-white shadow-sm transition hover:opacity-90"
                  onClick={(e) => e.stopPropagation()}
                >
                  Reply by email
                </a>
                {submission.status !== "responded" && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onUpdateStatus("responded");
                    }}
                    className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5 font-['IBM_Plex_Mono'] text-[11px] font-medium text-emerald-700 transition hover:bg-emerald-100"
                  >
                    Mark responded
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}