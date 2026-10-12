---
version: 1
slug: "src-pages-propertydetail-jsx"
primary_target: "src/pages/PropertyDetail.jsx"
related_targets: ["src/components/StatusBadges.jsx"]
---

Scope: property detail page (src/pages/PropertyDetail.jsx), shared status badges (src/components/StatusBadges.jsx). Mode: Persuade (the visitor decides whether to contact). Stage 2 of a staged redesign; it inherits the home page's world (see src/pages/Properties.jsx brief) and changes no tokens.

Audience and job: a visitor who opened one listing, often on a phone, judging the property and deciding whether to call. Primary action: call the office; secondary: WhatsApp (placeholder until the owner adds a number), email.

Constraints: no invented stats or claims; fictional agent (Dana Alon / דנה אלון) with an initials monogram, not a photo of any person; WhatsApp opens no chat while WHATSAPP_NUMBER is empty; demo phone 03-1234567. Keep the gallery, all facts, the features, and the Exclusive badge.

## Direction contract

THESIS: The listing reads like a printed property sheet: title and price first, then the photographs at full width, then facts set as a measured row. It refuses the boxed sidebar that crams everything into one card.

OWN-WORLD: Inherited from the home page: limestone ground, warm ink, brass accent, olive for rentals. Frank Ruhl Libre headlines, Heebo text. 4px corners and hairline stone rules. The contact panel is the one ink block on the page.

STORY: Visitors see what and where it is and what it costs, browse the photos, scan the facts and features, and contact a named advisor.

FIRST VIEWPORT: The back link, then the header row with the badges, a serif H1 and the address on the start side and the price on the end side. Below sits a full-width gallery image (16:9 on desktop, 4:3 on mobile) with previous/next controls and an "n / total" counter.

FORM: inherited from the home direction (owner-pinned editorial luxury); no seed key.

FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance
