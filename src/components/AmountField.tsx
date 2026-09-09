import { useRef } from "react";

export function sanitizeAmount(raw: string) {
  let v = raw.replace(/[^0-9.]/g, "");
  const firstDot = v.indexOf(".");
  if (firstDot !== -1) {
    v = v.slice(0, firstDot + 1) + v.slice(firstDot + 1).replace(/\./g, "");
    const [int, dec = ""] = v.split(".");
    v = `${int}.${dec.slice(0, 2)}`;
  }
  if (v === "") return "0";
  if (!v.startsWith("0.") && v.length > 1) v = v.replace(/^0+/, "") || "0";
  const [int] = v.split(".");
  if ((int ?? "").length > 7) return raw.slice(0, -1) || "0";
  return v;
}

type Props = {
  value: string;
  onChange: (next: string) => void;
  label?: string;
  autoFocus?: boolean;
  className?: string;
  symbolClassName?: string;
};

/**
 * Amount entry that opens the phone's own numeric keyboard when tapped,
 * with the native (blinking) caret and full screen-reader/keyboard support.
 */
export function AmountField({
  value,
  onChange,
  label = "Amount in dollars",
  autoFocus = true,
  className = "font-display text-6xl font-extrabold tracking-tight",
  symbolClassName = "mt-2 font-display text-2xl font-bold",
}: Props) {
  const ref = useRef<HTMLInputElement>(null);

  return (
    <div
      className="flex items-start justify-center"
      onClick={() => ref.current?.focus()}
    >
      <span aria-hidden="true" className={symbolClassName}>
        $
      </span>
      <input
        ref={ref}
        // eslint-disable-next-line jsx-a11y/no-autofocus
        autoFocus={autoFocus}
        type="text"
        inputMode="decimal"
        enterKeyHint="done"
        autoComplete="off"
        aria-label={label}
        value={value}
        onChange={(e) => onChange(sanitizeAmount(e.target.value))}
        onFocus={toEnd}
        onSelect={toEnd}
        onClick={toEnd}
        style={{ width: `${Math.max(1, value.length)}ch` }}
        className={`${className} bg-transparent p-0 text-left caret-primary outline-none focus:outline-none focus-visible:outline-none`}
      />
    </div>
  );
}
