# Walk&Talk — Backend API spec

This is a build target, not a description of anything that exists. The app today
is frontend-only; every screen reads through `src/data/api.ts`, which returns
mock data. This document turns the handoff's *Backend requirements* plus the
three role surfaces into a concrete API a developer can build.

Nothing here is settled infrastructure — it is a starting shape. Pick the stack
(a Node/Postgres API, Supabase, Firebase, …) separately; the contract below is
stack-agnostic.

---

## 0. Ground rules from the product

- **One account system, three roles.** A user may hold more than one of
  `seeker` / `listener` / `moderator`. After login the client shows the surface
  for the account's role(s). Roles are server-assigned, never client-claimed.
- **Browsing is open.** Every read endpoint that powers directory browsing,
  activity detail, and policy content is public (or works unauthenticated). Auth
  is required only at the point of commitment — see each endpoint.
- **Minimum data.** Store an email + password hash for the account; display
  name, language, topics for a profile; age + optional photo only on a listener
  application; messages for a conversation; time + place for an activity. That
  is the whole list (handoff, *Privacy*).
- **Conversations are private.** No indexing, mining, or training on message
  content. The only reader outside a conversation is a moderator handling an
  escalation or report.
- **Audit log.** Every moderator decision, every escalation, every account
  state change is an append-only record. Some records (emergency-services
  involvement, safeguarding referrals) are permanent and may be disclosed.

---

## 1. Auth & sessions

| Method | Path | Auth | Body | Returns |
| --- | --- | --- | --- | --- |
| `POST` | `/auth/signup` | — | `{ name, email, password, dob }` | `{ user, session }` — sets an httpOnly session cookie |
| `POST` | `/auth/login` | — | `{ email, password }` | `{ user, session }` |
| `POST` | `/auth/logout` | session | — | `204` |
| `GET` | `/auth/me` | session | — | `{ user }` or `401` |

`user`: `{ id, displayName, email, roles: ("seeker"|"listener"|"moderator")[], language }`

Rules:
- **Age gate.** Signup requires `dob`; reject under-18 (the client already
  computes age and shows LT youth-line numbers — the server must enforce it).
- **Username uniqueness.** Applications collect a `username`; it must be unique.
  It is collected but unvalidated in the prototype.
- Password: hash with argon2id/bcrypt. Rate-limit login.
- `signup` maps to `api.signup`, `login` to `api.login`. Both currently return
  only `{ userName, email }` — extend to the full `user` above.

### Resume-after-signup

The client records an *intent* before opening the auth modal and replays it on
success (send the pending message, submit the pending application, open the
pending thread, …). This is **client-only** — the server just needs signup/login
to be fast and to return the session synchronously.

---

## 2. Directory (seeker: Find a Listener)

| Method | Path | Auth | Query | Returns |
| --- | --- | --- | --- | --- |
| `GET` | `/listeners` | — | `topic`, `format`, `language`, `page` | `{ items: Listener[], nextPage }` |
| `GET` | `/listeners/:id` | — | — | `Listener` (full profile) |

`Listener`: `id, name, city, language, format, rating, bio, topics[], avatarUrl?, role`
`Host` = `Listener` + `hostingSince, eventsHosted, activity, schedule, location, groupSize, cost, requirements[], bring`

- `format` ∈ `Video call | In-person walk | Chat | Group circle`.
- Only **approved, live, not-paused** listeners appear. A paused listener is
  hidden from results but keeps their open conversations.
