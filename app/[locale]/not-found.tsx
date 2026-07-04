import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";

export default async function NotFound() {
  const t = await getTranslations("common");

  return (
    <section className="flex min-h-dvh flex-col items-center justify-center px-4 text-center">
      <p className="font-display text-8xl font-bold text-gradient">404</p>
      <h1 className="mt-4 font-display text-3xl font-semibold text-ink-950">
        {t("notFoundTitle")}
      </h1>
      <p className="mt-3 max-w-md text-ink-500">{t("notFoundText")}</p>
      <Link
        href="/"
        className="mt-8 inline-flex h-12 items-center rounded-full bg-gradient-to-r from-primary-600 to-plum-700 px-8 font-semibold text-white shadow-lift transition hover:shadow-glow"
      >
        {t("backHome")}
      </Link>
    </section>
  );
}
