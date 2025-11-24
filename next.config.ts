import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,

  async rewrites() {
    return [
      {
        // 1. Source: The path requested by your client (frontend)
        // We use :path* to capture everything after /api/v1/
        source: '/api/v1/:path*',
        
        // 2. Destination: The actual URL of your backend service on Render
        // The :path* ensures the captured part of the path (e.g., 'login') 
        // is appended to your backend's URL.
        destination: `${process.env.NEXT_PUBLIC_SERVER_URI}/api/v1/:path*`,  
      },
    ];
  },
  // output: 'export',
  images: {
    domains: [
      'lh3.googleusercontent.com',
      'avatars.githubusercontent.com', 
      'res.cloudinary.com',
      'craftsnippets.com',
      'encrypted-tbn0.gstatic.com'
    ],
  },
};

export default nextConfig;
