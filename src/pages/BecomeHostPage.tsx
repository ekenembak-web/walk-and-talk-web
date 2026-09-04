import { useState } from "react";
import { useApp } from "../state/store";
import { HOST_ACTIVITY_TILES, HOST_EVENT_TYPES } from "../data/content";
import type { HostApplication } from "../lib/types";
import * as api from "../data/api";
import { PhotoField } from "../components/PhotoField";

const EMPTY: HostApplication = {
  name: "",
  username: "",
  email: "",
  city: "",
  capacity: "",
  eventType: "Group Walk",
  otherEventType: "",
  description: "",
  photo: "",
  agree: false,
};

type ReqStatus = "pending" | "approved" | "declined";
interface SpotRequest {
  id: string;
  name: string;
  note: string;
  status: ReqStatus;
}

const SEED_REQUESTS: SpotRequest[] = [
  { id: "req1", name: "Elena V.", note: "New to the area, would love to join a few rides before winter.", status: "pending" },
  { id: "req2", name: "Marcus B.", note: "Rode with a club back home, looking for something casual.", status: "pending" },
  { id: "req3", name: "Sofia P.", note: "Coming with my own bike, is the pace okay for a beginner?", status: "approved" },
];

const BASE_ACTIVITY = {
  name: "Group Cycling",
  sub: "Every Saturday · Riverside Park",
  schedule: "Saturdays · 9:00–11:00am",
  location: "Riverside Park, west entrance",
  groupSize: "Up to 14 riders",
  cost: "Free",
};

