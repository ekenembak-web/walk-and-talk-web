/**
 * Data-access layer.
 *
 * The prototype hardcodes every array and never makes a request. This module is
 * the single seam where a real backend drops in: every screen calls these
 * functions, none of them touch `DIRECTORY` / mock arrays directly. Swap the
 * bodies for `fetch(...)` calls and the UI is unchanged.
 *
 * See the handoff "Backend requirements" section for what each of these needs
 * server-side (auth, moderation queue, capacity enforcement, image upload, ...).
 */
import { DIRECTORY } from "./people";
import type {
  Format,
  HostApplication,
  Listener,
  ListenerApplication,
} from "../lib/types";

const latency = () => new Promise((r) => setTimeout(r, 220));

export interface DirectoryQuery {
  topic?: string; // "All" or a Topic
  format?: string; // "Any" or a Format
}

export async function getListeners(q: DirectoryQuery = {}): Promise<Listener[]> {
  await latency();
  const topic = q.topic && q.topic !== "All" ? q.topic : null;
  const format = q.format && q.format !== "Any" ? (q.format as Format) : null;
  return DIRECTORY.filter((l) => {
    const topicOk = !topic || l.topics.includes(topic);
    const formatOk = !format || l.format === format;
    return topicOk && formatOk;
  });
}

export async function getPerson(name: string): Promise<Listener | undefined> {
  await latency();
  return DIRECTORY.find((l) => l.name === name);
}

export interface SubmitResult {
  ok: true;
  id: string;
}

export async function submitListenerApplication(
  app: ListenerApplication,
): Promise<SubmitResult> {
  await latency();
  // TODO(backend): persist, enter moderation queue, email confirmation.
  console.info("[mock] listener application", app);
  return { ok: true, id: `listener-app-${Date.now()}` };
}

export async function submitHostApplication(
  app: HostApplication,
): Promise<SubmitResult> {
  await latency();
  // TODO(backend): persist + activity photo upload + moderation queue.
  console.info("[mock] host application", app);
  return { ok: true, id: `host-app-${Date.now()}` };
}

const CANNED_REPLIES = [
  "Thanks for reaching out — I have time this week.",
  "Happy to listen. What time suits you?",
  "Got your note. Want to start with a walk?",
];

export async function sendMessage(
  _to: string,
  _body: string,
): Promise<{ reply: string }> {
  await latency();
  // TODO(backend): create/append thread, deliver, unread state, allow decline.
  const reply = CANNED_REPLIES[Math.floor(Math.random() * CANNED_REPLIES.length)];
  return { reply };
}

export interface AuthResult {
  userName: string;
  email: string;
}

export async function signup(input: {
  name: string;
  email: string;
  password: string;
}): Promise<AuthResult> {
  await latency();
  // TODO(backend): real auth, unique username, session cookie.
  const first = (input.name || "").trim().split(/\s+/)[0] || "";
  return { userName: first, email: input.email };
}

export async function login(input: {
  email: string;
  password: string;
}): Promise<AuthResult> {
  await latency();
  return { userName: "", email: input.email };
}
