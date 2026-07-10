/* eslint-disable @typescript-eslint/no-explicit-any */

"use client";
import { useMemo, useState } from "react";
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
        <main className="min-h-screen bg-gray-50 px-4 py-8 md:px-8">
            <div className="mx-auto max-w-5xl">
                {/* Header */}
                <div className="border-b border-gray-200 pb-4">
                    <h1 className="text-2xl font-semibold text-gray-900">
                        CV Submissions
                    </h1>
                    <p className="mt-1 text-sm text-gray-500">
                        All CVs received, split by whether they were submitted for a
                        specific role or sent in generally.
                    </p>
                </div>

                {/* Stats */}
                <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
                    <StatCard label="Total submissions" value={applicants.length} />
                    <StatCard
                        label="Career applications"
                        value={applicants.filter((a: any) => a.job).length}
                    />
                    <StatCard
                        label="General CVs"
                        value={applicants.filter((a: any) => !a.job).length}
                    />
                </div>

                {/* Search */}
                <div className="mt-6">
                    <label htmlFor="search" className="block text-sm font-medium text-gray-700">
                        Search
                    </label>
                    <input
                        id="search"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search by name, email, or role"
                        className="mt-1 w-full max-w-sm rounded border border-gray-300 px-3 py-2 text-sm text-gray-900 outline-none focus:border-gray-500"
                    />
                </div>

                {isLoading ? (
                    <p className="mt-10 text-center text-sm text-gray-500">
                        Loading submissions…
                    </p>
                ) : isError ? (
                    <p className="mt-10 text-center text-sm text-red-600">
                        {(error as any)?.data?.message || "Something went wrong"}
                    </p>
                ) : (
                    <>
                        <Section
                            title="Career applications"
                            empty="No one has applied to a specific role yet."
                            items={careerApplicants}
                        />
                        <Section
                            title="General submissions"
                            empty="No general CVs on file yet."
                            items={generalApplicants}
                        />
                    </>
                )}
            </div>
        </main>
    );
}

function StatCard({ label, value }: { label: string; value: number }) {
    return (
        <div className="rounded border border-gray-200 bg-white p-4">
            <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
                {label}
            </p>
            <p className="mt-1 text-2xl font-semibold text-gray-900">{value}</p>
        </div>
    );
}

function Section({
    title,
    empty,
    items,
}: {
    title: string;
    empty: string;
    items: Applicant[];
}) {
    return (
        <div className="mt-8">
            <h2 className="text-base font-semibold text-gray-900">
                {title} <span className="font-normal text-gray-400">({items.length})</span>
            </h2>

            {items.length === 0 ? (
                <div className="mt-3 rounded border border-dashed border-gray-300 bg-white px-4 py-8 text-center text-sm text-gray-500">
                    {empty}
                </div>
            ) : (
                <div className="mt-3 overflow-hidden rounded border border-gray-200 bg-white">
                    <table className="min-w-full divide-y divide-gray-200 text-sm">
                        <thead className="bg-gray-50">
                            <tr>
                                <Th>Name</Th>
                                <Th>Contact</Th>
                                <Th>Role</Th>
                                <Th>Stage</Th>
                                <Th>Submitted</Th>
                                <Th>CV</Th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {items.map((a) => (
                                <ApplicantRow key={a.id} applicant={a} />
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}

function Th({ children }: { children: React.ReactNode }) {
    return (
        <th className="px-4 py-2 text-left text-xs font-medium uppercase tracking-wide text-gray-500">
            {children}
        </th>
    );
}

function ApplicantRow({ applicant }: { applicant: Applicant }) {
    return (
        <tr>
            <td className="px-4 py-3 align-top">
                <div className="font-medium text-gray-900">{applicant.name}</div>
                {applicant.message && (
                    <div className="mt-1 line-clamp-2 max-w-xs text-xs text-gray-500">
                        {applicant.message}
                    </div>
                )}
            </td>
            <td className="px-4 py-3 align-top text-gray-600">
                <div>{applicant.email}</div>
                {applicant.phone && (
                    <div className="text-xs text-gray-500">{applicant.phone}</div>
                )}
            </td>
            <td className="px-4 py-3 align-top text-gray-600">
                {applicant.job || <span className="text-gray-400">—</span>}
            </td>
            <td className="px-4 py-3 align-top text-gray-600">
                {applicant.stage || <span className="text-gray-400">—</span>}
            </td>
            <td className="px-4 py-3 align-top text-gray-600">
                {new Date(applicant.submittedAt).toLocaleDateString()}
            </td>
            <td className="px-4 py-3 align-top">
                <div className="flex flex-col items-start gap-1">
                    {applicant.cvFiles.map((f: CvFile) => (
                        <DownloadButton key={f.id} file={f} />
                    ))}
                </div>
            </td>
        </tr>
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
        <div className="flex flex-col items-start gap-0.5">
            <button
                type="button"
                onClick={handleDownload}
                disabled={isDownloading}
                className="rounded border border-gray-300 bg-white px-2.5 py-1 text-xs font-medium text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60"
            >
                {isDownloading ? "Downloading…" : file.name}
            </button>
            {downloadError && (
                <span className="text-[11px] text-red-600">{downloadError}</span>
            )}
        </div>
    );
}