import { useAppShell } from "../AppProvider";
import { APP_LISTENERS } from "../data";
import { avatarUri } from "../../lib/avatar";

export function FavoritesTab() {
  const shell = useAppShell();
  const favs = APP_LISTENERS.filter((l) => shell.favorites.includes(l.id));

  return (
    <>
      <div className="a-pad">
        <h1 className="a-page-title">Favorites</h1>
      </div>

      {favs.length > 0 ? (
        <div className="a-listener-col">
          {favs.map((l) => (
            <div className="a-listener-card" key={l.id}>
              <div className="a-listener-photo" role="img" aria-label={l.name} style={{ backgroundImage: `url(${avatarUri(l.name)})` }} />
              <div className="a-listener-body">
                <div className="a-listener-name-row">
                  <h4 className="a-listener-name">{l.name}</h4>
                  <button className="a-heart-btn" aria-label={`Unfavorite ${l.name}`} onClick={() => shell.toggleFavorite(l.id)}>♥</button>
                </div>
                <p className="a-listener-meta">{l.city} · {l.format} · ★ {l.rating}</p>
                <button className="a-cta-full" onClick={() => shell.openThread(l.id)}>Message</button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="a-empty">
          <div className="a-empty-heart">♡</div>
          <p className="a-empty-text">No favorites yet — tap the heart on a listener to save them here.</p>
          <button className="a-quick-primary" onClick={() => shell.setTab("find")}>Find a Listener</button>
        </div>
      )}
      <div className="a-spacer" />
    </>
  );
}
