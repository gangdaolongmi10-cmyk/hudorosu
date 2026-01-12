import { NextRequest, NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'

/**
 * ISR再検証API
 * 管理画面からブログ記事を更新した際に、該当ページを再生成する
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const path = searchParams.get('path')
    const secret = searchParams.get('secret')

    // シークレットトークンの検証
    if (secret !== process.env.REVALIDATE_SECRET) {
      return NextResponse.json(
        { error: 'Invalid secret' },
        { status: 401 }
      )
    }

    if (!path) {
      return NextResponse.json(
        { error: 'Path is required' },
        { status: 400 }
      )
    }

    // パスの再検証
    revalidatePath(path)

    return NextResponse.json({ 
      revalidated: true,
      path,
      now: Date.now()
    })
  } catch (error) {
    console.error('Revalidation error:', error)
    return NextResponse.json(
      { error: 'Error revalidating' },
      { status: 500 }
    )
  }
}

/**
 * POSTメソッドでも対応（管理画面からの呼び出し用）
 */
export async function POST(request: NextRequest) {
  try {
    const { path, secret } = await request.json()

    // シークレットトークンの検証
    if (secret !== process.env.REVALIDATE_SECRET) {
      return NextResponse.json(
        { error: 'Invalid secret' },
        { status: 401 }
      )
    }

    if (!path) {
      return NextResponse.json(
        { error: 'Path is required' },
        { status: 400 }
      )
    }

    // パスの再検証
    revalidatePath(path)

    return NextResponse.json({ 
      revalidated: true,
      path,
      now: Date.now()
    })
  } catch (error) {
    console.error('Revalidation error:', error)
    return NextResponse.json(
      { error: 'Error revalidating' },
      { status: 500 }
    )
  }
}
