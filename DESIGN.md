---
name: Premium Properties / נכסים פרימיום
description: Editorial-luxury, Hebrew-first RTL real-estate brokerage demo. Photography leads; ink, limestone and one brass accent.
colors:
  ink: "#1b1916"
  ink-soft: "#2b2824"
  stone-50: "#f9f7f3"
  stone-100: "#f3efe8"
  stone-200: "#e6dfd3"
  stone-300: "#d3c8b7"
  stone-400: "#a99e8f"
  stone-500: "#857a6c"
  stone-600: "#6b6257"
  stone-700: "#4f483f"
  white: "#ffffff"
  brass-light: "#c9a66b"
  brass: "#9a7440"
  brass-dark: "#7a5a2b"
  olive-light: "#a3b59a"
  olive: "#3d5a47"
  error: "#b91c1c"
  error-text: "#991b1b"
  error-bg: "#fef2f2"
typography:
  display:
    fontFamily: "'Frank Ruhl Libre', Georgia, serif"
    fontSize: "clamp(2.5rem, 6vw, 4.5rem)"
    fontWeight: 700
    lineHeight: 1.08
    letterSpacing: "normal"
  headline:
    fontFamily: "'Frank Ruhl Libre', Georgia, serif"
    fontSize: "2.25rem"
    fontWeight: 700
    lineHeight: 1.1
    letterSpacing: "normal"
  title:
    fontFamily: "'Frank Ruhl Libre', Georgia, serif"
    fontSize: "1.875rem"
    fontWeight: 700
    lineHeight: 1.25
    letterSpacing: "normal"
  card-title:
    fontFamily: "'Frank Ruhl Libre', Georgia, serif"
    fontSize: "22px"
    fontWeight: 700
    lineHeight: 1.375
    letterSpacing: "normal"
  price:
    fontFamily: "Heebo, Arial, sans-serif"
    fontSize: "1.125rem"
    fontWeight: 600
    lineHeight: 1.5
    fontFeature: "tnum"
  body-lead:
    fontFamily: "Heebo, Arial, sans-serif"
    fontSize: "1.125rem"
    fontWeight: 400
    lineHeight: 1.9
    letterSpacing: "normal"
  body:
    fontFamily: "Heebo, Arial, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.7
    letterSpacing: "normal"
  meta:
    fontFamily: "Heebo, Arial, sans-serif"
    fontSize: "15px"
    fontWeight: 400
    lineHeight: 1.7
    letterSpacing: "normal"
  label:
    fontFamily: "Heebo, Arial, sans-serif"
    fontSize: "13px"
    fontWeight: 600
    lineHeight: 1.25rem
    letterSpacing: "normal"
rounded:
  badge: "2px"
  sm: "4px"
  full: "9999px"
spacing:
  gutter-mobile: "16px"
  gutter-tablet: "24px"
  gutter-desktop: "32px"
  target: "44px"
  target-primary: "48px"
  grid-column-gap: "32px"
  grid-row-gap: "56px"
  section-mobile: "32px"
  section-desktop: "80px"
  container: "1280px"
