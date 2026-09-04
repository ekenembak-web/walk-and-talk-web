import { useState } from "react";
import { Sheet } from "../Sheet";
import { useAppShell } from "../AppProvider";
import { APP_ACTIVITIES } from "../data";

type Field = "schedule" | "location" | "groupSize" | "cost";
const FIELDS: { key: Field; label: string }[] = [
  { key: "schedule", label: "Schedule" },
  { key: "location", label: "Location" },
  { key: "groupSize", label: "Group size" },
  { key: "cost", label: "Cost" },
];

export function MyActivitySheet() {
  const shell = useAppShell();
  const base = APP_ACTIVITIES.find((a) => a.id === "cycling")!;
  const current = { ...base, ...shell.activityOverride };
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState<Record<Field, string>>({
    schedule: current.schedule,
    location: current.location,
    groupSize: current.groupSize,
    cost: current.cost,
  });

  const startEdit = () => {
    if (editing) {
      setEditing(false);
      return;
    }
    setDraft({ schedule: current.schedule, location: current.location, groupSize: current.groupSize, cost: current.cost });
    setEditing(true);
  };
  const save = () => {
    shell.saveActivityOverride(draft);
    setEditing(false);
  };

  return (
    <Sheet onClose={() => shell.closeSheet("myActivity")} variant="tall" labelledBy="myact-title">
      <div className="a-myact-head">
        <h3 className="a-sheet-title" id="myact-title">{current.name}</h3>
        <button className="a-myact-edit" onClick={startEdit}>{editing ? "Cancel" : "Edit"}</button>
      </div>
      <p className="a-sheet-sub">{current.sub}</p>

      {editing ? (
        <>
          <div className="a-card">
            {FIELDS.map((f, i) => (
              <div className="a-fact-row" key={f.key} style={i === FIELDS.length - 1 ? { borderBottom: "none" } : undefined}>
                <span className="a-fact-key">{f.label}</span>
                <input className="a-edit-input" value={draft[f.key]} onChange={(e) => setDraft({ ...draft, [f.key]: e.target.value })} />
              </div>
            ))}
          </div>
          <button className="a-cta-full" onClick={save}>Save changes</button>
        </>
      ) : (
        <div className="a-card">
          {FIELDS.map((f) => (
            <div className="a-fact-row" key={f.key}>
              <span className="a-fact-key">{f.label}</span>
              <span className="a-fact-val">{current[f.key]}</span>
            </div>
          ))}
        </div>
      )}

      <p className="a-section-label">Spot requests</p>
      {shell.spotRequests.map((r) => (
        <div className="a-req-row" key={r.id}>
          <div className="a-req-text">
            <p className="a-req-name">{r.name}</p>
            <p className="a-req-note">{r.note}</p>
          </div>
          {r.status === "pending" ? (
            <div className="a-req-actions">
              <button className="a-small-ghost" onClick={() => shell.setRequestStatus(r.id, "declined")}>Decline</button>
              <button className="a-small-primary" onClick={() => shell.setRequestStatus(r.id, "approved")}>Approve</button>
            </div>
          ) : (
            <span className={`a-req-status a-req-status--${r.status}`}>
              {r.status === "approved" ? "Approved" : "Declined"}
            </span>
          )}
        </div>
      ))}
    </Sheet>
  );
}
