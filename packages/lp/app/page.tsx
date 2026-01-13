import type { Metadata } from 'next'

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://www.hudorosu.com'

export const metadata: Metadata = {
    title: 'ふどろす | 冷蔵庫の在庫管理と予算で決まる無料レシピ提案アプリ（開発中）',
    description: '食材管理アプリ「ふどろす」は、冷蔵庫の在庫と1日の予算から最適な献立を自動提案。食費の節約やフードロス削減をサポートする、学生・主婦に優しい無料ツールです。現在開発中です。',
    keywords: ['食材管理アプリ', '冷蔵庫管理', 'レシピ提案', '節約', '献立', 'フードロス', '無料アプリ', 'ふどろす', '食材在庫', '家計管理'],
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
}

export default function HomePage() {
    const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://www.hudorosu.com'
    
    const structuredData = {
        '@context': 'https://schema.org',
        '@type': 'WebApplication',
        name: 'ふどろす',
        description: '食材管理アプリ「ふどろす」は、冷蔵庫の在庫と1日の予算から最適な献立を自動提案。食費の節約やフードロス削減をサポートする、学生・主婦に優しい無料ツールです。',
        url: BASE_URL,
        applicationCategory: 'FoodApplication',
        operatingSystem: 'Web',
        offers: {
            '@type': 'Offer',
            price: '0',
            priceCurrency: 'JPY',
        },
        aggregateRating: {
            '@type': 'AggregateRating',
            ratingValue: '4.5',
            ratingCount: '1',
        },
    }

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
            />
            <section className="hero" role="img" aria-label="食材管理で節約するイメージ背景">
                <div className="hero-overlay"></div>
                <div className="hero-content">
                    <h1>「今日、何作ろう？」の悩み、<br />冷蔵庫の中身が解決します。</h1>
                    <p>冷蔵庫の在庫 × 今日の予算 ＝ 最適な節約レシピ提案<br />お財布と地球に優しい食材管理アプリ「ふどろす」</p>
                    <div style={{ marginTop: '20px', padding: '15px 30px', background: 'rgba(255, 193, 7, 0.15)', border: '2px solid #ffc107', borderRadius: '50px', display: 'inline-block', fontWeight: 600, color: '#f57c00' }}>
                    <span style={{ fontSize: '1.1rem' }}>🚧 デモ版は現在開発中です</span>
                    </div>
                </div>
            </section>
            <div className="container">
            <section id="features">
                <h2 className="section-title">ふどろすが選ばれる3つの理由</h2>
                <div className="feature-grid">
                    <div className="feature-item">
                        <h2>🔍 冷蔵庫の在庫を見える化</h2>
                        <p>スマホでどこでも在庫管理。スーパーでの「二重買い」や「買い忘れ」をゼロにして、賢く節約しましょう。</p>
                    </div>
                    <div className="feature-item">
                        <h2>💰 予算に合わせた献立提案</h2>
                        <p>「今日は500円以内で！」など、予算に応じたレシピを検索。家計簿いらずで食費がコントロールできます。</p>
                    </div>
                    <div className="feature-item">
                        <h2>🌱 フードロス削減でエコに</h2>
                        <p>食材を余らせず使い切ることで、ムダを削減。あなたのお財布にも、地球環境にも優しい習慣が身につきます。</p>
                    </div>
                </div>
            </section>
            <section id="how-to">
                <div style={{ textAlign: 'center', marginBottom: '30px', padding: '20px', background: '#fff3cd', border: '2px solid #ffc107', borderRadius: '15px' }}>
                    <h3 style={{ color: '#856404', margin: '0 0 10px 0', fontSize: '1.3rem' }}>🚧 デモ版は現在開発中です</h3>
                    <p style={{ color: '#856404', margin: 0, fontSize: '1rem' }}>サービス開始まで今しばらくお待ちください。リリース情報は随時お知らせいたします。</p>
                </div>
                <h3 style={{ textAlign: 'center', color: 'var(--deep-green)', marginBottom: '30px', fontSize: '1.4rem' }}>リリース後の使い方（予定）</h3>
                <ul className="step-list">
                    <li><strong>ブラウザで「ふどろす」を開く</strong><br />iPhoneはSafari、AndroidはChromeからアクセスしてください。</li>
                    <li><strong>「ホーム画面に追加」をタップ</strong><br />共有メニュー（四角い矢印アイコン等）から「ホーム画面に追加」を選択します。</li>
                    <li><strong>アプリのようにすぐ起動</strong><br />ホーム画面に「ふどろす」のアイコンが作成され、いつでも在庫確認・レシピ提案が可能です。</li>
                </ul>
            </section>
            </div>
        </>
    )
}
