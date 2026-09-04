import { useEffect, useRef } from "react";
import { useListener } from "../ListenerProvider";
import { Avatar } from "../ui";

/** The active-conversation panel: header actions, message scroll, composer.
 *  `onBack` renders a back arrow (mobile / app full-screen); omit for the web split. */
export function ConversationView({ onBack }: { onBack?: () => void }) {
  const l = useListener();
  const chat = l.activeChat;
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight });
  }, [chat?.messages.length, chat?.id]);

  if (!chat) {
    return (
      <div className="l-conv-empty">
        <p className="l-empty-title">Pick a conversation</p>
        <p className="l-empty-body">Nothing you read here leaves this screen.</p>
      </div>
    );
  }

  const opener = chat.messages.length
    ? "You accepted this request. Everything here stays between you."
    : "You accepted. They can write first, or you can open.";

  return (
    <>
      <div className="l-conv-header">
        {onBack && <button className="l-back-btn" aria-label="Back" onClick={onBack}>←</button>}
        <Avatar name={chat.seeker} size={44} />
        <div className="l-conv-who">
          <p className="l-conv-name">{chat.seeker}</p>
          <p className="l-conv-topic">{chat.topic}</p>
        </div>
        <div className="l-conv-actions">
          <button className="l-small-ghost" onClick={l.openEscalate}>Escalate</button>
          <button className="l-small-danger" onClick={l.openReport}>Block &amp; report</button>
          <button className="l-small-ghost" onClick={l.endConversation}>End</button>
        </div>
      </div>
      <div className="l-conv-scroll" ref={scrollRef}>
        <p className="l-conv-opener">{opener}</p>
        {chat.messages.map((m, i) => (
          <div key={i} className={`l-bubble-row l-bubble-row--${m.from}`}>
            <div className={`l-bubble l-bubble--${m.from}`}>{m.text}</div>
          </div>
        ))}
      </div>
      <div className="l-composer">
        <input
          className="l-composer-input"
          placeholder="Write a reply"
          value={l.draft}
          onChange={(e) => l.setDraft(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter") l.sendDraft(); }}
        />
        <button className="l-send-btn" disabled={!l.draft.trim()} onClick={l.sendDraft}>Send</button>
      </div>
    </>
  );
}
