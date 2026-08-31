import type { Metadata } from "next";
import { PolicyArticle } from "@/components/site/PolicyArticle";

export const metadata: Metadata = {
  title: "Returns & Remakes Policy",
  description:
    "How Elpuo handles returns, remakes and defects on custom-made sports uniforms.",
  alternates: { canonical: "/policies/returns" },
};

export default function Page() {
  return (
    <PolicyArticle
      title="Returns & remakes"
      updated="30 August 2026"
      intro="Elpuo products are personalised and made to order, so they can't be resold. That shapes what we can and can't take back — but we stand behind our own work completely."
      sections={[
        {
          h: "Custom items",
          body: [
            "Because each kit is produced to your approved proof, roster and sizes, we do not accept returns or exchanges for change of mind, incorrect size selection, or roster errors that were present on an approved proof.",
            "Please use sizing kits and check proofs carefully — this is where almost every avoidable issue is caught.",
          ],
        },
        {
          h: "If we got it wrong",
          body: [
            "We will remake, at our cost, any item that does not match your approved proof, including:",
            "- Wrong name, number, size or colour versus the approved proof",
            "- Print defects, misregistration, peeling decoration or stitching faults",
            "- Fabric flaws or holes present on arrival",
            "Report issues within 14 days of delivery with photos and your quotation reference. Approved remakes are produced on a priority schedule.",
          ],
        },
        {
          h: "Workmanship warranty",
          body: [
            "Decoration (sublimation, tackle twill, embroidery) is warranted against failure under normal use and correct care for one full competitive season from delivery. Fair wear and tear, damage from misuse, and failure to follow care instructions are not covered.",
          ],
        },
        {
          h: "How to start a claim",
          body: [
            "Email studio@elpuo.example with your quotation reference, a description of the problem and clear photos. We aim to respond within two business days with a resolution — remake, partial credit, or replacement of affected units.",
          ],
        },
      ]}
    />
  );
}
