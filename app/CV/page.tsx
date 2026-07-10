/* eslint-disable @typescript-eslint/no-explicit-any */

"use client";
import { useMemo, useState } from "react";
import {
    BriefcaseIcon,
    UserIcon,
    SearchIcon,
    DownloadIcon,
    MailIcon,
    PhoneIcon,
    Loader2Icon,
    InboxIcon,
    CalendarIcon,
} from "lucide-react";
import {
    Applicant,
    CvFile,
    useGetAllCVsQuery,
    useLazyDownloadCVQuery,
} from "@/redux/careers/careersApi";

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
        <main className="min-h-screen bg-slate-50 px-4 pb-24 pt-16 sm:px-8 lg:px-12">
            <div className="mx-auto max-w-6xl">
                {/* Header */}
                <div className="flex flex-col gap-1 border-b border-slate-200 pb-8">
                    <span className="text-xs font-semibold uppercase tracking-widest text-indigo-600">
                        Recruitment
                    </span>
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
                        Submissions
                    </h1>
                    <p className="mt-1 max-w-xl text-sm leading-relaxed text-slate-500">
                        Every CV that&apos;s come in, split by whether it&apos;s tied to an
                        open role or sent in on its own.
                    </p>
                </div>

                {/* Stats */}
                <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
                    <StatCard
                        label="Total submissions"
                        value={applicants.length}
                        icon={InboxIcon}
                        accent="bg-indigo-600"
                    />
                    <StatCard
                        label="Career applications"
                        value={applicants.filter((a: any) => a.job).length}
                        icon={BriefcaseIcon}
                        accent="bg-teal-600"
                    />
                    <StatCard
                        label="General CVs"
                        value={applicants.filter((a: any) => !a.job).length}
                        icon={UserIcon}
                        accent="bg-amber-500"
                    />
                </div>

                {/* Search */}
                <div className="relative mt-8 max-w-sm">
                    <SearchIcon className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
                    <input
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search name, email, or role"
                        className="w-full rounded-lg border border-slate-200 bg-white py-2.5 pl-10 pr-3.5 text-sm text-slate-900 shadow-sm outline-none placeholder:text-slate-400 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
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

function StatCard({
    label,
    value,
    icon: Icon,
    accent,
}: {
    label: string;
    value: number;
    icon: any;
    accent: string;
}) {
    return (
        <div className="flex items-center gap-4 rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md">
            <div className={`flex size-11 shrink-0 items-center justify-center rounded-lg ${accent}`}>
                <Icon className="size-5 text-white" />
            </div>
            <div>
                <p className="text-2xl font-bold text-slate-900">{value}</p>
                <p className="text-xs font-medium text-slate-500">{label}</p>
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
        <div className="mt-12">
            <div className="mb-4 flex items-baseline gap-3">
                <span className="rounded-full bg-indigo-50 px-2.5 py-0.5 font-mono text-[11px] font-semibold text-indigo-600">
                    {eyebrow}
                </span>
                <h2 className="text-lg font-semibold text-slate-900">{title}</h2>
                <span className="text-xs text-slate-400">({items.length})</span>
            </div>

            {items.length === 0 ? (
                <div className="rounded-xl border border-dashed border-slate-300 bg-white px-6 py-10 text-center text-sm text-slate-500">
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
        <div className="flex flex-col gap-4 rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-indigo-200 hover:shadow-md sm:flex-row sm:items-center sm:justify-between">
            <div className="flex-1">
                <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-sm font-semibold text-slate-900">{applicant.name}</h3>
                    {applicant.job && (
                        <span className="rounded-full bg-teal-50 px-2.5 py-0.5 text-[11px] font-semibold text-teal-700">
                            {applicant.job}
                        </span>
                    )}
                    {applicant.stage && (
                        <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-[11px] font-medium text-slate-600">
                            {applicant.stage}
                        </span>
                    )}
                </div>

                <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500">
                    <span className="flex items-center gap-1">
                        <MailIcon className="size-3.5" /> {applicant.email}
                    </span>
                    {applicant.phone && (
                        <span className="flex items-center gap-1">
                            <PhoneIcon className="size-3.5" /> {applicant.phone}
                        </span>
                    )}
                    <span className="flex items-center gap-1">
                        <CalendarIcon className="size-3.5" />
                        {new Date(applicant.submittedAt).toLocaleDateString()}
                    </span>
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
        </div>
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
                className="flex items-center gap-1.5 whitespace-nowrap rounded-lg bg-indigo-600 px-3.5 py-1.5 text-xs font-semibold text-white shadow-sm transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
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