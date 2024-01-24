const config = require("./config.ts");

/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    DB_URI: config.DB_URI,
  },
};

module.exports = nextConfig;
