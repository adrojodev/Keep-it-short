/** @type {import('next').NextConfig} */
const nextConfig = {};

module.exports = {
  reactStrictMode: true,
  env: {
    WEATHER_API: process.env.WEATHER_API,
    OPENAI_API_KEY: process.env.OPENAI_API_KEY,
  },
};
