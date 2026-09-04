import { useNavigate } from "react-router-dom";
import { useApp } from "../state/store";

/**
 * Full-screen first-visit overlay. Three choices, listener-signup first
 * (deliberate order). Each dismisses the overlay and lands on its page.
 * Dismissal is persisted so returning visitors skip it.
 */
export function WelcomeOverlay() {
  const app = useApp();
  const navigate = useNavigate();
  if (!app.welcomeOpen) return null;

  const choose = (path: string) => {
    app.dismissWelcome();
    app.gateBrowse(() => navigate(path));
  };

  return (
    <div className="welcome" role="dialog" aria-modal="true" aria-label="Welcome to Walk&Talk">
      <img className="welcome-bg" src="/assets/welcome-dock-jump.jpg" alt="A group of friends jumping off a dock into a lake" />
      <div className="welcome-scrim" />
      <div className="welcome-top">
        <span>Welcome to Walk&amp;Talk</span>
      </div>
      <div className="welcome-choices">
        <button className="welcome-btn" onClick={() => choose("/become")}>
          Become a Listener
        </button>
        <button className="welcome-btn welcome-btn--accent" onClick={() => choose("/find")}>
          Find a Listener
        </button>
        <button className="welcome-btn" onClick={() => choose("/host")}>
          Become a Host
        </button>
      </div>
    </div>
  );
}
