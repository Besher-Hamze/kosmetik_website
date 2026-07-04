"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { motion } from "framer-motion";
import { useLocale, useTranslations } from "next-intl";
import { CheckCircle2, AlertCircle, Send } from "lucide-react";
import { PUBLIC_API_URL, cn } from "@/lib/utils";

const inputClass =
  "w-full rounded-2xl border border-primary-100 bg-white px-5 py-3.5 text-sm text-ink-950 shadow-soft outline-none transition placeholder:text-ink-300 focus:border-primary-400 focus:ring-4 focus:ring-primary-100";

export function ContactForm() {
  const t = useTranslations("contact");
  const locale = useLocale();
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");

  const schema = z.object({
    name: z.string().min(2, t("validation.nameRequired")),
    email: z.string().email(t("validation.emailInvalid")),
    phone: z.string().optional(),
    subject: z.string().optional(),
    message: z.string().min(10, t("validation.messageRequired")),
  });

  type FormValues = z.infer<typeof schema>;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  const onSubmit = async (values: FormValues) => {
    try {
      await axios.post(`${PUBLIC_API_URL}/api/v1/contact`, {
        ...values,
        locale,
      });
      setStatus("success");
      reset();
    } catch {
      setStatus("error");
    }
  };

  if (status === "success") {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex flex-col items-center gap-4 rounded-3xl bg-white p-12 text-center shadow-soft ring-1 ring-primary-100"
        role="status"
      >
        <CheckCircle2 className="h-14 w-14 text-success" aria-hidden />
        <p className="max-w-md leading-relaxed text-ink-700">{t("success")}</p>
      </motion.div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="contact-name" className="mb-2 block text-sm font-medium text-ink-800">
            {t("name")} *
          </label>
          <input
            id="contact-name"
            {...register("name")}
            className={cn(inputClass, errors.name && "border-error")}
            aria-invalid={!!errors.name}
          />
          {errors.name ? (
            <p className="mt-1.5 text-xs text-error">{errors.name.message}</p>
          ) : null}
        </div>
        <div>
          <label htmlFor="contact-email" className="mb-2 block text-sm font-medium text-ink-800">
            {t("email")} *
          </label>
          <input
            id="contact-email"
            type="email"
            dir="ltr"
            {...register("email")}
            className={cn(inputClass, errors.email && "border-error")}
            aria-invalid={!!errors.email}
          />
          {errors.email ? (
            <p className="mt-1.5 text-xs text-error">{errors.email.message}</p>
          ) : null}
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="contact-phone" className="mb-2 block text-sm font-medium text-ink-800">
            {t("phone")}
          </label>
          <input id="contact-phone" type="tel" dir="ltr" {...register("phone")} className={inputClass} />
        </div>
        <div>
          <label htmlFor="contact-subject" className="mb-2 block text-sm font-medium text-ink-800">
            {t("subject")}
          </label>
          <input id="contact-subject" {...register("subject")} className={inputClass} />
        </div>
      </div>

      <div>
        <label htmlFor="contact-message" className="mb-2 block text-sm font-medium text-ink-800">
          {t("message")} *
        </label>
        <textarea
          id="contact-message"
          rows={5}
          {...register("message")}
          className={cn(inputClass, "resize-none", errors.message && "border-error")}
          aria-invalid={!!errors.message}
        />
        {errors.message ? (
          <p className="mt-1.5 text-xs text-error">{errors.message.message}</p>
        ) : null}
      </div>

      {status === "error" ? (
        <p className="flex items-center gap-2 rounded-2xl bg-red-50 px-4 py-3 text-sm text-error" role="alert">
          <AlertCircle className="h-4 w-4 shrink-0" aria-hidden />
          {t("error")}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={isSubmitting}
        className="inline-flex h-13 w-full items-center justify-center gap-2.5 rounded-full bg-gradient-to-r from-primary-600 to-plum-700 px-8 font-semibold text-white shadow-lift transition hover:shadow-glow active:scale-[0.99] disabled:opacity-60 sm:w-auto"
      >
        <Send className="h-4.5 w-4.5" aria-hidden />
        {isSubmitting ? t("sending") : t("send")}
      </button>
    </form>
  );
}
