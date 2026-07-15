/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { useFormik } from "formik";
import * as Yup from "yup";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import { motion, AnimatePresence } from "motion/react";
import {
  Camera,
  User,
  ShieldCheck,
  Mail,
  Eye,
  EyeOff,
  Loader2,
  Check,
  Calendar,
  BadgeCheck,
  Bell,
  Lock,
  AlertTriangle,
  Sparkles,
  Megaphone,
} from "lucide-react";

import {
  useUpdateAvatarMutation,
  useEditeProfileMutation,
  useUpdatePasswordMutation,
} from "@/redux/user/userApi";

type Tab = "profile" | "security" | "preferences";

const profileSchema = Yup.object().shape({
  name: Yup.string().min(2, "Too short").required("Please enter your name"),
});

const passwordSchema = Yup.object().shape({
  oldPassword: Yup.string().required("Enter your current password"),
  newPassword: Yup.string()
    .min(6, "Must be at least 6 characters")
    .required("Enter a new password"),
});

function formatMemberSince(dateStr?: string) {
  if (!dateStr) return "—";
  const date = new Date(dateStr);
  if (Number.isNaN(date.getTime())) return "—";
  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    year: "numeric",
  }).format(date);
}

export default function ProfilePage() {
  const { user } = useSelector((state: any) => state.auth);
  const [tab, setTab] = useState<Tab>("profile");
  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [updateAvatar, { isLoading: avatarLoading }] = useUpdateAvatarMutation();
  const [editProfile, { isLoading: profileLoading }] = useEditeProfileMutation();
  const [updatePassword, { isLoading: passwordLoading }] = useUpdatePasswordMutation();

  const getInitials = (name?: string) => {
    if (!name) return "??";
    const parts = name.trim().split(/\s+/);
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return (parts[0][0] + parts[1][0]).toUpperCase();
  };

  const handleAvatarClick = () => fileInputRef.current?.click();

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async () => {
      const base64 = reader.result as string;
      setAvatarPreview(base64);
      try {
        await updateAvatar(base64).unwrap();
        toast.success("Photo updated");
      } catch {
        toast.error("Couldn't update your photo. Try again.");
        setAvatarPreview(null);
      }
    };
    reader.readAsDataURL(file);
  };

  const profileFormik = useFormik({
    initialValues: { name: user?.name || "" },
    validationSchema: profileSchema,
    enableReinitialize: true,
    onSubmit: async ({ name }) => {
      try {
        await editProfile({ name }).unwrap();
        toast.success("Profile saved");
      } catch {
        toast.error("Couldn't save your changes. Try again.");
      }
    },
  });

  const passwordFormik = useFormik({
    initialValues: { oldPassword: "", newPassword: "" },
    validationSchema: passwordSchema,
    onSubmit: async ({ oldPassword, newPassword }, { resetForm }) => {
      try {
        await updatePassword({ oldPassword, newPassword }).unwrap();
        toast.success("Password updated");
        resetForm();
      } catch (err: any) {
        toast.error(err?.data?.message || "Couldn't update your password.");
      }
    },
  });

  const displayAvatar = avatarPreview || user?.avatar?.url;

  return (
    <div className="relative min-h-screen pt-28 sm:pt-32 pb-20 px-4 sm:px-6 md:px-10 lg:px-16 xl:px-24 2xl:px-32 overflow-hidden">
      {/* ambient background accents so the page doesn't read as empty on wide screens */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-24 -left-24 size-105 rounded-full bg-linear-to-br from-pink-300/30 via-fuchsia-300/20 to-transparent blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute top-40 -right-32 size-120 rounded-full bg-linear-to-br from-purple-300/25 via-fuchsia-200/15 to-transparent blur-3xl"
      />

      <div className="relative mx-auto max-w-5xl">
        {/* Page header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="mb-8 flex items-center gap-3"
        >
          <div className="flex size-11 items-center justify-center rounded-2xl bg-linear-to-br from-pink-500 via-fuchsia-600 to-purple-600 shadow-lg shadow-fuchsia-500/30">
            <Sparkles size={20} className="text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Account settings</h1>
            <p className="text-sm text-gray-500">
              Manage your profile, security, and preferences.
            </p>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-[300px_1fr] gap-6">
          {/* Left column */}
          <div className="flex flex-col gap-6">
            {/* Identity card */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="h-fit rounded-3xl border border-fuchsia-100 bg-white/90 backdrop-blur-xl shadow-lg shadow-fuchsia-500/10 p-6 sm:p-7 flex flex-col items-center text-center"
            >
              <div className="relative">
                {/* rotating gradient ring */}
                <motion.div
                  className="absolute -inset-1.5 rounded-full bg-[conic-gradient(from_0deg,#ec4899,#a21caf,#7e22ce,#ec4899)] opacity-90"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                />
                <div className="relative size-24 sm:size-28 rounded-full bg-white p-1">
                  {displayAvatar ? (
                    <Image
                      src={displayAvatar}
                      alt={user?.name || "Profile photo"}
                      width={112}
                      height={112}
                      className="size-full rounded-full object-cover"
                    />
                  ) : (
                    <div className="size-full rounded-full bg-linear-to-br from-pink-500 via-fuchsia-600 to-purple-600 flex items-center justify-center text-white text-2xl font-bold">
                      {getInitials(user?.name)}
                    </div>
                  )}

                  <button
                    type="button"
                    onClick={handleAvatarClick}
                    aria-label="Change profile photo"
                    className="group absolute inset-1 rounded-full flex items-center justify-center bg-slate-900/0 hover:bg-slate-900/50 transition-colors"
                  >
                    <span className="opacity-0 group-hover:opacity-100 transition-opacity">
                      {avatarLoading ? (
                        <Loader2 size={20} className="text-white animate-spin" />
                      ) : (
                        <Camera size={20} className="text-white" />
                      )}
                    </span>
                  </button>

                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/png, image/jpeg, image/webp"
                    onChange={handleAvatarChange}
                    className="hidden"
                  />
                </div>
              </div>

              <h2 className="mt-4 text-lg font-bold text-gray-900">
                {user?.name || "Your name"}
              </h2>
              <p className="mt-1 flex items-center gap-1.5 text-sm text-gray-500">
                <Mail size={14} />
                {user?.email}
              </p>

              {user?.role && (
                <span className="mt-3 px-3 py-1 rounded-full text-xs font-semibold bg-fuchsia-50 text-fuchsia-700 border border-fuchsia-100 capitalize">
                  {user.role}
                </span>
              )}
            </motion.div>

            {/* Overview / stats card — fills the empty sidebar space with real account info */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.05, ease: "easeOut" }}
              className="rounded-3xl border border-fuchsia-100 bg-white/90 backdrop-blur-xl shadow-lg shadow-fuchsia-500/10 p-6 sm:p-7"
            >
              <h3 className="text-xs font-semibold uppercase tracking-wide text-gray-400 mb-4">
                Overview
              </h3>
              <ul className="space-y-4">
                <OverviewRow
                  icon={Calendar}
                  label="Member since"
                  value={formatMemberSince(user?.createdAt)}
                />
                <OverviewRow
                  icon={BadgeCheck}
                  label="Account type"
                  value={user?.role ? capitalize(user.role) : "Standard"}
                />
                <OverviewRow
                  icon={ShieldCheck}
                  label="Email status"
                  value={user?.isVerified === false ? "Unverified" : "Verified"}
                  valueClassName={
                    user?.isVerified === false ? "text-amber-600" : "text-emerald-600"
                  }
                />
              </ul>
            </motion.div>
          </div>

          {/* Tabbed content */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1, ease: "easeOut" }}
            className="rounded-3xl border border-fuchsia-100 bg-white/90 backdrop-blur-xl shadow-lg shadow-fuchsia-500/10 overflow-hidden h-fit"
          >
            {/* Tab bar */}
            <div className="relative flex border-b border-fuchsia-100 px-2">
              {[
                { id: "profile" as Tab, label: "Profile info", icon: User },
                { id: "security" as Tab, label: "Security", icon: ShieldCheck },
                { id: "preferences" as Tab, label: "Preferences", icon: Bell },
              ].map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  onClick={() => setTab(id)}
                  className={`relative flex items-center gap-2 px-4 py-4 text-sm font-semibold transition-colors ${
                    tab === id
                      ? "text-fuchsia-700"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  <Icon size={16} />
                  {label}
                  {tab === id && (
                    <motion.div
                      layoutId="profile-tab-underline"
                      className="absolute left-2 right-2 -bottom-px h-0.5 bg-linear-to-r from-pink-500 to-fuchsia-600 rounded-full"
                      transition={{ type: "spring", stiffness: 400, damping: 32 }}
                    />
                  )}
                </button>
              ))}
            </div>

            <div className="p-6 sm:p-8">
              <AnimatePresence mode="wait">
                {tab === "profile" && (
                  <motion.form
                    key="profile"
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 12 }}
                    transition={{ duration: 0.2 }}
                    onSubmit={profileFormik.handleSubmit}
                    className="space-y-5"
                  >
                    <div>
                      <label
                        htmlFor="name"
                        className="text-sm font-medium text-gray-700 mb-1.5 block"
                      >
                        Full name
                      </label>
                      <input
                        id="name"
                        name="name"
                        value={profileFormik.values.name}
                        onChange={profileFormik.handleChange}
                        className={`w-full h-11 px-3.5 rounded-xl border text-sm text-gray-900 outline-none transition focus:ring-2 focus:ring-fuchsia-500/40 focus:border-fuchsia-500 ${
                          profileFormik.errors.name && profileFormik.touched.name
                            ? "border-red-400"
                            : "border-gray-200"
                        }`}
                      />
                      {profileFormik.touched.name &&
                        typeof profileFormik.errors.name === "string" && (
                          <span className="text-red-500 text-xs mt-1 block">
                            {profileFormik.errors.name}
                          </span>
                        )}
                    </div>

                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-1.5 block">
                        Email
                      </label>
                      <input
                        value={user?.email || ""}
                        disabled
                        className="w-full h-11 px-3.5 rounded-xl border border-gray-200 bg-gray-50 text-sm text-gray-400"
                      />
                      <span className="text-xs text-gray-400 mt-1 block">
                        Your email can&apos;t be changed here.
                      </span>
                    </div>

                    <SaveButton
                      loading={profileLoading}
                      disabled={!profileFormik.dirty}
                      label="Save changes"
                    />
                  </motion.form>
                )}

                {tab === "security" && (
                  <motion.div
                    key="security"
                    initial={{ opacity: 0, x: 12 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -12 }}
                    transition={{ duration: 0.2 }}
                    className="space-y-8"
                  >
                    <form onSubmit={passwordFormik.handleSubmit} className="space-y-5">
                      <PasswordField
                        id="oldPassword"
                        label="Current password"
                        value={passwordFormik.values.oldPassword}
                        onChange={passwordFormik.handleChange}
                        show={showOld}
                        onToggle={() => setShowOld((v) => !v)}
                        error={
                          passwordFormik.touched.oldPassword
                            ? passwordFormik.errors.oldPassword
                            : undefined
                        }
                      />
                      <PasswordField
                        id="newPassword"
                        label="New password"
                        value={passwordFormik.values.newPassword}
                        onChange={passwordFormik.handleChange}
                        show={showNew}
                        onToggle={() => setShowNew((v) => !v)}
                        error={
                          passwordFormik.touched.newPassword
                            ? passwordFormik.errors.newPassword
                            : undefined
                        }
                      />

                      <SaveButton
                        loading={passwordLoading}
                        disabled={!passwordFormik.dirty}
                        label="Update password"
                      />
                    </form>

                    {/* Two-factor authentication */}
                    <div className="flex items-start justify-between gap-4 rounded-2xl border border-gray-100 bg-gray-50/60 p-4">
                      <div className="flex items-start gap-3">
                        <div className="flex size-9 items-center justify-center rounded-xl bg-fuchsia-50 text-fuchsia-600 shrink-0">
                          <Lock size={16} />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="text-sm font-semibold text-gray-800">
                              Two-factor authentication
                            </p>
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-gray-200 text-gray-500">
                              Coming soon
                            </span>
                          </div>
                          <p className="text-xs text-gray-500 mt-0.5">
                            Add an extra layer of security when you sign in.
                          </p>
                        </div>
                      </div>
                      <Switch checked={false} onChange={() => {}} disabled />
                    </div>

                    {/* Danger zone */}
                    <div className="rounded-2xl border border-red-100 bg-red-50/50 p-4">
                      <div className="flex items-start gap-3">
                        <div className="flex size-9 items-center justify-center rounded-xl bg-red-100 text-red-600 shrink-0">
                          <AlertTriangle size={16} />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-semibold text-red-700">
                            Delete account
                          </p>
                          <p className="text-xs text-red-500/80 mt-0.5">
                            This permanently removes your data. Reach out to
                            support to start the process.
                          </p>
                          <button
                            type="button"
                            onClick={() =>
                              (window.location.href =
                                "mailto:support@example.com?subject=Delete%20my%20account")
                            }
                            className="mt-3 h-9 px-4 rounded-lg text-xs font-semibold text-red-700 border border-red-200 bg-white hover:bg-red-50 transition-colors"
                          >
                            Contact support
                          </button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {tab === "preferences" && <PreferencesPanel />}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

function capitalize(value: string) {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

function OverviewRow({
  icon: Icon,
  label,
  value,
  valueClassName,
}: {
  icon: React.ComponentType<{ size?: number; className?: string }>;
  label: string;
  value: string;
  valueClassName?: string;
}) {
  return (
    <li className="flex items-center justify-between gap-3">
      <span className="flex items-center gap-2 text-sm text-gray-500">
        <Icon size={15} className="text-fuchsia-500" />
        {label}
      </span>
      <span className={`text-sm font-semibold text-gray-800 ${valueClassName || ""}`}>
        {value}
      </span>
    </li>
  );
}

function Switch({
  checked,
  onChange,
  disabled,
}: {
  checked: boolean;
  onChange: () => void;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      disabled={disabled}
      onClick={onChange}
      className={`relative h-6 w-11 rounded-full shrink-0 transition-colors ${
        checked ? "bg-linear-to-r from-pink-500 to-fuchsia-600" : "bg-gray-200"
      } ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
    >
      <motion.span
        layout
        className="absolute top-0.5 left-0.5 size-5 rounded-full bg-white shadow"
        animate={{ x: checked ? 20 : 0 }}
        transition={{ type: "spring", stiffness: 500, damping: 30 }}
      />
    </button>
  );
}

function PreferencesPanel() {
  // Local-only for now — wire these up to a real preferences mutation
  // once the backend exposes one.
  const [emailNotifs, setEmailNotifs] = useState(true);
  const [marketingEmails, setMarketingEmails] = useState(false);
  const [saving, setSaving] = useState(false);
  const [dirty, setDirty] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    await new Promise((r) => setTimeout(r, 500));
    setSaving(false);
    setDirty(false);
    toast.success("Preferences saved");
  };

  return (
    <motion.div
      key="preferences"
      initial={{ opacity: 0, x: 12 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -12 }}
      transition={{ duration: 0.2 }}
      className="space-y-5"
    >
      <PreferenceRow
        icon={Bell}
        title="Email notifications"
        description="Get notified about activity on your account."
        checked={emailNotifs}
        onChange={() => {
          setEmailNotifs((v) => !v);
          setDirty(true);
        }}
      />
      <PreferenceRow
        icon={Megaphone}
        title="Product updates & offers"
        description="Occasional emails about new features and offers."
        checked={marketingEmails}
        onChange={() => {
          setMarketingEmails((v) => !v);
          setDirty(true);
        }}
      />

      <SaveButton loading={saving} disabled={!dirty} label="Save preferences" onClick={handleSave} />
    </motion.div>
  );
}

