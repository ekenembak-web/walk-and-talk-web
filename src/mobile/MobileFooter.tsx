import { useNavigate } from "react-router-dom";

export function MobileFooter() {
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
    <footer className="m-footer">
      <button className="m-logo" onClick={() => navigate("/find")} aria-label="Walk&Talk">
        <span className="m-logo-stack" aria-hidden="true">
          <span>W</span>
          <span className="amp">&amp;</span>
          <span>T</span>
        </span>
        <span className="m-logo-big" aria-hidden="true">ALK</span>
      </button>
      <p className="m-footer-tagline">Healing through human connection.</p>
      <div className="m-footer-cols">
        <div className="m-footer-col">
          <h5 className="m-footer-heading">Explore</h5>
          {explore.map((i) => (
            <button key={i.path} className="m-footer-link" onClick={() => navigate(i.path)}>{i.label}</button>
          ))}
        </div>
        <div className="m-footer-col">
          <h5 className="m-footer-heading">Trust</h5>
          {trust.map((i) => (
            <button key={i.path} className="m-footer-link" onClick={() => navigate(i.path)}>{i.label}</button>
          ))}
        </div>
      </div>
      <div className="m-footer-bottom" style={{ margin: "24px -20px -28px", paddingLeft: 20, paddingRight: 20 }}>
        © 2026 Walk&amp;Talk. Not a substitute for emergency services or licensed therapy.
      </div>
    </footer>
  );
}
