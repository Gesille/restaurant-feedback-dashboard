/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
    BriefcaseIcon, UserIcon, SearchIcon, DownloadIcon, MailIcon, PhoneIcon,
    Loader2Icon, InboxIcon, ChevronLeftIcon, ChevronRightIcon, XIcon, SendIcon,
} from "lucide-react";
import { FaLinkedin } from "react-icons/fa6";
import {
    Applicant, CvFile,
    useGetAllCVsQuery, useLazyDownloadCVQuery,
    useUpdateApplicantStageMutation, useAssignApplicantMutation, useAddApplicantNoteMutation,
} from "@/redux/careers/careersApi";

const PAGE_SIZE = 25;

const STAGES = [
    "New", "Reviewing", "Interview Scheduled", "Second Interview", "Offered", "Rejected", "Hired",
] as const;

const STAGE_COLOR: Record<string, string> = {
    "New": "bg-slate-100 text-slate-700",
    "Reviewing": "bg-sky-100 text-sky-700",
    "Interview Scheduled": "bg-amber-100 text-amber-700",
    "Second Interview": "bg-orange-100 text-orange-700",
    "Offered": "bg-purple-100 text-purple-700",
    "Rejected": "bg-red-100 text-red-700",
    "Hired": "bg-emerald-100 text-emerald-700",
};

