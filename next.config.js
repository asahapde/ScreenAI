/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: false,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  env: {
    GROQ_API_KEY: process.env.GROQ_API_KEY,
  },
}

module.exports = nextConfig 