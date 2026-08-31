"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const LINKS = [
  { href: "/policies/customization", label: "Artwork & customization" },
  { href: "/policies/sizing", label: "Sizing guide" },
  { href: "/policies/shipping", label: "Shipping & production" },
  { href: "/policies/returns", label: "Returns & remakes" },
  { href: "/policies/terms", label: "Terms of service" },
  { href: "/policies/privacy", label: "Privacy policy" },
];

export function PolicyNav() {
  const pathname = usePathname();
  return (
    <nav className="flex gap-2 overflow-x-auto lg:sticky lg:top-24 lg:h-fit lg:flex-col lg:overflow-visible">
      {LINKS.map((l) => {
        const active = pathname === l.href;
        return (
          <Link
            key={l.href}
            href={l.href}
            className={`shrink-0 rounded-[8px] border px-4 py-2.5 text-sm transition-colors lg:shrink ${
              active
                ? "border-volt bg-volt/10 text-volt"
                : "border-line text-paper/60 hover:border-line-strong hover:text-paper"
            }`}
          >
            {l.label}
          </Link>
        );
      })}
    </nav>
  );
}
