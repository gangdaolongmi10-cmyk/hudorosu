'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import recipesData from '../../data/recipes.json'

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

// カテゴリマップを作成
const categoriesMap: Record<string, Category> = {}
recipesData.categories.forEach((cat: Category) => {
    categoriesMap[cat.id] = cat
})

// レシピデータをブログ投稿形式に変換
const blogPosts: BlogPost[] = recipesData.recipes.map((recipe: any) => ({
    slug: recipe.slug,
    title: recipe.title,
    description: recipe.description,
    categoryId: recipe.categoryId,
    category: recipe.category,
    date: new Date().toISOString().split('T')[0], // 現在の日付を使用（実際にはデータから取得）
    keywords: recipe.keywords || [],
    cost: recipe.cost,
    time: recipe.time,
}))

// 全カテゴリを取得
const allCategories: Category[] = recipesData.categories || []

export default function BlogPage() {
    const searchParams = useSearchParams()
    const categoryIdParam = searchParams.get('category') || ''
    const keywordParam = searchParams.get('q') || ''
    
    const [selectedCategoryId, setSelectedCategoryId] = useState(categoryIdParam)
    const [searchKeyword, setSearchKeyword] = useState(keywordParam)

    // フィルタリング処理
    const filteredPosts = useMemo(() => {
        let filtered = blogPosts

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
    }, [selectedCategoryId, searchKeyword])

    // URLを生成する関数
    const buildUrl = (categoryId?: string, keyword?: string) => {
        const params = new URLSearchParams()
        if (categoryId) params.set('category', categoryId)
        if (keyword) params.set('q', keyword)
        const queryString = params.toString()
        return queryString ? `/blog?${queryString}` : '/blog'
    }

    const handleCategoryChange = (categoryId: string) => {
        const newCategoryId = selectedCategoryId === categoryId ? '' : categoryId
        setSelectedCategoryId(newCategoryId)
        window.history.pushState(
            {},
            '',
            buildUrl(newCategoryId, searchKeyword)
        )
    }

    const handleKeywordSearch = (keyword: string) => {
        setSearchKeyword(keyword)
        window.history.pushState(
            {},
            '',
            buildUrl(selectedCategoryId, keyword)
        )
    }

    const clearFilters = () => {
        setSelectedCategoryId('')
        setSearchKeyword('')
        window.history.pushState({}, '', '/blog')
    }

    return (
        <div className="blog-page">
            {/* ヘッダー */}
            <header className="blog-header">
                <div className="container-blog">
                    <h1 className="blog-title">ブログ</h1>
                    <p className="blog-description">
                        冷蔵庫の余り物で作る節約レシピ、給料日前のメニュー、<br />
                        食材管理のコツなど、実用的な記事をお届けします。
                    </p>
                </div>
            </header>

            {/* フィルターセクション */}
            <div className="blog-filters">
                <div className="container-blog">
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
                                {allCategories.map((category) => (
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
                <div className="container-blog">
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
                            <div className="blog-grid">
                                {filteredPosts.map((post) => (
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

                            {/* カテゴリ一覧（サイドバー的な位置） */}
                            <div className="blog-categories">
                                <h2 className="categories-title">カテゴリ一覧</h2>
                                <div className="category-tags">
                                    {allCategories.map((category) => {
                                        const count = blogPosts.filter((p) => p.categoryId === category.id).length
                                        return (
                                            <Link
                                                key={category.id}
                                                href={buildUrl(category.id, searchKeyword)}
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
        </div>
    )
}
