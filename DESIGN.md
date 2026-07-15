---
name: DAVDSM
description: A Portuguese design & code studio site built around one metaphor — work grown slowly, like a forest, not manufactured fast.
colors:
  forest-950: "#0a1a0f"
  forest-900: "#122219"
  forest-800: "#1a3523"
  forest-700: "#22472e"
  forest-500: "#357248"
  forest-300: "#6db882"
  mint-300: "#98deb0"
  mint-200: "#c3edd1"
  mint-50: "#f2fbf4"
  earth-500: "#d45a00"
  earth-400: "#e87a28"
  neutral-600: "#5a5a51"
  neutral-500: "#76766b"
  white: "#ffffff"
typography:
  display:
    fontFamily: "'Syne', 'Space Grotesk', sans-serif"
    fontSize: "clamp(2.5rem, 7vw, 6.5rem)"
    fontWeight: 800
    lineHeight: 1
    letterSpacing: "-0.03em"
  headline:
    fontFamily: "'Syne', 'Space Grotesk', sans-serif"
    fontSize: "clamp(2.5rem, 5.6vw, 5.25rem)"
    fontWeight: 800
    lineHeight: 1.04
    letterSpacing: "-0.03em"
  body:
    fontFamily: "'Space Grotesk', sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.65
  label:
    fontFamily: "'JetBrains Mono', 'Fira Code', monospace"
    fontSize: "0.8125rem"
    fontWeight: 500
    letterSpacing: "0.14em"
  accent-serif:
    fontFamily: "'Source Serif 4', Georgia, serif"
    fontSize: "1em"
    fontWeight: 300
rounded:
  pill: "9999px"
  md: "16px"
  lg: "20px"
  organic-card: "40px 14px 40px 14px"
  organic-portrait: "58% 42% 44% 56% / 55% 60% 40% 45%"
spacing:
  section-y: "clamp(100px, 14vw, 200px)"
  section-x: "6vw"
  gap-md: "24px"
  gap-lg: "clamp(32px, 6vw, 120px)"
components:
  nav-pill:
    backgroundColor: "rgba(255,255,255,0.08)"
    rounded: "{rounded.pill}"
    padding: "8px 14px"
  button-primary:
    backgroundColor: "{colors.forest-950}"
    textColor: "{colors.white}"
    rounded: "{rounded.lg}"
    padding: "20px 30px"
  button-primary-hover:
    backgroundColor: "{colors.forest-800}"
  card-studio:
    backgroundColor: "{colors.mint-50}"
    rounded: "{rounded.md}"
    padding: "28px"
  card-studio-hover:
    rounded: "{rounded.organic-card}"
---

# Design System: DAVDSM

## 1. Overview

**Creative North Star: "Made of Forest"**

DAVDSM's site is built around a single, literal metaphor: work that grows the way a forest grows — slowly, from real roots, in full season when it finally shows. Every surface either sits in deep forest-green dusk or breaks into a pale mint clearing; every heading uses the same seed → root → grow → blossom vocabulary; every transition between pages is a curtain of falling petals, not a cut. This isn't a decorative nature theme layered onto a generic studio template — it's the organizing idea the whole system is built from, and it should keep showing up anywhere the system grows next.

The system explicitly rejects the generic tech-SaaS agency look: no cold gradients, no hero-metric tiles, no "we build software" boilerplate. It also rejects a stiff, corporate register — DAVDSM reads as one small, real studio, not a faceless global agency, so warmth and specificity beat polish-for-its-own-sake everywhere.

**Key Characteristics:**
- Two base moods only: deep forest dusk (`forest-950` → `forest-900`) and pale mint clearing (`mint-50`), switched section by section — never a neutral gray middle ground.
- Organic, irregular shapes (blob portraits, asymmetric hover radii) stand in for the sharp corners a tech-agency site would use.
- Motion is unhurried by default (`cubic-bezier(0.16,1,0.3,1)`, 1–1.2s durations) — nothing snaps.
- Depth comes from translucency and frosted glass, never from drop shadows.

## 2. Colors

The palette is three named families — forest, mint, earth — plus a warm-tinted neutral scale, never a cool gray. Forest carries the dark surfaces and body ink; mint is the light surface and the one recurring bright accent; earth is used sparingly, for warmth and small emphasis only.

### Primary
- **Forest** (`#357248`): the brand green. Links, section eyebrows on light backgrounds, and the hero CTA's frosted-glass tint all key off this value.

### Secondary
- **Mint** (`#98deb0` / `#c3edd1` / `#f2fbf4`): the light half of the system. `mint-50` (`#f2fbf4`) is the "clearing" background used for every light section (Studio, Craft, Storyline, Gallery); `mint-200` is the marquee band and the page-transition curtain; `mint-300` is the one bright accent color — cursor dot, hero eyebrow icon, links inside dark sections.

