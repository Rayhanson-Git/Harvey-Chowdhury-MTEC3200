// Source: Next.js create-next-app scaffold; retained project build configuration. https://nextjs.org/docs/app/api-reference/config/next-config-js
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Allow only the supervised local QA origin in the managed development runtime.
  allowedDevOrigins: ['terminal.local'],
  cacheComponents: true,
  partialPrefetching: true,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
