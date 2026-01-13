import type { Metadata } from 'next'

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://www.hudorosu.com'

export const metadata: Metadata = {
    title: 'プロジェクトセカイ | キャラクターの好きな食べ物・嫌いな食べ物',
    description: 'プロジェクトセカイのキャラクターの好きな食べ物・嫌いな食べ物を検索できます。',
    keywords: ['プロジェクトセカイ', 'プロセカ', 'キャラクター', '好きな食べ物', '嫌いな食べ物', 'ふどろす'],
    openGraph: {
        title: 'プロジェクトセカイ | キャラクターの好きな食べ物・嫌いな食べ物 | ふどろす',
        description: 'プロジェクトセカイのキャラクターの好きな食べ物・嫌いな食べ物を検索できます。',
        url: `${BASE_URL}/blog/my_fave/puroseka`,
        type: 'article',
    },
    alternates: {
        canonical: `${BASE_URL}/blog/my_fave/puroseka`,
    },
}

export default function PurosekaLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return <>{children}</>
}
