import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useApp } from "../state/store";
import { useIsMobile } from "../lib/useIsMobile";
import { ListenerProvider, useListener, type ListenerTab } from "./ListenerProvider";
import { ListenerModals } from "./ListenerModals";
import { PendingScreen } from "./screens/PendingScreen";
import { RequestsScreen } from "./screens/RequestsScreen";
import { ConversationsScreen } from "./screens/ConversationsScreen";
import { PeersScreen } from "./screens/PeersScreen";
import { YouScreen } from "./screens/YouScreen";

const NAV: { id: ListenerTab; label: string }[] = [
  { id: "requests", label: "Requests" },
  { id: "chats", label: "Conversations" },
  { id: "peer", label: "Peers" },
  { id: "you", label: "You" },
];

function Logo() {
  return (
    <span className="l-logo" aria-label="Walk&Talk Listener">
      <span className="w">Walk</span>
      <span className="amp">&amp;</span>
      <span className="t">Talk</span>
      <span className="role">Listener</span>
    </span>
  );
}

function ScreenFor({ tab, convLayout }: { tab: ListenerTab; convLayout: "split" | "full" }) {
  if (tab === "requests") return <RequestsScreen showCapBar={convLayout === "full"} />;
  if (tab === "chats") return <ConversationsScreen layout={convLayout} />;
  if (tab === "peer") return <PeersScreen />;
  return <YouScreen />;
}

function WebFrame() {
  const app = useApp();
  const l = useListener();
  const mobile = useIsMobile();
  const [drawer, setDrawer] = useState(false);
  const convLayout: "split" | "full" = mobile ? "full" : "split";

  if (l.status === "pending") {
    return (
      <div className={`l-shell ${mobile ? "l-mobile" : "l-web"}`}>
        {mobile ? (
          <header className="l-mheader">
            <Logo />
            <button className="l-icon-btn" onClick={app.toggleTheme}>{app.isDark ? "☀" : "☾"}</button>
          </header>
        ) : (
          <div className="l-nav">
            <div className="l-nav-inner">
              <Logo />
              <button className="l-icon-btn" onClick={app.toggleTheme}>{app.isDark ? "☀" : "☾"}</button>
            </div>
          </div>
        )}
        <PendingScreen />
        <ListenerModals />
      </div>
    );
  }

  const badge = (n: number) => (n > 0 ? <span className="l-badge">{n}</span> : null);

  return (
    <div className={`l-shell ${mobile ? "l-mobile" : "l-web"}`}>
      {mobile ? (
        <>
          <header className="l-mheader">
            <Logo />
            <div className="l-mheader-right">
              <button className="l-icon-btn" onClick={app.toggleTheme}>{app.isDark ? "☀" : "☾"}</button>
              <button className="l-icon-btn" aria-label="Menu" aria-expanded={drawer} onClick={() => setDrawer((v) => !v)}>
                {drawer ? "✕" : "☰"}
              </button>
            </div>
          </header>
          {drawer && (
            <nav className="l-drawer" aria-label="Sections">
              {NAV.map((n) => (
                <button
                  key={n.id}
                  className="l-drawer-link"
                  aria-current={l.tab === n.id ? "page" : undefined}
                  onClick={() => { l.setTab(n.id); setDrawer(false); }}
                >
                  <span>{n.label}</span>
                  {n.id === "requests" && badge(l.openRequests.length)}
                  {n.id === "chats" && badge(l.unreadTotal)}
                </button>
              ))}
            </nav>
          )}
        </>
      ) : (
        <div className="l-nav">
          <div className="l-nav-inner">
            <Logo />
            <nav className="l-nav-links" aria-label="Sections">
              {NAV.map((n) => (
                <button
                  key={n.id}
                  className="l-nav-link"
                  aria-current={l.tab === n.id ? "page" : undefined}
                  onClick={() => l.setTab(n.id)}
                >
                  {n.label}
                  {n.id === "requests" && badge(l.openRequests.length)}
                  {n.id === "chats" && badge(l.unreadTotal)}
                </button>
              ))}
            </nav>
            <div className="l-nav-right">
              <button className="l-pause-chip" data-paused={l.paused} onClick={l.togglePaused}>
                {l.paused ? "Paused" : "Accepting"}
              </button>
              <button className="l-icon-btn" onClick={app.toggleTheme}>{app.isDark ? "☀" : "☾"}</button>
            </div>
          </div>
        </div>
      )}

      <ScreenFor tab={l.tab} convLayout={convLayout} />
      <ListenerModals />
    </div>
  );
}

/** Listener web + mobile web — one responsive shell, `/listener`. */
export function ListenerWebShell() {
  const [params] = useSearchParams();
  const status = params.get("status") === "pending" ? "pending" : "approved";
  return (
    <ListenerProvider status={status}>
      <WebFrame />
    </ListenerProvider>
  );
}
