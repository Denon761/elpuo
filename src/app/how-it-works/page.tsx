import type { Metadata } from "next";
import { ButtonLink } from "@/components/ui/Button";
import { Reveal } from "@/components/site/Reveal";
import { REPLY_TIMELINE } from "@/lib/site";

export const metadata: Metadata = {
  title: "How It Works",
  description:
    "From picking a sport to matchday delivery — how Elpuo turns your fabric choices, sizes and uploaded design into produced, shipped custom uniforms.",
  alternates: { canonical: "/how-it-works" },
};

const PHASES = [
  {
    n: "01",
    t: "Tell us roughly what you need",
    d: "Open any sport and start with just an approximate quantity and your contact details — nothing technical yet. We pre-select our most popular fabric, decoration and names-and-numbers setup for you.",
    points: [
      "Just a rough headcount to start — exact sizes are optional",
      "Recommended options are pre-picked; customize only if you want to",
      "Not sure on a choice? One click sets it to our pick",
    ],
  },
  {
    n: "02",
    t: "Add design & sizes",
    d: "Upload the design you have in mind — a sketch, a mockup or print-ready files — or tell us you don't have one yet and need design help. Add player names, numbers and an exact size breakdown if you have them.",
    points: [
      "No design yet? Flag it and our studio helps you create one",
      "Size grid from YS to 3XL, entirely optional at this stage",
      "Attach PNG, JPG, PDF, AI or EPS up to 8 MB",
    ],
  },
  {
    n: "03",
    t: "Check out or get a quote",
    d: "Orders under 30 units see live pricing and pay securely on the spot. Larger orders submit for a free quote instead — nothing charged. " +
      REPLY_TIMELINE,
    points: [
      "Under 30 units: instant pricing, pay on-site",
      "30+ units: no payment — a specialist quotes it for you",
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