export default function AdminCvDashboard() {
    const [search, setSearch] = useState("");
    const [positionFilter, setPositionFilter] = useState("all");
    const [stageFilter, setStageFilter] = useState("all");
    const [page, setPage] = useState(1);
    const [selected, setSelected] = useState<Applicant | null>(null);

    const { data, isLoading, isError, error } = useGetAllCVsQuery();
    const applicants = data?.data ?? [];

    const positions = useMemo(() => {
        const set = new Set(applicants.filter((a) => a.job).map((a) => a.job as string));
        return Array.from(set);
    }, [applicants]);

    const filtered = useMemo(() => {
        const q = search.trim().toLowerCase();
        return applicants.filter((a) => {
            if (q && !(a.name?.toLowerCase().includes(q) || a.email?.toLowerCase().includes(q) || a.job?.toLowerCase().includes(q))) return false;
            if (positionFilter !== "all") {
                if (positionFilter === "general" && a.job) return false;
                if (positionFilter !== "general" && a.job !== positionFilter) return false;
            }
            if (stageFilter !== "all" && a.stage !== stageFilter) return false;
            return true;
        });
    }, [applicants, search, positionFilter, stageFilter]);

    const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
    const safePage = Math.min(page, totalPages);
    const pageItems = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

    const resetToFirstPage = () => setPage(1);

    const stageCounts = useMemo(() => {
        const counts: Record<string, number> = {};
        applicants.forEach((a) => { counts[a.stage || "New"] = (counts[a.stage || "New"] || 0) + 1; });
        return counts;
    }, [applicants]);

    return (
        <div className="mx-auto max-w-6xl">
            <motion.div initial={{ y: 16, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.5 }}>
                <span className="bg-gradient-to-r from-pink-600 via-fuchsia-600 to-purple-600 bg-clip-text font-mono text-xs font-semibold uppercase tracking-widest text-transparent">
                    [ Recruitment ]
                </span>
                <h1 className="mt-2 text-3xl font-semibold text-slate-900 sm:text-4xl">Submissions</h1>
                <p className="mt-2 max-w-xl text-sm leading-relaxed text-slate-600 sm:text-base">
                    Every CV that&apos;s come in, filterable by role, stage, and search.
                </p>
            </motion.div>

            {/* Stats */}
            <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
                <StatCard label="Total" value={applicants.length} icon={InboxIcon} />
                <StatCard label="New" value={stageCounts["New"] || 0} icon={UserIcon} />
                <StatCard label="Interviewing" value={(stageCounts["Interview Scheduled"] || 0) + (stageCounts["Second Interview"] || 0)} icon={BriefcaseIcon} />
                <StatCard label="Hired" value={stageCounts["Hired"] || 0} icon={UserIcon} />
            </div>

            {/* Filters */}
            <div className="mt-8 flex flex-wrap items-center gap-3">
                <div className="relative max-w-sm flex-1 min-w-[220px]">
                    <SearchIcon className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
                    <input
                        value={search}
                        onChange={(e) => { setSearch(e.target.value); resetToFirstPage(); }}
                        placeholder="Search name, email, or role"
                        className="w-full rounded-xl border border-transparent bg-fuchsia-50/60 py-2.5 pl-10 pr-3.5 text-sm text-slate-900 outline-none placeholder:text-slate-400 focus:border-fuchsia-300 focus:bg-white"
                    />
                </div>

                <select
                    value={positionFilter}
                    onChange={(e) => { setPositionFilter(e.target.value); resetToFirstPage(); }}
                    className="rounded-xl border border-fuchsia-100 bg-white/70 px-3 py-2.5 text-sm text-slate-700 outline-none focus:border-fuchsia-300"
                >
                    <option value="all">All positions</option>
                    <option value="general">General submissions</option>
                    {positions.map((p) => <option key={p} value={p}>{p}</option>)}
                </select>

                <select
                    value={stageFilter}
                    onChange={(e) => { setStageFilter(e.target.value); resetToFirstPage(); }}
                    className="rounded-xl border border-fuchsia-100 bg-white/70 px-3 py-2.5 text-sm text-slate-700 outline-none focus:border-fuchsia-300"
                >
                    <option value="all">All stages</option>
                    {STAGES.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
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
            ) : filtered.length === 0 ? (
                <div className="mt-10 rounded-2xl border border-dashed border-fuchsia-200 bg-white/50 px-6 py-10 text-center text-sm text-slate-500">
                    No applicants match these filters.
                </div>
            ) : (
                <>
                    <div className="mt-6 overflow-hidden rounded-2xl border border-fuchsia-100 bg-white/70 shadow-sm backdrop-blur-xl">
                        <table className="w-full text-left text-sm">
                            <thead>
                                <tr className="border-b border-fuchsia-100 text-xs uppercase tracking-wide text-slate-400">
                                    <th className="px-4 py-3 font-medium">Candidate</th>
                                    <th className="px-4 py-3 font-medium">Position</th>
                                    <th className="px-4 py-3 font-medium">Stage</th>
                                    <th className="px-4 py-3 font-medium">Applied</th>
                                    <th className="px-4 py-3 font-medium">Contact</th>
                                    <th className="px-4 py-3 font-medium">CV</th>
                                </tr>
                            </thead>
                            <tbody>
                                {pageItems.map((a) => (
                                    <ApplicantRow key={a.id} applicant={a} onOpen={() => setSelected(a)} />
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {totalPages > 1 && (
                        <div className="mt-4 flex items-center justify-between gap-4 rounded-xl border border-fuchsia-100 bg-white/70 px-4 py-2.5 text-xs text-slate-500">
                            <span>
                                Showing {(safePage - 1) * PAGE_SIZE + 1}–{Math.min(safePage * PAGE_SIZE, filtered.length)} of {filtered.length}
                            </span>
                            <div className="flex items-center gap-2">
                                <button type="button" onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={safePage === 1}
                                    className="flex size-7 items-center justify-center rounded-full border border-fuchsia-200 text-fuchsia-600 transition hover:bg-fuchsia-50 disabled:cursor-not-allowed disabled:opacity-40">
                                    <ChevronLeftIcon className="size-3.5" />
                                </button>
                                <span className="font-medium text-slate-700">{safePage} / {totalPages}</span>
                                <button type="button" onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={safePage === totalPages}
                                    className="flex size-7 items-center justify-center rounded-full border border-fuchsia-200 text-fuchsia-600 transition hover:bg-fuchsia-50 disabled:cursor-not-allowed disabled:opacity-40">
                                    <ChevronRightIcon className="size-3.5" />
                                </button>
                            </div>
                        </div>
                    )}
                </>
            )}

            <AnimatePresence>
                {selected && <ApplicantDrawer applicant={selected} onClose={() => setSelected(null)} />}
            </AnimatePresence>
        </div>
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

function ApplicantRow({ applicant, onOpen }: { applicant: Applicant; onOpen: () => void }) {
    const [updateStage, { isLoading: isUpdating }] = useUpdateApplicantStageMutation();

    return (
        <tr className="border-b border-fuchsia-50 last:border-0 hover:bg-fuchsia-50/40">
            <td className="px-4 py-3">
                <button type="button" onClick={onOpen} className="text-left font-medium text-slate-900 hover:text-fuchsia-600 hover:underline">
                    {applicant.name}
                </button>
                <div className="text-xs text-slate-400">{applicant.email}</div>
            </td>
            <td className="px-4 py-3 text-slate-600">{applicant.job || "General"}</td>
            <td className="px-4 py-3">
                <select
                    value={applicant.stage}
                    disabled={isUpdating}
                    onChange={(e) => updateStage({ id: applicant.id, stage: e.target.value })}
                    className={`rounded-full border-0 px-2.5 py-1 text-[11px] font-semibold outline-none ${STAGE_COLOR[applicant.stage] || "bg-slate-100 text-slate-700"}`}
                >
                    {STAGES.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
            </td>
            <td className="px-4 py-3 text-slate-500">{new Date(applicant.submittedAt).toLocaleDateString()}</td>
            <td className="px-4 py-3">
                <div className="flex items-center gap-2 text-slate-400">
                    <a href={`mailto:${applicant.email}`} className="hover:text-fuchsia-600"><MailIcon className="size-4" /></a>
                    {applicant.phone && <a href={`tel:${applicant.phone}`} className="hover:text-fuchsia-600"><PhoneIcon className="size-4" /></a>}
                    {applicant.linkedin && <a href={applicant.linkedin} target="_blank" rel="noopener noreferrer" className="hover:text-fuchsia-600"><FaLinkedin className="size-4" /></a>}
                </div>
            </td>
            <td className="px-4 py-3">
                <div className="flex flex-col gap-1">
                    {applicant.cvFiles.map((f) => <DownloadButton key={f.id} file={f} />)}
                </div>
            </td>
        </tr>
    );
}

function DownloadButton({ file }: { file: CvFile }) {
    const [triggerDownload] = useLazyDownloadCVQuery();
    const [isDownloading, setIsDownloading] = useState(false);

    const handleDownload = async () => {
        setIsDownloading(true);
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
        } catch (err) {
            console.error("CV download failed:", err);
        } finally {
            setIsDownloading(false);
        }
    };

    return (
        <button type="button" onClick={handleDownload} disabled={isDownloading}
            className="flex items-center gap-1 whitespace-nowrap rounded-full bg-fuchsia-50 px-2.5 py-1 text-[11px] font-semibold text-fuchsia-700 transition hover:bg-fuchsia-100 disabled:opacity-60">
            {isDownloading ? <Loader2Icon className="size-3 animate-spin" /> : <DownloadIcon className="size-3" />}
            {file.name}
        </button>
    );
}

function ApplicantDrawer({ applicant, onClose }: { applicant: Applicant; onClose: () => void }) {
    const [assignedTo, setAssignedTo] = useState(applicant.assignedTo || "");
    const [assignError, setAssignError] = useState<string | null>(null);
    const [noteText, setNoteText] = useState("");
    const [assign, { isLoading: isAssigning }] = useAssignApplicantMutation();
    const [addNote, { isLoading: isAddingNote }] = useAddApplicantNoteMutation();

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    const handleAssignBlur = async () => {
        const trimmed = assignedTo.trim();
        if (trimmed && !emailRegex.test(trimmed)) {
            setAssignError("Enter a valid email address");
            return;
        }
        setAssignError(null);
        try {
            await assign({ id: applicant.id, assignedTo: trimmed }).unwrap();
        } catch (err: any) {
            setAssignError(err?.data?.message || "Failed to assign");
        }
    };

    const handleAddNote = async () => {
        if (!noteText.trim()) return;
        await addNote({ id: applicant.id, text: noteText.trim(), author: "HR" })
            .unwrap()
            .catch((err) => console.error("Add note failed:", err));
        setNoteText("");
    };

    // ...rest unchanged until the "Assigned to" block

    return (
        <>
            <motion.div
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                onClick={onClose}
                className="fixed inset-0 z-40 bg-slate-900/30 backdrop-blur-sm"
            />
            <motion.div
                initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }}
                transition={{ type: "spring", damping: 28, stiffness: 260 }}
                className="fixed right-0 top-0 z-50 h-full w-full max-w-md overflow-y-auto bg-white p-6 shadow-2xl"
            >
                <div className="flex items-start justify-between">
                    <div>
                        <h2 className="text-lg font-semibold text-slate-900">{applicant.name}</h2>
                        <p className="text-sm text-slate-500">{applicant.job || "General submission"}</p>
                    </div>
                    <button type="button" onClick={onClose} className="rounded-full p-1.5 text-slate-400 hover:bg-slate-100">
                        <XIcon className="size-4" />
                    </button>
                </div>

                <div className="mt-6 space-y-4 text-sm">
                    <div className="flex items-center gap-2 text-slate-600">
                        <MailIcon className="size-4 text-slate-400" />
                        <a href={`mailto:${applicant.email}`} className="hover:text-fuchsia-600 hover:underline">{applicant.email}</a>
                    </div>
                    {applicant.phone && (
                        <div className="flex items-center gap-2 text-slate-600">
                            <PhoneIcon className="size-4 text-slate-400" />
                            <a href={`tel:${applicant.phone}`} className="hover:text-fuchsia-600 hover:underline">{applicant.phone}</a>
                        </div>
                    )}
                    {applicant.linkedin && (
                        <div className="flex items-center gap-2 text-slate-600">
                            <FaLinkedin className="size-4 text-slate-400" />
                            <a href={applicant.linkedin} target="_blank" rel="noopener noreferrer" className="hover:text-fuchsia-600 hover:underline">LinkedIn profile</a>
                        </div>
                    )}
                    {applicant.message && (
                        <div>
                            <p className="text-xs font-medium uppercase tracking-wide text-slate-400">Cover message</p>
                            <p className="mt-1 text-slate-700">{applicant.message}</p>
                        </div>
                    )}

                    <div className="flex flex-col gap-1.5">
                        {applicant.cvFiles.map((f) => <DownloadButton key={f.id} file={f} />)}
                    </div>
                </div>

               <div className="mt-6 border-t border-slate-100 pt-5">
                    <label className="text-xs font-medium uppercase tracking-wide text-slate-400">
                        Assign to (email)
                    </label>
                    <div className="mt-1.5 flex items-center gap-2">
                        <input
                            type="email"
                            value={assignedTo}
                            onChange={(e) => { setAssignedTo(e.target.value); setAssignError(null); }}
                            onBlur={handleAssignBlur}
                            placeholder="recruiter@company.com"
                            className={`flex-1 rounded-lg border px-3 py-2 text-sm outline-none ${
                                assignError ? "border-red-300 focus:border-red-400" : "border-slate-200 focus:border-fuchsia-300"
                            }`}
                        />
                        {isAssigning && <Loader2Icon className="size-4 shrink-0 animate-spin text-fuchsia-500" />}
                    </div>
                    {assignError ? (
                        <p className="mt-1 text-xs text-red-600">{assignError}</p>
                    ) : (
                        <p className="mt-1 text-xs text-slate-400">They&apos;ll get an email when you assign this candidate.</p>
                    )}
                </div>

                <div className="mt-6 border-t border-slate-100 pt-5">
                    <label className="text-xs font-medium uppercase tracking-wide text-slate-400">Notes</label>
                    <div className="mt-2 flex flex-col gap-2">
                      {(applicant.notes || []).map((n) => (
    <div key={n.id} className="rounded-lg bg-slate-50 p-2.5 text-xs">
        <p className="text-slate-700">{n.text}</p>
        <p className="mt-1 text-slate-400">{n.author} · {new Date(n.createdAt).toLocaleDateString()}</p>
    </div>
))}
                    </div>
                    <div className="mt-2 flex gap-2">
                        <input
                            value={noteText}
                            onChange={(e) => setNoteText(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && handleAddNote()}
                            placeholder="Add a note…"
                            className="flex-1 rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-fuchsia-300"
                        />
                        <button type="button" onClick={handleAddNote} disabled={isAddingNote}
                            className="flex size-9 items-center justify-center rounded-lg bg-fuchsia-600 text-white hover:bg-fuchsia-700 disabled:opacity-60">
                            {isAddingNote ? <Loader2Icon className="size-4 animate-spin" /> : <SendIcon className="size-4" />}
                        </button>
                    </div>
                </div>
            </motion.div>
        </>
    );
}