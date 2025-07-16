/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["utkctcdndvlqlavdpkif.supabase.co"],
  },
  eslint: {
    // ✅ Skip ESLint errors during production builds
    ignoreDuringBuilds: true,
  },
};

module.exports = nextConfig;
