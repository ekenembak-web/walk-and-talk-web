/**
 * Moderator console prototype data. Desktop web only. No backend — the handoff
 * treats moderation + safety as launch-blocking: reporting, blocking, crisis
 * escalation, and the second-moderator sign-off all need real endpoints and an
 * audit log.
 */

export type Queue = "escalations" | "reports" | "applications";

interface TranscriptMsg {
  who: string;
  from: "them" | "listener";
  text: string;
}

export interface QueueItem {
  id: string;
  queue: Queue;
  kind: string;
  who: string;
  listener: string;
  waitedMin: number;
  metaLine: string;
  snippet: string;
  transcript: TranscriptMsg[];
  // escalation
  listenerNote?: string;
  // report
  category?: string;
  priors?: string;
  // application
  username?: string;
  age?: string;
  city?: string;
  topics?: string;
  bio?: string;
}

export const ESCALATIONS: QueueItem[] = [
  {
    id: "e1",
    queue: "escalations",
    kind: "Escalation",
    who: "Milda",
    listener: "Gabija R.",
    waitedMin: 12,
    metaLine: "Burnout · listener conversation open 6 days",
    snippet: "Listener reports the person is counting pills.",
    listenerNote:
      "She told me she has been counting pills. She said it calmly, like it was a normal thing to say. I do not think I should be the only person who knows this.",
    transcript: [
      { who: "Milda", from: "them", text: "I think I have been pretending to be fine for about a year now." },
      { who: "Gabija R.", from: "listener", text: "That is a long time to hold something on your own." },
      { who: "Milda", from: "them", text: "I counted what is in the cabinet last night. I do not know why I am telling you this." },
      { who: "Gabija R.", from: "listener", text: "I am glad you did. I want to bring someone in who can help more than I can." },
    ],
  },
  {
    id: "e2",
    queue: "escalations",
    kind: "Escalation",
    who: "Someone",
    listener: "Tomas V.",
    waitedMin: 74,
    metaLine: "Grief · first conversation",
    snippet: "Ambiguous statement about wanting to join a deceased parent.",
    listenerNote:
      "He keeps saying he wants to see his father again, and that there is a way. I asked what he meant and he stopped replying. That was an hour ago.",
    transcript: [
      { who: "Someone", from: "them", text: "My father died in spring. I want to say his name to someone." },
      { who: "Tomas V.", from: "listener", text: "Say it as many times as you want. I am not going anywhere." },
      { who: "Someone", from: "them", text: "I want to see him again. There is a way to do that." },
      { who: "Tomas V.", from: "listener", text: "Can you tell me what you mean by that?" },
    ],
  },
];

export const REPORTS: QueueItem[] = [
  {
    id: "p1",
    queue: "reports",
    kind: "Report",
    who: "Account 4471",
    listener: "Gabija R.",
    waitedMin: 40,
    metaLine: "Reported during an open conversation",
    category: "Sexual or inappropriate",
    priors: "None",
    snippet: "Turned a support conversation sexual after two messages.",
    transcript: [
      { who: "Account 4471", from: "them", text: "You sound lovely. Do you do this in person?" },
      { who: "Gabija R.", from: "listener", text: "I am here to listen, nothing else. Please keep it to that." },
      { who: "Account 4471", from: "them", text: "Come on. What are you wearing right now?" },
    ],
  },
  {
    id: "p2",
    queue: "reports",
    kind: "Report",
    who: "Account 5120",
    listener: "Rasa M.",
    waitedMin: 190,
    metaLine: "Reported after first message",
    category: "I think they are a child",
    priors: "None",
    snippet: "Listener believes the person is under 16.",
    transcript: [
      { who: "Account 5120", from: "them", text: "my mum doesnt know i signed up. im in year 9" },
      { who: "Rasa M.", from: "listener", text: "Thank you for telling me. I need to pass this on to someone who can help properly." },
    ],
  },
];

export const APPLICATIONS: QueueItem[] = [
  {
    id: "a1",
    queue: "applications",
    kind: "Listener application",
    who: "Ieva Kazlauskaitė",
    listener: "—",
    waitedMin: 2880,
    metaLine: "Applied 2 days ago",
    username: "@ieva.k",
    age: "34",
    city: "Kaunas",
    topics: "Burnout, Job Loss",
    snippet: "Burnout, job loss. Two days waiting.",
    bio: "I burned out badly in 2023 and took eight months off work. What helped was not advice, it was a neighbour who walked with me most mornings and did not ask me to explain myself. I would like to be that for someone else. I am not trained in anything and I would not pretend to be.",
    transcript: [],
  },
  {
    id: "a2",
    queue: "applications",
    kind: "Host application",
    who: "Darius Šimkus",
    listener: "—",
    waitedMin: 5760,
    metaLine: "Applied 4 days ago",
    username: "@darius.s",
    age: "41",
    city: "Vilnius",
    topics: "Group walks, cycling",
    snippet: "Group walks and cycling in Vilnius. Four days waiting.",
    bio: "I organise a Saturday cycle group of about fifteen people and would like to open it up through Walk & Talk. Nobody has to talk. We ride, we stop for coffee, and some weeks people talk and some weeks they do not.",
    transcript: [],
  },
];

