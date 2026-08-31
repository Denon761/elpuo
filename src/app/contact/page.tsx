import type { Metadata } from "next";
import { Reveal } from "@/components/site/Reveal";
import { ORG } from "@/lib/site";
import { ContactForm } from "./ContactForm";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Talk to an Elpuo kit specialist about custom uniforms, bulk club programmes, sizing kits and artwork.",
  alternates: { canonical: "/contact" },
};

const CHANNELS = [
  {
    k: "Email",
    v: ORG.email,
    note: "Quotes, artwork and proofs, club and season programmes, sizing kits",
  },
];

export default function ContactPage() {
  return (
    <>
      <section className="noise relative overflow-hidden bg-ink pb-14 pt-28 md:pt-40">
        <div className="grid-lines pointer-events-none absolute inset-0 opacity-30" />
        <div className="container-x relative max-w-3xl">
          <Reveal>
            <p className="kicker text-volt">Contact</p>
          </Reveal>
          <Reveal delay={60}>
            <h1 className="display-1 mt-4">Talk kit</h1>
          </Reveal>
          <Reveal delay={120}>
            <p className="mt-6 text-lg text-paper/65">
              Fastest path to a price is the{" "}
              <a href="/sports" className="link-underline text-volt">
                configurator
              </a>
              . For everything else — sizing kits, sponsorship layouts, season
              programmes — reach the studio directly.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="bg-ink pb-28">
        <div className="container-x grid gap-12 lg:grid-cols-[1fr_1.2fr]">
          <div className="space-y-3">
            {CHANNELS.map((c) => (
              <div
                key={c.k}
                className="rounded-md border border-line bg-ink-2 p-6"
              >
                <p className="kicker text-paper/60">{c.k}</p>
                <a
                  href={`mailto:${c.v}`}
                  className="link-underline mt-2 block font-display text-2xl text-paper"
                >
                  {c.v}
                </a>
                <p className="mt-1 text-xs text-paper/60">{c.note}</p>
              </div>
            ))}
            <p className="px-1 pt-2 text-xs text-paper/60">
              We reply to every message within one business day. Prefer a price
              first? The{" "}
              <a href="/sports" className="link-underline text-volt">
                configurator
              </a>{" "}
              is the quickest route.
            </p>
          </div>

          <div className="rounded-lg border border-line bg-ink-2 p-8">
            <ContactForm />
          </div>
        </div>
      </section>
    </>
  );
}
