import { GUIDELINE_ENDS, GUIDELINE_PILLARS } from "../data/content";

export function MobileGuidelinesPage() {
  return (
    <main data-screen-label="Community Guidelines">
      <section className="m-page-header">
        <div className="m-eyebrow">Community guidelines</div>
        <h1 className="m-page-title">Six things we ask of everyone</h1>
        <p className="m-page-sub">
          Every walk, circle, and message thread on Walk&amp;Talk runs on the same agreement. Listeners
          accept it when they apply. Everyone else accepts it the first time they say hello.
        </p>
      </section>
      <section className="m-section">
        <div className="m-card-list">
          {GUIDELINE_PILLARS.map((g) => (
            <div className="m-card" key={g.monogram}>
              <div className="m-card-monogram">{g.monogram}</div>
              <h3 className="m-card-title">{g.title}</h3>
              <p className="m-card-text">{g.text}</p>
            </div>
          ))}
        </div>
      </section>
      <section className="m-section" style={{ paddingTop: 0 }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <h2 className="m-title">What ends an account</h2>
          <p className="m-card-text">
            These are not warnings-first situations. Any of them removes access while we review, and
            most reviews are final.
          </p>
          {GUIDELINE_ENDS.map((item) => (
            <p className="m-checklist-text" key={item}>— {item}</p>
          ))}
          <p className="m-reminder-text" style={{ textAlign: "left" }}>
            Reporting is always available inside a conversation, and reports are read by a person on the same day.
          </p>
        </div>
      </section>
    </main>
  );
}
