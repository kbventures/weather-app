/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "cdn.weatherapi.com",
      },
    ],
  },
};

module.exports = nextConfig
