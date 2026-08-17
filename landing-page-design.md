# RedBank — Landing Page Design Spec

> **Purpose:** This document specs the public marketing landing page (`/`, unauthenticated) for
> RedBank. It is a companion to `design.md`, not a replacement — every color, radius, shadow, and
> motion timing rule from `design.md` still applies unless explicitly overridden below for the
> landing-page's dark hero treatment. Build this as its own route, outside the authenticated app
> shell (it has its own nav, not the sidebar).

---

## 1. Direction — Adapting the Reference, Not Copying It

The reference screenshot (dark canvas, glowing pink-to-blue hourglass gradient behind a floating
dashboard card) is a strong **layout** reference, but its **color** — purple/pink/blue — is not
RedBank's brand. Reusing it as-is would contradict `design.md` §1's "one accent at a time" rule
and dilute the brand.

**What we keep from the reference:** dark canvas, one large soft radial glow used as a hero
backdrop, a floating "live product" card sitting in the middle of the glow, small floating stat
cards at the edges, big confident display type, pill-shaped nav and buttons.

**What we change:** the glow is **garnet-to-slate**, not pink-to-blue — garnet (`primary-500/600`)
radiating from the top (behind the headline), cooling into slate-navy (`slate-600/700`) toward the
bottom (behind the product card), on a near-black `slate-900` canvas. This keeps the "warm accent
fading into brand navy" language of the reference while staying entirely inside RedBank's existing
palette.

---

## 2. Colors — Dark Hero Extension

These are **new, landing-page-only** tokens layered on top of `design.md` §2 — do not use them
anywhere inside the authenticated app, and do not use the app's light tokens (`neutral-50` page bg,
etc.) inside the hero section.

| Token              | Value                                         | Usage                                                        |
| ------------------ | --------------------------------------------- | ------------------------------------------------------------ |
| `landing-bg`       | `slate-900` `#141922`                         | Full-page canvas background                                  |
| `landing-surface`  | `slate-800` `#202834` at 60% opacity, blurred | Floating card backgrounds (glassmorphism)                    |
| `landing-border`   | `rgba(255,255,255,0.08)`                      | Hairline borders on dark cards/nav pill                      |
| `glow-primary`     | `primary-500` `#A5322A` → transparent         | Radial glow, upper half (behind headline)                    |
| `glow-secondary`   | `slate-600` `#384558` → `primary-800` blend   | Radial glow, lower half (behind product card)                |
| `landing-text-hi`  | `#FFFFFF`                                     | Headline text, primary card figures                          |
| `landing-text-mid` | `slate-100` `#D3DAE4`                         | Subheadline, nav links                                       |
| `landing-text-low` | `slate-300` `#7C8FA8`                         | Card labels, footer text, muted captions                     |
| `landing-cta-bg`   | `#FFFFFF`                                     | Primary "Start now" pill (inverted for max contrast on dark) |
| `landing-cta-text` | `slate-900` `#141922`                         | Text/icon on the white CTA pill                              |

Everything **below** the hero (features, screenshots showcase, footer) switches back to
`design.md`'s standard **light** theme (`neutral-50` background, `neutral-0` cards, garnet/slate
text) — the dark treatment is intentionally scoped to the hero band only, so the transition from
"marketing wow-moment" to "trustworthy bank product" is deliberate, not because it's an unstyled
section. See §5.2 for the transition treatment.

---

## 3. Typography

Use exactly what `design.md` §3 already defines — no new fonts:

- **Display/hero headline:** `Poppins`, 700 weight. `design.md` already reserves Poppins for
  "landing/empty-state hero text" — this is that use case. Go larger than the app's `display`
  token for the hero only: **56px / 64px** desktop, scaling down per §6 below (the in-app
  `display` token of 36px is too small for a landing hero; extend the scale here rather than
  invent a new font).
- **Subheadline / body copy:** `Inter`, 400 weight, `body-lg` (16px/24px) or up to 18px/28px for
  the hero subline specifically.
- **Nav links, buttons, badges:** `Inter`, 500–600 weight, matching `design.md` §6.1 button type.
- **Stat figures on floating cards** (Total Balance, Income, Expense): `Inter` with
  `font-variant-numeric: tabular-nums`, weight 700 — same numeric discipline as the in-app
  `amount-lg` token, just larger for marketing impact (28–32px in the hero card).

---

## 4. Page Structure

