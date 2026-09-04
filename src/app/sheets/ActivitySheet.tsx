import { Sheet } from "../Sheet";
import { useAppShell } from "../AppProvider";
import { APP_ACTIVITIES, findPerson } from "../data";
import { avatarUri } from "../../lib/avatar";

export function ActivitySheet() {
  const shell = useAppShell();
  if (!shell.activityId) return null;
  const activity = APP_ACTIVITIES.find((a) => a.id === shell.activityId);
  if (!activity) return null;
  const host = findPerson(activity.hostId);

  return (
    <Sheet onClose={shell.closeActivity} labelledBy="activity-title">
      <div className="a-activity-img" style={{ backgroundImage: `url(/${activity.img})` }} role="img" aria-label={activity.name} />
      <h3 className="a-sheet-title" id="activity-title">{activity.name}</h3>
      <p className="a-sheet-sub">{activity.sub}</p>

      {host && (
        <button
          className="a-activity-host-card"
          onClick={() => {
            shell.closeActivity();
            setTimeout(() => shell.openProfile(host.id), 0);
          }}
        >
          <div className="a-activity-host-avatar" style={{ backgroundImage: `url(${avatarUri(host.name)})` }} />
          <div style={{ minWidth: 0, display: "flex", flexDirection: "column", gap: 4 }}>
            <div>
              <h4 className="a-activity-host-name">{host.name}</h4>
              <p className="a-activity-host-meta">
                Host · ★ {host.rating} · {host.city} · {host.eventsHosted}
              </p>
            </div>
            <p className="a-activity-host-bio">{host.bio}</p>
          </div>
          <span className="a-menu-chevron">›</span>
        </button>
      )}

      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {([
          ["Participants", activity.groupSize],
          ["When", activity.schedule],
          ["Where", activity.location],
          ["Cost", activity.cost],
        ] as const).map(([label, value]) => (
          <div className="a-fact" key={label}>
            <span className="a-fact-label">{label}</span>
            <span className="a-fact-value">{value}</span>
          </div>
        ))}
        <div className="a-fact">
          <span className="a-fact-label">Requirements</span>
          <ul className="a-fact-list">
            {activity.requirements.map((r) => (
              <li key={r}>{r}</li>
            ))}
          </ul>
        </div>
        <div className="a-fact">
          <span className="a-fact-label">What to bring</span>
          <span className="a-fact-value">{activity.bring}</span>
        </div>
      </div>

      <button className="a-cta-full" onClick={shell.requestSpot}>Request a spot</button>
    </Sheet>
  );
}
