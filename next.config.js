/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: false,
  },
  eslint: {
    ignoreDuringBuilds: false,
  },
  env: {
    GROQ_API_KEY: process.env.GROQ_API_KEY,
  },
}

module.exports = nextConfig 