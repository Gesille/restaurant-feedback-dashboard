"use client";
import { useState } from "react";
import { motion } from "motion/react";
import { ArrowUpRight, Plus } from "lucide-react";

type Question = {
    id: string;
    text: string;
    reply: string;
    askedAt: string;
};

const INITIAL_QUESTIONS: Question[] = [
    {
        id: "demo-1",
        text: "Do you sponsor visas for remote hires outside the AST timezone?",
        reply:
            "Yes, on a case-by-case basis depending on the role. Mention it in your application and HR will confirm during screening.",
        askedAt: "Jul 4, 2026",
    },
    {
        id: "demo-2",
        text: "What's the typical turnaround time between interview stages?",
        reply:
            "Usually 3-5 business days between each stage. If it's taking longer, feel free to follow up with your recruiter directly.",
        askedAt: "Jul 2, 2026",
    },
    {
        id: "demo-3",
        text: "Is relocation assistance available for international candidates?",
        reply:
            "For select senior roles, yes. The offer letter will state whether relocation support applies, and HR can walk you through the details before you accept.",
        askedAt: "Jun 28, 2026",
    },
    {
        id: "demo-4",
        text: "Can I apply to more than one open role at the same time?",
        reply:
            "Yes. Apply to any roles you're a genuine fit for. If two teams both want to move forward, your recruiter will help you coordinate the process.",
        askedAt: "Jun 24, 2026",
    },
    {
        id: "demo-5",
        text: "Do you offer part-time or four-day-week arrangements?",
        reply:
            "It depends on the team and role. A few teams already support four-day weeks; mention your preference during screening and we'll flag it to the hiring manager.",
        askedAt: "Jun 20, 2026",
    },
];

export default function QuestionsSection() {
    // Only questions HR has approved and answered are shown publicly.
    const [questions] = useState<Question[]>(INITIAL_QUESTIONS);
    const [draft, setDraft] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const [justSubmitted, setJustSubmitted] = useState(false);
    const [openId, setOpenId] = useState<string | null>(null);

    const handleAsk = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!draft.trim()) return;

        setSubmitting(true);
        // TODO: replace with a real API call, e.g. POST /api/questions
        setTimeout(() => {
            setDraft("");
            setSubmitting(false);
            setJustSubmitted(true);
            setTimeout(() => setJustSubmitted(false), 4000);
        }, 500);
    };

    return (
        <motion.section
            initial={{ y: 24, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="relative mx-auto max-w-7xl px-4 py-20 md:px-10 lg:px-16"
        >
            <div className="rounded-3xl border border-white/60 bg-white/50 p-8 shadow-sm backdrop-blur-xl md:p-14">
                <div className="grid grid-cols-1 gap-12 md:grid-cols-[minmax(0,320px)_1fr] md:gap-16">
                    {/* Left: intro + ask form, sticky on scroll */}
                    <div className="md:sticky md:top-24 md:self-start">
                        <span className="bg-gradient-to-r from-pink-600 via-purple-600 to-blue-600 bg-clip-text text-xs font-semibold uppercase tracking-widest text-transparent">
                            Questions and answers
                        </span>
                        <h2 className="mt-3 text-2xl font-semibold text-slate-900 md:text-3xl">
                            Ask us anything
                        </h2>
                        <p className="mt-4 text-sm leading-relaxed text-slate-600">
                            Have a question about the role, the process, or working here? Send
                            it to HR below. Once it&apos;s answered, we&apos;ll add it to this page so
                            anyone considering applying can read it.
                        </p>

                        <form onSubmit={handleAsk} className="mt-8 flex flex-col gap-3">
                            <textarea
                                value={draft}
                                onChange={(e) => setDraft(e.target.value)}
                                placeholder="Type your question"
                                rows={3}
                                className="w-full resize-none rounded-xl border border-slate-300 bg-white/70 px-3.5 py-3 text-sm text-slate-900 outline-none placeholder:text-slate-400 focus:border-purple-400"
                            />
                            <button
                                type="submit"
                                disabled={submitting || !draft.trim()}
                                className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-pink-500 to-purple-500 px-5 py-2.5 text-sm font-medium text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
                            >
                                {submitting ? (
                                    <>
                                        <span className="size-3.5 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                                        Sending
                                    </>
                                ) : (
                                    <>
                                        Submit question
                                        <ArrowUpRight className="size-3.5" />
                                    </>
                                )}
                            </button>

                            <motion.p
                                initial={false}
                                animate={{ opacity: justSubmitted ? 1 : 0 }}
                                transition={{ duration: 0.3 }}
                                className="text-xs text-slate-500"
                            >
                                {justSubmitted && "Sent. It'll appear here once HR reviews and answers it."}
                            </motion.p>
                        </form>
                    </div>

                    {/* Right: public Q&A list */}
                    <div>
                        {questions.length === 0 ? (
                            <p className="py-8 text-sm text-slate-500">
                                No questions answered yet. Be the first to ask one.
                            </p>
                        ) : (
                            questions.map((q) => {
                            const isOpen = openId === q.id;
                            return (
                                <div
                                    key={q.id}
                                    className="border-t border-slate-200 py-6 first:pt-0 last:pb-0"
                                >
                                    <button
                                        type="button"
                                        onClick={() => setOpenId(isOpen ? null : q.id)}
                                        aria-expanded={isOpen}
                                        className="-mx-3 flex w-[calc(100%+1.5rem)] items-center justify-between gap-4 rounded-xl px-3 py-1 text-left transition-colors hover:bg-slate-50"
                                    >
                                        <span className="text-base font-medium text-slate-900 md:text-lg">
                                            {q.text}
                                        </span>
                                        <Plus
                                            className={`size-5 shrink-0 text-slate-500 transition-transform duration-200 ${
                                                isOpen ? "rotate-45" : ""
                                            }`}
                                        />
                                    </button>

                                    <motion.div
                                        initial={false}
                                        animate={{
                                            height: isOpen ? "auto" : 0,
                                            opacity: isOpen ? 1 : 0,
                                        }}
                                        transition={{ duration: 0.25, ease: "easeOut" }}
                                        className="overflow-hidden"
                                    >
                                        <p className="mt-3 text-sm leading-relaxed text-slate-600 md:text-[15px]">
                                            {q.reply}
                                        </p>
                                        <p className="mt-4 text-xs text-slate-400">
                                            Answered {q.askedAt}
                                        </p>
                                    </motion.div>
                                </div>
                            );
                            })
                        )}
                    </div>
                </div>
            </div>
        </motion.section>
    );
}