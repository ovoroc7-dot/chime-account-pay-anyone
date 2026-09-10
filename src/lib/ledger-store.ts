import { useSyncExternalStore } from "react";
import {
  CHECKING_BALANCE,
  SAVINGS_BALANCE,
  transactions as seedTxns,
  type Txn,
} from "./chime-data";

export type Ledger = {
  checking: number;
  savings: number;
  txns: Txn[];
};

const KEY = "chime-ledger-v1";

const seed: Ledger = {
  checking: CHECKING_BALANCE,
  savings: SAVINGS_BALANCE,
  txns: seedTxns,
};

let state: Ledger = seed;
let hydrated = false;

const listeners = new Set<() => void>();
const emit = () => listeners.forEach((l) => l());

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
    const parsed = JSON.parse(raw) as Partial<Ledger>;
    if (typeof parsed.checking !== "number") return;
    state = {
      checking: parsed.checking,
      savings: typeof parsed.savings === "number" ? parsed.savings : seed.savings,
      txns: Array.isArray(parsed.txns) ? parsed.txns : seed.txns,
    };
    // Re-render after hydration so SSR markup and first client paint match.
    setTimeout(emit, 0);
  } catch {
    /* ignore corrupt data */
  }
}

function subscribe(cb: () => void) {
  hydrate();
  listeners.add(cb);
  return () => listeners.delete(cb);
}

const snapshot = () => state;

export function useLedger() {
  return useSyncExternalStore(subscribe, snapshot, () => seed);
}

export function useCheckingBalance() {
  return useLedger().checking;
}

const ORDINAL = (d: number) => {
  if (d > 3 && d < 21) return "th";
  return ["th", "st", "nd", "rd"][d % 10] ?? "th";
};

export function todayLabel(now = new Date()) {
  const weekday = now.toLocaleDateString("en-US", { weekday: "long" });
  const month = now.toLocaleDateString("en-US", { month: "long" });
  const day = now.getDate();
  return `${weekday}, ${month} ${day}${ORDINAL(day)}`;
}

export function timeLabel(now = new Date()) {
  return now.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
}

export function addTransaction(t: Omit<Txn, "id" | "date" | "time"> & Partial<Txn>) {
  const now = new Date();
  const txn: Txn = {
    id: `x-${now.getTime()}-${Math.random().toString(36).slice(2, 7)}`,
    date: todayLabel(now),
    time: timeLabel(now),
    ...t,
  } as Txn;
  state = { ...state, txns: [txn, ...state.txns] };
  persist();
  emit();
  return txn;
}

type MoveArgs = {
  /** Positive amount moved. */
  amount: number;
  /** Fee charged to checking on top of the amount. */
  fee?: number;
  /** Where the money comes from. */
  fromChime: "checking" | "savings" | null;
  /** Where the money lands. */
  toChime: "checking" | "savings" | null;
  /** Name of the outside account (bank / debit card) involved. */
  externalName: string;
  instant?: boolean;
};

/**
 * Applies a transfer to the balances and writes the matching history rows.
 * Everything is saved to the device so it survives a reload.
 */
export function applyTransfer({
  amount,
  fee = 0,
  fromChime,
  toChime,
  externalName,
  instant = false,
}: MoveArgs) {
  const next = { ...state };
  if (fromChime) next[fromChime] = Math.round((next[fromChime] - amount - fee) * 100) / 100;
  if (toChime) next[toChime] = Math.round((next[toChime] + amount) * 100) / 100;
  state = next;

  const method = instant ? "Instant transfer" : "ACH transfer";
  const status = instant ? "Completed" : "Pending";

  if (toChime === "checking") {
    addTransaction({
      title: `Transfer from ${externalName}`,
      category: "Deposit",
      amount,
      kind: "deposit",
      status,
      method,
    });
  } else if (fromChime === "checking") {
    addTransaction({
      title: `Transfer to ${externalName}`,
      category: "Transfer",
      amount: -amount,
      kind: "debit",
      status,
      method,
    });
    if (fee > 0) {
      addTransaction({
        title: "Instant transfer fee",
        category: "Fees",
        amount: -fee,
        kind: "debit",
        status: "Completed",
        method,
      });
    }
  } else {
    // persist balance-only moves (e.g. savings <-> linked account)
    persist();
    emit();
  }
}

/** Money sent out of Checking to a person (Pay Anyone). */
export function payOut(amount: number, recipient: string) {
  state = { ...state, checking: Math.round((state.checking - amount) * 100) / 100 };
  addTransaction({
    title: `Pay Anyone: ${recipient}`,
    category: "Financial services",
    amount: -amount,
    kind: "debit",
    status: "Completed",
    method: "Instant transfer",
  });
}

export function resetLedger() {
  state = seed;
  persist();
  emit();
}
