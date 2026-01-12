import { NextRequest, NextResponse } from 'next/server'
import { promises as fs } from 'fs'
import path from 'path'
import { BLOG_DIR } from '@/config/paths'

/**
 * 静的ファイル方式では、管理画面からのブログ記事作成・編集は行いません。
 * ブログ記事は直接`packages/lp/blog/`ディレクトリにHTMLファイルとして配置してください。
 * 
 * このAPIは、ブログ記事一覧の取得のみをサポートします（管理画面での確認用）。
 */
export async function GET() {
  try {
    await fs.mkdir(BLOG_DIR, { recursive: true })
    const files = await fs.readdir(BLOG_DIR)
    const htmlFiles = files.filter(file => file.endsWith('.html') && !file.startsWith('_'))

    const articles = await Promise.all(
      htmlFiles.map(async (file) => {
        const filePath = path.join(BLOG_DIR, file)
        const stats = await fs.stat(filePath)
        const slug = file.replace('.html', '')
        return {
          slug,
          filename: file,
          createdAt: stats.birthtime,
          updatedAt: stats.mtime,
        }
      })
    )

    // 更新日時でソート（新しい順）
    articles.sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime())

    return NextResponse.json({ articles })
  } catch (error) {
    console.error('Error reading blog directory:', error)
    return NextResponse.json(
      { error: 'ブログ記事の取得に失敗しました' },
      { status: 500 }
    )
  }
}

/**
 * ブログ記事の作成は、直接ファイルを配置してください。
 * このエンドポイントは無効化されています。
 */
export async function POST(request: NextRequest) {
  return NextResponse.json(
    { 
      error: '静的ファイル方式では、管理画面からのブログ記事作成はできません。直接`packages/lp/blog/`ディレクトリにHTMLファイルを配置してください。' 
    },
    { status: 405 } // Method Not Allowed
  )
}
