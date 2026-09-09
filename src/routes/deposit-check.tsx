import { createFileRoute, useRouter } from "@tanstack/react-router";
import { ChevronLeft, ChevronRight, Building2, Landmark, CreditCard, Camera, Check } from "lucide-react";
import { useState } from "react";
import { PhoneFrame } from "@/components/PhoneFrame";
import { AmountField } from "@/components/AmountField";
import { useKeyboardInset } from "@/hooks/use-keyboard-inset";
import { usd } from "@/lib/chime-data";

export const Route = createFileRoute("/deposit-check")({
  head: () => ({
    meta: [
      { title: "Deposit a Check — Mobile Check Deposit" },
      {
        name: "description",
        content:
          "Choose your check type, enter the amount and photograph the front and back to deposit a check from your phone.",
      },
      { property: "og:title", content: "Deposit a Check — Mobile Check Deposit" },
      {
        property: "og:description",
        content: "Choose your check type, enter the amount and photograph the front and back.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: DepositCheckScreen,
});

const types = [
  { id: "payroll", icon: Building2, label: "Payroll provider", sub: "Only checks from your employer" },
  { id: "treasury", icon: Landmark, label: "U.S. Treasury", sub: "Only checks from the federal government" },
  {
    id: "other",
    icon: CreditCard,
    label: "Other",
    sub: "Everything else, like state-issued checks, personal checks, retirement, etc.",
  },
] as const;

function DepositCheckScreen() {
  const router = useRouter();
  const kbInset = useKeyboardInset();
  const [step, setStep] = useState<"type" | "amount" | "photos" | "done">("type");
  const [type, setType] = useState<string | null>(null);
  const [amount, setAmount] = useState("0");
  const [front, setFront] = useState(false);
  const [back, setBack] = useState(false);

  const value = Number(amount) || 0;
  const typeLabel = types.find((t) => t.id === type)?.label ?? "";

  function back1() {
    if (step === "type") router.navigate({ to: "/move" });
    else if (step === "amount") setStep("type");
    else if (step === "photos") setStep("amount");
    else setStep("type");
  }

  return (
    <PhoneFrame>
      <div className="flex items-center px-4 pt-5">
        <button aria-label="Back" onClick={back1} className="active:opacity-60">
          <ChevronLeft className="size-7" strokeWidth={2} />
        </button>
      </div>

      {step === "type" && (
        <div className="flex-1 overflow-y-auto px-6 pt-10">
          <h1 className="font-display text-2xl font-bold">What type of check is this?</h1>
          <ul className="mt-6">
            {types.map((t) => (
              <li key={t.id} className="border-b border-white/5 last:border-0">
                <button
                  type="button"
                  onClick={() => {
                    setType(t.id);
                    setStep("amount");
                  }}
                  className="flex w-full items-start gap-4 py-5 text-left active:opacity-70"
                >
                  <t.icon className="mt-0.5 size-5 text-foreground/80" strokeWidth={1.6} />
                  <span className="flex-1">
                    <span className="block text-[15px] font-semibold">{t.label}</span>
                    <span className="block text-xs text-muted-foreground">{t.sub}</span>
                  </span>
                  <ChevronRight className="mt-1 size-5 text-primary" />
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {step === "amount" && (
        <div className="flex flex-1 flex-col px-5">
          <div className="flex flex-1 flex-col items-center justify-center">
            <p className="mb-6 text-sm text-muted-foreground">Enter the check amount</p>
            <AmountField value={amount} onChange={setAmount} />
            <p className="mt-6 text-xs text-muted-foreground">{typeLabel} check</p>
          </div>
          <button
            disabled={value <= 0}
            onClick={() => setStep("photos")}
            style={{ marginBottom: `calc(1rem + ${kbInset}px)` }}
            className="sticky bottom-0 w-full rounded-full bg-primary py-3.5 text-sm font-semibold text-primary-foreground disabled:bg-secondary disabled:text-muted-foreground"
          >
            Next
          </button>
        </div>
      )}

      {step === "photos" && (
        <div className="flex flex-1 flex-col px-6 pt-8">
          <h1 className="font-display text-2xl font-bold">Take a photo of your check</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Place the check on a flat, dark surface and make sure all four corners are visible.
          </p>

          <div className="mt-8 space-y-4">
            <PhotoRow label="Front of check" done={front} onClick={() => setFront(true)} />
            <PhotoRow label="Back of check" sub="Sign the back and write “For Chime mobile deposit”" done={back} onClick={() => setBack(true)} />
          </div>

          <div className="mt-8 rounded-2xl bg-card p-4 text-sm">
            <p className="flex justify-between">
              <span className="text-muted-foreground">Amount</span>
              <span className="font-semibold">{usd(value)}</span>
            </p>
            <p className="mt-2 flex justify-between">
              <span className="text-muted-foreground">Deposit to</span>
              <span className="font-semibold">Checking</span>
            </p>
          </div>

          <button
            disabled={!front || !back}
            onClick={() => setStep("done")}
            className="mt-auto mb-6 w-full rounded-full bg-primary py-3.5 text-sm font-semibold text-primary-foreground disabled:bg-secondary disabled:text-muted-foreground"
          >
            Deposit {usd(value)}
          </button>
        </div>
      )}

      {step === "done" && (
        <div className="flex flex-1 flex-col items-center justify-center px-8 text-center">
          <span className="grid size-16 place-items-center rounded-full bg-primary text-primary-foreground">
            <Check className="size-8" strokeWidth={3} />
          </span>
          <h1 className="mt-6 font-display text-2xl font-extrabold">Check submitted</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            {usd(value)} is being reviewed. Most deposits are available within 5 business days.
          </p>
          <button
            onClick={() => router.navigate({ to: "/move" })}
            className="mt-8 w-full rounded-full bg-primary py-3.5 text-sm font-semibold text-primary-foreground active:opacity-80"
          >
            Done
          </button>
        </div>
      )}
    </PhoneFrame>
  );
}

function PhotoRow({
  label,
  sub,
  done,
  onClick,
}: {
  label: string;
  sub?: string;
  done: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex w-full items-center gap-4 rounded-2xl border border-dashed border-white/15 bg-card p-4 text-left active:opacity-70"
    >
      <span className="grid size-11 place-items-center rounded-xl bg-black/25 text-primary">
        {done ? <Check className="size-5" strokeWidth={3} /> : <Camera className="size-5" />}
      </span>
      <span className="flex-1">
        <span className="block text-sm font-semibold">{label}</span>
        <span className="block text-xs text-muted-foreground">
          {done ? "Captured" : (sub ?? "Tap to capture")}
        </span>
      </span>
    </button>
  );
}
