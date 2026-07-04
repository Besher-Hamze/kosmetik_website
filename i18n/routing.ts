import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["de", "ar"],
  defaultLocale: "de",
  localePrefix: "always",
});

export type Locale = (typeof routing.locales)[number];
