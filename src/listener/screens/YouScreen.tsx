import { useListener } from "../ListenerProvider";
import { Avatar } from "../ui";

export function YouScreen() {
  const l = useListener();

  return (
    <div className="l-section" data-screen-label="Boundaries">
      <div className="l-you-head">
        <Avatar name={l.listenerName} size={72} />
        <div>
          <h1 className="l-title">{l.listenerName}</h1>
          <p className="l-sub">{l.chats.length} open · listener since May</p>
        </div>
      </div>

      <div className="l-you-grid">
        <div>
          <p className="l-label">Your limits</p>
          <div className="l-card">
            <div className="l-limit-row">
              <div className="l-limit-text">
                <p className="l-limit-title">Open conversations at once</p>
                <p className="l-limit-body">You will not be offered new requests past this number.</p>
              </div>
              <div className="l-stepper">
                <button className="l-step-btn" aria-label="Fewer" onClick={l.capDown}>−</button>
                <span className="l-step-val">{l.cap}</span>
                <button className="l-step-btn" aria-label="More" onClick={l.capUp}>+</button>
              </div>
            </div>
            <div className="l-limit-row">
              <div className="l-limit-text">
                <p className="l-limit-title">Pause new requests</p>
                <p className="l-limit-body">Nobody is told. Take as long as you need.</p>
              </div>
              <button className="l-switch" data-on={l.paused} role="switch" aria-checked={l.paused} aria-label="Pause new requests" onClick={l.togglePaused}>
                <span className="l-switch-knob" />
              </button>
            </div>
          </div>
        </div>

        <div>
          <p className="l-label">If something is wrong</p>
          <div className="l-card">
            <button className="l-menu-row" onClick={l.openEscalate}>
              <span>Escalate a conversation to a moderator</span>
              <span className="l-chev">›</span>
            </button>
            <button className="l-menu-row" onClick={l.openCrisis}>
              <span>Crisis resources</span>
              <span className="l-chev">›</span>
            </button>
          </div>

          <p className="l-label" style={{ marginTop: 24 }}>Reference</p>
          <div className="l-card">
            <button className="l-menu-row" onClick={() => l.openDoc("guidelines")}>
              <span>Community guidelines</span>
              <span className="l-chev">›</span>
            </button>
            <button className="l-menu-row" onClick={() => l.openDoc("safety")}>
              <span>Safety policy</span>
              <span className="l-chev">›</span>
            </button>
          </div>
        </div>
      </div>

      <p className="l-you-foot">
        You are a peer, not a therapist. You are never expected to fix anyone, and you can end any
        conversation without explaining yourself.
      </p>
    </div>
  );
}
