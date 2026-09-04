import { useNavigate } from "react-router-dom";
import { Logo } from "./Logo";

export function Footer() {
  const navigate = useNavigate();
  const explore = [
    { label: "Find a Listener", path: "/find" },
    { label: "Become a Listener", path: "/become" },
    { label: "About", path: "/about" },
  ];
  const trust = [
    { label: "Safety", path: "/safety" },
    { label: "Community Guidelines", path: "/guidelines" },
    { label: "Privacy", path: "/privacy" },
  ];
  return (
    <footer className="footer">
      <div className="footer-inner">
        <div>
          <Logo />
          <p className="footer-tagline">Healing through human connection.</p>
        </div>
        <div className="footer-col">
          <h5 className="footer-heading">Explore</h5>
          {explore.map((i) => (
            <button key={i.path} className="footer-link" onClick={() => navigate(i.path)}>
              {i.label}
            </button>
          ))}
        </div>
        <div className="footer-col">
          <h5 className="footer-heading">Trust</h5>
          {trust.map((i) => (
            <button key={i.path} className="footer-link" onClick={() => navigate(i.path)}>
              {i.label}
            </button>
          ))}
        </div>
      </div>
      <div className="footer-bottom">
        <span>© 2026 Walk&amp;Talk. Not a substitute for emergency services or licensed therapy.</span>
      </div>
    </footer>
  );
}
