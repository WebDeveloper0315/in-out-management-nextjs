const config = require("./config.ts");

/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    DB_URI: config.DB_URI,
    JWT_SECRET: config.JWT_SECRET,
  },
  images: {
    domains: ['tailwindui.com'],
  },
};

module.exports = nextConfig;
