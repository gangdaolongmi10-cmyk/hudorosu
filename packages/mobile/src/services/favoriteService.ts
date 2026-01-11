import apiClient from '../config/api';

/**
 * お気に入りレシピ一覧を取得する
 */
export const fetchFavorites = async () => {
    const response = await apiClient.get('/favorites');
    return response.data;
};

/**
 * お気に入りに追加する
 */
export const addFavorite = async (recipeId: number): Promise<void> => {
    await apiClient.post('/favorites', { recipe_id: recipeId });
};

/**
 * お気に入りから削除する
 */
export const removeFavorite = async (recipeId: number): Promise<void> => {
    await apiClient.delete(`/favorites/${recipeId}`);
};

/**
 * お気に入りのトグル（追加/削除を切り替え）
 */
export const toggleFavorite = async (recipeId: number): Promise<{ is_favorite: boolean; message: string }> => {
    const response = await apiClient.post('/favorites/toggle', { recipe_id: recipeId });
    return response.data;
};

/**
 * 複数のレシピIDについて、お気に入り状態を取得
 */
export const getFavoriteStatus = async (recipeIds: number[]): Promise<number[]> => {
    if (recipeIds.length === 0) return [];
    
    const response = await apiClient.get('/favorites/status', {
        params: { recipe_ids: recipeIds.join(',') }
    });
    return response.data.favorite_recipe_ids || [];
};
