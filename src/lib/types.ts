export type Format = "Video call" | "In-person walk" | "Chat" | "Group circle";

export const TOPICS = [
  "Anxiety & Depression",
  "Loneliness",
  "Grief",
  "Burnout",
  "Relationships",
  "Parenting",
  "Job Loss",
  "Bullying Recovery",
  "Faith",
  "Other",
] as const;

export type Topic = (typeof TOPICS)[number];

export interface Listener {
  id: string;
  name: string;
  city: string;
  language: string;
  format: Format;
  rating: string;
  bio: string;
  topics: string[];
  avatar?: string;
  role: "Listener" | "Host";
}

export interface Host extends Listener {
  role: "Host";
  hostingSince?: string;
  eventsHosted?: number;
  activity: string;
  schedule: string;
  location: string;
  groupSize: string;
  cost: string;
  requirements: string[];
  bring: string;
}

export interface ThreadMsg {
  from: "me" | "them";
  text: string;
  when: string;
}

export interface Conversation {
  name: string;
  last: string;
  when: string;
  unread: boolean;
  /** Full message history, oldest first. Older conversations persisted before
   *  this field existed may not have it — treat as `[]` when reading. */
  messages: ThreadMsg[];
}

export interface ListenerApplication {
  name: string;
  username: string;
  age: string;
  email: string;
  city: string;
  language: string;
  bio: string;
  topics: string[];
  otherTopics?: string;
  photo: string;
  agree: boolean;
}

export interface HostApplication {
  name: string;
  username: string;
  email: string;
  city: string;
  capacity: string;
  eventType: string;
  otherEventType?: string;
  description: string;
  photo: string;
  agree: boolean;
}
