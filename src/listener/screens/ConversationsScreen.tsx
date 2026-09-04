import { useEffect } from "react";
import { useListener } from "../ListenerProvider";
import { Avatar, preview } from "../ui";
import { ConversationView } from "./ConversationView";

/**
 * `split` (web ≥900px): list on the left, conversation pane on the right.
 * `full` (mobile / app): list only; opening a chat renders a full-screen overlay.
 */
export function ConversationsScreen({ layout }: { layout: "split" | "full" }) {
  const l = useListener();
  const capLabel = `${l.chats.length} of ${l.cap} conversations open`;

  // Web split always shows a conversation: pick the first if none selected.
  useEffect(() => {
    if (layout === "split" && !l.activeChat && l.chats.length > 0) {
      l.openChat(l.chats[0].id);
    }
  }, [layout, l.activeChat, l.chats, l]);

  const list = (
    <div className="l-chat-list">
      {l.chats.map((c) => (
        <button
          key={c.id}
          className="l-chat-row"
          aria-current={layout === "split" && c.id === l.activeChatId}
          onClick={() => l.openChat(c.id)}
        >
          <Avatar name={c.seeker} size={48} />
          <div className="l-chat-mid">
            <p className="l-chat-name">{c.seeker}</p>
            <p className="l-chat-preview">{preview(c.messages[c.messages.length - 1])}</p>
          </div>
          <div className="l-chat-right">
            <span className="l-chat-topic">{c.topic}</span>
            {c.unread > 0 && <span className="l-chat-unread">{c.unread}</span>}
          </div>
        </button>
      ))}
      {l.chats.length === 0 && (
        <div className="l-empty">
          <p className="l-empty-title">No open conversations</p>
          <p className="l-empty-body">Accepted requests appear here.</p>
        </div>
      )}
    </div>
  );

  return (
    <div className="l-section" data-screen-label="Active conversations">
      <div className="l-section-head">
        <div>
          <h1 className="l-title">Conversations</h1>
          <p className="l-sub">{capLabel}</p>
        </div>
      </div>

      {layout === "split" ? (
        <div className="l-split">
          {list}
          <div className="l-conv-pane">
            <ConversationView />
          </div>
        </div>
      ) : (
        <>
          {list}
          {l.activeChat && (
            <div className="l-conv-full" role="dialog" aria-modal="true" aria-label={`Conversation with ${l.activeChat.seeker}`}>
              <ConversationView onBack={l.closeChat} />
            </div>
          )}
        </>
      )}
    </div>
  );
}
