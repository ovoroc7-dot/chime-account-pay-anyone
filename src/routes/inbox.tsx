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

function InboxScreen() {
  const router = useRouter();
  const notes = useNotes();
  const unread = notes.filter((n) => !n.read).length;
  const [undoable, setUndoable] = useState(false);

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
          onClick={() => {
            markAllRead();
            setUndoable(true);
          }}
          disabled={unread === 0}
          className="text-sm font-semibold text-primary disabled:text-muted-foreground"
        >
          Mark all read
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-5 pb-8 pt-2">
        <div className="flex items-baseline gap-2">
          <h1 className="font-display text-3xl font-extrabold tracking-tight">Inbox</h1>
          {unread > 0 && (
            <span className="rounded-full bg-primary px-2 py-0.5 text-[11px] font-bold text-primary-foreground">
              {unread} new
            </span>
          )}
        </div>

        <div className="mt-6 space-y-7">
          {notes.map((n) => (
            <button
              key={n.id}
              onClick={() => {
                markRead(n.id);
                setUndoable(false);
              }}
              className="flex w-full gap-2 text-left active:opacity-70"
            >
              <span
                aria-hidden="true"
                className={`mt-1.5 size-1.5 shrink-0 rounded-full ${
                  n.read ? "bg-transparent" : "bg-primary"
                }`}
              />
              <span className={`flex-1 ${n.read ? "opacity-60" : ""}`}>
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

      {undoable && unread === 0 && (
        <div className="border-t border-border bg-secondary/60 px-5 py-4">
          <p className="text-sm font-semibold">All notifications read</p>
          <button
            onClick={() => {
              undoLast();
              setUndoable(false);
            }}
            className="mt-1 text-xs text-muted-foreground active:opacity-70"
          >
            Undo ›
          </button>
        </div>
      )}
    </PhoneFrame>
  );
}
