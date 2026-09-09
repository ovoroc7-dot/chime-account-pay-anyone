export function ChimeLogo({ className = "size-8" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="Chime logo"
    >
      <rect width="32" height="32" rx="16" fill="#16A34A" />
      <path
        d="M22 11.5c-1.3-1.5-3.2-2.5-5.3-2.5-4 0-7.2 3.2-7.2 7.2s3.2 7.2 7.2 7.2c2.1 0 4-0.9 5.3-2.4"
        stroke="white"
        strokeWidth="3.5"
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  );
}
