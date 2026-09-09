import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ChevronLeft,
  ArrowLeftRight,
  Delete,
  CreditCard,
  Check,
  Zap,
  ChevronRight,
  Building2,
  Wallet,
  Landmark,
} from "lucide-react";
import { useState } from "react";
import { PhoneFrame } from "@/components/PhoneFrame";
import { CHECKING_BALANCE, usd } from "@/lib/chime-data";

export const Route = createFileRoute("/transfer")({
  head: () => ({
    meta: [
      { title: "Transfer Money — Move Funds to Checking" },
      {
        name: "description",
        content:
          "Transfer money between a linked debit card and your checking account with a keypad amount entry, swap direction, and review step.",
      },
      { property: "og:title", content: "Transfer Money — Move Funds to Checking" },
      {
        property: "og:description",
        content:
          "Transfer money between a linked debit card and your checking account with a keypad amount entry, swap direction, and review step.",
      },
    ],
  }),
  component: TransferScreen,
});

type Account = {
  id: string;
  name: string;
  sub: string;
  kind: "chime" | "card" | "bank" | "wallet";
  group: "chime" | "linked";
  instant?: boolean;
  disabled?: boolean;
  detail?: string;
  chevron?: boolean;
};

const ACCOUNTS: Account[] = [
  { id: "checking", name: "Checking", sub: usd(CHECKING_BALANCE), kind: "chime", group: "chime" },
  { id: "savings", name: "Savings", sub: "$0.00", kind: "chime", group: "chime", chevron: true },
  {
    id: "sofi-debit",
    name: "Sofi Bank  N A Debit card",
    sub: "Ending in 7109",
    kind: "card",
    group: "linked",
    instant: true,
  },
  {
    id: "sofi-checking",
    name: "SoFi Checking",
    sub: "$716.06 as of 12 minutes ago",
    kind: "bank",
    group: "linked",
    disabled: true,
    detail: "Details",
  },
  {
    id: "capital-one",
    name: "Capital One Checking",
    sub: "$1,038.82 as of over 3 years ago",
    kind: "bank",
    group: "linked",
    disabled: true,
    detail: "Details",
  },
  {
    id: "apple-pay",
    name: "Apple Pay",
    sub: "Non-Chime debit cards only",
    kind: "wallet",
    group: "linked",
    instant: true,
  },
];

const ADD_ROWS = [
  { id: "add-bank", name: "Add a bank account", sub: "Transfer within 1-5 business days" },
  { id: "add-card", name: "Add a debit card", sub: "Transfer instantly" },
];

const acct = (id: string) => ACCOUNTS.find((a) => a.id === id)!;

function AccountIcon({ kind, active }: { kind: Account["kind"]; active?: boolean }) {
  if (kind === "chime")
    return (
      <span
        className={`grid size-8 shrink-0 place-items-center rounded-full text-xs font-bold ${
          active ? "bg-primary text-primary-foreground" : "bg-primary text-primary-foreground"
        }`}
      >
        C
      </span>
    );
  if (kind === "card")
    return (
      <span className="grid size-8 shrink-0 place-items-center rounded-full bg-surface-deep text-primary">
        <CreditCard className="size-4" />
      </span>
    );
  if (kind === "wallet")
    return (
      <span className="grid size-8 shrink-0 place-items-center rounded-md bg-foreground text-background">
        <Wallet className="size-4" />
      </span>
    );
  return (
    <span className="grid size-8 shrink-0 place-items-center rounded-full bg-surface-deep text-muted-foreground">
      <Building2 className="size-4" />
    </span>
  );
}

function AccountRow({ account, onSelect }: { account: Account; onSelect: () => void }) {
  return (
    <button
      disabled={account.disabled}
      onClick={onSelect}
      className={`flex w-full items-center gap-3 py-3 text-left ${
        account.disabled ? "opacity-45" : "active:opacity-60"
      }`}
    >
      <AccountIcon kind={account.kind} />
      <span className="flex-1">
        <span className="block text-sm font-semibold">{account.name}</span>
        <span className="block text-[11px] text-muted-foreground">{account.sub}</span>
      </span>
      {account.instant && (
        <span className="flex items-center gap-1 text-[11px] font-semibold text-foreground">
          <Zap className="size-3 fill-primary text-primary" />
          Instant
        </span>
      )}
      {account.detail && (
        <span className="text-[11px] font-semibold text-primary">{account.detail}</span>
      )}
      {account.chevron && <ChevronRight className="size-4 text-muted-foreground" />}
    </button>
  );
}

