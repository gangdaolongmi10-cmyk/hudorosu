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

  // ルートページ
  const routes: MetadataRoute.Sitemap = [
    {
      url: BASE_URL,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 1.0,
    },
  ]

  // ブログ記事のURLを追加
  try {
    await fs.mkdir(BLOG_DIR, { recursive: true })
    const files = await fs.readdir(BLOG_DIR)
    const htmlFiles = files.filter(file => file.endsWith('.html') && !file.startsWith('_'))

    for (const file of htmlFiles) {
      const slug = file.replace('.html', '')
      const filePath = path.join(BLOG_DIR, file)
      const stats = await fs.stat(filePath)

      routes.push({
        url: `${BASE_URL}/blog/${slug}`,
        lastModified: stats.mtime.toISOString(),
        changeFrequency: 'weekly',
        priority: 0.8,
      })
    }
  } catch (error) {
    console.error('Error reading blog directory for sitemap:', error)
  }

  return routes
}
