import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { Check, X } from "lucide-react";
import { PhoneFrame } from "@/components/PhoneFrame";
import { signIn } from "@/lib/session-store";

export const Route = createFileRoute("/signup")({
  head: () => ({
    meta: [
      { title: "Sign up — Chime mobile banking" },
      {
        name: "description",
        content:
          "Create your account in a few steps: basic information, date of birth, mobile phone verification and you're in — no monthly fees, no minimum balance.",
      },
      { property: "og:title", content: "Sign up — Chime mobile banking" },
      {
        property: "og:description",
        content: "Create an account in a minute — no monthly fees, no minimum balance.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: SignUpFlow,
});

const GREEN = "#1EC677";
const DEEP = "#12261F";

type Step = "security" | "basic" | "dob" | "phone" | "code" | "done";

const STAGE: Record<Step, number> = {
  security: 0,
  basic: 0,
  dob: 0,
  phone: 1,
  code: 1,
  done: 2,
};

function SignUpFlow() {
  const navigate = useNavigate();
  const [step, setStep] = useState<Step>("security");
  const [loading, setLoading] = useState(false);

  const [first, setFirst] = useState("");
  const [last, setLast] = useState("");
  const [email, setEmail] = useState("");
  const [human, setHuman] = useState(false);
  const [checking, setChecking] = useState(false);
  const [dob, setDob] = useState("");
  const [phone, setPhone] = useState("");
  const [code, setCode] = useState("");

  const basicValid =
    first.trim().length > 1 && last.trim().length > 1 && /\S+@\S+\.\S+/.test(email.trim());
  const phoneDigits = phone.replace(/\D/g, "");
  const dobValid = isAdult(dob);

  useEffect(() => {
    if (!checking) return;
    const t = window.setTimeout(() => {
      setChecking(false);
      setHuman(true);
    }, 1200);
    return () => window.clearTimeout(t);
  }, [checking]);

  /** Chime shows a brief full-screen spinner between sign-up steps. */
  const go = (next: Step) => {
    setLoading(true);
    window.setTimeout(() => {
      setStep(next);
      setLoading(false);
    }, 900);
  };

  const finish = () => {
    signIn(email.trim(), `${first.trim()} ${last.trim()}`.trim());
    navigate({ to: "/", replace: true });
  };

  const close = () => navigate({ to: "/welcome" });

  return (
    <PhoneFrame topColor="#FBF7F2">
      <div className="flex min-h-full w-full flex-col bg-[#FBF7F2] px-5 pb-6 pt-3 text-[#12261F]">
        <div className="flex items-center justify-between">
          <button
            type="button"
            aria-label="Close sign up"
            onClick={close}
            className="-ml-2 flex size-11 items-center justify-center rounded-full active:opacity-60"
          >
            <X className="size-6" />
          </button>
          {step !== "done" && !loading ? (
            <button
              type="button"
              onClick={() => navigate({ to: "/signin" })}
              className="text-sm font-semibold text-[#1c7a4f]"
            >
              Log in
            </button>
          ) : null}
        </div>

        {loading ? (
          <div className="flex flex-1 items-center justify-center py-24" role="status">
            <span className="size-8 animate-spin rounded-full border-2 border-[#12261F]/20 border-t-[#12261F]/70" />
            <span className="sr-only">Loading next step</span>
          </div>
        ) : (
          <>
            {step !== "security" ? <Progress stage={STAGE[step]} /> : null}

            {step === "security" ? (
              <>
                <p className="mt-8 text-center font-display text-lg font-bold text-[#1c7a4f]">
                  chime
                </p>
                <h1 className="mt-4 text-center font-display text-[24px] font-bold">
                  One more step
                </h1>
                <p className="mt-2 text-center text-sm text-[#12261F]/65">
                  Please complete this security check to access Chime.
                </p>

                <div className="mt-6 rounded-xl border border-[#12261F]/15 bg-white p-4">
                  <button
                    type="button"
                    onClick={() => !human && setChecking(true)}
                    className="flex w-full items-center gap-3 text-left"
                  >
                    <span
                      className={`flex size-6 items-center justify-center rounded-[6px] border ${
                        human ? "border-transparent bg-[#1EC677]" : "border-[#12261F]/35 bg-white"
                      }`}
                    >
                      {checking ? (
                        <span className="size-3.5 animate-spin rounded-full border-2 border-[#12261F]/25 border-t-[#12261F]/70" />
                      ) : human ? (
                        <Check className="size-4 text-white" />
                      ) : null}
                    </span>
                    <span className="text-sm font-medium">Verify you are human</span>
                  </button>
                </div>

                <div className="mt-6 grid grid-cols-2 gap-4 text-[11px] leading-relaxed text-[#12261F]/60">
                  <div>
                    <p className="mb-1 text-xs font-bold text-[#12261F]">
                      Why do I have to complete a CAPTCHA?
                    </p>
                    <p>
                      Completing the CAPTCHA proves you are human and gives you temporary access to
                      the web property.
                    </p>
                  </div>
                  <div>
                    <p className="mb-1 text-xs font-bold text-[#12261F]">
                      What can I do to prevent this in the future?
                    </p>
                    <p>
                      If you are on a personal connection you can run an anti-virus scan to make
                      sure your device is not infected.
                    </p>
                  </div>
                </div>

                <PrimaryButton disabled={!human} onClick={() => go("basic")}>
                  Continue
                </PrimaryButton>
              </>
            ) : null}

            {step === "basic" ? (
              <>
                <h1 className="mt-6 font-display text-[26px] font-bold leading-tight">
                  Let&apos;s get started
                </h1>
                <p className="mt-2 text-sm text-[#12261F]/65">
                  Let&apos;s start with some basic information.
                </p>

                <div className="mt-6 grid grid-cols-2 gap-3">
                  <Field
                    id="first-name"
                    label="First name"
                    value={first}
                    onChange={setFirst}
                    autoComplete="given-name"
                  />
                  <Field
                    id="last-name"
                    label="Last name"
                    value={last}
                    onChange={setLast}
                    autoComplete="family-name"
                  />
                </div>
                <p className="mt-2 text-[11px] text-[#12261F]/55">
                  Use your legal name. You can add a preferred name later.
                </p>

                <div className="mt-4">
                  <Field
                    id="email"
                    label="Email"
                    value={email}
                    onChange={setEmail}
                    autoComplete="email"
                    inputMode="email"
                  />
                </div>

                <PrimaryButton disabled={!basicValid} onClick={() => go("dob")}>
                  Next
                </PrimaryButton>

                <p className="mt-4 text-center text-[11px] text-[#12261F]/55">
                  See <span className="font-semibold underline">legal disclosures</span>
                </p>
              </>
            ) : null}

            {step === "dob" ? (
              <>
                <p className="mt-6 text-center font-display text-lg font-bold text-[#1c7a4f]">
                  chime
                </p>
                <h1 className="mt-3 font-display text-[26px] font-bold leading-tight">
                  Your date of birth
                </h1>
                <p className="mt-2 text-sm text-[#12261F]/65">
                  You must be 18 years old or older to join Chime.
                </p>

                <div className="mt-6">
                  <Field
                    id="dob"
                    label="Date of birth"
                    value={dob}
                    onChange={(v) => setDob(formatDob(v))}
                    inputMode="numeric"
                    placeholder="mm / dd / yyyy"
                    autoComplete="bday"
                  />
                </div>

                <PrimaryButton disabled={!dobValid} onClick={() => go("phone")}>
                  Next
                </PrimaryButton>
              </>
            ) : null}

            {step === "phone" ? (
              <>
                <h1 className="mt-6 font-display text-[26px] font-bold leading-tight">
                  Your mobile phone
                </h1>
                <p className="mt-2 text-sm text-[#12261F]/65">
                  Your number is used to protect your account and keep in touch.
                </p>

                <div className="mt-6">
                  <Field
                    id="phone"
                    label="Mobile phone number (no VOIP)"
                    value={phone}
                    onChange={(v) => setPhone(formatPhone(v))}
                    autoComplete="tel"
                    inputMode="tel"
                  />
                </div>

                <p className="mt-4 text-[11px] leading-relaxed text-[#12261F]/55">
                  By selecting Next, you agree to receive periodic automated marketing text
                  messages. Consent not required, cancel anytime. Message and data rates may apply.
                  By selecting either option below, you agree to receive transactional updates and
                  to the <span className="font-semibold underline">Telephone Use Agreement</span>{" "}
                  and <span className="font-semibold underline">Privacy Notice</span>.
                </p>

                <PrimaryButton disabled={phoneDigits.length !== 10} onClick={() => go("code")}>
                  Next
                </PrimaryButton>

                <button
                  type="button"
                  disabled={phoneDigits.length !== 10}
                  onClick={() => go("code")}
                  className="mt-4 w-full py-2 text-sm font-semibold text-[#12261F]/60 disabled:opacity-40"
                >
                  Get transactional messages only
                </button>
              </>
            ) : null}

            {step === "code" ? (
              <>
                <h1 className="mt-6 font-display text-[26px] font-bold leading-tight">
                  Enter your code
                </h1>
                <p className="mt-2 text-sm text-[#12261F]/65">
                  We sent a 6-digit code to {phone || "your phone"}.
                </p>
                <CodeInput value={code} onChange={setCode} />
                <button
                  type="button"
                  className="mt-4 self-start text-sm font-semibold text-[#1c7a4f]"
                >
                  Resend code
                </button>

                <PrimaryButton disabled={code.length !== 6} onClick={() => go("done")}>
                  Verify
                </PrimaryButton>
              </>
            ) : null}

            {step === "done" ? (
              <>
                <div className="mt-16 flex flex-col items-center text-center">
                  <span
                    className="flex size-20 items-center justify-center rounded-full"
                    style={{ backgroundColor: GREEN }}
                  >
                    <Check className="size-10 text-white" strokeWidth={3} />
                  </span>
                  <h1 className="mt-6 font-display text-[28px] font-bold" style={{ color: DEEP }}>
                    You&apos;re in!
                  </h1>
                  <p className="mt-3 max-w-[16rem] text-sm text-[#12261F]/65">
                    Welcome to Chime, {first || "friend"}. Your Checking Account is ready — set up
                    direct deposit to unlock SpotMe and get paid early.
                  </p>
                </div>
                <PrimaryButton onClick={finish}>Get started</PrimaryButton>
              </>
            ) : null}
          </>
        )}
      </div>
    </PhoneFrame>
  );
}

function Progress({ stage }: { stage: number }) {
  const labels = ["Basic info", "Verification", "You're in!"];
  return (
    <div className="mt-2 flex gap-3">
      {labels.map((label, i) => {
        const active = i <= stage;
        return (
          <div key={label} className="flex-1">
            <div className="flex items-center justify-center">
              <span
                className={`flex size-6 items-center justify-center rounded-full ${
                  active ? "bg-[#1EC677]" : "bg-[#12261F]/12"
                }`}
              >
                {active ? <Check className="size-4 text-white" strokeWidth={3} /> : null}
              </span>
            </div>
            <p
              className={`mt-1 text-center text-[11px] font-semibold ${
                active ? "text-[#12261F]" : "text-[#12261F]/40"
              }`}
            >
              {label}
            </p>
          </div>
        );
      })}
    </div>
  );
}

function PrimaryButton({
  children,
  disabled,
  onClick,
}: {
  children: React.ReactNode;
  disabled?: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className="mt-8 w-full rounded-xl bg-[#12261F] py-4 text-base font-semibold text-white transition-opacity disabled:bg-[#12261F]/12 disabled:text-[#12261F]/40"
    >
      {children}
    </button>
  );
}

function Field({
  id,
  label,
  value,
  onChange,
  inputMode,
  autoComplete,
  placeholder,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (v: string) => void;
  inputMode?: "email" | "text" | "tel" | "numeric";
  autoComplete?: string;
  placeholder?: string;
}) {
  const [focused, setFocused] = useState(false);
  const floating = focused || value.length > 0;
  return (
    <div
      className={`relative rounded-xl border bg-white px-4 pb-2 pt-5 ${
        focused ? "border-[#1EC677] ring-1 ring-[#1EC677]" : "border-[#12261F]/20"
      }`}
    >
      <label
        htmlFor={id}
        className={`pointer-events-none absolute left-4 transition-all ${
          floating
            ? "top-1.5 text-[10px] font-semibold text-[#12261F]/55"
            : "top-4 text-[15px] text-[#12261F]/50"
        }`}
      >
        {label}
      </label>
      <input
        id={id}
        inputMode={inputMode}
        autoComplete={autoComplete}
        placeholder={floating ? placeholder : undefined}
        value={value}
        enterKeyHint="next"
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-transparent text-[15px] text-[#12261F] caret-[#1EC677] outline-none placeholder:text-[#12261F]/35"
      />
    </div>
  );
}

function CodeInput({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const ref = useRef<HTMLInputElement>(null);
  return (
    <button
      type="button"
      onClick={() => ref.current?.focus()}
      className="relative mt-8 flex w-full justify-between gap-2"
      aria-label="Enter verification code"
    >
      {Array.from({ length: 6 }).map((_, i) => (
        <span
          key={i}
          className={`flex h-14 flex-1 items-center justify-center rounded-xl border bg-white text-xl font-semibold ${
            value.length === i ? "border-[#1EC677] ring-1 ring-[#1EC677]" : "border-[#12261F]/20"
          }`}
        >
          {value[i] ?? ""}
        </span>
      ))}
      <input
        ref={ref}
        value={value}
        inputMode="numeric"
        autoComplete="one-time-code"
        aria-label="Verification code"
        onChange={(e) => onChange(e.target.value.replace(/\D/g, "").slice(0, 6))}
        className="absolute size-px opacity-0"
      />
    </button>
  );
}

function formatPhone(raw: string) {
  const d = raw.replace(/\D/g, "").slice(0, 10);
  if (d.length <= 3) return d;
  if (d.length <= 6) return `(${d.slice(0, 3)}) ${d.slice(3)}`;
  return `(${d.slice(0, 3)}) ${d.slice(3, 6)}-${d.slice(6)}`;
}

function formatDob(raw: string) {
  const d = raw.replace(/\D/g, "").slice(0, 8);
  if (d.length <= 2) return d;
  if (d.length <= 4) return `${d.slice(0, 2)} / ${d.slice(2)}`;
  return `${d.slice(0, 2)} / ${d.slice(2, 4)} / ${d.slice(4)}`;
}

function isAdult(value: string) {
  const d = value.replace(/\D/g, "");
  if (d.length !== 8) return false;
  const month = Number(d.slice(0, 2));
  const day = Number(d.slice(2, 4));
  const year = Number(d.slice(4));
  if (month < 1 || month > 12 || day < 1 || day > 31) return false;
  const birth = new Date(year, month - 1, day);
  if (birth.getMonth() !== month - 1 || birth.getDate() !== day) return false;
  const eighteen = new Date(birth.getFullYear() + 18, birth.getMonth(), birth.getDate());
  return eighteen <= new Date();
}
