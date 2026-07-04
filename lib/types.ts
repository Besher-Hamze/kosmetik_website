export type LocalizedString = { de: string; ar: string };

export interface TreatmentGalleryImage {
  src: string;
  alt?: LocalizedString;
  caption?: LocalizedString;
}

export interface PageSection {
  heading: LocalizedString;
  body: LocalizedString;
  /** Optional images shown directly below this section (alternating text → images flow). */
  images?: TreatmentGalleryImage[];
}

export interface BeforeAfterPair {
  before: string;
  after: string;
  caption?: LocalizedString;
}

export interface Treatment {
  slug: string;
  order: number;
  name: LocalizedString;
  excerpt: LocalizedString;
  description: LocalizedString;
  benefits: LocalizedString[];
  sections?: PageSection[];
  gallery?: TreatmentGalleryImage[];
  beforeAfter?: BeforeAfterPair[];
  image?: string;
  isPublished?: boolean;
}

export interface Course {
  slug: string;
  order: number;
  name: LocalizedString;
  subtitle?: LocalizedString;
  duration: LocalizedString;
  schedule: LocalizedString;
  priceFrom: number | null;
  excerpt: LocalizedString;
  description: LocalizedString;
  curriculum: LocalizedString[];
  certificate: LocalizedString;
  audience: LocalizedString;
  image?: string;
  isPublished?: boolean;
}

export interface Faq {
  order: number;
  question: LocalizedString;
  answer: LocalizedString;
}

export interface Testimonial {
  name: string;
  text: LocalizedString | string;
  rating: number;
  source?: string;
}

export interface GalleryImage {
  src: string;
  alt: LocalizedString;
}

export interface GalleryAlbum {
  slug: string;
  title: LocalizedString;
  images: GalleryImage[];
}

export interface LegalPage {
  slug: string;
  title: LocalizedString;
  sections: PageSection[];
}

export interface OpeningHour {
  day: string;
  open: string;
  close: string;
  closed: boolean;
}

export interface Settings {
  siteName: LocalizedString;
  tagline: LocalizedString;
  contact: {
    ownerName: string;
    address: {
      street: string;
      zip: string;
      city: string;
      country: LocalizedString;
    };
    email: string;
    phone: string;
    whatsapp: string;
  };
  social: Record<string, string>;
  openingHours: OpeningHour[];
  foundedYear: number;
}

export interface HomepageContent {
  heroIntro: LocalizedString;
  heroPoints: LocalizedString[];
}

export interface CoursesIntro {
  description: LocalizedString;
  completeCourse: LocalizedString;
  singleCourses: LocalizedString;
  courseList: LocalizedString[];
  whyUs: LocalizedString[];
}

export interface AboutContent {
  title: LocalizedString;
  body: LocalizedString;
  image?: string;
}

export interface NavigationItem {
  key: string;
  label: LocalizedString;
  href: string;
  hidden?: boolean;
}

export interface Navigation {
  quickMenu: NavigationItem[];
  legalMenu: NavigationItem[];
}

export interface CertificateVerification {
  valid: boolean;
  studentName?: string;
  courseName?: LocalizedString | string;
  issueDate?: string;
}
