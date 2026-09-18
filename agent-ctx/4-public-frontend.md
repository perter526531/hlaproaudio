# Task 4 — Public Frontend (work record)

**Agent:** full-stack-developer (public frontend)
**Task ID:** 4
**Date:** 2026-09-18

## Scope
Build the entire public-facing bilingual (EN/CN) showcase frontend for the AudioCenter brand site, as a client-only SPA rendered inside the single `/` route. The SPA shell lives in `src/components/public/PublicSite.tsx` and is dynamically imported by `src/app/page.tsx` with `ssr:false`.

## Files created (16 total)

### Shared
- `src/lib/types.ts` — TS interfaces for SitePage, ContentBlock, Category, Product, ProductImage, ProductSpec, FormSubmission, SiteSetting + `pick(En, Cn, lang)` and `parseSpecs()` helpers.
- `src/components/public/hooks.ts` — TanStack Query hooks sharing one cache:
  - `usePages()` (key `["pages"]`)
  - `usePage(slug)` — derived from usePages, no extra fetch
  - `useCategories()` (key `["categories"]`)
  - `useProducts(filters)` (key `["products", filters]`)
  - `useProduct(id)` (key `["product", id]`, enabled when id truthy)
  - `useSettings()` (key `["settings"]`)

### SPA shell + chrome
- `src/components/public/PublicSite.tsx` — `min-h-screen flex flex-col`, Header + `<main className="flex-1">` switching view by `route.name` + sticky Footer (`mt-auto`), floating Shield button (bottom-right) → `setAdminMode(true)`. Scrolls to top on `navToken` change.
- `src/components/public/Header.tsx` — sticky top, backdrop blur, brand logo, desktop nav with brand underline, EN|中文 pill toggle, Admin button. Mobile Sheet drawer (hamburger).
- `src/components/public/Footer.tsx` — 4 columns (brand, Quick Links, Contact from settings, Follow Us socials from settings) + bottom copyright bar.

### Utility components
- `src/components/public/BannerSection.tsx` — full-width hero with banner image + `.hero-overlay-r` gradient + title/subtitle, Framer Motion fade-in-up.
- `src/components/public/ContentBlock.tsx` — switch on `block.type`: hero / text (2-col with image OR centered prose) / image (figure) / features (3-card grid) / stats (4-tile band on brand gradient) / quote.

### Reusable components
- `src/components/public/ProductCard.tsx` — aspect-4/3 hover-zoom image, featured badge, Framer Motion lift, click → `go({name:"product", id})`. Keyboard accessible.
- `src/components/public/ContactForm.tsx` — company / contact / phone / email(optional) / requirements fields, client-side validation, sonner toasts, posts JSON to `/api/submissions`.

### Pages
- `src/components/public/HomePage.tsx` — 60vh hero with CTA buttons, content blocks, Featured Products strip (4 cards), Solutions teaser strip (4 L1 category cards), CTA band.
- `src/components/public/AboutPage.tsx` — BannerSection + content blocks (text+image blocks alternate sides), bottom CTA.
- `src/components/public/ProductsPage.tsx` — BannerSection + Breadcrumb + LEFT recursive 3-level collapsible category tree (auto-expand, custom scrollbar) + RIGHT product grid (1/2/3 cols). Mobile sidebar collapses to a Sheet drawer.
- `src/components/public/ProductDetailPage.tsx` — Breadcrumb, LEFT Carousel image carousel with thumbnail strip + active-highlight, RIGHT name/shortDesc/specs table/CTA buttons. Below: description + Related Products (same category, excludes current).
- `src/components/public/SolutionsPage.tsx` — BannerSection + alternating image/text rows with numbered badges + Learn More CTAs. Bottom CTA.
- `src/components/public/NewsPage.tsx` — BannerSection + 3-card bilingual news grid (static demo content). Bottom contact button.
- `src/components/public/ContactPage.tsx` — BannerSection + 2-column: LEFT ContactForm card, RIGHT contact info card + styled "map" placeholder.

## Key decisions
- Bilingual content picked via `pick(En, Cn, lang)` on DB-backed fields; static UI labels via `tr(key, lang)` from `src/store/i18n.ts`. Default lang is CN (matches the `useI18n` store default).
- Single TanStack Query cache shared across all pages → no duplicate fetches.
- Sticky footer: `min-h-screen flex flex-col` root + `flex-1` main + `mt-auto` footer.
- Mobile-first: Sheet drawer for Header nav (right side) and Products sidebar (left side), all touch targets ≥ 44px (`h-11` / `min-h-11`), responsive 1/2/3 or 1/2/4 grids.
- Plain `<img>` for external OSS image URLs (no next/image domain config needed; eslint already disables `@next/next/no-img-element`).
- All fetches use relative paths (`/api/...`) — no ports / no localhost / no `XTransformPort`.
- Framer Motion: hero fade-in-up, card hover-lift, section reveal-on-scroll, stats/feature staggered entrance.

## Lint status
All `src/components/public/**` and `src/lib/types.ts` files are **lint-clean** (0 errors, 0 warnings). The remaining lint issues reported by `bun run lint` all live in `src/components/admin/**` files (admin agent's scope, Task ID 3).

## Smoke test
`curl http://localhost:3000/` → HTTP 200. Dev log shows successful 200s for `/api/pages`, `/api/categories`, `/api/products?featured=true&status=listed`, `/api/settings`.

## Known issues / notes
- The dev server log still shows a missing `@/components/admin/AdminApp` module — that belongs to the admin agent (Task ID 3). Once that file is created, the `/` route will fully render the public site (today it returns 200 already, since AdminApp is dynamically imported with `ssr:false`).
- The "map" on the contact page is a styled placeholder (decorative grid + MapPin + address overlay). Per the task spec.
- NewsPage uses static bilingual news entries (the news page only has a banner in the seed; no persisted news items). Per the task spec.
