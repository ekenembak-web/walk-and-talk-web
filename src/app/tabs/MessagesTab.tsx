import { useEffect, useRef } from "react";
import { useAppShell } from "../AppProvider";
import { findPerson } from "../data";
import { avatarUri } from "../../lib/avatar";

export function MessagesTab() {
  const shell = useAppShell();
  const activeId = shell.activeThreadId;
  const bodyRef = useRef<HTMLDivElement>(null);

  const msgs = activeId ? shell.threads[activeId] ?? [] : [];

  useEffect(() => {
    bodyRef.current?.scrollTo({ top: bodyRef.current.scrollHeight });
  }, [msgs.length, activeId]);

  if (!activeId) {
    const threadIds = Object.keys(shell.threads);
    return (
      <>
        <div className="a-pad">
          <h1 className="a-page-title">Messages</h1>
        </div>
        <div className="a-thread-col">
          {threadIds.map((id) => {
            const person = findPerson(id);
            const name = person?.name ?? id;
            const list = shell.threads[id];
            const last = list.length ? list[list.length - 1] : { from: "them" as const, text: "No messages yet." };
            return (
              <button key={id} className="a-thread-row" onClick={() => shell.openThread(id)}>
                <div className="a-thread-avatar" style={{ backgroundImage: `url(${avatarUri(name)})` }} />
                <div className="a-thread-info">
                  <div className="a-thread-name">{name}</div>
                  <p className="a-thread-preview">
                    {last.from === "me" ? "You: " : ""}
                    {last.text}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
        <div className="a-spacer" />
      </>
    );
  }

  const person = findPerson(activeId);
  const name = person?.name ?? activeId;

  return (
    <>
      <div className="a-chat-header">
        <button className="a-icon-btn" aria-label="Back" onClick={shell.closeThread}>←</button>
        <div className="a-chat-header-avatar" style={{ backgroundImage: `url(${avatarUri(name)})` }} />
        <span className="a-chat-header-name">{name}</span>
      </div>
      <div className="a-chat-body" ref={bodyRef}>
        {msgs.map((m, i) => (
          <div key={i} className={`a-bubble-wrap a-bubble-wrap--${m.from}`}>
            <span className={`a-bubble a-bubble--${m.from}`}>{m.text}</span>
          </div>
        ))}
      </div>
      <div className="a-chat-input-row">
        <input
          className="a-chat-input"
          placeholder="Message…"
          value={shell.messageDraft}
          onChange={(e) => shell.setMessageDraft(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter") shell.sendThreadMessage(); }}
        />
        <button className="a-send-btn" aria-label="Send" onClick={shell.sendThreadMessage}>➤</button>
      </div>
    </>
  );
}
