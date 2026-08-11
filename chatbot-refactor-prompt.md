# Prompt: Refactor AI Chat UI to Match RedBank Design System

## Context

The AI chat feature was built without referencing `design.md`, RedBank's design system. It
currently looks inconsistent with the rest of the app and opens as a standalone full page instead
of living inside the app shell. Refactor it so it is indistinguishable in style from the rest of
RedBank, and fix its navigation behavior.

Read `design.md` in the repo root before making changes — it is the single source of truth for
every value below. Everything in this prompt is derived from it; do not invent new colors, radii,
shadows, or fonts.

---

## 1. Navigation / Layout Fix (do this first)

**Problem:** The chatbot currently opens on a new page, replacing the app shell (sidebar/topbar on
desktop, bottom tab bar on mobile disappears).

**Fix:**

- The chat must render **inside** the existing authenticated layout, the same way Dashboard,
  Accounts, and Transfer do — as a routed page inside the app shell, not a route that bypasses it.
- Desktop (`≥ lg`): sidebar stays visible and the chat's nav item highlights active, exactly like
  any other sidebar item (§6.7 active state: `4px primary-600` left rail + `primary-50` background
  - `primary-600` text/icon).
- Mobile (`< sm`): if a bottom tab bar is in use per §8.2, the chat must be reachable from it (or
  from the "Menu" overflow, consistent with how other frequent destinations are handled) and the
  tab bar must remain visible while chatting — do not let the chat take over the full viewport and
  hide navigation.
