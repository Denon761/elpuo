import type { Metadata } from "next";
import { PolicyArticle } from "@/components/site/PolicyArticle";

export const metadata: Metadata = {
  title: "Sizing Guide",
  description:
    "Elpuo custom uniform sizing — youth and adult ranges, fit blocks, sizing kits and how to measure.",
};

export default function Page() {
  return (
    <PolicyArticle
      title="Sizing guide"
      updated="30 August 2026"
      intro="Elpuo kit is cut from sport-specific blocks in youth and adult ranges. Because everything is made to order, choosing sizes carefully up front is the single best way to avoid remakes."
      sections={[
        {
          h: "Ranges we offer",
          body: [
            "- Youth: YXS, YS, YM, YL (roughly ages 5–14)",
            "- Adult: XS, S, M, L, XL, 2XL, 3XL, 4XL",
            "- Fit blocks: Standard, Athletic / slim, and Women's cut on every sport",
            "Youth blocks are priced slightly lower and are selected per roster row in the configurator.",
          ],
        },
        {
          h: "How to measure",
          body: [
            "Measure a garment that already fits the player well, laid flat, rather than the body:",
            "- Chest: armpit to armpit, doubled",
            "- Body length: highest point of the shoulder to hem",
            "- Sleeve: centre back neck to cuff",
            "Compare those numbers to the size chart on your proof. When a player is between sizes, size up for contact sports and down for compression fits.",
          ],
        },
        {
          h: "Sizing kits",
          body: [
            "For squad orders we can ship a sizing kit — sample garments in the exact fabric and block — before you commit. Request one during quotation. A refundable deposit covers the kit; it is returned when the samples come back in resaleable condition.",
          ],
        },
        {
          h: "Getting sizing wrong",
          body: [
            "Custom items are produced to the sizes you approve, so incorrect size selection is not covered by our returns policy.",
            "We keep a small buffer of blank sizes on common orders where possible, and can quote add-on units at the original unit price for 30 days after delivery.",
          ],
        },
      ]}
    />
  );
}
