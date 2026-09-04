import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useApp } from "../state/store";
import { TOPICS, type Listener } from "../lib/types";
import { FIND_FORMAT_OPTIONS } from "../data/content";
import * as api from "../data/api";
import { personAvatar } from "../lib/avatar";
import { ProfileModal } from "../components/ProfileModal";

export function FindPage() {
  const app = useApp();
  const navigate = useNavigate();
  const [topic, setTopic] = useState("All");
  const [format, setFormat] = useState("Any");
  const [otherTopic, setOtherTopic] = useState("");
  const [listeners, setListeners] = useState<Listener[]>([]);
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<Listener | null>(null);

  useEffect(() => {
    let live = true;
    setLoading(true);
    api.getListeners({ topic, format }).then((rows) => {
      if (live) {
        setListeners(rows);
        setLoading(false);
      }
    });
    return () => {
      live = false;
    };
  }, [topic, format]);

  const request = (name: string) => app.openComposerFor(name);

  return (
    <main data-screen-label="Find a Listener">
      <section className="page-header">
        <div className="eyebrow">Find a Listener</div>
        <h1 className="page-title">Find someone who understands.</h1>
        <p className="page-sub">
          Match with a peer listener or professional counselor based on topic, language, and lived experience.
        </p>
      </section>

      <section className="filter-bar">
        <div>
          <span className="filter-label">Topic of discussion</span>
          <select className="select" value={topic} onChange={(e) => setTopic(e.target.value)} aria-label="Topic of discussion">
            <option value="All">All</option>
            {TOPICS.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
          {topic === "Other" && (
            <input
              className="other-input"
              placeholder="Tell us what you'd like to talk about"
              value={otherTopic}
              onChange={(e) => setOtherTopic(e.target.value)}
            />
          )}
        </div>
        <div>
          <span className="filter-label">Format</span>
          <div className="chip-row">
            {FIND_FORMAT_OPTIONS.map((f) => (
              <button
                key={f}
                className="chip"
                aria-pressed={format === f}
                onClick={() => setFormat(f)}
              >
                {f}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="listener-grid">
          {listeners.map((l) => (
            <div
              key={l.id}
              className="listener-card"
              role="button"
              tabIndex={0}
              onClick={() => setProfile(l)}
              onKeyDown={(e) => { if (e.key === "Enter") setProfile(l); }}
            >
              <div className="listener-photo">
                <div
                  className="listener-photo-img"
                  role="img"
                  aria-label={`${l.name}, ${l.role}`}
                  style={{ backgroundImage: `url(${personAvatar(l)})` }}
                />
                <span className={`role-badge ${l.role === "Host" ? "role-badge--host" : "role-badge--listener"}`}>
                  {l.role}
                </span>
              </div>
              <div className="listener-body">
                <div className="listener-name-row">
                  <h4 className="listener-name">{l.name}</h4>
                  <span className="rating-badge">★ {l.rating}</span>
                </div>
                <p className="listener-meta">
                  {l.city} · {l.language} · {l.format}
                </p>
                <p className="listener-bio">{l.bio}</p>
                <div className="chip-row">
                  {l.topics.map((t) => (
                    <span key={t} className="chip-tiny">{t}</span>
                  ))}
                </div>
                <button
                  className="btn btn--primary-sm"
                  onClick={(e) => { e.stopPropagation(); request(l.name); }}
                >
                  Request to talk
                </button>
              </div>
            </div>
          ))}
        </div>
        {!loading && listeners.length === 0 && (
          <p className="empty-state">No listeners match those filters yet — try widening your search.</p>
        )}
      </section>

      <section className="reminder-bar">
        <p className="reminder-text">
          Peer listeners share lived experience, not professional therapy — unless marked “Verified
          Professional.”{" "}
          <span className="inline-link" role="link" tabIndex={0} onClick={() => navigate("/safety")}>
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
