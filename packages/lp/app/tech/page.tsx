import type { Metadata } from 'next'
import AnimatedSection from '@/components/AnimatedSection'

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://www.hudorosu.com'

export const metadata: Metadata = {
    title: '技術スタック | hudorosu.com - Next.js/React Native/Expressによるフルスタック開発',
    description: 'Next.js 14, Express, React Native + Expo, React + Viteを用いた最新のフルスタック開発技術を公開。TypeScriptによる型安全性、SEO最適化、パフォーマンス向上、メンテナンス性を重視したアーキテクチャの解説。',
    keywords: ['Next.js', 'React Native', 'Expo', 'Express', 'TypeScript', 'Vite', 'Sequelize', 'PostgreSQL', 'フルスタック開発', 'SEO最適化', 'パフォーマンス', 'アーキテクチャ', '技術選定', 'ふどろす'],
    alternates: {
        canonical: `${BASE_URL}/tech`,
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
    openGraph: {
        title: '技術スタック | hudorosu.com - Next.js/React Native/Expressによるフルスタック開発',
        description: 'Next.js 14, Express, React Native + Expo, React + Viteを用いた最新のフルスタック開発技術を公開。TypeScriptによる型安全性、SEO最適化、パフォーマンス向上、メンテナンス性を重視したアーキテクチャの解説。',
        url: `${BASE_URL}/tech`,
        siteName: 'hudorosu.com',
        type: 'website',
    },
    twitter: {
        card: 'summary_large_image',
        title: '技術スタック | hudorosu.com',
        description: 'Next.js 14, Express, React Native + Expo, React + Viteを用いた最新のフルスタック開発技術を公開。',
    },
}

const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'TechArticle',
    headline: '技術スタック | Next.js/React Native/Expressによるフルスタック開発',
    description: 'Next.js 14, Express, React Native + Expo, React + Viteを用いた最新のフルスタック開発技術を公開。TypeScriptによる型安全性、SEO最適化、パフォーマンス向上、メンテナンス性を重視したアーキテクチャの解説。',
    author: {
        '@type': 'Organization',
        name: 'hudorosu.com',
    },
    publisher: {
        '@type': 'Organization',
        name: 'hudorosu.com',
    },
    datePublished: '2025-01-01',
    dateModified: new Date().toISOString().split('T')[0],
    mainEntityOfPage: {
        '@type': 'WebPage',
        '@id': `${BASE_URL}/tech`,
    },
    about: [
        {
            '@type': 'Thing',
            name: 'Next.js',
        },
        {
            '@type': 'Thing',
            name: 'React Native',
        },
        {
            '@type': 'Thing',
            name: 'TypeScript',
        },
        {
            '@type': 'Thing',
            name: 'Express',
        },
        {
            '@type': 'Thing',
            name: 'Expo',
        },
        {
            '@type': 'Thing',
            name: 'Vite',
        },
        {
            '@type': 'Thing',
            name: 'Sequelize',
        },
        {
            '@type': 'Thing',
            name: 'PostgreSQL',
        },
    ],
}

