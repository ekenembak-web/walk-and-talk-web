import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import {
  REQUESTS,
  SEED_CHATS,
  SEED_PEER_POSTS,
  SEED_DEBRIEFS,
  FEEL_OPTIONS,
  LISTENER_NAME,
  type ListenerChat,
  type PeerPost,
} from "./data";

export type ListenerTab = "requests" | "chats" | "peer" | "you";
export type DocKey = "guidelines" | "safety" | null;

interface State {
  tab: ListenerTab;
  chats: ListenerChat[];
  activeChatId: string | null;
  draft: string;
  declined: string[];
  accepted: string[];
  cap: number;
  paused: boolean;
  peerPosts: PeerPost[];
  peerLiked: string[];
  peerDraft: string;
  debriefDone: string[];
  // modals
  declineFor: string | null;
  declineReason: string | null;
  declineMessage: string;
  debriefOpen: boolean;
  debriefFeel: string | null;
  escalateOpen: boolean;
  escalateNote: string;
  reportOpen: boolean;
  reportReason: string | null;
  crisisOpen: boolean;
  doc: DocKey;
  toast: string;
}

export interface ListenerApi extends State {
  status: "pending" | "approved";
  listenerName: string;
  // derived
  openRequests: typeof REQUESTS;
  activeChat: ListenerChat | null;
  pendingDebrief: (typeof SEED_DEBRIEFS)[number] | null;
  atCap: boolean;
  unreadTotal: number;
  // nav
  setTab: (t: ListenerTab) => void;
  // requests
  acceptRequest: (id: string) => void;
  openDecline: (id: string) => void;
  closeDecline: () => void;
  pickDeclineReason: (k: string) => void;
  setDeclineMessage: (v: string) => void;
  confirmDecline: () => void;
  // chats
  openChat: (id: string) => void;
  closeChat: () => void;
  setDraft: (v: string) => void;
  sendDraft: () => void;
  endConversation: () => void;
  // limits
  togglePaused: () => void;
  capUp: () => void;
  capDown: () => void;
  // peer
  setPeerDraft: (v: string) => void;
  postPeer: () => void;
  toggleLike: (id: string) => void;
  // debrief
  openDebrief: () => void;
  closeDebrief: () => void;
  pickFeel: (k: string) => void;
  runDebriefAction: (action: string) => void;
  // escalate / report / crisis / doc
  openEscalate: () => void;
  closeEscalate: () => void;
  setEscalateNote: (v: string) => void;
  confirmEscalate: () => void;
  openReport: () => void;
  closeReport: () => void;
  pickReportReason: (k: string) => void;
  confirmReport: () => void;
  openCrisis: () => void;
  closeCrisis: () => void;
  openDoc: (k: Exclude<DocKey, null>) => void;
  closeDoc: () => void;
}

const Ctx = createContext<ListenerApi | null>(null);

