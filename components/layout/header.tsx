"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X, CalendarCheck, Globe } from "lucide-react";
import { Link, usePathname } from "@/i18n/navigation";
import { cn } from "@/lib/utils";
import type { Settings } from "@/lib/types";

const NAV_ITEMS = [
  { key: "home", href: "/" },
  { key: "treatments", href: "/behandlungen" },
  { key: "courses", href: "/kurse" },
  { key: "about", href: "/ueber-uns" },
  { key: "gallery", href: "/galerie" },
  { key: "faq", href: "/faq" },
  { key: "contact", href: "/kontakt" },
] as const;

export function Header({ settings }: { settings: Settings }) {
  const t = useTranslations("nav");
  const locale = useLocale();
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const otherLocale = locale === "de" ? "ar" : "de";
  // Over the hero (not scrolled) the header sits on dark imagery → light text.
  const solid = scrolled || open;

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-500",
        solid
          ? "bg-white/90 shadow-soft border-b border-primary-100/50 backdrop-blur-2xl"
          : "bg-gradient-to-b from-plum-950/50 via-plum-950/20 to-transparent backdrop-blur-[2px]",
      )}
    >
      <div className="mx-auto flex h-18 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="flex shrink-0 items-center gap-2.5"
          aria-label="Karmen Kosmetik Akademie"
        >
          <Image
            src="/logo.png"
            alt="Karmen Kosmetik Logo"
            width={46}
            height={52}
            className="h-12 w-auto"
            priority
          />
          <span className="hidden flex-col leading-tight sm:flex">
            <span
              className={cn(
                "font-display text-lg font-bold tracking-wide transition-colors",
                solid ? "text-primary-800" : "text-white",
              )}
            >
              Karmen Kosmetik
            </span>
            <span
              className={cn(
                "text-[11px] font-medium uppercase tracking-[0.28em] transition-colors",
                solid ? "text-gold-600" : "text-gold-300",
              )}
            >
              Akademie
            </span>
          </span>
        </Link>

        <nav
          className="hidden items-center gap-1 lg:flex"
          aria-label="Hauptnavigation"
        >
          {NAV_ITEMS.map((item) => {
            const active =
              item.href === "/"
                ? pathname === "/"
                : pathname.startsWith(item.href);
            return (
              <Link
                key={item.key}
                href={item.href}
                className={cn(
                  "relative rounded-full px-3.5 py-2 text-sm font-semibold transition-colors",
                  solid
                    ? active
                      ? "text-primary-700"
                      : "text-ink-700 hover:text-primary-700"
                    : active
                      ? "text-primary-800"
                      : "text-white hover:text-gold-200",
                )}
              >
                {t(item.key)}
                {active ? (
                  <motion.span
                    layoutId="nav-pill"
                    className={cn(
                      "absolute inset-0 -z-10 rounded-full",
                      solid
                        ? "bg-primary-50 ring-1 ring-primary-100"
                        : "bg-white/95 shadow-soft",
                    )}
                    transition={{ type: "spring", bounce: 0.25, duration: 0.5 }}
                  />
                ) : null}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2">
          <Link
            href={pathname}
            locale={otherLocale}
            className={cn(
              "inline-flex h-10 items-center gap-1.5 rounded-full px-3 text-sm font-semibold transition",
              solid
                ? "text-ink-700 ring-1 ring-ink-300 hover:ring-primary-400 hover:text-primary-700"
                : "bg-white/15 text-white ring-1 ring-white/50 backdrop-blur-md hover:bg-white/25",
            )}
            aria-label={t("switchLocale")}
          >
            <Globe className="h-4 w-4" aria-hidden />
            <span>{t("switchLocale")}</span>
          </Link>

          <Link
            href="/termin"
            className="hidden h-10 items-center gap-2 rounded-full bg-gradient-to-r from-primary-600 to-plum-700 px-5 text-sm font-semibold text-white shadow-soft ring-1 ring-white/10 transition hover:shadow-glow sm:inline-flex"
          >
            <CalendarCheck className="h-4 w-4" aria-hidden />
            {t("booking")}
          </Link>

          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className={cn(
              "inline-flex h-10 w-10 items-center justify-center rounded-full transition lg:hidden",
              solid
                ? "text-ink-800 ring-1 ring-ink-300"
                : "bg-white/15 text-white ring-1 ring-white/50 backdrop-blur-md",
            )}
            aria-expanded={open}
            aria-label={open ? t("closeMenu") : t("menu")}
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open ? (
          <motion.button
            type="button"
            aria-hidden
            tabIndex={-1}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpen(false)}
            className="fixed inset-0 top-18 -z-10 cursor-default bg-plum-950/50 backdrop-blur-sm lg:hidden"
          />
        ) : null}
      </AnimatePresence>

      <AnimatePresence>
        {open ? (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden border-b border-primary-100 bg-white shadow-lift lg:hidden"
          >
            <nav
              className="flex max-h-[calc(100dvh-4.5rem)] flex-col gap-1 overflow-y-auto px-4 pb-6 pt-2"
              aria-label="Mobile Navigation"
            >
              {NAV_ITEMS.map((item, i) => (
                <motion.div
                  key={item.key}
                  initial={{ opacity: 0, x: locale === "ar" ? 16 : -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.04 * i }}
                >
                  <Link
                    href={item.href}
                    className="block rounded-xl px-4 py-3 text-base font-medium text-ink-800 transition hover:bg-primary-50 hover:text-primary-700"
                  >
                    {t(item.key)}
                  </Link>
                </motion.div>
              ))}
              <Link
                href="/termin"
                className="mt-3 inline-flex h-12 items-center justify-center gap-2 rounded-full bg-gradient-to-r from-primary-600 to-plum-700 px-6 font-semibold text-white shadow-lift"
              >
                <CalendarCheck className="h-4 w-4" aria-hidden />
                {t("booking")}
              </Link>
              <a
                href={`https://wa.me/${settings.contact.whatsapp.replace(/\D/g, "")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 inline-flex h-12 items-center justify-center gap-2 rounded-full bg-[#25D366] px-6 font-semibold text-white"
              >
                WhatsApp
              </a>
            </nav>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </header>
  );
}
