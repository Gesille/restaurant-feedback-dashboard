import { InputHTMLAttributes } from "react";

export function FormField({
  label,
  error,
  ...props
}: { label: string; error?: string } & InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div className="mb-4">
      <label className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-[#6B6685]">
        {label}
      </label>
      <input
        {...props}
        className="w-full rounded-[10px] border-[1.5px] border-[#EDEBF7] bg-[#FBFAFF] px-3.5 py-2.5 text-sm font-medium text-[#1A1730] placeholder:text-[#9C97B5] focus:border-[#6C4DF4] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#EDE8FF]"
      />
      {error && <p className="mt-1.5 text-xs font-semibold text-[#E14848]">{error}</p>}
    </div>
  );
}
