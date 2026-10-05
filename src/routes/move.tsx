import { createFileRoute, Link } from "@tanstack/react-router";
import {
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
import { InboxBell } from "@/components/InboxBell";

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
  { icon: Download, label: "Set up direct deposit", to: "/direct-deposit" },
  { icon: Smartphone, label: "Use Cash App®, Venmo®, PayPal®" },
  { icon: Repeat, label: "Manage recurring transfers", to: "/recurring" },
  { icon: Users, label: "Send or request money" },
  { icon: Mail, label: "Mail a check", to: "/mail-check" },
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
          <InboxBell className="-ml-3" />
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

type NavIconProps = { className?: string; strokeWidth?: number };
function NavHome({ className }: NavIconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden>
      <path d="M12 2.6c.4 0 .8.15 1.1.43l6.6 6.1c.4.37.6.88.6 1.42V20a1.5 1.5 0 0 1-1.5 1.5H15V16a3 3 0 0 0-6 0v5.5H5.2A1.5 1.5 0 0 1 3.7 20v-9.45c0-.54.22-1.05.6-1.42l6.6-6.1c.3-.28.7-.43 1.1-.43Z" />
    </svg>
  );
}
function NavMove({ className }: NavIconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M7.5 4 3 8.5 7.5 13M3 8.5h13M16.5 11l4.5 4.5-4.5 4.5M21 15.5H8" />
    </svg>
  );
}
function NavPay({ className }: NavIconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth={2} strokeLinejoin="round" aria-hidden>
      <circle cx="7" cy="5.5" r="2.3" />
      <circle cx="17" cy="5.5" r="2.3" />
      <path d="M3 21v-6.5a4 4 0 0 1 8 0V21ZM13 21v-6.5a4 4 0 0 1 8 0V21Z" />
    </svg>
  );
}
function NavDeals({ className }: NavIconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth={2} strokeLinejoin="round" aria-hidden>
      <path d="m12 2.8 2.75 6.1 6.65.6-5.05 4.4 1.5 6.5L12 17l-5.85 3.4 1.5-6.5L2.6 9.5l6.65-.6Z" />
    </svg>
  );
}
function NavProfile({ className }: NavIconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth={2} aria-hidden>
      <circle cx="12" cy="12" r="9.5" />
      <circle cx="12" cy="10" r="3.2" />
      <path d="M5.6 19c1.3-2.4 3.6-3.8 6.4-3.8s5.1 1.4 6.4 3.8" />
    </svg>
  );
}

export function MoveTabBar({ active = "Move" }: { active?: string }) {
  const tabs = [
    { icon: NavHome, label: "Home", to: "/" },
    { icon: NavMove, label: "Move", to: "/move" },
    { icon: NavPay, label: "Pay", to: "/pay" },
    { icon: NavDeals, label: "Deals", to: "/deals" },
    { icon: NavProfile, label: "Profile", to: "/profile" },
  ] as const;
  return (
    <nav
      className="absolute inset-x-0 bottom-0 z-40 flex touch-none select-none items-center justify-around overscroll-none border-t border-border bg-background/95 px-2 pt-2 backdrop-blur"
      style={{ paddingBottom: "max(0.75rem, calc(env(safe-area-inset-bottom) - 0.5rem))" }}
    >
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
        return (
          <Link key={t.label} to={t.to} className={cls}>
            {inner}
          </Link>
        );
      })}
    </nav>
  );
}
