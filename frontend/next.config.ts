import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Self-contained server bundle for the prod Docker image.
  output: "standalone",
  // create-next-app defaults, and on by default from the next major. No
  // effect on this single client-rendered page.
  cacheComponents: true,
  partialPrefetching: true,
  // Tailwind v4's Turbopack loader, so no postcss.config is needed.
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
