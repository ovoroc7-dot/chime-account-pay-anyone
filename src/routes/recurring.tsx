import { createFileRoute, Link, useRouter } from "@tanstack/react-router";
import { ChevronLeft, ChevronDown, X, Check, Landmark } from "lucide-react";
import { useMemo, useState } from "react";
import { PhoneFrame } from "@/components/PhoneFrame";
import { AmountField } from "@/components/AmountField";
import { ChimeLogo } from "@/components/ChimeLogo";
import { useKeyboardInset } from "@/hooks/use-keyboard-inset";
import { usd, CHECKING_BALANCE } from "@/lib/chime-data";

export const Route = createFileRoute("/recurring")({
  head: () => ({
    meta: [
      { title: "Recurring Transfers — Schedule Automatic Transfers" },
      {
        name: "description",
        content:
          "Set a frequency, pick an amount and schedule an automatic recurring transfer from your linked bank into Checking.",
      },
      { property: "og:title", content: "Recurring Transfers — Schedule Automatic Transfers" },
      {
        property: "og:description",
        content: "Choose weekly, every 2 weeks or monthly and schedule an automatic transfer.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: RecurringScreen,
});

const FREQS = ["Weekly", "Every 2 weeks", "Monthly"] as const;
const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"] as const;
const DATES = ["1st", "15th", "Last day of the month"] as const;

type Freq = (typeof FREQS)[number];
type Step = "frequency" | "amount" | "review" | "done";

function RecurringScreen() {
  const router = useRouter();
  const kb = useKeyboardInset();
  const [step, setStep] = useState<Step>("frequency");
  const [freq, setFreq] = useState<Freq | null>(null);
  const [day, setDay] = useState<string | null>(null);
  const [amount, setAmount] = useState("0");

  const value = Number(amount) || 0;
  const detailReady = freq === "Monthly" ? Boolean(day) : Boolean(freq && day);

  const freqLabel =
    freq === "Weekly"
      ? `Every ${day?.slice(0, 3)}`
      : freq === "Every 2 weeks"
        ? `Every other ${day?.slice(0, 3)}`
        : `Monthly on the ${day}`;

  const nextDate = useMemo(() => {
    const d = new Date();
    d.setDate(d.getDate() + 14);
    return d.toLocaleDateString("en-US", { month: "long", day: "numeric" });
  }, []);

  const back = () => {
    if (step === "frequency") router.navigate({ to: "/move" });
    else if (step === "amount") setStep("frequency");
    else if (step === "review") setStep("amount");
    else router.navigate({ to: "/move" });
  };

  if (step === "frequency") {
    return (
      <PhoneFrame>
        <div className="flex flex-1 flex-col overflow-y-auto px-6 pt-5">
          <button
            type="button"
            aria-label="Close"
            onClick={() => router.navigate({ to: "/move" })}
            className="self-end active:opacity-60"
          >
            <X className="size-6" />
          </button>
          <h1 className="mt-2 font-display text-2xl font-bold">Set frequency</h1>

          <p className="mt-6 text-[11px] font-semibold tracking-widest text-muted-foreground">
            FREQUENCY
          </p>
          <div className="mt-3 flex gap-3">
            {FREQS.map((f) => (
              <button
                key={f}
                type="button"
                aria-pressed={freq === f}
                onClick={() => {
                  setFreq(f);
                  setDay(null);
                }}
                className={`rounded-full border px-4 py-2 text-[13px] ${
                  freq === f
                    ? "border-transparent bg-white font-semibold text-black"
                    : "border-white/25 text-foreground"
                }`}
              >
                {f}
              </button>
            ))}
          </div>

          {freq && (
            <>
              <p className="mt-8 text-[11px] font-semibold tracking-widest text-muted-foreground">
                {freq === "Monthly" ? "DAY OF THE MONTH" : "DAY OF THE WEEK"}
              </p>
              <ul className="mt-4 space-y-4 text-center">
                {(freq === "Monthly" ? DATES : DAYS).map((d) => (
                  <li key={d}>
                    <button
                      type="button"
                      aria-pressed={day === d}
                      onClick={() => setDay(d)}
                      className={`w-full py-1 text-[15px] ${
                        day === d ? "font-bold text-foreground" : "text-muted-foreground"
                      }`}
                    >
                      {d}
                    </button>
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>

        <div className="px-5 pb-6">
          <button
            type="button"
            disabled={!detailReady}
            onClick={() => setStep("amount")}
            className="w-full rounded-full bg-primary py-4 text-[16px] font-bold text-primary-foreground disabled:bg-secondary disabled:text-muted-foreground"
          >
            Save
          </button>
        </div>
      </PhoneFrame>
    );
  }

  return (
    <PhoneFrame>
      <div className="flex items-center px-4 pt-5">
        <button type="button" aria-label="Back" onClick={back} className="active:opacity-60">
          <ChevronLeft className="size-6" />
        </button>
        <span className="flex-1 text-center font-display text-base font-bold">
          {step === "amount" ? "Set amount" : step === "review" ? "Review transfer" : ""}
        </span>
        <span className="size-6" />
      </div>

      {step === "amount" && (
        <div className="flex flex-1 flex-col px-5">
          <div className="mt-10">
            <AmountField value={amount} onChange={setAmount} label="Transfer amount" />
          </div>

          <div className="mt-12 flex items-start justify-center gap-8">
            <AccountCol
              caption="From"
              name="SoFi Checking"
              sub="$78.06 as of 32 minutes ago"
              external
            />
            <span className="mt-10 text-muted-foreground">→</span>
            <AccountCol caption="To" name="Checking" sub={usd(CHECKING_BALANCE)} />
          </div>

          <button
            type="button"
            disabled={value <= 0}
            onClick={() => setStep("review")}
            style={{ marginBottom: `calc(1.5rem + ${kb}px)` }}
            className="sticky bottom-0 mt-auto w-full rounded-full bg-primary py-4 text-[16px] font-bold text-primary-foreground disabled:bg-secondary disabled:text-muted-foreground"
          >
            Review
          </button>
        </div>
      )}

      {step === "review" && (
        <div className="flex flex-1 flex-col px-6">
          <p className="mt-8 text-center font-display text-5xl font-extrabold">{usd(value)}</p>

          <div className="mt-12 space-y-6 text-[14px]">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">From</span>
              <span className="flex items-center gap-2 font-medium">
                <span className="grid size-5 place-items-center rounded-full bg-secondary">
                  <Landmark className="size-3" />
                </span>
                SoFi Checking
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">To</span>
              <span className="flex items-center gap-2 font-medium">
                <ChimeLogo className="size-5" />
                Checking
              </span>
            </div>
            <div className="flex items-center justify-between pt-4">
              <span className="text-muted-foreground">Frequency</span>
              <button
                type="button"
                onClick={() => setStep("frequency")}
                className="flex items-center gap-1 rounded-full bg-secondary px-3 py-1.5 text-[13px] font-medium active:opacity-70"
              >
                {freqLabel}
                <ChevronDown className="size-4" />
              </button>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Next transfer</span>
              <span className="font-medium">{nextDate}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Availability</span>
              <span className="font-medium">1–5 business days</span>
            </div>
          </div>

          <p className="mt-auto text-center text-[11px] leading-relaxed text-muted-foreground">
            By tapping Schedule, you authorize Chime to do a recurring transfer of the above amount
            from this external bank account.
          </p>
          <button
            type="button"
            onClick={() => setStep("done")}
            className="mb-6 mt-4 w-full rounded-full bg-primary py-4 text-[16px] font-bold text-primary-foreground active:opacity-80"
          >
            Schedule
          </button>
        </div>
      )}

      {step === "done" && (
        <div className="flex flex-1 flex-col items-center justify-center px-8 text-center">
          <span className="grid size-16 place-items-center rounded-full bg-primary text-primary-foreground">
            <Check className="size-8" strokeWidth={3} />
          </span>
          <h1 className="mt-6 font-display text-2xl font-extrabold">Transfer scheduled</h1>
          <p className="mt-3 text-[15px] text-muted-foreground">
            {usd(value)} {freqLabel.toLowerCase()} from SoFi Checking to Checking, starting{" "}
            {nextDate}.
          </p>
          <Link
            to="/move"
            className="mt-10 w-full rounded-full bg-card py-4 text-center text-[15px] font-semibold"
          >
            Back to Move Money
          </Link>
        </div>
      )}
    </PhoneFrame>
  );
}

function AccountCol({
  caption,
  name,
  sub,
  external,
}: {
  caption: string;
  name: string;
  sub: string;
  external?: boolean;
}) {
  return (
    <div className="max-w-[130px] text-center">
      <p className="text-[11px] text-muted-foreground">{caption}</p>
      <span className="mx-auto mt-2 grid size-8 place-items-center">
        {external ? (
          <span className="grid size-8 place-items-center rounded-full bg-secondary">
            <Landmark className="size-4" />
          </span>
        ) : (
          <ChimeLogo className="size-8" />
        )}
      </span>
      <p className="mt-2 text-[14px] font-semibold">{name}</p>
      <p className="text-[11px] text-muted-foreground">{sub}</p>
    </div>
  );
}
