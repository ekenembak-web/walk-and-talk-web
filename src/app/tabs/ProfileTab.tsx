import { useApp } from "../../state/store";
import { useAppShell } from "../AppProvider";
import { LANGUAGES } from "../../data/content";
import { avatarUri } from "../../lib/avatar";

export function ProfileTab() {
  const app = useApp();
  const shell = useAppShell();
  const pendingCount = shell.spotRequests.filter((r) => r.status === "pending").length;

  return (
    <>
      <div className="a-pad">
        <h1 className="a-page-title">Profile</h1>

        {app.signedIn ? (
          <div className="a-profile-head">
            <div className="a-profile-avatar" style={{ backgroundImage: `url(${avatarUri(app.userName || "Jordan Lee")})` }} />
            <div>
              <h3 className="a-profile-name">{app.userName || "Jordan Lee"}</h3>
              <p className="a-profile-meta">
                {shell.favorites.length} favorites · {Object.keys(shell.threads).length} conversations
              </p>
            </div>
          </div>
        ) : (
          <div className="a-guest-card">
            <h3 className="a-guest-title">You are browsing as a guest</h3>
            <p className="a-guest-text">
              Look around freely. An account is only needed to message a listener or apply to listen or host.
            </p>
            <button className="a-cta-full" onClick={shell.openAuthPrompt}>Sign up or log in</button>
          </div>
        )}

        <div className="a-menu">
          <button className="a-menu-row" onClick={() => shell.openSheet("listener")}>
            <span>Become a Listener</span>
            <span className="a-menu-chevron">›</span>
          </button>
          <button className="a-menu-row" onClick={() => shell.setTab("find")}>
            <span>Find a Listener</span>
            <span className="a-menu-chevron">›</span>
          </button>
          <button className="a-menu-row" onClick={() => shell.openSheet("host")}>
            <span>Become a Host</span>
            <span className="a-menu-chevron">›</span>
          </button>
          {app.signedIn && (
            <button className="a-menu-row" onClick={() => shell.openSheet("myActivity")}>
              <span>My Activity</span>
              <span className="a-menu-value">{pendingCount} ›</span>
            </button>
          )}
          <button className="a-menu-row" onClick={shell.toggleLangMenu}>
            <span>Language</span>
            <span className="a-menu-value">{app.language} ›</span>
          </button>
          {shell.langMenuOpen && (
            <div className="a-lang-box">
              {LANGUAGES.map((l) => (
                <button
                  key={l}
                  className="a-lang-option"
                  aria-selected={app.language === l}
                  onClick={() => { app.setLanguage(l); shell.toggleLangMenu(); }}
                >
                  {l}
                </button>
              ))}
            </div>
          )}
          <div className="a-menu-row" style={{ cursor: "default" }}>
            <span>Appearance</span>
            <span className="a-menu-value">{app.isDark ? "Dark" : "Light"}</span>
          </div>
          <div className="a-menu-row" style={{ cursor: "default" }}>
            <span>Help</span>
            <span className="a-menu-chevron">›</span>
          </div>
          <button className="a-menu-row" onClick={() => shell.openSheet("how")}>
            <span>How It Works</span>
            <span className="a-menu-chevron">›</span>
          </button>
          <button className="a-menu-row" onClick={() => shell.openSheet("about")}>
            <span>About</span>
            <span className="a-menu-chevron">›</span>
          </button>
          <button className="a-menu-row" onClick={() => shell.openSheet("safety")}>
            <span>Safety</span>
            <span className="a-menu-chevron">›</span>
          </button>
          <button className="a-menu-row" onClick={() => shell.openSheet("guidelines")}>
            <span>Community Guidelines</span>
            <span className="a-menu-chevron">›</span>
          </button>
          <button className="a-menu-row" onClick={() => shell.openSheet("privacy")}>
            <span>Privacy</span>
            <span className="a-menu-chevron">›</span>
          </button>
          {app.signedIn && (
            <button className="a-menu-row" onClick={shell.logOut}>
              <span className="a-menu-danger">Log out</span>
            </button>
          )}
        </div>
      </div>
      <div className="a-spacer" />
    </>
  );
}
