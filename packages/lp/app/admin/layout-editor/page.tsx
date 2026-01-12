'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/contexts/AuthContext'
import HTMLEditor from '@/components/HTMLEditor'
import Preview from '@/components/Preview'

const DEFAULT_HEADER = `<header>
    <a href="#" class="logo">ふどろす</a>
</header>`

const DEFAULT_FOOTER = `<footer>
    <p>&copy; 2026 ふどろす Project<br>食材管理と予算で決まるレシピ提案アプリ</p>
</footer>`

const DEFAULT_META = `    <!-- Meta -->
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
    <title>ふどろす | 冷蔵庫の在庫管理と予算で決まる無料レシピ提案アプリ（開発中）</title>
    <meta name="description" content="食材管理アプリ「ふどろす」は、冷蔵庫の在庫と1日の予算から最適な献立を自動提案。食費の節約やフードロス削減をサポートする、学生・主婦に優しい無料ツールです。現在開発中です。">
    <meta name="keywords" content="食材管理アプリ,冷蔵庫管理,レシピ提案,節約,献立,フードロス,無料アプリ,ふどろす">
    <meta property="og:title" content="ふどろす | 在庫と予算で決まるレシピ提案・食材管理アプリ（開発中）">
    <meta property="og:description" content="「今日、何作ろう？」を解決。冷蔵庫の中身を活かして、賢く節約。現在開発中です。">
    <meta property="og:site_name" content="ふどろす">
    <meta property="og:type" content="website">

    <!-- Google Analytics -->
    <script async src="https://www.googletagmanager.com/gtag/js?id=G-SWFPCL0J4Y"></script>
    <script>
        window.dataLayer = window.dataLayer || [];
        function gtag() { dataLayer.push(arguments); }
        gtag('js', new Date());
        gtag('config', 'G-SWFPCL0J4Y');
    </script>

    <!-- CSS -->
    <link rel="stylesheet" href="/index.css">
    <link rel="icon" href="/favicon.png">`

export default function LayoutEditorPage() {
  const { isAuthenticated, isLoading } = useAuth()
  const router = useRouter()
  const [header, setHeader] = useState(DEFAULT_HEADER)
  const [footer, setFooter] = useState(DEFAULT_FOOTER)
  const [meta, setMeta] = useState(DEFAULT_META)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [activeTab, setActiveTab] = useState<'header' | 'footer' | 'meta' | 'preview'>('header')

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/admin/login')
    }
  }, [isAuthenticated, isLoading, router])

  useEffect(() => {
    if (isAuthenticated) {
      fetchLayout()
    }
  }, [isAuthenticated])

  const fetchLayout = async () => {
    try {
      const response = await fetch('/api/admin/layout')
      const data = await response.json()

      if (response.ok) {
        setHeader(data.header || DEFAULT_HEADER)
        setFooter(data.footer || DEFAULT_FOOTER)
        setMeta(data.meta || DEFAULT_META)
      }
    } catch (error) {
      console.error('Error fetching layout:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    setSaving(true)
    setError('')
    setSuccess('')

    try {
      const response = await fetch('/api/admin/layout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ header, footer, meta }),
      })

      const data = await response.json()

      if (response.ok && data.success) {
        setSuccess('共通レイアウトを保存しました')
        setTimeout(() => setSuccess(''), 3000)
      } else {
        setError(data.error || '保存に失敗しました')
      }
    } catch (error) {
      console.error('Error saving layout:', error)
      setError('保存に失敗しました')
    } finally {
      setSaving(false)
    }
  }

  const getPreviewHTML = () => {
    return `<!DOCTYPE html>
<html lang="ja">
<head>
${meta}
    <style>
        :root {
            --main-green: #66bb6a;
            --deep-green: #2e7d32;
            --soft-green: #e8f5e9;
            --text-main: #2c3e50;
            --white: #ffffff;
        }
        html, body {
            overflow-x: hidden;
            width: 100%;
            margin: 0;
            padding: 0;
            box-sizing: border-box;
            scroll-behavior: smooth;
        }
        *, *::before, *::after {
            box-sizing: inherit;
        }
        body {
            font-family: "Helvetica Neue", Arial, "Hiragino Kaku Gothic ProN", "Hiragino Sans", Meiryo, sans-serif;
            color: var(--text-main);
            background-color: #fcfdfc;
            line-height: 1.7;
        }
        header {
            padding: 15px 5%;
            background: rgba(255, 255, 255, 0.95);
            backdrop-filter: blur(10px);
            position: sticky;
            top: 0;
            z-index: 1000;
            border-bottom: 1px solid var(--soft-green);
        }
        .logo {
            font-size: 1.4rem;
            font-weight: 800;
            color: var(--main-green);
            text-decoration: none;
        }
        footer {
            background: var(--soft-green);
            padding: 30px 5%;
            text-align: center;
            color: var(--text-main);
            margin-top: 60px;
        }
        footer p {
            margin: 0;
            line-height: 1.8;
        }
        main {
            min-height: 60vh;
            padding: 2rem;
        }
    </style>
</head>
<body>
    ${header}
    <main>
        <h1>コンテンツエリア</h1>
        <p>ここにブログ記事のコンテンツが表示されます。</p>
    </main>
    ${footer}
</body>
</html>`
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
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <nav className="bg-white shadow">
        <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center space-x-4">
              <Link href="/admin/dashboard" className="text-gray-600 hover:text-gray-900">
                ← ダッシュボード
              </Link>
              <h1 className="text-xl font-semibold text-gray-900">
                共通レイアウト編集
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={handleSave}
                disabled={saving}
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {saving ? '保存中...' : '保存'}
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

      {success && (
        <div className="bg-green-50 border-l-4 border-green-400 p-4">
          <div className="flex">
            <div className="ml-3">
              <p className="text-sm text-green-700">{success}</p>
            </div>
          </div>
        </div>
      )}

      <div className="flex-1 flex overflow-hidden">
        <div className="w-1/2 border-r border-gray-300 flex flex-col">
          <div className="bg-gray-100 border-b border-gray-300">
            <div className="flex">
              <button
                onClick={() => setActiveTab('header')}
                className={`px-4 py-2 text-sm font-medium ${
                  activeTab === 'header'
                    ? 'bg-white text-indigo-600 border-b-2 border-indigo-600'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                ヘッダー
              </button>
              <button
                onClick={() => setActiveTab('footer')}
                className={`px-4 py-2 text-sm font-medium ${
                  activeTab === 'footer'
                    ? 'bg-white text-indigo-600 border-b-2 border-indigo-600'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                フッター
              </button>
              <button
                onClick={() => setActiveTab('meta')}
                className={`px-4 py-2 text-sm font-medium ${
                  activeTab === 'meta'
                    ? 'bg-white text-indigo-600 border-b-2 border-indigo-600'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Meta
              </button>
            </div>
          </div>
          <div className="flex-1">
            {activeTab === 'header' && (
              <HTMLEditor value={header} onChange={setHeader} />
            )}
            {activeTab === 'footer' && (
              <HTMLEditor value={footer} onChange={setFooter} />
            )}
            {activeTab === 'meta' && (
              <HTMLEditor value={meta} onChange={setMeta} />
            )}
          </div>
        </div>
        <div className="w-1/2">
          <Preview html={getPreviewHTML()} />
        </div>
      </div>
    </div>
  )
}