function PreferenceRow({
  icon: Icon,
  title,
  description,
  checked,
  onChange,
}: {
  icon: React.ComponentType<{ size?: number; className?: string }>;
  title: string;
  description: string;
  checked: boolean;
  onChange: () => void;
}) {
  return (
    <div className="flex items-start justify-between gap-4 rounded-2xl border border-gray-100 bg-gray-50/60 p-4">
      <div className="flex items-start gap-3">
        <div className="flex size-9 items-center justify-center rounded-xl bg-fuchsia-50 text-fuchsia-600 shrink-0">
          <Icon size={16} />
        </div>
        <div>
          <p className="text-sm font-semibold text-gray-800">{title}</p>
          <p className="text-xs text-gray-500 mt-0.5">{description}</p>
        </div>
      </div>
      <Switch checked={checked} onChange={onChange} />
    </div>
  );
}

function SaveButton({
  loading,
  disabled,
  label,
  onClick,
}: {
  loading: boolean;
  disabled: boolean;
  label: string;
  onClick?: () => void;
}) {
  return (
    <motion.button
      type={onClick ? "button" : "submit"}
      onClick={onClick}
      disabled={loading || disabled}
      whileTap={{ scale: 0.98 }}
      className="h-11 px-6 rounded-xl text-white text-sm font-semibold bg-linear-to-r from-pink-500 via-fuchsia-600 to-purple-600 hover:brightness-110 transition-all shadow-lg shadow-fuchsia-500/30 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
    >
      <AnimatePresence mode="wait" initial={false}>
        {loading ? (
          <motion.span
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex items-center gap-2"
          >
            <Loader2 size={16} className="animate-spin" />
            Saving...
          </motion.span>
        ) : (
          <motion.span
            key="idle"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex items-center gap-2"
          >
            <Check size={16} />
            {label}
          </motion.span>
        )}
      </AnimatePresence>
    </motion.button>
  );
}

function PasswordField({
  id,
  label,
  value,
  onChange,
  show,
  onToggle,
  error,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<any>) => void;
  show: boolean;
  onToggle: () => void;
  error?: string;
}) {
  return (
    <div>
      <label
        htmlFor={id}
        className="text-sm font-medium text-gray-700 mb-1.5 block"
      >
        {label}
      </label>
      <div className="relative">
        <input
          id={id}
          name={id}
          type={show ? "text" : "password"}
          value={value}
          onChange={onChange}
          placeholder="••••••••"
          className={`w-full h-11 px-3.5 pr-10 rounded-xl border text-sm text-gray-900 outline-none transition focus:ring-2 focus:ring-fuchsia-500/40 focus:border-fuchsia-500 ${
            error ? "border-red-400" : "border-gray-200"
          }`}
        />
        <button
          type="button"
          onClick={onToggle}
          aria-label={show ? "Hide password" : "Show password"}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition"
        >
          {show ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      </div>
      {error && <span className="text-red-500 text-xs mt-1 block">{error}</span>}
    </div>
  );
}