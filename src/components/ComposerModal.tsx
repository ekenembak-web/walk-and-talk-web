import { useState } from "react";
import { useApp } from "../state/store";
import { Modal } from "./Modal";

export function ComposerModal() {
  const app = useApp();
  const [text, setText] = useState("");
  const recipients = app.composerTo;
  if (recipients.length === 0) return null;

  const send = async () => {
    if (!text.trim()) return;
    await app.sendMessage(recipients, text);
    setText("");
  };

  return (
    <Modal
      onClose={() => { app.closeComposer(); setText(""); }}
      labelledBy="composer-title"
    >
      <h3 className="modal-title" id="composer-title">Send a message</h3>
      <p className="modal-sub">To: {recipients.join(", ")}</p>
      <textarea
        className="message-area"
        rows={5}
        placeholder="Say hello and share what you'd like to talk about…"
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <button className="modal-submit" onClick={send} disabled={!text.trim()}>
        Send
      </button>
      <p className="modal-footer-text">
        Messages are private. Either side can end the conversation at any time.
      </p>
    </Modal>
  );
}
