import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ProductGallery } from "@/components/product/ProductGallery";
import { QuoteForm } from "@/components/product/QuoteForm";
import { TrustStrip } from "@/components/product/TrustStrip";
import { JsonLd } from "@/components/site/JsonLd";
import { Reveal } from "@/components/site/Reveal";
import { MIN_ORDER_QTY, SPORTS, getSport, groupsFor } from "@/lib/catalog";
import { usd } from "@/lib/format";
import { abs, FACTS, ORG } from "@/lib/site";

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

  const title = sport.seoTitle ?? `Custom ${sport.name} Uniforms`;
  const path = `/sports/${sport.slug}`;
  const image = sport.images?.[0]?.src;

  return {
    title,
    description: sport.metaDescription,
    keywords: [
      `custom ${sport.name.toLowerCase()} uniforms`,
      `custom ${sport.name.toLowerCase()} jerseys`,
      ...(sport.aka ?? []).map((a) => `custom ${a.toLowerCase()} kit`),
      "sublimated teamwear",
    ],
    alternates: { canonical: path },
    openGraph: {
      title: `${title} · Elpuo`,
      description: sport.metaDescription,
      url: path,
      type: "website",
      ...(image ? { images: [{ url: image, alt: `Custom ${sport.name} uniform` }] } : {}),
    },
  };
}

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
  const path = `/sports/${sport.slug}`;

  /* Shared operational facts — authored once in FACTS, so shipping, sizing,
     the sport pages and the FAQs can never disagree. */
  const OPS = [
    {
      h: "Materials & care",
      p: "Recycled-content polyester knits, OEKO-TEX certified inks. Machine wash cold inside-out, hang dry, no ironing directly on print. Sublimation and twill are both rated for a full competitive season.",
    },
    {
      h: "Production & lead time",
      p: `Standard production is roughly ${FACTS.productionDays} working days from artwork approval. A digital proof is issued within ${FACTS.proofDays} business days of your request — nothing goes to print without your sign-off.`,
    },
    {
      h: "Sizing",
      p: `${FACTS.sizeRange} on every block, with women's and athletic cuts available. Ask for a sizing kit in your request if the squad needs to try before committing.`,
    },
    {
      h: "Minimum order & pricing",
      p: `Minimum ${MIN_ORDER_QTY} units per order, mixed sizes allowed. The "from" price is indicative per unit; your firm quote depends on fabric, decoration and quantity.`,
    },
  ];

  const productSchema = {
    "@context": "https://schema.org",
    "@type": "Product",
    "@id": abs(`${path}#product`),
    name: `Custom ${sport.name} Uniform`,
    description: sport.metaDescription,
    category: `Custom ${sport.name} teamwear`,
    ...(sport.images?.length
      ? { image: sport.images.map((i) => abs(i.src)) }
      : {}),
    brand: { "@type": "Brand", name: ORG.name },
    audience: { "@type": "Audience", audienceType: "Sports clubs, schools and academies" },
    offers: {
      "@type": "AggregateOffer",
      priceCurrency: FACTS.priceCurrency,
      lowPrice: sport.unitBase,
      offerCount: SPORTS.length,
      availability: "https://schema.org/InStock",
      url: abs(path),
      seller: { "@id": abs("/#organization") },
      eligibleQuantity: {
        "@type": "QuantitativeValue",
        minValue: MIN_ORDER_QTY,
        unitText: "units",
      },
    },
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: abs("/") },
      { "@type": "ListItem", position: 2, name: "Sports", item: abs("/sports") },
      { "@type": "ListItem", position: 3, name: sport.name, item: abs(path) },
    ],
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "@id": abs(`${path}#faq`),
    mainEntity: sport.faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };

  return (
    <>
      <JsonLd data={[productSchema, breadcrumbSchema, faqSchema]} />

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
            <nav aria-label="Breadcrumb" className="kicker flex items-center gap-2 text-paper/60">
              <Link href="/sports" className="hover:text-paper">
                Sports
              </Link>
              <span aria-hidden>/</span>
              <span className="text-paper/70" aria-current="page">
                {sport.name}
              </span>
            </nav>
          </Reveal>
          <div className="mt-5">
            <Reveal delay={60}>
              <p className="kicker text-volt">{sport.discipline}</p>
            </Reveal>
            <Reveal delay={100}>
              <h1 className="display-1 mt-3">
                Custom {sport.name}
                {sport.slug === "soccer" ? " / Football" : ""} Uniforms
              </h1>
            </Reveal>
            <Reveal delay={150}>
              <p className="mt-4 max-w-2xl text-lg text-paper/65">{sport.blurb}</p>
            </Reveal>
          </div>
        </div>
      </section>

      {/* gallery + quote form */}
      <section className="bg-ink pb-24 pt-6">
        <div className="container-x grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,520px)]">
          <ProductGallery sport={sport} />
          <div className="min-w-0">
            <TrustStrip />
            <QuoteForm sport={sport} groups={groups} />
          </div>
        </div>
      </section>

      {/* sport-specific detail */}
      <section className="on-paper py-20 md:py-24">
        <div className="container-x">
          <h2 className="display-2 max-w-xl">Built for {sport.name.toLowerCase()}</h2>
          <div className="mt-12 grid gap-px overflow-hidden rounded-lg border border-line-ink bg-line-ink md:grid-cols-2">
            {sport.specifics.map((block) => (
              <div key={block.h} className="bg-paper p-8">
                <h3 className="display-3 text-xl text-ink">{block.h}</h3>
                <p className="mt-2 text-ink/65">{block.p}</p>
              </div>
            ))}
          </div>

          <h2 className="display-3 mt-16 text-2xl">The essentials</h2>
          <div className="mt-6 grid gap-px overflow-hidden rounded-lg border border-line-ink bg-line-ink md:grid-cols-2">
            {OPS.map((block) => (
              <div key={block.h} className="bg-paper p-8">
                <h3 className="display-3 text-xl text-ink">{block.h}</h3>
                <p className="mt-2 text-ink/65">{block.p}</p>
              </div>
            ))}
          </div>

          <p className="mt-6 text-sm text-ink/60">
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

      {/* sport-specific FAQ */}
      <section className="bg-ink py-20 md:py-24">
        <div className="container-x grid gap-12 lg:grid-cols-[0.8fr_1.2fr]">
          <div>
            <h2 className="display-2">{sport.name} kit questions</h2>
            <p className="mt-4 max-w-xs text-paper/60">
              Specific to {sport.name.toLowerCase()}. For anything else,{" "}
              <Link href="/contact" className="text-volt link-underline">
                talk to a kit specialist
              </Link>
              .
            </p>
          </div>
          <div className="divide-y divide-line border-y border-line">
            {sport.faqs.map((f) => (
              <details key={f.q} className="group py-5">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4">
                  <span className="display-3 text-lg md:text-xl">{f.q}</span>
                  <span className="font-display text-2xl text-volt transition-transform group-open:rotate-45">
                    +
                  </span>
                </summary>
                <p className="mt-3 max-w-2xl text-paper/65">{f.a}</p>
              </details>
            ))}
          </div>
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
                <p className="mt-1 text-xs text-paper/60">from {usd(s.unitBase)}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
