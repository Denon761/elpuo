import type { Metadata } from "next";
import { ButtonLink } from "@/components/ui/Button";
import { Reveal } from "@/components/site/Reveal";
import { FACTS } from "@/lib/site";

export const metadata: Metadata = {
  title: "About",
  description:
    "Elpuo is a custom teamwear studio with an in-house sublimation floor, building uniforms for clubs, schools and academies across 10 sports.",
  alternates: { canonical: "/about" },
};

const VALUES = [
  {
    t: "One roof",
    d: "Design, sublimation, cutting, stitching and QC all happen in our own facility. Fewer hand-offs, tighter tolerances, honest lead times.",
  },
  {
    t: "Kit, not catalogue",
    d: "No blank stock with a logo slapped on. Every order is drawn to your colours, sponsors and squad from a sport-correct block.",
  },
  {
    t: "Quote before charge",
    d: "You configure freely and we quote a real number. No deposits to see a proof, no pressure to convert.",
  },
  {
    t: "Made to be played in",
    d: "Recycled-content knits, certified inks, and construction rated for a full competitive season of washes and contact.",
  },
];

export default function AboutPage() {
  return (
    <>
      <section className="noise relative overflow-hidden bg-ink pb-16 pt-28 md:pt-40">
        <div className="grid-lines pointer-events-none absolute inset-0 opacity-30" />
        <div className="container-x relative grid gap-10 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <Reveal>
              <p className="kicker text-volt">Studio</p>
            </Reveal>
            <Reveal delay={60}>
              <h1 className="display-1 mt-4">
                We kit the
                <br />
                <span className="text-volt">ones who play</span>
              </h1>
            </Reveal>
            <Reveal delay={120}>
              <p className="mt-6 max-w-xl text-lg text-paper/65">
                Elpuo started on a single dye-sublimation press making shirts for a
                local handball league that couldn&apos;t get a straight answer from
                the big suppliers. The brief hasn&apos;t changed: sport-correct
                kit, drawn properly, priced honestly, delivered on time.
              </p>
            </Reveal>
          </div>
          <Reveal delay={160}>
            <div className="grid grid-cols-2 gap-3 text-center">
              {[
                ["10", "sports"],
                [`${FACTS.productionDays} days`, "standard build"],
                [String(FACTS.countriesShipped), "countries shipped"],
                ["100%", "in-house decoration"],
              ].map(([k, v]) => (
                <div
                  key={v}
                  className="rounded-md border border-line bg-ink-2 p-6"
                >
                  <p className="font-display text-3xl text-paper">{k}</p>
                  <p className="mt-1 text-xs text-paper/60">{v}</p>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      <section className="bg-ink py-20 md:py-24">
        <div className="container-x">
          <h2 className="display-2 max-w-xl">What we hold to</h2>
          <div className="mt-12 grid gap-px overflow-hidden rounded-lg border border-line bg-line sm:grid-cols-2">
            {VALUES.map((v, i) => (
              <Reveal key={v.t} delay={(i % 2) * 70} className="bg-ink">
                <div className="h-full p-8">
                  <span className="font-display text-4xl text-paper/15">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <h3 className="display-3 mt-2 text-2xl">{v.t}</h3>
                  <p className="mt-2 text-paper/65">{v.d}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="on-paper py-20">
        <div className="container-x flex flex-col items-start gap-6 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="display-2 max-w-lg">Bring us your squad</h2>
            <p className="mt-3 max-w-md text-ink/65">
              One sport or a whole club programme — the build flow is the same.
            </p>
          </div>
          <ButtonLink href="/sports" size="lg">
            Start your kit
          </ButtonLink>
        </div>
      </section>
    </>
  );
}
