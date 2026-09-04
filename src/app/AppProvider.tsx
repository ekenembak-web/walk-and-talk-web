import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { useApp } from "../state/store";
import * as api from "../data/api";
import { SEED_THREADS, type Threads } from "./data";

const FAV_KEY = "wt.app.favorites";
const THREADS_KEY = "wt.app.threads";
const WELCOME_KEY = "wt.app.welcomeDismissed";

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
    /* ignore */
  }
}

export type Tab = "home" | "find" | "messages" | "favorites" | "profile";
export type SheetName =
  | "activity"
  | "host"
  | "listener"
  | "myActivity"
  | "how"
  | "about"
  | "safety"
  | "privacy"
  | "guidelines";

type ReqStatus = "pending" | "approved" | "declined";
export interface SpotRequest {
  id: string;
  name: string;
  note: string;
  status: ReqStatus;
}

interface Shell {
  // ui
  tab: Tab;
  homeFilter: "all" | "listeners" | "hostings";
  findTopic: string;
  findFormat: string;
  // messages
  threads: Threads;
  activeThreadId: string | null;
  messageDraft: string;
  // discovery sheets
  activityId: string | null;
  profileId: string | null;
  sheets: Record<SheetName, boolean>;
  langMenuOpen: boolean;
  // host listing (My Activity)
  spotRequests: SpotRequest[];
  activityOverride: Partial<Record<"schedule" | "location" | "groupSize" | "cost", string>>;
  // auth sheet
  authOpen: boolean;
  authMode: "signup" | "login";
  // toast
  toast: string;
}

const SEED_REQUESTS: SpotRequest[] = [
  { id: "req1", name: "Elena V.", note: "New to the area, would love to join a few rides before winter.", status: "pending" },
  { id: "req2", name: "Marcus B.", note: "Rode with a club back home, looking for something casual.", status: "pending" },
  { id: "req3", name: "Sofia P.", note: "Coming with my own bike, is the pace okay for a beginner?", status: "approved" },
];

const NO_SHEETS: Record<SheetName, boolean> = {
  activity: false, host: false, listener: false, myActivity: false,
  how: false, about: false, safety: false, privacy: false, guidelines: false,
};

export interface AppShellApi {
  // ui
  tab: Tab;
  setTab: (t: Tab) => void;
  homeFilter: Shell["homeFilter"];
  setHomeFilter: (f: Shell["homeFilter"]) => void;
  findTopic: string;
  setFindTopic: (t: string) => void;
  findFormat: string;
  setFindFormat: (f: string) => void;

  // welcome
  welcomeOpen: boolean;
  dismissWelcome: () => void;
  welcomeBecome: () => void;
  welcomeFind: () => void;
  welcomeHost: () => void;

  // favorites
  favorites: string[];
  isFavorite: (id: string) => boolean;
  toggleFavorite: (id: string) => void;

  // messages
  threads: Threads;
  activeThreadId: string | null;
  openThread: (id: string) => void;
  closeThread: () => void;
  messageDraft: string;
  setMessageDraft: (v: string) => void;
  sendThreadMessage: () => void;

  // discovery sheets
  activityId: string | null;
  openActivity: (id: string) => void;
  closeActivity: () => void;
  requestSpot: () => void;
  profileId: string | null;
  openProfile: (id: string) => void;
  closeProfile: () => void;
  messageFromProfile: () => void;

  sheets: Record<SheetName, boolean>;
  openSheet: (s: SheetName) => void;
  closeSheet: (s: SheetName) => void;

  langMenuOpen: boolean;
  toggleLangMenu: () => void;

  // host listing
  spotRequests: SpotRequest[];
  setRequestStatus: (id: string, status: ReqStatus) => void;
  activityOverride: Shell["activityOverride"];
  saveActivityOverride: (o: Shell["activityOverride"]) => void;

  // toast
  toast: string;
  flash: (text: string) => void;

  // gating + auth sheet
  guestGate: (intent: string, action: () => void) => void;
  authOpen: boolean;
  authMode: "signup" | "login";
  openAuthPrompt: () => void;
  setAuthMode: (m: "signup" | "login") => void;
  closeAuth: () => void;
  submitAuth: (input: { name: string; email: string; password: string }) => Promise<void>;

  // form submissions (route through gate)
  submitListenerApplication: (payload: unknown, onDone: () => void) => void;
  submitHostApplication: (payload: unknown, onDone: () => void) => void;
}

const Ctx = createContext<AppShellApi | null>(null);

