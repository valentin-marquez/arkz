import withBundleAnalyzer from "@next/bundle-analyzer";

/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    nextScriptWorkers: true,
  },
  images: {
    minimumCacheTTL: 60 * 60 * 24 * 5,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "wpmsxwfbianvrxmdvnyg.supabase.co",
      },
      {
        protocol: "https",
        hostname: "cdn.discordapp.com",
      },
    ],
  },
  redirects: async () => {
    return [
      {
        source: "/help",
        destination: `https://${process.env.VERCEL_GIT_PROVIDER}.com/${process.env.VERCEL_GIT_REPO_OWNER}/${process.env.VERCEL_GIT_REPO_SLUG}`,
        permanent: true,
      },
    ];
  },
};

export default withBundleAnalyzer({
  enabled: process.env.ANALYZE === "true",
})(nextConfig);
