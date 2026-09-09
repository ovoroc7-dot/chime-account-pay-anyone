import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Bell,
  ChevronRight,
  Home,
  ArrowLeftRight,
  Users,
  Star,
  CircleUserRound,
  Plus,
  PiggyBank,
  TrendingUp,
  ShieldCheck,
  Receipt,
  X,
} from "lucide-react";
import { useState } from "react";
import { PhoneFrame } from "@/components/PhoneFrame";
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
    ],
  }),
  component: HomeScreen,
});

const tools = [
  { icon: TrendingUp, label: "Credit Builder", sub: "Build credit safely" },
  { icon: PiggyBank, label: "Savings", sub: "Round up and save" },
  { icon: ShieldCheck, label: "SpotMe", sub: "Overdraft up to $200" },
  { icon: Receipt, label: "Pay Anyone", sub: "Send money instantly" },
];

function HomeScreen() {
  const [bannerOpen, setBannerOpen] = useState(true);

  return (
    <PhoneFrame>
      <div className="flex-1 overflow-y-auto pb-24">
        <div className="bg-surface-deep px-6 pt-5 pb-8">
          <div className="flex items-center justify-between">
            <Bell className="size-6 text-foreground" strokeWidth={1.75} />
            <span className="rounded-full border border-primary px-4 py-1.5 text-xs font-semibold text-primary">
              Get $200
            </span>
          </div>

          <h1 className="mt-8 font-display text-4xl font-extrabold tracking-tight">Accounts</h1>

          <Link
            to="/checking"
            className="mt-7 flex items-center justify-between transition-opacity active:opacity-60"
          >
            <span className="text-xl font-semibold">Checking</span>
            <span className="flex items-center gap-1 text-xl font-semibold">
              ${CHECKING_BALANCE.toFixed(2)}
              <ChevronRight className="size-5" strokeWidth={2.5} />
            </span>
          </Link>

          <div className="mt-5 flex items-center justify-between">
            <span className="text-xl font-semibold">Credit Builder</span>
            <button className="rounded-full bg-white/15 px-5 py-2 text-sm font-semibold">
              Set up
            </button>
          </div>

          <button className="mt-6 flex items-center gap-1 text-base font-semibold text-primary">
            Unlock SpotMe <ChevronRight className="size-4" strokeWidth={2.5} />
          </button>

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
            <div className="rounded-2xl bg-black/25 p-4">
              <span className="text-sm font-semibold">Savings</span>
              <p className="mt-6 text-2xl font-semibold">$0.00</p>
              <p className="mt-1 text-xs text-muted-foreground">1.00% APY</p>
            </div>
          </div>
        </div>

        {bannerOpen && (
          <div className="px-5 pt-6">
            <div className="relative overflow-hidden rounded-2xl bg-primary p-5 text-primary-foreground">
              <button
                onClick={() => setBannerOpen(false)}
                aria-label="Dismiss"
                className="absolute right-3 top-3 opacity-70"
              >
                <X className="size-4" strokeWidth={2.5} />
              </button>
              <p className="max-w-[70%] text-base font-semibold leading-snug">
                Pay friends even if they use another money app — no app download needed
              </p>
              <p className="mt-5 flex items-center gap-1 text-sm font-semibold">
                Send money <ChevronRight className="size-4" strokeWidth={2.5} />
              </p>
            </div>
            <div className="mt-4 flex items-center justify-center gap-1.5">
              {Array.from({ length: 8 }).map((_, i) => (
                <span key={i} className="size-1.5 rounded-full bg-white/25" />
              ))}
              <span className="h-1.5 w-6 rounded-full bg-white" />
            </div>
          </div>
        )}

        <section className="px-6 pt-7">
          <h2 className="font-display text-2xl font-bold">Financial tools</h2>
          <div className="mt-4 space-y-3">
            {tools.map((t) => (
              <button
                key={t.label}
                className="flex w-full items-center gap-4 rounded-2xl bg-card p-4 text-left active:opacity-70"
              >
                <span className="grid size-11 place-items-center rounded-xl bg-black/25 text-primary">
                  <t.icon className="size-5" strokeWidth={2} />
                </span>
                <span className="flex-1">
                  <span className="block text-base font-semibold">{t.label}</span>
                  <span className="block text-xs text-muted-foreground">{t.sub}</span>
                </span>
                <ChevronRight className="size-5 text-muted-foreground" />
              </button>
            ))}
          </div>
        </section>
      </div>

      <TabBar />
    </PhoneFrame>
  );
}

function TabBar() {
  const tabs = [
    { icon: Home, label: "Home", active: true },
    { icon: ArrowLeftRight, label: "Move" },
    { icon: Users, label: "Pay" },
    { icon: Star, label: "Deals" },
    { icon: CircleUserRound, label: "Profile" },
  ];
  return (
    <nav className="absolute inset-x-0 bottom-0 flex items-center justify-around border-t border-border bg-background/95 px-2 pb-5 pt-3 backdrop-blur">
      {tabs.map((t) => (
        <button
          key={t.label}
          className={`flex flex-col items-center gap-1 text-[11px] ${
            t.active ? "text-foreground" : "text-muted-foreground"
          }`}
        >
          <t.icon className="size-6" strokeWidth={t.active ? 2.4 : 1.8} />
          {t.label}
        </button>
      ))}
    </nav>
  );
}
