import { ChevronLeft, ChevronRight } from "lucide-react";
import { Link } from "@/i18n/navigation";
import type { Treatment } from "@/lib/types";
import { loc } from "@/lib/utils";

export function TreatmentPager({
  treatments,
  currentSlug,
  locale,
  prevLabel,
  nextLabel,
}: {
  treatments: Treatment[];
  currentSlug: string;
  locale: string;
  prevLabel: string;
  nextLabel: string;
}) {
  const sorted = [...treatments].sort((a, b) => a.order - b.order);
  const idx = sorted.findIndex((t) => t.slug === currentSlug);
  if (idx < 0) return null;

  const prev = idx > 0 ? sorted[idx - 1] : null;
  const next = idx < sorted.length - 1 ? sorted[idx + 1] : null;
  if (!prev && !next) return null;

  return (
    <div className="mt-16 grid gap-4 border-t border-primary-100 pt-10 sm:grid-cols-2">
      {prev ? (
        <Link
          href={`/behandlungen/${prev.slug}`}
          className="group flex items-center gap-3 rounded-2xl bg-white p-5 shadow-soft ring-1 ring-primary-100/70 transition hover:ring-primary-200"
        >
          <ChevronLeft className="h-5 w-5 shrink-0 text-primary-400 transition group-hover:-translate-x-0.5 group-hover:text-primary-600" />
          <div className="min-w-0 text-start">
            <p className="text-xs font-semibold uppercase tracking-wide text-ink-400">
              {prevLabel}
            </p>
            <p className="mt-0.5 truncate font-display text-lg font-semibold text-ink-950 transition group-hover:text-primary-700">
              {loc(prev.name, locale)}
            </p>
          </div>
        </Link>
      ) : (
        <div />
      )}
      {next ? (
        <Link
          href={`/behandlungen/${next.slug}`}
          className="group flex items-center justify-end gap-3 rounded-2xl bg-white p-5 shadow-soft ring-1 ring-primary-100/70 transition hover:ring-primary-200 sm:col-start-2"
        >
          <div className="min-w-0 text-end">
            <p className="text-xs font-semibold uppercase tracking-wide text-ink-400">
              {nextLabel}
            </p>
            <p className="mt-0.5 truncate font-display text-lg font-semibold text-ink-950 transition group-hover:text-primary-700">
              {loc(next.name, locale)}
            </p>
          </div>
          <ChevronRight className="h-5 w-5 shrink-0 text-primary-400 transition group-hover:translate-x-0.5 group-hover:text-primary-600" />
        </Link>
      ) : null}
    </div>
  );
}
