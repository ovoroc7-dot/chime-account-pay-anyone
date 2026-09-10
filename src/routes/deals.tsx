import { createFileRoute } from "@tanstack/react-router";
import { History, Plus, Search } from "lucide-react";
import { InboxBell } from "@/components/InboxBell";
import { useState } from "react";
import { PhoneFrame } from "@/components/PhoneFrame";
import { MoveTabBar } from "@/routes/move";

export const Route = createFileRoute("/deals")({
  head: () => ({
    meta: [
      { title: "Deals — Cash Back Offers on Everyday Spending" },
      {
        name: "description",
        content:
          "Browse cash back deals from your favourite brands, activate offers and unlock premium deals with Chime+.",
      },
      { property: "og:title", content: "Deals — Cash Back Offers on Everyday Spending" },
      {
        property: "og:description",
        content: "Activate cash back offers and unlock premium deals with Chime+.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: DealsScreen,
});

const CATEGORIES = ["All", "Featured", "Groceries", "Dining", "Travel", "Shopping"] as const;

const DEALS = [
  { brand: "Fresh Market", cash: "5% back", note: "Groceries", tint: "from-emerald-700 to-emerald-900", cat: "Groceries" },
  { brand: "Bean & Brew", cash: "10% back", note: "Coffee & dining", tint: "from-amber-700 to-amber-900", cat: "Dining" },
  { brand: "Skyline Air", cash: "$25 back", note: "Travel", tint: "from-sky-700 to-sky-900", cat: "Travel" },
  { brand: "Loop Wear", cash: "8% back", note: "Shopping", tint: "from-fuchsia-800 to-fuchsia-950", cat: "Shopping" },
  { brand: "PowerFuel", cash: "3% back", note: "Gas stations", tint: "from-red-800 to-red-950", cat: "Featured" },
  { brand: "Corner Deli", cash: "12% back", note: "Dining", tint: "from-lime-800 to-lime-950", cat: "Dining" },
];

function DealsScreen() {
  const [cat, setCat] = useState<string>("All");
  const [activated, setActivated] = useState<string[]>([]);
  const [showUnlock, setShowUnlock] = useState(true);

  const list = cat === "All" ? DEALS : DEALS.filter((d) => d.cat === cat);

  return (
    <PhoneFrame>
      <div className="flex items-center justify-between px-6 pt-5">
        <InboxBell className="-ml-3" />
        <h1 className="font-display text-base font-bold">Deals</h1>
        <button type="button" aria-label="Deal history" className="active:opacity-60">
          <History className="size-6" />
        </button>
      </div>

      <div className={`flex-1 overflow-y-auto px-6 pb-28 pt-4 ${showUnlock ? "blur-[2px]" : ""}`}>
        <label className="flex items-center gap-3 rounded-xl border border-border px-4 py-3">
          <Search className="size-5 text-muted-foreground" />
          <input
            aria-label="Search deals"
            placeholder="Search brands"
            className="w-full bg-transparent text-[15px] outline-none placeholder:text-muted-foreground"
          />
        </label>

        <div className="-mx-6 mt-4 flex gap-2 overflow-x-auto px-6 pb-1">
          {CATEGORIES.map((c) => (
            <button
              key={c}
              type="button"
              aria-pressed={cat === c}
              onClick={() => setCat(c)}
              className={`shrink-0 rounded-full border px-4 py-2 text-[13px] ${
                cat === c
                  ? "border-transparent bg-white font-semibold text-black"
                  : "border-white/25 text-foreground"
              }`}
            >
              {c}
            </button>
          ))}
        </div>

        <div className="mt-5 grid grid-cols-2 gap-4">
          {list.map((d) => {
            const on = activated.includes(d.brand);
            return (
              <div key={d.brand} className="overflow-hidden rounded-2xl bg-card">
                <div className={`h-24 bg-gradient-to-br ${d.tint}`} />
                <div className="p-3">
                  <p className="text-[14px] font-semibold">{d.brand}</p>
                  <p className="text-[12px] text-muted-foreground">{d.note}</p>
                  <p className="mt-1 text-[13px] font-bold text-primary">{d.cash}</p>
                  <button
                    type="button"
                    onClick={() =>
                      setActivated((a) => (on ? a.filter((x) => x !== d.brand) : [...a, d.brand]))
                    }
                    className={`mt-3 w-full rounded-full py-2 text-[12px] font-bold ${
                      on ? "bg-secondary text-muted-foreground" : "bg-primary text-primary-foreground"
                    }`}
                  >
                    {on ? "Activated" : "Activate"}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {showUnlock && (
        <div className="absolute inset-x-0 bottom-[76px] z-20 bg-background/95 px-8 py-10 text-center backdrop-blur">
          <span className="mx-auto grid size-12 place-items-center rounded-xl bg-primary">
            <Plus className="size-7 text-primary-foreground" strokeWidth={3} />
          </span>
          <h2 className="mt-5 font-display text-2xl font-extrabold leading-tight">
            Unlock even more deals with Chime+
          </h2>
          <p className="mt-3 text-[13px] leading-relaxed text-muted-foreground">
            Set up a qualifying direct deposit for premium deals and Chime+ perks like SpotMe
            fee-free overdraft.
          </p>
          <button
            type="button"
            onClick={() => setShowUnlock(false)}
            className="mt-6 rounded-full bg-primary px-7 py-3 text-[15px] font-bold text-primary-foreground"
          >
            Get Chime+
          </button>
          <button
            type="button"
            onClick={() => setShowUnlock(false)}
            className="mt-4 block w-full text-[14px] font-semibold"
          >
            Learn more
          </button>
        </div>
      )}

      <MoveTabBar active="Deals" />
    </PhoneFrame>
  );
}
