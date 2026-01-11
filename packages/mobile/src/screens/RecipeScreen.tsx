import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    Image,
    ActivityIndicator,
    TouchableOpacity,
    Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { fetchRecommendedRecipes, fetchRecommendedRecipesByBudget, Recipe, RecommendedRecipesByBudgetResponse } from '../services/recipeService';
import { toggleFavorite } from '../services/favoriteService';
import FlashMessage from '../components/FlashMessage';

interface RecipeScreenProps {
    onNavigateToRecipeDetail?: (recipeId: number) => void;
}

type TabType = 'budget' | 'stock';

export default function RecipeScreen({ onNavigateToRecipeDetail }: RecipeScreenProps) {
    const [activeTab, setActiveTab] = useState<TabType>('budget');
    const [stockRecipes, setStockRecipes] = useState<Recipe[]>([]);
    const [budgetRecipes, setBudgetRecipes] = useState<Recipe[]>([]);
    const [budgetInfo, setBudgetInfo] = useState<{ daily_food_budget: number | null; message: string } | null>(null);
    const [loading, setLoading] = useState(true);
    const [budgetLoading, setBudgetLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [flashMessage, setFlashMessage] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);
    const [togglingFavorite, setTogglingFavorite] = useState<number | null>(null);

    useEffect(() => {
        loadRecipes();
    }, []);

    const loadRecipes = async () => {
        try {
            setLoading(true);
            setBudgetLoading(true);
            setError(null);
            
            // 在庫ベースのレシピを取得
            const stockData = await fetchRecommendedRecipes();
            setStockRecipes(stockData);
            
            // 食費予算ベースのレシピを取得
            const budgetData = await fetchRecommendedRecipesByBudget();
            setBudgetRecipes(budgetData.recipes);
            setBudgetInfo({
                daily_food_budget: budgetData.daily_food_budget,
                message: budgetData.message
            });
        } catch (err: any) {
            console.error('Failed to load recipes:', err);
            setError('レシピの読み込みに失敗しました');
        } finally {
            setLoading(false);
            setBudgetLoading(false);
        }
    };

    const formatCookingTime = (minutes: number | null): string => {
        if (!minutes) return '時間未設定';
        if (minutes < 60) return `${minutes}分`;
        const hours = Math.floor(minutes / 60);
        const mins = minutes % 60;
        return mins > 0 ? `${hours}時間${mins}分` : `${hours}時間`;
    };

    const getDefaultImage = () => {
        return 'https://images.unsplash.com/photo-1547592166-23ac45744acd?auto=format&fit=crop&w=600&q=80';
    };

    const formatCurrency = (amount: number | null): string => {
        if (amount === null || amount === undefined) return '未設定';
        return `¥${amount.toLocaleString()}`;
    };

    const handleToggleFavorite = async (recipe: Recipe) => {
        setTogglingFavorite(recipe.id);
        try {
            const result = await toggleFavorite(recipe.id);
            
            // レシピリストを更新
            const updateRecipeFavorite = (recipes: Recipe[]) => {
                return recipes.map((r) => 
                    r.id === recipe.id ? { ...r, is_favorite: result.is_favorite } : r
                );
            };
            
            setStockRecipes(updateRecipeFavorite(stockRecipes));
            setBudgetRecipes(updateRecipeFavorite(budgetRecipes));
            
            setFlashMessage({
                message: result.message,
                type: 'success'
            });
        } catch (error: any) {
            console.error('Failed to toggle favorite:', error);
            setFlashMessage({
                message: 'お気に入りの更新に失敗しました',
                type: 'error'
            });
        } finally {
            setTogglingFavorite(null);
        }
    };

    const renderRecipeList = (recipes: Recipe[], emptyMessage: string) => {
        if (recipes.length === 0) {
            return (
                <View style={styles.emptyContainer}>
                    <Ionicons name="restaurant-outline" size={48} color="#9ca3af" />
                    <Text style={styles.emptyText}>{emptyMessage}</Text>
                </View>
            );
        }

        return (
            <View style={styles.recipeList}>
                {recipes.map((recipe) => (
                    <View key={recipe.id} style={styles.recipeCardContainer}>
                        <TouchableOpacity
                            style={styles.recipeCard}
                            onPress={() => onNavigateToRecipeDetail?.(recipe.id)}
                            activeOpacity={0.8}
                        >
                            {recipe.image_url ? (
                                <Image
                                    source={{ uri: recipe.image_url }}
                                    style={styles.recipeCardImage}
                                />
                            ) : (
                                <View style={styles.recipeCardImagePlaceholder}>
                                    <Ionicons name="restaurant" size={32} color="#9ca3af" />
                                </View>
                            )}
                            <TouchableOpacity
                                style={styles.favoriteButton}
                                onPress={() => handleToggleFavorite(recipe)}
                                activeOpacity={0.7}
                                disabled={togglingFavorite === recipe.id}
                            >
                                {togglingFavorite === recipe.id ? (
                                    <ActivityIndicator size="small" color="#6B8E6B" />
                                ) : (
                                    <Ionicons
                                        name={recipe.is_favorite ? "heart" : "heart-outline"}
                                        size={20}
                                        color={recipe.is_favorite ? "#ef4444" : "#9ca3af"}
                                    />
                                )}
                            </TouchableOpacity>
                            <Text style={styles.recipeCardTitle} numberOfLines={2}>
                                {recipe.name}
                            </Text>
                            <View style={styles.recipeCardMeta}>
                                {recipe.cooking_time && (
                                    <Text style={styles.recipeCardTime}>
                                        {formatCookingTime(recipe.cooking_time)}
                                    </Text>
                                )}
                                {recipe.matchRatio !== undefined && (
                                    <View style={styles.matchBadge}>
                                        <Text style={styles.matchBadgeText}>
                                            {Math.round(recipe.matchRatio * 100)}%
                                        </Text>
                                    </View>
                                )}
                            </View>
                        </TouchableOpacity>
                    </View>
                ))}
            </View>
        );
    };

    const featuredRecipe = budgetRecipes.length > 0 ? budgetRecipes[0] : (stockRecipes.length > 0 ? stockRecipes[0] : null);

    return (
        <View style={styles.container}>
            {/* タブ切り替えUI */}
            <View style={styles.tabContainer}>
                <TouchableOpacity
                    style={[styles.tab, activeTab === 'budget' && styles.tabActive]}
                    onPress={() => setActiveTab('budget')}
                    activeOpacity={0.7}
                >
                    <Ionicons 
                        name="wallet" 
                        size={18} 
                        color={activeTab === 'budget' ? '#ffffff' : '#6B8E6B'} 
                    />
                    <Text style={[styles.tabText, activeTab === 'budget' && styles.tabTextActive]}>
                        食費から
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.tab, activeTab === 'stock' && styles.tabActive]}
                    onPress={() => setActiveTab('stock')}
                    activeOpacity={0.7}
                >
                    <Ionicons 
                        name="basket" 
                        size={18} 
                        color={activeTab === 'stock' ? '#ffffff' : '#6B8E6B'} 
                    />
                    <Text style={[styles.tabText, activeTab === 'stock' && styles.tabTextActive]}>
                        在庫から
                    </Text>
                </TouchableOpacity>
            </View>

            <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
                {error ? (
                    <View style={styles.errorContainer}>
                        <Ionicons name="alert-circle-outline" size={48} color="#ef4444" />
                        <Text style={styles.errorText}>{error}</Text>
                        <TouchableOpacity style={styles.retryButton} onPress={loadRecipes}>
                            <Text style={styles.retryButtonText}>再試行</Text>
                        </TouchableOpacity>
                    </View>
                ) : (
                    <>
                        {activeTab === 'budget' ? (
                            <View style={styles.section}>
                                <View style={styles.sectionHeader}>
                                    <Ionicons name="wallet" size={20} color="#6B8E6B" />
                                    <Text style={styles.sectionTitle}>1日の食費からおすすめレシピ</Text>
                                </View>
                                {budgetInfo && budgetInfo.daily_food_budget !== null && (
                                    <View style={styles.budgetInfo}>
                                        <Text style={styles.budgetText}>
                                            目標食費: {formatCurrency(budgetInfo.daily_food_budget)}
                                        </Text>
                                    </View>
                                )}
                                {budgetLoading ? (
                                    <View style={styles.loadingContainer}>
                                        <ActivityIndicator size="large" color="#6B8E6B" />
                                        <Text style={styles.loadingText}>レシピを読み込み中...</Text>
                                    </View>
                                ) : (
                                    renderRecipeList(
                                        budgetRecipes,
                                        budgetInfo?.daily_food_budget 
                                            ? '食費予算に基づいたレシピがありません' 
                                            : '食費予算を設定すると、おすすめレシピが表示されます'
                                    )
                                )}
                            </View>
                        ) : (
                            <View style={styles.section}>
                                <View style={styles.sectionHeader}>
                                    <Ionicons name="basket" size={20} color="#6B8E6B" />
                                    <Text style={styles.sectionTitle}>在庫にある材料から作れるレシピ</Text>
                                </View>
                                {loading ? (
                                    <View style={styles.loadingContainer}>
                                        <ActivityIndicator size="large" color="#6B8E6B" />
                                        <Text style={styles.loadingText}>レシピを読み込み中...</Text>
                                    </View>
                                ) : (
                                    renderRecipeList(
                                        stockRecipes,
                                        '在庫にある食材で作れるレシピがありません。在庫を追加すると、おすすめレシピが表示されます。'
                                    )
                                )}
                            </View>
                        )}
                    </>
                )}
            </ScrollView>
            {/* フラッシュメッセージ */}
            {flashMessage && (
                <FlashMessage
                    message={flashMessage.message}
                    type={flashMessage.type}
                    visible={true}
                    onHide={() => setFlashMessage(null)}
                />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    tabContainer: {
        flexDirection: 'row',
        marginHorizontal: 24,
        marginTop: 16,
        marginBottom: 16,
        backgroundColor: '#f3f4f6',
        borderRadius: 16,
        padding: 4,
    },
    tab: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderRadius: 12,
        gap: 6,
    },
    tabActive: {
        backgroundColor: '#6B8E6B',
    },
    tabText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#6B8E6B',
    },
    tabTextActive: {
        color: '#ffffff',
    },
    content: {
        flex: 1,
        paddingBottom: 48,
    },
    recipeTitle: {
        fontSize: 24,
        fontFamily: 'serif',
        color: '#3A4D3A',
        marginBottom: 24,
        textAlign: 'center',
        paddingTop: 16,
    },
    loadingContainer: {
        padding: 48,
        alignItems: 'center',
        justifyContent: 'center',
    },
    loadingText: {
        marginTop: 16,
        fontSize: 14,
        color: '#6B8E6B',
    },
    errorContainer: {
        padding: 48,
        alignItems: 'center',
        justifyContent: 'center',
    },
    errorText: {
        marginTop: 16,
        fontSize: 14,
        color: '#ef4444',
        textAlign: 'center',
    },
    retryButton: {
        marginTop: 16,
        paddingHorizontal: 24,
        paddingVertical: 12,
        backgroundColor: '#6B8E6B',
        borderRadius: 20,
    },
    retryButtonText: {
        color: '#ffffff',
        fontSize: 14,
        fontWeight: 'bold',
    },
    emptyContainer: {
        padding: 48,
        marginTop: 82,
        alignItems: 'center',
        justifyContent: 'center',
    },
    emptyText: {
        marginTop: 16,
        fontSize: 16,
        color: '#3A4D3A',
        textAlign: 'center',
        fontWeight: 'bold',
    },
    emptySubText: {
        marginTop: 8,
        fontSize: 14,
        color: '#9ca3af',
        textAlign: 'center',
    },
    featuredRecipeCard: {
        marginHorizontal: 24,
        marginBottom: 24,
        borderRadius: 40,
        overflow: 'hidden',
        aspectRatio: 4 / 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 5,
        alignSelf: 'center',
    },
    featuredRecipeImage: {
        width: '100%',
        height: '100%',
    },
    featuredRecipeOverlay: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        padding: 24,
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
    },
    featuredRecipeBadge: {
        backgroundColor: '#6B8E6B',
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 12,
        alignSelf: 'flex-start',
        marginBottom: 8,
    },
    featuredRecipeBadgeText: {
        fontSize: 10,
        fontWeight: 'bold',
        color: '#ffffff',
    },
    featuredRecipeTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#ffffff',
        marginBottom: 4,
    },
    featuredRecipeDescription: {
        fontSize: 12,
        color: '#ffffff',
        opacity: 0.9,
        marginBottom: 8,
    },
    featuredRecipeMeta: {
        flexDirection: 'row',
        gap: 12,
    },
    featuredRecipeMetaItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    featuredRecipeMetaText: {
        fontSize: 12,
        color: '#ffffff',
        opacity: 0.8,
    },
    section: {
        marginHorizontal: 24,
        marginBottom: 32,
    },
    sectionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginTop: 36,
        marginBottom: 16,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#3A4D3A',
    },
    budgetInfo: {
        backgroundColor: '#f0f9f0',
        padding: 12,
        borderRadius: 12,
        marginBottom: 16,
    },
    budgetText: {
        fontSize: 14,
        color: '#6B8E6B',
        fontWeight: '600',
    },
    recipeList: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    recipeCardContainer: {
        width: '48%',
        marginBottom: 16,
        position: 'relative',
    },
    favoriteButton: {
        position: 'absolute',
        top: 8,
        right: 8,
        backgroundColor: '#ffffff',
        borderRadius: 16,
        padding: 6,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
        zIndex: 10,
    },
    recipeCard: {
        width: '100%',
        backgroundColor: '#ffffff',
        borderRadius: 32,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: '#f9fafb',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 1,
    },
    recipeCardImage: {
        width: '100%',
        height: 120,
        backgroundColor: '#f3f4f6',
    },
    recipeCardImagePlaceholder: {
        width: '100%',
        height: 120,
        backgroundColor: '#f3f4f6',
        alignItems: 'center',
        justifyContent: 'center',
    },
    recipeCardTitle: {
        fontSize: 12,
        fontWeight: 'bold',
        textAlign: 'center',
        marginTop: 12,
        marginBottom: 8,
        marginHorizontal: 12,
        color: '#1f2937',
    },
    recipeCardMeta: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 12,
        paddingBottom: 12,
    },
    recipeCardTime: {
        fontSize: 10,
        color: '#9ca3af',
    },
    matchBadge: {
        backgroundColor: '#6B8E6B',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
    },
    matchBadgeText: {
        fontSize: 10,
        fontWeight: 'bold',
        color: '#ffffff',
    },
});

