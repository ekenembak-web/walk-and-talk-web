import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import type { Conversation } from "../lib/types";
import * as api from "../data/api";

/* ------------------------------------------------------------------ *
 * Theme
 * ------------------------------------------------------------------ */
type ThemeOverride = "light" | "dark" | null;
const THEME_KEY = "wt.theme";
const CONVOS_KEY = "wt.conversations";
const SESSION_KEY = "wt.session"; // localStorage — sign-in survives a reload
const WELCOMED_KEY = "wt.welcomed"; // sessionStorage — welcome shows once per browser session

interface StoredSession {
  signedIn: boolean;
  userName: string;
  userEmail: string;
}

function readStored<T>(key: string, fallback: T): T {
  try {
    const v = localStorage.getItem(key);
    return v == null ? fallback : (JSON.parse(v) as T);
  } catch {
    return fallback;
  }
}
function writeStored(key: string, value: unknown) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* private mode / disabled storage — ignore */
  }
}
function removeStored(key: string) {
  try {
    localStorage.removeItem(key);
  } catch {
    /* ignore */
  }
}
function sessionFlag(key: string): boolean {
  try {
    return sessionStorage.getItem(key) === "1";
  } catch {
    return false;
  }
}
function setSessionFlag(key: string, on: boolean) {
  try {
    if (on) sessionStorage.setItem(key, "1");
    else sessionStorage.removeItem(key);
  } catch {
    /* ignore */
  }
}

/* ------------------------------------------------------------------ *
 * Account gating
 *
 * Browsing is open. An account is required only at the point of
 * commitment. `requireAccount` records the *intent* (a resume closure)
 * and, after signup completes, performs the original action instead of
 * dropping the user at home. The page in view is preserved by React
 * Router staying mounted on the same route.
 * ------------------------------------------------------------------ */

export interface AppApi {
  // theme
  isDark: boolean;
  themeOverride: ThemeOverride;
  toggleTheme: () => void;

  // language
  language: string;
  setLanguage: (l: string) => void;

  // auth
  signedIn: boolean;
  userName: string;
  userEmail: string;
  logOut: () => void;

  // welcome overlay
  welcomeOpen: boolean;
  dismissWelcome: () => void;

  // gating
  requireAccountToBrowse: boolean;
  /** Run `action` now if allowed, else open the auth modal and run it after signup. */
  gateBrowse: (action: () => void) => void;
  /** Run `action` now if signed in, else open the auth modal and run it after signup. */
  requireAccount: (action: () => void) => void;

  // auth modal
  authOpen: boolean;
  authMode: "signup" | "login";
  openAuth: (mode?: "signup" | "login") => void;
  closeAuth: () => void;
  setAuthMode: (m: "signup" | "login") => void;
  completeAuth: (result: api.AuthResult) => void;

  // conversations + composer
  conversations: Conversation[];
  unreadCount: number;
  markConversationRead: (name: string) => void;
  /** Composer recipients. Empty array = composer closed. Web opens with one;
   *  mobile can address several at once (`append`). */
  composerTo: string[];
  openComposerFor: (name: string, opts?: { append?: boolean }) => void;
  closeComposer: () => void;
  sendMessage: (to: string[], body: string) => Promise<void>;
}

const Ctx = createContext<AppApi | null>(null);

