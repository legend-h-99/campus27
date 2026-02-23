import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

const nextConfig: NextConfig = {
  output: "standalone",
  turbopack: {
    root: process.cwd(),
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cranl.com",
      },
      {
        protocol: "https",
        hostname: "app.cranl.com",
      },
      {
        protocol: "http",
        hostname: "localhost",
      },
    ],
  },
};

export default withNextIntl(nextConfig);
