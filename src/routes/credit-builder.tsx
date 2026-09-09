import { createFileRoute, useRouter } from "@tanstack/react-router";
import { ArrowRight, ChevronLeft, Check } from "lucide-react";
import { useState } from "react";
import { PhoneFrame } from "@/components/PhoneFrame";
import slide1 from "@/assets/cb-1.png";
import slide2 from "@/assets/cb-2.png";
import slide3 from "@/assets/cb-3.png";

export const Route = createFileRoute("/credit-builder")({
  head: () => ({
    meta: [
      { title: "Credit Builder — Set up your secured card" },
      {
        name: "description",
        content:
          "Set up Credit Builder: a secured credit card with no annual fees or interest, no credit check to apply, and monthly credit bureau reporting.",
      },
      { property: "og:title", content: "Credit Builder — Set up your secured card" },
      {
        property: "og:description",
        content:
          "A credit card you control. Spend only what you add and build your credit history each month.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: CreditBuilderScreen,
});

const slides = [
  {
    title: "A credit card you control",
    image: slide1,
    alt: "Hand holding a green credit card",
    bullets: [
      { text: "No annual fees or interest", emoji: "🚫" },
      { text: "No credit check to apply", emoji: "🚫" },
      { text: "Helps build credit", emoji: "✅" },
    ],
  },
  {
    title: "Spend only what you add",
    image: slide2,
    alt: "Cash bills next to a green credit card",
    caption: "Move money to Credit Builder any time and charge up to that amount 💰",
  },
  {
    title: "Build your credit history",
    image: slide3,
    alt: "Green credit card with a rising credit score gauge",
    caption: "Each month, we'll tell the credit bureaus how well you're doing 👍",
  },
];

function CreditBuilderScreen() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [applied, setApplied] = useState(false);

  if (applied) {
    return (
      <PhoneFrame>
        <div className="flex flex-1 flex-col items-center justify-center px-8 text-center">
          <span className="grid size-20 place-items-center rounded-full bg-primary text-primary-foreground">
            <Check className="size-10" strokeWidth={3} />
          </span>
          <h1 className="mt-8 font-display text-3xl font-extrabold">You're all set</h1>
          <p className="mt-3 text-sm text-muted-foreground">
            Your Credit Builder account is open. Move money in, then spend it with your Credit
            Builder card to start building history.
          </p>
        </div>
        <div className="px-6 pb-8">
          <button
            onClick={() => router.navigate({ to: "/" })}
            className="w-full rounded-full bg-primary py-4 text-base font-semibold text-primary-foreground active:opacity-80"
          >
            Back to accounts
          </button>
        </div>
      </PhoneFrame>
    );
  }

  const slide = slides[step]!;
  const last = step === slides.length - 1;

  return (
    <PhoneFrame>
      <div className="flex items-center px-5 pt-5">
        <button
          aria-label="Back"
          onClick={() => (step === 0 ? router.navigate({ to: "/" }) : setStep(step - 1))}
          className="active:opacity-60"
        >
          <ChevronLeft className="size-7" strokeWidth={2} />
        </button>
      </div>

      <div className="flex flex-1 flex-col overflow-y-auto px-8 pt-6">
        <h1 className="text-center font-display text-[32px] font-extrabold leading-tight">
          {slide.title}
        </h1>

        <div className="relative mx-auto mt-8 grid size-56 place-items-center">
          <span className="absolute size-44 rounded-full bg-primary/25" />
          <img
            src={slide.image}
            alt={slide.alt}
            loading="lazy"
            width={768}
            height={768}
            className="relative size-52 object-contain"
          />
        </div>

        <div className="mt-auto pb-6 pt-10">
          {slide.bullets && (
            <ul className="space-y-2.5">
              {slide.bullets.map((b) => (
                <li key={b.text} className="flex items-center gap-2 text-sm">
                  {b.text} <span>{b.emoji}</span>
                </li>
              ))}
            </ul>
          )}
          {slide.caption && (
            <p className="text-sm leading-relaxed text-foreground/90">{slide.caption}</p>
          )}
        </div>
      </div>

      <div className="flex items-center justify-between px-8 pb-8 pt-2">
        <div className="flex items-center gap-2">
          {slides.map((s, i) => (
            <span
              key={s.title}
              className={`size-2 rounded-full ${i === step ? "bg-white" : "bg-white/25"}`}
            />
          ))}
        </div>
        <button
          aria-label={last ? "Apply for Credit Builder" : "Next"}
          onClick={() => (last ? setApplied(true) : setStep(step + 1))}
          className="grid size-14 place-items-center rounded-full bg-primary text-primary-foreground active:opacity-80"
        >
          <ArrowRight className="size-6" strokeWidth={2.5} />
        </button>
      </div>
    </PhoneFrame>
  );
}
