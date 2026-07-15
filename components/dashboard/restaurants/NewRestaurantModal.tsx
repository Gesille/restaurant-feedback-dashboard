/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useRef, useState } from "react";
import { X, Upload, ImageOff } from "lucide-react";
import { useModal } from "@/lib/modal-context";
import { BrandColor } from "@/lib/colors";
import { useCreateRestaurantMutation } from "@/redux/restaurants/restaurantApi";



export function NewRestaurantModal() {
  const { isNewRestaurantOpen, closeNewRestaurant } = useModal();
  const [createRestaurant, { isLoading: submitting }] = useCreateRestaurantMutation();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState({
    x_name: "",
    x_location: "",
    x_manager_email: "",
    x_website: "",
    x_tables: 0,
    x_color: "violet" as BrandColor,
    x_status: "active" as "active" | "paused",
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  if (!isNewRestaurantOpen) return null;

  function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    setPreview(URL.createObjectURL(file));
  }

  function resetForm() {
    setForm({
      x_name: "", x_location: "", x_manager_email: "", x_website: "",
      x_tables: 0, x_color: "violet", x_status: "active",
    });
    setImageFile(null);
    setPreview(null);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    const formData = new FormData();
    formData.append("x_name", form.x_name);
    formData.append("x_location", form.x_location);
    formData.append("x_manager_email", form.x_manager_email);
    formData.append("x_website", form.x_website);
    formData.append("x_tables", String(form.x_tables));
    formData.append("x_color", form.x_color);
    formData.append("x_status", form.x_status);
    if (imageFile) formData.append("image", imageFile);

    try {
      await createRestaurant(formData).unwrap();
      closeNewRestaurant();
      resetForm();
    } catch (err: any) {
      setError(err?.data?.message ?? "Something went wrong");
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-2xl border border-[#E4E7E2] bg-white p-6 shadow-xl">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="font-['Fraunces'] text-lg italic text-[#12231C]">New restaurant</h2>
          <button onClick={closeNewRestaurant} className="text-[#7B8A82] hover:text-[#12231C]">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1 block text-xs font-semibold text-[#4E5D55]">Logo</label>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
              className="hidden"
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="flex w-full items-center gap-3 rounded-xl border border-dashed border-[#E4E7E2] px-3 py-2 text-left hover:border-[#12231C]"
            >
              <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-[#F6F8F6]">
                {preview ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={preview} alt="Preview" className="h-full w-full object-cover" />
                ) : (
                  <ImageOff size={18} className="text-[#7B8A82]" />
                )}
              </div>
              <span className="flex items-center gap-1.5 text-sm text-[#4E5D55]">
                {imageFile ? (
                  "Change image"
                ) : (
                  <>
                    <Upload size={14} /> Upload from your computer
                  </>
                )}
              </span>
            </button>
          </div>

          <div>
            <label className="mb-1 block text-xs font-semibold text-[#4E5D55]">Name</label>
            <input
              required
              value={form.x_name}
              onChange={(e) => setForm({ ...form, x_name: e.target.value })}
              className="w-full rounded-xl border border-[#E4E7E2] px-3 py-2 text-sm outline-none focus:border-[#12231C]"
            />
          </div>

          <div>
            <label className="mb-1 block text-xs font-semibold text-[#4E5D55]">Location</label>
            <input
              required
              value={form.x_location}
              onChange={(e) => setForm({ ...form, x_location: e.target.value })}
              className="w-full rounded-xl border border-[#E4E7E2] px-3 py-2 text-sm outline-none focus:border-[#12231C]"
            />
          </div>

          <div>
            <label className="mb-1 block text-xs font-semibold text-[#4E5D55]">Manager email</label>
            <input
              required
              type="email"
              value={form.x_manager_email}
              onChange={(e) => setForm({ ...form, x_manager_email: e.target.value })}
              className="w-full rounded-xl border border-[#E4E7E2] px-3 py-2 text-sm outline-none focus:border-[#12231C]"
            />
          </div>

          <div>
            <label className="mb-1 block text-xs font-semibold text-[#4E5D55]">Website</label>
            <input
              value={form.x_website}
              onChange={(e) => setForm({ ...form, x_website: e.target.value })}
              placeholder="https://"
              className="w-full rounded-xl border border-[#E4E7E2] px-3 py-2 text-sm outline-none focus:border-[#12231C]"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
          
            <div>
              <label className="mb-1 block text-xs font-semibold text-[#4E5D55]">Status</label>
              <select
                value={form.x_status}
                onChange={(e) => setForm({ ...form, x_status: e.target.value as "active" | "paused" })}
                className="w-full rounded-xl border border-[#E4E7E2] px-3 py-2 text-sm outline-none focus:border-[#12231C]"
              >
                <option value="active">Active</option>
                <option value="paused">Paused</option>
              </select>
            </div>
          </div>

   

          {error && <p className="text-xs text-red-500">{error}</p>}

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={closeNewRestaurant}
              className="rounded-full border border-[#E4E7E2] px-4 py-2 text-sm font-semibold text-[#12231C] hover:bg-[#F6F8F6]"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="rounded-full bg-[#12231C] px-4 py-2 text-sm font-semibold text-white hover:bg-[#1C362A] disabled:opacity-60"
            >
              {submitting ? "Creating…" : "Create restaurant"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}