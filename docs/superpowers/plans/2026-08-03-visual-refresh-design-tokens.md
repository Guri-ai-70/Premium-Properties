# Visual Refresh via Design Tokens Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Consolidate the ad hoc, inconsistent blue/slate colors and radius/shadow values scattered across Premium Properties into a real Tailwind design-token system, and apply it everywhere — while removing the hero's stock-photo-behind-gradient pattern, unifying the filter bar into one visual control, and adding skeleton loading states.

**Architecture:** Pure presentation-layer change. Add semantic color/shadow tokens to `tailwind.config.js`, then update every component's className strings to reference those tokens instead of raw Tailwind color utilities. No new files except one shared `Skeleton` UI primitive. No data, routing, or state changes anywhere.

**Tech Stack:** React 18, Vite, Tailwind CSS 3 (existing stack — no additions).

## Global Constraints

- No new npm dependencies — spec explicitly forbids this. Every task uses only Tailwind utilities and existing project code.
- No behavior change — filtering logic, admin CRUD, language toggle (EN/HE + RTL), and routing must work exactly as before every task. Only `className` strings and JSX structure around styling change.
- Brand hue is unchanged, except one intentional, already-approved change: the header logo, footer logo, and Properties hero background gradients (previously three different ad hoc blue gradients) all become the same `primary → primary-dark` gradient. This was shown in a mockup and approved by the user.
- Card title and price text (`PropertyCard`, and the summary card on `PropertyDetail`) keep their current bold/extrabold font weight exactly as-is — confirmed via mockup review. Only their color changes (raw `blue-700`/`slate-900` → token).
- **No test framework exists in this repo and none may be added** (see first constraint above). Each task below substitutes automated unit tests with: (a) a `grep`-style check that the forbidden raw utility class is gone and the expected token class is present, and (b) `npm run build` succeeding. Where a task changes something visually observable, a manual dev-server check is also listed — this is the closest equivalent to "run the test and watch it pass" available in a project with zero test infrastructure.
- The `grep` commands below are written as plain shell (`grep -rn`) for portability; using the Grep tool with equivalent pattern/path is equally valid.

---

### Task 1: Add design tokens to Tailwind config

**Files:**
- Modify: `tailwind.config.js`

**Interfaces:**
- Produces: Tailwind color tokens `primary` (with shades `50,100,200,500,600,700,900`, plus `DEFAULT` = `600` and `dark` = `900`), `ink`, `muted`, `surface`, `surface-alt`, `accent-gold` (with `DEFAULT` and `light`). Produces `boxShadow` tokens `card` and `card-hover`. Every later task consumes these by class name (e.g. `bg-primary`, `text-primary-700`, `bg-ink`, `shadow-card`).

- [ ] **Step 1: Replace the Tailwind config with the token-extended version**

Replace the full contents of `tailwind.config.js` with:

```js
/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
      colors: {
        primary: {
          50: "#eff6ff",
          100: "#dbeafe",
          200: "#bfdbfe",
          500: "#3b82f6",
          600: "#2563eb",
          700: "#1d4ed8",
          900: "#0c2f63",
          DEFAULT: "#2563eb",
          dark: "#0c2f63",
        },
        ink: "#0f172a",
        muted: "#64748b",
        surface: "#ffffff",
        "surface-alt": "#f8fafc",
        "accent-gold": {
          DEFAULT: "#f59e0b",
          light: "#eab308",
        },
      },
      boxShadow: {
        card: "0 1px 3px 0 rgba(15, 23, 42, 0.08), 0 1px 2px -1px rgba(15, 23, 42, 0.06)",
        "card-hover":
          "0 10px 25px -5px rgba(15, 23, 42, 0.15), 0 8px 10px -6px rgba(15, 23, 42, 0.1)",
      },
    },
  },
  plugins: [],
};
```

- [ ] **Step 2: Verify the config is valid**

Run: `npm run build`
Expected: build completes with exit code 0 and no Tailwind/PostCSS errors. (The new tokens aren't referenced by any component yet, so the compiled CSS won't show them until Task 2 onward — this step only confirms the config itself is syntactically and structurally valid.)

