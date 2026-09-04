import { useListener } from "../ListenerProvider";
import { REQUESTS } from "../data";
import { Avatar } from "../ui";

export function RequestsScreen({ showCapBar = false }: { showCapBar?: boolean }) {
  const l = useListener();
  const capLabel = `${l.chats.length} of ${l.cap} conversations open`;

  return (
    <div className="l-section" data-screen-label="Incoming requests">
      <div className="l-section-head">
        <div>
          <h1 className="l-title">Requests</h1>
          {!showCapBar && <p className="l-sub">{capLabel}</p>}
        </div>
      </div>

      {showCapBar && (
        <div className="l-cap-bar">
          <span className="l-cap-text">{capLabel}</span>
          <button className="l-pause-chip" data-paused={l.paused} onClick={l.togglePaused}>
            {l.paused ? "Paused" : "Accepting"}
          </button>
        </div>
      )}

      {l.pendingDebrief && (
        <button className="l-debrief-banner" onClick={l.openDebrief}>
          <div style={{ flex: 1, minWidth: 0 }}>
            <p className="l-debrief-banner-title">A conversation you escalated has closed</p>
            <p className="l-debrief-banner-body">
              {l.pendingDebrief.seeker}. Read what happened when you are ready.
            </p>
          </div>
          <span className="l-debrief-chev">›</span>
        </button>
      )}

      {l.paused && (
        <div className="l-notice">
          <p className="l-notice-title">New requests are paused</p>
          <p className="l-notice-body">
            Nobody new can reach you. Your open conversations are unaffected, and nobody is told you paused.
          </p>
        </div>
      )}

      {l.atCap && !l.paused && (
        <div className="l-notice">
          <p className="l-notice-title">You are at your limit</p>
          <p className="l-notice-body">
            You set a limit of {l.cap} open conversations. Close one before accepting another, or raise the limit under You.
          </p>
        </div>
      )}

      <div className="l-req-grid">
        {l.openRequests.map((r) => {
          const full = REQUESTS.find((x) => x.id === r.id)!;
          return (
            <div className="l-req-card" key={r.id}>
              <div className="l-req-head">
                <Avatar name={full.seeker} size={48} />
                <div className="l-req-who">
                  <p className="l-req-name">{full.seeker}</p>
                  <p className="l-req-meta">{full.topic} · {full.format}</p>
                </div>
                <span className="l-req-ago">{full.ago}</span>
              </div>
              <p className="l-req-note">{full.note}</p>
              <div className="l-req-actions">
                <button className="l-btn-ghost" onClick={() => l.openDecline(r.id)}>Decline</button>
                <button className="l-btn-accept" disabled={l.atCap} onClick={() => l.acceptRequest(r.id)}>
                  Accept
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {l.openRequests.length === 0 && !l.paused && (
        <div className="l-empty">
          <p className="l-empty-title">Nothing waiting</p>
          <p className="l-empty-body">
            Requests arrive when someone picks you from the directory. There is no queue to clear and no target to hit.
          </p>
        </div>
      )}
    </div>
  );
}
