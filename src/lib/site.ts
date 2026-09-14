/* ------------------------------------------------------------------ *
   Single source of truth for the site's domain, brand identity and the
   production facts that must read identically on every page (MOQ, proof
   time, lead time, sizes). Import these — never re-type the numbers.
 * ------------------------------------------------------------------ */

/**
 * Canonical origin, no trailing slash. Set NEXT_PUBLIC_SITE_URL to the
 * permanent domain in production so canonicals, sitemap, robots and
 * structured data never point at a temporary *.vercel.app URL.
 */
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL || "https://www.elpuo.com"
).replace(/\/$/, "");

/** Absolute URL for a site-relative path. */
export const abs = (path = "/") =>
  `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;

export const ORG = {
  /** Display / brand name — use everywhere in copy. */
  name: "Elpuo",
  /** Registered legal name — use in structured data only. */
  legalName: "Elpuo Teamwear",
  description:
    "Custom sublimated sports uniforms for clubs, schools and academies across ten sports, made on an in-house print floor.",
  logo: abs("/logo.png"),
  /** The single business inbox — quotes, artwork, club programmes, policy. */
  email: process.env.NEXT_PUBLIC_CONTACT_EMAIL || "info@elpuo.com",
  /**
   * Public profiles / external references — feeds schema `sameAs`. Empty
   * until real profiles exist; add the exact URLs here when they do.
   */
  sameAs: [] as string[],
} as const;

/**
 * Production facts. These strings/numbers are the ONLY place these claims
 * are authored; pages render them so shipping, sizing, sport pages and
 * FAQs can never drift apart.
 */
export const FACTS = {
  /** Minimum units per order, across all sizes. */
  moq: 3,
  /** Business days to issue a digital proof after a request. */
  proofDays: 2,
  /** Working days for standard production after artwork approval. */
  productionDays: 14,
  /** Business days for a specialist to reply with a firm quote. */
  quoteReplyDays: 1,
  /** Countries we've shipped finished kit to. */
  countriesShipped: 48,
  priceCurrency: "USD",
  sizeRange: "Youth YS–YL and adult XS–3XL",
} as const;

/**
 * Canonical explanation of the two-stage reply timeline. Several pages used
 * to hand-write "reply within one business day with a firm quote AND a
 * digital proof" — conflating quoteReplyDays and proofDays into one claim
 * that contradicted the (correct) standalone proofDays claims elsewhere.
 * Reuse this sentence instead of re-typing the numbers.
 */
export const REPLY_TIMELINE = `We reply within ${FACTS.quoteReplyDays} business day with pricing, and a full digital proof follows within ${FACTS.proofDays} business days.`;

/** Short trust-badge line shown under the "get a quote" CTA. */
export const QUOTE_TRUST_LINE = `No payment · No obligation · Reply within ${FACTS.quoteReplyDays} business day`;
