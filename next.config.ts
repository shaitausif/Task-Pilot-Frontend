import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  images: {
    domains: [
      'lh3.googleusercontent.com', // ✅ Google profile pictures
      'avatars.githubusercontent.com', // ✅ GitHub profile pictures
      'res.cloudinary.com',
      'craftsnippets.com',
      'encrypted-tbn0.gstatic.com'
    ],
  },
};

export default nextConfig;
