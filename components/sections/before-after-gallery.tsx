import Image from "next/image";
import type { BeforeAfterPair } from "@/lib/types";
import { mediaUrl } from "@/lib/media";
import { loc } from "@/lib/utils";

export function BeforeAfterGallery({
  pairs,
  locale,
  beforeLabel,
  afterLabel,
}: {
  pairs: BeforeAfterPair[];
  locale: string;
  beforeLabel: string;
  afterLabel: string;
}) {
  if (!pairs.length) return null;

  return (
    <div className="space-y-8">
      {pairs.map((pair, i) => (
        <figure key={i} className="overflow-hidden rounded-3xl bg-white shadow-soft ring-1 ring-primary-100/70">
          <div className="grid sm:grid-cols-2">
            <div className="relative aspect-[4/5] sm:aspect-[3/4]">
              <Image
                src={mediaUrl(pair.before)}
                alt={`${beforeLabel} ${i + 1}`}
                fill
                sizes="(max-width: 640px) 100vw, 50vw"
                className="object-cover"
                unoptimized
              />
              <span className="absolute start-3 top-3 rounded-full bg-plum-950/70 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-white backdrop-blur-sm">
                {beforeLabel}
              </span>
            </div>
            <div className="relative aspect-[4/5] sm:aspect-[3/4]">
              <Image
                src={mediaUrl(pair.after)}
                alt={`${afterLabel} ${i + 1}`}
                fill
                sizes="(max-width: 640px) 100vw, 50vw"
                className="object-cover"
                unoptimized
              />
              <span className="absolute start-3 top-3 rounded-full bg-brand-600/90 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-white backdrop-blur-sm">
                {afterLabel}
              </span>
            </div>
          </div>
          {pair.caption ? (
            <figcaption className="border-t border-primary-50 px-5 py-3 text-center text-sm text-ink-600">
              {loc(pair.caption, locale)}
            </figcaption>
          ) : null}
        </figure>
      ))}
    </div>
  );
}