- Opening the chat should feel like switching tabs (150ms cross-fade per §7's "Page/tab content
  switch" rule), not like a page navigation with a full reload/transition.
- If the chat currently opens in a modal/drawer instead of a page — that's also acceptable, but
  it must use the standard modal/drawer motion (200ms, `cubic-bezier(0.16,1,0.3,1)`, fade + 8px
  translate-up, scrim `rgba(20,23,28,0.5)`) and must NOT block access to the sidebar/tab bar.
- Preserve chat state (message history) when the user navigates away and back within the same
  session — don't remount from scratch.

---

## 2. Visual Refactor — Use These Exact Tokens

### Colors

- **Backgrounds:** page/chat canvas background `neutral-50` (#F7F8FA). Message list container:
  `neutral-0` (#FFFFFF) if it's card-contained, matching other cards (§6.3).
- **User's own messages (outgoing bubble):** background `primary-600` (#89221C), text white. On
  hover/press of any interactive element inside it, follow standard button hover/active states
  (`primary-500` / `primary-700`) if the bubble is ever interactive.
- **AI messages (incoming bubble):** background `neutral-100` (#EEF0F3), text `neutral-800`
  (#22262F). Do NOT use slate or primary for AI bubbles — keep AI responses visually neutral so
  the user's own messages remain the one clear accent, per design principle "one accent at a time."
- **Timestamps / meta text under bubbles:** `body-sm` (13px/18px), color `neutral-500`.
- **Chat input field:** same shell as every other input in the app — height `44px`, radius `8px`
  (`radius-sm`), border `1px neutral-200`, background `neutral-0`. Focus state: border
  `primary-500` + `shadow-sm` ring in `primary-100`. Placeholder text `neutral-400`.
- **Send button:** Primary button variant (§6.1) — `primary-600` bg, white icon, hover
  `primary-500`, active `primary-700`, disabled state `neutral-100` bg / `neutral-400` icon when
  input is empty.
- **Typing/thinking indicator:** three dots in `slate-300`, on a `neutral-100` bubble shell
  (same shape as an incoming message bubble) so it reads as "the AI is composing a bubble," not as
  a generic spinner.
- **Error state** (failed to send / AI error): `error-600` text, `error-50` background tint,
  matching toast/error conventions in §6.9 and §2.4 — do not invent a new red.

### Typography

- **Font:** Inter for all chat UI text — `Inter, -apple-system, "Segoe UI", Roboto, sans-serif` —
  identical stack to the rest of the app. Do not import a separate chat-specific font.
- Message bubble text: `body` (14px/20px, weight 400).
- Sender name / "RedBank Assistant" label (if shown above AI messages): `body-sm`, weight 500,
  `neutral-700`.
- Timestamps: `body-sm`, weight 400, `neutral-500`.
- Chat page/section header (if the chat has a title bar): `h3` (18px/26px, weight 600),
  `neutral-800` — same as any card/modal title elsewhere in the app.
- Numbers inside chat (e.g. AI quoting a balance or account number) must use tabular figures
  (`font-variant-numeric: tabular-nums`) exactly like everywhere else numeric data appears.

### Spacing, Radius, Shadow

- Base unit `4px`; use the standard scale (4, 8, 12, 16, 24) for all bubble padding/gaps — no
  arbitrary pixel values.
- Message bubble padding: `12px 16px`.
- Gap between consecutive messages from the same sender: `4px`. Gap between different senders
  or message groups: `16px`.
- Bubble radius: `radius-md` (12px) — matching card radius. Slightly flatten the corner nearest
  the sender's avatar/edge (standard chat convention) if desired, but keep the other three corners
  at 12px.
- If the chat is presented in a card/panel (not full-bleed), that container uses `neutral-0`
  background, `1px neutral-200` border, `radius-md` (12px), `shadow-md` — identical to any other
  card in the app (§6.3). Don't give it a heavier or different shadow "because it's a chat."
- Input bar container at the bottom: `16px` padding, sits on `neutral-0`, separated from the
  message list by a `1px neutral-200` top border (same divider treatment as tables/lists elsewhere).

### Icons — Lucide, matching §5 exactly

Use the **Lucide** icon set already used app-wide (lucide.dev), stroke width `1.75px`, unfilled,
`20px` default size in the input bar / nav, `16px` inline with text:

| Purpose                         | Icon                   |
| ------------------------------- | ---------------------- |
| Chat nav item (sidebar/tab bar) | `message-circle`       |
| AI assistant avatar/badge       | `bot`                  |
| Send message                    | `send`                 |
| Attach file (if supported)      | `paperclip`            |
| New/clear conversation          | `plus` or `rotate-ccw` |
| Close chat (if in drawer/modal) | `x`                    |
| Copy AI response                | `copy`                 |
| Retry failed message            | `refresh-cw`           |
| Voice input (if supported)      | `mic`                  |
| Scroll-to-latest pill           | `arrow-down`           |
| Failed to send / error          | `x-circle` (error-600) |

Icon color follows the text color it sits beside, exactly per §5 — e.g. the send icon is white on
its primary button, the copy/retry icons are `slate-300`/`neutral-500` inline with AI messages,
not brand-colored decoration.

### Motion — use §7's table, nothing extra

- New message enter (either sender): fade + 8px translate-up, **200ms**,
  `cubic-bezier(0.16,1,0.3,1)` — same curve as modal/drawer open. Do not use spring/bounce easing.
- Typing indicator dot animation: keep it subtle and looping like the skeleton shimmer (1.4s loop,
  linear, low contrast) — not a bouncy "..." animation.
- Hover on any button/icon in the chat (send, copy, retry): **120ms ease-out**, background/color
  transition only, same as every other hover in the app.
- Button press (send button): **80ms ease-in**, scale `0.98`.
- Scroll-to-latest / new-message-arrived pill: same 220ms slide+fade as toasts (§6.9).
- Explicitly avoid: bouncy/elastic message pop-in, chat-bubble "wiggle," confetti/celebration
  effects, or any animation over 300ms — this must still read as a calm finance product, not a
  consumer messaging app.

---

## 3. Component Behavior Details

- Empty state (no messages yet): follow §6.10 exactly — centered `bot` icon at 48px in
  `neutral-300`, `h3` greeting message, `body-sm` supporting text (e.g. suggested prompts as
  outline-button chips), no cartoon mascot.
- Loading (AI response pending): show the typing-indicator bubble described above — never a
  full-page blocking spinner, consistent with the "never a blocking full-page spinner for in-page
  data" rule in §6.10.
- Disabled send button state must match the app's global disabled treatment: `neutral-100`
  background, `neutral-400` content.
- Respect the responsive rules in §8: on mobile the input bar grows to `48px` height (matching
  §8.5's mobile form-field sizing), and the chat container becomes single-column, full width, with
  `16px` outer padding instead of `24px`.
- Focus ring on the text input and all icon buttons: `2px solid primary-300`, `2px` offset — same
  accessibility rule as every other interactive element (§2.5).

---

## 4. What NOT to do

- Don't introduce a new accent color, gradient, or "AI-branded" purple/blue — the app has exactly
  two accents (garnet primary, slate secondary) and the chat must use them the same way every
  other screen does.
- Don't add a different font "to make it feel more conversational" — Inter stays.
- Don't use filled icons, a different icon set, or icon sizes outside 16/20/24px.
- Don't let the chat open in a way that hides the sidebar or tab bar.
- Don't use shadows, radii, or spacing values that aren't in the design system's scale.

---

## 5. Acceptance Check

Before calling this done, verify:

1. Chat is reachable and usable without ever losing the sidebar (desktop) or tab bar (mobile).
2. Someone flipping between Dashboard and Chat sees the same font, same button styles, same input
   styles, same card radius/shadow, same hover/press timing.
3. Every icon used exists in Lucide and follows the 1.75px stroke / unfilled rule.
4. No color hex value appears in the chat UI that isn't in `design.md`'s token tables.

---

## 6. Round 2 — Specific Regressions Found in the Current Build

A pass was implemented, but screenshots of the live app show it still isn't right. Fix these
concretely — each one is a specific, observable bug, not a general restyle.

### 6.1 Sidebar still disappears on the chat screen

The chat route currently renders as its own top-level view with just a small header bar
("RedAssist" + bot icon) — the `260px` sidebar (logo, Dashboard / Fund Transfer / Cash Withdrawal
/ Transaction History / Chat with RedAssist / Profile nav, avatar block at top-right) is completely
gone. This confirms the chat is still mounted **outside** the authenticated app shell/layout
component instead of inside it.

- Find wherever the chat route is declared in the router and move it inside the same layout route
  (the parent route that wraps Dashboard, Fund Transfer, etc.) instead of as a sibling/standalone
  route.
- After the fix, the chat screen must show the identical sidebar, with "Chat with RedAssist"
  highlighted as the active nav item (§6.7 active state), and the identical topbar with the user's
  avatar/name — exactly like Image 1, just with the chat panel where the dashboard content is.
- The custom "RedAssist" header currently at the top of the chat can stay, but it lives _inside_
  the content area next to the sidebar, not as a replacement for the app shell.

### 6.2 Input field is not pinned to the bottom of the viewport

Right now the input bar ("Ask a question...") sits directly under the last message and there's a
large empty gap of page below it — it scrolls with the content instead of staying docked. Fix:

- The input bar must be **fixed to the bottom of the chat panel** (`position: sticky` or a flex
  layout with `flex: 1` message list + fixed-height input row at the bottom), always visible
  without scrolling, the same way a messaging app's compose bar behaves.
- The message list is the only scrollable region; it should fill all remaining vertical space
  between the chat header and the docked input bar (`flex-1 overflow-y-auto`), not the whole page.
- When there are few messages, the input bar still sits at the bottom of the panel — it should not
  float up to sit right under a short conversation.

### 6.3 "Chat with RedAssist" sidebar icon is too generic

The current sidebar icon is a plain speech-bubble outline, indistinguishable from a generic
"comments" or "feedback" icon — it doesn't read as AI. Replace it with a Lucide icon that clearly
signals AI/assistant, consistent with §5's rules (1.75px stroke, unfilled, `20px` in nav):

- Use **`bot`** (Lucide's robot-face icon) for the sidebar nav item — this also matches the `bot`
  icon already specified in this prompt's icon table for the AI avatar, so the same icon language
  is used consistently from the sidebar entry point through to the chat itself.
- If `bot` feels too literal next to the other line icons, **`sparkles`** or **`sparkle`** is an
  acceptable alternative (common "AI" visual shorthand) — pick one and use it everywhere the
  assistant is represented (sidebar icon + chat header icon + AI message avatar), don't mix icons
  for the same concept.
- Keep it monochrome/outline like every other sidebar icon — don't give it a gradient or filled
  treatment "because it's AI"; that would break the one-accent-at-a-time principle.

### 6.4 General polish pass

With the structural issues above fixed, also tighten these details, which the current build is
still missing or doing inconsistently vs. the rest of the app:

- **Chat header bar:** should match the height/padding/border-bottom treatment of other in-app
  section headers, not just float as bare text + icon in the top-left corner. Add a `1px
neutral-200` bottom border and align its left padding with the content padding used on
  Dashboard.
- **Message bubble max-width:** cap bubbles at roughly `70%` of the panel width (currently the
  bubbles appear to size purely to content, which is fine for short replies but will look broken
  once a longer AI response wraps) — long AI responses should wrap within a readable measure, not
  stretch edge-to-edge.
- **"Needs Clarification" badge:** currently shown as plain colored text under a bubble. Make it
  an actual pill/badge component consistent with the status badges used elsewhere (e.g. the
  `ACTIVE` pill on the dashboard) — `warning-50` background, `warning-600` text, `radius-full`,
  `caption` type, rather than bare colored text.
- **Avatar/sender identity:** every AI message currently repeats the "RedAssist" label above each
  bubble in full body text. Consider grouping consecutive AI messages under one label (per the
  `4px` same-sender / `16px` different-sender spacing rule already in this prompt) and adding the
  small `bot` icon as a `24px` circular avatar to the left of AI message groups, so the two
  senders are distinguishable by more than just alignment and color.
- **Scrollbar / scroll-to-latest:** the panel currently relies on the browser's default scrollbar
  and there's no way to tell if you're viewing old messages. Add the `arrow-down` "scroll to
  latest" pill (already specified above) that appears once the user scrolls up from the bottom.
