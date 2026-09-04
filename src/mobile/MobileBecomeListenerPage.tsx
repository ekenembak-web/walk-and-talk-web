import { useState } from "react";
import { useApp } from "../state/store";
import { TOPICS, type ListenerApplication } from "../lib/types";
import { LISTENER_REQUIREMENTS } from "../data/content";
import * as api from "../data/api";
import { PhotoField } from "../components/PhotoField";

const EMPTY: ListenerApplication = {
  name: "", username: "", age: "", email: "", city: "", language: "English",
  bio: "", topics: [], otherTopics: "", photo: "", agree: false,
};

export function MobileBecomeListenerPage() {
  const app = useApp();
  const [form, setForm] = useState<ListenerApplication>(EMPTY);
  const [submitted, setSubmitted] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const set = <K extends keyof ListenerApplication>(k: K, v: ListenerApplication[K]) =>
    setForm((f) => ({ ...f, [k]: v }));
  const toggleTopic = (t: string) =>
    setForm((f) => ({ ...f, topics: f.topics.includes(t) ? f.topics.filter((x) => x !== t) : [...f.topics, t] }));

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
      <section className="m-page-header">
        <div className="m-eyebrow">Become a Listener</div>
        <h1 className="m-page-title">Become the person you once needed.</h1>
        <p className="m-page-sub">
          Use your experience, empathy, and time to support someone facing a challenge you understand.
        </p>
      </section>

      <section className="m-split m-split--image-first">
        <div className="m-split-image-wrap">
          <img className="m-split-image" src="/assets/become-listener.jpg" alt="Two people sitting quietly by the sea at dusk, deep in conversation" />
          <div className="m-split-image-overlay" />
        </div>
        <div>
          <div className="m-label">What listeners do</div>
          <h2 className="m-title">Empathy, not expertise</h2>
          <p className="m-body-text">
            Listeners are not automatically professional therapists. Your role is to offer empathy,
            encouragement, and lived-experience support.
          </p>
          <div className="m-checklist">
            {LISTENER_REQUIREMENTS.map((r) => (
              <div className="m-checklist-item" key={r}>
                <span className="m-check">✓</span>
                <span className="m-checklist-text">{r}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="m-section--alt">
        <div className="m-head">
          <div className="m-label">Apply</div>
          <h2 className="m-title">Listener application</h2>
        </div>

        {submitted ? (
          <div className="m-form-card">
            <h3 className="m-card-title">Thank you, {submitted}.</h3>
            <p className="m-card-text">
              Your application has been received. Our team reviews every listener before approval —
              we'll follow up by email within a few days.
            </p>
            <button className="m-btn m-btn--ghost m-btn--block" onClick={() => { setForm(EMPTY); setSubmitted(null); }}>
              Submit another application
            </button>
          </div>
        ) : (
          <div className="m-form-card">
            {([
              ["name", "Name", "Your name"],
              ["username", "Username", "Choose a username"],
              ["email", "Email", "you@example.com"],
              ["city", "City", "City"],
              ["language", "Preferred language", "English"],
            ] as const).map(([key, label, ph]) => (
              <div className="m-field" key={key}>
                <label htmlFor={`ml-${key}`}>{label}</label>
                <input id={`ml-${key}`} className="m-input" placeholder={ph} value={form[key] as string} onChange={(e) => set(key, e.target.value)} />
              </div>
            ))}
            <div className="m-field">
              <label htmlFor="ml-age">Age</label>
              <input id="ml-age" className="m-input" type="text" inputMode="numeric" pattern="[0-9]*" maxLength={3}
                value={form.age} onChange={(e) => set("age", e.target.value.replace(/[^0-9]/g, "").slice(0, 3))} />
            </div>

            <PhotoField
              label="Profile photo (optional)"
              value={form.photo}
              onChange={(v) => set("photo", v)}
              previewStyle={{ width: 88, height: 88 }}
              ariaLabel="Your uploaded profile photo"
            />

            <div className="m-field">
              <label>Topics you feel comfortable discussing</label>
              <div className="m-chip-wrap">
                {TOPICS.map((t) => (
                  <button key={t} className="m-chip-btn" aria-pressed={form.topics.includes(t)} onClick={() => toggleTopic(t)}>
                    {t}
                  </button>
                ))}
              </div>
              {form.topics.includes("Other") && (
                <input className="m-input" style={{ marginTop: 10 }} placeholder="Which other topics?"
                  value={form.otherTopics} onChange={(e) => set("otherTopics", e.target.value)} />
              )}
            </div>

            <div className="m-field">
              <label htmlFor="ml-bio">Short bio</label>
              <textarea id="ml-bio" className="m-textarea" placeholder="Share a little about your experience and why you want to listen."
                value={form.bio} onChange={(e) => set("bio", e.target.value)} />
            </div>

            <div className="m-agree-row" role="checkbox" aria-checked={form.agree} tabIndex={0}
              onClick={() => set("agree", !form.agree)}
              onKeyDown={(e) => { if (e.key === " " || e.key === "Enter") { e.preventDefault(); set("agree", !form.agree); } }}>
              <span className="m-agree-box" data-checked={form.agree}>{form.agree ? "✓" : ""}</span>
              <span className="m-checklist-text">
                I agree to listen without judgment, respect privacy, and follow the Walk&amp;Talk safety guidelines.
              </span>
            </div>

            <button className="m-btn m-btn--primary m-btn--block" onClick={submit} disabled={disabled || busy}>
              {busy ? "Submitting…" : "Submit application"}
            </button>
          </div>
        )}
      </section>
    </main>
  );
}
