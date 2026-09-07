import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useApp } from "../state/store";
import { LANGUAGES } from "../data/content";
import { GlobeIcon } from "../components/icons";
import { scrollToGetInvolved } from "./scrollToGetInvolved";

interface Item {
  label: string;
  path: string;
  account?: boolean;
  browse?: boolean;
}

const ITEMS: Item[] = [
  { label: "Become a Listener", path: "/become", browse: true },
  { label: "Find a Listener", path: "/find", browse: true },
  { label: "Become a Host", path: "/host", browse: true },
  { label: "Explore", path: "/explore", browse: true },
  { label: "Messages", path: "/messages", account: true },
  { label: "How it works", path: "/howitworks" },
  { label: "About", path: "/about" },
  { label: "Safety", path: "/safety" },
  { label: "Privacy", path: "/privacy" },
  { label: "Community Guidelines", path: "/guidelines" },
];

export function MobileHeader() {
  const app = useApp();
  const navigate = useNavigate();
  const location = useLocation();
  const [drawer, setDrawer] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const rightRef = useRef<HTMLDivElement>(null);

  useEffect(() => setDrawer(false), [location.pathname]);
  useEffect(() => {
    const onDoc = (e: MouseEvent) => {
      if (rightRef.current && !rightRef.current.contains(e.target as Node)) setLangOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  const go = (item: Item) => {
    const run = () => navigate(item.path);
    if (item.account) app.requireAccount(run);
    else if (item.browse) app.gateBrowse(run);
    else run();
  };

  const getStarted = () => {
    setDrawer(false);
    app.gateBrowse(() => {
      if (location.pathname === "/explore") setTimeout(() => scrollToGetInvolved(), 30);
      else {
        navigate("/explore");
        setTimeout(() => scrollToGetInvolved(), 60);
      }
    });
  };

  return (
    <header className="m-nav">
      <div className="m-nav-inner">
        <button className="m-logo" onClick={() => navigate("/find")} aria-label="Walk&Talk — find a listener">
          <span className="m-logo-stack" aria-hidden="true">
            <span>W</span>
            <span className="amp">&amp;</span>
            <span>T</span>
          </span>
          <span className="m-logo-big" aria-hidden="true">ALK</span>
        </button>

        <div className="m-nav-right" ref={rightRef}>
          <div className="m-lang-wrap">
            <button className="m-icon-btn" title="Change language" aria-expanded={langOpen} onClick={() => setLangOpen((v) => !v)}>
              <GlobeIcon />
            </button>
            {langOpen && (
              <div className="m-lang-menu" role="menu">
                {LANGUAGES.map((l) => (
                  <button key={l} className="m-lang-option" role="menuitemradio" aria-selected={app.language === l}
                    onClick={() => { app.setLanguage(l); setLangOpen(false); }}>
                    {l}
                  </button>
                ))}
              </div>
            )}
          </div>
          <button className="m-icon-btn" title="Toggle theme" onClick={app.toggleTheme}>
            {app.isDark ? "☀" : "☾"}
          </button>
          <div className="m-hamburger-wrap">
            <button className="m-icon-btn" aria-label="Menu" aria-expanded={drawer} onClick={() => setDrawer((v) => !v)}>
              {drawer ? "✕" : "☰"}
            </button>
            {app.unreadCount > 0 && !drawer && <span className="m-hamburger-badge">{app.unreadCount}</span>}
          </div>
        </div>
      </div>

      {drawer && (
        <nav className="m-drawer" aria-label="Menu">
          {ITEMS.map((item) => {
            const badge = item.label === "Messages" && app.unreadCount > 0 ? app.unreadCount : undefined;
            return (
              <button key={item.path} className="m-drawer-link" onClick={() => go(item)}>
                {item.label}
                {badge != null && <span className="m-hamburger-badge" style={{ position: "static" }}>{badge}</span>}
              </button>
            );
          })}
          {app.signedIn ? (
            <button
              className="m-btn m-btn--primary m-btn--block"
              onClick={() => { setDrawer(false); app.logOut(); navigate("/"); }}
            >
              Log out
            </button>
          ) : (
            <button className="m-btn m-btn--primary m-btn--block" onClick={getStarted}>
              Get Started
            </button>
          )}
        </nav>
      )}
    </header>
  );
}
