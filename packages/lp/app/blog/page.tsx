import type { Metadata } from 'next'
import { Suspense } from 'react'
import recipesData from '../../data/recipes.json'
import BlogClient from './BlogClient'

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://www.hudorosu.com'

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

// レシピデータをブログ投稿形式に変換
function getBlogPosts(): BlogPost[] {
    return recipesData.recipes.map((recipe: any) => ({
        slug: recipe.slug,
        title: recipe.title,
        description: recipe.description,
        categoryId: recipe.categoryId,
        category: recipe.category,
        date: new Date().toISOString().split('T')[0],
        keywords: recipe.keywords || [],
        cost: recipe.cost,
        time: recipe.time,
    }))
}

// 全カテゴリを取得
function getCategories(): Category[] {
    return recipesData.categories || []
}

// 動的メタデータ生成
export async function generateMetadata({
    searchParams,
}: {
    searchParams: { category?: string; q?: string; page?: string }
}): Promise<Metadata> {
    const blogPosts = getBlogPosts()
    const categories = getCategories()
    const categoryId = searchParams?.category || ''
    const keyword = searchParams?.q || ''
    const page = parseInt(searchParams?.page || '1', 10)

    // フィルタリング
    let filteredPosts = blogPosts
    if (categoryId) {
        filteredPosts = filteredPosts.filter((post) => post.categoryId === categoryId)
    }
    if (keyword) {
        const keywordLower = keyword.toLowerCase()
        filteredPosts = filteredPosts.filter((post) => {
            const matchesTitle = post.title.toLowerCase().includes(keywordLower)
            const matchesDescription = post.description.toLowerCase().includes(keywordLower)
            const matchesKeywords = post.keywords.some((k) => k.toLowerCase().includes(keywordLower))
            return matchesTitle || matchesDescription || matchesKeywords
        })
    }

    const category = categories.find((c) => c.id === categoryId)
    const totalPosts = filteredPosts.length
    const pageInfo = page > 1 ? ` - ${page}ページ目` : ''

    let title = 'ブログ | ふどろす - 節約レシピ・冷蔵庫管理のコツ'
    let description = '冷蔵庫の余り物で作る節約レシピ、給料日前のメニュー、食材管理のコツなど、ふどろすがお届けする実用的な記事一覧。'

    if (category) {
        title = `${category.name} | ブログ | ふどろす${pageInfo}`
        description = `${category.name}に関する記事一覧。${totalPosts}件の記事を掲載中。`
    } else if (keyword) {
        title = `「${keyword}」の検索結果 | ブログ | ふどろす${pageInfo}`
        description = `「${keyword}」に関する記事を${totalPosts}件見つけました。`
    } else if (page > 1) {
        title = `ブログ | ふどろす - ${page}ページ目`
    }

    return {
        title,
        description,
        keywords: [
            '節約レシピ',
            '冷蔵庫 余り物',
            '給料日前 メニュー',
            '食材管理',
            'ふどろす',
            'フードロス削減',
            ...(category ? [category.name] : []),
        ],
        alternates: {
            canonical: categoryId || keyword || page > 1
                ? `${BASE_URL}/blog?${new URLSearchParams({
                      ...(categoryId ? { category: categoryId } : {}),
                      ...(keyword ? { q: keyword } : {}),
                      ...(page > 1 ? { page: page.toString() } : {}),
                  }).toString()}`
                : `${BASE_URL}/blog`,
        },
        openGraph: {
            title,
            description,
            url: `${BASE_URL}/blog`,
            siteName: 'ふどろす',
            type: 'website',
        },
        twitter: {
            card: 'summary_large_image',
            title,
            description,
        },
    }
}

export default function BlogPage({
    searchParams,
}: {
    searchParams: { category?: string; q?: string; page?: string }
}) {
    const blogPosts = getBlogPosts()
    const categories = getCategories()
    const categoryId = searchParams?.category || ''
    const keyword = searchParams?.q || ''
    const page = parseInt(searchParams?.page || '1', 10)

    // 構造化データ（CollectionPage Schema）
    const structuredData = {
        '@context': 'https://schema.org',
        '@type': 'CollectionPage',
        name: 'ブログ | ふどろす',
        description: '冷蔵庫の余り物で作る節約レシピ、給料日前のメニュー、食材管理のコツなど、ふどろすがお届けする実用的な記事一覧。',
        url: `${BASE_URL}/blog`,
        mainEntity: {
            '@type': 'ItemList',
            numberOfItems: blogPosts.length,
            itemListElement: blogPosts.slice(0, 20).map((post, index) => ({
                '@type': 'ListItem',
                position: index + 1,
                item: {
                    '@type': 'Article',
                    '@id': `${BASE_URL}/blog/recipe/${post.slug}`,
                    name: post.title,
                    description: post.description,
                },
            })),
        },
    }

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
            />
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

                <Suspense fallback={
                    <div className="blog-loading">
                        <div className="loading-spinner"></div>
                        <p className="loading-text">読み込み中...</p>
                    </div>
                }>
                    <BlogClient
                        initialPosts={blogPosts}
                        categories={categories}
                        initialCategoryId={categoryId}
                        initialKeyword={keyword}
                        initialPage={page}
                    />
                </Suspense>
            </div>
        </>
    )
}
