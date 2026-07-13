/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, FormEvent } from "react";
import { X, Loader2, Store } from "lucide-react";
import { useCreateRestaurantMutation } from "@/redux/restaurants/restaurantApi";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type FormState = {
  x_name: string;
  x_location: string;
  x_manager_email: string;
};

const initialState: FormState = {
  x_name: "",
  x_location: "",
  x_manager_email: "",
};

export function AddRestaurantModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const [form, setForm] = useState<FormState>(initialState);
  const [error, setError] = useState<string | null>(null);

  const [createRestaurant, { isLoading }] = useCreateRestaurantMutation();

  const handleChange =
    (field: keyof FormState) => (e: React.ChangeEvent<HTMLInputElement>) => {
      setForm((f) => ({ ...f, [field]: e.target.value }));
    };

  const handleClose = () => {
    setForm(initialState);
    setError(null);
    onClose();
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    const x_name = form.x_name.trim();
    const x_location = form.x_location.trim();
    const x_manager_email = form.x_manager_email.trim().toLowerCase();

    // Mirror the backend's validation client-side so users get instant
    // feedback instead of waiting on a 400 round-trip.
    if (!x_name || !x_location || !x_manager_email) {
      setError("All fields are required.");
      return;
    }
    if (!EMAIL_RE.test(x_manager_email)) {
      setError("Enter a valid manager email.");
      return;
    }

    try {
      await createRestaurant({ x_name, x_location, x_manager_email }).unwrap();
      // createRestaurant invalidates ["Restaurant"], so the grid
      // feeding this modal refetches and the new card shows up.
      handleClose();
    } catch (err: any) {
      setError(err?.data?.message || "Failed to create restaurant. Try again.");
    }
  };

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 px-4"
      onClick={handleClose}
    >
      <div
        className="relative w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={handleClose}
          className="absolute right-4 top-4 rounded-full p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
          aria-label="Close"
        >
          <X size={18} />
        </button>

        <div className="mb-5 flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-50 text-violet-500">
            <Store size={18} />
          </span>
          <div>
            <h3 className="text-base font-semibold text-slate-900">Add restaurant</h3>
            <p className="text-xs text-slate-500">Connect a new location to QRSuite</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="mb-1 block text-xs font-medium text-slate-600">
              Restaurant name
            </label>
            <input
              type="text"
              value={form.x_name}
              onChange={handleChange("x_name")}
              placeholder="Big Banana Group"
              maxLength={100}
              className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm text-slate-900 outline-none focus:border-violet-300 focus:ring-2 focus:ring-violet-100"
            />
          </div>

          <div>
            <label className="mb-1 block text-xs font-medium text-slate-600">
              Location
            </label>
            <input
              type="text"
              value={form.x_location}
              onChange={handleChange("x_location")}
              placeholder="St. John's, Antigua"
              maxLength={200}
              className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm text-slate-900 outline-none focus:border-violet-300 focus:ring-2 focus:ring-violet-100"
            />
          </div>

          <div>
            <label className="mb-1 block text-xs font-medium text-slate-600">
              Manager email
            </label>
            <input
              type="email"
              value={form.x_manager_email}
              onChange={handleChange("x_manager_email")}
              placeholder="manager@restaurant.com"
              className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm text-slate-900 outline-none focus:border-violet-300 focus:ring-2 focus:ring-violet-100"
            />
          </div>

          {error && (
            <p className="rounded-lg bg-red-50 px-3 py-2 text-xs font-medium text-red-600">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="flex w-full items-center justify-center gap-1.5 rounded-lg bg-violet-600 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isLoading && <Loader2 size={14} className="animate-spin" />}
            {isLoading ? "Adding..." : "Add restaurant"}
          </button>
        </form>
      </div>
    </div>
  );
}