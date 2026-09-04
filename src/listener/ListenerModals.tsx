import { useEffect, type ReactNode } from "react";
import { useListener, FEEL_BY_KEY } from "./ListenerProvider";
import {
  DECLINE_REASONS,
  REPORT_REASONS,
  CRISIS_LINES,
  FEEL_OPTIONS,
  LISTENER_DOCS,
} from "./data";

function Scrim({ onClose, children, tall = false }: { onClose: () => void; children: ReactNode; tall?: boolean }) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);
  return (
    <div className="l-scrim" onClick={onClose}>
      <div className={`l-modal ${tall ? "l-modal--tall" : ""}`} role="dialog" aria-modal="true" onClick={(e) => e.stopPropagation()}>
        {children}
      </div>
    </div>
  );
}

export function ListenerModals() {
  const l = useListener();

  const declineReady =
    !!l.declineReason && (l.declineReason !== "custom" || !!l.declineMessage.trim());

  return (
    <>
      {l.declineFor && (
        <Scrim onClose={l.closeDecline}>
          <h3 className="l-modal-title">Decline this request</h3>
          <p className="l-modal-sub">
            They will be told you are not available. They will not be told which reason you picked.
          </p>
          {DECLINE_REASONS.map((d) => (
            <button key={d.key} className="l-choice" aria-pressed={l.declineReason === d.key} onClick={() => l.pickDeclineReason(d.key)}>
              <div className="l-choice-text">
                <p className="l-choice-title">{d.title}</p>
                <p className="l-choice-body">{d.body}</p>
              </div>
              {l.declineReason === d.key && <span className="l-choice-mark">✓</span>}
            </button>
          ))}
          {l.declineReason === "custom" && (
            <textarea
              className="l-textarea"
              placeholder="What would you like them to read? A short, kind line is enough."
              value={l.declineMessage}
              onChange={(e) => l.setDeclineMessage(e.target.value)}
            />
          )}
          <button className="l-cta-full" disabled={!declineReady} onClick={l.confirmDecline}>
            {l.declineReason === "unsafe" ? "Decline and flag privately" : "Decline"}
          </button>
          <p className="l-modal-foot">
            Declining costs you nothing. It is not counted, ranked, or shown on your profile.
          </p>
        </Scrim>
      )}

      {l.debriefOpen && l.pendingDebrief && (
        <Scrim onClose={l.closeDebrief} tall>
          <p className="l-debrief-eyebrow">Debrief</p>
          <h3 className="l-modal-title">What happened with {l.pendingDebrief.seeker}</h3>
          <p className="l-modal-sub">{l.pendingDebrief.closedAgo}</p>
          <div className="l-card">
            <div className="l-note-head">What happened</div>
            <p className="l-note-body">{l.pendingDebrief.outcome}</p>
          </div>
          <p className="l-debrief-affirm">
            You escalated this. That was the right call, and you did not need to be certain to make it.
          </p>
          <p className="l-label">How are you doing?</p>
          {FEEL_OPTIONS.map((f) => (
            <button key={f.key} className="l-choice" aria-pressed={l.debriefFeel === f.key} onClick={() => l.pickFeel(f.key)}>
              <span className="l-choice-title">{f.title}</span>
              {l.debriefFeel === f.key && <span className="l-choice-mark">✓</span>}
            </button>
          ))}
          {l.debriefFeel && FEEL_BY_KEY[l.debriefFeel] && (
            <>
              <p className="l-debrief-reply">{FEEL_BY_KEY[l.debriefFeel].reply}</p>
              {FEEL_BY_KEY[l.debriefFeel].actions.map((a) => (
                <button
                  key={a.label}
                  className={a.kind === "primary" ? "l-cta-full" : "l-cta-ghost"}
                  onClick={() => l.runDebriefAction(a.action)}
                >
                  {a.label}
                </button>
              ))}
            </>
          )}
          <p className="l-modal-foot">Nothing you say here is shown to anyone you talk to on the platform.</p>
        </Scrim>
      )}

      {l.escalateOpen && (
        <Scrim onClose={l.closeEscalate}>
          <h3 className="l-modal-title">Escalate to a moderator</h3>
          <p className="l-modal-sub">
            Use this when someone may be in danger, or when a conversation is beyond what a peer should carry.
          </p>
          <div className="l-card">
            <div className="l-step-list-item"><span className="l-step-num">1</span><span className="l-step-text">A trained moderator reads the conversation.</span></div>
            <div className="l-step-list-item"><span className="l-step-num">2</span><span className="l-step-text">They contact the person directly, usually within an hour.</span></div>
            <div className="l-step-list-item"><span className="l-step-num">3</span><span className="l-step-text">You can step back. You will be told what happened.</span></div>
          </div>
          <textarea
            className="l-textarea"
            placeholder="What worries you? Anything you write goes to the moderator, not to them."
            value={l.escalateNote}
            onChange={(e) => l.setEscalateNote(e.target.value)}
          />
          <button className="l-cta-full" onClick={l.confirmEscalate}>Send to a moderator</button>
          <p className="l-modal-foot">
            If someone is in immediate danger, call 112 first. Escalating is not a substitute for emergency services.
          </p>
        </Scrim>
      )}

      {l.reportOpen && (
        <Scrim onClose={l.closeReport}>
          <h3 className="l-modal-title">Block and report</h3>
          <p className="l-modal-sub">They lose access to you immediately and are not told why.</p>
          {REPORT_REASONS.map((p) => (
            <button key={p.key} className="l-choice" aria-pressed={l.reportReason === p.key} onClick={() => l.pickReportReason(p.key)}>
              <span className="l-choice-title">{p.title}</span>
              {l.reportReason === p.key && <span className="l-choice-mark">✓</span>}
            </button>
          ))}
          <button className="l-cta-full" disabled={!l.reportReason} onClick={l.confirmReport}>Block and report</button>
        </Scrim>
      )}

      {l.crisisOpen && (
        <Scrim onClose={l.closeCrisis}>
          <h3 className="l-modal-title">Crisis resources</h3>
          <p className="l-modal-sub">Lithuania. Give these out freely — you are not overstepping by doing so.</p>
          <div className="l-card">
            {CRISIS_LINES.map((line) => (
              <div className="l-crisis-row" key={line.name}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p className="l-crisis-name">{line.name}</p>
                  <p className="l-crisis-who">{line.who}</p>
                </div>
                <div className="l-crisis-right">
                  <p className="l-crisis-num">{line.number}</p>
                  <p className="l-crisis-hours">{line.hours}</p>
                </div>
              </div>
            ))}
          </div>
          <p className="l-modal-foot">
            Emergency services: 112. If you believe someone is about to act, call 112 and then escalate here.
          </p>
        </Scrim>
      )}

      {l.doc && (
        <Scrim onClose={l.closeDoc} tall>
          <h3 className="l-modal-title">{LISTENER_DOCS[l.doc].title}</h3>
          <p className="l-draft-flag">Draft — pending professional review</p>
          {LISTENER_DOCS[l.doc].blocks.map((b) => (
            <div className="l-doc-block" key={b.head}>
              <p className="l-doc-head">{b.head}</p>
              <p className="l-doc-body">{b.body}</p>
            </div>
          ))}
        </Scrim>
      )}

      {l.toast && <div className="l-toast" role="status">{l.toast}</div>}
    </>
  );
}
