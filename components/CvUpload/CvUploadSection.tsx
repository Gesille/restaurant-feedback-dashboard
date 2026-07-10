/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'
import { useCallback, useMemo, useRef, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { FileTextIcon, UploadCloudIcon, XIcon, CheckCircle2Icon, Loader2Icon } from "lucide-react";
import BackgroundBlobs from "@/components/BackgroundBlobs";

import toast from "react-hot-toast";
import { useSubmitCVMutation } from "@/redux/careers/careersApi";

const MAX_SIZE_MB = 5;
const ACCEPTED_TYPES = [".pdf", ".doc", ".docx"];

type UploadStatus = "idle" | "uploading" | "success" | "error";

const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
};

const PROCESS = [
    {
        n: "01",
        title: "Submit",
        body: "Drop your CV and a few details below. Takes about a minute.",
    },
    {
        n: "02",
        title: "Review",
        body: "A person on our team opens the file and reads it — no keyword filter deciding for us.",
    },
    {
        n: "03",
        title: "Interview",
        body: "If there's a fit with something open, we'll reach out to set up a conversation.",
    },
    {
        n: "04",
        title: "Decision",
        body: "Either way, you hear back from us. No file gets left open indefinitely.",
    },
];

const INCLUDE_TIPS = [
    {
        title: "Point at the role, if there is one",
        body: "If you're aiming at a specific position, say so in the message field — it shortens the path to the right reviewer.",
    },
    {
        title: "Skip the objective paragraph",
        body: "We'll get more from two lines on what you actually did in your last role than a summary of your career goals.",
    },
    {
        title: "One file, current version",
        body: "PDF holds formatting best across systems. If you're mid-update, send the newer draft — we'll use what's in front of us.",
    },
    {
        title: "No open role in mind? Still send it",
        body: "Open applications go into the same file review. We keep them on hand when something matching comes up.",
    },
];

