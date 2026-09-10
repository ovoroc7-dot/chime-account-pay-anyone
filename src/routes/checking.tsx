import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ChevronLeft,
  Search,
  ArrowLeftRight,
  CreditCard,
  BarChart3,
  Copy,
  X,
  PiggyBank,
  Banknote,
} from "lucide-react";
import { useMemo, useState } from "react";
import { PhoneFrame } from "@/components/PhoneFrame";

import {
  ACCOUNT_NUMBER,
  CHECKING_BALANCE,
  ROUTING_NUMBER,
  groupByDate,
  money,
  transactions,
  type Txn,
} from "@/lib/chime-data";

export const Route = createFileRoute("/checking")({
  head: () => ({
    meta: [
      { title: "Checking Account — Balance & Transactions" },
      {
        name: "description",
        content:
          "Checking account detail with routing and account numbers, transfer and card actions, search, and date-grouped transaction history.",
      },
      { property: "og:title", content: "Checking Account — Balance & Transactions" },
      {
        property: "og:description",
        content:
          "Checking account detail with routing and account numbers, transfer and card actions, search, and date-grouped transaction history.",
      },
    ],
  }),
  component: CheckingScreen,
});

const actions = [
  { icon: ArrowLeftRight, label: "Transfer", to: "/transfer" as const },
  { icon: CreditCard, label: "Cards", to: "/cards" as const },
  { icon: BarChart3, label: "Insights", to: "/insights" as const },
];

function CheckingScreen() {
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<Txn | null>(null);
  const [copied, setCopied] = useState<string | null>(null);

  const groups = useMemo(() => {
    const q = query.trim().toLowerCase();
    return groupByDate(q ? transactions.filter((t) => t.title.toLowerCase().includes(q)) : transactions);
  }, [query]);

  const copy = async (label: string, value: string) => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(label);
      setTimeout(() => setCopied(null), 1500);
    } catch {
      /* clipboard unavailable */
    }
  };

  return (
    <PhoneFrame>
      <div className="flex-1 overflow-y-auto pb-10">
        <div className="px-6 pt-5">
          <Link to="/" aria-label="Back" className="inline-flex active:opacity-60">
            <ChevronLeft className="size-7" strokeWidth={2} />
          </Link>

          <h1 className="mt-5 flex items-center gap-2.5 font-display text-3xl font-extrabold tracking-tight">
            Checking
          </h1>
          <p className="font-display text-4xl font-extrabold tracking-tight">
            ${CHECKING_BALANCE.toFixed(2)}
          </p>

          <div className="mt-5 rounded-2xl bg-card p-4">
            {[
              { label: "Routing number", value: ROUTING_NUMBER },
              { label: "Account number", value: ACCOUNT_NUMBER },
            ].map((row) => (
              <div
                key={row.label}
                className="flex items-center justify-between border-border py-2 not-last:border-b"
              >
                <span className="text-xs text-muted-foreground">{row.label}</span>
                <button
                  onClick={() => copy(row.label, row.value)}
                  className="flex items-center gap-2 text-sm font-semibold active:opacity-60"
                >
                  {row.value}
                  <Copy className="size-3.5 text-primary" />
                </button>
              </div>
            ))}
            {copied && <p className="pt-2 text-xs text-primary">{copied} copied</p>}
          </div>

          <div className="mt-6 flex justify-between gap-3">
            {actions.map((a) => {
              const inner = (
                <>
                  <span className="grid h-16 w-full place-items-center rounded-2xl bg-surface-deep">
                    <a.icon className="size-6" strokeWidth={2} />
                  </span>
                  <span className="text-xs font-semibold">{a.label}</span>
                </>
              );
              const cls = "flex flex-1 flex-col items-center gap-2 active:opacity-70";
              return (
                <Link key={a.label} to={a.to} className={cls}>
                  {inner}
                </Link>
              );
            })}
          </div>
        </div>

        <div className="mt-8 px-6">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-2xl font-bold">Transactions</h2>
            <button
              aria-label="Search transactions"
              onClick={() => setSearchOpen((s) => !s)}
              className="grid size-9 place-items-center rounded-full bg-card active:opacity-70"
            >
              <Search className="size-4" strokeWidth={2.2} />
            </button>
          </div>

          {searchOpen && (
            <input
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search transactions"
              className="mt-4 w-full rounded-full bg-card px-4 py-3 text-sm outline-none placeholder:text-muted-foreground focus:ring-2 focus:ring-ring"
            />
          )}

          <div className="mt-6 space-y-6">
            {groups.map((g) => (
              <div key={g.date}>
                <p className="text-xs text-muted-foreground">{g.date}</p>
                <div className="mt-3 space-y-4">
                  {g.items.map((t) => (
                    <button
                      key={t.id}
                      onClick={() => setSelected(t)}
                      className="flex w-full items-start gap-3 text-left active:opacity-70"
                    >
                      <span className="mt-0.5 grid size-10 shrink-0 place-items-center rounded-full bg-surface-deep text-primary">
                        {t.kind === "deposit" ? (
                          <PiggyBank className="size-5" />
                        ) : (
                          <Banknote className="size-5" />
                        )}
                      </span>
                      <span className="flex-1">
                        <span className="block text-base font-semibold leading-snug">{t.title}</span>
                        <span className="mt-1 block text-xs text-muted-foreground">
                          {t.time} • {t.category}
                        </span>
                      </span>
                      <span
                        className={`text-base font-semibold ${
                          t.kind === "deposit" ? "text-primary" : "text-foreground"
                        }`}
                      >
                        {money(t.amount)}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            ))}
            {groups.length === 0 && (
              <p className="py-10 text-center text-sm text-muted-foreground">No transactions found</p>
            )}
          </div>
        </div>
      </div>

      {selected && <TxnSheet txn={selected} onClose={() => setSelected(null)} />}
    </PhoneFrame>
  );
}

function TxnSheet({ txn, onClose }: { txn: Txn; onClose: () => void }) {
  return (
    <div className="absolute inset-0 z-20 flex flex-col justify-end">
      <button aria-label="Close" onClick={onClose} className="absolute inset-0 bg-black/60" />
      <div className="relative rounded-t-3xl bg-card px-6 pb-10 pt-5">
        <div className="flex items-start justify-between">
          <span className="grid size-12 place-items-center rounded-full bg-surface-deep text-primary">
            {txn.kind === "deposit" ? <PiggyBank className="size-6" /> : <Banknote className="size-6" />}
          </span>
          <button onClick={onClose} aria-label="Close details" className="opacity-70">
            <X className="size-5" />
          </button>
        </div>
        <p
          className={`mt-4 font-display text-3xl font-extrabold ${
            txn.kind === "deposit" ? "text-primary" : "text-foreground"
          }`}
        >
          {money(txn.amount)}
        </p>
        <p className="mt-1 text-base font-semibold">{txn.title}</p>
        <div className="mt-5 space-y-3 border-t border-border pt-5 text-sm">
          {[
            ["Status", txn.status],
            ["Date", txn.date],
            ["Time", txn.time],
            ["Category", txn.category],
            ["Method", txn.method],
            ["Account", `Checking ${ACCOUNT_NUMBER}`],
          ].map(([k, v]) => (
            <div key={k} className="flex justify-between gap-4">
              <span className="text-muted-foreground">{k}</span>
              <span className="text-right font-medium">{v}</span>
            </div>
          ))}
        </div>
        <button
          onClick={onClose}
          className="mt-7 w-full rounded-full bg-primary py-3.5 text-sm font-semibold text-primary-foreground active:opacity-80"
        >
          Done
        </button>
      </div>
    </div>
  );
}
