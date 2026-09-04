import { useState } from "react";
import { useApp } from "../state/store";
import { HOST_EVENT_TYPES } from "../data/content";
import type { HostApplication } from "../lib/types";
import * as api from "../data/api";
import { PhotoField } from "../components/PhotoField";

const EMPTY: HostApplication = {
  name: "", username: "", email: "", city: "", capacity: "",
  eventType: "Group Walk", otherEventType: "", description: "", photo: "", agree: false,
};

const ACTIVITIES = [
  { title: "Group cycling", img: "assets/host-cycling.jpg", alt: "Group of four cyclists riding along a waterfront", meta: "Gather a few riders for an easy group ride and a chance to talk along the way." },
  { title: "Hiking", img: "assets/host-hiking.jpg", alt: "Two hikers walking a trail across green heathland", meta: "Take a small group out on a local trail for fresh air and open conversation." },
  { title: "Kids play dates", img: "assets/host-playdates.jpg", alt: "Children playing outdoors together", meta: "Organize a supervised playtime so parents can connect while kids play." },
  { title: "Game Night", img: "assets/host-gamenight.jpg", alt: "Friends playing cards", meta: "Host a relaxed night of cards or board games with snacks and good company." },
  { title: "Movie Night", img: "assets/host-movienight.jpg", alt: "Cozy living room with a movie playing", meta: "Invite a few people over for a film and easy conversation afterward." },
  { title: "Sports Day", img: "assets/host-sportsday.jpg", alt: "Group of men playing soccer", meta: "Organize a casual match or friendly pickup game for anyone who wants in." },
];

type ReqStatus = "pending" | "approved" | "declined";
const SEED = [
  { id: "req1", name: "Elena V.", note: "New to the area, would love to join a few rides before winter.", status: "pending" as ReqStatus },
  { id: "req2", name: "Marcus B.", note: "Rode with a club back home, looking for something casual.", status: "pending" as ReqStatus },
  { id: "req3", name: "Sofia P.", note: "Coming with my own bike, is the pace okay for a beginner?", status: "approved" as ReqStatus },
];
const BASE = {
  name: "Group Cycling", sub: "Every Saturday · Riverside Park",
  schedule: "Saturdays · 9:00–11:00am", location: "Riverside Park, west entrance",
  groupSize: "Up to 14 riders", cost: "Free",
};