- Maps to `api.getListeners`, `api.getPerson`.
- **Unify the model:** the app surface's listener records currently omit
  `language`; the web/mobile ones include it. One schema, `language` always
  present (handoff known gap #6).

---

## 3. Listener applications

| Method | Path | Auth | Body | Returns |
| --- | --- | --- | --- | --- |
| `POST` | `/applications/listener` | session | `ListenerApplication` | `{ id, status: "pending" }` |
| `GET` | `/applications/listener/mine` | session | — | `{ status, submittedAt, reviewer?, askedFor? }` |

`ListenerApplication`: `name, username, age, email, city, language, bio, topics[], otherTopics?, photoUpload?, agree`

- Required: `name`, `username`, `age` (digits, ≤3), `agree`. Server re-validates.
- On submit: persist, enter the **moderation `applications` queue**, email the
  applicant a confirmation.
- `status` ∈ `pending | approved | rejected | needs-more`. `needs-more` carries
  the moderator's `askedFor` text; the applicant can resubmit.
- Rejected applicants may reapply after **6 months** (enforce server-side).
- Drives the listener-side *Application pending* screen (`?status=pending`).
- Maps to `api.submitListenerApplication`.

---

## 4. Host applications & activities

| Method | Path | Auth | Body | Returns |
| --- | --- | --- | --- | --- |
| `POST` | `/applications/host` | session | `HostApplication` | `{ id, status: "pending" }` |
| `GET` | `/activities` | — | `page` | `{ items: Activity[], nextPage }` |
| `GET` | `/activities/:id` | — | — | `Activity` + `host` summary |
| `POST` | `/activities/:id/spot-requests` | session | `{ note? }` | `{ id, status: "pending" }` — **capacity-enforced** |
| `GET` | `/activities/mine` | session (host) | — | `Activity` + `spotRequests[]` |
| `POST` | `/activities/mine/spot-requests/:id` | session (host) | `{ decision: "approve"\|"decline" }` | updated request |
| `PATCH` | `/activities/mine` | session (host) | `{ schedule?, location?, groupSize?, cost? }` | `Activity` |

`HostApplication`: `name, username, email, city, capacity, eventType, otherEventType?, description, photoUpload?, agree`
`Activity`: `id, title, sub, imgUrl, hostId, date, schedule, location, participantCount, capacity, requirements[], cost, bring`

- Required on the application: `name`, `username`, `agree`. `capacity` 2–100.
- **Capacity is enforced here** — the prototype only displays it. Reject a spot
  request when `participantCount >= capacity`.
- Host applications also enter the `applications` moderation queue.
- Maps to `api.submitHostApplication`; the app's `MyActivitySheet` / mobile
  `MyActivity` drive `/activities/mine`.

---

## 5. Messaging (threads)

| Method | Path | Auth | Body | Returns |
| --- | --- | --- | --- | --- |
| `GET` | `/threads` | session | — | `{ items: ThreadSummary[] }` (unread counts, last message) |
| `GET` | `/threads/:id` | session (participant) | `since?` | `{ messages: Message[], participants }` |
| `POST` | `/threads` | session | `{ to: userId[], body }` | `{ threadId }` — first message creates the thread |
| `POST` | `/threads/:id/messages` | session (participant) | `{ body }` | `Message` |
| `POST` | `/threads/:id/read` | session | — | `204` |
| `POST` | `/threads/:id/end` | session (participant) | — | `204` — either side may end, no reason |

`Message`: `{ id, threadId, from: userId, body, sentAt }`

- **A seeker starting a thread is a request, not a delivered message.** The
  listener sees it in their *Requests* queue and must **accept** before the
  thread is live and the seeker can send more (see §6). Model the pre-accept
  state as `thread.status = "requested"`.
- Web composer is single-recipient; mobile composer allows several recipients
  (`to` is an array). Each recipient gets a separate thread.
- Real-time delivery (WebSocket / SSE) for unread badges and live messages;
  polling is acceptable for v1.
- Replaces `api.sendMessage` (which currently fakes a canned reply).

---

## 6. Listener side

### Requests

| Method | Path | Auth | Body | Returns |
| --- | --- | --- | --- | --- |
| `GET` | `/listener/requests` | session (listener) | — | `{ items: Request[] }` — hidden entirely while paused |
| `POST` | `/listener/requests/:id/accept` | session (listener) | — | `{ threadId }` — **fails if at cap** |
| `POST` | `/listener/requests/:id/decline` | session (listener) | `{ reason, message? }` | `204` |

`reason` ∈ `topic | capacity | break | unsafe | custom`.
- `unsafe` → the request is also sent to the moderation `reports` queue.
- `custom` → the seeker receives exactly `message`.
- Declining is **never counted, ranked, or shown**. Do not store it as a
  listener metric.

### Limits

| Method | Path | Auth | Body |
| --- | --- | --- | --- |
| `PATCH` | `/listener/settings` | session (listener) | `{ conversationCap?: 1..8, paused?: boolean }` |

- `paused` hides the listener from the directory and stops new requests.
  **Nobody is told.** Open conversations are unaffected.
- At `conversationCap`, `accept` returns `409`.

### Conversation actions (in a thread)

| Method | Path | Body |
| --- | --- | --- |
| `POST` | `/threads/:id/escalate` | `{ note }` → moderation `escalations` queue; notify a moderator |
| `POST` | `/threads/:id/report` | `{ category }` → `reports` queue; the other party is blocked immediately |

`report` categories: `abusive | sexual | minor | other`.

### Escalation debrief

After a moderator closes an escalated conversation, the listener is offered a
debrief.

| Method | Path | Body |
| --- | --- | --- |
| `GET` | `/listener/debriefs` | — → `[{ id, seeker, closedAgo, outcome }]` (unread) |
| `POST` | `/listener/debriefs/:id` | `{ feeling: "okay"\|"shaken"\|"talk", action?: "pause"\|"support"\|"finish" }` |

- `support` → open a moderator support request and pause the listener.
- The listener's feeling/answers are **never shown to anyone they talk to**.

### Peer feed (listeners only — seekers never see this)

| Method | Path | Auth | Body |
| --- | --- | --- | --- |
| `GET` | `/listener/peer-posts` | session (listener) | — |
| `POST` | `/listener/peer-posts` | session (listener) | `{ body }` |
| `POST` | `/listener/peer-posts/:id/like` | session (listener) | toggle |

---

## 7. Moderator console

Roles-gated to `moderator`. All three queues are the same shape.

| Method | Path | Returns |
| --- | --- | --- |
| `GET` | `/moderation/escalations` | `{ items }` — sorted by wait time; flag `> slaMinutes` |
| `GET` | `/moderation/reports` | `{ items }` |
| `GET` | `/moderation/applications` | `{ items }` |
| `GET` | `/moderation/:queue/:id` | full item incl. conversation transcript |
| `POST` | `/moderation/:queue/:id/decision` | `{ action, note, secondModeratorId? }` → `204` |

**Actions** (each records an audit-log entry; `note` required unless marked):

| Queue | Action | Notes |
| --- | --- | --- |
| escalations | `contact` | moderator takes over the thread; listener told |
| escalations | `services` | **requires `secondModeratorId`**; permanent record; call 112 first |
| escalations | `handback` | returns thread to the listener with a note |
| escalations | `close` | ends thread for both; offers the listener a debrief |
| reports | `suspend` | immediate loss of access; open threads closed |
| reports | `warn` | one warning on file; 2nd report auto-escalates |
| reports | `minor` | freeze pending age check → safeguarding route (**policy gap: onward-reporting duty unsettled**) |
| reports | `dismiss` | note optional; block stands, nothing recorded against them |
| applications | `approve` | listener goes live in the directory (reversible) |
| applications | `askmore` | stays pending; does **not** clear the queue item |
| applications | `reject` | kind reason sent; 6-month reapply lock |

- **Second moderator:** `services` must name a colleague; both are recorded on
  the decision and the colleague is notified. Real flow: notification +
  acceptance, not a free-text name (the prototype's field is a placeholder).
- SLA: `slaMinutes` (prototype default 60) — escalations past it are surfaced
  first and flagged red.

---

## 8. Favorites (seeker)

| Method | Path | Auth | Body |
| --- | --- | --- | --- |
| `GET` | `/favorites` | session | — → `listenerId[]` |
| `PUT` | `/favorites/:listenerId` | session | — (idempotent add) |
| `DELETE` | `/favorites/:listenerId` | session | — |

Per-user, server-persisted (the app currently uses `localStorage`).

---

## 9. Image upload

| Method | Path | Auth | Body | Returns |
| --- | --- | --- | --- | --- |
| `POST` | `/uploads` | session | multipart file (`image/*`) | `{ url }` |

- Used for listener profile photos and activity photos. The client currently
  previews a `FileReader` data URL and sends it inline; switch to: upload first,
  then submit the returned `url` on the application.
- Validate type + size server-side; strip EXIF; scan.
- Prototype avatars are `i.pravatar.cc` placeholders (`STOCK_AVATARS` in
  `src/data/people.ts`) — replace with real headshots. The deterministic
  initials avatar (`src/lib/avatar.ts`) stays as the no-photo fallback.

---

## 10. Policy content

| Method | Path | Auth |
| --- | --- | --- |
| `GET` | `/content/:doc` | — |

`doc` ∈ `safety | privacy | guidelines`.

**Launch-blocking:** this copy is scaffolding from `SAFETY-COPY-DRAFT.md` and
must be written and signed off by someone with a safeguarding or counselling
background before it ships. There is also **no crisis-escalation path** behind
the "escalate" / "get urgent help" buttons yet — §6 and §7 describe the flow the
UI promises; none of it is built.

Crisis lines (`src/listener/data.ts`) are Lithuania-only and must be verified
with each service and re-verified quarterly. Global expansion detects country
and shows that market's verified lines, or emergency services only.

---

## 11. Client seam — what maps where

| `src/data/api.ts` | Endpoint |
| --- | --- |
| `getListeners(q)` | `GET /listeners` |
| `getPerson(name)` | `GET /listeners/:id` (switch lookups from name → id) |
| `submitListenerApplication(app)` | `POST /applications/listener` |
| `submitHostApplication(app)` | `POST /applications/host` |
| `sendMessage(to, body)` | `POST /threads` / `POST /threads/:id/messages` |
| `signup(input)` / `login(input)` | `POST /auth/signup` / `POST /auth/login` |

The listener and moderator providers (`src/listener/`, `src/moderator/`) hold
their state in memory with seed data in their `data.ts` files — those become the
§6 and §7 endpoints.

`requireAccountToBrowse` (prop on `<AppProvider>` in `App.tsx`, default `false`)
flips the whole app to fully-gated browsing for an A/B test — keep the flag if
that decision is still open, drop it if settled.
