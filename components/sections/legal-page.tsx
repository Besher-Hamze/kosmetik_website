import { loc } from "@/lib/utils";
import { PageHero } from "@/components/ui/page-hero";
import { Reveal } from "@/components/motion/reveal";
import type { LegalPage } from "@/lib/types";

export function LegalPageContent({
  page,
  locale,
}: {
  page: LegalPage;
  locale: string;
}) {
  return (
    <>
      <PageHero title={loc(page.title, locale)} />
      <section className="mx-auto max-w-3xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="space-y-10">
          {page.sections.map((section, i) => (
            <Reveal key={i} y={16}>
              <h2 className="font-display text-xl font-semibold text-ink-950 sm:text-2xl">
                {loc(section.heading, locale)}
              </h2>
              <div className="mt-3 space-y-3 text-sm leading-relaxed text-ink-600 sm:text-base">
                {loc(section.body, locale)
                  .split("\n")
                  .filter(Boolean)
                  .map((line, j) => (
                    <p key={j}>{line}</p>
                  ))}
              </div>
            </Reveal>
          ))}
        </div>
      </section>
    </>
  );
}
