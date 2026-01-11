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
    Linking,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { fetchRecipeById, Recipe } from '../services/recipeService';
import { createShoppingListFromRecipe } from '../services/shoppingListService';
import { toggleFavorite } from '../services/favoriteService';
import ScreenHeader from '../components/ScreenHeader';

interface RecipeDetailScreenProps {
    recipeId: number;
    onBack: () => void;
}

export default function RecipeDetailScreen({ recipeId, onBack }: RecipeDetailScreenProps) {
    const [recipe, setRecipe] = useState<Recipe | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [addingToShoppingList, setAddingToShoppingList] = useState(false);

    useEffect(() => {
        loadRecipe();
    }, [recipeId]);

    const loadRecipe = async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await fetchRecipeById(recipeId);
            setRecipe(data);
        } catch (err: any) {
            console.error('Failed to load recipe:', err);
            setError('レシピの読み込みに失敗しました');
            Alert.alert('エラー', 'レシピの読み込みに失敗しました');
        } finally {
            setLoading(false);
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

    // アレルギー情報を取得（材料から）
    const getAllergens = (): Array<{ id: number; name: string }> => {
        if (!recipe?.food_id_foods) return [];
        
        const allergenMap = new Map<number, { id: number; name: string }>();
        
        recipe.food_id_foods.forEach((recipeFood: any) => {
            // APIレスポンスの構造に応じて、foodオブジェクトまたは直接プロパティを確認
            const food = recipeFood.food || recipeFood;
            if (food?.allergen_id_allergens) {
                food.allergen_id_allergens.forEach((allergen: any) => {
                    if (!allergenMap.has(allergen.id)) {
                        allergenMap.set(allergen.id, {
                            id: allergen.id,
                            name: allergen.name,
                        });
                    }
                });
            }
        });
        
        return Array.from(allergenMap.values());
    };

    // レシピ料金を表示
    const formatPrice = (): string => {
        if (recipe.total_price !== null && recipe.total_price !== undefined) {
            return `¥${Math.round(recipe.total_price).toLocaleString()}`;
        }
        return '料金情報は未設定です';
    };

    // 買い物リストに追加
    const handleAddToShoppingList = async () => {
        if (!recipe) return;

        setAddingToShoppingList(true);
        try {
            const result = await createShoppingListFromRecipe(recipe.id);
            Alert.alert('成功', result.message);
        } catch (error: any) {
            console.error('Failed to add to shopping list:', error);
            Alert.alert('エラー', '買い物リストへの追加に失敗しました');
        } finally {
            setAddingToShoppingList(false);
        }
    };

    // お気に入りのトグル
    const handleToggleFavorite = async () => {
        if (!recipe) return;

        setTogglingFavorite(true);
        try {
            const result = await toggleFavorite(recipe.id);
            setRecipe({ ...recipe, is_favorite: result.is_favorite });
            Alert.alert('成功', result.message);
        } catch (error: any) {
            console.error('Failed to toggle favorite:', error);
            Alert.alert('エラー', 'お気に入りの更新に失敗しました');
        } finally {
            setTogglingFavorite(false);
        }
    };

    // Xで共有
    const shareOnX = () => {
        if (!recipe) return;

        // レシピ情報をテキストに整形
        let shareText = `🍳 ${recipe.name}\n\n`;
        
        if (recipe.description) {
            shareText += `${recipe.description}\n\n`;
        }

        if (recipe.cooking_time) {
            shareText += `⏱ ${formatCookingTime(recipe.cooking_time)}\n`;
        }

        if (recipe.servings) {
            shareText += `👥 ${recipe.servings}人分\n`;
        }

        if (recipe.food_id_foods && recipe.food_id_foods.length > 0) {
            shareText += `\n📝 材料:\n`;
            recipe.food_id_foods.slice(0, 5).forEach((recipeFood: any) => {
                const food = recipeFood.food || recipeFood;
                const quantity = recipeFood.quantity || recipeFood.recipe_foods?.quantity;
                const foodName = food?.name || recipeFood.name || '不明な食材';
                shareText += `・${foodName}`;
                if (quantity) {
                    shareText += ` ${quantity}`;
                }
                shareText += `\n`;
            });
            if (recipe.food_id_foods.length > 5) {
                shareText += `他${recipe.food_id_foods.length - 5}種類...\n`;
            }
        }

        shareText += `\n#レシピ #料理`;

        // X共有URLを作成
        const xUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}`;
        
        Linking.openURL(xUrl).catch((err) => {
            console.error('Failed to open X:', err);
            Alert.alert('エラー', 'Xを開けませんでした');
        });
    };

    if (loading) {
        return (
            <View style={styles.container}>
                <ScreenHeader
                    title="レシピ詳細"
                    onBack={onBack}
                />
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#6B8E6B" />
                    <Text style={styles.loadingText}>レシピを読み込み中...</Text>
                </View>
            </View>
        );
    }

    if (error || !recipe) {
        return (
            <View style={styles.container}>
                <ScreenHeader
                    title="レシピ詳細"
                    onBack={onBack}
                />
                <View style={styles.errorContainer}>
                    <Ionicons name="alert-circle-outline" size={48} color="#ef4444" />
                    <Text style={styles.errorText}>{error || 'レシピが見つかりません'}</Text>
                    <TouchableOpacity style={styles.retryButton} onPress={loadRecipe}>
                        <Text style={styles.retryButtonText}>再試行</Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }

    const allergens = getAllergens();

    return (
        <View style={styles.container}>
            <ScreenHeader
                title="レシピ詳細"
                onBack={onBack}
                rightComponent={
                    <View style={styles.headerButtons}>
                        <TouchableOpacity
                            onPress={handleToggleFavorite}
                            style={styles.favoriteButton}
                            activeOpacity={0.7}
                            disabled={togglingFavorite}
                        >
                            {togglingFavorite ? (
                                <ActivityIndicator size="small" color="#ef4444" />
                            ) : (
                                <Ionicons
                                    name={recipe.is_favorite ? "heart" : "heart-outline"}
                                    size={24}
                                    color={recipe.is_favorite ? "#ef4444" : "#9ca3af"}
                                />
                            )}
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={handleAddToShoppingList}
                            style={styles.shoppingListButton}
                            activeOpacity={0.7}
                            disabled={addingToShoppingList}
                        >
                            {addingToShoppingList ? (
                                <ActivityIndicator size="small" color="#6B8E6B" />
                            ) : (
                                <Ionicons name="cart-outline" size={24} color="#6B8E6B" />
                            )}
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={shareOnX}
                            style={styles.shareButton}
                            activeOpacity={0.7}
                        >
                            <Text style={styles.xIcon}>X</Text>
                        </TouchableOpacity>
                    </View>
                }
            />
            <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
                {/* 画像 */}
                <View style={styles.imageContainer}>
                    {recipe.image_url ? (
                        <Image
                            source={{ uri: recipe.image_url }}
                            style={styles.recipeImage}
                        />
                    ) : (
                        <View style={styles.imagePlaceholder}>
                            <Ionicons name="restaurant" size={64} color="#9ca3af" />
                        </View>
                    )}
                </View>

                {/* レシピ名 */}
                <View style={styles.section}>
                    <Text style={styles.recipeName}>{recipe.name}</Text>
                    {recipe.description && (
                        <Text style={styles.description}>{recipe.description}</Text>
                    )}
                </View>

                {/* 基本情報 */}
                <View style={styles.infoSection}>
                    {/* 料金 */}
                    <View style={styles.infoItem}>
                        <Ionicons name="cash-outline" size={20} color="#6B8E6B" />
                        <Text style={styles.infoLabel}>料金:</Text>
                        <Text style={styles.infoValue}>{formatPrice()}</Text>
                    </View>

                    {/* 時間 */}
                    {recipe.cooking_time && (
                        <View style={styles.infoItem}>
                            <Ionicons name="time-outline" size={20} color="#6B8E6B" />
                            <Text style={styles.infoLabel}>時間:</Text>
                            <Text style={styles.infoValue}>{formatCookingTime(recipe.cooking_time)}</Text>
                        </View>
                    )}

                    {/* 人数 */}
                    {recipe.servings && (
                        <View style={styles.infoItem}>
                            <Ionicons name="people-outline" size={20} color="#6B8E6B" />
                            <Text style={styles.infoLabel}>人数:</Text>
                            <Text style={styles.infoValue}>{recipe.servings}人分</Text>
                        </View>
                    )}
                </View>

                {/* アレルギー情報 */}
                {allergens.length > 0 && (
                    <View style={styles.section}>
                        <View style={styles.sectionHeader}>
                            <Ionicons name="warning-outline" size={20} color="#ef4444" />
                            <Text style={styles.sectionTitle}>アレルギー情報</Text>
                        </View>
                        <View style={styles.allergenList}>
                            {allergens.map((allergen) => (
                                <View key={allergen.id} style={styles.allergenTag}>
                                    <Text style={styles.allergenText}>{allergen.name}</Text>
                                </View>
                            ))}
                        </View>
                    </View>
                )}

                {/* 材料 */}
                {recipe.food_id_foods && recipe.food_id_foods.length > 0 && (
                    <View style={styles.section}>
                        <View style={styles.sectionHeader}>
                            <Ionicons name="list-outline" size={20} color="#6B8E6B" />
                            <Text style={styles.sectionTitle}>材料</Text>
                        </View>
                        <View style={styles.ingredientList}>
                            {recipe.food_id_foods.map((recipeFood: any, index: number) => {
                                // APIレスポンスの構造に応じて、foodオブジェクトまたは直接プロパティを確認
                                const food = recipeFood.food || recipeFood;
                                const quantity = recipeFood.quantity || recipeFood.recipe_foods?.quantity;
                                return (
                                    <View key={index} style={styles.ingredientItem}>
                                        <Text style={styles.ingredientName}>
                                            {food?.name || recipeFood.name || '不明な食材'}
                                        </Text>
                                        {quantity && (
                                            <Text style={styles.ingredientQuantity}>{quantity}</Text>
                                        )}
                                    </View>
                                );
                            })}
                        </View>
                    </View>
                )}

                {/* レシピ手順 */}
                {recipe.instructions && (
                    <View style={styles.section}>
                        <View style={styles.sectionHeader}>
                            <Ionicons name="book-outline" size={20} color="#6B8E6B" />
                            <Text style={styles.sectionTitle}>作り方</Text>
                        </View>
                        <Text style={styles.instructions}>{recipe.instructions}</Text>
                    </View>
                )}
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#ffffff',
    },
    content: {
        flex: 1,
    },
    loadingContainer: {
        flex: 1,
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
        flex: 1,
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
    imageContainer: {
        width: '100%',
        height: 250,
        backgroundColor: '#f3f4f6',
    },
    recipeImage: {
        width: '100%',
        height: '100%',
    },
    imagePlaceholder: {
        width: '100%',
        height: '100%',
        backgroundColor: '#f3f4f6',
        alignItems: 'center',
        justifyContent: 'center',
    },
    section: {
        paddingHorizontal: 24,
        paddingVertical: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#f3f4f6',
    },
    recipeName: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#1f2937',
        marginBottom: 8,
    },
    description: {
        fontSize: 14,
        color: '#6b7280',
        lineHeight: 20,
    },
    infoSection: {
        paddingHorizontal: 24,
        paddingVertical: 16,
        backgroundColor: '#f9fafb',
    },
    infoItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    infoLabel: {
        fontSize: 14,
        color: '#6b7280',
        marginLeft: 8,
        marginRight: 8,
    },
    infoValue: {
        fontSize: 14,
        color: '#1f2937',
        fontWeight: '500',
    },
    sectionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#1f2937',
        marginLeft: 8,
    },
    allergenList: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
    },
    allergenTag: {
        backgroundColor: '#fef2f2',
        borderWidth: 1,
        borderColor: '#fecaca',
        borderRadius: 16,
        paddingHorizontal: 12,
        paddingVertical: 6,
    },
    allergenText: {
        fontSize: 12,
        color: '#dc2626',
        fontWeight: '500',
    },
    ingredientList: {
        gap: 12,
    },
    ingredientItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 8,
        borderBottomWidth: 1,
        borderBottomColor: '#f3f4f6',
    },
    ingredientName: {
        fontSize: 14,
        color: '#1f2937',
        flex: 1,
    },
    ingredientQuantity: {
        fontSize: 14,
        color: '#6b7280',
        marginLeft: 16,
    },
    instructions: {
        fontSize: 14,
        color: '#374151',
        lineHeight: 24,
    },
    headerButtons: {
        flexDirection: 'row',
        gap: 8,
    },
    favoriteButton: {
        padding: 8,
        borderRadius: 20,
        backgroundColor: '#fef2f2',
        alignItems: 'center',
        justifyContent: 'center',
    },
    shoppingListButton: {
        padding: 8,
        borderRadius: 20,
        backgroundColor: '#f0fdf4',
        alignItems: 'center',
        justifyContent: 'center',
    },
    shareButton: {
        padding: 8,
        borderRadius: 20,
        backgroundColor: '#f9fafb',
        alignItems: 'center',
        justifyContent: 'center',
    },
    xIcon: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#000000',
    },
});

