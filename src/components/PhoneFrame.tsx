import type { ReactNode } from "react";

export function PhoneFrame({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#050807] py-0 sm:py-10">
      <div className="relative w-full max-w-[420px] sm:rounded-[46px] sm:border-[10px] sm:border-[#161b18] sm:shadow-[0_40px_120px_-30px_rgba(0,0,0,0.9)]">
        <div className="relative flex h-[100dvh] max-h-[100dvh] w-full flex-col overflow-hidden bg-background sm:h-[860px] sm:rounded-[36px]">
          {children}
        </div>
      </div>
    </div>
  );
}
