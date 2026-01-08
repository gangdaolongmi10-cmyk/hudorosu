import apiClient from '../config/api';

export interface RecipeFood {
    food_id: number;
    quantity: string | null;
    food?: {
        id: number;
        name: string;
        category_id: number;
        category?: {
            id: number;
            name: string;
        };
        allergen_id_allergens?: Array<{
            id: number;
            name: string;
        }>;
    };
}

export interface Recipe {
    id: number;
    name: string;
    description: string | null;
    image_url: string | null;
    cooking_time: number | null;
    servings: number | null;
    instructions: string | null;
    created_at: string;
    updated_at: string;
    food_id_foods?: RecipeFood[];
    matchRatio?: number;
    availableFoods?: number;
    totalFoods?: number;
}

/**
 * 在庫にある食材でおすすめレシピを取得する
 */
export const fetchRecommendedRecipes = async (): Promise<Recipe[]> => {
    const response = await apiClient.get<Recipe[]>('/recipes/recommended');
    return response.data;
};

/**
 * レシピ一覧を取得する
 */
export const fetchRecipes = async (): Promise<Recipe[]> => {
    const response = await apiClient.get<Recipe[]>('/recipes');
    return response.data;
};

/**
 * IDでレシピを取得する
 */
export const fetchRecipeById = async (id: number): Promise<Recipe> => {
    const response = await apiClient.get<Recipe>(`/recipes/${id}`);
    return response.data;
};

/**
 * レシピを削除する
 */
export const deleteRecipe = async (id: number): Promise<void> => {
    await apiClient.delete(`/recipes/${id}`);
};

