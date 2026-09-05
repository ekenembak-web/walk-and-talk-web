import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

/**
 * Floating jump-menu between the app's separate route trees.
 *
 * Stand-in for real role-based routing: the handoff's design is one login
 * that shows a seeker, listener, or moderator a screen set matching their
 * account's role(s). There is no backend/auth yet (see docs/BACKEND.md), so
 * today the three sides are just separate URLs with nothing linking them —
 * a listener account and a seeker account both land wherever you type.
 *
 * This switcher exists purely so a human reviewing the build doesn't have to
 * remember/retype every path. Delete this component (and its import in
 * App.tsx / main.tsx) once real login + role routing lands.
 */
const SURFACES = [
  { label: "Seeker · Web", path: "/" },
  { label: "Seeker · App", path: "/app" },
  { label: "Listener · Web", path: "/listener" },
  { label: "Listener · App", path: "/listener/app" },
  { label: "Moderator", path: "/moderator" },
] as const;

function activeSurface(pathname: string): string {
  // Longest-prefix match so "/listener/app" wins over "/listener", etc.
  const byLength = [...SURFACES].sort((a, b) => b.path.length - a.path.length);
  const hit = byLength.find((s) => (s.path === "/" ? pathname === "/" : pathname.startsWith(s.path)));
  return hit?.path ?? "/";
}

export function DevSwitcher() {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const current = activeSurface(location.pathname);

  return (
    <div className="dev-switcher">
      {open && (
        <div className="dev-switcher-panel" role="menu" aria-label="Jump to surface">
          <p className="dev-switcher-label">Dev · jump to surface</p>
          {SURFACES.map((s) => (
            <button
              key={s.path}
              className="dev-switcher-link"
              role="menuitem"
              aria-current={current === s.path}
              onClick={() => { navigate(s.path); setOpen(false); }}
            >
              {s.label}
            </button>
          ))}
          <p className="dev-switcher-note">
            Stand-in for real login/role routing — remove once that exists.
          </p>
        </div>
      )}
      <button
        className="dev-switcher-toggle"
        aria-expanded={open}
        aria-label={open ? "Close surface switcher" : "Open surface switcher"}
        onClick={() => setOpen((v) => !v)}
      >
        {open ? "✕" : "⇄"}
      </button>
    </div>
  );
}