components:
  button-primary:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.white}"
    typography: "{typography.meta}"
    rounded: "{rounded.sm}"
    padding: "0 20px"
    height: "44px"
  button-primary-hover:
    backgroundColor: "{colors.ink-soft}"
    textColor: "{colors.white}"
  button-outline:
    backgroundColor: "{colors.white}"
    textColor: "{colors.ink}"
    rounded: "{rounded.sm}"
    padding: "0 20px"
    height: "44px"
  button-outline-hover:
    backgroundColor: "{colors.stone-50}"
  button-ghost:
    backgroundColor: "transparent"
    textColor: "{colors.stone-700}"
    rounded: "{rounded.sm}"
    padding: "0 12px"
    height: "44px"
  button-ghost-hover:
    backgroundColor: "{colors.stone-200}"
    textColor: "{colors.ink}"
  button-secondary:
    backgroundColor: "{colors.stone-200}"
    textColor: "{colors.ink}"
    rounded: "{rounded.sm}"
    height: "44px"
  button-destructive:
    backgroundColor: "{colors.error}"
    textColor: "{colors.white}"
    rounded: "{rounded.sm}"
    height: "44px"
  button-on-ink:
    backgroundColor: "{colors.white}"
    textColor: "{colors.ink}"
    rounded: "{rounded.sm}"
    padding: "0 16px"
    height: "48px"
  input:
    backgroundColor: "{colors.white}"
    textColor: "{colors.ink}"
    typography: "{typography.body}"
    rounded: "{rounded.sm}"
    padding: "8px 12px"
    height: "44px"
  badge-sale:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.white}"
    typography: "{typography.label}"
    rounded: "{rounded.badge}"
    padding: "2px 10px"
  badge-rent:
    backgroundColor: "{colors.olive}"
    textColor: "{colors.white}"
    typography: "{typography.label}"
    rounded: "{rounded.badge}"
    padding: "2px 10px"
  badge-exclusive:
    backgroundColor: "{colors.brass-dark}"
    textColor: "{colors.white}"
    typography: "{typography.label}"
    rounded: "{rounded.badge}"
    padding: "2px 10px"
  badge-featured:
    backgroundColor: "transparent"
    textColor: "{colors.stone-700}"
    typography: "{typography.label}"
    rounded: "{rounded.badge}"
    padding: "2px 10px"
  header:
    backgroundColor: "{colors.stone-100}"
    textColor: "{colors.ink}"
    height: "64px"
  footer:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.stone-300}"
  contact-panel:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.stone-200}"
    rounded: "{rounded.sm}"
    padding: "32px"
  search-panel:
    backgroundColor: "{colors.white}"
    textColor: "{colors.ink}"
    padding: "8px"
  property-card:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    rounded: "{rounded.sm}"
  dialog:
    backgroundColor: "{colors.white}"
    textColor: "{colors.ink}"
    rounded: "{rounded.sm}"
    padding: "32px"
    width: "448px"
---

# Design System: Premium Properties / נכסים פרימיום

## Overview

**Creative North Star: "The Printed Property Sheet"**

The site behaves like a brokerage's printed listing sheet laid on limestone: a real photograph at full scale, a Hebrew serif headline set large, and the facts below it in a measured row separated by hairline rules. Nothing is boxed for decoration. Listing cards are a photo with type set under it, not a card with a border and a shadow. The only filled dark blocks are structural: the footer, the contact panel on a listing, and the primary action.

The world is warm and quiet. Warm near-black ink and limestone neutrals carry almost everything; brass is the single accent and appears as a thin line (active-nav underline, hover underline, focus ring, icon tint) far more often than as a fill. Olive exists only to tell a rental from a sale. There is no blue anywhere in the brand layer; any blue on screen comes from the photographs.

The system is Hebrew-first. The document opens as `lang="he" dir="rtl"`, every layout uses logical properties (start/end, `ps-`, `me-`), directional icons mirror in RTL, and the Hebrew type scale is enforced globally. English is a full second language, not a fallback. Credibility comes from restraint and real detail: no invented statistics, testimonials or claims, and demo data is labelled as demo.

**Key Characteristics:**
- Photography leads; the brand recedes to ink, limestone and a brass line.
- Hebrew-first RTL with logical properties and a dedicated Hebrew type scale.
- Serif headlines (Frank Ruhl Libre), one sans for everything else including numerals (Heebo).
- Hairline stone rules instead of card boxes; near-square 4px corners.
- Every target at least 44px; every focus a visible brass ring.
- Israeli formats: ₪ after the number in Hebrew, dd.MM.yyyy dates, local 03-… phone display.

## Colors

A warm, low-chroma palette: ink and limestone do the work, brass marks, olive distinguishes.

