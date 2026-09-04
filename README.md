# Walk&Talk

React implementation of **all seven** Walk&Talk designs from the handoff — the
three seeker surfaces, the three listener surfaces, and the moderator console —
as one codebase with role-based routing.

## Routes (role-based, per the handoff)

`src/App.tsx`:

| Path | Shell |
| --- | --- |
| `/*` | seeker website — `WebShell` picks desktop/mobile by viewport (768px) |
| `/app/*` | seeker native-style app (5-tab + bottom sheets) |
| `/listener/*` | listener web + mobile — one responsive shell |
| `/listener/app/*` | listener native-style app (4-tab bar) |
| `/moderator/*` | moderator console (desktop web, 3 queues, list/detail split) |

`/listener?status=pending` shows the application-pending screen.

## Seeker: three shells, one core

`WebShell` splits by viewport (`useIsMobile`, 768px):

- **`src/desktop/`** — persistent header, 9 pages, `Walk&Talk.dc.html`
- **`src/mobile/`** — hamburger drawer, 11 pages, home is the welcome screen,
  `#get-involved` lives on `/explore` (not `/`), community cards are
  display-only, `Walk&Talk Mobile.dc.html`
- **`src/app/`** — 5-tab bottom bar (Home / Find / Messages / Favorites /
  Profile), everything secondary in a bottom sheet, threaded chat, favorites,
  guest profile state, `Walk&Talk App.dc.html`. Own tab+sheet navigation and
  own auth sheet (`AppShellProvider`), but shares theme + auth (`signedIn`,
  `userName`, `completeAuth`) with the global store. Full-bleed on a phone, in a
  device frame ≥620px. Styles scoped under `.a-shell` in `src/app/app.css`.

All shells share `src/lib`, `src/data`, `src/state`, `src/styles/tokens.css`.
The web/mobile shells also share the modal components (`AuthModal`,
`ComposerModal`, `ProfileModal`, `PhotoField`); mobile styles live under
`.m-shell` in `src/styles/mobile.css`.

## Listener: one screen set, three chromes

`src/listener/` — the four screens (Requests / Conversations / Peers / You) plus
six modals (decline · debrief · escalate · block&report · crisis · policy doc)
are written once; the chrome varies:

- **`ListenerWebShell`** — sticky top nav ≥768px, hamburger drawer below.
  Conversations = list/detail **split** on the web, full-screen **overlay** on
  mobile.
- **`ListenerAppShell`** — bottom **4-tab bar** in a device frame; Conversations
  is always a full-screen overlay (tab bar hides inside a thread).

`ListenerProvider` holds all state (requests, threads, cap/paused, peer feed,
debrief, every modal). Theme comes from the global store's `useApp()`. Styles
scoped under `.l-shell` (`.l-web` / `.l-mobile` / `.l-app`) in
`src/listener/listener.css`. No account gating — the listener side is
post-approval; `status="pending"` swaps in the review-pending screen.

## Moderator: one desktop console

`src/moderator/` — sticky nav over three queue tabs, a `380px 1fr` list/detail
split. `ModeratorProvider` holds the queue, selection, resolved set, the
application checklist, and the action-modal state; `ACTION_DEFS` in `data.ts` is
the table of eleven decisions (each with its own copy, whether it needs a note,
whether it needs a **second moderator**, and whether it clears the item).
Escalations sort by wait time and flag anything past the `SLA_MINUTES` promise.
Scoped under `.mod-shell`.

## Stack

