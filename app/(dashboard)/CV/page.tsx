/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @typescript-eslint/no-explicit-any */

"use client";
import { useEffect, useMemo, useState } from "react";
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
    ChevronLeftIcon,
    ChevronRightIcon,
} from "lucide-react";
import {
    Applicant,
    CvFile,
    useGetAllCVsQuery,
    useLazyDownloadCVQuery,
} from "@/redux/careers/careersApi";
import { FaLinkedin } from "react-icons/fa6";
import { Topbar } from "@/components/layout/Topbar";

const PAGE_SIZE = 10;

export default function AdminCvDashboard() {
    const [search, setSearch] = useState("");
    const { data, isLoading, isError, error } = useGetAllCVsQuery();

    const applicants = data?.data ?? [];

    const filtered = useMemo(() => {
        const q = search.trim().toLowerCase();
        if (!q) return applicants;
        return applicants.filter(
            (a: any) =>
                a.name?.toLowerCase().includes(q) ||
                a.email?.toLowerCase().includes(q) ||
                a.job?.toLowerCase().includes(q)
        );
    }, [applicants, search]);

    const careerApplicants = filtered.filter((a: any) => a.job);
    const generalApplicants = filtered.filter((a: any) => !a.job);

    return (
        <main className="min-h-screen bg-white px-4 pb-24 pt-8 sm:pt-10 md:px-10 lg:px-16">
            <Topbar title="CV Submissions" subtitle="Every CV that comes in, split by whether it's tied to an open role or sent in on its own." />
            <div className="mx-auto max-w-6xl">
                {/* Header */}
                <motion.div initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.4 }}>
                    <span className="text-xs font-semibold uppercase tracking-widest text-slate-400">
                        Recruitment
                    </span>
                    <h1 className="mt-1.5 text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">
                        Submissions
                    </h1>
                    <p className="mt-1.5 max-w-xl text-sm leading-relaxed text-slate-500">
                        Every CV that&apos;s come in, split by whether it&apos;s tied to an open role
                        or sent in on its own.
                    </p>
                </motion.div>

                {/* Stats */}
                <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-3">
                    <StatCard label="Total submissions" value={applicants.length} icon={InboxIcon} />
                    <StatCard label="Career applications" value={applicants.filter((a: any) => a.job).length} icon={BriefcaseIcon} />
                    <StatCard label="General CVs" value={applicants.filter((a: any) => !a.job).length} icon={UserIcon} />
                </div>

                {/* Search */}
                <div className="relative mt-6 max-w-sm">
                    <SearchIcon className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
                    <input
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search name, email, or role"
                        className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-3.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-300 focus:bg-white focus:ring-4 focus:ring-slate-100"
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
                            resetKey={search}
                        />
                        <Section
                            title="General submissions"
                            eyebrow="02"
                            empty="No open CVs on file yet."
                            items={generalApplicants}
                            resetKey={search}
                        />
                    </>
                )}
            </div>
        </main>
    );
}

function StatCard({ label, value, icon: Icon }: { label: string; value: number; icon: any }) {
    return (
        <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white p-4 transition hover:border-slate-300">
            <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-slate-900">
                <Icon className="size-4 text-white" />
            </div>
            <div>
                <p className="text-lg font-semibold leading-none text-slate-900">{value}</p>
                <p className="mt-1 text-xs text-slate-500">{label}</p>
            </div>
        </div>
    );
}

