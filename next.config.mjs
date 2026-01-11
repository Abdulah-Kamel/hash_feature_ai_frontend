/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: "100mb",
    },
  },
  // Increase API routes body size limit for file uploads
  api: {
    bodyParser: {
      sizeLimit: "100mb",
    },
    responseLimit: "100mb",
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
