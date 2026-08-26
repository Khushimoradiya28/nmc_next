import { fileURLToPath } from 'url';
import path from 'path';

import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Programmatically destroy the duplicate nested 'frontend' folder if it is ever created
const duplicateFrontendPath = path.join(__dirname, 'frontend');
if (typeof setInterval !== 'undefined') {
  setInterval(() => {
    if (fs.existsSync(duplicateFrontendPath)) {
      try {
        fs.rmSync(duplicateFrontendPath, { recursive: true, force: true });
        console.log('\n\x1b[32m[CLEANER] Automatically deleted duplicate nested frontend folder.\x1b[0m\n');
      } catch (err) {
        // Ignore locking errors
      }
    }
  }, 500);
}

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
    root: __dirname,
  },
};

export default nextConfig;