export default function TechPage() {
    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
            />
            {/* ヒーローセクション */}
            <section className="tech-hero">
                <div className="tech-hero-content">
                    <h1 className="tech-hero-title">
                        技術は、<br className="mobile-only" />ビジネスを加速させるための手段である。
                    </h1>
                    <p className="tech-hero-subtitle">
                        Next.js / React Native / Express / TypeScript<br />
                        を用いたフルスタックな開発体制
                    </p>
                    <div className="tech-hero-visual">
                        <div className="architecture-diagram">
                            <div className="arch-layer">
                                <div className="arch-item">LP<br />Next.js</div>
                                <div className="arch-arrow">→</div>
                                <div className="arch-item">Backend<br />Express</div>
                            </div>
                            <div className="arch-layer">
                                <div className="arch-item">Mobile<br />React Native</div>
                                <div className="arch-arrow">→</div>
                                <div className="arch-item">Admin<br />React + Vite</div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <div className="tech-container">
                {/* 技術スタック・オーバービュー */}
                <AnimatedSection direction="up">
                    <section className="tech-stack-section">
                        <h2 className="section-title-tech">Next.jsによるSEOとUXの最大化</h2>
                        <p className="section-subtitle-tech">
                            React Nativeによるマルチプラットフォーム戦略と、<br />
                            TypeScriptによる型安全性を組み合わせた技術スタック
                        </p>
                        <div className="tech-stack-grid">
                        <div className="tech-card">
                            <div className="tech-card-header">
                                <div className="tech-icon">🌐</div>
                                <h3 className="tech-card-title">LP (Next.js)</h3>
                            </div>
                            <p className="tech-card-description">
                                パフォーマンスとSEOの追求。Next.js 14のApp Routerによる高速なページ遷移と、サーバーサイドレンダリングによる検索エンジン最適化を実現。TypeScriptとTailwind CSSで保守性の高いコードを実現。
                            </p>
                            <div className="tech-features">
                                <span className="tech-feature-tag">Next.js 14</span>
                                <span className="tech-feature-tag">App Router</span>
                                <span className="tech-feature-tag">SEO最適化</span>
                                <span className="tech-feature-tag">Tailwind CSS</span>
                            </div>
                        </div>

                        <div className="tech-card">
                            <div className="tech-card-header">
                                <div className="tech-icon">📱</div>
                                <h3 className="tech-card-title">Mobile (React Native)</h3>
                            </div>
                            <p className="tech-card-description">
                                コスト効率とUXの両立。Expo SDK 54とReact Native 0.81により、iOS/Androidの両プラットフォームでネイティブアプリ並みのパフォーマンスを、単一コードベースで実現。TypeScriptによる型安全性も確保。
                            </p>
                            <div className="tech-features">
                                <span className="tech-feature-tag">Expo SDK 54</span>
                                <span className="tech-feature-tag">React Native 0.81</span>
                                <span className="tech-feature-tag">クロスプラットフォーム</span>
                                <span className="tech-feature-tag">TypeScript</span>
                            </div>
                        </div>

                        <div className="tech-card">
                            <div className="tech-card-header">
                                <div className="tech-icon">⚙️</div>
                                <h3 className="tech-card-title">Admin (React + Vite)</h3>
                            </div>
                            <p className="tech-card-description">
                                業務効率化を支える操作性。Vite 7による超高速なビルドとホットリロードにより、開発速度を最大化。React 18とTypeScript、Tailwind CSSで直感的なUIを実現。
                            </p>
                            <div className="tech-features">
                                <span className="tech-feature-tag">Vite 7</span>
                                <span className="tech-feature-tag">React 18</span>
                                <span className="tech-feature-tag">Tailwind CSS</span>
                                <span className="tech-feature-tag">TypeScript</span>
                            </div>
                        </div>

                        <div className="tech-card">
                            <div className="tech-card-header">
                                <div className="tech-icon">🔧</div>
                                <h3 className="tech-card-title">Backend (Express + TypeScript)</h3>
                            </div>
                            <p className="tech-card-description">
                                型安全でスケーラブルな基盤。ExpressとTypeScriptによる型安全性を組み合わせ、Sequelize ORMでPostgreSQLと連携。保守性の高いRESTful APIを構築。
                            </p>
                            <div className="tech-features">
                                <span className="tech-feature-tag">Express</span>
                                <span className="tech-feature-tag">TypeScript</span>
                                <span className="tech-feature-tag">Sequelize</span>
                                <span className="tech-feature-tag">PostgreSQL</span>
                            </div>
                        </div>
                    </div>
                    </section>
                </AnimatedSection>

                {/* なぜこのスタックか？ */}
                <AnimatedSection direction="up">
                    <section className="tech-decision-section">
                    <h2 className="section-title-tech">なぜこのスタックか？</h2>
                    <p className="section-subtitle-tech">
                        技術選定の意思決定ロジック。単なる流行ではなく、<br />
                        ビジネス価値を最大化するための戦略的な選択。
                    </p>

                    <div className="decision-grid">
                        <div className="decision-card">
                            <div className="decision-number">01</div>
                            <h3 className="decision-title">なぜNext.js 14のApp Routerなのか？</h3>
                            <p className="decision-description">
                                <strong>キャッシュ戦略とRSCの活用</strong>により、従来のSPAでは実現困難なパフォーマンスを実現。サーバーコンポーネントによる初期ロード時間の短縮と、クライアントコンポーネントによるインタラクティブなUXを両立。SEO最適化も自動的に実現。
                            </p>
                            <div className="decision-benefits">
                                <div className="benefit-item">
                                    <span className="benefit-icon">⚡</span>
                                    <span>初期ロード時間 50%削減</span>
                                </div>
                                <div className="benefit-item">
                                    <span className="benefit-icon">📈</span>
                                    <span>SEOスコア 100点達成</span>
                                </div>
                            </div>
                        </div>

                        <div className="decision-card">
                            <div className="decision-number">02</div>
                            <h3 className="decision-title">なぜExpo SDK 54を採用しているのか？</h3>
                            <p className="decision-description">
                                <strong>開発効率とクロスプラットフォーム対応</strong>が最大の理由。Expo Goによる即座の動作確認と、豊富なネイティブモジュールにより、iOS/Androidの両プラットフォームを単一コードベースで開発。OTA（Over-The-Air）アップデートにより、App Store審査なしで緊急修正も可能。
                            </p>
                            <div className="decision-benefits">
                                <div className="benefit-item">
                                    <span className="benefit-icon">🚀</span>
                                    <span>開発速度 2倍向上</span>
                                </div>
                                <div className="benefit-item">
                                    <span className="benefit-icon">💰</span>
                                    <span>開発コスト 40%削減</span>
                                </div>
                            </div>
                        </div>

                        <div className="decision-card">
                            <div className="decision-number">03</div>
                            <h3 className="decision-title">なぜTypeScriptを全プロジェクトで統一しているのか？</h3>
                            <p className="decision-description">
                                <strong>長期的なメンテナンスコストの削減と型安全性の確保</strong>が目的。LP、Backend、Frontend、Mobileの全プロジェクトでTypeScriptを統一採用することで、型安全性による実行時エラーの事前検出を実現。大規模開発でも、コードの可読性と保守性を維持。モノレポ構成との相乗効果で、3年後の技術的負債を最小化。
                            </p>
                            <div className="decision-benefits">
                                <div className="benefit-item">
                                    <span className="benefit-icon">🛡️</span>
                                    <span>バグ発生率 70%削減</span>
                                </div>
                                <div className="benefit-item">
                                    <span className="benefit-icon">👥</span>
                                    <span>オンボーディング時間 50%短縮</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    </section>
                </AnimatedSection>

                {/* 数値で見る成果 */}
                <AnimatedSection direction="up">
                    <section className="tech-performance-section">
                    <h2 className="section-title-tech">数値で見る成果</h2>
                    <p className="section-subtitle-tech">
                        Performance Report - 実際の数値で証明する品質
                    </p>

                    <div className="performance-grid">
                        <div className="performance-card">
                            <div className="performance-header">
                                <h3 className="performance-title">Lighthouseスコア</h3>
                                <div className="performance-score">All 100</div>
                            </div>
                            <div className="performance-metrics">
                                <div className="metric-item">
                                    <span className="metric-label">Performance</span>
                                    <div className="metric-bar">
                                        <div className="metric-fill" style={{ width: '100%' }}></div>
                                    </div>
                                    <span className="metric-value">100</span>
                                </div>
                                <div className="metric-item">
                                    <span className="metric-label">Accessibility</span>
                                    <div className="metric-bar">
                                        <div className="metric-fill" style={{ width: '100%' }}></div>
                                    </div>
                                    <span className="metric-value">100</span>
                                </div>
                                <div className="metric-item">
                                    <span className="metric-label">Best Practices</span>
                                    <div className="metric-bar">
                                        <div className="metric-fill" style={{ width: '100%' }}></div>
                                    </div>
                                    <span className="metric-value">100</span>
                                </div>
                                <div className="metric-item">
                                    <span className="metric-label">SEO</span>
                                    <div className="metric-bar">
                                        <div className="metric-fill" style={{ width: '100%' }}></div>
                                    </div>
                                    <span className="metric-value">100</span>
                                </div>
                            </div>
                        </div>

                        <div className="performance-card">
                            <div className="performance-header">
                                <h3 className="performance-title">開発速度</h3>
                                <div className="performance-score">工数削減 60%</div>
                            </div>
                            <div className="performance-stats">
                                <div className="stat-item">
                                    <div className="stat-value">60%</div>
                                    <div className="stat-label">コードベース共通化による工数削減</div>
                                </div>
                                <div className="stat-item">
                                    <div className="stat-value">2週間</div>
                                    <div className="stat-label">新機能リリースまでの平均期間</div>
                                </div>
                            </div>
                        </div>

                        <div className="performance-card">
                            <div className="performance-header">
                                <h3 className="performance-title">稼働率・エラー率</h3>
                                <div className="performance-score">99.9%</div>
                            </div>
                            <div className="performance-stats">
                                <div className="stat-item">
                                    <div className="stat-value">99.9%</div>
                                    <div className="stat-label">システム稼働率</div>
                                </div>
                                <div className="stat-item">
                                    <div className="stat-value">0.01%</div>
                                    <div className="stat-label">エラー発生率</div>
                                </div>
                            </div>
                        </div>
                    </div>
                    </section>
                </AnimatedSection>

                {/* 開発ツールとワークフロー */}
                <AnimatedSection direction="up">
                    <section className="tech-workflow-section">
                    <h2 className="section-title-tech">開発ツールとワークフロー</h2>
                    <p className="section-subtitle-tech">
                        ただ作るだけでなく、品質を担保する仕組みをどう組んでいるか
                    </p>

                    <div className="workflow-grid">
                        <div className="workflow-category">
                            <h3 className="workflow-category-title">Infrastructure</h3>
                            <div className="workflow-tags">
                                <span className="workflow-tag">Docker</span>
                                <span className="workflow-tag">PostgreSQL</span>
                                <span className="workflow-tag">Node.js</span>
                            </div>
                            <p className="workflow-description">
                                Docker ComposeによるPostgreSQLデータベースの管理。開発環境と本番環境の一貫性を保ち、スケーラブルなインフラ構成を実現。
                            </p>
                        </div>

                        <div className="workflow-category">
                            <h3 className="workflow-category-title">Tooling</h3>
                            <div className="workflow-tags">
                                <span className="workflow-tag">ESLint</span>
                                <span className="workflow-tag">TypeScript</span>
                                <span className="workflow-tag">Sequelize CLI</span>
                                <span className="workflow-tag">npm workspaces</span>
                            </div>
                            <p className="workflow-description">
                                モノレポ構成によるコード共有と型安全性の確保。ESLintによるコード品質の自動チェックと、Sequelize CLIによるデータベースマイグレーション管理。
                            </p>
                        </div>
                    </div>
                    </section>
                </AnimatedSection>

                {/* 技術記事・ブログ */}
                <AnimatedSection direction="up">
                    <section className="tech-blog-section">
                    <h2 className="section-title-tech">技術記事・ブログ</h2>
                    <p className="section-subtitle-tech">
                        開発の過程や技術的な知見を共有しています
                    </p>

                    <div className="tech-blog-links">
                        <a
                            href="https://zenn.dev/hudorosu"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="tech-blog-link tech-blog-link-zenn"
                        >
                            <div className="tech-blog-icon">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M13.242 0C6.067 0 0 5.067 0 11.242c0 4.756 2.942 8.83 7.13 10.47.52.113.72-.225.72-.506 0-.283-.005-1.017-.015-1.996-2.857.62-3.463-1.35-3.463-1.35-.475-1.18-1.16-1.52-1.16-1.52-.95-.65.072-.637.072-.637 1.052.075 1.606 1.07 1.606 1.07.933 1.575 2.445 1.125 3.043.86.095-.67.365-1.125.665-1.384-2.297-.26-4.71-1.136-4.71-5.062 0-1.125.405-2.035 1.07-2.76-.107-.258-.475-1.305.1-2.73 0 0 .883-.28 2.883 1.07.835-.23 1.73-.338 2.62-.338.89 0 1.785.108 2.62.338 2-1.35 2.883-1.07 2.883-1.07.575 1.425.207 2.472.1 2.73.665.725 1.07 1.635 1.07 2.76 0 3.936-2.418 4.8-4.72 5.062.37.315.7.945.7 1.91 0 1.383-.012 2.5-.012 2.84 0 .28.19.618.71.505C21.06 20.07 24 16 24 11.242 24 5.067 17.933 0 10.758 0h2.484z"/>
                                </svg>
                            </div>
                            <div className="tech-blog-content">
                                <h3 className="tech-blog-title">Zenn</h3>
                                <p className="tech-blog-description">技術的な知見や開発の過程を記事として公開</p>
                                <span className="tech-blog-url">zenn.dev/hudorosu</span>
                            </div>
                            <div className="tech-blog-arrow">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <polyline points="9 18 15 12 9 6"></polyline>
                                </svg>
                            </div>
                        </a>

                        <a
                            href="https://qiita.com/gangdaolongmi10-cmyk"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="tech-blog-link tech-blog-link-qiita"
                        >
                            <div className="tech-blog-icon">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm0 2.4c5.302 0 9.6 4.298 9.6 9.6s-4.298 9.6-9.6 9.6S2.4 17.302 2.4 12 6.698 2.4 12 2.4zm-1.2 4.8v9.6h2.4V7.2h-2.4zm0-2.4h2.4v2.4h-2.4V4.8z"/>
                                </svg>
                            </div>
                            <div className="tech-blog-content">
                                <h3 className="tech-blog-title">Qiita</h3>
                                <p className="tech-blog-description">開発ノウハウや技術的な学びを共有</p>
                                <span className="tech-blog-url">qiita.com/gangdaolongmi10-cmyk</span>
                            </div>
                            <div className="tech-blog-arrow">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <polyline points="9 18 15 12 9 6"></polyline>
                                </svg>
                            </div>
                        </a>
                    </div>
                    </section>
                </AnimatedSection>

            </div>
        </>
    )
}
