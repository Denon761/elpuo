import { DESIGN_METHOD, EXTRAS, FABRIC, KIT, TECHNIQUE } from "./catalog";
import type { Sport } from "./types";

/**
 * Live tiered pricing for small (buy-now) orders. Orders at or above
 * BULK_THRESHOLD skip payment entirely and go through the no-payment quote
 * request flow instead — see QuoteForm's `mode`.
 */
export const BULK_THRESHOLD = 30;

export interface QtyTier {
  min: number;
  max: number;
  label: string;
  /** Flat $ knocked off the unit price at this tier — cumulative down the
   *  list, not a percentage. */
  reduction: number;
}

export const QTY_TIERS: QtyTier[] = [
  { min: 1, max: 10, label: "1–10 units", reduction: 0 },
  { min: 11, max: 20, label: "11–20 units", reduction: 2 },
  { min: 21, max: BULK_THRESHOLD - 1, label: "21–29 units", reduction: 4 },
];

export function tierFor(qty: number): QtyTier {
  return (
    QTY_TIERS.find((t) => qty >= t.min && qty <= t.max) ??
    QTY_TIERS[QTY_TIERS.length - 1]
  );
}

/** The option selections that affect price — a subset of QuoteForm's state. */
export interface PriceSelections {
  fabric?: string;
  method?: string;
  kit?: string;
  technique?: string;
  extras?: string[];
}

/** Base unit price before quantity-tier discount: sport base + every
 *  selected option's delta. */
export function baseUnitPrice(sport: Sport, selections: PriceSelections): number {
  const fabricDelta = FABRIC.options.find((o) => o.id === selections.fabric)?.delta ?? 0;
  const methodDelta = DESIGN_METHOD.options.find((o) => o.id === selections.method)?.delta ?? 0;
  const kitDelta = KIT.options.find((o) => o.id === selections.kit)?.delta ?? 0;
  const techniqueDelta = TECHNIQUE.options.find((o) => o.id === selections.technique)?.delta ?? 0;
  const extrasDelta = (selections.extras ?? []).reduce(
    (sum, id) => sum + (EXTRAS.options.find((o) => o.id === id)?.delta ?? 0),
    0
  );
  return sport.unitBase + fabricDelta + methodDelta + kitDelta + techniqueDelta + extrasDelta;
}

export interface PriceQuote {
  tier: QtyTier;
  qty: number;
  /** Unit price before the tier discount. */
  unitPrice: number;
  /** Unit price after the tier discount — what's actually charged. */
  unitPriceDiscounted: number;
  total: number;
}

export function priceForQty(
  sport: Sport,
  selections: PriceSelections,
  qty: number
): PriceQuote {
  const tier = tierFor(qty);
  const unitPrice = baseUnitPrice(sport, selections);
  const unitPriceDiscounted = Math.max(0, Math.round((unitPrice - tier.reduction) * 100) / 100);
  return {
    tier,
    qty,
    unitPrice,
    unitPriceDiscounted,
    total: Math.round(unitPriceDiscounted * qty * 100) / 100,
  };
}
