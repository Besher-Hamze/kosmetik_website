const API_ORIGIN =
  process.env.NEXT_PUBLIC_API_URL ??
  process.env.API_URL ??
  "http://localhost:4000";

/** Prefix relative /uploads paths with the API origin; keep others as-is. */
export function mediaUrl(src: string | undefined | null): string {
  if (!src) return "";
  if (src.startsWith("/uploads/")) return `${API_ORIGIN}${src}`;
  return src;
}
