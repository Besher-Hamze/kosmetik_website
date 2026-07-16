/** Backend origin that serves `/uploads/...` (prefer dedicated asset URL). */
const API_ORIGIN = (
  process.env.NEXT_PUBLIC_ASSET_URL ??
  process.env.NEXT_PUBLIC_API_URL ??
  process.env.API_URL ??
  "http://localhost:4000"
).replace(/\/$/, "");

/**
 * Resolve any API media path to the backend uploads folder.
 * DB paths → https://api…/uploads/media/...
 */
export function mediaUrl(src: string | undefined | null): string {
  if (!src) return "";

  if (/^https?:\/\//i.test(src)) return src;

  let path = src.startsWith("/") ? src : `/${src}`;

  // Legacy `/media/...` (e.g. old public folder paths) → backend uploads
  if (path.startsWith("/media/")) {
    path = `/uploads${path}`;
  } else if (!path.startsWith("/uploads/")) {
    path = `/uploads/media${path}`;
  }

  return `${API_ORIGIN}${path}`;
}

/** True when the src should be loaded from the backend (not Next.js /public). */
export function isBackendMedia(src: string | undefined | null): boolean {
  if (!src) return false;
  if (/^https?:\/\//i.test(src)) return src.startsWith(API_ORIGIN);
  return (
    src.startsWith("/uploads/") ||
    src.startsWith("/media/") ||
    !src.startsWith("/logo") // relative content paths
  );
}

export { API_ORIGIN };
