"use client";
import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
    MapPinIcon,
    BriefcaseIcon,
    SearchIcon,
    XIcon,
    UploadIcon,
    CheckCircle2Icon,
    Loader2Icon,
    FileTextIcon,
} from "lucide-react";

type Job = {
    id: string;
    title: string;
    department: string;
    location: string;
    type: "Full-time" | "Part-time" | "Contract";
    postedAt: string;
    summary: string;
    responsibilities: string[];
    requirements: string[];
    niceToHave?: string[];
};

type ApplicationForm = {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    linkedin: string;
    coverLetter: string;
    resume: File | null;
};

const EMPTY_FORM: ApplicationForm = {
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    linkedin: "",
    coverLetter: "",
    resume: null,
};

const DEPARTMENT_COLORS: Record<string, string> = {
    Engineering: "from-pink-500 to-fuchsia-600",
    Design: "from-purple-500 to-fuchsia-600",
    Operations: "from-fuchsia-500 to-pink-600",
    "Customer Success": "from-pink-500 to-purple-600",
    Sales: "from-fuchsia-600 to-purple-600",
};

const JOBS: Job[] = [
    {
        id: "job-1",
        title: "Senior Frontend Engineer",
        department: "Engineering",
        location: "San Juan, PR",
        type: "Full-time",
        postedAt: "Jul 1, 2026",
        summary:
            "Own the frontend of our restaurant platform, working closely with design and backend to ship fast, accessible interfaces used by thousands of restaurants every day.",
        responsibilities: [
            "Build and maintain customer-facing features in React and TypeScript",
            "Partner with design to turn Figma files into polished, responsive UI",
            "Improve performance, accessibility, and test coverage across the app",
            "Mentor mid-level engineers through code review and pairing",
        ],
        requirements: [
            "5+ years building production React applications",
            "Strong TypeScript and modern CSS fundamentals",
            "Experience shipping accessible, responsive interfaces",
        ],
        niceToHave: ["Experience with Next.js", "Familiarity with design systems"],
    },
    {
        id: "job-2",
        title: "Product Designer",
        department: "Design",
        location: "Remote (AST)",
        type: "Full-time",
        postedAt: "Jun 28, 2026",
        summary:
            "Shape the end-to-end experience for restaurant owners and diners, from first onboarding screen to daily-use dashboards.",
        responsibilities: [
            "Lead design for a product area from research through shipped UI",
            "Run lightweight user research and usability testing",
            "Maintain and extend our design system in Figma",
            "Collaborate directly with engineers during implementation",
        ],
        requirements: [
            "4+ years of product design experience, ideally B2B SaaS",
            "A strong portfolio showing end-to-end process, not just polish",
            "Comfort working directly with engineers day-to-day",
        ],
    },
    {
        id: "job-3",
        title: "Restaurant Onboarding Specialist",
        department: "Operations",
        location: "Miami, FL",
        type: "Full-time",
        postedAt: "Jun 25, 2026",
        summary:
            "Be the first point of contact for new restaurant partners, guiding them from signed contract to a fully live, working account.",
        responsibilities: [
            "Run onboarding calls and menu setup sessions with new restaurants",
            "Troubleshoot setup issues and coordinate with support and engineering",
            "Track onboarding milestones and flag at-risk accounts early",
            "Gather feedback to improve the onboarding playbook",
        ],
        requirements: [
            "1-2 years in a customer-facing onboarding, support, or account role",
            "Comfortable on the phone and managing multiple accounts at once",
            "Restaurant or hospitality background is a plus, not required",
        ],
    },
    {
        id: "job-4",
        title: "Customer Success Associate",
        department: "Customer Success",
        location: "Remote (US)",
        type: "Full-time",
        postedAt: "Jun 22, 2026",
        summary:
            "Support our existing restaurant partners after launch, helping them get more value out of the platform and resolving issues quickly.",
        responsibilities: [
            "Own a portfolio of accounts and be their main point of contact",
            "Answer product questions over email, chat, and scheduled calls",
            "Spot renewal risk and loop in the account management team early",
            "Document recurring issues and feed them back to product",
        ],
        requirements: [
            "1+ years in customer success, support, or account management",
            "Clear written communication and patience with non-technical users",
        ],
    },
    {
        id: "job-5",
        title: "Account Executive",
        department: "Sales",
        location: "New York, NY",
        type: "Full-time",
        postedAt: "Jun 20, 2026",
        summary:
            "Drive new business by running the full sales cycle with restaurant groups, from first demo to signed contract.",
        responsibilities: [
            "Run product demos and manage a pipeline of qualified restaurant leads",
            "Negotiate contract terms and close new business",
            "Work with marketing on messaging that resonates with restaurant owners",
            "Keep CRM data accurate and forecast pipeline reliably",
        ],
        requirements: [
            "2+ years of closing experience in a full-cycle sales role",
            "Track record of hitting or exceeding quota",
            "Experience selling to SMB or hospitality is a plus",
        ],
    },
    {
        id: "job-6",
        title: "Backend Engineer",
        department: "Engineering",
        location: "Remote (AST)",
        type: "Contract",
        postedAt: "Jun 18, 2026",
        summary:
            "Help scale the systems behind order processing and payments as restaurant volume keeps growing.",
        responsibilities: [
            "Design and build reliable APIs and background services",
            "Improve database performance under real production load",
            "Work with the platform team on observability and on-call practices",
        ],
        requirements: [
            "3+ years building backend services in a modern language (Node, Go, or similar)",
            "Comfort with relational databases and query optimization",
            "Available for a 6-month contract with potential to extend",
        ],
    },
    {
        id: "job-7",
        title: "Field Operations Coordinator",
        department: "Operations",
        location: "Orlando, FL",
        type: "Part-time",
        postedAt: "Jun 15, 2026",
        summary:
            "Support in-person setup visits and hardware installs for restaurants going live in the Central Florida region.",
        responsibilities: [
            "Visit restaurant locations to install and test hardware",
            "Coordinate scheduling with the onboarding team",
            "Provide light in-person training to restaurant staff",
        ],
        requirements: [
            "Reliable transportation and flexible daytime availability",
            "Comfortable troubleshooting hardware and Wi-Fi setups",
        ],
    },
    {
        id: "job-8",
        title: "Visual Designer",
        department: "Design",
        location: "San Juan, PR",
        type: "Contract",
        postedAt: "Jun 10, 2026",
        summary:
            "Bring a strong visual point of view to marketing pages, product illustrations, and campaign assets over a focused three-month engagement.",
        responsibilities: [
            "Design landing pages, email campaigns, and social assets",
            "Create simple illustrations and icons consistent with the brand",
            "Work closely with the product designer to keep visual language consistent",
        ],
        requirements: [
            "Strong portfolio in visual and brand design",
            "Fluent in Figma and modern illustration tools",
            "Available for a 3-month contract",
        ],
    },
];

