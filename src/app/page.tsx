import Image from "next/image";
import Link from "next/link";
import { ButtonLink } from "@/components/ui/Button";
import { MarqueeStrip } from "@/components/site/MarqueeStrip";
import { Reveal } from "@/components/site/Reveal";
import { SportCard } from "@/components/site/SportCard";
import { SPORTS } from "@/lib/catalog";

const STEPS = [
  {
    n: "01",
    title: "Pick your sport",
    body: "Ten disciplines, each on its own sport-correct block — from netball tanks to gridiron jerseys cut for pads.",
  },
  {
    n: "02",
    title: "Choose fabric & options",
    body: "Fabric weight, decoration method, kit pieces, names-and-numbers technique and add-ons — a short, simple form.",
  },
  {
    n: "03",
    title: "Upload your design",
    body: "Attach the artwork you have in mind, add your sizes and any player names and numbers, and note the details.",
  },
  {
    n: "04",
    title: "Submit for a quote",
    body: "Send it to our studio with your contact details. We confirm artwork, price it and put it on the print floor.",
  },
];

const FEATURES = [
  {
    title: "Full sublimation",
    body: "Edge-to-edge dye print. Unlimited colours, gradients and patterns baked into the fabric — nothing to peel or crack.",
  },
  {
    title: "Tackle twill & embroidery",
    body: "Sewn twill numbers and embroidered crests for the pro look, on the same kit if you want it.",
  },
  {
    title: "Upload your own design",
    body: "Attach the artwork you already have — a sketch, a mockup or print-ready files — straight into the quote request.",
  },
  {
    title: "One simple form",
    body: "No cart, no checkout. Pick fabric and options, add sizes and players, submit. We reply with a firm quote.",
  },
];

const STATS = [
  { k: "10", v: "sports on dedicated blocks" },
  { k: "14 days", v: "standard production" },
  { k: "48", v: "countries shipped" },
  { k: "in-house", v: "sublimation print floor" },
];

const FAQS = [
  {
    q: "Is there a minimum order?",
    a: "Yes — 3 units per order, right through to full club runs. Tell us the quantities in your request and we price accordingly.",
  },
  {
    q: "How do I customise the kit?",
    a: "On each sport page you pick fabric, decoration method, kit pieces and a few options, add your size breakdown and any player names and numbers, then upload your design. It's one short form.",
  },
  {
    q: "Do I pay on the website?",
    a: "No. There's no cart or checkout. You submit a quote request and our team confirms artwork and specs, then sends a firm quote and invoice.",
  },
  {
    q: "Can I upload my own design?",
    a: "Yes — attach the artwork you have in mind (PNG, JPG, PDF, AI or EPS) directly in the request, and add colour references or notes alongside it.",
  },
  {
    q: "What files do you need for logos?",
    a: "Vector (AI, EPS, PDF or SVG) is ideal. High-resolution PNG works for most crests. You can attach one file in the form and email anything larger after.",
  },
];

