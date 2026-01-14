import { MetadataRoute } from 'next'
import recipesData from '../data/recipes.json'

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
            url: `${BASE_URL}/blog`,
            lastModified: now,
            changeFrequency: 'daily',
            priority: 0.9,
        },
        {
            url: `${BASE_URL}/blog/my_fave/puroseka`,
            lastModified: now,
            changeFrequency: 'monthly',
            priority: 0.8,
        },
        {
            url: `${BASE_URL}/tech`,
            lastModified: now,
            changeFrequency: 'monthly',
            priority: 0.7,
        },
    ]

    // レシピ記事（/blog/recipe/[slug]）
    for (const recipe of recipesData.recipes) {
        routes.push({
            url: `${BASE_URL}/blog/recipe/${recipe.slug}`,
            lastModified: now,
            changeFrequency: 'weekly',
            priority: 0.6,
        })
    }

    return routes
}