export default function CvUploadSection() {
    const [file, setFile] = useState<File | null>(null);
    const [dragActive, setDragActive] = useState(false);
    const [status, setStatus] = useState<UploadStatus>("idle");
    const [errorMsg, setErrorMsg] = useState("");
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [linkedin, setLinkedin] = useState("");
    const [message, setMessage] = useState("");
    const inputRef = useRef<HTMLInputElement>(null);
    const prefersReducedMotion = useReducedMotion();

    const [submitCV] = useSubmitCVMutation();

    // Decorative case-file number — cosmetic only, not a tracking ID.
    const caseNumber = useMemo(() => {
        const y = new Date().getFullYear();
        // eslint-disable-next-line react-hooks/purity
        const rand = Math.floor(1000 + Math.random() * 9000);
        return `CV-${y}-${rand}`;
    }, []);

    const validateAndSetFile = (f: File) => {
        const ext = "." + f.name.split(".").pop()?.toLowerCase();
        if (!ACCEPTED_TYPES.includes(ext)) {
            setErrorMsg("Please upload a PDF, DOC, or DOCX file.");
            setStatus("error");
            return;
        }
        if (f.size > MAX_SIZE_MB * 1024 * 1024) {
            setErrorMsg(`File must be smaller than ${MAX_SIZE_MB}MB.`);
            setStatus("error");
            return;
        }
        setErrorMsg("");
        setStatus("idle");
        setFile(f);
    };

    const handleDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setDragActive(false);
        const dropped = e.dataTransfer.files?.[0];
        if (dropped) validateAndSetFile(dropped);
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!file) return;
        setStatus("uploading");

        try {
            const base64 = await fileToBase64(file);

            await submitCV({
                name,
                email,
                phone,
                linkedin,
                message,
                cvFile: base64,
                cvFileName: file.name,
            }).unwrap();

            setStatus("success");
        } catch (err: any) {
            setStatus("error");
            const msg = err?.data?.message || "Something went wrong. Please try again.";
            setErrorMsg(msg);
            toast.error(msg);
        }
    };

    const reset = () => {
        setFile(null);
        setName("");
        setEmail("");
        setPhone("");
        setLinkedin("");
        setMessage("");
        setStatus("idle");
        setErrorMsg("");
    };

    return (
        <section
            id="cv-upload"
            className="relative  text-[#1B1B18] overflow-hidden"
        >
            <BackgroundBlobs variant="warm" />

            {/* ── Header ───────────────────────────────────────────── */}
            <div className="px-4 md:px-16 lg:px-24 xl:px-32 pt-20 md:pt-28 pb-12 md:pb-16">
                <div className="max-w-3xl">
                    <div className="flex items-center gap-3 mb-5">
                        <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-[#A6822C] border border-[#A6822C]/40 rounded-full px-3 py-1">
                            Case file {caseNumber}
                        </span>
                        <span className="h-px flex-1 bg-[#C9BFA8]" />
                    </div>
                    <h2 className="font-serif text-4xl sm:text-5xl md:text-6xl leading-[1.05]">
                        Open a file.
                        <br />
                        We&apos;ll take it from here.
                    </h2>
                    <p className="mt-6 text-base sm:text-lg text-[#1B1B18]/70 max-w-xl leading-relaxed">
                        Every submission gets a real read, not a keyword scan. Attach what
                        you&apos;ve got, tell us where to reach you, and we&apos;ll follow up
                        the moment there&apos;s a fit.
                    </p>
                </div>
            </div>

            {/* ── Process rail + Form ─────────────────────────────── */}
            <div className="px-4 md:px-16 lg:px-24 xl:px-32 pb-20 md:pb-28">
                <div className="grid lg:grid-cols-[minmax(0,340px)_1fr] gap-10 lg:gap-16 items-start">
                    {/* Process rail */}
                    <div className="lg:sticky lg:top-24 flex flex-col gap-0">
                        {PROCESS.map((step, i) => (
                            <div key={step.n} className="relative pl-10 pb-10 last:pb-0">
                                {i !== PROCESS.length - 1 && (
                                    <span className="absolute left-[13px] top-7 bottom-0 w-px bg-[#C9BFA8]" />
                                )}
                                <span className="absolute left-0 top-0 flex items-center justify-center size-7 rounded-full bg-[#1B1B18] text-[#EDE6D6] font-mono text-[11px]">
                                    {step.n}
                                </span>
                                <h3 className="font-serif text-xl mb-1.5">{step.title}</h3>
                                <p className="text-sm text-[#1B1B18]/65 leading-relaxed max-w-xs">
                                    {step.body}
                                </p>
                            </div>
                        ))}
                    </div>

                    {/* Case-file form card */}
                    <motion.div
                        initial={prefersReducedMotion ? undefined : { y: 24, opacity: 0 }}
                        whileInView={prefersReducedMotion ? undefined : { y: 0, opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ type: "spring", stiffness: 220, damping: 28 }}
                        className="relative"
                    >
                        {/* folder tab */}
                        <div className="relative z-10 ml-6 inline-flex items-center gap-2 bg-[#1B1B18] text-[#EDE6D6] rounded-t-lg px-4 py-2 -mb-px">
                            <FileTextIcon size={14} />
                            <span className="font-mono text-[11px] uppercase tracking-widest">
                                Applicant file
                            </span>
                        </div>

                        <div className="relative rounded-b-2xl rounded-tr-2xl border border-[#C9BFA8] bg-[#F7F3E9] shadow-[0_1px_0_0_#C9BFA8] p-6 sm:p-8">
                            {status === "success" ? (
                                <SuccessStamp name={name} caseNumber={caseNumber} onReset={reset} />
                            ) : (
                                <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                                    <div className="grid sm:grid-cols-2 gap-4">
                                        <Field label="Full name">
                                            <input
                                                type="text"
                                                placeholder="Jordan Lee"
                                                required
                                                value={name}
                                                onChange={(e) => setName(e.target.value)}
                                                className={inputCls}
                                            />
                                        </Field>
                                        <Field label="Email address">
                                            <input
                                                type="email"
                                                placeholder="jordan@email.com"
                                                required
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                                className={inputCls}
                                            />
                                        </Field>
                                    </div>

                                    <div className="grid sm:grid-cols-2 gap-4">
                                        <Field label="Phone number (optional)">
                                            <input
                                                type="tel"
                                                placeholder="+1 555 123 4567"
                                                value={phone}
                                                onChange={(e) => setPhone(e.target.value)}
                                                className={inputCls}
                                            />
                                        </Field>
                                        <Field label="LinkedIn profile (optional)">
                                            <input
                                                type="url"
                                                placeholder="linkedin.com/in/jordanlee"
                                                value={linkedin}
                                                onChange={(e) => setLinkedin(e.target.value)}
                                                className={inputCls}
                                            />
                                        </Field>
                                    </div>

                                    <Field label="Message to HR (optional)">
                                        <textarea
                                            placeholder="Which role you're interested in, your availability, or anything else worth knowing..."
                                            value={message}
                                            onChange={(e) => setMessage(e.target.value)}
                                            rows={4}
                                            maxLength={1000}
                                            className={`${inputCls} resize-none`}
                                        />
                                        <span className="font-mono text-[10px] opacity-40 self-end">
                                            {message.length}/1000
                                        </span>
                                    </Field>

                                    <div
                                        onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
                                        onDragLeave={() => setDragActive(false)}
                                        onDrop={handleDrop}
                                        onClick={() => inputRef.current?.click()}
                                        role="button"
                                        tabIndex={0}
                                        onKeyDown={(e) => {
                                            if (e.key === "Enter" || e.key === " ") inputRef.current?.click();
                                        }}
                                        className={`relative overflow-hidden flex flex-col items-center justify-center gap-3 border-2 border-dashed rounded-xl p-8 sm:p-10 cursor-pointer transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#B23A2E] ${
                                            dragActive
                                                ? "border-[#B23A2E] bg-[#B23A2E]/5"
                                                : "border-[#C9BFA8] bg-transparent"
                                        }`}
                                    >
                                        {dragActive && !prefersReducedMotion && (
                                            <>
                                                <style>{`
                                                    @keyframes cv-drop-scan {
                                                        0% { top: -10%; }
                                                        100% { top: 110%; }
                                                    }
                                                `}</style>
                                                <div
                                                    className="absolute left-0 right-0 h-px pointer-events-none bg-[#B23A2E] shadow-[0_0_10px_2px_rgba(178,58,46,0.5)]"
                                                    style={{ animation: "cv-drop-scan 1.1s ease-in-out infinite" }}
                                                />
                                            </>
                                        )}

                                        <input
                                            ref={inputRef}
                                            type="file"
                                            accept={ACCEPTED_TYPES.join(",")}
                                            className="hidden"
                                            onChange={(e) => {
                                                const f = e.target.files?.[0];
                                                if (f) validateAndSetFile(f);
                                            }}
                                        />

                                        {!file ? (
                                            <>
                                                <UploadCloudIcon size={30} className="text-[#B23A2E]" />
                                                <p className="text-sm text-center">
                                                    <span className="font-semibold text-[#B23A2E]">
                                                        Click to upload
                                                    </span>{" "}
                                                    or drag and drop
                                                </p>
                                                <p className="font-mono text-[11px] uppercase tracking-wide opacity-50">
                                                    PDF · DOC · DOCX — max {MAX_SIZE_MB}MB
                                                </p>
                                            </>
                                        ) : (
                                            <div className="flex items-center gap-3 w-full">
                                                <FileTextIcon size={26} className="text-[#B23A2E] shrink-0" />
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-sm font-medium truncate">{file.name}</p>
                                                    <p className="font-mono text-[11px] opacity-50">
                                                        {(file.size / 1024 / 1024).toFixed(2)} MB
                                                    </p>
                                                </div>
                                                <button
                                                    type="button"
                                                    onClick={(e) => { e.stopPropagation(); setFile(null); }}
                                                    className="shrink-0 size-8 flex items-center justify-center rounded-full border border-[#C9BFA8] hover:bg-black/5 transition"
                                                >
                                                    <XIcon size={14} />
                                                </button>
                                            </div>
                                        )}
                                    </div>

                                    {status === "error" && (
                                        <p className="text-sm text-center text-[#B23A2E]">
                                            {errorMsg}
                                        </p>
                                    )}

                                    <button
                                        type="submit"
                                        disabled={!file || status === "uploading"}
                                        className="w-full flex items-center justify-center gap-2 py-3 text-[#F7F3E9] font-medium rounded-full bg-[#1B1B18] hover:bg-[#1B1B18]/90 active:scale-[0.98] transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                                    >
                                        {status === "uploading" ? (
                                            <>
                                                <Loader2Icon size={17} className="animate-spin" />
                                                Submitting...
                                            </>
                                        ) : (
                                            "Submit CV"
                                        )}
                                    </button>
                                </form>
                            )}
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* ── What to include ─────────────────────────────────── */}
            <div className="border-t border-[#C9BFA8]">
                <div className="px-4 md:px-16 lg:px-24 xl:px-32 py-16 md:py-20">
                    <div className="flex items-center gap-3 mb-10">
                        <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-[#A6822C]">
                            Before you send it
                        </span>
                        <span className="h-px flex-1 bg-[#C9BFA8]" />
                    </div>
                    <div className="grid sm:grid-cols-2 gap-x-10 gap-y-10">
                        {INCLUDE_TIPS.map((tip) => (
                            <div key={tip.title} className="max-w-md">
                                <h4 className="font-serif text-lg mb-2">{tip.title}</h4>
                                <p className="text-sm text-[#1B1B18]/65 leading-relaxed">
                                    {tip.body}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}

const inputCls =
    "w-full bg-transparent border border-[#C9BFA8] rounded-lg px-4 py-3 text-sm outline-none transition placeholder:opacity-40 focus:border-[#1B1B18] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#B23A2E]";

function Field({ label, children }: { label: string; children: React.ReactNode }) {
    return (
        <label className="flex flex-col gap-1.5">
            <span className="font-mono text-[10px] uppercase tracking-widest text-[#A6822C]">{label}</span>
            {children}
        </label>
    );
}

function SuccessStamp({
    name,
    caseNumber,
    onReset,
}: {
    name: string;
    caseNumber: string;
    onReset: () => void;
}) {
    const prefersReducedMotion = useReducedMotion();
    return (
        <div className="flex flex-col items-center text-center gap-5 py-10">
            <motion.div
                initial={prefersReducedMotion ? undefined : { scale: 1.4, opacity: 0, rotate: 0 }}
                animate={prefersReducedMotion ? undefined : { scale: 1, opacity: 1, rotate: -8 }}
                transition={{ type: "spring", stiffness: 300, damping: 18 }}
                className="inline-flex flex-col items-center gap-1 border-4 border-double border-[#B23A2E] text-[#B23A2E] rounded px-6 py-3"
                style={{ transform: prefersReducedMotion ? "rotate(-8deg)" : undefined }}
            >
                <div className="flex items-center gap-2">
                    <CheckCircle2Icon size={18} />
                    <span className="font-mono text-sm uppercase tracking-[0.2em]">Received</span>
                </div>
                <span className="font-mono text-[10px] opacity-70">{caseNumber}</span>
            </motion.div>
            <p className="text-sm text-[#1B1B18]/70 max-w-xs">
                Thanks{name ? `, ${name}` : ""} — your file is open. We&apos;ll reach out if
                there&apos;s a match.
            </p>
            <button
                onClick={onReset}
                className="text-sm font-semibold hover:underline text-[#B23A2E]"
            >
                Submit another CV
            </button>
        </div>
    );
}