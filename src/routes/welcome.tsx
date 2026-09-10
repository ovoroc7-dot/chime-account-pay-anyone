import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { PhoneFrame } from "@/components/PhoneFrame";

export const Route = createFileRoute("/welcome")({
  head: () => ({
    meta: [
      { title: "Welcome — Sign up or log in" },
      {
        name: "description",
        content:
          "Welcome screen for the mobile banking app. Start building credit, say goodbye to monthly fees, save money, and more.",
      },
      { property: "og:title", content: "Welcome — Sign up or log in" },
      {
        property: "og:description",
        content:
          "Welcome screen for the mobile banking app. Start building credit, say goodbye to monthly fees, save money, and more.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: WelcomeScreen,
});

type Stage = "splash" | "loading" | "landing";

const GREEN = "#1c5d3a";
const PINK = "#f3d7ee";

function WelcomeScreen() {
  const [stage, setStage] = useState<Stage>("splash");

  useEffect(() => {
    const a = window.setTimeout(() => setStage("loading"), 1500);
    const b = window.setTimeout(() => setStage("landing"), 4000);
    return () => {
      window.clearTimeout(a);
      window.clearTimeout(b);
    };
  }, []);

  return (
    <PhoneFrame>
      {stage === "splash" && <Splash />}
      {stage === "loading" && <Loading />}
      {stage === "landing" && <Landing />}
    </PhoneFrame>
  );
}

function Wordmark({ className = "text-3xl" }: { className?: string }) {
  return (
    <span
      className={`font-display font-bold tracking-tight text-[#3ec25f] ${className}`}
    >
      chime
      <sup className="ml-0.5 align-super text-[0.4em]">®</sup>
    </span>
  );
}

function Splash() {
  return (
    <div
      className="flex h-full w-full items-center justify-center"
      style={{ backgroundColor: "#0d4a2a" }}
    >
      <Wordmark className="text-4xl" />
    </div>
  );
}

function Loading() {
  return (
    <div
      className="flex h-full w-full items-center justify-center"
      style={{ backgroundColor: PINK }}
    >
      <span
        role="status"
        aria-label="Loading"
        className="block size-7 animate-spin rounded-full border-2 border-[#6b4f66]/30 border-t-[#6b4f66]"
      />
    </div>
  );
}

const slides = [
  {
    id: "loved",
    title: (
      <>
        The #1 Most Loved
        <br />
        Banking App
        <sup className="text-[0.5em] align-super">1</sup>
      </>
    ),
    body: (
      <>
        Start building credit,<sup className="text-[0.7em] align-super">2</sup> say
        goodbye to monthly fees, save money, and more.
      </>
    ),
    art: "cards" as const,
  },
  {
    id: "credit",
    title: (
      <>
        Start building credit
        <sup className="text-[0.5em] align-super">3</sup>
      </>
    ),
    body: (
      <>
        No annual fees, no interest,<sup className="text-[0.7em] align-super">4</sup>{" "}
        and no credit check. Members see an increase of 30 points on average.
        <sup className="text-[0.7em] align-super">5</sup>
      </>
    ),
    art: "score" as const,
  },
];

function Landing() {
  const navigate = useNavigate();
  const trackRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);

  function onScroll() {
    const el = trackRef.current;
    if (!el) return;
    setActive(Math.round(el.scrollLeft / el.clientWidth));
  }

  return (
    <div className="flex h-full w-full flex-col" style={{ backgroundColor: GREEN }}>
      <div className="flex items-center justify-center pt-4 pb-2">
        <Wordmark className="text-2xl" />
      </div>

      <div className="flex flex-1 items-center justify-center overflow-hidden px-6">
        {slides[active]?.art === "cards" ? <CardsArt /> : <ScoreArt />}
      </div>

      <div
        className="rounded-t-3xl px-7 pt-8 pb-8"
        style={{ backgroundColor: PINK, color: "#1a1420" }}
      >
        <div
          ref={trackRef}
          onScroll={onScroll}
          className="flex snap-x snap-mandatory overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {slides.map((s) => (
            <div key={s.id} className="w-full shrink-0 snap-center pr-px">
              <h1 className="font-display text-[28px] font-bold leading-tight">
                {s.title}
              </h1>
              <p className="mt-3 text-sm leading-snug text-[#3a3040]">{s.body}</p>
            </div>
          ))}
        </div>

        <div className="mt-6 flex items-center justify-center gap-2">
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <span
              key={i}
              className="size-1.5 rounded-full"
              style={{ backgroundColor: i === active ? "#1a1420" : "#c9a8c3" }}
            />
          ))}
        </div>

        <button
          type="button"
          onClick={() => navigate({ to: "/signup" })}
          className="mt-6 w-full rounded-full bg-[#2eab52] py-3.5 text-base font-semibold text-white active:opacity-80"
        >
          Sign up
        </button>
        <button
          type="button"
          onClick={() => navigate({ to: "/signin" })}
          className="mt-3 w-full rounded-full bg-[#e6c4e0] py-3.5 text-base font-semibold text-[#1a1420] active:opacity-80"
        >
          Log in
        </button>
      </div>
    </div>
  );
}

