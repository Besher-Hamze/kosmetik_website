"use client";

import { useState } from "react";
import axios from "axios";
import { AnimatePresence, motion } from "framer-motion";
import { useLocale, useTranslations } from "next-intl";
import { BadgeCheck, BadgeX, Search } from "lucide-react";
import { PUBLIC_API_URL, loc } from "@/lib/utils";
import type { CertificateVerification } from "@/lib/types";

export function CertificateChecker({ initialCode }: { initialCode?: string }) {
  const t = useTranslations("certificate");
  const locale = useLocale();
  const [code, setCode] = useState(initialCode ?? "");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<CertificateVerification | null>(null);

  const check = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = code.trim();
    if (!trimmed) return;
    setLoading(true);
    setResult(null);
    try {
      const { data } = await axios.get<CertificateVerification>(
        `${PUBLIC_API_URL}/api/v1/certificates/verify/${encodeURIComponent(trimmed)}`,
      );
      setResult(data);
    } catch {
      setResult({ valid: false });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <form onSubmit={check} className="flex flex-col gap-3 sm:flex-row">
        <label htmlFor="cert-code" className="sr-only">
          {t("codeLabel")}
        </label>
        <input
          id="cert-code"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder={t("codePlaceholder")}
          dir="ltr"
          className="h-14 flex-1 rounded-full border border-primary-100 bg-white px-6 text-center font-mono text-base tracking-widest text-ink-950 shadow-soft outline-none transition placeholder:font-sans placeholder:tracking-normal placeholder:text-ink-300 focus:border-primary-400 focus:ring-4 focus:ring-primary-100 sm:text-start"
        />
        <button
          type="submit"
          disabled={loading || !code.trim()}
          className="inline-flex h-14 items-center justify-center gap-2 rounded-full bg-gradient-to-r from-primary-600 to-plum-700 px-9 font-semibold text-white shadow-lift transition hover:shadow-glow active:scale-[0.98] disabled:opacity-60"
        >
          <Search className="h-5 w-5" aria-hidden />
          {loading ? t("checking") : t("check")}
        </button>
      </form>

      <AnimatePresence mode="wait">
        {result ? (
          <motion.div
            key={result.valid ? "valid" : "invalid"}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.4 }}
            className={`mt-8 rounded-3xl p-8 ring-1 ${
              result.valid
                ? "bg-green-50 ring-green-200"
                : "bg-red-50 ring-red-200"
            }`}
            role="status"
          >
            {result.valid ? (
              <div>
                <div className="flex items-center gap-3">
                  <BadgeCheck className="h-9 w-9 text-success" aria-hidden />
                  <h2 className="font-display text-2xl font-semibold text-ink-950">
                    {t("validTitle")}
                  </h2>
                </div>
                <dl className="mt-6 grid gap-4 sm:grid-cols-3">
                  <div className="rounded-2xl bg-white p-4 shadow-soft">
                    <dt className="text-xs font-semibold uppercase tracking-wider text-ink-400">
                      {t("student")}
                    </dt>
                    <dd className="mt-1 font-semibold text-ink-950">
                      {result.studentName}
                    </dd>
                  </div>
                  <div className="rounded-2xl bg-white p-4 shadow-soft">
                    <dt className="text-xs font-semibold uppercase tracking-wider text-ink-400">
                      {t("course")}
                    </dt>
                    <dd className="mt-1 font-semibold text-ink-950">
                      {loc(result.courseName, locale)}
                    </dd>
                  </div>
                  <div className="rounded-2xl bg-white p-4 shadow-soft">
                    <dt className="text-xs font-semibold uppercase tracking-wider text-ink-400">
                      {t("issueDate")}
                    </dt>
                    <dd className="mt-1 font-semibold text-ink-950" dir="ltr">
                      {result.issueDate
                        ? new Date(result.issueDate).toLocaleDateString(
                            locale === "ar" ? "ar-EG" : "de-DE",
                          )
                        : "—"}
                    </dd>
                  </div>
                </dl>
              </div>
            ) : (
              <div className="flex items-start gap-3">
                <BadgeX className="h-9 w-9 shrink-0 text-error" aria-hidden />
                <div>
                  <h2 className="font-display text-2xl font-semibold text-ink-950">
                    {t("invalidTitle")}
                  </h2>
                  <p className="mt-2 text-sm leading-relaxed text-ink-600">
                    {t("invalidText")}
                  </p>
                </div>
              </div>
            )}
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