export function AppProvider({
  children,
  requireAccountToBrowse = false,
}: {
  children: ReactNode;
  requireAccountToBrowse?: boolean;
}) {
  /* theme */
  const [themeOverride, setThemeOverride] = useState<ThemeOverride>(() =>
    readStored<ThemeOverride>(THEME_KEY, null),
  );
  const [systemDark, setSystemDark] = useState(
    () => typeof window !== "undefined" && window.matchMedia?.("(prefers-color-scheme: dark)").matches,
  );
  useEffect(() => {
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const handler = (e: MediaQueryListEvent) => setSystemDark(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);
  const isDark = themeOverride ? themeOverride === "dark" : !!systemDark;
  useEffect(() => {
    const root = document.documentElement;
    if (themeOverride) root.setAttribute("data-theme", themeOverride);
    else root.removeAttribute("data-theme");
    writeStored(THEME_KEY, themeOverride);
  }, [themeOverride]);
  const toggleTheme = useCallback(
    () => setThemeOverride(isDark ? "light" : "dark"),
    [isDark],
  );

  /* language */
  const [language, setLanguage] = useState("English");

  /* auth — restored from a persisted session so a reload keeps you signed in */
  const storedSession = readStored<StoredSession | null>(SESSION_KEY, null);
  const [signedIn, setSignedIn] = useState(!!storedSession?.signedIn);
  const [userName, setUserName] = useState(storedSession?.userName ?? "");
  const [userEmail, setUserEmail] = useState(storedSession?.userEmail ?? "");

  /* composer / chat recipients (empty = no chat open) */
  const [composerTo, setComposerTo] = useState<string[]>([]);
  const composerToRef = useRef<string[]>(composerTo);
  composerToRef.current = composerTo;

  /* welcome — shown once per browser session (or after logout), not per reload */
  const [welcomeOpen, setWelcomeOpen] = useState(
    () => !storedSession?.signedIn && !sessionFlag(WELCOMED_KEY),
  );
  const dismissWelcome = useCallback(() => {
    setWelcomeOpen(false);
    setSessionFlag(WELCOMED_KEY, true);
  }, []);

  /* auth modal + pending resume action */
  const [authOpen, setAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState<"signup" | "login">("signup");
  const pendingAction = useRef<null | (() => void)>(null);

  const openAuth = useCallback((mode: "signup" | "login" = "signup") => {
    setAuthMode(mode);
    setAuthOpen(true);
  }, []);
  const closeAuth = useCallback(() => {
    setAuthOpen(false);
    pendingAction.current = null;
  }, []);

  const gateBrowse = useCallback(
    (action: () => void) => {
      if (signedIn || !requireAccountToBrowse) {
        action();
        return;
      }
      pendingAction.current = action;
      openAuth("signup");
    },
    [signedIn, requireAccountToBrowse, openAuth],
  );

  const requireAccount = useCallback(
    (action: () => void) => {
      if (signedIn) {
        action();
        return;
      }
      pendingAction.current = action;
      openAuth("signup");
    },
    [signedIn, openAuth],
  );

  const completeAuth = useCallback((result: api.AuthResult) => {
    setSignedIn(true);
    setUserName(result.userName);
    setUserEmail(result.email);
    setWelcomeOpen(false);
    setAuthOpen(false);
    setSessionFlag(WELCOMED_KEY, true);
    writeStored(SESSION_KEY, {
      signedIn: true,
      userName: result.userName,
      userEmail: result.email,
    } satisfies StoredSession);
    const resume = pendingAction.current;
    pendingAction.current = null;
    if (resume) setTimeout(resume, 60);
  }, []);

  const logOut = useCallback(() => {
    setSignedIn(false);
    setUserName("");
    setUserEmail("");
    setComposerTo([]);
    removeStored(SESSION_KEY);
    setSessionFlag(WELCOMED_KEY, false);
    setWelcomeOpen(true);
  }, []);

  /* conversations */
  const [conversations, setConversations] = useState<Conversation[]>(() =>
    // Migrate anything persisted before `messages` existed.
    readStored<Array<Partial<Conversation> & Pick<Conversation, "name">>>(CONVOS_KEY, []).map((c) => ({
      name: c.name,
      last: c.last ?? "",
      when: c.when ?? "",
      unread: !!c.unread,
      messages: c.messages ?? [],
    })),
  );
  useEffect(() => writeStored(CONVOS_KEY, conversations), [conversations]);
  const unreadCount = conversations.filter((c) => c.unread).length;

  const markConversationRead = useCallback((name: string) => {
    setConversations((cs) => cs.map((c) => (c.name === name ? { ...c, unread: false } : c)));
  }, []);

  const openComposerFor = useCallback(
    (name: string, opts?: { append?: boolean }) => {
      requireAccount(() => {
        markConversationRead(name);
        setComposerTo((cur) =>
          opts?.append ? (cur.includes(name) ? cur : [...cur, name]) : [name],
        );
      });
    },
    [requireAccount, markConversationRead],
  );
  const closeComposer = useCallback(() => setComposerTo([]), []);

  const timers = useRef<number[]>([]);
  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  const sendMessage = useCallback(async (to: string[], body: string) => {
    const text = body.trim();
    const names = to.filter(Boolean);
    if (names.length === 0 || !text) return;
    setConversations((cs) => {
      const rest = cs.filter((c) => !names.includes(c.name));
      const updated = names.map((name) => {
        const existing = cs.find((c) => c.name === name);
        const messages = [...(existing?.messages ?? []), { from: "me" as const, text, when: "Just now" }];
        return { name, last: text, when: "Just now", unread: false, messages };
      });
      return [...updated, ...rest];
    });
    // A single-recipient chat stays open (desktop dock / mobile thread);
    // a multi-recipient send closes back to the list.
    if (names.length !== 1) setComposerTo([]);
    // Staggered canned replies, one per recipient — appended to that thread's history.
    names.forEach((name, i) => {
      window.setTimeout(async () => {
        const { reply } = await api.sendMessage(name, text);
        const t = window.setTimeout(() => {
          setConversations((cs) => {
            const idx = cs.findIndex((c) => c.name === name);
            if (idx < 0) return cs;
            const conv = cs[idx];
            const messages = [...conv.messages, { from: "them" as const, text: reply, when: "Just now" }];
            // If that chat is still open, the reader sees it — don't flag unread.
            const stillOpen = composerToRef.current.includes(name);
            const rest = cs.filter((_, i2) => i2 !== idx);
            return [{ ...conv, last: reply, when: "Just now", unread: !stillOpen, messages }, ...rest];
          });
        }, 3500 + i * 1200);
        timers.current.push(t);
      }, 0);
    });
  }, []);

  const value = useMemo<AppApi>(
    () => ({
      isDark,
      themeOverride,
      toggleTheme,
      language,
      setLanguage,
      signedIn,
      userName,
      userEmail,
      logOut,
      welcomeOpen,
      dismissWelcome,
      requireAccountToBrowse,
      gateBrowse,
      requireAccount,
      authOpen,
      authMode,
      openAuth,
      closeAuth,
      setAuthMode,
      completeAuth,
      conversations,
      unreadCount,
      markConversationRead,
      composerTo,
      openComposerFor,
      closeComposer,
      sendMessage,
    }),
    [
      isDark, themeOverride, toggleTheme, language, signedIn, userName, userEmail,
      logOut, welcomeOpen, dismissWelcome, requireAccountToBrowse, gateBrowse,
      requireAccount, authOpen, authMode, openAuth, closeAuth, completeAuth,
      conversations, unreadCount, markConversationRead, composerTo,
      openComposerFor, closeComposer, sendMessage,
    ],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useApp(): AppApi {
  const v = useContext(Ctx);
  if (!v) throw new Error("useApp must be used inside <AppProvider>");
  return v;
}