- [ ] **Step 3: Commit**

```bash
git add tailwind.config.js
git commit -m "Add design tokens (primary, ink, muted, surface, accent-gold, card shadows) to Tailwind config"
```

---

### Task 2: Apply tokens to shared `ui/` primitives

**Files:**
- Modify: `src/components/ui/button.jsx`
- Modify: `src/components/ui/badge.jsx`
- Modify: `src/components/ui/card.jsx`
- Modify: `src/components/ui/select.jsx`
- Modify: `src/components/ui/input.jsx`
- Modify: `src/components/ui/textarea.jsx`
- Modify: `src/components/ui/dialog.jsx`

**Interfaces:**
- Consumes: tokens from Task 1 (`primary`, `primary-*`, `ink`, `accent-gold`, `accent-gold-light`, `shadow-card`).
- Produces: no API changes — every component keeps the exact same props/exports (`Button`, `buttonVariants`, `Badge`, `Card`/`CardHeader`/`CardTitle`/`CardContent`/`CardFooter`, `Select`, `Input`, `Textarea`, `Modal`). Only internal `className` strings change.

- [ ] **Step 1: Confirm the raw classes exist before the change**

Run: `grep -rn "blue-500\|blue-600\|blue-700\|slate-900" src/components/ui`
Expected: matches in `button.jsx` (`ring-blue-500`, `bg-blue-600`, `hover:bg-blue-700`), `badge.jsx` (`bg-blue-600`), `select.jsx` (`ring-blue-500`), `input.jsx` (`ring-blue-500`), `textarea.jsx` (`ring-blue-500`), `dialog.jsx` (`bg-slate-900/50`).

- [ ] **Step 2: Update `button.jsx`**

In the `cva` base string, replace:
```
focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2
```
with:
```
focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2
```

In `variants.variant.default`, replace:
```js
default: "bg-blue-600 text-white hover:bg-blue-700 shadow-sm",
```
with:
```js
default: "bg-primary text-white hover:bg-primary-700 shadow-card",
```

- [ ] **Step 3: Update `badge.jsx`**

Replace the `styles` object with:
```js
const styles = {
  default: "bg-primary text-white",
  secondary: "bg-slate-100 text-slate-700",
  success: "bg-emerald-100 text-emerald-700",
  warning: "bg-amber-100 text-amber-700",
  outline: "border border-slate-300 text-slate-700",
  exclusive:
    "bg-gradient-to-r from-accent-gold to-accent-gold-light text-white shadow-sm",
};
```

- [ ] **Step 4: Update `card.jsx`**

In the `Card` component, replace:
```js
"rounded-2xl border border-slate-200 bg-white text-slate-900 shadow-sm",
```
with:
```js
"rounded-2xl border border-slate-200 bg-surface text-ink shadow-card",
```

- [ ] **Step 5: Update `select.jsx`**

Replace:
```
"flex h-10 w-full appearance-none rounded-lg border border-slate-200 bg-white px-3 py-2 pr-9 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 disabled:opacity-50",
```
with:
```
"flex h-10 w-full appearance-none rounded-lg border border-slate-200 bg-surface px-3 py-2 pr-9 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 disabled:opacity-50",
```

- [ ] **Step 6: Update `input.jsx`**

Replace:
```
"flex h-10 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm placeholder:text-slate-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 disabled:opacity-50",
```
with:
```
"flex h-10 w-full rounded-lg border border-slate-200 bg-surface px-3 py-2 text-sm placeholder:text-slate-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 disabled:opacity-50",
```

- [ ] **Step 7: Update `textarea.jsx`**

Replace:
```
"flex min-h-[90px] w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm placeholder:text-slate-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 disabled:opacity-50",
```
with:
```
"flex min-h-[90px] w-full rounded-lg border border-slate-200 bg-surface px-3 py-2 text-sm placeholder:text-slate-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 disabled:opacity-50",
```

- [ ] **Step 8: Update `dialog.jsx`**

Replace:
```
className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm"
```
with:
```
className="absolute inset-0 bg-ink/50 backdrop-blur-sm"
```

