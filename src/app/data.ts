/**
 * Seeker-app data set. Kept local to the app shell because it diverges from the
 * web/mobile directory: app listeners carry no `language` field, and the app's
 * hosted activities (cycling / gamenight / sportsday) have their own hosts and
 * details. Unify with `src/data/people.ts` when the surfaces merge.
 */

export interface AppListener {
  id: string;
  name: string;
  city: string;
  format: string;
  rating: string;
  bio: string;
  topics: string[];
  role?: "Host";
  hostingSince?: string;
  eventsHosted?: string;
}

export const APP_LISTENERS: AppListener[] = [
  { id: "amara", name: "Amara O.", city: "Lagos", format: "Video call", rating: "4.9", bio: "Survived burnout and rebuilt slowly. Here to listen, not lecture.", topics: ["Burnout", "Job Loss"] },
  { id: "diego", name: "Diego R.", city: "Austin", format: "In-person walk", rating: "4.8", bio: "Went through a hard divorce. Walks help me think — maybe they’ll help you too.", topics: ["Relationships", "Loneliness"] },
  { id: "priya", name: "Priya N.", city: "Toronto", format: "Chat", rating: "5.0", bio: "Parent of three. I understand the quiet exhaustion nobody talks about.", topics: ["Parenting", "Burnout"] },
  { id: "kwame", name: "Kwame B.", city: "London", format: "Group circle", rating: "4.7", bio: "Anti-bullying advocate and survivor. Group spaces changed my life.", topics: ["Bullying Recovery", "Anxiety & Depression"] },
];

export const APP_HOSTS: AppListener[] = [
  { id: "morgan", name: "Morgan T.", city: "Seattle", format: "Group circle", rating: "4.9", role: "Host", hostingSince: "Hosting since 2022", eventsHosted: "48 rides hosted", bio: "Creates safe spaces for real, judgment-free conversations. Cycled competitively for a decade before switching to easy group rides.", topics: ["Loneliness", "Anxiety & Depression"] },
  { id: "lena", name: "Lena K.", city: "Berlin", format: "Group circle", rating: "4.7", role: "Host", hostingSince: "Hosting since 2023", eventsHosted: "31 nights hosted", bio: "Hosts weekly reset circles for parents and carers. Believes a card table is the easiest place to start talking.", topics: ["Parenting", "Burnout"] },
  { id: "yusuf", name: "Yusuf A.", city: "Nairobi", format: "In-person walk", rating: "4.8", role: "Host", hostingSince: "Hosting since 2021", eventsHosted: "62 events hosted", bio: "Leads phone-free morning walks along the ridge and a monthly sports day for all ages.", topics: ["Burnout", "Loneliness"] },
];

export const APP_DIRECTORY = [...APP_LISTENERS, ...APP_HOSTS];

export function findPerson(id: string): AppListener | undefined {
  return APP_DIRECTORY.find((p) => p.id === id);
}

export interface AppActivity {
  id: string;
  name: string;
  sub: string;
  img: string;
  hostId: string;
  schedule: string;
  location: string;
  groupSize: string;
  cost: string;
  requirements: string[];
  bring: string;
}

export const APP_ACTIVITIES: AppActivity[] = [
  {
    id: "cycling",
    name: "Group Cycling",
    sub: "Every Saturday · Riverside Park",
    img: "assets/host-cycling.jpg",
    hostId: "morgan",
    schedule: "Saturdays · 8:00–10:00am",
    location: "Riverside Park boathouse",
    groupSize: "15 participants max",
    cost: "Free",
    requirements: ["Own a roadworthy bike and helmet", "Comfortable riding 15km at an easy pace", "Arrive 10 minutes early for the safety brief"],
    bring: "Water, helmet, and a spare inner tube.",
  },
  {
    id: "gamenight",
    name: "Game Night",
    sub: "Weekly · Community hall",
    img: "assets/host-gamenight.jpg",
    hostId: "lena",
    schedule: "Fridays · 7:00–10:00pm",
    location: "Eastside community hall, room 2",
    groupSize: "20 participants max",
    cost: "Free · snacks shared",
    requirements: ["18 or older", "Register by Thursday evening", "No alcohol on site"],
    bring: "A board game or a snack to share, if you can.",
  },
  {
    id: "sportsday",
    name: "Sports Day",
    sub: "Monthly · Open field",
    img: "assets/host-sportsday.jpg",
    hostId: "yusuf",
    schedule: "First Sunday · 3:00–6:00pm",
    location: "Central open field, pitch 3",
    groupSize: "30 participants max",
    cost: "Free",
    requirements: ["All fitness levels welcome", "Under-16s need an adult present", "Sports shoes required on the pitch"],
    bring: "Water and a change of shirt.",
  },
];

export type MsgFrom = "me" | "them";
export interface AppMsg {
  from: MsgFrom;
  text: string;
}
export type Threads = Record<string, AppMsg[]>;

export const SEED_THREADS: Threads = {
  amara: [
    { from: "them", text: "Hi! Thanks for reaching out 💛" },
    { from: "me", text: "Of course — really appreciate you taking the time." },
  ],
  diego: [{ from: "them", text: "Ready for Saturday’s walk?" }],
  priya: [{ from: "them", text: "Let me know if the evening slot works for you." }],
};

export const APP_TOPICS = [
  "Anxiety & Depression",
  "Loneliness",
  "Grief",
  "Burnout",
  "Relationships",
  "Parenting",
  "Job Loss",
  "Bullying Recovery",
];

export const APP_FORMATS = ["Any", "Chat", "Video call", "In-person walk", "Group circle"];

export const HOW_STEPS = [
  { num: "01", title: "Create Your Profile", text: "Sign up easily to join our community." },
  { num: "02", title: "Share Your Story", text: "Get full attention, encouragement, and support." },
  { num: "03", title: "Get Free Counseling", text: "Express your thoughts and feelings in a safe space." },
  { num: "04", title: "Stay Connected", text: "Keep the support going with check-ins and community events." },
];

export const ABOUT_VALUES = [
  { title: "Vulnerability as strength", text: "Speaking up and asking for support takes courage, not weakness." },
  { title: "Judgment-free listening", text: "Every listener agrees to hear without labeling or lecturing." },
];