export default function HomePage() {
  return (
    <>
      {/* ---------------------------------------------------------- HERO */}
      <section className="noise relative overflow-hidden bg-ink pt-28 md:pt-36">
        <div
          aria-hidden
          className="animate-drift pointer-events-none absolute -right-40 -top-40 h-[70vw] max-h-[900px] w-[70vw] max-w-[900px] rounded-full opacity-50 blur-3xl"
          style={{
            background:
              "radial-gradient(circle at 30% 30%, #f26a2155, transparent 60%), radial-gradient(circle at 70% 70%, #ffb02033, transparent 55%)",
          }}
        />
        <div className="grid-lines pointer-events-none absolute inset-0 opacity-40" />

        <div className="container-x relative">
          <div className="mx-auto max-w-5xl text-center">
            <Reveal>
              <p className="kicker text-volt">Custom teamwear · sublimated in-house</p>
            </Reveal>
            <Reveal delay={60}>
              <h1 className="mt-5 font-display uppercase leading-[0.95] tracking-[0.01em] text-[clamp(2.3rem,6.2vw,4.75rem)]">
                Built for your <span className="text-volt">side</span>.
              </h1>
            </Reveal>
            <Reveal delay={120}>
              <p className="mx-auto mt-6 max-w-2xl text-lg text-paper/65 md:text-xl">
                Custom uniforms for ten sports. Pick your fabric and options,
                upload the design you have in mind, and submit one short form for
                a quote. No cart, no checkout, no order forms by email.
              </p>
            </Reveal>
            <Reveal delay={180}>
              <div className="mt-9 flex flex-wrap justify-center gap-3">
                <ButtonLink href="/sports" size="lg">
                  Start your kit
                </ButtonLink>
                <ButtonLink href="/how-it-works" variant="outline" size="lg">
                  How it works
                </ButtonLink>
              </div>
            </Reveal>
            <Reveal delay={240}>
              <dl className="mx-auto mt-12 grid max-w-lg grid-cols-3 gap-6 border-t border-line pt-6">
                {STATS.slice(0, 3).map((s) => (
                  <div key={s.v}>
                    <dt className="font-display text-2xl text-paper md:text-3xl">
                      {s.k}
                    </dt>
                    <dd className="mt-1 text-xs text-paper/50">{s.v}</dd>
                  </div>
                ))}
              </dl>
            </Reveal>
          </div>
        </div>

        {/* full-width hero image — zoomed crop on mobile, full lineup on desktop */}
        <Reveal delay={120} className="relative mt-14 md:mt-20">
          <div className="relative aspect-[4/5] w-full sm:aspect-[16/9] md:aspect-[2575/823]">
            <Image
              src="/hero.jpg"
              alt="Athletes across ten sports wearing custom Elpuo uniforms"
              fill
              priority
              sizes="100vw"
              className="object-cover object-center"
            />
            <div className="pointer-events-none absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-ink to-transparent" />
          </div>
        </Reveal>

        <MarqueeStrip items={SPORTS.map((s) => `Custom ${s.name}`)} />
      </section>

      {/* ---------------------------------------------------------- SPORTS GRID */}
      <section className="bg-ink py-20 md:py-28">
        <div className="container-x">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <Reveal>
              <h2 className="display-2 max-w-2xl">
                Pick your <span className="text-volt">sport</span>
              </h2>
            </Reveal>
            <Reveal delay={80}>
              <p className="max-w-sm text-paper/60">
                Every discipline gets a sport-correct silhouette, fabric weight and
                decoration rules. Click through to configure.
              </p>
            </Reveal>
          </div>

          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {SPORTS.map((sport, i) => (
              <Reveal key={sport.slug} delay={(i % 4) * 60}>
                <SportCard sport={sport} index={i} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------------- FEATURES (paper) */}
      <section className="on-paper py-20 md:py-28">
        <div className="container-x">
          <Reveal>
            <p className="kicker text-ink/50">Everything is customizable</p>
          </Reveal>
          <Reveal delay={60}>
            <h2 className="display-2 mt-4 max-w-3xl">
              One configurator. Every decoration your kit needs.
            </h2>
          </Reveal>

          <div className="mt-14 grid gap-px overflow-hidden rounded-lg border border-line-ink bg-line-ink sm:grid-cols-2">
            {FEATURES.map((f, i) => (
              <Reveal key={f.title} delay={(i % 2) * 80} className="bg-paper">
                <div className="flex h-full flex-col gap-3 p-8">
                  <span className="font-display text-4xl text-ink/15">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <h3 className="display-3 text-2xl">{f.title}</h3>
                  <p className="text-ink/65">{f.body}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------------- PROCESS */}
      <section className="bg-ink py-20 md:py-28">
        <div className="container-x">
          <Reveal>
            <h2 className="display-2 max-w-2xl">
              From blank block to <span className="text-volt">matchday</span>
            </h2>
          </Reveal>
          <div className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {STEPS.map((s, i) => (
              <Reveal key={s.n} delay={(i % 4) * 70}>
                <div className="flex h-full flex-col rounded-md border border-line bg-ink-2 p-7">
                  <span className="font-display text-5xl text-volt">{s.n}</span>
                  <h3 className="display-3 mt-4 text-xl">{s.title}</h3>
                  <p className="mt-2 text-sm text-paper/60">{s.body}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------------- STATS */}
      <section className="border-y border-line bg-ink-2 py-14">
        <div className="container-x grid grid-cols-2 gap-8 md:grid-cols-4">
          {STATS.map((s) => (
            <Reveal key={s.v}>
              <p className="font-display text-4xl text-paper md:text-5xl">{s.k}</p>
              <p className="mt-2 text-sm text-paper/55">{s.v}</p>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ---------------------------------------------------------- FAQ */}
      <section className="bg-ink py-20 md:py-28">
        <div className="container-x grid gap-12 lg:grid-cols-[0.8fr_1.2fr]">
          <Reveal>
            <h2 className="display-2">Good to know</h2>
            <p className="mt-4 max-w-xs text-paper/60">
              Still unsure? <Link href="/contact" className="text-volt link-underline">Talk to a kit specialist</Link>.
            </p>
          </Reveal>
          <div className="divide-y divide-line border-y border-line">
            {FAQS.map((f, i) => (
              <Reveal key={f.q} as="div" delay={(i % 5) * 40}>
                <details className="group py-5">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4">
                    <span className="display-3 text-lg md:text-xl">{f.q}</span>
                    <span className="font-display text-2xl text-volt transition-transform group-open:rotate-45">
                      +
                    </span>
                  </summary>
                  <p className="mt-3 max-w-2xl text-paper/65">{f.a}</p>
                </details>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------------- CTA */}
      <section className="on-paper py-20 md:py-28">
        <div className="container-x">
          <Reveal className="flex flex-col items-start gap-8 rounded-lg bg-ink p-10 text-paper md:flex-row md:items-center md:justify-between md:p-16">
            <div>
              <h2 className="display-2 max-w-xl">
                Your kit is <span className="text-lime">10 minutes</span> away
              </h2>
              <p className="mt-4 max-w-md text-paper/65">
                Start with any sport. Nothing is charged — you&apos;ll get a quote
                back within one business day.
              </p>
            </div>
            <ButtonLink href="/sports" size="lg" className="shrink-0">
              Build your kit
            </ButtonLink>
          </Reveal>
        </div>
      </section>
    </>
  );
}
