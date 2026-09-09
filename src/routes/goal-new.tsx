import { createFileRoute, useRouter } from "@tanstack/react-router";
import { ChevronLeft, CircleCheck } from "lucide-react";
import { useState } from "react";
import { PhoneFrame } from "@/components/PhoneFrame";
import { useKeyboardInset } from "@/hooks/use-keyboard-inset";
import { GOAL_CATEGORIES, addGoal } from "@/lib/goals-store";
import { sanitizeAmount } from "@/components/AmountField";

export const Route = createFileRoute("/goal-new")({
  head: () => ({
    meta: [
      { title: "Create a Savings Goal — Pick a Category" },
      {
        name: "description",
        content:
          "Start a new savings goal: choose what you are saving for, name it, set an optional target amount and start moving money.",
      },
      { property: "og:title", content: "Create a Savings Goal — Pick a Category" },
      {
        property: "og:description",
        content:
          "Choose what you are saving for, name your goal and set an optional target amount.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: NewGoalScreen,
});

function NewGoalScreen() {
  const router = useRouter();
  const kbInset = useKeyboardInset();

  const [pick, setPick] = useState<{ name: string; emoji: string } | null>(null);
  const [name, setName] = useState("");
  const [target, setTarget] = useState("");
  const [createdId, setCreatedId] = useState<string | null>(null);

  const save = () => {
    const amountTarget = Number(target) || 0;
    const id = addGoal({
      name: name.trim() || pick!.name,
      emoji: pick!.emoji,
      amount: 0,
      ...(amountTarget > 0 ? { target: amountTarget } : {}),
    });
    setCreatedId(id);
  };

  if (!pick) {
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

        <div className="flex-1 overflow-y-auto px-6 pb-10 pt-2">
          <h1 className="font-display text-3xl font-extrabold leading-tight tracking-tight">
            What are you saving for?
          </h1>
          <div className="mt-7 space-y-5">
            {GOAL_CATEGORIES.map((c) => (
              <button
                key={c.name}
                onClick={() => {
                  setPick(c);
                  setName(c.name);
                }}
                className="flex w-full items-center gap-3 text-left active:opacity-70"
              >
                <span className="grid size-9 place-items-center rounded-full bg-card text-base">
                  {c.emoji}
                </span>
                <span className="text-sm font-semibold">{c.name}</span>
              </button>
            ))}
          </div>
        </div>
      </PhoneFrame>
    );
  }

  return (
    <PhoneFrame>
      <div className="relative flex items-center justify-center px-4 pt-5">
        <button
          aria-label="Back"
          onClick={() => setPick(null)}
          className="absolute left-4 active:opacity-60"
        >
          <ChevronLeft className="size-7" strokeWidth={2} />
        </button>
        <h1 className="text-base font-semibold">Savings goal</h1>
      </div>

      <div className="flex flex-1 flex-col px-5 pt-6">
        <span className="mx-auto grid size-12 place-items-center rounded-full bg-card text-xl">
          {pick.emoji}
        </span>

        <label className="mt-7 block rounded-xl border border-border px-4 py-2.5">
          <span className="block text-[11px] text-muted-foreground">Goal name</span>
          <input
            value={name}
            onChange={(e) => setName(e.target.value.slice(0, 30))}
            enterKeyHint="done"
            className="w-full bg-transparent text-sm font-medium outline-none"
          />
        </label>

        <label className="mt-4 block rounded-xl border border-border px-4 py-2.5 focus-within:border-foreground">
          <span className="block text-[11px] text-muted-foreground">Target amount (optional)</span>
          <span className="flex items-center text-sm font-medium">
            $
            <input
              value={target}
              onChange={(e) => setTarget(sanitizeAmount(e.target.value).replace(/^0$/, ""))}
              inputMode="decimal"
              enterKeyHint="done"
              aria-label="Target amount in dollars"
              className="w-full bg-transparent outline-none"
            />
          </span>
        </label>

        <button
          onClick={save}
          disabled={name.trim().length === 0}
          style={{ marginBottom: `calc(1rem + ${kbInset}px)` }}
          className="sticky bottom-0 mt-auto w-full rounded-full bg-primary py-3.5 text-sm font-semibold text-primary-foreground disabled:bg-secondary disabled:text-muted-foreground"
        >
          Save
        </button>
      </div>

      {createdId && (
        <div className="absolute inset-0 z-40 flex flex-col justify-end bg-black/60">
          <div className="rounded-t-3xl bg-popover px-6 pb-8 pt-5">
            <span className="mx-auto mb-5 block h-1 w-10 rounded-full bg-muted-foreground/40" />
            <CircleCheck className="size-7 text-primary" strokeWidth={1.8} />
            <h2 className="mt-3 font-display text-xl font-bold">Goal set</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Your savings journey starts now! Start by moving money to your goal.
            </p>
            <button
              onClick={() => router.navigate({ to: "/savings-move", search: { dir: "in" } })}
              className="mt-6 w-full rounded-full bg-primary py-3.5 text-sm font-semibold text-primary-foreground active:opacity-80"
            >
              Move Money
            </button>
            <button
              onClick={() => router.navigate({ to: "/savings" })}
              className="mt-3 w-full rounded-full bg-secondary py-3.5 text-sm font-semibold active:opacity-80"
            >
              Not now
            </button>
          </div>
        </div>
      )}
    </PhoneFrame>
  );
}