### Primary
- **Warm Ink** (ink): body text, headings, primary buttons, the footer and the listing contact panel. Never pure black. Hover step is **Soft Ink** (ink-soft).

### Secondary
- **Antique Brass** (brass): the single accent. Used as line and tint: focus rings, active-nav underline, card-title hover underline, map-pin and feature icons, list markers, the advisor monogram fill. Not used for body-size text on light grounds.
- **Dark Brass** (brass-dark): the text-safe brass (≥4.5:1 on limestone and white). Used for brass-coloured text links ("Clear filters"), the Exclusive badge fill, and icon tints inside notices.
- **Pale Brass** (brass-light): brass on ink. Footer column headings, focus rings on dark grounds, text selection highlight, link underline hover in the footer.

### Tertiary
- **Deep Olive** (olive): the rental status colour (rent badge, "available" dot in admin). 7:1 with white text. **Pale Olive** (olive-light) is only the inset ring on the rent badge.

### Neutral
- **Limestone** (stone-100): the page ground, header ground (95% with backdrop blur), mobile call bar ground.
- **Chalk** (stone-50): hover fill on outline buttons; footer wordmark on ink.
- **Sandstone** (stone-200): skeletons, image placeholders, ghost-button hover (60%), header bottom border.
- **Hairline Stone** (stone-300): the rules: results header rule, facts row, form section rules, input borders.
- **Weathered Stone** (stone-400 / stone-500): outline-badge ring, select chevrons, the scrollbar thumb, secondary text on ink. Never used for readable text on white.
- **Quiet Stone** (stone-600): meta text (type · city, facts, labels, counts) on limestone, and input placeholders on white (5.9:1).
- **Deep Stone** (stone-700): lead paragraphs, ghost-button text, label text.
- **White** (white): search panel, inputs, dialogs, the call button on ink.
- **Error Red** (error / error-text / error-bg): admin form errors and destructive actions only. Not a brand colour.

### Named Rules
**The One Brass Rule.** Brass is the only accent. It appears mostly as a 1–2px line or an icon tint; filled brass is reserved for the Exclusive badge (dark step) and the advisor monogram.

