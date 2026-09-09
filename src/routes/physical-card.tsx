import { createFileRoute, Link } from "@tanstack/react-router";
import { ChevronLeft } from "lucide-react";
import { useState } from "react";
import { PhoneFrame } from "@/components/PhoneFrame";
import { CARDHOLDER } from "@/lib/chime-data";

export const Route = createFileRoute("/physical-card")({
  head: () => ({
    meta: [
      { title: "Physical Debit Card — Activate Your Card" },
      {
        name: "description",
        content:
          "Activate your physical debit card in a few taps, or let us know if your green envelope hasn't arrived in the mail yet.",
      },
      { property: "og:title", content: "Physical Debit Card — Activate Your Card" },
      {
        property: "og:description",
        content: "Activate the debit card that arrived in the mail, or report a card that never showed up.",
      },
    ],
  }),
  component: PhysicalCardScreen,
});

function PhysicalCardScreen() {
  const [activated, setActivated] = useState(false);
  const [notArrived, setNotArrived] = useState(false);

  return (
    <PhoneFrame>
      <div className="flex flex-1 flex-col overflow-y-auto px-6 pb-8 pt-5">
        <div className="relative flex items-center justify-center">
          <Link
            to="/cards"
            aria-label="Back"
            className="absolute left-0 inline-flex active:opacity-60"
          >
            <ChevronLeft className="size-7" strokeWidth={2} />
          </Link>
          <h1 className="text-base font-bold">Physical debit card</h1>
        </div>

        <div className="mt-6 rounded-2xl bg-[#c9cec9] p-5 text-[#0f1512]">
          <div className="flex items-start justify-between">
            <span className="text-[11px] font-semibold tracking-widest">PHYSICAL CARD</span>
            <span className="font-display text-xl font-extrabold text-[#1b8a4c]">chime</span>
          </div>

          <div className="h-14" />

          <div className="flex items-end justify-between">
            <div>
              <p className="text-sm font-semibold tracking-wide">{CARDHOLDER}</p>
              <p className="text-sm tracking-widest">••••</p>
            </div>
            <div className="text-right leading-none">
              <p className="text-[10px] font-semibold tracking-widest opacity-70">DEBIT</p>
              <p className="font-display text-2xl font-extrabold italic text-[#1a1f71]">VISA</p>
            </div>
          </div>
        </div>

        <div className="mt-7">
          <h2 className="text-lg font-bold">
            {activated ? "Your card is active" : "Activate your physical card"}
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            {activated
              ? "You're all set — start swiping, tapping, and withdrawing cash with your physical card."
              : "Check the mail for a green envelope, then activate your card in a few taps."}
          </p>
          {!activated && (
            <button
              onClick={() => setNotArrived(true)}
              className="mt-4 text-sm font-medium underline underline-offset-4 active:opacity-70"
            >
              My card hasn't arrived
            </button>
          )}
          {notArrived && !activated && (
            <div className="mt-4 rounded-2xl bg-surface-deep p-4">
              <p className="text-sm leading-relaxed text-muted-foreground">
                Cards usually arrive within 7–10 business days. If it's been longer, we can cancel
                that card and mail you a new one for free.
              </p>
              <button className="mt-3 text-sm font-bold text-primary underline underline-offset-4">
                Order a replacement card
              </button>
            </div>
          )}
        </div>

        <button
          onClick={() => setActivated(true)}
          disabled={activated}
          className="mt-auto w-full rounded-full bg-primary py-4 text-sm font-bold text-primary-foreground active:opacity-80 disabled:opacity-50"
        >
          {activated ? "Card activated" : "Activate card"}
        </button>
      </div>
    </PhoneFrame>
  );
}
