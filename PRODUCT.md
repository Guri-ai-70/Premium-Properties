# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Visitors browsing high-end Israeli property for sale or rent, mostly on phones, Hebrew first with an English option. Secondary user: the site owner, who manages listings in the admin panel.

## Product Purpose

A demo website for a premium Israeli real-estate brokerage ("נכסים פרימיום" / Premium Properties). Visitors filter listings, open a listing and contact the office. Success means the site reads as a credible, professional brokerage and works well on mobile and desktop.

## Positioning

A small, curated set of premium listings across Israel (Tel Aviv coast, Herzliya Pituach, Jerusalem, Galilee), with exclusive mandates (בבלעדיות) marked as such.

## Operating Context

Static React + Vite + Tailwind site on GitHub Pages with hash routing and no backend. Listings live in localStorage and are seeded from `src/entities/seed.js`. The admin login only hides the panel and is not real security.

## Capabilities and Constraints

- Keep every feature: city, deal-type and property-type filters, detail pages with gallery, admin login with full CRUD (photo upload or URL, delete confirmation), the Exclusive badge, and the EN/HE toggle with RTL.
- Bilingual copy everywhere; Hebrew is the default.
- Keep the stack. No push or deploy without the owner's approval.

## Brand Commitments

- Name: נכסים פרימיום / Premium Properties.
- Visual direction chosen by the owner: editorial luxury, with a photo-led hero, a Hebrew serif for headings, and deep ink and warm stone with a brass accent. No blue brand.

## Evidence on Hand

- Six seeded demo listings with Unsplash photos (`src/entities/seed.js`).
- No real statistics, testimonials or agents. **Never invent stats or numbers.**
- A fictional agent name and a generic, non-real-person photo are allowed, marked as demo data in `seed.js`.
- WhatsApp must use a placeholder that dials no real number; the owner will add theirs later.
- The footer carries a small "Demo site" note.

## Product Principles

1. The photography is the product, so let it lead.
2. Search is the primary action and stays in working form at the top.
3. Credibility comes from restraint and real detail, never from invented claims.
4. Hebrew-first: correct RTL, Israeli formats, and a Hebrew type scale.

## Accessibility & Inclusion

WCAG AA contrast, keyboard access, visible focus and a skip link (already present, keep them), 44px touch targets, and respect for reduced motion.
