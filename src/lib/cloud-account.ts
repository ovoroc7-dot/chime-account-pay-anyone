import { supabase } from "@/integrations/supabase/client";
import { ACCOUNT, findAccount, signIn, type Account } from "./session-store";

/** Device storage keys that make up a user's money data, synced to the cloud. */
const SYNC_KEYS = ["chime-ledger-v1", "chime-goals-v1", "chime-pay-activity-v1"];
const PROFILE_KEY = "chime-profile-v1";

let patched = false;
let timer: ReturnType<typeof setTimeout> | null = null;
let suspended = false;

function collect() {
  const data: Record<string, unknown> = {};
  for (const k of SYNC_KEYS) {
    const raw = localStorage.getItem(k);
    if (raw) {
      try {
        data[k] = JSON.parse(raw);
      } catch {
        /* skip */
      }
    }
  }
  return data;
}

async function upload() {
  const { data: u } = await supabase.auth.getUser();
  if (!u.user) return;
  await supabase
    .from("user_state")
    .upsert({ user_id: u.user.id, data: collect() as never, updated_at: new Date().toISOString() });
}

/** Watches device saves of money data and pushes them to the cloud. */
export function startCloudSync() {
  if (patched || typeof window === "undefined") return;
  patched = true;
  const orig = Storage.prototype.setItem;
  Storage.prototype.setItem = function (key: string, value: string) {
    orig.call(this, key, value);
    if (!suspended && this === window.localStorage && SYNC_KEYS.includes(key)) {
      if (timer) clearTimeout(timer);
      timer = setTimeout(() => void upload(), 400);
    }
  };
  // Pull fresh data when the app comes back to the foreground.
  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "visible") void pull(true);
  });
}

/** Loads the signed-in user's cloud data onto this device. */
async function pull(reloadIfChanged = false) {
  const { data: u } = await supabase.auth.getUser();
  if (!u.user) return false;
  const { data } = await supabase.from("user_state").select("data").eq("user_id", u.user.id).maybeSingle();
  const remote = (data?.data ?? null) as Record<string, unknown> | null;
  if (!remote) return false;
  const before = JSON.stringify(collect());
  suspended = true;
  for (const k of SYNC_KEYS) {
    if (k in remote) localStorage.setItem(k, JSON.stringify(remote[k]));
    else localStorage.removeItem(k);
  }
  suspended = false;
  const changed = before !== JSON.stringify(collect());
  if (reloadIfChanged && changed) window.location.reload();
  return true;
}

function clearLocalMoney() {
  for (const k of SYNC_KEYS) localStorage.removeItem(k);
}

function saveProfile(p: Omit<Account, "password">) {
  localStorage.setItem(PROFILE_KEY, JSON.stringify(p));
}

export function getCloudProfile(): Omit<Account, "password"> | null {
  try {
    const raw = localStorage.getItem(PROFILE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

type Extra = { phone?: string; dob?: string; address?: string };

async function afterAuth(email: string, meta: Record<string, unknown>) {
  const m = meta as { name?: string; phone?: string; dob?: string; address?: string; createdAt?: string };
  const name = String(m.name ?? "") || email;
  const p: Omit<Account, "password"> = { email, name };
  if (m.phone) p.phone = m.phone;
  if (m.dob) p.dob = m.dob;
  if (m.address) p.address = m.address;
  if (m.createdAt) p.createdAt = m.createdAt;
  saveProfile(p);
  clearLocalMoney();
  const had = await pull();
  if (!had) await upload();
  signIn(email, name);
}

/** Creates the account online so it works on every device. */
export async function cloudSignUp(email: string, password: string, name: string, extra: Extra) {
  const clean = email.trim().toLowerCase();
  const meta = { name, ...extra, createdAt: new Date().toISOString() };
  const { data, error } = await supabase.auth.signUp({
    email: clean,
    password,
    options: { data: meta, emailRedirectTo: window.location.origin },
  });
  if (error) {
    if (/registered|exists/i.test(error.message)) {
      return cloudSignIn(clean, password);
    }
    return error.message;
  }
  if (!data.session) {
    const r = await supabase.auth.signInWithPassword({ email: clean, password });
    if (r.error) return r.error.message;
  }
  await afterAuth(clean, meta);
  return null;
}

/** Logs in with the cloud account; moves older device-only accounts online. */
export async function cloudSignIn(email: string, password: string): Promise<string | null> {
  const clean = email.trim().toLowerCase();
  const { data, error } = await supabase.auth.signInWithPassword({ email: clean, password });
  if (!error && data.user) {
    await afterAuth(clean, data.user.user_metadata ?? {});
    return null;
  }
  // Older accounts saved only on this device (or the demo account): create them online.
  const local = findAccount(clean, password);
  if (local) {
    const { password: _p, email: _e, ...rest } = local;
    const extra = clean === ACCOUNT.email ? {} : rest;
    const r = await supabase.auth.signUp({
      email: clean,
      password,
      options: { data: { ...extra, name: local.name }, emailRedirectTo: window.location.origin },
    });
    if (!r.error) {
      if (!r.data.session) await supabase.auth.signInWithPassword({ email: clean, password });
      // keep this device's existing money data for the migrated account
      const keep = collect();
      saveProfile({ ...rest, email: clean, name: local.name });
      const { data: u } = await supabase.auth.getUser();
      if (u.user) {
        await supabase.from("user_state").upsert({ user_id: u.user.id, data: keep as never });
        signIn(clean, local.name);
        return null;
      }
    }
  }
  return "The email or password you entered is incorrect.";
}

export async function cloudSignOut() {
  await supabase.auth.signOut();
  clearLocalMoney();
  localStorage.removeItem(PROFILE_KEY);
}
