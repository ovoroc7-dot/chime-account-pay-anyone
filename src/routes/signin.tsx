import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowLeft, Eye, EyeOff } from "lucide-react";
import { PhoneFrame } from "@/components/PhoneFrame";
import { ACCOUNT, signIn, verifyCredentials } from "@/lib/session-store";

export const Route = createFileRoute("/signin")({
  head: () => ({
    meta: [
      { title: "Log in — Chime mobile banking" },
      {
        name: "description",
        content:
          "Log in to your account with your email or phone number and password to see balances, transfers and card controls.",
      },
      { property: "og:title", content: "Log in — Chime mobile banking" },
      {
        property: "og:description",
        content: "Sign in securely with your email or phone number and password.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: SignInScreen,
});

const GREEN = "#1c5d3a";

function SignInScreen() {
  const navigate = useNavigate();
  const [step, setStep] = useState<"id" | "password">("id");
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [error, setError] = useState("");

  const idValid = identifier.trim().length > 3;
  const pwValid = password.length >= 4;

  function submit() {
    if (!pwValid) {
      setError("Enter your password to continue.");
      return;
    }
    if (!verifyCredentials(identifier, password)) {
      setError("The email or password you entered is incorrect.");
      return;
    }
    signIn(ACCOUNT.email, ACCOUNT.name);
    navigate({ to: "/", replace: true });
  }

  return (
    <PhoneFrame topColor={GREEN}>
      <div
        className="flex h-full w-full flex-col px-6 pb-8 pt-4 text-white"
        style={{ backgroundColor: GREEN }}
      >
        <button
          type="button"
          aria-label="Go back"
          onClick={() => (step === "password" ? setStep("id") : navigate({ to: "/welcome" }))}
          className="-ml-2 flex size-11 items-center justify-center rounded-full active:opacity-70"
        >
          <ArrowLeft className="size-6" />
        </button>

        {step === "id" ? (
          <>
            <h1 className="mt-6 font-display text-[28px] font-bold leading-tight">
              Log in to Chime
            </h1>
            <p className="mt-2 text-sm text-white/70">
              Use the email or phone number on your account.
            </p>

            <label htmlFor="identifier" className="mt-8 block text-xs font-semibold text-white/70">
              Email or phone number
            </label>
            <input
              id="identifier"
              autoFocus
              type="text"
              inputMode="email"
              enterKeyHint="next"
              autoComplete="username"
              value={identifier}
              onChange={(e) => {
                setIdentifier(e.target.value);
                setError("");
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter" && idValid) setStep("password");
              }}
              placeholder="you@email.com"
              className="mt-2 w-full rounded-xl bg-white/10 px-4 py-4 text-base text-white caret-[#3ec25f] outline-none placeholder:text-white/40 focus:ring-2 focus:ring-[#3ec25f]"
            />

            <button
              type="button"
              disabled={!idValid}
              onClick={() => setStep("password")}
              className="mt-auto w-full rounded-full bg-[#2eab52] py-3.5 text-base font-semibold text-white disabled:opacity-40"
            >
              Next
            </button>
          </>
        ) : (
          <>
            <h1 className="mt-6 font-display text-[28px] font-bold leading-tight">
              Enter your password
            </h1>
            <p className="mt-2 break-all text-sm text-white/70">{identifier}</p>

            <label htmlFor="password" className="mt-8 block text-xs font-semibold text-white/70">
              Password
            </label>
            <div className="relative mt-2">
              <input
                id="password"
                autoFocus
                type={show ? "text" : "password"}
                enterKeyHint="go"
                autoComplete="current-password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError("");
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter") submit();
                }}
                className="w-full rounded-xl bg-white/10 px-4 py-4 pr-14 text-base text-white caret-[#3ec25f] outline-none focus:ring-2 focus:ring-[#3ec25f]"
              />
              <button
                type="button"
                aria-label={show ? "Hide password" : "Show password"}
                onClick={() => setShow((v) => !v)}
                className="absolute right-1 top-1/2 flex size-11 -translate-y-1/2 items-center justify-center rounded-full text-white/70"
              >
                {show ? <EyeOff className="size-5" /> : <Eye className="size-5" />}
              </button>
            </div>

            {error ? (
              <p role="alert" className="mt-3 text-sm text-[#ffb4b4]">
                {error}
              </p>
            ) : null}

            <button type="button" className="mt-4 self-start text-sm font-semibold text-[#8fe0a4]">
              Forgot password?
            </button>

            <button
              type="button"
              disabled={!pwValid}
              onClick={submit}
              className="mt-auto w-full rounded-full bg-[#2eab52] py-3.5 text-base font-semibold text-white disabled:opacity-40"
            >
              Log in
            </button>
          </>
        )}
      </div>
    </PhoneFrame>
  );
}
