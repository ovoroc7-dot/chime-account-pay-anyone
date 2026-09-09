import { useSyncExternalStore } from "react";
import { savingsGoals, type SavingsGoal } from "./chime-data";

export type Goal = SavingsGoal & { target?: number };

let goals: Goal[] = savingsGoals.map((g) => ({
  ...g,
  emoji: g.id === "emergency" ? "☔" : g.emoji,
  ...(g.id === "emergency" ? { target: 1500 } : {}),
}));

const listeners = new Set<() => void>();
const emit = () => listeners.forEach((l) => l());

function subscribe(cb: () => void) {
  listeners.add(cb);
  return () => listeners.delete(cb);
}

const snapshot = () => goals;

export function useGoals() {
  return useSyncExternalStore(subscribe, snapshot, snapshot);
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
