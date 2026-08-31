import type { Metadata } from "next";
import { Reveal } from "@/components/site/Reveal";
import { SportCard } from "@/components/site/SportCard";
import { SPORTS } from "@/lib/catalog";

export const metadata: Metadata = {
  title: "All Custom Sports Uniforms",
  description:
    "Browse custom uniform builders for handball, netball, field hockey, volleyball, rugby, cricket, baseball, basketball, soccer (football) and American football.",
  alternates: { canonical: "/sports" },
};

export default function SportsIndexPage() {
  return (
    <>
      <section className="noise relative overflow-hidden bg-ink px-0 pb-14 pt-32 md:pt-40">
        <div className="grid-lines pointer-events-none absolute inset-0 opacity-30" />
        <div className="container-x relative">
          <Reveal>
            <p className="kicker text-volt">The catalogue</p>
          </Reveal>
          <Reveal delay={60}>
            <h1 className="display-1 mt-4">Custom uniforms</h1>
          </Reveal>
          <Reveal delay={120}>
            <p className="mt-6 max-w-xl text-lg text-paper/65">
              Ten sports, one build flow. Choose a discipline to open its
              configurator — silhouette, fabric and decoration rules are already
              tuned for the game.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="bg-ink pb-24">
        <div className="container-x grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {SPORTS.map((sport, i) => (
            <Reveal key={sport.slug} delay={(i % 4) * 50}>
              <SportCard sport={sport} index={i} />
            </Reveal>
          ))}
        </div>
      </section>
    </>
  );
}