### Tertiary
- **Earth** (`#e87a28` / `#d45a00`): warm terracotta/orange, reserved for small, deliberate emphasis — the "Since the roots" badge, the founder "Founder" tag, the final timeline entry (2026 / blossom), and the marquee's separator glyphs. Earth never carries a background of its own size; it's a spot color.

### Neutral
- **Forest-950** (`#0a1a0f`): the deepest surface — hero background, footer, page-transition dark layer.
- **Forest-900** (`#122219`): secondary dark surface and the ink color used for headings on light backgrounds.
- **Neutral-600** (`#5a5a51`) / **Neutral-500** (`#76766b`): body copy on light backgrounds. Two very close warm grays; treat them as one role (secondary text on `mint-50`) rather than two distinct steps.
- **White** (`#ffffff`): all body and heading text on dark surfaces.

### Named Rules
**The Two-Mood Rule.** Every section is either forest-dark or mint-light — full-bleed, never a gray or white in-between. A section either sits in the dusk or the clearing; there is no neutral middle ground.

**The Earth-Is-Rare Rule.** Earth orange never exceeds spot-color use: a badge, a tag, one timeline entry, one glyph. The moment earth becomes a background or a headline color, it stops reading as a seasonal accent and starts competing with mint.

## 3. Typography

**Display Font:** Syne, with Space Grotesk as fallback
**Body Font:** Space Grotesk
**Label/Mono Font:** JetBrains Mono
**Accent Font:** Source Serif 4 (italic, light weight — used inline, never for full headlines)

**Character:** A geometric, extrabold display face (Syne) carries every headline at near-maximum weight, deliberately blunt and confident; a single italic light-weight serif word (Source Serif 4) breaks into almost every headline to carry the "grown, not built" softness — "blossom.", "built.", "Bloom", "in season." This pairing — one very heavy geometric face, one very light editorial serif, used together in the same sentence — is the system's signature move, not an occasional flourish.

### Hierarchy
- **Display** (800, `clamp(2.5rem, 7vw, 6.5rem)`, line-height 0.98–1): hero H1s only. Always broken into stacked `<span>` lines with a translateY reveal, the final line often carrying the italic serif accent word.
- **Headline** (800, `clamp(2.5rem, 5.6vw, 5.25rem)`, line-height 1.04): section titles (Studio, Work, Craft, Storyline, Gallery). Same face and weight as Display, one step down in size.
- **Body** (400, 15–17px, line-height 1.6–1.75, max ~65ch): paragraph copy, always `neutral-600`/`neutral-500` on light sections or `rgba(255,255,255,0.7–0.9)` on dark.
- **Label** (500, 12–14px, letter-spacing 0.1–0.2em, uppercase, JetBrains Mono): section eyebrows, index tags (`/01`, `/03`), date ranges, "drag to explore" hints.
- **Accent-serif** (300, italic, Source Serif 4): the one emphasized word inside an otherwise-Display headline, or a full pull-quote (the founder blockquote).

### Named Rules
**The One Italic Word Rule.** Every major headline gets exactly one word or short phrase set in the light italic serif — never a whole sentence, never zero. It's the "grown" softness against the "built" bluntness of Syne; using it on every word or skipping it flattens the pairing entirely.

## 4. Elevation

The system is flat by design — there is no `box-shadow` elevation vocabulary anywhere in the site. Depth is conveyed two ways instead: translucency/frosted glass (the nav pill and the hero "Know more" CTA use `backdrop-filter: blur() saturate()` plus an SVG turbulence/displacement filter for a liquid-glass distortion, with inset highlight rims standing in for a shadow's job) and full-bleed color layering (a section's own background color is its depth cue, not a shadow under a card).

### Shadow Vocabulary
- **Glass rim** (`inset 1.5px 1.5px 1px 0 rgba(255,255,255,0.55), inset -1px -1px 1px 0 rgba(255,255,255,0.28), inset 0 0 12px rgba(255,255,255,0.12)`): the only "elevation" treatment in the system. Used exclusively on the two frosted-glass surfaces (nav pill, hero CTA) to fake a beveled glass edge — never used as a drop shadow under a flat card.

### Named Rules
**The No-Shadow Rule.** Never add `box-shadow` for elevation. If something needs to feel lifted, use the glass rim treatment or simply let color contrast do the job (a light card on a dark section already reads as "in front").

## 5. Components

