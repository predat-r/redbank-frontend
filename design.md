# RedBank — Design System

> **Purpose of this document:** This is the single source of truth for visual and interaction
> design across the RedBank frontend. Anyone building a screen — dashboard, transfers, admin
> tools — should pull colors, type, spacing, components, and motion rules from here so every
> module feels like one product.
>
> **Structure note:** This file is split into two halves on purpose:
>
> - **Part A — Design Foundations** (colors, type, spacing, components, motion, icons). This is > the stable part. Change it rarely, and only with team agreement, since every screen depends > on it.
> - **Part B — Page Directory** (what pages exist, what's on them). This is expected to change > as product requirements evolve. Treat Part B as a living spec, Part A as the rulebook.
>
> **Inspiration:** The three reference screens shared with the team (dashboard, fund transfer,
> accounts/filter view) set the tone — soft neutral surfaces, rounded cards, a friendly welcome
> header, pill-shaped status tags, and a calm, uncluttered layout. RedBank's version trades the
> reference's blue/teal accent for our brand garnet + slate, and dials the illustration/emoji use
> down to keep things feeling like a serious, trustworthy bank.

---

# PART A — Design Foundations

## 1. Brand Basics

|                      |                                                                                              |
| -------------------- | -------------------------------------------------------------------------------------------- |
| Product name         | RedBank                                                                                      |
| Personality          | Trustworthy, precise, calm, modern — a bank that feels competent, not corporate-cold         |
| Design language      | Modern minimal — generous whitespace, soft elevation, rounded geometry, restrained color use |
| Primary brand colors | Garnet Red `#89221C`, Slate Navy `#384558` (from logo)                                       |

**Design principles**

1. **Clarity over decoration.** Every screen handles someone's money — numbers, statuses, and
   actions must be unambiguous at a glance.
2. **One accent at a time.** Garnet is reserved for primary actions and brand moments. Slate
   carries secondary actions and structure. Don't let both compete for attention on one element.
3. **Status is color-coded, consistently.** Green = good/completed, amber = pending/waiting,
   red = failed/rejected — everywhere, without exception (see §6.6).
4. **Numbers are tabular.** Balances, amounts, account numbers always use tabular figures so
   columns of digits align.
5. **Soft, not flat.** Cards float gently off the background with a soft shadow and 1px hairline
   border — never harsh drop shadows, never fully flat/borderless.

---

## 2. Color System

### 2.1 Primary — Garnet Red

Used for: primary buttons, links on light backgrounds, active nav indicator, key brand moments,
critical alerts (sparingly — see semantic red below for pure "error" use).

| Token             | Hex           | Usage                                                        |
| ----------------- | ------------- | ------------------------------------------------------------ |
| `primary-50`      | `#FBEAE9`     | Tinted backgrounds, hover states on light surfaces           |
| `primary-100`     | `#F3CFCD`     | Subtle badges, selected-row backgrounds                      |
| `primary-200`     | `#E7A19D`     | Disabled primary elements (border)                           |
| `primary-300`     | `#D97771`     | Decorative accents, chart series                             |
| `primary-400`     | `#C14F45`     | Hover on dark primary elements                               |
| `primary-500`     | `#A5322A`     | Hover/active state of primary buttons                        |
| **`primary-600`** | **`#89221C`** | **Base brand color — primary buttons, links, active states** |
| `primary-700`     | `#6E1B16`     | Pressed/active button state                                  |
| `primary-800`     | `#521410`     | Text on light tinted backgrounds                             |
| `primary-900`     | `#370D0A`     | Rarely used — max-contrast emphasis                          |

### 2.2 Secondary — Slate Navy

Used for: secondary buttons, sidebar background, headers, body text on light surfaces, icons.

| Token           | Hex           | Usage                                           |
| --------------- | ------------- | ----------------------------------------------- |
| `slate-50`      | `#EEF1F5`     | Page background tint, hover on nav items        |
| `slate-100`     | `#D3DAE4`     | Dividers on dark surfaces, disabled fields      |
| `slate-200`     | `#A8B4C6`     | Placeholder text, muted icons                   |
| `slate-300`     | `#7C8FA8`     | Secondary icons                                 |
| `slate-400`     | `#5A6C86`     | Secondary text                                  |
| `slate-500`     | `#44536A`     | Hover state of secondary buttons                |
| **`slate-600`** | **`#384558`** | **Base — secondary buttons, sidebar, headings** |
| `slate-700`     | `#2C3646`     | Pressed secondary button, sidebar active bg     |
| `slate-800`     | `#202834`     | Dark surfaces (e.g. dark-mode sidebar)          |
| `slate-900`     | `#141922`     | Max-contrast text, dark mode background         |

### 2.3 Neutrals

Used for: page backgrounds, cards, borders, body text.

| Token         | Hex       | Usage                                     |
| ------------- | --------- | ----------------------------------------- |
| `neutral-0`   | `#FFFFFF` | Card/surface background                   |
| `neutral-50`  | `#F7F8FA` | App page background                       |
| `neutral-100` | `#EEF0F3` | Table header background, input background |
| `neutral-200` | `#DEE2E8` | Borders, dividers                         |
| `neutral-300` | `#C5CBD3` | Disabled borders                          |
| `neutral-400` | `#9AA2AF` | Placeholder text, disabled text           |
| `neutral-500` | `#707886` | Secondary/muted body text                 |
| `neutral-600` | `#4E5563` | Body text                                 |
| `neutral-700` | `#363C48` | Strong body text                          |
| `neutral-800` | `#22262F` | Headings                                  |
| `neutral-900` | `#14171C` | Max-contrast headings (rare)              |

### 2.4 Semantic Colors (status, feedback)

| Meaning      | Token                   | Text/Icon | Background tint        | Used for                                       |
| ------------ | ----------------------- | --------- | ---------------------- | ---------------------------------------------- |
| Success      | `success-600` `#1E8E5A` | `#1E8E5A` | `success-50` `#E6F6EF` | `COMPLETED`, `ACTIVE`, credited transactions   |
| Warning      | `warning-600` `#C97A1A` | `#C97A1A` | `warning-50` `#FEF3E2` | `PENDING_APPROVAL`, `PENDING`, cleanup jobs    |
| Error/Danger | `error-600` `#D64545`   | `#D64545` | `error-50` `#FCEAE8`   | `REJECTED`, `FAILED`, `CANCELLED`, form errors |
| Info         | `info-600` `#2E6FBA`    | `#2E6FBA` | `info-50` `#E8F1FC`    | Informational banners, refresh/token notices   |

> Note: semantic error red (`#D64545`) is intentionally distinct from brand primary
> (`#89221C`) so a red **button** (brand action) is never confused with a red **alert**
> (something went wrong).

### 2.5 Accessibility

- Body text must meet **WCAG AA (4.5:1)** against its background. `primary-600` and `slate-600`
  both pass AA on white and on `neutral-50`.
- Never convey status by color alone — always pair with an icon and/or text label (see §6.6).
- Interactive elements need a visible focus ring: `2px solid primary-300` with `2px` offset.

---

## 3. Typography

| Role                                                       | Font                        | Fallback stack                                         |
| ---------------------------------------------------------- | --------------------------- | ------------------------------------------------------ |
| UI / body / data                                           | **Inter**                   | `Inter, -apple-system, "Segoe UI", Roboto, sans-serif` |
| Display / marketing headings (landing, empty states)       | **Poppins**                 | `Poppins, Inter, sans-serif`                           |
| Numeric data — balances, account numbers, transaction refs | **Inter (tabular figures)** | same as UI, with `font-variant-numeric: tabular-nums`  |
| Code / reference IDs (optional, admin views)               | **JetBrains Mono**          | `"JetBrains Mono", Menlo, monospace`                   |

Why Inter: excellent legibility at small sizes, true tabular-figure support (critical for
columns of amounts in tables), and it's the same family already used across the reference
screens' number-heavy layouts.

### 3.1 Type Scale

| Token       | Size / Line height | Weight | Usage                                                          |
| ----------- | ------------------ | ------ | -------------------------------------------------------------- |
| `display`   | 36px / 44px        | 700    | Landing/empty-state hero text only                             |
| `h1`        | 28px / 36px        | 700    | Page titles ("Welcome, {name}")                                |
| `h2`        | 22px / 30px        | 600    | Section headers ("Transaction History")                        |
| `h3`        | 18px / 26px        | 600    | Card titles, modal titles                                      |
| `body-lg`   | 16px / 24px        | 400    | Primary body text, form labels                                 |
| `body`      | 14px / 20px        | 400    | Default UI text, table cells                                   |
| `body-sm`   | 13px / 18px        | 400    | Helper text, timestamps                                        |
| `caption`   | 12px / 16px        | 500    | Badge text, table column headers (uppercase, +0.04em tracking) |
| `amount-lg` | 32px / 38px        | 700    | Balance hero figures                                           |
| `amount`    | 16px / 22px        | 600    | In-table amount values (tabular-nums)                          |

**Weights used:** 400 (regular), 500 (medium — labels/badges), 600 (semibold — headings/buttons),
700 (bold — hero numbers/page titles). Avoid weights below 400 or above 700.

---

## 4. Layout, Spacing & Grid

- **Base unit:** 4px. All spacing/margins/padding are multiples of 4 (4, 8, 12, 16, 24, 32, 48, 64).
- **Page grid:** 12-column, max content width `1280px`, gutter `24px`, page horizontal padding `32px` (desktop) / `16px` (mobile).
- **Sidebar:** fixed width `260px` (desktop), collapses to icon-only `72px` on tablet, becomes an
  off-canvas drawer on mobile (<768px).
- **Card padding:** `24px` standard, `16px` for compact/dashboard-tile cards.
- **Border radius:**
  - `radius-sm` 8px — inputs, small buttons, badges
  - `radius-md` 12px — cards, modals
  - `radius-lg` 16px — hero/balance cards
  - `radius-full` 999px — pills, avatars, segmented controls
- **Elevation (shadows):**
  - `shadow-sm`: `0 1px 2px rgba(20,23,28,0.06)` — table rows, input focus
  - `shadow-md`: `0 4px 12px rgba(20,23,28,0.08)` — cards
  - `shadow-lg`: `0 12px 32px rgba(20,23,28,0.12)` — modals, dropdown menus, toasts
- **Breakpoints:** `sm` 640px · `md` 768px · `lg` 1024px · `xl` 1280px · `2xl` 1536px

---

## 5. Iconography

- **Icon set:** [Lucide](https://lucide.dev) — open-source, consistent 24×24 grid, matches the
  clean line-icon style used across the reference screens (dashboard, transfer, accounts).
- **Style rules:**
  - Stroke width `1.75px`, never filled, except for status dots and the notification-bell badge.
  - Default icon size `20px` in nav/buttons, `16px` inline with text, `24px` in card headers.
  - Icon color follows text color it sits beside, unless it's a semantic status icon (§6.6).
- **Common icon mapping:**

| Concept             | Icon                              |
| ------------------- | --------------------------------- |
| Dashboard           | `layout-dashboard`                |
| Accounts            | `wallet`                          |
| Fund Transfer       | `arrow-left-right`                |
| Transaction History | `history`                         |
| Admin Panel         | `shield-check`                    |
| Credited / money in | `arrow-down-left` (success color) |
| Debited / money out | `arrow-up-right` (slate color)    |
| Notifications       | `bell`                            |
| Search              | `search`                          |
| Filter              | `sliders-horizontal`              |
| Approve             | `check-circle`                    |
| Reject              | `x-circle`                        |
| Pending             | `clock`                           |
| Settings            | `settings`                        |
| Logout              | `log-out`                         |
| Download/export     | `download`                        |

---

## 6. Core Components

### 6.1 Buttons

| Variant      | Background                                               | Text          | Border            | Use                                                                  |
| ------------ | -------------------------------------------------------- | ------------- | ----------------- | -------------------------------------------------------------------- |
| Primary      | `primary-600`, hover `primary-500`, active `primary-700` | white         | none              | Main call-to-action per screen (Pay, Approve, Submit) — one per view |
| Secondary    | `slate-600`, hover `slate-500`, active `slate-700`       | white         | none              | Secondary actions (Switch Account, View Details)                     |
| Outline      | transparent                                              | `slate-600`   | `1px neutral-300` | Tertiary actions (Cancel, Filter)                                    |
| Ghost / text | transparent                                              | `slate-600`   | none              | Low-emphasis actions, table row actions                              |
| Danger       | `error-600`, hover darker                                | white         | none              | Reject, Cancel Transaction, destructive confirms                     |
| Disabled     | `neutral-100`                                            | `neutral-400` | none              | Any variant when inactive                                            |

- Height: `40px` default, `48px` for primary form-submit CTAs, `32px` compact (in-table).
- Radius: `radius-sm` (8px). Padding: `12px 20px` (default), `16px 24px` (large).
- Font: `body`, weight 600.
- Icon + label buttons: 8px gap, icon leading.

### 6.2 Inputs & Form Fields

- Height `44px`, radius `8px`, border `1px neutral-200`, background `neutral-0`.
- Focus: border `primary-500` + `shadow-sm` ring in `primary-100`.
- Error state: border `error-600`, helper text in `error-600` below field.
- Label: `body-sm`, weight 500, `neutral-700`, `6px` above field.
- Placeholder text: `neutral-400`.
- Dropdowns/selects use the same shell with a trailing `chevron-down` icon.
- Currency/amount fields: right-align value, tabular-nums, prefix showing currency symbol/code
  in a muted `neutral-500` chip inside the field (as seen in the transfer screen's Amount +
  Currency pairing).

### 6.3 Cards

- Background `neutral-0`, border `1px neutral-200`, radius `12px`, shadow `shadow-md`.
- **Balance / hero card:** radius `16px`, larger padding (`24–32px`), houses the `amount-lg`
  figure, a currency selector, and a primary "View Details" button — mirrors the dashboard
  reference's "Current Balance" tile.
- **Stat/info card** (e.g. transaction limits in the transfer screen): icon in a tinted circular
  badge (top-left), label (`caption`, `neutral-500`), value (`h3`, `neutral-800`).

### 6.4 Tables

- Header row: `neutral-100` background, `caption` style text, `neutral-500`, uppercase, sticky on scroll.
- Row height `56px`, hover state `slate-50` background.
- Row divider: `1px neutral-200`, no vertical column borders (matches reference screens' airy table style).
- Numeric columns (Amount) are right-aligned with tabular-nums.
- Transaction type column pairs a small directional icon (see §5) with the label, e.g.
  "↓ Credited (Transfer)" in success color, "↑ Debited (Card)" in slate.
- Pagination sits bottom-right: `« 1 2 3 … 8 »` style, page-size selector bottom-left.

### 6.5 Segmented Control / Filter Pills

Seen in the accounts screen (Debit / Credit / Both toggle):

- Pill-shaped container, `radius-full`, `neutral-100` background track.
- Active segment: `slate-600` background, white text, `shadow-sm`.
- Inactive segment: transparent, `neutral-600` text.
- Height `36px`, per-segment padding `8px 16px`.

### 6.6 Status Badges

Pill-shaped, `radius-full`, `caption` weight 600, `4px 12px` padding, icon optional leading (12px).

| Status                                               | Background   | Text          |
| ---------------------------------------------------- | ------------ | ------------- |
| `ACTIVE` / `COMPLETED`                               | `success-50` | `success-600` |
| `PENDING_APPROVAL` / `PENDING`                       | `warning-50` | `warning-600` |
| `REJECTED` / `FAILED` / `CANCELLED`                  | `error-50`   | `error-600`   |
| Informational / neutral (e.g. `ROLE_ACCOUNT_HOLDER`) | `slate-50`   | `slate-600`   |

### 6.7 Navigation

- **Sidebar** (dashboard reference): `neutral-0` background, `260px` wide, logo + wordmark top,
  nav items with icon + label, active item gets a `4px primary-600` left rail + `primary-50`
  background + `primary-600` text/icon. Inactive items `neutral-600` text, `slate-300` icons.
  "Switch Account" pinned to bottom as a pill button.
- **Topbar:** search input (pill, `neutral-100` bg, `search` icon leading), notification bell
  with a small `error-600` dot/count badge, avatar (32px circle) with name/role on hover.
- **Tabs** (e.g. "Transaction History / Mini Statement / Loan Summary"): underline style,
  active tab `primary-600` text + `2px primary-600` bottom border; inactive `neutral-500` text.

### 6.8 Stepper

Seen in the fund-transfer reference (Step 1 → 2 → 3):

- Horizontal row of steps, each with a circular index/checkmark node (`32px`), connecting line
  between nodes.
- Completed step: node filled `success-600` with white check icon, line to next step filled `success-600`.
- Current step: node outlined `2px primary-600`, index number in `primary-600`.
- Upcoming step: node `neutral-200` fill, index in `neutral-400`, line `neutral-200`.
- Step label (`body-sm`) sits under each node.

### 6.9 Modals & Toasts

- Modal: `radius-md`, `shadow-lg`, max-width `480px` (confirm dialogs) or `640px` (forms),
  scrim `rgba(20,23,28,0.5)`.
- Toast: bottom-right, `radius-sm`, `shadow-lg`, colored left border (4px) matching semantic
  color, auto-dismiss 4s, manual close `x` icon.

### 6.10 Empty & Loading States

- Empty state: centered icon (48px, `neutral-300`), `h3` message, `body-sm` supporting text,
  optional primary button. Keep illustration use minimal/geometric — avoid cartoon mascots to
  keep the tone bank-appropriate (a deliberate departure from the playful mascot in the transfer
  reference image).
- Loading: skeleton blocks (`neutral-100`, subtle shimmer animation) matching the shape of the
  content being loaded — never a blocking full-page spinner for in-page data.

---

## 7. Motion & Animation

Keep motion **fast, subtle, and purposeful** — this is a finance product, not a marketing site.

| Interaction                       | Duration  | Easing                       | Notes                                               |
| --------------------------------- | --------- | ---------------------------- | --------------------------------------------------- |
| Hover (buttons, rows, nav items)  | 120ms     | `ease-out`                   | Background/color transition only                    |
| Button press                      | 80ms      | `ease-in`                    | Slight scale `0.98`                                 |
| Modal / drawer open               | 200ms     | `cubic-bezier(0.16,1,0.3,1)` | Fade + slight translate-up (8px)                    |
| Toast enter/exit                  | 220ms     | `ease-out` / `ease-in`       | Slide from right + fade                             |
| Page/tab content switch           | 150ms     | `ease-in-out`                | Cross-fade, no slide                                |
| Skeleton shimmer                  | 1.4s loop | `linear`                     | Subtle, low-contrast sweep                          |
| Number count-up (balance updates) | 400ms     | `ease-out`                   | Only on first load or after a transaction completes |
| Stepper node completion           | 250ms     | `ease-out`                   | Scale-in checkmark + color fill                     |

Avoid: bouncy/elastic easing, parallax, decorative background animation, anything over 300ms for
core interactions.

---

## 8. Responsiveness

RedBank is used both at a desk (admin/back-office work) and on the go (account holders checking
balances, transferring funds). Every screen must adapt across the breakpoints in §4 — this
section defines _how_, so the adaptation is consistent rather than ad hoc per module.

### 8.1 Breakpoints & Target Devices

| Breakpoint   | Width       | Primary target                          | Layout mode                                     |
| ------------ | ----------- | --------------------------------------- | ----------------------------------------------- |
| `xs`         | < 640px     | Phones                                  | Single column, stacked                          |
| `sm`         | 640–767px   | Large phones / small tablets (portrait) | Single column, wider cards                      |
| `md`         | 768–1023px  | Tablets                                 | 2-column where content allows                   |
| `lg`         | 1024–1279px | Small laptops                           | Full desktop layout, sidebar visible            |
| `xl` / `2xl` | ≥ 1280px    | Desktop                                 | Full layout, max content width 1280px, centered |

**Design approach:** mobile-first. Build the single-column `xs` layout first, then add columns
and reveal secondary content as space allows going up the scale. Never simply shrink the desktop
layout — restructure it.

### 8.2 Navigation

- **≥ `lg`:** Fixed left sidebar (§6.7), `260px` wide, always visible, labels shown.
- **`md`:** Sidebar collapses to icon-only rail, `72px` wide; labels appear in a tooltip on hover/long-press.
- **< `md`:** Sidebar becomes an off-canvas drawer, hidden by default, opened via a hamburger icon
  in the topbar; overlays content with the standard modal scrim (§6.9) and closes on route change
  or outside tap.
- **< `md`:** Topbar search collapses into an icon that expands into a full-width overlay input on tap, to save horizontal space. Notification bell and avatar remain visible.
- **< `sm`:** Consider a bottom tab bar (Dashboard / Accounts / Transfer / History / Menu) as an
  alternative to the drawer for the 4–5 most-used account-holder destinations — this mirrors
  common native-app patterns and reduces taps for the most frequent actions. Admin-only pages
  stay in the "Menu" overflow, not the bottom bar.

### 8.3 Grid & Cards

- **≥ `lg`:** Multi-column card grids (e.g. Balance card + Account Type card side by side; admin
  overview stat tiles in a 4-column grid).
- **`md`:** Grids reflow to 2 columns.
- **< `md`:** All cards stack in a single column, full width, in priority order (most
  time-sensitive/important content first — e.g. Balance hero card always first on Dashboard).
- Card internal padding reduces from `24px` (desktop) to `16px` (< `sm`) per §4, but radius and
  shadow tokens stay constant — don't flatten cards on mobile.

### 8.4 Tables

Tables are the highest-risk element for mobile — never allow silent horizontal overflow with no
affordance.

- **≥ `md`:** Standard table (§6.4), all columns visible.
- **< `md`:** Switch to a **stacked card-list pattern**: each row becomes its own card with
  label/value pairs (e.g. "Date: 10.04.2021", "Type: Credited (PayPal)", "Amount: $2,300"),
  the most important field (usually Amount + Status badge) promoted to the top-right of the card
  in larger type. Keep the same row divider spacing rhythm as the table for visual consistency.
- If a stacked list isn't feasible for a given table (e.g. dense admin ledger views), fall back
  to horizontal scroll **with a visible scroll shadow/gradient hint** and the first column
  (Date or ID) frozen/sticky — never a bare unhinted overflow.
- Filter panels (§6.5 region) collapse into a single "Filters" button opening a bottom sheet on
  mobile, rather than showing all filter fields inline.

### 8.5 Forms (Transfer, Deposit, Register, etc.)

- **≥ `md`:** Multi-column form layouts allowed (e.g. From/To fields side by side, Amount/Currency
  side by side, as in the transfer reference screen).
- **< `md`:** All fields stack to a single column, full width. Inputs grow to `48px` height (from
  `44px`) for easier touch targets.
- Side info cards (transaction limits, etc.) move from a right-hand rail (desktop) to below the
  form (mobile), collapsed into a single dismissible summary strip if space is tight.
- The Stepper (§6.8) switches from a horizontal row to a compact horizontal row with truncated
  labels (icon + step number only, label on tap/current step only) below `sm` to avoid wrapping.
- Primary CTA button becomes full-width and sticks to the bottom of the viewport (safe-area aware)
  on mobile form screens, so it's always reachable without scrolling.

### 8.6 Typography at Smaller Sizes

- Scale down by one step on `xs`/`sm` for hero numbers only: `amount-lg` 32px → 26px,
  `display` 36px → 28px, `h1` 28px → 24px. Body/caption sizes (§3.1) stay fixed across all
  breakpoints — never shrink body text below 14px for accessibility.
- Line length: cap paragraph/body text at ~70 characters even on wide desktop viewports by
  constraining text blocks, not just cards.

### 8.7 Touch Targets & Interaction

- Minimum interactive target size on touch devices: **44×44px**, regardless of visual icon size —
  pad tappable icon buttons accordingly.
- Hover-only affordances (e.g. row action icons that appear on hover) must have a persistent
  visible alternative on touch devices (e.g. always-visible overflow "⋯" menu) since there is no
  hover state on mobile.
- Increase spacing between adjacent tappable elements to at least `8px` on touch breakpoints to
  prevent mis-taps (vs. `4px` acceptable minimum on desktop with a mouse).

### 8.8 Testing Checklist

Before marking a page "done," verify at minimum: `375px` (phone), `768px` (tablet), `1024px`
(small laptop), `1440px` (desktop) — plus one real-device check on iOS Safari and Android Chrome
for any page with a form or table, since these are where most responsive bugs surface.

---

# PART B — Page Directory

_(Living spec — pages and their content blocks will evolve. Structural rules above stay fixed.)_

## B.0 Legend

Each page lists: **Route**, **Access**, **Backend endpoint(s)** it talks to, **Key content
blocks**, and **Primary components used** (referencing Part A).

---

## Public / Auth Flow

### B.1 Register

- **Route:** `/register` · **Access:** Public · **Endpoint:** `POST /api/auth/register`
- **Content:** Brand header, form (Name, Email, Phone, Address, Password, Confirm Password),
  terms checkbox, primary CTA "Create Account", link to Login.
- **Components:** Auth card (centered, `radius-lg`, `shadow-lg`), form Inputs (§6.2), Primary Button.
- **States:** validation errors inline; success → confirmation screen: "Your registration is
  under review" with a `PENDING_APPROVAL` badge and expected-review-time note.

### B.2 Login

- **Route:** `/login` · **Access:** Public · **Endpoint:** `POST /api/auth/login`
- **Session endpoints:** `POST /api/auth/refresh`, `POST /api/auth/logout`,
  `GET /api/auth/registration-status`
- **Session behavior:** Login and registration return an access token in JSON and set the refresh
  token as an HttpOnly cookie. Login, registration, refresh, and logout requests include browser
  credentials. Refresh and logout send no JSON request body.
- **Content:** Email + password fields, "Forgot password" link, primary CTA "Sign In", link to Register.
- **Components:** Auth card, Inputs, Primary Button, inline error banner (info/error color) for bad credentials.
- **API limitation:** Password recovery is not currently exposed by the backend. The "Forgot
  password" affordance must remain unavailable with an explanatory message until an endpoint is added.

### B.3 Change Password

- **Route:** `/settings/security` · **Access:** Authenticated · **Endpoint:** `PUT /api/auth/password`
- **Content:** Current password, new password, confirm new password, security tips sidebar.
- **Components:** Form card, Inputs, Primary Button, Toast on success.

---

## Account Holder Pages (`ROLE_ACCOUNT_HOLDER`)

### B.4 Dashboard

- **Route:** `/dashboard` · **Endpoints:** `GET /api/accounts/me`,
  `GET /api/balance/me/latest`, `GET /api/accounts/me/transactions`
- **Content:** Personalized welcome header ("Welcome, {name}"), Current Balance hero card
  (amount-lg, currency selector, "View Details" button), Account Type card, tabbed panel
  (Transaction History / mirrors reference layout — Loan Summary tab omitted, not in scope of
  this backend), paginated transaction table (date, type w/ icon, currency, amount, status badge).
- **Components:** Sidebar nav (§6.7), Topbar (§6.7), hero/stat Cards (§6.3), Tabs (§6.7), Table (§6.4), Status Badge (§6.6).

### B.5 Accounts / My Account Summary

- **Route:** `/accounts` · **Endpoints:** `GET /api/accounts/me`,
  `GET /api/accounts/me/transactions`, `GET /api/balance/me/latest`
- **Content:** Sub-tabs (Mini Statement / Account Summary / Transaction History), account summary,
  and pageable transaction results.
- **Components:** Tabs, account summary Cards (§6.3), Table (§6.4).
- **API limitation:** Period, date-range, balance-range, and debit/credit server-side filters are
  deferred until the transaction endpoint exposes corresponding query parameters.

### B.6 Fund Transfer

- **Route:** `/transfer` · **Endpoints:** `POST /api/accounts/me/transfers`, `POST /api/accounts/me/withdrawals`
- **Content:** Top tabs ("Transfer to Own Accounts" not applicable — RedBank supports **Transfer
  to Other Account** and **Withdrawal**), 3-step Stepper (Initiate → Verify → Status), From/To
  account fields, amount + currency, side info cards showing transaction limits (min/max,
  daily count remaining — static/config-driven, not from backend yet), terms checkbox, primary
  CTA "Confirm Transfer".
- **Components:** Tabs, Stepper (§6.8), Inputs, Stat/info Cards (§6.3), Primary Button, Modal for final confirmation.
- **States:** success → toast + updated stepper to "Completed" + link to transaction receipt (by reference `TXN-XXXXXXXXXXXX`).

### B.7 Transaction History (standalone/history view)

- **Route:** `/history` · **Endpoint:** `GET /api/accounts/me/transactions`
- **Content:** Full pageable transaction table with an export option for the currently loaded data.
- **Components:** Table (§6.4), Ghost button for export ("download" icon).
- **API limitation:** Search, server-side filtering, and a dedicated export endpoint are not
  currently available. Export must be generated client-side from data already retrieved.

### B.8 Balance / Ledger

- **Route:** `/balance` · **Endpoint:** `GET /api/balance/me/latest`
- **Content:** Current balance hero, latest ledger entry detail (running balance, linked transaction reference).
- **Components:** Hero Card (§6.3), detail list.

---

## Admin Pages (`ROLE_ADMIN`)

### B.9 Admin — Pending Registrations

- **Route:** `/admin/registrations` · **Endpoints:** `GET /api/admin/registrations`,
  `GET /api/admin/registrations/{userId}`, `POST /api/admin/registrations/{userId}/approve`,
  `POST /api/admin/registrations/{userId}/reject`
- **Content:** Table of pending applicants (name, email, submitted date, `PENDING_APPROVAL`
  badge), row actions Approve / Reject, Reject opens a Modal requiring a reason.
- **Components:** Table, Status Badge, Danger/Primary Buttons, Modal (§6.9), Toast on decision.

### B.10 Admin — Deposits

- **Route:** `/admin/deposits` · **Endpoint:** `POST /api/admin/deposits`
- **Content:** Form (Account number, Amount, Currency, Note) and a success receipt for the deposit
  returned by the create operation.
- **Components:** Form card, Inputs, Primary Button, success Toast/receipt Card.
- **API limitation:** A recent-deposits table is not included because no deposit-list endpoint exists.

### B.11 Admin — Transactions

- **Route:** `/admin/transactions` · **Endpoints:** `GET /api/admin/transactions`,
  `GET /api/admin/transactions/{id}`, `GET /api/admin/transactions/reference/{reference}`,
  `GET /api/admin/accounts/{accountNumber}/transactions`
- **Content:** Global pageable transaction table, exact search by transaction reference or account
  number, and row click → detail Modal/drawer with source/destination owner info.
- **Components:** Table, search Input (JetBrains Mono for reference display), Modal/side-drawer.

### B.12 Admin — Balance & Ledger

- **Route:** `/admin/balance/:accountId` · **Endpoints:** `GET /api/admin/balance/{accountId}/latest`,
  `GET /api/admin/balance/{accountId}/ledger`
- **Content:** Account summary header and pageable ledger table (running balance per entry).
- **Components:** Stat cards, Table.
- **API limitation:** A reconciliation/discrepancy flag is deferred until the backend exposes it.

### B.13 Admin — Audit Logs

- **Route:** `/admin/audit-logs` · **Endpoints:** `GET /api/admin/audit-logs`,
  `GET /api/admin/audit-logs/{auditLogId}`
- **Content:** Pageable table of admin actions (actor, action type, target, timestamp); row click
  opens the selected audit-log detail.
- **Components:** Table, Modal/side-drawer.
- **API limitation:** Action-type and date filters are deferred until the list endpoint exposes them.

### B.14 Admin Panel — Overview

- **Route:** `/admin` · **Endpoints:** `GET /api/admin/registrations`, `GET /api/admin/users`,
  `GET /api/admin/accounts`, `GET /api/admin/transactions`
- **Content:** Summary tiles (pending registrations, total users, total accounts, total
  transactions), derived from each pageable response's `page.totalElements`, linking into B.9–B.13.
- **Components:** Stat Cards grid, quick-link Cards.

---

## Shared/System Pages

### B.15 Empty States, 403, 404, 500

- Standard empty-state pattern (§6.10) reused for "no transactions yet," "no pending
  registrations," access-denied, and error pages, swapping icon + message only.

### B.16 Notifications Panel

- **Route:** dropdown from Topbar bell icon.
- **Content:** Empty/unavailable state reserved for future system notifications.
- **Components:** Dropdown card (`shadow-lg`), list rows, ghost "Mark all read" button.
- **API limitation:** Notification listing, unread state, and "Mark all read" are not connected
  until the backend exposes notification endpoints; clients must not fabricate notification data.

---

# PART C — Frontend Architecture & File Placement

> **Purpose:** This section is the source of truth for where frontend code belongs. AI agents
> and contributors must follow this structure when adding or moving files. Prefer extending an
> existing feature over creating a new top-level directory. Do not place substantial page,
> API, or business logic directly in `App.jsx`.

## C.1 Canonical Folder Structure

```text
redbank-frontend/
├── docs/
│   └── openapi.json              # Backend API contract; do not hand-edit generated copies
├── public/                       # Files served unchanged at /<filename>
│   ├── favicon.svg
│   └── icons.svg
├── src/
│   ├── api/                      # HTTP transport and endpoint functions
│   │   ├── axios.js              # Axios instances, headers, refresh, and error handling
│   │   ├── auth.js               # /api/auth/* endpoint functions
│   │   ├── accounts.js           # Account and balance endpoint functions
│   │   ├── admin.js              # Admin endpoint functions
│   │   └── transactions.js       # Transfer, withdrawal, and transaction functions
│   ├── assets/                   # Images/fonts imported by application code
│   ├── components/               # Reusable, feature-agnostic UI
│   │   ├── ui/                   # Button, Input, Card, Modal, Badge, Table, Spinner
│   │   └── navigation/           # Sidebar, Topbar, NavItem
│   ├── features/                 # Business capabilities, grouped by domain
│   │   ├── auth/
│   │   │   ├── components/       # LoginForm, RegisterForm, ProtectedRoute
│   │   │   ├── auth.queries.js    # Auth mutations/query hooks
│   │   │   └── auth.test.jsx
│   │   ├── accounts/
│   │   ├── transfers/
│   │   ├── transactions/
│   │   └── admin/
│   ├── hooks/                    # Truly cross-feature React hooks only
│   ├── layouts/                  # AppShell, AuthLayout, AdminLayout
│   ├── pages/                    # Route-level composition; keep business logic in features
│   │   ├── auth/                 # LoginPage, RegisterPage, ChangePasswordPage
│   │   ├── account/              # DashboardPage, AccountsPage, TransferPage, etc.
│   │   ├── admin/                # AdminOverviewPage, RegistrationsPage, etc.
│   │   └── system/               # ForbiddenPage, NotFoundPage, ErrorPage
│   ├── providers/                # Query, auth, toast, and other app-wide providers
│   ├── routes/
│   │   └── router.jsx            # React Router route tree and access boundaries
│   ├── test/
│   │   ├── setup.js              # Vitest / jest-dom global setup
│   │   └── render.jsx            # Shared test render with application providers
│   ├── utils/                    # Pure, domain-neutral helpers (formatting, dates, etc.)
│   ├── App.jsx                   # Root composition only; no page implementation
│   ├── index.css                 # Tailwind import, design tokens, and global base styles
│   └── main.jsx                  # Browser entry point and top-level provider mounting
├── .env.example                  # Documented, non-secret environment variables
├── design.md                     # Design and frontend architecture source of truth
├── eslint.config.js
├── index.html
├── package.json
├── vite.config.js
└── vitest.config.js
```

Directories should be created when the first real file needs them; empty placeholder folders
are not required.

## C.2 Placement Rules

1. **Route pages compose; features implement.** A file in `pages/` should assemble layouts and
   feature components for one URL. Forms, query hooks, validation, and business behavior belong
   to the corresponding folder in `features/`.
2. **Shared components contain no RedBank business rules.** Put a generic `Button` or `Modal` in
   `components/ui/`. Put `TransferConfirmationModal` in `features/transfers/components/`.
3. **API functions are framework-independent.** Files in `api/` may use the shared Axios client and normalize
   responses/errors, but must not import React, React Router, or UI components.
4. **Server state uses query hooks.** Keep TanStack Query keys, queries, mutations, and cache
   invalidation beside their feature (for example `features/accounts/account.queries.js`). Do
   not scatter routine API fetching across components with `useEffect`.
5. **Keep feature code local.** A component, hook, schema, or helper used by only one feature
   stays inside that feature. Promote it to `components/`, `hooks/`, or `utils/` only after it is
   genuinely shared.
6. **Layouts own page chrome.** Sidebars, topbars, responsive shells, and nested route outlets
   belong in `layouts/`; route definitions belong only in `routes/router.jsx`.
7. **Tests live beside the code they test.** Use `ComponentName.test.jsx` for components and
   `fileName.test.js` for plain modules. Reserve `src/test/` for shared test infrastructure,
   fixtures, and request mocks—not every test file.
8. **Static asset choice is intentional.** Import build-managed assets from `src/assets/`. Put
   only assets requiring stable root URLs in `public/`.
9. **Global styles stay small.** `src/index.css` owns the Tailwind import, theme/design tokens,
   font setup, and universal defaults. Prefer Tailwind utilities in components; add global CSS
   only when the rule is truly application-wide.
10. **No secrets in frontend code.** Only public configuration may use `VITE_*` variables.
    `.env.local` remains uncommitted; every required variable is documented in `.env.example`.

## C.3 Naming and Import Conventions

- React components and their files use `PascalCase`: `TransactionTable.jsx`.
- Hooks use `camelCase` beginning with `use`: `useMyAccount.js`.
- Non-component modules use descriptive `camelCase` names: `formatCurrency.js`.
- Query modules use the domain suffix `.queries.js`; API endpoint modules use the domain name.
- Page components end in `Page`: `DashboardPage.jsx`.
- Prefer named exports for reusable modules. A route page may use a default export when required
  by lazy loading.
- Use relative imports within a feature. If an import alias is introduced, configure it in Vite,
  Vitest, and ESLint together before using it.
- Avoid generic dumping-ground files such as `helpers.js`, `common.js`, or `misc.js`; name files
  after the responsibility they own.

## C.4 Dependency Direction

```text
pages/routes → layouts/features → components/hooks → api/utils
```

Code may depend to the right, but lower-level modules must not depend back on pages or routes.
Feature-to-feature imports should be rare; shared behavior should move to the nearest valid
shared layer. This keeps page routing, business behavior, UI primitives, and HTTP transport
independently testable.

---

## C.5 Authentication and Session Security

- The backend-owned HttpOnly refresh-token cookie is the only refresh credential. Frontend
  JavaScript must never attempt to read, copy, or persist it.
- Keep `accessToken` and `tokenType` in application memory only. Never write authentication
  tokens to `localStorage`, `sessionStorage`, IndexedDB, URLs, or logs.
- Configure Axios auth requests with `withCredentials: true`. This is required for login,
  registration, refresh, and logout so the browser can receive and send the refresh cookie.
- Call `POST /api/auth/refresh` and `POST /api/auth/logout` without a JSON body. Refresh returns a
  new access token while the backend rotates the cookie; logout invalidates and clears the cookie.
- On application startup, attempt one credentialed refresh before route guards redirect. A `401`
  means the user is signed out; it is not an application error.
- Protected requests send `Authorization: Bearer <accessToken>`. Concurrent `401` responses share
  one refresh operation and retry at most once; a failed refresh clears in-memory authentication.
- Do not set the `Origin` request header in frontend code. Browsers provide it and the backend
  validates it. Development permits exactly `http://localhost:3001`; production must allow only
  the deployed frontend's exact HTTPS origin.

### Using Auth Globally

`AppProviders` mounts `AuthProvider` for the entire application. Components inside the app can
access authentication through the feature hook:

```jsx
import { useAuth } from '../features/auth/useAuth.js';

const {
  isAuthenticated,
  isInitializing,
  session,
  claims,
  roles,
  hasRole,
  establishSession,
  endSession,
} = useAuth();
```

- Use `ProtectedRoute` for authenticated route groups and `RoleRoute` for role-restricted groups.
- Use `establishSession` after login or registration and `endSession` when clearing local auth.
- API modules must use the shared Axios client; it attaches the access token, performs one shared
  refresh for concurrent `401` responses, and retries each failed request at most once.
- Do not read auth context directly, duplicate token state, or persist tokens in browser storage.

## C.6 End-to-End Test Structure

Browser-level end-to-end tests use Selenium WebDriver with Cucumber.js and live under `e2e/`:

```text
e2e/
├── features/
│   ├── auth/
│   ├── transactions/
│   ├── admin/
│   ├── profile/
│   └── chatbot/
└── support/
    ├── pages/
    ├── steps/
    ├── hooks.js
    └── world.js
```

Features should be grouped by user journey. Keep browser setup and teardown in `support`, page
objects responsible for selectors and UI actions, and `.feature` files focused on business
behavior. API, component, and unit tests remain alongside the application code; E2E tests cover
only the most important cross-screen flows.

---

## Changelog

| Date       | Change                                                                                                      |
| ---------- | ----------------------------------------------------------------------------------------------------------- |
| 2026-08-06 | Documented memory-only access tokens and backend-managed HttpOnly refresh cookies.                          |
| 2026-08-06 | Aligned Page Directory endpoints and supported behaviors with `docs/openapi.json`.                          |
| 2026-08-06 | Added Part C: canonical frontend folder structure and file-placement rules.                                 |
| 2026-08-06 | Initial version — foundations + full page directory drafted from README v1 endpoints and reference screens. |
