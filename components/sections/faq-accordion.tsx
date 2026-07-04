"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useLocale } from "next-intl";
import { Minus, Plus } from "lucide-react";
import { loc } from "@/lib/utils";
import type { Faq } from "@/lib/types";

export function FaqAccordion({ faqs }: { faqs: Faq[] }) {
  const locale = useLocale();
  const [open, setOpen] = useState<number | null>(0);

  return (
    <div className="space-y-3">
      {faqs.map((faq, i) => {
        const isOpen = open === i;
        return (
          <div
            key={i}
            className={`overflow-hidden rounded-2xl transition-all duration-400 ${
              isOpen
                ? "bg-white shadow-lift ring-1 ring-primary-200/80"
                : "bg-white/70 ring-1 ring-primary-100/60 hover:bg-white hover:shadow-soft"
            }`}
          >
            <button
              type="button"
              onClick={() => setOpen(isOpen ? null : i)}
              aria-expanded={isOpen}
              className="flex w-full items-center justify-between gap-4 px-6 py-5 text-start sm:px-7 sm:py-6"
            >
              <span className="font-display text-lg font-semibold text-ink-950 sm:text-xl">
                {loc(faq.question, locale)}
              </span>
              <motion.span
                animate={{ rotate: isOpen ? 180 : 0 }}
                transition={{ duration: 0.35 }}
                className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full transition-colors ${
                  isOpen
                    ? "bg-gradient-to-br from-primary-600 to-plum-700 text-white shadow-soft"
                    : "bg-primary-50 text-primary-600 ring-1 ring-primary-100"
                }`}
                aria-hidden
              >
                {isOpen ? (
                  <Minus className="h-4 w-4" />
                ) : (
                  <Plus className="h-4 w-4" />
                )}
              </motion.span>
            </button>
            <AnimatePresence initial={false}>
              {isOpen ? (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.4, ease: [0.21, 0.65, 0.32, 0.99] }}
                >
                  <p className="border-t border-primary-50 px-6 pb-6 pt-4 text-sm leading-relaxed text-ink-600 sm:px-7 sm:pb-7 sm:text-base">
                    {loc(faq.answer, locale)}
                  </p>
                </motion.div>
              ) : null}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}
