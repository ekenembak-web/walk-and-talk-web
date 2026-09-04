import { useNavigate } from "react-router-dom";
import { useApp } from "../state/store";

/**
 * Mobile home is the welcome screen itself — not a dismissable overlay.
 * "Find a Listener" lands on Explore (where #get-involved lives).
 */
export function MobileHome() {
  const app = useApp();
  const navigate = useNavigate();
  const choose = (path: string) => app.gateBrowse(() => navigate(path));

  return (
    <main data-screen-label="Home">
      <div className="m-welcome-topbar">
        <span className="m-welcome-title">Welcome to Walk&amp;Talk</span>
      </div>
      <div className="m-welcome-photo-wrap">
        <img className="m-welcome-photo" src="/assets/welcome-dock-jump.jpg" alt="A group of friends jumping off a dock into a lake" />
        <div className="m-welcome-scrim" />
        <div className="m-welcome-btns">
          <button className="m-welcome-btn" onClick={() => choose("/become")}>Become a Listener</button>
          <button className="m-welcome-btn m-welcome-btn--accent" onClick={() => choose("/explore")}>Find a Listener</button>
          <button className="m-welcome-btn" onClick={() => choose("/host")}>Become a Host</button>
        </div>
      </div>
    </main>
  );
}
