import { useSearchParams } from "react-router-dom";
import { useApp } from "../state/store";
import { ListenerProvider, useListener, type ListenerTab } from "./ListenerProvider";
import { ListenerModals } from "./ListenerModals";
import { PendingScreen } from "./screens/PendingScreen";
import { RequestsScreen } from "./screens/RequestsScreen";
import { ConversationsScreen } from "./screens/ConversationsScreen";
import { PeersScreen } from "./screens/PeersScreen";
import { YouScreen } from "./screens/YouScreen";

const TAB_ICON: Record<ListenerTab, React.ReactNode> = {
  requests: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <path d="M4 4h16v12H7l-3 3z" />
    </svg>
  ),
  chats: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <path d="M21 15a2 2 0 01-2 2H8l-5 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
    </svg>
  ),
  peer: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <circle cx="9" cy="8" r="3.5" />
      <circle cx="17" cy="10" r="3" />
      <path d="M3.5 20c0-3.3 2.5-5.5 5.5-5.5s5.5 2.2 5.5 5.5M15 20c0-2.4 1.4-4 3-4s3 1.6 3 4" />
    </svg>
  ),
  you: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <circle cx="12" cy="8" r="4" />
      <path d="M4 20c0-4 3.6-6 8-6s8 2 8 6" />
    </svg>
  ),
};
const TABS: { id: ListenerTab; label: string }[] = [
  { id: "requests", label: "Requests" },
  { id: "chats", label: "Chats" },
  { id: "peer", label: "Peers" },
  { id: "you", label: "You" },
];

function AppFrame() {
  const app = useApp();
  const l = useListener();
  const inChat = l.tab === "chats" && l.activeChat != null;

  const screen =
    l.tab === "requests" ? <RequestsScreen showCapBar /> :
    l.tab === "chats" ? <ConversationsScreen layout="full" /> :
    l.tab === "peer" ? <PeersScreen /> :
    <YouScreen />;

  return (
    <div className="l-shell l-app">
      <div className="l-device">
        {l.status === "pending" ? (
          <>
            <header className="l-app-header">
              <span className="l-logo"><span className="w">Walk</span><span className="amp">&amp;</span><span className="t">Talk</span><span className="role">Listener</span></span>
              <button className="l-icon-btn" onClick={app.toggleTheme}>{app.isDark ? "☀" : "☾"}</button>
            </header>
            <div className="l-app-scroll"><PendingScreen /></div>
          </>
        ) : (
          <>
            <header className="l-app-header">
              <span className="l-logo"><span className="w">Walk</span><span className="amp">&amp;</span><span className="t">Talk</span><span className="role">Listener</span></span>
              <button className="l-icon-btn" onClick={app.toggleTheme}>{app.isDark ? "☀" : "☾"}</button>
            </header>
            <div className={`l-app-scroll ${inChat ? "l-app-scroll--chat" : ""}`} key={l.tab}>
              {screen}
            </div>
            <nav className="l-tabbar" aria-label="Sections" hidden={inChat}>
              {TABS.map((t) => {
                const n =
                  t.id === "requests" ? l.openRequests.length :
                  t.id === "chats" ? l.unreadTotal : 0;
                return (
                  <button
                    key={t.id}
                    className="l-tab"
                    aria-current={l.tab === t.id ? "page" : undefined}
                    onClick={() => l.setTab(t.id)}
                  >
                    {TAB_ICON[t.id]}
                    <span>{t.label}</span>
                    {n > 0 && <span className="l-tab-badge">{n}</span>}
                  </button>
                );
              })}
            </nav>
          </>
        )}
        <ListenerModals />
      </div>
    </div>
  );
}

/** Listener native-style app — 4-tab bottom bar, `/listener/app`. */
export function ListenerAppShell() {
  const [params] = useSearchParams();
  const status = params.get("status") === "pending" ? "pending" : "approved";
  return (
    <ListenerProvider status={status}>
      <AppFrame />
    </ListenerProvider>
  );
}
