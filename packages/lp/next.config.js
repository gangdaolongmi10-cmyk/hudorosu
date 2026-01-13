/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async redirects() {
    return [
      {
        source: '/:path*',
        has: [
          {
            type: 'host',
            value: 'hudorosu-backend.vercel.app',
          },
        ],
        destination: 'https://www.hudorosu.com/:path*',
        permanent: true,
      },
    ]
  },
  async headers() {
    return [
      {
        // 静的アセット（CSS、JS、画像、フォント）のキャッシュ設定
        source: '/:path*\\.(css|js|jpg|jpeg|png|gif|svg|ico|woff|woff2|ttf|eot)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        // Next.jsの静的ファイル（_next/static）
        source: '/_next/static/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ]
  },
}

module.exports = nextConfig
