import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import recipesData from '../../../../data/recipes.json'

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://www.hudorosu.com'

interface Recipe {
    slug: string
    title: string
    description: string
    keywords: string[]
    categoryId: string
    category: string
    cost: string
    time: string
    servings: string
    ingredients: string[]
    steps: string[]
    tips?: string
    image?: string
    relatedSlugs?: string[]
}

// レシピデータをマップに変換
const recipesMap: Record<string, Recipe> = {}
recipesData.recipes.forEach((recipe: Recipe) => {
    recipesMap[recipe.slug] = recipe
})

interface RecipePageProps {
    params: {
        slug: string
    }
}

export async function generateMetadata({ params }: RecipePageProps): Promise<Metadata> {
    const recipe = recipesMap[params.slug]
    
    if (!recipe) {
        return {
            title: 'レシピが見つかりません | ふどろす',
        }
    }

    return {
        title: `${recipe.title} | ふどろす - 冷蔵庫の中身管理アプリ`,
        description: recipe.description,
        keywords: [...recipe.keywords, 'ふどろす', '冷蔵庫管理', '食材管理', 'フードロス削減'],
        alternates: {
            canonical: `${BASE_URL}/blog/recipe/${params.slug}`,
        },
        openGraph: {
            title: recipe.title,
            description: recipe.description,
            url: `${BASE_URL}/blog/recipe/${params.slug}`,
            siteName: 'ふどろす',
            type: 'article',
        },
        twitter: {
            card: 'summary_large_image',
            title: recipe.title,
            description: recipe.description,
        },
    }
}

