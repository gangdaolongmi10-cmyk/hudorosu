import apiClient from '@/utils/axiosConfig';

export interface Allergen {
    id: number;
    name: string;
}

// レシピに含まれる食材の部分的な情報（APIレスポンス用）
export interface RecipeFoodItem {
    id: number;
    name: string;
    category_id: number;
    allergens?: Allergen[];
}

export interface RecipeFood {
    food_id: number;
    quantity?: string | null;
    food?: RecipeFoodItem;
}

export interface Recipe {
    id: number;
    name: string;
    description?: string | null;
    image_url?: string | null;
    cooking_time?: number | null;
    servings?: number | null;
    instructions?: string | null;
    food_id_foods?: RecipeFood[];
    allergens?: Allergen[];
    created_at: string;
    updated_at: string;
}

export interface RecipeResponse {
    id: number;
    name: string;
    description?: string | null;
    image_url?: string | null;
    cooking_time?: number | null;
    servings?: number | null;
    instructions?: string | null;
    food_id_foods?: Array<{
        id: number;
        name: string;
        category_id: number;
        quantity?: string | null;
        allergen_id_allergens?: Allergen[];
    }>;
    allergens?: Allergen[];
    created_at: string;
    updated_at: string;
}

/**
 * 料理一覧を取得する
 * @returns 料理の配列
 */
export const fetchRecipes = async (): Promise<Recipe[]> => {
    const response = await apiClient.get<RecipeResponse[]>('/admin/recipes/list');
    
    // レスポンスデータをフロントエンド用の型に変換
    return response.data.map((recipe) => ({
        ...recipe,
        food_id_foods: recipe.food_id_foods?.map((rf) => ({
            food_id: rf.id,
            quantity: rf.quantity || null,
            food: {
                id: rf.id,
                name: rf.name,
                category_id: rf.category_id,
                allergens: rf.allergen_id_allergens || []
            } as RecipeFoodItem
        })) || []
    }));
};

/**
 * IDで料理を取得する
 * @param id 料理ID
 * @returns 料理情報
 */
export const fetchRecipeById = async (id: number): Promise<Recipe> => {
    const response = await apiClient.get<RecipeResponse>(`/admin/recipes/${id}`);
    return {
        ...response.data,
        food_id_foods: response.data.food_id_foods?.map((rf) => ({
            food_id: rf.id,
            quantity: rf.quantity || null,
            food: {
                id: rf.id,
                name: rf.name,
                category_id: rf.category_id,
                allergens: rf.allergen_id_allergens || []
            } as RecipeFoodItem
        })) || []
    };
};

/**
 * 新規料理を作成する
 * @param data 料理作成データ
 * @returns 作成された料理情報
 */
export const createRecipe = async (data: {
    name: string;
    description?: string | null;
    image_url?: string | null;
    cooking_time?: number | null;
    servings?: number | null;
    instructions?: string | null;
    foods?: Array<{ food_id: number; quantity?: string | null }>;
}): Promise<Recipe> => {
    const response = await apiClient.post<RecipeResponse>('/admin/recipes/create', data);
    return {
        ...response.data,
        food_id_foods: response.data.food_id_foods?.map((rf) => ({
            food_id: rf.id,
            quantity: rf.quantity || null,
            food: {
                id: rf.id,
                name: rf.name,
                category_id: rf.category_id,
                allergens: rf.allergen_id_allergens || []
            } as RecipeFoodItem
        })) || []
    };
};

/**
 * 料理情報を更新する
 * @param id 料理ID
 * @param data 更新する料理情報
 * @returns 更新された料理情報
 */
export const updateRecipe = async (id: number, data: {
    name?: string;
    description?: string | null;
    image_url?: string | null;
    cooking_time?: number | null;
    servings?: number | null;
    instructions?: string | null;
    foods?: Array<{ food_id: number; quantity?: string | null }>;
}): Promise<Recipe> => {
    const response = await apiClient.put<RecipeResponse>(`/admin/recipes/${id}`, data);
    return {
        ...response.data,
        food_id_foods: response.data.food_id_foods?.map((rf) => ({
            food_id: rf.id,
            quantity: rf.quantity || null,
            food: {
                id: rf.id,
                name: rf.name,
                category_id: rf.category_id,
                allergens: rf.allergen_id_allergens || []
            } as RecipeFoodItem
        })) || []
    };
};

/**
 * 料理を削除する
 * @param id 料理ID
 */
export const deleteRecipe = async (id: number): Promise<void> => {
    await apiClient.delete(`/admin/recipes/${id}`);
};

/**
 * 料理のアレルギー情報を取得する
 * @param id 料理ID
 * @returns アレルギーの配列
 */
export const fetchRecipeAllergens = async (id: number): Promise<Allergen[]> => {
    const response = await apiClient.get<Allergen[]>(`/admin/recipes/${id}/allergens`);
    return response.data;
};

