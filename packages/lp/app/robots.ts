import { MetadataRoute } from 'next'

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://www.hudorosu.com'

export default function robots(): MetadataRoute.Robots {
    // vercel.appドメインの場合は環境変数で判定
    // VERCEL_URLが存在し、vercel.appを含む場合はブロック
    const vercelUrl = process.env.VERCEL_URL
    const isVercelDomain = vercelUrl && vercelUrl.includes('vercel.app') && !vercelUrl.includes('www.hudorosu.com')

    if (isVercelDomain) {
        return {
            rules: {
                userAgent: '*',
                disallow: '/',
            },
        }
    }

    return {
        rules: {
            userAgent: '*',
            allow: '/',
            disallow: ['/admin/', '/api/'],
        },
        sitemap: `${BASE_URL}/sitemap.xml`,
    }
}
