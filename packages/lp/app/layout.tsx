import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { Providers } from '@/components/Providers'
import './globals.css'
import type { Metadata } from 'next'
import type { ReactNode } from 'react'

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://www.hudorosu.com'

export const metadata: Metadata = {
    metadataBase: new URL(BASE_URL),
    title: {
        default: 'ふどろす | 冷蔵庫の在庫管理と予算で決まる無料レシピ提案アプリ（開発中）',
        template: '%s | ふどろす',
    },
    description: '食材管理アプリ「ふどろす」は、冷蔵庫の在庫と1日の予算から最適な献立を自動提案。食費の節約やフードロス削減をサポートする、学生・主婦に優しい無料ツールです。現在開発中です。',
    keywords: ['食材管理アプリ', '冷蔵庫管理', 'レシピ提案', '節約', '献立', 'フードロス', '無料アプリ', 'ふどろす'],
    authors: [{ name: 'ふどろす' }],
    creator: 'ふどろす',
    publisher: 'ふどろす',
    openGraph: {
        type: 'website',
        locale: 'ja_JP',
        url: BASE_URL,
        siteName: 'ふどろす',
        title: 'ふどろす | 冷蔵庫の在庫管理と予算で決まる無料レシピ提案アプリ（開発中）',
        description: '食材管理アプリ「ふどろす」は、冷蔵庫の在庫と1日の予算から最適な献立を自動提案。食費の節約やフードロス削減をサポートする、学生・主婦に優しい無料ツールです。現在開発中です。',
    },
    twitter: {
        card: 'summary_large_image',
        title: 'ふどろす | 冷蔵庫の在庫管理と予算で決まる無料レシピ提案アプリ（開発中）',
        description: '食材管理アプリ「ふどろす」は、冷蔵庫の在庫と1日の予算から最適な献立を自動提案。食費の節約やフードロス削減をサポートする、学生・主婦に優しい無料ツールです。現在開発中です。',
    },
    alternates: {
        canonical: BASE_URL,
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
    icons: {
        icon: '/icon.png',
        apple: '/icon.png',
    },
}


export default function RootLayout({
    children,
}: {
    children: ReactNode
}) {
    return (
        <html lang="ja">
            <head>
                <script async src="https://www.googletagmanager.com/gtag/js?id=G-SWFPCL0J4Y"></script>
                <script
                    dangerouslySetInnerHTML={{
                        __html: `
                            window.dataLayer = window.dataLayer || [];
                            function gtag(){dataLayer.push(arguments);}
                            gtag('js', new Date());
                            gtag('config', 'G-SWFPCL0J4Y');
                            `,
                    }}
                />
            </head>
            <body>
                <Providers>
                    <Header />
                    <main>
                        {children}
                    </main>
                    <Footer />
                </Providers>
            </body>
        </html>
    )
}
