import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useApp } from "../state/store";
import { scrollToGetInvolved } from "../desktop/scrollToGetInvolved";
import { HERO, STEPS } from "../data/content";
import { TOPICS } from "../lib/types";
import { COMMUNITY_MEMBERS } from "../data/people";
import { avatarUri } from "../lib/avatar";
import {
  ConnectIcon,
  HeartDoodle,
  HostIcon,
  ListenIcon,
  PinIcon,
  SquiggleDoodle,
  TwoWalkersDoodle,
} from "../components/icons";

export function HomePage() {
  const app = useApp();
  const navigate = useNavigate();
  const location = useLocation();

  // Resume "getinvolved" intent / hash after mount.
  useEffect(() => {
    if (location.hash === "#get-involved") setTimeout(() => scrollToGetInvolved(), 30);
  }, [location.hash]);

  const goInvolved = () =>
    app.gateBrowse(() => setTimeout(() => scrollToGetInvolved(), 30));

  return (
    <main data-screen-label="Home">
      {/* Hero */}
      <section className="hero">
        <div className="hero-text">
          <TwoWalkersDoodle color="var(--teal)" style={{ width: 60, height: 71 }} />
          <h1 className="hero-title">
            {HERO.title[0]}
            <br />
            {HERO.title[1]}
          </h1>
          <p className="hero-sub">{HERO.sub}</p>
          <div className="btn-row">
            <button className="btn btn--primary" onClick={() => app.gateBrowse(() => navigate("/find"))}>
              Find Listeners
            </button>
            <button className="btn btn--ghost" onClick={() => app.gateBrowse(() => navigate("/host"))}>
              Become a Host
            </button>
          </div>
        </div>
        <div className="hero-image-wrap">
          <img
            className="hero-image"
            src="/assets/hero-coastal.jpg"
            alt="Two friends sitting on a coastal cliff at sunset, talking"
          />
          <div className="image-overlay" />
        </div>
      </section>

      {/* Meet Our Community */}
      <section className="section">
        <div className="section-head">
          <TwoWalkersDoodle color="var(--teal)" style={{ width: 67, height: 25 }} />
          <h2 className="section-title">Meet Our Community</h2>
          <p className="section-sub">Listeners and hosts ready to connect.</p>
        </div>
        <div className="community-grid">
          {COMMUNITY_MEMBERS.map((m) => (
            <article className="person-card" key={m.name}>
              <div className="person-photo-wrap">
                <div
                  className="person-photo"
                  role="img"
                  aria-label={m.name}
                  style={{ backgroundImage: `url(${avatarUri(m.name.split(",")[0])})` }}
                />
                <div className="image-overlay" />
              </div>
              <div className="person-body">
                <div className="person-name-row">
                  <h4 className="person-name">{m.name}</h4>
                  <span className={`badge ${m.role === "Host" ? "badge--host" : "badge--listener"}`}>
                    {m.role}
                  </span>
                </div>
                <p className="person-desc">{m.text}</p>
                <div className="person-location">
                  <PinIcon />
                  <span>{m.city}</span>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* Become a Listener — three ways to get involved */}
      <section className="become-banner">
        <div id="get-involved" className="anchor-offset" />
        <div className="become-banner-bg" />
        <div className="become-banner-overlay" />
        <div className="become-banner-head">
          <h2 className="become-banner-title">Become a Listener</h2>
          <p className="become-banner-sub">Three simple ways to get involved.</p>
        </div>
        <div className="become-cards-row">
          <div className="become-card" onClick={() => navigate("/become")}>
            <div className="become-icon become-icon--listen"><ListenIcon /></div>
            <h3 className="become-card-title">Listen</h3>
            <p className="become-card-text">Connect one-on-one with someone who needs to talk.</p>
            <button className="become-card-btn" onClick={(e) => { e.stopPropagation(); navigate("/become"); }}>
              Start Listening
            </button>
          </div>
          <div className="become-card" onClick={() => navigate("/find")}>
            <div className="become-icon become-icon--connect"><ConnectIcon /></div>
            <h3 className="become-card-title">Connect</h3>
            <p className="become-card-text">Explore stories, activities, and meaningful moments.</p>
            <button className="become-card-btn" onClick={(e) => { e.stopPropagation(); navigate("/find"); }}>
              Find a Listener
            </button>
          </div>
          <div className="become-card" onClick={() => navigate("/host")}>
            <div className="become-icon become-icon--host"><HostIcon /></div>
            <h3 className="become-card-title">Host</h3>
            <p className="become-card-text">Create your own events and bring people together.</p>
            <button className="become-card-btn" onClick={(e) => { e.stopPropagation(); navigate("/host"); }}>
              Become a Host
            </button>
          </div>
        </div>
        <div className="become-spacer" />
      </section>

      {/* How it works */}
      <section className="section--alt">
        <div className="section-head">
          <div className="section-label">How it works</div>
          <h2 className="section-title">Get Free Counseling and Start Your Healing Journey</h2>
          <p className="section-sub">
            At Walk&amp;Talk, we believe in the saying “a problem shared is a problem halved” — and healing through human connection.
          </p>
        </div>
        <div className="step-grid">
          {STEPS.map((s) => (
            <div className="step-card" key={s.n}>
              <div className="step-img-wrap">
                <img className="step-img" src={`/${s.img}`} alt={s.alt} />
                <div className="image-overlay" />
              </div>
              <div className="step-num">{s.n}</div>
              <h4 className="step-title">{s.title}</h4>
              <p className="step-text">{s.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Featured topics */}
      <section className="section">
        <div className="section-head">
          <div className="section-label">Featured topics</div>
          <h2 className="section-title">Whatever you're carrying, someone understands</h2>
        </div>
        <div className="chip-row chip-row--center">
          {TOPICS.map((t) => (
            <span className="chip-static" key={t}>{t}</span>
          ))}
        </div>
      </section>

      {/* Safety promise */}
      <section className="safety-banner">
        <div className="safety-banner-inner">
          <div>
            <div className="section-label--on-dark">Our promise</div>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <HeartDoodle />
              <h2 className="safety-banner-title">A safe space for real conversations</h2>
            </div>
            <p className="safety-banner-text">
              Every listener agrees to our safety guidelines. Reporting, blocking, and crisis support are always one tap away.
            </p>
          </div>
          <button className="btn btn--on-dark" onClick={() => navigate("/safety")}>
            See our safety promise
          </button>
        </div>
      </section>

      {/* App promo */}
      <section className="app-promo">
        <div className="app-promo-text">
          <div className="section-label--on-dark">Now in your pocket</div>
          <h2 className="app-promo-title">Take Walk&amp;Talk with you</h2>
          <p className="app-promo-sub">
            Find listeners, join hosted events, and pick up conversations on the go — with light and night modes to suit any hour.
          </p>
          <div className="btn-row">
            <button className="btn btn--primary" onClick={() => app.gateBrowse(() => navigate("/find"))}>
              Find a Listener
            </button>
          </div>
        </div>
        <div>
          <img className="app-promo-image" src="/assets/app-home-light.png" alt="Walk&Talk mobile app home screen" />
        </div>
      </section>

      {/* Final CTA */}
      <section className="final-cta">
        <h2 className="final-cta-title">Healing can begin with one walk.</h2>
        <SquiggleDoodle color="var(--teal)" />
        <p className="final-cta-sub">One meal, one conversation, or one moment of stillness.</p>
        <div className="btn-row" style={{ justifyContent: "center" }}>
          {!app.signedIn && (
            <button className="btn btn--primary" onClick={goInvolved}>Get Started</button>
          )}
          <button className="btn btn--ghost" onClick={() => app.gateBrowse(() => navigate("/become"))}>
            Become a Listener
          </button>
        </div>
      </section>
    </main>
  );
}