export function ListenerProvider({
  children,
  status = "approved",
}: {
  children: ReactNode;
  status?: "pending" | "approved";
}) {
  const [s, setS] = useState<State>(() => ({
    tab: "requests",
    chats: SEED_CHATS.map((c) => ({ ...c, messages: [...c.messages] })),
    activeChatId: null,
    draft: "",
    declined: [],
    accepted: [],
    cap: 4,
    paused: false,
    peerPosts: SEED_PEER_POSTS,
    peerLiked: [],
    peerDraft: "",
    debriefDone: [],
    declineFor: null,
    declineReason: null,
    declineMessage: "",
    debriefOpen: false,
    debriefFeel: null,
    escalateOpen: false,
    escalateNote: "",
    reportOpen: false,
    reportReason: null,
    crisisOpen: false,
    doc: null,
    toast: "",
  }));
  const patch = useCallback((p: Partial<State>) => setS((c) => ({ ...c, ...p })), []);
  const toastTimer = useRef<number>(0);

  const flash = useCallback((text: string) => {
    window.clearTimeout(toastTimer.current);
    setS((c) => ({ ...c, toast: text }));
    toastTimer.current = window.setTimeout(() => setS((c) => ({ ...c, toast: "" })), 2600);
  }, []);

  /* ---- derived ---- */
  const openRequests = s.paused
    ? []
    : REQUESTS.filter((r) => !s.declined.includes(r.id) && !s.accepted.includes(r.id));
  const activeChat = s.chats.find((c) => c.id === s.activeChatId) ?? null;
  const pendingDebrief = SEED_DEBRIEFS.find((d) => !s.debriefDone.includes(d.id)) ?? null;
  const atCap = s.chats.length >= s.cap;
  const unreadTotal = s.chats.filter((c) => c.unread > 0).length;

  /* ---- requests ---- */
  const acceptRequest = useCallback(
    (id: string) => {
      setS((c) => {
        if (c.chats.length >= c.cap) {
          flash(`You are at your limit of ${c.cap}`);
          return c;
        }
        const req = REQUESTS.find((r) => r.id === id);
        if (!req) return c;
        flash(`Accepted. ${req.seeker} can now write to you.`);
        return {
          ...c,
          accepted: [...c.accepted, id],
          chats: [...c.chats, { id, seeker: req.seeker, topic: req.topic, unread: 0, messages: [] }],
        };
      });
    },
    [flash],
  );

  const openDecline = useCallback((id: string) => patch({ declineFor: id, declineReason: null, declineMessage: "" }), [patch]);
  const closeDecline = useCallback(() => patch({ declineFor: null, declineReason: null, declineMessage: "" }), [patch]);
  const pickDeclineReason = useCallback((k: string) => patch({ declineReason: k }), [patch]);
  const setDeclineMessage = useCallback((v: string) => patch({ declineMessage: v }), [patch]);
  const confirmDecline = useCallback(() => {
    setS((c) => {
      const key = c.declineReason;
      if (!key) return c;
      if (key === "custom" && !c.declineMessage.trim()) return c;
      flash(
        key === "unsafe"
          ? "Declined and flagged for a moderator"
          : key === "custom"
            ? "Declined. Your message was sent."
            : "Declined. They were told, kindly.",
      );
      return { ...c, declined: [...c.declined, c.declineFor!], declineFor: null, declineReason: null, declineMessage: "" };
    });
  }, [flash]);

  /* ---- chats ---- */
  const openChat = useCallback((id: string) => {
    setS((c) => ({ ...c, activeChatId: id, chats: c.chats.map((x) => (x.id === id ? { ...x, unread: 0 } : x)) }));
  }, []);
  const closeChat = useCallback(() => patch({ activeChatId: null }), [patch]);
  const setDraft = useCallback((v: string) => patch({ draft: v }), [patch]);
  const sendDraft = useCallback(() => {
    setS((c) => {
      const text = c.draft.trim();
      if (!text || !c.activeChatId) return c;
      return {
        ...c,
        draft: "",
        chats: c.chats.map((x) => (x.id === c.activeChatId ? { ...x, messages: [...x.messages, { from: "me" as const, text }] } : x)),
      };
    });
  }, []);
  const endConversation = useCallback(() => {
    setS((c) => ({ ...c, chats: c.chats.filter((x) => x.id !== c.activeChatId), activeChatId: null }));
    flash("Conversation closed");
  }, [flash]);

  /* ---- limits ---- */
  const togglePaused = useCallback(() => setS((c) => ({ ...c, paused: !c.paused })), []);
  const capUp = useCallback(() => setS((c) => ({ ...c, cap: Math.min(8, c.cap + 1) })), []);
  const capDown = useCallback(() => setS((c) => ({ ...c, cap: Math.max(1, c.cap - 1) })), []);

  /* ---- peer ---- */
  const setPeerDraft = useCallback((v: string) => patch({ peerDraft: v }), [patch]);
  const postPeer = useCallback(() => {
    setS((c) => {
      const text = c.peerDraft.trim();
      if (!text) return c;
      return {
        ...c,
        peerDraft: "",
        peerPosts: [{ id: `local${Date.now()}`, who: LISTENER_NAME, when: "just now", text, likes: 0 }, ...c.peerPosts],
      };
    });
  }, []);
  const toggleLike = useCallback((id: string) => {
    setS((c) => {
      const has = c.peerLiked.includes(id);
      return {
        ...c,
        peerLiked: has ? c.peerLiked.filter((x) => x !== id) : [...c.peerLiked, id],
        peerPosts: c.peerPosts.map((p) => (p.id === id ? { ...p, likes: p.likes + (has ? -1 : 1) } : p)),
      };
    });
  }, []);

  /* ---- debrief ---- */
  const openDebrief = useCallback(() => patch({ debriefOpen: true, debriefFeel: null }), [patch]);
  const closeDebrief = useCallback(() => patch({ debriefOpen: false, debriefFeel: null }), [patch]);
  const pickFeel = useCallback((k: string) => patch({ debriefFeel: k }), [patch]);
  const runDebriefAction = useCallback(
    (action: string) => {
      const d = SEED_DEBRIEFS[0];
      const done = (c: State) => ({ ...c, debriefDone: [...c.debriefDone, d.id], debriefOpen: false, debriefFeel: null });
      if (action === "finish") {
        setS(done);
        flash("Thank you. Take the rest of the day.");
      } else if (action === "pause") {
        setS((c) => ({ ...done(c), paused: true }));
        flash("Paused. Nobody is told, and nothing expires.");
      } else if (action === "support") {
        setS((c) => ({ ...done(c), paused: true }));
        flash("A moderator will reach out today. Requests paused meanwhile.");
      } else if (action === "crisis") {
        patch({ crisisOpen: true });
      }
    },
    [flash, patch],
  );

  /* ---- escalate / report / crisis / doc ---- */
  const openEscalate = useCallback(() => patch({ escalateOpen: true }), [patch]);
  const closeEscalate = useCallback(() => patch({ escalateOpen: false, escalateNote: "" }), [patch]);
  const setEscalateNote = useCallback((v: string) => patch({ escalateNote: v }), [patch]);
  const confirmEscalate = useCallback(() => {
    patch({ escalateOpen: false, escalateNote: "" });
    flash("Sent. A moderator is reading it now.");
  }, [patch, flash]);

  const openReport = useCallback(() => patch({ reportOpen: true, reportReason: null }), [patch]);
  const closeReport = useCallback(() => patch({ reportOpen: false, reportReason: null }), [patch]);
  const pickReportReason = useCallback((k: string) => patch({ reportReason: k }), [patch]);
  const confirmReport = useCallback(() => {
    setS((c) => {
      if (!c.reportReason) return c;
      return { ...c, chats: c.chats.filter((x) => x.id !== c.activeChatId), reportOpen: false, reportReason: null, activeChatId: null };
    });
    flash("Blocked and reported");
  }, [flash]);

  const openCrisis = useCallback(() => patch({ crisisOpen: true }), [patch]);
  const closeCrisis = useCallback(() => patch({ crisisOpen: false }), [patch]);
  const openDoc = useCallback((k: "guidelines" | "safety") => patch({ doc: k }), [patch]);
  const closeDoc = useCallback(() => patch({ doc: null }), [patch]);

  const setTab = useCallback(
    (t: ListenerTab) =>
      // Leaving the Conversations tab dismisses any open full-screen thread
      // (mobile / app); the web split keeps its selection.
      setS((c) => ({ ...c, tab: t, activeChatId: t === "chats" ? c.activeChatId : null })),
    [],
  );

  const value = useMemo<ListenerApi>(
    () => ({
      ...s,
      status,
      listenerName: LISTENER_NAME,
      openRequests,
      activeChat,
      pendingDebrief,
      atCap,
      unreadTotal,
      setTab,
      acceptRequest,
      openDecline,
      closeDecline,
      pickDeclineReason,
      setDeclineMessage,
      confirmDecline,
      openChat,
      closeChat,
      setDraft,
      sendDraft,
      endConversation,
      togglePaused,
      capUp,
      capDown,
      setPeerDraft,
      postPeer,
      toggleLike,
      openDebrief,
      closeDebrief,
      pickFeel,
      runDebriefAction,
      openEscalate,
      closeEscalate,
      setEscalateNote,
      confirmEscalate,
      openReport,
      closeReport,
      pickReportReason,
      confirmReport,
      openCrisis,
      closeCrisis,
      openDoc,
      closeDoc,
    }),
    [
      s, status, openRequests, activeChat, pendingDebrief, atCap, unreadTotal, setTab,
      acceptRequest, openDecline, closeDecline, pickDeclineReason, setDeclineMessage, confirmDecline,
      openChat, closeChat, setDraft, sendDraft, endConversation, togglePaused, capUp, capDown,
      setPeerDraft, postPeer, toggleLike, openDebrief, closeDebrief, pickFeel, runDebriefAction,
      openEscalate, closeEscalate, setEscalateNote, confirmEscalate, openReport, closeReport,
      pickReportReason, confirmReport, openCrisis, closeCrisis, openDoc, closeDoc,
    ],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useListener(): ListenerApi {
  const v = useContext(Ctx);
  if (!v) throw new Error("useListener must be used inside <ListenerProvider>");
  return v;
}

export const FEEL_BY_KEY = Object.fromEntries(FEEL_OPTIONS.map((f) => [f.key, f]));
