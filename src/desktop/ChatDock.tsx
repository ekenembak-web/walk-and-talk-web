import { useEffect, useRef, useState } from "react";
import { useApp } from "../state/store";
import { avatarUri } from "../lib/avatar";

/**
 * Desktop chat — a docked widget in the bottom-right, not a modal. Opens for a
 * single recipient (via "Request to talk" / a profile / the Messages list),
 * stays open after each send, and can be minimised to just its header bar.
 * Multi-recipient sends still go through the plain composer.
 */
export function ChatDock() {
  const app = useApp();
  const [text, setText] = useState("");
  const [minimized, setMinimized] = useState(false);
  const bodyRef = useRef<HTMLDivElement>(null);

  const name = app.composerTo.length === 1 ? app.composerTo[0] : null;
  const conversation = name ? app.conversations.find((c) => c.name === name) ?? null : null;
  const messages = conversation?.messages ?? [];

  useEffect(() => {
    bodyRef.current?.scrollTo({ top: bodyRef.current.scrollHeight });
  }, [messages.length, minimized]);

  // Reset local UI state whenever the dock opens for a different person.
  useEffect(() => {
    setText("");
    setMinimized(false);
  }, [name]);

  if (!name) return null;

  const send = async () => {
    if (!text.trim()) return;
    await app.sendMessage([name], text);
    setText("");
  };

  const close = () => {
    app.closeComposer();
    setText("");
    setMinimized(false);
  };

  return (
    <div className="chat-dock">
      <div className={`chat-sheet ${minimized ? "chat-sheet--min" : ""}`}>
        <div className="chat-dock-header" onClick={() => setMinimized((v) => !v)}>
          <div
            className="chat-dock-avatar"
            style={{ backgroundImage: `url(${avatarUri(name)})` }}
            role="img"
            aria-label={name}
          />
          <p className="chat-dock-name">{name}</p>
          <button
            className="chat-dock-icon"
            aria-label={minimized ? "Expand chat" : "Minimize chat"}
            onClick={(e) => { e.stopPropagation(); setMinimized((v) => !v); }}
          >
            {minimized ? "▢" : "–"}
          </button>
          <button
            className="chat-dock-icon"
            aria-label="Close chat"
            onClick={(e) => { e.stopPropagation(); close(); }}
          >
            ✕
          </button>
        </div>

        {!minimized && (
          <>
            <div className="chat-dock-body" ref={bodyRef}>
              {messages.length === 0 && (
                <p className="chat-dock-empty">Say hello and share what you'd like to talk about.</p>
              )}
              {messages.map((m, i) => (
                <div key={i} className={`chat-dock-row chat-dock-row--${m.from}`}>
                  <div className={`chat-dock-bubble chat-dock-bubble--${m.from}`}>{m.text}</div>
                </div>
              ))}
            </div>
            <div className="chat-dock-input-row">
              <textarea
                className="chat-dock-input"
                rows={1}
                placeholder="Message…"
                value={text}
                onChange={(e) => setText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); }
                }}
              />
              <button className="chat-dock-send" onClick={send} disabled={!text.trim()}>
                Send
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
