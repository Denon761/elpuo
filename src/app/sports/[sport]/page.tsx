import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ProductGallery } from "@/components/product/ProductGallery";
import { QuoteForm } from "@/components/product/QuoteForm";
import { Reveal } from "@/components/site/Reveal";
import { MIN_ORDER_QTY, SPORTS, getSport, groupsFor } from "@/lib/catalog";
import { usd } from "@/lib/format";

export function generateStaticParams() {
  return SPORTS.map((s) => ({ sport: s.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ sport: string }>;
}): Promise<Metadata> {
  const { sport: slug } = await params;
  const sport = getSport(slug);
  if (!sport) return { title: "Sport not found" };
  return {
    title: `Custom ${sport.name} Uniforms`,
    description: `${sport.blurb} From ${usd(sport.unitBase)} per unit. Choose fabric and decoration, upload your design and request a quote.`,
  };
}

const INFO = [
  {
    h: "What's included",
    p: "Your chosen fabric, decoration method and kit pieces, made to order. Names, numbers and crests are applied in-house and quality-checked against your approved proof before packing.",
  },
  {
    h: "Materials & care",
    p: "Recycled-content polyester knits, OEKO-TEX certified inks. Machine wash cold inside-out, hang dry, no ironing directly on print. Sublimation and twill both rated for a full competitive season.",
  },
  {
    h: "Production & lead time",
    p: "Standard production is roughly 14 working days from artwork approval. A digital proof is issued within 2 business days of your request — nothing goes to print without your sign-off.",
  },
  {
    h: "Sizing",
    p: "Youth YS–YL and adult XS–3XL on every block, with women's and athletic cuts available. Ask for a sizing kit in your request if the squad needs to try before committing.",
  },
];

export default async function SportPage({
  params,
}: {
  params: Promise<{ sport: string }>;
}) {
  const { sport: slug } = await params;
  const sport = getSport(slug);
  if (!sport) notFound();

  const groups = groupsFor(sport);
  const related = SPORTS.filter((s) => s.slug !== sport.slug).slice(0, 5);

  return (
    <>
      <section className="noise relative overflow-hidden bg-ink pb-8 pt-28 md:pt-36">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-60"
          style={{
            background: `radial-gradient(60% 50% at 15% 0%, ${sport.hue}22, transparent 70%)`,
          }}
        />
        <div className="container-x relative">
          <Reveal>
            <nav className="kicker flex items-center gap-2 text-paper/40">
              <Link href="/sports" className="hover:text-paper">
                Sports
              </Link>
              <span>/</span>
              <span className="text-paper/70">{sport.name}</span>
            </nav>
          </Reveal>
          <div className="mt-5 flex flex-wrap items-end justify-between gap-6">
            <div>
              <Reveal delay={60}>
                <p className="kicker text-volt">{sport.discipline}</p>
              </Reveal>
              <Reveal delay={100}>
                <h1 className="display-1 mt-3">Custom {sport.name}</h1>
              </Reveal>
              <Reveal delay={150}>
                <p className="mt-4 max-w-2xl text-lg text-paper/65">{sport.blurb}</p>
              </Reveal>
            </div>
            <Reveal delay={180}>
              <div className="rounded-md border border-line bg-ink-2 px-6 py-4 text-right">
                <p className="kicker text-paper/40">from</p>
                <p className="font-display text-4xl text-volt">{usd(sport.unitBase)}</p>
                <p className="mt-1 text-xs text-paper/45">
                  per unit · indicative · min. {MIN_ORDER_QTY} units
                </p>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* gallery + quote form */}
      <section className="bg-ink pb-24 pt-6">
        <div className="container-x grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,520px)]">
          <ProductGallery sport={sport} />
          <div className="min-w-0">
            <QuoteForm sport={sport} groups={groups} />
          </div>
        </div>
      </section>

      {/* info */}
      <section className="on-paper py-20 md:py-24">
        <div className="container-x">
          <h2 className="display-2 max-w-xl">The detail</h2>
          <div className="mt-12 grid gap-px overflow-hidden rounded-lg border border-line-ink bg-line-ink md:grid-cols-2">
            {INFO.map((block) => (
              <div key={block.h} className="bg-paper p-8">
                <h3 className="display-3 text-xl">{block.h}</h3>
                <p className="mt-2 text-ink/65">{block.p}</p>
              </div>
            ))}
          </div>
          <p className="mt-6 text-sm text-ink/50">
            Full details in our{" "}
            <Link href="/policies/customization" className="link-underline font-semibold">
              artwork &amp; customization policy
            </Link>{" "}
            and{" "}
            <Link href="/policies/sizing" className="link-underline font-semibold">
              sizing guide
            </Link>
            .
          </p>
        </div>
      </section>

      {/* related */}
      <section className="bg-ink py-16 md:py-20">
        <div className="container-x">
          <div className="flex items-baseline justify-between">
            <h2 className="display-3 text-2xl">Other sports</h2>
            <Link href="/sports" className="kicker text-volt link-underline">
              View all
            </Link>
          </div>
          <div className="mt-8 grid gap-3 sm:grid-cols-3 lg:grid-cols-5">
            {related.map((s) => (
              <Link
                key={s.slug}
                href={`/sports/${s.slug}`}
                className="group rounded-md border border-line bg-ink-2 p-5 transition-colors hover:border-line-strong"
              >
                <span
                  className="block h-10 w-10 rounded-[8px]"
                  style={{
                    background: `linear-gradient(135deg, ${s.hue}, ${s.colorway[1]})`,
                  }}
                />
                <p className="mt-4 font-display text-sm uppercase leading-tight tracking-tight">
                  {s.name}
                </p>
                <p className="mt-1 text-xs text-paper/45">from {usd(s.unitBase)}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
