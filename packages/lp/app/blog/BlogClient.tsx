'use client'

import { useState, useMemo, useEffect } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'

interface BlogPost {
    slug: string
    title: string
    description: string
    categoryId: string
    category: string
    date: string
    keywords: string[]
    cost?: string
    time?: string
}

interface Category {
    id: string
    name: string
}

interface BlogClientProps {
    initialPosts: BlogPost[]
    categories: Category[]
    initialCategoryId?: string
    initialKeyword?: string
    initialPage?: number
}

const ITEMS_PER_PAGE = 12

export default function BlogClient({
    initialPosts,
    categories,
    initialCategoryId = '',
    initialKeyword = '',
    initialPage = 1,
}: BlogClientProps) {
    const searchParams = useSearchParams()
    const categoryIdParam = searchParams.get('category') || initialCategoryId
    const keywordParam = searchParams.get('q') || initialKeyword
    const pageParam = parseInt(searchParams.get('page') || initialPage.toString(), 10)

    const [selectedCategoryId, setSelectedCategoryId] = useState(categoryIdParam)
    const [searchKeyword, setSearchKeyword] = useState(keywordParam)
    const [currentPage, setCurrentPage] = useState(pageParam)
    const [isLoading, setIsLoading] = useState(false)

    // フィルタリング処理
    const filteredPosts = useMemo(() => {
        let filtered = initialPosts

        // カテゴリIDで絞り込み
        if (selectedCategoryId) {
            filtered = filtered.filter((post) => post.categoryId === selectedCategoryId)
        }

        // キーワードで絞り込み
        if (searchKeyword) {
            const keyword = searchKeyword.toLowerCase()
            filtered = filtered.filter((post) => {
                const matchesTitle = post.title.toLowerCase().includes(keyword)
                const matchesDescription = post.description.toLowerCase().includes(keyword)
                const matchesKeywords = post.keywords.some((k) => k.toLowerCase().includes(keyword))
                return matchesTitle || matchesDescription || matchesKeywords
            })
        }

        return filtered
    }, [initialPosts, selectedCategoryId, searchKeyword])

    // ページネーション計算
    const totalPages = Math.ceil(filteredPosts.length / ITEMS_PER_PAGE)
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
    const endIndex = startIndex + ITEMS_PER_PAGE
    const paginatedPosts = filteredPosts.slice(startIndex, endIndex)

    // フィルター変更時にページを1にリセット
    useEffect(() => {
        setCurrentPage(1)
    }, [selectedCategoryId, searchKeyword])

    // URLパラメータと同期
    useEffect(() => {
        const page = parseInt(searchParams.get('page') || '1', 10)
        if (page !== currentPage) {
            setCurrentPage(page)
        }
    }, [searchParams, currentPage])

    // URLを生成する関数
    const buildUrl = (categoryId?: string, keyword?: string, page?: number) => {
        const params = new URLSearchParams()
        if (categoryId) params.set('category', categoryId)
        if (keyword) params.set('q', keyword)
        if (page && page > 1) params.set('page', page.toString())
        const queryString = params.toString()
        return queryString ? `/blog?${queryString}` : '/blog'
    }

    // ページ変更ハンドラー
    const handlePageChange = (page: number) => {
        setIsLoading(true)
        setCurrentPage(page)
        window.history.pushState(
            {},
            '',
            buildUrl(selectedCategoryId, searchKeyword, page)
        )
        // スクロールをトップに
        window.scrollTo({ top: 0, behavior: 'smooth' })
        // ローディングを解除
        setTimeout(() => setIsLoading(false), 300)
    }

    const handleCategoryChange = (categoryId: string) => {
        setIsLoading(true)
        const newCategoryId = selectedCategoryId === categoryId ? '' : categoryId
        setSelectedCategoryId(newCategoryId)
        window.history.pushState(
            {},
            '',
            buildUrl(newCategoryId, searchKeyword, 1)
        )
        setTimeout(() => setIsLoading(false), 300)
    }

    const handleKeywordSearch = (keyword: string) => {
        setIsLoading(true)
        setSearchKeyword(keyword)
        window.history.pushState(
            {},
            '',
            buildUrl(selectedCategoryId, keyword, 1)
        )
        setTimeout(() => setIsLoading(false), 300)
    }

    const clearFilters = () => {
        setIsLoading(true)
        setSelectedCategoryId('')
        setSearchKeyword('')
        window.history.pushState({}, '', '/blog')
        setTimeout(() => setIsLoading(false), 300)
    }

    return (
        <>
            {/* フィルターセクション */}
            <div className="blog-filters">
                <div className="max-w-[1200px] mx-auto px-5 md:px-8 lg:px-12">
                    <div className="filters-container">
                        {/* キーワード検索 */}
                        <div className="filter-group">
                            <label htmlFor="keyword-search" className="filter-label">
                                🔍 キーワード検索
                            </label>
                            <div className="search-input-wrapper">
                                <input
                                    id="keyword-search"
                                    type="text"
                                    value={searchKeyword}
                                    onChange={(e) => handleKeywordSearch(e.target.value)}
                                    placeholder="レシピ名やキーワードで検索..."
                                    className="search-input"
                                />
                                {searchKeyword && (
                                    <button
                                        type="button"
                                        onClick={() => handleKeywordSearch('')}
                                        className="search-clear"
                                        aria-label="検索をクリア"
                                    >
                                        ×
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* カテゴリフィルター */}
                        <div className="filter-group">
                            <label className="filter-label">📁 カテゴリ</label>
                            <div className="category-filters">
                                <button
                                    type="button"
                                    onClick={clearFilters}
                                    className={`category-filter-btn ${!selectedCategoryId && !searchKeyword ? 'active' : ''}`}
                                >
                                    すべて
                                </button>
                                {categories.map((category) => (
                                    <button
                                        key={category.id}
                                        type="button"
                                        onClick={() => handleCategoryChange(category.id)}
                                        className={`category-filter-btn ${selectedCategoryId === category.id ? 'active' : ''}`}
                                    >
                                        {category.name}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* フィルター結果表示 */}
                        {(selectedCategoryId || searchKeyword) && (
                            <div className="filter-results">
                                <span className="results-count">
                                    {filteredPosts.length}件の記事が見つかりました
                                </span>
                                <button
                                    type="button"
                                    onClick={clearFilters}
                                    className="clear-filters-btn"
                                >
                                    フィルターをクリア
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* 記事一覧 */}
            <div className="blog-content">
                <div className="max-w-[1200px] mx-auto px-5 md:px-8 lg:px-12">
                    {filteredPosts.length === 0 ? (
                        <div className="no-results">
                            <div className="no-results-icon">🔍</div>
                            <h2 className="no-results-title">記事が見つかりませんでした</h2>
                            <p className="no-results-description">
                                検索条件を変更して、もう一度お試しください。
                            </p>
                            <button
                                type="button"
                                onClick={clearFilters}
                                className="clear-filters-btn-large"
                            >
                                すべてのフィルターをクリア
                            </button>
                        </div>
                    ) : (
                        <>
                            {isLoading ? (
                                <div className="blog-loading">
                                    <div className="loading-spinner"></div>
                                    <p className="loading-text">読み込み中...</p>
                                </div>
                            ) : (
                                <>
                                    <div className="blog-grid">
                                        {paginatedPosts.map((post) => (
                                            <article key={post.slug} className="blog-card">
                                                <Link href={`/blog/recipe/${post.slug}`} className="blog-card-link">
                                                    <div className="blog-card-header">
                                                        <span className="blog-category">{post.category}</span>
                                                        <time className="blog-date" dateTime={post.date}>
                                                            {new Date(post.date).toLocaleDateString('ja-JP', {
                                                                year: 'numeric',
                                                                month: 'long',
                                                                day: 'numeric',
                                                            })}
                                                        </time>
                                                    </div>
                                                    <h2 className="blog-card-title">{post.title}</h2>
                                                    <p className="blog-card-description">{post.description}</p>
                                                    {post.cost && post.time && (
                                                        <div className="blog-card-meta">
                                                            <span className="blog-meta-item">💰 {post.cost}</span>
                                                            <span className="blog-meta-item">⏱️ {post.time}</span>
                                                        </div>
                                                    )}
                                                    <div className="blog-card-footer">
                                                        <span className="blog-read-more">続きを読む →</span>
                                                    </div>
                                                </Link>
                                            </article>
                                        ))}
                                    </div>

                                    {/* ページネーション */}
                                    {totalPages > 1 && (
                                        <div className="blog-pagination">
                                            <div className="pagination-info">
                                                {startIndex + 1} - {Math.min(endIndex, filteredPosts.length)} / {filteredPosts.length}件
                                            </div>
                                            <nav className="pagination-nav" aria-label="ページネーション">
                                                <button
                                                    type="button"
                                                    onClick={() => handlePageChange(currentPage - 1)}
                                                    disabled={currentPage === 1}
                                                    className="pagination-btn pagination-btn-prev"
                                                    aria-label="前のページ"
                                                >
                                                    ← 前へ
                                                </button>

                                                <div className="pagination-numbers">
                                                    {Array.from({ length: totalPages }, (_, i) => i + 1)
                                                        .filter((page) => {
                                                            // 最初のページ、最後のページ、現在のページの前後2ページを表示
                                                            return (
                                                                page === 1 ||
                                                                page === totalPages ||
                                                                (page >= currentPage - 2 && page <= currentPage + 2)
                                                            )
                                                        })
                                                        .map((page, index, array) => {
                                                            // 省略記号を挿入
                                                            const prevPage = array[index - 1]
                                                            const showEllipsis = prevPage && page - prevPage > 1

                                                            return (
                                                                <div key={page} className="pagination-number-group">
                                                                    {showEllipsis && (
                                                                        <span className="pagination-ellipsis">...</span>
                                                                    )}
                                                                    <button
                                                                        type="button"
                                                                        onClick={() => handlePageChange(page)}
                                                                        className={`pagination-number ${currentPage === page ? 'active' : ''}`}
                                                                        aria-label={`ページ ${page}`}
                                                                        aria-current={currentPage === page ? 'page' : undefined}
                                                                    >
                                                                        {page}
                                                                    </button>
                                                                </div>
                                                            )
                                                        })}
                                                </div>

                                                <button
                                                    type="button"
                                                    onClick={() => handlePageChange(currentPage + 1)}
                                                    disabled={currentPage === totalPages}
                                                    className="pagination-btn pagination-btn-next"
                                                    aria-label="次のページ"
                                                >
                                                    次へ →
                                                </button>
                                            </nav>
                                        </div>
                                    )}
                                </>
                            )}

                            {/* カテゴリ一覧（サイドバー的な位置） */}
                            <div className="blog-categories">
                                <h2 className="categories-title">カテゴリ一覧</h2>
                                <div className="category-tags">
                                    {categories.map((category) => {
                                        const count = initialPosts.filter((p) => p.categoryId === category.id).length
                                        return (
                                            <Link
                                                key={category.id}
                                                href={buildUrl(category.id, searchKeyword, 1)}
                                                className={`category-tag ${selectedCategoryId === category.id ? 'active' : ''}`}
                                            >
                                                {category.name} ({count})
                                            </Link>
                                        )
                                    })}
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </>
    )
}