export const POOLS: Record<Queue, QueueItem[]> = {
  escalations: ESCALATIONS,
  reports: REPORTS,
  applications: APPLICATIONS,
};

export const APPLICATION_CHECKS = [
  { key: "peer", text: "Writes as a peer, not as a professional or a rescuer" },
  { key: "lived", text: "Describes their own experience, not someone else's" },
  { key: "settled", text: "Sounds settled enough in it to hold someone else's" },
  { key: "noflag", text: "Nothing suggesting recruiting, selling, or seeking connection" },
] as const;

export interface ActionDef {
  title: string;
  sub: string;
  btn: string;
  placeholder: string;
  foot: string;
  done: string;
  needsNote?: boolean;
  needsSecond?: boolean;
  clears?: boolean;
}

export const ACTION_DEFS: Record<string, ActionDef> = {
  contact: { title: "Contact them directly", needsNote: true, btn: "Open moderator channel", sub: "You take over the conversation. The listener steps back and is told you have it.", placeholder: "Your opening message to them. Plain, calm, no jargon.", foot: "They see this from Walk & Talk Moderation, not from the listener.", done: "Channel open. The listener has been told." },
  services: { title: "Involve emergency services", needsNote: true, needsSecond: true, btn: "Confirm and log", sub: "Use this when you believe someone is about to act. Call 112 first, then record it here.", placeholder: "What you told them, what time, and what they advised.", foot: "This record is permanent and may be disclosed. Both moderators are named on it.", done: "Logged. Both moderators recorded." },
  handback: { title: "Hand back to the listener", needsNote: true, btn: "Hand back", sub: "For when the conversation is safe to continue as peer support.", placeholder: "What the listener should know before they resume.", foot: "The listener may still decline to continue. That stands.", done: "Handed back with your note." },
  closeconv: { title: "Close the conversation", needsNote: true, btn: "Close for both", sub: "Ends it for both people. Both are told, and the listener is offered a debrief.", placeholder: "What both should be told. Keep it brief and non-blaming.", foot: "Neither is told what the other was told.", done: "Closed. Debrief offered to the listener." },
  suspend: { title: "Suspend the account", needsNote: true, btn: "Suspend", sub: "They lose access immediately and their open conversations are closed.", placeholder: "Grounds for suspension. This goes on file, not to them.", foot: "They are told they have been suspended, without the detail.", done: "Account suspended." },
  warn: { title: "Warn and record", needsNote: true, btn: "Record warning", sub: "One warning on file. A second report escalates automatically.", placeholder: "What they are being warned about.", foot: "They see the warning. The reporter is not named.", done: "Warning recorded." },
  minor: { title: "Suspected minor", needsNote: true, btn: "Freeze pending age check", sub: "Account frozen. Follows the safeguarding route rather than the reports route.", placeholder: "What led you to think this.", foot: "Policy gap: the onward reporting duty here is not yet settled. Flag to your safeguarding lead.", done: "Frozen and referred to safeguarding." },
  dismiss: { title: "No action needed", btn: "Dismiss report", sub: "The block stands. Nothing is recorded against the reported person.", placeholder: "Optional note for the file.", foot: "The person who reported is told it was reviewed, not what was decided.", done: "Report dismissed. The block stands." },
  approve: { title: "Approve this listener", needsNote: true, btn: "Approve", sub: "They go live in the directory and can start receiving requests.", placeholder: "Anything the next reviewer should know about this decision.", foot: "Approval is reversible. You can suspend at any time.", done: "Approved. They are live in the directory." },
  askmore: { title: "Ask for more", needsNote: true, btn: "Send request", clears: false, sub: "They stay pending and are asked for what you need.", placeholder: "Say plainly what you need from them, and why.", foot: "Nothing here is a test. Ask as you would ask a colleague.", done: "Sent. They remain pending." },
  reject: { title: "Not this time", needsNote: true, btn: "Decline application", sub: "They are told kindly, with a reason, and may reapply in six months.", placeholder: "The reason they will read. Honest, and without judgment of them as a person.", foot: "People apply because something happened to them. A cold rejection can do real harm.", done: "Application declined." },
};

export const QUEUE_COPY: Record<Queue, { title: string; emptyTitle: string; emptyBody: string }> = {
  escalations: {
    title: "Escalations",
    emptyTitle: "No open escalations",
    emptyBody: "This queue being empty is the goal, not a lull. Check the reports queue.",
  },
  reports: {
    title: "Reports",
    emptyTitle: "No open reports",
    emptyBody: "Nothing waiting.",
  },
  applications: {
    title: "Applications",
    emptyTitle: "No applications waiting",
    emptyBody: "Nothing waiting.",
  },
};

export const MODERATOR_NAME = "R. Petraitis";
export const SLA_MINUTES = 60;

export function waitedLabel(m: number): string {
  if (m < 60) return `${m} min`;
  if (m < 1440) return `${Math.round(m / 60)} hr`;
  return `${Math.round(m / 1440)} d`;
}
