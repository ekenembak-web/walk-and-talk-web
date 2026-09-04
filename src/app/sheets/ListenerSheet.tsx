import { useState } from "react";
import { Sheet } from "../Sheet";
import { useAppShell } from "../AppProvider";
import type { ListenerApplication } from "../../lib/types";
import { APP_TOPICS } from "../data";

const TOPICS = [...APP_TOPICS, "Other"];
const EMPTY: ListenerApplication = {
  name: "", username: "", age: "", email: "", city: "", language: "English",
  bio: "", topics: [], otherTopics: "", photo: "", agree: false,
};

export function ListenerSheet() {
  const shell = useAppShell();
  const [form, setForm] = useState<ListenerApplication>(EMPTY);
  const [submitted, setSubmitted] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const set = <K extends keyof ListenerApplication>(k: K, v: ListenerApplication[K]) => setForm((f) => ({ ...f, [k]: v }));
  const toggleTopic = (t: string) =>
    setForm((f) => ({ ...f, topics: f.topics.includes(t) ? f.topics.filter((x) => x !== t) : [...f.topics, t] }));

  const disabled = !form.name || !form.username || !form.age || !form.agree;

  const close = () => {
    shell.closeSheet("listener");
    setForm(EMPTY);
    setSubmitted(null);
  };
  const submit = () => {
    if (disabled || busy) return;
    setBusy(true);
    shell.submitListenerApplication(form, () => {
      setSubmitted(form.name);
      setBusy(false);
    });
  };

  const onPhoto = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => set("photo", String(reader.result));
    reader.readAsDataURL(file);
  };

  return (
    <Sheet onClose={close} labelledBy="listener-title">
      {submitted ? (
        <>
          <h3 className="a-sheet-title" id="listener-title">Thanks, {submitted}!</h3>
          <p className="a-sheet-sub">Our team reviews every listener before approval.</p>
          <button className="a-cta-full" onClick={close}>Done</button>
        </>
      ) : (
        <>
          <h3 className="a-sheet-title" id="listener-title">Become a Listener</h3>
          <p className="a-sheet-sub">Share your experience and why you want to listen.</p>
          <input className="a-input" placeholder="Your name" value={form.name} onChange={(e) => set("name", e.target.value)} />
          <input className="a-input" placeholder="Username" value={form.username} onChange={(e) => set("username", e.target.value)} />
          <input className="a-input" placeholder="Email" value={form.email} onChange={(e) => set("email", e.target.value)} />
          <input className="a-input" placeholder="City" value={form.city} onChange={(e) => set("city", e.target.value)} />
          <input className="a-input" placeholder="Preferred language" value={form.language} onChange={(e) => set("language", e.target.value)} />
          <input
            className="a-input"
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            maxLength={3}
            placeholder="Age"
            value={form.age}
            onChange={(e) => set("age", e.target.value.replace(/[^0-9]/g, "").slice(0, 3))}
          />
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            {form.photo && (
              <div className="a-photo-preview" role="img" aria-label="Your uploaded profile photo"
                style={{ width: 72, height: 72, borderRadius: 14, backgroundImage: `url(${form.photo})` }} />
            )}
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              <label className="a-upload-btn">
                Profile photo
                <input type="file" accept="image/*" onChange={onPhoto} style={{ display: "none" }} />
              </label>
              {form.photo && <span className="a-upload-clear" role="button" tabIndex={0} onClick={() => set("photo", "")}>Remove</span>}
            </div>
          </div>
          <div className="a-chip-wrap">
            {TOPICS.map((t) => (
              <button key={t} className="a-chip" aria-pressed={form.topics.includes(t)} onClick={() => toggleTopic(t)}>
                {t}
              </button>
            ))}
          </div>
          {form.topics.includes("Other") && (
            <input className="a-input" placeholder="Which other topics?" value={form.otherTopics} onChange={(e) => set("otherTopics", e.target.value)} />
          )}
          <textarea className="a-input a-textarea" placeholder="Short bio" value={form.bio} onChange={(e) => set("bio", e.target.value)} />
          <div
            className="a-agree-row"
            role="checkbox"
            aria-checked={form.agree}
            tabIndex={0}
            onClick={() => set("agree", !form.agree)}
            onKeyDown={(e) => { if (e.key === " " || e.key === "Enter") { e.preventDefault(); set("agree", !form.agree); } }}
          >
            <span className="a-agree-box" data-checked={form.agree}>{form.agree ? "✓" : ""}</span>
            <span className="a-agree-text">
              I agree to listen without judgment, respect privacy, and follow the safety guidelines.
            </span>
          </div>
          <button className="a-cta-full" onClick={submit} disabled={disabled || busy}>
            {busy ? "Submitting…" : "Submit application"}
          </button>
        </>
      )}
    </Sheet>
  );
}
