import { createFileRoute, useRouter } from "@tanstack/react-router";
import { ChevronLeft, AlertCircle, MoreHorizontal, Landmark, CreditCard } from "lucide-react";
import { useState } from "react";
import { PhoneFrame } from "@/components/PhoneFrame";

export const Route = createFileRoute("/linked-accounts")({
  head: () => ({
    meta: [
      { title: "Linked Accounts — Banks and Debit Cards" },
      {
        name: "description",
        content:
          "See linked banks and debit cards, check sync status, re-link out-of-sync accounts or link a new account.",
      },
      { property: "og:title", content: "Linked Accounts — Banks and Debit Cards" },
      {
        property: "og:description",
        content: "See linked banks and debit cards, re-link out-of-sync accounts or link a new one.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: LinkedAccountsScreen,
});

type Linked = {
  id: string;
  name: string;
  mask: string;
  sub: string;
  kind: "bank" | "card";
  outOfSync?: boolean;
};

const initial: Linked[] = [
  { id: "sofi", name: "SoFi Checking", mask: "••••7129", sub: "Synced 31 minutes ago", kind: "bank" },
  { id: "cap1", name: "Capital One Checking", mask: "•••", sub: "Out of sync", kind: "bank", outOfSync: true },
  { id: "sofi-debit", name: "Sofi Bank  N A Debit card", mask: "••••7109", sub: "", kind: "card" },
];

function LinkedAccountsScreen() {
  const router = useRouter();
  const [accounts, setAccounts] = useState(initial);
  const [sheet, setSheet] = useState<Linked | null>(null);

  return (
    <PhoneFrame>
      <div className="flex items-center px-4 pt-5">
        <button
          aria-label="Back"
          onClick={() => router.navigate({ to: "/move" })}
          className="active:opacity-60"
        >
          <ChevronLeft className="size-7" strokeWidth={2} />
        </button>
        <h1 className="flex-1 pr-7 text-center font-display text-base font-bold">Linked accounts</h1>
      </div>

      <div className="flex-1 overflow-y-auto px-5 pt-6">
        <ul className="space-y-6">
          {accounts.map((a) => (
            <li key={a.id} className="flex items-center gap-3">
              <span className="grid size-9 shrink-0 place-items-center rounded-full bg-card text-foreground/80">
                {a.kind === "bank" ? <Landmark className="size-4" /> : <CreditCard className="size-4" />}
              </span>
              <span className="flex-1">
                <span className="block text-[15px] font-semibold">{a.name}</span>
                <span className="block text-xs text-muted-foreground">{a.mask}</span>
                {a.sub && <span className="block text-[11px] text-muted-foreground">{a.sub}</span>}
              </span>
              {a.outOfSync && (
                <button
                  type="button"
                  onClick={() =>
                    setAccounts((list) =>
                      list.map((x) =>
                        x.id === a.id ? { ...x, outOfSync: false, sub: "Synced just now" } : x,
                      ),
                    )
                  }
                  className="text-xs font-semibold text-[#ff6b81] active:opacity-70"
                >
                  Re-link
                </button>
              )}
              {a.outOfSync && <AlertCircle className="size-4 text-muted-foreground" />}
              <button
                type="button"
                aria-label={`Options for ${a.name}`}
                onClick={() => setSheet(a)}
                className="active:opacity-60"
              >
                <MoreHorizontal className="size-5 text-muted-foreground" />
              </button>
            </li>
          ))}
        </ul>
      </div>

      <div className="px-5 pb-8">
        <button
          type="button"
          className="w-full rounded-full bg-primary py-3.5 text-sm font-semibold text-primary-foreground active:opacity-80"
        >
          Link a new account
        </button>
      </div>

      {sheet && (
        <div className="absolute inset-0 z-30 flex flex-col justify-end bg-black/60" onClick={() => setSheet(null)}>
          <div className="rounded-t-3xl bg-popover px-5 pb-8 pt-4" onClick={(e) => e.stopPropagation()}>
            <span className="mx-auto mb-4 block h-1 w-10 rounded-full bg-muted-foreground/40" />
            <h2 className="font-display text-lg font-bold">{sheet.name}</h2>
            <button
              type="button"
              onClick={() => setSheet(null)}
              className="mt-5 block w-full text-left text-sm font-semibold active:opacity-70"
            >
              Re-sync account
            </button>
            <button
              type="button"
              onClick={() => {
                setAccounts((list) => list.filter((x) => x.id !== sheet.id));
                setSheet(null);
              }}
              className="mt-5 block w-full text-left text-sm font-semibold text-[#ff6b81] active:opacity-70"
            >
              Unlink account
            </button>
          </div>
        </div>
      )}
    </PhoneFrame>
  );
}
