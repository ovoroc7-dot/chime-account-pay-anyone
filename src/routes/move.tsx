import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Bell,
  ChevronRight,
  Home,
  ArrowLeftRight,
  Users,
  Star,
  CircleUserRound,
  Download,
  Smartphone,
  Repeat,
  Mail,
  Landmark,
  Banknote,
  ScanLine,
  MapPin,
  ScrollText,
} from "lucide-react";
import { useState } from "react";
import { PhoneFrame } from "@/components/PhoneFrame";

export const Route = createFileRoute("/move")({
  head: () => ({
    meta: [
      { title: "Move Money — Transfers, Deposits and ATMs" },
      {
        name: "description",
        content:
          "Transfer money, deposit a check, deposit cash, find an ATM, set up direct deposit and manage linked accounts.",
      },
      { property: "og:title", content: "Move Money — Transfers, Deposits and ATMs" },
      {
        property: "og:description",
        content:
          "Transfer money, deposit a check or cash, find an ATM and manage recurring transfers and linked accounts.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: MoveScreen,
});

const rows = [
  { icon: Download, label: "Set up direct deposit" },
  { icon: Smartphone, label: "Use Cash App®, Venmo®, PayPal®" },
  { icon: Repeat, label: "Manage recurring transfers" },
  { icon: Users, label: "Send or request money" },
  { icon: Mail, label: "Mail a check" },
  { icon: Landmark, label: "Manage linked accounts", to: "/linked-accounts" },
  { icon: ScrollText, label: "Transfer limits" },
] as const;

function MoveScreen() {
  const [scrolled, setScrolled] = useState(false);

  return (
    <PhoneFrame>
      <div
        onScroll={(e) => setScrolled(e.currentTarget.scrollTop > 40)}
        className="flex-1 overflow-y-auto pb-28"
      >
        <div className="sticky top-0 z-10 flex items-center justify-between bg-background/95 px-6 pt-5 pb-3 backdrop-blur">
          <Link to="/inbox" aria-label="Inbox" className="active:opacity-60">
            <Bell className="size-6" strokeWidth={1.75} />
          </Link>
          <span
            className={`font-display text-base font-bold transition-opacity ${
              scrolled ? "opacity-100" : "opacity-0"
            }`}
          >
            Move Money
          </span>
          <span className="size-6" />
        </div>

        <h1 className="px-6 pb-5 font-display text-4xl font-extrabold tracking-tight">Move Money</h1>

        <div className="grid grid-cols-2 gap-3 px-5">
          <Tile to="/transfer" label="Transfer money">
            <Banknote className="size-10 text-primary" strokeWidth={1.5} />
          </Tile>
          <Tile to="/deposit-check" label="Deposit check">
            <Mail className="size-10 text-foreground/80" strokeWidth={1.5} />
          </Tile>
          <Tile label="Find an ATM">
            <MapPin className="size-10 text-foreground/80" strokeWidth={1.5} />
          </Tile>
          <Tile label="Deposit cash">
            <ScanLine className="size-10 text-primary" strokeWidth={1.5} />
          </Tile>
        </div>

        <ul className="mt-6 px-6">
          {rows.map((r) => {
            const inner = (
              <>
                <r.icon className="size-5 text-foreground/80" strokeWidth={1.6} />
                <span className="flex-1 text-[15px] font-medium">{r.label}</span>
                <ChevronRight className="size-5 text-muted-foreground" />
              </>
            );
            return (
              <li key={r.label} className="border-b border-white/5 last:border-0">
                {"to" in r && r.to ? (
                  <Link to={r.to} className="flex w-full items-center gap-4 py-5 text-left active:opacity-70">
                    {inner}
                  </Link>
                ) : (
                  <button
                    type="button"
                    className="flex w-full items-center gap-4 py-5 text-left active:opacity-70"
                  >
                    {inner}
                  </button>
                )}
              </li>
            );
          })}
        </ul>
      </div>

      <MoveTabBar />
    </PhoneFrame>
  );
}

function Tile({
  label,
  to,
  children,
}: {
  label: string;
  to?: string;
  children: React.ReactNode;
}) {
  const body = (
    <>
      <span className="text-[15px] font-semibold">{label}</span>
      <span className="mt-4 block">{children}</span>
    </>
  );
  const cls =
    "flex h-[132px] flex-col rounded-2xl bg-card p-4 text-left active:opacity-70";
  return to ? (
    <Link to={to} className={cls}>
      {body}
    </Link>
  ) : (
    <button type="button" className={cls}>
      {body}
    </button>
  );
}

export function MoveTabBar({ active = "Move" }: { active?: string }) {
  const tabs = [
    { icon: Home, label: "Home", to: "/" },
    { icon: ArrowLeftRight, label: "Move", to: "/move" },
    { icon: Users, label: "Pay" },
    { icon: Star, label: "Deals" },
    { icon: CircleUserRound, label: "Profile" },
  ] as const;
  return (
    <nav className="absolute inset-x-0 bottom-0 flex items-center justify-around border-t border-border bg-background/95 px-2 pb-5 pt-3 backdrop-blur">
      {tabs.map((t) => {
        const isActive = t.label === active;
        const cls = `flex flex-col items-center gap-1 text-[11px] ${
          isActive ? "text-foreground" : "text-muted-foreground"
        }`;
        const inner = (
          <>
            <t.icon className="size-6" strokeWidth={isActive ? 2.4 : 1.8} />
            {t.label}
          </>
        );
        return "to" in t && t.to ? (
          <Link key={t.label} to={t.to} className={cls}>
            {inner}
          </Link>
        ) : (
          <button key={t.label} type="button" className={cls}>
            {inner}
          </button>
        );
      })}
    </nav>
  );
}
