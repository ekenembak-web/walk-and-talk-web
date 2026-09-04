import { useEffect } from "react";
import { useModerator } from "./ModeratorProvider";
import { ACTION_DEFS } from "./data";

export function ActionModal() {
  const m = useModerator();

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") m.closeAction(); };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [m]);

  if (!m.action) return null;
  const def = ACTION_DEFS[m.action];

  return (
    <div className="mod-scrim" onClick={m.closeAction}>
      <div className="mod-modal" role="dialog" aria-modal="true" aria-labelledby="mod-action-title" onClick={(e) => e.stopPropagation()}>
        <h3 className="mod-modal-title" id="mod-action-title">{def.title}</h3>
        <p className="mod-modal-sub">{def.sub}</p>

        {def.needsSecond && (
          <div className="mod-second-card">
            <p className="mod-second-title">Second moderator required</p>
            <p className="mod-second-body">
              Involving emergency services cannot be done alone. Enter a colleague's name; they are
              notified and the pair of you are recorded against this decision.
            </p>
            <input
              className="mod-input"
              placeholder="Colleague's name"
              value={m.secondName}
              onChange={(e) => m.setSecondName(e.target.value)}
            />
          </div>
        )}

        <textarea
          className="mod-textarea"
          placeholder={def.placeholder}
          value={m.actionNote}
          onChange={(e) => m.setActionNote(e.target.value)}
        />
        <button className="mod-confirm-btn" disabled={!m.actionReady} onClick={m.confirmAction}>
          {def.btn}
        </button>
        <p className="mod-modal-foot">{def.foot}</p>
      </div>
    </div>
  );
}
