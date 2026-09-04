import { SHOULD_LIST, SHOULD_NOT_LIST, SAFETY_TOOLS } from "../data/content";

/** Copy is scaffolding from SAFETY-COPY-DRAFT.md — needs professional sign-off. */
export function MobileSafetyPage() {
  return (
    <main data-screen-label="Safety">
      <section className="m-page-header">
        <div className="m-eyebrow">Safety &amp; Trust</div>
        <h1 className="m-page-title">Safety, built in from day one.</h1>
        <p className="m-page-sub">
          Walk&amp;Talk is not a replacement for emergency services or licensed therapy unless you're
          working directly with a verified professional.
        </p>
      </section>

      <section className="m-crisis">
        <div className="m-crisis-box">
          <h3 className="m-crisis-title">Need urgent help right now?</h3>
          <p className="m-crisis-text">
            If you or someone else is in immediate danger, please contact local emergency services first.
          </p>
          <button className="m-crisis-btn">Get urgent help</button>
        </div>
      </section>

      <section className="m-section">
        <div className="m-head">
          <div className="m-label">Community guidelines</div>
          <h2 className="m-title">What we ask of everyone</h2>
        </div>
        <div className="m-guideline-col">
          <h4 className="m-guideline-heading">Users should</h4>
          {SHOULD_LIST.map((s) => (
            <div className="m-checklist-item" key={s}>
              <span className="m-check">✓</span>
              <span className="m-checklist-text">{s}</span>
            </div>
          ))}
        </div>
        <div className="m-guideline-col">
          <h4 className="m-guideline-heading">Users should not</h4>
          {SHOULD_NOT_LIST.map((s) => (
            <div className="m-checklist-item" key={s}>
              <span className="m-cross">✕</span>
              <span className="m-checklist-text">{s}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="m-section--alt">
        <div className="m-head">
          <div className="m-label">Protection tools</div>
          <h2 className="m-title">You're always in control</h2>
        </div>
        <div className="m-card-list">
          {SAFETY_TOOLS.map((t) => (
            <div className="m-card" key={t.title}>
              <div className="m-card-monogram">{t.monogram}</div>
              <h3 className="m-card-title">{t.title}</h3>
              <p className="m-card-text">{t.text}</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
