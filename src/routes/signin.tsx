import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { ChevronLeft, Eye, EyeOff, X } from "lucide-react";
import chimeWordmark from "@/assets/chime-wordmark.png.asset.json";
import { PhoneFrame } from "@/components/PhoneFrame";
import { useKeyboardInset } from "@/hooks/use-keyboard-inset";
import { ACCOUNT, signIn, verifyCredentials } from "@/lib/session-store";

export const Route = createFileRoute("/signin")({
  head: () => ({
    meta: [
      { title: "Log in — Chime mobile banking" },
      {
        name: "description",
        content:
          "Log in with your email and password to see balances, transfers and card controls.",
      },
      { property: "og:title", content: "Log in — Chime mobile banking" },
      {
        property: "og:description",
        content: "Log in securely with your email address and password.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: SignInScreen,
});

type Step = "email" | "loading-method" | "method" | "password" | "loading-home";

function Spinner() {
  return (
    <span
      role="status"
      aria-label="Loading"
      className="block size-8 animate-spin rounded-full border-[3px] border-black/10 border-t-[#0b3b26] dark:border-white/15 dark:border-t-[#3ec25f]"
    />
  );
}

function SignInScreen() {
  const navigate = useNavigate();
  const kb = useKeyboardInset();
  const [step, setStep] = useState<Step>("email");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [error, setError] = useState("");
  const emailRef = useRef<HTMLInputElement>(null);

  const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
  const pwValid = password.length > 0;

  useEffect(() => {
    if (step !== "loading-method" && step !== "loading-home") return;
    const t = setTimeout(() => {
      if (step === "loading-method") setStep("method");
      else {
        signIn(ACCOUNT.email, ACCOUNT.name);
        navigate({ to: "/", replace: true });
      }
    }, 1600);
    return () => clearTimeout(t);
  }, [step, navigate]);

  function back() {
    if (step === "password") setStep("method");
    else if (step === "method") setStep("email");
    else navigate({ to: "/welcome" });
  }

  function submit() {
    if (!pwValid) return;
    if (!verifyCredentials(email, password)) {
      setError("The email or password you entered is incorrect.");
      return;
    }
    setStep("loading-home");
  }

  const loading = step === "loading-method" || step === "loading-home";

  return (
    <PhoneFrame topClass="bg-white dark:bg-[#0c1d14]">
      <div className="flex h-full w-full flex-col bg-white text-[#0b1f16] dark:bg-[#0c1d14] dark:text-white">
        <div className="px-4 pt-3">
          <button
            type="button"
            aria-label="Go back"
            onClick={back}
            className="-ml-1 flex size-11 items-center justify-center rounded-full active:opacity-60"
          >
            <ChevronLeft className="size-7 text-[#0b3b26] dark:text-white" strokeWidth={2} />
          </button>
        </div>

        {loading ? (
          <div className="flex flex-1 items-center justify-center">
            <Spinner />
          </div>
        ) : (
          <div
            className="flex flex-1 flex-col px-6 pb-8"
            style={kb ? { paddingBottom: kb + 16 } : undefined}
          >
            <img
              src={chimeWordmark.url}
              alt="Chime"
              className="mt-6 h-8 w-auto self-start object-contain"
            />

            {step === "email" && (
              <>
                <h1 className="mt-10 font-display text-[30px] font-bold leading-tight">
                  Log in with your email
                </h1>

                <div className="relative mt-6">
                  <label
                    htmlFor="email"
                    className="pointer-events-none absolute left-4 top-2.5 text-xs text-[#0b1f16]/60 dark:text-white/60"
                  >
                    Email
                  </label>
                  <input
                    id="email"
                    ref={emailRef}
                    autoFocus
                    type="email"
                    inputMode="email"
                    enterKeyHint="next"
                    autoComplete="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      setError("");
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && emailValid) setStep("loading-method");
                    }}
                    className="w-full rounded-2xl border-2 border-[#0b1f16] bg-white px-4 pb-3 pt-7 text-lg outline-none placeholder:text-[#0b1f16]/40 dark:border-white dark:bg-[#123024] dark:text-white dark:placeholder:text-white/50"
                  />
                  {email ? (
                    <button
                      type="button"
                      aria-label="Clear email"
                      onClick={() => {
                        setEmail("");
                        emailRef.current?.focus();
                      }}
                      className="absolute right-1 top-1/2 flex size-11 -translate-y-1/2 items-center justify-center rounded-full text-[#0b1f16]/40 dark:text-white/60"
                    >
                      <X className="size-5" strokeWidth={2.5} />
                    </button>
                  ) : null}
                </div>

                <button
                  type="button"
                  className="mt-5 self-start text-[15px] font-semibold text-[#1a9c57] dark:text-[#3ec25f]"
                >
                  Forgot email?
                </button>

                <button
                  type="button"
                  disabled={!emailValid}
                  onClick={() => setStep("loading-method")}
                  className="mt-auto w-full rounded-full bg-[#14c25a] py-4 text-base font-semibold text-[#0b1f16] disabled:bg-[#a9e8c3] disabled:text-[#0b1f16]/40 dark:bg-[#1a6b41] dark:text-white dark:disabled:bg-[#1a6b41]/40 dark:disabled:text-white/40"
                >
                  Next
                </button>
              </>
            )}

            {step === "method" && (
              <>
                <h1 className="mt-10 font-display text-[30px] font-bold leading-tight">
                  How would you like to log in?
                </h1>

                <button
                  type="button"
                  onClick={() => setStep("password")}
                  className="mt-6 w-full rounded-2xl border border-[#0b1f16]/20 px-5 py-6 text-left text-base font-medium active:opacity-70 dark:border-white/25"
                >
                  Use my password
                </button>
                <button
                  type="button"
                  onClick={() => setStep("password")}
                  className="mt-4 w-full rounded-2xl border border-[#0b1f16]/20 px-5 py-6 text-left text-base font-medium active:opacity-70 dark:border-white/25"
                >
                  Verify with my ID
                </button>
              </>
            )}

            {step === "password" && (
              <>
                <p className="mt-8 text-sm text-[#0b1f16]/70 dark:text-white/70">Email Address</p>
                <p className="mt-1 break-all text-sm">{email}</p>

                <div className="relative mt-5">
                  <label
                    htmlFor="password"
                    className="pointer-events-none absolute left-4 top-2.5 text-xs text-[#0b1f16]/60 dark:text-white/60"
                  >
                    Password
                  </label>
                  <input
                    id="password"
                    autoFocus
                    type={show ? "text" : "password"}
                    enterKeyHint="go"
                    autoComplete="current-password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      setError("");
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") submit();
                    }}
                    className="w-full rounded-2xl border-2 border-[#0b1f16] bg-white px-4 pb-3 pr-14 pt-7 text-lg outline-none placeholder:text-[#0b1f16]/40 dark:border-white dark:bg-[#123024] dark:text-white dark:placeholder:text-white/50"
                  />
                  <button
                    type="button"
                    aria-label={show ? "Hide password" : "Show password"}
                    onClick={() => setShow((v) => !v)}
                    className="absolute right-1 top-1/2 flex size-11 -translate-y-1/2 items-center justify-center rounded-full text-[#0b1f16]/60 dark:text-white/70"
                  >
                    {show ? <EyeOff className="size-5" /> : <Eye className="size-5" />}
                  </button>
                </div>

                <button
                  type="button"
                  className="mt-5 self-start text-[15px] font-semibold text-[#1a9c57] dark:text-[#3ec25f]"
                >
                  Forgot password?
                </button>

                {error ? (
                  <p role="alert" className="mt-3 text-sm text-[#c2382f] dark:text-[#ffb4b4]">
                    {error}
                  </p>
                ) : null}

                <p className="mt-auto pt-8 text-xs text-[#0b1f16]/60 dark:text-white/60">
                  By clicking “Next”, you agree to receive SMS text messages from Chime to verify
                  your identity
                </p>

                <button
                  type="button"
                  disabled={!pwValid}
                  onClick={submit}
                  className="mt-4 w-full rounded-full bg-[#14c25a] py-4 text-base font-semibold text-[#0b1f16] disabled:bg-[#a9e8c3] disabled:text-[#0b1f16]/40 dark:bg-[#1a6b41] dark:text-white dark:disabled:bg-[#1a6b41]/40 dark:disabled:text-white/40"
                >
                  Next
                </button>
              </>
            )}
          </div>
        )}
      </div>
    </PhoneFrame>
  );
}
