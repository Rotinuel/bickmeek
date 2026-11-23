# BiceMeek Cleaning Services — website, booking system & admin

Production website for **BiceMeek Cleaning Services**, Mandela Road (after Tee Mama Junction), Minna, Niger State.

- Public site with service pages, daily/weekly/monthly cleaning plans, a separate ad-ready sales funnel, gallery, reviews and contact.
- Booking & quotation **request** system saved to MongoDB (staff confirm every booking — nothing is auto-confirmed).
- WhatsApp click-to-chat everywhere, with prefilled messages and a choice of business lines.
- Secure admin dashboard at `/admin` for bookings, services, plans, gallery, testimonials, business settings and SEO.
- Local SEO: server-rendered pages, per-page metadata, Open Graph/Twitter cards, JSON-LD, `sitemap.xml`, `robots.txt`.

## Technologies

| Area | Choice |
| --- | --- |
| Framework | SvelteKit 2 + Svelte 5 (runes), **JavaScript only** |
| Styling | Tailwind CSS v4 (`@tailwindcss/vite`), Archivo Variable font (self-hosted via Fontsource) |
| Icons | `@lucide/svelte` |
| Database | MongoDB with Mongoose (MongoDB Atlas recommended) |
| Media storage | MongoDB GridFS by default; Vercel Blob or local disk optional |
| Package manager | Bun |
| Hosting | Vercel (`@sveltejs/adapter-vercel`) |

No TypeScript, Zod, Zustand, Drizzle or Prisma. Password hashing (scrypt), sessions, validation and rate limiting use Node’s built-in `crypto` and MongoDB — no extra auth libraries.

## Project structure

There is no `src` folder; `svelte.config.js` points SvelteKit at the root-level folders.

```
app.html, error.html          HTML shells
hooks.server.js               DB connection, admin session guard, security headers
lib/
  constants.js                shared lists (statuses, frequencies, categories…)
  content.js                  FAQs, values, process steps
  seo.js                      JSON-LD builders
  whatsapp.js, format.js      link/format helpers
  styles/app.css              Tailwind theme + component classes
  components/                 Navbar, Footer, BookingForm, PlanCompare, GalleryGrid, BeforeAfter, Seo…
  components/admin/           admin UI pieces
  server/
    db.js, database.js        Mongoose connection (+ first-run bootstrap)
    models.js                 all Mongoose schemas
    auth.js, password.js      sessions + scrypt password hashing
    bookings.js               shared booking/quote form action
    storage.js                pluggable media storage + streaming with range support
    rate-limit.js             MongoDB-backed rate limiter
    validate.js               sanitising/validation helpers
    seed-data.js, bootstrap.js default content
routes/
  (site)/…                    public pages with main navigation
  (landing)/cleaning-subscription   distraction-free sales funnel
  admin/login, admin/logout
  admin/(panel)/…             dashboard pages
  admin/api/blob-upload       direct video uploads (Vercel Blob only)
  media/[driver]/[key]        serves uploaded files
  sitemap.xml, robots.txt
scripts/seed.js, scripts/create-admin.js
static/                       favicon, logo, default social image
```

## Installation & local development

```bash
bun install
cp .env.example .env        # then fill in the values
bun run seed                # optional: the app also seeds itself on first start
bun run dev                 # http://localhost:5173
```

Bun commands:

| Command | What it does |
| --- | --- |
| `bun run dev` | Development server |
| `bun run build` | Production build |
| `bun run preview` | Preview the production build |
| `bun run check` | Svelte diagnostics |
| `bun run seed` | Insert default content and the first admin (never overwrites edits) |
| `bun run create-admin -- email "password" "Name"` | Create an admin or reset their password |

## Environment variables

| Variable | Required | Purpose |
| --- | --- | --- |
| `MONGODB_URI` | yes | MongoDB connection string |
| `PUBLIC_SITE_URL` | yes in production | Canonical site address, e.g. `https://www.bicemeek.com` |
| `ADMIN_EMAIL`, `ADMIN_PASSWORD`, `ADMIN_NAME` | first run | Creates the first admin if none exists (password 12+ chars) |
| `STORAGE_DRIVER` | no | `gridfs` (default), `blob` or `local` |
| `BLOB_READ_WRITE_TOKEN` | with `blob` | Vercel Blob token |
| `UPLOAD_DIR` | with `local` | Folder for uploads, default `./uploads` |
| `PUBLIC_GA_MEASUREMENT_ID` | no | GA4 ID; analytics is off when empty |
| `PUBLIC_GOOGLE_SITE_VERIFICATION` | no | Search Console HTML-tag code |

Secrets are only read on the server (`$env/dynamic/private`); nothing private is sent to the browser.

## Database setup

1. Create a free cluster on MongoDB Atlas.
2. Add a database user and allow network access from anywhere (`0.0.0.0/0`) — Vercel uses changing IPs.
3. Copy the connection string into `MONGODB_URI`, with a database name such as `/bicemeek`.

Collections are created automatically. On the first request the app inserts default services, plans, settings and SEO text, plus two **unpublished, clearly marked demo** testimonials. Indexes (including TTL indexes that expire sessions and rate-limit entries) are built by Mongoose.

## Admin account

