import { ORG } from "@/lib/site";
import { Reveal } from "./Reveal";

export interface PolicySection {
  h: string;
  /** Each string is a paragraph. Prefix with "- " for a bullet list item. */
  body: string[];
}

interface PolicyArticleProps {
  title: string;
  updated: string;
  intro: string;
  sections: PolicySection[];
}

export function PolicyArticle({ title, updated, intro, sections }: PolicyArticleProps) {
  return (
    <article className="min-w-0">
      <Reveal>
        <h1 className="display-2 text-4xl md:text-5xl">{title}</h1>
      </Reveal>
      <p className="mt-3 text-xs uppercase tracking-[0.16em] text-paper/60">
        Last updated {updated}
      </p>
      <p className="mt-6 max-w-2xl text-lg text-paper/70">{intro}</p>

      <div className="mt-12 space-y-10">
        {sections.map((s, i) => (
          <Reveal key={s.h} as="section" delay={(i % 4) * 40}>
            <h2 className="display-3 text-xl md:text-2xl">{s.h}</h2>
            <div className="mt-3 space-y-3">
              {renderBody(s.body)}
            </div>
          </Reveal>
        ))}
      </div>

      <p className="mt-14 border-t border-line pt-6 text-sm text-paper/60">
        Questions about this policy? Email{" "}
        <a href={`mailto:${ORG.email}`} className="link-underline text-paper/70">
          {ORG.email}
        </a>
        . This document is a plain-language summary of how we operate and is not
        legal advice — review it with your own counsel before relying on it
        commercially.
      </p>
    </article>
  );
}

function renderBody(body: string[]) {
  const out: React.ReactNode[] = [];
  let bullets: string[] = [];

  const flush = (key: string) => {
    if (!bullets.length) return;
    out.push(
      <ul key={key} className="ml-4 list-disc space-y-1.5 text-paper/65 marker:text-volt">
        {bullets.map((b, i) => (
          <li key={i}>{b}</li>
        ))}
      </ul>
    );
    bullets = [];
  };

  body.forEach((line, i) => {
    if (line.startsWith("- ")) {
      bullets.push(line.slice(2));
    } else {
      flush(`ul-${i}`);
      out.push(
        <p key={i} className="text-paper/70">
          {line}
        </p>
      );
    }
  });
  flush("ul-end");
  return out;
}
