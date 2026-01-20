'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

export default function Header() {
    const [isMenuOpen, setIsMenuOpen] = useState(false)
    const [isScrolled, setIsScrolled] = useState(false)

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20)
        }
        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    useEffect(() => {
        if (isMenuOpen) {
            document.body.style.overflow = 'hidden'
        } else {
            document.body.style.overflow = ''
        }
        return () => {
            document.body.style.overflow = ''
        }
    }, [isMenuOpen])

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen)
    }

    const closeMenu = () => {
        setIsMenuOpen(false)
    }

    return (
        <>
            <header
                className={`fixed top-0 left-0 right-0 z-[1000] transition-all duration-300 border-b ${isScrolled
                        ? 'bg-white/98 shadow-md border-black/5 backdrop-blur-xl'
                        : 'bg-white/95 border-transparent backdrop-blur-xl'
                    }`}
                suppressHydrationWarning
            >
                <div className="max-w-[1200px] mx-auto px-[5%] py-4 flex justify-between items-center min-h-[60px] md:min-h-[64px]">
                    <Link href="/" className="text-2xl font-extrabold text-[#2e7d32] hover:text-[#66bb6a] transition-colors tracking-tighter no-underline" onClick={closeMenu}>
                        ふどろす
                    </Link>

                    {/* デスクトップナビゲーション */}
                    <nav className="hidden md:flex gap-8 items-center" suppressHydrationWarning>
                        {['ホーム', 'ブログ', '技術'].map((item, index) => (
                            <Link
                                key={index}
                                href={item === 'ホーム' ? '/' : `/${item === 'ブログ' ? 'blog' : 'tech'}`}
                                className="text-[0.95rem] font-medium text-gray-700 no-underline relative py-2 transition-colors hover:text-[#66bb6a] group"
                            >
                                {item}
                                <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-[#66bb6a] transition-all duration-300 group-hover:w-full" />
                            </Link>
                        ))}
                    </nav>

                    {/* ハンバーガーボタン */}
                    <button
                        type="button"
                        className="flex flex-col justify-around w-7 h-7 bg-transparent border-none cursor-pointer p-0 z-[1001] md:hidden"
                        onClick={toggleMenu}
                        aria-label={isMenuOpen ? 'メニューを閉じる' : 'メニューを開く'}
                        aria-expanded={isMenuOpen}
                    >
                        <span className={`w-full h-[2px] bg-[#2e7d32] rounded-sm transition-all duration-300 origin-center ${isMenuOpen ? 'rotate-45 translate-x-[5px] translate-y-[5px]' : ''}`} />
                        <span className={`w-full h-[2px] bg-[#2e7d32] rounded-sm transition-all duration-300 origin-center ${isMenuOpen ? 'opacity-0 -translate-x-2' : ''}`} />
                        <span className={`w-full h-[2px] bg-[#2e7d32] rounded-sm transition-all duration-300 origin-center ${isMenuOpen ? '-rotate-45 translate-x-[5px] -translate-y-[6px]' : ''}`} />
                    </button>
                </div>
            </header>

            {/* モバイルメニュー */}
            <div className={`fixed top-0 right-[-100%] w-[320px] max-w-[85vw] md:w-[400px] md:max-w-[90vw] h-screen bg-white shadow-xl transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] z-[1002] overflow-y-auto ${isMenuOpen ? 'right-0' : ''}`}>
                <div className="flex flex-col h-full p-0">
                    <div className="flex justify-between items-center px-6 py-5 border-b border-gray-200 bg-white sticky top-0 z-10">
                        <Link href="/" className="text-[1.3rem] font-extrabold text-[#2e7d32] no-underline" onClick={closeMenu}>
                            ふどろす
                        </Link>
                        <button
                            type="button"
                            className="w-10 h-10 flex items-center justify-center border-none bg-transparent rounded-xl cursor-pointer text-gray-500 transition-all duration-200 hover:bg-gray-100 hover:text-gray-700"
                            onClick={closeMenu}
                            aria-label="メニューを閉じる"
                        >
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <line x1="18" y1="6" x2="6" y2="18"></line>
                                <line x1="6" y1="6" x2="18" y2="18"></line>
                            </svg>
                        </button>
                    </div>
                    <nav className="flex flex-col gap-1 p-4" suppressHydrationWarning>
                        {[
                            { href: '/', label: 'ホーム' },
                            { href: '/blog', label: 'ブログ' },
                            { href: '/tech', label: '技術' },
                            { href: '/blog/my_fave/puroseka', label: 'プロジェクトセカイ' }
                        ].map((link, idx) => (
                            <Link
                                key={idx}
                                href={link.href}
                                className="flex items-center justify-between px-5 py-4 bg-white rounded-xl border border-gray-100 no-underline text-gray-700 font-medium text-[0.95rem] transition-all duration-200 hover:bg-gray-50 hover:border-gray-200 hover:translate-x-1"
                                onClick={closeMenu}
                            >
                                <span>{link.label}</span>
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-gray-300 shrink-0">
                                    <polyline points="9 18 15 12 9 6"></polyline>
                                </svg>
                            </Link>
                        ))}
                    </nav>
                </div>
            </div>

            {/* オーバーレイ */}
            {isMenuOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-[1001] animate-in fade-in duration-300"
                    onClick={closeMenu}
                    aria-hidden="true"
                />
            )}
        </>
    )
}
