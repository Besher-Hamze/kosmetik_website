import Image from "next/image";
import { getLocale, getTranslations } from "next-intl/server";
import { Mail, MapPin, Phone, BadgeCheck } from "lucide-react";

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden>
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  );
}

function FacebookIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
      <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c5.05-.5 9-4.76 9-9.95z" />
    </svg>
  );
}
import { Link } from "@/i18n/navigation";
import { loc } from "@/lib/utils";
import type { Navigation, Settings } from "@/lib/types";

function TikTokIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
    </svg>
  );
}

export async function Footer({
  settings,
  navigation,
}: {
  settings: Settings;
  navigation: Navigation;
}) {
  const t = await getTranslations("footer");
  const tn = await getTranslations("nav");
  const locale = await getLocale();

  const { contact, social } = settings;
  const whatsappDigits = contact.whatsapp.replace(/\D/g, "");

  const socials = [
    { name: "Instagram", href: social.instagram, icon: InstagramIcon },
    { name: "TikTok", href: social.tiktok, icon: TikTokIcon },
    { name: "Facebook", href: social.facebook, icon: FacebookIcon },
  ].filter((s) => s.href);

  return (
    <footer className="relative mt-24 overflow-hidden bg-gradient-to-b from-plum-950 to-primary-950 text-primary-100">
      {/* Decorative petal glow */}
      <div
        className="pointer-events-none absolute -top-32 start-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-primary-500/20 blur-[110px]"
        aria-hidden
      />

      <div className="mx-auto grid max-w-7xl gap-12 px-4 py-16 sm:grid-cols-2 sm:px-6 lg:grid-cols-4 lg:px-8">
        <div>
          <div className="flex items-center gap-3">
            <div className="rounded-2xl bg-white/95 p-2 shadow-soft">
              <Image
                src="/logo.png"
                alt="Karmen Kosmetik Logo"
                width={44}
                height={50}
                className="h-11 w-auto"
              />
            </div>
            <div className="leading-tight">
              <p className="font-display text-lg font-bold text-white">
                Karmen Kosmetik
              </p>
              <p className="text-[11px] font-medium uppercase tracking-[0.28em] text-gold-300">
                Akademie
              </p>
            </div>
          </div>
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-primary-200/90">
            {loc(settings.tagline, locale)}
          </p>
          {socials.length > 0 ? (
            <div className="mt-5 flex gap-3">
              {socials.map((s) => (
                <a
                  key={s.name}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.name}
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-primary-500 hover:shadow-glow"
                >
                  <s.icon className="h-4.5 w-4.5" />
                </a>
              ))}
            </div>
          ) : null}
        </div>

        <nav aria-label={t("quickMenu")}>
          <h3 className="mb-4 text-sm font-semibold uppercase tracking-widest text-gold-300">
            {t("quickMenu")}
          </h3>
          <ul className="space-y-2.5 text-sm">
            {navigation.quickMenu
              .filter((item) => !item.hidden && item.href)
              .map((item) => (
                <li key={item.key}>
                  <Link
                    href={item.href}
                    className="text-primary-100/85 transition hover:text-white"
                  >
                    {loc(item.label, locale)}
                  </Link>
                </li>
              ))}
            <li>
              <Link
                href="/termin"
                className="text-primary-100/85 transition hover:text-white"
              >
                {tn("booking")}
              </Link>
            </li>
            <li>
              <Link
                href="/zertifikat"
                className="inline-flex items-center gap-1.5 text-primary-100/85 transition hover:text-white"
              >
                <BadgeCheck className="h-3.5 w-3.5" aria-hidden />
                {tn("certificate")}
              </Link>
            </li>
          </ul>
        </nav>

        <nav aria-label={t("legal")}>
          <h3 className="mb-4 text-sm font-semibold uppercase tracking-widest text-gold-300">
            {t("legal")}
          </h3>
          <ul className="space-y-2.5 text-sm">
            {navigation.legalMenu.map((item) => (
              <li key={item.key}>
                <Link
                  href={item.href}
                  className="text-primary-100/85 transition hover:text-white"
                >
                  {loc(item.label, locale)}
                </Link>
              </li>
            ))}
            <li>
              <Link
                href="/impressum"
                className="text-primary-100/85 transition hover:text-white"
              >
                Impressum
              </Link>
            </li>
          </ul>
        </nav>

        <div>
          <h3 className="mb-4 text-sm font-semibold uppercase tracking-widest text-gold-300">
            {t("contact")}
          </h3>
          <ul className="space-y-3.5 text-sm">
            <li className="flex items-start gap-3">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-gold-300" aria-hidden />
              <address className="not-italic leading-relaxed text-primary-100/85">
                {contact.ownerName}
                <br />
                {contact.address.street}
                <br />
                {contact.address.zip} {contact.address.city},{" "}
                {loc(contact.address.country, locale)}
              </address>
            </li>
            <li>
              <a
                href={`https://wa.me/${whatsappDigits}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 text-primary-100/85 transition hover:text-white"
              >
                <Phone className="h-4 w-4 shrink-0 text-gold-300" aria-hidden />
                <span dir="ltr">{contact.phone}</span>
              </a>
            </li>
            <li>
              <a
                href={`mailto:${contact.email}`}
                className="flex items-center gap-3 text-primary-100/85 transition hover:text-white"
              >
                <Mail className="h-4 w-4 shrink-0 text-gold-300" aria-hidden />
                {contact.email}
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 px-4 py-6 text-center text-xs text-primary-200/70 sm:flex-row sm:px-6 lg:px-8">
          <p>
            © {new Date().getFullYear()} {loc(settings.siteName, locale)}.{" "}
            {t("rights")}
          </p>
          <p>{t("madeWith")}</p>
        </div>
      </div>
    </footer>
  );
}
