import { GUIDELINE_ENDS, GUIDELINE_PILLARS } from "../data/content";

export function GuidelinesPage() {
  return (
    <main data-screen-label="Community Guidelines">
      <section className="page-header">
        <div className="eyebrow">Community guidelines</div>
        <h1 className="page-title">Six things we ask of everyone</h1>
        <p className="page-sub">
          Every walk, circle, and message thread on Walk&amp;Talk runs on the same agreement. Listeners
          accept it when they apply. Everyone else accepts it the first time they say hello.
        </p>
      </section>
      <section className="section">
        <div className="pillar-grid">
          {GUIDELINE_PILLARS.map((g) => (
            <div className="card" key={g.monogram}>
              <div className="card-monogram">{g.monogram}</div>
              <h3 className="card-title">{g.title}</h3>
              <p className="card-text">{g.text}</p>
            </div>
          ))}
        </div>
      </section>
      <section className="section">
        <div className="prose-narrow" style={{ gap: 14 }}>
          <h2 className="section-title">What ends an account</h2>
          <p className="card-text">
            These are not warnings-first situations. Any of them removes access while we review, and
            most reviews are final.
          </p>
          {GUIDELINE_ENDS.map((item) => (
            <p className="checklist-text" key={item}>— {item}</p>
          ))}
          <p className="reminder-text">
            Reporting is always available inside a conversation, and reports are read by a person on the same day.
          </p>
        </div>
      </section>
    </main>
  );
}
