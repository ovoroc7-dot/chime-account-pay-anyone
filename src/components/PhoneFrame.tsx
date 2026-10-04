import { useEffect, useRef, type CSSProperties, type ReactNode } from "react";

export function PhoneFrame({
  children,
  topClass,
  topColor,
}: {
  children: ReactNode;
  /** Tailwind background class painted behind the phone status bar area. */
  topClass?: string;
  /** Explicit CSS color painted behind the phone status bar area. */
  topColor?: string;
}) {
  const stripRef = useRef<HTMLDivElement>(null);
  const mainRef = useRef<HTMLElement>(null);

  // Paint the page itself (behind status bar, gesture bar and any overscroll)
  // with this screen's colors so no other color can ever peek through.
  useEffect(() => {
    const strip = stripRef.current;
    const main = mainRef.current;
    if (!strip || !main) return;
    const top = topColor || getComputedStyle(strip).backgroundColor;
    const html = document.documentElement;
    const body = document.body;
    const prevHtml = html.style.backgroundColor;
    const prevBody = body.style.backgroundColor;
    html.style.backgroundColor = top;
    body.style.backgroundColor = top;
    const meta = document.querySelector('meta[name="theme-color"]');
    const prevMeta = meta?.getAttribute("content") ?? null;
    meta?.setAttribute("content", top);
    return () => {
      html.style.backgroundColor = prevHtml;
      body.style.backgroundColor = prevBody;
      if (meta && prevMeta) meta.setAttribute("content", prevMeta);
    };
  }, [topColor, topClass]);

  const barStyle: CSSProperties = {
    height: "env(safe-area-inset-top)",
    ...(topColor ? { backgroundColor: topColor } : null),
  };

  return (
    <div className="fixed inset-0 flex w-full items-stretch justify-center overflow-hidden bg-background sm:static sm:min-h-dvh sm:items-center sm:overflow-x-hidden sm:bg-neutral-200 sm:py-10 dark:sm:bg-[#050807]">
      <div className="relative h-full w-full sm:h-auto sm:max-w-[420px] sm:rounded-[46px] sm:border-[10px] sm:border-neutral-300 sm:shadow-[0_40px_120px_-30px_rgba(0,0,0,0.45)] sm:dark:border-[#161b18] sm:dark:shadow-[0_40px_120px_-30px_rgba(0,0,0,0.9)]">
        <main
          ref={mainRef}
          className="relative flex h-full w-full flex-col overflow-hidden bg-background pt-[env(safe-area-inset-top)] sm:h-[860px] sm:rounded-[36px] sm:pt-0"
        >
          <div
            ref={stripRef}
            aria-hidden
            className={`pointer-events-none absolute inset-x-0 top-0 z-50 sm:hidden ${topClass ?? "bg-background"}`}
            style={barStyle}
          />
          {children}
        </main>
      </div>
    </div>
  );
}
