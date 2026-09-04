import { useState } from "react";
import { Sheet } from "../Sheet";
import { useApp } from "../../state/store";
import { useAppShell } from "../AppProvider";
import { HOST_EVENT_TYPES } from "../../data/content";
import type { HostApplication } from "../../lib/types";

const EMPTY: HostApplication = {
  name: "", username: "", email: "", city: "", capacity: "",
  eventType: "Group Walk", otherEventType: "", description: "", photo: "", agree: true,
};

export function HostSheet() {
  const app = useApp();
  const shell = useAppShell();
  const [form, setForm] = useState<HostApplication>(EMPTY);
  const [submitted, setSubmitted] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const set = <K extends keyof HostApplication>(k: K, v: HostApplication[K]) => setForm((f) => ({ ...f, [k]: v }));

  const pending = shell.spotRequests.filter((r) => r.status === "pending").length;
  const disabled = !form.name || !form.username;

  const close = () => {
    shell.closeSheet("host");
    setForm(EMPTY);
    setSubmitted(null);
  };
  const submit = () => {
    if (disabled || busy) return;
    setBusy(true);
    shell.submitHostApplication(form, () => {
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
    <Sheet onClose={close} labelledBy="host-title">
      {submitted ? (
        <>
          <h3 className="a-sheet-title" id="host-title">Thanks, {submitted}!</h3>
          <p className="a-sheet-sub">We'll review your event and follow up by email.</p>
          <button className="a-cta-full" onClick={close}>Done</button>
        </>
      ) : (
        <>
          {app.signedIn && (
            <button
              className="a-myact-link"
              onClick={() => {
                shell.closeSheet("host");
                setTimeout(() => shell.openSheet("myActivity"), 50);
              }}
            >
              <div>
                <p className="a-myact-link-title">You already have a listing</p>
                <p className="a-myact-link-sub">Group Cycling · {pending} pending requests</p>
              </div>
              <span className="a-menu-chevron">›</span>
            </button>
          )}
          <h3 className="a-sheet-title" id="host-title">Become a Host</h3>
          <p className="a-sheet-sub">Tell us what you'd like to organize.</p>
          <input className="a-input" placeholder="Your name" value={form.name} onChange={(e) => set("name", e.target.value)} />
          <input className="a-input" placeholder="Username" value={form.username} onChange={(e) => set("username", e.target.value)} />
          <input className="a-input" placeholder="Email" value={form.email} onChange={(e) => set("email", e.target.value)} />
          <div className="a-chip-wrap">
            {HOST_EVENT_TYPES.map((t) => (
              <button key={t} className="a-chip" aria-pressed={form.eventType === t} onClick={() => set("eventType", t)}>
                {t}
              </button>
            ))}
          </div>
          {form.eventType === "Other" && (
            <input className="a-input" placeholder="Describe the event type" value={form.otherEventType} onChange={(e) => set("otherEventType", e.target.value)} />
          )}
          <input
            className="a-input"
            type="number"
            min={2}
            max={100}
            placeholder="Number of participants (2-100)"
            value={form.capacity}
            onChange={(e) => set("capacity", e.target.value)}
          />
          <textarea className="a-input a-textarea" placeholder="What's the event?" value={form.description} onChange={(e) => set("description", e.target.value)} />
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            {form.photo && (
              <div className="a-photo-preview" role="img" aria-label="Photo of your hosted activity"
                style={{ width: 96, height: 68, borderRadius: 12, backgroundImage: `url(${form.photo})` }} />
            )}
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              <label className="a-upload-btn">
                Activity photo (optional)
                <input type="file" accept="image/*" onChange={onPhoto} style={{ display: "none" }} />
              </label>
              {form.photo && <span className="a-upload-clear" role="button" tabIndex={0} onClick={() => set("photo", "")}>Remove</span>}
            </div>
          </div>
          <button className="a-cta-full" onClick={submit} disabled={disabled || busy}>
            {busy ? "Submitting…" : "Submit event"}
          </button>
        </>
      )}
    </Sheet>
  );
}
