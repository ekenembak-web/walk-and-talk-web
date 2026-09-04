import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useApp } from "../state/store";
import { TOPICS, type Listener } from "../lib/types";
import { FIND_FORMAT_OPTIONS } from "../data/content";
import * as api from "../data/api";
import { personAvatar } from "../lib/avatar";
import { ProfileModal } from "../components/ProfileModal";

const ROLE_OPTIONS = ["Everyone", "Listeners", "Hosts"] as const;

export function MobileFindPage() {
  const app = useApp();
  const navigate = useNavigate();
  const [role, setRole] = useState<string>("Everyone");
  const [topic, setTopic] = useState("All");
  const [format, setFormat] = useState("Any");
  const [rows, setRows] = useState<Listener[]>([]);
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<Listener | null>(null);

  useEffect(() => {
    let live = true;
    setLoading(true);
    api.getListeners({ topic, format }).then((r) => {
      if (live) {
        setRows(r);
        setLoading(false);
      }
    });
    return () => {
      live = false;
    };
  }, [topic, format]);

  const listeners = useMemo(() => {
    if (role === "Listeners") return rows.filter((l) => l.role === "Listener");
    if (role === "Hosts") return rows.filter((l) => l.role === "Host");
    return rows;
  }, [rows, role]);

  return (
    <main data-screen-label="Find a Listener">
      <section className="m-page-header">
        <div className="m-eyebrow">Find a Listener</div>
        <h1 className="m-page-title">Find someone who understands.</h1>
        <p className="m-page-sub">Match with a peer listener based on topic, language, and lived experience.</p>
      </section>

      <section className="m-filter-bar">
        <div>
          <span className="m-filter-label">Who</span>
          <select className="m-select" value={role} onChange={(e) => setRole(e.target.value)} aria-label="Who">
            {ROLE_OPTIONS.map((o) => <option key={o} value={o}>{o}</option>)}
          </select>
        </div>
        <div>
          <span className="m-filter-label">Topic</span>
          <select className="m-select" value={topic} onChange={(e) => setTopic(e.target.value)} aria-label="Topic">
            <option value="All">All</option>
            {TOPICS.map((t) => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>
        <div>
          <span className="m-filter-label">Format</span>
          <select className="m-select" value={format} onChange={(e) => setFormat(e.target.value)} aria-label="Format">
            {FIND_FORMAT_OPTIONS.map((f) => <option key={f} value={f}>{f}</option>)}
          </select>
        </div>
      </section>

      <section className="m-section" style={{ paddingTop: 0 }}>
        <div className="m-person-grid">
          {listeners.map((l) => (
            <div
              key={l.id}
              className="m-person-card m-person-card--tappable"
              role="button"
              tabIndex={0}
              onClick={() => setProfile(l)}
              onKeyDown={(e) => { if (e.key === "Enter") setProfile(l); }}
            >
              <div className="m-person-photo-wrap">
                <div
                  className="m-person-photo"
                  role="img"
                  aria-label={`${l.name}, ${l.role}`}
                  style={{ backgroundImage: `url(${personAvatar(l)})` }}
                />
                <div className="m-person-photo-overlay" />
                <span className={`m-person-role-badge ${l.role === "Host" ? "m-person-role-badge--host" : "m-person-role-badge--listener"}`}>
                  {l.role}
                </span>
              </div>
              <div className="m-person-body">
                <h4 className="m-person-name">{l.name}</h4>
                <span className="m-person-rating">★ {l.rating}</span>
                <button
                  className="m-person-msg-btn"
                  onClick={(e) => { e.stopPropagation(); app.openComposerFor(l.name); }}
                >
                  Message
                </button>
              </div>
            </div>
          ))}
        </div>

        {!loading && listeners.length === 0 && (
          <p className="m-empty">No listeners match those filters yet — try widening your search.</p>
        )}
      </section>

      <section className="m-reminder">
        <p className="m-reminder-text">
          Peer listeners share lived experience, not professional therapy — unless marked “Verified Professional.”{" "}
          <span className="m-inline-link" role="link" tabIndex={0} onClick={() => navigate("/safety")}>
            Read our safety guidelines →
          </span>
        </p>
      </section>

      {profile && (
        <ProfileModal
          person={profile}
          onClose={() => setProfile(null)}
          onMessage={() => {
            const name = profile.name;
            setProfile(null);
            app.openComposerFor(name);
          }}
        />
      )}
    </main>
  );
}
