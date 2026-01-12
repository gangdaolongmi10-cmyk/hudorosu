'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/contexts/AuthContext'
import HTMLEditor from '@/components/HTMLEditor'
import Preview from '@/components/Preview'
import LayoutViewer from '@/components/LayoutViewer'

export default function EditBlogPage() {
  const { isAuthenticated, isLoading } = useAuth()
  const router = useRouter()
  const params = useParams()
  const slug = params?.slug as string

  const [html, setHtml] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [showLayout, setShowLayout] = useState(false)
  const [previewHtml, setPreviewHtml] = useState('')

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/admin/login')
    }
  }, [isAuthenticated, isLoading, router])

  useEffect(() => {
    if (isAuthenticated && slug) {
      fetchArticle()
    }
  }, [isAuthenticated, slug])

  const fetchArticle = async () => {
    try {
      const response = await fetch(`/api/admin/blog/${slug}`)
      const data = await response.json()

      if (response.ok && data.html) {
        // 保存されているHTMLからbodyの中身だけを抽出
        // 完全なHTMLドキュメントの場合はbodyの中身を抽出
        const bodyMatch = data.html.match(/<body[^>]*>([\s\S]*?)<\/body>/i)
        if (bodyMatch) {
          // ヘッダーとフッターを除去
          let bodyContent = bodyMatch[1]
          // ヘッダーとフッターのパターンを除去（簡易的な処理）
          bodyContent = bodyContent.replace(/<header[^>]*>[\s\S]*?<\/header>/gi, '')
          bodyContent = bodyContent.replace(/<footer[^>]*>[\s\S]*?<\/footer>/gi, '')
          bodyContent = bodyContent.replace(/<main[^>]*>|<\/main>/gi, '')
          bodyContent = bodyContent.trim()
          setHtml(bodyContent || data.html)
        } else {
          setHtml(data.html)
        }
      } else {
        setError('ブログ記事の取得に失敗しました')
      }
    } catch (error) {
      console.error('Error fetching article:', error)
      setError('ブログ記事の取得に失敗しました')
    } finally {
      setLoading(false)
    }
  }

  // プレビュー用のHTMLを生成（共通レイアウトを組み込む）
  useEffect(() => {
    const generatePreview = async () => {
      if (!html) return
      
      try {
        const response = await fetch('/api/admin/layout')
        const data = await response.json()
        
        const header = data.header || `<header>
    <a href="#" class="logo">ふどろす</a>
</header>`
        const footer = data.footer || `<footer>
    <p>&copy; 2026 ふどろす Project<br>食材管理と予算で決まるレシピ提案アプリ</p>
</footer>`
        const meta = data.meta || `    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>ブログ記事</title>
    <link rel="stylesheet" href="/index.css">`

        // 共通レイアウトを組み込んだ完全なHTMLを生成
        const fullHtml = `<!DOCTYPE html>
<html lang="ja">
<head>
${meta}
</head>
<body>
    ${header}
    <main>
        ${html}
    </main>
    ${footer}
</body>
</html>`
        
        setPreviewHtml(fullHtml)
      } catch (error) {
        console.error('Error loading layout for preview:', error)
        // エラー時は共通レイアウトなしで表示
        setPreviewHtml(`<!DOCTYPE html>
<html lang="ja">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>ブログ記事</title>
    <link rel="stylesheet" href="/index.css">
</head>
<body>
    <main>
        ${html}
    </main>
</body>
</html>`)
      }
    }

    if (isAuthenticated && html) {
      generatePreview()
    }
  }, [html, isAuthenticated])

  const handleSave = async () => {
    setSaving(true)
    setError('')

    try {
      const response = await fetch(`/api/admin/blog/${slug}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ html }),
      })

      const data = await response.json()

      if (response.ok && data.success) {
        router.push('/admin/blog')
      } else {
        setError(data.error || '保存に失敗しました')
      }
    } catch (error) {
      console.error('Error saving blog article:', error)
      setError('保存に失敗しました')
    } finally {
      setSaving(false)
    }
  }

  if (isLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">読み込み中...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col relative">
      <nav className="bg-white shadow">
        <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center space-x-4">
              <Link href="/admin/blog" className="text-gray-600 hover:text-gray-900">
                ← 一覧に戻る
              </Link>
              <h1 className="text-xl font-semibold text-gray-900">
                ブログ記事編集: {slug}
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={handleSave}
                disabled={saving}
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {saving ? '保存中...' : '更新'}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {error && (
        <div className="bg-red-50 border-l-4 border-red-400 p-4">
          <div className="flex">
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      )}

      <div className="flex-1 flex overflow-hidden">
        <div className={`${showLayout ? 'w-1/3' : 'w-1/2'} border-r border-gray-300 transition-all duration-300`}>
          <HTMLEditor value={html} onChange={setHtml} />
        </div>
        {showLayout && (
          <div className="w-1/3 border-r border-gray-300">
            <LayoutViewer onClose={() => setShowLayout(false)} />
          </div>
        )}
        <div className={`${showLayout ? 'w-1/3' : 'w-1/2'} transition-all duration-300`}>
          <Preview html={previewHtml || html} />
        </div>
      </div>
      
      {/* 共通レイアウト表示ボタン */}
      <div className="absolute bottom-4 left-4">
        <button
          onClick={() => setShowLayout(!showLayout)}
          className="px-4 py-2 bg-indigo-600 text-white rounded-md shadow-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm font-medium"
          title={showLayout ? '共通レイアウトを非表示' : '共通レイアウトを表示'}
        >
          {showLayout ? 'レイアウト非表示' : 'レイアウト表示'}
        </button>
      </div>
    </div>
  )
}
