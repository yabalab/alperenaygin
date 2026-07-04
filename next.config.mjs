/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // sharp is a native module — keep it external to the server bundle.
  serverExternalPackages: ["sharp"],
  experimental: {
    // Cropped-image uploads to the media server action.
    serverActions: { bodySizeLimit: "8mb" },
  },
};

export default nextConfig;
