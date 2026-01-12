'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/contexts/AuthContext'
import HTMLEditor from '@/components/HTMLEditor'
import Preview from '@/components/Preview'
import LayoutViewer from '@/components/LayoutViewer'

// デフォルトHTML（部分的なHTML - bodyの中身のみ）
// 保存時に共通レイアウト（ヘッダー、フッター、Meta）が自動的に組み込まれます
const DEFAULT_HTML = `<h1>ブログ記事タイトル</h1>
<p>ここにコンテンツを記述してください。</p>`

export default function NewBlogPage() {
  const { isAuthenticated, isLoading } = useAuth()
  const router = useRouter()
  const [slug, setSlug] = useState('')
  const [html, setHtml] = useState(DEFAULT_HTML)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [showLayout, setShowLayout] = useState(false)
  const [previewHtml, setPreviewHtml] = useState('')

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/admin/login')
    }
  }, [isAuthenticated, isLoading, router])

  // プレビュー用のHTMLを生成（共通レイアウトを組み込む）
  useEffect(() => {
    const generatePreview = async () => {
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

    if (isAuthenticated) {
      generatePreview()
    }
  }, [html, isAuthenticated])

  const handleSave = async () => {
    if (!slug.trim()) {
      setError('スラッグを入力してください')
      return
    }

    setSaving(true)
    setError('')

    try {
      const response = await fetch('/api/admin/blog', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ slug: slug.trim(), html }),
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

  if (isLoading) {
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
                新規ブログ記事作成
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  placeholder="スラッグ（例: my-first-post）"
                  className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <button
                  onClick={handleSave}
                  disabled={saving || !slug.trim()}
                  className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {saving ? '保存中...' : '登録'}
                </button>
              </div>
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
