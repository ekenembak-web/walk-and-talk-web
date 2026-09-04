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
  POOLS,
  ACTION_DEFS,
  SLA_MINUTES,
  type Queue,
  type QueueItem,
} from "./data";

interface State {
  queue: Queue;
  activeId: string | null;
  resolved: string[];
  checks: Record<string, boolean>;
  action: string | null;
  actionNote: string;
  secondName: string;
  toast: string;
}

export interface ModeratorApi {
  queue: Queue;
  activeId: string | null;
  activeItem: QueueItem | null;
  queueItems: QueueItem[];
  counts: Record<Queue, number>;
  overdue: number;
  checks: Record<string, boolean>;
  checksDone: number;
  setQueue: (q: Queue) => void;
  openItem: (id: string) => void;
  toggleCheck: (key: string) => void;
  isBreached: (item: QueueItem) => boolean;
  // action modal
  action: string | null;
  actionNote: string;
  secondName: string;
  actionReady: boolean;
  openAction: (key: string) => void;
  closeAction: () => void;
  setActionNote: (v: string) => void;
  setSecondName: (v: string) => void;
  confirmAction: () => void;
  toast: string;
}

const Ctx = createContext<ModeratorApi | null>(null);

export function ModeratorProvider({ children }: { children: ReactNode }) {
  const [s, setS] = useState<State>({
    queue: "escalations",
    activeId: "e1",
    resolved: [],
    checks: {},
    action: null,
    actionNote: "",
    secondName: "",
    toast: "",
  });
  const toastTimer = useRef<number>(0);
  const patch = useCallback((p: Partial<State>) => setS((c) => ({ ...c, ...p })), []);

  const flash = useCallback((text: string) => {
    window.clearTimeout(toastTimer.current);
    setS((c) => ({ ...c, toast: text }));
    toastTimer.current = window.setTimeout(() => setS((c) => ({ ...c, toast: "" })), 2800);
  }, []);

  const isBreached = useCallback(
    (item: QueueItem) => s.queue === "escalations" && item.waitedMin > SLA_MINUTES,
    [s.queue],
  );

  const pool = POOLS[s.queue].filter((x) => !s.resolved.includes(x.id));
  const queueItems = [...pool].sort((a, b) => b.waitedMin - a.waitedMin);
  const activeItem =
    queueItems.find((x) => x.id === s.activeId) ??
    POOLS[s.queue].find((x) => x.id === s.activeId) ??
    null;

  const counts: Record<Queue, number> = {
    escalations: POOLS.escalations.filter((x) => !s.resolved.includes(x.id)).length,
    reports: POOLS.reports.filter((x) => !s.resolved.includes(x.id)).length,
    applications: POOLS.applications.filter((x) => !s.resolved.includes(x.id)).length,
  };
  const overdue = POOLS.escalations.filter(
    (x) => !s.resolved.includes(x.id) && x.waitedMin > SLA_MINUTES,
  ).length;

  const checksDone = Object.values(s.checks).filter(Boolean).length;

  const setQueue = useCallback((q: Queue) => patch({ queue: q, activeId: null }), [patch]);
  const openItem = useCallback((id: string) => patch({ activeId: id }), [patch]);
  const toggleCheck = useCallback(
    (key: string) => setS((c) => ({ ...c, checks: { ...c.checks, [key]: !c.checks[key] } })),
    [],
  );

  const openAction = useCallback((key: string) => patch({ action: key, actionNote: "", secondName: "" }), [patch]);
  const closeAction = useCallback(() => patch({ action: null, actionNote: "", secondName: "" }), [patch]);
  const setActionNote = useCallback((v: string) => patch({ actionNote: v }), [patch]);
  const setSecondName = useCallback((v: string) => patch({ secondName: v }), [patch]);

  const def = s.action ? ACTION_DEFS[s.action] : null;
  const actionReady = !!def
    && (!def.needsNote || !!s.actionNote.trim())
    && (!def.needsSecond || !!s.secondName.trim());

  const confirmAction = useCallback(() => {
    setS((c) => {
      const d = c.action ? ACTION_DEFS[c.action] : null;
      if (!d) return c;
      if (d.needsNote && !c.actionNote.trim()) return c;
      if (d.needsSecond && !c.secondName.trim()) return c;
      const clears = d.clears !== false;
      flash(d.done);
      return {
        ...c,
        resolved: clears && c.activeId ? [...c.resolved, c.activeId] : c.resolved,
        activeId: clears ? null : c.activeId,
        action: null,
        actionNote: "",
        secondName: "",
        checks: clears ? {} : c.checks,
      };
    });
  }, [flash]);

  const value = useMemo<ModeratorApi>(
    () => ({
      queue: s.queue,
      activeId: s.activeId,
      activeItem,
      queueItems,
      counts,
      overdue,
      checks: s.checks,
      checksDone,
      setQueue,
      openItem,
      toggleCheck,
      isBreached,
      action: s.action,
      actionNote: s.actionNote,
      secondName: s.secondName,
      actionReady,
      openAction,
      closeAction,
      setActionNote,
      setSecondName,
      confirmAction,
      toast: s.toast,
    }),
    [
      s, activeItem, queueItems, counts, overdue, checksDone, setQueue, openItem, toggleCheck,
      isBreached, actionReady, openAction, closeAction, setActionNote, setSecondName, confirmAction,
    ],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useModerator(): ModeratorApi {
  const v = useContext(Ctx);
  if (!v) throw new Error("useModerator must be used inside <ModeratorProvider>");
  return v;
}
