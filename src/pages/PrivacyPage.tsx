import { PRIVACY_SECTIONS } from "../data/content";

export function PrivacyPage() {
  return (
    <main data-screen-label="Privacy">
      <section className="page-header">
        <div className="eyebrow">Privacy</div>
        <h1 className="page-title">What we do with what you tell us</h1>
        <p className="page-sub">
          Walk&amp;Talk is built for the kind of conversation people avoid having on the internet. That
          only works if the privacy terms are short enough to read and plain enough to trust.
        </p>
      </section>
      <section className="section">
        <div className="prose-narrow">
          {PRIVACY_SECTIONS.map((s) => (
            <div className="prose-block" key={s.title}>
              <h3 className="card-title">{s.title}</h3>
              <p className="card-text">{s.text}</p>
            </div>
          ))}
          <p className="reminder-text">
            Questions about your data can go to privacy@walkandtalk.example — a person answers, not a form.
          </p>
        </div>
      </section>
    </main>
  );
}
