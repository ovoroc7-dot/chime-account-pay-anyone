import { useSyncExternalStore } from "react";

export type PayActivity = {
  id: string;
  mode: "Pay" | "Request";
  name: string;
  tag: string;
  amount: number;
  note: string;
  method: string;
  methodSub: string;
  at: number;
};

const KEY = "chime-pay-activity-v1";

let state: PayActivity[] = [];
let hydrated = false;

const listeners = new Set<() => void>();
const emit = () => listeners.forEach((l) => l());
const EMPTY: PayActivity[] = [];

function persist() {
  try {
    localStorage.setItem(KEY, JSON.stringify(state));
  } catch {
    /* storage unavailable */
  }
}

function hydrate() {
  if (hydrated || typeof window === "undefined") return;
  hydrated = true;
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return;
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      state = parsed as PayActivity[];
      setTimeout(emit, 0);
    }
  } catch {
    /* ignore corrupt data */
  }
}

function subscribe(cb: () => void) {
  hydrate();
  listeners.add(cb);
  return () => listeners.delete(cb);
}

export function usePayActivity() {
  return useSyncExternalStore(
    subscribe,
    () => state,
    () => EMPTY,
  );
}

export function addPayActivity(a: Omit<PayActivity, "id" | "at">) {
  const entry: PayActivity = {
    ...a,
    id: `p-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    at: Date.now(),
  };
  state = [entry, ...state];
  persist();
  emit();
  return entry;
}

export function dayLabel(at: number) {
  const d = new Date(at);
  const today = new Date();
  const same =
    d.getFullYear() === today.getFullYear() &&
    d.getMonth() === today.getMonth() &&
    d.getDate() === today.getDate();
  if (same) return "Today";
  return d.toLocaleDateString("en-US", { month: "long", day: "numeric" });
}
