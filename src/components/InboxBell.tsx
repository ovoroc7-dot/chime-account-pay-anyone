import { Link } from "@tanstack/react-router";
import { Bell } from "lucide-react";
import { useUnreadCount } from "@/lib/inbox-store";

export function InboxBell({ className = "" }: { className?: string }) {
  const unread = useUnreadCount();

  return (
    <Link
      to="/inbox"
      aria-label={unread > 0 ? `Inbox, ${unread} unread notifications` : "Inbox"}
      className={`relative inline-flex size-11 items-center justify-center active:opacity-60 ${className}`}
    >
      <Bell className="size-6 text-foreground" strokeWidth={1.75} />
      {unread > 0 && (
        <span className="absolute right-1.5 top-1.5 flex min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-bold leading-4 text-primary-foreground">
          {unread > 9 ? "9+" : unread}
        </span>
      )}
    </Link>
  );
}
