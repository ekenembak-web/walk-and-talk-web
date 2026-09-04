import { Sheet } from "../Sheet";
import { useAppShell } from "../AppProvider";
import { findPerson } from "../data";
import { avatarUri } from "../../lib/avatar";

export function ProfileSheet() {
  const shell = useAppShell();
  if (!shell.profileId) return null;
  const person = findPerson(shell.profileId);
  if (!person) return null;

  return (
    <Sheet onClose={shell.closeProfile} variant="tall" labelledBy="profilesheet-title">
      <div className="a-psheet-head">
        <div className="a-psheet-avatar" style={{ backgroundImage: `url(${avatarUri(person.name)})` }} role="img" aria-label={person.name} />
        <div style={{ minWidth: 0 }}>
          <h3 className="a-psheet-name" id="profilesheet-title">{person.name}</h3>
          <p className="a-psheet-meta">★ {person.rating} · {person.city}</p>
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        <p className="a-psheet-bio">{person.bio}</p>
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          <p className="a-psheet-label">Format</p>
          <p className="a-psheet-meta">{person.format}</p>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          <p className="a-psheet-label">Topics</p>
          <div className="a-chip-wrap">
            {person.topics.map((t) => (
              <span key={t} className="a-chip" aria-pressed={false} style={{ cursor: "default" }}>{t}</span>
            ))}
          </div>
        </div>
        <button className="a-cta-full" onClick={shell.messageFromProfile}>Message {person.name}</button>
      </div>
    </Sheet>
  );
}
