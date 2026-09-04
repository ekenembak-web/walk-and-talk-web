import { useApp } from "../state/store";
import { AppShellProvider, useAppShell, type Tab } from "./AppProvider";
import { HomeTab } from "./tabs/HomeTab";
import { FindTab } from "./tabs/FindTab";
import { MessagesTab } from "./tabs/MessagesTab";
import { FavoritesTab } from "./tabs/FavoritesTab";
import { ProfileTab } from "./tabs/ProfileTab";
import { ActivitySheet } from "./sheets/ActivitySheet";
import { ProfileSheet } from "./sheets/ProfileSheet";
import { MyActivitySheet } from "./sheets/MyActivitySheet";
import { HostSheet } from "./sheets/HostSheet";
import { ListenerSheet } from "./sheets/ListenerSheet";
import { InfoSheets } from "./sheets/InfoSheets";
import { AuthSheet } from "./sheets/AuthSheet";

const TAB_ICON: Record<Tab, React.ReactNode> = {
  home: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <path d="M3 11l9-7 9 7" />
      <path d="M5 10v9a1 1 0 001 1h4v-6h4v6h4a1 1 0 001-1v-9" />
    </svg>
  ),
  find: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <circle cx="11" cy="11" r="7" />
      <path d="M21 21l-4.35-4.35" />
    </svg>
  ),
  messages: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <path d="M21 15a2 2 0 01-2 2H8l-5 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
    </svg>
  ),
  favorites: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <path d="M20.8 8.6c0-3-2.4-5.1-5.2-5.1-1.9 0-3.4 1-4.1 2.4-.7-1.4-2.2-2.4-4.1-2.4-2.8 0-5.2 2.1-5.2 5.1 0 5.5 9.3 10.9 9.3 10.9s9.3-5.4 9.3-10.9z" />
    </svg>
  ),
  profile: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <circle cx="12" cy="8" r="4" />
      <path d="M4 20c0-4 3.6-6 8-6s8 2 8 6" />
    </svg>
  ),
};
const TABS: { id: Tab; label: string }[] = [
  { id: "home", label: "Home" },
  { id: "find", label: "Find" },
  { id: "messages", label: "Messages" },
  { id: "favorites", label: "Favorites" },
  { id: "profile", label: "Profile" },
];

function Frame() {
  const app = useApp();
  const shell = useAppShell();

  const tabView = {
    home: <HomeTab />,
    find: <FindTab />,
    messages: <MessagesTab />,
    favorites: <FavoritesTab />,
    profile: <ProfileTab />,
  }[shell.tab];

  return (
    <div className="a-shell">
      <div className="a-device">
        {shell.welcomeOpen && (
          <div className="a-welcome" role="dialog" aria-modal="true" aria-label="Welcome to Walk&Talk">
            <img src="/assets/welcome-dock-jump.jpg" alt="A group of friends jumping off a dock into a lake" />
            <div className="a-welcome-scrim" />
            <div className="a-welcome-top"><span>Welcome to Walk&amp;Talk</span></div>
            <div className="a-welcome-btns">
              <button className="a-welcome-btn" onClick={shell.welcomeBecome}>Become a Listener</button>
              <button className="a-welcome-btn a-welcome-btn--accent" onClick={shell.welcomeFind}>Find a Listener</button>
              <button className="a-welcome-btn" onClick={shell.welcomeHost}>Become a Host</button>
            </div>
          </div>
        )}

        <header className="a-header">
          <span className="a-logo" aria-label="Walk&Talk">
            <span className="a-logo-stack" aria-hidden="true">
              <span>W</span><span className="amp">&amp;</span><span>T</span>
            </span>
            <span className="a-logo-big" aria-hidden="true">ALK</span>
          </span>
          <button className="a-icon-btn" title="Toggle theme" onClick={app.toggleTheme}>
            {app.isDark ? "☀" : "☾"}
          </button>
        </header>

        <div
          className={`a-content ${shell.tab === "messages" && shell.activeThreadId != null ? "a-content--chat" : ""}`}
          key={shell.tab}
        >
          {tabView}
        </div>

        <nav
          className="a-tabbar"
          aria-label="Primary"
          hidden={shell.tab === "messages" && shell.activeThreadId != null}
        >
          {TABS.map((t) => (
            <button
              key={t.id}
              className="a-tab"
              aria-current={shell.tab === t.id ? "page" : undefined}
              onClick={() => shell.setTab(t.id)}
            >
              {TAB_ICON[t.id]}
              <span>{t.label}</span>
            </button>
          ))}
        </nav>

        {shell.toast && <div className="a-toast" role="status">{shell.toast}</div>}

        <ActivitySheet />
        <ProfileSheet />
        {shell.sheets.myActivity && <MyActivitySheet />}
        {shell.sheets.host && <HostSheet />}
        {shell.sheets.listener && <ListenerSheet />}
        <InfoSheets />
        <AuthSheet />
      </div>
    </div>
  );
}

/** Seeker native-style app: `/app`. Own tab + sheet navigation, own auth sheet. */
export function AppShell() {
  return (
    <AppShellProvider>
      <Frame />
    </AppShellProvider>
  );
}
