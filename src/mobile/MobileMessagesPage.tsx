import { useApp } from "../state/store";

export function MobileMessagesPage() {
  const app = useApp();
  return (
    <main data-screen-label="Messages">
      <section className="m-page-header">
        <div className="m-eyebrow">Your inbox</div>
        <h1 className="m-page-title">Messages</h1>
        <p className="m-page-sub">Every conversation you've started with listeners and hosts.</p>
      </section>
      <section className="m-section">
        {app.conversations.length === 0 && (
          <p className="m-empty">No conversations yet — message a listener or host from Find a Listener to start one.</p>
        )}
        <div className="m-convo-list">
          {app.conversations.map((c) => (
            <button
              key={c.name}
              className={`m-convo-row ${c.unread ? "m-convo-row--unread" : ""}`}
              onClick={() => {
                app.markConversationRead(c.name);
                app.openComposerFor(c.name);
              }}
            >
              <div className="m-convo-avatar">{c.name.charAt(0)}</div>
              <div style={{ minWidth: 0, flex: 1 }}>
                <div className="m-convo-top">
                  <span className="m-convo-name">{c.name}</span>
                  <span className="m-convo-when">{c.when}</span>
                </div>
                <p className="m-convo-preview">{c.last}</p>
              </div>
              {c.unread && <div className="m-convo-dot" />}
            </button>
          ))}
        </div>
      </section>
    </main>
  );
}
