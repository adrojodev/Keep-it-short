/** @type {import('next').NextConfig} */
const nextConfig = {};

module.exports = {
  reactStrictMode: true,
  env: {
    WEATHER_API: process.env.WEATHER_API,
  },
  nextConfig,
};
