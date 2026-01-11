import React, { useEffect, useState, useCallback } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    Image,
    ActivityIndicator,
    TouchableOpacity,
    RefreshControl,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { fetchFavorites } from '../services/favoriteService';
import { Recipe } from '../services/recipeService';
import { toggleFavorite } from '../services/favoriteService';
import ScreenHeader from '../components/ScreenHeader';
import FlashMessage from '../components/FlashMessage';

interface FavoriteRecipesScreenProps {
    onBack: () => void;
    onNavigateToRecipeDetail?: (recipeId: number) => void;
}

export default function FavoriteRecipesScreen({ onBack, onNavigateToRecipeDetail }: FavoriteRecipesScreenProps) {
    const [favorites, setFavorites] = useState<Recipe[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [flashMessage, setFlashMessage] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);
    const [togglingFavorite, setTogglingFavorite] = useState<number | null>(null);

    const loadFavorites = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await fetchFavorites();
            setFavorites(data);
        } catch (err: any) {
            console.error('Failed to load favorites:', err);
            setError('お気に入りレシピの読み込みに失敗しました');
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    }, []);

    useEffect(() => {
        loadFavorites();
    }, [loadFavorites]);

    const onRefresh = useCallback(() => {
        setRefreshing(true);
        loadFavorites();
    }, [loadFavorites]);

    const handleToggleFavorite = async (recipe: Recipe) => {
        setTogglingFavorite(recipe.id);
        try {
            const result = await toggleFavorite(recipe.id);
            
            // お気に入りリストから削除（お気に入りが解除された場合）
            if (!result.is_favorite) {
                setFavorites(favorites.filter((r) => r.id !== recipe.id));
            } else {
                // お気に入りに追加された場合（通常は発生しないが念のため）
                setFavorites(favorites.map((r) => 
                    r.id === recipe.id ? { ...r, is_favorite: result.is_favorite } : r
                ));
            }
            
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

    const formatCookingTime = (minutes: number | null): string => {
        if (!minutes) return '';
        if (minutes < 60) {
            return `${minutes}分`;
        }
        const hours = Math.floor(minutes / 60);
        const mins = minutes % 60;
        return mins > 0 ? `${hours}時間${mins}分` : `${hours}時間`;
    };

    const renderRecipeCard = (recipe: Recipe) => (
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
                            name="heart"
                            size={20}
                            color="#ef4444"
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
                    {recipe.total_price !== null && recipe.total_price !== undefined && (
                        <Text style={styles.recipeCardPrice}>
                            ¥{Math.round(recipe.total_price).toLocaleString()}
                        </Text>
                    )}
                </View>
            </TouchableOpacity>
        </View>
    );

    return (
        <View style={styles.container}>
            <ScreenHeader title="お気に入りレシピ" onBack={onBack} />
            <ScrollView
                style={styles.content}
                showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                }
            >
                {loading ? (
                    <View style={styles.loadingContainer}>
                        <ActivityIndicator size="large" color="#6B8E6B" />
                        <Text style={styles.loadingText}>お気に入りレシピを読み込み中...</Text>
                    </View>
                ) : error ? (
                    <View style={styles.errorContainer}>
                        <Ionicons name="alert-circle-outline" size={48} color="#ef4444" />
                        <Text style={styles.errorText}>{error}</Text>
                        <TouchableOpacity style={styles.retryButton} onPress={loadFavorites}>
                            <Text style={styles.retryButtonText}>再試行</Text>
                        </TouchableOpacity>
                    </View>
                ) : favorites.length === 0 ? (
                    <View style={styles.emptyContainer}>
                        <Ionicons name="heart-outline" size={48} color="#9ca3af" />
                        <Text style={styles.emptyText}>お気に入りレシピがありません</Text>
                        <Text style={styles.emptySubText}>
                            レシピ一覧からお気に入りに追加すると、ここに表示されます
                        </Text>
                    </View>
                ) : (
                    <View style={styles.recipeList}>
                        {favorites.map(renderRecipeCard)}
                    </View>
                )}
            </ScrollView>
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
        backgroundColor: '#EAECE9',
    },
    content: {
        flex: 1,
        paddingHorizontal: 24,
        paddingVertical: 16,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 48,
    },
    loadingText: {
        marginTop: 16,
        fontSize: 14,
        color: '#6B8E6B',
    },
    errorContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 48,
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
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 48,
        marginTop: 82,
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
        paddingHorizontal: 32,
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
        height: 140,
        resizeMode: 'cover',
    },
    recipeCardImagePlaceholder: {
        width: '100%',
        height: 140,
        backgroundColor: '#f3f4f6',
        justifyContent: 'center',
        alignItems: 'center',
    },
    recipeCardTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#1f2937',
        paddingHorizontal: 16,
        paddingTop: 12,
        marginBottom: 8,
    },
    recipeCardMeta: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingBottom: 16,
    },
    recipeCardTime: {
        fontSize: 12,
        color: '#6b7280',
    },
    recipeCardPrice: {
        fontSize: 12,
        color: '#6B8E6B',
        fontWeight: 'bold',
    },
});
