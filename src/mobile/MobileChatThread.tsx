import { useEffect, useRef, useState } from "react";
import { useApp } from "../state/store";
import { avatarUri } from "../lib/avatar";
import type { Conversation } from "../lib/types";

/**
 * Full-screen chat thread — mobile web Messages. Tapping a conversation in
 * the list opens this instead of the single-message composer sheet, so a seeker
 * can read and continue a conversation like a real chat, not just fire one
 * message off. Starting a *new* conversation (from Find / a profile) still
 * goes through the composer; this is for conversations that already exist.
 */
export function MobileChatThread({
  conversation,
  onBack,
}: {
  conversation: Conversation;
  onBack: () => void;
}) {
  const app = useApp();
  const [draft, setDraft] = useState("");
  const [sending, setSending] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight });
  }, [conversation.messages.length]);

  const send = async () => {
    const text = draft.trim();
    if (!text || sending) return;
    setDraft("");
    setSending(true);
    try {
      await app.sendMessage([conversation.name], text);
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="m-chat-full" role="dialog" aria-modal="true" aria-label={`Conversation with ${conversation.name}`}>
      <div className="m-chat-header">
        <button className="m-chat-back" aria-label="Back to messages" onClick={onBack}>←</button>
        <div className="m-chat-avatar" style={{ backgroundImage: `url(${avatarUri(conversation.name)})` }} />
        <span className="m-chat-name">{conversation.name}</span>
      </div>

      <div className="m-chat-scroll" ref={scrollRef}>
        {conversation.messages.length === 0 && (
          <p className="m-chat-opener">Say hello — nothing here leaves this screen.</p>
        )}
        {conversation.messages.map((m, i) => (
          <div key={i} className={`m-chat-row m-chat-row--${m.from}`}>
            <div className={`m-chat-bubble m-chat-bubble--${m.from}`}>{m.text}</div>
          </div>
        ))}
      </div>

      <div className="m-chat-input-row">
        <input
          className="m-chat-input"
          placeholder="Write a reply"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter") send(); }}
        />
        <button className="m-chat-send" disabled={!draft.trim() || sending} onClick={send}>
          Send
        </button>
      </div>
    </div>
  );
}
