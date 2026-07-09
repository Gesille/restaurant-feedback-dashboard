/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";

export type Role = "HR Admin" | "Client Success" | "Owner";

export type StoredUser = {
  id: string;
  name: string;
  email: string;
  password: string; // demo only — never store plaintext passwords in production
  role: Role;
  verified: boolean;
};

export type PublicUser = Omit<StoredUser, "password">;

type PendingVerification = {
  email: string;
  code: string;
  expiresAt: number;
};

type AuthContextValue = {
  user: PublicUser | null;
  isLoading: boolean;
  pending: PendingVerification | null;
  register: (input: { name: string; email: string; password: string; role: Role }) => { ok: boolean; error?: string };
  login: (input: { email: string; password: string }) => { ok: boolean; error?: string };
  verifyEmail: (code: string) => { ok: boolean; error?: string };
  resendCode: () => void;
  logout: () => void;
  updateProfile: (input: { name?: string; role?: Role }) => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

const USERS_KEY = "qrsuite:users";
const SESSION_KEY = "qrsuite:session";
const PENDING_KEY = "qrsuite:pending";

function readUsers(): StoredUser[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(USERS_KEY) ?? "[]");
  } catch {
    return [];
  }
}

function writeUsers(users: StoredUser[]) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

function generateCode() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

function toPublic(u: StoredUser): PublicUser {
  const { password, ...rest } = u;
  return rest;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<PublicUser | null>(null);
  const [pending, setPending] = useState<PendingVerification | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const sessionEmail = localStorage.getItem(SESSION_KEY);
    if (sessionEmail) {
      const found = readUsers().find((u) => u.email === sessionEmail);
      if (found) setUser(toPublic(found));
    }
    const rawPending = localStorage.getItem(PENDING_KEY);
    if (rawPending) {
      try {
        setPending(JSON.parse(rawPending));
      } catch {
        // ignore malformed pending state
      }
    }
    setIsLoading(false);
  }, []);

  const register: AuthContextValue["register"] = ({ name, email, password, role }) => {
    const users = readUsers();
    if (users.some((u) => u.email.toLowerCase() === email.toLowerCase())) {
      return { ok: false, error: "An account with that email already exists." };
    }
    const newUser: StoredUser = {
      id: crypto.randomUUID(),
      name,
      email,
      password,
      role,
      verified: false,
    };
    writeUsers([...users, newUser]);

    const verification: PendingVerification = {
      email,
      code: generateCode(),
      expiresAt: Date.now() + 10 * 60 * 1000,
    };
    localStorage.setItem(PENDING_KEY, JSON.stringify(verification));
    setPending(verification);
    return { ok: true };
  };

  const login: AuthContextValue["login"] = ({ email, password }) => {
    const users = readUsers();
    const found = users.find((u) => u.email.toLowerCase() === email.toLowerCase());
    if (!found || found.password !== password) {
      return { ok: false, error: "Incorrect email or password." };
    }
    if (!found.verified) {
      const verification: PendingVerification = {
        email: found.email,
        code: generateCode(),
        expiresAt: Date.now() + 10 * 60 * 1000,
      };
      localStorage.setItem(PENDING_KEY, JSON.stringify(verification));
      setPending(verification);
      return { ok: false, error: "Please verify your email first — we've sent a new code." };
    }
    localStorage.setItem(SESSION_KEY, found.email);
    setUser(toPublic(found));
    return { ok: true };
  };

  const verifyEmail: AuthContextValue["verifyEmail"] = (code) => {
    if (!pending) return { ok: false, error: "No verification in progress." };
    if (Date.now() > pending.expiresAt) return { ok: false, error: "This code has expired. Request a new one." };
    if (code.trim() !== pending.code) return { ok: false, error: "That code doesn't match." };

    const users = readUsers();
    const idx = users.findIndex((u) => u.email === pending.email);
    if (idx === -1) return { ok: false, error: "Account not found." };
    users[idx].verified = true;
    writeUsers(users);

    localStorage.removeItem(PENDING_KEY);
    setPending(null);
    localStorage.setItem(SESSION_KEY, users[idx].email);
    setUser(toPublic(users[idx]));
    return { ok: true };
  };

  const resendCode = () => {
    if (!pending) return;
    const verification: PendingVerification = {
      email: pending.email,
      code: generateCode(),
      expiresAt: Date.now() + 10 * 60 * 1000,
    };
    localStorage.setItem(PENDING_KEY, JSON.stringify(verification));
    setPending(verification);
  };

  const logout = () => {
    localStorage.removeItem(SESSION_KEY);
    setUser(null);
  };

  const updateProfile: AuthContextValue["updateProfile"] = (input) => {
    if (!user) return;
    const users = readUsers();
    const idx = users.findIndex((u) => u.email === user.email);
    if (idx === -1) return;
    users[idx] = { ...users[idx], ...input };
    writeUsers(users);
    setUser(toPublic(users[idx]));
  };

  const value = useMemo(
    () => ({ user, isLoading, pending, register, login, verifyEmail, resendCode, logout, updateProfile }),
    [user, isLoading, pending]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
}
