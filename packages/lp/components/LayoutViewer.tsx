'use client'

import { useState, useEffect } from 'react'

interface LayoutViewerProps {
  onClose?: () => void
}

type LayoutType = 'header' | 'footer' | 'meta'

export default function LayoutViewer({ onClose }: LayoutViewerProps) {
  const [header, setHeader] = useState('')
  const [footer, setFooter] = useState('')
  const [meta, setMeta] = useState('')
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<LayoutType>('header')
  const [error, setError] = useState('')

  useEffect(() => {
    fetchLayout()
  }, [])

  const fetchLayout = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/admin/layout')
      const data = await response.json()

      if (response.ok) {
        setHeader(data.header || '')
        setFooter(data.footer || '')
        setMeta(data.meta || '')
      } else {
        setError('共通レイアウトの取得に失敗しました')
      }
    } catch (error) {
      console.error('Error fetching layout:', error)
      setError('共通レイアウトの取得に失敗しました')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-2 text-sm text-gray-600">読み込み中...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center">
          <p className="text-sm text-red-600">{error}</p>
          <button
            onClick={fetchLayout}
            className="mt-2 px-3 py-1 text-sm text-indigo-600 hover:text-indigo-800"
          >
            再試行
          </button>
        </div>
      </div>
    )
  }

  const getCurrentContent = () => {
    switch (activeTab) {
      case 'header':
        return header
      case 'footer':
        return footer
      case 'meta':
        return meta
      default:
        return ''
    }
  }

  const getTabLabel = (type: LayoutType) => {
    switch (type) {
      case 'header':
        return 'ヘッダー'
      case 'footer':
        return 'フッター'
      case 'meta':
        return 'Meta'
      default:
        return ''
    }
  }

  return (
    <div className="h-full flex flex-col bg-white">
      <div className="bg-gray-100 px-4 py-2 border-b border-gray-300 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <h3 className="text-sm font-medium text-gray-700">共通レイアウト</h3>
          {onClose && (
            <button
              onClick={onClose}
              className="ml-2 text-gray-500 hover:text-gray-700"
              title="閉じる"
            >
              ✕
            </button>
          )}
        </div>
        <div className="flex items-center space-x-1">
          <button
            onClick={() => setActiveTab('header')}
            className={`px-2 py-1 text-xs font-medium rounded ${
              activeTab === 'header'
                ? 'bg-indigo-600 text-white'
                : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
            }`}
          >
            ヘッダー
          </button>
          <button
            onClick={() => setActiveTab('footer')}
            className={`px-2 py-1 text-xs font-medium rounded ${
              activeTab === 'footer'
                ? 'bg-indigo-600 text-white'
                : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
            }`}
          >
            フッター
          </button>
          <button
            onClick={() => setActiveTab('meta')}
            className={`px-2 py-1 text-xs font-medium rounded ${
              activeTab === 'meta'
                ? 'bg-indigo-600 text-white'
                : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
            }`}
          >
            Meta
          </button>
        </div>
      </div>
      <div className="flex-1 overflow-auto p-4">
        <div className="mb-2">
          <p className="text-xs text-gray-500 mb-1">
            {getTabLabel(activeTab)}のコード:
          </p>
        </div>
        <pre className="bg-gray-50 border border-gray-200 rounded p-3 text-xs font-mono overflow-x-auto">
          <code>{getCurrentContent() || '(未設定)'}</code>
        </pre>
        <div className="mt-4 text-xs text-gray-500">
          <p className="mb-1">💡 ヒント:</p>
          <ul className="list-disc list-inside space-y-1 ml-2">
            <li>このコードはブログ記事に自動的に組み込まれます</li>
            <li>共通レイアウトを変更するには、<a href="/admin/layout-editor" className="text-indigo-600 hover:underline">レイアウト編集画面</a>から編集してください</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
