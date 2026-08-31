import type { Metadata } from "next";
import { PolicyArticle } from "@/components/site/PolicyArticle";

export const metadata: Metadata = {
  title: "Terms of Service",
  description:
    "The terms that apply when you use the Elpuo website, request a quotation and place a custom uniform order.",
};

export default function Page() {
  return (
    <PolicyArticle
      title="Terms of service"
      updated="30 August 2026"
      intro="These terms cover your use of the Elpuo website and the quotation and ordering process. By requesting a quote you agree to them."
      sections={[
        {
          h: "Quotations are not orders",
          body: [
            "Configuring a kit and submitting a quotation request does not create a contract or reserve production capacity. Prices shown on the site are non-binding estimates.",
            "A binding order exists only once we issue a written quote, you accept it, and any required deposit is paid. We may decline or adjust a quote for artwork we can't lawfully produce, incomplete information, or capacity reasons.",
          ],
        },
        {
          h: "Pricing and payment",
          body: [
            "The on-site estimate reflects your selected options, roster and displayed team discounts. Final pricing on your written quote may differ once shipping, taxes, artwork complexity and exact specifications are confirmed.",
            "Unless agreed otherwise, orders require a deposit to begin production, with the balance due before dispatch. Quotes are valid for 30 days.",
          ],
        },
        {
          h: "Your responsibilities",
          body: [
            "- Provide accurate roster, sizing and contact information",
            "- Hold the rights to all logos, names and marks you supply (see the artwork policy)",
            "- Review and approve proofs carefully; approved proofs are binding",
            "- Pay amounts due on time",
          ],
        },
        {
          h: "Cancellations and changes",
          body: [
            "You may cancel before proof approval for a refund of any deposit less design and setup work already done. After proof approval, orders are in production and cannot be cancelled or materially changed.",
          ],
        },
        {
          h: "Liability",
          body: [
            "Our total liability for any order is limited to the amount you paid for that order. We are not liable for indirect or consequential losses, including missed fixtures or events, except where the law does not allow such a limit.",
          ],
        },
        {
          h: "Website use",
          body: [
            "The site, its design system and content are owned by Elpuo. Cart and configuration data are stored in your browser for your convenience and are not a record of an order. Don't misuse the site, attempt to disrupt it, or scrape it at scale.",
          ],
        },
        {
          h: "Governing terms",
          body: [
            "These terms are governed by the laws of the jurisdiction in which Elpuo is registered, and any dispute will be handled by the courts of that jurisdiction. If any clause is unenforceable, the rest still applies.",
          ],
        },
      ]}
    />
  );
}
