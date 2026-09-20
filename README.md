# AudioCenter — Bilingual Professional Audio Showcase Site

A bilingual (English / 中文) showcase website with a visual admin CMS, inspired by audiocenter.com. Built for a professional audio brand: line arrays, subwoofers, amplifiers, mixers, processors, wireless systems.

- **Public site** (single `/` route, SPA): Home, About, Products (3-level category tree), Product detail (multi-image carousel), Solutions, News, Contact (inquiry form).
- **Admin CMS** (cookie-auth, same `/` route, toggle via the shield button): visual editing for page banners/titles/content blocks, 3-level product categories, products with multi-image + specs, and visitor inquiry inbox.
- **Stack**: Next.js 16 (App Router) · TypeScript · Tailwind CSS 4 · shadcn/ui · Prisma + SQLite · TanStack Query · Zustand · Framer Motion.

---

## Quick start (3 commands)

```bash
bun install      # installs deps + auto-generates the Prisma client (postinstall)
bun run dev      # starts Next.js on http://localhost:3000
```

The repo ships with a **pre-seeded SQLite database** (`db/custom.db`) containing sample pages, categories, products and the admin user — so after `bun install` + `bun run dev` the site and admin work immediately.

> Using `npm` or `yarn`? Replace `bun` with `npm run` / `yarn`. The `postinstall` hook runs `prisma generate` for you.

Open the site → click the **shield button** (bottom-right) or the **后台 / Admin** button (header) → log in with:

```
username: admin
password: admin123
```

## First-time setup / reset to a clean database

If you want a fresh database (or the included `db/custom.db` is missing/corrupt):

```bash
bun run setup
```

This runs `prisma generate` → `prisma db push` (creates the schema) → `prisma/seed.ts` (loads sample content + the admin user). Individual commands are also available:

| Command | What it does |
|---|---|
| `bun run seed` | Wipe + reload sample data (pages, categories, products, settings, `admin/admin123`). |
| `bun run db:push` | Apply the Prisma schema to the SQLite file (keeps existing data where possible). |
| `bun run db:generate` | Regenerate the Prisma Client (after editing `prisma/schema.prisma`). |
| `bun run db:reset` | Drop + recreate + migrate the database. |

## Database

- SQLite file at `db/custom.db`, configured via `DATABASE_URL` in `.env` as a **relative** path (`file:./db/custom.db`) so it works on any machine.
- The starter `db/custom.db` is committed so a fresh clone runs out of the box. SQLite journal/WAL files (`*.db-journal`, `*.db-wal`, `*.db-shm`) are git-ignored.
- Schema lives in `prisma/schema.prisma`. After changing it: `bun run db:generate && bun run db:push` (and `bun run seed` if you wiped data).

## How to customize content

Everything below is editable from the **admin CMS** (no code changes):

| What | Where in admin |
|---|---|
| **Site name + logo + browser tab title + favicon** | Settings → 品牌信息 / Brand |
| **Page banner image / title / content blocks** | Pages → pick a page |
| **Product categories (3 levels: L1 › L2 › L3)** | Categories |
| **Products: list/unlist, descriptions, multi-image carousel, specs** | Products |
| **Contact info, social links, copyright** | Settings |
| **Visitor inquiries** | Inquiries |

Language toggle (EN / 中文) in the top bar — applies to the public site and the admin. The choice is persisted in `localStorage`.

## Project layout

```
prisma/
  schema.prisma          # data model (AdminUser, SitePage, ContentBlock, Category, Product, ProductImage, FormSubmission, SiteSetting)
  seed.ts                # sample content + admin user
src/
  app/
    page.tsx             # single SPA route (dynamically imports PublicSite / AdminApp)
    layout.tsx           # root layout + dark theme
    api/                 # REST routes (auth, pages, categories, products, submissions, settings, upload)
  components/
    brand.tsx            # shared logo + site-name mark (reads settings)
    public/              # Header, Footer, Home/About/Products/ProductDetail/Solutions/News/Contact, ContentBlock, ContactForm, hooks
    admin/               # AdminApp, AdminLogin, AdminLayout, Dashboard, PageManager, CategoryManager, ProductManager, SubmissionViewer, SettingsEditor, ImageUploader, hooks
    ui/                  # shadcn/ui primitives
  store/
    i18n.ts              # language store + static UI strings
    nav.ts               # SPA route store
  lib/
    db.ts                # Prisma client singleton
    auth.ts              # cookie session (hashed token, validated server-side)
    types.ts             # shared TS interfaces
```

## Notes

- Single user-visible route (`/`). All "pages" are client-side views; the admin is toggled in-place.
- Admin auth uses an httpOnly cookie with a server-side-validated session token. `bun run setup` recreates the `admin / admin123` user.
- Image uploads go to `public/uploads/` (admin-only endpoint, strict image MIME whitelist).
- The Prisma Client is regenerated automatically on `bun install` via the `postinstall` hook; run `bun run db:generate` manually if you edit the schema.
