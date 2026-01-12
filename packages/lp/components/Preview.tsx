'use client'

import { useState } from 'react'

interface PreviewProps {
  html: string
}

type ViewMode = 'pc' | 'sp'

export default function Preview({ html }: PreviewProps) {
  const [viewMode, setViewMode] = useState<ViewMode>('pc')

  return (
    <div className="h-full flex flex-col bg-white">
      <div className="bg-gray-100 px-4 py-2 border-b border-gray-300 flex items-center justify-between">
        <h3 className="text-sm font-medium text-gray-700">プレビュー</h3>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setViewMode('pc')}
            className={`px-3 py-1 text-xs font-medium rounded ${
              viewMode === 'pc'
                ? 'bg-indigo-600 text-white'
                : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
            }`}
          >
            PC
          </button>
          <button
            onClick={() => setViewMode('sp')}
            className={`px-3 py-1 text-xs font-medium rounded ${
              viewMode === 'sp'
                ? 'bg-indigo-600 text-white'
                : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
            }`}
          >
            SP
          </button>
        </div>
      </div>
      <div className="flex-1 overflow-auto bg-gray-100 p-4">
        <div
          className={`bg-white shadow-lg mx-auto ${
            viewMode === 'pc' ? 'w-full max-w-4xl' : 'w-full max-w-sm'
          }`}
        >
          <iframe
            srcDoc={html}
            className="w-full border-0"
            style={{
              height: viewMode === 'pc' ? '800px' : '600px',
              minHeight: viewMode === 'pc' ? '800px' : '600px',
            }}
            title="Preview"
          />
        </div>
      </div>
    </div>
  )
}