### Buttons
- **Shape:** full pill (`9999px`) for every button and pill-shaped link; the one exception is the footer "Talk to us" CTA, which is a rounded rectangle (`20px`) sized to match its sibling input card.
- **Primary (footer "Talk to us"):** `forest-950` background, white text, `20px 30px` padding, `20px` radius.
- **Hover / Focus:** background steps one shade lighter (`forest-950` → `forest-800`), 0.25s ease, no scale or shadow change.
- **Ghost / ambient (nav "Portfolio"):** no fill; an animated rainbow-gradient `background-clip: text` treatment on the label instead. This is a deliberate one-off flourish, not a reusable pattern — do not generalize gradient text to any other component.

### Cards
- **Corner style:** two registers. Studio/Work grid cards rest at `18px`/`16px` and animate to an asymmetric `40px 14px 40px 14px` on hover — a soft-but-not-symmetric "leaf" shape. Portrait/story images use full organic blob radii (e.g. `58% 42% 44% 56% / 55% 60% 40% 45%`), a different value per instance so no two blobs look identical.
- **Background:** `mint-50` or a soft two/three-stop pastel gradient (`#eafcf0 → #fdeef2 → #e9f3ff`) for text-bearing cards; a full-bleed photo or video for media cards.
- **Shadow strategy:** none — see Elevation. Depth is the hover lift (`translateY(-6px)`) plus the radius shape-shift, not a shadow.
- **Internal padding:** 28px on text-bearing studio cards.

### Inputs
- **Style:** full pill, `var(--color-neutral-100)` fill, no visible border, 13px vertical / 18–48px horizontal padding (extra right padding to clear the embedded submit button).
- **Focus:** none currently styled — an accessibility gap worth closing (see Do's and Don'ts).

### Navigation
- A fixed, floating glass pill (not a full-width bar) centered at the top, with the wordmark at far left and a ghost CTA at far right, both outside the pill.
- **Adaptive theme:** the wordmark crossfades between a white and a forest-green SVG (0.7s opacity transition) and nav link color swaps between white and `forest-900`, both driven by which section is scrolled behind the fixed nav — light sections flip the nav to its dark-ink variant, dark sections keep it white.
- **Default/hover/active states:** nav links get a soft white-veil background (`rgba(255,255,255,0.22)`) on hover, no underline, no active-page indicator.
- **Mobile:** not yet adapted — the pill nav and its three-column grid layout have no defined narrow-viewport behavior.

### Signature Components
- **Two-part custom cursor:** an 8px mix-blend-mode dot that tracks the raw pointer instantly, plus a lagging outlined ring (16% lerp) that expands and fills solid mint when hovering anything tagged `data-cursor`, showing that element's own label ("View", "Drag") inside the ring. Falls back to the native cursor on coarse-pointer (touch) devices.
- **Petal page-transition:** navigating between routes rises a mint-then-forest curtain from the bottom of the viewport with ten falling petal shapes and a rotating loading word ("growing…", "blossoming…"), then reveals the new route underneath. This is the system's single most identity-carrying piece of motion — it should never be replaced with a plain fade.
- **Canvas fireflies:** a hero-only particle field of 48 soft glowing dots that drift and flee from the cursor, layered above the hero video and below the headline.

## 6. Do's and Don'ts

### Do:
- **Do** keep every section full-bleed forest-dark or mint-light — no gray or white neutral sections.
- **Do** pair the heavy Syne display face with exactly one light italic Source Serif 4 word per headline.
- **Do** use organic, asymmetric radii (leaf-hover cards, blob portraits) instead of uniform rounded rectangles wherever a shape is decorative rather than functional.
- **Do** treat earth orange as a spot color only — one badge, one tag, one accent at a time.
- **Do** give every custom animation (parallax, fireflies, cursor, carousel drag, petal transition) a real `prefers-reduced-motion` fallback, per PRODUCT.md's accessibility bar.
- **Do** keep depth flat-plus-glass: frosted blur and inset rim highlights, never a drop shadow.

### Don't:
- **Don't** build a generic tech-SaaS agency screen: no cold gradients, no hero-metric stat tiles, no "we build software" boilerplate copy — this is a named anti-reference in PRODUCT.md.
- **Don't** default to a stiff, corporate/impersonal register anywhere in copy or layout; DAVDSM reads as one small local studio, never a faceless global agency.
- **Don't** add `box-shadow` elevation to cards or buttons; use the glass rim or color contrast instead.
- **Don't** generalize the nav's animated rainbow gradient-text CTA into a reusable pattern — it's a one-off flourish tied to the "Portfolio" link, not a button variant, and its use of `background-clip: text` on a gradient is otherwise a banned pattern in this system.
- **Don't** use a plain cut or fade between routes; the petal-curtain transition is the system's identity move and should carry to any new route.
- **Don't** introduce a neutral gray background; if a section needs to feel calmer than mint or forest, adjust opacity/tint of those two, don't reach for gray.