```text
┌─────────────────────────────────────────────┐
│ Nav (pill, floating, sticky)                 │
├─────────────────────────────────────────────┤
│ HERO — dark, glow, headline, CTA,            │
│        floating product card + stat chips    │  ← §5
├─────────────────────────────────────────────┤
│ Logo strip — "Trusted by / As seen in"       │  ← optional, small, light bg
├─────────────────────────────────────────────┤
│ Feature grid (3–4 cards, icon + title + copy)│  ← §5.3
├─────────────────────────────────────────────┤
│ Product showcase — real app screenshots      │  ← §5.4, uses /screenshots
│   in device frames, alternating text/image   │
├─────────────────────────────────────────────┤
│ Stats band (e.g. "3,000+ assets tracked")    │  ← count-up on scroll
├─────────────────────────────────────────────┤
│ Testimonial / trust section (optional)       │
├─────────────────────────────────────────────┤
│ Final CTA band — dark, small echo of hero glow│
├─────────────────────────────────────────────┤
│ Footer — light, standard app footer pattern  │
└─────────────────────────────────────────────┘
```

### 5.1 Nav

- Floating pill nav, `radius-full`, `landing-surface` background + `landing-border` hairline,
  sits ~24px from top, centered links (Home / About / Services / Pricing / Solution — or your
  actual IA), logo left, language switcher + white "Start now" pill button right — matches the
  reference's nav exactly but restyled with RedBank's logo mark and garnet-tinted logo icon.
- Becomes a hamburger → off-canvas drawer below `md`, consistent with `design.md` §8.2's mobile
  nav pattern (same interaction model, dark-themed here).

### 5.2 Hero

- Full-viewport-height (or ~90vh) dark section, `landing-bg` base.
- Radial glow: one large blurred radial gradient shape (SVG or CSS `radial-gradient` /
  `blur(80px)` div), garnet at the top fading through the vertical center into slate, forming the
  "hourglass" silhouette from the reference — widest at top and bottom, pinched behind the
  headline's baseline.
- Headline (`display`, Poppins 700, white): two lines, second line's key phrase in a
  garnet-to-white gradient text fill (`background-clip: text`) for a single accent moment —
  echoes the reference's lavender-highlighted second line, in-brand color instead.
- Subheadline: `landing-text-mid`, centered, max-width ~520px.
- CTA: white pill button (`landing-cta-bg`/`landing-cta-text`), trailing `arrow-right` icon
  (Lucide), plus an optional ghost "See how it works" text link beside it.
- **Floating product card** (center, overlapping the glow's pinch point): frosted-glass card
  (`landing-surface`, `backdrop-filter: blur(20px)`, `landing-border`, `radius-lg` 16px per
  `design.md` §4) showing a live-feeling mini "Total Balance" summary — reuse the real Dashboard's
  balance card content/layout (`amount-lg` style figure, Income/Expense sub-row) so it's an honest
  preview of the product, not a fabricated mockup.
- **Small floating stat chips** at the hero's left/right edges (Expenses Report ring, Saving
  Budget figure, Budgets/Goals mini-list) — same frosted-card treatment, smaller, partially faded
  at the very edge of the viewport (`opacity: 0.6–0.8`) so they read as ambient context, not
  competing content. These should also be built from real dashboard data shapes, not invented UI.
