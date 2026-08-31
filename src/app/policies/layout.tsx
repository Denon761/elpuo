import { PolicyNav } from "@/components/site/PolicyNav";

export default function PoliciesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <section className="noise relative overflow-hidden bg-ink pb-10 pt-28 md:pt-36">
        <div className="grid-lines pointer-events-none absolute inset-0 opacity-25" />
        <div className="container-x relative">
          <p className="kicker text-volt">Elpuo policies</p>
          <p className="mt-3 max-w-xl text-paper/55">
            How we handle artwork, sizing, production, delivery and your data.
            Written to be read, not just filed.
          </p>
        </div>
      </section>

      <section className="bg-ink pb-28 pt-6">
        <div className="container-x grid gap-10 lg:grid-cols-[240px_1fr]">
          <PolicyNav />
          {children}
        </div>
      </section>
    </>
  );
}
