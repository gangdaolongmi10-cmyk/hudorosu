import { NextRequest, NextResponse } from 'next/server'
import { promises as fs } from 'fs'
import path from 'path'
import { BLOG_DIR, getLayoutFilePaths } from '@/config/paths'
import { updateSitemapFile } from '@/utils/sitemap'

// ブログ記事を取得
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

// ブログ記事を更新
export async function PUT(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const { slug } = params
    const { html } = await request.json()

    if (!html) {
      return NextResponse.json(
        { error: 'htmlは必須です' },
        { status: 400 }
      )
    }

    const filePath = path.join(BLOG_DIR, `${slug}.html`)
    
    // ファイルが存在するか確認
    try {
      await fs.access(filePath)
    } catch {
      return NextResponse.json(
        { error: 'ブログ記事が見つかりません' },
        { status: 404 }
      )
    }

    // 共通レイアウトを読み込む
    const { header, footer, meta } = await loadLayout()

    // HTMLに共通レイアウトを組み込む
    const finalHtml = wrapWithLayout(html, header, footer, meta)

    await fs.writeFile(filePath, finalHtml, 'utf-8')
    
    // ファイルが正しく更新されたか確認
    try {
      await fs.access(filePath)
    } catch (error) {
      console.error('Failed to verify file update:', error)
      throw new Error('ファイルの更新を確認できませんでした')
    }

    // ISR: 再検証を実行
    try {
      await fetch(`${request.nextUrl.origin}/api/revalidate?path=/blog/${slug}&secret=${process.env.REVALIDATE_SECRET || ''}`, {
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
      message: 'ブログ記事を更新しました'
    })
  } catch (error) {
    console.error('Error updating blog article:', error)
    return NextResponse.json(
      { error: 'ブログ記事の更新に失敗しました' },
      { status: 500 }
    )
  }
}

// ブログ記事を削除
export async function DELETE(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const { slug } = params
    const filePath = path.join(BLOG_DIR, `${slug}.html`)

    try {
      await fs.unlink(filePath)
      
      // ISR: 再検証を実行（削除されたページも再検証）
      try {
        await fetch(`${request.nextUrl.origin}/api/revalidate?path=/blog/${slug}&secret=${process.env.REVALIDATE_SECRET || ''}`, {
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
        message: 'ブログ記事を削除しました'
      })
    } catch (error) {
      return NextResponse.json(
        { error: 'ブログ記事が見つかりません' },
        { status: 404 }
      )
    }
  } catch (error) {
    console.error('Error deleting blog article:', error)
    return NextResponse.json(
      { error: 'ブログ記事の削除に失敗しました' },
      { status: 500 }
    )
  }
}
