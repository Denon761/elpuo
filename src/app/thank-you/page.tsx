import type { Metadata } from "next";
import { ButtonLink } from "@/components/ui/Button";
import { getSport } from "@/lib/catalog";

export const metadata: Metadata = {
  title: "Thank you — request received",
  description: "Your custom kit request is with the Elpuo studio.",
  robots: { index: false, follow: false },
};

const CONTACT_EMAIL = process.env.NEXT_PUBLIC_CONTACT_EMAIL || "sales@example.com";

export default async function ThankYouPage({
  searchParams,
}: {
  searchParams: Promise<{ ref?: string; sport?: string }>;
}) {
  const { ref, sport: slug } = await searchParams;
  const sport = slug ? getSport(slug) : undefined;

  return (
    <section className="noise relative grid min-h-dvh place-items-center overflow-hidden bg-ink px-6 py-28 text-center">
      <div className="grid-lines pointer-events-none absolute inset-0 opacity-25" />
      <div className="relative max-w-xl">
        <p className="kicker text-volt">Request received</p>
        <h1 className="display-1 mt-3">Thank you</h1>

        <p className="mt-5 text-lg text-paper/65">
          Your {sport ? `${sport.name.toLowerCase()} ` : ""}kit request is with our
          studio
          {ref ? (
            <>
              {" "}
              under reference{" "}
              <strong className="text-paper">{ref}</strong>
            </>
          ) : null}
          . A specialist will review it and reply within one business day with a
          firm quote and a digital proof.
        </p>

        <p className="mt-4 text-sm text-paper/60">
          Nothing has been charged. Questions? Email{" "}
          <a href={`mailto:${CONTACT_EMAIL}`} className="text-volt link-underline">
            {CONTACT_EMAIL}
          </a>
          .
        </p>

        <div className="mt-9 flex justify-center gap-3">
          <ButtonLink href="/sports">Request another kit</ButtonLink>
          <ButtonLink href="/" variant="outline">
            Back home
          </ButtonLink>
        </div>
      </div>
    </section>
  );
}
