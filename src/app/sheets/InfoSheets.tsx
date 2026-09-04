import { Sheet } from "../Sheet";
import { useAppShell } from "../AppProvider";
import { HOW_STEPS, ABOUT_VALUES } from "../data";
import {
  PRIVACY_SECTIONS,
  GUIDELINE_PILLARS,
  GUIDELINE_ENDS,
  SHOULD_LIST,
  SHOULD_NOT_LIST,
} from "../../data/content";

/**
 * The five read-only sheets from the Profile menu. Safety/privacy/guidelines
 * copy is scaffolding pending professional sign-off.
 */
export function InfoSheets() {
  const shell = useAppShell();
  const { sheets } = shell;

  return (
    <>
      {sheets.how && (
        <Sheet onClose={() => shell.closeSheet("how")} variant="tall" labelledBy="how-title">
          <h3 className="a-sheet-title" id="how-title">How It Works</h3>
          <p className="a-sheet-sub">A problem shared is a problem halved.</p>
          <div className="a-sheet-prose">
            {HOW_STEPS.map((s) => (
              <div className="a-how-step" key={s.num}>
                <div className="a-how-num">{s.num}</div>
                <div style={{ minWidth: 0 }}>
                  <h4>{s.title}</h4>
                  <p>{s.text}</p>
                </div>
              </div>
            ))}
          </div>
          <button className="a-cta-full" onClick={() => shell.closeSheet("how")}>Close</button>
        </Sheet>
      )}

      {sheets.about && (
        <Sheet onClose={() => shell.closeSheet("about")} variant="tall" labelledBy="about-title">
          <h3 className="a-sheet-title" id="about-title">Vulnerability is strength.</h3>
          <p className="a-sheet-sub">
            Walk&amp;Talk exists to help people release emotional burdens through conversation, shared
            activity, and human connection — without pretending healing is instant or easy.
          </p>
          <h4 className="a-sheet-section-title">Why we exist</h4>
          <p className="a-sheet-body">
            We built Walk&amp;Talk around a simple belief: people heal better when they don't have to
            heal alone. We are not built around “fixing” people — we are built around helping people
            feel seen, heard, supported, and less alone.
          </p>
          <h4 className="a-sheet-section-title">What we believe</h4>
          <div className="a-value-list">
            {ABOUT_VALUES.map((v) => (
              <div className="a-value-item" key={v.title}>
                <span className="a-value-dot">•</span>
                <div>
                  <span className="a-value-title">{v.title}</span>
                  <p className="a-value-text">{v.text}</p>
                </div>
              </div>
            ))}
          </div>
          <button className="a-cta-full" onClick={() => shell.closeSheet("about")}>Close</button>
        </Sheet>
      )}

      {sheets.safety && (
        <Sheet onClose={() => shell.closeSheet("safety")} variant="tall" labelledBy="safety-title">
          <h3 className="a-sheet-title" id="safety-title">Safety, built in from day one.</h3>
          <p className="a-sheet-sub">
            Walk&amp;Talk provides community support and peer listening. It is not a replacement for
            emergency services or licensed therapy unless you're working with a verified professional.
          </p>
          <h4 className="a-sheet-section-title">Users should</h4>
          <div className="a-checklist">
            {SHOULD_LIST.map((s) => (
              <div className="a-check-item" key={s}>
                <span className="a-check">✓</span>
                <span className="a-check-text">{s}</span>
              </div>
            ))}
          </div>
          <h4 className="a-sheet-section-title">Users should not</h4>
          <div className="a-checklist">
            {SHOULD_NOT_LIST.map((s) => (
              <div className="a-check-item" key={s}>
                <span className="a-cross">✕</span>
                <span className="a-check-text">{s}</span>
              </div>
            ))}
          </div>
          <button className="a-cta-full" onClick={() => shell.closeSheet("safety")}>Close</button>
        </Sheet>
      )}

      {sheets.privacy && (
        <Sheet onClose={() => shell.closeSheet("privacy")} variant="tall" labelledBy="privacy-title">
          <h3 className="a-sheet-title" id="privacy-title">Privacy</h3>
          <p className="a-sheet-sub">What we do with what you tell us.</p>
          <div className="a-sheet-prose">
            {PRIVACY_SECTIONS.map((s) => (
              <div key={s.title}>
                <h4>{s.title}</h4>
                <p>{s.text}</p>
              </div>
            ))}
          </div>
          <button className="a-cta-full" onClick={() => shell.closeSheet("privacy")}>Close</button>
        </Sheet>
      )}

      {sheets.guidelines && (
        <Sheet onClose={() => shell.closeSheet("guidelines")} variant="tall" labelledBy="guidelines-title">
          <h3 className="a-sheet-title" id="guidelines-title">Community Guidelines</h3>
          <p className="a-sheet-sub">Six things we ask of everyone.</p>
          <div className="a-sheet-prose">
            {GUIDELINE_PILLARS.map((g) => (
              <div key={g.monogram}>
                <h4>{g.title}</h4>
                <p>{g.text}</p>
              </div>
            ))}
            <div>
              <h4>What ends an account</h4>
              {GUIDELINE_ENDS.map((item) => (
                <p key={item} style={{ marginTop: 4 }}>— {item}</p>
              ))}
            </div>
          </div>
          <button className="a-cta-full" onClick={() => shell.closeSheet("guidelines")}>Close</button>
        </Sheet>
      )}
    </>
  );
}
