import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    Image,
    ActivityIndicator,
    TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { fetchRecommendedRecipes, Recipe } from '../services/recipeService';

export default function RecipeScreen() {
    const [recipes, setRecipes] = useState<Recipe[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        loadRecipes();
    }, []);

    const loadRecipes = async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await fetchRecommendedRecipes();
            setRecipes(data);
        } catch (err: any) {
            console.error('Failed to load recipes:', err);
            setError('レシピの読み込みに失敗しました');
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

    const featuredRecipe = recipes.length > 0 ? recipes[0] : null;

    return (
        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
            <Text style={styles.recipeTitle}>今日のごちそう</Text>

            {loading ? (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#6B8E6B" />
                    <Text style={styles.loadingText}>レシピを読み込み中...</Text>
                </View>
            ) : error ? (
                <View style={styles.errorContainer}>
                    <Ionicons name="alert-circle-outline" size={48} color="#ef4444" />
                    <Text style={styles.errorText}>{error}</Text>
                    <TouchableOpacity style={styles.retryButton} onPress={loadRecipes}>
                        <Text style={styles.retryButtonText}>再試行</Text>
                    </TouchableOpacity>
                </View>
            ) : recipes.length === 0 ? (
                <View style={styles.emptyContainer}>
                    <Ionicons name="restaurant-outline" size={48} color="#9ca3af" />
                    <Text style={styles.emptyText}>在庫にある食材で作れるレシピがありません</Text>
                    <Text style={styles.emptySubText}>在庫を追加すると、おすすめレシピが表示されます</Text>
                </View>
            ) : (
                <>
                    {featuredRecipe && (
                        <View style={styles.featuredRecipeCard}>
                            <Image
                                source={{
                                    uri: featuredRecipe.image_url || getDefaultImage(),
                                }}
                                style={styles.featuredRecipeImage}
                            />
                            <View style={styles.featuredRecipeOverlay}>
                                <View style={styles.featuredRecipeBadge}>
                                    <Text style={styles.featuredRecipeBadgeText}>おすすめ</Text>
                                </View>
                                <Text style={styles.featuredRecipeTitle} numberOfLines={2}>
                                    {featuredRecipe.name}
                                </Text>
                                {featuredRecipe.description && (
                                    <Text style={styles.featuredRecipeDescription} numberOfLines={1}>
                                        {featuredRecipe.description}
                                    </Text>
                                )}
                                <View style={styles.featuredRecipeMeta}>
                                    {featuredRecipe.cooking_time && (
                                        <View style={styles.featuredRecipeMetaItem}>
                                            <Ionicons name="time-outline" size={12} color="#ffffff" />
                                            <Text style={styles.featuredRecipeMetaText}>
                                                {formatCookingTime(featuredRecipe.cooking_time)}
                                            </Text>
                                        </View>
                                    )}
                                    {featuredRecipe.matchRatio !== undefined && (
                                        <View style={styles.featuredRecipeMetaItem}>
                                            <Ionicons name="checkmark-circle-outline" size={12} color="#ffffff" />
                                            <Text style={styles.featuredRecipeMetaText}>
                                                {Math.round(featuredRecipe.matchRatio * 100)} 在庫食材
                                            </Text>
                                        </View>
                                    )}
                                </View>
                            </View>
                        </View>
                    )}

                    <View style={styles.aiRecipeSection}>
                        <View style={styles.aiRecipeSectionHeader}>
                            <Ionicons name="star" size={18} color="#6B8E6B" />
                            <Text style={styles.aiRecipeSectionTitle}>在庫にあるもので作れるレシピ</Text>
                        </View>
                        <View style={styles.recipeList}>
                            {recipes.map((recipe) => (
                                <TouchableOpacity key={recipe.id} style={styles.recipeCard}>
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
                                                    {Math.round(recipe.matchRatio * 100)}
                                                </Text>
                                            </View>
                                        )}
                                    </View>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>
                </>
            )}
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    content: {
        flex: 1,
        paddingBottom: 96,
    },
    recipeTitle: {
        fontSize: 24,
        fontFamily: 'serif',
        color: '#3A4D3A',
        marginBottom: 24,
        textAlign: 'center',
        paddingTop: 24,
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
        marginTop: 24,
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
    aiRecipeSection: {
        marginHorizontal: 24,
        marginBottom: 24,
    },
    aiRecipeSectionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginTop: 24,
        marginBottom: 16,
    },
    aiRecipeSectionTitle: {
        fontSize: 18,
        fontFamily: 'serif',
        color: '#3A4D3A',
    },
    recipeList: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    recipeCard: {
        width: '48%',
        backgroundColor: '#ffffff',
        borderRadius: 32,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: '#f9fafb',
        marginBottom: 16,
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

