import { VALUES } from "../data/content";

export function AboutPage() {
  return (
    <main data-screen-label="About">
      <section className="page-header">
        <div className="eyebrow">About Walk&amp;Talk</div>
        <h1 className="page-title">Vulnerability is strength.</h1>
        <p className="page-sub">
          Walk&amp;Talk exists to help people release emotional burdens through conversation, shared
          activity, and human connection — without pretending healing is instant or easy.
        </p>
      </section>

      <section className="section-split">
        <div className="split-image-wrap">
          <img className="split-image" src="/assets/about-hero-bench.jpg" alt="Two older men sitting on a park bench, talking" />
          <div className="image-overlay" />
        </div>
        <div>
          <div className="section-label">Why we exist</div>
          <h2 className="section-title">Healing shouldn't happen alone</h2>
          <p className="body-text">
            We built Walk&amp;Talk around a simple belief: people heal better when they don't have to
            heal alone. Not every hard season needs a clinical fix — sometimes it needs someone who
            has been there, willing to listen without judgment.
          </p>
          <p className="body-text">
            We are not built around “fixing” people. We are built around helping people feel seen,
            heard, supported, and less alone.
          </p>
        </div>
      </section>

      <section className="section--alt">
        <div className="section-head">
          <div className="section-label">What we believe</div>
          <h2 className="section-title">Redefining strength</h2>
        </div>
        <div className="value-grid">
          {VALUES.map((v) => (
            <div className="value-card" key={v.title}>
              <h4 className="value-title">{v.title}</h4>
              <p className="value-text">{v.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section>
        <div className="community-photo-wrap">
          <img
            className="community-photo-img"
            src="/assets/about-community.jpg"
            alt="Friends gathered around a campfire cookout in the forest, laughing together"
          />
          <div className="image-overlay" />
          <div className="community-photo-caption">Community, in real life.</div>
        </div>
      </section>

      <section className="anti-bully-banner">
        <div className="section-label--on-dark">Anti-bullying commitment</div>
        <h2 className="safety-banner-title">Kindness is part of healing.</h2>
        <p className="safety-banner-text">
          Walk&amp;Talk supports a community where bullying, shame, and harassment have no place.
        </p>
      </section>

      <section className="brand-moment">
        <div className="brand-mark" aria-label="Walk&Talk">
          <span className="brand-mark-stack" aria-hidden="true">
            <span style={{ fontSize: 20 }}>W</span>
            <span style={{ fontSize: 15 }}>&amp;</span>
            <span style={{ fontSize: 20 }}>T</span>
          </span>
          <span className="brand-mark-big" aria-hidden="true">ALK</span>
        </div>
        <p className="brand-moment-sub">One word, two meanings — every walk is an invitation to talk.</p>
      </section>
    </main>
  );
}
