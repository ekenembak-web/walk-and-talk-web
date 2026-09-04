import { PRIVACY_SECTIONS } from "../data/content";

export function MobilePrivacyPage() {
  return (
    <main data-screen-label="Privacy">
      <section className="m-page-header">
        <div className="m-eyebrow">Privacy</div>
        <h1 className="m-page-title">What we do with what you tell us</h1>
        <p className="m-page-sub">
          Walk&amp;Talk is built for the kind of conversation people avoid having on the internet. That
          only works if the privacy terms are short enough to read and plain enough to trust.
        </p>
      </section>
      <section className="m-section">
        <div style={{ display: "flex", flexDirection: "column", gap: 26 }}>
          {PRIVACY_SECTIONS.map((s) => (
            <div key={s.title} style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              <h3 className="m-card-title">{s.title}</h3>
              <p className="m-card-text">{s.text}</p>
            </div>
          ))}
          <p className="m-reminder-text" style={{ textAlign: "left" }}>
            Questions about your data can go to privacy@walkandtalk.example — a person answers, not a form.
          </p>
        </div>
      </section>
    </main>
  );
}
