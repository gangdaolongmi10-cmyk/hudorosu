import type { Metadata } from 'next'
import { Suspense } from 'react'

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://www.hudorosu.com'

export const metadata: Metadata = {
    title: 'ブログ | ふどろす - 節約レシピ・冷蔵庫管理のコツ',
    description: '冷蔵庫の余り物で作る節約レシピ、給料日前のメニュー、食材管理のコツなど、ふどろすがお届けする実用的な記事一覧。',
    keywords: ['節約レシピ', '冷蔵庫 余り物', '給料日前 メニュー', '食材管理', 'ふどろす', 'フードロス削減'],
    alternates: {
        canonical: `${BASE_URL}/blog`,
    },
}

export default function BlogLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <Suspense fallback={<div>読み込み中...</div>}>
            {children}
        </Suspense>
    )
}
