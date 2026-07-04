import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./i18n/request.ts");

function backendImagePatterns(): NonNullable<
  NextConfig["images"]
>["remotePatterns"] {
  const raw =
    process.env.NEXT_PUBLIC_API_URL ??
    process.env.API_URL ??
    "http://localhost:4000";

  try {
    const url = new URL(raw);
    const protocol = url.protocol.replace(":", "") as "http" | "https";
    return [
      {
        protocol,
        hostname: url.hostname,
        ...(url.port ? { port: url.port } : {}),
        pathname: "/uploads/**",
      },
    ];
  } catch {
    return [
      { protocol: "http", hostname: "localhost", port: "4000", pathname: "/uploads/**" },
      { protocol: "http", hostname: "127.0.0.1", port: "4000", pathname: "/uploads/**" },
    ];
  }
}

const nextConfig: NextConfig = {
  images: {
    remotePatterns: backendImagePatterns(),
    dangerouslyAllowLocalIP: true,
    formats: ["image/avif", "image/webp"],
  },
};

export default withNextIntl(nextConfig);
