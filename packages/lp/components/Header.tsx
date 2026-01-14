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
            <header className={`modern-header ${isScrolled ? 'scrolled' : ''}`} suppressHydrationWarning>
                <div className="header-container-modern">
                    <Link href="/" className="logo-modern" onClick={closeMenu}>
                        ふどろす
                    </Link>
                    
                    {/* デスクトップナビゲーション */}
                    <nav className="desktop-nav" suppressHydrationWarning>
                        <Link href="/" className="nav-link">ホーム</Link>
                        <Link href="/blog" className="nav-link">ブログ</Link>
                        <Link href="/tech" className="nav-link">技術</Link>
                    </nav>

                    {/* ハンバーガーボタン */}
                    <button
                        type="button"
                        className={`hamburger-modern ${isMenuOpen ? 'active' : ''}`}
                        onClick={toggleMenu}
                        aria-label={isMenuOpen ? 'メニューを閉じる' : 'メニューを開く'}
                        aria-expanded={isMenuOpen}
                    >
                        <span></span>
                        <span></span>
                        <span></span>
                    </button>
                </div>
            </header>
            
            {/* モバイルメニュー */}
            <div className={`mobile-menu ${isMenuOpen ? 'open' : ''}`}>
                <div className="mobile-menu-content">
                    <div className="mobile-menu-header">
                        <Link href="/" className="mobile-logo" onClick={closeMenu}>
                            ふどろす
                        </Link>
                        <button
                            type="button"
                            className="mobile-menu-close"
                            onClick={closeMenu}
                            aria-label="メニューを閉じる"
                        >
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <line x1="18" y1="6" x2="6" y2="18"></line>
                                <line x1="6" y1="6" x2="18" y2="18"></line>
                            </svg>
                        </button>
                    </div>
                    <nav className="mobile-nav" suppressHydrationWarning>
                        <Link href="/" className="mobile-nav-link" onClick={closeMenu}>
                            <span>ホーム</span>
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <polyline points="9 18 15 12 9 6"></polyline>
                            </svg>
                        </Link>
                        <Link href="/blog" className="mobile-nav-link" onClick={closeMenu}>
                            <span>ブログ</span>
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <polyline points="9 18 15 12 9 6"></polyline>
                            </svg>
                        </Link>
                        <Link href="/tech" className="mobile-nav-link" onClick={closeMenu}>
                            <span>技術</span>
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <polyline points="9 18 15 12 9 6"></polyline>
                            </svg>
                        </Link>
                        <Link href="/blog/my_fave/puroseka" className="mobile-nav-link" onClick={closeMenu}>
                            <span>プロジェクトセカイ</span>
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <polyline points="9 18 15 12 9 6"></polyline>
                            </svg>
                        </Link>
                    </nav>
                </div>
            </div>

            {/* オーバーレイ */}
            {isMenuOpen && (
                <div 
                    className="menu-overlay-modern"
                    onClick={closeMenu}
                    aria-hidden="true"
                />
            )}
        </>
    )
}
