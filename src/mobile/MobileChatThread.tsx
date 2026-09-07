import { useEffect, useRef, useState } from "react";
import { useApp } from "../state/store";
import { avatarUri } from "../lib/avatar";
import { SendIcon } from "../components/icons";

/**
 * Full-screen mobile chat. Opens for a single recipient — from "Request to
 * talk" / a profile, or by tapping a conversation in Messages — and stays open
 * after each send. Reads the open recipient from the store (`composerTo`), so a
 * brand-new conversation (no messages yet) still renders its "say hello" state.
 * Multi-recipient sends use the bottom-sheet composer instead.
 */
export function MobileChatThread() {
  const app = useApp();
  const [draft, setDraft] = useState("");
  const [sending, setSending] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const name = app.composerTo.length === 1 ? app.composerTo[0] : null;
  const conversation = name ? app.conversations.find((c) => c.name === name) ?? null : null;
  const messages = conversation?.messages ?? [];

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight });
  }, [messages.length]);

  useEffect(() => {
    if (!name) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = prev; };
  }, [name]);

  useEffect(() => setDraft(""), [name]);

  if (!name) return null;

  const send = async () => {
    const text = draft.trim();
    if (!text || sending) return;
    setDraft("");
    setSending(true);
    try {
      await app.sendMessage([name], text);
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="m-chat-full" role="dialog" aria-modal="true" aria-label={`Conversation with ${name}`}>
      <div className="m-chat-header">
        <button className="m-chat-back" aria-label="Back" onClick={() => app.closeComposer()}>‹</button>
        <div className="m-chat-avatar" style={{ backgroundImage: `url(${avatarUri(name)})` }} />
        <span className="m-chat-name">{name}</span>
      </div>

      <div className="m-chat-scroll" ref={scrollRef}>
        {messages.length === 0 && (
          <p className="m-chat-opener">Say hello and share what you'd like to talk about.</p>
        )}
        {messages.map((m, i) => (
          <div key={i} className={`m-chat-row m-chat-row--${m.from}`}>
            <div className={`m-chat-bubble m-chat-bubble--${m.from}`}>{m.text}</div>
          </div>
        ))}
      </div>

      <div className="m-chat-input-row">
        <div className="m-chat-input-wrap">
          <textarea
            className="m-chat-input"
            rows={1}
            placeholder="Message…"
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); } }}
          />
          <button
            className="m-chat-send"
            aria-label="Send message"
            disabled={!draft.trim() || sending}
            onClick={send}
          >
            <SendIcon size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}
