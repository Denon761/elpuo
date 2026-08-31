import { ButtonLink } from "@/components/ui/Button";

export default function NotFound() {
  return (
    <section className="noise relative grid min-h-dvh place-items-center overflow-hidden bg-ink px-6 text-center">
      <div className="grid-lines pointer-events-none absolute inset-0 opacity-25" />
      <div className="relative">
        <p className="font-display leading-none text-volt" style={{ fontSize: "clamp(6rem, 22vw, 16rem)" }}>
          404
        </p>
        <h1 className="display-2 mt-2">Off the pitch</h1>
        <p className="mx-auto mt-4 max-w-md text-paper/60">
          That page isn&apos;t in the squad. Head back and pick a sport to start
          building your kit.
        </p>
        <div className="mt-8 flex justify-center gap-3">
          <ButtonLink href="/">Home</ButtonLink>
          <ButtonLink href="/sports" variant="outline">
            All sports
          </ButtonLink>
        </div>
      </div>
    </section>
  );
}
