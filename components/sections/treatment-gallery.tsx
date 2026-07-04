"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { X, ZoomIn } from "lucide-react";
import type { TreatmentGalleryImage } from "@/lib/types";
import { mediaUrl } from "@/lib/media";
import { cn, loc } from "@/lib/utils";

export function TreatmentGallery({
  images,
  locale,
  title,
  variant = "standalone",
}: {
  images: TreatmentGalleryImage[];
  locale: string;
  title: string;
  /** inline = under a text section; standalone = full gallery block */
  variant?: "inline" | "standalone";
}) {
  const [lightbox, setLightbox] = useState<number | null>(null);

  if (!images.length) return null;

  const isInline = variant === "inline";

  return (
    <>
      <div
        className={cn(
          "grid gap-4",
          isInline ? "mt-8 sm:grid-cols-2" : "sm:grid-cols-2",
        )}
      >
        {images.map((img, i) => {
          const alt = loc(img.alt, locale) || title;
          const caption = img.caption ? loc(img.caption, locale) : "";
          return (
            <button
              key={`${img.src}-${i}`}
              type="button"
              onClick={() => setLightbox(i)}
              className={cn(
                "group relative overflow-hidden rounded-2xl bg-ink-100 ring-1 ring-primary-100/70",
                !isInline && i === 0 && images.length >= 3
                  ? "sm:col-span-2 sm:aspect-[21/9]"
                  : "aspect-[4/3]",
              )}
            >
              <Image
                src={mediaUrl(img.src)}
                alt={alt}
                fill
                sizes="(max-width: 640px) 100vw, 50vw"
                className="object-cover transition duration-500 group-hover:scale-105"
                unoptimized
              />
              <div className="absolute inset-0 bg-gradient-to-t from-plum-950/60 via-transparent to-transparent opacity-0 transition group-hover:opacity-100" />
              <span className="absolute bottom-3 end-3 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-ink-800 opacity-0 shadow-soft transition group-hover:opacity-100">
                <ZoomIn className="h-4 w-4" aria-hidden />
              </span>
              {caption ? (
                <p className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-plum-950/80 to-transparent px-4 pb-3 pt-8 text-start text-sm font-medium text-white">
                  {caption}
                </p>
              ) : null}
            </button>
          );
        })}
      </div>

      <AnimatePresence>
        {lightbox !== null ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-plum-950/90 p-4 backdrop-blur-md"
            onClick={() => setLightbox(null)}
          >
            <button
              type="button"
              onClick={() => setLightbox(null)}
              className="absolute end-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20"
              aria-label="Schließen"
            >
              <X className="h-5 w-5" />
            </button>
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              className="relative z-10 my-auto w-full max-w-4xl overflow-hidden rounded-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <Image
                src={mediaUrl(images[lightbox].src)}
                alt={loc(images[lightbox].alt, locale) || title}
                width={1200}
                height={800}
                className="h-auto max-h-[85vh] w-full object-contain"
                unoptimized
              />
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
}
