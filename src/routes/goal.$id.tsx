import { createFileRoute, useRouter } from "@tanstack/react-router";
import { ChevronLeft, Pencil, Check } from "lucide-react";
import { useState } from "react";
import { PhoneFrame } from "@/components/PhoneFrame";
import { usd } from "@/lib/chime-data";
import { deleteGoal, updateGoal, useGoal } from "@/lib/goals-store";

export const Route = createFileRoute("/goal/$id")({
  head: () => ({
    meta: [
      { title: "Savings Goal — Balance, Target and Transfers" },
      {
        name: "description",
        content:
          "View a savings goal with its balance and target, transfer money in or out, rename it or delete the goal.",
      },
      { property: "og:title", content: "Savings Goal — Balance, Target and Transfers" },
      {
        property: "og:description",
        content: "View a savings goal balance and target, transfer money in or out, or delete it.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: GoalScreen,
});

function GoalScreen() {
  const router = useRouter();
  const { id } = Route.useParams();
  const goal = useGoal(id);
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(goal?.name ?? "");
  const [confirm, setConfirm] = useState(false);

  const back = () => router.navigate({ to: "/savings" });

  if (!goal) {
    return (
      <PhoneFrame>
        <div className="flex flex-1 flex-col items-center justify-center px-8 text-center">
          <p className="text-sm text-muted-foreground">This goal is no longer available.</p>
          <button
            onClick={back}
            className="mt-6 w-full rounded-full bg-primary py-3.5 text-sm font-semibold text-primary-foreground"
          >
            Back to Savings
          </button>
        </div>
      </PhoneFrame>
    );
  }

  return (
    <PhoneFrame>
      <div className="flex items-center justify-between px-4 pt-5">
        <button aria-label="Back" onClick={back} className="active:opacity-60">
          <ChevronLeft className="size-7" strokeWidth={2} />
        </button>
        <button
          aria-label={editing ? "Save name" : "Rename goal"}
          onClick={() => {
            if (editing) updateGoal(goal.id, { name: name.trim() || goal.name });
            setEditing((v) => !v);
          }}
          className="active:opacity-60"
        >
          {editing ? <Check className="size-5 text-primary" /> : <Pencil className="size-5" />}
        </button>
      </div>

      <div className="flex flex-1 flex-col px-5 pb-8 pt-2">
        <span className="mx-auto grid size-14 place-items-center rounded-full bg-card text-2xl">
          {goal.emoji}
        </span>

        {editing ? (
          <input
            value={name}
            onChange={(e) => setName(e.target.value.slice(0, 30))}
            aria-label="Goal name"
            enterKeyHint="done"
            className="mx-auto mt-3 w-full rounded-lg border border-border bg-transparent px-3 py-1.5 text-center text-base font-semibold outline-none focus:border-foreground"
          />
        ) : (
          <h1 className="mt-3 text-center text-base font-semibold">{goal.name}</h1>
        )}

        <div className="mt-7 flex items-start justify-between">
          <span>
            <span className="block text-[11px] text-muted-foreground">Balance</span>
            <span className="font-display text-2xl font-extrabold">{usd(goal.amount)}</span>
          </span>
          {goal.target ? (
            <span className="text-right">
              <span className="block text-[11px] text-muted-foreground">Goal</span>
              <span className="font-display text-2xl font-extrabold">{usd(goal.target)}</span>
            </span>
          ) : null}
        </div>

        {goal.target ? (
          <div className="mt-4 h-1.5 w-full overflow-hidden rounded-full bg-secondary">
            <span
              className="block h-full rounded-full bg-primary"
              style={{ width: `${Math.min(100, (goal.amount / goal.target) * 100)}%` }}
            />
          </div>
        ) : null}

        <div className="mt-6 grid grid-cols-2 gap-3">
          <button
            onClick={() => router.navigate({ to: "/savings-move", search: { dir: "in" } })}
            className="rounded-full bg-primary py-3 text-sm font-semibold text-primary-foreground active:opacity-80"
          >
            Transfer in
          </button>
          <button
            disabled={goal.amount <= 0}
            onClick={() => router.navigate({ to: "/savings-move", search: { dir: "out" } })}
            className="rounded-full bg-secondary py-3 text-sm font-semibold disabled:text-muted-foreground disabled:opacity-60"
          >
            Transfer out
          </button>
        </div>

        {!goal.isDefault && (
          <button
            onClick={() => setConfirm(true)}
            className="mt-auto w-full rounded-full border border-border py-3.5 text-sm font-semibold active:opacity-70"
          >
            Delete
          </button>
        )}
      </div>

      {confirm && (
        <div className="absolute inset-0 z-40 flex flex-col justify-end bg-black/60">
          <div className="rounded-t-3xl bg-popover px-6 pb-8 pt-5">
            <span className="mx-auto mb-5 block h-1 w-10 rounded-full bg-muted-foreground/40" />
            <h2 className="font-display text-xl font-bold">Delete this goal?</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Any money in {goal.name} moves back to your default savings goal.
            </p>
            <button
              onClick={() => {
                deleteGoal(goal.id);
                back();
              }}
              className="mt-6 w-full rounded-full bg-primary py-3.5 text-sm font-semibold text-primary-foreground active:opacity-80"
            >
              Delete goal
            </button>
            <button
              onClick={() => setConfirm(false)}
              className="mt-3 w-full rounded-full bg-secondary py-3.5 text-sm font-semibold active:opacity-80"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </PhoneFrame>
  );
}
