import type { Metadata } from 'next'
import AnimatedSection from '../components/AnimatedSection'

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://www.hudorosu.com'

export const metadata: Metadata = {
    title: 'ふどろす | 冷蔵庫の中身管理アプリ・賞味期限通知で食費節約（開発中）',
    description: '「冷蔵庫　賞味期限　忘れる」を解決！冷蔵庫の中身管理アプリ「ふどろす」は、賞味期限通知で食材を無駄にせず、食費節約・自炊をサポート。無料で使える食材管理ツールです。現在開発中です。',
    keywords: ['冷蔵庫の中身　管理　アプリ', '賞味期限　通知　おすすめ', '冷蔵庫　賞味期限　忘れる', '食費　節約　自炊', '食材管理アプリ', '冷蔵庫管理', 'レシピ提案', '節約', '献立', 'フードロス', '無料アプリ', 'ふどろす', '食材在庫', '家計管理'],
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
        description: '冷蔵庫の中身管理アプリ「ふどろす」は、賞味期限通知で「冷蔵庫　賞味期限　忘れる」を解決。食費節約・自炊をサポートする、学生・主婦に優しい無料ツールです。',
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
            
            {/* ファーストビュー：実機モックアップ + DL導線 */}
            <section className="hero-modern">
                <div className="hero-container">
                    <AnimatedSection className="hero-text" direction="right" delay={0}>
                        <h1 className="hero-title-animate">「冷蔵庫　賞味期限　忘れる」を解決。<br />食費節約・自炊を実現</h1>
                        <p className="hero-subtitle">冷蔵庫の中身管理アプリ × 賞味期限通知 ＝ 食費節約・自炊の実現</p>
                        <p className="hero-description">お財布と地球に優しい食材管理アプリ「ふどろす」</p>
                        
                        {/* DLボタン */}
                        <div className="download-buttons">
                            <a href="#" className="store-button app-store" aria-label="App Storeでダウンロード">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M17.05 20.28c-.98.95-2.05.88-3.08.4-1.09-.5-2.08-.48-3.24 0-1.44.62-2.2.44-3.06-.4C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/>
                                </svg>
                                <div>
                                    <div className="store-label">Download on the</div>
                                    <div className="store-name">App Store</div>
                                </div>
                            </a>
                            <a href="#" className="store-button google-play" aria-label="Google Playでダウンロード">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M3,20.5V3.5C3,2.91 3.34,2.39 3.84,2.15L13.69,12L3.84,21.85C3.34,21.6 3,21.09 3,20.5M16.81,15.12L6.05,21.34L14.54,12.85L16.81,15.12M20.16,10.81C20.5,11.08 20.75,11.5 20.75,12C20.75,12.5 20.53,12.9 20.18,13.18L17.89,14.5L15.39,12L17.89,9.5L20.16,10.81M6.05,2.66L16.81,8.88L14.54,11.15L6.05,2.66Z"/>
                                </svg>
                                <div>
                                    <div className="store-label">GET IT ON</div>
                                    <div className="store-name">Google Play</div>
                                </div>
                            </a>
                        </div>
                        
                        <div className="dev-notice">
                            <span>🚧 デモ版は現在開発中です</span>
                        </div>
                    </AnimatedSection>
                    
                    <AnimatedSection className="hero-mockup" direction="left" delay={200}>
                        <div className="phone-mockup phone-float">
                            <div className="phone-screen">
                                <div className="mockup-content">
                                    {/* ストレージタイプボタン */}
                                    <div className="mockup-storage-buttons">
                                        <button className="mockup-storage-button active">冷蔵</button>
                                        <button className="mockup-storage-button">冷凍</button>
                                        <button className="mockup-storage-button">常温</button>
                                    </div>
                                    
                                    {/* グリッドレイアウトのアイテムカード */}
                                    <div className="mockup-grid">
                                        <div className="mockup-card mockup-item-animate" style={{ animationDelay: '0.3s' }}>
                                            <div className="mockup-card-icon">🥬</div>
                                            <div className="mockup-card-content">
                                                <div className="mockup-card-name">レタス</div>
                                                <div className="mockup-card-quantity">1個</div>
                                                <div className="mockup-progress-bar">
                                                    <div className="mockup-progress-fill" style={{ width: '70%', backgroundColor: '#f59e0b' }}></div>
                                                </div>
                                                <div className="mockup-card-status" style={{ color: '#f59e0b' }}>IN 3 DAYS</div>
                                            </div>
                                        </div>
                                        <div className="mockup-card mockup-item-animate" style={{ animationDelay: '0.4s' }}>
                                            <div className="mockup-card-icon">🍅</div>
                                            <div className="mockup-card-content">
                                                <div className="mockup-card-name">トマト</div>
                                                <div className="mockup-card-quantity">2個</div>
                                                <div className="mockup-progress-bar">
                                                    <div className="mockup-progress-fill" style={{ width: '50%', backgroundColor: '#6B8E6B' }}></div>
                                                </div>
                                                <div className="mockup-card-status" style={{ color: '#6B8E6B' }}>IN 5 DAYS</div>
                                            </div>
                                        </div>
                                        <div className="mockup-card mockup-item-animate" style={{ animationDelay: '0.5s' }}>
                                            <div className="mockup-card-icon">🥕</div>
                                            <div className="mockup-card-content">
                                                <div className="mockup-card-name">にんじん</div>
                                                <div className="mockup-card-quantity">3本</div>
                                                <div className="mockup-progress-bar">
                                                    <div className="mockup-progress-fill" style={{ width: '30%', backgroundColor: '#6B8E6B' }}></div>
                                                </div>
                                                <div className="mockup-card-status" style={{ color: '#6B8E6B' }}>IN 7 DAYS</div>
                                            </div>
                                        </div>
                                        <div className="mockup-card mockup-item-animate" style={{ animationDelay: '0.6s' }}>
                                            <div className="mockup-card-icon">🥚</div>
                                            <div className="mockup-card-content">
                                                <div className="mockup-card-name">卵</div>
                                                <div className="mockup-card-quantity">10個</div>
                                                <div className="mockup-progress-bar">
                                                    <div className="mockup-progress-fill" style={{ width: '60%', backgroundColor: '#6B8E6B' }}></div>
                                                </div>
                                                <div className="mockup-card-status" style={{ color: '#6B8E6B' }}>IN 4 DAYS</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </AnimatedSection>
                </div>
            </section>

            {/* 共感セクション */}
            <section className="empathy-section">
                <div className="container-narrow">
                    <AnimatedSection direction="fade" delay={0}>
                        <h2 className="section-title-large">買い物に行ったのに、<br />冷蔵庫に何があるか忘れたことはありませんか？</h2>
                        <p className="section-description">
                            スーパーで「あれ、これ買ったっけ？」と迷うこと、ありませんか？<br />
                            冷蔵庫を開けて「あ、腐らせちゃった…」と後悔すること、ありませんか？<br />
                            毎日の食費がかさんで、節約したいのにできない…そんな悩みを抱えていませんか？
                        </p>
                    </AnimatedSection>
                </div>
            </section>

            {/* 解決策セクション */}
            <section className="solution-section">
                <div className="container-narrow">
                    <AnimatedSection direction="fade" delay={0}>
                        <h2 className="section-title-large">ポケットの中に冷蔵庫を持ち歩けます</h2>
                        <p className="section-description">
                            スマホ一つで、冷蔵庫の中身をいつでも確認できます。<br />
                            賞味期限が近づいたら自動で通知。食材を無駄にすることなく、<br />
                            食費を節約しながら、美味しい自炊生活を実現できます。
                        </p>
                    </AnimatedSection>
                </div>
            </section>

            {/* ベネフィットセクション（機能ではなく感情訴求） */}
            <section className="benefits-section">
                <div className="container-narrow">
                    <AnimatedSection direction="fade" delay={0}>
                        <h2 className="section-title">あなたが得られる3つの変化</h2>
                    </AnimatedSection>
                    <div className="benefits-list">
                        <AnimatedSection direction="right" delay={100}>
                            <div className="benefit-item">
                                <div className="benefit-number">01</div>
                                <h3>「あ、腐らせちゃった…」がゼロになる</h3>
                                <p>賞味期限通知で、食材を無駄にすることを防ぎます。冷蔵庫を開けて後悔することがなくなります。</p>
                            </div>
                        </AnimatedSection>
                        <AnimatedSection direction="right" delay={200}>
                            <div className="benefit-item">
                                <div className="benefit-number">02</div>
                                <h3>食費が毎月1万円以上節約できる</h3>
                                <p>食材を無駄にしないことで、食費が自然と節約されます。二重買いを防ぎ、在庫を有効活用することで、家計に優しい生活が実現します。</p>
                            </div>
                        </AnimatedSection>
                        <AnimatedSection direction="right" delay={300}>
                            <div className="benefit-item">
                                <div className="benefit-number">03</div>
                                <h3>「今日何作ろう？」の悩みがなくなる</h3>
                                <p>冷蔵庫の中身に合わせたレシピを自動提案。毎日の献立に悩む時間がなくなり、もっと楽しいことに時間を使えます。</p>
                            </div>
                        </AnimatedSection>
                    </div>
                </div>
            </section>

            {/* 信頼セクション（SDGs・開発の想い） */}
            <section className="trust-section">
                <div className="container-narrow">
                    <AnimatedSection direction="fade" delay={0}>
                        <h2 className="section-title">SDGsへの貢献と<br />開発への想い</h2>
                    </AnimatedSection>
                    <div className="trust-content">
                        <AnimatedSection direction="up" delay={100}>
                            <div className="trust-item">
                                <div className="trust-icon">🌱</div>
                                <h3>フードロス削減で地球に優しく</h3>
                                <p>日本では年間約600万トンの食品ロスが発生しています。フドロスを使うことで、一人ひとりがフードロス削減に貢献できます。小さな行動が、大きな変化につながります。</p>
                            </div>
                        </AnimatedSection>
                        <AnimatedSection direction="up" delay={200}>
                            <div className="trust-item">
                                <div className="trust-icon">💚</div>
                                <h3>誰でも使える無料アプリ</h3>
                                <p>学生から主婦まで、誰でも無料で使えるアプリを目指しています。食費を節約したい、食材を無駄にしたくない、そんな想いを共有するすべての人に届けたいと考えています。</p>
                            </div>
                        </AnimatedSection>
                    </div>
                </div>
            </section>

            {/* CTAセクション（巨大なDLボタン） */}
            <section className="cta-section">
                <div className="container-narrow">
                    <AnimatedSection direction="fade" delay={0}>
                        <h2 className="cta-title">今すぐ、無料で始めませんか？</h2>
                        <p className="cta-description">冷蔵庫の中身管理で、食費節約とフードロス削減を実現</p>
                    </AnimatedSection>
                    <AnimatedSection direction="up" delay={200}>
                        <div className="download-buttons-large">
                            <a href="#" className="store-button-large app-store" aria-label="App Storeでダウンロード">
                                <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M17.05 20.28c-.98.95-2.05.88-3.08.4-1.09-.5-2.08-.48-3.24 0-1.44.62-2.2.44-3.06-.4C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/>
                                </svg>
                                <div>
                                    <div className="store-label">Download on the</div>
                                    <div className="store-name">App Store</div>
                                </div>
                            </a>
                            <a href="#" className="store-button-large google-play" aria-label="Google Playでダウンロード">
                                <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M3,20.5V3.5C3,2.91 3.34,2.39 3.84,2.15L13.69,12L3.84,21.85C3.34,21.6 3,21.09 3,20.5M16.81,15.12L6.05,21.34L14.54,12.85L16.81,15.12M20.16,10.81C20.5,11.08 20.75,11.5 20.75,12C20.75,12.5 20.53,12.9 20.18,13.18L17.89,14.5L15.39,12L17.89,9.5L20.16,10.81M6.05,2.66L16.81,8.88L14.54,11.15L6.05,2.66Z"/>
                                </svg>
                                <div>
                                    <div className="store-label">GET IT ON</div>
                                    <div className="store-name">Google Play</div>
                                </div>
                            </a>
                        </div>
                    </AnimatedSection>
                    <AnimatedSection direction="fade" delay={400}>
                        <div className="dev-notice-large">
                            <span>🚧 デモ版は現在開発中です。リリース情報は随時お知らせいたします。</span>
                        </div>
                    </AnimatedSection>
                </div>
            </section>
        </>
    )
}
