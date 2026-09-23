<div align="center">

# CoverVerse

> Create professional assignment cover pages in seconds.

[![Live app](https://img.shields.io/badge/live_app-coververse.lovable.app-2563eb)](https://coververse.lovable.app)
[![License: MIT](https://img.shields.io/badge/license-MIT-2e7d32.svg)](./LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React 19](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white)](https://react.dev)
[![Vite](https://img.shields.io/badge/Vite-8-646CFF?logo=vite&logoColor=white)](https://vite.dev)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com)

</div>

CoverVerse is a modern web app that helps students design beautiful, print-ready
assignment cover pages. Pick from 500+ templates, fill in your details, watch the
live preview update, and download a high-quality PDF or PNG.

**Live app:** https://coververse.lovable.app

## Contents

- [Features](#features)
- [Cover fields](#cover-fields)
- [How to use](#how-to-use)
- [Tech stack](#tech-stack)
- [Local setup](#local-setup)
- [Accounts & roles](#accounts--roles)
- [Deployment](#deployment)
- [Privacy](#privacy)
- [Roadmap](#roadmap)
- [Contributing](#contributing)
- [License](#license)

## Features

- 500+ template variations (10 layouts x 50 colour palettes)
- School, college & university friendly designs
- Search, filter, sort and favourite templates
- Live A4 preview that updates as you type
- Optional student photo and institution logo upload (max 10 MB each)
- AI cover artwork from your own prompt
- QR code overlay (link or assignment info) that can be hidden
- Full style control: colours, fonts, borders, backgrounds
- Dark & light mode (light is the default)
- High-quality PDF and PNG export, plus print support
- Autosave of your form data in the browser
- Multilingual UI: English, Bangla, Hindi, Arabic, Spanish, French
- Personal insights dashboard and an admin console for site owners
- Fully responsive, mobile-first design

## Cover fields

Student name, roll number, class, section, student ID, assignment title, subject,
teacher name, submission date, academic year, institution name, institution logo
(optional), student photo (optional).

## How to use

1. Open the app and click **Create cover**.
2. Choose a template in the gallery (use search, category filters or favourites).
3. Fill in the required details — the live preview appears immediately.
4. Adjust colours, fonts, QR code or AI artwork in the side tabs.
5. Click **Download PDF** or **Download PNG**, or print directly.

Your form data is saved automatically in this browser, so you can close the tab
and come back later. Sign in if you want your preferences to follow your account
across devices.

## Tech stack

- TanStack Start (React 19) + TanStack Router
- Vite 8
- Tailwind CSS v4 + shadcn/ui
- TanStack Query
- Lovable Cloud (Postgres, auth, storage, server functions)
- html2canvas-pro + jsPDF for exports

## Local setup

Requirements: [Bun](https://bun.sh) (or Node 20+) and a Lovable Cloud / Supabase
backend for auth and admin features.

```bash
git clone https://github.com/tahsan2544/CoverVerse.git
cd CoverVerse
bun install
bun run dev          # http://localhost:8080
```

Create a `.env` file with:

```bash
VITE_SUPABASE_URL=<your project url>
VITE_SUPABASE_PUBLISHABLE_KEY=<your publishable key>
VITE_SUPABASE_PROJECT_ID=<your project id>
```

Server-only secrets (never exposed to the browser) are read from the server
environment: `LOVABLE_API_KEY` for AI features, plus any provider keys you add.

Useful scripts:

```bash
bun run dev      # start the dev server
bun run build    # production build
bun run preview  # preview the production build
```

## Accounts & roles

- Anyone can create and download covers without an account.
- Signing in syncs preferences and profile details.
- Admins get an **Admin console** for site settings, AI limits and users. Roles
  live in a dedicated `user_roles` table and are checked server-side.

## Deployment

The app is deployed from Lovable. Frontend changes go live after publishing;
backend changes deploy immediately. A custom domain can be connected in project
settings once published.

## Privacy

Cover content, uploads and autosaved form data stay in your browser. Account data
is limited to your profile and preferences.

## Roadmap

- More templates and layout families
- Batch cover generation
- Community template sharing
- Optional cloud sync of saved covers

## Contributing

Issues, ideas and pull requests are welcome.

## License

MIT — see [LICENSE](./LICENSE) for details.

---

**CoverVerse** — *Create professional assignment covers in seconds.*
