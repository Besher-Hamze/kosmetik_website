import { Reveal } from "@/components/motion/reveal";

export function PageHero({
  title,
  subtitle,
}: {
  title: string;
  subtitle?: string;
}) {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-plum-950 via-primary-950 to-plum-900 pb-20 pt-40">
      <div
        className="pointer-events-none absolute -top-20 end-10 h-72 w-72 rounded-full bg-primary-500/25 blur-[100px] motion-safe:animate-float"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -bottom-24 start-10 h-72 w-72 rounded-full bg-plum-400/20 blur-[100px] motion-safe:animate-float-slow"
        aria-hidden
      />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal>
          <h1 className="font-display text-4xl font-semibold text-white sm:text-5xl lg:text-6xl">
            {title}
          </h1>
          {subtitle ? (
            <p className="mt-5 max-w-2xl text-base leading-relaxed text-primary-100/85 sm:text-lg">
              {subtitle}
            </p>
          ) : null}
        </Reveal>
      </div>
    </section>
  );
}
