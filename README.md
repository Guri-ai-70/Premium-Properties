# Premium Properties

A bilingual (English / Hebrew, with RTL) real-estate website built with **React + Vite + Tailwind CSS**, styled in a clean Base44-inspired look. It continues the original Base44-style `Layout` component (same entity API, `createPageUrl` routing, shadcn-style UI), but runs entirely in the browser with **no backend** — listings are stored in `localStorage` and seeded on first load.

## Quick start

```bash
npm install
npm run dev
```

Open the URL Vite prints (default http://localhost:5173). To stop the server press **Ctrl + C**.

```bash
npm run build     # production build into dist/
npm run preview   # preview the production build locally
```

## Features

- **Properties** page — hero with live stats, search + listing/type filters, a Featured section, and a responsive listing grid.
- **Property detail** — image gallery, full specs, contact actions.
- **Admin** — username/password login, then full create / edit / delete of listings.
  - **Delete** opens a confirmation dialog ("Are you sure you want to delete?").
  - **Edit** lets you add photos by **uploading from your computer** or **pasting an image URL**, each removable; the first photo is the cover.
  - **Exclusive (בבלעדיות)** toggle marks a listing with a gold badge across the site.
- **Bilingual EN/HE** — the header toggle flips all copy and switches the layout to RTL.

## Admin login

Open **Login** in the header (or go to the Admin page). Default credentials:

- **Username:** `admin`
- **Password:** `premium2026`

Change them in **`src/config.js`**. Note: because this is a static, frontend-only site, this login only *hides* the admin panel from casual visitors — it is not real security. Importantly, a visitor cannot change your published listings: their edits only affect their own browser. Real, shared, server-saved admin would require a backend.

## Resetting demo data

Seed data is written only when storage is empty, so if you opened the site before, you may not see the newest demo listings/flags. To reload fresh demo data, clear the site's data for `localhost` (DevTools → Application → Local Storage → clear keys prefixed `premium_properties::`) and reload. Listings you add yourself are unaffected.

## Deploying to GitHub Pages

This repo includes a workflow at `.github/workflows/deploy.yml` that **builds and publishes the site automatically**. You do **not** upload a hand-written `index.html` — GitHub builds the compiled site for you.

1. Create a GitHub repository and upload these project files (the whole folder, including `src/`, `package.json`, and `.github/`). Do **not** upload `node_modules` or `dist`.
2. In the repo: **Settings → Pages → Build and deployment → Source → “GitHub Actions.”**
3. Push/commit to the **main** branch (uploading via the web UI counts). The Action runs `npm install` + `npm run build` and deploys.
4. Your site appears at `https://<your-username>.github.io/<repo-name>/`.

The app uses **hash routing**, so deep links like `…/#/Properties` and page refreshes work correctly on GitHub Pages. `vite.config.js` sets `base: "./"` so assets load regardless of the repo name.

> Note on "do I upload index.html?": For a plain HTML site (like the World Cup 2026 project) — yes, you upload `index.html` and it runs as-is. For **this** React app — no; you upload the **source**, and GitHub Pages serves the **compiled** output. Uploading only this `index.html` would show a blank page.

## Project structure

```
.github/workflows/deploy.yml   auto-build & deploy to GitHub Pages
src/
  main.jsx              entry (seeds data, mounts HashRouter)
  App.jsx               routes, wrapped in Layout
  config.js             admin username/password
  index.css             Tailwind + RTL styles
  pages/
    Layout.jsx          header / nav / footer
    Properties.jsx      listing page with filters + stats
    PropertyDetail.jsx  single-listing page
    Admin.jsx           login gate + CRUD + delete modal + image manager
  components/
    PropertyCard.jsx
    LanguageContext.js
    ui/                 button, dropdown-menu, input, textarea, card, badge,
                        label, select, dialog
  entities/             localStorage-backed mock SDK + seed data
  lib/utils.js          cn() + price formatting
  utils/index.js        createPageUrl()
```

## Swapping in a real backend later

Every data call goes through the entity objects in `src/entities/`, so you can later replace their internals with real API/SDK calls (the Base44 SDK or your own REST endpoints) without touching the pages or components — and that would also give you true, secure, shared admin.
