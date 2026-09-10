import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ChevronRight,
  Plus,
  X,
  Rocket,
  Gauge,
  Car,
  Receipt,
  FileText,
  Gift,
} from "lucide-react";
import { useRef, useState } from "react";
import { PhoneFrame } from "@/components/PhoneFrame";

import { InboxBell } from "@/components/InboxBell";
import { MoveTabBar } from "@/routes/move";
import { CHECKING_BALANCE } from "@/lib/chime-data";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Accounts — Mobile Banking Home" },
      {
        name: "description",
        content:
          "Mobile banking home with checking balance, Credit Builder setup, SpotMe, MyPay, savings and financial tools.",
      },
      { property: "og:title", content: "Accounts — Mobile Banking Home" },
      {
        property: "og:description",
        content:
          "Mobile banking home with checking balance, Credit Builder setup, SpotMe, MyPay, savings and financial tools.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: HomeScreen,
});

type Promo = {
  id: string;
  title: string;
  cta: string;
  to?: string;
  tone: "bright" | "mint" | "deep";
  art: "parachute" | "plus" | "cash" | "phone";
};

const promos: Promo[] = [
  {
    id: "spotme",
    title: "Get up to $200 of fee-free overdraft coverage",
    cta: "Set up SpotMe",
    to: "/spotme",
    tone: "bright",
    art: "parachute",
  },
  {
    id: "chimeplus",
    title: "Accelerate your savings with a 3.50% savings APY with Chime+",
    cta: "Unlock Chime+",
    tone: "mint",
    art: "plus",
  },
  {
    id: "mypay",
    title: "Get up to $500 of your pay before payday",
    cta: "Check eligibility",
    tone: "deep",
    art: "cash",
  },
  {
    id: "pay-anyone",
    title: "Pay friends even if they use another money app",
    cta: "Send money",
    tone: "bright",
    art: "phone",
  },
  {
    id: "direct-deposit",
    title: "Up your deposit just a bit and get more out of Chime",
    cta: "Set up direct deposit",
    tone: "mint",
    art: "cash",
  },
  {
    id: "credit",
    title: "Build credit with everyday purchases, no annual fee",
    cta: "Set up Credit Builder",
    to: "/credit-builder",
    tone: "deep",
    art: "plus",
  },
  {
    id: "referral",
    title: "Get $200 for you, $100 for a friend",
    cta: "Invite friends",
    tone: "bright",
    art: "cash",
  },
  {
    id: "deals",
    title: "Earn cash back at places you already shop",
    cta: "Browse deals",
    tone: "mint",
    art: "phone",
  },
  {
    id: "alerts",
    title: "Don't miss balance alerts and instant transaction updates",
    cta: "Turn on notifications",
    tone: "deep",
    art: "phone",
  },
];

const toneClass: Record<Promo["tone"], string> = {
  bright: "bg-primary text-primary-foreground",
  mint: "bg-[#bfe8d3] text-[#0a2c1d]",
  deep: "bg-[#0f3b2b] text-foreground",
};

const discover = [
  { icon: Rocket, label: "SpotMe® Boosts", sub: "Send and receive $5 SpotMe increases", to: "/spotme" },
  { icon: Gauge, label: "Credit Building", sub: "Get your free FICO® Score and more", to: "/credit-builder" },
  { icon: Car, label: "Car Insurance", sub: "Compare rates and save" },
  { icon: Receipt, label: "Bills", sub: "Pay bills on time to help build credit" },
  { icon: FileText, label: "Taxes", sub: "File your taxes for free" },
] as const;