function MyActivity() {
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(false);
  const [activity, setActivity] = useState(BASE);
  const [draft, setDraft] = useState(BASE);
  const [reqs, setReqs] = useState(SEED);

  return (
    <div className="m-myact-card">
      <button className="m-myact-head" onClick={() => setOpen((v) => !v)} aria-expanded={open}>
        <span className="m-myact-chev" style={{ visibility: "hidden" }}>⌄</span>
        <div className="m-myact-head-text">
          <p className="m-myact-eyebrow">Your listing</p>
          <h3 className="m-myact-title">{activity.name}</h3>
          <p className="m-myact-sub">{activity.sub}</p>
        </div>
        <span className={`m-myact-chev ${open ? "m-myact-chev--open" : ""}`}>⌄</span>
      </button>
      {open && (
        <div className="m-myact-body">
          <div className="m-myact-edit-row">
            <button className="m-myact-edit" onClick={() => { if (!editing) setDraft(activity); setEditing((v) => !v); }}>
              {editing ? "Cancel" : "Edit"}
            </button>
          </div>
          {editing ? (
            <>
              {(["schedule", "location", "groupSize", "cost"] as const).map((k) => (
                <div className="m-field" key={k}>
                  <label>{k === "groupSize" ? "Group size" : k[0].toUpperCase() + k.slice(1)}</label>
                  <input className="m-input" value={draft[k]} onChange={(e) => setDraft({ ...draft, [k]: e.target.value })} />
                </div>
              ))}
              <button className="m-myact-save" onClick={() => { setActivity(draft); setEditing(false); }}>Save changes</button>
            </>
          ) : (
            <div className="m-myact-facts">
              {([["Schedule", activity.schedule], ["Location", activity.location], ["Group size", activity.groupSize], ["Cost", activity.cost]] as const).map(([k, v]) => (
                <div className="m-myact-fact" key={k}><span className="m-myact-fact-key">{k}</span><span className="m-myact-fact-val">{v}</span></div>
              ))}
            </div>
          )}
          <p className="m-myact-req-label">Spot requests</p>
          {reqs.map((r) => (
            <div className="m-myact-req" key={r.id}>
              <div className="m-myact-req-text">
                <p className="m-myact-req-name">{r.name}</p>
                <p className="m-myact-req-note">{r.note}</p>
              </div>
              {r.status === "pending" ? (
                <div className="m-myact-req-actions">
                  <button className="m-myact-btn-ghost" onClick={() => setReqs((rs) => rs.map((x) => x.id === r.id ? { ...x, status: "declined" } : x))}>Decline</button>
                  <button className="m-myact-btn-primary" onClick={() => setReqs((rs) => rs.map((x) => x.id === r.id ? { ...x, status: "approved" } : x))}>Approve</button>
                </div>
              ) : (
                <span className={`m-myact-status ${r.status === "approved" ? "m-myact-status--approved" : ""}`}>
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

export function MobileBecomeHostPage() {
  const app = useApp();
  const [form, setForm] = useState<HostApplication>(EMPTY);
  const [submitted, setSubmitted] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const set = <K extends keyof HostApplication>(k: K, v: HostApplication[K]) => setForm((f) => ({ ...f, [k]: v }));
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
      <section className="m-page-header">
        {app.signedIn && <MyActivity />}
        <div className="m-eyebrow">Become a Host</div>
        <h1 className="m-page-title">Bring people together.</h1>
        <p className="m-page-sub">Organize a walk, a reset circle, a retreat, or a talk session for your community.</p>
      </section>

      <div className="m-host-hero-wrap">
        <img className="m-host-hero-img" src="/assets/host-bring-together.jpg" alt="Group of friends gathered together, laughing over pizza and games" />
        <div className="m-community-photo-overlay" />
      </div>

      <section className="m-section">
        <div className="m-head--stack">
          <div className="m-label">Ways to host</div>
          <h2 className="m-title">Popular hosted activities</h2>
        </div>
        <div className="m-activity-list">
          {ACTIVITIES.map((a) => (
            <div className="m-activity-card" key={a.title}>
              <div className="m-activity-img-wrap">
                <img className="m-activity-img" src={`/${a.img}`} alt={a.alt} />
                <div className="m-activity-img-overlay" />
              </div>
              <div className="m-activity-body">
                <h4 className="m-activity-title">{a.title}</h4>
                <p className="m-activity-meta">{a.meta}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="m-section--alt">
        <div className="m-head">
          <div className="m-label">Create your own</div>
          <h2 className="m-title">Host application</h2>
        </div>

        {submitted ? (
          <div className="m-form-card">
            <h3 className="m-card-title">Thank you, {submitted}.</h3>
            <p className="m-card-text">
              Your event proposal has been received. Our team reviews every host before approval —
              we'll follow up by email within a few days.
            </p>
            <button className="m-btn m-btn--ghost m-btn--block" onClick={() => { setForm(EMPTY); setSubmitted(null); }}>
              Submit another event
            </button>
          </div>
        ) : (
          <div className="m-form-card">
            {([
              ["name", "Name", "Your name"],
              ["username", "Username", "Choose a username"],
              ["email", "Email", "you@example.com"],
              ["city", "City / location", "Where will this take place?"],
            ] as const).map(([key, label, ph]) => (
              <div className="m-field" key={key}>
                <label htmlFor={`mh-${key}`}>{label}</label>
                <input id={`mh-${key}`} className="m-input" placeholder={ph} value={form[key] as string} onChange={(e) => set(key, e.target.value)} />
              </div>
            ))}
            <div className="m-field">
              <label htmlFor="mh-cap">Number of participants</label>
              <input id="mh-cap" className="m-input" type="number" min={2} max={100} placeholder="e.g. 12"
                value={form.capacity} onChange={(e) => set("capacity", e.target.value)} />
              <span className="m-field-hint">Between 2 and 100 people.</span>
            </div>
            <div className="m-field">
              <label>Event type</label>
              <div className="m-chip-wrap">
                {HOST_EVENT_TYPES.map((t) => (
                  <button key={t} className="m-chip-btn" aria-pressed={form.eventType === t} onClick={() => set("eventType", t)}>
                    {t}
                  </button>
                ))}
              </div>
              {form.eventType === "Other" && (
                <input className="m-input" style={{ marginTop: 10 }} placeholder="Describe the event type"
                  value={form.otherEventType} onChange={(e) => set("otherEventType", e.target.value)} />
              )}
            </div>
            <div className="m-field">
              <label htmlFor="mh-desc">Describe your event</label>
              <textarea id="mh-desc" className="m-textarea" placeholder="What will happen, how often, and who it's for."
                value={form.description} onChange={(e) => set("description", e.target.value)} />
            </div>

            <PhotoField
              label="Photo of what the activity looks like (optional)"
              value={form.photo}
              onChange={(v) => set("photo", v)}
              previewStyle={{ width: 120, height: 80, borderRadius: 14 }}
              ariaLabel="Photo of your hosted activity"
            />

            <div className="m-agree-row" role="checkbox" aria-checked={form.agree} tabIndex={0}
              onClick={() => set("agree", !form.agree)}
              onKeyDown={(e) => { if (e.key === " " || e.key === "Enter") { e.preventDefault(); set("agree", !form.agree); } }}>
              <span className="m-agree-box" data-checked={form.agree}>{form.agree ? "✓" : ""}</span>
              <span className="m-checklist-text">
                I agree to host a safe, judgment-free space and follow the Walk&amp;Talk safety guidelines.
              </span>
            </div>

            <button className="m-btn m-btn--primary m-btn--block" onClick={submit} disabled={disabled || busy}>
              {busy ? "Submitting…" : "Submit event"}
            </button>
          </div>
        )}
      </section>
    </main>
  );
}
