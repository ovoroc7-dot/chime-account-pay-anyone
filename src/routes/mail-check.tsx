import { createFileRoute, Link, useRouter } from "@tanstack/react-router";
import { ChevronLeft, Check } from "lucide-react";
import { useMemo, useState } from "react";
import { PhoneFrame } from "@/components/PhoneFrame";
import { AmountField } from "@/components/AmountField";
import { useKeyboardInset } from "@/hooks/use-keyboard-inset";
import { usd } from "@/lib/chime-data";

export const Route = createFileRoute("/mail-check")({
  head: () => ({
    meta: [
      { title: "Mail a Check — Send Checks to Anyone" },
      {
        name: "description",
        content:
          "Send a paper check to a business or person. Add a recipient, enter an amount and we mail the check for you.",
      },
      { property: "og:title", content: "Mail a Check — Send Checks to Anyone" },
      {
        property: "og:description",
        content: "Add a recipient, choose an amount and we print and mail the check.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: MailCheckScreen,
});

const STATES = [
  "AL","AK","AZ","AR","CA","CO","CT","DE","FL","GA","HI","ID","IL","IN","IA","KS","KY","LA","ME","MD",
  "MA","MI","MN","MS","MO","MT","NE","NV","NH","NJ","NM","NY","NC","ND","OH","OK","OR","PA","RI","SC",
  "SD","TN","TX","UT","VT","VA","WA","WV","WI","WY",
];

type Step = "intro" | "recipient" | "amount" | "review" | "done";

function MailCheckScreen() {
  const router = useRouter();
  const kb = useKeyboardInset();
  const [step, setStep] = useState<Step>("intro");
  const [kind, setKind] = useState<"Business" | "Individual">("Business");
  const [name, setName] = useState("");
  const [account, setAccount] = useState("");
  const [street, setStreet] = useState("");
  const [apt, setApt] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [zip, setZip] = useState("");
  const [amount, setAmount] = useState("");
  const [memo, setMemo] = useState("");

  const recipientReady = Boolean(
    name.trim() && street.trim() && city.trim() && state && zip.trim().length >= 5,
  );
  const value = Number(amount || "0");
  const amountReady = value > 0;
  const arrival = useMemo(() => {
    const d = new Date();
    d.setDate(d.getDate() + 9);
    return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  }, []);

  const back = () => {
    if (step === "intro") router.history.back();
    else if (step === "recipient") setStep("intro");
    else if (step === "amount") setStep("recipient");
    else if (step === "review") setStep("amount");
    else setStep("intro");
  };

  return (
    <PhoneFrame>
      <div className="flex-1 overflow-y-auto pb-40">
        <div className="sticky top-0 z-10 flex items-center gap-2 bg-background/95 px-4 pt-5 pb-3 backdrop-blur">
          <button type="button" onClick={back} aria-label="Back" className="active:opacity-60">
            <ChevronLeft className="size-6" />
          </button>
          <span className="flex-1 text-center font-display text-base font-bold">
            {step === "recipient"
              ? "Who are you paying?"
              : step === "amount"
                ? "How much?"
                : step === "review"
                  ? "Review check"
                  : ""}
          </span>
          <span className="size-6" />
        </div>

        {step === "intro" && (
          <div className="px-6">
            <div className="mx-auto mt-4 flex h-40 w-full max-w-[240px] items-center justify-center rounded-3xl bg-card">
              <span aria-hidden className="text-6xl">✉️</span>
            </div>
            <h1 className="mt-8 font-display text-2xl font-extrabold">Mail a check from Chime</h1>
            <p className="mt-3 text-[15px] leading-relaxed text-muted-foreground">
              You can send checks to businesses and individuals. Tell us who to send it to and for
              how much and we&apos;ll take care of the rest.
            </p>
            <ul className="mt-6 space-y-3 text-[14px] text-muted-foreground">
              <li>No fee to send a check from your Checking Account</li>
              <li>Checks usually arrive in 7–10 business days</li>
              <li>Money leaves your account when the check is cashed</li>
            </ul>
          </div>
        )}

        {step === "recipient" && (
          <div className="px-5">
            <div className="flex rounded-full bg-card p-1">
              {(["Business", "Individual"] as const).map((k) => (
                <button
                  key={k}
                  type="button"
                  onClick={() => setKind(k)}
                  aria-pressed={kind === k}
                  className={`flex-1 rounded-full py-2.5 text-[14px] font-semibold ${
                    kind === k ? "bg-primary text-primary-foreground" : "text-muted-foreground"
                  }`}
                >
                  {k}
                </button>
              ))}
            </div>

            <div className="mt-5 space-y-3">
              <Field label="Name" value={name} onChange={setName} autoComplete="name" />
              {kind === "Business" && (
                <Field
                  label="Account Number"
                  value={account}
                  onChange={setAccount}
                  inputMode="numeric"
                />
              )}
              <Field label="Street Address or P.O. Box" value={street} onChange={setStreet} />
              <Field label="Apt/Suite #" value={apt} onChange={setApt} />
              <Field label="City" value={city} onChange={setCity} />
              <div className="grid grid-cols-2 gap-3">
                <label className="rounded-xl border border-border bg-transparent px-4 py-3">
                  <span className="block text-[11px] text-muted-foreground">State</span>
                  <select
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    className="w-full bg-transparent text-[15px] outline-none"
                  >
                    <option value="">Select</option>
                    {STATES.map((s) => (
                      <option key={s} value={s} className="text-black">
                        {s}
                      </option>
                    ))}
                  </select>
                </label>
                <Field label="Zip Code" value={zip} onChange={setZip} inputMode="numeric" />
              </div>
            </div>
          </div>
        )}

        {step === "amount" && (
          <div className="px-6">
            <p className="mt-4 text-center text-[13px] text-muted-foreground">
              Paying {name || "recipient"}
            </p>
            <div className="mt-8">
              <AmountField value={amount} onChange={setAmount} label="Check amount" />
            </div>
            <label className="mt-10 block rounded-xl border border-border px-4 py-3">
              <span className="block text-[11px] text-muted-foreground">Memo (optional)</span>
              <input
                value={memo}
                onChange={(e) => setMemo(e.target.value)}
                maxLength={40}
                className="w-full bg-transparent text-[15px] outline-none"
              />
            </label>
          </div>
        )}

        {step === "review" && (
          <div className="px-6">
            <p className="mt-6 text-center font-display text-4xl font-extrabold">{usd(value)}</p>
            <div className="mt-8 divide-y divide-white/5 rounded-2xl bg-card px-4">
              <Row label="To" value={name} />
              <Row label="Type" value={kind} />
              <Row
                label="Address"
                value={`${street}${apt ? `, ${apt}` : ""}, ${city}, ${state} ${zip}`}
              />
              {memo && <Row label="Memo" value={memo} />}
              <Row label="From" value="Chime Checking" />
              <Row label="Fee" value="$0.00" />
              <Row label="Estimated arrival" value={`by ${arrival}`} />
            </div>
            <p className="mt-4 text-[12px] leading-relaxed text-muted-foreground">
              We&apos;ll mail this check for you. The money is withdrawn from your Checking Account
              once the recipient cashes it.
            </p>
          </div>
        )}

        {step === "done" && (
          <div className="flex flex-col items-center px-8 pt-24 text-center">
            <span className="flex size-16 items-center justify-center rounded-full bg-primary">
              <Check className="size-8 text-primary-foreground" strokeWidth={3} />
            </span>
            <h1 className="mt-6 font-display text-2xl font-extrabold">Check on its way</h1>
            <p className="mt-3 text-[15px] text-muted-foreground">
              {usd(value)} to {name}. It should arrive by {arrival}.
            </p>
            <Link
              to="/move"
              className="mt-10 w-full rounded-full bg-card py-4 text-center text-[15px] font-semibold"
            >
              Back to Move Money
            </Link>
          </div>
        )}
      </div>

      {step !== "done" && (
        <div
          className="absolute inset-x-0 bottom-0 bg-background/95 px-5 pb-6 pt-3 backdrop-blur"
          style={{ transform: `translateY(-${kb}px)` }}
        >
          <button
            type="button"
            disabled={
              (step === "recipient" && !recipientReady) || (step === "amount" && !amountReady)
            }
            onClick={() =>
              setStep(
                step === "intro"
                  ? "recipient"
                  : step === "recipient"
                    ? "amount"
                    : step === "amount"
                      ? "review"
                      : "done",
              )
            }
            className="w-full rounded-full bg-primary py-4 text-[16px] font-bold text-primary-foreground disabled:opacity-40"
          >
            {step === "intro"
              ? "Send a check"
              : step === "recipient"
                ? "Add Recipient"
                : step === "amount"
                  ? "Review"
                  : "Send check"}
          </button>
        </div>
      )}
    </PhoneFrame>
  );
}

function Field({
  label,
  value,
  onChange,
  inputMode,
  autoComplete,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  inputMode?: "text" | "numeric";
  autoComplete?: string;
}) {
  return (
    <label className="block rounded-xl border border-border px-4 py-3 focus-within:border-primary">
      <span className="block text-[11px] text-muted-foreground">{label}</span>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        inputMode={inputMode}
        autoComplete={autoComplete}
        aria-label={label}
        className="w-full bg-transparent text-[15px] outline-none"
      />
    </label>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between gap-6 py-4">
      <span className="text-[13px] text-muted-foreground">{label}</span>
      <span className="text-right text-[14px] font-medium">{value}</span>
    </div>
  );
}
