import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import {
  Cormorant_Garamond,
  IBM_Plex_Sans_Arabic,
  Inter,
} from "next/font/google";
import { routing } from "@/i18n/routing";
import { getNavigation, getSettings } from "@/lib/api";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { WhatsAppButton } from "@/components/layout/whatsapp-button";
import { SITE_URL } from "@/lib/utils";
import "../globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-cormorant",
  display: "swap",
});

const plexArabic = IBM_Plex_Sans_Arabic({
  subsets: ["arabic"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-plex-arabic",
  display: "swap",
});

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta.home" });

  return {
    metadataBase: new URL(SITE_URL),
    title: {
      default: t("title"),
      template: "%s | Karmen Kosmetik Akademie",
    },
    description: t("description"),
    alternates: {
      canonical: `/${locale}`,
      languages: { de: "/de", ar: "/ar" },
    },
    openGraph: {
      type: "website",
      locale: locale === "ar" ? "ar_DE" : "de_DE",
      siteName: "Karmen Kosmetik Akademie",
      title: t("title"),
      description: t("description"),
      images: [{ url: "/logo.png", width: 512, height: 512 }],
    },
    twitter: {
      card: "summary_large_image",
      title: t("title"),
      description: t("description"),
    },
    icons: { icon: "/favicon.ico" },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);

  const [settings, navigation] = await Promise.all([
    getSettings(),
    getNavigation(),
  ]);

  const dir = locale === "ar" ? "rtl" : "ltr";

  return (
    <html
      lang={locale}
      dir={dir}
      data-scroll-behavior="smooth"
      className={`${inter.variable} ${cormorant.variable} ${plexArabic.variable}`}
    >
      <body className="min-h-dvh flex flex-col antialiased">
        <NextIntlClientProvider>
          <Header settings={settings} />
          <main className="flex-1">{children}</main>
          <Footer settings={settings} navigation={navigation} />
          <WhatsAppButton phone={settings.contact.whatsapp} />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
