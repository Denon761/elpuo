import type { Metadata } from "next";
import { PolicyArticle } from "@/components/site/PolicyArticle";

export const metadata: Metadata = {
  title: "Shipping & Production Policy",
  description:
    "Elpuo production lead times, rush options, worldwide shipping, duties and delivery for custom uniform orders.",
  alternates: { canonical: "/policies/shipping" },
};

export default function Page() {
  return (
    <PolicyArticle
      title="Shipping & production"
      updated="30 August 2026"
      intro="Lead time on custom kit is measured from the day you approve your proof — not the day you request a quote. Here's how the clock works and how orders reach you."
      sections={[
        {
          h: "Production lead times",
          body: [
            "- Standard: approximately 14 working days from proof approval",
            "- Rush: approximately 7 working days, charged at +18% on the order",
            "- Large programmes (250+ units) are scheduled individually and confirmed in writing",
            "Proofs are issued around two business days after a quotation request. Delays in approving artwork, roster or payment move the production start date accordingly.",
          ],
        },
        {
          h: "Shipping",
          body: [
            "We ship worldwide with tracked courier services. Shipping is quoted per order based on weight, destination and speed, and appears as a separate line on your final quote — it is not included in the on-site estimate.",
            "Split shipments (for example, a rush of first-team shirts followed by the rest of the club) can be arranged and are quoted separately.",
          ],
        },
        {
          h: "Duties, taxes and customs",
          body: [
            "For international orders, import duties and taxes are the responsibility of the recipient unless we agree otherwise in writing. We declare shipments accurately and cannot mark orders as gifts or under-declare value.",
          ],
        },
        {
          h: "Delivery, delays and damage",
          body: [
            "Title and risk pass to you on delivery to the courier. Inspect your order on arrival and report shortages or transit damage within 7 days with photos so we can file a claim and arrange a remake.",
            "We are not liable for courier delays outside our control, but we will help chase and, for our production errors, prioritise a corrected remake.",
          ],
        },
      ]}
    />
  );
}
