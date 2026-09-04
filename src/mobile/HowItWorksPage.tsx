import { STEPS } from "../data/content";

export function HowItWorksPage() {
  return (
    <main data-screen-label="How It Works">
      <section className="m-page-header">
        <div className="m-eyebrow">How it works</div>
        <h1 className="m-page-title">Get Free Counseling and Start Your Healing Journey</h1>
        <p className="m-page-sub">At Walk&amp;Talk, we believe in the saying “a problem shared is a problem halved.”</p>
      </section>
      <section className="m-section">
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
    </main>
  );
}
