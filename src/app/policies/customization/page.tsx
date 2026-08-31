import type { Metadata } from "next";
import { PolicyArticle } from "@/components/site/PolicyArticle";

export const metadata: Metadata = {
  title: "Artwork & Customization Policy",
  description:
    "How Elpuo handles logos, sublimation artwork, names and numbers, proofs and approvals for custom uniform orders.",
};

export default function Page() {
  return (
    <PolicyArticle
      title="Artwork & customization"
      updated="30 August 2026"
      intro="Every Elpuo kit is made to order from your artwork and roster. This policy explains what we need from you, what we send back, and who is responsible for what."
      sections={[
        {
          h: "Files we accept",
          body: [
            "For logos and crests, send vector files wherever possible:",
            "- Adobe Illustrator (.ai), EPS, layered PDF or SVG",
            "- High-resolution PNG at 300 dpi or better, on a transparent background, is acceptable for most badges",
            "For full sublimation designs we can work from your finished print-ready art, or build the design in-house from a brief and reference images.",
          ],
        },
        {
          h: "Names, numbers and sizing",
          body: [
            "Player names and numbers are taken exactly from the roster you build in the configurator and confirm at quotation. Please double-check spelling, accents and number duplicates before approving your proof.",
            "Changes to the roster after proof approval may incur re-setup charges and can affect your production date.",
          ],
        },
        {
          h: "Proofs and approval",
          body: [
            "Within about two business days of your quotation request we issue a digital proof showing colours, placement, decoration method and a roster list.",
            "Nothing goes to production until you approve the proof in writing. Colours on screen are indicative; where exact colour matching matters, request a physical strike-off (fees apply) or supply Pantone references.",
            "Once you approve a proof, you accept responsibility for its contents, including spelling, numbers, sponsor placement and sizing.",
          ],
        },
        {
          h: "Intellectual property",
          body: [
            "You confirm that you own or are licensed to use every logo, crest, sponsor mark and name you supply, and that Elpuo may reproduce them to fulfil your order.",
            "We may photograph finished kit for our portfolio and marketing unless you ask us in writing not to. We will never sell your artwork or resell your design to another customer.",
          ],
        },
        {
          h: "Design services",
          body: [
            "Light adjustments — recolouring, placing a supplied logo, laying out a roster — are included.",
            "Original design work beyond that (custom pattern creation, crest redraws, full kit concepts) is quoted separately as a one-off design fee, which we tell you about before any work starts.",
          ],
        },
      ]}
    />
  );
}
