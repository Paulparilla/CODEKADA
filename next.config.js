/** @type {import('next').NextConfig} */
const nextConfig = {
  // Supabase image domains (avatars, etc.)
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.supabase.co",
      },
    ],
  },
};

module.exports = nextConfig;