- [ ] **Step 9: Verify the raw classes are gone**

Run: `grep -rn "blue-500\|blue-600\|blue-700\|slate-900" src/components/ui`
Expected: no matches.

Run: `grep -rln "primary\|ink\|accent-gold\|shadow-card\|bg-surface" src/components/ui`
Expected: `button.jsx`, `badge.jsx`, `card.jsx`, `select.jsx`, `input.jsx`, `textarea.jsx`, `dialog.jsx` all listed.

- [ ] **Step 10: Build check**

Run: `npm run build`
Expected: exit code 0, no errors.

- [ ] **Step 11: Manual visual check**

Start the dev server (`npm run dev`), open the Properties page. Buttons, badges, cards, and dropdown chrome should look visually identical to before this task (same blue, same shadow softness) — this task only changes *where* the color is defined, not what it looks like.

- [ ] **Step 12: Commit**

```bash
git add src/components/ui/button.jsx src/components/ui/badge.jsx src/components/ui/card.jsx src/components/ui/select.jsx src/components/ui/input.jsx src/components/ui/textarea.jsx src/components/ui/dialog.jsx
git commit -m "Apply design tokens to shared ui/ primitives"
```

---

### Task 3: Add a shared Skeleton loading primitive

**Files:**
- Create: `src/components/ui/skeleton.jsx`

**Interfaces:**
- Produces: `Skeleton` component — `<Skeleton className="..." />`, renders a `div` with pulsing gray fill. `className` controls size/shape (height/width/rounding) exactly like any other styled `div`.

- [ ] **Step 1: Create the component**

```jsx
import React from "react";
import { cn } from "@/lib/utils";

export function Skeleton({ className, ...props }) {
  return (
    <div
      className={cn("animate-pulse rounded-2xl bg-slate-200", className)}
      {...props}
    />
  );
}
```

- [ ] **Step 2: Verify it exists and exports correctly**

Run: `grep -n "export function Skeleton" src/components/ui/skeleton.jsx`
Expected: one match.

- [ ] **Step 3: Build check**

