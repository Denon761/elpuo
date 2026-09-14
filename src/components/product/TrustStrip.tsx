import { MIN_ORDER_QTY } from "@/lib/catalog";
import { FACTS } from "@/lib/site";

const ITEMS = [
  { k: `Min. ${MIN_ORDER_QTY} units`, v: "low minimum order" },
  { k: "Free", v: "digital proof before we print" },
  { k: `${FACTS.countriesShipped} countries`, v: "shipped worldwide" },
  { k: `${FACTS.productionDays} days`, v: "standard production" },
];

/** Compact trust/benefit strip shown beside the quote form — the reasons to
 *  commit, right where the customer is deciding whether to. */
export function TrustStrip() {
  return (
    <div className="mb-8 grid grid-cols-2 gap-2 sm:grid-cols-4">
      {ITEMS.map((item) => (
        <div
          key={item.v}
          className="rounded-md border border-line bg-ink-2 px-3 py-3 text-center"
        >
          <p className="font-display text-lg leading-tight text-volt">{item.k}</p>
          <p className="mt-0.5 text-[0.68rem] leading-tight text-paper/60">{item.v}</p>
        </div>
      ))}
    </div>
  );
}