Set `ADMIN_EMAIL` and `ADMIN_PASSWORD` before the first start, or run `bun run create-admin`. Then:

1. Sign in at `/admin/login`.
2. Go to **Business settings → Your account** and set a new password.
3. Remove `ADMIN_PASSWORD` from your environment.

Security: scrypt-hashed passwords, random 256-bit session tokens stored only as SHA-256 hashes, httpOnly/secure/SameSite cookies, 7-day sessions, sign-in rate limits (5 per account per 15 min, 20 per IP), every `/admin` page, action and API checked on the server, `noindex` + `no-store` on admin responses, SvelteKit’s built-in cross-site form protection.

## Storage configuration

| Driver | Best for | Notes |
| --- | --- | --- |
| `gridfs` | Default. No extra service. | Files are stored in MongoDB and served from `/media/g/<id>` with caching and video seeking. On Vercel each upload must be under ~4.5 MB (platform request limit). |
| `blob` | Large videos on Vercel | Create a Blob store in Vercel → Storage; set `BLOB_READ_WRITE_TOKEN`. Videos upload straight from the browser, bypassing the 4.5 MB limit. |
| `local` | Local development only | Saves to `UPLOAD_DIR`. Not suitable for Vercel (its disk is temporary). |

Uploads are validated by their real file signature (not just the extension): JPG, PNG, WebP, AVIF images up to 4 MB; MP4/WebM videos up to 50 MB. Admins can also paste a YouTube/Vimeo link for videos. Switching drivers later does not break existing items — each stores its own URL.

## Deployment to Vercel

1. Push the project to GitHub and import it in Vercel. Framework preset: **SvelteKit**. Install command: `bun install`. Build command: `bun run build`.
2. Add the environment variables above in **Project → Settings → Environment Variables**.
3. Deploy, then visit `/admin/login`.
4. Add your domain in **Project → Domains** and update `PUBLIC_SITE_URL` to match.

## SEO configuration

- **Admin → SEO** controls the title, description, keywords and sharing image for each main page. Service pages are edited under **Admin → Services** (each has its own SEO fields).
- Structured data: `LocalBusiness`/`HomeAndConstructionBusiness` (schema.org has no `CleaningService` type, so this is the valid equivalent), `WebSite`, `Service`, `BreadcrumbList` and `FAQPage`. Values come from your settings, so keep the address and phone numbers accurate. Google currently limits FAQ rich results to a small set of sites; the markup is still valid.
- `sitemap.xml` lists all public pages and every visible service; `robots.txt` blocks `/admin` and points to the sitemap.
- Local keywords (Minna, Niger State) are written into headings and copy naturally. Add real photos with descriptive alt text — they help both customers and rankings.
- **Google Business Profile:** create or claim the profile, then paste its link in **Business settings** so it’s added to your structured data.

## Google Search Console

1. In Search Console, add a **URL-prefix** property for your domain and choose the **HTML tag** method.
2. Copy only the `content="…"` value into `PUBLIC_GOOGLE_SITE_VERIFICATION` (or **Business settings → Google tools**) and redeploy/save.
3. Click **Verify**, then submit `https://your-domain/sitemap.xml` under **Sitemaps**.

## Google Analytics 4

Create a GA4 web stream and copy its `G-XXXXXXXXXX` ID into `PUBLIC_GA_MEASUREMENT_ID` (or the admin field). Leave it empty to keep analytics off. Keep GA4’s *enhanced measurement → page changes based on browser history events* switched on so in-site navigation is counted. If you enable analytics, tell visitors in your privacy policy (the provided policy already mentions it).

## Managing the business

**Bookings** — Every form on the site creates a request with a reference such as `BM-7K2QX9`. Filter by status, frequency, service or type, search by name/phone/reference/area, and open a booking to update its status (New → Contacted → Quotation sent → Confirmed → In progress → Completed / Cancelled), set the scheduled date and time, add internal notes, or message the customer on WhatsApp with one tap. Every status change is logged.

**Gallery** — Add a photo, a video (upload or YouTube link) or a before-and-after pair. Assign a category, write a caption and alt text, publish or hide, and tick *Feature on homepage* to show it on the homepage first. Before-and-after pairs appear as drag sliders on the homepage and landing page.

**Cleaning plans** — Edit the daily, weekly and monthly plans: name, tagline, description, inclusions (one per line), “best for”, price and unit, visibility and which plan is highlighted. Leave the price empty to show “Custom quote” — no prices are invented.

**Services** — Add, edit, hide, reorder or delete services; each gets its own page at `/services/<slug>`.

**Testimonials** — Add genuine customer reviews (with permission) and publish them. Demo entries can’t be published until replaced.

**Business settings** — Phone numbers, WhatsApp lines and labels, email, address, map link, opening hours, social links, homepage hero photo, About photo and Google tool IDs.

## Before launch

- Upload real photos (hero, services, gallery) — the site uses designed illustrations until you do.
- Replace the demo testimonials with real ones, or leave them unpublished.
- Add an email address and opening hours if you have them.
- Replace `static/logo.svg` and `static/favicon.svg` with your official logo files if you prefer the original artwork.
- Have the privacy policy and terms reviewed for your business.
"# bickmeek" 