const DEPARTMENTS = ["All departments", ...Array.from(new Set(JOBS.map((j) => j.department)))];
const LOCATIONS = ["All locations", ...Array.from(new Set(JOBS.map((j) => j.location)))];

function ApplicationModal({
    job,
    onClose,
    onSubmitted,
}: {
    job: Job;
    onClose: () => void;
    onSubmitted: (jobId: string) => void;
}) {
    const [step, setStep] = useState<"details" | "form">("details");
    const [form, setForm] = useState<ApplicationForm>(EMPTY_FORM);
    const [errors, setErrors] = useState<Partial<Record<keyof ApplicationForm, string>>>({});
    const [status, setStatus] = useState<"idle" | "submitting" | "done">("idle");
    const [dragOver, setDragOver] = useState(false);

    const update = <K extends keyof ApplicationForm>(key: K, value: ApplicationForm[K]) => {
        setForm((f) => ({ ...f, [key]: value }));
        setErrors((e) => ({ ...e, [key]: undefined }));
    };

    const validate = () => {
        const next: Partial<Record<keyof ApplicationForm, string>> = {};
        if (!form.firstName.trim()) next.firstName = "First name is required";
        if (!form.lastName.trim()) next.lastName = "Last name is required";
        if (!form.email.trim()) next.email = "Email is required";
        else if (!/^\S+@\S+\.\S+$/.test(form.email)) next.email = "Enter a valid email";
        if (!form.phone.trim()) next.phone = "Phone number is required";
        if (!form.resume) next.resume = "Attach your resume (PDF or Word)";
        setErrors(next);
        return Object.keys(next).length === 0;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!validate()) return;
        setStatus("submitting");
        // Simulate submission to an ATS/backend (e.g. Odoo Recruitment)
        setTimeout(() => {
            setStatus("done");
            onSubmitted(job.id);
        }, 1100);
    };

    const handleFile = (file: File | null) => {
        if (!file) return;
        const okType =
            file.type === "application/pdf" ||
            file.type === "application/msword" ||
            file.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
        if (!okType) {
            setErrors((e) => ({ ...e, resume: "Only PDF or Word files are accepted" }));
            return;
        }
        update("resume", file);
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-slate-900/50 p-4 backdrop-blur-sm sm:items-center sm:p-6"
            onClick={onClose}
        >
            <motion.div
                initial={{ opacity: 0, y: 24, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 16, scale: 0.98 }}
                transition={{ duration: 0.25, ease: "easeOut" }}
                onClick={(e) => e.stopPropagation()}
                className="relative my-4 w-full max-w-xl overflow-hidden rounded-3xl border border-fuchsia-100 bg-white shadow-2xl shadow-fuchsia-900/10 sm:my-8"
            >
                <button
                    onClick={onClose}
                    aria-label="Close"
                    className="absolute right-4 top-4 z-10 flex size-8 items-center justify-center rounded-full bg-white/80 text-slate-500 backdrop-blur transition hover:bg-fuchsia-50 hover:text-slate-700"
                >
                    <XIcon className="size-4" />
                </button>

                <AnimatePresence mode="wait">
                    {status === "done" ? (
                        <motion.div
                            key="done"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="flex flex-col items-center px-8 py-16 text-center"
                        >
                            <motion.div
                                initial={{ scale: 0.6, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                transition={{ type: "spring", stiffness: 260, damping: 18, delay: 0.05 }}
                                className="flex size-16 items-center justify-center rounded-full bg-gradient-to-br from-pink-500 via-fuchsia-600 to-purple-600"
                            >
                                <CheckCircle2Icon className="size-8 text-white" />
                            </motion.div>
                            <h3 className="mt-6 text-xl font-semibold text-slate-900">
                                Application submitted
                            </h3>
                            <p className="mt-2 max-w-sm text-sm leading-relaxed text-slate-500">
                                Thanks, {form.firstName}. We&apos;ve received your application for{" "}
                                <span className="font-medium text-slate-700">{job.title}</span>.
                                Our team reviews every submission and will reach out at{" "}
                                <span className="font-medium text-slate-700">{form.email}</span> if
                                there&apos;s a fit.
                            </p>
                            <button
                                onClick={onClose}
                                className="mt-8 rounded-full bg-gradient-to-r from-pink-500 via-fuchsia-600 to-purple-600 px-6 py-2.5 text-sm font-semibold text-white transition hover:brightness-110 active:scale-95"
                            >
                                Done
                            </button>
                        </motion.div>
                    ) : step === "details" ? (
                        <motion.div
                            key="details"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                        >
                            {/* Header */}
                            <div className="border-b border-fuchsia-100 bg-gradient-to-br from-fuchsia-50/70 to-white px-8 pb-6 pt-8">
                                <span
                                    className={`inline-block rounded-full bg-gradient-to-r px-2.5 py-0.5 text-[11px] font-semibold text-white ${
                                        DEPARTMENT_COLORS[job.department] ?? "from-slate-500 to-slate-600"
                                    }`}
                                >
                                    {job.department}
                                </span>
                                <h2 className="mt-3 text-xl font-semibold text-slate-900">
                                    {job.title}
                                </h2>
                                <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-500">
                                    <span className="flex items-center gap-1">
                                        <MapPinIcon className="size-3.5" />
                                        {job.location}
                                    </span>
                                    <span className="flex items-center gap-1">
                                        <BriefcaseIcon className="size-3.5" />
                                        {job.type}
                                    </span>
                                    <span>Posted {job.postedAt}</span>
                                </div>
                            </div>

                            {/* Description */}
                            <div className="max-h-[60vh] overflow-y-auto px-8 py-6">
                                <p className="text-sm leading-relaxed text-slate-600">
                                    {job.summary}
                                </p>

                                <div className="mt-6">
                                    <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                                        What you&apos;ll do
                                    </h3>
                                    <ul className="mt-2.5 space-y-2">
                                        {job.responsibilities.map((item, idx) => (
                                            <li
                                                key={idx}
                                                className="flex gap-2.5 text-sm leading-relaxed text-slate-700"
                                            >
                                                <span className="mt-2 size-1.5 shrink-0 rounded-full bg-fuchsia-400" />
                                                {item}
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                <div className="mt-6">
                                    <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                                        What we&apos;re looking for
                                    </h3>
                                    <ul className="mt-2.5 space-y-2">
                                        {job.requirements.map((item, idx) => (
                                            <li
                                                key={idx}
                                                className="flex gap-2.5 text-sm leading-relaxed text-slate-700"
                                            >
                                                <span className="mt-2 size-1.5 shrink-0 rounded-full bg-fuchsia-400" />
                                                {item}
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                {job.niceToHave && job.niceToHave.length > 0 && (
                                    <div className="mt-6">
                                        <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                                            Nice to have
                                        </h3>
                                        <ul className="mt-2.5 space-y-2">
                                            {job.niceToHave.map((item, idx) => (
                                                <li
                                                    key={idx}
                                                    className="flex gap-2.5 text-sm leading-relaxed text-slate-700"
                                                >
                                                    <span className="mt-2 size-1.5 shrink-0 rounded-full bg-fuchsia-400" />
                                                    {item}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                            </div>

                            {/* Footer */}
                            <div className="border-t border-fuchsia-100 bg-white px-8 py-5">
                                <button
                                    onClick={() => setStep("form")}
                                    className="flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-pink-500 via-fuchsia-600 to-purple-600 px-6 py-3 text-sm font-semibold text-white shadow-md shadow-fuchsia-500/20 transition hover:brightness-110 active:scale-95"
                                >
                                    Apply for this role
                                </button>
                            </div>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="form"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                        >
                            {/* Header */}
                            <div className="border-b border-fuchsia-100 bg-gradient-to-br from-fuchsia-50/70 to-white px-8 pb-6 pt-8">
                                <button
                                    onClick={() => setStep("details")}
                                    className="mb-2 text-xs font-medium text-fuchsia-600 hover:text-fuchsia-700"
                                >
                                    ← Back to job details
                                </button>
                                <span
                                    className={`inline-block rounded-full bg-gradient-to-r px-2.5 py-0.5 text-[11px] font-semibold text-white ${
                                        DEPARTMENT_COLORS[job.department] ?? "from-slate-500 to-slate-600"
                                    }`}
                                >
                                    {job.department}
                                </span>
                                <h2 className="mt-3 text-xl font-semibold text-slate-900">
                                    Apply — {job.title}
                                </h2>
                                <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-500">
                                    <span className="flex items-center gap-1">
                                        <MapPinIcon className="size-3.5" />
                                        {job.location}
                                    </span>
                                    <span className="flex items-center gap-1">
                                        <BriefcaseIcon className="size-3.5" />
                                        {job.type}
                                    </span>
                                </div>
                            </div>

                            {/* Form */}
                            <form onSubmit={handleSubmit} className="max-h-[65vh] overflow-y-auto px-8 py-6">
                                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                    <Field label="First name" error={errors.firstName}>
                                        <input
                                            value={form.firstName}
                                            onChange={(e) => update("firstName", e.target.value)}
                                            className={inputClass(!!errors.firstName)}
                                            placeholder="Jane"
                                        />
                                    </Field>
                                    <Field label="Last name" error={errors.lastName}>
                                        <input
                                            value={form.lastName}
                                            onChange={(e) => update("lastName", e.target.value)}
                                            className={inputClass(!!errors.lastName)}
                                            placeholder="Doe"
                                        />
                                    </Field>
                                    <Field label="Email" error={errors.email}>
                                        <input
                                            type="email"
                                            value={form.email}
                                            onChange={(e) => update("email", e.target.value)}
                                            className={inputClass(!!errors.email)}
                                            placeholder="jane@example.com"
                                        />
                                    </Field>
                                    <Field label="Phone" error={errors.phone}>
                                        <input
                                            type="tel"
                                            value={form.phone}
                                            onChange={(e) => update("phone", e.target.value)}
                                            className={inputClass(!!errors.phone)}
                                            placeholder="+1 (555) 123-4567"
                                        />
                                    </Field>
                                    <Field label="LinkedIn / portfolio (optional)" className="sm:col-span-2">
                                        <input
                                            value={form.linkedin}
                                            onChange={(e) => update("linkedin", e.target.value)}
                                            className={inputClass(false)}
                                            placeholder="https://linkedin.com/in/janedoe"
                                        />
                                    </Field>

                                    <Field label="Resume / CV" error={errors.resume} className="sm:col-span-2">
                                        <label
                                            onDragOver={(e) => {
                                                e.preventDefault();
                                                setDragOver(true);
                                            }}
                                            onDragLeave={() => setDragOver(false)}
                                            onDrop={(e) => {
                                                e.preventDefault();
                                                setDragOver(false);
                                                handleFile(e.dataTransfer.files?.[0] ?? null);
                                            }}
                                            className={`flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed px-4 py-6 text-center transition-colors ${
                                                dragOver
                                                    ? "border-fuchsia-400 bg-fuchsia-50"
                                                    : errors.resume
                                                    ? "border-red-300 bg-red-50/40"
                                                    : "border-fuchsia-200 bg-fuchsia-50/40 hover:bg-fuchsia-50"
                                            }`}
                                        >
                                            <input
                                                type="file"
                                                accept=".pdf,.doc,.docx"
                                                className="hidden"
                                                onChange={(e) => handleFile(e.target.files?.[0] ?? null)}
                                            />
                                            {form.resume ? (
                                                <>
                                                    <FileTextIcon className="size-5 text-fuchsia-600" />
                                                    <span className="text-sm font-medium text-slate-700">
                                                        {form.resume.name}
                                                    </span>
                                                    <span className="text-xs text-slate-400">
                                                        Click or drop to replace
                                                    </span>
                                                </>
                                            ) : (
                                                <>
                                                    <UploadIcon className="size-5 text-fuchsia-500" />
                                                    <span className="text-sm font-medium text-slate-600">
                                                        Drop your resume here, or click to browse
                                                    </span>
                                                    <span className="text-xs text-slate-400">
                                                        PDF or Word, up to 10MB
                                                    </span>
                                                </>
                                            )}
                                        </label>
                                    </Field>

                                    <Field label="Cover letter (optional)" className="sm:col-span-2">
                                        <textarea
                                            value={form.coverLetter}
                                            onChange={(e) => update("coverLetter", e.target.value)}
                                            rows={4}
                                            className={`${inputClass(false)} resize-none`}
                                            placeholder="Tell us why you're a great fit for this role..."
                                        />
                                    </Field>
                                </div>

                                <button
                                    type="submit"
                                    disabled={status === "submitting"}
                                    className="mt-6 flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-pink-500 via-fuchsia-600 to-purple-600 px-6 py-3 text-sm font-semibold text-white shadow-md shadow-fuchsia-500/20 transition hover:brightness-110 active:scale-95 disabled:opacity-70"
                                >
                                    {status === "submitting" ? (
                                        <>
                                            <Loader2Icon className="size-4 animate-spin" />
                                            Submitting application...
                                        </>
                                    ) : (
                                        "Submit application"
                                    )}
                                </button>
                                <p className="mt-3 text-center text-xs text-slate-400">
                                    By applying, you agree to let us store your information to review
                                    your candidacy.
                                </p>
                            </form>
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.div>
        </motion.div>
    );
}

function Field({
    label,
    error,
    className = "",
    children,
}: {
    label: string;
    error?: string;
    className?: string;
    children: React.ReactNode;
}) {
    return (
        <div className={className}>
            <label className="mb-1.5 block text-xs font-medium text-slate-600">{label}</label>
            {children}
            {error && <p className="mt-1 text-xs font-medium text-red-500">{error}</p>}
        </div>
    );
}

function inputClass(hasError: boolean) {
    return `w-full rounded-xl border bg-fuchsia-50/40 px-3.5 py-2.5 text-sm text-slate-900 outline-none placeholder:text-slate-400 focus:bg-white transition-colors ${
        hasError
            ? "border-red-300 focus:border-red-400"
            : "border-transparent focus:border-fuchsia-300"
    }`;
}

export default function CareersPage() {
    const [search, setSearch] = useState("");
    const [department, setDepartment] = useState("All departments");
    const [location, setLocation] = useState("All locations");
    const [activeJob, setActiveJob] = useState<Job | null>(null);
    const [appliedJobIds, setAppliedJobIds] = useState<Set<string>>(new Set());

    const filtered = useMemo(() => {
        return JOBS.filter((job) => {
            const matchesSearch = job.title.toLowerCase().includes(search.trim().toLowerCase());
            const matchesDept = department === "All departments" || job.department === department;
            const matchesLoc = location === "All locations" || job.location === location;
            return matchesSearch && matchesDept && matchesLoc;
        });
    }, [search, department, location]);

    const hasActiveFilters = search.trim() !== "" || department !== "All departments" || location !== "All locations";

    const clearFilters = () => {
        setSearch("");
        setDepartment("All departments");
        setLocation("All locations");
    };

    return (
        <main className="min-h-screen bg-gradient-to-b from-fuchsia-50/40 via-white to-white pt-28 pb-24 sm:pt-32">
            <div className="mx-auto max-w-6xl px-4 sm:px-6 md:px-10 lg:px-16">
                {/* Header */}
                <motion.div
                    initial={{ y: 16, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                >
                    <span className="bg-gradient-to-r from-pink-600 via-fuchsia-600 to-purple-600 bg-clip-text text-xs font-semibold uppercase tracking-widest text-transparent">
                        Careers
                    </span>
                    <h1 className="mt-3 text-3xl font-semibold text-slate-900 sm:text-4xl">
                        Open roles
                    </h1>
                    <p className="mt-3 max-w-xl text-sm leading-relaxed text-slate-600 sm:text-base">
                        Search by title, or filter by department and location to find a role
                        that fits.
                    </p>
                </motion.div>

                {/* Filters */}
                <motion.div
                    initial={{ y: 16, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.1, ease: "easeOut" }}
                    className="mt-8 flex flex-col gap-3 rounded-2xl border border-fuchsia-100 bg-white/70 p-3 shadow-sm backdrop-blur-xl sm:flex-row sm:items-center"
                >
                    <div className="relative flex-1">
                        <SearchIcon className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
                        <input
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search job title"
                            className="w-full rounded-xl border border-transparent bg-fuchsia-50/60 py-2.5 pl-10 pr-3.5 text-sm text-slate-900 outline-none placeholder:text-slate-400 focus:border-fuchsia-300 focus:bg-white"
                        />
                    </div>

                    <select
                        value={department}
                        onChange={(e) => setDepartment(e.target.value)}
                        className="rounded-xl border border-transparent bg-fuchsia-50/60 px-3.5 py-2.5 text-sm text-slate-700 outline-none focus:border-fuchsia-300 focus:bg-white sm:w-52"
                    >
                        {DEPARTMENTS.map((d) => (
                            <option key={d} value={d}>
                                {d}
                            </option>
                        ))}
                    </select>

                    <select
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        className="rounded-xl border border-transparent bg-fuchsia-50/60 px-3.5 py-2.5 text-sm text-slate-700 outline-none focus:border-fuchsia-300 focus:bg-white sm:w-52"
                    >
                        {LOCATIONS.map((l) => (
                            <option key={l} value={l}>
                                {l}
                            </option>
                        ))}
                    </select>

                    {hasActiveFilters && (
                        <button
                            onClick={clearFilters}
                            className="flex items-center justify-center gap-1.5 whitespace-nowrap rounded-xl px-3.5 py-2.5 text-sm font-medium text-fuchsia-700 transition-colors hover:bg-fuchsia-50"
                        >
                            <XIcon className="size-3.5" />
                            Clear
                        </button>
                    )}
                </motion.div>

                {/* Results count */}
                <p className="mt-6 text-xs font-medium uppercase tracking-wide text-slate-400">
                    {filtered.length} {filtered.length === 1 ? "role" : "roles"} found
                </p>

                {/* Job list */}
                <div className="mt-4 flex flex-col gap-3">
                    <AnimatePresence mode="popLayout">
                        {filtered.length === 0 ? (
                            <motion.div
                                key="empty"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="rounded-2xl border border-dashed border-fuchsia-200 bg-white/50 px-6 py-14 text-center"
                            >
                                <p className="text-sm font-medium text-slate-700">
                                    No roles match those filters.
                                </p>
                                <p className="mt-1 text-sm text-slate-500">
                                    Try a different department or location.
                                </p>
                                <button
                                    onClick={clearFilters}
                                    className="mt-4 rounded-full bg-gradient-to-r from-pink-500 via-fuchsia-600 to-purple-600 px-5 py-2 text-sm font-semibold text-white transition hover:brightness-110"
                                >
                                    Clear filters
                                </button>
                            </motion.div>
                        ) : (
                            filtered.map((job, i) => {
                                const applied = appliedJobIds.has(job.id);
                                return (
                                    <motion.div
                                        key={job.id}
                                        layout
                                        initial={{ opacity: 0, y: 8 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -8 }}
                                        transition={{ duration: 0.2, delay: i * 0.02 }}
                                        className="group flex flex-col gap-3 rounded-2xl border border-fuchsia-100 bg-white/70 p-5 shadow-sm backdrop-blur-xl transition-colors hover:border-fuchsia-300 hover:bg-white sm:flex-row sm:items-center sm:justify-between"
                                    >
                                        <div className="flex flex-col gap-2">
                                            <div className="flex flex-wrap items-center gap-2">
                                                <h3 className="text-base font-semibold text-slate-900">
                                                    {job.title}
                                                </h3>
                                                <span
                                                    className={`rounded-full bg-gradient-to-r px-2.5 py-0.5 text-[11px] font-semibold text-white ${
                                                        DEPARTMENT_COLORS[job.department] ??
                                                        "from-slate-500 to-slate-600"
                                                    }`}
                                                >
                                                    {job.department}
                                                </span>
                                                {applied && (
                                                    <span className="flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-700">
                                                        <CheckCircle2Icon className="size-3" />
                                                        Applied
                                                    </span>
                                                )}
                                            </div>
                                            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500">
                                                <span className="flex items-center gap-1">
                                                    <MapPinIcon className="size-3.5" />
                                                    {job.location}
                                                </span>
                                                <span className="flex items-center gap-1">
                                                    <BriefcaseIcon className="size-3.5" />
                                                    {job.type}
                                                </span>
                                                <span>Posted {job.postedAt}</span>
                                            </div>
                                        </div>

                                        <button
                                            onClick={() => setActiveJob(job)}
                                            disabled={applied}
                                            className={`whitespace-nowrap rounded-full px-5 py-2 text-sm font-semibold shadow-md transition active:scale-95 sm:self-center ${
                                                applied
                                                    ? "cursor-default bg-emerald-50 text-emerald-700 shadow-none"
                                                    : "bg-gradient-to-r from-pink-500 via-fuchsia-600 to-purple-600 text-white shadow-fuchsia-500/20 hover:brightness-110"
                                            }`}
                                        >
                                            {applied ? "Application sent" : "Apply now"}
                                        </button>
                                    </motion.div>
                                );
                            })
                        )}
                    </AnimatePresence>
                </div>
            </div>

            <AnimatePresence>
                {activeJob && (
                    <ApplicationModal
                        job={activeJob}
                        onClose={() => setActiveJob(null)}
                        onSubmitted={(jobId) =>
                            setAppliedJobIds((prev) => new Set(prev).add(jobId))
                        }
                    />
                )}
            </AnimatePresence>
        </main>
    );
}