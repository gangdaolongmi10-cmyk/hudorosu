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

/**
 * IDで食材を取得する
 * @param id 食材ID
 * @returns 食材情報
 */
export const fetchFoodById = async (id: number): Promise<Food> => {
    const response = await apiClient.get<FoodResponse>(`/admin/foods/${id}`);
    return {
        ...response.data,
        allergens: response.data.allergen_id_allergens || []
    };
};

/**
 * 新規食材を作成する
 * @param data 食材作成データ
 * @returns 作成された食材情報
 */
export const createFood = async (data: {
    name: string;
    category_id: number;
    best_before_date?: string | null;
    expiry_date?: string | null;
    memo?: string | null;
    allergen_ids?: number[];
    calories?: number | null;
    protein?: number | null;
    fat?: number | null;
    carbohydrate?: number | null;
    fiber?: number | null;
    sodium?: number | null;
    serving_size?: number | null;
}): Promise<Food> => {
    const response = await apiClient.post<FoodResponse>('/admin/foods/create', data);
    return {
        ...response.data,
        allergens: response.data.allergen_id_allergens || []
    };
};

/**
 * 食材情報を更新する
 * @param id 食材ID
 * @param data 更新する食材情報
 * @returns 更新された食材情報
 */
export const updateFood = async (id: number, data: {
    name?: string;
    category_id?: number;
    best_before_date?: string | null;
    expiry_date?: string | null;
    memo?: string | null;
    allergen_ids?: number[];
    calories?: number | null;
    protein?: number | null;
    fat?: number | null;
    carbohydrate?: number | null;
    fiber?: number | null;
    sodium?: number | null;
    serving_size?: number | null;
}): Promise<Food> => {
    const response = await apiClient.put<FoodResponse>(`/admin/foods/${id}`, data);
    return {
        ...response.data,
        allergens: response.data.allergen_id_allergens || []
    };
};

/**
 * 食材を削除する
 * @param id 食材ID
 */
export const deleteFood = async (id: number): Promise<void> => {
    await apiClient.delete(`/admin/foods/${id}`);
};

/**
 * カテゴリーIDで食材をページネーションで取得する
 * @param categoryId カテゴリーID
 * @param limit 取得件数の上限
 * @param offset オフセット
 * @returns 食材の配列と総数
 */
export const fetchFoodsByCategory = async (
    categoryId: number,
    limit: number = 20,
    offset: number = 0
): Promise<{
    foods: Food[];
    total: number;
    limit: number;
    offset: number;
}> => {
    const response = await apiClient.get<{
        foods: FoodResponse[];
        total: number;
        limit: number;
        offset: number;
    }>(`/admin/foods/category/${categoryId}`, {
        params: { limit, offset }
    });
    
    return {
        foods: response.data.foods.map((food) => ({
            ...food,
            allergens: food.allergen_id_allergens || []
        })),
        total: response.data.total,
        limit: response.data.limit,
        offset: response.data.offset
    };
};

