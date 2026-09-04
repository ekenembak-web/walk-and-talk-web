import type { CSSProperties } from "react";
import { avatarUri } from "../lib/avatar";

export function Avatar({ name, size }: { name: string; size: number }) {
  return (
    <div
      className="l-avatar"
      role="img"
      aria-label={name}
      style={{ width: size, height: size, backgroundImage: `url(${avatarUri(name)})` } as CSSProperties}
    />
  );
}

export function preview(m: { from: "me" | "them"; text: string } | undefined): string {
  if (!m) return "No messages yet";
  return m.from === "me" ? `You: ${m.text}` : m.text;
}
