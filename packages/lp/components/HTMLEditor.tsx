'use client'

import { useState, useEffect } from 'react'

interface HTMLEditorProps {
    value: string
    onChange: (value: string) => void
}

export default function HTMLEditor({ value, onChange }: HTMLEditorProps) {
    const [html, setHtml] = useState(value)

    useEffect(() => {
        setHtml(value)
    }, [value])

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const newValue = e.target.value
        setHtml(newValue)
        onChange(newValue)
    }

    return (
        <div className="h-full flex flex-col">
            <div className="bg-gray-100 px-4 py-2 border-b border-gray-300">
                <h3 className="text-sm font-medium text-gray-700">HTMLエディタ</h3>
            </div>
            <textarea
                value={html}
                onChange={handleChange}
                className="flex-1 w-full p-4 border border-gray-300 rounded-b-lg font-mono text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
                placeholder="HTMLコードを入力してください..."
                spellCheck={false}
            />
        </div>
    )
}
