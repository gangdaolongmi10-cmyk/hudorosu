import type { Metadata } from 'next'
import './globals.css'
import { Providers } from '@/components/Providers'

export const metadata: Metadata = {
  title: 'ふどろす | 冷蔵庫の在庫管理と予算で決まる無料レシピ提案アプリ（開発中）',
  description: '食材管理アプリ「ふどろす」は、冷蔵庫の在庫と1日の予算から最適な献立を自動提案。食費の節約やフードロス削減をサポートする、学生・主婦に優しい無料ツールです。現在開発中です。',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
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
          {children}
        </Providers>
      </body>
    </html>
  )
}
