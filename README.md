# Elpuo — Custom Sports Uniforms

A Next.js site for a custom teamwear studio. Ten sports, each with a product
gallery and a short **quote request form** — choose fabric and options, add sizes
and player names/numbers, upload the design you have in mind, and submit. There
is no cart and no checkout: the form emails the studio via nodemailer and the
customer gets a firm quote back.

## Stack

- **Next.js 15** (App Router) + **React 19** + **TypeScript**
- **Tailwind CSS v4** (config-less, tokens in `src/app/globals.css`)
- **next/font** — Anton (display) + Space Grotesk (UI)
- **nodemailer** for the quote and contact emails (SMTP), shared via
  `src/lib/mailer.ts`
- **Single light theme** — white ground, black headings, orange primary.
  CSS-variable palette in `src/app/globals.css`; `.on-paper` / `.on-dark` pin a
  fixed palette for sections that must stay light (editorial bands) or dark
  (product preview stages).
- Primary colour is **orange** (`--color-lime` / `--color-volt` in `globals.css`).
  Logo: `public/logo.png`.
- No database. Catalogue is typed data in `src/lib/catalog.ts`.

## Configure env — the editing place

There's a single `.env.local` (git-ignored, never committed — don't put real
values anywhere else). Fill in:

- SMTP: `SMTP_HOST/PORT/SECURE/USER/PASS`, `QUOTE_FROM_EMAIL`,
  `QUOTE_TO_EMAIL`, `NEXT_PUBLIC_CONTACT_EMAIL`
- Stripe (on-site checkout for orders under 30 units): `STRIPE_SECRET_KEY`,
  `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`, `STRIPE_WEBHOOK_SECRET`
- `NEXT_PUBLIC_SITE_URL`

Restart `npm run dev` after editing. Until SMTP/Stripe are set, the relevant
forms return a friendly "not configured yet" message instead of sending or
charging.

Both `src/app/api/quote/route.ts` and `src/app/api/contact/route.ts` (Node
runtime) share the transport in `src/lib/mailer.ts`. They mail a formatted
summary to `QUOTE_TO_EMAIL` with `replyTo` set to the sender, send a branded
auto-reply to the sender, and drop bot submissions via a honeypot + time-trap
+ per-IP rate limit. The quote route also attaches the uploaded reference file
(≤ 8 MB).

## Run

```bash
npm install
npm run dev      # http://localhost:3000
npm run build
npm start
```

If you switch between `next build` and `next dev`, delete `.next` first — mixing
the two leaves a stale cache that 500s.

## Project map

| Path | Purpose |
| --- | --- |
| `src/lib/catalog.ts` | The 10 sports (copy, SEO fields, FAQs) + the option groups shown in the form (`groupsFor`) |
| `src/lib/site.ts` | Canonical domain, brand identity, production facts (single source) |
| `src/lib/mailer.ts` | Shared SMTP transport + spam defence (honeypot / time-trap / rate limit) |
| `src/components/product/ProductGallery.tsx` | 3–4 product views. Uses `sport.images` if set, else renders jersey views |
| `src/components/product/QuoteForm.tsx` | The 3-section quote form (kit → reference upload → details) |
| `src/app/api/quote/route.ts` | Quote email (nodemailer) + customer confirmation |
| `src/app/api/contact/route.ts` | Contact form email + auto-reply |
| `src/components/jersey/JerseyPreview.tsx` | Pure-SVG jersey used as the gallery fallback |
| `src/app/sports/[sport]/` | Product page (statically generated per sport) |
| `src/app/policies/` | Artwork, sizing, shipping, returns, terms, privacy |

## Adding real product photos

Drop files in `public/products/` and list them per sport in `src/lib/catalog.ts`
via `pics(slug)` (or an explicit `{ src, label }[]`). The gallery switches from
rendered jerseys to your photos automatically. All 10 sports already have photos.

## Before launch

- Set the SMTP env vars in the production environment (Vercel → Settings → Env).
- Set `NEXT_PUBLIC_SITE_URL` to the permanent domain (drives canonicals,
  sitemap, robots, structured data).
- Add real social profile URLs to `ORG.sameAs` in `src/lib/site.ts` when they
  exist (empty by design until then).
- Verify the domain in Google Search Console + Bing Webmaster Tools and submit
  `…/sitemap.xml`.
- Have the policy pages reviewed by counsel — they are plain-language drafts.
