import { promises as fs } from 'fs'
import path from 'path'
import { BLOG_DIR } from '@/config/paths'
import { notFound } from 'next/navigation'

interface BlogPageProps {
  params: {
    slug: string
  }
}

export const revalidate = 60 // ISR: 60秒ごとに再検証

export async function generateStaticParams() {
  try {
    await fs.mkdir(BLOG_DIR, { recursive: true })
    const files = await fs.readdir(BLOG_DIR)
    const htmlFiles = files.filter(file => file.endsWith('.html') && !file.startsWith('_'))
    
    return htmlFiles.map((file) => ({
      slug: file.replace('.html', ''),
    }))
  } catch {
    return []
  }
}

export default async function BlogPage({ params }: BlogPageProps) {
  const { slug } = params
  const filePath = path.join(BLOG_DIR, `${slug}.html`)

  try {
    const html = await fs.readFile(filePath, 'utf-8')
    
    // HTMLをそのまま表示（dangerouslySetInnerHTMLを使用）
    return (
      <div dangerouslySetInnerHTML={{ __html: html }} />
    )
  } catch {
    notFound()
  }
}
