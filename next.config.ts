import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // Pin the workspace root: a package-lock.json in the parent directory would
  // otherwise make Turbopack infer the home directory as the root.
  turbopack: {
    root: __dirname,
  },
};

export default nextConfig;
