import { createFileRoute } from "@tanstack/react-router";
import { Search, QrCode, Plus, X, ChevronLeft, Check, Cloud } from "lucide-react";
import { InboxBell } from "@/components/InboxBell";
import { useEffect, useState } from "react";
import { PhoneFrame } from "@/components/PhoneFrame";
import { MoveTabBar } from "@/routes/move";
import { AmountField } from "@/components/AmountField";
import { ChimeLogo } from "@/components/ChimeLogo";
import { useKeyboardInset } from "@/hooks/use-keyboard-inset";
import { usd, CARDHOLDER } from "@/lib/chime-data";
import { useLedger, payOut } from "@/lib/ledger-store";
import {
  addPayActivity,
  dayLabel,
  usePayActivity,
  type PayActivity,
} from "@/lib/pay-activity-store";

export const Route = createFileRoute("/pay")({
  head: () => ({
    meta: [
      { title: "Pay Anyone — Send and Request Money Instantly" },
      {
        name: "description",
        content:
          "Send or request money with anyone using your $ChimeSign, share your QR code and review payments before they send.",
      },
      { property: "og:title", content: "Pay Anyone — Send and Request Money Instantly" },
      {
        property: "og:description",
        content: "Pay friends, request money and share your $ChimeSign QR code.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: PayScreen,
});

const SEARCH_HINTS = ["name", "phone number", "email", "$ChimeSign"] as const;

function titleCase(s: string) {
  return s
    .split(/\s+/)
    .map((w) => (w ? w[0]!.toUpperCase() + w.slice(1) : w))
    .join(" ");
}

function formatPhone(digits: string) {
  const d = digits.slice(-10);
  return d.length === 10 ? `(${d.slice(0, 3)}) ${d.slice(3, 6)}-${d.slice(6)}` : digits;
}

function initialsOf(s: string) {
  const letters = s.replace(/[^a-zA-Z ]/g, " ").trim().split(/\s+/).filter(Boolean);
  if (letters.length === 0) return "#";
  return (letters[0]![0]! + (letters[1]?.[0] ?? "")).toUpperCase();
}


const CONTACTS = [
  { name: "Kristan Davis", tag: "$kinsleywhedbee", initials: "KD" },
  { name: "Marcus Lee", tag: "$marcus-lee", initials: "ML" },
  { name: "Ana Ruiz", tag: "$ana-ruiz", initials: "AR" },
];

type Method = { id: string; name: string; sub: string; chime: boolean };

const EMOJIS = ["❤️", "🍔", "🪙", "🎁", "🔥", "💰", "🍷", "🎉"];

type Sheet = null | "qr" | "contacts" | "note" | "review" | "method" | "done";

function PayScreen() {
  const kb = useKeyboardInset();
  const { checking } = useLedger();
  const [sheet, setSheet] = useState<Sheet>(null);
  const [mode, setMode] = useState<"Pay" | "Request">("Pay");
  const [amount, setAmount] = useState("0");
  const [editingAmount, setEditingAmount] = useState(false);
  const [contact, setContact] = useState<(typeof CONTACTS)[number] | null>(null);
  const [note, setNote] = useState("💰");
  const methods: Method[] = [
    { id: "checking", name: "Checking", sub: usd(checking), chime: true },
    { id: "sofi", name: "SoFi Bank N.A. Debit card", sub: "7109", chime: false },
  ];
  const [methodId, setMethodId] = useState("checking");
  const method = methods.find((m) => m.id === methodId) ?? methods[0]!;
  const [query, setQuery] = useState("");
  const activity = usePayActivity();
  const [receipt, setReceipt] = useState<PayActivity | null>(null);
  const [editedTag, setEditedTag] = useState("");
  const [hintIndex, setHintIndex] = useState(0);

  useEffect(() => {
    if (sheet !== "contacts" || query !== "") return;
    const id = window.setInterval(
      () => setHintIndex((i) => (i + 1) % SEARCH_HINTS.length),
      1800,
    );
    return () => window.clearInterval(id);
  }, [sheet, query]);


  const value = Number(amount) || 0;
  const shown = value > 0 ? usd(value).replace(/\.00$/, "") : "$0";

  const start = (m: "Pay" | "Request") => {
    setMode(m);
    if (value <= 0) {
      setEditingAmount(true);
      return;
    }
    setSheet("contacts");
  };

  const q = query.trim();
  const filtered = CONTACTS.filter(
    (c) =>
      c.name.toLowerCase().includes(q.toLowerCase()) ||
      c.tag.toLowerCase().includes(q.toLowerCase()),
  );

  const digits = q.replace(/[^\d]/g, "");
  const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(q);
  const isPhone = digits.length >= 10 && /^[\d\s()+-]+$/.test(q);
  const isTag = q.startsWith("$") && q.length > 1;

  const typedRecipient =
    q.length === 0
      ? null
      : {
          name: isEmail || isPhone || isTag ? q : titleCase(q),
          tag: isEmail
            ? "Email"
            : isPhone
              ? formatPhone(digits)
              : isTag
                ? "$ChimeSign"
                : "Name",
          initials: initialsOf(q),
        };

  const canSendTyped = Boolean(typedRecipient) && (isEmail || isPhone || isTag || q.length >= 2);


  return (
    <PhoneFrame>
      <div className="flex-1 overflow-y-auto px-6 pb-28 pt-5">
        <div className="flex items-center justify-between">
          <InboxBell className="-ml-3" />
          <div className="flex items-center gap-5">
            <button type="button" aria-label="Search" className="active:opacity-60">
              <Search className="size-6" />
            </button>
            <button
              type="button"
              aria-label="Your QR code"
              onClick={() => setSheet("qr")}
              className="active:opacity-60"
            >
              <QrCode className="size-6" />
            </button>
          </div>
        </div>

        <h1 className="mt-6 font-display text-3xl font-extrabold">Pay Anyone</h1>
        <button type="button" className="mt-2 flex items-center gap-1 text-[13px] text-primary">
          How it works <span aria-hidden>ⓘ</span>
        </button>

        <div className="mt-5">
          {editingAmount ? (
            <AmountField
              value={amount}
              onChange={setAmount}
              label="Amount to send or request"
              className="font-display text-6xl font-extrabold tracking-tight"
            />
          ) : (
            <button
              type="button"
              onClick={() => setEditingAmount(true)}
              aria-label="Enter an amount"
              className="font-display text-6xl font-extrabold tracking-tight text-muted-foreground"
            >
              {shown}
            </button>
          )}
        </div>

        <div className="mt-7 grid grid-cols-2 gap-4">
          <button
            type="button"
            onClick={() => start("Request")}
            className="rounded-full bg-primary py-3.5 text-[15px] font-bold text-primary-foreground active:opacity-80"
          >
            Request
          </button>
          <button
            type="button"
            onClick={() => start("Pay")}
            className="rounded-full bg-primary py-3.5 text-[15px] font-bold text-primary-foreground active:opacity-80"
          >
            Pay
          </button>
        </div>

        <button
          type="button"
          className="mt-6 flex w-full items-center gap-4 rounded-2xl border border-border p-4 text-left active:opacity-70"
        >
          <Plus className="size-6" />
          <span>
            <span className="block text-[15px] font-semibold">Create a group</span>
            <span className="block text-[12px] text-muted-foreground">
              Share expenses with friends and family
            </span>
          </span>
        </button>

        <h2 className="mt-8 font-display text-xl font-bold">Recent</h2>
        {activity.length === 0 ? (
          <div className="mt-10 flex flex-col items-center text-center">
            <Cloud className="size-16 text-muted-foreground" />
            <p className="mt-5 text-[15px] font-semibold">Nothing here yet</p>
            <p className="mt-1 text-[13px] text-muted-foreground">
              Send money and you&apos;ll see activity here.
            </p>
          </div>
        ) : (
          <ul className="mt-3">
            {activity.map((a) => (
              <li key={a.id} className="border-b border-white/5 last:border-0">
                <button
                  type="button"
                  onClick={() => setReceipt(a)}
                  className="flex w-full items-center gap-3 py-4 text-left active:opacity-70"
                >
                  <span className="grid size-11 place-items-center rounded-full bg-card text-lg">
                    {a.note}
                  </span>
                  <span className="flex-1">
                    <span className="block text-[15px] font-semibold">
                      {a.mode === "Pay" ? `You paid ${a.name}` : `You requested from ${a.name}`}
                    </span>
                    <span className="block text-[12px] text-muted-foreground">
                      {dayLabel(a.at)}
                    </span>
                  </span>
                  <span className="text-[15px] font-semibold">
                    {a.mode === "Pay" ? "-" : ""}
                    {usd(a.amount)}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {editingAmount && (
        <div
          className="absolute inset-x-0 bottom-0 border-t border-border bg-background p-5"
          style={{ paddingBottom: `calc(1.25rem + ${kb}px)` }}
        >
          <button
            type="button"
            disabled={value <= 0}
            onClick={() => {
              setEditingAmount(false);
              setSheet("contacts");
            }}
            className="w-full rounded-full bg-primary py-4 text-[16px] font-bold text-primary-foreground disabled:bg-secondary disabled:text-muted-foreground"
          >
            Next
          </button>
        </div>
      )}

      {sheet === "qr" && (
        <SheetShell onClose={() => setSheet(null)} closeIcon>
          <p className="text-center font-display text-2xl font-bold">{title(CARDHOLDER)}</p>
          <p className="mt-1 text-center text-[13px] text-muted-foreground">$Denis-Trufin</p>
          <div className="mx-auto mt-6 grid size-[210px] place-items-center rounded-xl bg-white">
            <QrCode className="size-40 text-black" strokeWidth={1} />
          </div>
          <button
            type="button"
            className="mt-8 w-full rounded-full bg-primary py-4 text-[15px] font-bold text-primary-foreground"
          >
            Share
          </button>
          <button
            type="button"
            className="mt-3 w-full rounded-full bg-card py-4 text-[15px] font-semibold"
          >
            Copy $ChimeSign
          </button>
        </SheetShell>
      )}

      {sheet === "contacts" && (
        <SheetShell onClose={() => setSheet(null)}>
          <label className="relative flex items-center gap-3 rounded-xl border border-border px-4 py-3">
            <Search className="size-5 shrink-0 text-muted-foreground" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              inputMode="text"
              aria-label="Search contacts by name, phone number, email or $ChimeSign"
              className="w-full bg-transparent text-[15px] outline-none"
            />
            {query === "" && (
              <span
                aria-hidden
                className="pointer-events-none absolute left-12 text-[15px] text-muted-foreground"
              >
                Search{" "}
                <span key={hintIndex} className="animate-hint-swap inline-block">
                  {SEARCH_HINTS[hintIndex]}
                </span>
              </span>
            )}
          </label>

          {typedRecipient && canSendTyped && (
            <>
              <p className="mt-5 text-[12px] text-muted-foreground">Send to</p>
              <button
                type="button"
                onClick={() => {
                  setContact(typedRecipient);
                  setSheet("note");
                }}
                className="mt-3 flex w-full items-center gap-3 rounded-xl bg-card px-3 py-3 text-left active:opacity-70"
              >
                <span className="grid size-10 shrink-0 place-items-center rounded-full bg-primary text-[13px] font-bold text-primary-foreground">
                  {typedRecipient.initials}
                </span>
                <span className="min-w-0">
                  <span className="block truncate text-[15px] font-semibold">
                    {typedRecipient.name}
                  </span>
                  <span className="block text-[12px] text-muted-foreground">
                    {typedRecipient.tag} · {mode === "Pay" ? "Pay" : "Request"} {shown}
                  </span>
                </span>
              </button>
            </>
          )}

          <p className="mt-5 text-[12px] text-muted-foreground">
            {q ? "Contacts" : "Recents"}
          </p>
          <ul className="mt-3 space-y-1">

            {filtered.map((c) => (
              <li key={c.tag}>
                <button
                  type="button"
                  onClick={() => {
                    setContact(c);
                    setSheet("note");
                  }}
                  className="flex w-full items-center gap-3 rounded-xl py-3 text-left active:opacity-70"
                >
                  <span className="grid size-10 place-items-center rounded-full bg-card text-[13px] font-bold">
                    {c.initials}
                  </span>
                  <span>
                    <span className="block text-[15px] font-semibold">{c.name}</span>
                    <span className="block text-[12px] text-muted-foreground">{c.tag}</span>
                  </span>
                </button>
              </li>
            ))}
          </ul>

          <div className="mt-6 rounded-2xl bg-card p-5 text-center">
            <p className="font-display text-lg font-bold">Chime is better with friends</p>
            <p className="mt-2 text-[13px] text-muted-foreground">
              Grant access to your contacts to exchange money with anyone, whether they have Chime
              or not.
            </p>
            <button
              type="button"
              className="mt-5 w-full rounded-full bg-primary py-3.5 text-[15px] font-bold text-primary-foreground"
            >
              Grant Permission
            </button>
          </div>
        </SheetShell>
      )}

      {sheet === "note" && (
        <SheetShell onClose={() => setSheet(null)}>
          <div className="flex items-center gap-3">
            <button
              type="button"
              aria-label="Back"
              onClick={() => setSheet("contacts")}
              className="active:opacity-60"
            >
              <ChevronLeft className="size-5" />
            </button>
            <p className="text-[16px] font-bold">
              {mode} {usd(value).replace(/\.00$/, "")} for:
            </p>
          </div>
          <input
            value={note}
            onChange={(e) => setNote(e.target.value)}
            aria-label="What is this payment for"
            className="mt-6 w-full bg-transparent text-center text-2xl outline-none"
          />
          <button
            type="button"
            onClick={() => {
              setEditedTag(contact?.tag ?? "");
              setSheet("review");
            }}
            className="mt-6 w-full rounded-full bg-primary py-4 text-[15px] font-bold text-primary-foreground"
          >
            Next
          </button>
          <div className="mt-5 flex justify-between">
            {EMOJIS.map((e) => (
              <button
                key={e}
                type="button"
                aria-label={`Add ${e}`}
                onClick={() => setNote(e)}
                className="text-xl active:opacity-60"
              >
                {e}
              </button>
            ))}
          </div>
        </SheetShell>
      )}

      {sheet === "review" && (
        <SheetShell onClose={() => setSheet(null)}>
          <div className="flex items-center gap-3">
            <button
              type="button"
              aria-label="Back"
              onClick={() => setSheet("note")}
              className="active:opacity-60"
            >
              <ChevronLeft className="size-5" />
            </button>
            <p className="text-[16px] font-bold">Let&apos;s review</p>
          </div>

          <dl className="mt-7 space-y-6 text-[14px]">
            <Row label="To">
              <span className="text-right">
                <span className="block font-semibold">{contact?.name}</span>
                <input
                  value={editedTag}
                  onChange={(e) => {
                    let v = e.target.value.replace(/\s/g, "").toLowerCase();
                    if (v && !v.startsWith("$")) v = `$${v}`;
                    setEditedTag(v);
                    setContact((c) => (c ? { ...c, tag: v || c.tag } : c));
                  }}
                  aria-label="Recipient $ChimeSign"
                  placeholder="$ChimeSign"
                  maxLength={30}
                  className="mt-0.5 block w-40 border-b border-transparent bg-transparent text-right text-[12px] text-muted-foreground outline-none placeholder:text-muted-foreground/60 focus:border-primary focus:text-foreground"
                />
              </span>
            </Row>
            <Row label="Amount">
              <span className="font-semibold">{usd(value).replace(/\.00$/, "")}</span>
            </Row>
            <Row label="For">
              <span className="text-xl">{note}</span>
            </Row>
            <Row label="From">
              <button
                type="button"
                onClick={() => setSheet("method")}
                className="flex items-center gap-2 rounded-full bg-card px-3 py-1.5 text-[13px] font-semibold"
              >
                {method.name} <span className="text-muted-foreground">{method.sub}</span>
                <span aria-hidden>⌄</span>
              </button>
            </Row>
          </dl>

          <button
            type="button"
            onClick={() => {
              addPayActivity({
                mode,
                name: contact?.name ?? "",
                tag: contact?.tag ?? "",
                amount: value,
                note,
                method: method.chime ? "Checking" : method.name,
                methodSub: method.chime ? "4821" : method.sub,
              });
              if (mode === "Pay" && method.chime) payOut(value, contact?.name ?? "");
              setSheet("done");
            }}
            className="mt-8 w-full rounded-full bg-primary py-4 text-[15px] font-bold text-primary-foreground"
          >
            {mode} {usd(value).replace(/\.00$/, "")}
          </button>
        </SheetShell>
      )}

      {sheet === "method" && (
        <SheetShell onClose={() => setSheet("review")}>
          <ul className="space-y-2">
            {methods.map((m) => (
              <li key={m.id}>
                <button
                  type="button"
                  onClick={() => {
                    setMethodId(m.id);
                    setSheet("review");
                  }}
                  className="flex w-full items-center gap-3 py-3 text-left active:opacity-70"
                >
                  {m.chime ? (
                    <ChimeLogo className="size-9" />
                  ) : (
                    <span className="size-9 rounded-full bg-card" />
                  )}
                  <span className="flex-1">
                    <span className="block text-[15px] font-semibold">{m.name}</span>
                    <span className="block text-[12px] text-muted-foreground">{m.sub}</span>
                  </span>
                  {method.id === m.id && <Check className="size-5 text-primary" />}
                </button>
              </li>
            ))}
          </ul>
          <p className="mt-4 text-center text-[12px] text-muted-foreground">
            All payment methods are fee-free
          </p>
        </SheetShell>
      )}

      {sheet === "done" && (
        <div className="absolute inset-0 z-40 flex flex-col bg-background px-6 pb-8 pt-16">
          <span className="grid size-14 place-items-center rounded-full border-2 border-primary">
            <Check className="size-7 text-primary" strokeWidth={2.5} />
          </span>
          <h2 className="mt-6 font-display text-3xl font-extrabold">
            {usd(value)} {mode === "Pay" ? "sent" : "requested"}
          </h2>
          <p className="mt-5 text-[16px] font-semibold leading-relaxed">
            {mode === "Pay" ? "You paid" : "You requested from"} {contact?.name} for:
            <br />
            &ldquo;{note}&rdquo;
          </p>

          <div className="mt-auto space-y-4 text-[13px] text-muted-foreground">
            <p>
              We just notified your friend. If they don&apos;t accept the money in 14 days,
              we&apos;ll refund you.
            </p>
            <p>
              If your friend signs up for Chime and receives a qualifying direct deposit of $200+
              within their first 45 days of enrolling, you&apos;ll both get $100.
            </p>
          </div>

          <button
            type="button"
            onClick={() => {
              setSheet(null);
              setAmount("0");
              setContact(null);
              setNote("💰");
            }}
            className="mt-6 w-full rounded-full bg-primary py-4 text-[16px] font-bold text-primary-foreground active:opacity-80"
          >
            Got it
          </button>
        </div>
      )}

      {receipt && (
        <div className="absolute inset-0 z-40 flex flex-col overflow-y-auto bg-background px-6 pb-8 pt-5">
          <button
            type="button"
            aria-label="Back"
            onClick={() => setReceipt(null)}
            className="-ml-2 w-fit active:opacity-60"
          >
            <ChevronLeft className="size-7" />
          </button>

          <div className="mt-6 text-center">
            <span className="mx-auto grid size-20 place-items-center rounded-full bg-card text-3xl">
              {receipt.note}
            </span>
            <p className="mt-4 font-display text-5xl font-extrabold tracking-tight">
              {receipt.mode === "Pay" ? "-" : "+"}
              {usd(receipt.amount)}
            </p>
            <p className="mt-2 text-xl font-bold">{receipt.name}</p>
            <p className="mt-2 text-[13px] text-muted-foreground">{dayLabel(receipt.at)}</p>
          </div>

          <dl className="mt-8 text-[15px]">
            <ReceiptRow label="Account">{receipt.method}</ReceiptRow>
            <ReceiptRow label="Category">Financial services</ReceiptRow>
            <ReceiptRow label="Description">
              <span className="block">{receipt.name}</span>
              <span className="block">{receipt.tag}</span>
            </ReceiptRow>
            <ReceiptRow label="Card">****{receipt.methodSub}</ReceiptRow>
          </dl>

          <button
            type="button"
            className="mt-auto pt-10 text-center text-[15px] font-bold text-primary active:opacity-70"
          >
            Problem with this transaction?
          </button>
        </div>
      )}

      <MoveTabBar active="Pay" />
    </PhoneFrame>
  );
}

function title(name: string) {
  return name
    .toLowerCase()
    .split(" ")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

function ReceiptRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-start justify-between gap-6 border-b border-white/10 py-5 last:border-0">
      <dt className="text-muted-foreground">{label}</dt>
      <dd className="text-right font-semibold">{children}</dd>
    </div>
  );
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-start justify-between gap-4">
      <dt className="text-muted-foreground">{label}</dt>
      <dd>{children}</dd>
    </div>
  );
}

function SheetShell({
  children,
  onClose,
  closeIcon = false,
}: {
  children: React.ReactNode;
  onClose: () => void;
  closeIcon?: boolean;
}) {
  return (
    <div className="absolute inset-0 z-30 flex flex-col justify-end">
      <button
        type="button"
        aria-label="Close"
        onClick={onClose}
        className="flex-1 bg-black/60"
      />
      <div className="max-h-[85%] overflow-y-auto rounded-t-3xl bg-background px-6 pb-8 pt-4">
        <div className="mx-auto h-1 w-10 rounded-full bg-border" />
        {closeIcon && (
          <button
            type="button"
            aria-label="Close"
            onClick={onClose}
            className="ml-auto mt-2 block active:opacity-60"
          >
            <X className="size-6" />
          </button>
        )}
        <div className="mt-4">{children}</div>
      </div>
    </div>
  );
}
