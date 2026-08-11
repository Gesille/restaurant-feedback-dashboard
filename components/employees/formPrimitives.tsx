"use client";
import { useState } from "react";

export function LedgerFonts() {
  return (
    <style jsx global>{`
      @import url("https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,400;0,9..144,500;1,9..144,400;1,9..144,500&family=Inter:wght@400;500;600&family=IBM+Plex+Mono:wght@400;500&display=swap");
    `}</style>
  );
}

export const inputCls =
  "w-full rounded-lg border border-[#EDEBF7] px-3 py-2 text-sm outline-none focus:border-[#6C4DF4] focus:ring-2 focus:ring-[#6C4DF4]/10";

export function initials(name: string) {
  return name.split(" ").slice(0, 2).map((w) => w[0]).join("").toUpperCase();
}

export function uniqueSorted(values: (string | undefined)[]): string[] {
  return Array.from(new Set(values.filter((v): v is string => Boolean(v && v.trim())))).sort((a, b) =>
    a.localeCompare(b),
  );
}

export const EMPLOYMENT_STATUS_OPTIONS = [
  "Full-time",
  "Part-time",
  "Probationary Full-time",
  "Probationary Part-time",
  "Contract",
  "Temporary",
  "Intern",
  "Leave of Absence",
  "Terminated",
];

export function FormSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-[#EDEBF7] bg-white p-6 shadow-sm">
      <h2 className="font-['Fraunces'] text-lg italic text-slate-900">{title}</h2>
      <div className="mt-4">{children}</div>
    </div>
  );
}

export function FormField({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="font-['IBM_Plex_Mono'] text-xs font-medium uppercase tracking-wide text-slate-400">
        {label}
      </span>
      <div className="mt-1.5">{children}</div>
    </label>
  );
}

export function ComboField({
  label,
  value,
  onChange,
  options,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: string[];
  placeholder?: string;
}) {
  const [customMode, setCustomMode] = useState(value !== "" && !options.includes(value));

  return (
    <FormField label={label}>
      {customMode ? (
        <div className="flex gap-2">
          <input
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            className={inputCls}
            autoFocus
          />
          {options.length > 0 && (
            <button
              type="button"
              onClick={() => {
                setCustomMode(false);
                onChange("");
              }}
              className="shrink-0 rounded-lg border border-[#EDEBF7] px-2.5 text-xs font-medium text-slate-500 hover:bg-[#FBFAFF]"
              title="Choose from list instead"
            >
              List
            </button>
          )}
        </div>
      ) : (
        <select
          value={value}
          onChange={(e) => {
            if (e.target.value === "__custom__") {
              setCustomMode(true);
              onChange("");
            } else {
              onChange(e.target.value);
            }
          }}
          className={inputCls}
        >
          <option value="">– Select –</option>
          {options.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
          <option value="__custom__">+ Add new…</option>
        </select>
      )}
    </FormField>
  );
}