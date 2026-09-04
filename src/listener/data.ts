/**
 * Listener-side prototype data. Shared by all three listener chromes
 * (web / mobile / app). No backend — see the handoff "Backend requirements":
 * requests, conversation threads, escalation + debrief, peer feed, and the
 * listener's own limits all need real endpoints.
 */

export interface ListenerRequest {
  id: string;
  seeker: string;
  topic: string;
  format: string;
  ago: string;
  note: string;
}

export const REQUESTS: ListenerRequest[] = [
  {
    id: "r1",
    seeker: "Rasa",
    topic: "Loneliness",
    format: "In-person walk",
    ago: "2h ago",
    note: "I moved to Vilnius three months ago and I have not really spoken to anyone since. A walk sounds easier than sitting across from someone.",
  },
  {
    id: "r2",
    seeker: "Tomas",
    topic: "Job Loss",
    format: "Video call",
    ago: "5h ago",
    note: "Made redundant in June. I am fine talking about it, I just want someone who is not family.",
  },
  {
    id: "r3",
    seeker: "Someone",
    topic: "Grief",
    format: "Chat",
    ago: "1d ago",
    note: "My father died in spring. I do not want advice. I want to say his name to someone.",
  },
];

export type MsgFrom = "me" | "them";
export interface ChatMsg {
  from: MsgFrom;
  text: string;
}
export interface ListenerChat {
  id: string;
  seeker: string;
  topic: string;
  unread: number;
  messages: ChatMsg[];
}

export const SEED_CHATS: ListenerChat[] = [
  {
    id: "c1",
    seeker: "Milda",
    topic: "Burnout",
    unread: 2,
    messages: [
      { from: "them", text: "Thank you for accepting. I did not really expect anyone to." },
      { from: "me", text: "I am here. No rush — start wherever you want." },
      { from: "them", text: "I think I have been pretending to be fine for about a year now." },
    ],
  },
  {
    id: "c2",
    seeker: "Jonas",
    topic: "Relationships",
    unread: 0,
    messages: [
      { from: "them", text: "Same time next week?" },
      { from: "me", text: "Yes. Wednesday works for me." },
    ],
  },
];

export interface PeerPost {
  id: string;
  who: string;
  when: string;
  text: string;
  likes: number;
}

export const SEED_PEER_POSTS: PeerPost[] = [
  { id: "p1", who: "Tomas V.", when: "2h ago", text: "First week back after an escalation. Went fine but I kept checking my phone all evening expecting bad news. Anyone else do that?", likes: 4 },
  { id: "p2", who: "Ieva K.", when: "1d ago", text: "Reminder that declining is allowed. Turned down two requests this week, both just topics I could not hold right now, and nothing bad happened.", likes: 9 },
  { id: "p3", who: "Rasa M.", when: "3d ago", text: 'Had someone thank me for "not trying to fix it." That is the whole job I think.', likes: 12 },
];

export interface Debrief {
  id: string;
  seeker: string;
  closedAgo: string;
  outcome: string;
}

export const SEED_DEBRIEFS: Debrief[] = [
  {
    id: "d1",
    seeker: "Rasa",
    closedAgo: "closed 2 hours ago",
    outcome:
      "A moderator took over and spoke to her directly. She is safe. She has agreed to call Vilties linija this week and asked us to thank you.",
  },
];

export const DECLINE_REASONS = [
  { key: "topic", title: "Not a topic I can hold", body: "They are told you were not the right fit, and are shown other listeners." },
  { key: "capacity", title: "I am full right now", body: "They are told you are at capacity, not that you chose against them." },
  { key: "break", title: "I need a break", body: "They are told the same as above. No detail about you is shared." },
  { key: "unsafe", title: "Something felt wrong", body: "They are given a neutral message. A moderator reviews the request privately." },
  { key: "custom", title: "Write my own message", body: "They receive exactly what you write, and nothing else." },
] as const;

