import { createFileRoute, Link } from "@tanstack/react-router";
import { ChevronLeft, ChevronRight, CreditCard, Eye, Lock, Wallet } from "lucide-react";
import { useState } from "react";
import { PhoneFrame } from "@/components/PhoneFrame";
import {
  CARDHOLDER,
  CARD_CVV,
  CARD_EXP,
  CARD_FULL_NUMBER,
  CARD_LAST4,
} from "@/lib/chime-data";

export const Route = createFileRoute("/cards")({
  head: () => ({
    meta: [
      { title: "Virtual Debit Card — Freeze & Manage" },
      {
        name: "description",
        content:
          "Manage your virtual debit card: show the card number, freeze or unfreeze it, replace the number, and activate your physical card.",
      },
      { property: "og:title", content: "Virtual Debit Card — Freeze & Manage" },
      {
        property: "og:description",
        content: "Show, freeze, and replace your virtual debit card number in a few taps.",
      },
    ],
  }),
  component: CardsScreen,
});

function CardsScreen() {
  const [frozen, setFrozen] = useState(true);
  const [showNumber, setShowNumber] = useState(false);

  return (
    <PhoneFrame>
      <div className="flex-1 overflow-y-auto px-6 pb-10 pt-5">
        <div className="relative flex items-center justify-center">
          <Link
            to="/checking"
            aria-label="Back"
            className="absolute left-0 inline-flex active:opacity-60"
          >
            <ChevronLeft className="size-7" strokeWidth={2} />
          </Link>
          <h1 className="text-base font-bold">Virtual debit card</h1>
        </div>

        <div className="mt-6 rounded-2xl bg-[#c9cec9] p-5 text-[#0f1512]">
          <div className="flex items-start justify-between">
            <span className="text-[11px] font-semibold tracking-widest">VIRTUAL CARD</span>
            <span className="font-display text-xl font-extrabold text-[#1b8a4c]">chime</span>
          </div>

          <div className="grid min-h-20 place-items-center py-2">
            {frozen ? (
              <div className="flex flex-col items-center gap-1.5">
                <Lock className="size-6" strokeWidth={2} />
                <span className="text-sm font-semibold">Your virtual card is frozen</span>
              </div>
            ) : (
              <span className="font-display text-lg font-bold tracking-[0.12em]">
                {showNumber ? CARD_FULL_NUMBER : `•••• •••• •••• ${CARD_LAST4}`}
              </span>
            )}
          </div>

          <div className="flex items-end justify-between">
            <div>
              <p className="text-sm font-semibold tracking-wide">{CARDHOLDER}</p>
              <p className="text-sm tracking-widest">
                {showNumber && !frozen ? `${CARD_EXP} · ${CARD_CVV}` : "••••"}
              </p>
            </div>
            <div className="text-right leading-none">
              <p className="text-[10px] font-semibold tracking-widest opacity-70">DEBIT</p>
              <p className="font-display text-2xl font-extrabold italic text-[#1a1f71]">VISA</p>
            </div>
          </div>
        </div>

        <button className="mt-5 flex w-full items-center justify-center gap-3 rounded-xl border border-border py-3.5 text-sm font-semibold active:opacity-70">
          <Wallet className="size-5 text-primary" />
          Add to Apple Wallet
        </button>

        <div className="mt-6 space-y-1">
          <Row
            icon={<Eye className="size-5" />}
            label="Show number"
            control={
              <Toggle
                on={showNumber}
                disabled={frozen}
                onChange={() => setShowNumber((s) => !s)}
                label="Show card number"
              />
            }
          />
          <Row
            icon={<Lock className="size-5" />}
            label="Freeze virtual card"
            control={
              <Toggle
                on={frozen}
                onChange={() => {
                  setFrozen((f) => !f);
                  setShowNumber(false);
                }}
                label="Freeze virtual card"
              />
            }
          />
          <button className="flex w-full items-center gap-4 py-4 text-left active:opacity-70">
            <span className="text-foreground">
              <CreditCard className="size-5" />
            </span>
            <span className="flex-1 text-sm font-semibold">Replace number</span>
            <ChevronRight className="size-5 text-muted-foreground" />
          </button>
        </div>

        <div className="mt-4 flex gap-3 rounded-2xl bg-primary/90 p-4 text-primary-foreground">
          <CreditCard className="mt-0.5 size-5 shrink-0" />
          <div>
            <p className="text-xs leading-snug">
              Check the mail for a green envelope, then activate your card in a few taps.
            </p>
            <button className="mt-2 text-sm font-bold underline underline-offset-2">
              Activate card
            </button>
          </div>
        </div>

        <button className="mt-6 w-full rounded-full border border-border py-3.5 text-sm font-semibold active:opacity-70">
          Manage physical card
        </button>
      </div>
    </PhoneFrame>
  );
}

function Row({
  icon,
  label,
  control,
}: {
  icon: React.ReactNode;
  label: string;
  control: React.ReactNode;
}) {
  return (
    <div className="flex items-center gap-4 py-4">
      <span className="text-foreground">{icon}</span>
      <span className="flex-1 text-sm font-semibold">{label}</span>
      {control}
    </div>
  );
}

function Toggle({
  on,
  onChange,
  label,
  disabled,
}: {
  on: boolean;
  onChange: () => void;
  label: string;
  disabled?: boolean;
}) {
  return (
    <button
      role="switch"
      aria-checked={on}
      aria-label={label}
      disabled={disabled}
      onClick={onChange}
      className={`relative h-7 w-12 rounded-full transition-colors ${
        on ? "bg-primary" : "bg-surface-deep"
      } ${disabled ? "opacity-40" : "active:opacity-80"}`}
    >
      <span
        className={`absolute top-0.5 size-6 rounded-full bg-white transition-all ${
          on ? "left-[22px]" : "left-0.5"
        }`}
      />
    </button>
  );
}
