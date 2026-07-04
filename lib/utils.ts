import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import type { LocalizedString } from "./types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Resolve a localized field for the active locale with German fallback. */
export function loc(
  value: LocalizedString | string | undefined | null,
  locale: string,
): string {
  if (!value) return "";
  if (typeof value === "string") return value;
  return value[locale as keyof LocalizedString] || value.de || "";
}

export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export const PUBLIC_API_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";
