"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { SPORTS } from "@/lib/catalog";

const NAV = [
  { href: "/sports", label: "Sports" },
  { href: "/how-it-works", label: "How it works" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export function Header() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [sportsOpen, setSportsOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
    setSportsOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenuOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [menuOpen]);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-300 ${
        scrolled || menuOpen
          ? "bg-ink/85 backdrop-blur-xl border-b border-line"
          : "bg-transparent"
      }`}
    >
      <div className="container-x flex h-16 items-center justify-between gap-6 md:h-20">
        <Link href="/" aria-label="Elpuo home" className="inline-flex shrink-0 items-center">
          <Image
            src="/logo.png"
            alt="Elpuo"
            width={497}
            height={246}
            priority
            className="h-8 w-auto md:h-10"
          />
        </Link>

        <nav className="hidden items-center gap-8 lg:flex">
          <div
            className="relative"
            onMouseEnter={() => setSportsOpen(true)}
            onMouseLeave={() => setSportsOpen(false)}
            onFocus={() => setSportsOpen(true)}
            onBlur={(e) => {
              if (!e.currentTarget.contains(e.relatedTarget as Node | null))
                setSportsOpen(false);
            }}
            onKeyDown={(e) => {
              if (e.key === "Escape") setSportsOpen(false);
            }}
          >
            <Link
              href="/sports"
              aria-expanded={sportsOpen}
              aria-controls="sports-menu"
              className="kicker text-paper/75 transition-colors hover:text-paper"
            >
              Sports
            </Link>
            {sportsOpen && (
              <div
                id="sports-menu"
                className="absolute left-1/2 top-full w-[560px] -translate-x-1/2 pt-5"
              >
                <div className="grid grid-cols-2 gap-1 rounded-md border border-line bg-ink-2 p-3 shadow-2xl">
                  {SPORTS.map((s) => (
                    <Link
                      key={s.slug}
                      href={`/sports/${s.slug}`}
                      className="group flex items-center gap-3 rounded-sm px-3 py-2.5 transition-colors hover:bg-wash"
                    >
                      <span
                        className="h-6 w-6 shrink-0 rounded-[5px]"
                        style={{
                          background: `linear-gradient(135deg, ${s.hue}, ${s.colorway[1]})`,
                        }}
                      />
                      <span className="text-sm font-medium text-paper/85 group-hover:text-paper">
                        {s.name}
                      </span>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>

          {NAV.slice(1).map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="kicker text-paper/75 transition-colors hover:text-paper"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <Link
            href="/sports"
            className="hidden rounded-[8px] bg-lime px-4 py-2.5 text-[0.68rem] font-semibold uppercase tracking-[0.12em] text-volt-ink transition-opacity hover:opacity-90 sm:inline-flex"
          >
            Request a Quote
          </Link>

          <button
            type="button"
            className="flex h-11 w-11 items-center justify-center rounded-[8px] border border-line-strong lg:hidden"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            onClick={() => setMenuOpen((v) => !v)}
          >
            <span className="relative block h-3 w-5">
              <span
                className={`absolute left-0 block h-0.5 w-5 bg-paper transition-all ${
                  menuOpen ? "top-1.5 rotate-45" : "top-0"
                }`}
              />
              <span
                className={`absolute left-0 top-1.5 block h-0.5 w-5 bg-paper transition-all ${
                  menuOpen ? "opacity-0" : "opacity-100"
                }`}
              />
              <span
                className={`absolute left-0 block h-0.5 w-5 bg-paper transition-all ${
                  menuOpen ? "top-1.5 -rotate-45" : "top-3"
                }`}
              />
            </span>
          </button>
        </div>
      </div>

      {menuOpen && (
        <div
          id="mobile-menu"
          className="h-[calc(100dvh-4rem)] overflow-y-auto bg-ink px-6 pb-10 pt-4 lg:hidden"
        >
          <nav className="flex flex-col">
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="border-b border-line py-4 font-display text-3xl"
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <Link
            href="/sports"
            className="mt-6 flex w-full items-center justify-center rounded-[8px] bg-lime px-4 py-3.5 text-[0.72rem] font-semibold uppercase tracking-[0.12em] text-volt-ink transition-opacity hover:opacity-90"
          >
            Request a Quote
          </Link>
          <p className="kicker mt-8 text-paper/60">Jump to a sport</p>
          <div className="mt-3 grid grid-cols-2 gap-2">
            {SPORTS.map((s) => (
              <Link
                key={s.slug}
                href={`/sports/${s.slug}`}
                className="flex items-center gap-2 rounded-sm border border-line px-3 py-3 text-sm"
              >
                <span
                  className="h-4 w-4 rounded-[4px]"
                  style={{
                    background: `linear-gradient(135deg, ${s.hue}, ${s.colorway[1]})`,
                  }}
                />
                {s.name}
              </Link>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}
