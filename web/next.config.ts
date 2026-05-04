import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: [
    "typeorm",
    "better-sqlite3",
    "reflect-metadata",
  ],
};

export default nextConfig;
