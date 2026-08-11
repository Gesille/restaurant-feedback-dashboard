/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useState } from "react";
import { motion } from "motion/react";
import { AlertTriangleIcon, Loader2Icon } from "lucide-react";
import { EmployeeSummary } from "@/types";
import { useDeleteEmployeeMutation } from "@/redux/Employee/Employeeapi";

export function DeleteConfirmModal({ employee, onClose }: { employee: EmployeeSummary; onClose: () => void }) {
  const [deleteEmployee, { isLoading }] = useDeleteEmployeeMutation();
  const [error, setError] = useState<string | null>(null);

  const handleDelete = async () => {
    try {
      await deleteEmployee(employee.id).unwrap();
      onClose();
    } catch (err: any) {
      setError(err?.data?.message || "Failed to delete employee");
    }
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 z-40 bg-slate-900/30 backdrop-blur-sm"
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.96 }}
        transition={{ duration: 0.15 }}
        className="fixed left-1/2 top-1/2 z-50 w-full max-w-sm -translate-x-1/2 -translate-y-1/2 rounded-2xl bg-white p-6 shadow-2xl font-['Inter']"
      >
        <div className="flex size-10 items-center justify-center rounded-xl bg-red-50">
          <AlertTriangleIcon className="size-5 text-red-600" />
        </div>
        <h3 className="mt-4 font-['Fraunces'] text-lg italic text-slate-900">Delete this employee?</h3>
        <p className="mt-1.5 text-sm text-slate-600">
          <span className="font-medium text-slate-900">{employee.full_name}</span> will be removed permanently. This can&apos;t be undone.
        </p>
        {error && <p className="mt-3 text-xs text-red-600">{error}</p>}
        <div className="mt-6 flex gap-2">
          <button type="button" onClick={onClose} className="flex-1 rounded-xl border border-[#EDEBF7] px-4 py-2.5 text-sm font-semibold text-slate-600 hover:bg-[#FBFAFF]">
            Cancel
          </button>
          <button
            type="button"
            onClick={handleDelete}
            disabled={isLoading}
            className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-red-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-red-700 disabled:opacity-60"
          >
            {isLoading && <Loader2Icon className="size-4 animate-spin" />}
            Delete
          </button>
        </div>
      </motion.div>
    </>
  );
}