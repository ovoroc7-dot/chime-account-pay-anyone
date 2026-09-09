import { createFileRoute, useRouter } from "@tanstack/react-router";
import { ChevronLeft, ChevronDown, Info, Check, Search, Plus } from "lucide-react";
import { useState } from "react";
import { PhoneFrame } from "@/components/PhoneFrame";
import { ROUTING_NUMBER } from "@/lib/chime-data";

export const Route = createFileRoute("/direct-deposit")({
  head: () => ({
    meta: [
      { title: "Set Up Direct Deposit — Get Paid Early" },
      {
        name: "description",
        content:
          "Copy your routing and account numbers, get a completed direct deposit form or let us find your employer and switch it for you.",
      },
      { property: "og:title", content: "Set Up Direct Deposit — Get Paid Early" },
      {
        property: "og:description",
        content: "Do it yourself with your account details, or have your employer found for you.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: DirectDepositScreen,
});

const EMPLOYERS = [
  { name: "DoorDash", bg: "bg-[#e2382a]", short: "DD" },
  { name: "Walmart", bg: "bg-[#0b2b6b]", short: "W" },
  { name: "ADP", bg: "bg-[#d0021b]", short: "ADP" },
  { name: "Uber", bg: "bg-black", short: "Uber" },
  { name: "+30,000", bg: "bg-white text-black", short: "+30,000" },
];

const ACCOUNT_FULL = "1478 2029 4821";

function DirectDepositScreen() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);
  const [finder, setFinder] = useState(false);
  const [query, setQuery] = useState("");
  const [sent, setSent] = useState<string | null>(null);

  const copy = async (label: string, text: string) => {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      /* clipboard unavailable */
    }
    setCopied(label);
    setTimeout(() => setCopied(null), 1600);
  };

  const results = EMPLOYERS.filter(
    (e) => e.name !== "+30,000" && e.name.toLowerCase().includes(query.trim().toLowerCase()),
  );

  if (sent) {
    return (
      <PhoneFrame>
        <div className="flex flex-1 flex-col items-center justify-center px-8 text-center">
          <span className="grid size-16 place-items-center rounded-full bg-primary text-primary-foreground">
            <Check className="size-8" strokeWidth={3} />
          </span>
          <h1 className="mt-6 font-display text-2xl font-extrabold">Request sent</h1>
          <p className="mt-3 text-[15px] text-muted-foreground">
            We&apos;re switching your direct deposit with {sent}. Most changes take 1–2 pay periods.
          </p>
          <button
            type="button"
            onClick={() => router.navigate({ to: "/move" })}
            className="mt-10 w-full rounded-full bg-card py-4 text-[15px] font-semibold"
          >
            Back to Move Money
          </button>
        </div>
      </PhoneFrame>
    );
  }

  return (
    <PhoneFrame>
      <div className="flex items-center px-4 pt-5">
        <button
          type="button"
          aria-label="Back"
          onClick={() => (finder ? setFinder(false) : router.navigate({ to: "/move" }))}
          className="active:opacity-60"
        >
          <ChevronLeft className="size-6" />
        </button>
        <span className="flex-1 text-center font-display text-base font-bold">
          {finder ? "Find your employer" : "Direct deposit"}
        </span>
        {finder ? <span className="size-6" /> : <Info className="size-6 text-muted-foreground" />}
      </div>

      {finder ? (
        <div className="flex-1 overflow-y-auto px-5 pt-5">
          <label className="flex items-center gap-3 rounded-full bg-card px-4 py-3">
            <Search className="size-5 text-muted-foreground" />
            <input
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              aria-label="Search employer or payroll provider"
              placeholder="Employer, payroll or agency"
              className="w-full bg-transparent text-[15px] outline-none"
            />
          </label>
          <ul className="mt-4">
            {results.map((e) => (
              <li key={e.name} className="border-b border-white/5 last:border-0">
                <button
                  type="button"
                  onClick={() => setSent(e.name)}
                  className="flex w-full items-center gap-4 py-4 text-left active:opacity-70"
                >
                  <span
                    className={`grid size-10 place-items-center rounded-full text-[11px] font-bold text-white ${e.bg}`}
                  >
                    {e.short}
                  </span>
                  <span className="flex-1 text-[15px] font-medium">{e.name}</span>
                  <Plus className="size-5 text-primary" />
                </button>
              </li>
            ))}
            {results.length === 0 && (
              <li className="py-10 text-center text-sm text-muted-foreground">
                No matches. Try another name.
              </li>
            )}
          </ul>
        </div>
      ) : (
        <div className="flex-1 overflow-y-auto px-5 pb-8 pt-4">
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            className="flex w-full items-center gap-3 rounded-2xl bg-[#0f3b2c] p-4 text-left"
          >
            <span className="grid size-9 shrink-0 place-items-center rounded-full bg-primary text-primary-foreground">
              <Plus className="size-5" strokeWidth={3} />
            </span>
            <span className="flex-1 text-[14px] font-medium">
              Get Chime+ with a direct deposit of at least $200
            </span>
            <ChevronDown className={`size-5 transition-transform ${open ? "rotate-180" : ""}`} />
          </button>
          {open && (
            <p className="px-4 pt-3 text-[13px] leading-relaxed text-muted-foreground">
              Chime+ members get a higher savings rate, faster support and bigger SpotMe limits — at
              no extra cost.
            </p>
          )}

          <h1 className="mt-7 font-display text-2xl font-bold">Do it yourself</h1>
          <p className="mt-2 text-[14px] text-muted-foreground">
            Just give this info or your direct deposit form to your employer.
          </p>

          <DetailRow
            label="Routing number"
            value={ROUTING_NUMBER}
            copied={copied === "Routing number"}
            onCopy={() => copy("Routing number", ROUTING_NUMBER)}
          />
          <DetailRow
            label="Account number"
            copied={copied === "Account number"}
            onCopy={() => copy("Account number", ACCOUNT_FULL)}
          />

          <button
            type="button"
            onClick={() => copy("Form", `${ROUTING_NUMBER} ${ACCOUNT_FULL}`)}
            className="mt-6 w-full rounded-full bg-primary py-3.5 text-[15px] font-bold text-primary-foreground active:opacity-80"
          >
            {copied === "Form" ? "Form copied" : "Get completed form"}
          </button>

          <h2 className="mt-9 font-display text-2xl font-bold">Have Chime do it for you</h2>
          <p className="mt-2 text-[14px] text-muted-foreground">
            Start by finding your employer, payroll provider, or unemployment agency.
          </p>

          <div className="mt-5 flex items-center gap-3">
            {EMPLOYERS.map((e) => (
              <button
                key={e.name}
                type="button"
                aria-label={e.name}
                onClick={() => {
                  setQuery(e.name === "+30,000" ? "" : e.name);
                  setFinder(true);
                }}
                className={`grid size-12 shrink-0 place-items-center rounded-full text-[10px] font-bold text-white active:opacity-70 ${e.bg}`}
              >
                {e.short}
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={() => {
              setQuery("");
              setFinder(true);
            }}
            className="mt-5 w-full rounded-full bg-primary py-3.5 text-[15px] font-bold text-primary-foreground active:opacity-80"
          >
            Find employer
          </button>
          <p className="mt-3 text-center text-[11px] text-muted-foreground">
            Chime partners with Atomic to switch your direct deposit
          </p>
        </div>
      )}
    </PhoneFrame>
  );
}

function DetailRow({
  label,
  value,
  copied,
  onCopy,
}: {
  label: string;
  value?: string;
  copied: boolean;
  onCopy: () => void;
}) {
  return (
    <div className="mt-6 flex items-start justify-between">
      <span>
        <span className="block text-[15px] font-semibold">{label}</span>
        {value && <span className="block text-[14px] text-muted-foreground">{value}</span>}
      </span>
      <button
        type="button"
        onClick={onCopy}
        className="text-[14px] font-semibold text-primary active:opacity-70"
      >
        {copied ? "Copied" : "Copy"}
      </button>
    </div>
  );
}