export function AppShellProvider({ children }: { children: ReactNode }) {
  const app = useApp();
  const [s, setS] = useState<Shell>(() => ({
    tab: "home",
    homeFilter: "all",
    findTopic: "All",
    findFormat: "Any",
    threads: readStored<Threads>(THREADS_KEY, SEED_THREADS),
    activeThreadId: null,
    messageDraft: "",
    activityId: null,
    profileId: null,
    sheets: NO_SHEETS,
    langMenuOpen: false,
    spotRequests: SEED_REQUESTS,
    activityOverride: {},
    authOpen: false,
    authMode: "signup",
    toast: "",
  }));
  const patch = useCallback((p: Partial<Shell>) => setS((cur) => ({ ...cur, ...p })), []);

  const [favorites, setFavorites] = useState<string[]>(() => readStored<string[]>(FAV_KEY, []));
  const [welcomeOpen, setWelcomeOpen] = useState(() => !readStored<boolean>(WELCOME_KEY, false));

  const pendingAction = useRef<null | (() => void)>(null);
  const toastTimer = useRef<number>(0);

  /* ---- gating ----
   * guestGate: always requires an account (message, thread, form submit, spot).
   * browseGate: only gates when `requireAccountToBrowse` is on (default off) —
   *   used by the welcome choices and free browsing. */
  const guestGate = useCallback(
    (_intent: string, action: () => void) => {
      if (app.signedIn) {
        action();
        return;
      }
      pendingAction.current = action;
      setS((cur) => ({ ...cur, authOpen: true, authMode: "signup" }));
    },
    [app.signedIn],
  );

  const browseGate = useCallback(
    (action: () => void) => {
      if (app.signedIn || !app.requireAccountToBrowse) {
        action();
        return;
      }
      pendingAction.current = action;
      setS((cur) => ({ ...cur, authOpen: true, authMode: "signup" }));
    },
    [app.signedIn, app.requireAccountToBrowse],
  );

  const closeAuth = useCallback(() => {
    pendingAction.current = null;
    patch({ authOpen: false });
  }, [patch]);

  const submitAuth = useCallback(
    async (input: { name: string; email: string; password: string }) => {
      if (!input.email || !input.password) return;
      const result =
        s.authMode === "login"
          ? await api.login({ email: input.email, password: input.password })
          : await api.signup(input);
      app.completeAuth(result);
      patch({ authOpen: false });
      const resume = pendingAction.current;
      pendingAction.current = null;
      if (resume) setTimeout(resume, 60);
    },
    [s.authMode, app, patch],
  );

  /* ---- welcome ---- */
  const dismissWelcome = useCallback(() => {
    setWelcomeOpen(false);
    writeStored(WELCOME_KEY, true);
  }, []);
  const welcomeBecome = useCallback(() => {
    dismissWelcome();
    browseGate(() => patch({ sheets: { ...NO_SHEETS, listener: true } }));
  }, [dismissWelcome, browseGate, patch]);
  const welcomeFind = useCallback(() => {
    dismissWelcome();
    browseGate(() => patch({ tab: "find" }));
  }, [dismissWelcome, browseGate, patch]);
  const welcomeHost = useCallback(() => {
    dismissWelcome();
    browseGate(() => patch({ sheets: { ...NO_SHEETS, host: true } }));
  }, [dismissWelcome, browseGate, patch]);

  /* ---- tabs ---- */
  const setTab = useCallback(
    (t: Tab) => {
      if (t === "messages" && !app.signedIn) {
        guestGate("message", () => patch({ tab: "messages", activeThreadId: null }));
        return;
      }
      patch({ tab: t, activeThreadId: null });
    },
    [app.signedIn, guestGate, patch],
  );

  /* ---- favorites ---- */
  const isFavorite = useCallback((id: string) => favorites.includes(id), [favorites]);
  const toggleFavorite = useCallback((id: string) => {
    setFavorites((cur) => {
      const next = cur.includes(id) ? cur.filter((x) => x !== id) : [...cur, id];
      writeStored(FAV_KEY, next);
      return next;
    });
  }, []);

  /* ---- threads ---- */
  const persistThreads = useCallback(
    (updater: (t: Threads) => Threads) => {
      setS((cur) => {
        const threads = updater(cur.threads);
        writeStored(THREADS_KEY, threads);
        return { ...cur, threads };
      });
    },
    [],
  );
  const openThread = useCallback(
    (id: string) => {
      guestGate("thread", () => {
        persistThreads((t) => (t[id] ? t : { ...t, [id]: [] }));
        patch({ tab: "messages", activeThreadId: id, profileId: null, activityId: null });
      });
    },
    [guestGate, persistThreads, patch],
  );
  const closeThread = useCallback(() => patch({ activeThreadId: null }), [patch]);
  const setMessageDraft = useCallback((v: string) => patch({ messageDraft: v }), [patch]);
  const sendThreadMessage = useCallback(() => {
    setS((cur) => {
      const id = cur.activeThreadId;
      const text = cur.messageDraft.trim();
      if (!id || !text) return cur;
      const threads = { ...cur.threads, [id]: [...(cur.threads[id] || []), { from: "me" as const, text }] };
      writeStored(THREADS_KEY, threads);
      return { ...cur, threads, messageDraft: "" };
    });
  }, []);

  /* ---- discovery sheets ---- */
  const openActivity = useCallback((id: string) => patch({ activityId: id }), [patch]);
  const closeActivity = useCallback(() => patch({ activityId: null }), [patch]);
  const requestSpot = useCallback(() => {
    guestGate("requestspot", () => {
      patch({ activityId: null });
      // flash after close
      setTimeout(() => {
        window.clearTimeout(toastTimer.current);
        setS((c) => ({ ...c, toast: "Spot requested — the host will confirm by email." }));
        toastTimer.current = window.setTimeout(() => setS((c) => ({ ...c, toast: "" })), 2600);
      }, 60);
    });
  }, [guestGate, patch]);
  const openProfile = useCallback((id: string) => patch({ profileId: id }), [patch]);
  const closeProfile = useCallback(() => patch({ profileId: null }), [patch]);
  const messageFromProfile = useCallback(() => {
    setS((cur) => {
      const id = cur.profileId;
      if (id) setTimeout(() => openThread(id), 0);
      return { ...cur, profileId: null };
    });
  }, [openThread]);

  const openSheet = useCallback((name: SheetName) => patch({ sheets: { ...NO_SHEETS, [name]: true } }), [patch]);
  const closeSheet = useCallback((name: SheetName) => patch({ sheets: { ...NO_SHEETS, [name]: false } }), [patch]);
  const toggleLangMenu = useCallback(() => setS((c) => ({ ...c, langMenuOpen: !c.langMenuOpen })), []);

  /* ---- host listing ---- */
  const setRequestStatus = useCallback((id: string, status: ReqStatus) => {
    setS((c) => ({ ...c, spotRequests: c.spotRequests.map((r) => (r.id === id ? { ...r, status } : r)) }));
  }, []);
  const saveActivityOverride = useCallback(
    (o: Shell["activityOverride"]) => {
      setS((c) => ({ ...c, activityOverride: { ...c.activityOverride, ...o } }));
      window.clearTimeout(toastTimer.current);
      setS((c) => ({ ...c, toast: "Listing updated" }));
      toastTimer.current = window.setTimeout(() => setS((c) => ({ ...c, toast: "" })), 2600);
    },
    [],
  );

  const flash = useCallback((text: string) => {
    window.clearTimeout(toastTimer.current);
    setS((c) => ({ ...c, toast: text }));
    toastTimer.current = window.setTimeout(() => setS((c) => ({ ...c, toast: "" })), 2600);
  }, []);

  /* ---- forms ---- */
  const submitListenerApplication = useCallback(
    (payload: unknown, onDone: () => void) => {
      guestGate("listenerform", async () => {
        await api.submitListenerApplication(payload as never);
        onDone();
      });
    },
    [guestGate],
  );
  const submitHostApplication = useCallback(
    (payload: unknown, onDone: () => void) => {
      guestGate("hostform", async () => {
        await api.submitHostApplication(payload as never);
        onDone();
      });
    },
    [guestGate],
  );

  const value = useMemo<AppShellApi>(
    () => ({
      tab: s.tab,
      setTab,
      homeFilter: s.homeFilter,
      setHomeFilter: (f) => patch({ homeFilter: f }),
      findTopic: s.findTopic,
      setFindTopic: (t) => patch({ findTopic: t }),
      findFormat: s.findFormat,
      setFindFormat: (f) => patch({ findFormat: f }),
      welcomeOpen,
      dismissWelcome,
      welcomeBecome,
      welcomeFind,
      welcomeHost,
      favorites,
      isFavorite,
      toggleFavorite,
      threads: s.threads,
      activeThreadId: s.activeThreadId,
      openThread,
      closeThread,
      messageDraft: s.messageDraft,
      setMessageDraft,
      sendThreadMessage,
      activityId: s.activityId,
      openActivity,
      closeActivity,
      requestSpot,
      profileId: s.profileId,
      openProfile,
      closeProfile,
      messageFromProfile,
      sheets: s.sheets,
      openSheet,
      closeSheet,
      langMenuOpen: s.langMenuOpen,
      toggleLangMenu,
      spotRequests: s.spotRequests,
      setRequestStatus,
      activityOverride: s.activityOverride,
      saveActivityOverride,
      toast: s.toast,
      flash,
      guestGate,
      authOpen: s.authOpen,
      authMode: s.authMode,
      openAuthPrompt: () => patch({ authOpen: true, authMode: "signup" }),
      setAuthMode: (m) => patch({ authMode: m }),
      closeAuth,
      submitAuth,
      submitListenerApplication,
      submitHostApplication,
    }),
    [
      s, setTab, patch, welcomeOpen, dismissWelcome, welcomeBecome, welcomeFind, welcomeHost,
      favorites, isFavorite, toggleFavorite, openThread, closeThread, setMessageDraft,
      sendThreadMessage, openActivity, closeActivity, requestSpot, openProfile, closeProfile,
      messageFromProfile, openSheet, closeSheet, toggleLangMenu, setRequestStatus,
      saveActivityOverride, flash, guestGate, browseGate, closeAuth, submitAuth,
      submitListenerApplication, submitHostApplication,
    ],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useAppShell(): AppShellApi {
  const v = useContext(Ctx);
  if (!v) throw new Error("useAppShell must be used inside <AppShellProvider>");
  return v;
}
