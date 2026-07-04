import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { getLegalPage } from "@/lib/api";
import { loc } from "@/lib/utils";
import { LegalPageContent } from "@/components/sections/legal-page";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const page = await getLegalPage("datenschutz");
  return { title: page ? loc(page.title, locale) : "Datenschutz" };
}

export default async function DatenschutzPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const page = await getLegalPage("datenschutz");
  if (!page) notFound();
  return <LegalPageContent page={page} locale={locale} />;
}
