import { useApp } from "../state/store";
import { ModeratorProvider, useModerator } from "./ModeratorProvider";
import {
  MODERATOR_NAME,
  QUEUE_COPY,
  SLA_MINUTES,
  waitedLabel,
  type Queue,
} from "./data";
import { EscalationDetail, ReportDetail, ApplicationDetail } from "./details";
import { ActionModal } from "./ActionModal";

const TABS: { id: Queue; label: string; urgent: boolean }[] = [
  { id: "escalations", label: "Escalations", urgent: true },
  { id: "reports", label: "Reports", urgent: false },
  { id: "applications", label: "Applications", urgent: false },
];

function queueSub(queue: Queue, overdue: number): string {
  if (queue === "escalations") {
    return overdue > 0
      ? `${overdue} past the ${SLA_MINUTES}-minute promise. Oldest first.`
      : "Ordered by how long someone has been waiting, not when they arrived.";
  }
  if (queue === "reports") {
    return "The reported person is already blocked. You are deciding what happens to their account.";
  }
  return "Every application is read by a person. Take the time it needs.";
}

function Console() {
  const app = useApp();
  const m = useModerator();
  const copy = QUEUE_COPY[m.queue];

  return (
    <div className="mod-shell">
      <div className="mod-nav">
        <div className="mod-nav-inner">
          <span className="mod-logo" aria-label="Walk&Talk Moderation">
            <span className="w">Walk</span>
            <span className="amp">&amp;</span>
            <span className="t">Talk</span>
            <span className="role">Moderation</span>
          </span>
          <nav className="mod-nav-links" aria-label="Queues">
            {TABS.map((t) => {
              const n = m.counts[t.id];
              return (
                <button
                  key={t.id}
                  className="mod-nav-link"
                  aria-current={m.queue === t.id ? "page" : undefined}
                  onClick={() => m.setQueue(t.id)}
                >
                  {t.label}
                  {n > 0 && <span className={`mod-badge ${t.urgent ? "mod-badge--urgent" : ""}`}>{n}</span>}
                </button>
              );
            })}
          </nav>
          <div className="mod-nav-right">
            <span className="mod-whoami">{MODERATOR_NAME}</span>
            <button className="mod-icon-btn" onClick={app.toggleTheme}>{app.isDark ? "☀" : "☾"}</button>
          </div>
        </div>
      </div>

      <div className="mod-body">
        <div className="mod-queue">
          <div>
            <h1 className="mod-queue-title">{copy.title}</h1>
            <p className="mod-queue-sub">{queueSub(m.queue, m.overdue)}</p>
          </div>

          {m.queueItems.map((item) => {
            const late = m.isBreached(item);
            const on = item.id === m.activeId;
            return (
              <button
                key={item.id}
                className="mod-queue-row"
                aria-current={on}
                onClick={() => m.openItem(item.id)}
              >
                <span className={`mod-stripe ${late ? "mod-stripe--late" : m.queue === "escalations" ? "mod-stripe--esc" : ""}`} />
                <span className="mod-queue-body">
                  <span className="mod-queue-topline">
                    <span className="mod-queue-name">{item.who}</span>
                    <span className={`mod-queue-clock ${late ? "mod-queue-clock--late" : ""}`}>{waitedLabel(item.waitedMin)}</span>
                  </span>
                  <span className="mod-queue-kind" style={{ display: "block" }}>{item.kind}</span>
                  <span className="mod-queue-snippet" style={{ display: "block" }}>{item.snippet}</span>
                </span>
              </button>
            );
          })}

          {m.queueItems.length === 0 && (
            <div className="mod-empty">
              <p className="mod-empty-title">{copy.emptyTitle}</p>
              <p className="mod-empty-body">{copy.emptyBody}</p>
            </div>
          )}
        </div>

        <div className="mod-detail">
          {!m.activeItem ? (
            <div className="mod-detail-empty">
              <p className="mod-empty-title">Nothing open</p>
              <p className="mod-empty-body">
                Pick an item from the queue. Escalations are ordered by how long someone has been
                waiting, not by when they arrived.
              </p>
            </div>
          ) : m.queue === "escalations" ? (
            <EscalationDetail item={m.activeItem} />
          ) : m.queue === "reports" ? (
            <ReportDetail item={m.activeItem} />
          ) : (
            <ApplicationDetail item={m.activeItem} />
          )}
        </div>
      </div>

      <ActionModal />
      {m.toast && <div className="mod-toast" role="status">{m.toast}</div>}
    </div>
  );
}

/** Moderator console — desktop web, `/moderator`. Three queues, list/detail split. */
export function ModeratorConsole() {
  return (
    <ModeratorProvider>
      <Console />
    </ModeratorProvider>
  );
}
