import type { Metadata } from 'next'

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://www.hudorosu.com'

export const metadata: Metadata = {
    title: 'プロジェクトセカイ | キャラクターの好きな食べ物・嫌いな食べ物',
    description: 'プロジェクトセカイのキャラクターの好きな食べ物・嫌いな食べ物を検索できます。Leo/need、MORE MORE JUMP!、Vivid BAD SQUAD、25時、ナイトコードで。の全キャラクター情報を掲載。',
    keywords: ['プロジェクトセカイ', 'プロセカ', 'キャラクター', '好きな食べ物', '嫌いな食べ物', 'Leo/need', 'MORE MORE JUMP!', 'Vivid BAD SQUAD', '25時、ナイトコードで。', 'ふどろす'],
    authors: [{ name: 'ふどろす' }],
    openGraph: {
        title: 'プロジェクトセカイ | キャラクターの好きな食べ物・嫌いな食べ物 | ふどろす',
        description: 'プロジェクトセカイのキャラクターの好きな食べ物・嫌いな食べ物を検索できます。Leo/need、MORE MORE JUMP!、Vivid BAD SQUAD、25時、ナイトコードで。の全キャラクター情報を掲載。',
        url: `${BASE_URL}/blog/my_fave/puroseka`,
        type: 'article',
        siteName: 'ふどろす',
    },
    twitter: {
        card: 'summary_large_image',
        title: 'プロジェクトセカイ | キャラクターの好きな食べ物・嫌いな食べ物',
        description: 'プロジェクトセカイのキャラクターの好きな食べ物・嫌いな食べ物を検索できます。',
    },
    alternates: {
        canonical: `${BASE_URL}/blog/my_fave/puroseka`,
    },
    robots: {
        index: true,
        follow: true,
        googleBot: {
            index: true,
            follow: true,
            'max-video-preview': -1,
            'max-image-preview': 'large',
            'max-snippet': -1,
        },
    },
}

export default function PurosekaLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return <>{children}</>
}
