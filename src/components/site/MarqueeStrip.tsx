interface MarqueeStripProps {
  items: string[];
  className?: string;
  duration?: number;
}

export function MarqueeStrip({ items, className = "", duration = 34 }: MarqueeStripProps) {
  const row = [...items, ...items];
  return (
    <div
      className={`marquee-paused relative flex overflow-hidden border-y border-line py-4 ${className}`}
      style={{ ["--marquee-duration" as string]: `${duration}s` }}
    >
      <div className="animate-marquee flex shrink-0 items-center gap-8 pr-8 whitespace-nowrap">
        {row.map((item, i) => (
          <span key={i} className="flex items-center gap-8">
            <span className="font-display text-xl uppercase tracking-wide text-paper/80 md:text-2xl">
              {item}
            </span>
            <span className="text-volt">✦</span>
          </span>
        ))}
      </div>
    </div>
  );
}
