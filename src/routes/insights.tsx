import { createFileRoute, Link } from "@tanstack/react-router";
import { ChevronLeft, CircleDollarSign, Images, Store } from "lucide-react";
import { useState } from "react";
import { PhoneFrame } from "@/components/PhoneFrame";
import { insights, usd } from "@/lib/chime-data";
import emptyArt from "@/assets/insights-empty.png";

export const Route = createFileRoute("/insights")({
  head: () => ({
    meta: [
      { title: "Spending Insights — Monthly Breakdown" },
      {
        name: "description",
        content:
          "Monthly spending insights with a six-month bar chart, deposits, and a breakdown by category or top merchants.",
      },
      { property: "og:title", content: "Spending Insights — Monthly Breakdown" },
      {
        property: "og:description",
        content: "Track monthly spending and deposits with category and merchant breakdowns.",
      },
    ],
  }),
  component: InsightsScreen,
});

function InsightsScreen() {
  const [index, setIndex] = useState(insights.length - 1);
  const [tab, setTab] = useState<"categories" | "top">("categories");
  const month = insights[index] ?? insights[0]!;
  const max = Math.max(...insights.map((m) => m.spent), 1);
  const rows = tab === "categories" ? month.categories : month.merchants;
  const rowMax = Math.max(...rows.map((r) => r.amount), 1);

  const latest = insights.reduce((acc, m, i) => (m.spent > 0 ? i : acc), 0);

  return (
    <PhoneFrame>
      <div className="flex-1 overflow-y-auto px-6 pb-10 pt-5">
        <div className="flex items-start justify-between">
          <Link to="/checking" aria-label="Back" className="inline-flex active:opacity-60">
            <ChevronLeft className="size-7" strokeWidth={2} />
          </Link>
          <button aria-label="Share insights" className="opacity-80 active:opacity-50">
            <Images className="size-6" strokeWidth={1.8} />
          </button>
        </div>

        <h1 className="mt-3 font-display text-2xl font-extrabold tracking-tight">
          {month.monthName} spending
        </h1>
        <p className="font-display text-4xl font-extrabold tracking-tight">{usd(month.spent)}</p>
        <p className="mt-1 text-sm text-muted-foreground">{usd(month.deposited)} deposited</p>

        <div className="mt-7 flex h-36 items-end gap-2">
          {insights.map((m, i) => {
            const active = i === index;
            const h = m.spent === 0 ? 3 : Math.max(12, (m.spent / max) * 100);
            return (
              <button
                key={m.key}
                onClick={() => setIndex(i)}
                aria-label={`${m.monthName} spending`}
                className="flex flex-1 flex-col items-center justify-end gap-2 active:opacity-70"
              >
                <span
                  className={`w-full rounded-md transition-all ${
                    active ? "bg-foreground" : "bg-surface-deep"
                  }`}
                  style={{ height: `${h}%` }}
                />
                <span
                  className={`text-[11px] ${
                    active ? "font-bold text-foreground" : "text-muted-foreground"
                  }`}
                >
                  {m.label}
                </span>
              </button>
            );
          })}
        </div>

        {month.spent === 0 ? (
          <div className="mt-6 flex flex-col items-center">
            <img
              src={emptyArt}
              alt="Illustration of a cake being sliced"
              className="w-56"
              loading="lazy"
            />
            <p className="mt-6 text-center text-sm text-muted-foreground">
              No spending to show this month. Want to see your most recent month of insights?
            </p>
            <button
              onClick={() => setIndex(latest)}
              className="mt-6 w-full rounded-full bg-primary py-3.5 text-sm font-semibold text-primary-foreground active:opacity-80"
            >
              See Latest
            </button>
          </div>
        ) : (
          <>
            <div className="mt-6 flex gap-2">
              {(["categories", "top"] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => setTab(t)}
                  className={`rounded-full px-5 py-2 text-sm font-semibold transition-colors ${
                    tab === t
                      ? "bg-foreground text-background"
                      : "bg-surface-deep text-foreground"
                  }`}
                >
                  {t === "categories" ? "Categories" : "Top"}
                </button>
              ))}
            </div>

            <div className="mt-6 space-y-5">
              {rows.map((r) => (
                <div key={r.name} className="flex items-center gap-3">
                  <span className="grid size-11 shrink-0 place-items-center rounded-full bg-surface-deep text-primary">
                    {tab === "categories" ? (
                      <CircleDollarSign className="size-5" />
                    ) : (
                      <Store className="size-5" />
                    )}
                  </span>
                  <span className="flex-1">
                    <span className="block text-xs text-muted-foreground">{r.name}</span>
                    <span className="block text-base font-semibold">{usd(r.amount)}</span>
                    <span className="mt-2 block h-1.5 w-full rounded-full bg-surface-deep">
                      <span
                        className="block h-full rounded-full bg-primary"
                        style={{ width: `${(r.amount / rowMax) * 100}%` }}
                      />
                    </span>
                  </span>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </PhoneFrame>
  );
}