export const REPORT_REASONS = [
  { key: "abuse", title: "Abusive or threatening" },
  { key: "sexual", title: "Sexual or inappropriate" },
  { key: "minor", title: "I think they are a child" },
  { key: "other", title: "Something else" },
] as const;

export const CRISIS_LINES = [
  { name: "Vilties linija", who: "Emotional support, adults", number: "116 123", hours: "24/7" },
  { name: "Jaunimo linija", who: "Young people", number: "8 800 28888", hours: "24/7" },
  { name: "Vaikų linija", who: "Children and teenagers", number: "116 111", hours: "11:00–23:00" },
  { name: "Pagalbos moterims linija", who: "Women, including violence", number: "8 800 66366", hours: "24/7" },
];

export interface FeelOption {
  key: string;
  title: string;
  reply: string;
  actions: { label: string; kind: "primary" | "ghost"; action: string }[];
}
export const FEEL_OPTIONS: FeelOption[] = [
  {
    key: "okay",
    title: "I am okay",
    reply: "Good. Nothing more is needed from you, though it is still worth stopping for today.",
    actions: [{ label: "Close this", kind: "ghost", action: "finish" }],
  },
  {
    key: "shaken",
    title: "A bit shaken",
    reply: "That is the ordinary response to holding something heavy. You do not have to be over it to be fine.",
    actions: [
      { label: "Pause new requests", kind: "primary", action: "pause" },
      { label: "Crisis resources", kind: "ghost", action: "crisis" },
      { label: "Close this", kind: "ghost", action: "finish" },
    ],
  },
  {
    key: "talk",
    title: "I need to talk to someone",
    reply: "A moderator will reach out today. Your requests are paused until you say otherwise.",
    actions: [
      { label: "Ask a moderator to reach out", kind: "primary", action: "support" },
      { label: "Crisis resources", kind: "ghost", action: "crisis" },
    ],
  },
];

/** Draft copy — pending professional review (SAFETY-COPY-DRAFT.md). */
export const LISTENER_DOCS: Record<string, { title: string; blocks: { head: string; body: string }[] }> = {
  guidelines: {
    title: "Community guidelines",
    blocks: [
      { head: "You are a peer, not a therapist", body: 'You are here because you have been through something and can sit with someone who is going through it now. You are not expected to diagnose, treat, or fix. Saying "I do not know" is a complete answer.' },
      { head: "Listen more than you advise", body: "Most people who reach out have already been given plenty of advice. What they are short of is someone who will hear it without flinching or rushing them to a solution." },
      { head: "Keep what is said here", body: "Do not repeat anything from a conversation outside the platform, including anonymised. The only exception is escalating to a moderator when someone may be in danger." },
      { head: "No money, no romance, no recruiting", body: "Do not accept or offer payment, pursue a romantic connection, or use a conversation to promote a business, service, or belief." },
      { head: "Stop when you need to", body: "You may end any conversation at any point without giving a reason. Doing so is not a failure and carries no penalty." },
    ],
  },
  safety: {
    title: "Safety policy",
    blocks: [
      { head: "What this platform is not", body: "Walk & Talk is peer support. It is not therapy, counselling, crisis intervention, or medical care, and it does not replace them." },
      { head: "When to escalate", body: "Escalate to a moderator if someone describes a plan to harm themselves or another person, discloses ongoing abuse, appears to be a child, or asks for help you are not equipped to give." },
      { head: "Immediate danger", body: "If you believe someone is about to act, call 112 first. Then escalate here so a moderator can follow up. Do not wait to see whether the conversation resolves." },
      { head: "Every listener is reviewed", body: "Applications are read by a person before a listener goes live. Listeners can be removed at any time, and reports are reviewed by a trained moderator." },
      { head: "Your own limits", body: "You set how many conversations you hold at once and can pause new requests without notice or explanation. Nobody is told you paused." },
    ],
  },
};

export const LISTENER_NAME = "Gabija R.";
