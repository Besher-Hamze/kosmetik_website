"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { motion } from "framer-motion";
import { useLocale, useTranslations } from "next-intl";
import { AlertCircle, CalendarCheck, CheckCircle2, GraduationCap, Sparkles } from "lucide-react";
import { PUBLIC_API_URL, cn, loc } from "@/lib/utils";
import type { Course, Treatment } from "@/lib/types";

const inputClass =
  "w-full rounded-2xl border border-primary-100 bg-white px-5 py-3.5 text-sm text-ink-950 shadow-soft outline-none transition placeholder:text-ink-300 focus:border-primary-400 focus:ring-4 focus:ring-primary-100";

export function BookingForm({
  treatments,
  courses,
}: {
  treatments: Treatment[];
  courses: Course[];
}) {
  const t = useTranslations("booking");
  const locale = useLocale();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");

  const initialType =
    searchParams.get("type") === "course" ? "course" : "treatment";
  const initialService = searchParams.get("service") ?? "";

  const today = new Date().toISOString().split("T")[0];

  const schema = z.object({
    type: z.enum(["treatment", "course"]),
    serviceSlug: z.string().min(1, t("validation.serviceRequired")),
    name: z.string().min(2, t("validation.nameRequired")),
    phone: z.string().min(6, t("validation.phoneRequired")),
    email: z.string().email().optional().or(z.literal("")),
    preferredDate: z
      .string()
      .min(1, t("validation.dateRequired"))
      .refine((d) => d >= today, t("validation.dateInPast")),
    preferredTime: z.string().optional(),
    message: z.string().optional(),
  });

  type FormValues = z.infer<typeof schema>;

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      type: initialType,
      serviceSlug: initialService,
    },
  });

  const type = watch("type");
  const options = type === "course" ? courses : treatments;

  const onSubmit = async (values: FormValues) => {
    const source = values.type === "course" ? courses : treatments;
    const service = source.find((s) => s.slug === values.serviceSlug);
    try {
      await axios.post(`${PUBLIC_API_URL}/api/v1/appointments`, {
        name: values.name,
        phone: values.phone,
        email: values.email || undefined,
        type: values.type,
        serviceSlug: values.serviceSlug,
        serviceName: service ? loc(service.name, locale) : values.serviceSlug,
        preferredDate: values.preferredDate,
        preferredTime: values.preferredTime || undefined,
        message: values.message || undefined,
        locale,
      });
      setStatus("success");
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
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-6">
      {/* Type switch */}
      <fieldset>
        <legend className="mb-3 block text-sm font-medium text-ink-800">
          {t("typeLabel")}
        </legend>
        <div className="grid grid-cols-2 gap-3">
          {(
            [
              { value: "treatment", label: t("typeTreatment"), icon: Sparkles },
              { value: "course", label: t("typeCourse"), icon: GraduationCap },
            ] as const
          ).map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => {
                setValue("type", option.value);
                setValue("serviceSlug", "");
              }}
              aria-pressed={type === option.value}
              className={cn(
                "flex items-center justify-center gap-2.5 rounded-2xl border px-5 py-4 text-sm font-semibold transition-all",
                type === option.value
                  ? "border-primary-500 bg-primary-50 text-primary-700 shadow-soft"
                  : "border-primary-100 bg-white text-ink-500 hover:border-primary-300",
              )}
            >
              <option.icon className="h-5 w-5" aria-hidden />
              {option.label}
            </button>
          ))}
        </div>
      </fieldset>

      <div>
        <label htmlFor="booking-service" className="mb-2 block text-sm font-medium text-ink-800">
          {t("serviceLabel")} *
        </label>
        <select
          id="booking-service"
          {...register("serviceSlug")}
          className={cn(inputClass, "appearance-none", errors.serviceSlug && "border-error")}
          aria-invalid={!!errors.serviceSlug}
        >
          <option value="">{t("servicePlaceholder")}</option>
          {options.map((option) => (
            <option key={option.slug} value={option.slug}>
              {loc(option.name, locale)}
            </option>
          ))}
        </select>
        {errors.serviceSlug ? (
          <p className="mt-1.5 text-xs text-error">{errors.serviceSlug.message}</p>
        ) : null}
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="booking-name" className="mb-2 block text-sm font-medium text-ink-800">
            {t("name")} *
          </label>
          <input
            id="booking-name"
            {...register("name")}
            className={cn(inputClass, errors.name && "border-error")}
            aria-invalid={!!errors.name}
          />
          {errors.name ? (
            <p className="mt-1.5 text-xs text-error">{errors.name.message}</p>
          ) : null}
        </div>
        <div>
          <label htmlFor="booking-phone" className="mb-2 block text-sm font-medium text-ink-800">
            {t("phone")} *
          </label>
          <input
            id="booking-phone"
            type="tel"
            dir="ltr"
            {...register("phone")}
            className={cn(inputClass, errors.phone && "border-error")}
            aria-invalid={!!errors.phone}
          />
          {errors.phone ? (
            <p className="mt-1.5 text-xs text-error">{errors.phone.message}</p>
          ) : null}
        </div>
      </div>

      <div>
        <label htmlFor="booking-email" className="mb-2 block text-sm font-medium text-ink-800">
          {t("email")}
        </label>
        <input id="booking-email" type="email" dir="ltr" {...register("email")} className={inputClass} />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="booking-date" className="mb-2 block text-sm font-medium text-ink-800">
            {t("date")} *
          </label>
          <input
            id="booking-date"
            type="date"
            min={today}
            {...register("preferredDate")}
            className={cn(inputClass, errors.preferredDate && "border-error")}
            aria-invalid={!!errors.preferredDate}
          />
          {errors.preferredDate ? (
            <p className="mt-1.5 text-xs text-error">
              {errors.preferredDate.message}
            </p>
          ) : null}
        </div>
        <div>
          <label htmlFor="booking-time" className="mb-2 block text-sm font-medium text-ink-800">
            {t("time")}
          </label>
          <input id="booking-time" type="time" {...register("preferredTime")} className={inputClass} />
        </div>
      </div>

      <div>
        <label htmlFor="booking-notes" className="mb-2 block text-sm font-medium text-ink-800">
          {t("notes")}
        </label>
        <textarea
          id="booking-notes"
          rows={4}
          {...register("message")}
          className={cn(inputClass, "resize-none")}
        />
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
        className="inline-flex h-13 w-full items-center justify-center gap-2.5 rounded-full bg-gradient-to-r from-primary-600 to-plum-700 px-8 font-semibold text-white shadow-lift transition hover:shadow-glow active:scale-[0.99] disabled:opacity-60"
      >
        <CalendarCheck className="h-5 w-5" aria-hidden />
        {isSubmitting ? t("sending") : t("submit")}
      </button>
    </form>
  );
}
