export type Silhouette = "tee" | "tank" | "polo" | "longsleeve";

export interface Option {
  id: string;
  label: string;
  /** Per-unit price delta added on top of the sport's base price — used for
   *  live pricing on small (buy-now) orders. See src/lib/pricing.ts. */
  delta: number;
  desc?: string;
  recommended?: boolean;
}

export interface OptionGroup {
  id: string;
  label: string;
  helper?: string;
  type: "single" | "multi";
  options: Option[];
  defaultValue: string | string[];
}

export interface PatternDef {
  id: string;
  label: string;
}

export interface ProductImage {
  /** Path under /public, e.g. "/products/soccer-men.jpg" */
  src: string;
  /** Short caption shown in the gallery, e.g. "Men's", "Women's", "Youth" */
  label: string;
}

export interface SportFaq {
  q: string;
  a: string;
}

export interface Sport {
  slug: string;
  name: string;
  discipline: string;
  tagline: string;
  blurb: string;
  /**
   * Alternative / regional names for the sport (e.g. "Soccer" ↔ "Football").
   * Used to target both terms in titles and metadata where it's genuine.
   */
  aka?: string[];
  /** Unique <title> for the sport page. Falls back to `Custom {name} Uniforms`. */
  seoTitle?: string;
  /** Unique meta description — no shared boilerplate across sports. */
  metaDescription: string;
  /** Two sport-specific spec blocks that answer buyer questions directly. */
  specifics: { h: string; p: string }[];
  /** Genuinely sport-specific FAQs (rules, fabric, fit, decoration). */
  faqs: SportFaq[];
  /** Indicative "from" price per unit, shown as guidance only. */
  unitBase: number;
  silhouette: Silhouette;
  /** [body, secondary, accent] — used by the fallback rendered gallery. */
  colorway: [string, string, string];
  patterns: PatternDef[];
  hue: string;
  featured?: boolean;
  /**
   * Real product photos for the gallery, served from /public.
   * Leave empty to fall back to the rendered jersey views.
   */
  images?: ProductImage[];
}

/** Shape of the payload the quote form sends to /api/quote. */
export interface QuoteFields {
  sport: string;
  fabric: string;
  method: string;
  kit: string;
  technique: string;
  extras: string[];
  sizes: Record<string, number>;
  totalQty: number;
  roster: string;
  designNotes: string;
  organization: string;
  contactName: string;
  email: string;
  phone: string;
  country: string;
  city: string;
}
