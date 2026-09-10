import { useSyncExternalStore } from "react";
import { savingsGoals, type SavingsGoal } from "./chime-data";

export type Goal = SavingsGoal & { target?: number };

const KEY = "chime-goals-v1";

const seed: Goal[] = savingsGoals.map((g) => ({
  ...g,
  emoji: g.id === "emergency" ? "☔" : g.emoji,
  ...(g.id === "emergency" ? { target: 1500 } : {}),
}));

let goals: Goal[] = seed;
let hydrated = false;

const listeners = new Set<() => void>();
const emit = () => listeners.forEach((l) => l());

function persist() {
  try {
    localStorage.setItem(KEY, JSON.stringify(goals));
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
    const parsed = JSON.parse(raw) as Goal[];
    if (!Array.isArray(parsed) || parsed.length === 0) return;
    goals = parsed;
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

const snapshot = () => goals;

export function useGoals() {
  return useSyncExternalStore(subscribe, snapshot, () => seed);
}

const round = (n: number) => Math.round(n * 100) / 100;

/** Adds (or removes, with a negative delta) money inside one savings goal. */
export function adjustGoal(id: string, delta: number) {
  goals = goals.map((g) => (g.id === id ? { ...g, amount: round(g.amount + delta) } : g));
  persist();
  emit();
}

/** Moves money between two savings goals; the savings total stays the same. */
export function moveBetweenGoals(fromId: string, toId: string, amount: number) {
  goals = goals.map((g) =>
    g.id === fromId
      ? { ...g, amount: round(g.amount - amount) }
      : g.id === toId
        ? { ...g, amount: round(g.amount + amount) }
        : g,
  );
  persist();
  emit();
}

export function defaultGoalId() {
  return (goals.find((g) => g.isDefault) ?? goals[0])?.id ?? "my-savings";
}

export function useGoal(id: string) {
  return useGoals().find((g) => g.id === id);
}

export function addGoal(g: Omit<Goal, "id"> & { id?: string }) {
  const id =
    g.id ?? `${g.name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-${goals.length + 1}`;
  goals = [...goals, { ...g, id }];
  emit();
  return id;
}

export function updateGoal(id: string, patch: Partial<Goal>) {
  goals = goals.map((g) => (g.id === id ? { ...g, ...patch } : g));
  emit();
}

export function deleteGoal(id: string) {
  goals = goals.filter((g) => g.id !== id);
  emit();
}

export const GOAL_CATEGORIES: { name: string; emoji: string }[] = [
  { name: "Emergency fund", emoji: "☔" },
  { name: "Travel", emoji: "🌴" },
  { name: "Gifts", emoji: "🎁" },
  { name: "Home", emoji: "🏡" },
  { name: "Car", emoji: "🚗" },
  { name: "Pay off debt", emoji: "💸" },
  { name: "Childcare expenses", emoji: "🍼" },
  { name: "Rent", emoji: "🏠" },
  { name: "Bills", emoji: "🧾" },
  { name: "Groceries", emoji: "🛒" },
  { name: "Gas", emoji: "⛽" },
  { name: "Other", emoji: "💰" },
];
