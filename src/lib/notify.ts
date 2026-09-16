/** Best-effort device notification. Silently no-ops when unavailable. */
export function notifyDevice(title: string, body: string) {
  if (typeof window === "undefined" || !("Notification" in window)) return;
  const show = () => {
    try {
      new Notification(title, { body, icon: "/icon-512.png", badge: "/favicon.png" });
    } catch {
      /* ignore */
    }
  };
  if (Notification.permission === "granted") show();
  else if (Notification.permission === "default" && window.top === window.self) {
    Notification.requestPermission()
      .then((p) => {
        if (p === "granted") show();
      })
      .catch(() => {});
  }
}
