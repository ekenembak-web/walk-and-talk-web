import { Modal } from "./Modal";
import { personAvatar } from "../lib/avatar";
import type { Host, Listener } from "../lib/types";

function isHost(p: Listener): p is Host {
  return p.role === "Host" && "activity" in p;
}

export function ProfileModal({
  person,
  onClose,
  onMessage,
}: {
  person: Listener;
  onClose: () => void;
  onMessage: () => void;
}) {
  const host = isHost(person) ? person : null;
  return (
    <Modal onClose={onClose} labelledBy="profile-title" cardClassName="profile-modal-card">
      <div className="profile-modal-head">
        <div
          className="profile-modal-avatar"
          role="img"
          aria-label={`${person.name} profile photo`}
          style={{ backgroundImage: `url(${personAvatar(person)})` }}
        />
        <div style={{ minWidth: 0, display: "flex", flexDirection: "column", gap: 7 }}>
          <span className={`profile-role ${person.role === "Host" ? "profile-role--host" : ""}`}>
            {person.role}
          </span>
          <h3 className="modal-title" id="profile-title">{person.name}</h3>
          <p className="profile-meta-row">★ {person.rating} · {person.city}</p>
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
        <p className="profile-bio">{person.bio}</p>

        <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
          <p className="profile-label">Format</p>
          <p className="profile-meta-row">
            {person.format}
            {person.language ? ` · ${person.language}` : ""}
          </p>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 9 }}>
          <p className="profile-label">Topics</p>
          <div className="chip-row">
            {person.topics.map((t) => (
              <span key={t} className="chip-tiny">{t}</span>
            ))}
          </div>
        </div>

        {host && (
          <div className="activity-panel">
            <p className="profile-label">Activity they host</p>
            <h4 className="activity-panel-title">{host.activity}</h4>
            <div className="activity-fact-grid">
              <div className="activity-fact">
                <span className="activity-fact-label">Participants</span>
                <span className="activity-fact-value">{host.groupSize}</span>
              </div>
              <div className="activity-fact">
                <span className="activity-fact-label">When</span>
                <span className="activity-fact-value">{host.schedule}</span>
              </div>
              <div className="activity-fact">
                <span className="activity-fact-label">Where</span>
                <span className="activity-fact-value">{host.location}</span>
              </div>
              <div className="activity-fact">
                <span className="activity-fact-label">Cost</span>
                <span className="activity-fact-value">{host.cost}</span>
              </div>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              <span className="activity-fact-label">Requirements</span>
              <ul className="activity-req-list">
                {host.requirements.map((r) => (
                  <li key={r}>{r}</li>
                ))}
              </ul>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              <span className="activity-fact-label">What to bring</span>
              <p className="activity-fact-value">{host.bring}</p>
            </div>
          </div>
        )}

        <button className="modal-submit" onClick={onMessage}>Message {person.name}</button>
        <p className="modal-footer-text">
          Profiles show only what a listener chose to share. Conversations stay private.
        </p>
      </div>
    </Modal>
  );
}
