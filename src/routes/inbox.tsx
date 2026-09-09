import { createFileRoute, useRouter } from "@tanstack/react-router";
import { ChevronLeft } from "lucide-react";
import { useState } from "react";
import { PhoneFrame } from "@/components/PhoneFrame";

export const Route = createFileRoute("/inbox")({
  head: () => ({
    meta: [
      { title: "Inbox — Account Alerts and Offers" },
      {
        name: "description",
        content:
          "Account inbox with cash back offers, direct deposit tips, balance alerts and card decline notices you can mark as read.",
      },
      { property: "og:title", content: "Inbox — Account Alerts and Offers" },
      {
        property: "og:description",
        content: "Cash back offers, deposit tips, balance alerts and card decline notices.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: InboxScreen,
});

type Note = { id: string; title: string; body: string; date: string; emoji?: string };

const NOTES: Note[] = [
  {
    id: "n1",
    title: "Get up to 5% cash back.",
    body: "Remember to activate this offer before you shop at Walgreens.",
    date: "Oct 26",
  },
  {
    id: "n2",
    title: "Up your $20.00 deposit just a bit",
    body: "Get even more out of Chime with a direct deposit of $200 or more. Let's up your deposit game!",
    date: "Sep 29",
  },
  {
    id: "n3",
    title: "Don't miss balance alerts",
    body: "Turn on notifications to track your spending, financial progress, updates, and exclusives.",
    date: "Jul 22",
  },
  {
    id: "n4",
    title: "Card declined, here's why…",
    body: "You tried to use your card at Cash App*Denis Trufin*A but it's been disabled. It's easy to fix! Tap Settings to enable your card.",
    date: "May 31",
    emoji: "🔒",
  },
  {
    id: "n5",
    title: "Card declined, here's why…",
    body: "You tried to use your card at Cash App*Playstation but it's been disabled. It's easy to fix! Tap Settings to enable your card.",
    date: "May 31",
    emoji: "🔒",
  },
];

function InboxScreen() {
  const router = useRouter();
  const [read, setRead] = useState<string[]>([]);
  const [allRead, setAllRead] = useState(false);

  const isRead = (id: string) => allRead || read.includes(id);

  return (
    <PhoneFrame>
      <div className="flex items-center justify-between px-4 pt-5">
        <button
          aria-label="Back"
          onClick={() => router.navigate({ to: "/" })}
          className="active:opacity-60"
        >
          <ChevronLeft className="size-7" strokeWidth={2} />
        </button>
        <button
          onClick={() => setAllRead(true)}
          disabled={allRead}
          className="text-sm font-semibold text-primary disabled:text-muted-foreground"
        >
          Mark all read
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-5 pb-8 pt-2">
        <h1 className="font-display text-3xl font-extrabold tracking-tight">Inbox</h1>

        <div className="mt-6 space-y-7">
          {NOTES.map((n) => (
            <button
              key={n.id}
              onClick={() => setRead((r) => (r.includes(n.id) ? r : [...r, n.id]))}
              className="flex w-full gap-2 text-left active:opacity-70"
            >
              <span
                aria-hidden="true"
                className={`mt-1.5 size-1.5 shrink-0 rounded-full ${
                  isRead(n.id) ? "bg-transparent" : "bg-primary"
                }`}
              />
              <span className={`flex-1 ${isRead(n.id) ? "opacity-60" : ""}`}>
                <span className="block text-sm font-semibold">
                  {n.title} {n.emoji}
                </span>
                <span className="mt-1 block text-xs leading-relaxed text-muted-foreground">
                  {n.body}
                </span>
                <span className="mt-1.5 block text-[11px] text-muted-foreground">{n.date}</span>
              </span>
            </button>
          ))}
        </div>
      </div>

      {allRead && (
        <div className="border-t border-border bg-secondary/60 px-5 py-4">
          <p className="text-sm font-semibold">All notifications read</p>
          <button
            onClick={() => setAllRead(false)}
            className="mt-1 text-xs text-muted-foreground active:opacity-70"
          >
            Undo ›
          </button>
        </div>
      )}
    </PhoneFrame>
  );
}