function CardsArt() {
  return (
    <div className="relative h-[190px] w-full max-w-[280px]">
      <div className="absolute right-0 top-0 h-[112px] w-[178px] rotate-[-12deg] rounded-xl bg-[#d9a9d4] p-3 shadow-lg">
        <span className="font-display text-sm font-bold text-white">chime</span>
        <div className="absolute bottom-2.5 right-3 text-right leading-none">
          <span className="block text-[6px] font-semibold text-white/80">DEBIT</span>
          <span className="block font-display text-sm font-bold italic text-[#2b2350]">
            VISA
          </span>
        </div>
      </div>
      <div className="absolute bottom-2 left-1 h-[112px] w-[186px] rotate-[-12deg] rounded-xl bg-[#3ec25f] p-3 shadow-xl">
        <span className="font-display text-sm font-bold text-white">chime</span>
        <span className="absolute left-3 bottom-4 block h-5 w-7 rounded bg-[#d9a9d4]" />
        <div className="absolute bottom-2.5 right-3 text-right leading-none">
          <span className="block font-display text-sm font-bold italic text-white">
            VISA
          </span>
          <span className="block text-[6px] font-semibold text-white/80">CREDIT</span>
        </div>
      </div>
    </div>
  );
}

function ScoreArt() {
  return (
    <div className="w-full max-w-[230px] overflow-hidden rounded-2xl bg-white text-[#1a1420] shadow-xl">
      <div className="flex items-center justify-between px-3 pt-2 text-[8px] font-semibold">
        <span>9:41</span>
        <span>••••</span>
      </div>
      <div className="flex items-center px-3 py-1.5">
        <span className="text-xs">‹</span>
        <span className="flex-1 text-center font-display text-xs font-bold text-[#2eab52]">
          chime
        </span>
        <span className="w-2" />
      </div>
      <div className="px-4 pb-3 pt-1 text-center">
        <svg viewBox="0 0 200 110" className="mx-auto w-full">
          <path
            d="M14 100 A86 86 0 0 1 186 100"
            fill="none"
            stroke="#e7e2e6"
            strokeWidth="12"
            strokeLinecap="round"
          />
          <path
            d="M14 100 A86 86 0 0 1 158 40"
            fill="none"
            stroke="#f0b429"
            strokeWidth="12"
            strokeLinecap="round"
          />
        </svg>
        <p className="-mt-6 text-[8px] font-semibold tracking-wide text-[#6b6470]">
          FICO<sup>®</sup> SCORE
        </p>
        <p className="font-display text-3xl font-bold leading-none">701</p>
        <div className="mt-1 flex items-center justify-between text-[6px] text-[#6b6470]">
          <span>300</span>
          <span>Updated 4/4/22 from Experian® data</span>
          <span>850</span>
        </div>
      </div>
      <div className="grid grid-cols-2 border-t border-[#eceaee] text-center">
        <div className="border-r border-[#eceaee] py-2">
          <p className="text-[9px] font-semibold">↑ 8</p>
          <p className="text-[6px] text-[#6b6470]">since last week</p>
        </div>
        <div className="py-2">
          <p className="text-[9px] font-semibold">↑ 36</p>
          <p className="text-[6px] text-[#6b6470]">since tracking with Chime</p>
        </div>
      </div>
    </div>
  );
}
