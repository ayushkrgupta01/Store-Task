// ✅ Correct for next.config.mjs
const nextConfig = {
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: "http://122.160.25.202/micron/app/api/api/:path*",
      },
    ]
  },
}

export default nextConfig
