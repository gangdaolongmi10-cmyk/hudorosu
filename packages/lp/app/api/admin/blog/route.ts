import { NextRequest, NextResponse } from 'next/server'
import { promises as fs } from 'fs'
import path from 'path'
import { BLOG_DIR, getLayoutFilePaths } from '@/config/paths'
import { updateSitemapFile } from '@/utils/sitemap'

// ブログ記事一覧を取得
export async function GET() {
  try {
    // blogディレクトリが存在しない場合は作成
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

// 共通レイアウトを読み込む関数
async function loadLayout(): Promise<{ header: string; footer: string; meta: string }> {
  const { header: HEADER_FILE, footer: FOOTER_FILE, meta: META_FILE } = getLayoutFilePaths()

  let header = ''
  let footer = ''
  let meta = ''

  try {
    header = await fs.readFile(HEADER_FILE, 'utf-8')
  } catch {
    // ファイルが存在しない場合は空文字列
  }

  try {
    footer = await fs.readFile(FOOTER_FILE, 'utf-8')
  } catch {
    // ファイルが存在しない場合は空文字列
  }

  try {
    meta = await fs.readFile(META_FILE, 'utf-8')
  } catch {
    // ファイルが存在しない場合は空文字列
  }

  return { header, footer, meta }
}

// HTMLに共通レイアウトを組み込む関数
function wrapWithLayout(html: string, header: string, footer: string, meta: string): string {
  // HTMLが完全なドキュメントかどうかをチェック
  const isFullDocument = html.trim().startsWith('<!DOCTYPE') || html.trim().startsWith('<html')

  // index.cssが含まれているかチェックする関数
  const hasIndexCss = (text: string): boolean => {
    return text.includes('index.css') || text.includes('/index.css')
  }

  if (isFullDocument) {
    // 完全なHTMLドキュメントの場合
    // headタグの内容をmetaで置き換えまたは追加
    let result = html
    
    // headタグが存在する場合
    if (result.match(/<head[^>]*>/i)) {
      // index.cssが含まれていない場合は追加
      let finalMeta = meta
      if (!hasIndexCss(finalMeta) && !hasIndexCss(result)) {
        finalMeta = `${finalMeta}\n    <link rel="stylesheet" href="/index.css">`
      }
      // headタグの内容をmetaで置き換え
      result = result.replace(
        /<head[^>]*>[\s\S]*?<\/head>/i,
        `<head>\n${finalMeta}\n</head>`
      )
    } else {
      // headタグが存在しない場合は追加
      let finalMeta = meta
      if (!hasIndexCss(finalMeta) && !hasIndexCss(result)) {
        finalMeta = `${finalMeta}\n    <link rel="stylesheet" href="/index.css">`
      }
      result = result.replace(
        /(<html[^>]*>)/i,
        `$1\n<head>\n${finalMeta}\n</head>`
      )
    }
    
    // bodyタグの内容を抽出して組み込む
    const bodyMatch = result.match(/<body[^>]*>([\s\S]*?)<\/body>/i)
    if (bodyMatch) {
      const bodyContent = bodyMatch[1]
      // bodyタグ内にヘッダーとフッターを追加
      result = result.replace(
        /<body[^>]*>([\s\S]*?)<\/body>/i,
        `<body>${header}${bodyContent}${footer}</body>`
      )
    } else {
      // bodyタグが見つからない場合は、bodyタグの直前にヘッダー、直後にフッターを追加
      result = result.replace(
        /(<body[^>]*>)/i,
        `$1${header}`
      ).replace(
        /(<\/body>)/i,
        `${footer}$1`
      )
    }
    
    return result
  } else {
    // 部分的なHTMLの場合、完全なドキュメントとして組み立てる
    // index.cssが含まれていない場合は追加
    const hasIndexCss = (text: string): boolean => {
      return text.includes('index.css') || text.includes('/index.css')
    }
    
    let finalMeta = meta
    if (!hasIndexCss(finalMeta)) {
      finalMeta = `${finalMeta}\n    <link rel="stylesheet" href="/index.css">`
    }
    
    return `<!DOCTYPE html>
<html lang="ja">
<head>
${finalMeta}
</head>
<body>
    ${header}
    ${html}
    ${footer}
</body>
</html>`
  }
}

// ブログ記事を作成
export async function POST(request: NextRequest) {
  try {
    const { slug, html } = await request.json()

    if (!slug || !html) {
      return NextResponse.json(
        { error: 'slugとhtmlは必須です' },
        { status: 400 }
      )
    }

    // slugの検証（ファイル名として使用可能な文字のみ）
    const validSlug = slug.replace(/[^a-zA-Z0-9-_]/g, '-')
    if (!validSlug) {
      return NextResponse.json(
        { error: '有効なslugを入力してください' },
        { status: 400 }
      )
    }

    // blogディレクトリが存在しない場合は作成
    await fs.mkdir(BLOG_DIR, { recursive: true })

    // 共通レイアウトを読み込む
    const { header, footer, meta } = await loadLayout()

    // HTMLに共通レイアウトを組み込む
    const finalHtml = wrapWithLayout(html, header, footer, meta)

    const filePath = path.join(BLOG_DIR, `${validSlug}.html`)
    
    await fs.writeFile(filePath, finalHtml, 'utf-8')
    
    // ファイルが正しく作成されたか確認
    try {
      await fs.access(filePath)
    } catch (error) {
      console.error('Failed to verify file creation:', error)
      throw new Error('ファイルの作成を確認できませんでした')
    }

    // ISR: 再検証を実行
    try {
      await fetch(`${request.nextUrl.origin}/api/revalidate?path=/blog/${validSlug}&secret=${process.env.REVALIDATE_SECRET || ''}`, {
        method: 'GET',
      })
    } catch (error) {
      console.warn('Revalidation failed:', error)
    }

    // sitemap.xmlを更新
    try {
      await updateSitemapFile()
    } catch (error) {
      console.warn('Sitemap update failed:', error)
    }

    return NextResponse.json({ 
      success: true,
      slug: validSlug,
      message: 'ブログ記事を作成しました'
    })
  } catch (error) {
    console.error('Error creating blog article:', error)
    return NextResponse.json(
      { error: 'ブログ記事の作成に失敗しました' },
      { status: 500 }
    )
  }
}
