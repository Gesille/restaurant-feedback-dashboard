/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useState } from "react";
import { motion, useReducedMotion, AnimatePresence } from "motion/react";
import {
    SearchIcon, FileTextIcon, Loader2Icon, DownloadIcon, CheckIcon,
} from "lucide-react";
import BackgroundBlobs from "@/components/BackgroundBlobs";
import { useTrackApplicationMutation, TrackedApplication } from "@/redux/careers/careersApi";

const inputCls =
    "w-full bg-transparent border border-[#C9BFA8] rounded-lg px-4 py-3 text-sm outline-none transition placeholder:opacity-40 focus:border-[#1B1B18] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#B23A2E]";

const STEPS = [
    { label: "Enter your details", body: "The email and phone number you applied with." },
    { label: "We open the drawer", body: "We match it against every file on record." },
    { label: "See where it stands", body: "Current stage, and the full history behind it." },
];

export default function TrackApplicationSection() {
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [results, setResults] = useState<TrackedApplication[] | null>(null);
    const [notFound, setNotFound] = useState(false);
    const [searched, setSearched] = useState(false);
    const prefersReducedMotion = useReducedMotion();

    const [trackApplication, { isLoading }] = useTrackApplicationMutation();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setNotFound(false);
        setResults(null);
        setSearched(true);
        try {
            const res = await trackApplication({ email, phone }).unwrap();
            setResults(res.data);
        } catch {
            setNotFound(true);
        }
    };

    return (
        <section id="track-application" className="relative text-[#1B1B18] overflow-hidden">
            <BackgroundBlobs variant="warm" />

            {/* ── Hero: copy + form on the left, folder-stack signature on the right ── */}
            <div className="px-4 md:px-16 lg:px-24 xl:px-32 pt-20 md:pt-28 pb-16">
                <div className="grid lg:grid-cols-[1fr_360px] gap-12 lg:gap-16 items-start">
                    <div>
                        <div className="flex items-center gap-3 mb-5">
                            <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-[#A6822C] border border-[#A6822C]/40 rounded-full px-3 py-1">
                                Check status
                            </span>
                            <span className="h-px flex-1 bg-[#C9BFA8]" />
                        </div>
                        <h2 className="font-serif text-4xl sm:text-5xl leading-[1.05] max-w-lg">
                            Where&apos;s your file?
                        </h2>
                        <p className="mt-6 text-base sm:text-lg text-[#1B1B18]/70 max-w-md leading-relaxed">
                            Every application we receive gets its own file in the drawer.
                            Pull yours up to see exactly where it sits.
                        </p>

                        <div className="mt-10 flex flex-col gap-5 max-w-md">
                            {STEPS.map((step, i) => (
                                <div key={step.label} className="flex items-start gap-3">
                                    <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-[#1B1B18] font-mono text-[10px] text-[#F7F3E9]">
                                        {i + 1}
                                    </span>
                                    <p className="text-sm leading-relaxed">
                                        <span className="font-medium">{step.label}.</span>{" "}
                                        <span className="text-[#1B1B18]/60">{step.body}</span>
                                    </p>
                                </div>
                            ))}
                        </div>

                        {/* Lookup form */}
                        <motion.div
                            initial={prefersReducedMotion ? undefined : { y: 24, opacity: 0 }}
                            whileInView={prefersReducedMotion ? undefined : { y: 0, opacity: 1 }}
                            viewport={{ once: true }}
                            transition={{ type: "spring", stiffness: 220, damping: 28 }}
                            className="relative mt-10 max-w-lg"
                        >
                            <div className="relative z-10 ml-6 inline-flex items-center gap-2 bg-[#1B1B18] text-[#EDE6D6] rounded-t-lg px-4 py-2 -mb-px">
                                <SearchIcon size={14} />
                                <span className="font-mono text-[11px] uppercase tracking-widest">Lookup</span>
                            </div>

                            <div className="relative rounded-b-2xl rounded-tr-2xl border border-orange-200/50 bg-white/70 backdrop-blur-md shadow-[0_20px_60px_-12px_rgba(249,115,22,0.25),0_8px_24px_-8px_rgba(219,39,119,0.2)] p-6 sm:p-7">
                                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                                    <div className="grid sm:grid-cols-2 gap-4">
                                        <label className="flex flex-col gap-1.5">
                                            <span className="font-mono text-[10px] uppercase tracking-widest text-[#A6822C]">Email address</span>
                                            <input
                                                type="email"
                                                required
                                                placeholder="jordan@email.com"
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                                className={inputCls}
                                            />
                                        </label>
                                        <label className="flex flex-col gap-1.5">
                                            <span className="font-mono text-[10px] uppercase tracking-widest text-[#A6822C]">Phone number</span>
                                            <input
                                                type="tel"
                                                required
                                                placeholder="+1 555 123 4567"
                                                value={phone}
                                                onChange={(e) => setPhone(e.target.value)}
                                                className={inputCls}
                                            />
                                        </label>
                                    </div>
                                    <button
                                        type="submit"
                                        disabled={isLoading}
                                        className="flex items-center justify-center gap-2 py-3 px-6 text-[#F7F3E9] font-medium rounded-full bg-[#1B1B18] hover:bg-[#1B1B18]/90 active:scale-[0.98] transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                                    >
                                        {isLoading ? <Loader2Icon size={16} className="animate-spin" /> : "Find my file"}
                                    </button>
                                </form>

                                {notFound && (
                                    <p className="mt-4 text-sm text-[#B23A2E]">
                                        No application matches that email and phone. Double-check both and try again.
                                    </p>
                                )}
                            </div>
                        </motion.div>
                    </div>

                    {/* Signature illustration */}
                    <div className="hidden lg:block lg:sticky lg:top-24">
                        <FolderStack active={isLoading} />
                    </div>
                </div>
            </div>

            {/* ── Results ── */}
            <div className="px-4 md:px-16 lg:px-24 xl:px-32 pb-24">
                <AnimatePresence mode="wait">
                    {results && results.length > 0 ? (
                        <motion.div
                            key="results"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="flex flex-col gap-6 max-w-3xl"
                        >
                            {results.map((app, i) => (
                                <CaseCard key={app.id} app={app} index={i} />
                            ))}
                        </motion.div>
                    ) : searched && !isLoading && !notFound ? null : !searched ? (
                        <motion.div
                            key="empty"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="max-w-3xl border-t border-[#C9BFA8] pt-10 flex items-center gap-4 text-[#1B1B18]/40"
                        >
                            <span className="h-px flex-1 bg-[#C9BFA8]/60" />
                            <p className="font-mono text-[11px] uppercase tracking-widest">
                                No file pulled yet
                            </p>
                            <span className="h-px flex-1 bg-[#C9BFA8]/60" />
                        </motion.div>
                    ) : null}
                </AnimatePresence>
            </div>
        </section>
    );
}

/* Signature element: a slightly fanned stack of manila case folders,
   echoing the "Case file" tab/stamp motif used on the submission page.
   The top folder lifts and its tab glows while a lookup is in flight. */
function FolderStack({ active }: { active: boolean }) {
    const prefersReducedMotion = useReducedMotion();
    const folders = [
        { rotate: -6, y: 18, color: "#E4D9BE" },
        { rotate: 4, y: 9, color: "#EDE1C4" },
        { rotate: -2, y: 0, color: "#F4EAD3" },
    ];

    return (
        <div className="relative h-72 w-full flex items-center justify-center">
            {folders.map((f, i) => (
                <motion.div
                    key={i}
                    initial={{ rotate: f.rotate, y: f.y }}
                    animate={
                        prefersReducedMotion
                            ? { rotate: f.rotate, y: f.y }
                            : i === folders.length - 1 && active
                            ? { rotate: f.rotate - 3, y: f.y - 14 }
                            : { rotate: f.rotate, y: f.y }
                    }
                    transition={{ type: "spring", stiffness: 200, damping: 16 }}
                    className="absolute w-56 h-40 rounded-lg border border-[#C9BFA8] shadow-[0_12px_24px_-8px_rgba(27,27,24,0.18)]"
                    style={{ backgroundColor: f.color }}
                >
                    <div
                        className="absolute -top-3 left-6 h-4 w-20 rounded-t-md border border-b-0 border-[#C9BFA8] transition-colors"
                        style={{ backgroundColor: i === folders.length - 1 && active ? "#B23A2E" : f.color }}
                    />
                    {i === folders.length - 1 && (
                        <div className="flex h-full flex-col items-center justify-center gap-2 px-6 text-center">
                            <FileTextIcon size={20} className="text-[#B23A2E]" />
                            <span className="font-mono text-[9px] uppercase tracking-[0.15em] text-[#1B1B18]/50">
                                {active ? "Searching…" : "Your file, once found"}
                            </span>
                        </div>
                    )}
                </motion.div>
            ))}
        </div>
    );
}

function CaseCard({ app, index }: { app: TrackedApplication; index: number }) {
    const prefersReducedMotion = useReducedMotion();
    const isRejected = app.stage === "Rejected";
    const history = app.stageHistory && app.stageHistory.length > 0
        ? app.stageHistory
        : [{ stage: app.stage, changedAt: app.submittedAt }];

    return (
        <motion.div
            initial={prefersReducedMotion ? undefined : { y: 16, opacity: 0 }}
            animate={prefersReducedMotion ? undefined : { y: 0, opacity: 1 }}
            transition={{ delay: index * 0.08, type: "spring", stiffness: 220, damping: 28 }}
            className="rounded-2xl border border-orange-200/50 bg-white/70 backdrop-blur-md p-6 sm:p-8"
        >
            <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                    <p className="font-mono text-[10px] uppercase tracking-widest text-[#A6822C]">
                        {app.job || "General submission"}
                    </p>
                    <h3 className="font-serif text-2xl mt-1">
                        {isRejected ? "Not moving forward" : app.stage}
                    </h3>
                </div>
                <span className="font-mono text-[11px] text-[#1B1B18]/50 whitespace-nowrap">
                    Filed {new Date(app.submittedAt).toLocaleDateString()}
                </span>
            </div>

            {isRejected && (
                <p className="mt-4 text-sm text-[#1B1B18]/65 leading-relaxed max-w-lg">
                    This file has been closed. We appreciate you taking the time to apply, and
                    we&apos;ll keep it on hand for roles that open up down the line.
                </p>
            )}

            {/* Dated history — this is real sequence data, so an ordered
                trail earns its place here (unlike a generic 01/02/03 rail). */}
            <div className="mt-6 flex flex-col">
                {history.map((h, i) => {
                    const isLast = i === history.length - 1;
                    return (
                        <div key={i} className="relative pl-7 pb-6 last:pb-0">
                            {!isLast && (
                                <span className="absolute left-[9px] top-4 bottom-0 w-px bg-[#C9BFA8]" />
                            )}
                            <span
                                className={`absolute left-0 top-0.5 flex size-[18px] items-center justify-center rounded-full border ${
                                    isLast
                                        ? "bg-[#1B1B18] border-[#1B1B18] text-[#F7F3E9]"
                                        : "bg-white border-[#C9BFA8] text-[#C9BFA8]"
                                }`}
                            >
                                {isLast && <CheckIcon size={10} />}
                            </span>
                            <p className={`text-sm ${isLast ? "font-medium" : "text-[#1B1B18]/60"}`}>
                                {h.stage}
                            </p>
                            <p className="font-mono text-[10px] text-[#1B1B18]/40">
                                {new Date(h.changedAt).toLocaleDateString(undefined, {
                                    month: "short", day: "numeric", year: "numeric",
                                })}
                            </p>
                        </div>
                    );
                })}
            </div>

            {app.cvFiles.length > 0 && (
                <div className="mt-2 pt-5 border-t border-[#C9BFA8]/60 flex flex-wrap gap-2">
                    {app.cvFiles.map((f) => (
                        <a
                            key={f.id}
                            href={f.downloadUrl}
                            className="flex items-center gap-1.5 whitespace-nowrap rounded-full border border-[#C9BFA8] px-3 py-1.5 text-[11px] font-medium text-[#1B1B18]/70 transition hover:border-[#1B1B18] hover:text-[#1B1B18]"
                        >
                            <FileTextIcon size={12} />
                            {f.name}
                            <DownloadIcon size={12} />
                        </a>
                    ))}
                </div>
            )}
        </motion.div>
    );
}