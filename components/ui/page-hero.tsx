import { Reveal } from "@/components/motion/reveal";

export function PageHero({
  title,
  subtitle,
}: {
  title: string;
  subtitle?: string;
}) {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-plum-950 via-primary-950 to-plum-900 pb-24 pt-36 noise-overlay sm:pb-28 sm:pt-44">
      <div
        className="pointer-events-none absolute -top-24 end-0 h-80 w-80 rounded-full bg-primary-500/25 blur-[110px] motion-safe:animate-float"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -bottom-32 start-0 h-96 w-96 rounded-full bg-gold-400/10 blur-[100px] motion-safe:animate-float-slow"
        aria-hidden
      />
      {/* Decorative grid lines */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            "linear-gradient(rgb(255 255 255 / 0.5) 1px, transparent 1px), linear-gradient(90deg, rgb(255 255 255 / 0.5) 1px, transparent 1px)",
          backgroundSize: "64px 64px",
        }}
        aria-hidden
      />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal>
          <div className="mb-6 flex items-center gap-3">
            <span className="h-px w-12 bg-gradient-to-r from-gold-400 to-transparent" aria-hidden />
            <span className="text-[11px] font-bold uppercase tracking-[0.28em] text-gold-300">
              Karmen Kosmetik Akademie
            </span>
          </div>
          <h1 className="max-w-4xl font-display text-4xl font-semibold leading-[1.08] text-white sm:text-5xl lg:text-6xl">
            {title}
          </h1>
          {subtitle ? (
            <p className="mt-6 max-w-2xl text-base leading-relaxed text-primary-100/85 sm:text-lg">
              {subtitle}
            </p>
          ) : null}
        </Reveal>
      </div>
    </section>
  );
}
