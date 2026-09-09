import { createFileRoute, Link } from "@tanstack/react-router";
import { ChevronLeft, ChevronRight, Copy, Check, Split, Globe, PiggyBank } from "lucide-react";
import { useState } from "react";
import { PhoneFrame } from "@/components/PhoneFrame";
import { ROUTING_NUMBER, ACCOUNT_NUMBER } from "@/lib/chime-data";

export const Route = createFileRoute("/account-details")({
  head: () => ({
    meta: [
      { title: "Account Details — Routing and Account Numbers" },
      {
        name: "description",
        content:
          "See your Checking account routing number, account number and bank name, view limits and manage split pay and automatic savings.",
      },
      { property: "og:title", content: "Account Details — Routing and Account Numbers" },
      {
        property: "og:description",
        content: "Checking account numbers, limits and account settings.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: AccountDetailsScreen,
});

function AccountDetailsScreen() {
  const [copied, setCopied] = useState<string | null>(null);
  const [intl, setIntl] = useState(false);

  const copy = async (label: string, text: string) => {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      /* clipboard unavailable */
    }
    setCopied(label);
    setTimeout(() => setCopied(null), 1500);
  };

  return (
    <PhoneFrame>
      <div className="flex items-center px-4 pt-5">
        <Link to="/profile" aria-label="Back" className="active:opacity-60">
          <ChevronLeft className="size-6" />
        </Link>
        <span className="flex-1 text-center font-display text-base font-bold">Account details</span>
        <span className="size-6" />
      </div>

      <div className="flex-1 overflow-y-auto px-6 pb-8 pt-6">
        <p className="text-[13px] leading-relaxed text-muted-foreground">
          Use these Checking Account details to transfer to external accounts or set up your direct
          deposit.
        </p>

        <ul className="mt-6">
          <Detail
            label="Routing number"
            value={ROUTING_NUMBER}
            copied={copied === "Routing number"}
            onCopy={() => copy("Routing number", ROUTING_NUMBER)}
          />
          <Detail
            label="Account number"
            value={ACCOUNT_NUMBER}
            copied={copied === "Account number"}
            onCopy={() => copy("Account number", ACCOUNT_NUMBER)}
          />
          <Detail
            label="Bank name"
            value="The Bancorp Bank, N.A."
            copied={copied === "Bank name"}
            onCopy={() => copy("Bank name", "The Bancorp Bank, N.A.")}
          />
        </ul>

        <button
          type="button"
          className="flex w-full items-center justify-between border-b border-border py-5 text-left active:opacity-70"
        >
          <span className="text-[15px]">View limits</span>
          <ChevronRight className="size-5 text-muted-foreground" />
        </button>

        <div className="mt-6 rounded-2xl bg-card">
          <Link
            to="/autosave"
            className="flex w-full items-center gap-4 px-4 py-4 text-left active:opacity-70"
          >
            <Split className="size-5" />
            <span className="flex-1 text-[15px]">Split your pay</span>
            <ChevronRight className="size-5 text-muted-foreground" />
          </Link>

          <div className="flex items-center gap-4 border-t border-border px-4 py-4">
            <Globe className="size-5 text-muted-foreground" />
            <span className="flex-1">
              <span className="block text-[15px] text-muted-foreground">
                International transactions
              </span>
              <span className="block text-[12px] text-muted-foreground">
                Unfreeze card to enable
              </span>
            </span>
            <button
              type="button"
              role="switch"
              aria-checked={intl}
              aria-label="International transactions"
              onClick={() => setIntl((v) => !v)}
              className={`h-7 w-12 rounded-full p-1 transition ${intl ? "bg-primary" : "bg-secondary"}`}
            >
              <span
                className={`block size-5 rounded-full bg-white transition ${intl ? "translate-x-5" : ""}`}
              />
            </button>
          </div>

          <Link
            to="/autosave"
            className="flex w-full items-center gap-4 border-t border-border px-4 py-4 text-left active:opacity-70"
          >
            <PiggyBank className="size-5" />
            <span className="flex-1">
              <span className="block text-[15px]">Automatic savings</span>
              <span className="block text-[12px] text-muted-foreground">Debit purchases</span>
            </span>
            <ChevronRight className="size-5 text-muted-foreground" />
          </Link>
        </div>
      </div>
    </PhoneFrame>
  );
}

function Detail({
  label,
  value,
  copied,
  onCopy,
}: {
  label: string;
  value: string;
  copied: boolean;
  onCopy: () => void;
}) {
  return (
    <li className="flex items-center justify-between border-b border-border py-5">
      <span className="text-[15px]">{label}</span>
      <span className="flex items-center gap-3">
        <span className="text-[15px] text-muted-foreground">{value}</span>
        <button type="button" aria-label={`Copy ${label}`} onClick={onCopy}>
          {copied ? (
            <Check className="size-5 text-primary" />
          ) : (
            <Copy className="size-5 text-muted-foreground" />
          )}
        </button>
      </span>
    </li>
  );
}
