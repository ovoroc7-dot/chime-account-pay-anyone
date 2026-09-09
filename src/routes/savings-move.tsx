import { createFileRoute, useRouter } from "@tanstack/react-router";
import { ChevronLeft, ChevronRight, ArrowLeftRight, Zap, Check } from "lucide-react";
import { useState } from "react";
import { PhoneFrame } from "@/components/PhoneFrame";
import { ChimeLogo } from "@/components/ChimeLogo";
import { CHECKING_BALANCE, savingsGoals, usd } from "@/lib/chime-data";

type Search = { dir?: "in" | "out" };

export const Route = createFileRoute("/savings-move")({
  validateSearch: (s: Record<string, unknown>): Search => ({
    dir: s["dir"] === "out" ? "out" : "in",
  }),
  head: () => ({
    meta: [
      { title: "Move Money to Savings — Add or Transfer Out" },
      {
        name: "description",
        content:
          "Move money between checking, linked accounts and savings goals with keypad amount entry and instant transfer options.",
      },
      { property: "og:title", content: "Move Money to Savings — Add or Transfer Out" },
      {
        property: "og:description",
        content:
          "Move money between checking, linked accounts and savings goals with keypad amount entry.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: SavingsMoveScreen,
});

type Acct = {
  id: string;
  name: string;
  sub: string;
  emoji: string;
  group: "chime" | "linked" | "goal";
  timing?: string;
  instant?: boolean;
  fee?: string;
  disabled?: boolean;
};

const SOURCES: Acct[] = [
  { id: "checking", name: "Checking", sub: usd(CHECKING_BALANCE), emoji: "🟢", group: "chime" },
  { id: "savings", name: "Savings", sub: "$0.00", emoji: "🟢", group: "chime" },
  {
    id: "sofi-debit",
    name: "Sofi Bank  N A Debit card",
    sub: "Ending in 7109",
    emoji: "💳",
    group: "linked",
    instant: true,
    fee: "1.75% fee",
  },
  {
    id: "sofi-checking",
    name: "SoFi Checking",
    sub: "$716.06 as of 19 minutes ago",
    emoji: "🏦",
    group: "linked",
    timing: "1-3 business days",
  },
  {
    id: "capital-one",
    name: "Capital One Checking",
    sub: "$1,038.82 as of over 3 years ago",
    emoji: "🏦",
    group: "linked",
    timing: "1-3 business days",
  },
  {
    id: "apple-pay",
    name: "Apple Pay",
    sub: "Non-Chime debit cards only",
    emoji: "",
    group: "linked",
    instant: true,
  },
];

const GOALS: Acct[] = savingsGoals.map((g) => ({
  id: g.id,
  name: g.name,
  sub: usd(g.amount),
  emoji: g.emoji,
  group: "goal",
  instant: true,
}));

function SavingsMoveScreen() {
  const router = useRouter();
  const { dir } = Route.useSearch();
  const [amount, setAmount] = useState("0");
  const [from, setFrom] = useState<Acct>(
    dir === "out" ? GOALS[0]! : SOURCES.find((a) => a.id === "checking")!,
  );
  const [to, setTo] = useState<Acct>(
    dir === "out" ? SOURCES.find((a) => a.id === "checking")! : GOALS[0]!,
  );
  const [picker, setPicker] = useState<null | "from" | "to">(null);
  const [done, setDone] = useState(false);

  const value = Number(amount) || 0;
  const press = (k: string) => {
    setAmount((a) => {
      if (k === "del") return a.length <= 1 ? "0" : a.slice(0, -1);
      if (k === "." ) return a.includes(".") ? a : a + ".";
      if (a === "0") return k;
      if (a.includes(".") && a.split(".")[1]!.length >= 2) return a;
      return a + k;
    });
  };

  if (done) {
    return (
      <PhoneFrame>
        <div className="flex flex-1 flex-col items-center justify-center px-8 text-center">
          <span className="grid size-16 place-items-center rounded-full bg-primary text-primary-foreground">
            <Check className="size-8" strokeWidth={3} />
          </span>
          <h1 className="mt-6 font-display text-2xl font-extrabold">Transfer sent</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            {usd(value)} from {from.name} to {to.name}.
          </p>
          <button
            onClick={() => router.navigate({ to: "/savings" })}
            className="mt-8 w-full rounded-full bg-primary py-3.5 text-sm font-semibold text-primary-foreground active:opacity-80"
          >
            Done
          </button>
        </div>
      </PhoneFrame>
    );
  }

  return (
    <PhoneFrame>
      <div className="flex items-center px-4 pt-5">
        <button
          aria-label="Back"
          onClick={() => router.navigate({ to: "/savings" })}
          className="active:opacity-60"
        >
          <ChevronLeft className="size-7" strokeWidth={2} />
        </button>
      </div>

      <div className="flex flex-1 flex-col px-5">
        <div className="flex flex-1 flex-col items-center justify-center">
          <AmountField
            value={amount}
            onChange={setAmount}
            symbolClassName="mt-2 font-display text-2xl font-extrabold"
          />

          <div className="mt-10 flex w-full items-center justify-around">
            <button onClick={() => setPicker("from")} className="flex flex-col items-center gap-1">
              {from.group === "chime" ? (
                <ChimeLogo className="size-9" />
              ) : (
                <span className="grid size-9 place-items-center rounded-full bg-card text-base">
                  {from.emoji || "💠"}
                </span>
              )}
              <span className="text-[11px] text-muted-foreground">From</span>
              <span className="text-xs font-semibold">{from.name}</span>
              <span className="text-[11px] text-muted-foreground">{from.sub}</span>
            </button>
            <button
              aria-label="Swap"
              onClick={() => {
                setFrom(to);
                setTo(from);
              }}
              className="active:opacity-60"
            >
              <ArrowLeftRight className="size-5 text-muted-foreground" />
            </button>
            <button onClick={() => setPicker("to")} className="flex flex-col items-center gap-1">
              {to.group === "chime" ? (
                <ChimeLogo className="size-9" />
              ) : (
                <span className="grid size-9 place-items-center rounded-full bg-card text-base">
                  {to.emoji || "💠"}
                </span>
              )}
              <span className="text-[11px] text-muted-foreground">To</span>
              <span className="text-xs font-semibold">{to.name}</span>
              <span className="text-[11px] text-muted-foreground">{to.sub}</span>
            </button>
          </div>
        </div>

        <button
          disabled={value <= 0}
          onClick={() => setDone(true)}
          className="mb-4 w-full rounded-full bg-primary py-3.5 text-sm font-semibold text-primary-foreground disabled:bg-secondary disabled:text-muted-foreground"
        >
          Review
        </button>

        <div className="grid grid-cols-3 gap-2 pb-6">
          {["1", "2", "3", "4", "5", "6", "7", "8", "9", ".", "0", "del"].map((k) => (
            <button
              key={k}
              onClick={() => press(k)}
              className="rounded-lg bg-card py-3 text-xl font-medium active:opacity-70"
            >
              {k === "del" ? "⌫" : k}
            </button>
          ))}
        </div>
      </div>

      {picker && (
        <Picker
          title={picker === "from" ? "From" : "To"}
          exclude={picker === "from" ? to.id : from.id}
          onPick={(a) => {
            if (picker === "from") setFrom(a);
            else setTo(a);
            setPicker(null);
          }}
          onClose={() => setPicker(null)}
        />
      )}
    </PhoneFrame>
  );
}

function Picker({
  title,
  exclude,
  onPick,
  onClose,
}: {
  title: string;
  exclude: string;
  onPick: (a: Acct) => void;
  onClose: () => void;
}) {
  const chime = SOURCES.filter((a) => a.group === "chime" && a.id !== exclude);
  const linked = SOURCES.filter((a) => a.group === "linked" && a.id !== exclude);
  const goals = GOALS.filter((a) => a.id !== exclude);

  return (
    <div className="absolute inset-0 z-30 flex flex-col justify-end bg-black/60" onClick={onClose}>
      <div
        className="max-h-[80%] overflow-y-auto rounded-t-3xl bg-popover px-5 pb-8 pt-4"
        onClick={(e) => e.stopPropagation()}
      >
        <span className="mx-auto mb-4 block h-1 w-10 rounded-full bg-muted-foreground/40" />
        <h2 className="font-display text-xl font-bold">{title}</h2>

        <Group label="Chime accounts" items={chime} onPick={onPick} />
        <Group label="Savings goals" items={goals} onPick={onPick} />
        <Group label="Linked accounts" items={linked} onPick={onPick} />

        <div className="mt-5 space-y-4 border-t border-border pt-4">
          <Row label="Add a bank account" sub="Transfer within 1-5 business days" />
          <Row label="Add a debit card" sub="Transfer instantly" />
        </div>
      </div>
    </div>
  );
}

function Group({
  label,
  items,
  onPick,
}: {
  label: string;
  items: Acct[];
  onPick: (a: Acct) => void;
}) {
  if (items.length === 0) return null;
  return (
    <div className="mt-5">
      <p className="text-xs font-semibold text-muted-foreground">{label}</p>
      <div className="mt-3 space-y-4">
        {items.map((a) => (
          <button
            key={a.id}
            onClick={() => onPick(a)}
            className="flex w-full items-center gap-3 text-left active:opacity-70"
          >
            {a.group === "chime" ? (
              <ChimeLogo className="size-8" />
            ) : (
              <span className="grid size-8 place-items-center rounded-full bg-card text-sm">
                {a.emoji || "💠"}
              </span>
            )}
            <span className="flex-1">
              <span className="block text-sm font-semibold">{a.name}</span>
              <span className="block text-[11px] text-muted-foreground">{a.sub}</span>
            </span>
            {a.instant ? (
              <span className="flex flex-col items-end gap-1">
                <span className="flex items-center gap-1 text-[11px] text-primary">
                  <Zap className="size-3" /> Instant
                </span>
                {a.fee && (
                  <span className="rounded bg-primary/20 px-1.5 py-0.5 text-[10px] text-primary">
                    {a.fee}
                  </span>
                )}
              </span>
            ) : (
              <span className="text-[11px] text-muted-foreground">{a.timing}</span>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}

function Row({ label, sub }: { label: string; sub: string }) {
  return (
    <button className="flex w-full items-center gap-3 text-left active:opacity-70">
      <span className="flex-1">
        <span className="block text-sm font-semibold">{label}</span>
        <span className="block text-[11px] text-muted-foreground">{sub}</span>
      </span>
      <ChevronRight className="size-4 text-muted-foreground" />
    </button>
  );
}
