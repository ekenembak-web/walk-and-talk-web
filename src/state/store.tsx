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
const WELCOME_KEY = "wt.welcomeDismissed";
const CONVOS_KEY = "wt.conversations";

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

  /* auth */
  const [signedIn, setSignedIn] = useState(false);
  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");

  /* welcome */
  const [welcomeOpen, setWelcomeOpen] = useState(
    () => !readStored<boolean>(WELCOME_KEY, false),
  );
  const dismissWelcome = useCallback(() => {
    setWelcomeOpen(false);
    writeStored(WELCOME_KEY, true);
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
    const resume = pendingAction.current;
    pendingAction.current = null;
    if (resume) setTimeout(resume, 60);
  }, []);

  const logOut = useCallback(() => {
    setSignedIn(false);
    setUserName("");
    setUserEmail("");
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

  const [composerTo, setComposerTo] = useState<string[]>([]);
  const openComposerFor = useCallback(
    (name: string, opts?: { append?: boolean }) => {
      requireAccount(() =>
        setComposerTo((cur) =>
          opts?.append ? (cur.includes(name) ? cur : [...cur, name]) : [name],
        ),
      );
    },
    [requireAccount],
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
    setComposerTo([]);
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
            const rest = cs.filter((_, i2) => i2 !== idx);
            return [{ ...conv, last: reply, when: "Just now", unread: true, messages }, ...rest];
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
