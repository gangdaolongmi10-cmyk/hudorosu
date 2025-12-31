import apiClient from '@/utils/axiosConfig';
import { Food, FoodResponse } from '@/types/food';

/**
 * マスタ食材一覧を取得する
 * @returns マスタ食材の配列（user_idがnullの食材のみ）
 */
export const fetchMasterFoods = async (): Promise<Food[]> => {
    const response = await apiClient.get<FoodResponse[]>('/admin/foods/list');
    
    // レスポンスデータをフロントエンド用の型に変換
    return response.data.map((food) => ({
        ...food,
        allergens: food.allergen_id_allergens || []
    }));
};

