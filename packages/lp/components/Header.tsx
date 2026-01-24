'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { signOut, useSession } from 'next-auth/react'

export default function Header() {
    const [isMenuOpen, setIsMenuOpen] = useState(false)
    const [isScrolled, setIsScrolled] = useState(false)
    const pathname = usePathname()
    const { data: session } = useSession()

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

    const isActive = (href: string) => {
        return pathname === href
    }

    return (
        <>
            <header
                className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 border-b ${isScrolled
                    ? 'bg-white shadow-md border-gray-100'
                    : 'bg-white/95 border-transparent backdrop-blur-md'
                    }`}
                suppressHydrationWarning
            >
                <div className="max-w-[1200px] mx-auto px-[5%] py-4 flex justify-between items-center min-h-[60px] md:min-h-[64px]">
                    <Link href="/" className="text-2xl font-extrabold text-[#2e7d32] hover:text-[#66bb6a] transition-colors tracking-tighter no-underline" onClick={closeMenu}>
                        ふどろす
                    </Link>

                    <div className="flex items-center">
                        <button
                            type="button"
                            className="flex flex-col justify-around w-7 h-7 bg-transparent border-none cursor-pointer p-0 z-50 relative"
                            onClick={toggleMenu}
                            aria-label={isMenuOpen ? 'メニューを閉じる' : 'メニューを開く'}
                        >
                            <span className={`w-full h-[2.5px] bg-[#2e7d32] rounded-sm transition-all duration-300 ${isMenuOpen ? 'rotate-45 translate-y-[8px]' : ''}`} />
                            <span className={`w-full h-[2.5px] bg-[#2e7d32] rounded-sm transition-all duration-300 ${isMenuOpen ? 'opacity-0' : ''}`} />
                            <span className={`w-full h-[2.5px] bg-[#2e7d32] rounded-sm transition-all duration-300 ${isMenuOpen ? '-rotate-45 -translate-y-[8px]' : ''}`} />
                        </button>
                    </div>
                </div>
            </header>

            {/* サイドメニュー */}
            <div
                className={`fixed top-0 right-0 w-[300px] sm:w-[400px] h-screen bg-white shadow-2xl z-[60] transition-transform duration-300 ease-in-out transform ${isMenuOpen ? 'translate-x-0' : 'translate-x-full'
                    }`}
            >
                <div className="flex flex-col h-full">
                    <div className="flex justify-between items-center px-6 py-5 border-b border-gray-100">
                        <span className="text-[1.2rem] font-bold text-[#2e7d32]">メニュー</span>
                        <button
                            onClick={closeMenu}
                            className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                        >
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <line x1="18" y1="6" x2="6" y2="18"></line>
                                <line x1="6" y1="6" x2="18" y2="18"></line>
                            </svg>
                        </button>
                    </div>

                    <nav className="flex flex-col gap-1 p-4 overflow-y-auto">
                        {[
                            { href: '/', label: 'ホーム' },
                            { href: '/shopping-list', label: 'お買い物リスト' },
                            ...(!session ? [
                                { href: '/login', label: 'ログイン' },
                                { href: '/signup', label: '新規登録' }
                            ] : [
                                { href: '#', label: `ログアウト (${session.user?.name})`, onClick: () => signOut() }
                            ]),
                            { href: '/blog', label: 'ブログ' },
                            { href: '/news', label: 'お知らせ' },
                            { href: '/tech', label: '技術' },
                            { href: '/blog/my_fave/puroseka', label: 'プロジェクトセカイ' }
                        ].map((link, idx) => {
                            const active = isActive(link.href)
                            const isAction = (link as any).onClick !== undefined

                            const content = (
                                <div
                                    key={idx}
                                    className={`flex items-center justify-between px-5 py-4 rounded-xl border no-underline font-medium text-[0.95rem] transition-all duration-200 cursor-pointer ${active
                                        ? 'bg-[#e8f5e9] border-[#66bb6a] text-[#2e7d32]'
                                        : 'bg-white border-transparent text-gray-700 hover:bg-gray-50 hover:border-gray-100 hover:translate-x-1'
                                        }`}
                                    onClick={() => {
                                        if (isAction) (link as any).onClick()
                                        closeMenu()
                                    }}
                                >
                                    <span>{link.label}</span>
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className={`${active ? 'text-[#66bb6a]' : 'text-gray-300'}`}>
                                        <polyline points="9 18 15 12 9 6"></polyline>
                                    </svg>
                                </div>
                            )

                            if (isAction) return <div key={idx}>{content}</div>

                            return (
                                <Link
                                    key={idx}
                                    href={link.href}
                                    className="no-underline"
                                >
                                    {content}
                                </Link>
                            )
                        })}
                    </nav>
                </div>
            </div>

            {/* オーバーレイ */}
            <div
                className={`fixed inset-0 bg-black/40 z-50 transition-opacity duration-300 ${isMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
                    }`}
                onClick={closeMenu}
            />
        </>
    )
}
