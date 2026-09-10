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

/** The account credentials this demo app accepts at log in. */
export const ACCOUNT = {
  email: "denistruffin123@gmail.com",
  password: "Denis123$",
  name: "Denis Truffin",
};

/** Case-insensitive email match, exact password match. */
export function verifyCredentials(identifier: string, password: string) {
  return (
    identifier.trim().toLowerCase() === ACCOUNT.email && password === ACCOUNT.password
  );
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