**The Dark-Step Text Rule.** Any brass that is read as text on a light ground uses brass-dark (#7a5a2b). Brass (#9a7440) is for lines, rings and icons only.

**The No-Blue Rule.** No blue in the brand layer: no blue buttons, links, focus rings, badges or gradients.

**The Status-by-Fill Rule.** All status badges share one frame; the fill alone separates them: sale = ink, rent = olive, Exclusive = brass-dark, Featured = transparent with a stone outline.

**The Browser-Surface Rule.** Parts the browser draws follow the palette too: the text caret is brass-dark, native checkboxes and radios take ink (`accent-color`), the scrollbar is a thin stone-400 thumb on limestone, and text selection is brass-light with ink text.

## Typography

**Display Font:** Frank Ruhl Libre (with Georgia, serif), weights 500/700, loaded from Google Fonts.
**Body Font:** Heebo (with Arial, sans-serif), weights 400/500/600/700. Heebo carries Hebrew and Latin, so a mixed line stays in one face.

**Character:** A Hebrew editorial serif for every headline against a clean, slightly technical sans for reading and numbers. The serif is set bold and large; the sans stays calm.

### Hierarchy
- **Display** (Frank Ruhl Libre 700, 40px → 60px → 72px, line-height 1.08, `text-wrap: balance`): the home hero H1 only, white on the photo scrim.
- **Headline** (Frank Ruhl Libre 700, 36px → 48px → 60px, line-height 1.1): the listing H1; page H1s on admin and the accessibility statement at 36–48px.
- **Title** (Frank Ruhl Libre 700, 30px → 36px): section headings ("All properties", "About the property", "Features"); 24px for the contact panel, empty state, dialog titles; 20px for admin form-section legends.
- **Card Title** (Frank Ruhl Libre 700, 22px, line-height 1.375, one line clamped): listing card titles; the wordmark at 22–24px.
- **Price** (Heebo 600, tabular figures): 18px on cards, 36px → 48px on the listing header. Fact values 20px semibold.
- **Body Lead** (Heebo 400, 18px, line-height 1.9 in Hebrew, max 65ch): listing description, statement paragraphs, hero subtitle (16px → 20px).
- **Body** (Heebo 400, 16px, line-height 1.7 in Hebrew): default text, inputs, selects.
- **Meta** (Heebo 400/500, 15px): type · city, fact labels, header controls, button text, sort control, labels.
- **Label** (Heebo 600, 13px): badges, the gallery counter, search-field captions (500 weight). 13px is the floor.

### Named Rules
**The Hebrew Floor Rule.** In RTL, no text is smaller than 13px (`text-xs` is lifted to 13px/20px), body line-height is 1.7, `leading-tight` becomes 1.4 and `leading-relaxed` 1.9, word-spacing is +0.05em.

**The No-Tracking Rule.** Hebrew is never letter-spaced; any tracking utility is reset to normal under `dir="rtl"`. No uppercase-tracked labels.

**The Tabular Numbers Rule.** Prices, counts, areas, phone numbers and the gallery counter use tabular figures so they align and don't jitter as filters change.

**The Israeli Format Rule.** Prices go through `Intl.NumberFormat('he-IL', {currency: 'ILS'})`, which puts ₪ after the number in Hebrew ("8,500,000 ₪", rent adds "לחודש"); English shows "₪8,500,000 / mo". Dates use he-IL 2-digit day/month (dd.MM.yyyy). Phones are stored as +972 and shown locally as 03-… in Hebrew, set `dir="ltr"`; the `tel:` link keeps the international form.

## Layout

A single centred container (max 1280px) with 16 / 24 / 32px side gutters at mobile / sm (640px) / lg (1024px). The sticky header is 64px, limestone at 95% with a backdrop blur and a stone-200 bottom rule.

The home page opens with a full-bleed photo hero (min 500px mobile, 640px sm, viewport height minus header at lg, capped 860px) with content anchored to the bottom: headline, subtitle, the search panel set into the photo, and the caption plate beneath it at the end side. On phones the panel is a single row, a "Filters" toggle (showing the number of active filters) beside the count-bearing submit, and the four selects open below on demand (`aria-expanded`), so the photograph keeps the first screen. From sm up the four selects sit in the panel: two columns at sm, a single five-track row on desktop (four selects plus the submit). Results follow in a 1 / 2 / 3-column grid with a 32px column gap and 56px row gap, introduced by a heading row that sits on a stone-300 hairline with count, "Clear filters" and the sort select on the end side.

The listing page reads top to bottom like a sheet: back link, a header row (badges, H1 and address at start; price at end on desktop) closed by a hairline, a full-width gallery (4:3 mobile, 16:9 desktop) with a thumbnail strip, a facts row as a `dl` between two hairlines (2 / 3 / 6 columns), then a two-column body (text, and a 380px sticky contact panel) on desktop. On mobile a sticky bottom bar keeps Call and WhatsApp in reach and stops at the page end.

Section rhythm: 32px vertical padding on mobile, 80px at sm and up for results; 48–64px between listing body blocks. Breakpoints are Tailwind defaults (sm 640, md 768, lg 1024); navigation links show at md, the mobile call bar hides at lg.

**The Logical Properties Rule.** Layout uses start/end, `ps-`/`pe-`, `ms-`/`me-` and `text-start`/`text-end` only. Directional icons (arrows, chevrons, login) flip with `rtl:-scale-x-100`.

**The 44px Rule.** Every interactive element is at least 44px tall (`min-h-11`); primary call actions and gallery arrows are 48px.

## Elevation & Depth

Flat by default, with depth carried by photography, the ink blocks and hairline rules. Cards have no shadow and no border. Shadows appear only on things that float over other content.

### Shadow Vocabulary
- **Panel** (`box-shadow: 0 18px 40px -12px rgba(27, 25, 22, 0.45)`): the hero search panel, dialogs, dropdown menus, the focused skip link. Warm, ink-tinted, deep and soft.
- **Badge lift** (Tailwind `shadow-sm`): status badges lying on photographs, so they read against bright images. Removed on the outline Featured badge.

### Named Rules
**The Float-Only Shadow Rule.** A shadow means "this floats above a photo or the page". Inline content, cards and the contact panel stay flat.

## Shapes

Near-square everywhere: 4px corners on buttons, inputs, selects, images, the card focus outline, the contact panel, dialogs, menus and notices. Badges and the gallery counter are tighter at 2px. Full circles are reserved for icon-only round controls (gallery previous/next), the advisor monogram and status dots. Separation is done with 1px stone-300 hairlines, not boxes; the one dashed border is the empty-results state.

**The 4px Rule.** Corners are 4px (2px for badges). No pill buttons, no 12–16px rounded cards.

## Components

### Buttons
Quiet, solid, near-square.
- **Shape:** gently squared (4px).
- **Primary:** Warm Ink fill, white text, 15px semibold, 44px tall, 20px inline padding (48–56px tall for the hero submit and call actions). Hover to Soft Ink.
- **Outline:** white fill, stone-300 border, ink text; hover to stone-400 border on Chalk.
- **Ghost:** no fill, stone-700 text; hover Sandstone at 60% with ink text. Used for header controls and admin icon buttons (44×44).
- **Secondary / Destructive:** Sandstone fill with ink text; Error Red fill with white text (admin only).
- **On ink:** inside the contact panel the call button is white with ink text; WhatsApp is a stone-500 inset outline with white text.
- **Focus:** 2px brass ring with 2px offset (offset colour matches the ground: limestone, or ink on dark panels). Disabled at 50–60% opacity.

### Chips (Status Badges)
- **Style:** 2px corners, 13px semibold, 2px × 10px padding, 1px inset ring, small lift shadow on photos.
- **Variants:** sale = ink at 90% with a white/25 ring; rent = olive with olive-light ring; Exclusive ("בבלעדיות") = brass-dark with brass-light ring; Featured = transparent, stone-700 text, stone-400 ring, no shadow (shown on the listing page only).

### Cards / Containers
- **Property card:** no box. A 4:3 photo (4px corners, Sandstone placeholder) with badges at the top-start corner, then the serif card title, the meta line under it (type · city, 15px stone-600; never above the title as an eyebrow), the price and a facts line separated by middle dots (with screen-reader commas). Hover: photo scales to 1.03 over 700ms and the title gains a 1px brass underline at 6px offset. The whole card is one link with a brass focus ring offset 4px.
- **Contact panel:** the one ink block on the listing page. 32px padding, serif title in white, advisor initials monogram (56px brass circle, ink serif initials), stacked call / WhatsApp / email actions.
- **Admin table:** no box. It sits on the limestone ground like the rest of the site: a stone-400 rule under the column headings, stone-300 hairlines between rows, Sandstone/40 row hover, a screen-reader caption and `scope="col"` headers.
- **Notice:** white with a brass/60 inset ring and a dark-brass warning icon (statement demo note); error notices are error-bg with an error inset ring.

### Inputs / Fields
- **Style:** white, 1px stone-300 border, 4px corners, 44px tall, 16px text, stone-600 placeholder (5.9:1). Hover border stone-400. Native selects keep native behaviour with a stone-500 chevron at the end side.
- **Focus:** border turns ink plus a 2px brass/60 ring.
- **Error:** `aria-invalid` turns the border Error Red; the message sits below in 15px error-text with an icon, and a summary alert heads the form.
- **Search field (hero):** borderless select under a 13px caption; the whole field cell highlights (Chalk hover, Limestone when focused) and draws the brass ring on keyboard focus.

### Navigation
- **Header:** serif wordmark at the start; at the end, text-weight controls (15px medium, stone-700, 44px tall, 4px corners): nav links (md+), a 1px stone-300 divider, the language toggle (Globe icon, the other language's name in its own `lang`), and login or the user menu. The active link is ink with a 2px brass underline at 10px offset.
- **Footer:** ink ground, three columns (wordmark and tagline; Contact; Services) with brass-light 14px semibold column headings. Contact holds the only links (email and phone, always underlined in stone-600, brass-light on hover, 44px targets) plus the demo address; Services is one plain-text line, "Property sales and rentals" / "מכירה והשכרה של נכסים", styled so it never looks clickable. Then a bottom row on a stone-700 hairline with copyright, the accessibility statement link and the demo-site note.
- **Skip link:** first tab stop; appears top-start as a white chip with panel shadow and brass ring.

### Hero Caption Plate (signature)
A small ink/70 plate at the hero's bottom-end corner, directly under the search panel, 44px tall: "Pictured:" in stone-400 then the photographed listing's title · city, linking to it. It names the real listing in the photo rather than decorating it. It sits in its own row below the panel (the panel owns the bottom edge), so it never overlaps the search or the headline.

### Gallery (signature)
Full-width 4:3 / 16:9 image, 48px round ink/70 previous/next buttons at start and end, an "n / total" counter (2px ink/75 plate, `dir="ltr"`) at the bottom-end, and a strip of 112×80 thumbnails where the current one wears a brass ring.

### Mobile Call Bar
Sticky to the bottom below lg: limestone at 95% with blur and a stone-300 top rule; two equal 48px actions, Call (ink) and WhatsApp (white with stone-300 ring).

### Dialog / Menu
White, 4px corners, panel shadow; dialog max 448px with 24–32px padding over an ink/50 blurred backdrop, focus trapped and returned. Menu items are 44px, 15px stone-700, Limestone hover.

### Motion
One signature move: the hero photo settles from scale 1.06 to 1 over 1.6s (`cubic-bezier(0.16, 1, 0.3, 1)`). Otherwise only colour transitions and the 700ms card-photo zoom. All of it is disabled under `prefers-reduced-motion`, and smooth scrolling to results falls back to instant.

## Do's and Don'ts

### Do:
- **Do** let a real listing photograph carry the first viewport; name it with the caption plate.
- **Do** use ink, limestone and stone for almost everything, with brass as a line or tint (One Brass Rule).
- **Do** use brass-dark (#7a5a2b) for any brass text on light grounds and keep all text at ≥4.5:1.
- **Do** set headlines in Frank Ruhl Libre bold and everything else, including numbers, in Heebo with tabular figures.
- **Do** keep Hebrew at 13px minimum, line-height 1.7, with no letter-spacing.
- **Do** use logical properties and mirror directional icons in RTL.
- **Do** format prices with Intl he-IL (₪ after the number in Hebrew), dates as dd.MM.yyyy, and phones as local 03-… in Hebrew with `dir="ltr"`.
- **Do** make every target at least 44px and give every focusable element a visible 2px brass ring (brass-light on ink).
- **Do** separate content with 1px stone-300 hairlines and keep corners at 4px (2px for badges).
- **Do** label demo data as demo (footer note, statement draft note, placeholder WhatsApp that dials nothing).

### Don't:
- **Don't** use blue anywhere in the brand layer.
- **Don't** add kickers or eyebrows (small uppercase labels above headings).
- **Don't** invent statistics, counts, testimonials or claims; the only numbers shown are real listing data.
- **Don't** wrap listings in bordered, shadowed, heavily rounded cards.
- **Don't** add shadows to inline content; shadows are for floating panels only.
- **Don't** use physical left/right properties or unmirrored arrows.
- **Don't** letter-space or uppercase Hebrew.
- **Don't** add a second accent colour; olive is a status colour for rentals, not decoration.
