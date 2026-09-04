import { useListener } from "../ListenerProvider";
import { Avatar } from "../ui";

export function PeersScreen() {
  const l = useListener();

  const composer = (
    <div className="l-peer-composer">
      <p className="l-label">Share something</p>
      <textarea
        className="l-textarea"
        placeholder="How is it going for you lately?"
        value={l.peerDraft}
        onChange={(e) => l.setPeerDraft(e.target.value)}
      />
      <button className="l-peer-post-btn" disabled={!l.peerDraft.trim()} onClick={l.postPeer}>
        Share with listeners
      </button>
    </div>
  );

  const feed = (
    <div className="l-peer-feed">
      {l.peerPosts.map((p) => {
        const liked = l.peerLiked.includes(p.id);
        return (
          <div className="l-peer-card" key={p.id}>
            <div className="l-peer-head">
              <Avatar name={p.who} size={40} />
              <div className="l-peer-who">
                <p className="l-peer-name">{p.who}</p>
                <p className="l-peer-when">{p.when}</p>
              </div>
            </div>
            <p className="l-peer-text">{p.text}</p>
            <button className="l-like-row" onClick={() => l.toggleLike(p.id)}>
              <span className={`l-like-glyph ${liked ? "l-like-glyph--on" : ""}`}>{liked ? "♥" : "♡"}</span>
              <span className="l-like-count">{p.likes} {p.likes === 1 ? "listener" : "listeners"}</span>
            </button>
          </div>
        );
      })}
    </div>
  );

  return (
    <div className="l-section" data-screen-label="Peer support">
      <div className="l-section-head">
        <div>
          <h1 className="l-title">Listeners only</h1>
          <p className="l-sub">
            A space for the people doing this work, not the people using it. Seekers never see this.
          </p>
        </div>
      </div>
      <div className="l-peer-layout">
        {feed}
        {composer}
      </div>
    </div>
  );
}
