import type { ReactNode } from "react";

export function PhoneFrame({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-dvh w-full items-center justify-center overflow-x-hidden bg-surface-deep py-0 sm:bg-neutral-200 sm:py-10 dark:sm:bg-[#050807]">
      <div className="relative w-full max-w-[420px] sm:rounded-[46px] sm:border-[10px] sm:border-neutral-300 sm:shadow-[0_40px_120px_-30px_rgba(0,0,0,0.45)] sm:dark:border-[#161b18] sm:dark:shadow-[0_40px_120px_-30px_rgba(0,0,0,0.9)]">
        <main className="relative flex h-[100dvh] max-h-[100dvh] w-full flex-col overflow-hidden bg-background pt-[env(safe-area-inset-top)] pb-[env(safe-area-inset-bottom)] sm:h-[860px] sm:rounded-[36px] sm:pt-0 sm:pb-0">
          {children}
        </main>
      </div>
    </div>
  );
}
