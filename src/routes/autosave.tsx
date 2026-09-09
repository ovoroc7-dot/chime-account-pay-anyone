import { createFileRoute, useRouter } from "@tanstack/react-router";
import { ChevronLeft, ChevronRight, X, Trash2, Menu } from "lucide-react";
import { useState } from "react";
import { PhoneFrame } from "@/components/PhoneFrame";
import { ChimeLogo } from "@/components/ChimeLogo";
import { useKeyboardInset } from "@/hooks/use-keyboard-inset";
import { useGoals } from "@/lib/goals-store";


export const Route = createFileRoute("/autosave")({
  head: () => ({
    meta: [
      { title: "Auto-save — Split Your Pay and Round Ups" },
      {
        name: "description",
        content:
          "Automatic savings settings: split your direct deposit across accounts by percentage and round up debit card purchases.",
      },
      { property: "og:title", content: "Auto-save — Split Your Pay and Round Ups" },
      {
        property: "og:description",
        content:
          "Split your direct deposit across accounts by percentage and round up debit card purchases into savings.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: AutoSaveScreen,
});

type Split = { id: string; name: string; emoji: string; pct: number; fixed?: boolean };

const BASE: Split[] = [{ id: "checking", name: "Chime Checking", emoji: "🟢", pct: 100, fixed: true }];

function AutoSaveScreen() {
  const router = useRouter();
  const [sheet, setSheet] = useState(false);
  const [saved, setSaved] = useState<Split[] | null>(null);
  const [roundUps, setRoundUps] = useState(false);

  return (
    <PhoneFrame>
      <div className="relative flex items-center justify-center px-4 pt-5">
        <button
          aria-label="Back"
          onClick={() => router.navigate({ to: "/savings" })}
          className="absolute left-4 active:opacity-60"
        >
          <ChevronLeft className="size-7" strokeWidth={2} />
        </button>
        <h1 className="text-base font-semibold">Auto-save</h1>
      </div>

      <div className="flex-1 overflow-y-auto px-5 pb-8 pt-7">
        <h2 className="font-display text-xl font-bold">Paycheck</h2>
        <p className="mt-1 text-xs text-muted-foreground">Save with every direct deposit</p>

        <button
          onClick={() => setSheet(true)}
          className="mt-4 flex w-full items-center gap-3 rounded-xl py-2 text-left active:opacity-70"
        >
          <span className="grid size-9 place-items-center rounded-lg bg-card text-base">💵</span>
          <span className="flex-1 text-sm font-medium">Split your pay</span>
          <span className="text-sm text-muted-foreground">{saved ? "On" : "Off"}</span>
          <ChevronRight className="size-4 text-muted-foreground" />
        </button>

        <h2 className="mt-9 font-display text-xl font-bold">Round ups</h2>
        <p className="mt-1 text-xs text-muted-foreground">
          Save when you spend with your Chime Card
        </p>

        <button
          onClick={() => setRoundUps((v) => !v)}
          className="mt-4 flex w-full items-center gap-3 rounded-xl py-2 text-left active:opacity-70"
        >
          <span className="grid size-9 place-items-center rounded-lg bg-card text-base">💳</span>
          <span className="flex-1 text-sm font-medium">Debit purchases</span>
          <span className="text-sm text-muted-foreground">{roundUps ? "On" : "Off"}</span>
          <ChevronRight className="size-4 text-muted-foreground" />
        </button>

        <div className="mt-2 flex w-full items-center gap-3 rounded-xl py-2 opacity-40">
          <span className="grid size-9 place-items-center rounded-lg bg-card text-base">🪪</span>
          <span className="flex-1 text-sm font-medium">Credit Builder card purchases</span>
          <span className="text-sm text-muted-foreground">Off</span>
          <ChevronRight className="size-4 text-muted-foreground" />
        </div>

        <p className="mt-16 text-[11px] leading-relaxed text-muted-foreground">
          By turning on Round ups, you agree to the{" "}
          <span className="underline">Automatic Savings Account Agreement</span>.
        </p>
      </div>

      {sheet && (
        <SplitSheet
          initial={saved}
          onClose={() => setSheet(false)}
          onSave={(rows) => {
            setSaved(rows);
            setSheet(false);
          }}
          onDelete={() => {
            setSaved(null);
            setSheet(false);
          }}
        />
      )}
    </PhoneFrame>
  );
}

function SplitSheet({
  initial,
  onClose,
  onSave,
  onDelete,
}: {
  initial: Split[] | null;
  onClose: () => void;
  onSave: (rows: Split[]) => void;
  onDelete: () => void;
}) {
  const kbInset = useKeyboardInset();
  const goals = useGoals();
  const [mode, setMode] = useState<"%" | "$">("%");

  const [rows, setRows] = useState<Split[]>(initial ?? BASE);
  const [editing, setEditing] = useState(!initial);
  const [active, setActive] = useState<string | null>(null);

  const available: Split[] = goals.map((g) => ({
    id: g.id,
    name: g.name,
    emoji: g.emoji,
    pct: 0,
  }));
  const pool = available.filter((a) => !rows.some((r) => r.id === a.id));
  const total = rows.reduce((s, r) => s + r.pct, 0);

  const addRow = (a: Split) => {
    setRows((r) => [...r, { ...a, pct: 0 }]);
    setEditing(true);
    setActive(a.id);
  };

  const applyPct = (id: string, raw: string) => {
    const digits = raw.replace(/[^0-9]/g, "");
    const n = Math.min(100, Number(digits === "" ? "0" : digits));
    setRows((rs) => {
      const updated = rs.map((r) =>
        r.id === id ? { ...r, pct: Number.isNaN(n) ? r.pct : n } : r,
      );
      // keep checking as the remainder
      const others = updated.filter((r) => !r.fixed).reduce((s, r) => s + r.pct, 0);
      return updated.map((r) => (r.fixed ? { ...r, pct: Math.max(0, 100 - others) } : r));
    });
  };

  const setPct = (id: string, raw: string) => applyPct(id, raw);


  return (
    <div className="absolute inset-0 z-30 flex flex-col bg-background">
      <div className="relative flex items-center justify-center px-4 pt-5">
        <h2 className="text-base font-semibold">Split your pay</h2>
        <button aria-label="Close" onClick={onClose} className="absolute right-4 active:opacity-60">
          <X className="size-5" />
        </button>
      </div>

      <div className="mx-auto mt-4 flex rounded-full bg-card p-1 text-xs font-semibold">
        {(["%", "$"] as const).map((m) => (
          <button
            key={m}
            onClick={() => setMode(m)}
            className={`w-12 rounded-full py-1 ${
              mode === m ? "bg-secondary text-foreground" : "text-muted-foreground"
            }`}
          >
            {m}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto px-5 pt-6">
        <p className="flex items-center gap-2 text-[11px] text-muted-foreground">
          <span className="size-2 rounded-full border border-muted-foreground" />
          Direct deposit arrives in Checking
        </p>

        <div className="mt-3 space-y-3">
          {rows.map((r) => (
            <div key={r.id} className="flex items-center gap-3">
              <span className="text-base">{r.emoji}</span>
              <span className="flex-1 text-sm font-medium">{r.name}</span>
              {editing && !r.fixed ? (
                <input
                  type="text"
                  inputMode="numeric"
                  enterKeyHint="done"
                  aria-label={`${r.name} allocation ${mode === "%" ? "percent" : "dollars"}`}
                  value={mode === "%" ? `${r.pct}%` : `$${r.pct}`}
                  onFocus={() => setActive(r.id)}
                  onChange={(e) => setPct(r.id, e.target.value)}
                  className={`min-w-14 rounded-md border bg-transparent px-2 py-1 text-right text-xs font-semibold outline-none ${
                    active === r.id ? "border-foreground" : "border-border"
                  }`}
                />
              ) : (
                <span className="min-w-14 text-right text-xs font-semibold">
                  {mode === "%" ? `${r.pct}%` : `$${r.pct}`}
                </span>
              )}
              {editing && <Menu className="size-4 text-muted-foreground" aria-hidden="true" />}
            </div>
          ))}
        </div>

        {editing ? (
          <div className="mt-7">
            <p className="text-xs font-semibold text-muted-foreground">Add other accounts</p>
            <div className="mt-3 space-y-3">
              {pool.map((a) => (
                <button
                  key={a.id}
                  onClick={() => addRow(a)}
                  className="flex w-full items-center gap-3 active:opacity-70"
                >
                  <span className="text-base">{a.emoji}</span>
                  <span className="flex-1 text-left text-sm font-medium">{a.name}</span>
                  <span className="text-[11px] text-muted-foreground">Tap to add</span>
                </button>
              ))}
              {pool.length === 0 && (
                <p className="flex items-center gap-2 text-[11px] text-muted-foreground">
                  <Trash2 className="size-3.5" /> Drag here to remove
                </p>
              )}
            </div>
          </div>
        ) : (
          <div className="mt-8 space-y-3">
            <button
              onClick={() => setEditing(true)}
              className="w-full rounded-full bg-secondary py-3 text-sm font-semibold active:opacity-80"
            >
              Edit
            </button>
            <button
              onClick={onDelete}
              className="w-full py-3 text-sm font-semibold text-muted-foreground active:opacity-70"
            >
              Delete splits
            </button>
          </div>
        )}
      </div>

      {editing && (
        <div className="border-t border-border">
          {active && (
            <div className="bg-secondary/60">
              <div className="flex justify-end px-4 py-1">
                <button
                  onClick={() => setActive(null)}
                  className="text-xs font-semibold text-primary"
                >
                  Done
                </button>
              </div>
            </div>
          )}
          <div
            className="space-y-2 px-5 pb-6 pt-3"
            style={{ paddingBottom: `calc(1.5rem + ${kbInset}px)` }}
          >

            <button
              disabled={total !== 100}
              onClick={() => onSave(rows)}
              className="w-full rounded-full bg-primary py-3 text-sm font-semibold text-primary-foreground disabled:opacity-40"
            >
              Save
            </button>
            <button
              onClick={onClose}
              className="w-full rounded-full bg-secondary py-3 text-sm font-semibold active:opacity-80"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
