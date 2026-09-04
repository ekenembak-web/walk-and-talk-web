import { useListener } from "../ListenerProvider";

export function PendingScreen() {
  const l = useListener();
  return (
    <div className="l-pending" data-screen-label="Application pending">
      <div style={{ display: "flex", flexDirection: "column" }}>
        <p className="l-pending-badge">Under review</p>
        <h1 className="l-pending-title">Your application is with our review team</h1>
        <p className="l-pending-body">
          Every listener application is read by a person before it goes live. We do this because the
          people you will be talking to are often at their lowest, and they deserve to know someone checked.
        </p>
        <p className="l-pending-note">
          We will email you either way. If we need anything else, we will ask before deciding.
        </p>
        <div className="l-pending-links">
          <button className="l-text-link" onClick={() => l.openDoc("guidelines")}>Read the community guidelines</button>
          <button className="l-text-link" onClick={() => l.openDoc("safety")}>Read the safety policy</button>
        </div>
      </div>
      <div className="l-card">
        <div className="l-pending-row"><span className="l-pending-key">Submitted</span><span className="l-pending-val">2 September</span></div>
        <div className="l-pending-row"><span className="l-pending-key">Typical wait</span><span className="l-pending-val">3–5 days</span></div>
        <div className="l-pending-row"><span className="l-pending-key">Reviewer</span><span className="l-pending-val">Assigned</span></div>
      </div>
    </div>
  );
}
