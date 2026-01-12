'use client'

import { useState } from 'react'
import Link from 'next/link'

export default function Header() {
    const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false)

    const toggleMenu = (): void => {
        setIsMenuOpen(!isMenuOpen)
    }

    const closeMenu = (): void => {
        setIsMenuOpen(false)
    }

    return (
        <header>
            <div className="header-container">
                <Link href="/" className="logo" onClick={closeMenu}>
                    ふどろす
                </Link>
                <button
                    type="button"
                    className="hamburger-menu"
                    onClick={toggleMenu}
                    aria-label={isMenuOpen ? 'メニューを閉じる' : 'メニューを開く'}
                    aria-expanded={isMenuOpen}
                >
                    <span className={isMenuOpen ? 'active' : ''}></span>
                    <span className={isMenuOpen ? 'active' : ''}></span>
                    <span className={isMenuOpen ? 'active' : ''}></span>
                </button>
            </div>
            <nav className={`nav-menu ${isMenuOpen ? 'open' : ''}`}>
                <Link href="/" onClick={closeMenu}>
                    ホーム
                </Link>
                <Link href="/blog/my_fave/puroseka" onClick={closeMenu}>
                    プロジェクトセカイ
                </Link>
            </nav>
        </header>
    )
}
