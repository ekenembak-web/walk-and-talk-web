import { SHOULD_LIST, SHOULD_NOT_LIST, SAFETY_TOOLS } from "../data/content";

/**
 * NOTE: this copy is scaffolding from SAFETY-COPY-DRAFT.md. It needs sign-off
 * from someone with safeguarding or counselling background before launch, and
 * there is no crisis-escalation path behind the "Get urgent help" button yet.
 */
export function SafetyPage() {
  return (
    <main data-screen-label="Safety">
      <section className="page-header">
        <div className="eyebrow">Safety &amp; Trust</div>
        <h1 className="page-title">Safety, built in from day one.</h1>
        <p className="page-sub">
          Walk&amp;Talk provides community support, peer listening, and access to professionals. It is
          not a replacement for emergency services or licensed therapy unless you're working directly
          with a verified professional.
        </p>
      </section>

      <section className="crisis-section">
        <div className="crisis-box">
          <div>
            <h3 className="crisis-title">Need urgent help right now?</h3>
            <p className="crisis-text">
              If you or someone else is in immediate danger, please contact local emergency services first.
            </p>
          </div>
          <button className="crisis-btn">Get urgent help</button>
        </div>
      </section>

      <section className="section">
        <div className="section-head">
          <div className="section-label">Community guidelines</div>
          <h2 className="section-title">What we ask of everyone</h2>
        </div>
        <div className="guideline-grid">
          <div>
            <h4 className="guideline-heading">Users should</h4>
            {SHOULD_LIST.map((s) => (
              <div className="checklist-item" key={s} style={{ marginBottom: 12 }}>
                <span className="check-mark">✓</span>
                <span className="checklist-text">{s}</span>
              </div>
            ))}
          </div>
          <div>
            <h4 className="guideline-heading">Users should not</h4>
            {SHOULD_NOT_LIST.map((s) => (
              <div className="checklist-item" key={s} style={{ marginBottom: 12 }}>
                <span className="cross-mark">✕</span>
                <span className="checklist-text">{s}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section--alt">
        <div className="section-head">
          <div className="section-label">Protection tools</div>
          <h2 className="section-title">You're always in control</h2>
        </div>
        <div className="card-grid-3">
          {SAFETY_TOOLS.map((t) => (
            <div className="card" key={t.title}>
              <div className="card-monogram">{t.monogram}</div>
              <h3 className="card-title">{t.title}</h3>
              <p className="card-text">{t.text}</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
