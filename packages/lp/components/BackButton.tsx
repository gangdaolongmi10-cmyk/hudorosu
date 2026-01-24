'use client'

import { useRouter } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'

interface BackButtonProps {
    className?: string
    children?: React.ReactNode
}

export default function BackButton({ className, children }: BackButtonProps) {
    const router = useRouter()

    return (
        <button
            onClick={() => router.back()}
            className={className || "inline-flex items-center text-sm font-medium text-gray-500 hover:text-[#2e7d32] transition-colors cursor-pointer bg-transparent border-none p-0"}
        >
            <ArrowLeft className="w-4 h-4 mr-1" />
            {children || '前の画面に戻る'}
        </button>
    )
}
