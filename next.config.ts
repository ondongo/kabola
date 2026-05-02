import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "firebasestorage.googleapis.com",
      },
      {
        protocol: "https",
        hostname: "images.pexels.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
        pathname: "/**",
      },
    ],
  },
  async redirects() {
    return [
      { source: "/auth/login", destination: "/?login=1", permanent: true },
      { source: "/profil", destination: "/profile", permanent: true },
      { source: "/explore", destination: "/subscriptions", permanent: true },
      {
        source: "/mes-abonnements",
        destination: "/subscriptions",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
