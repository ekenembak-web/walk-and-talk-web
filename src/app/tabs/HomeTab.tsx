import { useApp } from "../../state/store";
import { useAppShell } from "../AppProvider";
import { APP_LISTENERS, APP_ACTIVITIES } from "../data";
import { avatarUri } from "../../lib/avatar";

const FILTERS: { label: string; value: "all" | "listeners" | "hostings" }[] = [
  { label: "All", value: "all" },
  { label: "Listeners", value: "listeners" },
  { label: "Hostings", value: "hostings" },
];

export function HomeTab() {
  const app = useApp();
  const shell = useAppShell();

  const listenerCards = APP_LISTENERS.map((l) => ({
    key: `l-${l.id}`,
    name: l.name,
    sub: `${l.city} · ${l.format}`,
    img: avatarUri(l.name),
    isListener: true,
    id: l.id,
    onClick: () => shell.openProfile(l.id),
  }));
  const hostingCards = APP_ACTIVITIES.map((h) => ({
    key: `h-${h.id}`,
    name: h.name,
    sub: h.sub,
    img: `/${h.img}`,
    isListener: false,
    id: h.id,
    onClick: () => shell.openActivity(h.id),
  }));

  const feed =
    shell.homeFilter === "listeners"
      ? listenerCards
      : shell.homeFilter === "hostings"
        ? hostingCards
        : [...listenerCards, ...hostingCards];

  return (
    <>
      <div className="a-pad">
        <p className="a-greeting-eyebrow">Good to see you</p>
        <h1 className="a-greeting-title">
          {app.userName ? `Hi, ${app.userName} 👋` : "Welcome to Walk&Talk 👋"}
        </h1>

        <button className="a-search-pill" onClick={() => shell.setTab("find")}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
            <circle cx="11" cy="11" r="7" />
            <path d="M21 21l-4.35-4.35" />
          </svg>
          <span>Search listeners, topics…</span>
        </button>

        <div className="a-quick-row">
          <button className="a-quick-primary" onClick={() => shell.setTab("find")}>Find a Listener</button>
          <button className="a-quick-ghost" onClick={() => shell.openSheet("host")}>Become a Host</button>
          <button className="a-quick-ghost" onClick={() => shell.openSheet("listener")}>Become a Listener</button>
        </div>
      </div>

      <p className="a-section-heading">Browse</p>
      <div className="a-home-filter">
        {FILTERS.map((f) => (
          <button
            key={f.value}
            className="a-filter-btn"
            aria-pressed={shell.homeFilter === f.value}
            onClick={() => shell.setHomeFilter(f.value)}
          >
            {f.label}
          </button>
        ))}
      </div>

      <div className="a-grid-3">
        {feed.map((f) => (
          <div
            key={f.key}
            className="a-grid-card"
            role="button"
            tabIndex={0}
            onClick={f.onClick}
            onKeyDown={(e) => { if (e.key === "Enter") f.onClick(); }}
          >
            <div className="a-grid-img-wrap">
              <div className="a-grid-img" style={{ backgroundImage: `url(${f.img})` }} role="img" aria-label={f.name} />
              {f.isListener && (
                <button
                  className="a-grid-heart"
                  aria-label={shell.isFavorite(f.id) ? `Unfavorite ${f.name}` : `Favorite ${f.name}`}
                  onClick={(e) => { e.stopPropagation(); shell.toggleFavorite(f.id); }}
                >
                  {shell.isFavorite(f.id) ? "♥" : "♡"}
                </button>
              )}
            </div>
            <div className="a-grid-body">
              <h4 className="a-grid-name">{f.name}</h4>
              <p className="a-grid-sub">{f.sub}</p>
            </div>
          </div>
        ))}
      </div>
      <div className="a-spacer" />
    </>
  );
}