const keys = [
  ["1", ""],
  ["2", "ABC"],
  ["3", "DEF"],
  ["4", "GHI"],
  ["5", "JKL"],
  ["6", "MNO"],
  ["7", "PQRS"],
  ["8", "TUV"],
  ["9", "WXYZ"],
  [".", ""],
  ["0", ""],
] as const;

function TransferScreen() {
  const [amount, setAmount] = useState("0");
  const [fromId, setFromId] = useState("sofi-debit");
  const [toId, setToId] = useState("checking");
  const [picking, setPicking] = useState<null | "From" | "To">(null);
  const [reviewing, setReviewing] = useState(false);
  const [done, setDone] = useState(false);

  const from = acct(fromId);
  const to = acct(toId);
  const value = parseFloat(amount) || 0;

  // Instant transfers out to a debit card / wallet: $25 minimum, 1.75% fee
  const instantOut = from.kind === "chime" && (to.kind === "card" || to.kind === "wallet");
  const fee = instantOut ? Math.round(value * 0.0175 * 100) / 100 : 0;
  const belowMin = instantOut && value > 0 && value < 25;
  const canReview = value > 0 && !belowMin;

  const helper = instantOut
    ? value >= 25
      ? `1.75% fee updated to ${usd(fee)}`
      : "Transfers to debit cards have a $25 minimum"
    : null;

  const swap = () => {
    setFromId(toId);
    setToId(fromId);
  };

  const choose = (id: string) => {
    if (picking === "From") {
      if (id === toId) setToId(fromId);
      setFromId(id);
    } else {
      if (id === fromId) setFromId(toId);
      setToId(id);
    }
    setPicking(null);
  };

  const press = (k: string) => {
    setAmount((a) => {
      if (k === ".") return a.includes(".") ? a : `${a}.`;
      if (a === "0") return k;
      if (a.includes(".") && a.split(".")[1]!.length >= 2) return a;
      return a.length >= 7 ? a : a + k;
    });
  };

  const back = () =>
    setAmount((a) => {
      const next = a.slice(0, -1);
      return next === "" ? "0" : next;
    });

  return (
    <PhoneFrame>
      <div className="flex flex-1 flex-col overflow-hidden">
        <div className="relative flex items-center justify-center px-5 pt-5">
          <Link to="/checking" aria-label="Back" className="absolute left-5 active:opacity-60">
            <ChevronLeft className="size-7" strokeWidth={2} />
          </Link>
          <h1 className="text-base font-semibold">Transfer money</h1>
        </div>

        <div className="flex flex-1 flex-col justify-between overflow-y-auto">
          <div className="mt-8 flex items-start justify-center">
            <span className="mt-3 font-display text-2xl font-bold">$</span>
            <span className="font-display text-6xl font-extrabold tracking-tight">{amount}</span>
            <span className="ml-0.5 mt-2 h-12 w-0.5 animate-pulse bg-primary" />
          </div>

          {helper && (
            <p className="mt-3 px-8 text-center text-xs text-muted-foreground">{helper}</p>
          )}


          <div className="mt-10 grid grid-cols-[1fr_auto_1fr] items-start gap-3 px-6">
            <button onClick={() => setPicking("From")} className="text-center active:opacity-60">
              <p className="text-[11px] font-semibold text-muted-foreground">From</p>
              <span className="mx-auto mt-2 block w-fit">
                <AccountIcon kind={from.kind} />
              </span>
              <p className="mt-2 text-xs font-semibold leading-snug">{from.name}</p>
              <p className="mt-1 text-[11px] text-muted-foreground">{from.sub}</p>
            </button>

            <button
              aria-label="Swap accounts"
              onClick={swap}
              className="mt-10 grid size-8 place-items-center rounded-full active:opacity-60"
            >
              <ArrowLeftRight className="size-4 text-muted-foreground" />
            </button>

            <button onClick={() => setPicking("To")} className="text-center active:opacity-60">
              <p className="text-[11px] font-semibold text-muted-foreground">To</p>
              <span className="mx-auto mt-2 block w-fit">
                <AccountIcon kind={to.kind} />
              </span>
              <p className="mt-2 text-xs font-semibold leading-snug">{to.name}</p>
              <p className="mt-1 text-[11px] text-muted-foreground">{to.sub}</p>
            </button>
          </div>

          <div className="mt-8 px-6">
            <button
              disabled={!canReview}
              onClick={() => setReviewing(true)}
              className={`w-full rounded-full py-3.5 text-sm font-semibold transition-colors ${
                canReview
                  ? "bg-primary text-primary-foreground active:opacity-80"
                  : "bg-primary/25 text-foreground/50"
              }`}
            >
              Review
            </button>
          </div>

          <div className="mt-6 grid grid-cols-3 gap-2 bg-surface-deep/40 px-2 pb-6 pt-3">
            {keys.map(([k, sub]) => (
              <button
                key={k}
                onClick={() => press(k)}
                className="rounded-lg bg-secondary py-2.5 active:opacity-60"
              >
                <span className="block font-display text-2xl font-medium">{k}</span>
                {sub && (
                  <span className="block text-[9px] tracking-widest text-muted-foreground">{sub}</span>
                )}
              </button>
            ))}
            <button onClick={back} aria-label="Delete" className="grid place-items-center active:opacity-60">
              <Delete className="size-6" />
            </button>
          </div>
        </div>
      </div>

      {picking && (
        <div className="absolute inset-0 z-20 flex flex-col justify-end">
          <button
            aria-label="Close"
            onClick={() => setPicking(null)}
            className="absolute inset-0 bg-black/60"
          />
          <div className="relative flex max-h-[88%] flex-col rounded-t-3xl bg-card pb-6">
            <div className="mx-auto mt-3 h-1 w-10 rounded-full bg-muted-foreground/40" />
            <h2 className="px-6 pt-5 font-display text-2xl font-bold">{picking}</h2>

            <div className="mt-4 flex-1 overflow-y-auto px-6 pb-2">
              <p className="text-xs font-semibold text-muted-foreground">Chime accounts</p>
              <div className="mt-2">
                {ACCOUNTS.filter((a) => a.group === "chime").map((a) => (
                  <AccountRow key={a.id} account={a} onSelect={() => choose(a.id)} />
                ))}
              </div>

              <p className="mt-5 text-xs font-semibold text-muted-foreground">Linked accounts</p>
              <div className="mt-2">
                {ACCOUNTS.filter((a) => a.group === "linked").map((a) => (
                  <AccountRow key={a.id} account={a} onSelect={() => choose(a.id)} />
                ))}
                {ADD_ROWS.map((r) => (
                  <button
                    key={r.id}
                    onClick={() => setPicking(null)}
                    className="flex w-full items-center gap-3 py-3 text-left active:opacity-60"
                  >
                    <span className="grid size-8 shrink-0 place-items-center rounded-full bg-surface-deep text-foreground">
                      <Landmark className="size-4" />
                    </span>
                    <span className="flex-1">
                      <span className="block text-sm font-semibold">{r.name}</span>
                      <span className="block text-[11px] text-muted-foreground">{r.sub}</span>
                    </span>
                    <ChevronRight className="size-4 text-muted-foreground" />
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {reviewing && !done && (
        <div className="absolute inset-0 z-20 flex flex-col justify-end">
          <button aria-label="Close" onClick={() => setReviewing(false)} className="absolute inset-0 bg-black/60" />
          <div className="relative rounded-t-3xl bg-card px-6 pb-10 pt-6">
            <h2 className="font-display text-2xl font-bold">Review transfer</h2>
            <div className="mt-5 space-y-3 border-t border-border pt-5 text-sm">
              {[
                ["Amount", usd(value)],
                ["From", from.name],
                ["To", to.name],
                ["Arrives", instantOut ? "Instantly" : "In up to 5 business days"],
                ["Fee", usd(fee)],
                ["Total", usd(value + fee)],
              ].map(([k, v]) => (
                <div key={k} className="flex justify-between gap-4">
                  <span className="text-muted-foreground">{k}</span>
                  <span className="text-right font-medium">{v}</span>
                </div>
              ))}
            </div>
            <button
              onClick={() => setDone(true)}
              className="mt-7 w-full rounded-full bg-primary py-3.5 text-sm font-semibold text-primary-foreground active:opacity-80"
            >
              Transfer {usd(value)}
            </button>
            <button
              onClick={() => setReviewing(false)}
              className="mt-3 w-full py-2 text-sm font-semibold text-muted-foreground active:opacity-60"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {done && (
        <div className="absolute inset-0 z-30 flex flex-col items-center justify-center bg-background px-8 text-center">
          <span className="grid size-16 place-items-center rounded-full bg-primary text-primary-foreground">
            <Check className="size-8" strokeWidth={3} />
          </span>
          <h2 className="mt-6 font-display text-3xl font-extrabold">
            {instantOut ? "Transfer sent" : "Transfer started"}
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            {usd(value)} from {from.name} to {to.name}
            {instantOut ? ` · ${usd(fee)} fee` : ""}.
          </p>
          <Link
            to="/checking"
            className="mt-8 w-full rounded-full bg-primary py-3.5 text-sm font-semibold text-primary-foreground active:opacity-80"
          >
            Done
          </Link>
        </div>
      )}
    </PhoneFrame>
  );
}