function MyActivity() {
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(false);
  const [activity, setActivity] = useState(BASE_ACTIVITY);
  const [draft, setDraft] = useState(BASE_ACTIVITY);
  const [requests, setRequests] = useState(SEED_REQUESTS);

  const startEdit = () => {
    if (editing) {
      setEditing(false);
      return;
    }
    setDraft(activity);
    setEditing(true);
  };
  const save = () => {
    setActivity(draft);
    setEditing(false);
  };
  const setStatus = (id: string, status: ReqStatus) =>
    setRequests((rs) => rs.map((r) => (r.id === id ? { ...r, status } : r)));

  return (
    <div className="my-act-card">
      <button className="my-act-head" onClick={() => setOpen((v) => !v)} aria-expanded={open}>
        <span className="my-act-chev" style={{ visibility: "hidden" }}>⌄</span>
        <div className="my-act-head-text">
          <p className="my-act-eyebrow">Your listing</p>
          <h3 className="my-act-title">{activity.name}</h3>
          <p className="my-act-sub">{activity.sub}</p>
        </div>
        <span className={`my-act-chev ${open ? "my-act-chev--open" : ""}`}>⌄</span>
      </button>

      {open && (
        <div className="my-act-body">
          <div className="my-act-edit-row">
            <button className="my-act-edit" onClick={startEdit}>{editing ? "Cancel" : "Edit"}</button>
          </div>

          {editing ? (
            <>
              <div className="my-act-grid">
                {(["schedule", "location", "groupSize", "cost"] as const).map((k) => (
                  <div className="field" key={k}>
                    <label>{k === "groupSize" ? "Group size" : k[0].toUpperCase() + k.slice(1)}</label>
                    <input className="input" value={draft[k]} onChange={(e) => setDraft({ ...draft, [k]: e.target.value })} />
                  </div>
                ))}
              </div>
              <button className="my-act-save" onClick={save}>Save changes</button>
            </>
          ) : (
            <div className="my-act-facts">
              <div className="my-act-fact"><span className="my-act-fact-key">Schedule</span><span className="my-act-fact-val">{activity.schedule}</span></div>
              <div className="my-act-fact"><span className="my-act-fact-key">Location</span><span className="my-act-fact-val">{activity.location}</span></div>
              <div className="my-act-fact"><span className="my-act-fact-key">Group size</span><span className="my-act-fact-val">{activity.groupSize}</span></div>
              <div className="my-act-fact"><span className="my-act-fact-key">Cost</span><span className="my-act-fact-val">{activity.cost}</span></div>
            </div>
          )}

          <p className="my-act-requests-label">Spot requests</p>
          {requests.map((r) => (
            <div className="my-act-req-row" key={r.id}>
              <div className="my-act-req-text">
                <p className="my-act-req-name">{r.name}</p>
                <p className="my-act-req-note">{r.note}</p>
              </div>
              {r.status === "pending" ? (
                <div className="my-act-req-actions">
                  <button className="my-act-btn-ghost" onClick={() => setStatus(r.id, "declined")}>Decline</button>
                  <button className="my-act-btn-primary" onClick={() => setStatus(r.id, "approved")}>Approve</button>
                </div>
              ) : (
                <span className={`my-act-status ${r.status === "approved" ? "my-act-status--approved" : ""}`}>
                  {r.status === "approved" ? "Approved" : "Declined"}
                </span>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export function BecomeHostPage() {
  const app = useApp();
  const [form, setForm] = useState<HostApplication>(EMPTY);
  const [submitted, setSubmitted] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const set = <K extends keyof HostApplication>(k: K, v: HostApplication[K]) =>
    setForm((f) => ({ ...f, [k]: v }));

  const disabled = !form.name || !form.username || !form.agree;

  const submit = () => {
    if (disabled || busy) return;
    app.requireAccount(async () => {
      setBusy(true);
      try {
        await api.submitHostApplication(form);
        setSubmitted(form.name);
      } finally {
        setBusy(false);
      }
    });
  };

  return (
    <main data-screen-label="Become a Host">
      <section className="page-header">
        <div className="eyebrow">Become a Host</div>
        <h1 className="page-title">Bring people together.</h1>
        <p className="page-sub">
          Organize a walk, a reset circle, a retreat, or a talk session — and give your community a
          reason to show up for each other.
        </p>
        {app.signedIn && <MyActivity />}
      </section>

      <section className="host-hero-wrap">
        <img className="host-hero-img" src="/assets/host-bring-together.jpg" alt="Group of friends gathered together, laughing over pizza and games" />
        <div className="image-overlay" />
      </section>

      <section className="section">
        <div className="section-head--row">
          <div>
            <div className="section-label">Ways to bring people together</div>
            <h2 className="section-title">Popular hosted activities</h2>
          </div>
        </div>
        <div className="heart-grid">
          {HOST_ACTIVITY_TILES.map((t) => (
            <div className="heart-tile" key={t.label}>
              <img className="heart-img" src={`/${t.img}`} alt={t.alt} />
              <div className="heart-scrim" />
              <span className="heart-label">{t.label}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="section--alt">
        <div className="section-head">
          <div className="section-label">Create your own</div>
          <h2 className="section-title">Host application</h2>
        </div>

        {submitted ? (
          <div className="form-card">
            <h3 className="card-title">Thank you, {submitted}.</h3>
            <p className="card-text">
              Your event proposal has been received. Our team reviews every host before approval —
              we'll follow up by email within a few days.
            </p>
            <button className="btn btn--ghost" onClick={() => { setForm(EMPTY); setSubmitted(null); }}>
              Submit another event
            </button>
          </div>
        ) : (
          <div className="form-card">
            <div className="form-row-2">
              <div className="field">
                <label htmlFor="h-name">Name</label>
                <input id="h-name" className="input" placeholder="Your name" value={form.name} onChange={(e) => set("name", e.target.value)} />
              </div>
              <div className="field">
                <label htmlFor="h-user">Username</label>
                <input id="h-user" className="input" placeholder="Choose a username" value={form.username} onChange={(e) => set("username", e.target.value)} />
              </div>
              <div className="field">
                <label htmlFor="h-email">Email</label>
                <input id="h-email" className="input" placeholder="you@example.com" value={form.email} onChange={(e) => set("email", e.target.value)} />
              </div>
            </div>
            <div className="form-row-2">
              <div className="field">
                <label htmlFor="h-city">City / location</label>
                <input id="h-city" className="input" placeholder="Where will this take place?" value={form.city} onChange={(e) => set("city", e.target.value)} />
              </div>
              <div className="field">
                <label htmlFor="h-cap">Number of participants</label>
                <input id="h-cap" className="input" type="number" min={2} max={100} placeholder="e.g. 12" value={form.capacity} onChange={(e) => set("capacity", e.target.value)} />
                <span className="field-hint">Between 2 and 100 people.</span>
              </div>
            </div>
            <div className="field">
              <label>Event type</label>
              <div className="chip-row">
                {HOST_EVENT_TYPES.map((t) => (
                  <button key={t} className="chip" aria-pressed={form.eventType === t} onClick={() => set("eventType", t)}>
                    {t}
                  </button>
                ))}
              </div>
              {form.eventType === "Other" && (
                <input className="input" style={{ marginTop: 10 }} placeholder="Describe the event type" value={form.otherEventType} onChange={(e) => set("otherEventType", e.target.value)} />
              )}
            </div>
            <div className="field">
              <label htmlFor="h-desc">Describe your event</label>
              <textarea id="h-desc" className="textarea" placeholder="What will happen, how often, and who it's for." value={form.description} onChange={(e) => set("description", e.target.value)} />
            </div>

            <PhotoField
              label="Photo of what the activity looks like (optional)"
              value={form.photo}
              onChange={(v) => set("photo", v)}
              previewStyle={{ width: 128, height: 88, borderRadius: 14 }}
              ariaLabel="Photo of your hosted activity"
            />

            <div className="agree-row" role="checkbox" aria-checked={form.agree} tabIndex={0}
              onClick={() => set("agree", !form.agree)}
              onKeyDown={(e) => { if (e.key === " " || e.key === "Enter") { e.preventDefault(); set("agree", !form.agree); } }}>
              <span className="agree-box" data-checked={form.agree}>{form.agree ? "✓" : ""}</span>
              <span className="checklist-text">
                I agree to host a safe, judgment-free space and follow the Walk&amp;Talk safety guidelines.
              </span>
            </div>

            <button className="btn btn--primary" style={{ alignSelf: "flex-start" }} onClick={submit} disabled={disabled || busy}>
              {busy ? "Submitting…" : "Submit event"}
            </button>
          </div>
        )}
      </section>
    </main>
  );
}
