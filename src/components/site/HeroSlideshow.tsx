"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

interface HeroSlideshowProps {
  images: string[];
  alt: string;
  intervalMs?: number;
  className?: string;
  priority?: boolean;
}

/** Slides between images horizontally. With a single image it just
 *  renders it — no timer, no transform — so it's a drop-in for a plain
 *  <Image fill>. */
export function HeroSlideshow({
  images,
  alt,
  intervalMs = 4000,
  className = "",
  priority,
}: HeroSlideshowProps) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (images.length < 2) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % images.length);
    }, intervalMs);
    return () => clearInterval(id);
  }, [images.length, intervalMs]);

  return (
    <div className={`relative overflow-hidden ${className}`}>
      <div
        className="flex h-full w-full transition-transform duration-700 ease-in-out"
        style={{ transform: `translateX(-${index * 100}%)` }}
      >
        {images.map((src, i) => (
          <div key={src} className="relative h-full w-full shrink-0">
            <Image
              src={src}
              alt={alt}
              fill
              priority={priority && i === 0}
              sizes="100vw"
              className="object-contain object-center"
              aria-hidden={i === index ? undefined : true}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
