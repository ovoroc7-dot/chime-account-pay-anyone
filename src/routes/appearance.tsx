import { createFileRoute, Link } from "@tanstack/react-router";
import { ChevronLeft, Check } from "lucide-react";
import { useState } from "react";
import { PhoneFrame } from "@/components/PhoneFrame";

export const Route = createFileRoute("/appearance")({
  head: () => ({
    meta: [
      { title: "Appearance — Choose Your App Theme" },
      {
        name: "description",
        content: "Pick a light, dark or system theme for the app appearance.",
      },
      { property: "og:title", content: "Appearance — Choose Your App Theme" },
      { property: "og:description", content: "Light, dark or system theme options." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: AppearanceScreen,
});

const THEMES = ["Light", "Dark", "System"] as const;

function AppearanceScreen() {
  const [theme, setTheme] = useState<string>("System");

  return (
    <PhoneFrame>
      <div className="flex items-center px-4 pt-5">
        <Link to="/profile" aria-label="Back" className="active:opacity-60">
          <ChevronLeft className="size-6" />
        </Link>
        <span className="flex-1 text-center font-display text-base font-bold">Theme</span>
        <span className="size-6" />
      </div>

      <ul className="mt-6 px-6">
        {THEMES.map((t) => (
          <li key={t}>
            <button
              type="button"
              aria-pressed={theme === t}
              onClick={() => setTheme(t)}
              className="flex w-full items-center justify-between py-4 text-left active:opacity-70"
            >
              <span className="text-[15px]">{t}</span>
              {theme === t && <Check className="size-5" />}
            </button>
          </li>
        ))}
      </ul>
    </PhoneFrame>
  );
}