export default function RecipePage({ params }: RecipePageProps) {
    const recipe = recipesMap[params.slug]

    if (!recipe) {
        notFound()
    }

    // 関連記事を取得
    const relatedRecipes: Recipe[] = []
    if (recipe.relatedSlugs && recipe.relatedSlugs.length > 0) {
        recipe.relatedSlugs.forEach((slug) => {
            const relatedRecipe = recipesMap[slug]
            if (relatedRecipe) {
                relatedRecipes.push(relatedRecipe)
            }
        })
    }

    // 関連記事がない場合は、同じカテゴリIDの他の記事を表示
    if (relatedRecipes.length === 0) {
        recipesData.recipes.forEach((r: any) => {
            if (r.slug !== recipe.slug && r.categoryId === recipe.categoryId) {
                relatedRecipes.push(r)
            }
        })
        // 最大3件まで
        relatedRecipes.splice(3)
    }

    const structuredData = {
        '@context': 'https://schema.org',
        '@type': 'Recipe',
        name: recipe.title,
        description: recipe.description,
        image: recipe.image || `${BASE_URL}/og-image.jpg`,
        author: {
            '@type': 'Organization',
            name: 'ふどろす開発チーム',
        },
        datePublished: new Date().toISOString(),
        prepTime: `PT${recipe.time.replace('分', 'M')}`,
        totalTime: `PT${recipe.time.replace('分', 'M')}`,
        recipeYield: recipe.servings,
        recipeIngredient: recipe.ingredients,
        recipeInstructions: recipe.steps.map((step, index) => ({
            '@type': 'HowToStep',
            position: index + 1,
            text: step,
        })),
        nutrition: {
            '@type': 'NutritionInformation',
            calories: '約300kcal',
        },
        keywords: recipe.keywords.join(', '),
    }

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
            />
            
            <article className="recipe-page">
                {/* パンくずリスト */}
                <nav className="breadcrumb" aria-label="パンくずリスト">
                    <div className="container-recipe">
                        <ol className="breadcrumb-list">
                            <li><Link href="/">ホーム</Link></li>
                            <li><Link href="/blog">レシピ一覧</Link></li>
                            <li><Link href={`/blog?category=${recipe.categoryId}`}>{recipe.category}</Link></li>
                            <li aria-current="page">{recipe.title}</li>
                        </ol>
                    </div>
                </nav>

                {/* レシピヘッダー */}
                <header className="recipe-header">
                    <div className="container-recipe">
                        <div className="recipe-category-badge">{recipe.category}</div>
                        <h1 className="recipe-title">{recipe.title}</h1>
                        <p className="recipe-description">{recipe.description}</p>
                        
                        {/* レシピメタ情報 */}
                        <div className="recipe-meta">
                            <div className="meta-item">
                                <span className="meta-icon">💰</span>
                                <span className="meta-label">費用</span>
                                <span className="meta-value">{recipe.cost}</span>
                            </div>
                            <div className="meta-item">
                                <span className="meta-icon">⏱️</span>
                                <span className="meta-label">調理時間</span>
                                <span className="meta-value">{recipe.time}</span>
                            </div>
                            <div className="meta-item">
                                <span className="meta-icon">👥</span>
                                <span className="meta-label">人数</span>
                                <span className="meta-value">{recipe.servings}</span>
                            </div>
                        </div>
                    </div>
                </header>

                {/* レシピコンテンツ */}
                <div className="recipe-content">
                    <div className="container-recipe">
                        <div className="recipe-layout">
                            {/* メインコンテンツ */}
                            <main className="recipe-main">
                                {/* 材料 */}
                                <section className="recipe-section">
                                    <h2 className="section-heading">
                                        <span className="heading-icon">🥘</span>
                                        材料
                                    </h2>
                                    <ul className="ingredient-list">
                                        {recipe.ingredients.map((ingredient, index) => (
                                            <li key={index} className="ingredient-item">
                                                <span className="ingredient-checkbox">
                                                    <input type="checkbox" id={`ingredient-${index}`} />
                                                    <label htmlFor={`ingredient-${index}`}></label>
                                                </span>
                                                <span className="ingredient-text">{ingredient}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </section>

                                {/* 作り方 */}
                                <section className="recipe-section">
                                    <h2 className="section-heading">
                                        <span className="heading-icon">👨‍🍳</span>
                                        作り方
                                    </h2>
                                    <ol className="step-list">
                                        {recipe.steps.map((step, index) => (
                                            <li key={index} className="step-item">
                                                <div className="step-number">{index + 1}</div>
                                                <div className="step-content">
                                                    <p>{step}</p>
                                                </div>
                                            </li>
                                        ))}
                                    </ol>
                                </section>

                                {/* コツ・ポイント */}
                                {recipe.tips && (
                                    <section className="recipe-section recipe-tips">
                                        <h2 className="section-heading">
                                            <span className="heading-icon">💡</span>
                                            コツ・ポイント
                                        </h2>
                                        <div className="tips-content">
                                            <p>{recipe.tips}</p>
                                        </div>
                                    </section>
                                )}

                                {/* 関連記事セクション */}
                                {relatedRecipes.length > 0 && (
                                    <section className="recipe-section related-articles-section">
                                        <h2 className="section-heading">
                                            <span className="heading-icon">📚</span>
                                            関連記事
                                        </h2>
                                        <div className="related-articles-grid">
                                            {relatedRecipes.map((relatedRecipe) => (
                                                <Link
                                                    key={relatedRecipe.slug}
                                                    href={`/blog/recipe/${relatedRecipe.slug}`}
                                                    className="related-article-card"
                                                >
                                                    <div className="related-article-category">{relatedRecipe.category}</div>
                                                    <h3 className="related-article-title">{relatedRecipe.title}</h3>
                                                    <p className="related-article-description">{relatedRecipe.description}</p>
                                                    <div className="related-article-meta">
                                                        <span className="related-article-cost">💰 {relatedRecipe.cost}</span>
                                                        <span className="related-article-time">⏱️ {relatedRecipe.time}</span>
                                                    </div>
                                                </Link>
                                            ))}
                                        </div>
                                    </section>
                                )}

                                {/* ふどろすCTA */}
                                <section className="recipe-cta">
                                    <div className="cta-card">
                                        <div className="cta-icon">📱</div>
                                        <h3 className="cta-title">冷蔵庫の余り物を確認してから作ろう</h3>
                                        <p className="cta-description">
                                            ふどろすで冷蔵庫の中身を確認すれば、<br />
                                            無駄なく、効率的にレシピを作れます。
                                        </p>
                                        <Link href="/" className="cta-button">
                                            ふどろすをダウンロード
                                        </Link>
                                    </div>
                                </section>
                            </main>

                            {/* サイドバー */}
                            <aside className="recipe-sidebar">
                                <div className="sidebar-card">
                                    <h3 className="sidebar-title">人気のキーワード</h3>
                                    <div className="keyword-tags">
                                        {recipe.keywords.slice(0, 8).map((keyword, index) => (
                                            <Link 
                                                key={index} 
                                                href={`/blog?q=${encodeURIComponent(keyword)}`}
                                                className="keyword-tag"
                                            >
                                                {keyword}
                                            </Link>
                                        ))}
                                    </div>
                                </div>
                            </aside>
                        </div>
                    </div>
                </div>
            </article>
        </>
    )
}
