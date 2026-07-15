/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  MessageCircleQuestionIcon,
  SendIcon,
  Loader2Icon,
  PlusIcon,
  TrashIcon,
  EyeIcon,
  EyeOffIcon,
  MailIcon,
} from "lucide-react";

import { Topbar } from "@/components/layout/Topbar";
import { useGetAllQuestionsQuery, useAddGeneralQuestionMutation, useTogglePublishMutation, useDeleteQuestionMutation, Question, useAnswerQuestionMutation } from "@/redux/questions/questionApi";

type Tab = "general" | "received";

function LedgerFonts() {
  return (
    <style jsx global>{`
      @import url("https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,400;0,9..144,500;1,9..144,400;1,9..144,500&family=Inter:wght@400;500;600&family=IBM+Plex+Mono:wght@400;500&display=swap");
    `}</style>
  );
}

export default function QuestionsAdminPage() {
  const [tab, setTab] = useState<Tab>("received");

  return (
    <div className="mx-auto max-w-6xl font-['Inter']">
      <LedgerFonts />
      <Topbar />
      <div className="px-6 py-9">
        <motion.div initial={{ y: 16, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.5 }}>
          <span className="font-['IBM_Plex_Mono'] text-xs font-semibold uppercase tracking-widest text-fuchsia-600">
            [ Q&A ]
          </span>
          <h1 className="mt-2 font-['Fraunces'] text-3xl italic text-slate-900 sm:text-4xl">
            Questions
          </h1>
          <p className="mt-2 max-w-xl text-sm leading-relaxed text-slate-600 sm:text-base">
            Write general Q&As directly, or answer and publish questions candidates have asked.
          </p>
        </motion.div>
      </div>

      <div className="px-6 pb-14">
        <div className="flex flex-wrap gap-2 rounded-2xl border border-fuchsia-100 bg-white/70 p-2 shadow-sm backdrop-blur-xl">
          <TabButton active={tab === "received"} onClick={() => setTab("received")}>
            Received from candidates
          </TabButton>
          <TabButton active={tab === "general"} onClick={() => setTab("general")}>
            General questions
          </TabButton>
        </div>

        <div className="mt-6">
          {tab === "general" ? <GeneralQuestionsPanel /> : <ReceivedQuestionsPanel />}
        </div>
      </div>
    </div>
  );
}

function TabButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full px-4 py-1.5 font-['IBM_Plex_Mono'] text-xs font-medium uppercase tracking-wide transition ${
        active
          ? "bg-linear-to-br from-pink-500 via-fuchsia-600 to-purple-600 text-white shadow-sm"
          : "text-slate-500 hover:bg-fuchsia-50"
      }`}
    >
      {children}
    </button>
  );
}

/* ─────────────────────────── General questions (HR-authored) ─────────────────────────── */

function GeneralQuestionsPanel() {
  const { data, isLoading, isFetching } = useGetAllQuestionsQuery({ origin: "hr" });
  const [addGeneralQuestion, { isLoading: adding }] = useAddGeneralQuestionMutation();
  const [togglePublish] = useTogglePublishMutation();
  const [deleteQuestion] = useDeleteQuestionMutation();

  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");

  const items = data?.data ?? [];

  const handleCreate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!question.trim() || !answer.trim()) return;

    await addGeneralQuestion({
      question: question.trim(),
      answer: answer.trim(),
      isPublished: true,
    });
    setQuestion("");
    setAnswer("");
  };

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,360px)_1fr]">
      {/* Create form */}
      <form
        onSubmit={handleCreate}
        className="h-max rounded-2xl border border-fuchsia-100 bg-white/70 p-5 shadow-sm backdrop-blur-xl"
      >
        <p className="font-['Fraunces'] text-lg italic text-slate-900">Add a question</p>
        <p className="mt-1 text-xs text-slate-500">
          Written and answered by you — published right away unless you change that later.
        </p>

        <div className="mt-4 flex flex-col gap-3">
          <textarea
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="Question"
            rows={2}
            className="w-full resize-none rounded-xl border border-fuchsia-100 bg-white px-3.5 py-3 text-sm text-slate-900 outline-none placeholder:text-slate-400 focus:border-fuchsia-400"
          />
          <textarea
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            placeholder="Answer"
            rows={4}
            className="w-full resize-none rounded-xl border border-fuchsia-100 bg-white px-3.5 py-3 text-sm text-slate-900 outline-none placeholder:text-slate-400 focus:border-fuchsia-400"
          />
          <button
            type="submit"
            disabled={adding || !question.trim() || !answer.trim()}
            className="flex items-center justify-center gap-2 rounded-xl bg-linear-to-br from-pink-500 via-fuchsia-600 to-purple-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
          >
            {adding ? (
              <Loader2Icon className="size-4 animate-spin" />
            ) : (
              <PlusIcon className="size-4" />
            )}
            Add question
          </button>
        </div>
      </form>

      {/* List */}
      <div className="overflow-hidden rounded-2xl border border-fuchsia-100 bg-white/70 shadow-sm backdrop-blur-xl">
        {isLoading ? (
          <div className="flex items-center justify-center gap-2 py-16 text-slate-400">
            <Loader2Icon className="size-4 animate-spin" />
            <span className="text-sm">Loading…</span>
          </div>
        ) : items.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-2 py-16 text-center">
            <MessageCircleQuestionIcon className="size-8 text-fuchsia-200" />
            <p className="font-['Fraunces'] text-lg italic text-slate-500">No general questions yet</p>
          </div>
        ) : (
          <div className="divide-y divide-fuchsia-50">
            {isFetching && (
              <div className="px-5 py-2 text-right text-xs text-slate-400">
                <Loader2Icon className="inline size-3.5 animate-spin" /> updating…
              </div>
            )}
            {items.map((q) => (
              <GeneralQuestionRow
                key={q._id}
                item={q}
                onTogglePublish={() => togglePublish({ id: q._id, isPublished: !q.isPublished })}
                onDelete={() => deleteQuestion(q._id)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function GeneralQuestionRow({
  item,
  onTogglePublish,
  onDelete,
}: {
  item: Question;
  onTogglePublish: () => void;
  onDelete: () => void;
}) {
  return (
    <div className="px-5 py-4">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="font-['Fraunces'] text-base italic text-slate-900">{item.question}</p>
          <p className="mt-1 text-sm text-slate-600">{item.answer}</p>
        </div>
        <div className="flex shrink-0 items-center gap-1.5">
          <button
            type="button"
            onClick={onTogglePublish}
            title={item.isPublished ? "Unpublish" : "Publish"}
            className={`flex size-8 items-center justify-center rounded-full border transition ${
              item.isPublished
                ? "border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                : "border-slate-200 text-slate-400 hover:bg-slate-50"
            }`}
          >
            {item.isPublished ? <EyeIcon className="size-4" /> : <EyeOffIcon className="size-4" />}
          </button>
          <button
            type="button"
            onClick={onDelete}
            title="Delete"
            className="flex size-8 items-center justify-center rounded-full border border-red-200 text-red-500 transition hover:bg-red-50"
          >
            <TrashIcon className="size-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────── Received questions (from candidates) ─────────────────────────── */

function ReceivedQuestionsPanel() {
  const { data, isLoading, isFetching } = useGetAllQuestionsQuery({ origin: "client" });
  const items = data?.data ?? [];

  const pending = items.filter((q) => !q.answer);
  const answered = items.filter((q) => q.answer);

  return (
    <div className="overflow-hidden rounded-2xl border border-fuchsia-100 bg-white/70 shadow-sm backdrop-blur-xl">
      {isLoading ? (
        <div className="flex items-center justify-center gap-2 py-16 text-slate-400">
          <Loader2Icon className="size-4 animate-spin" />
          <span className="text-sm">Loading…</span>
        </div>
      ) : items.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-2 py-16 text-center">
          <MailIcon className="size-8 text-fuchsia-200" />
          <p className="font-['Fraunces'] text-lg italic text-slate-500">No questions yet</p>
          <p className="text-sm text-slate-400">Candidate questions will show up here.</p>
        </div>
      ) : (
        <div className="divide-y divide-fuchsia-50">
          {isFetching && (
            <div className="px-5 py-2 text-right text-xs text-slate-400">
              <Loader2Icon className="inline size-3.5 animate-spin" /> updating…
            </div>
          )}
          {pending.length > 0 && (
            <div className="bg-fuchsia-50/50 px-5 py-2 font-['IBM_Plex_Mono'] text-[10px] font-semibold uppercase tracking-widest text-fuchsia-600">
              Awaiting reply ({pending.length})
            </div>
          )}
          {pending.map((q) => (
            <ReceivedQuestionRow key={q._id} item={q} />
          ))}
          {answered.length > 0 && (
            <div className="bg-slate-50/50 px-5 py-2 font-['IBM_Plex_Mono'] text-[10px] font-semibold uppercase tracking-widest text-slate-500">
              Answered ({answered.length})
            </div>
          )}
          {answered.map((q) => (
            <ReceivedQuestionRow key={q._id} item={q} />
          ))}
        </div>
      )}
    </div>
  );
}

function ReceivedQuestionRow({ item }: { item: Question }) {
  const [answerQuestion, { isLoading: answering }] = useAnswerQuestionMutation();
  const [togglePublish, { isLoading: publishing }] = useTogglePublishMutation();
  const [deleteQuestion] = useDeleteQuestionMutation();

  const [draft, setDraft] = useState(item.answer ?? "");
  const [editing, setEditing] = useState(!item.answer);

  const handleSaveAnswer = async () => {
    if (!draft.trim()) return;
    await answerQuestion({ id: item._id, answer: draft.trim() });
    setEditing(false);
  };

  return (
    <div className="px-5 py-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="font-['Fraunces'] text-base italic text-slate-900">{item.question}</p>
        <div className="flex items-center gap-2">
          {item.askerEmail && (
            <span className="font-['IBM_Plex_Mono'] text-[11px] text-slate-400">{item.askerEmail}</span>
          )}
          <span className="font-['IBM_Plex_Mono'] text-[11px] text-slate-400">
            {new Date(item.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
          </span>
        </div>
      </div>

      {editing ? (
        <div className="mt-3 flex flex-col gap-2">
          <textarea
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            placeholder="Write a reply…"
            rows={3}
            className="w-full resize-none rounded-xl border border-fuchsia-100 bg-white px-3.5 py-3 text-sm text-slate-900 outline-none placeholder:text-slate-400 focus:border-fuchsia-400"
          />
          <div className="flex gap-2">
            <button
              type="button"
              onClick={handleSaveAnswer}
              disabled={answering || !draft.trim()}
              className="flex items-center gap-2 rounded-full bg-linear-to-br from-pink-500 via-fuchsia-600 to-purple-600 px-4 py-1.5 font-['IBM_Plex_Mono'] text-[11px] font-medium text-white shadow-sm transition hover:opacity-90 disabled:opacity-40"
            >
              {answering ? <Loader2Icon className="size-3.5 animate-spin" /> : <SendIcon className="size-3.5" />}
              Save reply
            </button>
            {item.answer && (
              <button
                type="button"
                onClick={() => {
                  setDraft(item.answer ?? "");
                  setEditing(false);
                }}
                className="rounded-full border border-slate-200 px-4 py-1.5 font-['IBM_Plex_Mono'] text-[11px] text-slate-500 transition hover:bg-slate-50"
              >
                Cancel
              </button>
            )}
          </div>
        </div>
      ) : (
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <p className="flex-1 text-sm text-slate-600">{item.answer}</p>
          <div className="flex shrink-0 items-center gap-1.5">
            <button
              type="button"
              onClick={() => setEditing(true)}
              className="rounded-full border border-slate-200 px-3 py-1 font-['IBM_Plex_Mono'] text-[11px] text-slate-500 transition hover:bg-slate-50"
            >
              Edit
            </button>
            <button
              type="button"
              onClick={() => togglePublish({ id: item._id, isPublished: !item.isPublished })}
              disabled={publishing}
              className={`rounded-full border px-3 py-1 font-['IBM_Plex_Mono'] text-[11px] font-medium transition ${
                item.isPublished
                  ? "border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                  : "border-fuchsia-200 bg-fuchsia-50 text-fuchsia-700 hover:bg-fuchsia-100"
              }`}
            >
              {item.isPublished ? "Published ✓" : "Publish to page"}
            </button>
          </div>
        </div>
      )}

      <div className="mt-2 flex justify-end">
        <button
          type="button"
          onClick={() => deleteQuestion(item._id)}
          className="flex items-center gap-1 font-['IBM_Plex_Mono'] text-[11px] text-red-400 transition hover:text-red-600"
        >
          <TrashIcon className="size-3" />
          Delete
        </button>
      </div>
    </div>
  );
}