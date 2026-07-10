/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'
import { useCallback, useRef, useState } from "react";
import { motion } from "motion/react";
import { FileTextIcon, UploadCloudIcon, XIcon, CheckCircle2Icon, Loader2Icon } from "lucide-react";
import BackgroundBlobs from "@/components/BackgroundBlobs";

import toast from "react-hot-toast";
import { useSubmitCVMutation } from "@/redux/careers/careersApi";

const MAX_SIZE_MB = 5;
const ACCEPTED_TYPES = [".pdf", ".doc", ".docx"];

type UploadStatus = "idle" | "uploading" | "success" | "error";

// convert a File to base64 (same pattern as your avatar upload flow)
const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
};

export default function CvUploadSection() {

    const [file, setFile] = useState<File | null>(null);
    const [dragActive, setDragActive] = useState(false);
    const [status, setStatus] = useState<UploadStatus>("idle");
    const [errorMsg, setErrorMsg] = useState("");
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");
    const [phone, setPhone] = useState("");
const [linkedin, setLinkedin] = useState("");
    const inputRef = useRef<HTMLInputElement>(null);

    const [submitCV] = useSubmitCVMutation();

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
            className="relative px-4 md:px-16 lg:px-24 xl:px-32 py-20 md:py-28 text-neutral-900 overflow-hidden"
        >
            <BackgroundBlobs variant="muted" />

            <div className="max-w-xl mx-auto text-center mb-10">
                <p className="font-mono text-xs uppercase tracking-widest opacity-60 mb-3">
                    [ Submission ]
                </p>
                <h2 className="font-serif text-3xl sm:text-4xl">Submit your CV in seconds</h2>
                <p className="opacity-70 mt-3 text-sm sm:text-base">
                    Drop your file below, or click to browse. Our team reviews every
                    submission and matches you against live roles.
                </p>
            </div>

            <motion.div
                initial={{ y: 30, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ type: "spring", stiffness: 260, damping: 30 }}
                className="relative max-w-xl mx-auto rounded-2xl border border-neutral-200 bg-white/90 backdrop-blur-sm p-6 sm:p-8"
            >
                {status === "success" ? (
                    <SuccessStamp name={name} onReset={reset} />
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
            className="w-full bg-transparent border border-neutral-200 rounded-lg px-4 py-3 text-sm outline-none transition placeholder:opacity-40 focus:border-current"
        />
    </Field>
    <Field label="Email address">
        <input
            type="email"
            placeholder="jordan@email.com"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full bg-transparent border border-neutral-200 rounded-lg px-4 py-3 text-sm outline-none transition placeholder:opacity-40 focus:border-current"
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
            className="w-full bg-transparent border border-neutral-200 rounded-lg px-4 py-3 text-sm outline-none transition placeholder:opacity-40 focus:border-current"
        />
    </Field>
    <Field label="LinkedIn profile (optional)">
        <input
            type="url"
            placeholder="linkedin.com/in/jordanlee"
            value={linkedin}
            onChange={(e) => setLinkedin(e.target.value)}
            className="w-full bg-transparent border border-neutral-200 rounded-lg px-4 py-3 text-sm outline-none transition placeholder:opacity-40 focus:border-current"
        />
    </Field>
</div>

                        <Field label="Message to HR (optional)">
                            <textarea
                                placeholder="Tell us which role you're interested in, your availability, or anything else you'd like HR to know..."
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                rows={4}
                                maxLength={1000}
                                className="w-full bg-transparent border border-neutral-200 rounded-lg px-4 py-3 text-sm outline-none transition placeholder:opacity-40 focus:border-current resize-none"
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
                            className={`relative overflow-hidden flex flex-col items-center justify-center gap-3 border-2 border-dashed rounded-xl p-8 sm:p-10 cursor-pointer transition-colors ${
                                dragActive
                                    ? "border-purple-600 bg-purple-600/5"
                                    : "border-neutral-200 bg-transparent"
                            }`}
                        >
                            {dragActive && (
                                <>
                                    <style>{`
                                        @keyframes cv-drop-scan {
                                            0% { top: -10%; }
                                            100% { top: 110%; }
                                        }
                                    `}</style>
                                    <div
                                        className="absolute left-0 right-0 h-px pointer-events-none bg-orange-500 shadow-[0_0_10px_2px_rgba(249,115,22,0.6)]"
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
                                    <UploadCloudIcon size={30} className="text-purple-600" />
                                    <p className="text-sm text-center">
                                        <span className="font-semibold text-purple-600">
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
                                    <FileTextIcon size={26} className="text-purple-600 shrink-0" />
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium truncate">{file.name}</p>
                                        <p className="font-mono text-[11px] opacity-50">
                                            {(file.size / 1024 / 1024).toFixed(2)} MB
                                        </p>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={(e) => { e.stopPropagation(); setFile(null); }}
                                        className="shrink-0 size-8 flex items-center justify-center rounded-full border border-neutral-200 hover:bg-black/5 transition"
                                    >
                                        <XIcon size={14} />
                                    </button>
                                </div>
                            )}
                        </div>

                        {status === "error" && (
                            <p className="text-sm text-center text-red-600">
                                {errorMsg}
                            </p>
                        )}

                        <button
                            type="submit"
                            disabled={!file || status === "uploading"}
                            className="w-full flex items-center justify-center gap-2 py-3 text-white font-medium rounded-full bg-purple-600 hover:brightness-110 active:scale-95 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
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
            </motion.div>
        </section>
    );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
    return (
        <label className="flex flex-col gap-1.5">
            <span className="font-mono text-[10px] uppercase tracking-widest opacity-50">{label}</span>
            {children}
        </label>
    );
}

function SuccessStamp({ name, onReset }: { name: string; onReset: () => void }) {
    return (
        <div className="flex flex-col items-center text-center gap-4 py-6">
            <div className="flex items-center gap-2 border-2 border-blue-600 text-blue-600 rounded-lg px-4 py-2 -rotate-3">
                <CheckCircle2Icon size={20} />
                <span className="font-mono text-sm uppercase tracking-widest">CV received</span>
            </div>
            <p className="text-sm opacity-70 max-w-xs">
                Thanks{name ? `, ${name}` : ""} — we&apos;ll reach out if there&apos;s a match.
            </p>
            <button
                onClick={onReset}
                className="text-sm font-semibold hover:underline text-purple-600"
            >
                Submit another CV
            </button>
        </div>
    );
}