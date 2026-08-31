"use client";

import Image from "next/image";
import { useState } from "react";
import { JerseyPreview } from "@/components/jersey/JerseyPreview";
import type { ProductImage, Sport } from "@/lib/types";

interface View {
  key: string;
  label: string;
  side: "front" | "back";
  pattern: string;
  colors: { body: string; secondary: string; accent: string };
}

function renderedViews(sport: Sport): View[] {
  const [body, secondary, accent] = sport.colorway;
  const p0 = sport.patterns[0]?.id ?? "solid";
  const p1 = sport.patterns[1]?.id ?? p0;
  return [
    { key: "front", label: "Front", side: "front", pattern: p0, colors: { body, secondary, accent } },
    { key: "back", label: "Back", side: "back", pattern: p0, colors: { body, secondary, accent } },
    { key: "pattern", label: "Pattern", side: "front", pattern: p1, colors: { body, secondary, accent } },
    {
      key: "alt",
      label: "Alt colourway",
      side: "back",
      pattern: p0,
      colors: { body: secondary, secondary: body, accent },
    },
  ];
}

export function ProductGallery({ sport }: { sport: Sport }) {
  const photos: ProductImage[] = sport.images ?? [];
  const hasPhotos = photos.length > 0;
  const views = renderedViews(sport);
  const count = hasPhotos ? photos.length : views.length;

  const [active, setActive] = useState(0);
  const idx = Math.min(active, count - 1);

  /* ---------------------------------------------------- real photos */
  if (hasPhotos) {
    const current = photos[idx];
    return (
      <div className="lg:sticky lg:top-24 lg:h-fit">
        <div className="relative aspect-[4/5] overflow-hidden rounded-lg border border-line bg-[#f1f0ec]">
          <Image
            src={current.src}
            alt={`${current.label} custom ${sport.name} jersey — sublimated ${sport.name} team uniform by Elpuo`}
            fill
            sizes="(max-width: 1024px) 100vw, 620px"
            className="object-contain"
            priority
          />
          <span className="absolute left-4 top-4 rounded-full bg-black/65 px-3 py-1 text-[0.62rem] font-semibold uppercase tracking-[0.14em] text-white backdrop-blur-sm">
            {current.label}
          </span>
        </div>

        <div className="mt-3 grid grid-cols-4 gap-3">
          {photos.map((img, i) => {
            const on = i === idx;
            return (
              <button
                key={img.src}
                type="button"
                onClick={() => setActive(i)}
                aria-label={`${img.label} ${sport.name} jersey view`}
                aria-pressed={on}
                className={`relative aspect-square overflow-hidden rounded-md border bg-[#f1f0ec] transition-colors ${
                  on ? "border-volt ring-1 ring-volt" : "border-line hover:border-line-strong"
                }`}
              >
                <Image
                  src={img.src}
                  alt=""
                  fill
                  sizes="140px"
                  className="object-contain"
                />
                <span className="absolute inset-x-0 bottom-0 bg-black/55 py-0.5 text-center text-[0.55rem] font-medium uppercase tracking-wide text-white">
                  {img.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  /* ---------------------------------------------------- rendered fallback */
  const stageStyle = {
    background: `radial-gradient(120% 80% at 50% 0%, ${sport.hue}26, transparent 60%), linear-gradient(180deg, ${sport.colorway[1]}, #0b0b0c 78%)`,
  };
  return (
    <div className="lg:sticky lg:top-24 lg:h-fit">
      <div
        className="on-dark relative aspect-[4/5] overflow-hidden rounded-lg border border-line"
        style={stageStyle}
      >
        <span className="kicker absolute left-5 top-5 z-10 text-paper/60">Rendered preview</span>
        <JerseyPreview
          silhouette={sport.silhouette}
          colors={views[idx].colors}
          pattern={views[idx].pattern}
          side={views[idx].side}
          number="10"
          name={sport.name}
          idSuffix={`gal-${sport.slug}-${idx}`}
          className="absolute left-1/2 top-1/2 w-[82%] max-w-md -translate-x-1/2 -translate-y-1/2"
        />
      </div>

      <div className="mt-3 grid grid-cols-4 gap-3">
        {views.map((v, i) => {
          const on = i === idx;
          return (
            <button
              key={v.key}
              type="button"
              onClick={() => setActive(i)}
              aria-label={v.label}
              aria-pressed={on}
              className={`on-dark relative aspect-square overflow-hidden rounded-md border transition-colors ${
                on ? "border-volt" : "border-line hover:border-line-strong"
              }`}
              style={stageStyle}
            >
              <JerseyPreview
                silhouette={sport.silhouette}
                colors={v.colors}
                pattern={v.pattern}
                side={v.side}
                number="10"
                name={sport.name}
                idSuffix={`galthumb-${sport.slug}-${i}`}
                className="absolute left-1/2 top-1/2 w-[86%] -translate-x-1/2 -translate-y-1/2"
              />
            </button>
          );
        })}
      </div>

      <p className="mt-3 text-xs text-paper/60">
        These are rendered previews. Swap in real photos via{" "}
        <code className="text-paper/60">sport.images</code> in{" "}
        <code className="text-paper/60">src/lib/catalog.ts</code>.
      </p>
    </div>
  );
}