Run: `npm run build`
Expected: exit code 0. (Unused until Tasks 6 and 8 import it — Vite/Tailwind won't error on an unreferenced file.)

- [ ] **Step 4: Commit**

```bash
git add src/components/ui/skeleton.jsx
git commit -m "Add shared Skeleton loading primitive"
```

---

### Task 4: Apply tokens to Layout.jsx (header, footer, active nav)

**Files:**
- Modify: `src/pages/Layout.jsx`

**Interfaces:**
- Consumes: `primary`, `primary-dark`, `primary-50`, `primary-700`, `ink` from Task 1.
- Produces: no prop/API change — `Layout` still takes `{ children, currentPageName }`.

- [ ] **Step 1: Confirm raw classes exist**

Run: `grep -n "blue-\|slate-900" src/pages/Layout.jsx`
Expected: matches for `to-blue-50` (page background gradient), `from-blue-600 to-blue-700` (header logo), `text-slate-900` (company name heading), `bg-blue-50 text-blue-700` (active nav link), `from-blue-500 to-blue-600` (footer logo), `bg-slate-900` (footer background).

- [ ] **Step 2: Update the page background gradient**

Replace:
```
className={`min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 ${language === 'he' ? 'rtl' : 'ltr'}`}
```
with:
```
className={`min-h-screen bg-gradient-to-br from-slate-50 to-primary-50 ${language === 'he' ? 'rtl' : 'ltr'}`}
```

- [ ] **Step 3: Update the header logo gradient**

Replace:
```
<div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl flex items-center justify-center shadow-lg">
```
with:
```
<div className="w-10 h-10 bg-gradient-to-r from-primary to-primary-dark rounded-xl flex items-center justify-center shadow-lg">
```

- [ ] **Step 4: Update the company name heading color**

Replace:
```
<h1 className="text-xl font-bold text-slate-900">
```
with:
```
<h1 className="text-xl font-bold text-ink">
```

- [ ] **Step 5: Update the active nav link colors**

Replace:
```js
location.pathname === item.url
  ? 'bg-blue-50 text-blue-700'
  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
```
with:
```js
location.pathname === item.url
  ? 'bg-primary-50 text-primary-700'
  : 'text-slate-600 hover:text-ink hover:bg-slate-50'
```

- [ ] **Step 6: Update the footer logo gradient**

Replace:
```
<div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
```
with:
```
<div className="w-8 h-8 bg-gradient-to-r from-primary to-primary-dark rounded-lg flex items-center justify-center">
```

- [ ] **Step 7: Update the footer background**

Replace:
```
<footer className="bg-slate-900 text-white py-12">
```
with:
```
<footer className="bg-ink text-white py-12">
```

- [ ] **Step 8: Verify raw classes are gone**

Run: `grep -n "blue-\|slate-900" src/pages/Layout.jsx`
Expected: no matches.

- [ ] **Step 9: Build check**

Run: `npm run build`
Expected: exit code 0.

- [ ] **Step 10: Manual visual check**

Start the dev server. Confirm the header logo, the active "Properties" nav pill, and the footer logo/background all still render in blue tones — the header and footer logos will now look identical to each other (both use the same `primary → primary-dark` gradient), which is the intended consolidation.

- [ ] **Step 11: Commit**

```bash
git add src/pages/Layout.jsx
git commit -m "Apply design tokens to Layout header, nav, and footer"
```

---

### Task 5: Apply tokens to Admin.jsx (color only, no logic change)

**Files:**
- Modify: `src/pages/Admin.jsx`

**Interfaces:**
- Consumes: `primary`, `ink` from Task 1.
- Produces: no change — same component behavior, same exports.

- [ ] **Step 1: Confirm raw classes exist**

Run: `grep -n "bg-blue-600\|text-slate-900" src/pages/Admin.jsx`
Expected: 6 matches — the lock icon circle, three `<h1>` headings ("Admin Login", "New/Edit Property", "Manage Properties"), the image "Cover" badge, the table's property name/price cells, and the delete-confirmation heading.

- [ ] **Step 2: Update the lock icon circle (login gate)**

Replace:
```
<div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-blue-600 text-white shadow-lg">
```
with:
```
<div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-white shadow-lg">
```

- [ ] **Step 3: Update the "Admin Login" heading**

Replace:
```
<h1 className="text-2xl font-bold text-slate-900">
  {t("Admin Login", "כניסת מנהל")}
</h1>
```
with:
```
<h1 className="text-2xl font-bold text-ink">
  {t("Admin Login", "כניסת מנהל")}
</h1>
```

- [ ] **Step 4: Update the "New/Edit Property" form heading**

Replace:
```
<h1 className="text-2xl font-bold text-slate-900">
  {editing === "new" ? t("New Property", "נכס חדש") : t("Edit Property", "עריכת נכס")}
</h1>
```
with:
```
<h1 className="text-2xl font-bold text-ink">
  {editing === "new" ? t("New Property", "נכס חדש") : t("Edit Property", "עריכת נכס")}
</h1>
```

- [ ] **Step 5: Update the "Cover" image badge**

Replace:
```
<span className="absolute bottom-1 left-1 rounded bg-blue-600 px-1.5 py-0.5 text-[10px] font-semibold text-white">
```
with:
```
<span className="absolute bottom-1 left-1 rounded bg-primary px-1.5 py-0.5 text-[10px] font-semibold text-white">
```

- [ ] **Step 6: Update the "Manage Properties" heading**

Replace:
```
<h1 className="text-2xl font-bold text-slate-900">
  {t("Manage Properties", "ניהול נכסים")}
</h1>
```
with:
```
<h1 className="text-2xl font-bold text-ink">
  {t("Manage Properties", "ניהול נכסים")}
</h1>
```

- [ ] **Step 7: Update the property table's name and price cells**

Replace:
```
<span className="font-medium text-slate-900">
  {language === "he" ? p.title_he || p.title : p.title}
</span>
```
with:
```
<span className="font-medium text-ink">
  {language === "he" ? p.title_he || p.title : p.title}
</span>
```

Replace:
```
<td className="px-4 py-3 font-medium text-slate-900">
  {formatPrice(p.price, p.currency, p.listing_type, language)}
</td>
```
with:
```
<td className="px-4 py-3 font-medium text-ink">
  {formatPrice(p.price, p.currency, p.listing_type, language)}
</td>
```

- [ ] **Step 8: Update the delete-confirmation heading**

Replace:
```
<h3 className="text-lg font-bold text-slate-900">
  {t("Are you sure you want to delete?", "האם אתה בטוח שברצונך למחוק?")}
</h3>
```
with:
```
<h3 className="text-lg font-bold text-ink">
  {t("Are you sure you want to delete?", "האם אתה בטוח שברצונך למחוק?")}
</h3>
```

- [ ] **Step 9: Verify raw classes are gone**

Run: `grep -n "bg-blue-600\|text-slate-900" src/pages/Admin.jsx`
Expected: no matches.

- [ ] **Step 10: Build check**

Run: `npm run build`
Expected: exit code 0.

- [ ] **Step 11: Manual visual check**

Log into Admin (`admin` / `premium2026`), confirm the login card, property list table, "Add/Edit Property" form, and the delete-confirmation modal all render unchanged visually, and that create/edit/delete still work exactly as before (this task is colors only — verify nothing broke functionally).

- [ ] **Step 12: Commit**

```bash
git add src/pages/Admin.jsx
git commit -m "Apply design tokens to Admin page"
```

---

### Task 6: Redesign the Properties hero and add grid loading skeleton

**Files:**
- Modify: `src/pages/Properties.jsx`

**Interfaces:**
- Consumes: `Skeleton` from Task 3 (`import { Skeleton } from "@/components/ui/skeleton";`); `primary`, `primary-dark`, `primary-100`, `primary-200`, `ink`, `muted`, `shadow-card` tokens from Task 1.
- Produces: no change to `Properties` component's external behavior — same route, same filtering logic, same data shape consumed.

- [ ] **Step 1: Confirm current state**

Run: `grep -n "blue-\|slate-900" src/pages/Properties.jsx`
Expected: matches in the hero background gradient, the photo overlay, the badge/paragraph text colors, the three `Select` `className="text-slate-900"` props, the stats label color, and the "All Properties" heading.

- [ ] **Step 2: Add the Skeleton import**

At the top of the file, add:
```js
import { Skeleton } from "@/components/ui/skeleton";
```

- [ ] **Step 3: Replace the hero section**

Replace the entire `{/* Hero */}` `<section>` block (from `<section className="relative overflow-hidden text-white">` through its closing `</section>`) with:

```jsx
{/* Hero */}
<section className="relative overflow-hidden text-white">
  <div className="absolute inset-0 bg-gradient-to-br from-primary to-primary-dark" />
  <div className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
    <span className="inline-flex items-center rounded-full bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-primary-100 ring-1 ring-white/20">
      {t("Premium Real Estate", "נדל\"ן יוקרתי")}
    </span>
    <h1 className="mt-4 text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl">
      {t("Find Your Next Home", "מצאו את הבית הבא שלכם")}
    </h1>
    <p className="mt-4 max-w-2xl text-lg text-primary-100">
      {t(
        "Browse a curated selection of premium properties for sale and rent across Israel.",
        "עיינו במבחר נכסי יוקרה למכירה ולהשכרה ברחבי ישראל."
      )}
    </p>

    {/* Filters */}
    <div className="mt-8 flex flex-col gap-1.5 rounded-3xl bg-white p-1.5 shadow-card sm:flex-row sm:divide-x sm:divide-slate-200">
      <Select
        value={city}
        onChange={(e) => setCity(e.target.value)}
        className="rounded-full border-0 bg-transparent text-ink sm:flex-1"
        options={[
          { value: "all", label: t("All cities", "כל הערים") },
          ...cityOptions.map((c) => ({
            value: c.en,
            label: language === "he" ? c.he : c.en,
          })),
        ]}
      />
      <Select
        value={listingType}
        onChange={(e) => setListingType(e.target.value)}
        className="rounded-full border-0 bg-transparent text-ink sm:flex-1"
        options={[
          { value: "all", label: t("All listings", "כל הנכסים") },
          { value: "sale", label: t("For Sale", "למכירה") },
          { value: "rent", label: t("For Rent", "להשכרה") },
        ]}
      />
      <Select
        value={propertyType}
        onChange={(e) => setPropertyType(e.target.value)}
        className="rounded-full border-0 bg-transparent text-ink sm:flex-1"
        options={[
          { value: "all", label: t("All types", "כל הסוגים") },
          { value: "apartment", label: t("Apartment", "דירה") },
          { value: "garden_apartment", label: t("Garden Apartment", "דירת גן") },
          { value: "duplex", label: t("Duplex", "דופלקס") },
          { value: "penthouse", label: t("Penthouse", "פנטהאוז") },
          { value: "mini_penthouse", label: t("Mini Penthouse", "מיני פנטהאוז") },
          { value: "house", label: t("House", "בית") },
          { value: "villa", label: t("Villa", "וילה") },
          { value: "commercial", label: t("Commercial", "מסחרי") },
          { value: "plot", label: t("Plot", "מגרש") },
        ]}
      />
    </div>

    {/* Live stats */}
    <div className="mt-8 grid max-w-2xl grid-cols-4 gap-3">
      {stats.map((s) => (
        <div
          key={s.label}
          className="rounded-2xl bg-white/10 px-3 py-2 text-center ring-1 ring-white/15"
        >
          <div className="text-2xl font-extrabold sm:text-3xl">{s.value}</div>
          <div className="text-xs text-primary-200 sm:text-sm">{s.label}</div>
        </div>
      ))}
    </div>
  </div>
</section>
```

This removes the dimmed background photo `<div>` entirely and the old 3-stop `from-blue-800 via-blue-900 to-slate-900` gradient, per the spec.

- [ ] **Step 4: Replace the loading state with a grid skeleton**

Replace:
```jsx
{loading ? (
  <p className="text-center text-slate-500">{t("Loading...", "טוען...")}</p>
) : (
```
with:
```jsx
{loading ? (
  <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
    {Array.from({ length: 6 }).map((_, i) => (
      <div key={i} className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
        <Skeleton className="h-52 w-full rounded-none" />
        <div className="space-y-3 p-5">
          <Skeleton className="h-4 w-1/3" />
          <Skeleton className="h-5 w-2/3" />
          <Skeleton className="h-6 w-1/2" />
        </div>
      </div>
    ))}
  </div>
) : (
```
(the existing `</section>` after the ternary's `false` branch, and the ternary's overall structure, stay the same — only the `true`-branch JSX changes).

- [ ] **Step 5: Update the "All Properties" heading and results-count colors**

Replace:
```
<h2 className="text-2xl font-bold text-slate-900">
  {t("All Properties", "כל הנכסים")}
</h2>
<span className="text-sm text-slate-500">
  {filtered.length} {t("results", "תוצאות")}
</span>
```
with:
```
<h2 className="text-2xl font-bold text-ink">
  {t("All Properties", "כל הנכסים")}
</h2>
<span className="text-sm text-muted">
  {filtered.length} {t("results", "תוצאות")}
</span>
```

- [ ] **Step 6: Verify raw classes are gone**

Run: `grep -n "blue-\|slate-900" src/pages/Properties.jsx`
Expected: no matches.

Run: `grep -n "images.unsplash.com" src/pages/Properties.jsx`
Expected: no matches (confirms the hero background photo was removed).

- [ ] **Step 7: Build check**

Run: `npm run build`
Expected: exit code 0.

- [ ] **Step 8: Manual visual check**

Start the dev server, open the Properties page:
- Hero should show a solid blue-to-navy gradient with no background photo.
- The three filters should visually read as one rounded pill-shaped bar instead of three separate boxes, and must still filter the grid correctly when changed (city/listing type/property type).
- Reload the page and confirm you briefly see pulsing gray skeleton cards before the real listing grid appears (data loads from `localStorage` almost instantly, so this may be very brief — throttling the network tab is not needed since this is synchronous local data, but the skeleton branch can be confirmed by temporarily inspecting React DevTools state or by reading the code path).
- Confirm the live stats (Listings/For Sale/For Rent/Exclusive counts) still show correct numbers.

- [ ] **Step 9: Commit**

```bash
git add src/pages/Properties.jsx
git commit -m "Redesign Properties hero (remove stock photo, unify filter bar) and add grid loading skeleton"
```

---

### Task 7: Apply tokens to PropertyCard.jsx

**Files:**
- Modify: `src/components/PropertyCard.jsx`

**Interfaces:**
- Consumes: `ink`, `primary-700`, `shadow-card-hover` tokens from Task 1; unchanged `Card`/`Badge` from Task 2.
- Produces: no prop change — `PropertyCard({ property })` unchanged.

- [ ] **Step 1: Confirm current state**

Run: `grep -n "blue-\|slate-900\|shadow-xl" src/components/PropertyCard.jsx`
Expected: matches for `hover:shadow-xl`, `text-slate-900` (title), `text-blue-700` (price).

- [ ] **Step 2: Update the card hover shadow**

Replace:
```
<Card className="group h-full overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
```
with:
```
<Card className="group h-full overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-card-hover">
```

- [ ] **Step 3: Update the title color (keep font-bold)**

Replace:
```
<h3 className="mb-2 line-clamp-1 text-lg font-bold text-slate-900">
```
with:
```
<h3 className="mb-2 line-clamp-1 text-lg font-bold text-ink">
```

- [ ] **Step 4: Update the price color (keep font-extrabold)**

Replace:
```
<p className="mb-4 text-xl font-extrabold text-blue-700">
```
with:
```
<p className="mb-4 text-xl font-extrabold text-primary-700">
```

- [ ] **Step 5: Update the meta line (city/type) to use the muted token**

Replace:
```
<div className="mb-1 flex items-center gap-1 text-xs text-slate-500">
```
with:
```
<div className="mb-1 flex items-center gap-1 text-xs text-muted">
```

- [ ] **Step 6: Verify raw classes are gone**

Run: `grep -n "blue-\|slate-900\|shadow-xl" src/components/PropertyCard.jsx`
Expected: no matches.

- [ ] **Step 7: Build check**

Run: `npm run build`
Expected: exit code 0.

- [ ] **Step 8: Manual visual check**

On the Properties page, hover a listing card: it should lift slightly with a softer, more diffused shadow than before (the `card-hover` token vs. the old flat `shadow-xl`). Title weight and price weight/size must look unchanged from before this task.

- [ ] **Step 9: Commit**

```bash
git add src/components/PropertyCard.jsx
git commit -m "Apply design tokens to PropertyCard"
```

---

### Task 8: Apply tokens to PropertyDetail.jsx and add loading skeleton

**Files:**
- Modify: `src/pages/PropertyDetail.jsx`

**Interfaces:**
- Consumes: `Skeleton` from Task 3; `ink`, `primary`, `primary-700`, `muted`, `surface-alt` tokens from Task 1.
- Produces: no prop change — same route/query param handling (`?id=`).

- [ ] **Step 1: Confirm current state**

Run: `grep -n "blue-\|slate-900" src/pages/PropertyDetail.jsx`
Expected: matches for the gallery thumbnail active border (`border-blue-600`), the "Description" heading (`text-slate-900`), the "Property not found" heading (`text-slate-900`), the summary card `<h1>` (`text-slate-900`), the price (`text-blue-700`), and the facts-grid icon color (`text-blue-600`).

- [ ] **Step 2: Add the Skeleton import**

At the top of the file, add:
```js
import { Skeleton } from "@/components/ui/skeleton";
```

- [ ] **Step 3: Replace the loading state**

Replace:
```jsx
if (loading) {
  return (
    <div className="mx-auto max-w-7xl px-4 py-20 text-center text-slate-500">
      {t("Loading...", "טוען...")}
    </div>
  );
}
```
with:
```jsx
if (loading) {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <Skeleton className="mb-4 h-9 w-40" />
      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Skeleton className="h-[420px] w-full" />
          <div className="mt-8 space-y-3">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
            <Skeleton className="h-4 w-2/3" />
          </div>
        </div>
        <div className="lg:col-span-1">
          <Skeleton className="h-96 w-full" />
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 4: Update the "Property not found" heading**

Replace:
```
<h1 className="text-2xl font-bold text-slate-900">
  {t("Property not found", "הנכס לא נמצא")}
</h1>
```
with:
```
<h1 className="text-2xl font-bold text-ink">
  {t("Property not found", "הנכס לא נמצא")}
</h1>
```

- [ ] **Step 5: Update the gallery thumbnail active border**

Replace:
```
className={`h-20 w-28 overflow-hidden rounded-lg border-2 ${
  i === activeImage ? "border-blue-600" : "border-transparent"
}`}
```
with:
```
className={`h-20 w-28 overflow-hidden rounded-lg border-2 ${
  i === activeImage ? "border-primary" : "border-transparent"
}`}
```

- [ ] **Step 6: Update the "Description" heading**

Replace:
```
<h2 className="mb-3 text-xl font-bold text-slate-900">
  {t("Description", "תיאור")}
</h2>
```
with:
```
<h2 className="mb-3 text-xl font-bold text-ink">
  {t("Description", "תיאור")}
</h2>
```

- [ ] **Step 7: Update the summary card title (keep font-extrabold)**

Replace:
```
<h1 className="text-2xl font-extrabold text-slate-900">{title}</h1>
```
with:
```
<h1 className="text-2xl font-extrabold text-ink">{title}</h1>
```

- [ ] **Step 8: Update the summary card price (keep font-extrabold)**

Replace:
```
<p className="mt-4 text-3xl font-extrabold text-blue-700">
```
with:
```
<p className="mt-4 text-3xl font-extrabold text-primary-700">
```

- [ ] **Step 9: Update the address line to use the muted token**

Replace:
```
<p className="mt-1 flex items-center gap-1.5 text-sm text-slate-500">
```
with:
```
<p className="mt-1 flex items-center gap-1.5 text-sm text-muted">
```

- [ ] **Step 10: Update the facts-grid tile background to use the surface-alt token**

Replace:
```
<div key={i} className="rounded-xl bg-slate-50 p-3 text-center">
```
with:
```
<div key={i} className="rounded-xl bg-surface-alt p-3 text-center">
```

- [ ] **Step 11: Update the facts-grid icon color**

Replace:
```
<f.icon className="mx-auto mb-1 h-5 w-5 text-blue-600" />
```
with:
```
<f.icon className="mx-auto mb-1 h-5 w-5 text-primary" />
```

- [ ] **Step 12: Verify raw classes are gone**

Run: `grep -n "blue-\|slate-900" src/pages/PropertyDetail.jsx`
Expected: no matches.

- [ ] **Step 13: Build check**

Run: `npm run build`
Expected: exit code 0.

- [ ] **Step 14: Manual visual check**

Open a property detail page (click any listing from the Properties grid):
- Gallery thumbnail selection border should still highlight in blue when clicked.
- Title and price in the summary card should look visually identical in weight/size to before this task (only the exact hex may shift very slightly since `primary-700` is used instead of Tailwind's stock `blue-700` — both resolve to the same `#1d4ed8` value, so there should be no visible difference).
- Reload with a slow-motion check (React DevTools) or trust the code path to confirm the skeleton renders during the loading state.
- Confirm "Email Agent" / phone buttons still work (`mailto:` / `tel:` links unaffected).

- [ ] **Step 15: Commit**

```bash
git add src/pages/PropertyDetail.jsx
git commit -m "Apply design tokens to PropertyDetail and add loading skeleton"
```

---

## Final verification (after all tasks)

- [ ] Run `grep -rn "blue-[0-9]\|slate-900" src` from the repo root — expected: no matches anywhere in `src/` (the `ink`/`primary` token *definitions* live only in `tailwind.config.js`, which this grep doesn't scan).
- [ ] Run `npm run build` — expected: exit code 0.
- [ ] Start the dev server and click through: Properties (EN and HE/RTL toggle), a property detail page, Admin login, Admin create/edit/delete a listing. Everything should function exactly as before, with the visual refinements from this plan applied throughout.
