import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowLeft } from "lucide-react";
import { PhoneFrame } from "@/components/PhoneFrame";
import { signIn } from "@/lib/session-store";

export const Route = createFileRoute("/signup")({
  head: () => ({
    meta: [
      { title: "Sign up — Chime mobile banking" },
      {
        name: "description",
        content:
          "Create your account with your name, email and a password to start banking, saving and building credit.",
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
  component: SignUpScreen,
});

const GREEN = "#1c5d3a";

function SignUpScreen() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const valid = name.trim().length > 1 && email.includes("@") && password.length >= 8;

  return (
    <PhoneFrame>
      <div
        className="flex h-full w-full flex-col px-6 pb-8 pt-4 text-white"
        style={{ backgroundColor: GREEN }}
      >
        <button
          type="button"
          aria-label="Go back"
          onClick={() => navigate({ to: "/welcome" })}
          className="-ml-2 flex size-11 items-center justify-center rounded-full active:opacity-70"
        >
          <ArrowLeft className="size-6" />
        </button>

        <h1 className="mt-6 font-display text-[28px] font-bold leading-tight">
          Create your account
        </h1>
        <p className="mt-2 text-sm text-white/70">
          No monthly fees, no minimum balance. It takes about a minute.
        </p>

        <Field
          id="name"
          label="Full name"
          value={name}
          onChange={setName}
          autoComplete="name"
          placeholder="Lekan Taiwo"
        />
        <Field
          id="email"
          label="Email"
          value={email}
          onChange={setEmail}
          autoComplete="email"
          inputMode="email"
          placeholder="you@email.com"
        />
        <Field
          id="new-password"
          label="Password"
          value={password}
          onChange={setPassword}
          autoComplete="new-password"
          type="password"
          hint="At least 8 characters"
        />

        <button
          type="button"
          disabled={!valid}
          onClick={() => {
            signIn(email.trim(), name.trim());
            navigate({ to: "/", replace: true });
          }}
          className="mt-auto w-full rounded-full bg-[#2eab52] py-3.5 text-base font-semibold text-white disabled:opacity-40"
        >
          Create account
        </button>
        <button
          type="button"
          onClick={() => navigate({ to: "/signin" })}
          className="mt-3 w-full py-2 text-sm font-semibold text-[#8fe0a4]"
        >
          Already have an account? Log in
        </button>
      </div>
    </PhoneFrame>
  );
}

function Field({
  id,
  label,
  value,
  onChange,
  hint,
  type = "text",
  inputMode,
  autoComplete,
  placeholder,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (v: string) => void;
  hint?: string;
  type?: string;
  inputMode?: "email" | "text";
  autoComplete?: string;
  placeholder?: string;
}) {
  return (
    <div className="mt-5">
      <label htmlFor={id} className="block text-xs font-semibold text-white/70">
        {label}
      </label>
      <input
        id={id}
        type={type}
        inputMode={inputMode}
        autoComplete={autoComplete}
        placeholder={placeholder}
        value={value}
        enterKeyHint="next"
        onChange={(e) => onChange(e.target.value)}
        className="mt-2 w-full rounded-xl bg-white/10 px-4 py-4 text-base text-white caret-[#3ec25f] outline-none placeholder:text-white/40 focus:ring-2 focus:ring-[#3ec25f]"
      />
      {hint ? <p className="mt-1.5 text-[11px] text-white/50">{hint}</p> : null}
    </div>
  );
}