- Bottom edge of the hero fades to `neutral-50` (the app's standard light page background) via a
  gradient mask, so the next section arrives as a natural transition rather than a hard cut.

### 5.3 Feature Grid

- Standard light section, `neutral-50` background.
- 3–4 cards, `design.md` §6.3 card styling (`neutral-0`, `radius-md`, `shadow-md`), icon in a
  tinted circular badge (`primary-50` bg, `primary-600` icon) per §6.3's "stat/info card" pattern,
  `h3` title, `body` description.
- Suggested content: Fund Transfers, Real-time Transaction History, Chat with RedAssist (AI),
  Bank-grade Security — pulled straight from what the product actually does.

### 5.4 Product Showcase (screenshots)

This is the section that needs real screenshots. **See §7 for the exact folder/filenames to drop
them into** so the components can pick them up.

- Alternating left/right layout: on odd rows, screenshot left + heading/copy right; even rows,
  mirrored. 2–4 rows total (Dashboard, Fund Transfer, Transaction History, Chat with RedAssist are
  good candidates, matching the sidebar's own nav order for narrative consistency).
- Each screenshot sits inside a **browser-chrome frame** (a simple rounded rectangle with a thin
  top bar + 3 dots, `landing-border`-style hairline, subtle `shadow-lg`) — not a raw `<img>`
  floating with no context, so it reads as "this is the real app" rather than a stray picture.
- Screenshots get a gentle parallax/tilt on scroll (see §6) and a soft drop shadow that intensifies
  slightly on hover if the row is interactive.

### 5.5 Stats Band & Final CTA

- Stats band: 3–4 big numbers (`amount-lg`-scale, Inter tabular-nums, weight 700) with a `caption`
  label underneath, e.g. "3,000+ Assets Tracked", "$50M+ Transferred", "99.9% Uptime". Numbers
  count up from 0 when scrolled into view (see §6).
- Final CTA band: short return to the dark/glow treatment (smaller glow, same garnet-to-slate
  gradient) with a single headline + the same white CTA pill, as a bookend to the hero.
- Footer: standard light footer, `slate-600` links on `neutral-0`/`neutral-50`, logo, nav links,
  legal links, social icons (Lucide `github`, `twitter`, `linkedin` outline style per §5 icon
  rules).

---

## 6. Animation & Motion Plan

`design.md` §7 deliberately keeps in-app motion minimal because it's a finance _tool_. The
landing page is a marketing _surface_ — more motion is appropriate here, but it should still feel
premium and intentional, not gimmicky. Rule of thumb: **motion should always be triggered by
something the user did (scroll, hover, page load) — never looping/ambient animation that runs
forever in the background** (the glow itself can have one slow ambient drift, see below, as the
one deliberate exception, since the reference's glow reads as "alive").

### 6.1 Recommended libraries

You're on React + `lucide-react` already. Add:

| Library                                        | Why                                                                                                                                                                                                                                                                                                                               |
| ---------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Framer Motion** (`motion` / `framer-motion`) | The primary animation engine. React-native API, built-in `whileInView` for scroll-triggered reveals, `useScroll`/`useTransform` for parallax, layout animations, and spring physics for the floating cards. Covers ~90% of what this page needs on its own.                                                                       |
| **Lenis** (`lenis` / `@studio-freight/lenis`)  | Smooth-scroll library — gives the page the slightly weighted, physics-based scroll feel seen in the reference (rather than the browser's default instant scroll), which makes scroll-linked parallax look much better.                                                                                                            |
| **GSAP + ScrollTrigger** (optional)            | Only reach for this if you build a more complex scroll-scrubbed sequence (e.g. the hero card physically "assembling" from pieces as you scroll). Skip it if Framer Motion's `whileInView`/`useScroll` already covers your sequences — avoid running two animation engines unless you need GSAP's timeline scrubbing specifically. |
| **react-intersection-observer**                | Only if you need viewport-enter detection outside a Framer Motion component (e.g. triggering a non-visual side effect). Framer's `whileInView` already covers the count-up/reveal cases below.                                                                                                                                    |

Keep `lucide-react` for every icon on this page too — same icon language as the rest of the app
(§5 of `design.md`), don't introduce a second icon set for marketing.

### 6.2 Page-load sequence (hero)

Staggered entrance, total ~1.2s, everything `ease-out`:

1. `0ms` — dark background + glow fade in (400ms opacity 0→1).
2. `150ms` — nav pill drops in from `-16px` + fades in (300ms).
3. `250ms` — headline lines fade + rise from `24px` below, staggered ~80ms per line (400ms each).
4. `450ms` — subheadline fades + rises (350ms).
5. `550ms` — CTA button fades + rises, then a subtle one-time scale pulse (1 → 1.03 → 1) to draw
   the eye, not a looping pulse.
6. `650–900ms` — floating product card and stat chips fade + rise + scale in from `0.96 → 1`,
   staggered ~100ms apart, center card first, side chips after.

### 6.3 Ambient glow drift (the one looping exception)

- The radial glow shapes slowly drift/scale (±5–8%, translate ±10–15px) on an 8–12s looped
  `ease-in-out` cycle — barely perceptible, gives the hero a "living" quality like the reference
  image without being distracting. Respect `prefers-reduced-motion` (see §6.6).

### 6.4 Scroll-triggered animation (below the hero)

Using Framer Motion's `whileInView` (trigger once, `viewport={{ once: true, amount: 0.3 }}`):

- **Section headings:** fade + rise 20px, 400ms, on entering viewport.
- **Feature cards:** fade + rise 24px, staggered ~80ms per card across the grid.
- **Showcase screenshots:** fade + rise 32px **and** a subtle parallax as the user scrolls past —
  bind the frame's `y` translate to scroll progress via `useScroll`/`useTransform` so it moves
  slightly slower/faster than the page (classic parallax depth), capped at a small range (±20–30px)
  so it never feels like it's fighting the scroll.
- **Stats band numbers:** animate from `0` to the target value over ~1.2s `ease-out` when the band
  enters the viewport (mirrors `design.md`'s existing "number count-up" pattern in §7, just longer
  duration for a bigger marketing number).
- **Hero → light section transition:** as the user scrolls past the hero, the frosted product
  card can very subtly scale down / fade (0–15% scroll progress) as if settling into place — skip
  this if it competes with the parallax screenshots below.

### 6.5 Micro-interactions

- Buttons: hover = `scale(1.02)` + brightness/opacity shift, 150ms `ease-out`; press = `scale(0.98)`,
  80ms (matches `design.md` §7's button-press timing even though this page is otherwise more
  animated — presses should always feel instant).
- Nav links: underline draws in from center on hover, 150ms.
- Floating stat chips: gentle mouse-parallax (chip shifts a few px opposite cursor movement within
  the hero) for a "3D" feel — optional, skip if it feels like too much once built.
- Screenshot frames: on hover, lift `4px` + shadow deepens, 150ms `ease-out`.

### 6.6 Accessibility

- Wrap all non-essential motion (glow drift, parallax, stagger distances) in a
  `prefers-reduced-motion` check — when reduced motion is requested, cut all animations to simple
  200ms opacity fades with no translate/scale/parallax, and stop the ambient glow drift entirely.
- Count-up numbers should still land on the correct final value instantly for reduced-motion users,
  not skip rendering.
- Everything remains keyboard-navigable; animated reveals must not delay focusability of the
  underlying element (`whileInView` should animate opacity/transform only, never `display`).

---

## 7. Screenshots — Where to Put Them

The product showcase (§5.4) and hero floating card (§5.2) both use **real screenshots of the
actual app**, not illustrations. Drop image files into:

```text
src/assets/landing/screenshots/
├── dashboard.png            # Full Dashboard page (used in showcase + cropped for hero card)
├── fund-transfer.png        # Fund Transfer form/flow
├── transaction-history.png  # Transaction History table view
├── chat-redassist.png       # AI chat screen
├── cash-withdrawal.png      # optional, if included in showcase rows
└── profile.png              # optional
```

**Guidelines for the screenshots themselves:**

- Capture at a clean desktop viewport (≥1440px wide) with realistic but non-sensitive demo data
  (the "John Doe" / RB1000000001-style placeholder data already used elsewhere is fine).
- PNG, no browser chrome baked in (the frame in §5.4 is built in CSS around the image, don't
  screenshot the actual browser window).
- Keep each under ~500KB (export at 2x for retina, compress with an image tool) — lazy-load every
  showcase image (`loading="lazy"`) since they're below the fold.
- If a screenshot doesn't exist yet for a page you want to feature, use a `neutral-100` placeholder
  frame with a centered `image` (Lucide) icon and skip that row rather than shipping a stretched
  low-res image.

Reference them in code via the standard asset import path per `design.md` Part C (`src/assets/`),
e.g. `import dashboardShot from '@/assets/landing/screenshots/dashboard.png'` — do not put these
in `public/` unless you specifically need a stable root URL outside the build pipeline.

---

## 8. Responsiveness

Follow `design.md` §8's breakpoints; landing-specific notes:

- **< `md`:** Hero stacks to a single column — headline, subhead, CTA, then the product card
  centered below (stat chips either hide or stack under the card rather than floating at the
  viewport edges, since there's no horizontal room for them to breathe). Glow simplifies to a
  single soft radial behind the whole stack rather than the pinched hourglass shape.
- **< `md`:** Showcase rows drop the alternating left/right layout and always stack
  image-then-text, full width.
- **< `sm`:** Hero display type drops from 56px to ~32px (bigger drop than the in-app §8.6 rule
  since this is a much larger starting size); nav pill collapses to logo + hamburger only.
- Parallax and mouse-parallax effects should be **disabled below `md`** (touch devices) — they
  don't translate to touch interaction and can cause janky scroll on lower-powered phones; rely on
  the simple fade+rise reveals there instead.

---

## 9. Build Notes

- New route, e.g. `pages/LandingPage.jsx`, **outside** `ProtectedRoute` — this is public.
- Component breakdown suggestion under `features/landing/components/`: `Hero.jsx`,
  `FloatingProductCard.jsx`, `FeatureGrid.jsx`, `ShowcaseRow.jsx`, `StatsBand.jsx`, `CtaBand.jsx`,
  `LandingFooter.jsx`, `GlowBackground.jsx` — keep each animation self-contained in its component
  rather than one giant page file managing every Framer Motion instance.
- Load Poppins alongside the existing Inter setup in `index.css`/font loading — same mechanism
  already used for the in-app Poppins references in `design.md` §3, don't add a second font-loading
  method.
- Test the whole page with `prefers-reduced-motion: reduce` turned on in devtools before shipping.
