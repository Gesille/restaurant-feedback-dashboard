/* eslint-disable @typescript-eslint/no-explicit-any */

"use client";
import { useMemo, useState } from "react";
import { motion } from "motion/react";
import {
    BriefcaseIcon,
    UserIcon,
    SearchIcon,
    DownloadIcon,
    MailIcon,
    PhoneIcon,
    Loader2Icon,
    InboxIcon,
} from "lucide-react";
import BackgroundBlobs from "@/components/BackgroundBlobs";
import { Applicant, useGetAllCVsQuery } from "@/redux/careers/careersApi";


const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "";

export default function AdminCvDashboard() {
    const [search, setSearch] = useState("");
    const { data, isLoading, isError, error } = useGetAllCVsQuery();

    const applicants = data?.data ?? [];

    const filtered = useMemo(() => {
        const q = search.trim().toLowerCase();
        if (!q) return applicants;
        return applicants.filter(
            (a:any) =>
                a.name?.toLowerCase().includes(q) ||
                a.email?.toLowerCase().includes(q) ||
                a.job?.toLowerCase().includes(q)
        );
    }, [applicants, search]);

    const careerApplicants = filtered.filter((a:any) => a.job);
    const generalApplicants = filtered.filter((a:any) => !a.job);

    return (
        <main className="relative min-h-screen bg-gradient-to-b from-fuchsia-50/40 via-white to-white px-4 pb-24 pt-28 sm:pt-32 md:px-10 lg:px-16">
            <BackgroundBlobs variant="muted" />

            <div className="mx-auto max-w-6xl">
                {/* Header */}
                <motion.div initial={{ y: 16, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.5 }}>
                    <span className="bg-gradient-to-r from-pink-600 via-fuchsia-600 to-purple-600 bg-clip-text font-mono text-xs font-semibold uppercase tracking-widest text-transparent">
                        [ Recruitment ]
                    </span>
                    <h1 className="mt-3 text-3xl font-semibold text-slate-900 sm:text-4xl">
                        Submissions
                    </h1>
                    <p className="mt-3 max-w-xl text-sm leading-relaxed text-slate-600 sm:text-base">
                        Every CV that&apos;s come in, split by whether it&apos;s tied to an open role
                        or sent in on its own.
                    </p>
                </motion.div>

                {/* Stats */}
                <div className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-3">
                    <StatCard label="Total submissions" value={applicants.length} icon={InboxIcon} />
                    <StatCard label="Career applications" value={applicants.filter((a:any) => a.job).length} icon={BriefcaseIcon} />
                    <StatCard label="General CVs" value={applicants.filter((a:any) => !a.job).length} icon={UserIcon} />
                </div>

                {/* Search */}
                <div className="relative mt-8 max-w-sm">
                    <SearchIcon className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
                    <input
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search name, email, or role"
                        className="w-full rounded-xl border border-transparent bg-fuchsia-50/60 py-2.5 pl-10 pr-3.5 text-sm text-slate-900 outline-none placeholder:text-slate-400 focus:border-fuchsia-300 focus:bg-white"
                    />
                </div>

                {isLoading ? (
                    <div className="mt-16 flex items-center justify-center gap-2 text-slate-400">
                        <Loader2Icon className="size-4 animate-spin" />
                        <span className="text-sm">Loading submissions…</span>
                    </div>
                ) : isError ? (
                    <p className="mt-16 text-center text-sm text-red-600">
                        {(error as any)?.data?.message || "Something went wrong"}
                    </p>
                ) : (
                    <>
                        <Section
                            title="Career applications"
                            eyebrow="01"
                            empty="No one has applied to a specific role yet."
                            items={careerApplicants}
                        />
                        <Section
                            title="General submissions"
                            eyebrow="02"
                            empty="No open CVs on file yet."
                            items={generalApplicants}
                        />
                    </>
                )}
            </div>
        </main>
    );
}

function StatCard({ label, value, icon: Icon }: { label: string; value: number; icon: any }) {
    return (
        <div className="flex items-center gap-3 rounded-2xl border border-fuchsia-100 bg-white/70 p-4 shadow-sm backdrop-blur-xl">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-pink-500 via-fuchsia-600 to-purple-600">
                <Icon className="size-5 text-white" />
            </div>
            <div>
                <p className="text-xl font-semibold text-slate-900">{value}</p>
                <p className="text-xs text-slate-500">{label}</p>
            </div>
        </div>
    );
}

function Section({
    title,
    eyebrow,
    empty,
    items,
}: {
    title: string;
    eyebrow: string;
    empty: string;
    items: Applicant[];
}) {
    return (
        <div className="mt-10">
            <div className="mb-4 flex items-baseline gap-3">
                <span className="rounded-full border border-fuchsia-200 px-2.5 py-0.5 font-mono text-[11px] text-fuchsia-600">
                    {eyebrow}
                </span>
                <h2 className="text-lg font-semibold text-slate-900">{title}</h2>
                <span className="text-xs text-slate-400">({items.length})</span>
            </div>

            {items.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-fuchsia-200 bg-white/50 px-6 py-10 text-center text-sm text-slate-500">
                    {empty}
                </div>
            ) : (
                <div className="flex flex-col gap-3">
                    {items.map((a) => (
                        <ApplicantCard key={a.id} applicant={a} />
                    ))}
                </div>
            )}
        </div>
    );
}

function ApplicantCard({ applicant }: { applicant: Applicant }) {
    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col gap-3 rounded-2xl border border-fuchsia-100 bg-white/70 p-5 shadow-sm backdrop-blur-xl sm:flex-row sm:items-center sm:justify-between"
        >
            <div className="flex-1">
                <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-sm font-semibold text-slate-900">{applicant.name}</h3>
                    {applicant.job && (
                        <span className="rounded-full bg-gradient-to-r from-pink-500 via-fuchsia-600 to-purple-600 px-2.5 py-0.5 text-[11px] font-semibold text-white">
                            {applicant.job}
                        </span>
                    )}
                    {applicant.stage && (
                        <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-[11px] font-medium text-slate-600">
                            {applicant.stage}
                        </span>
                    )}
                </div>

                <div className="mt-1.5 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500">
                    <span className="flex items-center gap-1">
                        <MailIcon className="size-3.5" /> {applicant.email}
                    </span>
                    {applicant.phone && (
                        <span className="flex items-center gap-1">
                            <PhoneIcon className="size-3.5" /> {applicant.phone}
                        </span>
                    )}
                    <span>{new Date(applicant.submittedAt).toLocaleDateString()}</span>
                </div>

                {applicant.message && (
                    <p className="mt-2 line-clamp-2 text-xs text-slate-500">{applicant.message}</p>
                )}
            </div>

            <div className="flex gap-2 sm:flex-col sm:items-end">
                {applicant.cvFiles.map((f:any) => (
                    <a
                        key={f.id}
                        href={`${API_BASE}/api/v1/cv/download/${f.id}`}
                        className="flex items-center gap-1.5 whitespace-nowrap rounded-full bg-fuchsia-50 px-3.5 py-1.5 text-xs font-semibold text-fuchsia-700 transition hover:bg-fuchsia-100"
                    >
                        <DownloadIcon className="size-3.5" />
                        {f.name}
                    </a>
                ))}
            </div>
        </motion.div>
    );
}