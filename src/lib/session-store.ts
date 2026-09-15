import { useEffect, useState } from "react";
import { useNavigate } from "@tanstack/react-router";

const KEY = "chime-session-v1";

export type Session = { signedIn: boolean; identifier: string; name: string };

const EMPTY: Session = { signedIn: false, identifier: "", name: "" };

const listeners = new Set<(s: Session) => void>();
let cached: Session | null = null;

function read(): Session {
  if (typeof window === "undefined") return EMPTY;
  if (cached) return cached;
  try {
    const raw = window.localStorage.getItem(KEY);
    cached = raw ? { ...EMPTY, ...(JSON.parse(raw) as Partial<Session>) } : EMPTY;
  } catch {
    cached = EMPTY;
  }
  return cached;
}

function write(next: Session) {
  cached = next;
  if (typeof window !== "undefined") {
    window.localStorage.setItem(KEY, JSON.stringify(next));
  }
  listeners.forEach((l) => l(next));
}

export function getSession(): Session {
  return read();
}

/** The demo account this app always accepts at log in. */
export const ACCOUNT = {
  email: "denistruffin123@gmail.com",
  password: "Denis123$",
  name: "Denis Truffin",
};

const ACCOUNTS_KEY = "chime-accounts-v1";

export type Account = { email: string; password: string; name: string };

function readAccounts(): Account[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(ACCOUNTS_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? (parsed as Account[]) : [];
  } catch {
    return [];
  }
}

/** Stores the credentials created at sign up so the user can log back in. */
export function registerAccount(email: string, password: string, name: string) {
  const clean: Account = { email: email.trim().toLowerCase(), password, name: name.trim() };
  const next = [...readAccounts().filter((a) => a.email !== clean.email), clean];
  if (typeof window !== "undefined") {
    window.localStorage.setItem(ACCOUNTS_KEY, JSON.stringify(next));
  }
  return clean;
}

/** Returns the matching account (demo or signed-up), or null. */
export function findAccount(identifier: string, password: string): Account | null {
  const email = identifier.trim().toLowerCase();
  if (email === ACCOUNT.email && password === ACCOUNT.password) return { ...ACCOUNT };
  return readAccounts().find((a) => a.email === email && a.password === password) ?? null;
}

/** Case-insensitive email match, exact password match. */
export function verifyCredentials(identifier: string, password: string) {
  return findAccount(identifier, password) !== null;
}

export function signIn(identifier: string, name = "Lekan Taiwo") {
  write({ signedIn: true, identifier, name });
}


export function signOut() {
  write(EMPTY);
}

export function useSession(): Session {
  const [state, setState] = useState<Session>(EMPTY);

  useEffect(() => {
    setState(read());
    const l = (s: Session) => setState(s);
    listeners.add(l);
    return () => {
      listeners.delete(l);
    };
  }, []);

  return state;
}

/** Redirects to the welcome screen when there is no signed-in session. */
export function useRequireSession() {
  const navigate = useNavigate();

  useEffect(() => {
    if (!read().signedIn) {
      navigate({ to: "/welcome", replace: true });
    }
  }, [navigate]);
}
