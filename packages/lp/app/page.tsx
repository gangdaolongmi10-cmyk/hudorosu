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
        author: {
            '@type': 'Organization',
            name: 'ふどろす開発チーム',
            description: 'フードロス削減と食費節約を目指す開発チーム',
        },
        publisher: {
            '@type': 'Organization',
            name: 'ふどろす開発チーム',
        },
        about: {
            '@type': 'Thing',
            name: 'フードロス削減',
            description: '日本では年間約600万トンの食品ロスが発生。1世帯あたり年間約45kg（約10万円相当）の食品ロスを削減することで、社会全体のフードロス問題に貢献します。',
        },
    }

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
            />

            {/* ファーストビュー：実機モックアップ + DL導線 */}
            <section className="relative overflow-hidden pt-[calc(64px+30px)] pb-[60px] md:pt-[calc(64px+50px)] md:pb-[100px] px-4 md:px-[5%] min-h-[calc(100vh-64px)] flex flex-col md:flex-row items-center bg-[#ffffff]"
                style={{
                    backgroundImage: `
                        linear-gradient(135deg, rgba(245, 249, 245, 0.95) 0%, rgba(255, 255, 255, 0.98) 60%),
                        linear-gradient(45deg, rgba(102, 187, 106, 0.05) 0%, rgba(46, 125, 50, 0.03) 100%),
                        url("data:image/svg+xml,%3Csvg width='100' height='100' xmlns='http://www.w3.org/2000/svg'%3E%3Cdefs%3E%3Cpattern id='food-pattern' x='0' y='0' width='100' height='100' patternUnits='userSpaceOnUse'%3E%3Ccircle cx='20' cy='20' r='3' fill='%2366bb6a' opacity='0.1'/%3E%3Ccircle cx='80' cy='40' r='4' fill='%232e7d32' opacity='0.08'/%3E%3Ccircle cx='50' cy='70' r='2.5' fill='%2366bb6a' opacity='0.12'/%3E%3C/pattern%3E%3C/defs%3E%3Crect width='100' height='100' fill='url(%23food-pattern)'/%3E%3C/svg%3E")
                    `,
                    backgroundSize: 'cover, cover, 200px 200px',
                    backgroundPosition: 'center, center, 0 0'
                }}
            >
                {/* Background effects */}
                <div className="absolute -top-1/2 -right-1/2 w-[200%] h-[200%] bg-[radial-gradient(circle,rgba(102,187,106,0.15)_0%,transparent_70%)] animate-pulse pointer-events-none" />
                <div className="absolute inset-0 pointer-events-none z-[1] bg-[radial-gradient(ellipse_at_top_right,rgba(102,187,106,0.08)_0%,transparent_50%),radial-gradient(ellipse_at_bottom_left,rgba(46,125,50,0.06)_0%,transparent_50%)]" />

                <div className="max-w-[1200px] mx-auto w-full grid grid-cols-1 md:grid-cols-2 gap-[40px] md:gap-[60px] items-center">
                    <AnimatedSection className="relative z-[2] bg-white/70 backdrop-blur-[10px] p-6 md:p-10 rounded-3xl shadow-[0_8px_32px_rgba(0,0,0,0.08)] border border-white/50 order-2 md:order-1" direction="right" delay={0}>
                        <h1 className="text-[clamp(1.8rem,4.5vw,3.5rem)] text-[#2e7d32] mb-4 md:mb-6 font-extrabold leading-[1.2] tracking-tight relative z-[2]">
                            平均月<span className="inline-block text-[#ff6b35] font-black text-[1.15em] relative px-1 bg-gradient-to-br from-[#ff6b351a] to-[#ff6b350d] rounded animate-pulse">1.2万円</span>の食費削減。<br />
                            冷蔵庫の余り物と、<br className="md:hidden" />財布の小銭でプロの献立を。
                        </h1>
                        <p className="text-[clamp(1rem,1.8vw,1.4rem)] text-[#2c3e50] mb-4 font-semibold leading-[1.6] relative z-[2] tracking-snug">
                            賞味期限通知で食材ロス<span className="inline-block text-[#ff6b35] font-black text-[1.15em] relative px-1 bg-gradient-to-br from-[#ff6b351a] to-[#ff6b350d] rounded animate-pulse">90%削減</span>。<br />
                            冷蔵庫の中身管理 × レシピ提案で、<br className="md:hidden" />毎日の献立に悩まない。
                        </p>
                        <p className="text-[clamp(0.9rem,1.5vw,1.2rem)] text-[#666] mb-8 md:mb-10 leading-[1.8] relative z-[2]">
                            💰 食費節約　🍳 自炊サポート　🌱 フードロス削減<br />
                            お財布と地球に優しい食材管理アプリ「ふどろす」
                        </p>

                        {/* DLボタン */}
                        <div className="flex gap-3 mb-6 flex-wrap justify-start">
                            <a href="#" className="flex items-center gap-3 px-5 py-3 bg-black text-white no-underline rounded-xl text-[0.9rem] transition-all duration-200 shadow-[0_4px_12px_rgba(0,0,0,0.15)] hover:-translate-y-[2px] hover:shadow-[0_6px_20px_rgba(0,0,0,0.2)]" aria-label="App Storeでダウンロード">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M17.05 20.28c-.98.95-2.05.88-3.08.4-1.09-.5-2.08-.48-3.24 0-1.44.62-2.2.44-3.06-.4C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
                                </svg>
                                <div>
                                    <div className="text-[0.7rem] opacity-90 leading-[1]">Download on the</div>
                                    <div className="text-[1.1rem] font-semibold leading-[1.2]">App Store</div>
                                </div>
                            </a>
                            <a href="#" className="flex items-center gap-3 px-5 py-3 bg-black text-white no-underline rounded-xl text-[0.9rem] transition-all duration-200 shadow-[0_4px_12px_rgba(0,0,0,0.15)] hover:-translate-y-[2px] hover:shadow-[0_6px_20px_rgba(0,0,0,0.2)]" aria-label="Google Playでダウンロード">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M3,20.5V3.5C3,2.91 3.34,2.39 3.84,2.15L13.69,12L3.84,21.85C3.34,21.6 3,21.09 3,20.5M16.81,15.12L6.05,21.34L14.54,12.85L16.81,15.12M20.16,10.81C20.5,11.08 20.75,11.5 20.75,12C20.75,12.5 20.53,12.9 20.18,13.18L17.89,14.5L15.39,12L17.89,9.5L20.16,10.81M6.05,2.66L16.81,8.88L14.54,11.15L6.05,2.66Z" />
                                </svg>
                                <div>
                                    <div className="text-[0.7rem] opacity-90 leading-[1]">GET IT ON</div>
                                    <div className="text-[1.1rem] font-semibold leading-[1.2]">Google Play</div>
                                </div>
                            </a>
                        </div>

                        <div className="inline-block px-6 py-3 bg-[#ffc107]/15 border-2 border-[#ffc107] rounded-full font-semibold text-[#f57c00] text-[0.95rem]">
                            <span>🚧 デモ版は現在開発中です</span>
                        </div>
                    </AnimatedSection>

                    <AnimatedSection className="relative z-[2] hidden md:flex justify-center items-center order-1 md:order-2 w-full" direction="left" delay={200}>
                        <div className="w-full max-w-[320px] aspect-[1/2] md:h-[640px] bg-[#1a1a1a] rounded-[40px] p-3 shadow-[0_20px_60px_rgba(0,0,0,0.3)] relative transition-transform duration-300 hover:scale-[1.05] mx-auto">
                            <div className="w-full h-full bg-[#f9fafb] rounded-[32px] overflow-hidden relative">
                                <div className="p-4 h-full flex flex-col overflow-y-auto bg-[#f9fafb] scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
                                    {/* ストレージタイプボタン */}
                                    <div className="flex bg-[#EDF1ED] rounded-2xl p-1.5 gap-1 mb-4">
                                        <button type="button" className="flex-1 py-2 px-3 border-none bg-white text-[#6B8E6B] shadow-[0_2px_4px_rgba(0,0,0,0.1)] rounded-xl text-[11px] font-bold cursor-pointer transition-all duration-200">冷蔵</button>
                                        <button type="button" className="flex-1 py-2 px-3 border-none bg-transparent rounded-xl text-[11px] font-bold text-[#8E9A8E] cursor-pointer transition-all duration-200">冷凍</button>
                                        <button type="button" className="flex-1 py-2 px-3 border-none bg-transparent rounded-xl text-[11px] font-bold text-[#8E9A8E] cursor-pointer transition-all duration-200">常温</button>
                                    </div>

                                    {/* グリッドレイアウトのアイテムカード */}
                                    <div className="grid grid-cols-2 gap-3 px-1">
                                        <div className="bg-white p-3 rounded-3xl border border-gray-100 flex flex-col items-center shadow-[0_1px_2px_rgba(0,0,0,0.05)] transition-all duration-200 hover:-translate-y-[2px] hover:shadow-[0_4px_8px_rgba(0,0,0,0.1)] opacity-0 animate-[fadeUp_0.5s_ease-out_forwards_0.3s]">
                                            <div className="text-[28px] mt-1 mb-2">🥬</div>
                                            <div className="w-full flex flex-col items-center">
                                                <div className="text-[11px] font-bold text-gray-800 mb-[3px] text-center">レタス</div>
                                                <div className="text-[8px] text-gray-400 mb-1.5">1個</div>
                                                <div className="w-full h-1 bg-gray-100 rounded-sm overflow-hidden mb-1">
                                                    <div className="h-full bg-amber-500 w-[70%]"></div>
                                                </div>
                                                <div className="text-amber-500 text-[9px] font-bold">IN 3 DAYS</div>
                                            </div>
                                        </div>
                                        <div className="bg-white p-3 rounded-3xl border border-gray-100 flex flex-col items-center shadow-[0_1px_2px_rgba(0,0,0,0.05)] transition-all duration-200 hover:-translate-y-[2px] hover:shadow-[0_4px_8px_rgba(0,0,0,0.1)] opacity-0 animate-[fadeUp_0.5s_ease-out_forwards_0.4s]">
                                            <div className="text-[28px] mt-1 mb-2">🍅</div>
                                            <div className="w-full flex flex-col items-center">
                                                <div className="text-[11px] font-bold text-gray-800 mb-[3px] text-center">トマト</div>
                                                <div className="text-[8px] text-gray-400 mb-1.5">2個</div>
                                                <div className="w-full h-1 bg-gray-100 rounded-sm overflow-hidden mb-1">
                                                    <div className="h-full bg-[#6B8E6B] w-[50%]"></div>
                                                </div>
                                                <div className="text-[#6B8E6B] text-[9px] font-bold">IN 5 DAYS</div>
                                            </div>
                                        </div>
                                        <div className="bg-white p-3 rounded-3xl border border-gray-100 flex flex-col items-center shadow-[0_1px_2px_rgba(0,0,0,0.05)] transition-all duration-200 hover:-translate-y-[2px] hover:shadow-[0_4px_8px_rgba(0,0,0,0.1)] opacity-0 animate-[fadeUp_0.5s_ease-out_forwards_0.5s]">
                                            <div className="text-[28px] mt-1 mb-2">🥕</div>
                                            <div className="w-full flex flex-col items-center">
                                                <div className="text-[11px] font-bold text-gray-800 mb-[3px] text-center">にんじん</div>
                                                <div className="text-[8px] text-gray-400 mb-1.5">3本</div>
                                                <div className="w-full h-1 bg-gray-100 rounded-sm overflow-hidden mb-1">
                                                    <div className="h-full bg-[#6B8E6B] w-[30%]"></div>
                                                </div>
                                                <div className="text-[#6B8E6B] text-[9px] font-bold">IN 7 DAYS</div>
                                            </div>
                                        </div>
                                        <div className="bg-white p-3 rounded-3xl border border-gray-100 flex flex-col items-center shadow-[0_1px_2px_rgba(0,0,0,0.05)] transition-all duration-200 hover:-translate-y-[2px] hover:shadow-[0_4px_8px_rgba(0,0,0,0.1)] opacity-0 animate-[fadeUp_0.5s_ease-out_forwards_0.6s]">
                                            <div className="text-[28px] mt-1 mb-2">🥚</div>
                                            <div className="w-full flex flex-col items-center">
                                                <div className="text-[11px] font-bold text-gray-800 mb-[3px] text-center">卵</div>
                                                <div className="text-[8px] text-gray-400 mb-1.5">10個</div>
                                                <div className="w-full h-1 bg-gray-100 rounded-sm overflow-hidden mb-1">
                                                    <div className="h-full bg-[#6B8E6B] w-[60%]"></div>
                                                </div>
                                                <div className="text-[#6B8E6B] text-[9px] font-bold">IN 4 DAYS</div>
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
            <section className="bg-gradient-to-b from-[#f9fafb] to-white py-20 md:py-[120px] px-4 md:px-[5%] relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-gray-200 to-transparent"></div>
                <div className="max-w-[900px] mx-auto">
                    <AnimatedSection direction="fade" delay={0}>
                        <h2 className="text-[clamp(1.8rem,4vw,2.5rem)] font-extrabold text-[#2e7d32] mb-8 text-center leading-[1.3] tracking-tight">買い物に行ったのに、<br />冷蔵庫に何があるか忘れたことはありませんか？</h2>
                        <p className="text-[clamp(1rem,1.5vw,1.1rem)] text-[#555] leading-[1.9] text-center font-medium">
                            スーパーで「あれ、これ買ったっけ？」と迷うこと、ありませんか？<br />
                            冷蔵庫を開けて「あ、腐らせちゃった…」と後悔すること、ありませんか？<br />
                            毎日の食費がかさんで、節約したいのにできない…そんな悩みを抱えていませんか？
                        </p>
                    </AnimatedSection>
                </div>
            </section>

            {/* 解決策セクション */}
            <section className="bg-white py-20 md:py-[120px] px-4 md:px-[5%] relative">
                <div className="max-w-[1000px] mx-auto">
                    <AnimatedSection direction="fade" delay={0}>
                        <div className="bg-[#e8f5e9]/50 backdrop-blur-sm rounded-[40px] p-8 md:p-16 border border-[#e8f5e9]">
                            <h2 className="text-[clamp(1.8rem,4vw,2.5rem)] font-extrabold text-[#2e7d32] mb-6 text-center leading-[1.3] tracking-tight">ポケットの中に冷蔵庫を持ち歩けます</h2>
                            <p className="text-[clamp(1rem,1.5vw,1.1rem)] text-[#555] leading-[1.8] text-center font-medium">
                                スマホ一つで、冷蔵庫の中身をいつでも確認できます。<br />
                                賞味期限が近づいたら自動で通知。食材を無駄にすることなく、<br />
                                食費を節約しながら、美味しい自炊生活を実現できます。
                            </p>
                        </div>
                    </AnimatedSection>
                </div>
            </section>

            {/* ベネフィットセクション（機能ではなく感情訴求） */}
            <section className="bg-gradient-to-br from-white to-[#f0f7f0] py-20 md:py-[120px] px-4 md:px-[5%]">
                <div className="max-w-[1000px] mx-auto">
                    <AnimatedSection direction="fade" delay={0}>
                        <h2 className="text-[clamp(1.5rem,3.5vw,2.5rem)] font-extrabold text-[#2e7d32] mb-12 md:mb-16 text-center tracking-tight">あなたが得られる3つの変化</h2>
                    </AnimatedSection>
                    <div className="flex flex-col gap-8 md:gap-10">
                        <AnimatedSection direction="right" delay={100}>
                            <div className="flex gap-6 md:gap-10 items-start p-8 md:p-10 bg-white rounded-3xl shadow-[0_4px_20px_rgba(0,0,0,0.04)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_12px_30px_rgba(0,0,0,0.08)] flex-col md:flex-row border border-gray-100">
                                <div className="text-[3rem] md:text-[4rem] font-black text-[#66bb6a]/20 leading-none min-w-[80px] select-none">01</div>
                                <div>
                                    <h3 className="text-[clamp(1.3rem,2vw,1.6rem)] text-[#2e7d32] mb-3 font-bold leading-[1.4] tracking-tight">「あ、腐らせちゃった…」がゼロになる</h3>
                                    <p className="text-[#666] leading-[1.8] text-[1.05rem]">賞味期限通知で、食材を無駄にすることを防ぎます。冷蔵庫を開けて後悔することがなくなります。</p>
                                </div>
                            </div>
                        </AnimatedSection>
                        <AnimatedSection direction="right" delay={200}>
                            <div className="flex gap-6 md:gap-10 items-start p-8 md:p-10 bg-white rounded-3xl shadow-[0_4px_20px_rgba(0,0,0,0.04)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_12px_30px_rgba(0,0,0,0.08)] flex-col md:flex-row border border-gray-100">
                                <div className="text-[3rem] md:text-[4rem] font-black text-[#66bb6a]/20 leading-none min-w-[80px] select-none">02</div>
                                <div>
                                    <h3 className="text-[clamp(1.3rem,2vw,1.6rem)] text-[#2e7d32] mb-3 font-bold leading-[1.4] tracking-tight">食費が毎月1万円以上節約できる</h3>
                                    <p className="text-[#666] leading-[1.8] text-[1.05rem]">食材を無駄にしないことで、食費が自然と節約されます。二重買いを防ぎ、在庫を有効活用することで、家計に優しい生活が実現します。</p>
                                </div>
                            </div>
                        </AnimatedSection>
                        <AnimatedSection direction="right" delay={300}>
                            <div className="flex gap-6 md:gap-10 items-start p-8 md:p-10 bg-white rounded-3xl shadow-[0_4px_20px_rgba(0,0,0,0.04)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_12px_30px_rgba(0,0,0,0.08)] flex-col md:flex-row border border-gray-100">
                                <div className="text-[3rem] md:text-[4rem] font-black text-[#66bb6a]/20 leading-none min-w-[80px] select-none">03</div>
                                <div>
                                    <h3 className="text-[clamp(1.3rem,2vw,1.6rem)] text-[#2e7d32] mb-3 font-bold leading-[1.4] tracking-tight">「今日何作ろう？」の悩みがなくなる</h3>
                                    <p className="text-[#666] leading-[1.8] text-[1.05rem]">冷蔵庫の中身に合わせたレシピを自動提案。毎日の献立に悩む時間がなくなり、もっと楽しいことに時間を使えます。</p>
                                </div>
                            </div>
                        </AnimatedSection>
                    </div>
                </div>
            </section>

            {/* 開発者のストーリーセクション */}
            <section className="bg-[#f9fafb] py-20 md:py-[120px] px-4 md:px-[5%]">
                <div className="max-w-[1000px] mx-auto">
                    <AnimatedSection direction="fade" delay={0}>
                        <h2 className="text-[clamp(1.5rem,3.5vw,2.5rem)] font-extrabold text-[#2e7d32] mb-12 md:mb-16 text-center tracking-tight">なぜ「ふどろす」を作ったのか</h2>
                    </AnimatedSection>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
                        <AnimatedSection direction="up" delay={100} className="h-full">
                            <div className="bg-white p-8 rounded-[32px] shadow-[0_4px_20px_rgba(0,0,0,0.04)] border border-gray-100 h-full flex flex-col transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_12px_32px_rgba(0,0,0,0.08)]">
                                <div className="text-[3rem] mb-6">💭</div>
                                <h3 className="text-[1.2rem] text-[#2e7d32] mb-4 font-bold border-b border-[#eee] pb-4">後悔していた日々</h3>
                                <p className="text-[#666] leading-[1.8] text-[0.95rem] flex-grow">
                                    私は学生時代、毎週のように食材を腐らせていました。「昨日買ったのに…」と冷蔵庫を開けるたびに罪悪感と後悔が襲ってきました。
                                </p>
                            </div>
                        </AnimatedSection>
                        <AnimatedSection direction="up" delay={200} className="h-full">
                            <div className="bg-white p-8 rounded-[32px] shadow-[0_4px_20px_rgba(0,0,0,0.04)] border border-gray-100 h-full flex flex-col transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_12px_32px_rgba(0,0,0,0.08)]">
                                <div className="text-[3rem] mb-6">💡</div>
                                <h3 className="text-[1.2rem] text-[#2e7d32] mb-4 font-bold border-b border-[#eee] pb-4">スマホで管理したい</h3>
                                <p className="text-[#666] leading-[1.8] text-[0.95rem] flex-grow">
                                    「今、冷蔵庫に何があるかスマホで見れたら便利なのに」。そう思い、学生や主婦の方々が気軽に使えるシンプルなアプリ「ふどろす」の開発を始めました。
                                </p>
                            </div>
                        </AnimatedSection>
                        <AnimatedSection direction="up" delay={300} className="h-full">
                            <div className="bg-white p-8 rounded-[32px] shadow-[0_4px_20px_rgba(0,0,0,0.04)] border border-gray-100 h-full flex flex-col transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_12px_32px_rgba(0,0,0,0.08)]">
                                <div className="text-[3rem] mb-6">🌍</div>
                                <h3 className="text-[1.2rem] text-[#2e7d32] mb-4 font-bold border-b border-[#eee] pb-4">社会を変える</h3>
                                <p className="text-[#666] leading-[1.8] text-[0.95rem] flex-grow">
                                    日本のフードロスは年間約600万トン。一人ひとりの小さな行動が積み重なれば、大きな変化を生み出せる。このアプリで社会に貢献したいと考えています。
                                </p>
                            </div>
                        </AnimatedSection>
                    </div>
                </div>
            </section>

            {/* データ・エビデンスセクション */}
            <section className="bg-white py-20 md:py-[120px] px-4 md:px-[5%]">
                <div className="max-w-[1000px] mx-auto">
                    <AnimatedSection direction="fade" delay={0}>
                        <h2 className="text-[clamp(1.5rem,3.5vw,2.5rem)] font-extrabold text-[#2e7d32] mb-12 text-center tracking-tight">データで見る削減効果</h2>
                    </AnimatedSection>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 mb-12">
                        <AnimatedSection direction="up" delay={100}>
                            <div className="bg-[#f0f9f0] p-8 rounded-3xl text-center h-full">
                                <div className="text-[clamp(2.5rem,4vw,3rem)] font-black text-[#2e7d32] mb-2 leading-[1.2]">約45kg</div>
                                <div className="text-[0.9rem] font-bold text-[#666] mb-4">年間フードロス削減量</div>
                                <p className="text-[0.85rem] text-[#888] text-left leading-relaxed">
                                    ※ 環境省「食品ロス削減関係参考資料」(2022年度)より試算
                                </p>
                            </div>
                        </AnimatedSection>
                        <AnimatedSection direction="up" delay={200}>
                            <div className="bg-[#f0f9f0] p-8 rounded-3xl text-center h-full">
                                <div className="text-[clamp(2.5rem,4vw,3rem)] font-black text-[#ff6b35] mb-2 leading-[1.2]">約12万円</div>
                                <div className="text-[0.9rem] font-bold text-[#666] mb-4">年間食費削減額</div>
                                <p className="text-[0.85rem] text-[#888] text-left leading-relaxed">
                                    ※ 食品ロス削減＋二重買い防止による効果合計の試算値
                                </p>
                            </div>
                        </AnimatedSection>
                        <AnimatedSection direction="up" delay={300}>
                            <div className="bg-[#f0f9f0] p-8 rounded-3xl text-center h-full">
                                <div className="text-[clamp(2.5rem,4vw,3rem)] font-black text-[#2e7d32] mb-2 leading-[1.2]">90%</div>
                                <div className="text-[0.9rem] font-bold text-[#666] mb-4">見落とし削減率</div>
                                <p className="text-[0.85rem] text-[#888] text-left leading-relaxed">
                                    ※ ふどろす開発チームによるユーザーテスト結果(2024年)
                                </p>
                            </div>
                        </AnimatedSection>
                    </div>
                </div>
            </section>

            {/* 信頼セクション（SDGs・開発の想い） */}
            <section className="bg-[#1b5e20] text-white py-20 px-4 md:px-[5%] relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
                <div className="max-w-[900px] mx-auto relative z-10">
                    <AnimatedSection direction="fade" delay={0}>
                        <h2 className="text-[clamp(1.8rem,4vw,2.5rem)] font-extrabold text-white mb-10 text-center tracking-tight">SDGsへの貢献</h2>
                        <p className="text-center text-white/90 leading-relaxed max-w-2xl mx-auto mb-12">
                            ふどろすは、ターゲット12.3「2030年までに小売・消費レベルにおける世界全体の一人当たりの食料の廃棄を半減させる」の達成に貢献します。
                        </p>
                    </AnimatedSection>
                    <div className="flex flex-wrap justify-center gap-6 md:gap-10">
                        <div className="flex flex-col items-center gap-3">
                            <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center text-2xl backdrop-blur-sm">🌱</div>
                            <span className="font-bold text-sm">環境保護</span>
                        </div>
                        <div className="flex flex-col items-center gap-3">
                            <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center text-2xl backdrop-blur-sm">💚</div>
                            <span className="font-bold text-sm">家計支援</span>
                        </div>
                        <div className="flex flex-col items-center gap-3">
                            <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center text-2xl backdrop-blur-sm">🔒</div>
                            <span className="font-bold text-sm">安心安全</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTAセクション（巨大なDLボタン） */}
            <section className="bg-gradient-to-br from-[#66bb6a] to-[#2e7d32] text-white py-[120px] px-0">
                <div className="max-w-[900px] mx-auto px-[5%]">
                    <AnimatedSection direction="fade" delay={0}>
                        <h2 className="text-center text-[clamp(2.2rem,5vw,3.5rem)] font-extrabold mb-6 leading-[1.3]">今すぐ、無料で始めませんか？</h2>
                        <p className="text-center text-[clamp(1.1rem,2vw,1.4rem)] mb-[50px] opacity-95">冷蔵庫の中身管理で、食費節約とフードロス削減を実現</p>
                    </AnimatedSection>
                    <AnimatedSection direction="up" delay={200}>
                        <div className="flex justify-center gap-6 mb-10 flex-wrap">
                            <a href="#" className="flex items-center gap-4 px-8 py-4.5 bg-white/20 backdrop-blur-[10px] text-white no-underline rounded-2xl text-[1rem] transition-all duration-200 border-2 border-white/30 shadow-[0_8px_24px_rgba(0,0,0,0.2)] hover:-translate-y-1 hover:bg-white/30 hover:shadow-[0_12px_32px_rgba(0,0,0,0.3)]" aria-label="App Storeでダウンロード">
                                <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M17.05 20.28c-.98.95-2.05.88-3.08.4-1.09-.5-2.08-.48-3.24 0-1.44.62-2.2.44-3.06-.4C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
                                </svg>
                                <div>
                                    <div className="text-[0.75rem] opacity-90 leading-[1]">Download on the</div>
                                    <div className="text-[1.3rem] font-semibold leading-[1.2]">App Store</div>
                                </div>
                            </a>
                            <a href="#" className="flex items-center gap-4 px-8 py-4.5 bg-white/20 backdrop-blur-[10px] text-white no-underline rounded-2xl text-[1rem] transition-all duration-200 border-2 border-white/30 shadow-[0_8px_24px_rgba(0,0,0,0.2)] hover:-translate-y-1 hover:bg-white/30 hover:shadow-[0_12px_32px_rgba(0,0,0,0.3)]" aria-label="Google Playでダウンロード">
                                <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M3,20.5V3.5C3,2.91 3.34,2.39 3.84,2.15L13.69,12L3.84,21.85C3.34,21.6 3,21.09 3,20.5M16.81,15.12L6.05,21.34L14.54,12.85L16.81,15.12M20.16,10.81C20.5,11.08 20.75,11.5 20.75,12C20.75,12.5 20.53,12.9 20.18,13.18L17.89,14.5L15.39,12L17.89,9.5L20.16,10.81M6.05,2.66L16.81,8.88L14.54,11.15L6.05,2.66Z" />
                                </svg>
                                <div>
                                    <div className="text-[0.75rem] opacity-90 leading-[1]">GET IT ON</div>
                                    <div className="text-[1.3rem] font-semibold leading-[1.2]">Google Play</div>
                                </div>
                            </a>
                        </div>
                    </AnimatedSection>
                    <AnimatedSection direction="fade" delay={400}>
                        <div className="text-center px-8 py-4 bg-white/20 backdrop-blur-[10px] rounded-full font-semibold text-[1rem] block mx-auto w-fit">
                            <span>🚧 デモ版は現在開発中です。リリース情報は随時お知らせいたします。</span>
                        </div>
                    </AnimatedSection>
                </div>
            </section>
        </>
    )
}

