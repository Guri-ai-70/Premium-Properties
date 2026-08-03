# Visual Refresh via Design Tokens

## Context

Premium Properties is a bilingual (EN/HE, RTL) React + Vite + Tailwind real-estate
listing site with no backend (data lives in `localStorage`). This is a learning
project — the goal of this pass is to make the UI feel more polished and less
"template-y" while practicing a proper design-token approach, not to add new
features or swap the visual identity.

Current state: colors are hardcoded ad hoc throughout the codebase — three
different blue gradients do the same job (`from-blue-800 via-blue-900
to-slate-900` in the Properties hero, `from-blue-600 to-blue-700` on the header
logo, `from-blue-500 to-blue-600` in the footer logo). Radius and shadow values
are inconsistent (`rounded-xl` vs `rounded-2xl` used interchangeably). The hero
uses a dimmed stock photo behind a gradient, a recognizable template pattern.
Loading states are plain "Loading..." text. `tailwind.config.js` currently only
extends `fontFamily`.

## Goal

Keep the existing blue brand identity, but formalize it into a real design-token
system and apply it consistently, while tightening typography, hero treatment,
card/component styling, and loading states.

## Out of scope

- New features: keyword search, price/bedroom range filters, sorting,
  pagination, favorites, map view.
- Dark mode.
- Swapping hand-rolled `ui/` primitives for real shadcn/ui + Radix (a natural
  next step once the project moves into a features phase, not part of this
  visual pass).
- Any change to the data model, entities, or admin functionality.
- Any new npm dependency.

## Design

### 1. Design tokens

Extend `tailwind.config.js` `theme.extend.colors` with semantic names backed by
the existing blue scale so every gradient/text color pulls from one definition:

- `primary` / `primary-dark` — the current blue-600 → blue-900 range. All three
  existing ad hoc gradients (header logo, footer logo, Properties hero)
  collapse to reuse these two tokens.
- `ink` — slate-900, for headings and dark surfaces (footer, hero background).
- `muted` — slate-500, for secondary/meta text.
- `surface` / `surface-alt` — white / slate-50, for card and section
  backgrounds.
- `accent-gold` — the amber-500 → yellow-500 gradient currently inlined in the
  `Badge` "exclusive" variant, given a name so it's reusable elsewhere (e.g. a
  future exclusive-listing callout).

Also add to `theme.extend`:
- `borderRadius`: a single default (`2xl`) used everywhere cards/inputs/buttons
  currently mix `xl`/`2xl`.
- `boxShadow`: a two-step scale — `card` (rest) and `card-hover` — replacing the
  ad hoc `shadow-sm` / `shadow-xl` mix.

### 2. Typography

Keep Inter (Latin) / Heebo (Hebrew) — already loaded via Google Fonts in
`index.html`, no change needed there. Apply a real hierarchy instead of the
current flat bold/extrabold usage:
- H1/H2: heavier weight (`font-extrabold`), `tracking-tight`.
- Body copy: `font-normal`, relaxed line-height (already used in the
  description block — extend this to other body text).
- Meta/label text (city, type, badges): consistent `text-sm`/`text-xs` with
  `text-muted`.

### 3. Hero section (`Properties.jsx`)

Replace the dimmed-Unsplash-photo-behind-gradient with a solid `primary` →
`primary-dark` gradient and no background photo — removes the generic
stock-photo-template look while keeping the brand blue prominent. Restyle the
three filter `<select>` elements (city, listing type, property type) as a
single unified segmented/pill-style bar so the filter block reads as one
cohesive search control rather than three separate dropdowns in a translucent
box — no functional change to filtering logic. The stats row (Listings/For
Sale/For Rent/Exclusive counts) gets a light card/pill treatment per stat
instead of bare stacked numbers.

### 4. Cards & shared components

Unify `PropertyCard`, `Card`, `Badge`, `Button`, `Select` on the new tokens:
consistent radius (`rounded-2xl`), consistent shadow scale (`shadow-card` →
`shadow-card-hover` on hover, replacing today's `hover:shadow-xl`), and the
`primary`/`ink`/`muted` color tokens instead of raw `blue-*`/`slate-*` classes.

Add lightweight skeleton placeholders (pulsing gray blocks matching card
dimensions) for:
- The property grid while `Properties.jsx` loads.
- The gallery/summary card while `PropertyDetail.jsx` loads.

Implemented with Tailwind's built-in `animate-pulse` utility — no new
dependency.

### 5. Footer & Admin

Apply the same token set for visual consistency. No structural, layout, or
functional changes to either.

## Success criteria

- No raw `blue-*`, `slate-900` (outside of the token definitions themselves),
  or ad hoc gradient strings remain in component files — all pull from the new
  Tailwind theme tokens.
- Hero no longer uses a background photo.
- Loading states show skeleton placeholders instead of "Loading..." text.
- Visual identity (blue brand color) is unchanged in hue — only formalized and
  applied consistently.
- No new npm dependencies added.
- No behavior change: filtering, admin CRUD, language toggle, and routing all
  work exactly as before.
