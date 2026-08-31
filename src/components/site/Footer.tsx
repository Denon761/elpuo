import Image from "next/image";
import Link from "next/link";
import { SPORTS } from "@/lib/catalog";
import { ORG } from "@/lib/site";
import { NewsletterField } from "./NewsletterField";

const POLICIES = [
  { href: "/policies/customization", label: "Artwork & customization" },
  { href: "/policies/sizing", label: "Sizing guide" },
  { href: "/policies/shipping", label: "Shipping & production" },
  { href: "/policies/returns", label: "Returns & remakes" },
  { href: "/policies/terms", label: "Terms of service" },
  { href: "/policies/privacy", label: "Privacy policy" },
];

const COMPANY = [
  { href: "/how-it-works", label: "How it works" },
  { href: "/about", label: "About Elpuo" },
  { href: "/contact", label: "Contact" },
  { href: "/sports", label: "All sports" },
];

export function Footer() {
  return (
    <footer className="relative overflow-hidden border-t border-line bg-ink pt-16">
      <div className="container-x">
        <div className="grid gap-12 lg:grid-cols-[1.3fr_1fr_1fr_1fr]">
          <div>
            <span className="inline-flex items-center rounded-lg bg-[#f5f4ef] px-3 py-2">
              <Image
                src="/logo.png"
                alt="Elpuo"
                width={497}
                height={246}
                className="h-8 w-auto"
              />
            </span>
            <p className="mt-5 max-w-sm text-lg text-paper/70">
              Custom sublimated uniforms for clubs, schools and academies. Choose
              your fabric, upload your design, request your quote — we print and
              ship worldwide.
            </p>
            <NewsletterField />
          </div>

          <FooterCol title="Sports" links={SPORTS.map((s) => ({ href: `/sports/${s.slug}`, label: s.name }))} />
          <FooterCol title="Company" links={COMPANY} />
          <FooterCol title="Policies" links={POLICIES} />
        </div>

        <div className="mt-16 flex flex-col gap-4 border-t border-line py-8 text-sm text-paper/60 md:flex-row md:items-center md:justify-between">
          <p>
            © {new Date().getFullYear()} {ORG.legalName}. All rights reserved.
          </p>
          <p>
            Made for the ones who play. <span className="text-paper/25">·</span>{" "}
            Prices shown are indicative pending your quote.
          </p>
        </div>
      </div>

      {/* <div
        aria-hidden
        className="pointer-events-none select-none text-center font-display leading-[0.8] text-paper/[0.05]"
        style={{ fontSize: "clamp(4rem, 22vw, 20rem)" }}
      >
        Elpuo
      </div> */}
    </footer>
  );
}

function FooterCol({
  title,
  links,
}: {
  title: string;
  links: { href: string; label: string }[];
}) {
  return (
    <div>
      <p className="kicker text-paper/60">{title}</p>
      <ul className="mt-4 space-y-2.5">
        {links.map((l) => (
          <li key={l.href}>
            <Link
              href={l.href}
              className="link-underline text-[0.95rem] text-paper/70 hover:text-paper"
            >
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
