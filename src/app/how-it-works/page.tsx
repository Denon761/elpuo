import type { Metadata } from "next";
import { ButtonLink } from "@/components/ui/Button";
import { Reveal } from "@/components/site/Reveal";

export const metadata: Metadata = {
  title: "How It Works",
  description:
    "From picking a sport to matchday delivery — how Elpuo turns your fabric choices, sizes and uploaded design into produced, shipped custom uniforms.",
  alternates: { canonical: "/how-it-works" },
};

const PHASES = [
  {
    n: "01",
    t: "Choose",
    d: "Open any sport and work down one short form: fabric weight, decoration method, kit pieces, names-and-numbers technique and add-ons. Product photos show the make and fit.",
    points: [
      "Full sublimation, screen print or cut & sew",
      "Heat vinyl, tackle twill or embroidery for names & badges",
      "Team crest, captain's armband, neck tags, matchday bag",
    ],
  },
  {
    n: "02",
    t: "Sizes & design",
    d: "Enter a size breakdown and total quantity, list any player names and numbers, then upload the design you have in mind — a sketch, a mockup or print-ready files — with colour notes.",
    points: [
      "Size grid from YS to 3XL",
      "Player names & numbers, one per line",
      "Attach PNG, JPG, PDF, AI or EPS up to 8 MB",
    ],
  },
  {
    n: "03",
    t: "Submit for a quote",
    d: "Add your contact details and submit. Nothing is charged. A kit specialist reviews artwork and specs and replies by email with a firm quote plus a digital proof within one business day.",
    points: [
      "No cart, no checkout — one form",
      "Proof issued in ~2 business days",
      "Nothing prints without your written approval",
    ],
  },
  {
    n: "04",
    t: "Produce & ship",
    d: "On approval your kit goes to our in-house print floor. Standard production is about 14 working days; rush is roughly 7 at a premium. We ship worldwide with tracking.",
    points: [
      "Sublimation, cutting, stitching and QC under one roof",
      "Every unit checked against your approved proof",
      "Tracked worldwide delivery",
    ],
  },
];

export default function HowItWorksPage() {
  return (
    <>
      <section className="noise relative overflow-hidden bg-ink pb-14 pt-28 md:pt-40">
        <div className="grid-lines pointer-events-none absolute inset-0 opacity-30" />
        <div className="container-x relative max-w-3xl">
          <Reveal>
            <p className="kicker text-volt">The process</p>
          </Reveal>
          <Reveal delay={60}>
            <h1 className="display-1 mt-4">Three steps to a kit</h1>
          </Reveal>
          <Reveal delay={120}>
            <p className="mt-6 text-lg text-paper/65">
              Elpuo replaces the back-and-forth of email order forms with one
              short request. You choose the fabric and options and upload your
              design; we quote, proof and produce.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="bg-ink pb-24">
        <div className="container-x space-y-4">
          {PHASES.map((p, i) => (
            <Reveal key={p.n} delay={(i % 2) * 60}>
              <div className="grid gap-6 rounded-lg border border-line bg-ink-2 p-8 md:grid-cols-[auto_1fr] md:p-10">
                <span className="font-display text-6xl text-volt md:text-7xl">
                  {p.n}
                </span>
                <div>
                  <h2 className="display-2 text-3xl">{p.t}</h2>
                  <p className="mt-3 max-w-2xl text-paper/65">{p.d}</p>
                  <ul className="mt-5 grid gap-2 sm:grid-cols-3">
                    {p.points.map((pt) => (
                      <li
                        key={pt}
                        className="rounded-sm border border-line bg-ink px-3 py-2 text-xs text-paper/60"
                      >
                        {pt}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="on-paper py-20">
        <div className="container-x flex flex-col items-start gap-6 md:flex-row md:items-center md:justify-between">
          <h2 className="display-2 max-w-lg">Ready when you are</h2>
          <ButtonLink href="/sports" size="lg">
            Start your kit
          </ButtonLink>
        </div>
      </section>
    </>
  );
}
