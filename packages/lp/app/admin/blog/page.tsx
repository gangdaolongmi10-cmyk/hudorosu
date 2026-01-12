'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/contexts/AuthContext'

interface BlogArticle {
  slug: string
  filename: string
  createdAt: Date
  updatedAt: Date
}

export default function BlogListPage() {
  const { isAuthenticated, isLoading } = useAuth()
  const router = useRouter()
  const [articles, setArticles] = useState<BlogArticle[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/admin/login')
    }
  }, [isAuthenticated, isLoading, router])

  useEffect(() => {
    if (isAuthenticated) {
      fetchArticles()
    }
  }, [isAuthenticated])

  const fetchArticles = async () => {
    try {
      const response = await fetch('/api/admin/blog')
      const data = await response.json()
      if (data.articles) {
        setArticles(data.articles)
      }
    } catch (error) {
      console.error('Error fetching articles:', error)
    } finally {
      setLoading(false)
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
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center space-x-4">
              <Link href="/admin/dashboard" className="text-gray-600 hover:text-gray-900">
                ← ダッシュボード
              </Link>
              <h1 className="text-xl font-semibold text-gray-900">
                ブログ記事管理
              </h1>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {/* 静的ファイル方式の説明 */}
          <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-6">
            <div className="flex">
              <div className="ml-3">
                <p className="text-sm text-blue-700">
                  <strong>静的ファイル方式:</strong> ブログ記事は直接<code className="bg-blue-100 px-1 rounded">packages/lp/blog/</code>ディレクトリにHTMLファイルとして配置してください。
                  ファイルを追加・編集・削除した後、Gitでコミット・プッシュすると、Vercelのデプロイ時に自動的に反映されます。
                </p>
              </div>
            </div>
          </div>

          {articles.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 mb-4">ブログ記事がありません</p>
              <p className="text-sm text-gray-400 mb-4">
                <code className="bg-gray-100 px-2 py-1 rounded">packages/lp/blog/</code>ディレクトリにHTMLファイルを配置してください
              </p>
            </div>
          ) : (
            <div className="bg-white shadow overflow-hidden sm:rounded-md">
              <ul className="divide-y divide-gray-200">
                {articles.map((article) => (
                  <li key={article.slug}>
                    <div className="px-4 py-4 sm:px-6 flex items-center justify-between">
                      <div className="flex items-center">
                        <div>
                          <Link
                            href={`/blog/${article.slug}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-lg font-medium text-indigo-600 hover:text-indigo-900"
                          >
                            {article.slug}
                          </Link>
                          <p className="text-sm text-gray-500 mt-1">
                            更新: {new Date(article.updatedAt).toLocaleString('ja-JP')}
                          </p>
                          <p className="text-xs text-gray-400 mt-1">
                            ファイル: <code className="bg-gray-100 px-1 rounded">{article.filename}</code>
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Link
                          href={`/blog/${article.slug}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-3 py-1 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                        >
                          表示
                        </Link>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