function Section({
    title,
    eyebrow,
    empty,
    items,
    resetKey,
}: {
    title: string;
    eyebrow: string;
    empty: string;
    items: Applicant[];
    resetKey: string;
}) {
    const [page, setPage] = useState(1);

    useEffect(() => {
        setPage(1);
    }, [resetKey]);

    const totalPages = Math.max(1, Math.ceil(items.length / PAGE_SIZE));
    const safePage = Math.min(page, totalPages);
    const pageItems = items.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

    return (
        <div className="mt-10">
            <div className="mb-4 flex items-baseline gap-3">
                <span className="rounded-full border border-slate-200 px-2 py-0.5 font-mono text-[11px] text-slate-400">
                    {eyebrow}
                </span>
                <h2 className="text-base font-semibold text-slate-900">{title}</h2>
                <span className="text-xs text-slate-400">({items.length})</span>
            </div>

            {items.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-slate-200 px-6 py-10 text-center text-sm text-slate-400">
                    {empty}
                </div>
            ) : (
                <>
                    <div className="flex flex-col divide-y divide-slate-100 rounded-2xl border border-slate-200">
                        {pageItems.map((a) => (
                            <ApplicantCard key={a.id} applicant={a} />
                        ))}
                    </div>

                    {totalPages > 1 && (
                        <div className="mt-3 flex items-center justify-between gap-4 px-1 text-xs text-slate-500">
                            <span>
                                Showing {(safePage - 1) * PAGE_SIZE + 1}–
                                {Math.min(safePage * PAGE_SIZE, items.length)} of {items.length}
                            </span>
                            <div className="flex items-center gap-2">
                                <button
                                    type="button"
                                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                                    disabled={safePage === 1}
                                    className="flex size-7 items-center justify-center rounded-full border border-slate-200 text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
                                    aria-label="Previous page"
                                >
                                    <ChevronLeftIcon className="size-3.5" />
                                </button>
                                <span className="font-medium text-slate-700">
                                    {safePage} / {totalPages}
                                </span>
                                <button
                                    type="button"
                                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                                    disabled={safePage === totalPages}
                                    className="flex size-7 items-center justify-center rounded-full border border-slate-200 text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
                                    aria-label="Next page"
                                >
                                    <ChevronRightIcon className="size-3.5" />
                                </button>
                            </div>
                        </div>
                    )}
                </>
            )}
        </div>
    );
}

function ApplicantCard({ applicant }: { applicant: Applicant }) {
    return (
        <motion.div
            layout
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col gap-3 p-5 transition hover:bg-slate-50/60 sm:flex-row sm:items-center sm:justify-between"
        >
            <div className="flex-1">
                <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-sm font-semibold text-slate-900">{applicant.name}</h3>
                    {applicant.job && (
                        <span className="rounded-full bg-slate-900 px-2.5 py-0.5 text-[11px] font-semibold text-white">
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
                    <a
                        href={`mailto:${applicant.email}`}
                        className="flex items-center gap-1 hover:text-slate-900 hover:underline"
                    >
                        <MailIcon className="size-3.5" /> {applicant.email}
                    </a>
                    {applicant.phone && (
                        <a
                            href={`tel:${applicant.phone}`}
                            className="flex items-center gap-1 hover:text-slate-900 hover:underline"
                        >
                            <PhoneIcon className="size-3.5" /> {applicant.phone}
                        </a>
                    )}
                    {(applicant as any).linkedin && (
                        <a
                            href={(applicant as any).linkedin}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1 text-[#0A66C2] hover:underline"
                        >
                            <FaLinkedin className="size-3.5" /> LinkedIn
                        </a>
                    )}
                    <span>{new Date(applicant.submittedAt).toLocaleDateString()}</span>
                </div>

                {applicant.message && (
                    <p className="mt-2 line-clamp-2 text-xs text-slate-500">{applicant.message}</p>
                )}
            </div>

            <div className="flex gap-2 sm:flex-col sm:items-end">
                {applicant.cvFiles.map((f: CvFile) => (
                    <DownloadButton key={f.id} file={f} />
                ))}
            </div>
        </motion.div>
    );
}

function DownloadButton({ file }: { file: CvFile }) {
    const [triggerDownload] = useLazyDownloadCVQuery();
    const [isDownloading, setIsDownloading] = useState(false);
    const [downloadError, setDownloadError] = useState<string | null>(null);

    const handleDownload = async () => {
        setIsDownloading(true);
        setDownloadError(null);
        try {
            const result = await triggerDownload(file.id).unwrap();
            const url = window.URL.createObjectURL(result.blob);
            const link = document.createElement("a");
            link.href = url;
            link.download = result.filename || file.name;
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(url);
        } catch (err: any) {
            console.error("CV download failed:", err);
            setDownloadError(err?.message || "Download failed");
        } finally {
            setIsDownloading(false);
        }
    };

    return (
        <div className="flex flex-col items-end gap-1">
            <button
                type="button"
                onClick={handleDownload}
                disabled={isDownloading}
                className="flex items-center gap-1.5 whitespace-nowrap rounded-full border border-slate-200 bg-white px-3.5 py-1.5 text-xs font-semibold text-slate-700 transition hover:border-slate-900 hover:text-slate-900 disabled:cursor-not-allowed disabled:opacity-60"
            >
                {isDownloading ? (
                    <Loader2Icon className="size-3.5 animate-spin" />
                ) : (
                    <DownloadIcon className="size-3.5" />
                )}
                {file.name}
            </button>
            {downloadError && (
                <span className="text-[11px] text-red-600">{downloadError}</span>
            )}
        </div>
    );
}