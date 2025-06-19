/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["utfs.io", "lh3.googleusercontent.com", "res.cloudinary.com"],
  },
  reactStrictMode: true,
  swcMinify: true,
  env: {
    NEXTAUTH_ADMIN_EMAIL: process.env.NEXTAUTH_ADMIN_EMAIL,
  },
};

module.exports = nextConfig;
