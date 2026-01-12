import { promises as fs } from 'fs'
import path from 'path'
import { BLOG_DIR } from '@/config/paths'

const SITEMAP_PATH = path.resolve(process.cwd(), 'sitemap.xml')
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://www.hudorosu.com'

/**
 * ブログ記事のスラッグ一覧を取得
 */
async function getBlogSlugs(): Promise<string[]> {
  try {
    await fs.mkdir(BLOG_DIR, { recursive: true })
    const files = await fs.readdir(BLOG_DIR)
    const htmlFiles = files.filter(file => file.endsWith('.html') && !file.startsWith('_'))
    return htmlFiles.map(file => file.replace('.html', ''))
  } catch {
    return []
  }
}

/**
 * sitemap.xmlを生成
 */
export async function generateSitemap(): Promise<string> {
  const blogSlugs = await getBlogSlugs()
  const now = new Date().toISOString().split('T')[0]

  const urls = [
    {
      loc: BASE_URL,
      lastmod: now,
      changefreq: 'weekly',
      priority: '1.0',
    },
    ...blogSlugs.map((slug) => ({
      loc: `${BASE_URL}/blog/${slug}`,
      lastmod: now,
      changefreq: 'weekly',
      priority: '0.8',
    })),
  ]

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map((url) => `    <url>
        <loc>${url.loc}</loc>
        <lastmod>${url.lastmod}</lastmod>
        <changefreq>${url.changefreq}</changefreq>
        <priority>${url.priority}</priority>
    </url>`).join('\n')}
</urlset>
`

  return xml
}

/**
 * sitemap.xmlファイルを更新
 * 開発環境ではファイルに書き込む
 */
export async function updateSitemapFile(): Promise<void> {
  try {
    const sitemapXml = await generateSitemap()
    await fs.writeFile(SITEMAP_PATH, sitemapXml, 'utf-8')
    console.log('Sitemap updated:', SITEMAP_PATH)
  } catch (error) {
    console.error('Error updating sitemap:', error)
    throw error
  }
}
