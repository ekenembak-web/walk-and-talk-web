import type { Host, Listener } from "../lib/types";

/**
 * Prototype avatars point at i.pravatar.cc placeholders. They are stand-ins for
 * real headshots and must not ship — set STOCK_AVATARS to false and the
 * deterministic initials fallback takes over everywhere.
 */
export const STOCK_AVATARS = true;
const pravatar = (img: number) => (STOCK_AVATARS ? `https://i.pravatar.cc/400?img=${img}` : undefined);

export const LISTENERS: Listener[] = [
  {
    id: "amara-o",
    name: "Amara O.",
    city: "Lagos",
    language: "English",
    format: "Video call",
    rating: "4.9",
    bio: "Survived burnout and rebuilt slowly. Here to listen, not lecture.",
    topics: ["Burnout", "Job Loss"],
    avatar: pravatar(44),
    role: "Listener",
  },
  {
    id: "diego-r",
    name: "Diego R.",
    city: "Austin",
    language: "Spanish",
    format: "In-person walk",
    rating: "4.8",
    bio: "Went through a hard divorce. Walks help me think — maybe they’ll help you too.",
    topics: ["Relationships", "Loneliness"],
    avatar: pravatar(12),
    role: "Listener",
  },
  {
    id: "priya-n",
    name: "Priya N.",
    city: "Toronto",
    language: "English",
    format: "Chat",
    rating: "5.0",
    bio: "Parent of three. I understand the quiet exhaustion nobody talks about.",
    topics: ["Parenting", "Burnout"],
    avatar: pravatar(47),
    role: "Listener",
  },
  {
    id: "kwame-b",
    name: "Kwame B.",
    city: "London",
    language: "English",
    format: "Group circle",
    rating: "4.7",
    bio: "Anti-bullying advocate and survivor. Group spaces changed my life.",
    topics: ["Bullying Recovery", "Anxiety & Depression"],
    avatar: pravatar(33),
    role: "Listener",
  },
];

export const HOSTS: Host[] = [
  {
    id: "morgan-t",
    name: "Morgan T.",
    city: "Seattle",
    language: "English",
    format: "Group circle",
    rating: "4.9",
    bio: "Creates safe spaces for real, judgment-free conversations.",
    topics: ["Loneliness", "Anxiety & Depression"],
    avatar: pravatar(68),
    role: "Host",
    activity: "Evening Reset Circle",
    schedule: "Thursdays · 7:00–8:30pm",
    location: "Green Lake Community Room, Seattle",
    groupSize: "8 participants max",
    cost: "Free",
    requirements: ["18 or older", "Phones away for the full session", "Arrive within the first 10 minutes"],
    bring: "Nothing — seating and tea provided.",
  },
  {
    id: "yusuf-a",
    name: "Yusuf A.",
    city: "Nairobi",
    language: "English",
    format: "In-person walk",
    rating: "4.8",
    bio: "Leads phone-free morning walks along the ridge.",
    topics: ["Burnout", "Loneliness"],
    avatar: pravatar(15),
    role: "Host",
    activity: "Phone-Free Morning Walk",
    schedule: "Tuesdays & Saturdays · 6:30am",
    location: "Ridge trailhead, Karura, Nairobi",
    groupSize: "12 participants max",
    cost: "Free",
    requirements: [
      "Comfortable walking 5km on uneven ground",
      "Phones on silent and pocketed",
      "Weather-appropriate shoes",
    ],
    bring: "Water and a light jacket.",
  },
  {
    id: "lena-k",
    name: "Lena K.",
    city: "Berlin",
    language: "German",
    format: "Group circle",
    rating: "4.7",
    bio: "Hosts weekly reset circles for parents and carers.",
    topics: ["Parenting", "Burnout"],
    avatar: pravatar(26),
    role: "Host",
    activity: "Parents & Carers Reset Circle",
    schedule: "Wednesdays · 10:00–11:30am",
    location: "Kreuzberg family centre, Berlin",
    groupSize: "10 participants max",
    cost: "Free · childcare on site",
    requirements: ["Parents and carers only", "Register by the Monday before", "German or English spoken"],
    bring: "Nothing. Children welcome in the play room.",
  },
];

export const DIRECTORY: Listener[] = [...LISTENERS, ...HOSTS];

export interface CommunityMember {
  name: string;
  role: "Listener" | "Host";
  text: string;
  city: string;
}

export const COMMUNITY_MEMBERS: CommunityMember[] = [
  { name: "Amara, 29", role: "Listener", text: "Survived burnout and rebuilt slowly. Here to listen, not lecture.", city: "Lagos, NG" },
  { name: "Diego, 34", role: "Host", text: "Leads weekend sunset walks and phone-free reset circles.", city: "Austin, TX" },
  { name: "Priya, 31", role: "Listener", text: "Parent of three. Understands the quiet exhaustion nobody talks about.", city: "Toronto, CA" },
  { name: "Kwame, 27", role: "Host", text: "Organizes community talks and anti-bullying support circles.", city: "London, UK" },
  { name: "Riley, 26", role: "Listener", text: "Looking to connect and grow together, one walk at a time.", city: "Chicago, IL" },
  { name: "Morgan, 30", role: "Host", text: "Creating safe spaces for real, judgment-free conversations.", city: "Seattle, WA" },
];
