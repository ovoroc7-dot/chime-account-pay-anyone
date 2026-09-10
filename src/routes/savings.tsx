import { createFileRoute, Link, useRouter } from "@tanstack/react-router";
import {
  ChevronLeft,
  ChevronRight,
  Info,
  Plus,
  PiggyBank,
  ArrowLeftRight,
  RotateCw,
  X,
  Sparkles,
} from "lucide-react";
import { useState } from "react";
import { PhoneFrame } from "@/components/PhoneFrame";
import { SAVINGS_APY, usd } from "@/lib/chime-data";
import { useLedger } from "@/lib/ledger-store";
import { useGoals } from "@/lib/goals-store";

export const Route = createFileRoute("/savings")({
  head: () => ({
    meta: [
      { title: "Savings — Balance, Goals and Auto-save" },
      {
        name: "description",
        content:
          "Savings account with 1.00% APY, add money, transfer out, auto-save settings and savings goals like My Savings and Emergency fund.",
      },
      { property: "og:title", content: "Savings — Balance, Goals and Auto-save" },
      {
        property: "og:description",
        content:
          "Savings account with 1.00% APY, add money, transfer out, auto-save settings and savings goals.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: SavingsScreen,
});

function SavingsScreen() {
  const router = useRouter();
  const goals = useGoals();
  const { savings } = useLedger();
  const [banner, setBanner] = useState(true);
  const [apyInfo, setApyInfo] = useState(false);

  return (
    <PhoneFrame>
      <div className="flex items-center px-4 pt-5">
        <button
          aria-label="Back"
          onClick={() => router.navigate({ to: "/" })}
          className="active:opacity-60"
        >
          <ChevronLeft className="size-7" strokeWidth={2} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-5 pb-10 pt-3">
        <h1 className="font-display text-3xl font-extrabold tracking-tight">Savings</h1>
        <p className="mt-1 font-display text-5xl font-extrabold tracking-tight">
          {usd(savings)}
        </p>
        <button
          onClick={() => setApyInfo((v) => !v)}
          className="mt-2 flex items-center gap-1.5 text-xs font-medium text-muted-foreground active:opacity-60"
        >
          {SAVINGS_APY.toFixed(2)}% APY <Info className="size-3.5" />
        </button>
        {apyInfo && (
          <p className="mt-2 rounded-xl bg-card p-3 text-xs leading-relaxed text-muted-foreground">
            Your annual percentage yield is variable and may change at any time. Interest is paid
            monthly on your average daily balance.
          </p>
        )}

        {banner && (
          <div className="mt-5 flex items-start gap-3 rounded-xl bg-primary/15 px-4 py-3">
            <Sparkles className="mt-0.5 size-4 shrink-0 text-primary" />
            <div className="flex-1">
              <p className="text-xs font-semibold">Maximize savings with 3.50% APY*</p>
              <button className="text-xs text-muted-foreground underline-offset-2 active:underline">
                See details
              </button>
            </div>
            <button aria-label="Dismiss" onClick={() => setBanner(false)} className="opacity-60">
              <X className="size-4" />
            </button>
          </div>
        )}

        <div className="mt-6 grid grid-cols-3 gap-2">
          <ActionTile to="/savings-move" search={{ dir: "in" }} icon={PiggyBank} label="Add money" />
          <ActionTile
            to="/savings-move"
            search={{ dir: "out" }}
            icon={ArrowLeftRight}
            label="Transfer out"
          />
          <ActionTile to="/autosave" icon={RotateCw} label="Autosave" />
        </div>

        <div className="mt-8 flex items-center justify-between">
          <h2 className="font-display text-xl font-bold">Goals</h2>
          <Link to="/goal-new" aria-label="Add goal" className="active:opacity-60">
            <Plus className="size-5" strokeWidth={2.2} />
          </Link>
        </div>

        <div className="mt-4 space-y-5">
          {goals.map((g) => (
            <Link
              key={g.id}
              to="/goal/$id"
              params={{ id: g.id }}
              className="flex w-full items-center gap-3 text-left active:opacity-70"
            >
              <span className="grid size-10 place-items-center rounded-full bg-card text-lg">
                {g.emoji}
              </span>
              <span className="flex-1">
                <span className="block text-sm font-semibold">{g.name}</span>
                <span className="block text-xs text-muted-foreground">{usd(g.amount)}</span>
              </span>
              {g.isDefault ? (
                <span className="rounded-md bg-primary px-2 py-0.5 text-[10px] font-bold text-primary-foreground">
                  Default
                </span>
              ) : (
                <ChevronRight className="size-4 text-muted-foreground" />
              )}
            </Link>
          ))}
        </div>
      </div>
    </PhoneFrame>
  );
}

function ActionTile({
  to,
  search,
  icon: Icon,
  label,
}: {
  to: string;
  search?: Record<string, string>;
  icon: typeof PiggyBank;
  label: string;
}) {
  return (
    <Link
      to={to}
      search={search as never}
      className="flex flex-col items-center gap-2 active:opacity-70"
    >
      <span className="grid size-12 place-items-center rounded-xl border border-border bg-card">
        <Icon className="size-5" strokeWidth={1.9} />
      </span>
      <span className="text-[11px] text-muted-foreground">{label}</span>
    </Link>
  );
}
