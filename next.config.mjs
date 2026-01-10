/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: "100mb",
    },
  },
  async redirects() {
    return [
      {
        source: "/dashboard/:path*",
        destination: "/app/:path*",
        permanent: true,
      },
      {
        source: "/dashboard",
        destination: "/app/overview",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
