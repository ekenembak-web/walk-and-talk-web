import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useApp } from "../state/store";
import { LANGUAGES } from "../data/content";
import { avatarUri } from "../lib/avatar";
import { Logo } from "./Logo";
import { GlobeIcon } from "./icons";
import { scrollToGetInvolved } from "../desktop/scrollToGetInvolved";

interface NavItem {
  label: string;
  path: string;
  badge?: number;
  account?: boolean; // requires an account (gateAccount)
}

const NAV: NavItem[] = [
  { label: "Find a Listener", path: "/find" },
  { label: "Become a Listener", path: "/become" },
  { label: "Become a Host", path: "/host" },
  { label: "Messages", path: "/messages", account: true },
];

export function Header() {
  const app = useApp();
  const navigate = useNavigate();
  const location = useLocation();
  const [navOpen, setNavOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const rightRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onDoc = (e: MouseEvent) => {
      if (rightRef.current && !rightRef.current.contains(e.target as Node)) {
        setLangOpen(false);
        setProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  useEffect(() => setNavOpen(false), [location.pathname]);

  const goNav = (item: NavItem) => {
    const run = () => navigate(item.path);
    if (item.account) app.requireAccount(run);
    else app.gateBrowse(run);
  };

  const getStarted = () => {
    app.gateBrowse(() => {
      if (location.pathname === "/") setTimeout(() => scrollToGetInvolved(), 30);
      else {
        navigate("/");
        setTimeout(() => scrollToGetInvolved(), 60);
      }
    });
  };

  const NavLinks = ({ mobile = false }: { mobile?: boolean }) =>
    NAV.map((item) => {
      const active = location.pathname === item.path;
      const badge = item.label === "Messages" && app.unreadCount > 0 ? app.unreadCount : undefined;
      return (
        <button
          key={item.path}
          className={mobile ? "mobile-link" : "nav-link"}
          aria-current={active ? "page" : undefined}
          onClick={() => goNav(item)}
        >
          {item.label}
          {badge != null && <span className="nav-badge">{badge}</span>}
        </button>
      );
    });

  return (
    <header className="nav">
      {navOpen && (
        <div className="mobile-menu">
          <NavLinks mobile />
          {!app.signedIn && (
            <button className="mobile-link" onClick={() => { setNavOpen(false); app.openAuth("signup"); }}>
              Sign up
            </button>
          )}
        </div>
      )}
      <div className="nav-inner">
        <button className="logo-row" onClick={() => navigate("/")} aria-label="Walk&Talk home">
          <Logo />
        </button>

        <nav className="nav-links" aria-label="Primary">
          <NavLinks />
        </nav>

        <div className="nav-right" ref={rightRef}>
          <div className="lang-wrap">
            <button
              className="icon-btn"
              title="Change language"
              aria-haspopup="true"
              aria-expanded={langOpen}
              onClick={() => { setLangOpen((v) => !v); setProfileOpen(false); }}
            >
              <GlobeIcon />
            </button>
            {langOpen && (
              <div className="lang-menu" role="menu">
                {LANGUAGES.map((l) => (
                  <button
                    key={l}
                    className="lang-option"
                    role="menuitemradio"
                    aria-selected={app.language === l}
                    onClick={() => { app.setLanguage(l); setLangOpen(false); }}
                  >
                    {l}
                  </button>
                ))}
              </div>
            )}
          </div>

          <button className="icon-btn" title="Toggle theme" onClick={app.toggleTheme}>
            {app.isDark ? "☀" : "☾"}
          </button>

          {app.signedIn ? (
            <div className="profile-wrap">
              <button
                className="profile-avatar-btn"
                aria-label="Account menu"
                aria-haspopup="true"
                aria-expanded={profileOpen}
                style={{ backgroundImage: `url(${avatarUri(app.userName || "Jordan Lee")})` }}
                onClick={() => { setProfileOpen((v) => !v); setLangOpen(false); }}
              />
              {profileOpen && (
                <div className="profile-menu" role="menu">
                  <div className="profile-menu-head">
                    <p className="profile-menu-name">{app.userName || "Jordan Lee"}</p>
                    <p className="profile-menu-email">{app.userEmail}</p>
                  </div>
                  <button className="profile-menu-item" role="menuitem" onClick={() => { setProfileOpen(false); navigate("/host"); }}>
                    My Activity
                  </button>
                  <button className="profile-menu-item" role="menuitem" onClick={() => { setProfileOpen(false); navigate("/messages"); }}>
                    Messages
                  </button>
                  <button className="profile-menu-item profile-menu-item--danger" role="menuitem" onClick={() => { setProfileOpen(false); app.logOut(); }}>
                    Log out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button className="btn btn--primary-sm" onClick={getStarted}>
              Get Started
            </button>
          )}

          <button className="icon-btn hamburger" aria-label="Menu" aria-expanded={navOpen} onClick={() => setNavOpen((v) => !v)}>
            ☰
          </button>
        </div>
      </div>
    </header>
  );
}

export { scrollToGetInvolved };
