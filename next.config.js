const config = require("./config.ts");

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode : true,
  env: {
    DB_URI: config.DB_URI,
    JWT_SECRET: config.JWT_SECRET,
    NEXT_PUBLIC_IMAGES_PATH: '/Assets',
  },
  images: {
    domains: ['tailwindui.com'],
    path: '/.next/static/images',
  },
};

module.exports = nextConfig;
