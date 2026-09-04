import { useApp } from "../state/store";

export function MessagesPage() {
  const app = useApp();
  const { conversations } = app;

  return (
    <main data-screen-label="Messages">
      <section className="page-header">
        <div className="eyebrow">Your inbox</div>
        <h1 className="page-title">Messages</h1>
        <p className="page-sub">Every conversation you've started with listeners and hosts.</p>
      </section>
      <section className="section">
        {conversations.length === 0 && (
          <p className="empty-state">
            No conversations yet — send a request from Find a Listener to start one.
          </p>
        )}
        <div className="convo-list">
          {conversations.map((c) => (
            <button
              key={c.name}
              className={`convo-row ${c.unread ? "convo-row--unread" : ""}`}
              onClick={() => {
                app.markConversationRead(c.name);
                app.openComposerFor(c.name);
              }}
            >
              <div className="convo-avatar">{c.name.charAt(0)}</div>
              <div style={{ minWidth: 0, flex: 1 }}>
                <div className="convo-top-line">
                  <span className="convo-name">{c.name}</span>
                  <span className="convo-when">{c.when}</span>
                </div>
                <p className="convo-preview">{c.last}</p>
              </div>
              {c.unread && <div className="convo-dot" />}
            </button>
          ))}
        </div>
      </section>
    </main>
  );
}
