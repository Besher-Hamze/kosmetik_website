import "server-only";
import { mediaUrl as resolveMediaUrl } from "./media";
import type {
  AboutContent,
  Course,
  CoursesIntro,
  Faq,
  GalleryAlbum,
  HomepageContent,
  LegalPage,
  Navigation,
  Settings,
  Testimonial,
  Treatment,
} from "./types";

const API_URL = process.env.API_URL ?? "http://localhost:4000";
/** Production ISR interval; dev always fetches fresh data from the API. */
const REVALIDATE_SECONDS = 60;
const IS_DEV = process.env.NODE_ENV === "development";

class ApiError extends Error {
  constructor(
    message: string,
    readonly status: number,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

/** Fetches JSON from the backend API. Throws when the request fails. */
async function fetchApi<T>(path: string): Promise<T> {
  const res = await fetch(
    `${API_URL}/api/v1${path}`,
    IS_DEV
      ? { cache: "no-store" }
      : { next: { revalidate: REVALIDATE_SECONDS } },
  );
  if (!res.ok) {
    throw new ApiError(`API ${path} → ${res.status}`, res.status);
  }
  const json = await res.json();
  if (json && typeof json === "object" && Array.isArray(json.data)) {
    return json.data as T;
  }
  return (json?.data ?? json) as T;
}

/** Like fetchApi but returns null on 404 instead of throwing. */
async function fetchApiOptional<T>(path: string): Promise<T | null> {
  try {
    return await fetchApi<T>(path);
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) return null;
    throw error;
  }
}

/** Prefix relative /uploads paths with the API origin; keep others as-is. */
export function mediaUrl(src: string | undefined | null): string {
  return resolveMediaUrl(src);
}

export const getSettings = () => fetchApi<Settings>("/settings");

export const getHomepage = () =>
  fetchApi<HomepageContent>("/content/homepage");

export const getCoursesIntro = () =>
  fetchApi<CoursesIntro>("/content/courses-intro");

export const getAbout = () => fetchApi<AboutContent>("/content/about");

export const getTreatments = () =>
  fetchApi<Treatment[]>("/treatments");

export function getTreatment(slug: string) {
  return fetchApiOptional<Treatment>(`/treatments/${slug}`);
}

export const getCourses = () => fetchApi<Course[]>("/courses");

export function getCourse(slug: string) {
  return fetchApiOptional<Course>(`/courses/${slug}`);
}

export const getFaqs = () => fetchApi<Faq[]>("/faqs");

export const getTestimonials = () =>
  fetchApi<Testimonial[]>("/testimonials");

export const getGallery = () => fetchApi<GalleryAlbum[]>("/gallery");

export const getNavigation = () => fetchApi<Navigation>("/navigation");

export function getLegalPage(slug: string) {
  return fetchApiOptional<LegalPage>(`/pages/${slug}`);
}
