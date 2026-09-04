import { useAppShell } from "../AppProvider";
import { APP_LISTENERS, APP_TOPICS, APP_FORMATS } from "../data";
import { avatarUri } from "../../lib/avatar";

const TOPIC_OPTIONS = ["All", ...APP_TOPICS];

export function FindTab() {
  const shell = useAppShell();

  const listeners = APP_LISTENERS.filter((l) => {
    const topicOk = shell.findTopic === "All" || l.topics.includes(shell.findTopic);
    const formatOk = shell.findFormat === "Any" || l.format === shell.findFormat;
    return topicOk && formatOk;
  });

  return (
    <>
      <div className="a-pad">
        <h1 className="a-page-title">Find a Listener</h1>
        <div className="a-chip-scroll">
          {TOPIC_OPTIONS.map((t) => (
            <button key={t} className="a-chip" aria-pressed={shell.findTopic === t} onClick={() => shell.setFindTopic(t)}>
              {t}
            </button>
          ))}
        </div>
        <div className="a-chip-scroll">
          {APP_FORMATS.map((f) => (
            <button key={f} className="a-chip" aria-pressed={shell.findFormat === f} onClick={() => shell.setFindFormat(f)}>
              {f}
            </button>
          ))}
        </div>
      </div>

      <div className="a-listener-col">
        {listeners.map((l) => (
          <div className="a-listener-card" key={l.id}>
            <div
              className="a-listener-photo"
              role="img"
              aria-label={l.name}
              style={{ backgroundImage: `url(${avatarUri(l.name)})` }}
            />
            <div className="a-listener-body">
              <div className="a-listener-name-row">
                <h4 className="a-listener-name">{l.name}</h4>
                <button
                  className="a-heart-btn"
                  aria-label={shell.isFavorite(l.id) ? `Unfavorite ${l.name}` : `Favorite ${l.name}`}
                  onClick={() => shell.toggleFavorite(l.id)}
                >
                  {shell.isFavorite(l.id) ? "♥" : "♡"}
                </button>
              </div>
              <p className="a-listener-meta">{l.city} · {l.format} · ★ {l.rating}</p>
              <p className="a-listener-bio">{l.bio}</p>
              <button className="a-cta-full" onClick={() => shell.openThread(l.id)}>Message</button>
            </div>
          </div>
        ))}
        {listeners.length === 0 && (
          <p className="a-empty-text" style={{ padding: "24px 0", textAlign: "center" }}>
            No listeners match those filters yet — try widening your search.
          </p>
        )}
      </div>
      <div className="a-spacer" />
    </>
  );
}