function HomeScreen() {
  const [dismissed, setDismissed] = useState<string[]>([]);
  const [active, setActive] = useState(0);
  const trackRef = useRef<HTMLDivElement>(null);

  const visible = promos.filter((p) => !dismissed.includes(p.id));

  function onScroll() {
    const el = trackRef.current;
    if (!el) return;
    const i = Math.round(el.scrollLeft / (el.clientWidth * 0.88));
    setActive(Math.min(Math.max(i, 0), visible.length - 1));
  }

  return (
    <PhoneFrame>
      <div className="flex-1 overflow-y-auto pb-28">
        <div className="bg-surface-deep px-6 pt-5 pb-8">
          <div className="flex items-center justify-between">
            <InboxBell className="-ml-3" />
            <span className="rounded-full border border-primary px-4 py-1.5 text-xs font-semibold text-primary">
              Get $200
            </span>
          </div>

          <h1 className="mt-8 font-display text-4xl font-extrabold tracking-tight">Accounts</h1>

          <Link
            to="/checking"
            className="mt-7 flex items-center justify-between transition-opacity active:opacity-60"
          >
            <span className="flex items-center gap-2.5 text-xl font-semibold">
              Checking
            </span>
            <span className="flex items-center gap-1 text-xl font-semibold">
              ${CHECKING_BALANCE.toFixed(2)}
              <ChevronRight className="size-5" strokeWidth={2.5} />
            </span>
          </Link>

          <div className="mt-5 flex items-center justify-between">
            <span className="text-xl font-semibold">Credit Builder</span>
            <Link
              to="/credit-builder"
              className="rounded-full bg-white/15 px-5 py-2 text-sm font-semibold active:opacity-70"
            >
              Set up
            </Link>
          </div>

          <Link
            to="/spotme"
            className="mt-6 flex items-center gap-1 text-base font-semibold text-primary active:opacity-70"
          >
            Unlock SpotMe <ChevronRight className="size-4" strokeWidth={2.5} />
          </Link>

          <div className="mt-7 grid grid-cols-2 gap-3">
            <div className="rounded-2xl bg-black/25 p-4">
              <div className="flex items-center gap-2">
                <span className="grid size-5 place-items-center rounded-md bg-primary text-primary-foreground">
                  <Plus className="size-3.5" strokeWidth={3} />
                </span>
                <span className="text-sm font-semibold">MyPay</span>
              </div>
              <p className="mt-6 text-2xl font-semibold text-muted-foreground">$0</p>
              <p className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
                Get paid early <ChevronRight className="size-3" />
              </p>
            </div>
            <Link to="/savings" className="rounded-2xl bg-black/25 p-4 active:opacity-70">
              <span className="text-sm font-semibold">Savings</span>
              <p className="mt-6 text-2xl font-semibold">$0.00</p>
              <p className="mt-1 text-xs text-muted-foreground">1.00% APY</p>
            </Link>
          </div>
        </div>

        {visible.length > 0 && (
          <div className="pt-6">
            <div
              ref={trackRef}
              onScroll={onScroll}
              className="flex snap-x snap-mandatory gap-3 overflow-x-auto px-5 pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
            >
              {visible.map((p) => (
                <article
                  key={p.id}
                  className={`relative min-h-[128px] w-[88%] shrink-0 snap-center overflow-hidden rounded-2xl p-5 ${toneClass[p.tone]}`}
                >
                  <button
                    type="button"
                    onClick={() => setDismissed((d) => [...d, p.id])}
                    aria-label={`Dismiss ${p.title}`}
                    className="absolute right-3 top-3 opacity-70"
                  >
                    <X className="size-4" strokeWidth={2.5} />
                  </button>
                  <p className="max-w-[68%] text-base font-semibold leading-snug">{p.title}</p>
                  {p.to ? (
                    <Link to={p.to} className="mt-5 flex items-center gap-1 text-sm font-semibold">
                      {p.cta} <ChevronRight className="size-4" strokeWidth={2.5} />
                    </Link>
                  ) : (
                    <p className="mt-5 flex items-center gap-1 text-sm font-semibold">
                      {p.cta} <ChevronRight className="size-4" strokeWidth={2.5} />
                    </p>
                  )}
                  <PromoArt art={p.art} />
                </article>
              ))}
            </div>

            <div className="mt-4 flex items-center justify-center gap-1.5">
              {visible.map((p, i) => (
                <span
                  key={p.id}
                  className={
                    i === active ? "h-1.5 w-5 rounded-full bg-white" : "size-1.5 rounded-full bg-white/25"
                  }
                />
              ))}
            </div>
          </div>
        )}

        <section className="px-6 pt-7">
          <h2 className="font-display text-2xl font-bold">Financial tools</h2>
          <div className="mt-4 grid grid-cols-2 gap-3">
            <div className="rounded-2xl bg-card p-4">
              <p className="text-sm text-muted-foreground">Direct Deposit</p>
              <p className="mt-6 text-2xl font-semibold">Sep 28</p>
              <p className="mt-1 flex items-center gap-1.5 text-xs text-muted-foreground">
                <span className="size-1.5 rounded-full bg-primary" /> Last paid
              </p>
            </div>
            <Link to="/insights" className="rounded-2xl bg-card p-4 active:opacity-70">
              <p className="text-sm text-muted-foreground">Spending</p>
              <p className="mt-6 text-2xl font-semibold">$5.00</p>
              <p className="mt-1 text-xs text-muted-foreground">Last month</p>
            </Link>
          </div>
        </section>

        <section className="px-6 pt-8">
          <h2 className="font-display text-2xl font-bold">Discover more</h2>
          <ul className="mt-4">
            {discover.map((d) => {
              const inner = (
                <>
                  <d.icon className="size-6 text-foreground/80" strokeWidth={1.6} />
                  <span className="flex-1">
                    <span className="block text-base font-semibold">{d.label}</span>
                    <span className="block text-xs text-muted-foreground">{d.sub}</span>
                  </span>
                  <ChevronRight className="size-5 text-muted-foreground" />
                </>
              );
              return (
                <li key={d.label} className="border-b border-white/5 last:border-0">
                  {"to" in d && d.to ? (
                    <Link to={d.to} className="flex w-full items-center gap-4 py-4 text-left active:opacity-70">
                      {inner}
                    </Link>
                  ) : (
                    <button
                      type="button"
                      className="flex w-full items-center gap-4 py-4 text-left active:opacity-70"
                    >
                      {inner}
                    </button>
                  )}
                </li>
              );
            })}
          </ul>
        </section>

        <section className="px-6 pt-6">
          <h2 className="font-display text-2xl font-bold leading-tight">
            $200 for you, $100 for a friend
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Invite a friend to Chime. When they get a qualifying direct deposit, you both get paid.
          </p>
          <button
            type="button"
            className="mt-5 flex w-full items-center gap-4 rounded-2xl bg-card p-4 text-left active:opacity-70"
          >
            <span className="grid size-11 place-items-center rounded-xl bg-black/25 text-primary">
              <Gift className="size-5" strokeWidth={2} />
            </span>
            <span className="flex-1 text-base font-semibold">Invite friends</span>
            <ChevronRight className="size-5 text-muted-foreground" />
          </button>
        </section>
      </div>

      <TabBar />
    </PhoneFrame>
  );
}

function PromoArt({ art }: { art: Promo["art"] }) {
  const base = "pointer-events-none absolute bottom-3 right-4 opacity-90";
  if (art === "plus") {
    return (
      <span className={`${base} grid size-14 place-items-center rounded-2xl bg-[#0f3b2b] text-primary`}>
        <Plus className="size-7" strokeWidth={3} />
      </span>
    );
  }
  if (art === "cash") {
    return (
      <span className={`${base} grid size-14 place-items-center rounded-full bg-black/15 text-2xl`}>💵</span>
    );
  }
  if (art === "phone") {
    return (
      <span className={`${base} grid size-14 place-items-center rounded-full bg-black/15 text-2xl`}>📱</span>
    );
  }
  return (
    <span className={`${base} grid size-14 place-items-center rounded-full bg-black/15 text-2xl`}>🪂</span>
  );
}

function TabBar() {
  return <MoveTabBar active="Home" />;
}