- **Vite + React 19 + TypeScript**
- **React Router 7** for the 9 routes (the prototype's single `page` string)
- Plain CSS with custom properties for the design tokens — no UI framework, so
  the token table maps 1:1 to `src/styles/tokens.css`

## Run

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # tsc -b && vite build
```

## Deploy

Static SPA — any static host works. `vercel.json` ships an SPA rewrite so deep
links (`/app`, `/listener`, `/moderator`, …) survive a refresh. On Vercel:
*Add New → Project → import the repo*, framework preset **Vite**, no other
config. Every push to `main` redeploys.

## Backend

There is none — every screen reads through `src/data/api.ts` (mock data). The
API a real build needs is specced in [`docs/BACKEND.md`](docs/BACKEND.md).

## Layout

```
src/
  styles/
    tokens.css        semantic tokens, light + dark (matches the handoff table)
    global.css        reset, typography, shared atoms (buttons, chips, cards, forms)
    components.css     nav, footer, welcome, modal, profile modal
    pages.css          hero, community grid, become banner, find grid, messages, host, ...
  lib/
    types.ts           Listener / Host / Conversation / applications + TOPICS
    avatar.ts          deterministic initials-avatar data URI (paren-escaped)
  data/
    content.ts         static editorial copy (values, privacy, guidelines, steps)
    people.ts          mock listeners + hosts + community members
    api.ts             *** data-access seam — swap these bodies for fetch() ***
  state/
    store.tsx          AppProvider: theme, auth, account gating + resume intents,
                       conversations, language
  components/          Header, Footer, WelcomeOverlay, Modal, AuthModal,
                       ComposerModal, ProfileModal, PhotoField, Logo, icons
  pages/               Home, About, Find, BecomeListener, BecomeHost, Safety,
                       Messages, Privacy, Guidelines
  mobile/              MobileShell + 11 mobile pages + drawer/footer
  app/
    AppProvider.tsx     AppShellProvider: tabs, sheets, threads, favorites,
                        spot requests, app-specific gating + auth sheet
    AppShell.tsx        device frame + header + tab bar + all sheets + welcome
    Sheet.tsx           bottom-sheet primitive (Esc / backdrop dismiss)
    data.ts             app-local data (no `language` on listeners; own activities)
    tabs/               HomeTab, FindTab, MessagesTab, FavoritesTab, ProfileTab
    sheets/             Activity, Profile, MyActivity, Host, Listener, Info×5, Auth
    app.css             everything scoped under .a-shell
  listener/
    ListenerProvider.tsx  all listener state + actions
    ListenerWebShell.tsx  sticky nav / drawer by viewport
    ListenerAppShell.tsx  4-tab bottom bar in a device frame
    ListenerModals.tsx    decline / debrief / escalate / report / crisis / doc
    data.ts               requests, threads, peer posts, debrief, crisis lines, docs
    screens/              Pending, Requests, Conversations(+View), Peers, You
    listener.css          scoped under .l-shell (.l-web / .l-mobile / .l-app)
  moderator/
    ModeratorProvider.tsx  queue / selection / resolved / checklist / action modal
    ModeratorConsole.tsx   nav + list/detail split + toast
    details.tsx            EscalationDetail / ReportDetail / ApplicationDetail
    ActionModal.tsx        the shared decision modal (note + optional 2nd moderator)
    data.ts                queue items, ACTION_DEFS (11), application checks
    moderator.css          scoped under .mod-shell
public/assets/         section + activity photography (licensed stock — verify
                       before release)
```

## What works

- **Welcome overlay** — first visit only, dismissal persisted (`localStorage`)
- **Theme** — light/dark, follows OS by default, toggle persisted
- **Account gating** — browsing is open; an account is required at the point of
  commitment (message, application submit, Messages nav). `requireAccount()` in
  `store.tsx` records a resume closure and runs it after signup — verified:
  Message → signup → composer opens for the original listener, page preserved.
- **Find** — topic/format filters hit `api.getListeners`, profile modal, host
  activity panel
- **Applications** — listener + host forms with the prototype's validation
  (disabled until required fields + agreement), success state, photo preview
- **Messages** — composer, canned auto-reply after 3.5s, unread badge,
  conversations persisted to `localStorage`. On mobile web, tapping an existing
  conversation opens a **full-screen chat thread** (`MobileChatThread`) with
  the real message history and a reply box, instead of the single-message
  composer — matching the listener and app surfaces. Starting a brand-new
  conversation (from Find or a profile) still goes through the composer.
- **Modals** — Escape to close, backdrop click, focus move-in + basic trap
- **App shell (`/app`)** — welcome overlay, 5-tab bar, bottom sheets, threaded
  chat (tab bar hides in a thread), heart-toggled favorites, guest vs signed-in
  profile, My Activity edit + spot-request approve/decline, activity "Request a
  spot" + toast. Threads and favorites persist to `localStorage`. Account gating
  with resume intents — verified: Message → signup → the thread opens.
- **Listener (`/listener`, `/listener/app`)** — Requests (accept / decline with
  reason, cap + pause notices), Conversations (split on web, full-screen on
  mobile/app; escalate / block&report / end / send), Peers feed (post + like),
  You (conversation cap stepper, pause switch, escalate / crisis / policy links).
  Modals verified: decline (incl. "flag privately"), escalate, block&report,
  crisis lines, policy docs, and the full **debrief** flow (banner → how-are-you
  → contextual actions → pause/support). `?status=pending` → review screen.
- **Moderator (`/moderator`)** — Escalations / Reports / Applications queues with
  a list/detail split. Verified: SLA-breach flagging on escalations, the
  emergency-services action's **second-moderator gate** (button stays disabled
  until note + colleague name), the application 4-point checklist driving the
  Approve card's state, and every decision resolving its item + firing its toast.

## Deviations from the prototype / TODO

| Item | Status |
| --- | --- |
| `i.pravatar.cc` avatars | still wired (`STOCK_AVATARS` in `people.ts`) — flip to `false` to use the initials fallback. Replace with real headshots before launch. |
| Auth session | in-memory only; lost on reload. Real session = backend. |
| Route guards | only nav *clicks* gate `/messages`; a direct URL is not gated. Add a guard when real auth lands. |
| Listener card | `role="button"` wrapper contains a `Request to talk` / `Message` button (mirrors the prototype). Revisit in an a11y pass. |
| Mobile composer multi-select | store supports `composerTo: string[]`; the mobile find grid opens it one recipient at a time (as the prototype's buttons do). Wire a select-multiple affordance if the product wants it. |
| Shell switch | `/app/*` → app shell; everything else → web shell (desktop/mobile by 768px). Mobile-only routes (`/explore`, `/howitworks`) redirect to their desktop equivalents on wide screens. |
| App data | `src/app/data.ts` is a separate copy (app listeners have no `language`; activities differ). Unify with `src/data/people.ts` when surfaces merge — handoff known gap #6. |
| App deep-linking | the app uses in-memory tab/sheet state, so `/app` is the only URL — refresh returns to Home. Add nested routes if deep links matter. Same for `/listener` and `/listener/app`. |
| Listener / moderator persistence | none — both keep everything in memory (session-only). Wire to the backend / add `localStorage` if a refresh should survive. |
| Role switching | no login/role system yet — the five route trees stand in for it. When real auth lands, they collapse into role-based routing after login, per the handoff. `LISTENER_NAME` / `MODERATOR_NAME` are hardcoded in the respective `data.ts`. |
| Listener app tab icons | the "Requests" and "Chats" glyphs are both chat-bubble-ish. Swap for a clearer icon set. |
| Moderator responsive | desktop only, as designed. Below 1000px the split stacks; there is no mobile moderation UI. |
| Moderator second-moderator gate | the colleague name is a free text field — real flow needs it to be a live notification + acceptance, and the whole console needs an append-only audit log (see the "services" and "minor" action foot-notes). |
| `requireAccountToBrowse` | prop on `<AppProvider>` in `App.tsx`, default `false`. Set `true` to A/B fully-gated browsing. |
| Safety / privacy / guidelines copy | scaffolding from `SAFETY-COPY-DRAFT.md` — **needs safeguarding/counselling sign-off**. No crisis-escalation path exists behind "Get urgent help". |
| Backend | nothing is wired. `src/data/api.ts` is the single seam — every screen goes through it. See the handoff "Backend requirements". |
