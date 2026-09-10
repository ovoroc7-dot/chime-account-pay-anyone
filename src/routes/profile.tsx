import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import {
  Bell,
  QrCode,
  Heart,
  User,
  Download,
  CreditCard,
  IdCard,
  Umbrella,
  FileText,
  Lock,
  Sun,
  ChevronRight,
  Plus,
  LifeBuoy,
  ShieldCheck,
} from "lucide-react";
import { PhoneFrame } from "@/components/PhoneFrame";
import { InboxBell } from "@/components/InboxBell";
import { useUnreadCount } from "@/lib/inbox-store";
import { MoveTabBar } from "@/routes/move";
import { signOut, useRequireSession } from "@/lib/session-store";

export const Route = createFileRoute("/profile")({
  head: () => ({
    meta: [
      { title: "Profile — Account Settings and Preferences" },
      {
        name: "description",
        content:
          "Manage personal info, account details, cards, SpotMe, documents and preferences like privacy, notifications and appearance.",
      },
      { property: "og:title", content: "Profile — Account Settings and Preferences" },
      {
        property: "og:description",
        content: "Your account settings, referrals, support and app preferences in one place.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ProfileScreen,
});

function ProfileScreen() {
  const unread = useUnreadCount();
  const notificationSub = unread > 0 ? `${unread} unread` : "All caught up";

  return (
    <PhoneFrame>
      <div className="flex-1 overflow-y-auto px-6 pb-28 pt-5">
        <div className="flex items-center justify-between">
          <InboxBell className="-ml-3" />
          <button type="button" aria-label="Your QR code" className="active:opacity-60">
            <QrCode className="size-6" />
          </button>
        </div>

        <div className="mt-5 flex items-start justify-between">
          <div>
            <h1 className="font-display text-3xl font-extrabold">Denis Trufin</h1>
            <p className="mt-1 text-[14px] text-muted-foreground">$Denis-Trufin</p>
            <p className="text-[14px] text-muted-foreground">Member since 2021</p>
          </div>
          <span className="grid size-16 shrink-0 place-items-center rounded-full bg-card font-display text-2xl font-bold">
            D
          </span>
        </div>

        <button
          type="button"
          className="mt-4 flex items-center gap-2 rounded-full bg-primary/20 px-4 py-2 text-[13px] font-semibold text-primary"
        >
          <Plus className="size-4" strokeWidth={3} /> Get Chime+
        </button>

        <div className="mt-6 grid grid-cols-2 gap-4">
          <Card icon={LifeBuoy} title="Help Center" sub="FAQs or chat with us" />
          <Card icon={ShieldCheck} title="Security Center" sub="Protect your account" />
        </div>

        <Section title="Refer a friend">
          <Row icon={Heart} title="Invite friends" sub="Get $200 when they join" />
        </Section>

        <Section title="Account">
          <Row icon={User} title="Personal info" sub="Update details, $ChimeSign & photo" />
          <Row
            icon={Download}
            title="Direct deposit setup"
            sub="Get paid in Chime"
            to="/direct-deposit"
          />
          <Row
            icon={IdCard}
            title="Account details"
            sub="See account numbers, limits, settings"
            to="/account-details"
          />
          <Row icon={CreditCard} title="Cards" sub="Manage virtual & physical cards" to="/cards" />
          <Row icon={Umbrella} title="SpotMe" sub="Fee-free overdraft" to="/spotme" />
          <Row icon={FileText} title="Documents" sub="Statements, tax forms & policies" />
        </Section>

        <Section title="Preferences">
          <Row icon={Lock} title="Privacy" />
          <Row icon={Bell} title="Notifications" sub={notificationSub} to="/inbox" />
          <Row icon={Sun} title="Appearance" to="/appearance" />
        </Section>

        <button
          type="button"
          onClick={() => {
            signOut();
            navigate({ to: "/welcome", replace: true });
          }}
          className="mt-8 w-full rounded-full bg-card py-4 text-[15px] font-semibold"
        >
          Sign out
        </button>
        <p className="mt-5 text-center text-[11px] text-muted-foreground">
          Made with love in California
        </p>
        <p className="text-center text-[11px] text-muted-foreground">Version 5.297.0-136653</p>
      </div>

      <MoveTabBar active="Profile" />
    </PhoneFrame>
  );
}

function Card({
  icon: Icon,
  title,
  sub,
}: {
  icon: typeof Heart;
  title: string;
  sub: string;
}) {
  return (
    <button type="button" className="rounded-2xl bg-card p-4 text-left active:opacity-70">
      <Icon className="size-8 text-primary" />
      <p className="mt-5 text-[15px] font-semibold">{title}</p>
      <p className="text-[12px] text-muted-foreground">{sub}</p>
    </button>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mt-8">
      <h2 className="font-display text-xl font-bold">{title}</h2>
      <ul className="mt-2">{children}</ul>
    </section>
  );
}

function Row({
  icon: Icon,
  title,
  sub,
  to,
}: {
  icon: typeof Heart;
  title: string;
  sub?: string;
  to?: string;
}) {
  const inner = (
    <>
      <Icon className="size-6 text-foreground" strokeWidth={1.7} />
      <span className="flex-1">
        <span className="block text-[15px] font-semibold">{title}</span>
        {sub && <span className="block text-[12px] text-muted-foreground">{sub}</span>}
      </span>
      <ChevronRight className="size-5 text-muted-foreground" />
    </>
  );
  const cls = "flex w-full items-center gap-4 py-4 text-left active:opacity-70";
  return (
    <li>
      {to ? (
        <Link to={to} className={cls}>
          {inner}
        </Link>
      ) : (
        <button type="button" className={cls}>
          {inner}
        </button>
      )}
    </li>
  );
}
