import Image from "next/image";
import Link from "next/link";
import { JerseyPreview } from "@/components/jersey/JerseyPreview";
import { usd } from "@/lib/format";
import type { Sport } from "@/lib/types";

export function SportCard({ sport, index }: { sport: Sport; index: number }) {
  const num = String(index + 1).padStart(2, "0");
  const cover = sport.images?.[0];
  return (
    <Link
      href={`/sports/${sport.slug}`}
      className="group relative flex flex-col overflow-hidden rounded-lg border border-line bg-ink-2 transition-colors duration-300 hover:border-line-strong"
    >
      <div
        className={`relative aspect-[4/5] overflow-hidden ${cover ? "bg-[#f1f0ec]" : "on-dark"}`}
        style={
          cover
            ? undefined
            : {
                background: `radial-gradient(120% 90% at 70% 10%, ${sport.hue}33, transparent 60%), linear-gradient(160deg, ${sport.colorway[1]}, #0b0b0c 70%)`,
              }
        }
      >
        <span
          className={`absolute left-4 top-4 z-10 font-display text-sm ${
            cover ? "text-white/70 mix-blend-difference" : "text-paper/40"
          }`}
        >
          {num}
        </span>
        <span
          className={`kicker absolute right-4 top-4 z-10 ${
            cover ? "text-white/80 mix-blend-difference" : "text-paper/50"
          }`}
        >
          {sport.discipline.split(" / ")[0]}
        </span>

        {cover ? (
          <Image
            src={cover.src}
            alt={`Custom ${sport.name} uniform`}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1280px) 33vw, 320px"
            className="object-cover object-top transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-105"
          />
        ) : (
          <JerseyPreview
            silhouette={sport.silhouette}
            colors={{
              body: sport.colorway[0],
              secondary: sport.colorway[1],
              accent: sport.colorway[2],
            }}
            pattern={sport.patterns[0]?.id ?? "solid"}
            number="10"
            side="front"
            idSuffix={`card-${sport.slug}`}
            className="absolute left-1/2 top-1/2 w-[76%] -translate-x-1/2 -translate-y-1/2 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:-translate-y-[54%] group-hover:scale-105"
          />
        )}
      </div>

      <div className="flex items-end justify-between gap-3 p-5">
        <div className="min-w-0">
          <h3 className="font-display text-[0.95rem] uppercase leading-tight tracking-tight md:text-base">
            Custom {sport.name}
          </h3>
          <p className="mt-1 text-xs text-paper/55">{sport.tagline}</p>
        </div>
        <div className="shrink-0 text-right">
          <p className="kicker text-[0.6rem] text-paper/40">from</p>
          <p className="font-display text-xl text-volt">{usd(sport.unitBase)}</p>
        </div>
      </div>
    </Link>
  );
}
