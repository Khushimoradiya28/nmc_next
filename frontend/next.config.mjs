import path from 'path';

/** @type {import('next').NextConfig} */
const nextConfig = {
  /* config options here */
  reactCompiler: true,
  allowedDevOrigins: [
    "*.trycloudflare.com",
  ],
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'nandkunvarbamahilacollege.com',
      },
    ],
  },
  turbopack: {
    root: path.resolve(process.cwd(), '..'),
  },
};

export default nextConfig;
