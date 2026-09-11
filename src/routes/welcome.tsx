import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { PhoneFrame } from "@/components/PhoneFrame";
import chimeWordmark from "@/assets/chime-wordmark.png.asset.json";

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

const DEEP = "#123b28";
const GREEN = "#1ec677";
const INK = "#12352a";

function WelcomeScreen() {
  const [stage, setStage] = useState<Stage>("splash");

  useEffect(() => {
    const a = window.setTimeout(() => setStage("loading"), 1600);
    const b = window.setTimeout(() => setStage("landing"), 3200);
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

function Wordmark({
  className = "text-3xl",
  color = GREEN,
}: {
  className?: string;
  color?: string;
}) {
  const isGreen = color === GREEN;
  return (
    <span className={`inline-block leading-none ${className}`}>
      <img
        src={chimeWordmark.url}
        alt="Chime"
        className="h-[1.15em] w-auto object-contain"
        style={isGreen ? undefined : { filter: "brightness(0) invert(1)" }}
      />
    </span>
  );
}

function Splash() {
  return (
    <div
      className="flex h-full w-full items-center justify-center"
      style={{ backgroundColor: DEEP }}
    >
      <Wordmark className="text-[40px]" />
    </div>
  );
}

function Loading() {
  return (
    <div className="flex h-full w-full items-center justify-center bg-white">
      <span
        role="status"
        aria-label="Loading"
        className="block size-6 animate-spin rounded-full border-2 border-[#d5d5d5] border-t-[#8c8c8c]"
      />
    </div>
  );
}

type Slide = {
  id: string;
  bg: string;
  logo: string;
  title: ReactNode;
  body: ReactNode;
  art: ReactNode;
};

const slides: Slide[] = [
  {
    id: "loved",
    bg: "#123b28",
    logo: GREEN,
    title: (
      <>
        The #1 Most Loved Banking App
        <sup className="text-[0.45em] align-super">1</sup>
      </>
    ),
    body: (
      <>
        Start building credit,<sup className="text-[0.75em] align-super">2</sup> say
        goodbye to monthly fees, save money, and more.
      </>
    ),
    art: <CardsArt />,
  },
  {
    id: "credit",
    bg: "#123b28",
    logo: GREEN,
    title: (
      <>
        Start building credit
        <sup className="text-[0.45em] align-super">3</sup>
      </>
    ),
    body: (
      <>
        No annual fees, no interest,<sup className="text-[0.75em] align-super">4</sup>{" "}
        and no credit check. Members see an increase of 30 points on average.
        <sup className="text-[0.75em] align-super">5</sup>
      </>
    ),
    art: <ScoreArt />,
  },
  {
    id: "fees",
    bg: "#b9ecd8",
    logo: "#12a85f",
    title: <>Say goodbye to fees</>,
    body: (
      <>
        No monthly fees, no minimum balances, and 47,000+ fee-free ATMs.
        <sup className="text-[0.75em] align-super">6</sup>
      </>
    ),
    art: <NoFeesArt />,
  },
  {
    id: "spotme",
    bg: "#c9edbf",
    logo: "#12a85f",
    title: (
      <>
        Overdraft up to $200
        <sup className="text-[0.45em] align-super">7</sup>
      </>
    ),
    body: <>We'll cover your transactions and cash withdrawals up to $200.</>,
    art: <SpotMeArt />,
  },
  {
    id: "paid-early",
    bg: "#2fd07f",
    logo: "#ffffff",
    title: <>Get paid early</>,
    body: (
      <>
        Celebrate payday up to 2 days early<sup className="text-[0.75em] align-super">8</sup>{" "}
        when you set up a qualifying direct deposit.
      </>
    ),
    art: <PaydayArt />,
  },
  {
    id: "pay-anyone",
    bg: "#123b28",
    logo: GREEN,
    title: <>Pay anyone, instantly</>,
    body: (
      <>
        Send money to friends and family with no fees — even if they don't have Chime.
      </>
    ),
    art: <PayAnyoneArt />,
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

  const slide = slides[active] ?? slides[0]!;

  return (
    <div className="h-full w-full overflow-y-auto bg-white">
      <div
        className="flex h-[54vh] min-h-[300px] flex-col transition-colors duration-300"
        style={{ backgroundColor: slide.bg }}
      >
        <div className="flex items-center justify-center pt-5 pb-2">
          <Wordmark className="text-[24px]" color={slide.logo} />
        </div>
        <div className="flex flex-1 items-center justify-center overflow-hidden px-6 pb-2">
          {slide.art}
        </div>
      </div>

      <div className="bg-white px-6 pt-7" style={{ color: INK }}>
        <div
          ref={trackRef}
          onScroll={onScroll}
          className="flex snap-x snap-mandatory overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {slides.map((s) => (
            <div key={s.id} className="min-h-[124px] w-full shrink-0 snap-center pr-px">
              <h1 className="font-brand text-[28px] font-extrabold leading-[1.18] tracking-[-0.02em]">
                {s.title}
              </h1>
              <p className="mt-2.5 text-[14px] leading-[1.45] text-[#3d5a4d]">{s.body}</p>
            </div>
          ))}
        </div>

        <div className="mt-4 flex items-center justify-center gap-1.5">
          {slides.map((s, i) => (
            <span
              key={s.id}
              className="size-1.5 rounded-full transition-colors"
              style={{ backgroundColor: i === active ? INK : "#d3ddd7" }}
            />
          ))}
        </div>

        <button
          type="button"
          onClick={() => navigate({ to: "/signup" })}
          className="mt-5 w-full rounded-full py-4 font-brand text-[16px] font-bold text-white active:opacity-80"
          style={{ backgroundColor: "#2ecc71" }}
        >
          Sign up
        </button>
        <button
          type="button"
          onClick={() => navigate({ to: "/signin" })}
          className="mt-3 w-full rounded-full bg-[#efefef] py-4 font-brand text-[16px] font-bold text-[#1a1a1a] active:opacity-80"
        >
          Log in
        </button>

        <div className="mt-7 space-y-3 pb-10 text-[11.5px] leading-[1.5] text-[#5a6b62]">
          <p>
            Chime is a financial technology company, not a bank. Banking services and
            debit card provided by The Bancorp Bank, N.A. or Stride Bank, N.A.; Members
            FDIC.
          </p>
          <p>
            The Chime Credit Builder Visa® Credit Card is issued by The Bancorp Bank, N.A.
            or Stride Bank, N.A. pursuant to a license from Visa U.S.A. Inc. and may be
            used everywhere Visa credit cards are accepted. Please see the back of your
            Card for its issuing bank.
          </p>
          <p>
            <sup>1</sup>Chime is recommended by more of its users than other financial
            brands in the survey per 2024 Qualtrics® NPS score. ® Trademark Chime
            Financial, Inc.
          </p>
          <p>
            <sup>2</sup>On-time payment history may have a positive impact on your credit
            score. Late payment may negatively impact your credit score. Results may vary.
          </p>
        </div>
      </div>
    </div>
  );
}

function CardsArt() {
  return (
    <div className="relative h-[200px] w-full max-w-[290px]">
      <div className="absolute right-0 top-2 h-[120px] w-[192px] rotate-[-14deg] rounded-xl bg-gradient-to-br from-[#f4f4f4] to-[#cfd3d2] p-3 shadow-2xl">
        <span className="font-brand text-sm font-black text-[#2ecc71]">chime</span>
        <div className="absolute bottom-2.5 right-3 text-right leading-none">
          <span className="block text-[6px] font-semibold text-[#5a6b62]">DEBIT</span>
          <span className="block font-display text-base font-bold italic text-[#1a1f71]">
            VISA
          </span>
        </div>
      </div>
      <div className="absolute bottom-3 left-0 h-[124px] w-[200px] rotate-[-14deg] rounded-xl bg-gradient-to-br from-[#3fe08a] to-[#22b466] p-3 shadow-2xl">
        <span className="font-brand text-sm font-black text-white">chime</span>
        <span className="absolute left-3 bottom-4 block h-5 w-7 rounded bg-white/70" />
        <div className="absolute bottom-2.5 right-3 text-right leading-none">
          <span className="block font-display text-base font-bold italic text-white">
            VISA
          </span>
          <span className="block text-[6px] font-semibold text-white/85">CREDIT</span>
        </div>
      </div>
    </div>
  );
}

function PhoneMock({ children }: { children: ReactNode }) {
  return (
    <div className="w-[190px] overflow-hidden rounded-t-[22px] border-[5px] border-b-0 border-[#0f2c1f] bg-white shadow-2xl">
      <div className="flex items-center justify-between px-3 pt-1.5 text-[7px] font-semibold text-[#12352a]">
        <span>9:41</span>
        <span>••••</span>
      </div>
      {children}
    </div>
  );
}

function ScoreArt() {
  return (
    <PhoneMock>
      <div className="flex items-center px-3 py-1">
        <span className="text-[10px] text-[#12352a]">‹</span>
        <span className="flex-1 text-center font-brand text-[11px] font-black text-[#2ecc71]">
          chime
        </span>
        <span className="w-2" />
      </div>
      <div className="px-3 pb-4 text-center text-[#12352a]">
        <svg viewBox="0 0 200 110" className="mx-auto w-full">
          <path
            d="M14 100 A86 86 0 0 1 186 100"
            fill="none"
            stroke="#dff0e6"
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
        <p className="-mt-7 text-[7px] font-bold tracking-wide text-[#6b7a72]">
          FICO<sup>®</sup> SCORE
        </p>
        <p className="font-display text-[30px] font-bold leading-none">701</p>
        <p className="mt-1 text-[6px] text-[#6b7a72]">
          Updated 4/4/22 from Experian® data
        </p>
        <div className="mt-2 grid grid-cols-2 gap-1.5 text-center">
          <div className="rounded-md border border-[#e6ece9] py-1.5">
            <p className="text-[9px] font-bold">↑ 8</p>
            <p className="text-[6px] text-[#6b7a72]">since last week</p>
          </div>
          <div className="rounded-md border border-[#e6ece9] py-1.5">
            <p className="text-[9px] font-bold">↑ 36</p>
            <p className="text-[6px] text-[#6b7a72]">since tracking with Chime</p>
          </div>
        </div>
      </div>
    </PhoneMock>
  );
}

function NoFeesArt() {
  return (
    <svg viewBox="0 0 200 200" className="h-[190px] w-[190px]" aria-hidden="true">
      <ellipse cx="105" cy="150" rx="38" ry="11" fill="#f5c542" />
      <rect x="67" y="124" width="76" height="22" rx="11" fill="#f0b429" />
      <ellipse cx="105" cy="124" rx="38" ry="11" fill="#f5c542" />
      <ellipse cx="88" cy="112" rx="30" ry="9" fill="#f5c542" />
      <rect x="58" y="96" width="60" height="18" rx="9" fill="#f0b429" />
      <ellipse cx="88" cy="96" rx="30" ry="9" fill="#ffd75e" />
      <text
        x="88"
        y="101"
        textAnchor="middle"
        fontSize="14"
        fontWeight="700"
        fill="#b07d0c"
      >
        $
      </text>
      <circle
        cx="100"
        cy="105"
        r="72"
        fill="none"
        stroke="#2ecc71"
        strokeWidth="10"
      />
      <line
        x1="49"
        y1="54"
        x2="151"
        y2="156"
        stroke="#2ecc71"
        strokeWidth="10"
        strokeLinecap="round"
      />
    </svg>
  );
}

function SpotMeArt() {
  return (
    <div className="relative">
      <PhoneMock>
        <div className="flex items-center px-3 py-1 text-[#12352a]">
          <span className="text-[10px]">‹</span>
          <span className="flex-1 text-center text-[10px] font-bold">SpotMe</span>
          <span className="text-[10px]">?</span>
        </div>
        <div className="px-3 pb-4 text-[#12352a]">
          <div className="mx-auto flex size-[86px] flex-col items-center justify-center rounded-full border-[5px] border-[#2ecc71]">
            <span className="text-[6px] text-[#6b7a72]">Available</span>
            <span className="font-display text-[19px] font-bold leading-none">
              $200<sup className="text-[9px]">00</sup>
            </span>
          </div>
          <p className="mt-3 text-[9px] font-bold">Your limit</p>
          <div className="mt-1 divide-y divide-[#eef2f0] rounded-md border border-[#eef2f0] text-[8px]">
            <div className="flex justify-between px-2 py-1.5">
              <span>Total</span>
              <span className="font-semibold">$200</span>
            </div>
            <div className="flex justify-between px-2 py-1.5">
              <span>Base</span>
              <span className="font-semibold">$160</span>
            </div>
            <div className="flex justify-between px-2 py-1.5">
              <span>Bonuses</span>
              <span className="font-semibold">$30</span>
            </div>
          </div>
        </div>
      </PhoneMock>
      <Coin className="-left-6 top-16" />
      <Coin className="-right-5 -top-2" />
      <Coin className="-right-6 top-32" />
    </div>
  );
}

function Coin({ className = "" }: { className?: string }) {
  return (
    <span
      className={`absolute flex size-9 items-center justify-center rounded-full bg-[#f5c542] font-display text-base font-bold text-[#b07d0c] shadow-md ${className}`}
      aria-hidden="true"
    >
      $
    </span>
  );
}

function PaydayArt() {
  return (
    <div className="w-full max-w-[250px]">
      <div className="mx-auto h-[112px] w-[188px] rotate-[-4deg] rounded-xl bg-gradient-to-br from-white to-[#e3e6e5] p-3 shadow-2xl">
        <span className="float-right font-brand text-sm font-black text-[#2ecc71]">
          chime
        </span>
        <span className="block h-5 w-7 rounded bg-[#cfd3d2]" />
        <div className="absolute" />
        <div className="mt-8 text-right leading-none">
          <span className="block text-[6px] font-semibold text-[#5a6b62]">DEBIT</span>
          <span className="block font-display text-base font-bold italic text-[#1a1f71]">
            VISA
          </span>
        </div>
      </div>
      <div className="mt-4 flex items-start gap-2 rounded-xl bg-white p-3 shadow-lg">
        <span className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-md bg-[#2ecc71] font-brand text-xs font-black text-white">
          C
        </span>
        <div className="text-[10px] leading-[1.35] text-[#12352a]">
          <p className="font-bold">Payday has come early! 🎉</p>
          <p>$890.49 was deposited into your account.</p>
        </div>
      </div>
    </div>
  );
}

function PayAnyoneArt() {
  return (
    <PhoneMock>
      <div className="px-3 pb-5 pt-2 text-[#12352a]">
        <p className="text-center font-brand text-[11px] font-black text-[#2ecc71]">
          chime
        </p>
        <p className="mt-4 text-center text-[8px] text-[#6b7a72]">You sent</p>
        <p className="text-center font-display text-[26px] font-bold leading-none">
          $50.00
        </p>
        <div className="mt-4 space-y-1.5">
          {["Alex R.", "Jamie T.", "Sam O."].map((n) => (
            <div
              key={n}
              className="flex items-center gap-2 rounded-md border border-[#eef2f0] px-2 py-1.5"
            >
              <span className="flex size-5 items-center justify-center rounded-full bg-[#dff5e9] text-[7px] font-bold text-[#12352a]">
                {n[0]}
              </span>
              <span className="text-[8px] font-semibold">{n}</span>
              <span className="ml-auto text-[8px] font-semibold text-[#2ecc71]">Pay</span>
            </div>
          ))}
        </div>
      </div>
    </PhoneMock>
  );
}
