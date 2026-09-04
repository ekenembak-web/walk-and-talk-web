import { useModerator } from "./ModeratorProvider";
import { APPLICATION_CHECKS, waitedLabel, SLA_MINUTES, type QueueItem } from "./data";
import { avatarUri } from "../lib/avatar";

function Transcript({ item }: { item: QueueItem }) {
  if (item.transcript.length === 0) return null;
  return (
    <>
      <p className="mod-section-label">Conversation</p>
      <div className="mod-transcript">
        {item.transcript.map((m, i) => (
          <div key={i} className={`mod-bubble-row mod-bubble-row--${m.from}`}>
            <div className={`mod-bubble mod-bubble--${m.from}`}>
              <p className="mod-bubble-who">{m.who}</p>
              <p className="mod-bubble-text">{m.text}</p>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

function ActionCard({
  title,
  body,
  variant,
  onClick,
}: {
  title: string;
  body: string;
  variant?: "primary" | "danger";
  onClick: () => void;
}) {
  return (
    <button className={`mod-action ${variant ? `mod-action--${variant}` : ""}`} onClick={onClick}>
      <p className="mod-action-title">{title}</p>
      <p className="mod-action-body">{body}</p>
    </button>
  );
}

export function EscalationDetail({ item }: { item: QueueItem }) {
  const m = useModerator();
  const late = m.isBreached(item);
  return (
    <div className="mod-detail-wrap" data-screen-label="Escalation review">
      <div className="mod-detail-head">
        <div>
          <p className={`mod-eyebrow ${late ? "mod-eyebrow--late" : ""}`}>
            {late
              ? `Waiting ${waitedLabel(item.waitedMin)} — past the ${SLA_MINUTES}-minute promise`
              : `Waiting ${waitedLabel(item.waitedMin)}`}
          </p>
          <h2 className="mod-detail-title">{item.who}</h2>
          <p className="mod-detail-meta">{item.metaLine}</p>
        </div>
        <div className="mod-emergency">
          <p className="mod-emergency-label">If they are about to act</p>
          <p className="mod-emergency-num">112</p>
        </div>
      </div>

      <div className="mod-card">
        <div className="mod-note-head">
          <span className="mod-note-from">Listener's note</span>
          <span className="mod-note-who">{item.listener}</span>
        </div>
        <p className="mod-note-body">{item.listenerNote}</p>
      </div>

      <Transcript item={item} />

      <p className="mod-section-label">What you do next</p>
      <div className="mod-action-grid">
        <ActionCard variant="primary" onClick={() => m.openAction("contact")} title="Contact them directly" body="Opens a moderator channel. The listener is told you have taken over." />
        <ActionCard variant="danger" onClick={() => m.openAction("services")} title="Involve emergency services" body="Requires a second moderator to confirm. Logged permanently." />
        <ActionCard onClick={() => m.openAction("handback")} title="Hand back to the listener" body="For when the conversation is safe to continue as peer support." />
        <ActionCard onClick={() => m.openAction("closeconv")} title="Close the conversation" body="Ends it for both. Both are told, and the listener is offered a debrief." />
      </div>

      <p className="mod-detail-foot">
        Whatever you choose, the listener is told what happened. They escalated because they could not
        carry this alone; silence back is its own harm.
      </p>
    </div>
  );
}

export function ReportDetail({ item }: { item: QueueItem }) {
  const m = useModerator();
  return (
    <div className="mod-detail-wrap" data-screen-label="Report review">
      <div className="mod-detail-head">
        <div>
          <p className="mod-eyebrow">{item.kind}</p>
          <h2 className="mod-detail-title">{item.who}</h2>
          <p className="mod-detail-meta">{item.metaLine}</p>
        </div>
      </div>

      <div className="mod-card">
        <div className="mod-fact-row"><span className="mod-fact-key">Reported by</span><span className="mod-fact-val">{item.listener}</span></div>
        <div className="mod-fact-row"><span className="mod-fact-key">Category</span><span className="mod-fact-val">{item.category}</span></div>
        <div className="mod-fact-row"><span className="mod-fact-key">Prior reports</span><span className="mod-fact-val">{item.priors}</span></div>
        <div className="mod-fact-row"><span className="mod-fact-key">Already blocked</span><span className="mod-fact-val">Yes, at report time</span></div>
      </div>

      <Transcript item={item} />

      <p className="mod-section-label">Decision</p>
      <div className="mod-action-grid">
        <ActionCard variant="danger" onClick={() => m.openAction("suspend")} title="Suspend the account" body="They lose access immediately. Open conversations are closed." />
        <ActionCard onClick={() => m.openAction("warn")} title="Warn and record" body="One warning on file. A second report escalates automatically." />
        <ActionCard onClick={() => m.openAction("minor")} title="Suspected minor" body="Account frozen pending age check. Follows the safeguarding route." />
        <ActionCard onClick={() => m.openAction("dismiss")} title="No action needed" body="The block stands. Nothing is recorded against them." />
      </div>
    </div>
  );
}

export function ApplicationDetail({ item }: { item: QueueItem }) {
  const m = useModerator();
  const allChecked = m.checksDone === 4;
  return (
    <div className="mod-detail-wrap" data-screen-label="Application review">
      <div className="mod-detail-head">
        <div className="mod-applicant-row">
          <div className="mod-applicant-avatar" role="img" aria-label={item.who} style={{ backgroundImage: `url(${avatarUri(item.who)})` }} />
          <div>
            <p className="mod-eyebrow">{item.kind}</p>
            <h2 className="mod-detail-title">{item.who}</h2>
            <p className="mod-detail-meta">{item.metaLine}</p>
          </div>
        </div>
      </div>

      <div className="mod-card">
        <div className="mod-fact-row"><span className="mod-fact-key">Username</span><span className="mod-fact-val">{item.username}</span></div>
        <div className="mod-fact-row"><span className="mod-fact-key">Age</span><span className="mod-fact-val">{item.age}</span></div>
        <div className="mod-fact-row"><span className="mod-fact-key">City</span><span className="mod-fact-val">{item.city}</span></div>
        <div className="mod-fact-row"><span className="mod-fact-key">Topics</span><span className="mod-fact-val">{item.topics}</span></div>
      </div>

      <p className="mod-section-label">In their words</p>
      <div className="mod-bio-card">
        <p className="mod-bio-text">{item.bio}</p>
      </div>

      <p className="mod-section-label">Read against</p>
      <div className="mod-card">
        {APPLICATION_CHECKS.map((c) => (
          <div className="mod-check-row" key={c.key}>
            <span className="mod-check-text">{c.text}</span>
            <button
              className="mod-check-box"
              role="checkbox"
              aria-checked={!!m.checks[c.key]}
              aria-label={c.text}
              data-on={!!m.checks[c.key]}
              onClick={() => m.toggleCheck(c.key)}
            >
              {m.checks[c.key] ? "✓" : ""}
            </button>
          </div>
        ))}
      </div>

      <p className="mod-section-label">Decision</p>
      <div className="mod-action-grid">
        <ActionCard
          variant={allChecked ? "primary" : undefined}
          onClick={() => m.openAction("approve")}
          title="Approve"
          body={allChecked ? "All four read through. They go live in the directory." : `${m.checksDone} of 4 read through. You can still approve.`}
        />
        <ActionCard onClick={() => m.openAction("askmore")} title="Ask for more" body="They stay pending. Say plainly what you need from them." />
        <ActionCard onClick={() => m.openAction("reject")} title="Not this time" body="They are told kindly, with a reason, and may reapply in six months." />
      </div>
    </div>
  );
}
