import { MetadataRoute } from 'next'
import { promises as fs } from 'fs'
import path from 'path'
import { BLOG_DIR } from '@/config/paths'

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://www.hudorosu.com'

/**
 * Next.jsの動的sitemap生成
 * このファイルがあると、/sitemap.xmlにアクセスした際に動的にsitemapが生成されます
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const now = new Date().toISOString()

    const routes: MetadataRoute.Sitemap = [
        {
            url: BASE_URL,
            lastModified: now,
            changeFrequency: 'weekly',
            priority: 1.0,
        },
        {
            url: `${BASE_URL}/blog/my_fave/puroseka`,
            lastModified: now,
            changeFrequency: 'monthly',
            priority: 0.8,
        },
    ]

    return routes
}
