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
- **nodemailer** for the quote email (SMTP)
- **Dark / light mode** — CSS-variable palette in `globals.css`, `data-theme` on
  `<html>`, toggled from the header (`ThemeToggle`), persisted to `localStorage`
  (`elpuo.theme`), defaults to system preference with a no-flash inline script in
  `layout.tsx`. `.on-paper` / `.on-dark` pin a fixed palette for sections that
  must stay light (editorial bands) or dark (product preview stages).
- Primary colour is **orange** (`--color-lime` / `--color-volt` in `globals.css`).
  Logo: `public/logo.png`.
- No database. Catalogue is typed data in `src/lib/catalog.ts`.

## Configure email — the editing place

1. Copy `.env.example` to `.env.local` (already git-ignored) — or edit the
   `.env.local` that's already there.
2. Fill in your SMTP details and the destination inbox:

   ```
   SMTP_HOST=smtp.yourprovider.com
   SMTP_PORT=587
   SMTP_SECURE=false          # true only for port 465
   SMTP_USER=...
   SMTP_PASS=...
   QUOTE_FROM_EMAIL="Elpuo Website <no-reply@yourdomain.com>"
   QUOTE_TO_EMAIL=sales@yourdomain.com
   NEXT_PUBLIC_CONTACT_EMAIL=sales@yourdomain.com
   ```

3. Restart `npm run dev`. Until this is set, the form returns a friendly
   "mailbox isn't configured yet" message instead of sending.

The send happens in `src/app/api/quote/route.ts` (Node runtime). It accepts
`multipart/form-data`, attaches the uploaded reference file (≤ 8 MB) and mails a
formatted summary to `QUOTE_TO_EMAIL` with `replyTo` set to the customer.

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
| `src/lib/catalog.ts` | The 10 sports + the option groups shown in the form (`groupsFor`) |
| `src/components/product/ProductGallery.tsx` | 3–4 product views. Uses `sport.images` if set, else renders jersey views |
| `src/components/product/QuoteForm.tsx` | The 3-section quote form (kit → reference upload → details) |
| `src/app/api/quote/route.ts` | nodemailer send |
| `src/components/jersey/JerseyPreview.tsx` | Pure-SVG jersey used as the gallery fallback |
| `src/app/sports/[sport]/` | Product page (statically generated per sport) |
| `src/app/policies/` | Artwork, sizing, shipping, returns, terms, privacy |

## Adding real product photos

Drop files in `public/products/` and list them per sport in `src/lib/catalog.ts`:

```ts
{ slug: "soccer", /* … */ images: ["/products/soccer-1.jpg", "/products/soccer-2.jpg"] }
```

The gallery switches from rendered jerseys to your photos automatically.

## Before launch

- Set the SMTP env vars (above).
- Wire the contact form (`src/app/contact/ContactForm.tsx`) — it's still a
  front-end demo.
- Replace placeholder contact details and the `metadataBase` URL in
  `src/app/layout.tsx`, `sitemap.ts`, `robots.ts`.
- Have the policy pages reviewed by counsel — they are plain-language drafts.
