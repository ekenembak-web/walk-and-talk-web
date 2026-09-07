import { VALUES } from "../data/content";

export function MobileAboutPage() {
  return (
    <main data-screen-label="About">
      <section className="m-page-header">
        <div className="m-eyebrow">About Walk&amp;Talk</div>
        <h1 className="m-page-title">Vulnerability is strength.</h1>
        <p className="m-page-sub">
          Walk&amp;Talk exists to help people release emotional burdens through conversation, shared activity, and human connection.
        </p>
      </section>

      <section className="m-split m-split--image-first">
        <div className="m-split-image-wrap">
          <img className="m-split-image m-split-image--full" src="/assets/about-hero-bench.jpg" alt="Two older men sitting on a park bench in conversation" />
          <div className="m-split-image-overlay" />
        </div>
        <div>
          <div className="m-label">Why we exist</div>
          <h2 className="m-title">Healing shouldn't happen alone</h2>
          <p className="m-body-text">
            We built Walk&amp;Talk around a simple belief: people heal better when they don't have to heal alone.
          </p>
          <p className="m-body-text">
            We are not built around “fixing” people. We are built around helping people feel seen, heard, supported, and less alone.
          </p>
        </div>
      </section>

      <section className="m-section--alt">
        <div className="m-head">
          <div className="m-label">What we believe</div>
          <h2 className="m-title">Redefining strength</h2>
        </div>
        <div className="m-value-list">
          {VALUES.map((v) => (
            <div className="m-value-card" key={v.title}>
              <h4 className="m-value-title">{v.title}</h4>
              <p className="m-value-text">{v.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section>
        <div className="m-community-photo-wrap">
          <img className="m-community-photo-img" src="/assets/about-community.jpg" alt="Friends gathered around a campfire cookout in the forest, laughing together" />
          <div className="m-community-photo-overlay" />
          <div className="m-community-photo-caption">Community, in real life.</div>
        </div>
      </section>

      <section className="m-anti-bully">
        <div className="m-label m-label--on-dark">Anti-bullying commitment</div>
        <h2 className="m-safety-title">Kindness is part of healing.</h2>
        <p className="m-safety-text">
          Walk&amp;Talk supports a community where bullying, shame, and harassment have no place.
        </p>
      </section>

      <section className="m-brand-moment">
        <div className="m-brand-mark" aria-label="Walk&Talk">
          <span className="m-brand-stack" aria-hidden="true">
            <span style={{ fontSize: 16 }}>W</span>
            <span style={{ fontSize: 12 }}>&amp;</span>
            <span style={{ fontSize: 16 }}>T</span>
          </span>
          <span className="m-brand-big" aria-hidden="true">ALK</span>
        </div>
        <p className="m-brand-sub">One word, two meanings — every walk is an invitation to talk.</p>
      </section>
    </main>
  );
}
