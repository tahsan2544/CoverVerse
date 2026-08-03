# CoverCraft production polish — phased plan

This request covers 14 sections; realistically it is several build passes. Below is the
order I'll work in, grouped into phases. Each phase ends with a build + preview check
against the Definition of Done items it touches. I'll ship phases sequentially and report
after each, so you can redirect at any point.

## Phase 1 — QA audit + app shell navigation (Sections 1, 2)

- Audit every route (`/`, `/auth`, `/create`, `/dashboard`, `/admin`) in a headless browser
  in both themes at 320 / 375 / 768 / 1024 / 1440 px; fix console errors, dead links, and
  layout breaks I find.
- Fix the duplicate/identical template thumbnails in the gallery: each of the 500 template
  cards must render its own layout+palette combination, with lazy-loaded previews.
- Add skeleton loading states (gallery, dashboard, admin) and a reusable error boundary
  with a friendly retry state, wired into route `errorComponent`s.
- Editor state pass: verify autosave, photo/logo persistence after refresh, and preview
  desync; fix inline validation messages so no input fails silently.
- Export pass: check PDF/PNG on several templates for clipped text, blurry output, wrong
  margins, and font mismatch between preview and export.
- New app shell: collapsible left sidebar (Dashboard, Create, Templates, divider,
  Profile, Settings, Help), logo pinned top, icon-only mode with tooltips, clear active
  state, collapse state persisted. Mobile becomes a bottom tab bar (Dashboard / Create /
  Templates / Profile + More) since the app is used mid-task. Breadcrumbs on inner pages.

## Phase 2 — Theme system + Settings + Profile + Dashboard (Sections 3, 4, 5, 6)

- Rebuild `src/styles.css` tokens as an intentional two-theme system (background layers,
  surface, border, text primary/secondary/muted, accent, success/warning/error) keeping
  deep violet #4c1d95 as the anchor; brightened accent in dark, off-white surfaces in
  light, no pure black/white. 200–300ms color transition. Light/Dark/System.
- Audit every shadcn component in both themes for WCAG AA contrast.
- Theme control lives in the sidebar near Settings, plus a quick toggle in the top bar.
  Theme (and other prefs) persist to the user's account when signed in, falling back to
  localStorage for guests — needs a `user_preferences` table.
- Settings page: Account, Appearance (theme, accent, font size, grid density), Export
  defaults, Notifications, Language, Privacy & Data, Keyboard shortcuts reference.
- Profile page: avatar upload, display name, institution, bio, usage stats, recent
  activity with reopen links, plan badge, quick links.
- Dashboard: quick actions row, recently used templates, favourites, recent covers with
  edit/duplicate/export/delete, usage stats card, friendly empty states. Requires saved
  covers to move from localStorage-only into the database (migrated, not dropped).

## Phase 3 — Template library expansion + browsing (Section 7)

- 9 new categories (research paper, internship report, project proposal, seminar paper,
  group project, portfolio-style, corporate report, dissertation, workbook) and new visual
  styles implemented as real layout renderers: typographic-only, hand-drawn/sketch,
  watercolor, geometric/Bauhaus, vintage academic, botanical, neon/tech, texture/paper-grain,
  bold color-block — each across palettes with two font pairings, portrait + landscape
  variants where sensible.
- Tag system (multi-category), search, filters (category, style, colour, newest, popular,
  recently used), favourites, preview modal with zoom.
- Template components made direction-agnostic (logical CSS properties) so RTL works later.

## Phase 4 — Editor, AI artwork, export (Sections 8, 9, 10)

- Editor: undo/redo, autosave with "Saved" indicator, custom fields (Supervisor, Group
  Members, Department), per-field font size/colour/alignment, preview zoom controls,
  mobile Edit/Preview tabbed layout.
- AI artwork: style presets, quick-start prompt suggestions, Regenerate/variations, and a
  saved personal artwork gallery (needs a storage bucket + table).
- Export: A4/Letter/Legal, higher-DPI options, export history with re-download, ZIP for
  batch.

## Phase 5 — Responsiveness, a11y, admin, polish (Sections 11, 12, 13, 14)

- Dedicated mobile layouts for editor, browser, dashboard, profile, settings; ~44px tap
  targets; per-breakpoint verification.
- Keyboard nav + visible focus, ARIA labels on icon buttons, alt text, screen-reader form
  labels, contrast re-verification.
- Admin: template management panel (add/edit/unpublish/delete, tag by category/style),
  usage analytics (most-used templates, covers, exports, active users), announcement tool
  (the banner already exists — extend it).
- Polish: onboarding tour refresh, What's New page, in-app feedback form, per-page SEO
  meta + sitemap, duplicate-a-cover.

## Technical notes

- Backend work needed (each as its own reviewed migration): `user_preferences`,
  `covers` (saved drafts/covers + duplicate), `exports` (history), `ai_artwork` gallery,
  `templates` overrides for admin-managed templates, `feedback`, plus a storage bucket for
  avatars/artwork. Existing tables (`profiles`, `user_roles`, `site_settings`,
  `ai_generations`) are left intact.
- Existing localStorage data (form autosave, favourites, recent templates, analytics) is
  read on first signed-in load and migrated into the database, never cleared blindly.
- Routes stay where they are; new pages are added (`/templates`, `/settings`, `/profile`,
  `/help`, `/changelog`) rather than renaming existing ones, so no links break.
- PWA/offline was deliberately removed earlier. Section 11 mentions "basic PWA support";
  I've left it out of the phases above to avoid re-adding what you asked to remove — say
  the word and I'll add installability back without the offline caching.

## Assumptions

- No paid tier exists yet, so the watermark toggle and Free/Pro badge are built as
  structure with a neutral default rather than gated features, and no pricing copy.
- Notification toggles store the preference now; actual email sending is out of scope for
  this pass.
