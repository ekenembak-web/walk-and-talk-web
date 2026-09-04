import { useState } from "react";
import { useApp } from "../state/store";
import { TOPICS, type ListenerApplication } from "../lib/types";
import { LISTENER_REQUIREMENTS } from "../data/content";
import * as api from "../data/api";
import { PhotoField } from "../components/PhotoField";

const EMPTY: ListenerApplication = {
  name: "",
  username: "",
  age: "",
  email: "",
  city: "",
  language: "English",
  bio: "",
  topics: [],
  otherTopics: "",
  photo: "",
  agree: false,
};

export function BecomeListenerPage() {
  const app = useApp();
  const [form, setForm] = useState<ListenerApplication>(EMPTY);
  const [submitted, setSubmitted] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const set = <K extends keyof ListenerApplication>(k: K, v: ListenerApplication[K]) =>
    setForm((f) => ({ ...f, [k]: v }));

  const toggleTopic = (t: string) =>
    setForm((f) => ({
      ...f,
      topics: f.topics.includes(t) ? f.topics.filter((x) => x !== t) : [...f.topics, t],
    }));

  const disabled = !form.name || !form.username || !form.age || !form.agree;

  const submit = () => {
    if (disabled || busy) return;
    app.requireAccount(async () => {
      setBusy(true);
      try {
        await api.submitListenerApplication(form);
        setSubmitted(form.name);
      } finally {
        setBusy(false);
      }
    });
  };

  return (
    <main data-screen-label="Become a Listener">
      <section className="page-header">
        <div className="eyebrow">Become a Listener</div>
        <h1 className="page-title">Become the person you once needed.</h1>
        <p className="page-sub">
          Use your experience, empathy, and time to support someone facing a challenge you understand.
        </p>
      </section>

      <section className="section-split">
        <div>
          <div className="section-label">What listeners do</div>
          <h2 className="section-title">Empathy, not expertise</h2>
          <p className="body-text">
            Listeners are not automatically professional therapists. Your role is to offer empathy,
            encouragement, and lived-experience support — without judgment and without pressure.
          </p>
          <div className="checklist">
            {LISTENER_REQUIREMENTS.map((r) => (
              <div className="checklist-item" key={r}>
                <span className="check-mark">✓</span>
                <span className="checklist-text">{r}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="split-image-wrap">
          <img className="split-image" src="/assets/become-listener.jpg" alt="Two people sitting quietly by the sea at dusk, deep in conversation" />
          <div className="image-overlay" />
        </div>
      </section>

      <section className="section--alt">
        <div className="section-head">
          <div className="section-label">Apply</div>
          <h2 className="section-title">Listener application</h2>
        </div>

        {submitted ? (
          <div className="form-card">
            <h3 className="card-title">Thank you, {submitted}.</h3>
            <p className="card-text">
              Your application has been received. Our team reviews every listener before approval —
              we'll follow up by email within a few days.
            </p>
            <button className="btn btn--ghost" onClick={() => { setForm(EMPTY); setSubmitted(null); }}>
              Submit another application
            </button>
          </div>
        ) : (
          <div className="form-card">
            <div className="form-row-2">
              <div className="field">
                <label htmlFor="l-name">Name</label>
                <input id="l-name" className="input" placeholder="Your name" value={form.name} onChange={(e) => set("name", e.target.value)} />
              </div>
              <div className="field">
                <label htmlFor="l-user">Username</label>
                <input id="l-user" className="input" placeholder="Choose a username" value={form.username} onChange={(e) => set("username", e.target.value)} />
              </div>
              <div className="field">
                <label htmlFor="l-email">Email</label>
                <input id="l-email" className="input" placeholder="you@example.com" value={form.email} onChange={(e) => set("email", e.target.value)} />
              </div>
            </div>
            <div className="form-row-2">
              <div className="field">
                <label htmlFor="l-city">City</label>
                <input id="l-city" className="input" placeholder="City" value={form.city} onChange={(e) => set("city", e.target.value)} />
              </div>
              <div className="field">
                <label htmlFor="l-lang">Preferred language</label>
                <input id="l-lang" className="input" placeholder="English" value={form.language} onChange={(e) => set("language", e.target.value)} />
              </div>
            </div>
            <div className="field">
              <label htmlFor="l-age">Age</label>
              <input
                id="l-age"
                className="input"
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                maxLength={3}
                value={form.age}
                onChange={(e) => set("age", e.target.value.replace(/[^0-9]/g, "").slice(0, 3))}
              />
            </div>

            <PhotoField
              label="Profile photo (optional)"
              value={form.photo}
              onChange={(v) => set("photo", v)}
              previewStyle={{ width: 96, height: 96 }}
              ariaLabel="Your uploaded profile photo"
            />

            <div className="field">
              <label>Topics you feel comfortable discussing</label>
              <div className="chip-row">
                {TOPICS.map((t) => (
                  <button key={t} className="chip" aria-pressed={form.topics.includes(t)} onClick={() => toggleTopic(t)}>
                    {t}
                  </button>
                ))}
              </div>
              {form.topics.includes("Other") && (
                <input
                  className="other-input"
                  placeholder="Anything else you're comfortable with"
                  value={form.otherTopics}
                  onChange={(e) => set("otherTopics", e.target.value)}
                />
              )}
            </div>

            <div className="field">
              <label htmlFor="l-bio">Short bio</label>
              <textarea
                id="l-bio"
                className="textarea"
                placeholder="Share a little about your experience and why you want to listen."
                value={form.bio}
                onChange={(e) => set("bio", e.target.value)}
              />
            </div>

            <div className="agree-row" role="checkbox" aria-checked={form.agree} tabIndex={0}
              onClick={() => set("agree", !form.agree)}
              onKeyDown={(e) => { if (e.key === " " || e.key === "Enter") { e.preventDefault(); set("agree", !form.agree); } }}>
              <span className="agree-box" data-checked={form.agree}>{form.agree ? "✓" : ""}</span>
              <span className="checklist-text">
                I agree to listen without judgment, respect privacy, and follow the Walk&amp;Talk safety guidelines.
              </span>
            </div>

            <button className="btn btn--primary" style={{ alignSelf: "flex-start" }} onClick={submit} disabled={disabled || busy}>
              {busy ? "Submitting…" : "Submit application"}
            </button>
          </div>
        )}
      </section>
    </main>
  );
}
