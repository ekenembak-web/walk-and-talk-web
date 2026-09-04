import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useApp } from "../state/store";
import { STEPS } from "../data/content";
import { TOPICS } from "../lib/types";
import { COMMUNITY_MEMBERS } from "../data/people";
import { avatarUri } from "../lib/avatar";
import { ConnectIcon, HostIcon, ListenIcon } from "../components/icons";
import { scrollToGetInvolved } from "./scrollToGetInvolved";

export function ExplorePage() {
  const app = useApp();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (location.hash === "#get-involved") setTimeout(() => scrollToGetInvolved(), 30);
  }, [location.hash]);

  const getStarted = () => app.gateBrowse(() => setTimeout(() => scrollToGetInvolved(), 30));

  return (
    <main data-screen-label="Explore">
      {/* Community — display only */}
      <section className="m-section">
        <div className="m-head">
          <h2 className="m-title">Meet Our Community</h2>
          <p className="m-sub">Listeners and hosts ready to connect.</p>
        </div>
        <div className="m-person-grid m-person-grid--static">
          {COMMUNITY_MEMBERS.map((m) => (
            <div className="m-person-card" key={m.name}>
              <div className="m-person-photo-wrap">
                <div
                  className="m-person-photo"
                  role="img"
                  aria-label={m.name}
                  draggable={false}
                  style={{ backgroundImage: `url(${avatarUri(m.name.split(",")[0])})` }}
                />
                <div className="m-person-photo-overlay" />
              </div>
              <div className="m-person-body">
                <h4 className="m-person-name">{m.name}</h4>
                <span className={`m-person-badge ${m.role === "Host" ? "m-person-badge--host" : "m-person-badge--listener"}`}>
                  {m.role}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Get involved */}
      <section className="m-become-banner">
        <div id="get-involved" className="m-become-anchor" />
        <div className="m-become-bg" />
        <div className="m-become-overlay" />
        <div className="m-become-head">
          <h2 className="m-become-title">Become a Listener</h2>
          <p className="m-become-sub">Three simple ways to get involved.</p>
        </div>
        <div className="m-become-cards">
          <div className="m-become-card">
            <div className="m-become-icon m-become-icon--listen"><ListenIcon /></div>
            <h3 className="m-become-card-title">Listen</h3>
            <p className="m-become-card-text">Connect one-on-one with someone who needs to talk.</p>
            <button className="m-become-card-btn" onClick={() => navigate("/become")}>Start Listening</button>
          </div>
          <div className="m-become-card">
            <div className="m-become-icon m-become-icon--connect"><ConnectIcon /></div>
            <h3 className="m-become-card-title">Connect</h3>
            <p className="m-become-card-text">Explore stories, activities, and meaningful moments.</p>
            <button className="m-become-card-btn" onClick={() => navigate("/find")}>Find a Listener</button>
          </div>
          <div className="m-become-card">
            <div className="m-become-icon m-become-icon--host"><HostIcon /></div>
            <h3 className="m-become-card-title">Host</h3>
            <p className="m-become-card-text">Create your own events and bring people together.</p>
            <button className="m-become-card-btn" onClick={() => navigate("/host")}>Become a Host</button>
          </div>
        </div>
        <div className="m-become-spacer" />
      </section>

      {/* How it works */}
      <section className="m-section--alt">
        <div className="m-head">
          <div className="m-label">How it works</div>
          <h2 className="m-title">Get Free Counseling and Start Your Healing Journey</h2>
          <p className="m-sub">At Walk&amp;Talk, we believe in the saying “a problem shared is a problem halved.”</p>
        </div>
        <div className="m-step-list">
          {STEPS.map((s) => (
            <div className="m-step-card" key={s.n}>
              <div className="m-step-img-wrap">
                <img className="m-step-img" src={`/${s.img}`} alt={s.alt} />
                <div className="m-step-img-overlay" />
              </div>
              <div className="m-step-body">
                <div className="m-step-num">{s.n}</div>
                <h4 className="m-step-title">{s.title}</h4>
                <p className="m-step-text">{s.text}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Featured topics */}
      <section className="m-section">
        <div className="m-head">
          <div className="m-label">Featured topics</div>
          <h2 className="m-title">Whatever you're carrying, someone understands</h2>
        </div>
        <div className="m-chip-row">
          {TOPICS.map((t) => (
            <span className="m-chip" key={t}>{t}</span>
          ))}
        </div>
      </section>

      {/* Safety promise */}
      <section className="m-safety-banner">
        <div className="m-label m-label--on-dark">Our promise</div>
        <h2 className="m-safety-title">A safe space for real conversations</h2>
        <p className="m-safety-text">
          Every listener agrees to our safety guidelines. Reporting, blocking, and crisis support are always one tap away.
        </p>
        <button className="m-btn m-btn--on-dark" onClick={() => navigate("/safety")}>See our safety promise</button>
      </section>

      {/* Final CTA */}
      <section className="m-final-cta">
        <h2 className="m-final-cta-title">Healing can begin with one walk.</h2>
        <p className="m-final-cta-sub">One meal, one conversation, or one moment of stillness.</p>
        <div className="m-btn-col">
          <button className="m-btn m-btn--primary" onClick={getStarted}>Get Started</button>
          <button className="m-btn m-btn--ghost" onClick={() => navigate("/become")}>Become a Listener</button>
        </div>
      </section>
    </main>
  );
}
