import { useSyncExternalStore } from "react";

export type Note = {
  id: string;
  title: string;
  body: string;
  date: string;
  emoji?: string;
  read: boolean;
};

const INITIAL: Note[] = [
  {
    id: "n1",
    title: "Get up to 5% cash back.",
    body: "Remember to activate this offer before you shop at Walgreens.",
    date: "Oct 26",
    read: false,
  },
  {
    id: "n2",
    title: "Up your $20.00 deposit just a bit",
    body: "Get even more out of Chime with a direct deposit of $200 or more. Let's up your deposit game!",
    date: "Sep 29",
    read: false,
  },
  {
    id: "n3",
    title: "Don't miss balance alerts",
    body: "Turn on notifications to track your spending, financial progress, updates, and exclusives.",
    date: "Jul 22",
    read: false,
  },
  {
    id: "n4",
    title: "Card declined, here's why…",
    body: "You tried to use your card at Cash App*Denis Trufin*A but it's been disabled. It's easy to fix! Tap Settings to enable your card.",
    date: "May 31",
    emoji: "🔒",
    read: false,
  },
  {
    id: "n5",
    title: "Card declined, here's why…",
    body: "You tried to use your card at Cash App*Playstation but it's been disabled. It's easy to fix! Tap Settings to enable your card.",
    date: "May 31",
    emoji: "🔒",
    read: false,
  },
];

let notes: Note[] = INITIAL;
let previous: Note[] | null = null;

const listeners = new Set<() => void>();
const emit = () => listeners.forEach((l) => l());

function subscribe(cb: () => void) {
  listeners.add(cb);
  return () => listeners.delete(cb);
}

const snapshot = () => notes;

export function useNotes() {
  return useSyncExternalStore(subscribe, snapshot, snapshot);
}

export function useUnreadCount() {
  return useNotes().filter((n) => !n.read).length;
}

export function markRead(id: string) {
  if (notes.every((n) => n.id !== id || n.read)) return;
  previous = notes;
  notes = notes.map((n) => (n.id === id ? { ...n, read: true } : n));
  emit();
}

export function markAllRead() {
  if (notes.every((n) => n.read)) return;
  previous = notes;
  notes = notes.map((n) => ({ ...n, read: true }));
  emit();
}

export function undoLast() {
  if (!previous) return;
  notes = previous;
  previous = null;
  emit();
}

export function addNote(note: Omit<Note, "read" | "id"> & { id?: string }) {
  const id = note.id ?? `n${Date.now()}`;
  notes = [{ ...note, id, read: false }, ...notes];
  emit();
  return id;
}
