import type { Metadata } from "next";
import { PolicyArticle } from "@/components/site/PolicyArticle";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "What personal data Elpuo collects when you configure a kit and request a quotation, how it's used and your rights.",
  alternates: { canonical: "/policies/privacy" },
};

export default function Page() {
  return (
    <PolicyArticle
      title="Privacy policy"
      updated="30 August 2026"
      intro="This policy explains what we collect when you use the Elpuo site and request a quotation, why we collect it, and the choices you have."
      sections={[
        {
          h: "What we collect",
          body: [
            "- Contact details you enter: name, organisation, email, phone, country, city and address",
            "- Order content: your kit configuration, design notes, and the player roster (names, numbers, sizes) you build",
            "- Technical data: basic analytics such as pages visited and device type, if analytics is enabled",
            "Your cart and configuration are also stored locally in your own browser so you can leave and come back. That local copy never leaves your device until you submit a quotation request.",
          ],
        },
        {
          h: "How we use it",
          body: [
            "- To prepare and send your quotation and proof",
            "- To produce, personalise and ship your order",
            "- To provide support and respond to claims",
            "- To improve the site and, where you've opted in, send occasional team offers",
            "We do not sell your personal data. Player names and numbers are used only to manufacture your kit.",
          ],
        },
        {
          h: "Sharing",
          body: [
            "We share data only with providers who help us operate: shipping couriers, payment processors, email and hosting services, and — where you request it — a decoration partner. They may only use it to perform that service.",
          ],
        },
        {
          h: "Retention",
          body: [
            "Quotation and order records are kept for as long as needed for warranty, accounting and legal reasons, then deleted or anonymised. You can ask us to remove your contact records sooner where we're not legally required to keep them.",
          ],
        },
        {
          h: "Your rights",
          body: [
            "Depending on where you live, you may have the right to access, correct, export or delete your personal data, and to object to certain processing. To exercise any of these, email studio@elpuo.example from the address on file.",
          ],
        },
        {
          h: "Children",
          body: [
            "Kit is often made for youth teams, but the account holder and point of contact must be an adult (a coach, parent or club official) who provides player details on the team's behalf.",
          ],
        },
        {
          h: "Contact",
          body: [
            "Questions or complaints about privacy can be sent to studio@elpuo.example. If you're in a region with a data protection authority, you also have the right to lodge a complaint with it.",
          ],
        },
      ]}
    />
  );
}
