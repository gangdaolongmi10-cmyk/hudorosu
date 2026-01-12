import { NextRequest, NextResponse } from 'next/server'
import { promises as fs } from 'fs'
import { LAYOUT_DIR, getLayoutFilePaths } from '@/config/paths'

// 共通レイアウトを取得
export async function GET() {
  try {
    // ディレクトリが存在しない場合は作成
    await fs.mkdir(LAYOUT_DIR, { recursive: true })

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

    return NextResponse.json({ header, footer, meta })
  } catch (error) {
    console.error('Error reading layout files:', error)
    return NextResponse.json(
      { error: '共通レイアウトの取得に失敗しました' },
      { status: 500 }
    )
  }
}

// 共通レイアウトを保存
export async function POST(request: NextRequest) {
  try {
    const { header, footer, meta } = await request.json()

    if (header === undefined || footer === undefined || meta === undefined) {
      return NextResponse.json(
        { error: 'header、footer、metaは必須です' },
        { status: 400 }
      )
    }

    // ディレクトリが存在しない場合は作成
    await fs.mkdir(LAYOUT_DIR, { recursive: true })

    const { header: HEADER_FILE, footer: FOOTER_FILE, meta: META_FILE } = getLayoutFilePaths()

    // ヘッダー、フッター、metaを保存
    await fs.writeFile(HEADER_FILE, header || '', 'utf-8')
    await fs.writeFile(FOOTER_FILE, footer || '', 'utf-8')
    await fs.writeFile(META_FILE, meta || '', 'utf-8')

    return NextResponse.json({ 
      success: true,
      message: '共通レイアウトを保存しました'
    })
  } catch (error) {
    console.error('Error saving layout files:', error)
    return NextResponse.json(
      { error: '共通レイアウトの保存に失敗しました' },
      { status: 500 }
    )
  }
}
