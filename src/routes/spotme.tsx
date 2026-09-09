import { createFileRoute, useRouter } from "@tanstack/react-router";
import { ChevronLeft, HelpCircle, Check } from "lucide-react";
import { useState } from "react";
import { PhoneFrame } from "@/components/PhoneFrame";
import spotmeArt from "@/assets/spotme.png";

export const Route = createFileRoute("/spotme")({
  head: () => ({
    meta: [
      { title: "Unlock SpotMe — Fee-free overdraft up to $200" },
      {
        name: "description",
        content:
          "SpotMe covers you when you need it with up to $200 in fee-free overdraft. Set up direct deposit to unlock coverage.",
      },
      { property: "og:title", content: "Unlock SpotMe — Fee-free overdraft up to $200" },
      {
        property: "og:description",
        content:
          "Move your paycheck over to get covered with up to $200 in fee-free overdraft.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: SpotMeScreen,
});

function SpotMeScreen() {
  const router = useRouter();
  const [sheet, setSheet] = useState(false);
  const [done, setDone] = useState(false);

  return (
    <PhoneFrame>
      <div className="flex items-center justify-between px-5 pt-5">
        <button aria-label="Back" onClick={() => router.navigate({ to: "/" })} className="active:opacity-60">
          <ChevronLeft className="size-7" strokeWidth={2} />
        </button>
        <button aria-label="Help" className="text-muted-foreground active:opacity-60">
          <HelpCircle className="size-6" strokeWidth={1.8} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-6 pt-6">
        <img
          src={spotmeArt}
          alt="Dollar coin floating down under a green parachute"
          loading="lazy"
          width={768}
          height={768}
          className="mx-auto size-56 object-contain"
        />

        <h1 className="mt-8 font-display text-3xl font-extrabold text-primary">
          Unlock SpotMe with Chime+
        </h1>
        <p className="mt-4 text-sm leading-relaxed text-foreground/90">
          SpotMe covers you when you need it, with up to $200 fee-free overdraft.
          <sup className="text-muted-foreground">1</sup>
        </p>
        <p className="mt-4 text-sm leading-relaxed text-foreground/90">
          To get covered, upgrade to Chime+ by moving your paycheck to Chime.
        </p>

        <div className="mt-8 space-y-3">
          {[
            "No overdraft fees, ever",
            "Your limit grows as you use it",
            "We spot you at checkout automatically",
          ].map((t) => (
            <div key={t} className="flex items-center gap-3 rounded-2xl bg-card p-4 text-sm">
              <span className="grid size-7 shrink-0 place-items-center rounded-full bg-primary text-primary-foreground">
                <Check className="size-4" strokeWidth={3} />
              </span>
              {t}
            </div>
          ))}
        </div>

        <p className="mt-6 pb-6 text-[11px] leading-relaxed text-muted-foreground">
          1. SpotMe limits start at $20 and may be increased up to $200 based on eligibility.
          Limits are subject to change at any time.
        </p>
      </div>

      <div className="px-6 pb-8 pt-2">
        <button
          onClick={() => setSheet(true)}
          className="w-full rounded-full bg-primary py-4 text-base font-semibold text-primary-foreground active:opacity-80"
        >
          Set up direct deposit
        </button>
      </div>

      {sheet && (
        <div className="absolute inset-0 z-20 flex flex-col justify-end bg-black/60">
          <button
            aria-label="Close"
            className="flex-1"
            onClick={() => {
              setSheet(false);
              setDone(false);
            }}
          />
          <div className="rounded-t-3xl bg-popover px-6 pb-8 pt-6">
            <span className="mx-auto mb-5 block h-1 w-10 rounded-full bg-white/20" />
            {done ? (
              <>
                <h2 className="font-display text-2xl font-bold">Details sent</h2>
                <p className="mt-2 text-sm text-muted-foreground">
                  We emailed your direct deposit form. SpotMe unlocks after your first qualifying
                  deposit of $200 or more.
                </p>
              </>
            ) : (
              <>
                <h2 className="font-display text-2xl font-bold">Set up direct deposit</h2>
                <p className="mt-2 text-sm text-muted-foreground">
                  Choose how you'd like to move your paycheck over.
                </p>
                <div className="mt-5 space-y-3">
                  <button
                    onClick={() => setDone(true)}
                    className="w-full rounded-2xl bg-card p-4 text-left text-sm font-semibold active:opacity-70"
                  >
                    Find my employer
                    <span className="mt-1 block text-xs font-normal text-muted-foreground">
                      Switch your deposit in a few taps
                    </span>
                  </button>
                  <button
                    onClick={() => setDone(true)}
                    className="w-full rounded-2xl bg-card p-4 text-left text-sm font-semibold active:opacity-70"
                  >
                    Get a pre-filled form
                    <span className="mt-1 block text-xs font-normal text-muted-foreground">
                      Hand it to your payroll team
                    </span>
                  </button>
                </div>
              </>
            )}
            <button
              onClick={() => {
                setSheet(false);
                setDone(false);
              }}
              className="mt-5 w-full rounded-full bg-white/10 py-3.5 text-sm font-semibold active:opacity-70"
            >
              {done ? "Done" : "Not now"}
            </button>
          </div>
        </div>
      )}
    </PhoneFrame>
  );
}
