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
    const bottom = getComputedStyle(main).backgroundColor;
    const paint = `linear-gradient(to bottom, ${top} 0 50%, ${bottom} 50% 100%)`;
    html.style.backgroundColor = bottom;
    body.style.backgroundColor = "transparent";
    html.style.backgroundImage = paint;
    const meta = document.querySelector('meta[name="theme-color"]');
    const prevMeta = meta?.getAttribute("content") ?? null;
    meta?.setAttribute("content", top);
    return () => {
      html.style.backgroundColor = prevHtml;
      html.style.backgroundImage = "";
      body.style.backgroundColor = prevBody;
      if (meta && prevMeta) meta.setAttribute("content", prevMeta);
    };
  }, [topColor, topClass]);

  // Size the app to the real full screen (iOS home-screen apps can report a short
  // viewport on first open), so the background reaches the very bottom edge.
  useEffect(() => {
    const standalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      (navigator as Navigator & { standalone?: boolean }).standalone === true;
    const set = () => {
      // Home-screen apps on iPhone report a viewport that stops above the gesture
      // bar; use the full physical screen height there instead.
      const portrait = window.innerHeight >= window.innerWidth;
      const full = portrait
        ? Math.max(screen.height, screen.width)
        : Math.min(screen.height, screen.width);
      const h = standalone ? Math.max(full, window.innerHeight) : window.innerHeight;
      document.documentElement.style.setProperty("--app-h", `${h}px`);
    };
    set();
    const t = setTimeout(set, 300);
    window.addEventListener("resize", set);
    window.addEventListener("orientationchange", set);
    window.visualViewport?.addEventListener("resize", set);
    return () => {
      clearTimeout(t);
      window.removeEventListener("resize", set);
      window.removeEventListener("orientationchange", set);
      window.visualViewport?.removeEventListener("resize", set);
    };
  }, []);

  const barStyle: CSSProperties = {
    height: "env(safe-area-inset-top)",
    ...(topColor ? { backgroundColor: topColor } : null),
  };

  return (
    <div style={{ height: "var(--app-h, 100%)" }}
      className="fixed inset-x-0 top-0 flex w-full items-stretch justify-center overflow-hidden bg-background sm:static sm:!h-auto sm:min-h-dvh sm:items-center sm:overflow-x-hidden sm:bg-neutral-200 sm:py-10 dark:sm:bg-[#050807]">
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
