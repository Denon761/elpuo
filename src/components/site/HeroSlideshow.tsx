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

/** Cross-fades between images. With a single image it just renders it —
 *  no timer, no transition — so it's a drop-in for a plain <Image fill>. */
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
    <div className={`relative ${className}`}>
      {images.map((src, i) => (
        <Image
          key={src}
          src={src}
          alt={alt}
          fill
          priority={priority && i === 0}
          sizes="100vw"
          className="object-contain object-center transition-opacity duration-1000 ease-in-out"
          style={{ opacity: i === index ? 1 : 0 }}
          aria-hidden={i === index ? undefined : true}
        />
      ))}
    </div>
  );
}
