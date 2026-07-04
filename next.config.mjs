/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // sharp is a native module — keep it external to the server bundle.
  serverExternalPackages: ["sharp"],
  experimental: {
    // Cropped-image uploads to the media server action.
    serverActions: { bodySizeLimit: "8mb" },
  },
  images: {
    // Site images live in Supabase Storage. They are served through a custom
    // next/image `loader` (mediaLoader) that returns the pre-generated webp URL
    // directly, so the Vercel optimizer / this allowlist is bypassed for them.
    // Allowlisting the Storage host anyway is defensive: it keeps any future
    // <Image> that points at a Supabase URL without a loader working.
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
    ],
  },
};

export default nextConfig;
