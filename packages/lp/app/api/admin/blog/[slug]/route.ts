import { NextRequest, NextResponse } from 'next/server'
import { promises as fs } from 'fs'
import path from 'path'
import { BLOG_DIR } from '@/config/paths'

/**
 * 静的ファイル方式では、管理画面からのブログ記事編集・削除は行いません。
 * ブログ記事は直接`packages/lp/blog/`ディレクトリのHTMLファイルを編集・削除してください。
 * 
 * このAPIは、ブログ記事の取得のみをサポートします（管理画面での確認用）。
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const { slug } = params
    const filePath = path.join(BLOG_DIR, `${slug}.html`)

    try {
      const html = await fs.readFile(filePath, 'utf-8')
      return NextResponse.json({ slug, html })
    } catch (error) {
      return NextResponse.json(
        { error: 'ブログ記事が見つかりません' },
        { status: 404 }
      )
    }
  } catch (error) {
    console.error('Error reading blog article:', error)
    return NextResponse.json(
      { error: 'ブログ記事の取得に失敗しました' },
      { status: 500 }
    )
  }
}

/**
 * ブログ記事の更新は、直接ファイルを編集してください。
 * このエンドポイントは無効化されています。
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  return NextResponse.json(
    { 
      error: '静的ファイル方式では、管理画面からのブログ記事更新はできません。直接`packages/lp/blog/`ディレクトリのHTMLファイルを編集してください。' 
    },
    { status: 405 } // Method Not Allowed
  )
}

/**
 * ブログ記事の削除は、直接ファイルを削除してください。
 * このエンドポイントは無効化されています。
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  return NextResponse.json(
    { 
      error: '静的ファイル方式では、管理画面からのブログ記事削除はできません。直接`packages/lp/blog/`ディレクトリのHTMLファイルを削除してください。' 
    },
    { status: 405 } // Method Not Allowed
  )
}
